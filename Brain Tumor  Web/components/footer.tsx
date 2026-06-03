'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="bg-background border-t border-border relative overflow-hidden py-16">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
                <span className="text-background font-bold">N</span>
              </div>
              <span className="font-bold text-lg text-foreground">NeuroVision</span>
            </Link>
            <p className="text-foreground/60 text-sm">
              Revolutionizing medical imaging with explainable AI
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link href="#demo" className="text-foreground/60 hover:text-foreground transition-colors text-sm">Demo</Link></li>
              <li><Link href="#technology" className="text-foreground/60 hover:text-foreground transition-colors text-sm">Technology</Link></li>
              <li><Link href="#performance" className="text-foreground/60 hover:text-foreground transition-colors text-sm">Performance</Link></li>
              <li><Link href="#" className="text-foreground/60 hover:text-foreground transition-colors text-sm">API</Link></li>
            </ul>
          </div>

          {/* Research */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Research</h4>
            <ul className="space-y-2">
              <li><Link href="#research" className="text-foreground/60 hover:text-foreground transition-colors text-sm">Papers</Link></li>
              <li><Link href="#" className="text-foreground/60 hover:text-foreground transition-colors text-sm">Datasets</Link></li>
              <li><Link href="#" className="text-foreground/60 hover:text-foreground transition-colors text-sm">GitHub</Link></li>
              <li><Link href="#" className="text-foreground/60 hover:text-foreground transition-colors text-sm">Documentation</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-foreground/60 hover:text-foreground transition-colors text-sm">Privacy</Link></li>
              <li><Link href="#" className="text-foreground/60 hover:text-foreground transition-colors text-sm">Terms</Link></li>
              <li><Link href="#" className="text-foreground/60 hover:text-foreground transition-colors text-sm">HIPAA</Link></li>
              <li><Link href="#" className="text-foreground/60 hover:text-foreground transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-8"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-foreground/50 text-sm">
            © 2024 NeuroVision AI. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="sm" className="text-foreground/60 hover:text-foreground">
              Twitter
            </Button>
            <Button variant="ghost" size="sm" className="text-foreground/60 hover:text-foreground">
              LinkedIn
            </Button>
            <Button variant="ghost" size="sm" className="text-foreground/60 hover:text-foreground">
              GitHub
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
