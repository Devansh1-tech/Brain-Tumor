'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, 
  User, 
  Key, 
  Sliders, 
  Eye, 
  Check, 
  Copy,
  Info 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  
  // Custom mock states
  const [apiKey, setApiKey] = useState('nv_live_8588baae_cf92_46fe_9318_73c96ae0d825');
  const [copied, setCopied] = useState(false);
  const [multistageLogging, setMultistageLogging] = useState(true);
  const [highContrastOverlay, setHighContrastOverlay] = useState(false);

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setUser(data.user);
          }
        }
      } catch (err) {
        console.error('Session check failed:', err);
      }
    }
    checkSession();
  }, []);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    toast.success('Developer API Key copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateKey = () => {
    const newKey = `nv_live_${Math.random().toString(36).substring(2, 10)}_${Math.random().toString(36).substring(2, 10)}`;
    setApiKey(newKey);
    toast.success('New Developer API Key generated successfully');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Staging Profile details saved successfully');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-4xl">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">System & Account Settings</h1>
        <p className="text-xs sm:text-sm text-foreground/50">Manage user credentials, developer integrations, and diagnostic display toggles.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Sections selection */}
        <div className="md:col-span-1 p-4 rounded-xl border border-secondary/10 bg-[#0c1024]/20 space-y-1 self-start shadow-md">
          <span className="text-[10px] font-bold text-foreground/45 uppercase tracking-widest block px-3 mb-2">Category</span>
          <div className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold bg-secondary/15 text-secondary border border-secondary/30">
            <Sliders className="w-4 h-4" />
            <span>General Preferences</span>
          </div>
        </div>

        {/* Right Column: Preferences form */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile form */}
          <div className="p-5 sm:p-6 rounded-xl border border-secondary/15 bg-[#0c1024]/40 backdrop-blur-sm shadow-xl space-y-4">
            <h3 className="text-xs sm:text-sm font-bold text-foreground uppercase tracking-wider text-secondary flex items-center gap-1.5 border-b border-secondary/10 pb-2">
              <User className="w-4 h-4" />
              <span>User Profile Details</span>
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-foreground/60 uppercase block">Full Name</label>
                  <input
                    type="text"
                    disabled
                    value={user ? user.name : 'Authorizing...'}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-secondary/10 text-foreground/60 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-foreground/60 uppercase block">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={user ? user.email : 'Authorizing...'}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-secondary/10 text-foreground/60 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-foreground/45 border border-secondary/10 bg-secondary/5 rounded p-2.5">
                <Info className="w-4 h-4 text-secondary shrink-0" />
                <span>Authentication credentials are managed via JWT staging tokens. Profile name edit is locked.</span>
              </div>
            </form>
          </div>

          {/* Dev API credentials */}
          <div className="p-5 sm:p-6 rounded-xl border border-secondary/15 bg-[#0c1024]/40 backdrop-blur-sm shadow-xl space-y-4">
            <h3 className="text-xs sm:text-sm font-bold text-foreground uppercase tracking-wider text-secondary flex items-center gap-1.5 border-b border-secondary/10 pb-2">
              <Key className="w-4 h-4" />
              <span>Developer API Key</span>
            </h3>
            <p className="text-xs text-foreground/50">
              Integrate NeuroVision tumor classification models directly into other medical recording systems.
            </p>

            <div className="flex gap-2 text-xs sm:text-sm font-mono">
              <div className="flex-grow relative border border-secondary/20 bg-black/40 rounded-lg p-2.5 pr-10 text-foreground/75 truncate select-all">
                {apiKey}
              </div>
              <button
                onClick={handleCopyKey}
                className="p-2.5 rounded-lg border border-secondary/30 hover:bg-secondary/15 text-foreground/70 hover:text-foreground shrink-0 transition-colors"
                title="Copy Key"
              >
                {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            
            <div className="flex justify-end pt-1">
              <Button
                type="button"
                onClick={handleGenerateKey}
                className="bg-secondary/25 hover:bg-secondary/30 text-foreground border border-secondary/40 font-semibold"
              >
                Roll API Key
              </Button>
            </div>
          </div>

          {/* Staging toggles */}
          <div className="p-5 sm:p-6 rounded-xl border border-secondary/15 bg-[#0c1024]/40 backdrop-blur-sm shadow-xl space-y-4">
            <h3 className="text-xs sm:text-sm font-bold text-foreground uppercase tracking-wider text-secondary flex items-center gap-1.5 border-b border-secondary/10 pb-2">
              <Sliders className="w-4 h-4" />
              <span>Inference Display Preferences</span>
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              {/* Toggle 1 */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 max-w-sm">
                  <span className="font-bold text-foreground block">Multi-Stage Scanning Log</span>
                  <span className="text-[10px] sm:text-xs text-foreground/50">Simulates real-time clinical logs during model calculations.</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={multistageLogging}
                    onChange={(e) => setMultistageLogging(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-black/40 border border-secondary/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-foreground/60 after:border-foreground/35 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary/40 peer-checked:border-primary/50"></div>
                </label>
              </div>

              {/* Toggle 2 */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 max-w-sm">
                  <span className="font-bold text-foreground block">High Contrast Attributions</span>
                  <span className="text-[10px] sm:text-xs text-foreground/50">Applies high contrast filters to Grad-CAM heatmap overlays.</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={highContrastOverlay}
                    onChange={(e) => setHighContrastOverlay(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-black/40 border border-secondary/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-foreground/60 after:border-foreground/35 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary/40 peer-checked:border-primary/50"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
