import React from 'react';
import Link from 'next/link';
import { Building2, ArrowRight, Sparkles } from 'lucide-react';

export default function CategoriesPage() {
  const categories = [
    {
      title: 'Grand Convention Centres',
      slug: 'convention-centre',
      desc: 'Massive acoustic exhibition & plenary halls with 2,000+ guest capacity, VIP suites, and multi-acre parking.',
      image: 'https://images.unsplash.com/photo-1545232979-fbf68fe9ec47?auto=format&fit=crop&w=800&q=80',
      count: '28 Properties',
      icon: '🏛️',
    },
    {
      title: 'Marriage & Kalyana Mandapams',
      slug: 'marriage-hall',
      desc: 'Auspicious traditional halls featuring dedicated dining halls, homam areas, priest suites, and bridal rooms.',
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
      count: '42 Properties',
      icon: '💒',
    },
    {
      title: 'Luxury Banquet Halls',
      slug: 'banquet-hall',
      desc: 'Versatile crystal-chandelier spaces equipped with modular partitions, buffet arrangements, and DJ consoles.',
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80',
      count: '54 Properties',
      icon: '🍽️',
    },
    {
      title: 'Outdoor Lawns & Pavilions',
      slug: 'outdoor-lawn',
      desc: 'Bespoke open-air landscapes, starlight pavilions, and poolside decks for Sangeet, Mehendi, and receptions.',
      image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80',
      count: '19 Properties',
      icon: '🌿',
    },
    {
      title: 'Corporate Event Spaces',
      slug: 'corporate',
      desc: 'High-tech auditoriums and seminar spaces with gigabit fibre, 4K video walls, and translation booths.',
      image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
      count: '31 Properties',
      icon: '💼',
    },
    {
      title: 'Private Party Halls',
      slug: 'party-hall',
      desc: 'Intimate gathering spaces for birthdays, anniversaries, and family celebrations with flexible catering setups.',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
      count: '36 Properties',
      icon: '🎉',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3.5 py-1.5 rounded-full">
          Curated Architectural Spaces
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-slate-900">
          Venue Classifications & Categories
        </h1>
        <p className="text-sm text-slate-500 font-light">
          Whether you are hosting a regal wedding or a high-velocity enterprise convention, find tailored properties with verified specifications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((c) => (
          <div
            key={c.slug}
            className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
              <img
                src={c.image}
                alt={c.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-4 left-4 text-2xl">{c.icon}</div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider block">
                  {c.count}
                </span>
                <h3 className="text-lg font-bold font-serif">{c.title}</h3>
              </div>
            </div>

            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <p className="text-xs text-slate-500 leading-relaxed">{c.desc}</p>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/venues?category=${c.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-gold hover:text-amber-700 transition-colors"
                >
                  <span>Explore Properties</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href={`/venues?category=${c.slug}`}
                  className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-semibold text-slate-700 transition-colors"
                >
                  Browse
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
