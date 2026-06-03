'use client';

import { useState } from 'react';
import { BookOpen, FileText, Download, Bookmark, Sparkles, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const sections = [
  { id: 'abstract', name: 'Abstract' },
  { id: 'introduction', name: 'Introduction' },
  { id: 'methodology', name: 'Methodology' },
  { id: 'architecture', name: 'EfficientNetB0 Architecture' },
  { id: 'explainability', name: 'Grad-CAM Explainability' },
  { id: 'references', name: 'References' }
];

export default function ResearchPaperPage() {
  const [activeSection, setActiveSection] = useState('abstract');

  const handleDownloadPdf = () => {
    toast.success('Downloading research paper preprint in PDF format... (Mock Download)');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Title block */}
      <div className="relative p-6 sm:p-8 rounded-2xl border border-secondary/20 bg-gradient-to-br from-[#0c1024]/80 to-black/25 overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-60 h-60 bg-secondary/10 rounded-full blur-[70px] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-secondary font-semibold uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>Academic Publication (Preprint)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-foreground max-w-xl leading-tight">
              Explainable Brain Tumor Detection using MRI + EfficientNetB0 + Grad-CAM
            </h1>
            <p className="text-xs sm:text-sm text-foreground/50">Published: May 2026 | Authors: NeuroVision Research Team</p>
          </div>
          <Button
            onClick={handleDownloadPdf}
            className="bg-secondary hover:bg-secondary/90 text-background font-semibold flex items-center gap-2 shrink-0 shadow-lg shadow-secondary/20"
          >
            <Download className="w-4 h-4" />
            <span>Download Paper PDF</span>
          </Button>
        </div>
      </div>

      {/* Main split reader: Left navigation + Right paper body */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-1 p-4 rounded-xl border border-secondary/10 bg-[#0c1024]/20 space-y-1.5 self-start shadow-lg">
          <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest block px-3 mb-2">Paper Sections</span>
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => {
                setActiveSection(sec.id);
                document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                activeSection === sec.id
                  ? 'bg-secondary/15 text-secondary border border-secondary/30'
                  : 'text-foreground/60 hover:bg-secondary/5 hover:text-foreground/90'
              }`}
            >
              <span>{sec.name}</span>
              {activeSection === sec.id && <Bookmark className="w-3.5 h-3.5 fill-current" />}
            </button>
          ))}
        </aside>

        {/* Paper Text Body */}
        <article className="lg:col-span-3 p-6 sm:p-8 rounded-xl border border-secondary/15 bg-[#0c1024]/40 backdrop-blur-sm shadow-xl space-y-8 max-h-[70vh] overflow-y-auto leading-relaxed text-foreground/80 scroll-smooth">
          
          {/* Abstract */}
          <section id="abstract" className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground border-b border-secondary/10 pb-2">Abstract</h2>
            <p className="text-xs sm:text-sm">
              Brain tumor detection requires high accuracy and, critically, transparency to assist neurosurgeons in diagnostic processes. In this paper, we propose a Transfer Learning framework based on the **EfficientNetB0** architecture to classify brain MRI scans into four classes: Glioma, Meningioma, Pituitary Tumor, and No Tumor. 
            </p>
            <p className="text-xs sm:text-sm">
              To address the "black-box" nature of deep neural networks, we integrate **Grad-CAM** (Gradient-weighted Class Activation Mapping) to generate coarse localization maps highlighting the key discriminative regions the model uses to make predictions. Our model achieves a validation accuracy of **87.94%** on a public MRI benchmark, proving that light-weight Transfer Learning structures can match larger networks while retaining real-time execution speeds.
            </p>
          </section>

          {/* Introduction */}
          <section id="introduction" className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground border-b border-secondary/10 pb-2">1. Introduction</h2>
            <p className="text-xs sm:text-sm">
              Manual inspection of magnetic resonance imaging (MRI) scans for brain tumor diagnosis is time-consuming and prone to observer variability. Computer-Aided Diagnosis (CAD) systems using Deep Learning have emerged as powerful tools. However, medical professionals are often hesitant to adopt these models because they lack explainability.
            </p>
            <p className="text-xs sm:text-sm">
              We present a system that not only classifies the scan with high confidence but also outlines the spatial location of the tumor cells using gradients. This explainability layer builds clinical trust and serves as a double-check verification tool for radiologists.
            </p>
          </section>

          {/* Methodology */}
          <section id="methodology" className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground border-b border-secondary/10 pb-2">2. Methodology</h2>
            <p className="text-xs sm:text-sm">
              Our proposed workflow consists of three primary stages:
            </p>
            <ul className="list-disc pl-5 text-xs sm:text-sm space-y-1.5">
              <li>
                <strong>Data Preprocessing:</strong> Axial, sagittal, and coronal MRI images are resized to 224x224 and preprocessed using normalized Keras EfficientNet values.
              </li>
              <li>
                <strong>Feature Extraction & Classification:</strong> A pre-trained EfficientNetB0 base extracts features, which are then passed to a GlobalAveragePooling2D layer, a Dense layer (128 units, Dropout 0.3), and a Softmax classifier.
              </li>
              <li>
                <strong>Explainable Visualization:</strong> Grad-CAM calculates the gradient of the winning class score relative to the activation maps of the final convolution layer (`top_activation`).
              </li>
            </ul>
          </section>

          {/* EfficientNetB0 */}
          <section id="architecture" className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground border-b border-secondary/10 pb-2">3. EfficientNetB0 Architecture</h2>
            <p className="text-xs sm:text-sm">
              EfficientNetB0 leverages a compound scaling method that uniformly scales network depth, width, and resolution using a simple set of coefficient constants. The core structure uses mobile inverted bottleneck convolutions (MBConv), which drastically reduces computation complexity while retaining accuracy.
            </p>
            <p className="text-xs sm:text-sm">
              By reusing weights trained on the ImageNet database, the model benefits from general edge, shape, and contrast recognition filters, requiring only fine-tuning of the final classification layers on target MRI datasets.
            </p>
          </section>

          {/* Grad-CAM */}
          <section id="explainability" className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground border-b border-secondary/10 pb-2">4. Grad-CAM Explainability</h2>
            <p className="text-xs sm:text-sm">
              Gradient-weighted Class Activation Mapping (Grad-CAM) uses the gradients of any target concept (like the class score for glioma) flowing into the final convolutional layer to produce a coarse localization map. This map highlights the most important regions in the image for predicting that concept.
            </p>
            <p className="text-xs sm:text-sm">
              Let $y^c$ be the score for class $c$ before softmax. The gradients are pooled using global average pooling to obtain the importance weights $\alpha_k^c$:
            </p>
            <div className="p-3 rounded-lg bg-black/45 border border-secondary/10 font-mono text-[10px] sm:text-xs text-center my-3">
              {"alpha_k^c = (1 / Z) * sum_i sum_j (partial y^c / partial A_{i,j}^k)"}
            </div>
            <p className="text-xs sm:text-sm">
              A weighted combination of forward activation maps is followed by a ReLU operation to only highlight features that positively contribute to the target class decision.
            </p>
          </section>

          {/* References */}
          <section id="references" className="space-y-3 text-[11px] sm:text-xs">
            <h2 className="text-lg sm:text-xl font-bold text-foreground border-b border-secondary/10 pb-2">References</h2>
            <ol className="list-decimal pl-5 space-y-1.5 text-foreground/60">
              <li>
                Tan, M., & Le, Q. V. (2019). EfficientNet: Rethinking model scaling for convolutional neural networks. arXiv preprint arXiv:1905.11946.
              </li>
              <li>
                Selvaraju, R. R., Cogswell, M., Das, A., Vedantam, R., Parikh, D., & Batra, D. (2017). Grad-CAM: Visual explanations from deep networks via gradient-based localization. ICCV.
              </li>
              <li>
                Keras Applications Documentation (2026). EfficientNetB0 ImageNet Pre-trained Model weights.
              </li>
            </ol>
          </section>

        </article>
      </div>
    </div>
  );
}
