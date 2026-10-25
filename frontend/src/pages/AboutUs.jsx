import React, { useState, useEffect } from 'react';
import RevealOnScroll from '../components/RevealOnScroll';
import { getAboutContent, getAboutContentAsync } from '../utils/aboutContentService';
import { Sparkles, Calendar, ShieldCheck, ArrowRight, Award } from 'lucide-react';

// Single Section Component with Dynamic Aspect Ratio & Orientation Detection
function AboutSectionItem({ section, index, onOpenBooking }) {
  const [imgDim, setImgDim] = useState({
    width: 0,
    height: 0,
    ratio: 1.33,
    isPortrait: false,
    loaded: false
  });

  const imgUrl = section.image || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1600&q=90';

  useEffect(() => {
    if (!imgUrl) return;
    const img = new Image();
    img.src = imgUrl;
    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      if (w && h) {
        const ratio = w / h;
        setImgDim({
          width: w,
          height: h,
          ratio: ratio,
          isPortrait: ratio < 0.95,
          loaded: true
        });
      }
    };
  }, [imgUrl]);

  const handleImgLoad = (e) => {
    const w = e.target.naturalWidth;
    const h = e.target.naturalHeight;
    if (w && h) {
      const ratio = w / h;
      setImgDim({
        width: w,
        height: h,
        ratio: ratio,
        isPortrait: ratio < 0.95,
        loaded: true
      });
    }
  };

  // Alternating layout: index 0 (even) = image left, text right; index 1 (odd) = text left, image right
  const isImageLeft = section.imagePosition ? section.imagePosition === 'left' : (index % 2 === 0);

  return (
    <section 
      id={section.id || `section-${index + 1}`}
      className="relative text-white py-16 sm:py-24 border-b border-neutral-900/60 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`flex flex-col ${isImageLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-16 items-center`}>
          
          {/* PHOTO COLUMN */}
          <div className="w-full lg:w-1/2 relative flex justify-center items-center">
            <RevealOnScroll direction={isImageLeft ? 'right' : 'left'} delay={100} className="w-full">
              <div 
                className={`relative overflow-hidden border border-neutral-800/80 bg-[#07070a] shadow-[0_20px_50px_rgba(0,0,0,0.8)] group transition-all duration-700 rounded-sm hover:border-[#ff6a13]/50 ${
                  imgDim.isPortrait 
                    ? 'w-full max-w-[440px] sm:max-w-[460px] lg:max-w-[480px] mx-auto' 
                    : 'w-full max-w-2xl mx-auto'
                }`}
              >
                {/* Responsive Full-Visibility Image Frame (Auto-adapts to portrait or landscape) */}
                <div 
                  className="relative w-full flex items-center justify-center bg-black/90 overflow-hidden"
                  style={{
                    aspectRatio: imgDim.ratio ? `${imgDim.width} / ${imgDim.height}` : (imgDim.isPortrait ? '3 / 4' : '16 / 10'),
                    maxHeight: imgDim.isPortrait ? '680px' : '520px'
                  }}
                >
                  {/* Ambient Soft Glow Behind Image */}
                  <img
                    src={imgUrl}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover filter blur-2xl opacity-25 scale-110 pointer-events-none"
                  />

                  {/* Main Uncropped Photo */}
                  <img
                    src={imgUrl}
                    alt={section.title || 'Captura LK Story'}
                    onLoad={handleImgLoad}
                    className="relative z-10 w-full h-full object-contain object-center transition-transform duration-700 group-hover:scale-[1.03]"
                  />

                  {/* Fine Art Hairline Ring */}
                  <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10 z-20" />

                  {/* Shimmer Sheen on Hover */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-60 transition-opacity duration-700 z-20">
                    <div className="w-1/2 h-[220%] absolute -top-1/2 left-0 pointer-events-none bg-gradient-to-r from-transparent via-white/10 to-transparent animate-story-glass-shimmer" />
                  </div>
                </div>

                {/* Subtle orientation indicator tag for visual polish */}
                <div className="px-4 py-2 bg-[#0a0a0f] border-t border-neutral-900 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                  <span className="flex items-center gap-1.5 text-neutral-300">
                    <Sparkles className="w-3 h-3 text-[#ff6a13]" />
                    {section.title}
                  </span>
                  <span className="uppercase tracking-widest text-[#ff6a13]">
                    {imgDim.isPortrait ? 'Portrait Frame' : 'Cinematic Panorama'}
                  </span>
                </div>
              </div>
            </RevealOnScroll>
          </div>

          {/* TEXT & NARRATIVE COLUMN */}
          <div className="w-full lg:w-1/2 z-10">
            <RevealOnScroll direction={isImageLeft ? 'left' : 'right'} delay={150}>
              <div className="space-y-6">
                
                {/* Section Tagline / Badge */}
                {section.tagline && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16120e] border border-[#ff6a13]/30 text-[#ff6a13] text-xs font-mono tracking-widest uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff6a13] animate-pulse" />
                    <span>{section.tagline}</span>
                  </div>
                )}

                {/* Section Title */}
                <h2 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white leading-[1.12]">
                  {section.title}
                  <span className="text-[#ff6a13]">.</span>
                </h2>

                {/* Callout Quote */}
                {section.quote && (
                  <div className="border-l-2 border-[#ff6a13] pl-4 sm:pl-5 py-1">
                    <p className="text-neutral-300 italic font-light text-base sm:text-lg leading-relaxed">
                      {section.quote}
                    </p>
                  </div>
                )}

                {/* Rich Text Editorial Narrative */}
                {section.richContent && (
                  <div 
                    className="text-neutral-400 font-normal leading-relaxed text-sm sm:text-base space-y-4 prose-p:my-3 prose-strong:text-white prose-strong:font-medium prose-em:italic prose-blockquote:border-l-2 prose-blockquote:border-[#ff6a13] prose-blockquote:pl-4 prose-blockquote:text-neutral-300"
                    dangerouslySetInnerHTML={{ __html: section.richContent }}
                  />
                )}

                {/* Stats / Heritage Badges */}
                {Array.isArray(section.stats) && section.stats.length > 0 && (
                  <div className="pt-4 border-t border-neutral-800/60 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {section.stats.map((stat, sIdx) => (
                      <div key={sIdx} className="p-3 bg-[#0c0c12] border border-neutral-800/80 rounded-sm">
                        <span className="block font-serif-luxury text-2xl sm:text-3xl text-[#ff6a13] font-light">
                          {stat.value}
                        </span>
                        <span className="block text-xs uppercase tracking-wider text-neutral-400 font-mono mt-0.5">
                          {stat.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </RevealOnScroll>
          </div>

        </div>
      </div>
    </section>
  );
}

export default function AboutUs({ onOpenBooking }) {
  const [aboutContent, setAboutContent] = useState(getAboutContent());

  useEffect(() => {
    getAboutContentAsync().then((loaded) => {
      if (loaded) setAboutContent(loaded);
    });

    const handleUpdate = () => {
      getAboutContentAsync().then((loaded) => {
        if (loaded) setAboutContent(loaded);
      });
    };

    window.addEventListener('captura_about_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('captura_about_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const { header, sections = [] } = aboutContent;

  return (
    <div className="min-h-screen bg-[#060608] text-neutral-100 selection:bg-[#ff6a13] selection:text-white">
      
      {/* HERO / ARRIVAL HEADER */}
      <section className="relative pt-44 pb-20 sm:pt-52 sm:pb-28 overflow-hidden border-b border-neutral-900">
        
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#ff6a13]/10 via-transparent to-transparent pointer-events-none blur-3xl opacity-40" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <RevealOnScroll direction="up" delay={50}>
            {header?.badge && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141210] border border-[#ff6a13]/40 text-[#ff6a13] text-xs font-mono tracking-widest uppercase mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{header.badge}</span>
              </div>
            )}
            
            <h1 className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-white tracking-tight leading-[1.08] mb-6">
              {header?.title || 'The Artisans Behind Captura LK'}
            </h1>

            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#ff6a13] to-transparent mx-auto mb-6" />

            <p className="max-w-2xl mx-auto text-neutral-300 text-sm sm:text-base md:text-lg font-light leading-relaxed">
              {header?.subtitle || 'Preserving Sri Lanka’s most distinguished nuptials, intimate celebrations, and cultural heritage with fine-art cinematic poise.'}
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* DYNAMIC ALTERNATING SECTIONS (Descending downward) */}
      <div className="divide-y divide-neutral-900/40">
        {sections.map((section, idx) => (
          <AboutSectionItem 
            key={section.id || idx}
            section={section}
            index={idx}
            onOpenBooking={onOpenBooking}
          />
        ))}
      </div>

      {/* BOTTOM INVITATION / CTA */}
      <section className="py-24 sm:py-32 bg-gradient-to-b from-[#060608] via-[#090910] to-[#060608] text-center relative overflow-hidden border-t border-neutral-900">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <RevealOnScroll direction="up" delay={50}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181310] border border-[#ff6a13]/30 text-[#ff6a13] text-xs font-mono tracking-widest uppercase mb-5">
              <span>COMMISSION YOUR VISUAL HEIRLOOM</span>
            </div>

            <h2 className="font-serif-luxury text-3xl sm:text-5xl md:text-6xl font-light text-white tracking-tight mb-6">
              Begin Your Story With Us<span className="text-[#ff6a13]">.</span>
            </h2>

            <p className="max-w-xl mx-auto text-neutral-400 text-sm sm:text-base mb-10 leading-relaxed font-light">
              Dates are reserved exclusively to ensure our principal artists give every celebration their undivided devotion. Contact our studio for your bespoke consultation.
            </p>

            <button
              type="button"
              onClick={onOpenBooking}
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#ff6a13] hover:bg-[#e05b0d] text-white text-xs sm:text-sm font-semibold tracking-widest uppercase rounded-sm shadow-[0_10px_35px_rgba(255,106,19,0.35)] transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Reserve Your Wedding Date</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </RevealOnScroll>
        </div>
      </section>

    </div>
  );
}
