'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Activity, 
  TrendingUp, 
  Database, 
  Brain, 
  ArrowRight,
  ShieldCheck,
  ScanEye,
  Plus
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { toast } from 'sonner';

interface AnalyticsData {
  totalScans: number;
  avgConfidence: number;
  classDistribution: Record<string, number>;
  avgConfidenceByClass: Record<string, number>;
  timeline: Array<{ date: string; confidence: number; prediction: string }>;
}

export default function DashboardHome() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch('/api/analytics');
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setData(json.analytics);
          }
        }
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  // Format decimal confidence into readable percentage
  const formatPercentage = (val: number) => {
    return `${(val * 100).toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="h-[60vh] w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-t-primary border-secondary/25 rounded-full animate-spin"></div>
          <p className="text-xs text-foreground/50 tracking-wider">Synchronizing diagnostic history...</p>
        </div>
      </div>
    );
  }

  const kpis = [
    {
      title: 'Total MRI Scans',
      value: data?.totalScans || 0,
      description: 'Historical records cataloged',
      icon: Database,
      color: 'from-secondary/20 to-secondary/5 border-secondary/30 text-secondary'
    },
    {
      title: 'Average Confidence',
      value: data ? formatPercentage(data.avgConfidence) : '0%',
      description: 'Model predictive certainty',
      icon: TrendingUp,
      color: 'from-primary/20 to-primary/5 border-primary/30 text-primary'
    },
    {
      title: 'System Health',
      value: 'Online',
      description: 'FastAPI Inference node active',
      icon: ShieldCheck,
      color: 'from-accent/20 to-accent/5 border-accent/30 text-accent'
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative p-6 sm:p-8 rounded-2xl border border-secondary/20 bg-gradient-to-br from-[#0c1024]/80 to-black/25 overflow-hidden">
        {/* Glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-secondary/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
              Clinical Diagnostic Console
            </h1>
            <p className="text-xs sm:text-sm text-foreground/75 max-w-2xl leading-relaxed">
              Analyze brain MRI scans using our pre-trained **EfficientNetB0** network with visual explanations provided by **Grad-CAM**. Track, review, and evaluate results in real-time.
            </p>
          </div>
          <Link href="/dashboard/detect">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-secondary to-primary text-background font-semibold hover:opacity-90 shadow-lg shadow-secondary/30 transition-all duration-300 transform active:scale-95 shrink-0 text-xs sm:text-sm">
              <Plus className="w-4 h-4" />
              <span>New MRI Analysis</span>
            </button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {kpis.map((kpi, idx) => (
          <div 
            key={idx} 
            className={`p-5 rounded-xl border bg-gradient-to-br ${kpi.color} flex items-center justify-between shadow-xl`}
          >
            <div className="space-y-1">
              <span className="text-xs font-semibold text-foreground/50 uppercase tracking-wider block">{kpi.title}</span>
              <span className="text-2xl sm:text-3xl font-bold text-foreground block">{kpi.value}</span>
              <span className="text-[10px] text-foreground/60 block">{kpi.description}</span>
            </div>
            <div className="p-3 rounded-lg bg-black/30 border border-secondary/10">
              <kpi.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Timeline Chart + Class distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline Chart */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-xl border border-secondary/15 bg-[#0c1024]/40 backdrop-blur-sm flex flex-col shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-0.5">
              <h3 className="text-sm sm:text-base font-bold text-foreground">Diagnostic Log</h3>
              <p className="text-[10px] sm:text-xs text-foreground/50">Model confidence levels of the last 10 scans</p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-foreground/40 font-semibold px-2 py-0.5 rounded border border-secondary/10 bg-black/40">
              <ScanEye className="w-3.5 h-3.5 text-secondary" />
              <span>Predictive Timeline</span>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            {data && data.timeline.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.timeline} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" />
                  <XAxis dataKey="date" stroke="#8b92a9" fontSize={10} tickLine={false} />
                  <YAxis stroke="#8b92a9" domain={[0, 100]} fontSize={10} tickLine={false} unit="%" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0c1024', border: '1px solid #00d4ff50', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '11px' }}
                    itemStyle={{ color: '#00ff88', fontSize: '11px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="confidence" 
                    stroke="#00ff88" 
                    strokeWidth={3} 
                    activeDot={{ r: 6 }} 
                    dot={{ r: 4, stroke: '#00d4ff', strokeWidth: 1 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center border border-dashed border-secondary/10 rounded-lg">
                <span className="text-xs text-foreground/40">No scans logged. Upload an MRI to see historical charts.</span>
              </div>
            )}
          </div>
        </div>

        {/* Tumors distribution list */}
        <div className="p-5 sm:p-6 rounded-xl border border-secondary/15 bg-[#0c1024]/40 backdrop-blur-sm flex flex-col shadow-xl">
          <div className="space-y-0.5 mb-6">
            <h3 className="text-sm sm:text-base font-bold text-foreground">Pathology Distribution</h3>
            <p className="text-[10px] sm:text-xs text-foreground/50">Tumor classes detected in database</p>
          </div>

          <div className="flex-1 space-y-4">
            {['glioma', 'meningioma', 'pituitary', 'notumor'].map((label) => {
              const count = data?.classDistribution[label] || 0;
              const pct = data?.totalScans ? (count / data.totalScans) * 100 : 0;
              
              const prettyNames: Record<string, string> = {
                glioma: 'Glioma',
                meningioma: 'Meningioma',
                pituitary: 'Pituitary',
                notumor: 'No Tumor'
              };

              return (
                <div key={label} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-foreground/80">{prettyNames[label]}</span>
                    <span className="text-primary">{count} {count === 1 ? 'scan' : 'scans'} ({pct.toFixed(0)}%)</span>
                  </div>
                  <div className="h-2 w-full bg-black/40 rounded-full border border-secondary/10 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-secondary to-primary rounded-full transition-all duration-1000"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-secondary/10 mt-6 flex justify-center">
            <Link href="/dashboard/analytics" className="text-xs font-bold text-secondary flex items-center gap-1.5 hover:text-secondary/80 transition-colors">
              <span>View detailed analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
