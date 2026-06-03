'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Activity,
  History,
  LineChart,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'MRI Detection', href: '/dashboard/detect', icon: Activity },
  { name: 'Scan History', href: '/dashboard/history', icon: History },
  { name: 'Model Analytics', href: '/dashboard/analytics', icon: LineChart },
  { name: 'Research Paper', href: '/dashboard/research', icon: BookOpen },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

  // Fetch session on load
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

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        toast.success('Logged out successfully');
        router.push('/platform');
        router.refresh();
      } else {
        toast.error('Logout failed');
      }
    } catch (err) {
      toast.error('An error occurred during logout');
    }
  };

  const getInitials = (nameStr: string) => {
    return nameStr
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const pageTitle = navItems.find((item) => item.href === pathname)?.name || 'Platform';

  return (
    <div className="min-h-screen bg-[#050816] text-[#f5f5f7] flex">
      {/* 1. Sidebar desktop navigation */}
      <aside className="hidden md:flex md:w-64 lg:w-72 flex-col bg-[#0c1024]/60 backdrop-blur-xl border-r border-secondary/10 shrink-0">
        {/* Sidebar Header */}
        <div className="h-16 flex items-center gap-2.5 px-6 border-b border-secondary/10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-secondary to-primary flex items-center justify-center shadow-lg shadow-secondary/30">
            <Sparkles className="w-4.5 h-4.5 text-background" />
          </div>
          <div>
            <span className="text-base font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">NeuroVision AI</span>
            <span className="text-[9px] text-foreground/40 block -mt-1 tracking-wider uppercase font-semibold">Diagnostic Suite</span>
          </div>
        </div>

        {/* User profile card */}
        <div className="p-4 mx-3 my-4 rounded-xl bg-black/40 border border-secondary/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-secondary/40 to-primary/40 border border-secondary/30 flex items-center justify-center text-xs font-bold text-primary">
            {user ? getInitials(user.name) : 'NV'}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-foreground truncate">{user ? user.name : 'Authorizing...'}</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[10px] text-foreground/50 capitalize font-medium">{user ? user.role : 'Staging'}</span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-4 space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs lg:text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-secondary/20 to-primary/10 border border-secondary/30 text-foreground shadow-md shadow-secondary/5'
                    : 'text-foreground/60 hover:bg-secondary/5 hover:text-foreground/90'
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-foreground/55'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer / Logout */}
        <div className="p-4 border-t border-secondary/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs lg:text-sm font-semibold text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* 2. Mobile sidebar sliding drawer overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="w-64 max-w-xs bg-[#0c1024] border-r border-secondary/20 flex flex-col h-full p-4 relative animate-fade-in">
            {/* Close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-foreground/60 hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Logo */}
            <div className="flex items-center gap-2 mb-6 mt-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-background" />
              </div>
              <span className="text-sm font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">NeuroVision AI</span>
            </div>

            {/* Profile */}
            <div className="p-3 rounded-lg bg-black/30 border border-secondary/15 flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-secondary/40 to-primary/40 border border-secondary/30 flex items-center justify-center text-[10px] font-bold text-primary">
                {user ? getInitials(user.name) : 'G'}
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">{user ? user.name : 'Staging Session'}</h4>
                <span className="text-[9px] text-foreground/50 capitalize block">{user ? user.role : 'Guest'}</span>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex-grow space-y-1.5">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-secondary/20 to-primary/10 border border-secondary/30 text-foreground'
                        : 'text-foreground/60 hover:bg-secondary/5'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-foreground/50'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Global Dashboard Header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-secondary/10 bg-[#050816]/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-lg border border-secondary/20 hover:bg-secondary/10 text-foreground/70"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm sm:text-base font-bold text-foreground tracking-wide">{pageTitle}</h2>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Notifications mock icon */}
            <button 
              onClick={() => toast.info('System Alert: AI Inference service is online.')}
              className="relative p-1.5 rounded-lg border border-secondary/10 hover:bg-secondary/5 text-foreground/60 hover:text-foreground transition-all duration-300"
            >
              <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-destructive animate-pulse"></span>
            </button>
            
            {/* User badge */}
            <div className="px-3 py-1 rounded-full border border-secondary/20 bg-secondary/5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-foreground/75">
                {user ? user.role : 'Loading'}
              </span>
            </div>
          </div>
        </header>

        {/* Children scroll container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
