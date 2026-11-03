'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart } from 'lucide-react';
import { MOCK_VENUES, MOCK_CURRENT_USER } from '@/lib/mock-data';
import VenueCard from '@/components/cards/VenueCard';

export default function SavedVenuesPage() {
  const savedVenues = MOCK_VENUES.filter((v) => MOCK_CURRENT_USER.savedVenueIds.includes(v.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Bookings</span>
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-serif text-slate-900">Saved Venues & Favourites</h1>
          <p className="text-xs text-slate-500 mt-1">
            Properties you have shortlisted for upcoming milestones.
          </p>
        </div>
        <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-full">
          {savedVenues.length} Saved Properties
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedVenues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>
    </div>
  );
}
