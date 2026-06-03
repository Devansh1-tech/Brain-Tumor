import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db as prisma } from '@/lib/db';
import fs from 'fs';
import path from 'path';

// Define local directories for storing images
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const MRI_DIR = path.join(UPLOADS_DIR, 'mri');
const GRADCAM_DIR = path.join(UPLOADS_DIR, 'gradcam');

// Ensure directories exist helper
function ensureDirectoriesExist() {
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  if (!fs.existsSync(MRI_DIR)) fs.mkdirSync(MRI_DIR, { recursive: true });
  if (!fs.existsSync(GRADCAM_DIR)) fs.mkdirSync(GRADCAM_DIR, { recursive: true });
}

export async function POST(request: Request) {
  try {
    // 1. Authenticate user
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login or continue as Guest.' },
        { status: 401 }
      );
    }

    // 2. Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No MRI image file uploaded' },
        { status: 400 }
      );
    }

    // Ensure the uploads folders exist
    ensureDirectoriesExist();

    // 3. Save original MRI file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const fileExt = path.extname(file.name) || '.jpg';
    const fileBaseName = `${session.userId}_${Date.now()}`;
    const mriFileName = `${fileBaseName}_original${fileExt}`;
    const mriFilePath = path.join(MRI_DIR, mriFileName);
    
    fs.writeFileSync(mriFilePath, buffer);
    const mriUrl = `/uploads/mri/${mriFileName}`;

    // 4. Forward file to FastAPI AI service
    const aiInferenceUrl = `${process.env.AI_INFERENCE_URL || 'http://127.0.0.1:8000'}/predict`;
    const pythonFormData = new FormData();
    // Re-create the file as a Blob for FormData
    const fileBlob = new Blob([buffer], { type: file.type });
    pythonFormData.append('file', fileBlob, file.name);

    let aiResponse;
    try {
      aiResponse = await fetch(aiInferenceUrl, {
        method: 'POST',
        body: pythonFormData,
      });
    } catch (e) {
      console.error('Failed to connect to FastAPI server:', e);
      return NextResponse.json(
        { error: 'AI inference service is currently offline. Please try again later.' },
        { status: 503 }
      );
    }

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('FastAPI error response:', errorText);
      return NextResponse.json(
        { error: 'AI inference service encountered an error processing the image.' },
        { status: aiResponse.status }
      );
    }

    const aiResult = await aiResponse.json();
    const { prediction, confidence, probabilities, gradcam_base64 } = aiResult;

    // 5. Decode and save Grad-CAM heatmap overlay
    let gradcamUrl = '';
    if (gradcam_base64) {
      const gradcamBuffer = Buffer.from(gradcam_base64, 'base64');
      const gradcamFileName = `${fileBaseName}_gradcam.jpg`;
      const gradcamFilePath = path.join(GRADCAM_DIR, gradcamFileName);
      
      fs.writeFileSync(gradcamFilePath, gradcamBuffer);
      gradcamUrl = `/uploads/gradcam/${gradcamFileName}`;
    }

    // 6. Write record to PostgreSQL via Prisma
    const predictionRecord = await prisma.predictionHistory.create({
      data: {
        userId: session.userId,
        imageUrl: mriUrl,
        prediction,
        confidence,
        gradcamImage: gradcamUrl,
        probabilities,
      },
    });

    return NextResponse.json({
      success: true,
      prediction: predictionRecord,
    });

  } catch (error) {
    console.error('Inference orchestration error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
