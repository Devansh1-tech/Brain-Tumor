import os
import io
import base64
import numpy as np
import tensorflow as tf
import cv2
from PIL import Image
import matplotlib
matplotlib.use('Agg') # Use non-interactive backend for matplotlib
import matplotlib.pyplot as plt
from tensorflow.keras.applications.efficientnet import preprocess_input

# Classification classes in the exact order trained in the notebook
CLASS_NAMES = ['glioma', 'meningioma', 'notumor', 'pituitary']
IMG_SIZE = (224, 224)
LAST_CONV_LAYER = "top_activation"

class ModelManager:
    def __init__(self, model_path: str):
        self.model_path = model_path
        self.model = None
        self.base_model = None
        self.load_model()

    def load_model(self):
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(f"Model file not found at: {self.model_path}")
        print(f"Loading Keras model from {self.model_path}...")
        self.model = tf.keras.models.load_model(self.model_path)
        # Extract the base EfficientNetB0 layer for Grad-CAM
        try:
            self.base_model = self.model.get_layer('efficientnetb0')
            print("Extracted base 'efficientnetb0' layer successfully.")
        except Exception as e:
            print(f"Error extracting 'efficientnetb0' layer: {e}. Grad-CAM might fail.")
            self.base_model = None

    def make_gradcam_heatmap(self, img_array, pred_index=None):
        if self.base_model is None:
            return None
            
        # 1. Create a model mapping input to base_model's last conv layer output AND the base model output
        # to run Grad-CAM entirely within the base model's connected graph.
        grad_model = tf.keras.models.Model(
            inputs=[self.base_model.inputs],
            outputs=[self.base_model.get_layer(LAST_CONV_LAYER).output, self.base_model.output]
        )

        with tf.GradientTape() as tape:
            last_conv_layer_output, preds = grad_model(img_array)
            if isinstance(preds, (list, tuple)):
                preds = preds[0]

            if pred_index is None:
                pred_index = tf.argmax(preds[0])

            class_channel = tf.gather(preds[0], pred_index)

        # 3. Calculate gradients of the predicted class relative to last conv layer output
        grads = tape.gradient(class_channel, last_conv_layer_output)

        # 4. Pool gradients
        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

        # 5. Weight features
        last_conv_layer_output = last_conv_layer_output[0]
        heatmap = last_conv_layer_output @ pooled_grads[..., tf.newaxis]
        heatmap = tf.squeeze(heatmap)

        # 6. Apply ReLU and normalize
        heatmap = tf.maximum(heatmap, 0) / (tf.math.reduce_max(heatmap) + 1e-10)
        return heatmap.numpy()

    def process_inference(self, image_bytes: bytes):
        # 1. Load image with PIL
        img_pil = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        
        # Keep original image size for overlaying later
        orig_width, orig_height = img_pil.size
        
        # 2. Resize and convert to numpy array (RGB) for prediction
        img_resized = img_pil.resize(IMG_SIZE)
        img_array_orig = np.array(img_resized) # shape (224, 224, 3), range [0, 255]
        
        # 3. Preprocess for EfficientNet (must match ImageDataGenerator's preprocessing_function)
        img_preprocessed = preprocess_input(img_array_orig.astype(np.float32))
        img_batch = np.expand_dims(img_preprocessed, axis=0) # shape (1, 224, 224, 3)

        # 4. Run model prediction
        preds = self.model.predict(img_batch) # shape (1, 4)
        probabilities = preds[0]
        pred_idx = int(np.argmax(probabilities))
        prediction = CLASS_NAMES[pred_idx]
        confidence = float(probabilities[pred_idx])

        # Formulate probabilities dictionary
        prob_dict = {CLASS_NAMES[i]: float(probabilities[i]) for i in range(len(CLASS_NAMES))}

        # 5. Generate Grad-CAM heatmap
        heatmap = self.make_gradcam_heatmap(img_batch, pred_idx)
        
        # 6. Superimpose Grad-CAM heatmap onto the original resized image
        if heatmap is not None:
            # Rescale heatmap to 0-255
            heatmap_resized = np.uint8(255 * heatmap)
            
            # Map to jet color palette
            cmap = plt.get_cmap("jet")
            colors = cmap(np.arange(256))[:, :3] # shape (256, 3)
            colored_heatmap = colors[heatmap_resized] # shape (224, 224, 3)
            
            # Resize colored heatmap to match original uploaded image dimensions
            colored_heatmap = cv2.resize(colored_heatmap, (orig_width, orig_height))
            colored_heatmap = np.uint8(colored_heatmap * 255)
            
            # Load original image as numpy array (RGB)
            original_full = np.array(img_pil)
            
            # Overlay heatmap with alpha = 0.4
            alpha = 0.4
            overlayed = colored_heatmap * alpha + original_full
            overlayed = np.clip(overlayed, 0, 255).astype(np.uint8)
            
            # Convert overlayed RGB to BGR for OpenCV encoding
            overlayed_bgr = cv2.cvtColor(overlayed, cv2.COLOR_RGB2BGR)
            
            # Encode as JPEG
            _, buffer = cv2.imencode('.jpg', overlayed_bgr)
            gradcam_base64 = base64.b64encode(buffer).decode('utf-8')
        else:
            gradcam_base64 = ""

        return {
            "prediction": prediction,
            "confidence": confidence,
            "probabilities": prob_dict,
            "gradcam_base64": gradcam_base64
        }
