import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { Menu, X, Phone, MessageSquare, ArrowUpRight, Sparkles } from 'lucide-react';

export default function Navbar({ onOpenBooking }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'HOME', path: '/', num: '01' },
    { name: 'ABOUT US', path: '/about', num: '02' },
    { name: 'PORTFOLIO', path: '/portfolio', num: '03' },
    { name: 'CLIENT GALLERY', path: '/client-gallery', num: '04' },
    { name: 'REVIEWS', path: '/reviews', num: '05' },
    { name: 'CONTACT US', path: '/contact', num: '06' },
  ];

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 bg-[#070707] border-b border-neutral-900 py-3.5 sm:py-4 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.95)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo / Brand Name */}
          <Link to="/" className="flex items-center gap-3 group relative z-50 shrink-0">
            <Logo />
          </Link>

          {/* Desktop Navigation (Visible on lg and above) */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-8 mx-auto px-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  "relative inline-flex items-center justify-center px-3.5 py-2 text-[11px] xl:text-xs tracking-[0.22em] uppercase transition-all duration-300 group whitespace-nowrap " +
                  (isActive
                    ? "text-[#ff6a13] font-medium"
                    : "text-neutral-300 font-light hover:text-white")
                }
                style={{ marginLeft: '6px', marginRight: '6px' }}
              >
                {({ isActive }) => (
                  <>
                    <span>{link.name}</span>
                    {isActive ? (
                      <span className="absolute -bottom-1 left-2 right-2 h-[2px] bg-[#ff6a13] rounded-full" />
                    ) : (
                      <span className="absolute -bottom-1 left-1/2 right-1/2 h-[1px] bg-white/40 transition-all duration-300 group-hover:left-2 group-hover:right-2" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Contact Us Button */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <Link
              to="/contact"
              className="px-5 sm:px-6 py-2.5 border border-[#ff6a13]/70 hover:border-[#ff6a13] hover:bg-[#ff6a13] text-white hover:text-white text-[11px] tracking-[0.22em] uppercase font-medium bg-black/40 backdrop-blur-md transition-all duration-300 shadow-sm cursor-pointer flex items-center gap-2 group"
            >
              <Sparkles className="w-3 h-3 text-[#ff6a13] group-hover:text-white transition-colors" />
              <span>CONTACT US</span>
            </Link>
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-none border border-neutral-800 bg-neutral-900/80 text-neutral-300 hover:text-white hover:border-[#ff6a13]/50 focus:outline-none transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-[#ff6a13]" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Luxury Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[65px] sm:top-[75px] z-40 bg-[#07070a]/98 backdrop-blur-2xl border-b border-neutral-800 flex flex-col justify-between overflow-y-auto animate-fadeIn">
          <div className="px-6 py-8 space-y-6">
            
            {/* Nav list */}
            <div className="flex flex-col space-y-2">
              <span className="text-[10px] uppercase tracking-[0.28em] text-[#ff6a13] font-semibold mb-2 block">
                Navigation Menu
              </span>
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    "flex items-center justify-between py-3.5 px-3 border-b border-neutral-800/60 transition-all " +
                    (isActive
                      ? "bg-[#ff6a13]/10 text-[#ff6a13] border-l-2 border-[#ff6a13] font-medium pl-4"
                      : "text-neutral-300 hover:text-white hover:pl-4 font-light")
                  }
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-neutral-500 font-mono">{link.num}</span>
                    <span className="text-sm tracking-[0.2em] uppercase">{link.name}</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500" />
                </NavLink>
              ))}
            </div>

            {/* Action Button inside mobile drawer */}
            <div className="pt-2">
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-4 bg-[#ff6a13] hover:bg-[#e05300] text-white text-xs tracking-[0.25em] uppercase font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>CONTACT US</span>
              </Link>
            </div>
          </div>

          {/* Bottom Quick Contact Strip in Drawer */}
          <div className="px-6 py-6 bg-neutral-950/80 border-t border-neutral-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-neutral-400">
            <a 
              href="https://wa.me/94771234567" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 text-neutral-300 hover:text-[#ff6a13] transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-[#ff6a13]" />
              <span>WhatsApp: +94 77 123 4567</span>
            </a>
            <span className="text-[11px] text-neutral-500">Colombo & Kandy, Sri Lanka</span>
          </div>
        </div>
      )}
    </header>
  );
}
