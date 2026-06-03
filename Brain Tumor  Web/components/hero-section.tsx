'use client';

import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section id="home" className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover brightness-75"
        aria-hidden="true"
      >
        <source src="/brain-animation.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60"></div>

      {/* Premium radial glow effects */}
      <div className="absolute inset-0 bg-radial-gradient from-primary/5 via-transparent to-transparent opacity-50"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-200px)]">
          {/* Left side - Premium content */}
          <div className="space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-block">
              <div className="px-4 py-2 rounded-full border border-primary/50 bg-primary/10 backdrop-blur-sm">
                <span className="text-sm font-medium text-primary">✨ Explainable AI for Healthcare</span>
              </div>
            </div>

            {/* Main headline */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Revolutionizing{' '}
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-pulse">
                  Brain Tumor
                </span>
                {' '}Detection with{' '}
                <span className="bg-gradient-to-r from-secondary via-accent to-secondary bg-clip-text text-transparent">
                  Explainable AI
                </span>
              </h1>
            </div>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-foreground/80 leading-relaxed max-w-xl">
              EfficientNetB0-powered MRI classification with Grad-CAM explainability for transparent and intelligent medical diagnosis.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-background font-semibold rounded-lg shadow-lg shadow-primary/40 hover:shadow-primary/60 transition-all duration-300 px-8"
              >
                Try MRI Detection
              </Button>
              <Button 
                size="lg"
                className="border-2 border-secondary/60 text-foreground hover:bg-secondary/10 hover:border-secondary font-semibold rounded-lg backdrop-blur-sm transition-all duration-300 px-8"
              >
                View Research Paper
              </Button>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 gap-4 pt-8">
              <StatCard number="87.94%" label="Accuracy" />
              <StatCard number="4" label="Tumor Classes" />
              <StatCard number="Explainable" label="Grad-CAM" />
              <StatCard number="EfficientNetB0" label="Transfer Learning" />
            </div>
          </div>

          {/* Right side - Visual accent */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-sm h-96">
              {/* Glowing orb */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute inset-0 border-2 border-primary/30 rounded-full"></div>
              <div className="absolute inset-4 border border-secondary/30 rounded-full"></div>
              <div className="absolute inset-8 border border-accent/30 rounded-full animate-spin-slow"></div>
              
              {/* Center dot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/50"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <div className="text-foreground/60 text-center space-y-2">
          <span className="block text-sm">Scroll to explore</span>
          <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="group p-4 md:p-6 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/5 backdrop-blur-sm hover:from-primary/20 hover:to-secondary/10 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
      <div className="text-xl md:text-2xl font-bold text-primary mb-2">{number}</div>
      <div className="text-xs md:text-sm text-foreground/70">{label}</div>
    </div>
  );
}
