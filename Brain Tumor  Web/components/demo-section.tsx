'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function DemoSection() {
  return (
    <section id="demo" className="py-20 px-6 bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 pointer-events-none"></div>
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Try the<span className="text-transparent bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text"> Demo</span>
          </h2>
          <p className="text-lg text-foreground/60">
            Experience real-time brain tumor detection with explainable AI
          </p>
        </div>

        <Card className="p-8 md:p-12 border-primary/30 bg-gradient-to-br from-primary/5 via-secondary/5 to-background">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="text-6xl">🧬</div>
              <h3 className="text-2xl font-bold text-foreground">Upload MRI Scan</h3>
              <p className="text-foreground/60 max-w-xl mx-auto">
                Upload a DICOM or standard medical imaging file to get instant analysis
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-background font-semibold rounded-lg"
              >
                Start Live Demo
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary/50 text-foreground hover:bg-primary/10"
              >
                Watch Tutorial
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-primary/20">
              <DemoFeature icon="⚡" text="Instant Results" />
              <DemoFeature icon="🔍" text="Heatmap Overlay" />
              <DemoFeature icon="📋" text="Detailed Report" />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

function DemoFeature({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="space-y-2">
      <div className="text-3xl">{icon}</div>
      <p className="font-medium text-foreground">{text}</p>
    </div>
  );
}
