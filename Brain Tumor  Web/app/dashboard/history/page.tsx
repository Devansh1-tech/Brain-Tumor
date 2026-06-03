'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  TrendingUp, 
  Eye, 
  FileText,
  Download,
  X,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PredictionRecord {
  id: string;
  imageUrl: string;
  prediction: string;
  confidence: number;
  gradcamImage: string;
  probabilities: Record<string, number>;
  timestamp: string;
}

export default function PredictionHistoryPage() {
  const [history, setHistory] = useState<PredictionRecord[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<PredictionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('all');

  // Selected item modal details
  const [selectedRecord, setSelectedRecord] = useState<PredictionRecord | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch('/api/history');
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setHistory(json.history);
            setFilteredHistory(json.history);
          }
        }
      } catch (err) {
        console.error('Failed to fetch history:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  // Filter handlers
  useEffect(() => {
    let result = history;

    if (search.trim() !== '') {
      result = result.filter(
        (rec) =>
          rec.id.toLowerCase().includes(search.toLowerCase()) ||
          rec.prediction.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (classFilter !== 'all') {
      result = result.filter((rec) => rec.prediction.toLowerCase() === classFilter.toLowerCase());
    }

    setFilteredHistory(result);
  }, [search, classFilter, history]);

  const handleDownload = (rec: PredictionRecord) => {
    toast.success(`Downloading diagnostic report for scan #${rec.id.substring(0, 8)} (Mock Download)`);
  };

  const prettyNames: Record<string, string> = {
    glioma: 'Glioma',
    meningioma: 'Meningioma',
    pituitary: 'Pituitary',
    notumor: 'No Tumor'
  };

  if (loading) {
    return (
      <div className="h-[60vh] w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-t-primary border-secondary/25 rounded-full animate-spin"></div>
          <p className="text-xs text-foreground/50">Fetching historical records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">Diagnostic History Explorer</h1>
        <p className="text-xs sm:text-sm text-foreground/50">Browse, search, and inspect past brain MRI scans and model explanations.</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-secondary/10 bg-[#0c1024]/30 backdrop-blur-sm shadow-md">
        {/* Search */}
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/45" />
          <input
            type="text"
            placeholder="Search by Scan ID or Class..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-black/45 border border-secondary/15 hover:border-secondary/35 focus:border-primary focus:outline-none text-xs sm:text-sm text-foreground placeholder:text-foreground/35 transition-all duration-300"
          />
        </div>

        {/* Filter class */}
        <div className="relative w-full sm:w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/45" />
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-black/45 border border-secondary/15 hover:border-secondary/35 focus:border-primary focus:outline-none text-xs sm:text-sm text-foreground/75 cursor-pointer appearance-none transition-all duration-300"
          >
            <option value="all">All Classes</option>
            <option value="glioma">Glioma</option>
            <option value="meningioma">Meningioma</option>
            <option value="pituitary">Pituitary</option>
            <option value="notumor">No Tumor</option>
          </select>
        </div>
      </div>

      {/* History Grid/Table */}
      {filteredHistory.length > 0 ? (
        <div className="border border-secondary/15 bg-[#0c1024]/20 rounded-xl overflow-hidden shadow-xl">
          {/* Table view */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/35 border-b border-secondary/15 text-[10px] sm:text-xs font-bold text-foreground/50 tracking-wider uppercase">
                  <th className="py-4 px-6">MRI Scan</th>
                  <th className="py-4 px-6">Scan ID</th>
                  <th className="py-4 px-6">Prediction Class</th>
                  <th className="py-4 px-6">Confidence</th>
                  <th className="py-4 px-6">Timestamp</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/10 text-xs sm:text-sm">
                {filteredHistory.map((rec) => (
                  <tr key={rec.id} className="hover:bg-secondary/5 transition-colors">
                    {/* MRI Preview */}
                    <td className="py-3.5 px-6">
                      <div className="w-10 h-10 rounded border border-secondary/20 bg-black/40 overflow-hidden flex items-center justify-center cursor-pointer"
                           onClick={() => setSelectedRecord(rec)}>
                        <img 
                          src={rec.imageUrl} 
                          alt="MRI preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    
                    {/* ID */}
                    <td className="py-3.5 px-6 font-mono text-foreground/75 text-[11px] sm:text-xs">
                      #{rec.id.substring(0, 8)}
                    </td>

                    {/* Class */}
                    <td className="py-3.5 px-6 font-bold text-foreground">
                      {prettyNames[rec.prediction.toLowerCase()] || rec.prediction}
                    </td>

                    {/* Confidence */}
                    <td className="py-3.5 px-6 font-semibold text-primary">
                      {(rec.confidence * 100).toFixed(1)}%
                    </td>

                    {/* Timestamp */}
                    <td className="py-3.5 px-6 text-foreground/60 text-[11px] sm:text-xs">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-foreground/35" />
                        <span>{new Date(rec.timestamp).toLocaleString()}</span>
                      </div>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedRecord(rec)}
                          className="p-1.5 rounded border border-secondary/25 hover:bg-secondary/15 text-foreground/70 hover:text-foreground transition-colors"
                          title="Inspect Overlay"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownload(rec)}
                          className="p-1.5 rounded border border-secondary/25 hover:bg-secondary/15 text-foreground/70 hover:text-foreground transition-colors"
                          title="Download Report"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-secondary/10 rounded-xl py-16 text-center bg-[#0c1024]/10">
          <span className="text-xs sm:text-sm text-foreground/40 block">No diagnostic records matched the filters.</span>
        </div>
      )}

      {/* Selected record Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-4xl bg-[#0c1024] border border-secondary/25 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-secondary/15 flex justify-between items-center bg-black/25">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-foreground/45 uppercase tracking-widest block">Report Code: #{selectedRecord.id}</span>
                <h3 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-1.5">
                  <FileText className="w-4.5 h-4.5 text-secondary" />
                  <span>MRI Diagnostic Evaluation</span>
                </h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1 rounded-lg border border-secondary/20 hover:bg-secondary/10 text-foreground/60 hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scroll Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-grow">
              
              {/* Images container */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Original */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider block">MRI Source Input</span>
                  <div className="border border-secondary/15 bg-black/45 rounded-lg overflow-hidden flex items-center justify-center p-3 aspect-square max-h-[300px]">
                    <img 
                      src={selectedRecord.imageUrl} 
                      alt="MRI original" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Gradcam */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider block">Grad-CAM Attribution Overlay</span>
                  <div className="border border-secondary/15 bg-black/45 rounded-lg overflow-hidden flex items-center justify-center p-3 aspect-square max-h-[300px]">
                    <img 
                      src={selectedRecord.gradcamImage || selectedRecord.imageUrl} 
                      alt="MRI gradcam overlay" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Data report row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-secondary/10">
                {/* Primary classification summary */}
                <div className="p-4 rounded-xl border border-secondary/10 bg-black/35 space-y-2">
                  <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider block">Pathological Evaluation</span>
                  <h4 className="text-xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                    {prettyNames[selectedRecord.prediction.toLowerCase()] || selectedRecord.prediction}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-foreground/60">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span>{(selectedRecord.confidence * 100).toFixed(1)}% Certainty index</span>
                  </div>
                </div>

                {/* Breakdown progress list */}
                <div className="md:col-span-2 p-4 rounded-xl border border-secondary/10 bg-black/35 space-y-2.5">
                  <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider block">Pathology Probability Distribution</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['glioma', 'meningioma', 'pituitary', 'notumor'].map((label) => {
                      const prob = selectedRecord.probabilities[label] || 0;
                      const active = selectedRecord.prediction.toLowerCase() === label;

                      return (
                        <div key={label} className={`p-2 rounded border ${active ? 'bg-secondary/15 border-secondary/40' : 'bg-black/20 border-secondary/5'} space-y-1`}>
                          <div className="flex justify-between text-[11px] font-semibold">
                            <span className={active ? 'text-foreground font-bold' : 'text-foreground/50'}>{prettyNames[label]}</span>
                            <span className={active ? 'text-primary font-bold' : 'text-foreground/30'}>{(prob * 100).toFixed(1)}%</span>
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
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-secondary/15 flex flex-col sm:flex-row sm:justify-end gap-3 bg-black/20">
              <Button
                onClick={() => handleDownload(selectedRecord)}
                className="bg-gradient-to-r from-secondary to-primary text-background font-semibold flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Export Diagnostic PDF</span>
              </Button>
              <Button
                onClick={() => setSelectedRecord(null)}
                variant="outline"
                className="border-secondary/40 text-foreground"
              >
                Close Report
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
