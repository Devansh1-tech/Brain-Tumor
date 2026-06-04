'use client';

import { useState, useRef } from 'react';
import { 
  Upload, 
  FileImage, 
  Activity, 
  RefreshCw, 
  Sparkles, 
  BrainCircuit, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PredictionResult {
  id: string;
  imageUrl: string;
  prediction: string;
  confidence: number;
  gradcamImage: string;
  probabilities: Record<string, number>;
  timestamp: string;
}

export default function MriDetectionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [scanStep, setScanStep] = useState<string>('');
  const [result, setResult] = useState<PredictionResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (scanState === 'scanning') return;

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      processSelectedFile(droppedFile);
    } else {
      toast.error('Please upload a valid image file (PNG, JPG, JPEG)');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processSelectedFile(selectedFile);
    }
  };

  const processSelectedFile = (selectedFile: File) => {
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setScanState('idle');
    setResult(null);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Diagnostic scan simulator & API orchestrator
  const runAnalysis = async () => {
    if (!file) return;

    setScanState('scanning');
    
    // Step-by-step diagnostic feedback simulation
    const steps = [
      'Establishing connection to FastAPI inference node...',
      'Initializing transfer learning model (EfficientNetB0)...',
      'Uploading MRI image and performing image matrix resize (224x224x3)...',
      'Normalizing color matrices and feed-forward passing...',
      'Model prediction completed. Resolving target layer (top_activation)...',
      'Generating Grad-CAM heatmap overlay...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setScanStep(steps[i]);
      await new Promise((resolve) => setTimeout(resolve, 800)); // Delay for cinematic effect
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/predict', {
        method: 'POST',
        body: formData,
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch (err) {
        // Not valid JSON
      }

      if (!res.ok) {
        throw new Error(data.error || 'Diagnostic scan failed.');
      }

      setResult(data.prediction);
      setScanState('success');
      toast.success('Inference complete! Brain MRI analyzed.');
    } catch (err: any) {
      console.error(err);
      setScanState('error');
      toast.error(err.message || 'An error occurred during analysis.');
    }
  };

  const resetScanner = () => {
    setFile(null);
    setPreviewUrl(null);
    setScanState('idle');
    setResult(null);
  };

  const prettyNames: Record<string, string> = {
    glioma: 'Glioma',
    meningioma: 'Meningioma',
    pituitary: 'Pituitary Tumor',
    notumor: 'No Tumor Detected'
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header banner */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">AI MRI Classification Staging</h1>
        <p className="text-xs sm:text-sm text-foreground/50">Upload MRI scans to execute model predictions with pixel-level explainability.</p>
      </div>

      {scanState === 'idle' && !file && (
        /* Upload box */
        <div 
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className="group cursor-pointer w-full min-h-[350px] border-2 border-dashed border-secondary/30 hover:border-secondary/70 bg-[#0c1024]/40 hover:bg-[#0c1024]/65 rounded-2xl flex flex-col items-center justify-center p-6 text-center transition-all duration-300 shadow-xl"
        >
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <div className="p-4 rounded-full bg-secondary/10 border border-secondary/20 group-hover:scale-110 transition-transform duration-300 mb-4">
            <Upload className="w-8 h-8 text-secondary" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-foreground">Drag and drop MRI scan here</h3>
          <p className="text-xs sm:text-sm text-foreground/50 max-w-sm mt-1 mb-4">
            Supports PNG, JPG, or JPEG. Make sure the brain MRI scan is axial, coronal, or sagittal.
          </p>
          <Button 
            type="button"
            className="bg-secondary hover:bg-secondary/90 text-background font-semibold px-6 py-2.5 rounded-lg shadow-md shadow-secondary/20"
          >
            Browse Files
          </Button>
        </div>
      )}

      {file && (scanState === 'idle' || scanState === 'scanning' || scanState === 'error') && (
        /* Preview / Scanning Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Left panel: Image preview */}
          <div className="relative border border-secondary/20 bg-black/60 rounded-xl overflow-hidden shadow-xl aspect-square flex items-center justify-center">
            {previewUrl && (
              <img 
                src={previewUrl} 
                alt="MRI Preview" 
                className="w-full h-full object-contain max-h-[450px]"
              />
            )}
            
            {/* Scanning Line overlay */}
            {scanState === 'scanning' && (
              <div className="absolute inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent blur-[1px] animate-pulse pointer-events-none"
                   style={{
                     animation: 'scan-motion 2.5s ease-in-out infinite',
                     boxShadow: '0 0 10px #00ff88, 0 0 20px #00ff88'
                   }}
              ></div>
            )}
          </div>

          {/* Right panel: Controls / Logs */}
          <div className="p-6 rounded-xl border border-secondary/15 bg-[#0c1024]/40 backdrop-blur-sm shadow-xl flex flex-col justify-center min-h-[300px]">
            {scanState === 'idle' && (
              <div className="space-y-6 text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <FileImage className="w-5 h-5 text-secondary" />
                  <span className="text-xs sm:text-sm font-semibold text-foreground/80 truncate max-w-[200px]">{file.name}</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-foreground">Diagnostic Ready</h3>
                  <p className="text-xs sm:text-sm text-foreground/50">
                    MRI scan cached. Run diagnostic verification passes using our trained neural classifier.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={runAnalysis}
                    className="flex-1 bg-gradient-to-r from-secondary to-primary text-background font-semibold py-2.5 rounded-lg shadow-lg shadow-secondary/35 hover:shadow-secondary/50"
                  >
                    Run AI Diagnosis
                  </Button>
                  <Button 
                    onClick={resetScanner}
                    variant="outline"
                    className="border-secondary/40 text-foreground hover:bg-secondary/10"
                  >
                    Select Another
                  </Button>
                </div>
              </div>
            )}

            {scanState === 'scanning' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <BrainCircuit className="w-6 h-6 text-primary animate-pulse" />
                  <span className="text-sm font-bold text-foreground">Analyzing Neural Networks</span>
                </div>
                
                {/* Console logs */}
                <div className="p-4 rounded-lg bg-black/50 border border-secondary/10 font-mono text-[10px] sm:text-xs text-primary leading-relaxed min-h-[120px] flex flex-col justify-end">
                  <div className="flex items-center gap-2 mb-2 text-foreground/50">
                    <Activity className="w-3.5 h-3.5 animate-spin text-secondary" />
                    <span>Processing Matrix Streams...</span>
                  </div>
                  <span className="text-foreground transition-all duration-300">{scanStep}</span>
                </div>

                <div className="w-full bg-black/40 rounded-full h-1.5 border border-secondary/10 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-secondary to-primary rounded-full animate-pulse" style={{ width: '100%' }}></div>
                </div>
              </div>
            )}

            {scanState === 'error' && (
              <div className="space-y-5 text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start text-destructive">
                  <AlertTriangle className="w-6 h-6" />
                  <span className="text-sm font-bold">Diagnostic Interrupted</span>
                </div>
                <p className="text-xs sm:text-sm text-foreground/50">
                  The classification engine encountered an error or the inference service is offline.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={runAnalysis}
                    className="flex-1 bg-gradient-to-r from-secondary to-primary text-background font-semibold"
                  >
                    Retry Analysis
                  </Button>
                  <Button 
                    onClick={resetScanner}
                    variant="outline"
                    className="border-secondary/40 text-foreground"
                  >
                    Cancel Scan
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {scanState === 'success' && result && (
        /* Results View */
        <div className="space-y-6">
          {/* Side by side original MRI and Gradcam Heatmap */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original MRI preview */}
            <div className="flex flex-col rounded-xl border border-secondary/15 bg-[#0c1024]/40 backdrop-blur-sm overflow-hidden shadow-xl">
              <div className="p-4 border-b border-secondary/10 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-secondary" />
                <span className="text-xs font-semibold text-foreground/80">Original Diagnostic Input</span>
              </div>
              <div className="p-4 bg-black/60 flex items-center justify-center aspect-square max-h-[400px]">
                <img 
                  src={result.imageUrl} 
                  alt="Original MRI" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Gradcam heatmap */}
            <div className="flex flex-col rounded-xl border border-secondary/15 bg-[#0c1024]/40 backdrop-blur-sm overflow-hidden shadow-xl">
              <div className="p-4 border-b border-secondary/10 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-foreground/80">Grad-CAM Activation Visualizer</span>
              </div>
              <div className="p-4 bg-black/60 flex items-center justify-center aspect-square max-h-[400px]">
                <img 
                  src={result.gradcamImage || result.imageUrl} 
                  alt="Gradcam Overlay" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* Diagnosis metrics card */}
          <div className="p-6 rounded-xl border border-secondary/15 bg-[#0c1024]/40 backdrop-blur-sm shadow-xl flex flex-col md:flex-row justify-between gap-6">
            <div className="space-y-4 md:max-w-md">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest block">Primary Classification</span>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                  {prettyNames[result.prediction.toLowerCase()] || result.prediction}
                </h2>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest block">Neural Certainty Index</span>
                <span className="text-xl font-bold text-foreground">{(result.confidence * 100).toFixed(1)}% Confidence</span>
              </div>
              <Button 
                onClick={resetScanner}
                className="bg-gradient-to-r from-secondary/35 to-primary/20 hover:from-secondary/40 hover:to-primary/30 text-foreground font-semibold px-6 py-2 rounded-lg border border-secondary/40 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Scan Another Patient</span>
              </Button>
            </div>

            {/* Progress breakdown */}
            <div className="flex-1 space-y-3">
              <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest block mb-1">Class Probability Breakdown</span>
              {['glioma', 'meningioma', 'pituitary', 'notumor'].map((label) => {
                const prob = result.probabilities[label] || 0;
                const active = result.prediction.toLowerCase() === label;

                return (
                  <div key={label} className={`p-2.5 rounded-lg border ${active ? 'bg-secondary/10 border-secondary/40' : 'bg-black/30 border-secondary/5'} space-y-1`}>
                    <div className="flex justify-between text-xs font-semibold">
                      <span className={active ? 'text-foreground font-bold' : 'text-foreground/60'}>{prettyNames[label]}</span>
                      <span className={active ? 'text-primary font-bold' : 'text-foreground/40'}>{(prob * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${active ? 'bg-gradient-to-r from-secondary to-primary' : 'bg-foreground/20'}`}
                        style={{ width: `${prob * 100}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Embedded CSS for scan laser animation */}
      <style jsx global>{`
        @keyframes scan-motion {
          0%, 100% {
            top: 0%;
          }
          50% {
            top: 100%;
          }
        }
      `}</style>
    </div>
  );
}
