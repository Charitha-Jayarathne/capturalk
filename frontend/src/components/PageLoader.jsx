import React, { useState, useEffect } from 'react';
import Logo from './Logo';

export default function PageLoader({ loading }) {
  const [visible, setVisible] = useState(loading);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!loading) {
      setFading(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 700);
      return () => clearTimeout(timer);
    } else {
      setVisible(true);
      setFading(false);
    }
  }, [loading]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#070709',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fading ? 0 : 1,
        pointerEvents: fading ? 'none' : 'auto',
        transition: 'opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.65s',
        overflow: 'hidden'
      }}
    >
      {/* Background Ambient Radial Glow */}
      <div
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 106, 19, 0.12) 0%, rgba(255, 106, 19, 0.02) 45%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }}
      />

      {/* Main Content Card */}
      <div className="relative z-10 flex flex-col items-center select-none px-6 text-center animate-fadeIn">
        {/* Brand Logo with Soft Scale Pulse */}
        <div className="transform transition-transform duration-500 scale-110 sm:scale-125 mb-5">
          <Logo />
        </div>

        {/* Elegant Tagline */}
        <p className="text-[10px] sm:text-[11px] font-semibold text-neutral-400 tracking-[0.35em] uppercase mt-2">
          Capturing Souls • Crafting Memories
        </p>

        {/* Sleek Golden Loading Bar */}
        <div className="w-44 sm:w-56 h-[2px] bg-neutral-800/80 rounded-full overflow-hidden mt-6 relative shadow-inner">
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, transparent, #ff6a13, #fbbf24, #ff6a13, transparent)',
              borderRadius: '9999px',
              animation: 'capturaLoaderSweep 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite'
            }}
          />
        </div>

        {/* Subtle Indicator */}
        <span className="text-[9px] font-mono tracking-[0.28em] text-neutral-500 uppercase mt-4">
          Loading Studio Vault...
        </span>
      </div>

      {/* Keyframe Styling */}
      <style>{`
        @keyframes capturaLoaderSweep {
          0% {
            left: -40%;
            width: 40%;
          }
          50% {
            left: 30%;
            width: 50%;
          }
          100% {
            left: 100%;
            width: 30%;
          }
        }
      `}</style>
    </div>
  );
}
