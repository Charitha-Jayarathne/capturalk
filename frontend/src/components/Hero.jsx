import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Hero({ onOpenBooking }) {
  const backgrounds = [
    {
      id: 'ballroom',
      url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=2400&q=90',
      title: 'Romantic Evening Reception',
    },
    {
      id: 'golden-hour',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2400&q=90',
      title: 'Golden Sunset Romance',
    },
    {
      id: 'vows',
      url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=2400&q=90',
      title: 'Intimate Ceremony',
    }
  ];

  const [activeBgIndex, setActiveBgIndex] = useState(0);
  const activeBg = backgrounds[activeBgIndex];

  return (
    <section 
      id="home" 
      className="relative w-full h-screen min-h-[640px] flex flex-col justify-between items-center text-white overflow-hidden select-none"
    >
      {/* Background Image with Cinematic Grading */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src={activeBg.url}
          alt="Captura LK Wedding Experience"
          className="w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.05] transition-all duration-1000 ease-out transform scale-100"
        />

        {/* Cinematic Vignette Overlays matching reference */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/85" />
        
        {/* Subtle orange warm ambient glow for the brand identity */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,106,19,0.08)_0%,transparent_70%)] pointer-events-none" />
      </div>

      {/* Top spacer to balance vertical centering with the navbar */}
      <div className="w-full pt-20" />

      {/* Main Center Content (Mirroring navrowedz.com hero layout exactly) */}
      <div className="w-full max-w-5xl mx-auto px-4 flex flex-col items-center justify-center text-center z-10 my-auto">
        
        {/* Main Title: CAPTURA LK */}
        <h1 className="font-didone text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-[0.15em] sm:tracking-[0.19em] uppercase text-white drop-shadow-[0_12px_28px_rgba(0,0,0,0.9)] transition-all">
          CAPTURA LK
        </h1>

        {/* Subtitle: INSPIRED BY THE ELEGANCE OF SIMPLICITY */}
        <p className="text-xs sm:text-sm md:text-base tracking-[0.32em] sm:tracking-[0.44em] uppercase font-light text-neutral-200 mt-5 sm:mt-6 mb-8 sm:mb-10 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
          INSPIRED BY THE ELEGANCE OF SIMPLICITY
        </p>

        {/* Central Action Button: VIEW PORTFOLIO */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <a
            href="#story"
            className="group relative inline-flex items-center justify-center px-8 sm:px-10 py-3 sm:py-3.5 border border-white/45 bg-black/30 hover:bg-[#ff6a13] hover:border-[#ff6a13] text-white text-xs sm:text-sm tracking-[0.26em] uppercase font-light backdrop-blur-sm transition-all duration-300 rounded-none shadow-lg hover:shadow-[0_0_30px_rgba(255,106,19,0.5)]"
          >
            <span className="relative z-10">VIEW PORTFOLIO</span>
          </a>

          {/* Quick Reserve Consultation Action */}
          <button
            type="button"
            onClick={onOpenBooking}
            className="sm:hidden px-6 py-2.5 border border-[#ff6a13] bg-[#ff6a13]/80 text-white text-[11px] tracking-[0.2em] uppercase font-light rounded-none"
          >
            RESERVE NOW
          </button>
        </div>

      </div>

      {/* Bottom Center: Scroll Down Chevron Arrow */}
      <div className="w-full pb-8 flex flex-col items-center justify-center z-10">
        <a
          href="#story"
          className="group flex flex-col items-center gap-1 text-neutral-400 hover:text-white transition-colors animate-float-down"
          aria-label="Scroll down to explore"
        >
          <ChevronDown className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.25] text-white/80 group-hover:text-[#ff6a13] transition-colors" />
        </a>

        {/* Ambient Mood Switcher */}
        <div className="hidden md:flex items-center gap-2 mt-2 opacity-40 hover:opacity-100 transition-opacity">
          {backgrounds.map((bg, idx) => (
            <button
              key={bg.id}
              onClick={() => setActiveBgIndex(idx)}
              className={
                "h-1 rounded-full transition-all duration-300 " + 
                (activeBgIndex === idx ? "w-6 bg-[#ff6a13]" : "w-2 bg-white/40 hover:bg-white")
              }
              title={bg.title}
              aria-label={"Switch atmosphere to " + bg.title}
            />
          ))}
        </div>
      </div>

    </section>
  );
}
