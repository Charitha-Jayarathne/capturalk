import React, { useState, useEffect } from 'react';
import RevealOnScroll from '../components/RevealOnScroll';
import { getAboutContent, getAboutContentAsync } from '../utils/aboutContentService';
import { Sparkles } from 'lucide-react';

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

  // User-selected alignment: 'left' = Photo Left, Text Right; 'right' = Text Left, Photo Right
  const isImageLeft = section.imagePosition === 'right' ? false : (section.imagePosition === 'left' ? true : (index % 2 === 0));
  const isCustomBg = section.bgType === 'custom' && Boolean(section.customBgImage);

  return (
    <section 
      id={section.id || `section-${index + 1}`}
      className="relative text-white about-section-spacing border-b border-neutral-900/60 overflow-hidden"
      style={{
        backgroundColor: '#060608',
        backgroundImage: isCustomBg ? `url(${section.customBgImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background Darkness & Atmospheric Overlay */}
      {isCustomBg ? (
        <div 
          className="absolute inset-0 pointer-events-none" 
          style={{ 
            backgroundColor: `rgba(6, 6, 8, ${section.bgOpacity !== undefined ? section.bgOpacity : 0.45})`
          }} 
        />
      ) : (
        /* Subtle Glow for default solid black */
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#ff6a13]/5 via-transparent to-transparent pointer-events-none blur-3xl opacity-30" />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center about-two-col-grid">
          
          {/* PHOTO COLUMN: Order 1 if Photo Left, Order 2 if Photo Right */}
          <div className={`w-full relative flex justify-center items-center ${isImageLeft ? 'md:order-1 about-col-order-1' : 'md:order-2 about-col-order-2'}`}>
            <RevealOnScroll direction={isImageLeft ? 'right' : 'left'} delay={100} once={true} className="w-full">
              <div 
                className={`relative overflow-hidden border border-neutral-800/80 bg-[#07070a] shadow-[0_20px_50px_rgba(0,0,0,0.8)] group transition-all duration-700 rounded-sm hover:border-[#ff6a13]/50 ${
                  imgDim.isPortrait 
                    ? 'w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[460px] mx-auto' 
                    : 'w-full max-w-2xl mx-auto'
                }`}
              >
                {/* Responsive Full-Visibility Image Frame (Auto-adapts to portrait or landscape) */}
                <div 
                  className="relative w-full flex items-center justify-center bg-black/90 overflow-hidden"
                  style={{
                    aspectRatio: imgDim.ratio ? `${imgDim.width} / ${imgDim.height}` : (imgDim.isPortrait ? '3 / 4' : '16 / 10'),
                    maxHeight: imgDim.isPortrait ? 'min(65vh, 580px)' : 'min(50vh, 460px)'
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
              </div>
            </RevealOnScroll>
          </div>

          {/* TEXT & NARRATIVE COLUMN: Order 2 if Photo Left, Order 1 if Photo Right */}
          <div className={`w-full z-10 ${isImageLeft ? 'md:order-2 about-col-order-2' : 'md:order-1 about-col-order-1'}`}>
            <RevealOnScroll direction={isImageLeft ? 'left' : 'right'} delay={150} once={true}>
              <div className="space-y-4 sm:space-y-6">
                
                {/* Section Tagline / Badge */}
                {section.tagline && (
                  <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-[#16120e] border border-[#ff6a13]/30 text-[#ff6a13] text-[10px] sm:text-xs font-mono tracking-widest uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff6a13] animate-pulse" />
                    <span>{section.tagline}</span>
                  </div>
                )}

                {/* Section Title */}
                <h2 className="about-section-title tracking-tight text-white">
                  {section.title}
                  <span className="text-[#ff6a13]">.</span>
                </h2>

                {/* Callout Quote */}
                {section.quote && (
                  <div className="border-l-2 border-[#ff6a13] pl-3.5 sm:pl-5 py-1">
                    <p className="text-neutral-300 italic font-light text-sm sm:text-base lg:text-lg leading-relaxed">
                      {section.quote}
                    </p>
                  </div>
                )}

                {/* Rich Text Editorial Narrative */}
                {section.richContent && (
                  <div 
                    className="text-neutral-400 font-normal leading-relaxed text-xs sm:text-sm lg:text-base space-y-3 sm:space-y-4 prose-p:my-2 prose-p:sm:my-3 prose-strong:text-white prose-strong:font-medium prose-em:italic prose-blockquote:border-l-2 prose-blockquote:border-[#ff6a13] prose-blockquote:pl-4 prose-blockquote:text-neutral-300"
                    dangerouslySetInnerHTML={{ __html: section.richContent }}
                  />
                )}

                {/* Stats / Heritage Badges */}
                {Array.isArray(section.stats) && section.stats.length > 0 && (
                  <div className="pt-4 border-t border-neutral-800/60 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    {section.stats.map((stat, sIdx) => (
                      <div 
                        key={sIdx} 
                        className={`p-3 bg-[#0c0c12] border border-neutral-800/80 rounded-sm ${
                          sIdx === 2 && section.stats.length === 3 ? 'col-span-2 sm:col-span-1' : ''
                        }`}
                      >
                        <span className="block font-serif-luxury text-xl sm:text-2xl lg:text-3xl text-[#ff6a13] font-light">
                          {stat.value}
                        </span>
                        <span className="block text-[10px] sm:text-xs uppercase tracking-wider text-neutral-400 font-mono mt-0.5">
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
    window.scrollTo(0, 0);
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
      <section className="relative about-hero-header overflow-hidden border-b border-neutral-900">
        
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#ff6a13]/10 via-transparent to-transparent pointer-events-none blur-3xl opacity-40" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <RevealOnScroll direction="up" delay={50} once={true}>
            {header?.badge && (
              <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#141210] border border-[#ff6a13]/40 text-[#ff6a13] text-[10px] sm:text-xs font-mono tracking-widest uppercase mb-4 sm:mb-6">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>{header.badge}</span>
              </div>
            )}
            
            <h1 className="about-hero-title tracking-tight mb-4 sm:mb-6">
              {header?.title || 'The Artisans Behind Captura LK'}
            </h1>

            <div className="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent via-[#ff6a13] to-transparent mx-auto mb-4 sm:mb-6" />

            <p className="max-w-2xl mx-auto text-neutral-300 text-xs sm:text-base md:text-lg font-light leading-relaxed">
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

    </div>
  );
}
