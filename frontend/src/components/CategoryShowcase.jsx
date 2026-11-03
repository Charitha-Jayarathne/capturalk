import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, ArrowRight, Camera, Video, Film } from 'lucide-react';
import { Link } from 'react-router-dom';
import RevealOnScroll from './RevealOnScroll';
import { getHomeContent, getHomeContentAsync, DEFAULT_CATEGORY_ITEMS } from '../utils/homeContentService';

export default function CategoryShowcase({ onOpenBooking, content }) {
  const [categoryContent, setCategoryContent] = useState(content || getHomeContent().categories);

  useEffect(() => {
    if (content) {
      setCategoryContent(content);
    }
  }, [content]);

  useEffect(() => {
    const handleUpdate = () => {
      getHomeContentAsync().then((loaded) => {
        if (loaded?.categories) {
          setCategoryContent(loaded.categories);
        } else {
          setCategoryContent(getHomeContent().categories);
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

  // Filter only non-hidden categories
  const rawItems = categoryContent?.items || DEFAULT_CATEGORY_ITEMS;
  const categories = rawItems.filter((c) => !c.isHidden);

  const [activePanel, setActivePanel] = useState(0);
  const [slideIndices, setSlideIndices] = useState({});
  const [bothModeMap, setBothModeMap] = useState({}); // { [catId]: 'photos' | 'video' }
  const [videoPlayingMap, setVideoPlayingMap] = useState({});
  const [videoMutedMap, setVideoMutedMap] = useState({});

  // Keep active panel within bounds when categories list changes
  useEffect(() => {
    if (activePanel >= categories.length && categories.length > 0) {
      setActivePanel(0);
    }
  }, [categories.length, activePanel]);

  // Unified auto-slide timer for all categories with photos
  useEffect(() => {
    if (!categories.length) return;

    const timer = setInterval(() => {
      setSlideIndices((prev) => {
        const next = { ...prev };
        categories.forEach((cat) => {
          const slides = cat.slides || [];
          if (slides.length > 1) {
            const current = prev[cat.id] || 0;
            next[cat.id] = (current + 1) % slides.length;
          }
        });
        return next;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [categories]);

  const toggleVideoPlayback = (catId, videoRef, e) => {
    e.stopPropagation();
    if (!videoRef) return;
    const isPlaying = videoPlayingMap[catId] ?? true;
    if (isPlaying) {
      videoRef.pause();
      setVideoPlayingMap((prev) => ({ ...prev, [catId]: false }));
    } else {
      videoRef.play();
      setVideoPlayingMap((prev) => ({ ...prev, [catId]: true }));
    }
  };

  const toggleVideoMute = (catId, videoRef, e) => {
    e.stopPropagation();
    if (!videoRef) return;
    const isMuted = videoMutedMap[catId] ?? true;
    videoRef.muted = !isMuted;
    setVideoMutedMap((prev) => ({ ...prev, [catId]: !isMuted }));
  };

  const isCustomBg = Boolean(categoryContent?.customBgImage) && categoryContent?.bgType !== 'default';
  const bgOpacity = categoryContent?.bgOpacity !== undefined ? categoryContent.bgOpacity : 0.40;

  if (categoryContent?.isHidden) {
    return null;
  }

  if (categories.length === 0) {
    return (
      <section className="py-12 text-center text-neutral-400 bg-[#060608]">
        <p>No categories currently available.</p>
      </section>
    );
  }

  const activeCategory = categories[activePanel] || categories[0];
  const activeCatSlideIdx = slideIndices[activeCategory?.id] || 0;

  return (
    <section 
      id="categories"
      className="py-10 sm:py-14 lg:py-16 relative overflow-hidden scroll-mt-20 sm:scroll-mt-24"
      style={{
        backgroundColor: isCustomBg ? 'transparent' : '#060608',
        backgroundImage: isCustomBg 
          ? `linear-gradient(rgba(6, 6, 8, ${bgOpacity}), rgba(6, 6, 8, ${bgOpacity})), url("${categoryContent.customBgImage}")`
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10">
        <style>{`
          .cat-showcase-desktop {
            display: block !important;
          }
          .cat-showcase-mobile {
            display: none !important;
          }
          @media (max-width: 768px) {
            .cat-showcase-desktop {
              display: none !important;
            }
            .cat-showcase-mobile {
              display: block !important;
            }
          }
        `}</style>

        {/* ========================================================= */}
        {/* MOBILE VIEW (<= 768px): FULL-WIDTH RESPONSIVE CARD        */}
        {/* ========================================================= */}
        <div className="cat-showcase-mobile mb-4">
          {/* Mobile Category Selector Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
            {categories.map((cat, idx) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActivePanel(idx)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                  activePanel === idx
                    ? 'bg-[#ff6a13] text-white border-[#ff6a13] shadow-lg shadow-orange-500/20'
                    : 'bg-black/60 text-neutral-400 border-white/10'
                }`}
              >
                {String(idx + 1).padStart(2, '0')} {cat.title}
              </button>
            ))}
          </div>

          {/* Active Mobile Showcase Card (100% Uncropped & Responsive) */}
          {activeCategory && (() => {
            const cat = activeCategory;
            const mode = bothModeMap[cat.id] || (cat.mediaType === 'videos' ? 'video' : 'photos');
            const slides = cat.slides || [];
            const currentSlide = slides[activeCatSlideIdx] || slides[0] || {};
            const isVideoMode = mode === 'video' || cat.mediaType === 'videos';

            return (
              <div 
                style={{
                  width: '100%',
                  height: '420px',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  backgroundColor: '#07070a',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 16px 40px rgba(0,0,0,0.85)'
                }}
              >
                {/* Visual Content: Photos or Video */}
                {!isVideoMode && slides.length > 0 && slides.map((photo, i) => (
                  <div 
                    key={photo.id || i} 
                    style={{
                      position: 'absolute',
                      inset: 0,
                      opacity: i === activeCatSlideIdx ? 1 : 0,
                      pointerEvents: i === activeCatSlideIdx ? 'auto' : 'none',
                      transition: 'opacity 0.6s ease-in-out'
                    }}
                  >
                    <img 
                      src={photo.url} 
                      alt="" 
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'blur(28px)',
                        opacity: 0.35,
                        transform: 'scale(1.15)',
                        pointerEvents: 'none'
                      }} 
                    />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 12px 64px 12px', pointerEvents: 'none' }}>
                      <img 
                        src={photo.url} 
                        alt={photo.title || cat.title} 
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          width: 'auto',
                          height: 'auto',
                          objectFit: 'contain',
                          objectPosition: 'center',
                          filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.85))'
                        }} 
                      />
                    </div>
                  </div>
                ))}

                {isVideoMode && (
                  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                    {cat.videoPoster && (
                      <img 
                        src={cat.videoPoster} 
                        alt="" 
                        aria-hidden="true"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          filter: 'blur(28px)',
                          opacity: 0.35,
                          transform: 'scale(1.15)',
                          pointerEvents: 'none'
                        }} 
                      />
                    )}
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 12px 64px 12px' }}>
                      <video
                        key={cat.videoUrl}
                        autoPlay
                        loop
                        muted={videoMutedMap[cat.id] ?? true}
                        playsInline
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          width: 'auto',
                          height: 'auto',
                          objectFit: 'contain',
                          objectPosition: 'center',
                          filter: 'brightness(1.02) contrast(1.05) drop-shadow(0 10px 25px rgba(0,0,0,0.85))'
                        }}
                        poster={cat.videoPoster}
                      >
                        <source src={cat.videoUrl} type="video/mp4" />
                      </video>
                    </div>
                  </div>
                )}

                {/* Gradient Overlay for Text Readability */}
                <div 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.2) 35%, transparent 60%, rgba(0,0,0,0.45) 100%)',
                    pointerEvents: 'none'
                  }} 
                />

                {/* Mobile Top Bar */}
                <div style={{ position: 'relative', zIndex: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-white bg-black/80 px-2.5 py-1 border border-white/10 rounded">
                      {String(activePanel + 1).padStart(2, '0')} / {cat.title}
                    </span>

                    {/* Both Media Switcher Pill on Mobile */}
                    {cat.mediaType === 'both' && (
                      <div className="flex items-center bg-black/80 rounded-full border border-white/20 p-0.5">
                        <button
                          type="button"
                          onClick={() => setBothModeMap((prev) => ({ ...prev, [cat.id]: 'photos' }))}
                          className={`px-2 py-0.5 text-[9px] font-bold rounded-full transition-all ${
                            mode !== 'video' ? 'bg-[#ff6a13] text-white' : 'text-neutral-400'
                          }`}
                        >
                          Photos
                        </button>
                        <button
                          type="button"
                          onClick={() => setBothModeMap((prev) => ({ ...prev, [cat.id]: 'video' }))}
                          className={`px-2 py-0.5 text-[9px] font-bold rounded-full transition-all ${
                            mode === 'video' ? 'bg-[#ff6a13] text-white' : 'text-neutral-400'
                          }`}
                        >
                          Video
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Dots for photo slides */}
                  {!isVideoMode && slides.length > 1 && (
                    <div className="flex gap-1.5 items-center">
                      {slides.map((_, dotIdx) => (
                        <span
                          key={dotIdx}
                          onClick={() => setSlideIndices((prev) => ({ ...prev, [cat.id]: dotIdx }))}
                          className={`h-1.5 rounded-full transition-all cursor-pointer ${
                            dotIdx === activeCatSlideIdx ? 'bg-[#ff6a13] w-4' : 'bg-white/40 w-1.5'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {isVideoMode && (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          const v = e.currentTarget.closest('.cat-showcase-mobile')?.querySelector('video');
                          toggleVideoPlayback(cat.id, v, e);
                        }}
                        className="p-1.5 bg-black/70 hover:bg-black/90 text-white rounded-full border border-white/20 transition-all cursor-pointer"
                      >
                        {(videoPlayingMap[cat.id] ?? true) ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          const v = e.currentTarget.closest('.cat-showcase-mobile')?.querySelector('video');
                          toggleVideoMute(cat.id, v, e);
                        }}
                        className="p-1.5 bg-black/70 hover:bg-black/90 text-white rounded-full border border-white/20 transition-all cursor-pointer"
                      >
                        {(videoMutedMap[cat.id] ?? true) ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 text-white" />}
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile Bottom Info Bar */}
                <div style={{ position: 'relative', zIndex: 10, padding: '14px', backdropFilter: 'blur(4px)' }}>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-300 font-medium">
                    {!isVideoMode ? (currentSlide?.location || cat.subtitle) : (cat.videoTitle || cat.subtitle || 'Cinematic Film Experience')}
                  </p>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <h3 className="font-serif-luxury text-base sm:text-lg text-white font-medium">
                      {!isVideoMode ? (currentSlide?.title || cat.title) : (cat.videoTitle || `${cat.title} Cinematic Reel`)}
                    </h3>
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-1 text-[#ff6a13] hover:text-white font-semibold uppercase tracking-wider text-[11px] transition-colors shrink-0"
                    >
                      <span>Contact</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* ========================================================= */}
        {/* DESKTOP VIEW (> 768px): DYNAMIC LUXURY ACCORDION PILLARS */}
        {/* ========================================================= */}
        <div className="cat-showcase-desktop">
          <RevealOnScroll direction="up" delay={50}>
            <div className="w-full overflow-hidden select-none">
              <div 
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  height: '520px',
                  width: '100%',
                  gap: '12px',
                }}
              >
                {categories.map((cat, idx) => {
                  const isCurrentActive = activePanel === idx;
                  const mode = bothModeMap[cat.id] || (cat.mediaType === 'videos' ? 'video' : 'photos');
                  const isVideoMode = mode === 'video' || cat.mediaType === 'videos';
                  const slides = cat.slides || [];
                  const slideIdx = slideIndices[cat.id] || 0;
                  const currentSlide = slides[slideIdx] || slides[0] || {};

                  return (
                    <div
                      key={cat.id}
                      onClick={() => setActivePanel(idx)}
                      onMouseEnter={() => setActivePanel(idx)}
                      className="relative overflow-hidden border cursor-pointer flex flex-col justify-between rounded-sm"
                      style={{
                        flex: isCurrentActive ? '4.5 1 0%' : '1 1 0%',
                        minWidth: isCurrentActive ? (categories.length <= 3 ? '420px' : '360px') : (categories.length >= 6 ? '70px' : '90px'),
                        height: '100%',
                        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                        borderColor: isCurrentActive ? '#ff6a13' : 'rgba(255, 255, 255, 0.12)',
                        boxShadow: isCurrentActive ? '0 12px 35px rgba(0, 0, 0, 0.8)' : 'none',
                        backgroundColor: '#07070a'
                      }}
                    >
                      {/* 1. PHOTO CONTENT */}
                      {!isVideoMode && slides.length > 0 && slides.map((photo, i) => (
                        <div
                          key={photo.id || i}
                          style={{
                            position: 'absolute',
                            inset: 0,
                            opacity: i === slideIdx ? 1 : 0,
                            pointerEvents: i === slideIdx ? 'auto' : 'none',
                            transition: 'opacity 0.7s ease-in-out',
                            overflow: 'hidden'
                          }}
                        >
                          {/* Ambient background blur */}
                          <img
                            src={photo.url}
                            alt=""
                            aria-hidden="true"
                            style={{
                              position: 'absolute',
                              inset: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              filter: isCurrentActive ? 'blur(30px)' : 'brightness(0.85) contrast(1.05)',
                              opacity: isCurrentActive ? 0.35 : 0.65,
                              transform: isCurrentActive ? 'scale(1.15)' : 'scale(1)',
                              transition: 'all 0.6s ease',
                              pointerEvents: 'none'
                            }}
                          />

                          {/* Foreground Full Image: 100% uncropped, zero zoom */}
                          {isCurrentActive && (
                            <div 
                              style={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '16px 16px 64px 16px',
                                pointerEvents: 'none'
                              }}
                            >
                              <img
                                src={photo.url}
                                alt={photo.title || cat.title}
                                style={{
                                  maxWidth: '100%',
                                  maxHeight: '100%',
                                  width: 'auto',
                                  height: 'auto',
                                  objectFit: 'contain',
                                  objectPosition: 'center',
                                  filter: 'drop-shadow(0 12px 32px rgba(0,0,0,0.85))',
                                  transition: 'all 0.7s ease',
                                  userSelect: 'none'
                                }}
                              />
                            </div>
                          )}
                        </div>
                      ))}

                      {/* 2. VIDEO CONTENT */}
                      {isVideoMode && (
                        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                          {cat.videoPoster && (
                            <img
                              src={cat.videoPoster}
                              alt=""
                              aria-hidden="true"
                              style={{
                                position: 'absolute',
                                inset: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                filter: isCurrentActive ? 'blur(30px)' : 'brightness(0.85) contrast(1.05)',
                                opacity: isCurrentActive ? 0.35 : 0.65,
                                transform: isCurrentActive ? 'scale(1.15)' : 'scale(1)',
                                transition: 'all 0.6s ease',
                                pointerEvents: 'none'
                              }}
                            />
                          )}

                          {isCurrentActive && (
                            <div 
                              style={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '16px 16px 64px 16px'
                              }}
                            >
                              <video
                                key={cat.videoUrl}
                                autoPlay
                                loop
                                muted={videoMutedMap[cat.id] ?? true}
                                playsInline
                                style={{
                                  maxWidth: '100%',
                                  maxHeight: '100%',
                                  width: 'auto',
                                  height: 'auto',
                                  objectFit: 'contain',
                                  objectPosition: 'center',
                                  filter: 'brightness(1.02) contrast(1.05) drop-shadow(0 12px 32px rgba(0,0,0,0.85))'
                                }}
                                poster={cat.videoPoster}
                              >
                                <source src={cat.videoUrl} type="video/mp4" />
                              </video>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Fallback if no images or video */}
                      {!isVideoMode && slides.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center text-center p-4 text-neutral-500 text-xs">
                          <span>No photos uploaded yet for {cat.title}</span>
                        </div>
                      )}

                      {/* Gradient Shadow */}
                      <div 
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 45%, rgba(0,0,0,0.4) 100%)',
                          pointerEvents: 'none'
                        }} 
                      />

                      {/* Top Tag & Media Controls */}
                      <div className="relative z-10 p-3 sm:p-3.5 flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] tracking-[0.22em] uppercase font-bold text-white bg-black/75 backdrop-blur-md px-2.5 py-1 border border-white/10 whitespace-nowrap">
                            {String(idx + 1).padStart(2, '0')} / {cat.title}
                          </span>

                          {/* Mode switcher for 'both' media type */}
                          {cat.mediaType === 'both' && isCurrentActive && (
                            <div 
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center bg-black/85 rounded-full border border-white/20 p-0.5 animate-fadeIn"
                            >
                              <button
                                type="button"
                                onClick={() => setBothModeMap((prev) => ({ ...prev, [cat.id]: 'photos' }))}
                                className={`px-2 py-0.5 text-[9px] font-bold rounded-full transition-all cursor-pointer ${
                                  mode !== 'video' ? 'bg-[#ff6a13] text-white shadow' : 'text-neutral-400 hover:text-white'
                                }`}
                              >
                                Photos
                              </button>
                              <button
                                type="button"
                                onClick={() => setBothModeMap((prev) => ({ ...prev, [cat.id]: 'video' }))}
                                className={`px-2 py-0.5 text-[9px] font-bold rounded-full transition-all cursor-pointer ${
                                  mode === 'video' ? 'bg-[#ff6a13] text-white shadow' : 'text-neutral-400 hover:text-white'
                                }`}
                              >
                                Video
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Slide dots if active and has multiple slides */}
                        {isCurrentActive && !isVideoMode && slides.length > 1 && (
                          <div className="flex gap-1.5 animate-fadeIn">
                            {slides.map((_, dotIdx) => (
                              <span
                                key={dotIdx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSlideIndices((prev) => ({ ...prev, [cat.id]: dotIdx }));
                                }}
                                className={
                                  "w-1.5 h-1.5 rounded-full transition-all cursor-pointer " +
                                  (dotIdx === slideIdx ? "bg-[#ff6a13] w-4" : "bg-white/40")
                                }
                              />
                            ))}
                          </div>
                        )}

                        {/* Video Controls if video mode */}
                        {isCurrentActive && isVideoMode && (
                          <div className="flex items-center gap-1.5 animate-fadeIn">
                            <button
                              type="button"
                              onClick={(e) => {
                                const v = e.currentTarget.closest('.cat-showcase-desktop')?.querySelectorAll('video')[0];
                                toggleVideoPlayback(cat.id, v, e);
                              }}
                              className="p-1.5 bg-black/80 hover:bg-black text-white rounded-full border border-white/20 transition-all cursor-pointer"
                            >
                              {(videoPlayingMap[cat.id] ?? true) ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                const v = e.currentTarget.closest('.cat-showcase-desktop')?.querySelectorAll('video')[0];
                                toggleVideoMute(cat.id, v, e);
                              }}
                              className="p-1.5 bg-black/80 hover:bg-black text-white rounded-full border border-white/20 transition-all cursor-pointer"
                            >
                              {(videoMutedMap[cat.id] ?? true) ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 text-white" />}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Bottom Info Content */}
                      <div className="relative z-10 p-3.5 sm:p-4 space-y-1">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-300 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                          {!isVideoMode ? (currentSlide?.location || cat.subtitle) : (cat.videoTitle || cat.subtitle || 'Cinematic Film Experience')}
                        </p>
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-serif-luxury text-lg sm:text-xl lg:text-2xl text-white font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                            {isCurrentActive 
                              ? (!isVideoMode ? (currentSlide?.title || cat.title) : (cat.videoTitle || `${cat.title} Cinematic Reel`))
                              : cat.title
                            }
                          </h3>
                          {isCurrentActive && (
                            <Link
                              to="/contact"
                              className="inline-flex items-center gap-1 text-[#ff6a13] hover:text-white font-semibold uppercase tracking-wider text-[11px] transition-colors cursor-pointer shrink-0"
                            >
                              <span>Contact Us</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </RevealOnScroll>
        </div>

      </div>
    </section>
  );
}
