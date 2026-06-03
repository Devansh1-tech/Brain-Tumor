'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/40 backdrop-blur-xl border-b border-primary/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-shadow">
            <span className="text-background font-bold text-lg">N</span>
          </div>
          <span className="font-bold text-lg text-foreground hidden sm:inline">NeuroVision AI</span>
        </Link>

        {/* Center Navigation */}
        <div className="hidden lg:flex items-center space-x-1">
          <NavLink href="#home">Home</NavLink>
          <NavLink href="#technology">Technology</NavLink>
          <NavLink href="#research">Research</NavLink>
          <NavLink href="#performance">Model Performance</NavLink>
          <NavLink href="#demo">Demo</NavLink>
          <NavLink href="#about">About</NavLink>
        </div>

        {/* CTA Button */}
        <Button 
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-background font-semibold rounded-full px-8 py-2 shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300"
        >
          Try Live Demo
        </Button>
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href}
      className="px-4 py-2 text-foreground/70 hover:text-primary transition-colors duration-200 relative group"
    >
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-300"></span>
    </Link>
  );
}
