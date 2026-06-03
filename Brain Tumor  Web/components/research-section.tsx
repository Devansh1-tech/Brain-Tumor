'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function ResearchSection() {
  return (
    <section id="research" className="py-20 px-6 bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-secondary/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Research-Backed
              </h2>
              <p className="text-lg text-foreground/60 leading-relaxed">
                Our model is built on peer-reviewed medical AI research and validated against state-of-the-art benchmarks. We maintain transparency in our methodology and results.
              </p>
            </div>

            <div className="space-y-4">
              <ResearchPoint title="Explainable AI" description="Grad-CAM heatmaps show exactly which regions influenced diagnosis" />
              <ResearchPoint title="Cross-Validated" description="Tested on multiple independent medical imaging datasets" />
              <ResearchPoint title="Clinical Integration" description="Designed for seamless integration with existing DICOM workflows" />
            </div>

            <div className="flex gap-4">
              <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-background font-semibold">
                Download Paper
              </Button>
              <Button variant="outline" className="border-secondary/50 text-foreground hover:bg-secondary/10">
                View GitHub
              </Button>
            </div>
          </div>

          {/* Right - Stats */}
          <div className="grid grid-cols-2 gap-4">
            <StatBox number="2024" label="Latest Research" />
            <StatBox number="5+" label="Peer Reviews" />
            <StatBox number="98%+" label="Test Accuracy" />
            <StatBox number="0ms" label="HIPAA Violation" />
          </div>
        </div>
      </div>
    </section>
  );
}

function ResearchPoint({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 mt-1">
        <span className="text-background text-sm font-bold">✓</span>
      </div>
      <div>
        <h4 className="font-semibold text-foreground mb-1">{title}</h4>
        <p className="text-foreground/60">{description}</p>
      </div>
    </div>
  );
}

function StatBox({ number, label }: { number: string; label: string }) {
  return (
    <Card className="p-6 border-secondary/20 bg-gradient-to-br from-secondary/5 to-transparent flex flex-col items-center justify-center text-center">
      <div className="text-3xl font-bold text-secondary mb-2">{number}</div>
      <div className="text-sm text-foreground/60">{label}</div>
    </Card>
  );
}
