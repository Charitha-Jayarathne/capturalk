import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react';

export default function Footer({ onOpenBooking }) {
  return (
    <footer 
      id="contact" 
      className="bg-[#050507] text-neutral-300 relative overflow-hidden"
      style={{ paddingTop: '80px', paddingBottom: '64px' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Footer Grid */}
        <div 
          className="grid grid-cols-1 md:grid-cols-12 border-b border-neutral-800/80"
          style={{ gap: '56px', paddingBottom: '64px' }}
        >
          
          {/* Brand info */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <Link to="/" className="inline-block" style={{ marginBottom: '22px' }}>
                <Logo className="h-12" />
              </Link>
              
              <p 
                className="text-sm sm:text-[15px] leading-relaxed text-neutral-300/90 max-w-md font-light"
                style={{ marginBottom: '28px' }}
              >
                Captura LK is a premier wedding, portrait, and commercial cinematography atelier in Sri Lanka, dedicated to crafting timeless visual heirlooms with modern elegance and artistic distinction.
              </p>
            </div>

            {/* Social Links: Enlarged, Clearly Visible & Spaced */}
            <div className="flex flex-wrap items-center" style={{ gap: '16px', marginTop: '12px' }}>
              {/* Instagram */}
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-3 px-5 py-3 rounded-full bg-white/5 border border-neutral-700/80 hover:border-[#ff6a13] hover:bg-[#ff6a13]/15 text-neutral-200 hover:text-white transition-all duration-300 shadow-sm group"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5 fill-current text-[#ff6a13] group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="text-xs uppercase tracking-wider font-medium text-neutral-200">Instagram</span>
              </a>

              {/* Facebook */}
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-3 px-5 py-3 rounded-full bg-white/5 border border-neutral-700/80 hover:border-[#ff6a13] hover:bg-[#ff6a13]/15 text-neutral-200 hover:text-white transition-all duration-300 shadow-sm group"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5 fill-current text-[#ff6a13] group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.7 5H18V0h-3.808C10.597 0 9 1.583 9 4.615V8z"/>
                </svg>
                <span className="text-xs uppercase tracking-wider font-medium text-neutral-200">Facebook</span>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3">
            <h4 
              className="text-xs sm:text-sm uppercase tracking-[0.28em] text-[#ff6a13] font-semibold"
              style={{ marginBottom: '26px' }}
            >
              Explore Pages
            </h4>
            
            <ul className="text-sm sm:text-[15px] font-light">
              <li style={{ marginBottom: '16px' }}>
                <Link to="/" className="text-neutral-300 hover:text-[#ff6a13] hover:translate-x-1 transition-all inline-flex items-center gap-1.5">
                  Home Experience
                </Link>
              </li>
              <li style={{ marginBottom: '16px' }}>
                <Link to="/about" className="text-neutral-300 hover:text-[#ff6a13] hover:translate-x-1 transition-all inline-flex items-center gap-1.5">
                  About Us & Story
                </Link>
              </li>
              <li style={{ marginBottom: '16px' }}>
                <Link to="/gallery" className="text-neutral-300 hover:text-[#ff6a13] hover:translate-x-1 transition-all inline-flex items-center gap-1.5">
                  Masterpiece Gallery
                </Link>
              </li>
              <li style={{ marginBottom: '16px' }}>
                <Link to="/reviews" className="text-neutral-300 hover:text-[#ff6a13] hover:translate-x-1 transition-all inline-flex items-center gap-1.5">
                  Client Reviews & Stories
                </Link>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Link to="/contact" className="text-neutral-300 hover:text-[#ff6a13] hover:translate-x-1 transition-all inline-flex items-center gap-1.5">
                  Contact Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Studio Contact */}
          <div className="md:col-span-4">
            <h4 
              className="text-xs sm:text-sm uppercase tracking-[0.28em] text-[#ff6a13] font-semibold"
              style={{ marginBottom: '26px' }}
            >
              Studio Inquiry
            </h4>
            
            <div className="text-sm sm:text-[15px] text-neutral-300 font-light">
              <div className="flex items-start gap-3.5" style={{ marginBottom: '20px' }}>
                <MapPin className="w-5 h-5 text-[#ff6a13] flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">Colombo 07 & Kandy, Sri Lanka (Available Islandwide & Overseas)</span>
              </div>
              
              <div className="flex items-center gap-3.5" style={{ marginBottom: '20px' }}>
                <Phone className="w-5 h-5 text-[#ff6a13] flex-shrink-0" />
                <a href="https://wa.me/94771234567" target="_blank" rel="noreferrer" className="hover:text-[#ff6a13] transition-colors">
                  +94 77 123 4567 (Direct WhatsApp)
                </a>
              </div>
              
              <div className="flex items-center gap-3.5" style={{ marginBottom: '24px' }}>
                <Mail className="w-5 h-5 text-[#ff6a13] flex-shrink-0" />
                <a href="mailto:hello@capturalk.com" className="hover:text-[#ff6a13] transition-colors">
                  hello@capturalk.com
                </a>
              </div>
            </div>

            <div style={{ marginTop: '28px' }}>
              <Link
                to="/contact"
                className="w-full py-4 px-6 border border-[#ff6a13] bg-[#ff6a13] hover:bg-[#e05300] text-white text-xs sm:text-sm tracking-[0.24em] uppercase font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>CONTACT US</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div 
          className="text-center text-xs sm:text-sm text-neutral-400 font-light"
          style={{ paddingTop: '36px' }}
        >
          <p>© {new Date().getFullYear()} Captura LK Studio. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}
