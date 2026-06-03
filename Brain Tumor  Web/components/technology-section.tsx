'use client';

import { Card } from '@/components/ui/card';

export function TechnologySection() {
  return (
    <section id="technology" className="py-20 px-6 bg-gradient-to-b from-background to-background/50 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl -translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Advanced<span className="text-transparent bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text"> Technology</span>
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Built on cutting-edge deep learning architectures with explainability at the core
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TechCard
            icon="🧠"
            title="EfficientNetB0"
            description="Lightweight yet powerful CNN architecture optimized for fast inference and high accuracy"
          />
          <TechCard
            icon="🔍"
            title="Grad-CAM Explainability"
            description="Visualize which regions of the MRI the model focused on for its predictions"
          />
          <TechCard
            icon="⚡"
            title="Real-time Processing"
            description="Process MRI scans in milliseconds with GPU acceleration"
          />
          <TechCard
            icon="🎯"
            title="4-Class Classification"
            description="Detect Glioma, Meningioma, Pituitary tumors, or no tumor with high confidence"
          />
          <TechCard
            icon="📊"
            title="87.94% Accuracy"
            description="Validated on diverse medical imaging datasets with clinical-grade performance"
          />
          <TechCard
            icon="🔒"
            title="Privacy First"
            description="HIPAA-compliant processing with no data retention on servers"
          />
        </div>
      </div>
    </section>
  );
}

function TechCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <Card className="group p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent hover:from-primary/10 hover:border-primary/40 transition-all duration-300 cursor-pointer">
      <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-xl font-semibold mb-3 text-foreground">{title}</h3>
      <p className="text-foreground/60 leading-relaxed">{description}</p>
    </Card>
  );
}
