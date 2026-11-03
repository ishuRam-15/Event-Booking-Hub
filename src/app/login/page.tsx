'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, Mail, Lock, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<'customer' | 'admin'>('customer');
  const [email, setEmail] = useState('karthik.s@gmail.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    }, 600);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xl">
        {/* Left Col: Brand Luxury Imagery */}
        <div className="relative hidden lg:block bg-brand-charcoal text-white p-10 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=80"
            alt="Venue Ambiance"
            className="absolute inset-0 w-full h-full object-cover filter brightness-[0.35]"
          />
          <div className="relative z-10 h-full flex flex-col justify-between space-y-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-charcoal border border-amber-400/30 flex items-center justify-center text-brand-gold shadow-md">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-serif">
                Grand<span className="text-brand-gold">Venue</span>
              </span>
            </Link>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold font-serif leading-snug">
                Welcome back to your event headquarters.
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                Manage your multi-block reservations, review upcoming event timelines, download official GST invoices, and track your facility coordinators.
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-gold" />
                <span>Instant SAC 997212 GST Invoices</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-gold" />
                <span>Multi-Block Real-Time Availability</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Login Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-between space-y-6">
          <div>
            {/* Role Switcher */}
            <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => {
                  setRole('customer');
                  setEmail('karthik.s@gmail.com');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  role === 'customer'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Customer / Event Host
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole('admin');
                  setEmail('admin@grandvenue.com');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  role === 'admin'
                    ? 'bg-brand-charcoal text-brand-gold shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Venue Administrator
              </button>
            </div>

            <h3 className="text-2xl font-bold font-serif text-slate-900">
              {role === 'customer' ? 'Customer Sign In' : 'Admin Portal Access'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Enter your credentials to access your account dashboard.
            </p>

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-3 text-slate-900 focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[11px] font-semibold text-brand-gold hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-3 text-slate-900 focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="remember"
                  defaultChecked
                  className="rounded text-brand-gold focus:ring-brand-gold/30 accent-brand-gold w-4 h-4"
                />
                <label htmlFor="remember" className="text-xs text-slate-600 cursor-pointer">
                  Keep me signed in for 30 days
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-charcoal hover:bg-brand-navy text-brand-gold font-bold py-3.5 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 mt-2 border border-amber-400/30"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to {role === 'customer' ? 'Dashboard' : 'Admin Portal'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link href="/register" className="font-bold text-brand-gold hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
