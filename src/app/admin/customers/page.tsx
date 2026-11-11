'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Phone, 
  Mail, 
  Building, 
  CalendarCheck2, 
  ShieldCheck,
  Eye,
  FileSpreadsheet
} from 'lucide-react';
import { MOCK_CURRENT_USER, MOCK_BOOKINGS } from '@/lib/mock-data';
import { Customer } from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([
    MOCK_CURRENT_USER,
    {
      id: 'cust-2',
      name: 'Priya Narayanan',
      email: 'priya.n@techcorp.io',
      phone: '+91 98840 98765',
      company: 'TechCorp Software India Pvt Ltd',
      gstin: '29ABCDE1234F1Z8',
      address: 'Prestige Tech Cloud, Whitefield',
      city: 'Bengaluru',
      state: 'Karnataka',
      bookingsCount: 2,
      totalSpent: 620000,
      savedVenueIds: ['venue-2'],
    },
    {
      id: 'cust-3',
      name: 'Ananya Reddy',
      email: 'ananya.reddy@gmail.com',
      phone: '+91 97000 11223',
      company: 'Reddy Estates LLP',
      gstin: '36AAACE4321A1Z9',
      address: 'Road No 36, Jubilee Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      bookingsCount: 1,
      totalSpent: 511600,
      savedVenueIds: ['venue-3'],
    },
    {
      id: 'cust-4',
      name: 'Vikram Rao',
      email: 'vikram.rao@deccancelebrations.com',
      phone: '+91 98490 44556',
      company: 'Deccan Celebrations',
      address: 'Banjara Hills, Road No. 12',
      city: 'Hyderabad',
      state: 'Telangana',
      bookingsCount: 4,
      totalSpent: 1240000,
      savedVenueIds: ['venue-1', 'venue-3'],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
            Customer Directory
          </span>
          <h1 className="text-2xl font-bold font-serif text-slate-900 mt-1">
            Registered Host & Customer Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage verified event planners, corporate accounts, and individual wedding hosts
          </p>
        </div>

        <button
          onClick={() => alert('Customer roster exported to CSV')}
          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Export Customer Directory</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by customer name, email, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 focus:outline-none focus:border-brand-gold"
          />
        </div>
        <span className="text-xs text-slate-500 hidden sm:inline-block">
          {filtered.length} Registered Accounts
        </span>
      </div>

      {/* Customers Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-6">Customer Name</th>
                <th className="py-3 px-6">Contact Coordinates</th>
                <th className="py-3 px-6">Organization & GSTIN</th>
                <th className="py-3 px-6">Location</th>
                <th className="py-3 px-6">Total Bookings</th>
                <th className="py-3 px-6">Gross Spend</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-charcoal text-brand-gold flex items-center justify-center font-bold text-xs">
                      {c.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 font-serif text-sm">{c.name}</p>
                      <span className="text-[10px] text-slate-400">ID: {c.id}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-slate-800 font-semibold">{c.phone}</p>
                    <p className="text-[11px] text-slate-400">{c.email}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-slate-900">{c.company || 'Personal Host'}</p>
                    <p className="text-[11px] font-mono text-slate-400">{c.gstin || 'No GSTIN'}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-slate-800">{c.city}</p>
                    <p className="text-[11px] text-slate-400">{c.state}</p>
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-900">
                    {c.bookingsCount} Events
                  </td>
                  <td className="py-4 px-6 font-extrabold text-brand-charcoal">
                    {formatCurrency(c.totalSpent)}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => alert(`Showing full reservation records for ${c.name}`)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors"
                    >
                      History
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
