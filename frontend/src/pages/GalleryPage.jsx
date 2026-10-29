import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Sparkles, MapPin, Calendar, Camera, ArrowRight, Layers, X, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAlbums, getAlbumsAsync, DEFAULT_ALBUMS } from '../utils/albumService';
import { getCategories, getCategoriesAsync } from '../utils/categoryService';

export default function GalleryPage({ onOpenBooking }) {
  const [albums, setAlbums] = useState(() => getAlbums());
  const [categoriesList, setCategoriesList] = useState(() => getCategories());
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAlbumModal, setActiveAlbumModal] = useState(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  useEffect(() => {
    getAlbumsAsync().then((loaded) => {
      if (loaded && loaded.length > 0) {
        setAlbums(loaded);
      }
    });

    getCategoriesAsync().then((loaded) => {
      if (loaded && Array.isArray(loaded)) {
        setCategoriesList(loaded);
      }
    });

    const handleUpdate = () => {
      getAlbumsAsync().then((loaded) => {
        if (loaded && loaded.length > 0) {
          setAlbums(loaded);
        } else {
          setAlbums(getAlbums());
        }
      });
    };

    const handleCategoriesUpdate = (e) => {
      if (e?.detail && Array.isArray(e.detail)) {
        setCategoriesList(e.detail);
      } else {
        setCategoriesList(getCategories());
      }
    };

    window.addEventListener('captura_albums_updated', handleUpdate);
    window.addEventListener('captura_categories_updated', handleCategoriesUpdate);
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('storage', handleCategoriesUpdate);
    return () => {
      window.removeEventListener('captura_albums_updated', handleUpdate);
      window.removeEventListener('captura_categories_updated', handleCategoriesUpdate);
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('storage', handleCategoriesUpdate);
    };
  }, []);

  const displayAlbums = (albums && albums.length > 0) ? albums : DEFAULT_ALBUMS;

  // ONLY user-defined categories are displayed!
  const categories = ['ALL', ...categoriesList.map(c => c.name.toUpperCase())];

  // If selected category was deleted, fallback to 'ALL'
  useEffect(() => {
    if (selectedCategory !== 'ALL' && !categoriesList.some(c => c.name.toUpperCase() === selectedCategory)) {
      setSelectedCategory('ALL');
    }
  }, [categoriesList, selectedCategory]);

  // Filtered albums
  const filteredAlbums = displayAlbums.filter((album) => {
    const albumCat = (album.category || '').toUpperCase();
    const matchesCat = selectedCategory === 'ALL' || albumCat === selectedCategory;
    const matchesSearch = !searchQuery.trim() || 
      (album.title && album.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (album.location && album.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (album.subtitle && album.subtitle.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="pt-28 sm:pt-32 pb-24 min-h-screen bg-[#07070a] text-neutral-100 relative">
      {/* Ambient background glow */}
      <div 
        style={{
          position: 'absolute',
          top: '150px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '400px',
          backgroundColor: 'rgba(255, 106, 19, 0.035)',
          borderRadius: '9999px',
          filter: 'blur(160px)',
          pointerEvents: 'none'
        }} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div style={{
            width: '1px',
            height: '28px',
            background: 'linear-gradient(to bottom, transparent, rgba(255, 106, 19, 0.7), transparent)',
            margin: '0 auto 12px auto'
          }} />

          <p style={{
            margin: '0 0 8px 0',
            fontSize: '11px',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: '#ff6a13',
            fontWeight: 600,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
          }}>
            FINE ART ARCHIVES
          </p>

          <h1 style={{
            margin: '0 0 16px 0',
            fontFamily: '"Playfair Display", "Cormorant Garamond", Georgia, serif',
            fontSize: 'clamp(34px, 5vw, 56px)',
            fontWeight: 300,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            lineHeight: 1.15
          }}>
            Masterpiece Gallery
          </h1>

          <p className="text-neutral-300 text-xs sm:text-sm md:text-base font-light leading-relaxed max-w-2xl mx-auto">
            Explore our complete archive of weddings, pre-shoots, convocations, and private milestones documented with timeless Sri Lankan artistry.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 mb-12 pb-6 border-b border-neutral-900">
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    letterSpacing: '0.12em',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    whiteSpace: 'nowrap',
                    backgroundColor: isSelected ? '#ff6a13' : '#111118',
                    color: isSelected ? '#ffffff' : '#9999aa',
                    border: isSelected ? '1px solid #ff6a13' : '1px solid #222230',
                    boxShadow: isSelected ? '0 4px 16px rgba(255, 106, 19, 0.4)' : 'none'
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search albums, venue, couple..."
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                backgroundColor: '#101018',
                border: '1px solid #242436',
                borderRadius: '9999px',
                fontSize: '12px',
                color: '#fff',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Albums Grid (4 columns on desktop, 2 on tablet/mobile) */}
        {filteredAlbums.length === 0 ? (
          <div className="py-24 text-center text-neutral-400">
            <Camera className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-lg text-white font-medium mb-1">No albums found</h3>
            <p className="text-sm text-neutral-500">Try adjusting your category filter or search keywords.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px'
          }} className="gallery-main-grid">
            <style>{`
              @media (max-width: 1024px) {
                .gallery-main-grid {
                  grid-template-columns: repeat(2, 1fr) !important;
                  gap: 16px !important;
                }
              }
              @media (max-width: 600px) {
                .gallery-main-grid {
                  grid-template-columns: repeat(1, 1fr) !important;
                  gap: 16px !important;
                }
              }
            `}</style>

            {filteredAlbums.map((album, idx) => (
              <div
                key={album.id || idx}
                onClick={() => {
                  setActiveAlbumModal(album);
                  setActivePhotoIdx(0);
                }}
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: '#0c0c12',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)'
                }}
                className="group hover:-translate-y-1.5 hover:border-[#ff6a13]/70 hover:shadow-[0_16px_36px_rgba(0,0,0,0.85)]"
              >
                {/* Square Thumbnail */}
                <div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', overflow: 'hidden' }}>
                  <img
                    src={album.coverImage}
                    alt={album.title}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      filter: 'brightness(0.92) contrast(1.02)',
                      transition: 'transform 0.6s ease'
                    }}
                    className="group-hover:scale-108"
                  />
                  {/* Subtle vignette */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)'
                  }} />

                  {/* Top Badges */}
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    right: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    zIndex: 10
                  }}>
                    <span style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      color: '#ff6a13',
                      border: '1px solid rgba(255, 106, 19, 0.4)'
                    }}>
                      {album.category || 'Wedding'}
                    </span>
                    <span style={{
                      fontSize: '9px',
                      fontWeight: 600,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      color: '#eee',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                      {album.photoCount || 40} Photos
                    </span>
                  </div>
                </div>

                {/* Card Info */}
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{
                      margin: 0,
                      fontFamily: '"Playfair Display", Georgia, serif',
                      fontSize: '18px',
                      color: '#ffffff',
                      fontWeight: 500,
                      lineHeight: 1.3
                    }} className="group-hover:text-[#ff944d] transition-colors">
                      {album.title}
                    </h3>

                    {album.subtitle && (
                      <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#ffaa66', fontStyle: 'italic' }}>
                        {album.subtitle}
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #1a1a24', fontSize: '11px', color: '#888899' }}>
                    {album.location ? (
                      <span className="flex items-center gap-1 line-clamp-1">
                        <MapPin className="w-3 h-3 text-[#ff6a13] shrink-0" />
                        <span>{album.location}</span>
                      </span>
                    ) : (
                      <span>Captura LK Atelier</span>
                    )}
                    {album.date && <span className="font-mono text-[10px] shrink-0">{album.date}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Booking CTA */}
        <div style={{
          marginTop: '70px',
          padding: '40px 24px',
          textAlign: 'center',
          backgroundColor: '#0c0c12',
          border: '1px solid #1f1f2d',
          borderRadius: '8px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <h2 style={{
            margin: '0 0 10px 0',
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: 'clamp(24px, 3.5vw, 36px)',
            color: '#fff',
            fontWeight: 400
          }}>
            Ready to Create Your Own Masterpiece?
          </h2>
          <p style={{ margin: '0 0 24px 0', fontSize: '13px', color: '#888899', maxWidth: '520px', marginLeft: 'auto', marginRight: 'auto' }}>
            Book your bespoke photography date with Captura LK and let us craft an immortal visual legacy for your celebration.
          </p>
          <button
            type="button"
            onClick={onOpenBooking}
            style={{
              padding: '13px 32px',
              borderRadius: '9999px',
              backgroundColor: '#ff6a13',
              color: '#fff',
              border: 'none',
              fontSize: '12px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(255, 106, 19, 0.45)'
            }}
          >
            Check Studio Availability
          </button>
        </div>

      </div>

      {/* Album Preview Modal Lightbox */}
      {activeAlbumModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.92)',
            backdropFilter: 'blur(10px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setActiveAlbumModal(null)}
        >
          <div 
            style={{
              maxWidth: '900px',
              width: '100%',
              backgroundColor: '#0e0e14',
              border: '1px solid #2d2d3e',
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 30px 80px rgba(0, 0, 0, 0.9)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Carousel */}
            {(() => {
              const photos = Array.isArray(activeAlbumModal.photos) && activeAlbumModal.photos.length > 0 
                ? activeAlbumModal.photos 
                : [activeAlbumModal.coverImage];
              const currentSrc = photos[activePhotoIdx] || activeAlbumModal.coverImage;

              return (
                <div style={{ position: 'relative', height: '480px', maxHeight: '60vh', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img
                    src={currentSrc}
                    alt={`${activeAlbumModal.title} - photo ${activePhotoIdx + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />

                  {/* Previous Photo Button */}
                  {photos.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
                      }}
                      style={{
                        position: 'absolute',
                        left: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 20
                      }}
                      title="Previous Photo"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  )}

                  {/* Next Photo Button */}
                  {photos.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePhotoIdx((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
                      }}
                      style={{
                        position: 'absolute',
                        right: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 20
                      }}
                      title="Next Photo"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}

                  {/* Photo Counter */}
                  {photos.length > 1 && (
                    <span style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(0,0,0,0.75)',
                      color: '#ffaa66',
                      border: '1px solid rgba(255,106,19,0.3)',
                      fontSize: '11px',
                      fontWeight: 700,
                      zIndex: 20
                    }}>
                      {activePhotoIdx + 1} / {photos.length}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => setActiveAlbumModal(null)}
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 20
                    }}
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Thumbnail bar if multiple photos */}
                  {photos.length > 1 && (
                    <div style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(0,0,0,0.75)',
                      backdropFilter: 'blur(6px)',
                      maxWidth: '90%',
                      overflowX: 'auto',
                      zIndex: 20
                    }}>
                      {photos.map((p, pIdx) => (
                        <img
                          key={pIdx}
                          src={p}
                          alt="Thumb"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActivePhotoIdx(pIdx);
                          }}
                          style={{
                            width: '42px',
                            height: '32px',
                            objectFit: 'cover',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            border: pIdx === activePhotoIdx ? '2px solid #ff6a13' : '1px solid rgba(255,255,255,0.2)',
                            opacity: pIdx === activePhotoIdx ? 1 : 0.6
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Modal Content Details */}
            <div style={{ padding: '24px 28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#ff6a13' }}>
                    {activeAlbumModal.category || 'Weddings'}
                  </span>
                  <h3 style={{ margin: '4px 0 0 0', fontFamily: '"Playfair Display", Georgia, serif', fontSize: '26px', color: '#fff', fontWeight: 500 }}>
                    {activeAlbumModal.title}
                  </h3>
                  {activeAlbumModal.subtitle && (
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#ffaa66', fontStyle: 'italic' }}>
                      {activeAlbumModal.subtitle}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActiveAlbumModal(null);
                    if (onOpenBooking) onOpenBooking();
                  }}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '4px',
                    backgroundColor: '#ff6a13',
                    border: 'none',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    cursor: 'pointer'
                  }}
                >
                  Book Similar Shoot
                </button>
              </div>

              {activeAlbumModal.description && (
                <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#bbb', lineHeight: 1.6 }}>
                  {activeAlbumModal.description}
                </p>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '12px', color: '#888', paddingTop: '14px', borderTop: '1px solid #1c1c28' }}>
                {activeAlbumModal.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#ff6a13]" />
                    <span>{activeAlbumModal.location}</span>
                  </span>
                )}
                {activeAlbumModal.date && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#ff6a13]" />
                    <span>{activeAlbumModal.date}</span>
                  </span>
                )}
                {activeAlbumModal.photoCount && (
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-[#ff6a13]" />
                    <span>{activeAlbumModal.photoCount} High-Res Deliverables</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
