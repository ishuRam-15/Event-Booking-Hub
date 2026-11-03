'use client';

import React from 'react';
import { X, Printer, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Booking } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

interface GstInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
}

export default function GstInvoiceModal({ isOpen, onClose, booking }: GstInvoiceModalProps) {
  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Modal Controls Bar (Hidden during print) */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
              Statutory GST Compliance
            </span>
            <span className="text-xs text-slate-400 font-mono">SAC 997212</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="bg-brand-charcoal text-brand-gold hover:bg-brand-navy font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Tax Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Document */}
        <div className="p-8 sm:p-12 space-y-6 text-slate-900 text-xs">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b-2 border-slate-900 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-extrabold font-serif uppercase tracking-wider text-slate-900">
                  Tax Invoice
                </h2>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                  ORIGINAL FOR RECIPIENT
                </span>
              </div>
              <p className="text-[10px] text-slate-500 uppercase font-semibold mt-1">
                Issued Under Section 31 of CGST Act, 2017 & State GST Rules
              </p>
              <h3 className="font-bold text-slate-900 mt-3 text-base font-serif">{booking.venueName}</h3>
              <p className="text-slate-600">{booking.venueAddress}</p>
              <p className="text-slate-800 font-semibold mt-1">
                GSTIN: 33AAAAA0000A1Z5 · State Code: 33 (Tamil Nadu)
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <p className="font-bold text-sm text-slate-900 font-mono">Invoice #: INV-{booking.referenceNumber}</p>
              <p className="text-slate-600">Booking Ref: <strong className="font-mono text-slate-900">{booking.referenceNumber}</strong></p>
              <p className="text-slate-600">Date of Issue: {formatDate(booking.createdAt)}</p>
              <p className="text-slate-600">Event Date: {formatDate(booking.eventDate)} ({booking.timeSlot.toUpperCase()})</p>
              <div className="pt-1">
                <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  booking.bookingStatus === 'confirmed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  Status: {booking.bookingStatus.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Billed To / Recipient Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-slate-200 pb-6">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Billed To (Host / Customer):</span>
              <p className="font-bold text-slate-900 text-sm">{booking.customerName}</p>
              <p className="text-slate-600">{booking.customerPhone} · {booking.customerEmail}</p>
              <p className="text-slate-700 font-mono">GSTIN / UIN: {booking.customerGstin || 'Unregistered / Personal Host'}</p>
              <p className="text-slate-500 text-[11px]">Place of Supply: {booking.venueCity}, India</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Lease Scope & Reservation:</span>
              <p className="font-semibold text-slate-900">{booking.eventType} ({booking.guestCount.toLocaleString()} Patrons)</p>
              <p className="text-slate-600">Blocks Reserved: {booking.blockNames.join(', ')}</p>
              <p className="text-slate-600">Slot: {booking.timeSlot} reservation</p>
              <p className="text-emerald-700 font-medium">Payment Mode: {(booking.paymentMethod || 'upi').toUpperCase()} (Ref Verified)</p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-900 text-slate-600 text-[11px] font-bold uppercase">
                  <th className="py-2.5">#</th>
                  <th className="py-2.5">Description of Services</th>
                  <th className="py-2.5">SAC</th>
                  <th className="py-2.5 text-right">Taxable Value</th>
                  {booking.pricing.isInterstate ? (
                    <th className="py-2.5 text-right">IGST (18%)</th>
                  ) : (
                    <>
                      <th className="py-2.5 text-right">CGST (9%)</th>
                      <th className="py-2.5 text-right">SGST (9%)</th>
                    </>
                  )}
                  <th className="py-2.5 text-right">Total (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-3 font-semibold text-slate-500">1</td>
                  <td className="py-3">
                    <span className="font-bold text-slate-900 block">Rental of Commercial Event Blocks</span>
                    <span className="text-[10px] text-slate-500">{booking.blockNames.join(' + ')} on {formatDate(booking.eventDate)}</span>
                  </td>
                  <td className="py-3 font-mono text-slate-600">997212</td>
                  <td className="py-3 text-right font-medium">{formatCurrency(booking.pricing.baseRental)}</td>
                  {booking.pricing.isInterstate ? (
                    <td className="py-3 text-right">{formatCurrency(booking.pricing.igst)}</td>
                  ) : (
                    <>
                      <td className="py-3 text-right">{formatCurrency(booking.pricing.cgst)}</td>
                      <td className="py-3 text-right">{formatCurrency(booking.pricing.sgst)}</td>
                    </>
                  )}
                  <td className="py-3 text-right font-bold text-slate-900">
                    {formatCurrency(booking.pricing.baseRental + booking.pricing.cgst + booking.pricing.sgst + booking.pricing.igst)}
                  </td>
                </tr>

                {Boolean(booking.pricing.packageDiscount && booking.pricing.packageDiscount > 0) && (
                  <tr className="text-emerald-700">
                    <td className="py-2 font-semibold">2</td>
                    <td className="py-2 font-medium">Multi-Block Estate Combo Discount</td>
                    <td className="py-2 font-mono">997212</td>
                    <td className="py-2 text-right">-{formatCurrency(booking.pricing.packageDiscount || 0)}</td>
                    {booking.pricing.isInterstate ? (
                      <td className="py-2 text-right">-</td>
                    ) : (
                      <>
                        <td className="py-2 text-right">-</td>
                        <td className="py-2 text-right">-</td>
                      </>
                    )}
                    <td className="py-2 text-right font-semibold">-{formatCurrency(booking.pricing.packageDiscount || 0)}</td>
                  </tr>
                )}

                {booking.pricing.securityDeposit > 0 && (
                  <tr className="text-slate-600">
                    <td className="py-2 font-semibold">3</td>
                    <td className="py-2">
                      <span className="font-semibold block">Statutory Refundable Caution Deposit (Escrow)</span>
                      <span className="text-[10px] text-slate-400">Non-taxable security guarantee, refundable 48h post-event</span>
                    </td>
                    <td className="py-2 font-mono text-slate-400">Exempt</td>
                    <td className="py-2 text-right font-medium">{formatCurrency(booking.pricing.securityDeposit)}</td>
                    {booking.pricing.isInterstate ? (
                      <td className="py-2 text-right font-mono">₹0</td>
                    ) : (
                      <>
                        <td className="py-2 text-right font-mono">₹0</td>
                        <td className="py-2 text-right font-mono">₹0</td>
                      </>
                    )}
                    <td className="py-2 text-right font-bold text-slate-900">
                      {formatCurrency(booking.pricing.securityDeposit)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Calculation Summary Block */}
          <div className="flex justify-end pt-4">
            <div className="w-full sm:w-80 space-y-2 text-xs border-t-2 border-slate-900 pt-3">
              <div className="flex justify-between text-slate-600">
                <span>Taxable Value:</span>
                <span className="font-medium">{formatCurrency(booking.pricing.taxableAmount)}</span>
              </div>
              {!booking.pricing.isInterstate ? (
                <>
                  <div className="flex justify-between text-slate-600">
                    <span>CGST (9.0%):</span>
                    <span>{formatCurrency(booking.pricing.cgst)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>SGST (9.0%):</span>
                    <span>{formatCurrency(booking.pricing.sgst)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-slate-600">
                  <span>IGST (18.0%):</span>
                  <span>{formatCurrency(booking.pricing.igst)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Refundable Escrow Deposit:</span>
                <span>{formatCurrency(booking.pricing.securityDeposit)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 border-t border-slate-300 pt-2">
                <span>Gross Invoice Amount:</span>
                <span className="text-brand-gold">{formatCurrency(booking.pricing.grossTotal)}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-emerald-700">
                <span>Advance Paid / Received:</span>
                <span>{formatCurrency(booking.pricing.advancePaid)}</span>
              </div>
              {booking.pricing.balanceDue > 0 && (
                <div className="flex justify-between text-xs font-bold text-rose-700 bg-rose-50 p-2 rounded-lg">
                  <span>Balance Due (Due 7 Days Prior):</span>
                  <span>{formatCurrency(booking.pricing.balanceDue)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Statutory Declarations & Signatures */}
          <div className="border-t border-slate-200 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-[11px] text-slate-500">
            <div>
              <p className="font-bold text-slate-700 uppercase">Statutory Terms & Conditions:</p>
              <ul className="list-disc list-inside space-y-0.5 mt-1">
                <li>Goods & Services Tax (GST) charged under SAC Code 997212 (Real Estate Services).</li>
                <li>Refundable caution deposit is held in verified escrow and credited within 48 hours of event completion.</li>
                <li>Digital tax invoice generated under the GrandVenue Automated Architecture Suite.</li>
              </ul>
            </div>
            <div className="text-right flex flex-col justify-end">
              <div className="inline-block border-b border-slate-400 w-48 ml-auto mb-1"></div>
              <p className="font-bold text-slate-800">Authorized Signatory / Registrar</p>
              <p className="text-[10px] text-slate-400">GrandVenue Hospitality Private Limited</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
