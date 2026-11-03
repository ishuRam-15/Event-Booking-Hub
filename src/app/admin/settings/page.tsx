'use client';

import React, { useState } from 'react';
import { Settings, Save, ShieldCheck, DollarSign, FileCheck, CheckCircle2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [gstRate, setGstRate] = useState('18');
  const [sacCode, setSacCode] = useState('997212');
  const [defaultAdvance, setDefaultAdvance] = useState('25');
  const [securityDepositMultiplier, setSecurityDepositMultiplier] = useState('50000');
  const [cancellationNoticeDays, setCancellationNoticeDays] = useState('45');
  const [refundPercentage, setRefundPercentage] = useState('50');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
          System Parameters
        </span>
        <h1 className="text-2xl font-bold font-serif text-slate-900 mt-1">
          Platform Configuration & Tax Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure statutory GST tax rates, cancellation rules, and commercial pricing policies
        </p>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-2 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Platform settings and tax configurations saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* GST Configuration */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-serif text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-gold" />
            <span>1. Statutory GST Configuration</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase">Applicable GST Slabs (%)</label>
              <input
                type="number"
                value={gstRate}
                onChange={(e) => setGstRate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-slate-900"
              />
              <span className="text-[10px] text-slate-400">Standard rate: 18% (CGST 9% + SGST 9%)</span>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase">Primary SAC Classification Code</label>
              <input
                type="text"
                value={sacCode}
                onChange={(e) => setSacCode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono font-bold text-slate-900"
              />
              <span className="text-[10px] text-slate-400">SAC 997212: Rental of event halls</span>
            </div>
          </div>
        </div>

        {/* Booking & Cancellation Policies */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-serif text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-brand-gold" />
            <span>2. Booking & Cancellation Terms</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase">Mandatory Advance Deposit (%)</label>
              <input
                type="number"
                value={defaultAdvance}
                onChange={(e) => setDefaultAdvance(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-slate-900"
              />
              <span className="text-[10px] text-slate-400">Percentage required to lock dates</span>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase">Default Refundable Caution Deposit (₹)</label>
              <input
                type="number"
                value={securityDepositMultiplier}
                onChange={(e) => setSecurityDepositMultiplier(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-slate-900"
              />
              <span className="text-[10px] text-slate-400">Held in escrow until hall post-event check</span>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase">Full Refund Notice Threshold (Days)</label>
              <input
                type="number"
                value={cancellationNoticeDays}
                onChange={(e) => setCancellationNoticeDays(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase">Late Cancellation Refund (%)</label>
              <input
                type="number"
                value={refundPercentage}
                onChange={(e) => setRefundPercentage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="bg-brand-charcoal hover:bg-brand-navy text-brand-gold font-bold px-8 py-3 rounded-xl text-xs flex items-center gap-2 shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
