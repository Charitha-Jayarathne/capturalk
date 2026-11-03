import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers } from 'lucide-react';
import { getRecentAlbums, getAlbumsAsync, DEFAULT_ALBUMS } from '../utils/albumService';

export default function RecentAlbumsShowcase({ content }) {
  const [albums, setAlbums] = useState(() => {
    const initial = getRecentAlbums(12);
    return (initial && initial.length > 0) ? initial : DEFAULT_ALBUMS.slice(0, 12);
  });

  useEffect(() => {
    // Initial async hydration from IndexedDB if available
    getAlbumsAsync().then((loaded) => {
      if (loaded && loaded.length > 0) {
        setAlbums(loaded.slice(0, 12));
      } else {
        setAlbums(DEFAULT_ALBUMS.slice(0, 12));
      }
    });

    const handleUpdate = () => {
      getAlbumsAsync().then((loaded) => {
        if (loaded && loaded.length > 0) {
          setAlbums(loaded.slice(0, 12));
        } else {
          const rec = getRecentAlbums(12);
          setAlbums((rec && rec.length > 0) ? rec : DEFAULT_ALBUMS.slice(0, 12));
        }
      });
    };

    window.addEventListener('captura_albums_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('captura_albums_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  if (content?.isHidden) {
    return null;
  }

  const displayAlbums = (albums && albums.length > 0) ? albums.slice(0, 12) : DEFAULT_ALBUMS.slice(0, 12);
  const isCustomBg = Boolean(content?.customBgImage) && content?.bgType !== 'default';
  const bgOpacity = content?.bgOpacity !== undefined ? content.bgOpacity : 0.40;

  return (
    <section 
      id="recent-albums"
      style={{
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '50px',
        paddingBottom: '70px',
        backgroundColor: isCustomBg ? 'transparent' : '#07070a',
        backgroundImage: isCustomBg 
          ? `linear-gradient(rgba(7, 7, 10, ${bgOpacity}), rgba(7, 7, 10, ${bgOpacity})), url("${content.customBgImage}")`
          : 'linear-gradient(to bottom, #07070a, #0b0a10, #060608)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <style>{`
        .recent-albums-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 22px;
          margin-bottom: 40px;
        }
        .album-card-item {
          position: relative;
          display: block;
          width: 100%;
          aspect-ratio: 1 / 1;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background-color: #0c0c12;
          text-decoration: none;
          transition: transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
        }
        .album-card-item:hover {
          transform: translateY(-6px);
          border-color: rgba(255, 106, 19, 0.8) !important;
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.85), 0 0 20px rgba(255, 106, 19, 0.25) !important;
        }
        .album-card-item .album-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          filter: brightness(0.92) contrast(1.02);
          transition: transform 0.6s ease;
          z-index: 1;
        }
        .album-card-item:hover .album-img {
          transform: scale(1.08);
        }
        .album-card-item .hairline-accent {
          position: absolute;
          top: 0;
          left: 0;
          height: 3px;
          width: 0%;
          background-color: #ff6a13;
          transition: width 0.4s ease;
          z-index: 20;
        }
        .album-card-item:hover .hairline-accent {
          width: 100%;
        }
        .album-card-item .album-title {
          margin: 0;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 17px;
          color: #ffffff;
          font-weight: 500;
          letter-spacing: 0.02em;
          line-height: 1.3;
          transition: color 0.3s ease;
        }
        .album-card-item:hover .album-title {
          color: #ff944d;
        }
        @media (max-width: 1024px) {
          .recent-albums-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }
        }
        @media (max-width: 600px) {
          .recent-albums-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
          .album-card-item .album-title {
            font-size: 13px !important;
          }
        }
      `}</style>

      {/* Subtle luxury ambient flare in background */}
      <div 
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '300px',
          backgroundColor: 'rgba(255, 106, 19, 0.035)',
          borderRadius: '9999px',
          filter: 'blur(140px)',
          pointerEvents: 'none'
        }} 
      />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 10 }}>
        
        {/* Section Heading with Luxury Typography */}
        <div style={{ textAlign: 'center', marginBottom: '38px' }}>
          <div style={{
            width: '1px',
            height: '24px',
            background: 'linear-gradient(to bottom, transparent, rgba(255, 106, 19, 0.7), transparent)',
            margin: '0 auto 10px auto'
          }} />
          <p style={{
            margin: '0 0 6px 0',
            fontSize: '11px',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: '#ff6a13',
            fontWeight: 600,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
          }}>
            {content?.badge || 'CURATED ARCHIVES'}
          </p>
          <h2 style={{
            margin: 0,
            fontFamily: '"Playfair Display", "Cormorant Garamond", Georgia, serif',
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 300,
            letterSpacing: '-0.01em',
            color: '#ffffff',
            lineHeight: 1.2
          }}>
            {content?.title || 'Recent Masterpieces'}
          </h2>
        </div>

        {/* 2 Rows of 4 Square Cards (4 columns on desktop, 2 on tablet/mobile) */}
        <div className="recent-albums-grid">
          {displayAlbums.map((album, idx) => (
            <Link
              key={album.id || idx}
              to="/gallery"
              className="album-card-item"
            >
              {/* Top hairline orange sheen line on hover */}
              <div className="hairline-accent" />

              {/* Album Cover Photo with zoom effect */}
              <img
                src={album.coverImage}
                alt={album.title}
                loading="eager"
                className="album-img"
              />

              {/* Dark gradient overlay for title legibility */}
              <div 
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0, 0, 0, 0.88) 0%, rgba(0, 0, 0, 0.25) 45%, transparent 100%)',
                  zIndex: 5
                }}
              />

              {/* Album Name Only */}
              <div 
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '16px',
                  textAlign: 'center',
                  zIndex: 10
                }}
              >
                <h3 className="album-title">
                  {album.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Callout: Explore Full Gallery */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Link
            to="/gallery"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 36px',
              borderRadius: '9999px',
              color: '#ffffff',
              fontSize: '12px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontWeight: 600,
              textDecoration: 'none',
              background: 'linear-gradient(135deg, #ff7a29 0%, #ff6a13 50%, #e05300 100%)',
              boxShadow: '0 6px 26px rgba(255, 106, 19, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
          >
            <Layers style={{ width: '16px', height: '16px' }} />
            <span>{content?.viewAllButtonText || 'EXPLORE FULL GALLERY VAULT'}</span>
            <ArrowRight style={{ width: '16px', height: '16px' }} />
          </Link>
        </div>

      </div>
    </section>
  );
}
