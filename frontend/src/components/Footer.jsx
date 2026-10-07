import React from 'react';
import Logo from './Logo';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer({ onOpenBooking }) {
  return (
    <footer id="contact" className="bg-[#050507] border-t border-neutral-900 text-neutral-400 py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-neutral-900">
          
          {/* Brand info */}
          <div className="md:col-span-5 space-y-4">
            <Logo className="h-10" />
            <p className="text-xs leading-relaxed text-neutral-400 max-w-sm pt-2">
              Captura LK is a premier wedding, portrait, and commercial cinematography studio based in Sri Lanka, creating timeless visual heirlooms with modern elegance.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              {/* Instagram */}
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-[#ff6a13] hover:border-[#ff6a13] transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* Facebook */}
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-[#ff6a13] hover:border-[#ff6a13] transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.7 5H18V0h-3.808C10.597 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.25em] text-white font-semibold">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#home" className="hover:text-[#ff6a13] transition-colors">Home Experience</a></li>
              <li><a href="#story" className="hover:text-[#ff6a13] transition-colors">About Captura LK</a></li>
              <li><a href="#portfolio" className="hover:text-[#ff6a13] transition-colors">Weddings & Homecoming</a></li>
              <li><a href="#portfolio" className="hover:text-[#ff6a13] transition-colors">Pre-Shoots & Engagements</a></li>
            </ul>
          </div>

          {/* Studio Contact */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.25em] text-white font-semibold">
              Studio Inquiry
            </h4>
            <div className="space-y-2.5 text-xs text-neutral-400">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#ff6a13] flex-shrink-0 mt-0.5" />
                <span>Colombo & Kandy, Sri Lanka (Islandwide Coverage)</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#ff6a13] flex-shrink-0" />
                <a href="https://wa.me/94771234567" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  +94 77 123 4567 / WhatsApp
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#ff6a13] flex-shrink-0" />
                <a href="mailto:hello@capturalk.com" className="hover:text-white transition-colors">
                  hello@capturalk.com
                </a>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={onOpenBooking}
                className="w-full sm:w-auto px-5 py-2.5 bg-neutral-900 border border-neutral-700 hover:border-[#ff6a13] hover:text-white text-xs font-semibold tracking-widest uppercase transition-all"
              >
                Reserve 2026/2027 Dates
              </button>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 gap-4">
          <div>
            &copy; {new Date().getFullYear()} Captura LK. Fine Art Wedding & Event Photography.
          </div>
          <div className="flex items-center gap-1">
            <span>Crafted with passion in Sri Lanka</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
