import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { Menu, X } from 'lucide-react';

export default function Navbar({ onOpenBooking }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOME', href: '#home' },
    { name: 'ABOUT', href: '#story' },
    { name: 'PORTFOLIO', href: '#portfolio' },
    { name: 'CLIENT GALLERY', href: '#portfolio' },
    { name: 'REVIEWS', href: '#story' },
    { name: 'CONTACT', href: '#contact' },
  ];

  return (
    <header 
      className={
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 " + 
        (isScrolled 
          ? "bg-[#070707]/90 backdrop-blur-md border-b border-white/5 py-4 shadow-2xl" 
          : "bg-gradient-to-b from-black/80 via-black/30 to-transparent py-6")
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo / Brand Name */}
          <div className="flex items-center gap-3">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-9">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-[11px] sm:text-xs tracking-[0.22em] uppercase font-light text-neutral-300 hover:text-[#ff6a13] transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Reserve Now Button */}
          <div className="hidden sm:flex items-center">
            <button
              type="button"
              onClick={onOpenBooking}
              className="px-6 py-2.5 border border-white/50 hover:border-[#ff6a13] hover:bg-[#ff6a13] text-white text-[11px] tracking-[0.24em] uppercase font-light bg-black/20 hover:text-white backdrop-blur-sm transition-all duration-300 rounded-none shadow-sm hover:shadow-[0_0_25px_rgba(255,106,19,0.4)]"
            >
              RESERVE NOW
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-300 hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#ff6a13]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#09090b]/95 backdrop-blur-lg border-b border-neutral-800 px-6 py-6 space-y-4 animate-fadeIn">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-neutral-300 hover:text-[#ff6a13] py-2 text-xs tracking-[0.2em] uppercase font-light border-b border-neutral-900"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-3 bg-[#ff6a13] hover:bg-[#e05300] text-white text-xs tracking-[0.25em] uppercase font-medium transition-all"
            >
              RESERVE NOW
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
