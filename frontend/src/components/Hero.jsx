import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getHomeContent, getHomeContentAsync } from '../utils/homeContentService';

export default function Hero({ onOpenBooking, content }) {
  const [heroContent, setHeroContent] = useState(content || getHomeContent().hero);
  const [activeBgIndex, setActiveBgIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: -999, y: -999, width: 0 });
  const touchStartXRef = useRef(null);

  useEffect(() => {
    if (content) {
      setHeroContent(content);
    }
  }, [content]);

  useEffect(() => {
    const handleUpdate = () => {
      getHomeContentAsync().then((loaded) => {
        if (loaded?.hero) {
          setHeroContent(loaded.hero);
        } else {
          setHeroContent(getHomeContent().hero);
        }
      });
    };

    window.addEventListener('captura_home_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('captura_home_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const defaultSlides = [
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

  // Compile full set of slides (including customBgImage if set)
  const backgrounds = useMemo(() => {
    let list = Array.isArray(heroContent?.slides) && heroContent.slides.length > 0 
      ? [...heroContent.slides] 
      : [...defaultSlides];

    // If custom background is set, ensure it is represented in the rotation as primary
    if (heroContent?.bgType === 'custom' && heroContent?.customBgImage) {
      const exists = list.some(s => s.url === heroContent.customBgImage);
      if (!exists) {
        list = [{ id: 'custom-bg', url: heroContent.customBgImage, title: 'Featured Background' }, ...list];
      }
    }
    return list.filter(s => Boolean(s?.url));
  }, [heroContent]);

  // Keep active index within bounds if slide count changes
  useEffect(() => {
    if (activeBgIndex >= backgrounds.length) {
      setActiveBgIndex(0);
    }
  }, [backgrounds.length, activeBgIndex]);

  // Automatic Slide Rotation (Auto-slide every 5.5s with reset on manual action)
  useEffect(() => {
    if (backgrounds.length <= 1) return;

    const timer = setInterval(() => {
      setActiveBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [backgrounds.length, activeBgIndex]);

  // Navigation handlers
  const handlePrev = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveBgIndex((prev) => (prev - 1 + backgrounds.length) % backgrounds.length);
  };

  const handleNext = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveBgIndex((prev) => (prev + 1) % backgrounds.length);
  };

  // Keyboard navigation (ArrowLeft & ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [backgrounds.length]);

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      touchStartXRef.current = e.touches[0].clientX;
    }
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        handleNext(); // swiped left -> next
      } else {
        handlePrev(); // swiped right -> prev
      }
    }
    touchStartXRef.current = null;
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      width: rect.width
    });
  };

  const isNearLeft = mousePos.x >= 0 && mousePos.x <= 200;
  const isNearRight = mousePos.width > 0 && mousePos.x >= mousePos.width - 200;
  const isInsideHero = mousePos.x >= 0;

  if (heroContent?.isHidden) {
    return null;
  }

  return (
    <section 
      id="home" 
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos({ x: -999, y: -999, width: 0 })}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative isolate w-full min-h-[100dvh] h-[100dvh] min-h-[600px] sm:min-h-[680px] flex flex-col justify-between items-center text-white overflow-hidden select-none"
    >
      {/* Background Slideshow Images (Crossfade & Smooth Transition) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {backgrounds.map((bg, idx) => {
          const isActive = idx === activeBgIndex;
          return (
            <img
              key={bg.id || bg.url || idx}
              src={bg.url}
              alt={bg.title || "Captura LK Wedding Experience"}
              className={`absolute inset-0 w-full h-full object-cover object-center filter brightness-100 contrast-[1.01] transition-all duration-1000 ease-in-out ${
                isActive 
                  ? 'opacity-100 scale-100 z-10' 
                  : 'opacity-0 scale-[1.03] z-0'
              }`}
              loading={idx === 0 ? 'eager' : 'lazy'}
            />
          );
        })}

        {/* Dynamic Image Overlay (Darkness Layer from Admin Settings) */}
        {((heroContent?.bgOpacity ?? 0.10) > 0) && (
          <div 
            className="absolute inset-0 transition-opacity duration-500 pointer-events-none z-10"
            style={{
              backgroundColor: `rgba(0, 0, 0, ${heroContent?.bgOpacity !== undefined ? heroContent.bgOpacity : 0.10})`
            }} 
          />
        )}

        {/* Delicate hairline gradient at the very top for navbar readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/20 pointer-events-none z-10" />
      </div>

      {/* Left Proximity-Activated Navigation Arrow Zone (offset below navbar) */}
      {backgrounds.length > 1 && (
        <div 
          className="hero-side-zone hero-side-zone-left absolute left-0 top-20 bottom-16 sm:top-24 sm:bottom-20 w-24 sm:w-44 z-30 flex items-center justify-start pl-3 sm:pl-8 pointer-events-auto"
        >
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous Hero Image"
            title="Previous Image"
            className="hero-nav-arrow hero-nav-arrow-left p-3 sm:p-4 rounded-full border backdrop-blur-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#ff6a13]"
          >
            <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7 stroke-[2.2]" />
          </button>
        </div>
      )}

      {/* Right Proximity-Activated Navigation Arrow Zone (offset below navbar) */}
      {backgrounds.length > 1 && (
        <div 
          className="hero-side-zone hero-side-zone-right absolute right-0 top-20 bottom-16 sm:top-24 sm:bottom-20 w-24 sm:w-44 z-30 flex items-center justify-end pr-3 sm:pr-8 pointer-events-auto"
        >
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next Hero Image"
            title="Next Image"
            className="hero-nav-arrow hero-nav-arrow-right p-3 sm:p-4 rounded-full border backdrop-blur-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#ff6a13]"
          >
            <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7 stroke-[2.2]" />
          </button>
        </div>
      )}

      {/* Top spacer to guarantee clearance below the fixed navbar */}
      <div className="w-full pt-20 sm:pt-24 md:pt-28 shrink-0" />

      {/* Main Center Content (Luxury Didone Typography) */}
      <div className="w-full max-w-5xl mx-auto px-4 flex flex-col items-center justify-center text-center z-10 my-auto">
        
        {/* Masked Baseline Container for CAPTURA LK */}
        <div className="overflow-hidden py-3 sm:py-4 px-2 sm:px-4">
          <div className="animate-masked-slide-up">
            <h1 
              className="font-didone text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-light uppercase text-white animate-luxury-breathe cursor-default group select-none drop-shadow-[0_4px_28px_rgba(0,0,0,0.85)]"
            >
              <span>{heroContent?.title?.split(' ')?.[0] || 'CAPTURA'}</span>
              <span style={{ marginLeft: 'clamp(14px, 3.5vw, 48px)' }}>
                {heroContent?.title?.split(' ')?.[1] || 'LK'}
              </span>
            </h1>
          </div>
        </div>

        {/* Masked Baseline Container for Subtitle */}
        <div className="overflow-hidden mt-3 sm:mt-5 py-1">
          <p className="text-[11px] sm:text-sm md:text-base uppercase font-light text-neutral-200 tracking-wider sm:tracking-normal drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] animate-masked-subtitle">
            {heroContent?.tagline || 'INSPIRED BY THE ELEGANCE OF SIMPLICITY'}
          </p>
        </div>
      </div>

      {/* Bottom Center: Scroll Down Chevron Arrow & Atmosphere Dots */}
      <div className="w-full pb-6 sm:pb-8 flex flex-col items-center justify-center z-10">
        <a
          href="#story"
          onClick={(e) => {
            e.preventDefault();
            const targetEl = document.getElementById('story') || document.getElementById('categories');
            if (targetEl) {
              targetEl.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="group flex flex-col items-center gap-1 text-neutral-400 hover:text-white transition-colors animate-float-down"
          aria-label="Scroll down to explore"
        >
          <ChevronDown className="w-6 h-6 sm:w-8 sm:h-8 stroke-[1.25] text-white/80 group-hover:text-[#ff6a13] transition-colors" />
        </a>

        {/* Ambient Mood Switcher / Slide Progress Indicator */}
        {backgrounds.length > 1 && (
          <div className="flex items-center gap-2 mt-3 py-1 px-3 rounded-full bg-black/25 backdrop-blur-sm border border-white/10 opacity-60 hover:opacity-100 transition-opacity">
            {backgrounds.map((bg, idx) => (
              <button
                key={bg.id || bg.url || idx}
                onClick={() => setActiveBgIndex(idx)}
                className={
                  "h-1.5 rounded-full transition-all duration-300 cursor-pointer " + 
                  (activeBgIndex === idx ? "w-7 bg-[#ff6a13]" : "w-2 bg-white/40 hover:bg-white")
                }
                title={bg.title || `Slide ${idx + 1}`}
                aria-label={"Switch atmosphere to " + (bg.title || `Slide ${idx + 1}`)}
              />
            ))}
          </div>
        )}
      </div>

    </section>
  );
}
