'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Building2, 
  Search, 
  CalendarCheck2, 
  User, 
  Menu, 
  X, 
  ShieldCheck, 
  Heart,
  ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // If in admin route, hide customer navbar
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Explore Venues', href: '/venues' },
    { label: 'Categories', href: '/categories' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-navy via-brand-charcoal to-brand-slate flex items-center justify-center text-brand-gold shadow-md group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-brand-charcoal font-serif">
                Grand<span className="text-brand-gold">Venue</span>
              </span>
              <span className="text-[10px] tracking-wider uppercase text-slate-500 font-semibold">
                Event & Venue Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-brand-gold ${
                  isActive(link.href)
                    ? 'text-brand-gold font-semibold'
                    : 'text-slate-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/venues"
              className="p-2.5 text-slate-500 hover:text-brand-charcoal hover:bg-slate-100 rounded-full transition-colors"
              title="Search Venues"
            >
              <Search className="w-5 h-5" />
            </Link>

            <Link
              href="/dashboard/saved"
              className="p-2.5 text-slate-500 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors relative"
              title="Saved Venues"
            >
              <Heart className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-gold rounded-full" />
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-brand-charcoal px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <CalendarCheck2 className="w-4 h-4 text-brand-gold" />
              <span>My Bookings</span>
            </Link>

            {/* User Dropdown / Auth CTA */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-700 transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-brand-charcoal text-brand-gold flex items-center justify-center text-xs font-semibold">
                  K
                </div>
                <span>Karthik</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setProfileDropdownOpen(false)}
                >
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="text-sm font-semibold text-slate-900 truncate">karthik.s@gmail.com</p>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <CalendarCheck2 className="w-4 h-4 text-slate-400" />
                    Customer Dashboard
                  </Link>

                  <Link
                    href="/dashboard/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    My Profile
                  </Link>

                  <div className="border-t border-slate-100 my-1" />

                  <Link
                    href="/admin/dashboard"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-brand-gold font-semibold hover:bg-amber-50/50 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-brand-gold" />
                    Admin Command Portal
                  </Link>

                  <div className="border-t border-slate-100 my-1" />

                  <Link
                    href="/login"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    Sign Out
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/venues"
              className="bg-brand-charcoal hover:bg-brand-navy text-brand-gold font-medium px-5 py-2.5 rounded-xl text-sm transition-all shadow-sm hover:shadow-md"
            >
              Book a Venue
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-3">
            <Link
              href="/venues"
              className="p-2 text-slate-600 hover:text-brand-charcoal"
            >
              <Search className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-brand-charcoal focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                isActive(link.href)
                  ? 'bg-amber-50 text-brand-gold font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-slate-200 pt-3 space-y-2">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg text-base font-medium"
            >
              <CalendarCheck2 className="w-5 h-5 text-brand-gold" />
              My Bookings & Dashboard
            </Link>
            <Link
              href="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-brand-gold hover:bg-amber-50 rounded-lg text-base font-semibold"
            >
              <ShieldCheck className="w-5 h-5" />
              Admin Portal
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center bg-brand-charcoal text-brand-gold py-2.5 rounded-xl font-medium mt-2"
            >
              Login / Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
