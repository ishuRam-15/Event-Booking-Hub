'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3.5 py-1.5 rounded-full">
          We are here to assist
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-slate-900">
          Connect with Our Venue Concierge
        </h1>
        <p className="text-sm text-slate-500 font-light">
          Have questions about multi-block reservations, site visit scheduling, or listing your venue? Reach out today.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info */}
        <div className="lg:col-span-5 bg-brand-charcoal text-white p-8 rounded-3xl border border-amber-500/20 shadow-xl space-y-6">
          <div>
            <h3 className="text-xl font-bold font-serif">Headquarters & Concierge</h3>
            <p className="text-xs text-slate-300 mt-1">Available Monday to Sunday, 08:00 AM – 09:00 PM IST</p>
          </div>

          <div className="space-y-4 text-sm text-slate-300">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
              <span>Level 7, Prestige Tower, Nungambakkam High Rd, Chennai, Tamil Nadu - 600034</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-brand-gold shrink-0" />
              <span>+91 (044) 4890 2200 / +91 98400 11223</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-brand-gold shrink-0" />
              <span>concierge@grandvenue.com</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700 text-xs text-slate-400">
            <p>For urgent day-of-event coordinator support, use your dedicated booking reference on the hotline.</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          {submitted ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-serif text-slate-900">Inquiry Received!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Our venue relations specialist will review your inquiry and contact you within 2 business hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs font-bold text-brand-gold hover:underline mt-2"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Your Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Karthik S"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Phone Number</label>
                  <input
                    required
                    type="tel"
                    placeholder="+91 98401 23456"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Email Address</label>
                <input
                  required
                  type="email"
                  placeholder="name@example.com"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Event Type / Inquiry Topic</label>
                <select className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-brand-gold">
                  <option>Wedding & Reception Venue Inquiries</option>
                  <option>Corporate Summit / Conference Booking</option>
                  <option>Site Visit Appointment</option>
                  <option>Venue Listing Partnership</option>
                  <option>Other Questions</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Message & Requirements</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Mention your estimated guest count, dates, and preferred venue blocks..."
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-brand-gold"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-charcoal hover:bg-brand-navy text-brand-gold font-bold py-3.5 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
