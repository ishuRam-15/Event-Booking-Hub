'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { resetPasswordAction } from '@/app/actions/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await resetPasswordAction(email);
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>

        {submitted ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold font-serif text-slate-900">Reset Link Sent</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We have dispatched a secure password reset link to <span className="font-semibold text-slate-800">{email}</span>. Please check your inbox.
            </p>
            <div className="pt-3">
              <Link
                href="/login"
                className="bg-brand-charcoal text-brand-gold text-xs font-bold px-5 py-2.5 rounded-xl inline-block"
              >
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold font-serif text-slate-900">Reset Password</h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter your registered email address and we will send you a verification link to regain access.
              </p>
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

            <button
              type="submit"
              className="w-full bg-brand-charcoal hover:bg-brand-navy text-brand-gold font-bold py-3.5 rounded-xl text-sm transition-all shadow-md mt-2"
            >
              Send Password Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
