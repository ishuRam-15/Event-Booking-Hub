'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Building2, 
  LayoutDashboard, 
  Layers, 
  CalendarCheck2, 
  Users, 
  BarChart3, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  ChevronRight,
  ShieldCheck,
  Building
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If in admin login page, don't show admin dashboard sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navItems = [
    { label: 'Overview Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Venue Management', href: '/admin/venues', icon: Building2 },
    { label: 'Dynamic Blocks (CRUD)', href: '/admin/blocks', icon: Layers },
    { label: 'Bookings & Approvals', href: '/admin/bookings', icon: CalendarCheck2 },
    { label: 'Customer Directory', href: '/admin/customers', icon: Users },
    { label: 'Sales & Revenue', href: '/admin/sales', icon: BarChart3 },
    { label: 'Settings & GST Config', href: '/admin/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') return pathname === '/admin/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row text-slate-900">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex w-72 bg-brand-navy text-slate-300 flex-col justify-between shrink-0 border-r border-slate-800">
        <div className="p-6 space-y-8">
          {/* Brand */}
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-charcoal border border-amber-400/30 flex items-center justify-center text-brand-gold shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white font-serif">
                Grand<span className="text-brand-gold">Venue</span>
              </span>
              <span className="text-[10px] tracking-wider uppercase text-amber-300 font-bold block">
                Admin Command Suite
              </span>
            </div>
          </Link>

          {/* Nav List */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-brand-charcoal text-brand-gold border border-amber-400/30 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-brand-gold' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-charcoal text-brand-gold flex items-center justify-center font-bold text-xs border border-amber-400/30">
              AD
            </div>
            <div>
              <p className="text-xs font-bold text-white">Chief Admin</p>
              <p className="text-[10px] text-slate-400">admin@grandvenue.com</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-2">
            <Link href="/" className="text-slate-400 hover:text-white font-medium">
              View Public Site
            </Link>
            <Link href="/login" className="text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold">
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 h-16 px-4 sm:px-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 hidden sm:inline-block">
              Operations Control Panel
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live System Online</span>
            </div>

            <Link
              href="/"
              className="hidden sm:inline-flex text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              Public Website ↗
            </Link>
          </div>
        </header>

        {/* Mobile Sidebar Modal */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex">
            <div className="w-72 bg-brand-navy text-slate-300 p-6 flex flex-col justify-between h-full shadow-2xl">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-white font-serif">Admin Menu</span>
                  <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="space-y-1.5">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                        isActive(item.href) ? 'bg-brand-charcoal text-brand-gold' : 'text-slate-400'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <Link href="/login" className="text-rose-400 text-xs font-bold flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Route Children */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
