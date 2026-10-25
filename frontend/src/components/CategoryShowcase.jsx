import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Compass, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import RevealOnScroll from './RevealOnScroll';
import { getHomeContent, getHomeContentAsync } from '../utils/homeContentService';

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

  const [activePanel, setActivePanel] = useState(0); // 0 to 4
  const [videoPlaying, setVideoPlaying] = useState(true);
  const [videoMuted, setVideoMuted] = useState(true);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const videoRef = useRef(null);

  // 1. Weddings Category 5 Slides
  const [weddingIndex, setWeddingIndex] = useState(0);
  const weddingPhotos = (categoryContent?.weddingSlides?.length === 5)
    ? categoryContent.weddingSlides
    : [
        { url: categoryContent?.weddingImage || 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=85', title: 'Sacred Poruwa Ceremony', location: 'The Grand Kandyan Hotel' },
        { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85', title: 'Sunset Coastal Nuptials', location: 'Jetwing Lighthouse, Galle' },
        { url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85', title: 'Regal Kandyan Bride', location: 'Cinnamon Grand Luxury Suite' },
        { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85', title: 'Grand Ballroom Revelry', location: 'Galle Face Hotel, Colombo' },
        { url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=85', title: 'Golden Hour Vows', location: 'Amanwella Beach, Tangalle' }
      ];

  // 2. Graduations Category 5 Slides
  const [gradIndex, setGradIndex] = useState(0);
  const gradPhotos = (categoryContent?.graduationSlides?.length === 5)
    ? categoryContent.graduationSlides
    : [
        { url: categoryContent?.graduationImage || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=85', title: 'Convocation Day Pride', location: 'BMICH Main Hall, Colombo' },
        { url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=85', title: 'Honorary Cap Toss', location: 'University Grounds' },
        { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85', title: 'Graduate Portraiture', location: 'Studio Atelier Colombo' },
        { url: 'https://images.unsplash.com/photo-1525921429624-479b6a26d84d?auto=format&fit=crop&w=1200&q=85', title: 'Valedictorian Walk', location: 'University Quadrangle' },
        { url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=85', title: 'Family Heritage Triumph', location: 'Memorial Hall Colombo' }
      ];

  // 3. Pre-Shoots & Engagements 5 Slides
  const [preShootIndex, setPreShootIndex] = useState(0);
  const preShootPhotos = (categoryContent?.preshootSlides?.length === 5)
    ? categoryContent.preshootSlides
    : [
        { url: categoryContent?.preshootImage || 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=85', title: 'Highlands Mist & Romance', location: 'Ceylon Tea Trails, Nuwara Eliya' },
        { url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=85', title: 'Lakeside Twilight Serenade', location: 'Bolgoda Lake Sanctuary' },
        { url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=85', title: 'Dutch Fort Sunset Glow', location: 'Galle Ramparts Lighthouse' },
        { url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85', title: 'Ella Mountain Panorama', location: 'Nine Arch Demodara' },
        { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85', title: 'Mirissa Coastal Reverie', location: 'Coconut Tree Hill' }
      ];

  // 4. Events & Corporate 5 Slides
  const [eventIndex, setEventIndex] = useState(0);
  const eventPhotos = (categoryContent?.commercialSlides?.length === 5)
    ? categoryContent.commercialSlides
    : [
        { url: categoryContent?.commercialImage || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=85', title: 'Annual Corporate Gala', location: 'Shangri-La Grand Ballroom' },
        { url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=85', title: 'Luxury Brand Product Launch', location: 'Colombo Port City Marina' },
        { url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=85', title: 'Celebrity Jubilee Dinner', location: 'Hilton Colombo' },
        { url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=85', title: 'International Business Forum', location: 'Cinnamon Life Atrium' },
        { url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=85', title: 'VIP Awards Ceremony', location: 'Kingsbury Waterfront' }
      ];

  // 5. 360 Video Configuration
  const video360Config = categoryContent?.video360 || {
    url: 'https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-posing-in-a-field-at-sunset-42998-large.mp4',
    poster: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    title: '360° Cinematic Experience'
  };

  // Auto-slide effect for each photo category (5 slides each)
  useEffect(() => {
    const timer1 = setInterval(() => {
      setWeddingIndex((prev) => (prev + 1) % weddingPhotos.length);
    }, 3800);

    const timer2 = setInterval(() => {
      setGradIndex((prev) => (prev + 1) % gradPhotos.length);
    }, 4200);

    const timer3 = setInterval(() => {
      setPreShootIndex((prev) => (prev + 1) % preShootPhotos.length);
    }, 4000);

    const timer4 = setInterval(() => {
      setEventIndex((prev) => (prev + 1) % eventPhotos.length);
    }, 4500);

    return () => {
      clearInterval(timer1);
      clearInterval(timer2);
      clearInterval(timer3);
      clearInterval(timer4);
    };
  }, []);

  // 360 Video interaction handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const delta = e.clientX - startX;
    setRotationAngle((prev) => prev + delta * 0.35);
    setStartX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const toggleVideoPlayback = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoPlaying) {
      videoRef.current.pause();
      setVideoPlaying(false);
    } else {
      videoRef.current.play();
      setVideoPlaying(true);
    }
  };

  const toggleVideoMute = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoMuted;
    setVideoMuted(!videoMuted);
  };

  const isCustomBg = Boolean(categoryContent?.customBgImage) && categoryContent?.bgType !== 'default';
  const bgOpacity = categoryContent?.bgOpacity !== undefined ? categoryContent.bgOpacity : 0.40;

  return (
    <section 
      className="py-8 sm:py-12 relative overflow-hidden"
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
            {[
              { id: 0, label: '01 Weddings' },
              { id: 1, label: '02 Graduation' },
              { id: 2, label: '03 Pre-Shoot' },
              { id: 3, label: '04 Events' },
              { id: 4, label: '05 360° Video' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActivePanel(tab.id)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                  activePanel === tab.id
                    ? 'bg-[#ff6a13] text-white border-[#ff6a13] shadow-lg shadow-orange-500/20'
                    : 'bg-black/60 text-neutral-400 border-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Active Mobile Showcase Card (100% Uncropped & Responsive) */}
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
            {/* Photos Render for Categories 0 to 3 */}
            {activePanel === 0 && weddingPhotos.map((photo, i) => (
              <div 
                key={i} 
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: i === weddingIndex ? 1 : 0,
                  pointerEvents: i === weddingIndex ? 'auto' : 'none',
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
                    alt={photo.title} 
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

            {activePanel === 1 && gradPhotos.map((photo, i) => (
              <div 
                key={i} 
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: i === gradIndex ? 1 : 0,
                  pointerEvents: i === gradIndex ? 'auto' : 'none',
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
                    alt={photo.title} 
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

            {activePanel === 2 && preShootPhotos.map((photo, i) => (
              <div 
                key={i} 
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: i === preShootIndex ? 1 : 0,
                  pointerEvents: i === preShootIndex ? 'auto' : 'none',
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
                    alt={photo.title} 
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

            {activePanel === 3 && eventPhotos.map((photo, i) => (
              <div 
                key={i} 
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: i === eventIndex ? 1 : 0,
                  pointerEvents: i === eventIndex ? 'auto' : 'none',
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
                    alt={photo.title} 
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

            {/* Video Render for Category 4 (360) */}
            {activePanel === 4 && (
              <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                <img 
                  src={video360Config.poster} 
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
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 12px 64px 12px' }}>
                  <video
                    ref={videoRef}
                    key={video360Config.url}
                    autoPlay
                    loop
                    muted={videoMuted}
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
                    poster={video360Config.poster}
                  >
                    <source src={video360Config.url} type="video/mp4" />
                  </video>
                </div>
              </div>
            )}

            {/* Subtle Gradient Overlay for Text Readability */}
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.2) 35%, transparent 60%, rgba(0,0,0,0.45) 100%)',
                pointerEvents: 'none'
              }} 
            />

            {/* Mobile Top Bar: Badge & Slide Dots */}
            <div style={{ position: 'relative', zIndex: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-white bg-black/80 px-2.5 py-1 border border-white/10 rounded">
                {activePanel === 0 && '01 / Weddings'}
                {activePanel === 1 && '02 / Graduation'}
                {activePanel === 2 && '03 / Pre-Shoot'}
                {activePanel === 3 && '04 / Events'}
                {activePanel === 4 && '05 / 360° Video'}
              </span>

              {/* Dots for photo categories */}
              {activePanel < 4 && (
                <div className="flex gap-1.5 items-center">
                  {[0, 1, 2, 3, 4].map((dotIdx) => {
                    const currentIdx = [weddingIndex, gradIndex, preShootIndex, eventIndex][activePanel];
                    const setFunc = [setWeddingIndex, setGradIndex, setPreShootIndex, setEventIndex][activePanel];
                    return (
                      <span
                        key={dotIdx}
                        onClick={() => setFunc(dotIdx)}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          dotIdx === currentIdx ? 'bg-[#ff6a13] w-4' : 'bg-white/40 w-1.5'
                        }`}
                      />
                    );
                  })}
                </div>
              )}

              {activePanel === 4 && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={toggleVideoPlayback}
                    className="p-1.5 bg-black/70 hover:bg-black/90 text-white rounded-full border border-white/20 transition-all cursor-pointer"
                  >
                    {videoPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
                  </button>
                  <button
                    type="button"
                    onClick={toggleVideoMute}
                    className="p-1.5 bg-black/70 hover:bg-black/90 text-white rounded-full border border-white/20 transition-all cursor-pointer"
                  >
                    {videoMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 text-white" />}
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Bottom Info Bar */}
            <div style={{ position: 'relative', zIndex: 10, padding: '14px', backdropFilter: 'blur(4px)' }}>
              <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-300 font-medium">
                {activePanel === 0 && weddingPhotos[weddingIndex].location}
                {activePanel === 1 && gradPhotos[gradIndex].location}
                {activePanel === 2 && preShootPhotos[preShootIndex].location}
                {activePanel === 3 && eventPhotos[eventIndex].location}
                {activePanel === 4 && 'Panoramic Studio Experience'}
              </p>
              <div className="flex items-center justify-between gap-2 mt-0.5">
                <h3 className="font-serif-luxury text-base sm:text-lg text-white font-medium">
                  {activePanel === 0 && weddingPhotos[weddingIndex].title}
                  {activePanel === 1 && gradPhotos[gradIndex].title}
                  {activePanel === 2 && preShootPhotos[preShootIndex].title}
                  {activePanel === 3 && eventPhotos[eventIndex].title}
                  {activePanel === 4 && '360° Cinematic Video'}
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
        </div>

        {/* ========================================================= */}
        {/* DESKTOP VIEW (> 768px): 5 EXPANDABLE LUXURY ACCORDION PILLARS */}
        {/* ========================================================= */}
        <div className="cat-showcase-desktop">
          <RevealOnScroll direction="up" delay={50}>
            <div 
              className="w-full overflow-hidden select-none"
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div 
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  height: '520px',
                  width: '100%',
                  gap: '12px',
                }}
              >
                
                {/* COLUMN 1: WEDDINGS */}
                <div
                  onClick={() => setActivePanel(0)}
                  onMouseEnter={() => setActivePanel(0)}
                  className="relative overflow-hidden border cursor-pointer flex flex-col justify-between rounded-sm"
                  style={{
                    flex: activePanel === 0 ? '4.5 1 0%' : '1 1 0%',
                    minWidth: activePanel === 0 ? '380px' : '90px',
                    height: '100%',
                    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    borderColor: activePanel === 0 ? '#ff6a13' : 'rgba(255, 255, 255, 0.12)',
                    boxShadow: activePanel === 0 ? '0 12px 35px rgba(0, 0, 0, 0.8)' : 'none',
                    backgroundColor: '#07070a'
                  }}
                >
                  {weddingPhotos.map((photo, i) => (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: i === weddingIndex ? 1 : 0,
                        pointerEvents: i === weddingIndex ? 'auto' : 'none',
                        transition: 'opacity 0.7s ease-in-out',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Ambient background (when active) OR full cover sliver preview (when inactive) */}
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
                          filter: activePanel === 0 ? 'blur(30px)' : 'brightness(0.85) contrast(1.05)',
                          opacity: activePanel === 0 ? 0.35 : 0.65,
                          transform: activePanel === 0 ? 'scale(1.15)' : 'scale(1)',
                          transition: 'all 0.6s ease',
                          pointerEvents: 'none'
                        }}
                      />

                      {/* Foreground Full Image: 100% visible, uncropped, zero zoom */}
                      {activePanel === 0 && (
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
                            alt={photo.title}
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

                  <div 
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 45%, rgba(0,0,0,0.4) 100%)',
                      pointerEvents: 'none'
                    }} 
                  />

                  {/* Top Tag & Slide Dots */}
                  <div className="relative z-10 p-3 sm:p-3.5 flex items-center justify-between">
                    <span className="text-[10px] tracking-[0.22em] uppercase font-bold text-white bg-black/75 backdrop-blur-md px-2.5 py-1 border border-white/10 whitespace-nowrap">
                      01 / Weddings
                    </span>
                    {activePanel === 0 && (
                      <div className="flex gap-1.5 animate-fadeIn">
                        {weddingPhotos.map((_, dotIdx) => (
                          <span
                            key={dotIdx}
                            onClick={(e) => {
                              e.stopPropagation();
                              setWeddingIndex(dotIdx);
                            }}
                            className={
                              "w-1.5 h-1.5 rounded-full transition-all cursor-pointer " +
                              (dotIdx === weddingIndex ? "bg-[#ff6a13] w-4" : "bg-white/40")
                            }
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Content */}
                  <div className="relative z-10 p-3.5 sm:p-4 space-y-1">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-300 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                      {weddingPhotos[weddingIndex].location}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-serif-luxury text-lg sm:text-xl lg:text-2xl text-white font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                        {activePanel === 0 ? weddingPhotos[weddingIndex].title : 'Weddings'}
                      </h3>
                      {activePanel === 0 && (
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

                {/* COLUMN 2: GRADUATION */}
                <div
                  onClick={() => setActivePanel(1)}
                  onMouseEnter={() => setActivePanel(1)}
                  className="relative overflow-hidden border cursor-pointer flex flex-col justify-between rounded-sm"
                  style={{
                    flex: activePanel === 1 ? '4.5 1 0%' : '1 1 0%',
                    minWidth: activePanel === 1 ? '380px' : '90px',
                    height: '100%',
                    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    borderColor: activePanel === 1 ? '#ff6a13' : 'rgba(255, 255, 255, 0.12)',
                    boxShadow: activePanel === 1 ? '0 12px 35px rgba(0, 0, 0, 0.8)' : 'none',
                    backgroundColor: '#07070a'
                  }}
                >
                  {gradPhotos.map((photo, i) => (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: i === gradIndex ? 1 : 0,
                        pointerEvents: i === gradIndex ? 'auto' : 'none',
                        transition: 'opacity 0.7s ease-in-out',
                        overflow: 'hidden'
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
                          filter: activePanel === 1 ? 'blur(30px)' : 'brightness(0.85) contrast(1.05)',
                          opacity: activePanel === 1 ? 0.35 : 0.65,
                          transform: activePanel === 1 ? 'scale(1.15)' : 'scale(1)',
                          transition: 'all 0.6s ease',
                          pointerEvents: 'none'
                        }}
                      />
                      {activePanel === 1 && (
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
                            alt={photo.title}
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

                  <div 
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 45%, rgba(0,0,0,0.4) 100%)',
                      pointerEvents: 'none'
                    }} 
                  />

                  <div className="relative z-10 p-3 sm:p-3.5 flex items-center justify-between">
                    <span className="text-[10px] tracking-[0.22em] uppercase font-bold text-white bg-black/75 backdrop-blur-md px-2.5 py-1 border border-white/10 whitespace-nowrap">
                      02 / Graduation
                    </span>
                    {activePanel === 1 && (
                      <div className="flex gap-1.5 animate-fadeIn">
                        {gradPhotos.map((_, dotIdx) => (
                          <span
                            key={dotIdx}
                            onClick={(e) => {
                              e.stopPropagation();
                              setGradIndex(dotIdx);
                            }}
                            className={
                              "w-1.5 h-1.5 rounded-full transition-all cursor-pointer " +
                              (dotIdx === gradIndex ? "bg-[#ff6a13] w-4" : "bg-white/40")
                            }
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative z-10 p-3.5 sm:p-4 space-y-1">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-300 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                      {gradPhotos[gradIndex].location}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-serif-luxury text-lg sm:text-xl lg:text-2xl text-white font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                        {activePanel === 1 ? gradPhotos[gradIndex].title : 'Graduation'}
                      </h3>
                      {activePanel === 1 && (
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

                {/* COLUMN 3: PRE-SHOOT */}
                <div
                  onClick={() => setActivePanel(2)}
                  onMouseEnter={() => setActivePanel(2)}
                  className="relative overflow-hidden border cursor-pointer flex flex-col justify-between rounded-sm"
                  style={{
                    flex: activePanel === 2 ? '4.5 1 0%' : '1 1 0%',
                    minWidth: activePanel === 2 ? '380px' : '90px',
                    height: '100%',
                    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    borderColor: activePanel === 2 ? '#ff6a13' : 'rgba(255, 255, 255, 0.12)',
                    boxShadow: activePanel === 2 ? '0 12px 35px rgba(0, 0, 0, 0.8)' : 'none',
                    backgroundColor: '#07070a'
                  }}
                >
                  {preShootPhotos.map((photo, i) => (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: i === preShootIndex ? 1 : 0,
                        pointerEvents: i === preShootIndex ? 'auto' : 'none',
                        transition: 'opacity 0.7s ease-in-out',
                        overflow: 'hidden'
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
                          filter: activePanel === 2 ? 'blur(30px)' : 'brightness(0.85) contrast(1.05)',
                          opacity: activePanel === 2 ? 0.35 : 0.65,
                          transform: activePanel === 2 ? 'scale(1.15)' : 'scale(1)',
                          transition: 'all 0.6s ease',
                          pointerEvents: 'none'
                        }}
                      />
                      {activePanel === 2 && (
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
                            alt={photo.title}
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

                  <div 
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 45%, rgba(0,0,0,0.4) 100%)',
                      pointerEvents: 'none'
                    }} 
                  />

                  <div className="relative z-10 p-3 sm:p-3.5 flex items-center justify-between">
                    <span className="text-[10px] tracking-[0.22em] uppercase font-bold text-white bg-black/75 backdrop-blur-md px-2.5 py-1 border border-white/10 whitespace-nowrap">
                      03 / Pre-Shoot
                    </span>
                    {activePanel === 2 && (
                      <div className="flex gap-1.5 animate-fadeIn">
                        {preShootPhotos.map((_, dotIdx) => (
                          <span
                            key={dotIdx}
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreShootIndex(dotIdx);
                            }}
                            className={
                              "w-1.5 h-1.5 rounded-full transition-all cursor-pointer " +
                              (dotIdx === preShootIndex ? "bg-[#ff6a13] w-4" : "bg-white/40")
                            }
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative z-10 p-3.5 sm:p-4 space-y-1">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-300 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                      {preShootPhotos[preShootIndex].location}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-serif-luxury text-lg sm:text-xl lg:text-2xl text-white font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                        {activePanel === 2 ? preShootPhotos[preShootIndex].title : 'Pre-Shoot'}
                      </h3>
                      {activePanel === 2 && (
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

                {/* COLUMN 4: EVENTS */}
                <div
                  onClick={() => setActivePanel(3)}
                  onMouseEnter={() => setActivePanel(3)}
                  className="relative overflow-hidden border cursor-pointer flex flex-col justify-between rounded-sm"
                  style={{
                    flex: activePanel === 3 ? '4.5 1 0%' : '1 1 0%',
                    minWidth: activePanel === 3 ? '380px' : '90px',
                    height: '100%',
                    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    borderColor: activePanel === 3 ? '#ff6a13' : 'rgba(255, 255, 255, 0.12)',
                    boxShadow: activePanel === 3 ? '0 12px 35px rgba(0, 0, 0, 0.8)' : 'none',
                    backgroundColor: '#07070a'
                  }}
                >
                  {eventPhotos.map((photo, i) => (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: i === eventIndex ? 1 : 0,
                        pointerEvents: i === eventIndex ? 'auto' : 'none',
                        transition: 'opacity 0.7s ease-in-out',
                        overflow: 'hidden'
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
                          filter: activePanel === 3 ? 'blur(30px)' : 'brightness(0.85) contrast(1.05)',
                          opacity: activePanel === 3 ? 0.35 : 0.65,
                          transform: activePanel === 3 ? 'scale(1.15)' : 'scale(1)',
                          transition: 'all 0.6s ease',
                          pointerEvents: 'none'
                        }}
                      />
                      {activePanel === 3 && (
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
                            alt={photo.title}
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

                  <div 
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 45%, rgba(0,0,0,0.4) 100%)',
                      pointerEvents: 'none'
                    }} 
                  />

                  <div className="relative z-10 p-3 sm:p-3.5 flex items-center justify-between">
                    <span className="text-[10px] tracking-[0.22em] uppercase font-bold text-white bg-black/75 backdrop-blur-md px-2.5 py-1 border border-white/10 whitespace-nowrap">
                      04 / Events
                    </span>
                    {activePanel === 3 && (
                      <div className="flex gap-1.5 animate-fadeIn">
                        {eventPhotos.map((_, dotIdx) => (
                          <span
                            key={dotIdx}
                            onClick={(e) => {
                              e.stopPropagation();
                              setEventIndex(dotIdx);
                            }}
                            className={
                              "w-1.5 h-1.5 rounded-full transition-all cursor-pointer " +
                              (dotIdx === eventIndex ? "bg-[#ff6a13] w-4" : "bg-white/40")
                            }
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative z-10 p-3.5 sm:p-4 space-y-1">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-300 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                      {eventPhotos[eventIndex].location}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-serif-luxury text-lg sm:text-xl lg:text-2xl text-white font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                        {activePanel === 3 ? eventPhotos[eventIndex].title : 'Events'}
                      </h3>
                      {activePanel === 3 && (
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

                {/* COLUMN 5: 360° & CINEMATIC VIDEO */}
                <div
                  onClick={() => setActivePanel(4)}
                  onMouseEnter={() => setActivePanel(4)}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  className="relative overflow-hidden border cursor-grab active:cursor-grabbing flex flex-col justify-between rounded-sm"
                  style={{
                    flex: activePanel === 4 ? '5 1 0%' : '1 1 0%',
                    minWidth: activePanel === 4 ? '380px' : '90px',
                    height: '100%',
                    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    borderColor: activePanel === 4 ? '#ff6a13' : 'rgba(255, 255, 255, 0.12)',
                    boxShadow: activePanel === 4 ? '0 12px 35px rgba(0, 0, 0, 0.8)' : 'none',
                    backgroundColor: '#07070a'
                  }}
                >
                  {/* Background 360 Video Player */}
                  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                    <img
                      src={video360Config.poster || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'}
                      alt=""
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: activePanel === 4 ? 'blur(30px)' : 'brightness(0.85) contrast(1.05)',
                        opacity: activePanel === 4 ? 0.35 : 0.65,
                        transform: activePanel === 4 ? 'scale(1.15)' : 'scale(1)',
                        transition: 'all 0.6s ease',
                        pointerEvents: 'none'
                      }}
                    />
                    {activePanel === 4 && (
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
                          ref={videoRef}
                          key={video360Config.url}
                          autoPlay
                          loop
                          muted={videoMuted}
                          playsInline
                          style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            width: 'auto',
                            height: 'auto',
                            objectFit: 'contain',
                            objectPosition: 'center',
                            filter: 'brightness(1.02) contrast(1.05) drop-shadow(0 12px 35px rgba(0,0,0,0.85))'
                          }}
                          poster={video360Config.poster || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'}
                        >
                          <source
                            src={video360Config.url}
                            type="video/mp4"
                          />
                        </video>
                      </div>
                    )}
                  </div>

                  <div 
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 45%, rgba(0,0,0,0.4) 100%)',
                      pointerEvents: 'none'
                    }} 
                  />

                  {/* Top 360 Badge & Interactive Controls */}
                  <div className="relative z-10 p-3 sm:p-3.5 flex items-center justify-between">
                    <span className="text-[10px] tracking-[0.22em] uppercase font-bold text-white bg-black/80 backdrop-blur-md px-2.5 py-1 border border-white/15 flex items-center gap-1.5 whitespace-nowrap">
                      <Compass className="w-3.5 h-3.5 text-[#ff6a13] animate-spin" style={{ animationDuration: '8s' }} />
                      05 / 360° Video
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={toggleVideoPlayback}
                        className="p-1.5 bg-black/70 hover:bg-black/90 text-white rounded-full border border-white/20 transition-all cursor-pointer"
                        title={videoPlaying ? 'Pause Video' : 'Play Video'}
                      >
                        {videoPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
                      </button>
                      <button
                        type="button"
                        onClick={toggleVideoMute}
                        className="p-1.5 bg-black/70 hover:bg-black/90 text-white rounded-full border border-white/20 transition-all cursor-pointer"
                        title={videoMuted ? 'Unmute Audio' : 'Mute Audio'}
                      >
                        {videoMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 text-white" />}
                      </button>
                    </div>
                  </div>

                  <div className="relative z-10 p-3.5 sm:p-4 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-serif-luxury text-lg sm:text-xl lg:text-2xl text-white font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                        360° Video
                      </h3>
                      {activePanel === 4 && (
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

              </div>
            </div>
          </RevealOnScroll>
        </div>

      </div>
    </section>
  );
}
