'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  MapPin, 
  Layers, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  Save, 
  Upload, 
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { VenueCategory } from '@/types';

export default function AddVenuePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState<VenueCategory>('convention-centre');
  const [city, setCity] = useState('Chennai');
  const [state, setState] = useState('Tamil Nadu');
  const [area, setArea] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('600101');
  const [latitude, setLatitude] = useState('13.0850');
  const [longitude, setLongitude] = useState('80.1980');
  const [minPrice, setMinPrice] = useState('150000');
  const [securityDeposit, setSecurityDeposit] = useState('50000');
  const [advancePercent, setAdvancePercent] = useState('25');

  // Dynamic blocks creation
  const [blocks, setBlocks] = useState([
    { name: 'Block A - Main Convention Hall', code: 'BLOCK-A', area: 24000, dining: 6500, seating: 1800, rooms: 10, parking: 200, price: 225000, ac: true },
    { name: 'Block B - Traditional Banquet Feasting', code: 'BLOCK-B', area: 18000, dining: 5000, seating: 1200, rooms: 12, parking: 150, price: 165000, ac: true },
    { name: 'Block C - Starlight Reception Lawn', code: 'BLOCK-C', area: 12000, dining: 4000, seating: 800, rooms: 2, parking: 80, price: 120000, ac: false },
  ]);

  const addBlock = () => {
    const nextLetter = String.fromCharCode(65 + blocks.length);
    setBlocks([
      ...blocks,
      {
        name: `Block ${nextLetter} - New Architectural Wing`,
        code: `BLOCK-${nextLetter}`,
        area: 10000,
        dining: 3000,
        seating: 600,
        rooms: 4,
        parking: 60,
        price: 90000,
        ac: true,
      },
    ]);
  };

  const removeBlock = (index: number) => {
    if (blocks.length > 1) {
      setBlocks(blocks.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Venue successfully created and dynamic blocks registered!');
    router.push('/admin/venues');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <Link
        href="/admin/venues"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Venues</span>
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-serif text-slate-900">Add New Venue Property</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Register a commercial venue with GPS mapping and dynamic block architecture
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: General Details */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <h3 className="text-base font-bold font-serif text-slate-900 border-b border-slate-100 pb-3">
            1. General Venue Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 uppercase">Venue Name</label>
              <input
                required
                type="text"
                placeholder="e.g. Imperial Heritage Convention Center"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Venue Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-brand-gold font-semibold"
              >
                <option value="convention-centre">Convention Centre</option>
                <option value="marriage-hall">Marriage & Kalyana Hall</option>
                <option value="banquet-hall">Banquet Hall</option>
                <option value="outdoor-lawn">Outdoor Lawn & Pavilion</option>
                <option value="corporate">Corporate Event Space</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Tagline / Subheading</label>
              <input
                type="text"
                placeholder="A majestic space for grand celebrations..."
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-brand-gold"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Location & Google Maps */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <h3 className="text-base font-bold font-serif text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-gold" />
            <span>2. Address & Google Maps Coordinates</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1 sm:col-span-3">
              <label className="text-xs font-bold text-slate-700 uppercase">Full Venue Address</label>
              <input
                required
                type="text"
                placeholder="Plot / Door No, Street, Locality..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Area / Locality</label>
              <input
                type="text"
                placeholder="e.g. Anna Nagar West"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">PIN Code</label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none"
              />
            </div>

            {/* Latitude & Longitude */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Latitude (GPS)</label>
              <input
                type="text"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Longitude (GPS)</label>
              <input
                type="text"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono"
              />
            </div>

            <div className="flex items-end">
              <div className="w-full p-2.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-semibold">
                ✓ Google Maps pin centered at ({latitude}, {longitude})
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Dynamic Multi-Block Builder */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold font-serif text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-gold" />
                <span>3. Dynamic Architectural Blocks (3 or More)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure independent blocks with separate built-up areas, dining capacities, and daily rates.
              </p>
            </div>
            <button
              type="button"
              onClick={addBlock}
              className="bg-brand-gold hover:bg-amber-500 text-brand-charcoal text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Another Block</span>
            </button>
          </div>

          <div className="space-y-4">
            {blocks.map((block, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold bg-brand-charcoal text-brand-gold px-2.5 py-0.5 rounded">
                      {block.code}
                    </span>
                    <input
                      type="text"
                      value={block.name}
                      onChange={(e) => {
                        const newBlocks = [...blocks];
                        newBlocks[idx].name = e.target.value;
                        setBlocks(newBlocks);
                      }}
                      className="text-sm font-bold bg-transparent text-slate-900 border-b border-slate-300 focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                  {blocks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeBlock(idx)}
                      className="text-rose-500 hover:text-rose-700 text-xs font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500">Built-up (sq.ft)</label>
                    <input
                      type="number"
                      value={block.area}
                      onChange={(e) => {
                        const newBlocks = [...blocks];
                        newBlocks[idx].area = Number(e.target.value);
                        setBlocks(newBlocks);
                      }}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500">Dining Area (sq.ft)</label>
                    <input
                      type="number"
                      value={block.dining}
                      onChange={(e) => {
                        const newBlocks = [...blocks];
                        newBlocks[idx].dining = Number(e.target.value);
                        setBlocks(newBlocks);
                      }}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500">Seating Capacity</label>
                    <input
                      type="number"
                      value={block.seating}
                      onChange={(e) => {
                        const newBlocks = [...blocks];
                        newBlocks[idx].seating = Number(e.target.value);
                        setBlocks(newBlocks);
                      }}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500">Rental Rate / Day (₹)</label>
                    <input
                      type="number"
                      value={block.price}
                      onChange={(e) => {
                        const newBlocks = [...blocks];
                        newBlocks[idx].price = Number(e.target.value);
                        setBlocks(newBlocks);
                      }}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 font-bold text-brand-gold"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href="/admin/venues"
            className="text-xs font-bold text-slate-600 bg-slate-200 hover:bg-slate-300 px-5 py-3 rounded-xl transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="bg-brand-charcoal hover:bg-brand-navy text-brand-gold font-bold px-8 py-3 rounded-xl text-xs flex items-center gap-2 shadow-md border border-amber-400/30 transition-all hover:scale-105"
          >
            <Save className="w-4 h-4" />
            <span>Save Venue & Blocks</span>
          </button>
        </div>
      </form>
    </div>
  );
}
