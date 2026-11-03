'use client';

import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Printer, 
  FileSpreadsheet, 
  FileText, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  ArrowUpRight 
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminSalesReportsPage() {
  const [period, setPeriod] = useState<'D' | 'W' | 'M' | 'Y' | 'custom'>('M');
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-11-02');

  // Multi-tier calculations based on selected filter
  const reportData = {
    D: {
      totalSales: 165000,
      baseRental: 140000,
      taxableAmount: 140000,
      totalGst: 25200,
      cgst: 12600,
      sgst: 12600,
      igst: 0,
      netRevenue: 140000,
      bookingsCount: 1,
      paidAmount: 165000,
      pendingPayments: 0,
      refundAmount: 0,
      cancelledAmount: 0,
    },
    W: {
      totalSales: 1045000,
      baseRental: 885000,
      taxableAmount: 885000,
      totalGst: 159300,
      cgst: 79650,
      sgst: 79650,
      igst: 0,
      netRevenue: 885000,
      bookingsCount: 4,
      paidAmount: 645000,
      pendingPayments: 400000,
      refundAmount: 0,
      cancelledAmount: 0,
    },
    M: {
      totalSales: 4850000,
      baseRental: 4110000,
      taxableAmount: 4110000,
      totalGst: 739800,
      cgst: 369900,
      sgst: 369900,
      igst: 0,
      netRevenue: 4110000,
      bookingsCount: 18,
      paidAmount: 3650000,
      pendingPayments: 1200000,
      refundAmount: 85000,
      cancelledAmount: 120000,
    },
    Y: {
      totalSales: 34200000,
      baseRental: 28980000,
      taxableAmount: 28980000,
      totalGst: 5216400,
      cgst: 2608200,
      sgst: 2608200,
      igst: 0,
      netRevenue: 28980000,
      bookingsCount: 114,
      paidAmount: 31800000,
      pendingPayments: 2400000,
      refundAmount: 450000,
      cancelledAmount: 720000,
    },
    custom: {
      totalSales: 2840000,
      baseRental: 2406000,
      taxableAmount: 2406000,
      totalGst: 433080,
      cgst: 216540,
      sgst: 216540,
      igst: 0,
      netRevenue: 2406000,
      bookingsCount: 9,
      paidAmount: 2100000,
      pendingPayments: 740000,
      refundAmount: 0,
      cancelledAmount: 0,
    },
  }[period];

  const handleExportExcel = () => {
    alert(`Exporting GST & Sales Ledger for Period [${period}] to GrandVenue_Sales_Report_${period}.xlsx`);
  };

  const handleExportPDF = () => {
    alert(`Generating Certified Tax Audit PDF Report for Period [${period}]...`);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
            Financial & Tax Accounting
          </span>
          <h1 className="text-2xl font-bold font-serif text-slate-900 mt-1">
            Sales Dashboard & Statutory GST Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Compliant with Indian Goods and Services Tax (GST) Act · SAC Code 997212
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Excel (.xlsx)</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
          >
            <FileText className="w-4 h-4 text-rose-600" />
            <span>PDF Report</span>
          </button>
          <button
            onClick={() => window.print()}
            className="bg-brand-charcoal hover:bg-brand-navy text-brand-gold font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Date Period Filter Selector */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold uppercase text-slate-500">Period:</span>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {(
              [
                { key: 'D', label: 'Daily (D)' },
                { key: 'W', label: 'Weekly (W)' },
                { key: 'M', label: 'Monthly (M)' },
                { key: 'Y', label: 'Yearly (Y)' },
                { key: 'custom', label: 'Custom Range' },
              ] as const
            ).map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  period === p.key
                    ? 'bg-brand-charcoal text-brand-gold shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {period === 'custom' && (
          <div className="flex items-center gap-2 text-xs">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold"
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold"
            />
          </div>
        )}
      </div>

      {/* Primary Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Gross Sales</span>
          <p className="text-2xl font-extrabold text-brand-charcoal">{formatCurrency(reportData.totalSales)}</p>
          <span className="text-xs text-slate-500 font-medium">{reportData.bookingsCount} Total Bookings</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Base Net Rental Revenue</span>
          <p className="text-2xl font-extrabold text-slate-900">{formatCurrency(reportData.baseRental)}</p>
          <span className="text-xs text-emerald-600 font-semibold">Excluding Taxes & Deposits</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Statutory GST Collected</span>
          <p className="text-2xl font-extrabold text-brand-gold">{formatCurrency(reportData.totalGst)}</p>
          <span className="text-xs text-slate-500">18% Applicable Tax Rate</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pending Balances</span>
          <p className="text-2xl font-extrabold text-amber-700">{formatCurrency(reportData.pendingPayments)}</p>
          <span className="text-xs text-slate-500">{formatCurrency(reportData.paidAmount)} Collected</span>
        </div>
      </div>

      {/* Comprehensive GST Breakdown Component */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold font-serif text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-gold" />
              <span>Statutory Goods & Services Tax (GST) Ledger</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Breakdown of CGST (9%), SGST (9%), and IGST (18%) liability for commercial venue services
            </p>
          </div>
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full">
            ITC Reconciliation Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Central GST (CGST @ 9%)</span>
            <p className="text-xl font-extrabold text-slate-900">{formatCurrency(reportData.cgst)}</p>
            <p className="text-[11px] text-slate-400">Intra-State Transactions</p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">State GST (SGST @ 9%)</span>
            <p className="text-xl font-extrabold text-slate-900">{formatCurrency(reportData.sgst)}</p>
            <p className="text-[11px] text-slate-400">State Government Share</p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Integrated GST (IGST @ 18%)</span>
            <p className="text-xl font-extrabold text-slate-900">{formatCurrency(reportData.igst)}</p>
            <p className="text-[11px] text-slate-400">Inter-State Bookings</p>
          </div>
        </div>

        {/* GST Audit Ledger Table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider">
                <th className="py-2.5">Accounting Head</th>
                <th className="py-2.5">SAC Classification</th>
                <th className="py-2.5 text-right">Taxable Turnover</th>
                <th className="py-2.5 text-right">CGST (9%)</th>
                <th className="py-2.5 text-right">SGST (9%)</th>
                <th className="py-2.5 text-right">Total GST</th>
                <th className="py-2.5 text-right">Gross Billing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              <tr>
                <td className="py-3 font-bold text-slate-900">Commercial Marriage & Convention Hall Rentals</td>
                <td className="py-3 font-mono">997212</td>
                <td className="py-3 text-right">{formatCurrency(reportData.taxableAmount)}</td>
                <td className="py-3 text-right">{formatCurrency(reportData.cgst)}</td>
                <td className="py-3 text-right">{formatCurrency(reportData.sgst)}</td>
                <td className="py-3 text-right font-bold text-brand-gold">{formatCurrency(reportData.totalGst)}</td>
                <td className="py-3 text-right font-extrabold text-slate-900">{formatCurrency(reportData.totalSales)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
