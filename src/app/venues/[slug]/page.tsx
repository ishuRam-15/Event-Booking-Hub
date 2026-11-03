'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound, useParams, useRouter } from 'next/navigation';
import { 
  MapPin, 
  Star, 
  ShieldCheck, 
  Share2, 
  Heart, 
  Layers, 
  Calendar as CalendarIcon, 
  Maximize2, 
  Users, 
  Car, 
  Bed, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Info,
  Clock,
  Phone,
  Mail,
  ChevronRight,
  SlidersHorizontal,
  FileText
} from 'lucide-react';
import { MOCK_VENUES } from '@/lib/mock-data';
import BlockCard from '@/components/cards/BlockCard';
import BlockCompareModal from '@/components/modals/BlockCompareModal';
import { formatCurrency, formatArea } from '@/lib/utils';

export default function VenueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const venue = MOCK_VENUES.find((v) => v.slug === slug) || MOCK_VENUES[0];

  const [activeTab, setActiveTab] = useState<'overview' | 'blocks' | 'floorplans' | 'location' | 'policies' | 'reviews'>('blocks');
  const [selectedBlockTab, setSelectedBlockTab] = useState<string>('all');
  const [selectedBlockIds, setSelectedBlockIds] = useState<string[]>([venue.blocks[0]?.id || '']);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2026-12-15');
  const [timeSlot, setTimeSlot] = useState<'morning' | 'evening' | 'full-day'>('full-day');

  // Toggle block selection
  const handleToggleBlock = (blockId: string) => {
    setSelectedBlockIds((prev) => {
      if (prev.includes(blockId)) {
        if (prev.length === 1) return prev; // Keep at least one selected
        return prev.filter((id) => id !== blockId);
      } else {
        return [...prev, blockId];
      }
    });
  };

  // Calculate pricing based on selected blocks
  const selectedBlocks = venue.blocks.filter((b) => selectedBlockIds.includes(b.id));
  const baseRental = selectedBlocks.reduce((sum, b) => sum + (timeSlot === 'full-day' ? b.pricePerDay : (b.halfDayPrice || b.pricePerDay * 0.65)), 0);
  const securityDeposit = venue.policies.securityDeposit;
  const taxableAmount = baseRental;
  const cgst = Math.round(taxableAmount * 0.09);
  const sgst = Math.round(taxableAmount * 0.09);
  const grossTotal = taxableAmount + cgst + sgst + securityDeposit;
  const advanceRequired = Math.round(grossTotal * (venue.policies.advancePaymentPercentage / 100));

  const handleProceedToBooking = () => {
    const blockQuery = selectedBlockIds.join(',');
    router.push(`/booking?venue=${venue.id}&blocks=${blockQuery}&date=${selectedDate}&slot=${timeSlot}`);
  };

  return (
    <div className="bg-[#FBFBF9] min-h-screen pb-24">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-slate-900">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/venues" className="hover:text-slate-900">Venues</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-900 truncate max-w-[200px] sm:max-w-none">
              {venue.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all text-xs font-semibold ${
                isSaved
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
            <button
              onClick={() => alert('Link copied to clipboard!')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100 transition-all text-xs font-semibold"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Title & Ratings */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              {venue.category.replace('-', ' ')}
            </span>
            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Commercial Property</span>
            </div>
            <div className="flex items-center gap-1.5 bg-brand-charcoal text-brand-gold text-xs font-bold px-3 py-1 rounded-full">
              <Layers className="w-3.5 h-3.5" />
              <span>{venue.blocks.length} Dynamic Independent Blocks</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-slate-900 tracking-tight">
            {venue.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span className="font-bold text-slate-900">{venue.rating}</span>
              <span className="text-slate-400">({venue.reviewCount} verified reviews)</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-brand-gold" />
              <span>{venue.address}</span>
            </div>
          </div>
        </div>

        {/* High-Resolution Media Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-3xl overflow-hidden aspect-[16/8] sm:aspect-[16/7] bg-slate-900 shadow-md">
          <div className="md:col-span-2 relative h-full overflow-hidden group">
            <img
              src={venue.images[0]}
              alt={venue.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-4 left-4 bg-brand-charcoal/80 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg border border-amber-400/30">
              Grand Exterior & Front Courtyard
            </div>
          </div>
          <div className="hidden md:grid grid-rows-2 gap-3 col-span-1 h-full">
            <div className="relative overflow-hidden group h-full">
              <img
                src={venue.images[1] || venue.images[0]}
                alt="Main Hall Interior"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="relative overflow-hidden group h-full">
              <img
                src={venue.images[2] || venue.images[0]}
                alt="Dining Banquet"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
          <div className="hidden md:grid grid-rows-2 gap-3 col-span-1 h-full">
            <div className="relative overflow-hidden group h-full">
              <img
                src={venue.images[3] || venue.images[0]}
                alt="Stage Rigging & Lighting"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="relative overflow-hidden group h-full bg-slate-800 flex items-center justify-center">
              <img
                src={venue.floorPlanUrl || venue.images[0]}
                alt="Architectural Floor Blueprint"
                className="w-full h-full object-cover filter brightness-50"
              />
              <button
                onClick={() => setActiveTab('floorplans')}
                className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center hover:bg-black/40 transition-colors"
              >
                <Maximize2 className="w-6 h-6 text-brand-gold mb-1" />
                <span className="font-bold text-xs">View Floor Plans & 32 Photos</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabbed Navigation Bar */}
        <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 p-1.5 shadow-sm">
          <div className="flex items-center gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('blocks')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'blocks'
                  ? 'bg-brand-charcoal text-brand-gold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Dynamic Blocks ({venue.blocks.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'overview'
                  ? 'bg-brand-charcoal text-brand-gold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Overview & Facilities
            </button>

            <button
              onClick={() => setActiveTab('floorplans')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'floorplans'
                  ? 'bg-brand-charcoal text-brand-gold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Floor Plans & Blueprints</span>
            </button>

            <button
              onClick={() => setActiveTab('location')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'location'
                  ? 'bg-brand-charcoal text-brand-gold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Google Maps & Directions
            </button>

            <button
              onClick={() => setActiveTab('policies')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'policies'
                  ? 'bg-brand-charcoal text-brand-gold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Policies & GST Info
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'reviews'
                  ? 'bg-brand-charcoal text-brand-gold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Reviews ({venue.reviewCount})
            </button>
          </div>
        </div>

        {/* Main Content & Sticky Booking Rail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Tab Views */}
          <div className="lg:col-span-8 space-y-8">
            {/* TAB: DYNAMIC BLOCKS (Primary Focus) */}
            {activeTab === 'blocks' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold font-serif text-slate-900">
                      Independent Architectural Blocks
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      This venue houses <span className="font-bold text-slate-800">{venue.blocks.length} self-sufficient blocks</span>. Select single or multiple blocks according to your event requirements.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsCompareModalOpen(true)}
                    className="inline-flex items-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold px-4 py-2 rounded-xl text-xs transition-colors shrink-0"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-brand-gold" />
                    <span>Compare All {venue.blocks.length} Blocks Side-by-Side</span>
                  </button>
                </div>

                {/* Block Selector Pill Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <button
                    onClick={() => setSelectedBlockTab('all')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      selectedBlockTab === 'all'
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    All Blocks ({venue.blocks.length})
                  </button>

                  {venue.blocks.map((block) => (
                    <button
                      key={block.id}
                      onClick={() => setSelectedBlockTab(block.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                        selectedBlockTab === block.id
                          ? 'bg-brand-charcoal text-brand-gold border border-amber-400'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {block.code} - {block.name.split(' - ')[1] || block.name}
                    </button>
                  ))}
                </div>

                {/* Blocks Listing */}
                <div className="space-y-6">
                  {venue.blocks
                    .filter((b) => selectedBlockTab === 'all' || b.id === selectedBlockTab)
                    .map((block) => {
                      const isSelected = selectedBlockIds.includes(block.id);
                      return (
                        <BlockCard
                          key={block.id}
                          block={block}
                          isSelected={isSelected}
                          onToggleSelect={handleToggleBlock}
                          showSelectAction={true}
                        />
                      );
                    })}
                </div>
              </div>
            )}

            {/* TAB: OVERVIEW & FACILITIES */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-lg font-bold font-serif text-slate-900">About the Venue</h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-light">
                    {venue.description}
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-lg font-bold font-serif text-slate-900">Compound Facilities & Amenities</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {venue.facilities.map((facility, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0" />
                        <span className="font-semibold">{facility}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: FLOOR PLANS */}
            {activeTab === 'floorplans' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-lg font-bold font-serif text-slate-900">
                  Architectural Floor Plan & Compound Blueprint
                </h3>
                <p className="text-xs text-slate-500">
                  Detailed architectural layout showing entry portals, parking lanes, Block A ballroom, Block B dining banquet, and stage clearances.
                </p>
                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                  <img
                    src={venue.floorPlanUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'}
                    alt="Floor Plan"
                    className="w-full object-contain max-h-[500px]"
                  />
                </div>
              </div>
            )}

            {/* TAB: LOCATION & GOOGLE MAPS */}
            {activeTab === 'location' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-lg font-bold font-serif text-slate-900">Venue Location & Access</h3>
                <p className="text-xs text-slate-600">
                  {venue.address}
                </p>

                <div className="rounded-2xl overflow-hidden border border-slate-200 h-[400px]">
                  <iframe
                    title="Google Maps Location"
                    src={`https://www.google.com/maps?q=${venue.latitude},${venue.longitude}&hl=es;z=14&output=embed`}
                    className="w-full h-full border-0"
                    loading="lazy"
                  />
                </div>

                <div className="pt-2 flex items-center gap-4">
                  <a
                    href={venue.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-brand-charcoal hover:bg-brand-navy text-brand-gold px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Open in Google Maps App</span>
                  </a>
                </div>
              </div>
            )}

            {/* TAB: POLICIES */}
            {activeTab === 'policies' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold font-serif text-slate-900">Rental & Cancellation Policies</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {venue.policies.cancellation}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Advance Deposit</span>
                    <span className="text-base font-bold text-slate-900 mt-0.5 block">
                      {venue.policies.advancePaymentPercentage}% of Total
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Refundable Security Deposit</span>
                    <span className="text-base font-bold text-slate-900 mt-0.5 block">
                      {formatCurrency(venue.policies.securityDeposit)}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Standard Check-In</span>
                    <span className="text-base font-bold text-slate-900 mt-0.5 block">
                      {venue.policies.checkInTime}
                    </span>
                  </div>
                </div>

                <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl text-xs text-amber-900 space-y-1">
                  <p className="font-bold">GST Compliance (SAC 997212 - Rental of Event Halls):</p>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    All commercial venue invoices include statutory 18% GST (CGST 9% + SGST 9% for Intra-state or IGST 18% for Inter-state transactions). Registered businesses can claim Input Tax Credit by providing their GSTIN.
                  </p>
                </div>
              </div>
            )}

            {/* TAB: REVIEWS */}
            {activeTab === 'reviews' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold font-serif text-slate-900">Host Reviews & Ratings</h3>
                  <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 px-3 py-1 rounded-full text-xs font-bold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                    <span>{venue.rating} out of 5.0</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">Dr. Rajesh & Sunita</span>
                      <span className="text-[10px] text-slate-400">October 2026</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      "We booked both Block A and Block B for our daughter's wedding. The seamless access between the main wedding hall and the dining block kept all 2,000 guests comfortable."
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Booking Calculator Drawer */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-5">
              <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total Rental</span>
                  <p className="text-2xl font-extrabold text-brand-charcoal">
                    {formatCurrency(baseRental)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                    {selectedBlockIds.length} Block(s) Selected
                  </span>
                </div>
              </div>

              {/* Event Date Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5 text-brand-gold" />
                  Select Event Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-brand-gold cursor-pointer"
                />
              </div>

              {/* Slot Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-brand-gold" />
                  Time Slot
                </label>
                <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
                  {(['morning', 'evening', 'full-day'] as const).map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTimeSlot(slot)}
                      className={`py-1.5 text-[10px] font-bold rounded-lg uppercase transition-all ${
                        timeSlot === slot
                          ? 'bg-brand-charcoal text-brand-gold shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {slot.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Blocks List */}
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Configured Blocks:
                </span>
                {selectedBlocks.map((b) => (
                  <div key={b.id} className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-lg">
                    <span className="font-semibold text-slate-800">{b.name}</span>
                    <span className="font-bold text-slate-900">{formatCurrency(b.pricePerDay)}</span>
                  </div>
                ))}
              </div>

              {/* Live Cost Calculation Sheet */}
              <div className="space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Base Rental Subtotal</span>
                  <span className="font-semibold">{formatCurrency(taxableAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>CGST (9%)</span>
                  <span>{formatCurrency(cgst)}</span>
                </div>
                <div className="flex justify-between">
                  <span>SGST (9%)</span>
                  <span>{formatCurrency(sgst)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Security Deposit (Refundable)</span>
                  <span>{formatCurrency(securityDeposit)}</span>
                </div>
                <div className="flex justify-between font-extrabold text-sm text-slate-900 pt-2 border-t border-slate-200">
                  <span>Gross Total</span>
                  <span className="text-brand-gold">{formatCurrency(grossTotal)}</span>
                </div>
                <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200/60 flex justify-between items-center text-xs text-amber-950 font-bold mt-2">
                  <span>Advance to Lock ({venue.policies.advancePaymentPercentage}%)</span>
                  <span>{formatCurrency(advanceRequired)}</span>
                </div>
              </div>

              {/* Book Now Primary Button */}
              <button
                type="button"
                onClick={handleProceedToBooking}
                className="w-full bg-brand-charcoal hover:bg-brand-navy text-brand-gold font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group border border-amber-400/30"
              >
                <span>Proceed to Reserve</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="text-center">
                <p className="text-[11px] text-slate-400">
                  * Guaranteed dates reserved upon advance payment.
                </p>
              </div>
            </div>

            {/* Assistance card */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
              <span className="font-bold text-slate-900 block">Need a Custom Layout or Inquiry?</span>
              <p className="text-[11px] text-slate-500">Contact the dedicated venue manager directly for physical site visits.</p>
              <div className="flex items-center gap-2 font-semibold text-brand-gold pt-1">
                <Phone className="w-3.5 h-3.5" />
                <span>+91 (044) 4890 2200</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Modal */}
      <BlockCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        blocks={venue.blocks}
      />
    </div>
  );
}
