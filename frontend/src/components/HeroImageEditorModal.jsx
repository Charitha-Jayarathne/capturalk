import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  Move, 
  RotateCw, 
  Check, 
  Grid, 
  RefreshCw,
  Smartphone,
  Monitor,
  Maximize,
  Minimize,
  SlidersHorizontal,
  Sparkles,
  Crop,
  Layers,
  Sliders
} from 'lucide-react';

export default function HeroImageEditorModal({
  isOpen,
  onClose,
  imageSrc,
  title = 'Image Framing & Position Editor',
  onApply,
  currentOpacity = 0.10,
  heroTitle = 'CAPTURA LK',
  heroTagline = 'INSPIRED BY THE ELEGANCE OF SIMPLICITY'
}) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  // Default to 'contain' so 100% of the photo is visible initially without ANY automatic cropping
  const [fitMode, setFitMode] = useState('contain'); 
  // Adjustable frame aspect ratio: 'original' | '16:9' | '21:9' | '3:2' | '4:3' | '1:1' | '9:16' | 'custom'
  const [aspectRatio, setAspectRatio] = useState('original');
  const [customRatio, setCustomRatio] = useState(16 / 9);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showOverlayText, setShowOverlayText] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [isProcessing, setIsProcessing] = useState(false);

  const containerRef = useRef(null);
  const imageRef = useRef(null);

  // Natural photo aspect ratio
  const naturalRatio = (imageDimensions.width && imageDimensions.height)
    ? (imageDimensions.width / imageDimensions.height)
    : (16 / 9);

  // Active numeric aspect ratio of the frame
  let currentRatio = 16 / 9;
  if (aspectRatio === 'original') {
    currentRatio = naturalRatio;
  } else if (aspectRatio === '16:9') {
    currentRatio = 16 / 9;
  } else if (aspectRatio === '21:9') {
    currentRatio = 21 / 9;
  } else if (aspectRatio === '3:2') {
    currentRatio = 3 / 2;
  } else if (aspectRatio === '4:3') {
    currentRatio = 4 / 3;
  } else if (aspectRatio === '1:1') {
    currentRatio = 1;
  } else if (aspectRatio === '9:16') {
    currentRatio = 9 / 16;
  } else if (aspectRatio === 'custom') {
    currentRatio = customRatio;
  }

  // Reset controls whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setRotation(0);
      // NEVER auto-crop on open! Always default to 'contain' and 'original' (or full photo visibility)
      setFitMode('contain');
      setAspectRatio('original');
      const isHeroMain = (title || '').toLowerCase().includes('hero slide') || ((title || '').toLowerCase().includes('hero') && !(title || '').toLowerCase().includes('background'));
      setShowOverlayText(isHeroMain);
      setImageLoaded(false);
    }
  }, [isOpen, imageSrc, title]);

  // Load natural image dimensions
  const onImageLoad = (e) => {
    setImageLoaded(true);
    const nw = e.target.naturalWidth || 1920;
    const nh = e.target.naturalHeight || 1080;
    setImageDimensions({ width: nw, height: nh });
    setCustomRatio(nw / nh);
  };

  // Dragging handlers for smooth repositioning
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile / tablet
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y
      });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Mouse wheel zoom (allows zooming out to 0.2x to see entire photo with plenty of margin)
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY * -0.0015;
    setZoom((prev) => Math.min(Math.max(0.2, prev + delta), 3.5));
  };

  // Quick positioning presets
  const applyPreset = (preset) => {
    if (preset === 'center') {
      setPan({ x: 0, y: 0 });
    } else if (preset === 'top') {
      setPan({ x: 0, y: 70 * zoom });
    } else if (preset === 'bottom') {
      setPan({ x: 0, y: -70 * zoom });
    } else if (preset === 'contain') {
      setFitMode('contain');
      setZoom(1);
      setPan({ x: 0, y: 0 });
    } else if (preset === 'cover') {
      setFitMode('cover');
      setZoom(1);
      setPan({ x: 0, y: 0 });
    } else if (preset === 'matchPhoto') {
      setAspectRatio('original');
      setFitMode('contain');
      setZoom(1);
      setPan({ x: 0, y: 0 });
    } else if (preset === 'zoomIn') {
      setZoom((prev) => Math.min(prev + 0.15, 3.5));
    } else if (preset === 'zoomOut') {
      setZoom((prev) => Math.max(prev - 0.15, 0.2));
    }
  };

  // Rotate 90 degrees
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Generate cropped and framed canvas image with pixel-perfect aspect ratio & positioning
  const handleApplyCrop = () => {
    if (!imageRef.current || !containerRef.current) {
      onApply(imageSrc);
      onClose();
      return;
    }
    setIsProcessing(true);

    try {
      const container = containerRef.current;
      const img = imageRef.current;
      const containerRect = container.getBoundingClientRect();

      // Compute target high-res canvas dimensions matching the selected frame aspect ratio
      let targetW, targetH;
      if (currentRatio >= 1) {
        targetW = 1920;
        targetH = Math.max(200, Math.round(1920 / currentRatio));
      } else {
        targetH = 1920;
        targetW = Math.max(200, Math.round(1920 * currentRatio));
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        onApply(imageSrc);
        setIsProcessing(false);
        onClose();
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // 1. Draw solid dark background
      ctx.fillStyle = '#060608';
      ctx.fillRect(0, 0, targetW, targetH);

      const imgW = img.naturalWidth || 1920;
      const imgH = img.naturalHeight || 1080;

      // 2. If in 'contain' mode or zoomed out, draw ambient soft blur background to fill any letterbox edges gracefully
      if (fitMode === 'contain' || zoom < 0.95) {
        ctx.save();
        ctx.filter = 'blur(35px) brightness(0.65)';
        const coverScale = Math.max(targetW / imgW, targetH / imgH);
        const bgW = imgW * coverScale * 1.15;
        const bgH = imgH * coverScale * 1.15;
        ctx.drawImage(img, (targetW - bgW) / 2, (targetH - bgH) / 2, bgW, bgH);
        ctx.restore();
      }

      // 3. Draw Foreground Image with exact Pan, Zoom & Rotation
      ctx.save();
      ctx.translate(targetW / 2, targetH / 2);

      // Pan translation (proportional to canvas size)
      const scaleToCanvas = targetW / containerRect.width;
      ctx.translate(pan.x * scaleToCanvas, pan.y * scaleToCanvas);

      // Rotation
      ctx.rotate((rotation * Math.PI) / 180);

      // Zoom
      ctx.scale(zoom, zoom);

      // Sizing calculation based on fitMode
      let drawW, drawH;
      if (fitMode === 'contain') {
        const containScale = Math.min(targetW / imgW, targetH / imgH);
        drawW = imgW * containScale;
        drawH = imgH * containScale;
      } else {
        const coverScale = Math.max(targetW / imgW, targetH / imgH);
        drawW = imgW * coverScale;
        drawH = imgH * coverScale;
      }

      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      // Attempt to export canvas. If CORS taints it, fallback to original image URL
      try {
        const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
        onApply(croppedDataUrl);
      } catch (corsErr) {
        console.warn('Canvas export tainted by CORS; applying original image URL directly:', corsErr);
        onApply(imageSrc);
      }
    } catch (e) {
      console.error('Framing crop failed:', e);
      onApply(imageSrc);
    } finally {
      setIsProcessing(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  const isHorizontal = currentRatio >= 1;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.92)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '1140px',
          maxHeight: '96vh',
          backgroundColor: '#0c0c12',
          border: '1px solid #222232',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.95)'
        }}
      >
        {/* Modal Header */}
        <div 
          style={{
            padding: '14px 20px',
            borderBottom: '1px solid #1c1c28',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#101018',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ff6a13', boxShadow: '0 0 10px #ff6a13' }} />
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', color: '#fff', fontWeight: 600, letterSpacing: '0.02em' }}>
                {title}
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#888899' }}>
                Adjust Frame Aspect Ratio (16:9, Original, 21:9, Custom) • Drag & Zoom to Position • Zero Unwanted Auto-Crop
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#aaa',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.15s'
            }}
            title="Close Editor"
          >
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        {/* 1. ASPECT RATIO & FRAME CONTROLS BAR */}
        <div 
          style={{
            padding: '10px 20px',
            backgroundColor: '#12121c',
            borderBottom: '1px solid #1f1f2e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          {/* Aspect Ratio Selector Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', color: '#888899', textTransform: 'uppercase', fontFamily: 'monospace', marginRight: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Crop style={{ width: '12px', height: '12px', color: '#ff6a13' }} />
              Frame Ratio:
            </span>

            {[
              { id: 'original', label: 'Original Photo', badge: imageDimensions.width ? `${Math.round(naturalRatio * 100) / 100}:1` : 'Auto' },
              { id: '16:9', label: '16:9 Widescreen', badge: '1.78:1' },
              { id: '21:9', label: '21:9 Cinema', badge: '2.33:1' },
              { id: '3:2', label: '3:2 DSLR', badge: '1.50:1' },
              { id: '4:3', label: '4:3 Standard', badge: '1.33:1' },
              { id: '1:1', label: '1:1 Square', badge: '1.00:1' },
              { id: '9:16', label: '9:16 Story', badge: '0.56:1' },
              { id: 'custom', label: 'Custom Slider', badge: `${Math.round(currentRatio * 100) / 100}:1` }
            ].map((ratioOpt) => {
              const isSelected = aspectRatio === ratioOpt.id;
              return (
                <button
                  key={ratioOpt.id}
                  type="button"
                  onClick={() => {
                    setAspectRatio(ratioOpt.id);
                    if (ratioOpt.id === 'original') {
                      setFitMode('contain');
                    }
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 9px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: isSelected ? 700 : 500,
                    border: isSelected ? '1px solid #ff6a13' : '1px solid #28283a',
                    backgroundColor: isSelected ? 'rgba(255, 106, 19, 0.18)' : '#171724',
                    color: isSelected ? '#ff6a13' : '#ccc',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{ratioOpt.label}</span>
                  <span style={{ fontSize: '9px', opacity: 0.7, fontFamily: 'monospace' }}>
                    ({ratioOpt.badge})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Framing Mode: Fit 100% vs Fill Frame */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: '#888899', textTransform: 'uppercase', fontFamily: 'monospace', marginRight: '4px' }}>
              Fit Mode:
            </span>
            <button
              type="button"
              onClick={() => applyPreset('contain')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: fitMode === 'contain' ? 700 : 500,
                border: fitMode === 'contain' ? '1px solid #ff6a13' : '1px solid #28283a',
                backgroundColor: fitMode === 'contain' ? '#ff6a13' : '#171724',
                color: fitMode === 'contain' ? '#fff' : '#aaa',
                cursor: 'pointer'
              }}
              title="Show 100% of entire photo without cutting anything off"
            >
              <Minimize style={{ width: '12px', height: '12px' }} />
              <span>Fit Whole Photo (Zero Crop)</span>
            </button>

            <button
              type="button"
              onClick={() => applyPreset('cover')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: fitMode === 'cover' ? 700 : 500,
                border: fitMode === 'cover' ? '1px solid #ff6a13' : '1px solid #28283a',
                backgroundColor: fitMode === 'cover' ? '#ff6a13' : '#171724',
                color: fitMode === 'cover' ? '#fff' : '#aaa',
                cursor: 'pointer'
              }}
              title="Crop to fill the entire frame edge-to-edge"
            >
              <Maximize style={{ width: '12px', height: '12px' }} />
              <span>Fill Frame (Crop)</span>
            </button>
          </div>
        </div>

        {/* Custom Aspect Ratio Proportion Slider (Only when Custom is selected) */}
        {aspectRatio === 'custom' && (
          <div 
            style={{
              padding: '8px 20px',
              backgroundColor: '#161624',
              borderBottom: '1px solid #252538',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              flexWrap: 'wrap'
            }}
          >
            <span style={{ fontSize: '11px', color: '#ff6a13', fontFamily: 'monospace', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sliders style={{ width: '13px', height: '13px' }} />
              Adjust Frame Width/Height Ratio:
            </span>
            <input
              type="range"
              min="0.45"
              max="2.50"
              step="0.02"
              value={customRatio}
              onChange={(e) => setCustomRatio(parseFloat(e.target.value))}
              style={{ flex: 1, minWidth: '200px', accentColor: '#ff6a13' }}
            />
            <span style={{ fontSize: '11px', color: '#fff', fontFamily: 'monospace', backgroundColor: '#0d0d14', padding: '3px 8px', borderRadius: '4px', border: '1px solid #ff6a13' }}>
              Ratio: {Math.round(customRatio * 100) / 100}:1 ({customRatio >= 1.7 ? 'Widescreen' : customRatio >= 1.2 ? 'Landscape' : customRatio >= 0.9 ? 'Square' : 'Vertical'})
            </span>
          </div>
        )}

        {/* Editor Main Canvas Body */}
        <div 
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#07070a'
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Status banner */}
          <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: fitMode === 'contain' ? '#4ade80' : '#fb923c' }}>
            <Sparkles style={{ width: '12px', height: '12px' }} />
            <span>
              {fitMode === 'contain' 
                ? '✓ 100% of the entire photo is fully visible (Zero automatic cropping). Drag with mouse to position or use zoom.' 
                : '⚠ Fill Frame active: Photo fills the frame. Drag with mouse to position the exact portion you want.'}
            </span>
          </div>

          {/* Viewport Frame with Dynamic Aspect Ratio */}
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
            style={{
              width: isHorizontal ? '100%' : 'auto',
              maxWidth: isHorizontal ? '880px' : '440px',
              height: isHorizontal ? 'auto' : '50vh',
              aspectRatio: `${currentRatio}`,
              maxHeight: '50vh',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '8px',
              border: '2px solid #ff6a13',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.95)',
              cursor: isDragging ? 'grabbing' : 'grab',
              backgroundColor: '#050508',
              userSelect: 'none',
              touchAction: 'none'
            }}
          >
            {/* Ambient Blurred Background (fills frame softly with matching photo colors so no harsh black cuts) */}
            {imageSrc && (fitMode === 'contain' || zoom < 0.95) && (
              <img
                src={imageSrc}
                crossOrigin="anonymous"
                alt=""
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'blur(30px)',
                  opacity: 0.35,
                  transform: 'scale(1.18)',
                  pointerEvents: 'none'
                }}
              />
            )}

            {/* The Foreground Image Layer with Pan, Zoom & Rotation */}
            {imageSrc ? (
              <img
                ref={imageRef}
                src={imageSrc}
                crossOrigin="anonymous"
                alt="Framing preview"
                onLoad={onImageLoad}
                draggable={false}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: fitMode === 'contain' ? 'contain' : 'cover',
                  objectPosition: 'center',
                  transform: `translate(${pan.x}px, ${pan.y}px) rotate(${rotation}deg) scale(${zoom})`,
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : 'transform 0.12s ease-out',
                  pointerEvents: 'none',
                  filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.85))'
                }}
              />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>
                No image loaded
              </div>
            )}

            {/* Dark Layer Simulation (matches live site opacity) */}
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: `rgba(0, 0, 0, ${currentOpacity})`,
                pointerEvents: 'none',
                transition: 'background-color 0.2s'
              }}
            />

            {/* Rule of Thirds Grid Guidelines */}
            {showGrid && (
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.35 }}>
                <div style={{ position: 'absolute', top: '33.33%', left: 0, right: 0, height: '1px', backgroundColor: '#fff', borderTop: '1px dashed rgba(255,255,255,0.7)' }} />
                <div style={{ position: 'absolute', top: '66.66%', left: 0, right: 0, height: '1px', backgroundColor: '#fff', borderTop: '1px dashed rgba(255,255,255,0.7)' }} />
                <div style={{ position: 'absolute', left: '33.33%', top: 0, bottom: 0, width: '1px', backgroundColor: '#fff', borderLeft: '1px dashed rgba(255,255,255,0.7)' }} />
                <div style={{ position: 'absolute', left: '66.66%', top: 0, bottom: 0, width: '1px', backgroundColor: '#fff', borderLeft: '1px dashed rgba(255,255,255,0.7)' }} />
              </div>
            )}

            {/* Live Hero Typography Simulation Overlay (only for Hero) */}
            {showOverlayText && (
              <div 
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px',
                  textAlign: 'center',
                  pointerEvents: 'none',
                  textShadow: '0 2px 10px rgba(0,0,0,0.85)'
                }}
              >
                <div style={{ fontSize: isHorizontal ? '32px' : '22px', fontWeight: 300, letterSpacing: '0.15em', color: '#ffffff', fontFamily: 'serif', textTransform: 'uppercase' }}>
                  {heroTitle || 'CAPTURA LK'}
                </div>
                <div style={{ fontSize: isHorizontal ? '9px' : '7px', letterSpacing: '0.22em', color: '#e0e0e0', marginTop: '6px', textTransform: 'uppercase', fontWeight: 400 }}>
                  {heroTagline || 'INSPIRED BY THE ELEGANCE OF SIMPLICITY'}
                </div>

                <div style={{ position: 'absolute', bottom: '12px', fontSize: '9px', color: '#ff6a13', backgroundColor: 'rgba(0,0,0,0.75)', padding: '2px 8px', borderRadius: '10px', border: '1px solid rgba(255,106,19,0.3)', letterSpacing: '0.05em' }}>
                  LIVE HERO SIMULATION
                </div>
              </div>
            )}

            {/* Drag helper badge */}
            <div 
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: '#ddd',
                padding: '3px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <Move style={{ width: '10px', height: '10px', color: '#ff6a13' }} />
              <span>Drag to Pan / Position</span>
            </div>
          </div>

          {/* Quick Presets & Position Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ fontSize: '11px', color: '#777788', textTransform: 'uppercase', fontFamily: 'monospace' }}>Position:</span>
            <button
              type="button"
              onClick={() => applyPreset('matchPhoto')}
              style={{ padding: '4px 10px', backgroundColor: '#161622', border: '1px solid #28283c', color: '#ff6a13', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}
              title="Fit frame exactly to photo aspect ratio with zero crop"
            >
              Match Frame to Photo
            </button>
            <button
              type="button"
              onClick={() => applyPreset('center')}
              style={{ padding: '4px 10px', backgroundColor: '#161622', border: '1px solid #28283c', color: '#ccc', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
            >
              Center
            </button>
            <button
              type="button"
              onClick={() => applyPreset('top')}
              style={{ padding: '4px 10px', backgroundColor: '#161622', border: '1px solid #28283c', color: '#ccc', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
            >
              Focus Top (Faces)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('bottom')}
              style={{ padding: '4px 10px', backgroundColor: '#161622', border: '1px solid #28283c', color: '#ccc', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
            >
              Focus Bottom (Gown / Scenery)
            </button>
            <button
              type="button"
              onClick={handleRotate}
              style={{ padding: '4px 10px', backgroundColor: '#161622', border: '1px solid #28283c', color: '#ccc', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              title="Rotate 90 degrees"
            >
              <RotateCw style={{ width: '11px', height: '11px' }} />
              <span>Rotate</span>
            </button>
          </div>

          {/* Sliders Control Bar (Zoom, Pan Y, Pan X) */}
          <div 
            style={{
              width: '100%',
              maxWidth: '880px',
              backgroundColor: '#101018',
              border: '1px solid #1c1c28',
              borderRadius: '8px',
              padding: '12px 18px',
              marginTop: '12px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '14px'
            }}
          >
            {/* Zoom Slider (0.2x to 3.5x allows zooming out completely to see whole photo) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <span style={{ fontSize: '11px', color: '#aaa', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ZoomIn style={{ width: '12px', height: '12px', color: '#ff6a13' }} />
                  Zoom Level (Scale):
                </span>
                <span style={{ fontSize: '11px', color: '#ff6a13', fontFamily: 'monospace', fontWeight: 600 }}>
                  {Math.round(zoom * 100)}%
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => applyPreset('zoomOut')}
                  style={{ padding: '3px 8px', backgroundColor: '#1b1b26', border: '1px solid #2c2c3d', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}
                  title="Zoom Out"
                >
                  -
                </button>
                <input
                  type="range"
                  min="0.2"
                  max="3.5"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  style={{ flex: 1, accentColor: '#ff6a13' }}
                />
                <button
                  type="button"
                  onClick={() => applyPreset('zoomIn')}
                  style={{ padding: '3px 8px', backgroundColor: '#1b1b26', border: '1px solid #2c2c3d', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}
                  title="Zoom In"
                >
                  +
                </button>
              </div>
            </div>

            {/* Vertical Pan Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <span style={{ fontSize: '11px', color: '#aaa' }}>
                  Vertical Pan (Y):
                </span>
                <span style={{ fontSize: '11px', color: '#aaa', fontFamily: 'monospace' }}>
                  {pan.y > 0 ? `+${Math.round(pan.y)}px` : `${Math.round(pan.y)}px`}
                </span>
              </div>
              <input
                type="range"
                min="-350"
                max="350"
                step="2"
                value={pan.y}
                onChange={(e) => setPan((prev) => ({ ...prev, y: parseInt(e.target.value) }))}
                style={{ width: '100%', accentColor: '#ff6a13' }}
              />
            </div>

            {/* Horizontal Pan Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <span style={{ fontSize: '11px', color: '#aaa' }}>
                  Horizontal Pan (X):
                </span>
                <span style={{ fontSize: '11px', color: '#aaa', fontFamily: 'monospace' }}>
                  {pan.x > 0 ? `+${Math.round(pan.x)}px` : `${Math.round(pan.x)}px`}
                </span>
              </div>
              <input
                type="range"
                min="-350"
                max="350"
                step="2"
                value={pan.x}
                onChange={(e) => setPan((prev) => ({ ...prev, x: parseInt(e.target.value) }))}
                style={{ width: '100%', accentColor: '#ff6a13' }}
              />
            </div>
          </div>

          {/* Toggles Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '10px', flexWrap: 'wrap', width: '100%', maxWidth: '880px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#888899', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showOverlayText}
                onChange={(e) => setShowOverlayText(e.target.checked)}
                style={{ accentColor: '#ff6a13' }}
              />
              <span>Show Hero Text Simulation</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#888899', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showGrid}
                onChange={(e) => setShowGrid(e.target.checked)}
                style={{ accentColor: '#ff6a13' }}
              />
              <span>Show Rule of Thirds Grid</span>
            </label>

            <button
              type="button"
              onClick={() => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
                setRotation(0);
                setFitMode('contain');
                setAspectRatio('original');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: 'transparent',
                border: 'none',
                color: '#aaa',
                fontSize: '11px',
                cursor: 'pointer',
                marginLeft: 'auto'
              }}
            >
              <RefreshCw style={{ width: '11px', height: '11px' }} />
              <span>Reset to Original (Zero Crop)</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div 
          style={{
            padding: '12px 20px',
            borderTop: '1px solid #1c1c28',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#101018',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ fontSize: '11px', color: '#777788', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>{imageDimensions.width ? `Source Image: ${imageDimensions.width} × ${imageDimensions.height}px` : 'Loading...'}</span>
            <span style={{ color: '#ff6a13', fontFamily: 'monospace' }}>• Frame: {aspectRatio} ({Math.round(currentRatio * 100) / 100}:1)</span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                backgroundColor: '#1b1b26',
                border: '1px solid #2d2d3e',
                color: '#bbb',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleApplyCrop}
              disabled={isProcessing}
              style={{
                padding: '8px 22px',
                backgroundColor: '#ff6a13',
                border: 'none',
                color: '#fff',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 14px rgba(255, 106, 19, 0.4)',
                opacity: isProcessing ? 0.7 : 1
              }}
            >
              <Check style={{ width: '14px', height: '14px' }} />
              <span>{isProcessing ? 'Applying...' : 'Apply & Save Framing'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
