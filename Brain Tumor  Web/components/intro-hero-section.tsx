'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function IntroHeroSection() {
  const router = useRouter();

  return (
    <section className="relative w-full h-screen overflow-hidden flex items-center justify-center">
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
      <div className="relative z-10 w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16 h-full flex flex-col justify-center">
        <div className="max-w-4xl mx-auto w-full">
          {/* Left side - Premium content */}
          <div className="space-y-4 sm:space-y-6 md:space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-block">
              <div className="px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full border border-primary/50 bg-primary/10 backdrop-blur-sm">
                <span className="text-xs md:text-sm font-medium text-primary">✨ Explainable AI for Healthcare</span>
              </div>
            </div>

            {/* Main headline */}
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
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
            <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-foreground/80 leading-relaxed max-w-xl">
              EfficientNetB0-powered MRI classification with Grad-CAM explainability for transparent and intelligent medical diagnosis.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col xs:flex-row gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 pt-1 sm:pt-2 md:pt-4">
              <Button 
                size="sm"
                onClick={() => router.push('/platform')}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-background font-semibold rounded-lg shadow-lg shadow-primary/40 hover:shadow-primary/60 transition-all duration-300 px-3 sm:px-4 md:px-6 lg:px-8 text-xs sm:text-sm md:text-base"
              >
                Try MRI Detection
              </Button>
              <Button 
                size="sm"
                onClick={() => router.push('/platform')}
                className="border-2 border-secondary/60 text-foreground hover:bg-secondary/10 hover:border-secondary font-semibold rounded-lg backdrop-blur-sm transition-all duration-300 px-3 sm:px-4 md:px-6 lg:px-8 text-xs sm:text-sm md:text-base"
              >
                View Research Paper
              </Button>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 pt-3 sm:pt-4 md:pt-6 lg:pt-8">
              <StatCard number="87.94%" label="Accuracy" />
              <StatCard number="4" label="Tumor Classes" />
              <StatCard number="Explainable" label="Grad-CAM" />
              <StatCard number="EfficientNetB0" label="Transfer Learning" />
            </div>
          </div>
        </div>
      </div>

      {/* Premium Enter Platform Button - Bottom Right */}
      <div className="absolute bottom-3 sm:bottom-6 lg:bottom-8 right-3 sm:right-6 lg:right-8 z-20 flex flex-col items-end gap-1 sm:gap-2">
        {/* Helper text */}
        <span className="text-xs text-foreground/60 font-light tracking-wide">
          Explore Full Experience
        </span>
        
        {/* Continue Button */}
        <button
          onClick={() => router.push('/platform')}
          className="group relative px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 rounded-full bg-gradient-to-r from-secondary/20 to-primary/20 backdrop-blur-xl border border-secondary/40 hover:border-secondary/80 transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-secondary/40 transform hover:scale-105 active:scale-95"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-secondary/0 via-primary/10 to-secondary/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 group-hover:animate-pulse"></div>
          
          {/* Pulse ring animation */}
          <div className="absolute inset-0 rounded-full border border-secondary/0 group-hover:border-secondary/40 transition-all duration-500 group-hover:animate-pulse-ring"></div>
          
          {/* Button content */}
          <span className="relative flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm lg:text-base font-semibold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent whitespace-nowrap">
            Continue
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </button>
      </div>
    </section>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="group p-1.5 sm:p-2.5 md:p-3 lg:p-4 xl:p-5 rounded-lg md:rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/5 backdrop-blur-sm hover:from-primary/20 hover:to-secondary/10 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
      <div className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-primary mb-0.5 sm:mb-1 md:mb-2">{number}</div>
      <div className="text-xs sm:text-xs md:text-sm lg:text-sm text-foreground/70">{label}</div>
    </div>
  );
}
