'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, Mail, Lock, User, Phone, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { signUpAction } from '@/app/actions/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await signUpAction({ name, email, password, phone });
      if (res.success && res.redirectTo) {
        router.push(res.redirectTo);
        router.refresh();
      } else {
        setErrorMsg(res.error || 'Registration failed. Please check inputs.');
        setLoading(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xl">
        {/* Left Column: Hospitality Visual */}
        <div className="relative hidden lg:block bg-brand-charcoal text-white p-10 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1545232979-fbf68fe9ec47?auto=format&fit=crop&w=1000&q=80"
            alt="Venue Setup"
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
                Reserve premier venues with total peace of mind.
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                Join thousands of wedding hosts, event coordinators, and corporate planners. Unlock exclusive block comparisons, transparent advance locks, and priority site visits.
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-gold" />
                <span>Save and compare multiple venue blocks</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-gold" />
                <span>Full GST tax invoice generation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Register Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-2xl font-bold font-serif text-slate-900">
              Create Customer Account
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Start discovering and booking verified venues today.
            </p>

            {errorMsg && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleRegister} className="mt-6 space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Karthik Subramanian"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-3 text-slate-900 focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-3 text-slate-900 focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98401 23456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-3 text-slate-900 focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-3 text-slate-900 focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  required
                  id="terms"
                  defaultChecked
                  className="rounded text-brand-gold focus:ring-brand-gold/30 accent-brand-gold w-4 h-4 mt-0.5"
                />
                <label htmlFor="terms" className="text-[11px] text-slate-600 leading-tight cursor-pointer">
                  I agree to the Terms of Service, Cancellation Policy, and GST billing guidelines.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-charcoal hover:bg-brand-navy text-brand-gold font-bold py-3.5 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 mt-2 border border-amber-400/30"
              >
                {loading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-brand-gold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
