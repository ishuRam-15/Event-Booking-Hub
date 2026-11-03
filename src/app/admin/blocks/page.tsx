'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Layers, 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  Maximize2, 
  Users, 
  Bed, 
  Car, 
  Wind, 
  UtensilsCrossed, 
  Sparkles,
  Save,
  X
} from 'lucide-react';
import { MOCK_VENUES } from '@/lib/mock-data';
import { VenueBlock } from '@/types';
import { formatCurrency, formatArea } from '@/lib/utils';

function DynamicBlocksContent() {
  const searchParams = useSearchParams();
  const initialVenueId = searchParams.get('venueId') || MOCK_VENUES[0].id;
  const [selectedVenueId, setSelectedVenueId] = useState(initialVenueId);

  const currentVenue = MOCK_VENUES.find((v) => v.id === selectedVenueId) || MOCK_VENUES[0];
  const [blocks, setBlocks] = useState<VenueBlock[]>(currentVenue.blocks);
  const [editingBlock, setEditingBlock] = useState<VenueBlock | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Switch venue
  const handleVenueChange = (newVenueId: string) => {
    setSelectedVenueId(newVenueId);
    const found = MOCK_VENUES.find((v) => v.id === newVenueId);
    if (found) {
      setBlocks(found.blocks);
    }
  };

  const handleCreateBlock = () => {
    const nextLetter = String.fromCharCode(65 + blocks.length);
    const newBlock: VenueBlock = {
      id: `blk-${Date.now()}`,
      venueId: selectedVenueId,
      name: `Block ${nextLetter} - Grand Pavilion Wing`,
      code: `BLOCK-${nextLetter}`,
      description: 'Newly added dynamic architectural wing with dedicated hall and feasting areas.',
      totalBuiltUpAreaSqFt: 15000,
      mainHallAreaSqFt: 9000,
      diningAreaSqFt: 4500,
      stageAreaSqFt: 800,
      cookingAreaSqFt: 700,
      guestRoomsCount: 6,
      carParkingCapacity: 100,
      seatingCapacity: 900,
      floatingCapacity: 1200,
      isAirConditioned: true,
      washrooms: { gents: 5, ladies: 6, accessible: 1 },
      amenities: ['Central Air Conditioning', 'Green Rooms', 'Generator Backup'],
      pricePerDay: 135000,
      halfDayPrice: 85000,
      images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80'],
      isAvailable: true,
    };
    setEditingBlock(newBlock);
    setIsModalOpen(true);
  };

  const handleSaveBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlock) return;

    setBlocks((prev) => {
      const exists = prev.some((b) => b.id === editingBlock.id);
      if (exists) {
        return prev.map((b) => (b.id === editingBlock.id ? editingBlock : b));
      } else {
        return [...prev, editingBlock];
      }
    });
    setIsModalOpen(false);
    setEditingBlock(null);
  };

  const handleDeleteBlock = (blockId: string) => {
    if (confirm('Delete this block from the venue compound?')) {
      setBlocks((prev) => prev.filter((b) => b.id !== blockId));
    }
  };

  const toggleAvailability = (blockId: string) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === blockId ? { ...b, isAvailable: !b.isAvailable } : b))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
            Block-Level Architecture
          </span>
          <h1 className="text-2xl font-bold font-serif text-slate-900 mt-1">
            Dynamic Block Management (CRUD)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure independent blocks (Block A, B, C, D+), facility dimensions, and dedicated pricing
          </p>
        </div>

        <button
          onClick={handleCreateBlock}
          className="bg-brand-charcoal hover:bg-brand-navy text-brand-gold font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm border border-amber-400/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Block</span>
        </button>
      </div>

      {/* Venue Selector Card */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-bold uppercase text-slate-500">Selected Venue:</span>
          <select
            value={selectedVenueId}
            onChange={(e) => handleVenueChange(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-brand-gold"
          >
            {MOCK_VENUES.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.city})
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs font-semibold text-slate-600">
          Showing <strong className="text-slate-900">{blocks.length} Dynamic Blocks</strong> for this compound
        </span>
      </div>

      {/* Blocks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blocks.map((block) => (
          <div
            key={block.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold bg-brand-charcoal text-brand-gold px-2.5 py-1 rounded-lg uppercase">
                  {block.code}
                </span>
                <button
                  onClick={() => toggleAvailability(block.id)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider transition-colors ${
                    block.isAvailable
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {block.isAvailable ? 'Available' : 'Reserved / Locked'}
                </button>
              </div>

              <div>
                <h3 className="font-bold text-base font-serif text-slate-900">{block.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{block.description}</p>
              </div>

              {/* Facility Breakdown */}
              <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Total Built-up:</span>
                  <strong className="text-slate-900 font-bold">{formatArea(block.totalBuiltUpAreaSqFt)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Main Hall:</span>
                  <span className="font-semibold text-slate-800">{formatArea(block.mainHallAreaSqFt)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Dining Banquet:</span>
                  <span className="font-semibold text-slate-800">{formatArea(block.diningAreaSqFt)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Seating Capacity:</span>
                  <span className="font-semibold text-slate-800">{block.seatingCapacity.toLocaleString()} seats</span>
                </div>
                <div className="flex justify-between">
                  <span>Guest Rooms:</span>
                  <span className="font-semibold text-slate-800">{block.guestRoomsCount} Rooms</span>
                </div>
                <div className="flex justify-between">
                  <span>Car Parking:</span>
                  <span className="font-semibold text-slate-800">{block.carParkingCapacity} Cars</span>
                </div>
                <div className="flex justify-between">
                  <span>Air Conditioning:</span>
                  <span className="font-semibold text-emerald-700">{block.isAirConditioned ? 'Yes (Central AC)' : 'Non-AC'}</span>
                </div>
              </div>

              {/* Price */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">Rental Rate:</span>
                <span className="text-base font-extrabold text-brand-charcoal">
                  {formatCurrency(block.pricePerDay)}
                  <span className="text-xs font-normal text-slate-400"> /day</span>
                </span>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setEditingBlock(block);
                  setIsModalOpen(true);
                }}
                className="text-xs font-bold text-brand-charcoal hover:text-brand-gold flex items-center gap-1.5 transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Block</span>
              </button>
              <button
                onClick={() => handleDeleteBlock(block.id)}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen && editingBlock && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold font-serif text-slate-900">
                {editingBlock.id.startsWith('blk-') ? 'Configure Block' : 'Add Dynamic Block'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBlock} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase">Block Name</label>
                  <input
                    type="text"
                    required
                    value={editingBlock.name}
                    onChange={(e) => setEditingBlock({ ...editingBlock, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase">Block Code</label>
                  <input
                    type="text"
                    required
                    value={editingBlock.code}
                    onChange={(e) => setEditingBlock({ ...editingBlock, code: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold uppercase"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase">Description</label>
                <input
                  type="text"
                  value={editingBlock.description}
                  onChange={(e) => setEditingBlock({ ...editingBlock, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase">Built-up (sq.ft)</label>
                  <input
                    type="number"
                    value={editingBlock.totalBuiltUpAreaSqFt}
                    onChange={(e) => setEditingBlock({ ...editingBlock, totalBuiltUpAreaSqFt: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase">Dining Area (sq.ft)</label>
                  <input
                    type="number"
                    value={editingBlock.diningAreaSqFt}
                    onChange={(e) => setEditingBlock({ ...editingBlock, diningAreaSqFt: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase">Seating Capacity</label>
                  <input
                    type="number"
                    value={editingBlock.seatingCapacity}
                    onChange={(e) => setEditingBlock({ ...editingBlock, seatingCapacity: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase">Guest Rooms</label>
                  <input
                    type="number"
                    value={editingBlock.guestRoomsCount}
                    onChange={(e) => setEditingBlock({ ...editingBlock, guestRoomsCount: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase">Car Parking</label>
                  <input
                    type="number"
                    value={editingBlock.carParkingCapacity}
                    onChange={(e) => setEditingBlock({ ...editingBlock, carParkingCapacity: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase">Price / Day (₹)</label>
                  <input
                    type="number"
                    value={editingBlock.pricePerDay}
                    onChange={(e) => setEditingBlock({ ...editingBlock, pricePerDay: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-brand-gold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="ac"
                  checked={editingBlock.isAirConditioned}
                  onChange={(e) => setEditingBlock({ ...editingBlock, isAirConditioned: e.target.checked })}
                  className="rounded text-brand-gold focus:ring-brand-gold/30 accent-brand-gold w-4 h-4"
                />
                <label htmlFor="ac" className="font-semibold text-slate-800">
                  Centralized Air Conditioning Equipped
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-brand-charcoal text-brand-gold font-bold shadow-md hover:bg-brand-navy"
                >
                  Save Block Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminBlocksPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading block management...</div>}>
      <DynamicBlocksContent />
    </Suspense>
  );
}
