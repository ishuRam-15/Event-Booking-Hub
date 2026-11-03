'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  Filter, 
  MapPin, 
  SlidersHorizontal, 
  RotateCcw, 
  Layers, 
  Grid3X3, 
  Map as MapIcon, 
  ChevronDown,
  Wind,
  Check,
  X
} from 'lucide-react';
import { MOCK_VENUES } from '@/lib/mock-data';
import VenueCard from '@/components/cards/VenueCard';
import { SearchFilterState } from '@/types';

function VenuesSearchContent() {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<SearchFilterState>({
    state: 'All',
    city: searchParams.get('city') || 'All',
    locality: '',
    category: searchParams.get('category') || 'All',
    distanceRadius: 25,
    minPrice: 50000,
    maxPrice: 600000,
    minSqFt: 5000,
    maxSqFt: 65000,
    minSeatingCapacity: 0,
    eventType: searchParams.get('type') || 'All',
    acType: 'all',
    selectedFacilities: [],
    minRooms: 0,
    minParking: 0,
    date: searchParams.get('date') || '',
    sortBy: 'popular',
  });

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  const facilitiesList = [
    'Central Air Conditioning',
    'Audio & Stage Lighting',
    'Bridal Suite with Private Salon',
    'Commercial Prep Kitchen',
    'Valet Parking Staff',
    '100% DG Power Backup',
    'Dedicated EV Charging Stations',
    'Handicap Accessible Elevators',
  ];

  const handleFacilityToggle = (facility: string) => {
    setFilters((prev) => {
      const exists = prev.selectedFacilities.includes(facility);
      return {
        ...prev,
        selectedFacilities: exists
          ? prev.selectedFacilities.filter((f) => f !== facility)
          : [...prev.selectedFacilities, facility],
      };
    });
  };

  const resetFilters = () => {
    setFilters({
      state: 'All',
      city: 'All',
      locality: '',
      category: 'All',
      distanceRadius: 25,
      minPrice: 50000,
      maxPrice: 600000,
      minSqFt: 5000,
      maxSqFt: 65000,
      minSeatingCapacity: 0,
      eventType: 'All',
      acType: 'all',
      selectedFacilities: [],
      minRooms: 0,
      minParking: 0,
      date: '',
      sortBy: 'popular',
    });
  };

  // Filter and Sort venues dynamically
  const filteredVenues = useMemo(() => {
    return MOCK_VENUES.filter((venue) => {
      // City
      if (filters.city !== 'All' && venue.city.toLowerCase() !== filters.city.toLowerCase()) {
        return false;
      }
      // Category
      if (filters.category !== 'All' && venue.category !== filters.category) {
        return false;
      }
      // Locality / Area
      if (
        filters.locality.trim() !== '' &&
        !venue.area.toLowerCase().includes(filters.locality.toLowerCase()) &&
        !venue.name.toLowerCase().includes(filters.locality.toLowerCase())
      ) {
        return false;
      }
      // Price
      if (venue.minPricePerDay < filters.minPrice || venue.minPricePerDay > filters.maxPrice) {
        return false;
      }
      // Sqft
      if (venue.totalBuiltUpAreaSqFt < filters.minSqFt || venue.totalBuiltUpAreaSqFt > filters.maxSqFt) {
        return false;
      }
      // Seating
      if (venue.totalSeatingCapacity < filters.minSeatingCapacity) {
        return false;
      }
      // AC Type
      if (filters.acType === 'ac') {
        const hasAc = venue.blocks.some((b) => b.isAirConditioned);
        if (!hasAc) return false;
      } else if (filters.acType === 'non-ac') {
        const hasNonAc = venue.blocks.some((b) => !b.isAirConditioned);
        if (!hasNonAc) return false;
      }
      // Rooms
      if (venue.guestRoomsCount < filters.minRooms) {
        return false;
      }
      // Parking
      if (venue.carParkingCapacity < filters.minParking) {
        return false;
      }
      // Facilities
      if (filters.selectedFacilities.length > 0) {
        const matchesAll = filters.selectedFacilities.every((fac) =>
          venue.facilities.some((vf) => vf.toLowerCase().includes(fac.toLowerCase()))
        );
        if (!matchesAll) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.minPricePerDay - b.minPricePerDay;
      if (filters.sortBy === 'price-desc') return b.minPricePerDay - a.minPricePerDay;
      if (filters.sortBy === 'rating') return b.rating - a.rating;
      if (filters.sortBy === 'recent') return b.id.localeCompare(a.id);
      return b.reviewCount - a.reviewCount; // popular
    });
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Search Header Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-amber-700 bg-amber-50 px-3 py-1 rounded-full w-fit">
            <span>Verified Venue Explorer</span>
          </div>
          <h1 className="text-2xl font-bold font-serif text-slate-900 mt-1">
            Discover Venues & Architectural Blocks
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing <span className="font-bold text-slate-900">{filteredVenues.length}</span> luxury properties matching your exact specifications
          </p>
        </div>

        {/* View mode toggle & Sort */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Layout Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'map'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Split Map</span>
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700">
            <span className="text-slate-400">Sort by:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
              className="bg-transparent font-semibold text-slate-900 focus:outline-none cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="recent">Recently Added</option>
            </select>
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 bg-brand-charcoal text-brand-gold px-4 py-2 rounded-xl text-xs font-bold"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters ({filters.selectedFacilities.length > 0 ? filters.selectedFacilities.length : 'All'})</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 sticky top-24 max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 font-bold text-slate-900 font-serif">
              <SlidersHorizontal className="w-4 h-4 text-brand-gold" />
              <span>Advanced Filters</span>
            </div>
            <button
              onClick={resetFilters}
              className="text-xs text-amber-700 hover:underline flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Filter: City */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              City
            </label>
            <select
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-brand-gold"
            >
              <option value="All">All Metros & Cities</option>
              <option value="Chennai">Chennai, Tamil Nadu</option>
              <option value="Bengaluru">Bengaluru, Karnataka</option>
              <option value="Hyderabad">Hyderabad, Telangana</option>
              <option value="Mumbai">Mumbai, Maharashtra</option>
            </select>
          </div>

          {/* Filter: Locality / Keyword */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Area / Locality Search
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. Anna Nagar, Whitefield, OMR"
                value={filters.locality}
                onChange={(e) => setFilters({ ...filters, locality: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 focus:outline-none focus:border-brand-gold"
              />
            </div>
          </div>

          {/* Filter: Category */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Venue Type
            </label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-brand-gold"
            >
              <option value="All">All Categories</option>
              <option value="convention-centre">Convention Centres</option>
              <option value="marriage-hall">Marriage & Kalyana Halls</option>
              <option value="banquet-hall">Banquet Halls</option>
              <option value="outdoor-lawn">Outdoor Lawns & Pavilions</option>
              <option value="corporate">Corporate Event Spaces</option>
            </select>
          </div>

          {/* Filter: Price Range Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider">Max Price / Day</span>
              <span className="font-bold text-brand-gold">
                ₹{filters.maxPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="50000"
              max="600000"
              step="25000"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
              className="w-full accent-brand-gold cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>₹50,000</span>
              <span>₹6,00,000+</span>
            </div>
          </div>

          {/* Filter: Square Footage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider">Min Built-up Area</span>
              <span className="font-bold text-brand-charcoal">
                {filters.minSqFt.toLocaleString('en-IN')} sq.ft
              </span>
            </div>
            <input
              type="range"
              min="5000"
              max="65000"
              step="5000"
              value={filters.minSqFt}
              onChange={(e) => setFilters({ ...filters, minSqFt: Number(e.target.value) })}
              className="w-full accent-brand-gold cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>5,000 sq.ft</span>
              <span>65,000+ sq.ft</span>
            </div>
          </div>

          {/* Filter: Seating Capacity */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Min Seating Capacity
            </label>
            <select
              value={filters.minSeatingCapacity}
              onChange={(e) => setFilters({ ...filters, minSeatingCapacity: Number(e.target.value) })}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-brand-gold"
            >
              <option value="0">Any Capacity</option>
              <option value="500">500+ Guests</option>
              <option value="1000">1,000+ Guests</option>
              <option value="2000">2,000+ Guests</option>
              <option value="3500">3,500+ Guests</option>
            </select>
          </div>

          {/* Filter: AC / Non-AC */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Climate Control
            </label>
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
              {(['all', 'ac', 'non-ac'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setFilters({ ...filters, acType: mode })}
                  className={`py-1.5 text-[11px] font-bold rounded-lg uppercase tracking-wider transition-all ${
                    filters.acType === mode
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Filter: Guest Rooms & Parking */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600 uppercase">Min AC Rooms</label>
              <select
                value={filters.minRooms}
                onChange={(e) => setFilters({ ...filters, minRooms: Number(e.target.value) })}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-2"
              >
                <option value="0">Any</option>
                <option value="4">4+ Rooms</option>
                <option value="8">8+ Rooms</option>
                <option value="15">15+ Rooms</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600 uppercase">Min Parking</label>
              <select
                value={filters.minParking}
                onChange={(e) => setFilters({ ...filters, minParking: Number(e.target.value) })}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-2"
              >
                <option value="0">Any</option>
                <option value="100">100+ Cars</option>
                <option value="250">250+ Cars</option>
                <option value="400">400+ Cars</option>
              </select>
            </div>
          </div>

          {/* Filter: Facilities */}
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Required Facilities
            </label>
            <div className="space-y-2">
              {facilitiesList.map((fac) => {
                const checked = filters.selectedFacilities.includes(fac);
                return (
                  <label
                    key={fac}
                    className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer hover:text-slate-900"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleFacilityToggle(fac)}
                      className="rounded text-brand-gold focus:ring-brand-gold/30 accent-brand-gold w-4 h-4 cursor-pointer"
                    />
                    <span>{fac}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Results Container */}
        <div className={`space-y-6 ${viewMode === 'map' ? 'lg:col-span-4' : 'lg:col-span-3'}`}>
          {viewMode === 'map' ? (
            /* Split Map & Results View */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Venue list */}
              <div className="lg:col-span-6 space-y-4 max-h-[800px] overflow-y-auto pr-2">
                {filteredVenues.length === 0 ? (
                  <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
                    <p className="text-lg font-bold font-serif text-slate-800">No venues match your criteria</p>
                    <p className="text-xs text-slate-500">Try adjusting your filters or price thresholds.</p>
                    <button
                      onClick={resetFilters}
                      className="bg-brand-charcoal text-brand-gold px-4 py-2 rounded-xl text-xs font-bold mt-2"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  filteredVenues.map((venue) => <VenueCard key={venue.id} venue={venue} />)
                )}
              </div>

              {/* Right Column: Google Maps Interactive Embed Mock */}
              <div className="lg:col-span-6 bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 relative min-h-[500px] shadow-lg">
                <iframe
                  title="Google Maps Venue Discovery"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124376.81898516093!2d80.12783852028695!3d13.0826802!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5265ea4f7d3361%3A0x6e61a70b6863d433!2sChennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  className="w-full h-full min-h-[550px] border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute top-4 left-4 bg-brand-charcoal/90 backdrop-blur-md text-white px-3.5 py-2 rounded-xl text-xs font-semibold border border-amber-400/30 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-gold" />
                  <span>Interactive Map · {filteredVenues.length} Locations Pinned</span>
                </div>
              </div>
            </div>
          ) : (
            /* Standard Grid View */
            <div>
              {filteredVenues.length === 0 ? (
                <div className="bg-white p-16 rounded-3xl border border-slate-200 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 text-brand-gold flex items-center justify-center mx-auto">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold font-serif text-slate-800">
                    No Venues Match Your Specific Parameters
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    We could not find any venues matching your current combination of city, budget, square footage, and amenities. Try expanding your search radius or resetting filters.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="bg-brand-charcoal hover:bg-brand-navy text-brand-gold font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition-all"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {filteredVenues.map((venue) => (
                    <VenueCard key={venue.id} venue={venue} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Slide-over / Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-lg font-serif text-slate-900">Filters</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-800 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-5">
              {/* City */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase">City</label>
                <select
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-3 mt-1"
                >
                  <option value="All">All Metros & Cities</option>
                  <option value="Chennai">Chennai, Tamil Nadu</option>
                  <option value="Bengaluru">Bengaluru, Karnataka</option>
                  <option value="Hyderabad">Hyderabad, Telangana</option>
                  <option value="Mumbai">Mumbai, Maharashtra</option>
                </select>
              </div>

              {/* Max Price */}
              <div>
                <div className="flex justify-between text-xs font-bold">
                  <span>Max Price</span>
                  <span className="text-brand-gold">₹{filters.maxPrice.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="600000"
                  step="25000"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                  className="w-full accent-brand-gold mt-2"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-3 mt-1"
                >
                  <option value="All">All Categories</option>
                  <option value="convention-centre">Convention Centres</option>
                  <option value="marriage-hall">Marriage & Kalyana Halls</option>
                  <option value="banquet-hall">Banquet Halls</option>
                  <option value="outdoor-lawn">Outdoor Lawns & Pavilions</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <button
                onClick={resetFilters}
                className="flex-1 py-3 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-3 text-xs font-bold text-brand-gold bg-brand-charcoal rounded-xl shadow-md"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VenuesPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-slate-500">Loading venue discovery...</div>}>
      <VenuesSearchContent />
    </Suspense>
  );
}
