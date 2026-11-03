'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  FileCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  // If in admin route, hide customer footer
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-brand-navy text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-charcoal border border-amber-500/30 flex items-center justify-center text-brand-gold shadow-md">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white font-serif">
                  Grand<span className="text-brand-gold">Venue</span>
                </span>
                <span className="text-[10px] tracking-wider uppercase text-slate-400 font-semibold">
                  Luxury Venue & Event Reservation Platform
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed pr-6">
              Discover and secure premium convention centres, palatial marriage halls, and luxury banquet spaces with dynamic multi-block facilities, transparent GST billing, and verified venue blueprints.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-amber-300/90 bg-amber-950/40 border border-amber-500/20 px-3 py-1.5 rounded-full">
                <ShieldCheck className="w-4 h-4 text-brand-gold" />
                <span>100% Verified Properties</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/60 border border-slate-700 px-3 py-1.5 rounded-full">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>GST Compliant Invoicing</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white font-sans">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-brand-gold transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/venues" className="hover:text-brand-gold transition-colors">
                  Explore All Venues
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-brand-gold transition-colors">
                  Venue Categories
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-brand-gold transition-colors">
                  Customer Dashboard
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-gold transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-gold transition-colors">
                  Contact & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white font-sans">
              Venue Categories
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/venues?category=convention-centre" className="hover:text-brand-gold transition-colors">
                  Convention Centres
                </Link>
              </li>
              <li>
                <Link href="/venues?category=marriage-hall" className="hover:text-brand-gold transition-colors">
                  Marriage & Kalyana Halls
                </Link>
              </li>
              <li>
                <Link href="/venues?category=banquet-hall" className="hover:text-brand-gold transition-colors">
                  Banquet Halls
                </Link>
              </li>
              <li>
                <Link href="/venues?category=outdoor-lawn" className="hover:text-brand-gold transition-colors">
                  Outdoor Lawns & Pavilions
                </Link>
              </li>
              <li>
                <Link href="/venues?category=corporate" className="hover:text-brand-gold transition-colors">
                  Corporate Event Spaces
                </Link>
              </li>
              <li>
                <Link href="/venues?category=party-hall" className="hover:text-brand-gold transition-colors">
                  Party Halls
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Administrative */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white font-sans">
              Headquarters
            </h4>
            <div className="space-y-2.5 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <span>Level 7, Prestige Tower, Nungambakkam High Rd, Chennai - 600034</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-gold shrink-0" />
                <span>+91 (044) 4890 2200 / +91 98400 11223</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                <span>concierge@grandvenue.com</span>
              </div>
            </div>

            <div className="pt-3">
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-gold hover:text-white transition-colors bg-brand-charcoal/80 border border-amber-500/20 px-3 py-2 rounded-lg"
              >
                <span>Venue Admin Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} GrandVenue Booking Platforms Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-300">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-300">Terms of Service</Link>
            <Link href="/cancellation" className="hover:text-slate-300">Cancellation & Refund Policy</Link>
            <Link href="/gst-compliance" className="hover:text-slate-300">GST Compliance</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
