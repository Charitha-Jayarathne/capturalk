import React, { useState } from 'react';
import { X, Calendar, MapPin, Phone, Mail, User, CheckCircle2, MessageSquare, Send } from 'lucide-react';

export default function BookingModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    eventType: 'Traditional / Kandyan Wedding',
    eventDate: '',
    location: '',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Captura LK! I would like to inquire about reserving a date.\n\n` +
    `• Name: ${formData.name || 'Client'}\n` +
    `• Event: ${formData.eventType}\n` +
    `• Date: ${formData.eventDate || 'Not specified'}\n` +
    `• Location: ${formData.location || 'Sri Lanka'}\n` +
    `• Notes: ${formData.notes || 'None'}`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div 
        className="relative w-full max-w-lg bg-[#0e0e12] border border-neutral-800 shadow-2xl p-6 sm:p-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Accent Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#ff6a13]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-[#ff6a13]/10 border border-[#ff6a13]/40 rounded-full flex items-center justify-center mx-auto text-[#ff6a13]">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="font-serif-luxury text-3xl font-medium text-white">Date Inquiry Received</h3>
            <p className="text-neutral-400 text-sm max-w-sm mx-auto">
              Thank you, <span className="text-white font-medium">{formData.name}</span>. The Captura LK team will review date availability and reach out to you shortly.
            </p>
            <div className="pt-4 flex flex-col gap-3">
              <a
                href={`https://wa.me/94771234567?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#ff6a13] hover:bg-[#e05300] text-white text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 shadow-lg shadow-[#ff6a13]/25 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                Instant WhatsApp Confirmation
              </a>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="text-xs text-neutral-400 hover:text-white uppercase tracking-wider py-1"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] text-[#ff6a13] font-semibold uppercase mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff6a13]" />
                Captura LK Reservations
              </div>
              <h3 className="font-serif-luxury text-2xl sm:text-3xl font-medium text-white">
                Reserve Your Date
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Let us preserve your timeless moments with cinematic artistry.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider text-neutral-400 font-semibold mb-1 text-[11px]">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Kasun & Dinithi"
                    className="w-full pl-9 pr-3 py-2.5 bg-neutral-900 border border-neutral-800 text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-[#ff6a13] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider text-neutral-400 font-semibold mb-1 text-[11px]">
                    Phone / WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+94 7X XXX XXXX"
                      className="w-full pl-9 pr-3 py-2.5 bg-neutral-900 border border-neutral-800 text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-[#ff6a13] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-neutral-400 font-semibold mb-1 text-[11px]">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@domain.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-neutral-900 border border-neutral-800 text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-[#ff6a13] transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider text-neutral-400 font-semibold mb-1 text-[11px]">
                    Event Type
                  </label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full px-3 py-2.5 bg-neutral-900 border border-neutral-800 text-neutral-100 focus:outline-none focus:border-[#ff6a13] transition-colors"
                  >
                    <option>Traditional / Kandyan Wedding</option>
                    <option>Western / Church Wedding</option>
                    <option>Homecoming Ceremony</option>
                    <option>Engagement & Pre-Shoot</option>
                    <option>Corporate & Brand Event</option>
                    <option>Editorial / Portrait Session</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-neutral-400 font-semibold mb-1 text-[11px]">
                    Expected Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                    <input
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 bg-neutral-900 border border-neutral-800 text-neutral-100 focus:outline-none focus:border-[#ff6a13] transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-neutral-400 font-semibold mb-1 text-[11px]">
                  Location / Venue
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Colombo / Kandy / Galle"
                    className="w-full pl-9 pr-3 py-2.5 bg-neutral-900 border border-neutral-800 text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-[#ff6a13] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-neutral-400 font-semibold mb-1 text-[11px]">
                  Notes / Package Requirements
                </label>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Share details on photography, cinematic video, drone coverage, etc."
                  className="w-full p-2.5 bg-neutral-900 border border-neutral-800 text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-[#ff6a13] transition-colors"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-[#ff6a13] to-[#e05300] hover:from-[#ff7b2b] hover:to-[#ff6a13] text-white font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_4px_20px_rgba(255,106,19,0.35)] flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Reservation Inquiry</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
