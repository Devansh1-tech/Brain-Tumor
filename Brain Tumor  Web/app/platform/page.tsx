'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, User, ShieldAlert, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function PlatformPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Authentication handlers
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (activeTab === 'signup') {
        if (password !== confirmPassword) {
          toast.error('Passwords do not match');
          setIsLoading(false);
          return;
        }

        // Hit signup API
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
        
        let data: any = {};
        try {
          data = await res.json();
        } catch (err) {
          // Not valid JSON
        }
        
        if (!res.ok) {
          toast.error(data.error || 'Registration failed');
          setIsLoading(false);
          return;
        }
        
        toast.success('Account created! Logging you in...');
        
        // Auto-login after registration
        const loginRes = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, rememberMe }),
        });
        
        if (loginRes.ok) {
          router.push('/dashboard');
          router.refresh();
        } else {
          setActiveTab('login');
          setIsLoading(false);
        }
      } else {
        // Hit login API
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, rememberMe }),
        });
        
        let data: any = {};
        try {
          data = await res.json();
        } catch (err) {
          // Not valid JSON
        }
        
        if (!res.ok) {
          toast.error(data.error || 'Authentication failed');
          setIsLoading(false);
          return;
        }

        toast.success('Logged in successfully!');
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isGuest: true }),
      });
      
      let data: any = {};
      try {
        data = await res.json();
      } catch (err) {
        // Not valid JSON
      }
      
      if (!res.ok) {
        toast.error(data.error || 'Guest access failed');
        setIsLoading(false);
        return;
      }
      
      toast.success('Entering as Guest. Welcome!');
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error('Failed to establish guest session.');
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center bg-[#050816] overflow-hidden px-4 py-12">
      {/* Cinematic animated glow backdrops */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-secondary/15 rounded-full blur-[100px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[450px] h-[450px] bg-primary/10 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDuration: '4s' }}></div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[480px] bg-[#0c1024]/60 backdrop-blur-xl border border-secondary/20 rounded-2xl p-6 sm:p-10 shadow-2xl shadow-black/60 flex flex-col items-center">
        {/* Logo and Headings */}
        <div className="flex flex-col items-center gap-2 mb-8 text-center">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/40 bg-primary/10 backdrop-blur-sm mb-2">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-primary uppercase">NeuroVision Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground via-secondary to-primary bg-clip-text text-transparent">
            Begin Diagnostic Analysis
          </h1>
          <p className="text-xs sm:text-sm text-foreground/60 max-w-sm">
            Access our state-of-the-art MRI classification platform powered by explainable deep neural networks.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="w-full grid grid-cols-2 p-1 rounded-lg bg-black/40 border border-secondary/10 mb-6">
          <button
            onClick={() => { if(!isLoading) setActiveTab('login'); }}
            className={`py-2 text-xs sm:text-sm font-semibold rounded-md transition-all duration-300 ${
              activeTab === 'login'
                ? 'bg-gradient-to-r from-secondary/25 to-primary/20 border border-secondary/40 text-foreground'
                : 'text-foreground/50 hover:text-foreground/80'
            }`}
            disabled={isLoading}
          >
            Sign In
          </button>
          <button
            onClick={() => { if(!isLoading) setActiveTab('signup'); }}
            className={`py-2 text-xs sm:text-sm font-semibold rounded-md transition-all duration-300 ${
              activeTab === 'signup'
                ? 'bg-gradient-to-r from-secondary/25 to-primary/20 border border-secondary/40 text-foreground'
                : 'text-foreground/50 hover:text-foreground/80'
            }`}
            disabled={isLoading}
          >
            Create Account
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleAuth} className="w-full space-y-4">
          {activeTab === 'signup' && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-foreground/70 uppercase tracking-wider block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black/30 border border-secondary/20 hover:border-secondary/40 focus:border-primary focus:outline-none text-xs sm:text-sm text-foreground placeholder:text-foreground/30 transition-all duration-300"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-foreground/70 uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
              <input
                type="email"
                required
                placeholder="mri@neurovision.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black/30 border border-secondary/20 hover:border-secondary/40 focus:border-primary focus:outline-none text-xs sm:text-sm text-foreground placeholder:text-foreground/30 transition-all duration-300"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-foreground/70 uppercase tracking-wider block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-black/30 border border-secondary/20 hover:border-secondary/40 focus:border-primary focus:outline-none text-xs sm:text-sm text-foreground placeholder:text-foreground/30 transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-foreground/40 hover:text-foreground/70 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {activeTab === 'signup' && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-foreground/70 uppercase tracking-wider block">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black/30 border border-secondary/20 hover:border-secondary/40 focus:border-primary focus:outline-none text-xs sm:text-sm text-foreground placeholder:text-foreground/30 transition-all duration-300"
                />
              </div>
            </div>
          )}

          {/* Remember me & Forgot Password UI */}
          {activeTab === 'login' && (
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                  className="w-3.5 h-3.5 rounded accent-primary border border-secondary/30 bg-black/40 focus:ring-0 focus:outline-none cursor-pointer"
                />
                <span className="text-[11px] sm:text-xs text-foreground/60 hover:text-foreground/80 transition-colors">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => toast.info('Password recovery instruction has been sent to the registered email address (Mock Flow)')}
                className="text-[11px] sm:text-xs font-semibold text-secondary hover:text-secondary/80 transition-colors"
                disabled={isLoading}
              >
                Forgot Password?
              </button>
            </div>
          )}

          {/* Form Action Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-secondary to-primary text-background font-semibold py-2.5 rounded-lg shadow-lg shadow-secondary/25 hover:shadow-secondary/40 transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] text-xs sm:text-sm mt-2"
          >
            {isLoading ? 'Decrypting Secure Session...' : activeTab === 'signup' ? 'Create Neural Profile' : 'Authorize Diagnostic Console'}
          </Button>
        </form>

        {/* Divider */}
        <div className="w-full flex items-center gap-3 my-6">
          <div className="h-[1px] flex-grow bg-secondary/15"></div>
          <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-wider">Or</span>
          <div className="h-[1px] flex-grow bg-secondary/15"></div>
        </div>

        {/* Guest Mode CTA */}
        <button
          type="button"
          onClick={handleGuestLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-secondary/35 text-foreground hover:bg-secondary/10 hover:border-secondary font-semibold transition-all duration-300 backdrop-blur-sm text-xs sm:text-sm"
        >
          <Sparkles className="w-4 h-4 text-secondary" />
          <span>Continue as Guest</span>
        </button>

        {/* Security Warning Footnote */}
        <div className="flex items-center gap-1.5 mt-8 text-center text-[10px] text-foreground/40 leading-relaxed max-w-xs">
          <ShieldAlert className="w-3.5 h-3.5 text-foreground/30 shrink-0" />
          <span>Encrypted diagnostic session. HIPAA compliant staging environment.</span>
        </div>
      </div>
    </main>
  );
}
