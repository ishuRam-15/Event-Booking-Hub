import React from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Users, 
  Maximize2, 
  Star, 
  Wind, 
  Layers, 
  ShieldCheck, 
  ArrowUpRight 
} from 'lucide-react';
import { Venue } from '@/types';
import { formatCurrency, formatArea } from '@/lib/utils';

interface VenueCardProps {
  venue: Venue;
}

export default function VenueCard({ venue }: VenueCardProps) {
  const primaryImage = venue.images[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80';
  const hasAcBlock = venue.blocks.some((b) => b.isAirConditioned);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1">
      {/* Image & Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={primaryImage}
          alt={venue.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 bg-brand-charcoal/80 backdrop-blur-md text-brand-gold text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-400/30">
            <Layers className="w-3.5 h-3.5" />
            <span>{venue.blocks.length} Dynamic Blocks</span>
          </div>

          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>{venue.rating.toFixed(1)}</span>
            <span className="text-slate-400 font-normal">({venue.reviewCount})</span>
          </div>
        </div>

        {/* Bottom Image Overlay Details */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
          <div className="flex items-center gap-1.5 text-xs font-medium bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg">
            <MapPin className="w-3.5 h-3.5 text-brand-gold" />
            <span className="truncate max-w-[200px]">{venue.area}, {venue.city}</span>
          </div>

          {venue.isVerified && (
            <div className="flex items-center gap-1 text-[11px] font-semibold bg-emerald-950/70 border border-emerald-400/40 text-emerald-300 px-2 py-0.5 rounded-md">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Verified</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
              {venue.category.replace('-', ' ')}
            </span>
            {hasAcBlock && (
              <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                <Wind className="w-3 h-3" />
                AC Available
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-gold transition-colors font-serif line-clamp-1">
            <Link href={`/venues/${venue.slug}`}>
              {venue.name}
            </Link>
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {venue.tagline}
          </p>
        </div>

        {/* Key Features Grid */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <Maximize2 className="w-4 h-4 text-slate-400" />
            <span>{formatArea(venue.totalBuiltUpAreaSqFt)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-slate-400" />
            <span>{venue.totalSeatingCapacity.toLocaleString()} Seating</span>
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-400 font-medium">Starts from</p>
            <p className="text-base font-extrabold text-brand-charcoal">
              {formatCurrency(venue.minPricePerDay)}
              <span className="text-xs text-slate-400 font-normal"> /day</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/venues/${venue.slug}`}
              className="text-xs font-semibold text-slate-700 hover:text-brand-charcoal bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-all"
            >
              Details
            </Link>
            <Link
              href={`/booking?venue=${venue.id}`}
              className="flex items-center gap-1 text-xs font-semibold text-brand-gold bg-brand-charcoal hover:bg-brand-navy px-3.5 py-2 rounded-xl transition-all shadow-sm"
            >
              <span>Book</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
