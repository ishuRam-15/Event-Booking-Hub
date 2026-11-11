'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Layers, 
  CalendarCheck2, 
  Users, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ArrowUpRight, 
  BarChart3, 
  Download,
  ShieldCheck
} from 'lucide-react';
import { MOCK_ADMIN_METRICS, MOCK_BOOKINGS, MOCK_VENUES } from '@/lib/mock-data';
import { getAdminMetrics, getAllBookingsAdmin } from '@/lib/dal/bookings';
import { updateBookingStatusAction } from '@/app/actions/booking';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Booking } from '@/types';
import GstInvoiceModal from '@/components/modals/GstInvoiceModal';

export default function AdminDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [metrics, setMetrics] = useState(MOCK_ADMIN_METRICS);
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState<Booking | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [liveMetrics, liveBookings] = await Promise.all([
          getAdminMetrics(),
          getAllBookingsAdmin(),
        ]);
        if (liveMetrics) setMetrics(liveMetrics as any);
        if (liveBookings && liveBookings.length > 0) setBookings(liveBookings);
      } catch (err) {
        console.warn('Admin dashboard DAL fallback:', err);
      }
    }
    loadData();
  }, []);

  const handleStatusChange = async (bookingId: string, newStatus: 'confirmed' | 'cancelled') => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, bookingStatus: newStatus } : b))
    );
    try {
      await updateBookingStatusAction(bookingId, newStatus);
    } catch (err) {
      console.warn('Status change error:', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
            Executive Command Suite
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 mt-1">
            Real-Time Operations & Revenue Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitoring live bookings, dynamic block occupancy, and statutory GST collections.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/venues/new"
            className="bg-brand-charcoal hover:bg-brand-navy text-brand-gold font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm border border-amber-400/30 transition-all"
          >
            <Building2 className="w-4 h-4" />
            <span>+ Add New Venue</span>
          </Link>
          <Link
            href="/admin/sales"
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <BarChart3 className="w-4 h-4 text-brand-gold" />
            <span>Sales Reports</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Gross Revenue</span>
            <div className="p-2 rounded-xl bg-amber-50 text-brand-gold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-brand-charcoal">{formatCurrency(metrics.totalRevenue)}</p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <span>+18.4%</span>
            <span className="text-slate-400 font-normal">vs last month</span>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Bookings Pipeline</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <CalendarCheck2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{metrics.totalBookings}</p>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-emerald-700 font-bold">{metrics.confirmedBookings} Confirmed</span>
            <span className="text-slate-300">•</span>
            <span className="text-amber-700 font-bold">{metrics.pendingBookings} Pending</span>
          </div>
        </div>

        {/* Total Venues & Blocks */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Venues & Blocks</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{metrics.totalVenues} <span className="text-sm text-slate-400 font-normal">Venues</span></p>
          <div className="text-xs text-slate-500 font-medium">
            <span>{metrics.totalBlocks} Independent Blocks Online</span>
          </div>
        </div>

        {/* Total GST Collected */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Statutory GST (18%)</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-emerald-700">{formatCurrency(metrics.totalGstCollected)}</p>
          <div className="text-[11px] text-slate-500">
            <span>CGST: {formatCurrency(metrics.cgstCollected)} | SGST: {formatCurrency(metrics.sgstCollected)}</span>
          </div>
        </div>
      </div>

      {/* Revenue Charts & Occupancy Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Monthly Revenue Chart Graphic */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg font-serif text-slate-900">Monthly Sales & Revenue Trajectory</h3>
              <p className="text-xs text-slate-500">Recorded gross billing over the past 6 months (in Lakhs INR)</p>
            </div>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
              FY 2026-27
            </span>
          </div>

          {/* Bar Chart Representation */}
          <div className="space-y-4 pt-4">
            <div className="h-64 flex items-end gap-4 sm:gap-8 justify-between pt-8 px-4 border-b border-slate-200">
              {metrics.monthlySales.map((item, idx) => {
                const heightPercentage = Math.round((item.revenue / 1600000) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      ₹{(item.revenue / 100000).toFixed(1)}L
                    </div>
                    <div
                      style={{ height: `${heightPercentage}%` }}
                      className="w-full max-w-[48px] bg-gradient-to-t from-brand-charcoal to-brand-gold rounded-t-xl group-hover:brightness-110 transition-all shadow-sm"
                    />
                    <span className="text-xs font-bold text-slate-600 mt-1">{item.month}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-6 text-xs text-slate-500 pt-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-brand-gold" />
                <span>Base Venue & Block Rental</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-brand-charcoal" />
                <span>GST Tax Collections (18%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Block Occupancy & Venue Breakdown */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-lg font-serif text-slate-900">Venue-Wise Revenue Share</h3>
            <p className="text-xs text-slate-500">Distribution across active convention properties</p>

            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Royal Grand Convention Palace (Chennai)</span>
                  <span className="font-bold text-slate-900">46%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="w-[46%] h-full bg-brand-gold rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>The Corinthian Palace (Bengaluru)</span>
                  <span className="font-bold text-slate-900">32%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="w-[32%] h-full bg-brand-charcoal rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Emerald Valley Pavilion (Hyderabad)</span>
                  <span className="font-bold text-slate-900">22%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="w-[22%] h-full bg-emerald-600 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50/70 border border-amber-200/60 p-4 rounded-2xl text-xs text-amber-900 space-y-1 mt-6">
            <span className="font-bold block">Dynamic Block Utilization:</span>
            <p className="text-[11px] leading-relaxed">
              Block A (Main Auditorium/Ballroom) maintains an 84% weekend occupancy rate. Block B dining banquet follows at 72%.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Bookings Queue with Inline Approval / Rejection */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg font-serif text-slate-900">Recent Customer Bookings & Approvals</h3>
            <p className="text-xs text-slate-500">Live booking stream pending admin verification or invoice generation</p>
          </div>
          <Link
            href="/admin/bookings"
            className="text-xs font-bold text-brand-gold hover:underline"
          >
            View All Bookings ({bookings.length}) →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-6">Reference</th>
                <th className="py-3 px-6">Customer / Host</th>
                <th className="py-3 px-6">Venue & Blocks</th>
                <th className="py-3 px-6">Event Date</th>
                <th className="py-3 px-6">Gross Amount</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-slate-900">
                    {booking.referenceNumber}
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-900">{booking.customerName}</p>
                    <p className="text-[11px] text-slate-400">{booking.customerPhone}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-slate-800">{booking.venueName}</p>
                    <p className="text-[11px] text-slate-400">{booking.blockNames.join(', ')}</p>
                  </td>
                  <td className="py-4 px-6 font-medium">
                    {formatDate(booking.eventDate)} ({booking.timeSlot})
                  </td>
                  <td className="py-4 px-6 font-extrabold text-slate-900">
                    {formatCurrency(booking.pricing.grossTotal)}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        booking.bookingStatus === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : booking.bookingStatus === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {booking.bookingStatus}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {booking.bookingStatus === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(booking.id, 'confirmed')}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-xs font-bold transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(booking.id, 'cancelled')}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-700 px-3 py-1 rounded-lg text-xs font-bold transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setSelectedInvoiceBooking(booking)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Download Statutory GST Invoice"
                      >
                        <Download className="w-4 h-4 text-brand-gold" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
