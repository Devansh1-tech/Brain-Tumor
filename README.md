# 🧠 NeuroVision AI: Brain Tumor Detection & Explainability System

## Overview

NeuroVision AI is an AI-powered Brain Tumor Detection system that classifies MRI brain scans into multiple tumor categories using a deep learning model based on EfficientNetB0. The project also incorporates Explainable AI (XAI) techniques through Grad-CAM visualization to help understand the model's decision-making process.

The system provides an intuitive web interface where users can upload MRI scans, receive predictions, view confidence scores, and analyze class probabilities.

---

## Features

* MRI Brain Tumor Classification
* Multi-class Prediction
* EfficientNetB0 Transfer Learning Model
* Confidence Score Generation
* Class Probability Distribution
* Grad-CAM Explainability Visualization
* Modern Dashboard Interface
* User Authentication System
* Prediction History Tracking
* Responsive UI Design

---

## Tumor Classes

The model predicts the following classes:

* Glioma Tumor
* Meningioma Tumor
* Pituitary Tumor
* No Tumor

---

## Model Architecture

### Backbone Network

* EfficientNetB0
* Transfer Learning Approach
* Fine-Tuned Classification Head

### Explainability

* Grad-CAM (Gradient-weighted Class Activation Mapping)
* Visual Localization of Important MRI Regions

### Image Processing

Input MRI images are:

* Resized to 224 × 224
* Converted to RGB format
* Preprocessed using EfficientNet preprocessing pipeline

---

## Technology Stack

### Frontend

* Next.js
* React.js
* TypeScript
* Tailwind CSS
* Framer Motion

### Backend

* Node.js
* FastAPI
* Prisma ORM

### AI & Machine Learning

* TensorFlow
* Keras
* EfficientNetB0
* NumPy
* OpenCV
* Matplotlib
* Pillow

### Database

* PostgreSQL

---

## Project Structure

```text
Brain-Tumor/
│
├── Brain Tumor Web/
│   ├── app/
│   ├── components/
│   ├── prisma/
│   ├── public/
│   └── lib/
│
├── ai-service/
│   ├── model/
│   │   └── best_efficientnet_model.h5
│   ├── main.py
│   ├── model_loader.py
│   └── requirements.txt
│
└── README.md
```

---

## Dataset

The model was trained using publicly available Brain MRI datasets containing:

* Glioma MRI Images
* Meningioma MRI Images
* Pituitary MRI Images
* Healthy Brain MRI Images

### Dataset Limitation

Due to hardware and computational constraints, the model was trained on a relatively limited dataset. Increasing dataset size and training resources could further improve generalization and performance.

---

## Installation

### Clone Repository

```bash
git clone https://github.com/your-username/your-repository.git
cd your-repository
```

---

## Frontend Setup

Navigate to frontend folder:

```bash
cd "Brain Tumor Web"
```

Install dependencies:

```bash
npm install
```

Create environment file:

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
AI_INFERENCE_URL=http://127.0.0.1:8000
```

Run frontend:

```bash
npm run dev
```

Frontend will start at:

```text
http://localhost:3000
```

---

## AI Service Setup

Navigate to AI service:

```bash
cd ai-service
```

Create virtual environment:

```bash
python -m venv venv
```

Activate environment:

### Windows

```bash
venv\Scripts\activate
```

### Linux/Mac

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run FastAPI service:

```bash
uvicorn main:app --reload
```

Backend API will start at:

```text
http://127.0.0.1:8000
```

API Documentation:

```text
http://127.0.0.1:8000/docs
```

---

## Workflow

1. Upload MRI Scan
2. Image Preprocessing
3. EfficientNetB0 Inference
4. Tumor Classification
5. Confidence Calculation
6. Probability Distribution Generation
7. Grad-CAM Visualization
8. Display Results

---

## Research Contribution

This project combines:

* Medical Image Analysis
* Transfer Learning
* Explainable AI
* Full Stack Development

to create an accessible and interpretable brain tumor detection platform.

---

## Future Improvements

* Larger Training Dataset
* Advanced Explainability Methods
* Multi-modal Medical Data Support
* Improved Model Generalization
* Real-time Clinical Assistance Features
* Mobile Application Support

---

## Author

**Devansh Singh**

AI & Full Stack Developer

Focused on:

* Artificial Intelligence
* Medical Imaging
* Deep Learning
* Explainable AI
* Full Stack Development

---

## Disclaimer

This project is intended for educational, research, and demonstration purposes only. It should not be used as a substitute for professional medical diagnosis or clinical decision-making.

```
```
