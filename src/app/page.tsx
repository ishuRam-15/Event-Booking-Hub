'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  ArrowRight, 
  Star, 
  CheckCircle, 
  Building2, 
  Award, 
  BadgePercent,
  Clock,
  Heart
} from 'lucide-react';
import { MOCK_VENUES } from '@/lib/mock-data';
import { SUPPORTED_CITIES } from '@/lib/cities';
import { getFeaturedVenues } from '@/lib/dal/venues';
import { Venue } from '@/types';
import VenueCard from '@/components/cards/VenueCard';

export default function HomePage() {
  const router = useRouter();
  const [venuesList, setVenuesList] = useState<Venue[]>(() =>
    MOCK_VENUES.filter((v) => v.featured)
  );
  const [searchLocation, setSearchLocation] = useState('Chennai');
  const [searchDate, setSearchDate] = useState('2026-12-15');
  const [searchType, setSearchType] = useState('wedding');
  const [searchGuests, setSearchGuests] = useState('1000');

  useEffect(() => {
    async function loadFeatured() {
      try {
        const featured = await getFeaturedVenues();
        if (featured && featured.length > 0) {
          setVenuesList(featured);
        }
      } catch (err) {
        console.warn('Featured venues load fallback:', err);
      }
    }
    loadFeatured();
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      `/venues?city=${encodeURIComponent(searchLocation)}&date=${encodeURIComponent(searchDate)}&type=${encodeURIComponent(searchType)}&guests=${encodeURIComponent(searchGuests)}`
    );
  };

  const categories = [
    {
      title: 'Marriage & Kalyana Halls',
      slug: 'marriage-hall',
      count: '42 Properties',
      icon: '💒',
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Grand Convention Centres',
      slug: 'convention-centre',
      count: '28 Properties',
      icon: '🏛️',
      image: 'https://images.unsplash.com/photo-1545232979-fbf68fe9ec47?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Banquet & Dining Halls',
      slug: 'banquet-hall',
      count: '54 Properties',
      icon: '🍽️',
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Outdoor Lawns & Pavilions',
      slug: 'outdoor-lawn',
      count: '19 Properties',
      icon: '🌿',
      image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Corporate Event Spaces',
      slug: 'corporate',
      count: '31 Properties',
      icon: '💼',
      image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Intimate Party Halls',
      slug: 'party-hall',
      count: '36 Properties',
      icon: '🎉',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const popularLocations = SUPPORTED_CITIES.map((c) => ({
    name: c.name,
    displayName: c.label,
    state: c.state,
    count: c.showcaseCount,
    image: c.image,
  }));

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[640px] flex items-center justify-center bg-brand-charcoal overflow-hidden pt-12 pb-24">
        {/* Background Image with luxury overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=2000&q=85"
            alt="Luxury Event Venue"
            className="w-full h-full object-cover object-center filter brightness-[0.35]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-transparent to-black/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-amber-400/30 text-brand-gold px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase shadow-lg">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover · Compare · Reserve Multi-Block Venues</span>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white font-serif tracking-tight leading-[1.15]">
              Find the Perfect Venue for Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-brand-gold to-amber-300">
                Special Event
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
              Explore premier marriage halls, convention centres, and banqueting pavilions.
              Compare individual blocks, dining capacities, and reserve with instant GST invoices.
            </p>
          </div>

          {/* Interactive Quick Search Box */}
          <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-xl p-3 sm:p-4 rounded-3xl shadow-2xl border border-white/40 text-left">
            <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Location */}
              <div className="bg-slate-50 hover:bg-slate-100/80 p-3 rounded-2xl border border-slate-200/80 transition-colors">
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-gold" />
                  City / Location
                </label>
                <select
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
                >
                  {SUPPORTED_CITIES.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.label}, {city.stateShort}
                    </option>
                  ))}
                  <option value="All">All 3 Metros</option>
                </select>
              </div>

              {/* Event Date */}
              <div className="bg-slate-50 hover:bg-slate-100/80 p-3 rounded-2xl border border-slate-200/80 transition-colors">
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  <Calendar className="w-3.5 h-3.5 text-brand-gold" />
                  Event Date
                </label>
                <input
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
                />
              </div>

              {/* Event Type */}
              <div className="bg-slate-50 hover:bg-slate-100/80 p-3 rounded-2xl border border-slate-200/80 transition-colors">
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                  Event Type
                </label>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="wedding">Grand Wedding & Reception</option>
                  <option value="convention">Convention / Conference</option>
                  <option value="sangeet">Sangeet & Cocktail</option>
                  <option value="birthday">Birthday & Milestone Party</option>
                  <option value="corporate">Corporate Gala & Award</option>
                </select>
              </div>

              {/* Guest Count & Search Button */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 bg-slate-50 hover:bg-slate-100/80 p-3 rounded-2xl border border-slate-200/80 transition-colors">
                  <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    <Users className="w-3.5 h-3.5 text-brand-gold" />
                    Guests
                  </label>
                  <select
                    value={searchGuests}
                    onChange={(e) => setSearchGuests(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="300">Up to 300</option>
                    <option value="500">300 - 500</option>
                    <option value="1000">500 - 1,000</option>
                    <option value="2000">1,000 - 2,500</option>
                    <option value="4000">2,500+ Guests</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="bg-brand-charcoal hover:bg-brand-navy text-brand-gold font-bold px-6 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-all text-sm shrink-0 border border-amber-400/30"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </div>
            </form>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-8 text-slate-300 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-brand-gold" />
              <span>120+ Multi-Block Venues</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-brand-gold" />
              <span>Architectural Floor Blueprint Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-brand-gold" />
              <span>Zero Hidden Fees & Instant GST Invoice</span>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Venue Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
              Tailored Spaces
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif mt-2">
              Popular Venue Categories
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Select the ideal venue configuration tailored to your specific celebration format.
            </p>
          </div>
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-gold hover:text-amber-700 transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/venues?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 filter brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
                <span className="text-2xl">{cat.icon}</span>
                <div>
                  <h3 className="font-bold text-sm font-serif group-hover:text-amber-300 transition-colors leading-tight">
                    {cat.title}
                  </h3>
                  <span className="text-[11px] text-slate-300 mt-0.5 block">{cat.count}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Luxury Venues */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
              Handpicked Properties
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif mt-2">
              Featured Venues with Dynamic Blocks
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Properties offering multiple independent blocks (Ballrooms, Dining halls, Guest suites, and Lawns).
            </p>
          </div>
          <Link
            href="/venues"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-gold hover:text-amber-700 transition-colors"
          >
            <span>Explore All 120+ Venues</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {venuesList.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      </section>

      {/* Dynamic Multi-Block Architecture Feature Spotlight */}
      <section className="bg-brand-charcoal text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-amber-500/20 text-brand-gold border border-amber-400/30 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                <Layers className="w-4 h-4" />
                <span>Industry Leading Multi-Block System</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold font-serif leading-tight">
                One Single Venue. <br />
                <span className="text-brand-gold">Three or More Independent Blocks.</span>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
                Why book an entire compound when you only need a dining hall, or why restrict yourself to one ballroom? GrandVenue allows you to book and configure individual architectural blocks dynamically:
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-brand-gold flex items-center justify-center shrink-0 font-bold text-xs">
                    A
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Block A: Main Convention & Stage</h4>
                    <p className="text-xs text-slate-400">High-capacity seating, VIP green rooms, crystal chandeliers, and stage rigging.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-brand-gold flex items-center justify-center shrink-0 font-bold text-xs">
                    B
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Block B: Dedicated Dining & Kitchen</h4>
                    <p className="text-xs text-slate-400">Expansive buffet halls, industrial steam cookers, separate washing bays.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-brand-gold flex items-center justify-center shrink-0 font-bold text-xs">
                    C
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Block C: Open Lawn & Guest Suite Annex</h4>
                    <p className="text-xs text-slate-400">Starlight lawn pavilions, poolside lounges, and private AC guest accommodation.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/venues"
                  className="bg-brand-gold hover:bg-amber-500 text-brand-charcoal font-bold px-6 py-3 rounded-xl inline-flex items-center gap-2 text-sm transition-all shadow-lg"
                >
                  <span>Experience Block Comparison</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden border border-amber-500/20 shadow-2xl bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1545232979-fbf68fe9ec47?auto=format&fit=crop&w=1200&q=80"
                  alt="Architectural Venue Blocks"
                  className="w-full h-[450px] object-cover filter brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* Floating Block Indicator Card */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl text-slate-900 shadow-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-amber-700 tracking-wider">Dynamic Selector</span>
                      <h5 className="font-bold text-sm font-serif">Simultaneous Multi-Block Reservation</h5>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                      Live Availability
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-center text-xs">
                    <div className="bg-slate-50 p-1.5 rounded-lg">
                      <span className="block text-[10px] text-slate-400">Block A</span>
                      <span className="font-bold text-slate-800">1,800 Seats</span>
                    </div>
                    <div className="bg-slate-50 p-1.5 rounded-lg">
                      <span className="block text-[10px] text-slate-400">Block B</span>
                      <span className="font-bold text-slate-800">1,200 Dining</span>
                    </div>
                    <div className="bg-slate-50 p-1.5 rounded-lg">
                      <span className="block text-[10px] text-slate-400">Block C</span>
                      <span className="font-bold text-slate-800">12 Suites</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Locations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
            Key Metros
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif mt-2">
            Explore Venues by City
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Browse premier properties across Chennai, Bengaluru, and Hyderabad with local proximity sorting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {popularLocations.map((loc) => (
            <Link
              key={loc.name}
              href={`/venues?city=${encodeURIComponent(loc.name)}`}
              className="group relative rounded-2xl overflow-hidden aspect-[16/11] bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <img
                src={loc.image}
                alt={loc.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xs text-amber-300 font-medium">{loc.state}</span>
                <h3 className="text-xl font-bold font-serif">{loc.displayName}</h3>
                <span className="text-xs text-slate-300 mt-0.5 block">{loc.count}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
              Trust & Transparency
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif mt-2">
              Why Event Hosts Trust GrandVenue
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Built for seamless event management with commercial rigor and hospitality elegance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-brand-gold flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 font-serif">100% Verified Layouts</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Every venue profile includes verified built-up square footage, dining capacity, parking slots, and architectural floor plan diagrams.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <BadgePercent className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 font-serif">Transparent GST Billing</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Clear tax breakdown with CGST (9%) + SGST (9%) or IGST (18%) and automated download of GST tax invoices adhering to SAC 997212.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 font-serif">Instant Block Locks</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Reserve your selected block with a 25% advance deposit. Receive instant digital confirmation and real-time coordinator access.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
            Real Experiences
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif mt-2">
            Celebrated by Hosts Across India
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "Booking Royal Grand Convention Palace through GrandVenue was effortlessly smooth. Being able to inspect Block A and Block B separately with exact square footage saved us hours of physical visits."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">
                KS
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Karthik & Revathi</h4>
                <p className="text-[10px] text-slate-400">Wedding at Chennai · 2,200 Guests</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "We hosted our Annual Tech Summit with 1,400 delegates at The Grand Ivory. The GST invoice was generated within 10 seconds of advance payment with exact corporate GSTIN matching."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">
                PN
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Priya Narayanan</h4>
                <p className="text-[10px] text-slate-400">VP Operations, TechCorp · Bengaluru</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "The ability to book the outdoor lawn for our Sangeet and simultaneously reserve the indoor hall for the wedding mandap under one booking reference is a lifesaver!"
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">
                AR
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Ananya Reddy</h4>
                <p className="text-[10px] text-slate-400">Destination Wedding · Hyderabad</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-brand-charcoal text-white p-8 sm:p-14 text-center border border-amber-500/20 shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gold bg-amber-400/10 border border-amber-400/20 px-3.5 py-1.5 rounded-full">
              Ready to Plan Your Milestone?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif">
              Reserve Your Venue Block Today
            </h2>
            <p className="text-sm text-slate-300 font-light">
              Check real-time calendar availability, compare block configurations, and secure your event dates with advance protection.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/venues"
                className="bg-brand-gold hover:bg-amber-500 text-brand-charcoal font-bold px-8 py-3.5 rounded-xl text-sm transition-all shadow-lg hover:scale-105"
              >
                Browse All Venues
              </Link>
              <Link
                href="/contact"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition-all border border-white/20"
              >
                Speak with a Venue Concierge
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
