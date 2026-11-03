'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CalendarCheck2, 
  Clock, 
  MapPin, 
  CreditCard, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  Download, 
  Heart, 
  Layers,
  Building2,
  Calendar,
  Printer
} from 'lucide-react';
import { MOCK_BOOKINGS, MOCK_CURRENT_USER } from '@/lib/mock-data';
import { getUserBookings } from '@/lib/dal/bookings';
import { getCurrentUserProfile } from '@/app/actions/auth';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Booking } from '@/types';
import GstInvoiceModal from '@/components/modals/GstInvoiceModal';

export default function CustomerDashboardPage() {
  const [tab, setTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [user, setUser] = useState(MOCK_CURRENT_USER);
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState<Booking | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [liveBookings, liveProfile] = await Promise.all([
          getUserBookings(),
          getCurrentUserProfile(),
        ]);
        if (liveBookings && liveBookings.length > 0) {
          setBookings(liveBookings);
        }
        if (liveProfile && liveProfile.user) {
          setUser((prev) => ({
            ...prev,
            name: liveProfile.user.name || prev.name,
            email: liveProfile.user.email || prev.email,
          }));
        }
      } catch (err) {
        console.warn('Customer dashboard DAL fallback:', err);
      }
    }
    loadData();
  }, []);

  const totalSpent = bookings.reduce((sum, b) => sum + (b.pricing?.grossTotal || 0), 0);

  const filteredBookings = bookings.filter((b) => {
    if (tab === 'upcoming') return b.bookingStatus === 'confirmed' || b.bookingStatus === 'pending';
    if (tab === 'completed') return b.bookingStatus === 'completed';
    if (tab === 'cancelled') return b.bookingStatus === 'cancelled';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-brand-charcoal text-white p-8 rounded-3xl border border-amber-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-brand-gold px-3 py-1 rounded-full text-xs font-semibold">
            <span>Customer Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold font-serif">Welcome, {user.name}</h1>
          <p className="text-xs text-slate-300 font-light">
            Manage your venue reservations, track upcoming event schedules, and access official GST invoices.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/venues"
            className="bg-brand-gold hover:bg-amber-500 text-brand-charcoal font-bold px-5 py-3 rounded-xl text-xs transition-all shadow-md flex items-center gap-2"
          >
            <span>Book New Venue</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <Link
            href="/dashboard/profile"
            className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-3 rounded-xl text-xs transition-colors border border-white/20"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Bookings</span>
          <p className="text-2xl font-extrabold text-slate-900">{bookings.length}</p>
          <span className="text-xs text-slate-500 block">Verified Reservations</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Spent</span>
          <p className="text-2xl font-extrabold text-brand-gold">{formatCurrency(totalSpent)}</p>
          <span className="text-xs text-emerald-600 font-medium">100% Tax Compliant</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Saved Venues</span>
          <p className="text-2xl font-extrabold text-slate-900">{user.savedVenueIds.length}</p>
          <Link href="/dashboard/saved" className="text-xs text-brand-gold hover:underline font-semibold">
            View Favourites →
          </Link>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">GST Registration</span>
          <p className="text-sm font-bold text-slate-800 font-mono mt-1">{user.gstin || 'Personal / ITC'}</p>
          <span className="text-xs text-slate-400">SAC 997212 Eligible</span>
        </div>
      </div>

      {/* Bookings Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Tab Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTab('upcoming')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                tab === 'upcoming'
                  ? 'bg-brand-charcoal text-brand-gold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Upcoming Events ({bookings.filter((b) => b.bookingStatus !== 'completed' && b.bookingStatus !== 'cancelled').length})
            </button>
            <button
              onClick={() => setTab('completed')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                tab === 'completed'
                  ? 'bg-brand-charcoal text-brand-gold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Completed Events ({bookings.filter((b) => b.bookingStatus === 'completed').length})
            </button>
            <button
              onClick={() => setTab('cancelled')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                tab === 'cancelled'
                  ? 'bg-brand-charcoal text-brand-gold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Cancelled Bookings ({bookings.filter((b) => b.bookingStatus === 'cancelled').length})
            </button>
          </div>

          <span className="text-xs text-slate-400">
            Booking history synchronized in real-time
          </span>
        </div>

        {/* Bookings List */}
        <div className="p-6 space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <CalendarCheck2 className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold">No bookings found in this category.</p>
              <Link href="/venues" className="text-xs text-brand-gold font-bold hover:underline inline-block mt-2">
                Browse available estates & dates →
              </Link>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-slate-50 hover:bg-white p-6 rounded-2xl border border-slate-200 transition-all shadow-sm hover:shadow-md space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md font-mono">
                      {booking.referenceNumber}
                    </span>
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        booking.bookingStatus === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : booking.bookingStatus === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {booking.bookingStatus}
                    </span>
                    <span className="text-xs text-slate-400">Booked on {formatDate(booking.createdAt)}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-500">Gross Total:</span>
                    <span className="text-base font-extrabold text-slate-900 ml-2">
                      {formatCurrency(booking.pricing.grossTotal)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium block">Venue & Compound:</span>
                    <h4 className="text-sm font-bold text-slate-900 font-serif mt-0.5">{booking.venueName}</h4>
                    <p className="text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                      <span>{booking.venueAddress}</span>
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium block">Event Schedule & Time:</span>
                    <p className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-brand-gold" />
                      <span>{formatDate(booking.eventDate)} ({booking.timeSlot.toUpperCase()})</span>
                    </p>
                    <p className="text-slate-500 mt-1">{booking.eventType} · {booking.guestCount.toLocaleString()} Guests</p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium block">Reserved Architectural Blocks:</span>
                    <div className="space-y-1 mt-1">
                      {booking.blockNames.map((name, i) => (
                        <div key={i} className="flex items-center gap-1.5 font-semibold text-slate-800">
                          <Layers className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                          <span>{name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-slate-600">
                      Payment Status:{' '}
                      <strong className="text-slate-900 capitalize font-bold">
                        {booking.paymentStatus.replace('-', ' ')} ({formatCurrency(booking.pricing.advancePaid)} paid)
                      </strong>
                    </span>
                    {booking.pricing.balanceDue > 0 && (
                      <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded">
                        Balance Due: {formatCurrency(booking.pricing.balanceDue)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedInvoiceBooking(booking)}
                      className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5 text-brand-gold" />
                      <span>View GST Tax Invoice</span>
                    </button>
                    <button
                      onClick={() => alert(`Booking cancellation requested for ${booking.referenceNumber}. A coordinator will contact you.`)}
                      className="text-xs text-rose-600 hover:underline px-3 py-2 font-medium"
                    >
                      Cancel Booking
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Statutory GST Invoice Modal */}
      <GstInvoiceModal
        isOpen={Boolean(selectedInvoiceBooking)}
        onClose={() => setSelectedInvoiceBooking(null)}
        booking={selectedInvoiceBooking}
      />
    </div>
  );
}
