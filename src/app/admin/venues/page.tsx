'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Layers, 
  MapPin, 
  CheckCircle2, 
  ArrowUpRight 
} from 'lucide-react';
import { MOCK_VENUES } from '@/lib/mock-data';
import { getVenues } from '@/lib/dal/venues';
import { deleteVenueAction } from '@/app/actions/venue';
import { formatCurrency, formatArea } from '@/lib/utils';
import { Venue } from '@/types';

export default function AdminVenuesPage() {
  const [venues, setVenues] = useState<Venue[]>(MOCK_VENUES);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('All');

  useEffect(() => {
    async function loadData() {
      try {
        const liveVenues = await getVenues();
        if (liveVenues && liveVenues.length > 0) {
          setVenues(liveVenues);
        }
      } catch (err) {
        console.warn('Admin venues DAL fallback:', err);
      }
    }
    loadData();
  }, []);

  const filteredVenues = venues.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.area.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = cityFilter === 'All' || v.city === cityFilter;
    return matchesSearch && matchesCity;
  });

  const handleDelete = async (venueId: string) => {
    if (confirm('Are you sure you want to delete this venue and all associated blocks?')) {
      setVenues((prev) => prev.filter((v) => v.id !== venueId));
      try {
        await deleteVenueAction(venueId);
      } catch (err) {
        console.warn('Delete venue action warning:', err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-slate-900">Venue Management (CRUD)</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, update, inspect and manage multi-block venue properties
          </p>
        </div>

        <Link
          href="/admin/venues/new"
          className="bg-brand-charcoal hover:bg-brand-navy text-brand-gold font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm border border-amber-400/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Venue</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search venue name or locality..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 focus:outline-none focus:border-brand-gold"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-medium">Filter City:</span>
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
          >
            <option value="All">All Cities</option>
            <option value="Chennai">Chennai</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Hyderabad">Hyderabad</option>
          </select>
        </div>
      </div>

      {/* Venues Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-6">Venue Property</th>
                <th className="py-3 px-6">City & Area</th>
                <th className="py-3 px-6">Dynamic Blocks</th>
                <th className="py-3 px-6">Built-up Area</th>
                <th className="py-3 px-6">Daily Base Price</th>
                <th className="py-3 px-6">Verification</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredVenues.map((venue) => (
                <tr key={venue.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6 flex items-center gap-3">
                    <img
                      src={venue.images[0]}
                      alt={venue.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 font-serif text-sm">{venue.name}</h4>
                      <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-semibold uppercase">
                        {venue.category.replace('-', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-slate-900">{venue.city}</p>
                    <p className="text-[11px] text-slate-400">{venue.area}</p>
                  </td>
                  <td className="py-4 px-6">
                    <Link
                      href={`/admin/blocks?venueId=${venue.id}`}
                      className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-2.5 py-1 rounded-lg transition-colors"
                    >
                      <Layers className="w-3.5 h-3.5 text-brand-gold" />
                      <span>{venue.blocks.length} Blocks</span>
                    </Link>
                  </td>
                  <td className="py-4 px-6 font-medium">
                    {formatArea(venue.totalBuiltUpAreaSqFt)}
                  </td>
                  <td className="py-4 px-6 font-extrabold text-slate-900">
                    {formatCurrency(venue.minPricePerDay)}
                  </td>
                  <td className="py-4 px-6">
                    {venue.isVerified ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">Pending</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/venues/${venue.slug}`}
                        target="_blank"
                        className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                        title="View Live Listing"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/blocks?venueId=${venue.id}`}
                        className="p-1.5 text-brand-gold hover:text-amber-800 rounded-lg hover:bg-amber-50"
                        title="Manage Blocks"
                      >
                        <Layers className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(venue.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50"
                        title="Delete Venue"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
