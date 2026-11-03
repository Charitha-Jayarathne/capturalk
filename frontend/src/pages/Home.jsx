import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import CategoryShowcase from '../components/CategoryShowcase';
import RecentAlbumsShowcase from '../components/RecentAlbumsShowcase';
import TrustedPartnersSection from '../components/TrustedPartnersSection';
import StorySection from '../components/StorySection';
import RevealOnScroll from '../components/RevealOnScroll';
import { Star, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getHomeContent, getHomeContentAsync } from '../utils/homeContentService';

export default function Home({ onOpenBooking }) {
  const [content, setContent] = useState(getHomeContent());

  useEffect(() => {
    // Initial async hydration from IndexedDB if available
    getHomeContentAsync().then((loaded) => {
      if (loaded) setContent(loaded);
    });

    const handleUpdate = () => {
      getHomeContentAsync().then((loaded) => {
        setContent(loaded || getHomeContent());
      });
    };

    window.addEventListener('captura_home_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('captura_home_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const reviewsBgCustom = Boolean(content?.reviews?.customBgImage) && content?.reviews?.bgType !== 'default';
  const reviewsBgOpacity = content?.reviews?.bgOpacity !== undefined ? content.reviews.bgOpacity : 0.40;

  const calloutBgCustom = Boolean(content?.callout?.customBgImage) && content?.callout?.bgType !== 'default';
  const calloutBgOpacity = content?.callout?.bgOpacity !== undefined ? content.callout.bgOpacity : 0.40;

  return (
    <div className={content?.hero?.isHidden ? "pt-20 sm:pt-24 lg:pt-28" : ""}>
      {/* Fullscreen Hero Section */}
      {!content?.hero?.isHidden && (
        <Hero onOpenBooking={onOpenBooking} content={content.hero} />
      )}

      {/* 5 Vertical Expandable Category Panels with Auto-Sliders & 360 Video */}
      {!content?.categories?.isHidden && (
        <CategoryShowcase onOpenBooking={onOpenBooking} content={content.categories} />
      )}

      {/* Section: 2 Lines x 4 Cards = 8 Recent Albums Showcase */}
      {!content?.albums?.isHidden && (
        <RecentAlbumsShowcase onOpenBooking={onOpenBooking} content={content.albums} />
      )}

      {/* Section: Single Row Slider (4 visible at a time) - Trusted Partners */}
      {!content?.partners?.isHidden && (
        <TrustedPartnersSection content={content.partners} />
      )}

      {/* Story Section: Elegance & Philosophy */}
      {!content?.story?.isHidden && (
        <StorySection onOpenBooking={onOpenBooking} content={content.story} />
      )}

      {/* Reviews Section */}
      {!content?.reviews?.isHidden && (
        <section 
          id="reviews"
          className="relative overflow-hidden scroll-mt-20 sm:scroll-mt-24"
          style={{ 
            paddingTop: 'clamp(44px, 6vw, 64px)', 
            paddingBottom: 'clamp(44px, 6vw, 64px)',
            backgroundColor: reviewsBgCustom ? 'transparent' : '#060608',
            backgroundImage: reviewsBgCustom 
              ? `linear-gradient(rgba(6, 6, 8, ${reviewsBgOpacity}), rgba(6, 6, 8, ${reviewsBgOpacity})), url("${content.reviews.customBgImage}")`
              : 'linear-gradient(to bottom, #060608, #09090e, #07070a)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <RevealOnScroll direction="up" delay={50}>
            <div className="text-center" style={{ marginBottom: '36px' }}>
              <div className="w-px h-7 bg-gradient-to-b from-transparent via-[#ff6a13]/60 to-transparent mx-auto mb-4 animate-luxury-line" />
              <h2 className="font-serif-luxury text-3xl sm:text-5xl text-white font-light tracking-tight">
                {content?.reviews?.title || 'Reviews'}
              </h2>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '32px' }}>
            {/* Card 1 */}
            <RevealOnScroll direction="up" delay={100} className="h-full">
              <div className="relative bg-[#0e0e13]/90 border border-neutral-800/80 p-8 sm:p-9 flex flex-col justify-between hover:border-[#ff6a13]/60 hover:-translate-y-2 hover:shadow-[0_16px_36px_rgba(0,0,0,0.7)] transition-all duration-500 group h-full overflow-hidden">
                <div className="absolute top-0 left-0 w-0 group-hover:w-full h-[2px] bg-[#ff6a13] transition-all duration-500 ease-out" />
                <div>
                  <div className="flex text-[#ff6a13] gap-1.5 mb-5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-[#ff6a13] transition-transform duration-300 group-hover:scale-110" />
                    ))}
                  </div>
                  <p className="text-neutral-200 text-base sm:text-[16px] italic font-light leading-relaxed mb-6">
                    "Captura LK transformed our Kandyan wedding into a cinematic masterpiece. The team was so discrete yet captured raw emotional moments we didn't even notice happening."
                  </p>
                </div>
                <div className="pt-4 border-t border-neutral-800/60 flex items-center justify-between">
                  <div>
                    <h4 className="text-white text-sm font-semibold uppercase tracking-wider">Kasun & Shenali</h4>
                    <p className="text-neutral-400 text-xs mt-0.5">The Grand Kandyan</p>
                  </div>
                  <ShieldCheck className="w-5 h-5 text-[#ff6a13]" />
                </div>
              </div>
            </RevealOnScroll>

            {/* Card 2 */}
            <RevealOnScroll direction="up" delay={220} className="h-full">
              <div className="relative bg-[#0e0e13]/90 border border-neutral-800/80 p-8 sm:p-9 flex flex-col justify-between hover:border-[#ff6a13]/60 hover:-translate-y-2 hover:shadow-[0_16px_36px_rgba(0,0,0,0.7)] transition-all duration-500 group h-full overflow-hidden">
                <div className="absolute top-0 left-0 w-0 group-hover:w-full h-[2px] bg-[#ff6a13] transition-all duration-500 ease-out" />
                <div>
                  <div className="flex text-[#ff6a13] gap-1.5 mb-5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-[#ff6a13] transition-transform duration-300 group-hover:scale-110" />
                    ))}
                  </div>
                  <p className="text-neutral-200 text-base sm:text-[16px] italic font-light leading-relaxed mb-6">
                    "The color grading and drone shots in our Galle Fort pre-shoot were beyond international standard. Everyone keeps asking who shot our cinematic teaser film!"
                  </p>
                </div>
                <div className="pt-4 border-t border-neutral-800/60 flex items-center justify-between">
                  <div>
                    <h4 className="text-white text-sm font-semibold uppercase tracking-wider">Raveen & Dilki</h4>
                    <p className="text-neutral-400 text-xs mt-0.5">Jetwing Lighthouse, Galle</p>
                  </div>
                  <ShieldCheck className="w-5 h-5 text-[#ff6a13]" />
                </div>
              </div>
            </RevealOnScroll>

            {/* Card 3 */}
            <RevealOnScroll direction="up" delay={340} className="h-full">
              <div className="relative bg-[#0e0e13]/90 border border-neutral-800/80 p-8 sm:p-9 flex flex-col justify-between hover:border-[#ff6a13]/60 hover:-translate-y-2 hover:shadow-[0_16px_36px_rgba(0,0,0,0.7)] transition-all duration-500 group h-full overflow-hidden">
                <div className="absolute top-0 left-0 w-0 group-hover:w-full h-[2px] bg-[#ff6a13] transition-all duration-500 ease-out" />
                <div>
                  <div className="flex text-[#ff6a13] gap-1.5 mb-5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-[#ff6a13] transition-transform duration-300 group-hover:scale-110" />
                    ))}
                  </div>
                  <p className="text-neutral-200 text-base sm:text-[16px] italic font-light leading-relaxed mb-6">
                    "From our first consultation to the final luxury photobook delivery, the professionalism was impeccable. The best investment we made for our wedding day."
                  </p>
                </div>
                <div className="pt-4 border-t border-neutral-800/60 flex items-center justify-between">
                  <div>
                    <h4 className="text-white text-xs font-semibold uppercase tracking-wider">Ashan & Piyumi</h4>
                    <p className="text-neutral-400 text-xs mt-0.5">Shangri-La Colombo</p>
                  </div>
                  <ShieldCheck className="w-5 h-5 text-[#ff6a13]" />
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>
      )}

      {/* Bottom Contact Callout Banner */}
      {!content?.callout?.isHidden && (
        <section 
          id="callout"
          className="relative scroll-mt-20 sm:scroll-mt-24"
          style={{ 
            paddingTop: 'clamp(48px, 6vw, 72px)', 
            paddingBottom: 'clamp(64px, 8vw, 96px)',
            backgroundColor: calloutBgCustom ? 'transparent' : '#07070a',
            backgroundImage: calloutBgCustom
              ? `linear-gradient(rgba(7, 7, 10, ${calloutBgOpacity}), rgba(7, 7, 10, ${calloutBgOpacity})), url("${content.callout.customBgImage}")`
              : 'linear-gradient(to bottom, #07070a, #0d0c11, #050507)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
            <RevealOnScroll direction="up" delay={60}>
              <div className="w-px h-8 bg-gradient-to-b from-transparent via-[#ff6a13]/60 to-transparent mx-auto mb-6 animate-luxury-line" />
              <p 
                className="text-xs uppercase tracking-[0.35em] text-[#ff6a13] font-semibold"
                style={{ marginBottom: '20px' }}
              >
                {content?.callout?.tagline || "Let's Talk About Your Special Day"}
              </p>
              <h2 
                className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl text-white font-light max-w-3xl mx-auto leading-tight"
                style={{ marginBottom: '22px' }}
              >
                {content?.callout?.heading || "Get In Touch With Our Studio"}
              </h2>
              <p 
                className="text-neutral-300 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed"
                style={{ marginBottom: '38px' }}
              >
                {content?.callout?.subtext || "Reach out to our team to discuss dates, bespoke photography packages, and cinematic storytelling."}
              </p>
              <div className="flex items-center justify-center">
                <Link
                  to="/contact"
                  className="group relative inline-flex items-center gap-3.5 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full text-white text-xs sm:text-[13px] tracking-[0.22em] uppercase font-semibold transition-all duration-300 hover:scale-105 active:scale-[0.98] overflow-hidden cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #ff7a29 0%, #ff6a13 50%, #e05300 100%)',
                    boxShadow: '0 6px 28px rgba(255, 106, 19, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.28)'
                  }}
                >
                  {/* Ambient dynamic sheen animation */}
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

                  <span className="relative z-10 font-sans tracking-[0.22em] drop-shadow-sm">
                    {content?.callout?.buttonText || "CONTACT US"}
                  </span>

                  <span className="relative z-10 w-7 h-7 rounded-full bg-black/25 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-black/35 shadow-inner">
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </span>
                </Link>
              </div>
            </RevealOnScroll>
          </div>
        </section>
      )}

      {/* Fallback if all home sections are hidden */}
      {Boolean(content?.hero?.isHidden) &&
        Boolean(content?.categories?.isHidden) &&
        Boolean(content?.albums?.isHidden) &&
        Boolean(content?.story?.isHidden) &&
        Boolean(content?.reviews?.isHidden) &&
        Boolean(content?.callout?.isHidden) && (
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20">
            <div className="w-12 h-12 rounded-full bg-[#ff6a13]/10 border border-[#ff6a13]/30 flex items-center justify-center mb-4">
              <span className="text-[#ff6a13] text-xl font-serif">C</span>
            </div>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl text-white font-light mb-3">
              Captura LK Studio
            </h2>
            <p className="text-neutral-400 text-sm max-w-md font-light leading-relaxed">
              All homepage sections are currently set to hidden in the Admin Panel. You can unhide any section from the Admin Panel to display it on the live site.
            </p>
          </div>
      )}
    </div>
  );
}
