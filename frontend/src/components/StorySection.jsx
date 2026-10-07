import React from 'react';
import { ArrowRight, Calendar } from 'lucide-react';

export default function StorySection({ onOpenBooking }) {
  return (
    <section id="story" className="relative min-h-[90vh] bg-[#070707] text-white flex items-center py-20 lg:py-28 overflow-hidden border-t border-neutral-900/60">
      
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 left-[-150px] w-96 h-96 bg-[#ff6a13]/8 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Headline & Narrative */}
          <div className="lg:col-span-6 space-y-8 z-10">
            
            {/* Main Headline */}
            <div className="space-y-1">
              <h2 className="font-serif-luxury text-4xl sm:text-6xl xl:text-7xl font-light tracking-tight leading-[1.08] text-white">
                <span className="block font-normal">Inspired by the</span>
                <span className="block italic text-[#eaeaea] font-light">
                  Elegance of
                </span>
                <span className="block italic font-light text-white">
                  Simplicity<span className="text-[#ff6a13] not-italic">.</span>
                </span>
              </h2>
            </div>

            {/* Narrative text matching the reference, tailored for Captura LK */}
            <div className="space-y-4 max-w-xl text-neutral-400 font-normal leading-relaxed text-sm sm:text-base">
              <p>
                <strong className="text-white font-medium">Captura LK</strong> is a premier photography and videography studio in Sri Lanka dedicated to preserving life's most meaningful moments.
              </p>
              <p className="text-neutral-400/90 text-sm">
                Inspired by the elegance of simplicity, our lens captures more than just weddings; we bring an artistic perspective to casual shoots, corporate events, and special celebrations.
              </p>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onOpenBooking}
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-[#ff6a13] to-[#e05300] hover:from-[#ff7b2b] hover:to-[#ff6a13] text-white text-xs font-semibold tracking-[0.2em] uppercase rounded-none transition-all duration-300 shadow-lg shadow-[#ff6a13]/25 hover:shadow-[0_0_25px_rgba(255,106,19,0.5)]"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>RESERVE YOUR DATE</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#portfolio"
                className="inline-flex items-center gap-2 px-6 py-3.5 border border-neutral-700 bg-neutral-900/60 hover:border-[#ff6a13] text-neutral-300 hover:text-white text-xs font-medium tracking-[0.2em] uppercase rounded-none transition-colors"
              >
                <span>VIEW GALLERY</span>
              </a>
            </div>

            {/* Quick statistics */}
            <div className="pt-6 border-t border-neutral-900 grid grid-cols-3 gap-6 max-w-md">
              <div>
                <div className="font-serif-luxury text-2xl sm:text-3xl text-white font-normal">
                  850<span className="text-[#ff6a13]">+</span>
                </div>
                <div className="text-[10px] uppercase tracking-widest text-neutral-500 mt-1">
                  Weddings
                </div>
              </div>
              <div>
                <div className="font-serif-luxury text-2xl sm:text-3xl text-white font-normal">
                  100<span className="text-[#ff6a13]">%</span>
                </div>
                <div className="text-[10px] uppercase tracking-widest text-neutral-500 mt-1">
                  Satisfaction
                </div>
              </div>
              <div>
                <div className="font-serif-luxury text-2xl sm:text-3xl text-white font-normal">
                  Islandwide
                </div>
                <div className="text-[10px] uppercase tracking-widest text-neutral-500 mt-1">
                  Sri Lanka
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Featured Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-none overflow-hidden border border-neutral-800 bg-neutral-950 shadow-2xl group">
              
              {/* High-res sample photo */}
              <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] w-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1600&q=90"
                  alt="Fine Art Wedding by Captura LK"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />

                {/* Left & Bottom Dark Gradient Vignette */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#070707]/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-transparent pointer-events-none" />

                {/* Top Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 bg-black/80 backdrop-blur-md border border-neutral-700 text-white text-[10px] tracking-[0.2em] uppercase font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff6a13]" />
                    Fine Art Bridal Nuptials
                  </span>
                </div>

                {/* Bottom Caption */}
                <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between">
                  <div>
                    <h3 className="font-serif-luxury text-xl text-white font-medium">
                      Artistic Bridal Haute Couture
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Preserving heritage & eternal love in Sri Lanka
                    </p>
                  </div>

                  <span className="hidden sm:inline-block text-[10px] text-[#ff944d] uppercase tracking-widest font-mono">
                    CAPTURA LK FINE ART
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
