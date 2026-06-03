import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db as prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const predictions = await prisma.predictionHistory.findMany({
      where: { userId: session.userId },
      orderBy: { timestamp: 'asc' },
    });

    const totalScans = predictions.length;
    let avgConfidence = 0;
    
    // Default distributions
    const classDistribution: Record<string, number> = {
      glioma: 0,
      meningioma: 0,
      pituitary: 0,
      notumor: 0,
    };
    
    const confidenceSums: Record<string, number> = {
      glioma: 0,
      meningioma: 0,
      pituitary: 0,
      notumor: 0,
    };

    if (totalScans > 0) {
      let confidenceTotal = 0;
      predictions.forEach((pred) => {
        confidenceTotal += pred.confidence;
        const normalizedClass = pred.prediction.toLowerCase();
        
        if (normalizedClass in classDistribution) {
          classDistribution[normalizedClass] += 1;
          confidenceSums[normalizedClass] += pred.confidence;
        } else {
          // Fallback if class names slightly vary
          classDistribution[normalizedClass] = (classDistribution[normalizedClass] || 0) + 1;
          confidenceSums[normalizedClass] = (confidenceSums[normalizedClass] || 0) + pred.confidence;
        }
      });
      avgConfidence = parseFloat((confidenceTotal / totalScans).toFixed(4));
    }

    // Average confidence by class
    const avgConfidenceByClass = Object.keys(classDistribution).reduce((acc, key) => {
      const count = classDistribution[key];
      acc[key] = count > 0 ? parseFloat((confidenceSums[key] / count).toFixed(4)) : 0;
      return acc;
    }, {} as Record<string, number>);

    // Timeline data for chart: last 7 days or last 10 scans
    const timeline = predictions.map(pred => ({
      date: new Date(pred.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      confidence: parseFloat((pred.confidence * 100).toFixed(1)),
      prediction: pred.prediction,
    })).slice(-10);

    return NextResponse.json({
      success: true,
      analytics: {
        totalScans,
        avgConfidence,
        classDistribution,
        avgConfidenceByClass,
        timeline,
      }
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
