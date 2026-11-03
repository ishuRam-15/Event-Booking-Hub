'use client';

import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Minus, 
  Maximize2, 
  Users, 
  Bed, 
  Car, 
  Wind, 
  UtensilsCrossed, 
  Sparkles, 
  ShieldCheck,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { VenueBlock } from '@/types';
import { formatCurrency, formatArea } from '@/lib/utils';

interface BlockCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  blocks: VenueBlock[];
  onSelectBlocks?: (selectedBlockIds: string[]) => void;
}

export default function BlockCompareModal({
  isOpen,
  onClose,
  blocks,
  onSelectBlocks,
}: BlockCompareModalProps) {
  const [activeBlockIds, setActiveBlockIds] = useState<string[]>(
    blocks.slice(0, 2).map((b) => b.id)
  );

  if (!isOpen) return null;

  const toggleActive = (id: string) => {
    setActiveBlockIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev; // keep at least 1 active
        return prev.filter((bId) => bId !== id);
      }
      return [...prev, id];
    });
  };

  // Pricing calculations
  const rawTotal = blocks
    .filter((b) => activeBlockIds.includes(b.id))
    .reduce((sum, b) => sum + b.pricePerDay, 0);

  const isAllThree = activeBlockIds.length === blocks.length && blocks.length >= 3;
  const finalTotal = isAllThree ? Math.round(rawTotal * 0.88) : rawTotal; // 12% discount

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-brand-charcoal text-white px-6 py-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-brand-gold uppercase tracking-wider">
                Side-by-Side Comparison Matrix
              </span>
              <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                {activeBlockIds.length} of {blocks.length} Blocks Active
              </span>
            </div>
            <h3 className="text-xl font-bold font-serif mt-0.5">
              Architectural Block Capacity & Specification Matrix
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Active Comparison Selector Pill Buttons (Stitch Feature) */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Toggle Active Comparison Views:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {blocks.map((b) => {
                const active = activeBlockIds.includes(b.id);
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => toggleActive(b.id)}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border transition-all text-xs font-bold ${
                      active
                        ? 'bg-white text-slate-900 border-brand-gold shadow-sm ring-1 ring-brand-gold'
                        : 'bg-slate-100 text-slate-400 border-slate-200 opacity-60'
                    }`}
                  >
                    {active ? (
                      <CheckCircle2 className="w-4 h-4 text-brand-gold fill-brand-gold/20" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-400" />
                    )}
                    <span>{b.code} ({b.name.split(' · ')[1] || b.name})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Matrix Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left border-collapse min-w-[650px] text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="py-4 px-4 text-slate-500 font-bold uppercase tracking-wider w-1/4">
                    Architectural Attribute
                  </th>
                  {blocks.map((b) => {
                    const active = activeBlockIds.includes(b.id);
                    return (
                      <th
                        key={b.id}
                        className={`py-4 px-4 transition-opacity ${
                          active ? 'opacity-100' : 'opacity-25 grayscale'
                        }`}
                      >
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded uppercase">
                          {b.code}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-1 font-serif">
                          {b.name}
                        </h4>
                        <p className="text-sm font-extrabold text-brand-charcoal mt-0.5">
                          {formatCurrency(b.pricePerDay)}
                          <span className="text-[10px] text-slate-400 font-normal"> /day</span>
                        </p>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {/* Built-up */}
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Total Built-up Area</td>
                  {blocks.map((b) => (
                    <td key={b.id} className="py-3 px-4 font-semibold">
                      {formatArea(b.totalBuiltUpAreaSqFt)}
                    </td>
                  ))}
                </tr>
                {/* Main Hall */}
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Main Hall Floor Space</td>
                  {blocks.map((b) => (
                    <td key={b.id} className="py-3 px-4">
                      {b.mainHallAreaSqFt > 0 ? formatArea(b.mainHallAreaSqFt) : 'None (Dining/Lawn)'}
                    </td>
                  ))}
                </tr>
                {/* Dining */}
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Dining Area Surface</td>
                  {blocks.map((b) => (
                    <td key={b.id} className="py-3 px-4">
                      {b.diningAreaSqFt > 0 ? formatArea(b.diningAreaSqFt) : 'Pantry Staging Only'}
                    </td>
                  ))}
                </tr>
                {/* Stage Layout */}
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Stage Proscenium Layout</td>
                  {blocks.map((b) => (
                    <td key={b.id} className="py-3 px-4">
                      {b.stageAreaSqFt > 0 ? `${formatArea(b.stageAreaSqFt)} (Grand Built-in)` : 'None configured'}
                    </td>
                  ))}
                </tr>
                {/* Kitchen Capability */}
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Commercial Kitchen Setup</td>
                  {blocks.map((b) => (
                    <td key={b.id} className="py-3 px-4">
                      {b.cookingAreaSqFt > 1500 ? (
                        <span className="font-bold text-emerald-700">{formatArea(b.cookingAreaSqFt)} (Full Commercial Steam)</span>
                      ) : (
                        <span>{formatArea(b.cookingAreaSqFt)} (Staging)</span>
                      )}
                    </td>
                  ))}
                </tr>
                {/* Capacity */}
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Capacity (Seated / Floating)</td>
                  {blocks.map((b) => (
                    <td key={b.id} className="py-3 px-4 font-semibold">
                      {b.seatingCapacity.toLocaleString()} Seated / {b.floatingCapacity.toLocaleString()} Float
                    </td>
                  ))}
                </tr>
                {/* Climate */}
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Climate Control</td>
                  {blocks.map((b) => (
                    <td key={b.id} className="py-3 px-4">
                      {b.isAirConditioned ? (
                        <span className="text-emerald-700 font-bold">Dual Carrier Central HVAC</span>
                      ) : (
                        <span className="text-slate-500">Open Air + Mist Fans</span>
                      )}
                    </td>
                  ))}
                </tr>
                {/* Rooms */}
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">AC Guest / Bridal Suites</td>
                  {blocks.map((b) => (
                    <td key={b.id} className="py-3 px-4">
                      {b.guestRoomsCount} Suites
                    </td>
                  ))}
                </tr>
                {/* Parking */}
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Dedicated Parking Bays</td>
                  {blocks.map((b) => (
                    <td key={b.id} className="py-3 px-4 font-semibold">
                      {b.carParkingCapacity} Cars (Valet)
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer & Full Estate Bundle Promo (Exact Stitch Feature) */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 shrink-0 space-y-3">
          {/* Bundle Promo Bar */}
          <div className="bg-amber-100/60 border border-amber-300/80 p-3 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-brand-charcoal text-brand-gold text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                Estate Combo
              </span>
              <span className="text-xs font-bold text-amber-950">
                Full Estate Bundle: Save 12% on All 3 Blocks
              </span>
            </div>
            <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              Save {formatCurrency(Math.round(rawTotal * 0.12))}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] text-slate-500 block">Combined Package Rate:</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-slate-900">
                  {formatCurrency(finalTotal)}
                </span>
                {isAllThree && (
                  <span className="text-xs text-slate-400 line-through">
                    {formatCurrency(rawTotal)}
                  </span>
                )}
                <span className="text-[10px] text-slate-500 font-normal">+ 18% GST Applicable</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onSelectBlocks) onSelectBlocks(activeBlockIds);
                  onClose();
                }}
                className="bg-brand-charcoal hover:bg-brand-navy text-brand-gold font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <span>Select {activeBlockIds.length} Blocks ({formatCurrency(finalTotal)})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
