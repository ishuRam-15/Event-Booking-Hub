'use client';

import React, { useState, useEffect } from 'react';
import { 
  CalendarCheck2, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Printer, 
  Eye, 
  ShieldCheck,
  Building2,
  Calendar,
  X
} from 'lucide-react';
import { MOCK_BOOKINGS } from '@/lib/mock-data';
import { getAllBookingsAdmin } from '@/lib/dal/bookings';
import { Booking } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { updateBookingStatusAction } from '@/app/actions/booking';
import GstInvoiceModal from '@/components/modals/GstInvoiceModal';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [inspectBooking, setInspectBooking] = useState<Booking | null>(null);
  const [invoiceBooking, setInvoiceBooking] = useState<Booking | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const liveBookings = await getAllBookingsAdmin();
        if (liveBookings && liveBookings.length > 0) {
          setBookings(liveBookings);
        }
      } catch (err) {
        console.warn('Admin bookings DAL fallback:', err);
      }
    }
    loadData();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'All' || b.bookingStatus === statusFilter;
    const matchesSearch =
      b.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.venueName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const updateStatus = async (bookingId: string, newStatus: Booking['bookingStatus']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, bookingStatus: newStatus } : b))
    );
    if (inspectBooking && inspectBooking.id === bookingId) {
      setInspectBooking({ ...inspectBooking, bookingStatus: newStatus });
    }
    await updateBookingStatusAction(bookingId, newStatus);
  };

  const updatePayment = (bookingId: string, newPayment: Booking['paymentStatus']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, paymentStatus: newPayment } : b))
    );
    if (inspectBooking && inspectBooking.id === bookingId) {
      setInspectBooking({ ...inspectBooking, paymentStatus: newPayment });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
            Reservation Desk
          </span>
          <h1 className="text-2xl font-bold font-serif text-slate-900 mt-1">
            Booking & Reservation Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review event dates, approve block locks, and issue statutory GST invoices
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm"
        >
          <Printer className="w-4 h-4 text-brand-gold" />
          <span>Print Schedule Sheet</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search ref #, customer or venue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 focus:outline-none focus:border-brand-gold"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-medium">Status:</span>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {['All', 'pending', 'confirmed', 'completed', 'cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  statusFilter === st
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-6">Ref & Date</th>
                <th className="py-3 px-6">Customer / Host</th>
                <th className="py-3 px-6">Venue & Blocks</th>
                <th className="py-3 px-6">Event Date & Guests</th>
                <th className="py-3 px-6">Gross / Paid</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6">
                    <p className="font-mono font-bold text-slate-900">{b.referenceNumber}</p>
                    <p className="text-[11px] text-slate-400">{formatDate(b.createdAt)}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-900">{b.customerName}</p>
                    <p className="text-[11px] text-slate-400">{b.customerPhone}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-slate-900">{b.venueName}</p>
                    <p className="text-[11px] text-slate-400">{b.blockNames.join(', ')}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-slate-800">{formatDate(b.eventDate)} ({b.timeSlot})</p>
                    <p className="text-[11px] text-slate-400">{b.guestCount.toLocaleString()} Guests</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-extrabold text-slate-900">{formatCurrency(b.pricing.grossTotal)}</p>
                    <p className="text-[11px] text-emerald-600 font-semibold">{formatCurrency(b.pricing.advancePaid)} Paid</p>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        b.bookingStatus === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.bookingStatus === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {b.bookingStatus}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setInspectBooking(b)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>

                      {b.bookingStatus === 'pending' && (
                        <button
                          onClick={() => updateStatus(b.id, 'confirmed')}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                        >
                          Approve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Modal Drawer */}
      {inspectBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase text-brand-gold tracking-wider font-mono">
                  {inspectBooking.referenceNumber}
                </span>
                <h3 className="text-xl font-bold font-serif text-slate-900 mt-0.5">
                  Booking Inspection & Tax Summary
                </h3>
              </div>
              <button onClick={() => setInspectBooking(null)} className="text-slate-400 hover:text-slate-800">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400 uppercase font-bold text-[10px]">Customer Details</span>
                <p className="font-bold text-slate-900 text-sm">{inspectBooking.customerName}</p>
                <p className="text-slate-600">{inspectBooking.customerPhone} · {inspectBooking.customerEmail}</p>
                <p className="text-slate-600 font-mono">GSTIN: {inspectBooking.customerGstin || 'Not provided'}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400 uppercase font-bold text-[10px]">Venue Compound</span>
                <p className="font-bold text-slate-900 text-sm">{inspectBooking.venueName}</p>
                <p className="text-slate-600">Blocks: {inspectBooking.blockNames.join(', ')}</p>
                <p className="text-slate-600">{formatDate(inspectBooking.eventDate)} ({inspectBooking.timeSlot})</p>
              </div>
            </div>

            {/* Financial Status */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
              <span className="font-bold uppercase text-slate-500 text-[10px] block">Commercial Breakdown</span>
              <div className="flex justify-between">
                <span>Taxable Amount (SAC 997212):</span>
                <span className="font-semibold">{formatCurrency(inspectBooking.pricing.taxableAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>CGST (9%) + SGST (9%):</span>
                <span>{formatCurrency(inspectBooking.pricing.cgst + inspectBooking.pricing.sgst)}</span>
              </div>
              <div className="flex justify-between">
                <span>Security Deposit:</span>
                <span>{formatCurrency(inspectBooking.pricing.securityDeposit)}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 text-sm pt-2 border-t border-slate-200">
                <span>Gross Total:</span>
                <span>{formatCurrency(inspectBooking.pricing.grossTotal)}</span>
              </div>
            </div>

            {/* Change Status Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateStatus(inspectBooking.id, 'confirmed')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Confirm
                </button>
                <button
                  onClick={() => updateStatus(inspectBooking.id, 'completed')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Mark Completed
                </button>
                <button
                  onClick={() => updateStatus(inspectBooking.id, 'cancelled')}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Cancel & Refund
                </button>
              </div>

              <button
                onClick={() => setInvoiceBooking(inspectBooking)}
                className="bg-brand-charcoal hover:bg-brand-navy text-brand-gold font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>GST Tax Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statutory GST Invoice Modal */}
      <GstInvoiceModal
        isOpen={Boolean(invoiceBooking)}
        onClose={() => setInvoiceBooking(null)}
        booking={invoiceBooking}
      />
    </div>
  );
}
