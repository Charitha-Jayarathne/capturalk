import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Camera, Video, Film } from 'lucide-react';
import RevealOnScroll from './RevealOnScroll';
import { getHomeContent, getHomeContentAsync, DEFAULT_CATEGORY_ITEMS } from '../utils/homeContentService';
import { getCategories, getCategoriesAsync } from '../utils/categoryService';

export default function CategoryShowcase({ onOpenBooking, content }) {
  const [categoryContent, setCategoryContent] = useState(content || getHomeContent().categories);
  const [systemCategories, setSystemCategories] = useState(() => getCategories());

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

    getCategoriesAsync().then((loaded) => {
      if (Array.isArray(loaded) && loaded.length > 0) {
        setSystemCategories(loaded);
      }
    });

    const handleCatsUpdate = (e) => {
      if (e?.detail && Array.isArray(e.detail)) {
        setSystemCategories(e.detail);
      } else {
        getCategoriesAsync().then((loaded) => {
          if (Array.isArray(loaded)) setSystemCategories(loaded);
        });
      }
    };

    window.addEventListener('captura_home_updated', handleUpdate);
    window.addEventListener('captura_categories_updated', handleCatsUpdate);
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('storage', handleCatsUpdate);
    return () => {
      window.removeEventListener('captura_home_updated', handleUpdate);
      window.removeEventListener('captura_categories_updated', handleCatsUpdate);
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('storage', handleCatsUpdate);
    };
  }, []);

  // Filter only active categories matching system categories
  const rawItems = categoryContent?.items || DEFAULT_CATEGORY_ITEMS;

  const categories = (Array.isArray(systemCategories) && systemCategories.length > 0)
    ? systemCategories.map((sysCat) => {
        const sysNameLower = (sysCat.name || '').toLowerCase();
        const existing = rawItems.find((it) => {
          const itId = (it.id || '').toLowerCase();
          const itTitle = (it.title || '').toLowerCase();
          return (
            itId === sysNameLower ||
            itTitle === sysNameLower ||
            (sysNameLower === 'events' && (itId === 'commercial' || itTitle.includes('events'))) ||
            (sysNameLower.includes('360') && (itId === 'video360' || itTitle.includes('360')))
          );
        });

        if (existing) {
          return { ...existing, title: sysCat.name };
        }

        return {
          id: sysCat.id || sysCat.slug,
          title: sysCat.name,
          subtitle: 'Artistry & Excellence',
          mediaType: sysCat.name.toLowerCase().includes('video') || sysCat.name.toLowerCase().includes('cinematic') ? 'videos' : 'images',
          isHidden: false,
          slides: [
            { id: 1, title: `${sysCat.name} Showcase`, location: 'Colombo, Sri Lanka', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85' }
          ],
          videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-posing-in-a-field-at-sunset-42998-large.mp4',
          videoPoster: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
          videoTitle: `${sysCat.name} Cinematic Experience`
        };
      }).filter((c) => !c.isHidden)
    : rawItems.filter((c) => !c.isHidden);

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
                {cat.title}
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
                      decoding="async"
                      loading={i === 0 ? "eager" : "lazy"}
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
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 12px', pointerEvents: 'none' }}>
                      <img 
                        src={photo.url} 
                        alt={photo.title || cat.title} 
                        decoding="async"
                        loading={i === 0 ? "eager" : "lazy"}
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
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 12px' }}>
                      <video
                        key={cat.videoUrl}
                        autoPlay
                        loop
                        muted={videoMutedMap[cat.id] ?? true}
                        playsInline
                        preload="metadata"
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
                    <span className="text-[10px] tracking-[0.22em] uppercase font-bold text-white bg-black/80 px-2.5 py-1 border border-white/10 rounded">
                      {cat.title}
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
                                padding: '16px',
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
                                padding: '16px'
                              }}
                            >
                              <video
                                key={cat.videoUrl}
                                autoPlay
                                loop
                                muted={videoMutedMap[cat.id] ?? true}
                                playsInline
                                preload="metadata"
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
                            {cat.title}
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
