import os
import uvicorn
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from model_loader import ModelManager

# Define model path - dynamically resolve relative to this file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DEFAULT_MODEL_PATH = os.path.normpath(os.path.join(BASE_DIR, "..", "Brain Tumor  Web", "model", "best_efficientnet_model.h5"))
MODEL_PATH = os.getenv("MODEL_PATH", DEFAULT_MODEL_PATH)

app = FastAPI(
    title="NeuroVision AI - Brain Tumor Inference Service",
    description="FastAPI service for MRI classification using EfficientNetB0 and Grad-CAM explainability",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow communication from Next.js server/client
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ModelManager
try:
    model_manager = ModelManager(MODEL_PATH)
except Exception as e:
    print(f"CRITICAL ERROR loading model: {e}")
    model_manager = None

@app.get("/health")
def health_check():
    if model_manager and model_manager.model:
        return {"status": "healthy", "model": "loaded", "path": MODEL_PATH}
    else:
        return {"status": "unhealthy", "model": "not loaded", "error": "Model initialization failed"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not model_manager or not model_manager.model:
        raise HTTPException(
            status_code=503,
            detail="Model is not loaded or initialization failed. Check server logs."
        )

    # Validate file extension
    filename = file.filename.lower()
    if not (filename.endswith('.png') or filename.endswith('.jpg') or filename.endswith('.jpeg')):
        raise HTTPException(
            status_code=400,
            detail="Invalid image format. Supported formats: PNG, JPG, JPEG."
        )

    try:
        # Read file bytes
        contents = await file.read()
        
        # Run inference
        result = model_manager.process_inference(contents)
        return result
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Inference processing failed: {str(e)}"
        )

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=False)
