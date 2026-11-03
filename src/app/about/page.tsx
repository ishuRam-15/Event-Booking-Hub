import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Award, Users, Building, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-16 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3.5 py-1.5 rounded-full">
          About GrandVenue
        </span>
        <h1 className="text-4xl font-extrabold font-serif text-slate-900 tracking-tight">
          Redefining Luxury Event Venue Reservations
        </h1>
        <p className="text-base text-slate-600 leading-relaxed font-light">
          GrandVenue is India's premier multi-block venue discovery and booking platform. We bridge the gap between discerning hosts and palatial venue compounds through architectural transparency, verified square footage, and instant GST-compliant reservations.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-brand-gold flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-serif text-slate-900">Physical On-Site Verification</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every hall, stage dimension, dining capacity, and parking lot listed on GrandVenue is physically measured and certified by our engineering team.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-serif text-slate-900">Dynamic Multi-Block Management</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Venues are treated as dynamic ecosystems. Book Block A for marriage rituals, Block B for feasts, and Block C for guest rooms with atomic calendar locks.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-serif text-slate-900">100% Statutory GST Accuracy</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Commercial invoicing compliant with SAC 997212. Enables instant Input Tax Credit (ITC) reconciliation for corporations and families.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
