'use client';

import React from 'react';
import { 
  Building, 
  Users, 
  UtensilsCrossed, 
  Maximize2, 
  Bed, 
  Car, 
  Wind, 
  CheckCircle2, 
  Circle, 
  Sparkles,
  Bath
} from 'lucide-react';
import { VenueBlock } from '@/types';
import { formatCurrency, formatArea } from '@/lib/utils';

interface BlockCardProps {
  block: VenueBlock;
  isSelected?: boolean;
  onToggleSelect?: (blockId: string) => void;
  showSelectAction?: boolean;
}

export default function BlockCard({
  block,
  isSelected = false,
  onToggleSelect,
  showSelectAction = false,
}: BlockCardProps) {
  const primaryImage = block.images[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80';

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden bg-white ${
        isSelected
          ? 'border-brand-gold ring-2 ring-brand-gold/30 shadow-lg'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
      }`}
    >
      {/* Block Header Banner */}
      <div className="relative aspect-[16/8] overflow-hidden bg-slate-900">
        <img
          src={primaryImage}
          alt={block.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="bg-brand-charcoal/90 text-brand-gold text-xs font-bold px-3 py-1 rounded-full border border-amber-400/40 uppercase tracking-wide">
            {block.code}
          </span>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              block.isAirConditioned
                ? 'bg-emerald-500/90 text-white'
                : 'bg-slate-700/90 text-slate-200'
            }`}
          >
            {block.isAirConditioned ? 'Central AC' : 'Non-AC'}
          </span>
        </div>

        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
          <div>
            <h4 className="text-lg font-bold font-serif leading-snug">{block.name}</h4>
            <p className="text-xs text-slate-300">{block.description}</p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[10px] text-slate-300 block">Rental Rate</span>
            <span className="text-base font-extrabold text-amber-300">
              {formatCurrency(block.pricePerDay)}
              <span className="text-xs font-normal text-white"> /day</span>
            </span>
          </div>
        </div>
      </div>

      {/* Facilities & Square Footage Breakdown */}
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          {/* Total Built-up */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Total Area</span>
            <div className="flex items-center gap-1.5 font-bold text-slate-800 mt-0.5">
              <Maximize2 className="w-3.5 h-3.5 text-brand-gold" />
              <span>{formatArea(block.totalBuiltUpAreaSqFt)}</span>
            </div>
          </div>

          {/* Main Hall */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Main Hall Area</span>
            <div className="flex items-center gap-1.5 font-bold text-slate-800 mt-0.5">
              <Building className="w-3.5 h-3.5 text-blue-500" />
              <span>{formatArea(block.mainHallAreaSqFt)}</span>
            </div>
          </div>

          {/* Dining Area */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Dining Area</span>
            <div className="flex items-center gap-1.5 font-bold text-slate-800 mt-0.5">
              <UtensilsCrossed className="w-3.5 h-3.5 text-amber-600" />
              <span>{formatArea(block.diningAreaSqFt)}</span>
            </div>
          </div>

          {/* Seating Capacity */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Seating Capacity</span>
            <div className="flex items-center gap-1.5 font-bold text-slate-800 mt-0.5">
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>{block.seatingCapacity.toLocaleString()} (Max: {block.floatingCapacity})</span>
            </div>
          </div>

          {/* Guest Rooms */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">AC Guest Rooms</span>
            <div className="flex items-center gap-1.5 font-bold text-slate-800 mt-0.5">
              <Bed className="w-3.5 h-3.5 text-purple-600" />
              <span>{block.guestRoomsCount} Suites</span>
            </div>
          </div>

          {/* Parking */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Car Parking</span>
            <div className="flex items-center gap-1.5 font-bold text-slate-800 mt-0.5">
              <Car className="w-3.5 h-3.5 text-rose-500" />
              <span>{block.carParkingCapacity} Cars</span>
            </div>
          </div>
        </div>

        {/* Detailed Secondary Specs: Stage, Cooking, Washrooms */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-2 text-xs text-slate-600 border-t border-slate-100">
          <div>
            <span className="text-slate-400 font-medium">Stage:</span>{' '}
            <span className="font-semibold text-slate-800">{formatArea(block.stageAreaSqFt)}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Kitchen / Prep:</span>{' '}
            <span className="font-semibold text-slate-800">{formatArea(block.cookingAreaSqFt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-800">
              {block.washrooms.gents} Gents · {block.washrooms.ladies} Ladies · {block.washrooms.accessible} Accessible
            </span>
          </div>
        </div>

        {/* Amenities Pills */}
        <div className="pt-1 flex flex-wrap gap-1.5">
          {block.amenities.map((item, idx) => (
            <span
              key={idx}
              className="text-[11px] font-medium bg-amber-50/70 border border-amber-200/50 text-amber-900 px-2 py-0.5 rounded-md"
            >
              {item}
            </span>
          ))}
        </div>

        {/* Selection CTA */}
        {showSelectAction && (
          <div className="pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onToggleSelect && onToggleSelect(block.id)}
              className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                isSelected
                  ? 'bg-brand-gold text-slate-950 shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {isSelected ? (
                <>
                  <CheckCircle2 className="w-4 h-4 fill-slate-950 text-brand-gold" />
                  <span>Block Selected ({formatCurrency(block.pricePerDay)})</span>
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4 text-slate-400" />
                  <span>Select this Block (+{formatCurrency(block.pricePerDay)})</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
