import React, { useState, useEffect } from 'react';
import RevealOnScroll from './RevealOnScroll';
import { getHomeContent, getHomeContentAsync } from '../utils/homeContentService';

export default function StorySection({ onOpenBooking, content }) {
  const [storyContent, setStoryContent] = useState(content || getHomeContent().story);

  useEffect(() => {
    if (content) {
      setStoryContent(content);
    }
  }, [content]);

  useEffect(() => {
    const handleUpdate = () => {
      getHomeContentAsync().then((loaded) => {
        if (loaded?.story) {
          setStoryContent(loaded.story);
        } else {
          setStoryContent(getHomeContent().story);
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

  const isCustomBg = Boolean(storyContent?.customBgImage) && storyContent?.bgType !== 'default';
  const bgOpacity = storyContent?.bgOpacity !== undefined ? storyContent.bgOpacity : 0.40;
  const featuredImg = storyContent?.featuredImage || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1600&q=90';

  // Dynamic aspect ratio & orientation detection (Portrait vs Landscape auto-adapt)
  const [imgDimensions, setImgDimensions] = useState({
    width: 0,
    height: 0,
    ratio: 1.33,
    isPortrait: false,
    loaded: false
  });

  useEffect(() => {
    if (!featuredImg) return;
    const img = new Image();
    img.src = featuredImg;
    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      if (w && h) {
        const ratio = w / h;
        setImgDimensions({
          width: w,
          height: h,
          ratio: ratio,
          isPortrait: ratio < 0.95,
          loaded: true
        });
      }
    };
  }, [featuredImg]);

  const handleImgLoad = (e) => {
    const w = e.target.naturalWidth;
    const h = e.target.naturalHeight;
    if (w && h) {
      const ratio = w / h;
      setImgDimensions({
        width: w,
        height: h,
        ratio: ratio,
        isPortrait: ratio < 0.95,
        loaded: true
      });
    }
  };

  if (storyContent?.isHidden) {
    return null;
  }

  return (
    <section 
      id="story" 
      className="relative text-white flex items-center overflow-hidden scroll-mt-20 sm:scroll-mt-24"
      style={{
        paddingTop: 'clamp(64px, 8vw, 96px)',
        paddingBottom: 'clamp(48px, 6vw, 64px)',
        backgroundColor: isCustomBg ? 'transparent' : '#060608',
        backgroundImage: isCustomBg 
          ? `linear-gradient(rgba(6, 6, 8, ${bgOpacity}), rgba(6, 6, 8, ${bgOpacity})), url("${storyContent.customBgImage}")`
          : 'linear-gradient(to bottom, #060608, #08080c, #060608)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Editorial Headline & Narrative */}
          <div className="lg:col-span-6 z-10">
            <RevealOnScroll direction="up" delay={80}>
              <div className="space-y-8">
                {/* Main Headline */}
                <div className="space-y-1">
                  <h2 className="font-serif-luxury text-4xl sm:text-6xl xl:text-7xl font-light tracking-tight leading-[1.08] text-white">
                    <span className="block font-normal">{storyContent?.headingPart1 || 'Inspired by the'}</span>
                    <span className="block italic text-[#eaeaea] font-light">
                      {storyContent?.headingPart2 || 'Elegance of'}
                    </span>
                    <span className="block italic font-light text-white">
                      {storyContent?.headingPart3 || 'Simplicity'}<span className="text-[#ff6a13]">.</span>
                    </span>
                  </h2>
                </div>

                {/* Narrative text matching the reference, tailored for Captura LK */}
                <div className="space-y-4 max-w-xl text-neutral-400 font-normal leading-relaxed text-sm sm:text-base">
                  <p>
                    <strong className="text-white font-medium">Captura LK</strong> is a premier photography and videography studio in Sri Lanka dedicated to preserving life's most meaningful moments.
                  </p>
                  <p className="text-neutral-400/90 text-sm">
                    {storyContent?.secondaryParagraph || "Inspired by the elegance of simplicity, our lens captures more than just weddings; we bring an artistic perspective to casual shoots, corporate events, and special celebrations."}
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          </div>

          {/* Right Column: Featured Showcase (Auto-Adapts to Portrait or Landscape with Full Visibility) */}
          <div className="lg:col-span-6 relative flex justify-center items-center w-full">
            <RevealOnScroll direction="up" delay={200}>
              <div 
                className={`relative overflow-hidden border border-neutral-800/90 bg-[#07070a] shadow-2xl group transition-all duration-700 rounded-sm animate-story-frame-glow ${
                  imgDimensions.isPortrait 
                    ? 'w-full max-w-[440px] sm:max-w-[460px] lg:max-w-[480px] mx-auto' 
                    : 'w-full max-w-2xl mx-auto'
                }`}
              >
                {/* Responsive Full-Visibility Image Frame */}
                <div 
                  className="relative w-full flex items-center justify-center bg-black/80 overflow-hidden"
                  style={{
                    aspectRatio: imgDimensions.ratio ? `${imgDimensions.width} / ${imgDimensions.height}` : '4 / 3',
                    maxHeight: imgDimensions.isPortrait ? '680px' : '520px'
                  }}
                >
                  <img
                    src={featuredImg}
                    alt="Fine Art Wedding by Captura LK"
                    onLoad={handleImgLoad}
                    className="w-full h-full object-contain object-center transition-transform duration-700 group-hover:scale-[1.05] animate-story-photo-breathe"
                  />

                  {/* Elegant luxury framing overlay & subtle highlight */}
                  <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10" />

                  {/* Luminous Ambient Glass Light Sheen */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60">
                    <div className="w-1/2 h-[220%] absolute -top-1/2 left-0 pointer-events-none bg-gradient-to-r from-transparent via-white/10 to-transparent animate-story-glass-shimmer" />
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>

        </div>
      </div>
    </section>
  );
}

