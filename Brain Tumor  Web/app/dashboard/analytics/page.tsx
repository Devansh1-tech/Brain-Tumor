'use client';

import { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  ShieldCheck, 
  Cpu, 
  GitMerge, 
  HelpCircle,
  Database,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';

// Mock model training accuracy/loss data
const trainingProgress = [
  { epoch: 1, accuracy: 65.4, val_accuracy: 62.1, loss: 0.98, val_loss: 1.05 },
  { epoch: 2, accuracy: 72.8, val_accuracy: 70.4, loss: 0.74, val_loss: 0.82 },
  { epoch: 3, accuracy: 78.5, val_accuracy: 76.2, loss: 0.58, val_loss: 0.64 },
  { epoch: 4, accuracy: 82.1, val_accuracy: 80.9, loss: 0.47, val_loss: 0.52 },
  { epoch: 5, accuracy: 84.6, val_accuracy: 83.1, loss: 0.39, val_loss: 0.44 },
  { epoch: 6, accuracy: 86.2, val_accuracy: 84.8, loss: 0.34, val_loss: 0.39 },
  { epoch: 7, accuracy: 87.9, val_accuracy: 85.9, loss: 0.30, val_loss: 0.36 },
  { epoch: 8, accuracy: 88.7, val_accuracy: 86.8, loss: 0.27, val_loss: 0.34 },
  { epoch: 9, accuracy: 89.9, val_accuracy: 87.1, loss: 0.24, val_loss: 0.32 },
  { epoch: 10, accuracy: 91.2, val_accuracy: 87.9, loss: 0.21, val_loss: 0.31 }
];

// Mock ROC Curve data
const rocCurveData = [
  { fpr: 0, glioma: 0, meningioma: 0, pituitary: 0, notumor: 0 },
  { fpr: 0.1, glioma: 0.85, meningioma: 0.78, pituitary: 0.90, notumor: 0.95 },
  { fpr: 0.2, glioma: 0.92, meningioma: 0.86, pituitary: 0.96, notumor: 0.98 },
  { fpr: 0.3, glioma: 0.96, meningioma: 0.90, pituitary: 0.98, notumor: 0.99 },
  { fpr: 0.4, glioma: 0.97, meningioma: 0.93, pituitary: 0.99, notumor: 1.0 },
  { fpr: 0.5, glioma: 0.99, meningioma: 0.96, pituitary: 1.0, notumor: 1.0 },
  { fpr: 0.6, glioma: 0.99, meningioma: 0.98, pituitary: 1.0, notumor: 1.0 },
  { fpr: 0.7, glioma: 1.0, meningioma: 0.99, pituitary: 1.0, notumor: 1.0 },
  { fpr: 0.8, glioma: 1.0, meningioma: 1.0, pituitary: 1.0, notumor: 1.0 },
  { fpr: 0.9, glioma: 1.0, meningioma: 1.0, pituitary: 1.0, notumor: 1.0 },
  { fpr: 1.0, glioma: 1.0, meningioma: 1.0, pituitary: 1.0, notumor: 1.0 }
];

// Confusion Matrix actual data
// Classes: Glioma, Meningioma, Pituitary, No Tumor
const confusionMatrix = [
  [120, 11, 4, 2],   // Actual Glioma
  [12, 115, 6, 4],   // Actual Meningioma
  [3, 5, 125, 1],    // Actual Pituitary
  [1, 2, 0, 134]     // Actual No Tumor
];

const classNames = ['Glioma', 'Meningioma', 'Pituitary', 'No Tumor'];

export default function ModelAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'performance' | 'architecture'>('performance');

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">Model Analytics & Validation</h1>
        <p className="text-xs sm:text-sm text-foreground/50">Explore validation benchmarks, learning curves, and parameter allocations of EfficientNetB0.</p>
      </div>

      {/* Selector Tabs */}
      <div className="flex border-b border-secondary/15">
        <button
          onClick={() => setActiveTab('performance')}
          className={`pb-3 px-6 text-xs sm:text-sm font-semibold border-b-2 transition-all duration-300 ${
            activeTab === 'performance'
              ? 'border-primary text-primary'
              : 'border-transparent text-foreground/50 hover:text-foreground/80'
          }`}
        >
          Predictive Performance
        </button>
        <button
          onClick={() => setActiveTab('architecture')}
          className={`pb-3 px-6 text-xs sm:text-sm font-semibold border-b-2 transition-all duration-300 ${
            activeTab === 'architecture'
              ? 'border-primary text-primary'
              : 'border-transparent text-foreground/50 hover:text-foreground/80'
          }`}
        >
          Network Architecture
        </button>
      </div>

      {activeTab === 'performance' && (
        <div className="space-y-6 sm:space-y-8">
          
          {/* Epoch accuracy & loss row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Accuracy line chart */}
            <div className="p-5 sm:p-6 rounded-xl border border-secondary/15 bg-[#0c1024]/40 backdrop-blur-sm shadow-xl flex flex-col">
              <h3 className="text-xs sm:text-sm font-bold text-foreground mb-4 uppercase tracking-wider text-secondary flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Learning Curves (Accuracy)</span>
              </h3>
              <div className="h-64 sm:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trainingProgress} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" />
                    <XAxis dataKey="epoch" stroke="#8b92a9" fontSize={10} tickLine={false} />
                    <YAxis stroke="#8b92a9" fontSize={10} tickLine={false} domain={[50, 100]} unit="%" />
                    <Tooltip contentStyle={{ backgroundColor: '#0c1024', border: '1px solid #00d4ff50' }} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Line type="monotone" name="Training Accuracy" dataKey="accuracy" stroke="#00ff88" strokeWidth={2} activeDot={{ r: 5 }} />
                    <Line type="monotone" name="Validation Accuracy" dataKey="val_accuracy" stroke="#00d4ff" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Loss line chart */}
            <div className="p-5 sm:p-6 rounded-xl border border-secondary/15 bg-[#0c1024]/40 backdrop-blur-sm shadow-xl flex flex-col">
              <h3 className="text-xs sm:text-sm font-bold text-foreground mb-4 uppercase tracking-wider text-secondary flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                <span>Learning Curves (Loss)</span>
              </h3>
              <div className="h-64 sm:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trainingProgress} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" />
                    <XAxis dataKey="epoch" stroke="#8b92a9" fontSize={10} tickLine={false} />
                    <YAxis stroke="#8b92a9" fontSize={10} tickLine={false} domain={[0, 1.2]} />
                    <Tooltip contentStyle={{ backgroundColor: '#0c1024', border: '1px solid #00d4ff50' }} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Line type="monotone" name="Training Loss" dataKey="loss" stroke="#ff4444" strokeWidth={2} activeDot={{ r: 5 }} />
                    <Line type="monotone" name="Validation Loss" dataKey="val_loss" stroke="#a855f7" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Confusion matrix & ROC row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Confusion Matrix Grid */}
            <div className="p-5 sm:p-6 rounded-xl border border-secondary/15 bg-[#0c1024]/40 backdrop-blur-sm shadow-xl flex flex-col">
              <h3 className="text-xs sm:text-sm font-bold text-foreground mb-1 uppercase tracking-wider text-secondary flex items-center gap-1.5">
                <Cpu className="w-4 h-4" />
                <span>Confusion Matrix (Epoch 10)</span>
              </h3>
              <p className="text-[10px] sm:text-xs text-foreground/50 mb-6">Attribution metrics mapping actual labels vs. predictions</p>
              
              {/* Matrix Layout */}
              <div className="flex-1 flex flex-col gap-2">
                <div className="grid grid-cols-5 text-center text-[10px] font-bold text-foreground/40 pb-1">
                  <div></div>
                  {classNames.map(name => <div key={name} className="truncate">{name}</div>)}
                </div>

                {classNames.map((rowName, rIdx) => (
                  <div key={rowName} className="grid grid-cols-5 items-center text-center gap-2">
                    <div className="text-[10px] font-bold text-foreground/50 text-left truncate pr-1">{rowName}</div>
                    {confusionMatrix[rIdx].map((val, cIdx) => {
                      const isCorrect = rIdx === cIdx;
                      const sumOfRow = confusionMatrix[rIdx].reduce((a, b) => a + b, 0);
                      const pct = (val / sumOfRow) * 100;

                      return (
                        <div 
                          key={cIdx}
                          className={`p-3 rounded-lg border flex flex-col justify-center items-center font-bold text-xs sm:text-sm transition-all duration-300 ${
                            isCorrect 
                              ? 'bg-primary/20 border-primary/40 text-primary shadow-sm shadow-primary/10' 
                              : val > 0 
                                ? 'bg-destructive/15 border-destructive/25 text-destructive/80' 
                                : 'bg-black/25 border-secondary/5 text-foreground/20'
                          }`}
                          title={`Actual: ${rowName}, Predicted: ${classNames[cIdx]} (${val} items, ${pct.toFixed(1)}%)`}
                        >
                          <span>{val}</span>
                          <span className="text-[8px] font-medium opacity-65">{pct.toFixed(0)}%</span>
                        </div>
                      );
                    })}
                  </div>
                ))}
                
                {/* Legend helper */}
                <div className="flex items-center gap-4 justify-center mt-6 text-[10px] text-foreground/45">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-primary/20 border border-primary/40 rounded"></div>
                    <span>True Positive</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-destructive/15 border border-destructive/25 rounded"></div>
                    <span>False Negative/Positive</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ROC Curve Chart */}
            <div className="p-5 sm:p-6 rounded-xl border border-secondary/15 bg-[#0c1024]/40 backdrop-blur-sm shadow-xl flex flex-col">
              <h3 className="text-xs sm:text-sm font-bold text-foreground mb-1 uppercase tracking-wider text-secondary flex items-center gap-1.5">
                <GitMerge className="w-4 h-4" />
                <span>ROC Curves & AUC Bounds</span>
              </h3>
              <p className="text-[10px] sm:text-xs text-foreground/50 mb-6">Receiver Operating Characteristics plotting Sensitivity vs. False Positive Rate</p>

              <div className="h-64 sm:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={rocCurveData} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" />
                    <XAxis dataKey="fpr" stroke="#8b92a9" fontSize={10} tickLine={false} label={{ value: 'False Positive Rate', position: 'bottom', offset: 0, fontSize: 10, fill: '#8b92a9' }} />
                    <YAxis stroke="#8b92a9" fontSize={10} tickLine={false} label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft', offset: 10, fontSize: 10, fill: '#8b92a9' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0c1024', border: '1px solid #00d4ff50' }} />
                    <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                    <Line type="monotone" name="Glioma (AUC: 0.96)" dataKey="glioma" stroke="#00ff88" strokeWidth={2} dot={false} />
                    <Line type="monotone" name="Meningioma (AUC: 0.94)" dataKey="meningioma" stroke="#00d4ff" strokeWidth={2} dot={false} />
                    <Line type="monotone" name="Pituitary (AUC: 0.97)" dataKey="pituitary" stroke="#6366ff" strokeWidth={2} dot={false} />
                    <Line type="monotone" name="No Tumor (AUC: 0.99)" dataKey="notumor" stroke="#ec4899" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'architecture' && (
        <div className="space-y-6 sm:space-y-8">
          {/* Architecture parameters overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl border border-secondary/15 bg-black/40 flex flex-col justify-center">
              <span className="text-[10px] font-bold text-foreground/45 uppercase tracking-wider block">Total Parameters</span>
              <span className="text-xl sm:text-2xl font-black text-foreground mt-1">4,349,692</span>
              <span className="text-[10px] text-foreground/50 mt-1 block">EfficientNetB0 compound parameters</span>
            </div>
            <div className="p-5 rounded-xl border border-secondary/15 bg-black/40 flex flex-col justify-center">
              <span className="text-[10px] font-bold text-foreground/45 uppercase tracking-wider block">Trainable Params</span>
              <span className="text-xl sm:text-2xl font-black text-primary mt-1">299,652</span>
              <span className="text-[10px] text-foreground/50 mt-1 block">Dense Dense Relu (128) + Softmax (4)</span>
            </div>
            <div className="p-5 rounded-xl border border-secondary/15 bg-black/40 flex flex-col justify-center">
              <span className="text-[10px] font-bold text-foreground/45 uppercase tracking-wider block">Frozen Base Params</span>
              <span className="text-xl sm:text-2xl font-black text-secondary mt-1">4,050,040</span>
              <span className="text-[10px] text-foreground/50 mt-1 block">ImageNet pretrained feature weights</span>
            </div>
          </div>

          {/* Model Summary layout documentation */}
          <div className="p-6 rounded-xl border border-secondary/15 bg-[#0c1024]/40 backdrop-blur-sm shadow-xl space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-bold text-foreground">Model Architecture & Processing Flow</h3>
              <p className="text-xs text-foreground/50">Sequential layers mapping preprocessed MRI images to 4 tumor classifications</p>
            </div>

            {/* Visual flow graph */}
            <div className="space-y-3 font-mono text-xs text-foreground/75">
              
              <div className="p-3.5 rounded-lg border border-secondary/10 bg-black/45 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-secondary" />
                  <div>
                    <span className="font-bold text-foreground">1. Input Tensor Layer</span>
                    <span className="text-[10px] text-foreground/50 block">Resolution sizing matrix</span>
                  </div>
                </div>
                <span className="font-bold text-secondary">Shape: (224, 224, 3)</span>
              </div>

              <div className="w-full flex justify-center py-1">
                <div className="h-6 w-0.5 border-l-2 border-dashed border-secondary/35"></div>
              </div>

              <div className="p-3.5 rounded-lg border border-secondary/10 bg-black/45 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Cpu className="w-5 h-5 text-secondary" />
                  <div>
                    <span className="font-bold text-foreground">2. EfficientNetB0 (Base Model)</span>
                    <span className="text-[10px] text-foreground/50 block">Convolution layers, MBConv features. Pre-trained weights frozen.</span>
                  </div>
                </div>
                <span className="font-bold text-secondary">Shape: (7, 7, 1280)</span>
              </div>

              <div className="w-full flex justify-center py-1">
                <div className="h-6 w-0.5 border-l-2 border-dashed border-secondary/35"></div>
              </div>

              <div className="p-3.5 rounded-lg border border-secondary/10 bg-black/45 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <GitMerge className="w-5 h-5 text-secondary" />
                  <div>
                    <span className="font-bold text-foreground">3. GlobalAveragePooling2D</span>
                    <span className="text-[10px] text-foreground/50 block">Reduces height/width spatial dimensions to a single 1280 vector</span>
                  </div>
                </div>
                <span className="font-bold text-secondary">Shape: (1280)</span>
              </div>

              <div className="w-full flex justify-center py-1">
                <div className="h-6 w-0.5 border-l-2 border-dashed border-secondary/35"></div>
              </div>

              <div className="p-3.5 rounded-lg border border-secondary/10 bg-black/45 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Cpu className="w-5 h-5 text-primary" />
                  <div>
                    <span className="font-bold text-foreground">4. Fully Connected (Dense) Layer</span>
                    <span className="text-[10px] text-foreground/50 block">Trainable dense layer with ReLU activation. Dropout rate = 0.3</span>
                  </div>
                </div>
                <span className="font-bold text-primary">Shape: (128)</span>
              </div>

              <div className="w-full flex justify-center py-1">
                <div className="h-6 w-0.5 border-l-2 border-dashed border-secondary/35"></div>
              </div>

              <div className="p-3.5 rounded-lg border border-secondary/10 bg-black/45 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <div>
                    <span className="font-bold text-foreground">5. Classification Output Layer</span>
                    <span className="text-[10px] text-foreground/50 block">Softmax activation for multi-class tumor evaluation</span>
                  </div>
                </div>
                <span className="font-bold text-primary">Shape: (4)</span>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
