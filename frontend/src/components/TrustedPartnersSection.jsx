import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import RevealOnScroll from './RevealOnScroll';

export default function TrustedPartnersSection({ content }) {
  const partners = (content?.items && content.items.length > 0) ? content.items : [];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);
  const timerRef = useRef(null);

  // Responsive: mobile 2, tablet 3, desktop 4
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(2);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(3);
      } else {
        setVisibleCount(4);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPartners = partners.length;
  const maxIndex = Math.max(0, totalPartners - visibleCount);

  // Smooth auto-slide every 3.6s
  useEffect(() => {
    if (isPaused || totalPartners <= visibleCount) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3600);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, maxIndex, totalPartners, visibleCount]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  if (content?.isHidden || totalPartners === 0) {
    return null;
  }

  const bgCustom = Boolean(content?.customBgImage) && content?.bgType !== 'default';
  const bgOpacity = content?.bgOpacity !== undefined ? content.bgOpacity : 0.40;

  return (
    <section
      id="partners"
      className="relative overflow-hidden transition-colors duration-500"
      style={{
        paddingTop: 'clamp(70px, 9vw, 110px)',
        paddingBottom: 'clamp(70px, 9vw, 110px)',
        backgroundColor: bgCustom ? 'transparent' : '#07070a',
        backgroundImage: bgCustom
          ? `linear-gradient(rgba(7, 7, 10, ${bgOpacity}), rgba(7, 7, 10, ${bgOpacity})), url("${content.customBgImage}")`
          : 'linear-gradient(to bottom, #060608 0%, #090910 50%, #060608 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Soft luxury ambient center glow */}
      <div 
        style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '750px',
          height: '350px',
          backgroundColor: 'rgba(255, 106, 19, 0.04)',
          borderRadius: '9999px',
          filter: 'blur(150px)',
          pointerEvents: 'none'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Centered Luxury Section Heading (Unified with Recent Albums, Reviews & Story) */}
        <RevealOnScroll direction="up" delay={50}>
          <div className="text-center mb-12 sm:mb-16">
            <div className="w-px h-7 bg-gradient-to-b from-transparent via-[#ff6a13]/70 to-transparent mx-auto mb-3.5 animate-luxury-line" />
            
            <p className="text-[#ff6a13] text-xs font-semibold tracking-[0.25em] uppercase font-mono mb-2">
              {content?.badge || 'OUR PRESTIGIOUS NETWORK'}
            </p>

            <h2 className="font-serif-luxury text-3xl sm:text-5xl lg:text-5xl text-white font-light tracking-tight">
              {content?.title || 'Trusted Partners'}
            </h2>

            {content?.subtitle && (
              <p className="mt-3.5 text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
                {content.subtitle}
              </p>
            )}
          </div>
        </RevealOnScroll>

        {/* Single Row Slider Track - Exactly 4 items visible at a time on desktop */}
        <RevealOnScroll direction="up" delay={150}>
          <div className="overflow-hidden relative py-3">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
              }}
            >
              {partners.map((partner, idx) => (
                <div
                  key={partner.id || idx}
                  className="flex-shrink-0 px-2.5 sm:px-3.5"
                  style={{ width: `${100 / visibleCount}%` }}
                >
                  <div className="h-full min-h-[220px] sm:min-h-[240px] bg-gradient-to-b from-[#12121b]/80 via-[#0d0d14]/90 to-[#09090e]/95 border border-neutral-800/80 hover:border-[#ff6a13]/70 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-between text-center group relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_22px_45px_rgba(0,0,0,0.75)]">
                    
                    {/* Top luxury amber hairline expanding on hover */}
                    <div className="absolute top-0 left-0 w-0 group-hover:w-full h-[2px] bg-gradient-to-r from-transparent via-[#ff6a13] to-transparent transition-all duration-500 ease-out" />

                    {/* Logo Display Container */}
                    <div className="w-full flex-1 flex items-center justify-center px-2 py-4">
                      {partner.logo ? (
                        <img
                          src={partner.logo}
                          alt={partner.name}
                          loading="lazy"
                          className="max-h-16 sm:max-h-20 max-w-[180px] sm:max-w-[210px] w-auto object-contain filter group-hover:scale-105 transition-all duration-500"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            if (e.target.nextSibling) {
                              e.target.nextSibling.style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}

                      {/* Fallback Luxury Monogram Badge */}
                      <div
                        style={{ display: partner.logo ? 'none' : 'flex' }}
                        className="w-16 h-16 rounded-full bg-[#161622] border border-[#ff6a13]/40 items-center justify-center text-[#ffaa66] font-bold text-2xl font-serif-luxury shadow-inner group-hover:border-[#ff6a13] group-hover:bg-[#ff6a13]/15 transition-all duration-300"
                      >
                        {(partner.name || 'P').charAt(0).toUpperCase()}
                      </div>
                    </div>

                    {/* Partner Name & Subtitle */}
                    <div className="mt-2 w-full">
                      <h4 className="font-serif-luxury text-sm sm:text-base font-normal tracking-wide text-neutral-200 group-hover:text-white transition-colors duration-300 line-clamp-1">
                        {partner.name}
                      </h4>

                      <div className="mt-2 flex items-center justify-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff6a13]" />
                        <span className="text-[10px] text-[#ffaa66] font-mono tracking-widest uppercase">Premier Partner</span>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealOnScroll>

        {/* Unified Bottom Navigation & Progress Dots */}
        {totalPartners > visibleCount && (
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              type="button"
              onClick={handlePrev}
              className="w-10 h-10 rounded-full bg-[#101018] border border-neutral-800 text-neutral-300 hover:text-white hover:border-[#ff6a13] hover:bg-[#ff6a13]/10 transition-all duration-300 flex items-center justify-center shadow-lg active:scale-95"
              aria-label="Previous partners"
              title="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => setCurrentIndex(dotIdx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentIndex === dotIdx
                      ? 'w-7 bg-[#ff6a13]'
                      : 'w-2 bg-neutral-800 hover:bg-neutral-600'
                  }`}
                  aria-label={`Go to slide set ${dotIdx + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-[#101018] border border-neutral-800 text-neutral-300 hover:text-white hover:border-[#ff6a13] hover:bg-[#ff6a13]/10 transition-all duration-300 flex items-center justify-center shadow-lg active:scale-95"
              aria-label="Next partners"
              title="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
