'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart, Building2 } from 'lucide-react';
import { MOCK_VENUES, MOCK_CURRENT_USER } from '@/lib/mock-data';
import { getVenues } from '@/lib/dal/venues';
import VenueCard from '@/components/cards/VenueCard';
import { Venue } from '@/types';

export default function SavedVenuesPage() {
  const [venues, setVenues] = useState<Venue[]>(MOCK_VENUES);
  const [savedIds, setSavedIds] = useState<string[]>(MOCK_CURRENT_USER.savedVenueIds);

  useEffect(() => {
    async function loadData() {
      try {
        const liveVenues = await getVenues();
        if (liveVenues && liveVenues.length > 0) {
          setVenues(liveVenues);
        }
      } catch (err) {
        console.warn('Saved venues DAL fallback:', err);
      }
    }
    loadData();
  }, []);

  const savedVenues = venues.filter((v) => savedIds.includes(v.id));

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

      {savedVenues.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No saved venues yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Explore our curated catalog of luxury mandapams and convention estates to shortlist your favorites.
          </p>
          <Link
            href="/venues"
            className="inline-block bg-brand-charcoal text-brand-gold font-bold px-5 py-2.5 rounded-xl text-xs shadow-md"
          >
            Explore Venues Catalog →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedVenues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      )}
    </div>
  );
}
