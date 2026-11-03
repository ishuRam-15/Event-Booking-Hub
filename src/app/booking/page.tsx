'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, 
  Layers, 
  Calendar, 
  Clock, 
  Users, 
  Sparkles, 
  CreditCard, 
  CheckCircle2, 
  Printer, 
  Download, 
  ArrowRight, 
  ArrowLeft, 
  QrCode, 
  FileText, 
  ShieldCheck,
  Check,
  Building,
  Info,
  BadgePercent
} from 'lucide-react';
import { MOCK_VENUES } from '@/lib/mock-data';
import { formatCurrency, formatArea, calculateGST, formatDate } from '@/lib/utils';
import { Venue, VenueBlock } from '@/types';

function BookingWorkflowContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Find venue from params or default to first
  const venueId = searchParams.get('venue') || MOCK_VENUES[0].id;
  const initialVenue = MOCK_VENUES.find((v) => v.id === venueId) || MOCK_VENUES[0];

  // Steps: 1 to 10
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [venue, setVenue] = useState<Venue>(initialVenue);

  // Form States
  const paramBlocks = searchParams.get('blocks')?.split(',') || [];
  const defaultSelectedBlocks = paramBlocks.length > 0
    ? paramBlocks
    : [initialVenue.blocks[0]?.id || '', initialVenue.blocks[1]?.id || ''];
  const [selectedBlockIds, setSelectedBlockIds] = useState<string[]>(defaultSelectedBlocks);

  const [eventDate, setEventDate] = useState(searchParams.get('date') || '2026-11-14');
  const [timeSlot, setTimeSlot] = useState<'morning' | 'evening' | 'full-day'>(
    (searchParams.get('slot') as any) || 'full-day'
  );

  const [selectedAddons, setSelectedAddons] = useState<string[]>([
    '250 kVA Generator Fuel Backup (24 Hrs Guaranteed)',
    'Valet Parking Staff Management (10 Attendants)',
    'Executive Bridal & Guest Suites (4 Luxury Suites)',
    'Commercial Gas & Deep Clean Sanitation',
  ]);

  const [eventType, setEventType] = useState('Wedding & Grand Reception');
  const [guestCount, setGuestCount] = useState(1200);
  const [customerName, setCustomerName] = useState('Karthik Subramanian');
  const [customerEmail, setCustomerEmail] = useState('karthik.s@gmail.com');
  const [customerPhone, setCustomerPhone] = useState('+91 98401 23456');
  const [customerGstin, setCustomerGstin] = useState('33AAAAA0000A1Z5');
  const [isInterstate, setIsInterstate] = useState(false);

  // Payment Plan from Stitch: Option A (25% Advance) vs Option B (100% Full Payment with 2% discount)
  const [paymentOption, setPaymentOption] = useState<'advance' | 'full'>('advance');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [bookingReference] = useState('GV-MAA-9402');

  const addonsList = [
    { name: '250 kVA Generator Fuel Backup (24 Hrs Guaranteed)', price: 18000 },
    { name: 'Valet Parking Staff Management (10 Attendants)', price: 12000 },
    { name: 'Executive Bridal & Guest Suites (4 Luxury Suites)', price: 20000 },
    { name: 'Commercial Gas & Deep Clean Sanitation', price: 10000 },
  ];

  // Pricing Calculations (with Stitch Multi-Block Combo Discount & 2% Full Payment Waiver)
  const selectedBlocks = venue.blocks.filter((b) => selectedBlockIds.includes(b.id));
  const rawBaseRental = selectedBlocks.reduce(
    (sum, b) => sum + (timeSlot === 'full-day' ? b.pricePerDay * 2 : (b.halfDayPrice || b.pricePerDay * 0.65)),
    0
  );

  // Multi-block Privilege Combo discount (10% if 2 or more blocks)
  const comboDiscount = selectedBlocks.length >= 2 ? Math.round(rawBaseRental * 0.1) : 0;
  const baseRental = rawBaseRental - comboDiscount;

  const facilitiesCost = addonsList
    .filter((a) => selectedAddons.includes(a.name))
    .reduce((sum, a) => sum + a.price, 0);

  const securityDeposit = venue.policies.securityDeposit; // ₹50,000 caution deposit
  const taxableAmount = baseRental + facilitiesCost; // SAC 997212 Valuation
  const gst = calculateGST(taxableAmount, isInterstate);
  const rawGrossTotal = taxableAmount + gst.totalGst + securityDeposit;

  // 2% prompt settlement waiver if Option B (100% full payment)
  const fullPaymentDiscount = paymentOption === 'full' ? Math.round(rawGrossTotal * 0.02) : 0;
  const grossTotal = rawGrossTotal - fullPaymentDiscount;

  const advanceRequired = Math.round(grossTotal * 0.25);
  const amountToPayNow = paymentOption === 'advance' ? advanceRequired : grossTotal;

  const toggleBlock = (blockId: string) => {
    setSelectedBlockIds((prev) => {
      if (prev.includes(blockId)) {
        if (prev.length === 1) return prev;
        return prev.filter((id) => id !== blockId);
      }
      return [...prev, blockId];
    });
  };

  const toggleAddon = (addonName: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonName) ? prev.filter((a) => a !== addonName) : [...prev, addonName]
    );
  };

  const handleNextStep = () => {
    if (currentStep < 10) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#FAF8FF] min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Step Progress Tracker */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm no-print">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
                  Step {currentStep} of 10
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  SAC Code: 997212 (Taxable Commercial Lease)
                </span>
              </div>
              <h1 className="text-xl font-bold font-serif text-slate-900 mt-1">
                {currentStep === 1 && 'Step 1: Select Venue Compound'}
                {currentStep === 2 && 'Step 2: Select Architectural Blocks'}
                {currentStep === 3 && 'Step 3: Select Event Dates & Timing Slot'}
                {currentStep === 4 && 'Step 4: Select Required Utilities & Facilities'}
                {currentStep === 5 && 'Step 5: Event Scale & Patron Capacity'}
                {currentStep === 6 && 'Step 6: Tariff & Price Breakdown'}
                {currentStep === 7 && 'Step 7: Statutory GST Computation (18%)'}
                {currentStep === 8 && 'Step 8: Booking Summary Review'}
                {currentStep === 9 && 'Step 9: Advance Deposit & Payment Schedule'}
                {currentStep === 10 && 'Step 10: Official Booking Confirmation & GST Tax Invoice'}
              </h1>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-500 block">Property:</span>
              <span className="text-sm font-bold text-slate-900 font-serif">{venue.name}</span>
            </div>
          </div>

          {/* 10-Step Progress Dots / Bar */}
          <div className="grid grid-cols-10 gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((stepNum) => (
              <div
                key={stepNum}
                onClick={() => stepNum <= currentStep && setCurrentStep(stepNum)}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  stepNum === currentStep
                    ? 'bg-brand-gold ring-2 ring-brand-gold/30'
                    : stepNum < currentStep
                    ? 'bg-brand-charcoal'
                    : 'bg-slate-200'
                }`}
                title={`Step ${stepNum}`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: SELECT VENUE */}
        {currentStep === 1 && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-bold font-serif text-slate-900">Select Venue Compound</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {MOCK_VENUES.map((v) => (
                <div
                  key={v.id}
                  onClick={() => {
                    setVenue(v);
                    setSelectedBlockIds([v.blocks[0].id]);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    venue.id === v.id
                      ? 'border-brand-gold ring-2 ring-brand-gold/30 shadow-md bg-amber-50/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img
                    src={v.images[0]}
                    alt={v.name}
                    className="w-full h-36 object-cover rounded-xl mb-3"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded uppercase">
                      {v.city}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {v.blocks.length} Blocks
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 font-serif mt-1">{v.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{v.tagline}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleNextStep}
                className="bg-brand-charcoal hover:bg-brand-navy text-brand-gold font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-2"
              >
                <span>Continue to Select Blocks</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SELECT BLOCKS */}
        {currentStep === 2 && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold font-serif text-slate-900">Select Blocks within {venue.name}</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select single or multiple blocks (e.g. Block A for Marriage & Block B for Feasting).
                </p>
              </div>
              <span className="text-xs font-bold text-brand-gold bg-slate-900 px-3 py-1.5 rounded-full">
                {selectedBlockIds.length} Block(s) Selected
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {venue.blocks.map((block) => {
                const selected = selectedBlockIds.includes(block.id);
                return (
                  <div
                    key={block.id}
                    onClick={() => toggleBlock(block.id)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      selected
                        ? 'border-brand-gold ring-2 ring-brand-gold/30 bg-amber-50/20 shadow-md'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                          {block.code}
                        </span>
                        {selected ? (
                          <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            <Check className="w-3.5 h-3.5" />
                            <span>Included</span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">Click to add</span>
                        )}
                      </div>

                      <h4 className="font-bold text-base font-serif text-slate-900">{block.name}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2">{block.description}</p>

                      <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                        <div className="flex justify-between">
                          <span>Built-up Area:</span>
                          <span className="font-bold">{formatArea(block.totalBuiltUpAreaSqFt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Seating:</span>
                          <span className="font-bold">{block.seatingCapacity.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Guest Rooms:</span>
                          <span className="font-bold">{block.guestRoomsCount} Rooms</span>
                        </div>
                        <div className="flex justify-between">
                          <span>AC Status:</span>
                          <span className="font-bold text-emerald-700">{block.isAirConditioned ? 'Central HVAC' : 'Non-AC'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
                      <span className="text-xs text-slate-400">Base Rate:</span>
                      <span className="text-base font-extrabold text-brand-charcoal">
                        {formatCurrency(block.pricePerDay)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handlePrevStep}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 px-4 py-2"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="bg-brand-charcoal hover:bg-brand-navy text-brand-gold font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-2"
              >
                <span>Continue to Dates</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: DATE & TIME */}
        {currentStep === 3 && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-bold font-serif text-slate-900">Select Event Dates & Timing Slot</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Select Event Start Date
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-brand-gold cursor-pointer"
                />
                <p className="text-xs text-emerald-700 font-medium flex items-center gap-1.5 pt-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>All selected blocks are available on {formatDate(eventDate)}!</span>
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Timing Slot Configuration
                </label>
                <div className="space-y-2">
                  {[
                    { slot: 'morning', label: 'Morning Muhurtham Slot', time: '05:00 AM – 02:00 PM', rateMultiplier: 0.65 },
                    { slot: 'evening', label: 'Evening Reception Slot', time: '03:00 PM – 11:30 PM', rateMultiplier: 0.70 },
                    { slot: 'full-day', label: 'Full 2-Day Package (6:00 AM - 11:00 PM)', time: '48-Hour Full Access', rateMultiplier: 1.0 },
                  ].map((s) => (
                    <div
                      key={s.slot}
                      onClick={() => setTimeSlot(s.slot as any)}
                      className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                        timeSlot === s.slot
                          ? 'border-brand-gold bg-amber-50/30 ring-1 ring-brand-gold'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <h5 className="font-bold text-sm text-slate-900">{s.label}</h5>
                        <span className="text-xs text-slate-500">{s.time}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-800">
                        {s.rateMultiplier === 1.0 ? 'Standard 2-Day' : `${s.rateMultiplier * 100}% Base`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handlePrevStep}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 px-4 py-2"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="bg-brand-charcoal hover:bg-brand-navy text-brand-gold font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-2"
              >
                <span>Continue to Facilities</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SELECT FACILITIES */}
        {currentStep === 4 && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-bold font-serif text-slate-900">Add-on Utilities & Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addonsList.map((addon) => {
                const checked = selectedAddons.includes(addon.name);
                return (
                  <div
                    key={addon.name}
                    onClick={() => toggleAddon(addon.name)}
                    className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      checked
                        ? 'border-brand-gold bg-amber-50/20 ring-1 ring-brand-gold shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${
                          checked ? 'bg-brand-gold text-slate-950' : 'border border-slate-300'
                        }`}
                      >
                        {checked && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{addon.name}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-800">{formatCurrency(addon.price)}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handlePrevStep}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 px-4 py-2"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="bg-brand-charcoal hover:bg-brand-navy text-brand-gold font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-2"
              >
                <span>Continue to Event Scale</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: EVENT SCALE & PATRON DETAILS */}
        {currentStep === 5 && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-bold font-serif text-slate-900">Event Scale & Patron Capacity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Occasion Format</label>
                <input
                  type="text"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Estimated Patrons (Guests)</label>
                <input
                  type="number"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Primary Host Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Host Mobile Number</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Billing Email</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">GSTIN (For Business ITC Credit)</label>
                <input
                  type="text"
                  placeholder="33AAAAA0000A1Z5"
                  value={customerGstin}
                  onChange={(e) => setCustomerGstin(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-brand-gold font-mono font-bold uppercase"
                />
              </div>
            </div>

            {/* B2B GSTIN Callout from Stitch */}
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center justify-between text-xs text-emerald-900">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold">Valid Tamil Nadu Corporate GSTIN detected: 100% ITC Input Tax Credit Approved</span>
              </div>
              <span className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded">Eligible</span>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handlePrevStep}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 px-4 py-2"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="bg-brand-charcoal hover:bg-brand-navy text-brand-gold font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-2"
              >
                <span>Continue to Tariff & Tax</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6 & 7: TARIFF & STATUTORY GST COMPUTATION (EXACT STITCH STRUCTURE) */}
        {(currentStep === 6 || currentStep === 7) && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-serif text-slate-900">
                  Tariff & Tax Computation (SAC 997212)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Taxable Commercial Lease Valuation compliant with Indian GST Act
                </p>
              </div>

              {/* State Tax Toggle Button Group from Stitch */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setIsInterstate(false)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    !isInterstate
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Intra-State (TN: CGST 9% + SGST 9%)
                </button>
                <button
                  type="button"
                  onClick={() => setIsInterstate(true)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    isInterstate
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Inter-State (IGST 18%)
                </button>
              </div>
            </div>

            {/* Price Structure Box */}
            <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200 text-sm">
              {/* 1. Base Rentals */}
              <div>
                <div className="flex justify-between font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">
                  <span>1. Base Hall Rentals</span>
                  <span>2 Calendar Days</span>
                </div>
                <div className="space-y-2 text-xs">
                  {selectedBlocks.map((b) => (
                    <div key={b.id} className="flex justify-between items-center">
                      <div>
                        <span className="font-bold text-slate-900">{b.name}</span>
                        <p className="text-[11px] text-slate-500">{formatCurrency(b.pricePerDay)} / day × 2 days</p>
                      </div>
                      <span className="font-bold text-slate-900">{formatCurrency(b.pricePerDay * 2)}</span>
                    </div>
                  ))}

                  {/* Multi-Block Combo Discount Row from Stitch */}
                  {comboDiscount > 0 && (
                    <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl flex items-center justify-between text-emerald-900 font-bold">
                      <div className="flex items-center gap-1.5">
                        <BadgePercent className="w-4 h-4 text-emerald-600" />
                        <span>Privilege Combo Savings (-10% on Dual-Hall Booking)</span>
                      </div>
                      <span>-{formatCurrency(comboDiscount)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Add-ons */}
              <div className="pt-3 border-t border-slate-200">
                <div className="flex justify-between font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">
                  <span>2. Add-on Utilities & Facilities</span>
                  <span>Included Services</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  {addonsList.map((a) => (
                    <div key={a.name} className="flex justify-between">
                      <span className="text-slate-700">{a.name}</span>
                      <span className="font-semibold">{formatCurrency(a.price)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Taxable Subtotal Box */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">SAC 997212 Assessment</span>
                  <p className="font-bold text-slate-900 text-sm">Total Taxable Value</p>
                </div>
                <span className="text-xl font-extrabold text-slate-900">{formatCurrency(taxableAmount)}</span>
              </div>

              {/* 4. Statutory GST (18%) */}
              <div className="space-y-1.5 pt-2 text-xs">
                {!isInterstate ? (
                  <>
                    <div className="flex justify-between">
                      <span>Central GST (CGST @ 9.0%)</span>
                      <span className="font-bold">{formatCurrency(gst.cgst)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>State GST (SGST @ 9.0%)</span>
                      <span className="font-bold">{formatCurrency(gst.sgst)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between">
                    <span>Integrated GST (IGST @ 18.0%)</span>
                    <span className="font-bold">{formatCurrency(gst.igst)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-brand-gold pt-1 border-t border-slate-200">
                  <span>Aggregate GST Liability</span>
                  <span>{formatCurrency(gst.totalGst)}</span>
                </div>
              </div>

              {/* 5. Refundable Caution Deposit */}
              <div className="flex justify-between py-2 border-t border-slate-200 text-xs">
                <div>
                  <span className="font-bold text-slate-800">Refundable Security Caution Deposit</span>
                  <p className="text-[10px] text-slate-500">100% Non-Taxable escrow. Reimbursed within 48h.</p>
                </div>
                <span className="font-bold text-slate-900">{formatCurrency(securityDeposit)}</span>
              </div>

              {/* Gross Total */}
              <div className="flex justify-between py-3 border-t-2 border-slate-300 font-extrabold text-xl text-slate-900">
                <span>Total Reservation Value</span>
                <span className="text-brand-charcoal">{formatCurrency(rawGrossTotal)}</span>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handlePrevStep}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 px-4 py-2"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="bg-brand-charcoal hover:bg-brand-navy text-brand-gold font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-2"
              >
                <span>Continue to Summary</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 8: FINAL SUMMARY */}
        {currentStep === 8 && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-bold font-serif text-slate-900">Final Booking Summary Review</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 font-serif text-sm">Venue & Block Reservation</h4>
                <div className="space-y-1 text-slate-600">
                  <p><span className="font-semibold">Venue:</span> {venue.name}</p>
                  <p><span className="font-semibold">Location:</span> {venue.address}</p>
                  <p><span className="font-semibold">Reserved Blocks:</span> {selectedBlocks.map((b) => b.name).join(', ')}</p>
                  <p><span className="font-semibold">Event Dates:</span> Nov 14 – Nov 15, 2026 (2 Full Days)</p>
                  <p><span className="font-semibold">Capacity:</span> {guestCount.toLocaleString()} Guests</p>
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 font-serif text-sm">Host & Billing Reconciliation</h4>
                <div className="space-y-1 text-slate-600">
                  <p><span className="font-semibold">Host Name:</span> {customerName}</p>
                  <p><span className="font-semibold">Phone:</span> {customerPhone}</p>
                  <p><span className="font-semibold">Email:</span> {customerEmail}</p>
                  <p><span className="font-semibold">GSTIN:</span> {customerGstin}</p>
                  <p><span className="font-semibold">Tax Treatment:</span> {isInterstate ? 'Inter-state IGST 18%' : 'Intra-state CGST 9% + SGST 9%'}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handlePrevStep}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 px-4 py-2"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="bg-brand-charcoal hover:bg-brand-navy text-brand-gold font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-2"
              >
                <span>Proceed to Payment Schedule</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 9: PAYMENT SCHEDULE (OPTION A VS OPTION B FROM STITCH) */}
        {currentStep === 9 && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-bold font-serif text-slate-900">Select Payment Schedule</h2>

            {/* Option A vs Option B Cards */}
            <div className="space-y-4">
              {/* Option A */}
              <div
                onClick={() => setPaymentOption('advance')}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  paymentOption === 'advance'
                    ? 'border-brand-gold bg-amber-50/20 ring-2 ring-brand-gold shadow-md'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        paymentOption === 'advance'
                          ? 'bg-brand-charcoal text-brand-gold'
                          : 'border border-slate-300'
                      }`}
                    >
                      {paymentOption === 'advance' && <Check className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900">Option A: 25% Advance Token Lock</h4>
                        <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Recommended
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Lock Palace dates immediately; balance payable 15 days prior to event.
                      </p>
                    </div>
                  </div>
                  <span className="text-lg font-extrabold text-brand-charcoal">
                    {formatCurrency(advanceRequired)}
                  </span>
                </div>
              </div>

              {/* Option B */}
              <div
                onClick={() => setPaymentOption('full')}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  paymentOption === 'full'
                    ? 'border-brand-gold bg-amber-50/20 ring-2 ring-brand-gold shadow-md'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        paymentOption === 'full'
                          ? 'bg-brand-charcoal text-brand-gold'
                          : 'border border-slate-300'
                      }`}
                    >
                      {paymentOption === 'full' && <Check className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900">Option B: 100% Full Settlement</h4>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Save {formatCurrency(Math.round(rawGrossTotal * 0.02))} (2% Prompt Waiver)
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Complete settlement completed today. Zero balance remaining.
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-brand-charcoal block">
                      {formatCurrency(rawGrossTotal - Math.round(rawGrossTotal * 0.02))}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      {formatCurrency(rawGrossTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Select Gateway Channel
              </label>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3.5 rounded-xl border font-bold flex flex-col items-center justify-center gap-1.5 ${
                    paymentMethod === 'upi'
                      ? 'border-brand-gold bg-amber-50/30 ring-1 ring-brand-gold text-slate-900'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-brand-gold" />
                  <span>UPI / QR Scan</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3.5 rounded-xl border font-bold flex flex-col items-center justify-center gap-1.5 ${
                    paymentMethod === 'card'
                      ? 'border-brand-gold bg-amber-50/30 ring-1 ring-brand-gold text-slate-900'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-brand-gold" />
                  <span>Cards / Corporate</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-3.5 rounded-xl border font-bold flex flex-col items-center justify-center gap-1.5 ${
                    paymentMethod === 'netbanking'
                      ? 'border-brand-gold bg-amber-50/30 ring-1 ring-brand-gold text-slate-900'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <Building className="w-5 h-5 text-brand-gold" />
                  <span>Net Banking / NEFT</span>
                </button>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handlePrevStep}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 px-4 py-2"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="bg-brand-charcoal hover:bg-brand-navy text-brand-gold font-bold px-8 py-3.5 rounded-xl text-sm flex items-center gap-2 shadow-lg"
              >
                <span>Authorize & Pay {formatCurrency(amountToPayNow)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 10: CONFIRMATION & PRINTABLE GST INVOICE */}
        {currentStep === 10 && (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6 print-shadow-none">
              <div className="text-center space-y-3 no-print">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3.5 py-1 rounded-full">
                  Dates Reserved & Locked
                </span>
                <h2 className="text-3xl font-extrabold font-serif text-slate-900">
                  Registry Reference: {bookingReference}
                </h2>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Confirmation dispatched to {customerEmail}. Below is your statutory GST Tax Invoice adhering to SAC 997212.
                </p>

                <div className="flex items-center justify-center gap-4 pt-2">
                  <button
                    onClick={() => window.print()}
                    className="bg-brand-charcoal text-brand-gold font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md hover:bg-brand-navy"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print GST Tax Invoice</span>
                  </button>
                  <Link
                    href="/dashboard"
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-5 py-2.5 rounded-xl text-xs"
                  >
                    Go to Customer Dashboard
                  </Link>
                </div>
              </div>

              {/* STATUTORY TAX INVOICE */}
              <div className="mt-8 border-2 border-slate-800 p-8 rounded-2xl bg-white text-slate-900 text-xs space-y-6">
                <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4">
                  <div>
                    <h3 className="text-xl font-bold font-serif uppercase tracking-wider">
                      Tax Invoice
                    </h3>
                    <p className="text-[10px] text-slate-500 uppercase font-semibold">
                      Under Section 31 of CGST Act, 2017
                    </p>
                    <p className="font-bold text-slate-900 mt-2 text-sm">{venue.name}</p>
                    <p className="text-[11px] text-slate-600">{venue.address}</p>
                    <p className="text-[11px] font-semibold text-slate-800">GSTIN: 33AAAAA0000A1Z5 · State: Tamil Nadu (33)</p>
                  </div>

                  <div className="text-right space-y-1">
                    <p className="font-bold text-sm">Invoice #: INV-2026-9041</p>
                    <p className="text-slate-600">Booking Ref: {bookingReference}</p>
                    <p className="text-slate-600">Date of Invoice: {formatDate(new Date().toISOString())}</p>
                    <p className="text-slate-600">Event Dates: Nov 14 – Nov 15, 2026</p>
                    <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      PAID / CONFIRMED
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Billed To (Host):</span>
                    <p className="font-bold text-slate-900 text-sm mt-0.5">{customerName}</p>
                    <p className="text-slate-600">{customerPhone} · {customerEmail}</p>
                    <p className="text-slate-600 font-mono">GSTIN / UIN: {customerGstin}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Scope of Lease:</span>
                    <p className="font-semibold text-slate-800 mt-0.5">{eventType}</p>
                    <p className="text-slate-600">Blocks: {selectedBlocks.map((b) => b.name).join(' + ')}</p>
                    <p className="text-slate-600">2-Day Full Estate Lease</p>
                  </div>
                </div>

                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-600">
                      <th className="py-2">Description of Services</th>
                      <th className="py-2">SAC Code</th>
                      <th className="py-2 text-right">Taxable Value</th>
                      <th className="py-2 text-right">CGST (9%)</th>
                      <th className="py-2 text-right">SGST (9%)</th>
                      <th className="py-2 text-right">Total (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="py-2.5">
                        <span className="font-bold block">Commercial Lease of Event Blocks</span>
                        <span className="text-[10px] text-slate-500">{selectedBlocks.map((b) => b.code).join(' + ')} on Nov 14-15</span>
                      </td>
                      <td className="py-2.5 font-mono">997212</td>
                      <td className="py-2.5 text-right font-medium">{formatCurrency(baseRental)}</td>
                      <td className="py-2.5 text-right">{formatCurrency(Math.round(baseRental * 0.09))}</td>
                      <td className="py-2.5 text-right">{formatCurrency(Math.round(baseRental * 0.09))}</td>
                      <td className="py-2.5 text-right font-bold">{formatCurrency(Math.round(baseRental * 1.18))}</td>
                    </tr>
                    {facilitiesCost > 0 && (
                      <tr>
                        <td className="py-2.5">
                          <span className="font-bold block">Add-on Utilities & Facilities</span>
                          <span className="text-[10px] text-slate-500">{selectedAddons.join(', ')}</span>
                        </td>
                        <td className="py-2.5 font-mono">997212</td>
                        <td className="py-2.5 text-right font-medium">{formatCurrency(facilitiesCost)}</td>
                        <td className="py-2.5 text-right">{formatCurrency(Math.round(facilitiesCost * 0.09))}</td>
                        <td className="py-2.5 text-right">{formatCurrency(Math.round(facilitiesCost * 0.09))}</td>
                        <td className="py-2.5 text-right font-bold">{formatCurrency(Math.round(facilitiesCost * 1.18))}</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="border-t-2 border-slate-800 font-bold">
                    <tr>
                      <td colSpan={2} className="py-2">Taxable Subtotal</td>
                      <td className="py-2 text-right">{formatCurrency(taxableAmount)}</td>
                      <td className="py-2 text-right">{formatCurrency(gst.cgst)}</td>
                      <td className="py-2 text-right">{formatCurrency(gst.sgst)}</td>
                      <td className="py-2 text-right">{formatCurrency(taxableAmount + gst.totalGst)}</td>
                    </tr>
                    <tr>
                      <td colSpan={5} className="py-2 text-right">Refundable Caution Deposit (Non-Taxable):</td>
                      <td className="py-2 text-right">{formatCurrency(securityDeposit)}</td>
                    </tr>
                    <tr className="text-sm bg-slate-100">
                      <td colSpan={5} className="py-2.5 text-right font-extrabold uppercase">Total Invoice Amount:</td>
                      <td className="py-2.5 text-right font-extrabold text-brand-charcoal">{formatCurrency(grossTotal)}</td>
                    </tr>
                    <tr className="text-xs">
                      <td colSpan={5} className="py-2 text-right text-emerald-700">Amount Received Today ({paymentOption === 'advance' ? '25% Advance' : '100% Full'}):</td>
                      <td className="py-2 text-right text-emerald-700 font-bold">-{formatCurrency(amountToPayNow)}</td>
                    </tr>
                    {paymentOption === 'advance' && (
                      <tr className="text-xs">
                        <td colSpan={5} className="py-2 text-right text-amber-800">Balance Due (Prior to Check-in):</td>
                        <td className="py-2 text-right text-amber-800 font-bold">{formatCurrency(grossTotal - advanceRequired)}</td>
                      </tr>
                    )}
                  </tfoot>
                </table>

                <div className="flex justify-between items-end pt-4 border-t border-slate-300">
                  <div className="space-y-1 text-[10px] text-slate-500 max-w-md">
                    <p className="font-bold text-slate-700">Notes & Statutory Disclosures:</p>
                    <p>1. Computer-generated tax invoice issued in terms of Rule 46 of the CGST Rules, 2017.</p>
                    <p>2. Security deposit is refundable within 48 hours post-event completion following hall inspection.</p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 border border-slate-300 p-1 rounded-lg mx-auto flex items-center justify-center">
                      <QrCode className="w-14 h-14 text-slate-800" />
                    </div>
                    <span className="text-[9px] text-slate-400 block mt-1">Scan for Check-in Pass</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-slate-500">Loading reservation...</div>}>
      <BookingWorkflowContent />
    </Suspense>
  );
}
