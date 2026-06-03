'use client';

import { Card } from '@/components/ui/card';

export function PerformanceSection() {
  return (
    <section id="performance" className="py-20 px-6 bg-gradient-to-b from-background/50 to-background relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Model<span className="text-transparent bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text"> Performance</span>
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Clinically validated metrics demonstrating superior accuracy and reliability
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <PerformanceMetric
            label="Overall Accuracy"
            value="87.94%"
            description="On diverse medical imaging datasets"
            color="from-primary"
          />
          <PerformanceMetric
            label="Sensitivity"
            value="92.3%"
            description="True positive rate for tumor detection"
            color="from-secondary"
          />
          <PerformanceMetric
            label="Specificity"
            value="89.1%"
            description="True negative rate for healthy scans"
            color="from-accent"
          />
          <PerformanceMetric
            label="F1 Score"
            value="0.898"
            description="Balanced precision and recall"
            color="from-primary"
          />
        </div>

        <Card className="p-8 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <h3 className="text-2xl font-bold mb-6 text-foreground">Per-Class Performance</h3>
          <div className="space-y-4">
            <ClassPerformance name="Glioma" accuracy={89.2} color="#00ff88" />
            <ClassPerformance name="Meningioma" accuracy={91.5} color="#00d4ff" />
            <ClassPerformance name="Pituitary" accuracy={85.3} color="#6366ff" />
            <ClassPerformance name="No Tumor" accuracy={87.4} color="#a855f7" />
          </div>
        </Card>
      </div>
    </section>
  );
}

function PerformanceMetric({
  label,
  value,
  description,
  color,
}: {
  label: string;
  value: string;
  description: string;
  color: string;
}) {
  return (
    <Card className={`p-6 border-transparent bg-gradient-to-br ${color}/10 to-transparent`}>
      <h3 className="text-foreground/60 text-sm font-medium mb-2">{label}</h3>
      <div className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
        {value}
      </div>
      <p className="text-foreground/50 text-sm">{description}</p>
    </Card>
  );
}

function ClassPerformance({ name, accuracy, color }: { name: string; accuracy: number; color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-medium text-foreground">{name}</span>
        <span className="text-sm font-semibold" style={{ color }}>{accuracy}%</span>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${accuracy}%`,
            background: `linear-gradient(90deg, ${color}, rgba(0, 255, 136, 0.5))`,
          }}
        ></div>
      </div>
    </div>
  );
}
