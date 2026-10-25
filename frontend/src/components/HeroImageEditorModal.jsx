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
  Sparkles
} from 'lucide-react';

export default function HeroImageEditorModal({
  isOpen,
  onClose,
  imageSrc,
  title = 'Hero Image Preview & Framing Editor',
  onApply,
  currentOpacity = 0.10,
  heroTitle = 'CAPTURA LK',
  heroTagline = 'INSPIRED BY THE ELEGANCE OF SIMPLICITY'
}) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [fitMode, setFitMode] = useState('contain'); // 'contain' (100% full uncropped image) | 'cover' (fill 16:9 frame)
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showOverlayText, setShowOverlayText] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [previewMode, setPreviewMode] = useState('desktop'); // 'desktop' (16:9) | 'mobile' (9:16)
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [isProcessing, setIsProcessing] = useState(false);

  const containerRef = useRef(null);
  const imageRef = useRef(null);

  // Reset controls whenever a new image is opened
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setRotation(0);
      setFitMode('contain'); // Start in full uncropped mode by default so user sees 100% of image!
      setImageLoaded(false);
    }
  }, [isOpen, imageSrc]);

  // Load natural dimensions
  const onImageLoad = (e) => {
    setImageLoaded(true);
    const nw = e.target.naturalWidth || 1920;
    const nh = e.target.naturalHeight || 1080;
    setImageDimensions({ width: nw, height: nh });
  };

  // Dragging handlers
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

  // Touch handlers for mobile/tablet screens
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

  // Mouse wheel zoom (allows zooming out to 0.4x to see the whole image!)
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY * -0.0015;
    setZoom((prev) => Math.min(Math.max(0.4, prev + delta), 3.5));
  };

  // Quick positioning presets
  const applyPreset = (preset) => {
    if (preset === 'center') {
      setPan({ x: 0, y: 0 });
    } else if (preset === 'top') {
      setPan({ x: 0, y: 100 * zoom });
    } else if (preset === 'bottom') {
      setPan({ x: 0, y: -100 * zoom });
    } else if (preset === 'contain') {
      setFitMode('contain');
      setZoom(1);
      setPan({ x: 0, y: 0 });
    } else if (preset === 'cover') {
      setFitMode('cover');
      setZoom(1);
      setPan({ x: 0, y: 0 });
    } else if (preset === 'zoomIn') {
      setZoom((prev) => Math.min(prev + 0.2, 3.5));
    } else if (preset === 'zoomOut') {
      setZoom((prev) => Math.max(prev - 0.2, 0.4));
    }
  };

  // Rotate 90 degrees
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Generate cropped and framed canvas image with safe CORS fallback
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

      // Target canvas: 1920x1080 for desktop, 1080x1920 for mobile
      const targetW = previewMode === 'desktop' ? 1920 : 1080;
      const targetH = previewMode === 'desktop' ? 1080 : 1920;

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

      // 1. Draw dark background
      ctx.fillStyle = '#060608';
      ctx.fillRect(0, 0, targetW, targetH);

      const imgW = img.naturalWidth || 1920;
      const imgH = img.naturalHeight || 1080;

      // 2. If in 'contain' mode or zoomed out, draw ambient blur background to soften borders
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

      // Attempt to export canvas. If CORS taints it (e.g. remote URL without CORS), fallback to original image URL
      try {
        const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.90);
        onApply(croppedDataUrl);
      } catch (corsErr) {
        console.warn('Canvas export tainted by CORS; applying original image URL directly:', corsErr);
        onApply(imageSrc);
      }

      setIsProcessing(false);
      onClose();
    } catch (err) {
      console.error('Error generating cropped image:', err);
      // Even if canvas throws an unexpected error, apply the image directly so user is never blocked!
      onApply(imageSrc);
      setIsProcessing(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.90)',
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
          maxWidth: '1100px',
          maxHeight: '94vh',
          backgroundColor: '#0c0c12',
          border: '1px solid #222232',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.95)'
        }}
      >
        {/* Header */}
        <div 
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #1c1c28',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#101018'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ff6a13' }} />
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', color: '#fff', fontWeight: 600, letterSpacing: '0.02em' }}>
                {title}
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#888899' }}>
                Choose Full Uncropped Image or Custom Crop • Drag to Frame • Live Hero Simulation
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Viewport switch: Desktop (16:9) vs Mobile (9:16) */}
            <div style={{ display: 'flex', backgroundColor: '#181824', borderRadius: '6px', padding: '2px', border: '1px solid #282838' }}>
              <button
                type="button"
                onClick={() => setPreviewMode('desktop')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: previewMode === 'desktop' ? '#ff6a13' : 'transparent',
                  color: previewMode === 'desktop' ? '#fff' : '#888899',
                  transition: 'all 0.2s'
                }}
                title="Desktop View (16:9)"
              >
                <Monitor style={{ width: '13px', height: '13px' }} />
                <span>Desktop (16:9)</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('mobile')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: previewMode === 'mobile' ? '#ff6a13' : 'transparent',
                  color: previewMode === 'mobile' ? '#fff' : '#888899',
                  transition: 'all 0.2s'
                }}
                title="Mobile View (9:16)"
              >
                <Smartphone style={{ width: '13px', height: '13px' }} />
                <span>Mobile (9:16)</span>
              </button>
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
                justifyContent: 'center'
              }}
              title="Close Editor"
            >
              <X style={{ width: '18px', height: '18px' }} />
            </button>
          </div>
        </div>

        {/* Framing Mode Banner */}
        <div 
          style={{
            padding: '10px 20px',
            backgroundColor: '#13131e',
            borderBottom: '1px solid #1f1f2e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: '#aaa', textTransform: 'uppercase', fontFamily: 'monospace' }}>
              Framing Style:
            </span>
            <button
              type="button"
              onClick={() => applyPreset('contain')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 12px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                border: fitMode === 'contain' ? '1px solid #ff6a13' : '1px solid #2b2b3d',
                backgroundColor: fitMode === 'contain' ? '#ff6a13' : '#191926',
                color: fitMode === 'contain' ? '#fff' : '#ccc'
              }}
            >
              <Minimize style={{ width: '12px', height: '12px' }} />
              <span>Fit 100% Full Photo (Zero Crop)</span>
            </button>

            <button
              type="button"
              onClick={() => applyPreset('cover')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 12px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                border: fitMode === 'cover' ? '1px solid #ff6a13' : '1px solid #2b2b3d',
                backgroundColor: fitMode === 'cover' ? '#ff6a13' : '#191926',
                color: fitMode === 'cover' ? '#fff' : '#ccc'
              }}
            >
              <Maximize style={{ width: '12px', height: '12px' }} />
              <span>Fill 16:9 Frame (Crop to Fit)</span>
            </button>
          </div>

          <div style={{ fontSize: '11px', color: '#ff6a13', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Sparkles style={{ width: '12px', height: '12px' }} />
            <span>{fitMode === 'contain' ? '100% Complete Photo is Visible (No heads or dresses cut off)' : 'Full-Bleed 16:9 Widescreen Crop'}</span>
          </div>
        </div>

        {/* Editor Main Canvas Body */}
        <div 
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#07070a'
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Viewport Frame with Aspect Ratio */}
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
            style={{
              width: previewMode === 'desktop' ? '100%' : '236px',
              maxWidth: previewMode === 'desktop' ? '880px' : '236px',
              height: previewMode === 'desktop' ? 'auto' : '418px',
              aspectRatio: previewMode === 'desktop' ? '16 / 9' : '9 / 16',
              maxHeight: previewMode === 'desktop' ? '52vh' : '418px',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '8px',
              border: '2px solid #ff6a13',
              boxShadow: '0 12px 35px rgba(0, 0, 0, 0.9)',
              cursor: isDragging ? 'grabbing' : 'grab',
              backgroundColor: '#050508',
              userSelect: 'none',
              touchAction: 'none'
            }}
          >
            {/* Ambient Blurred Background (Fills frame softly with matching colors so no harsh black cuts) */}
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
                  filter: 'blur(28px)',
                  opacity: 0.38,
                  transform: 'scale(1.15)',
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
                  transition: isDragging ? 'none' : 'transform 0.15s ease-out',
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

            {/* Subtle Gradient Overlays matching Hero.jsx */}
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 40%, rgba(0,0,0,0.3) 100%)',
                pointerEvents: 'none'
              }}
            />

            {/* Rule of Thirds Grid Guidelines */}
            {showGrid && (
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.35 }}>
                {/* Horizontal lines */}
                <div style={{ position: 'absolute', top: '33.33%', left: 0, right: 0, height: '1px', backgroundColor: '#fff', borderTop: '1px dashed rgba(255,255,255,0.7)' }} />
                <div style={{ position: 'absolute', top: '66.66%', left: 0, right: 0, height: '1px', backgroundColor: '#fff', borderTop: '1px dashed rgba(255,255,255,0.7)' }} />
                {/* Vertical lines */}
                <div style={{ position: 'absolute', left: '33.33%', top: 0, bottom: 0, width: '1px', backgroundColor: '#fff', borderLeft: '1px dashed rgba(255,255,255,0.7)' }} />
                <div style={{ position: 'absolute', left: '66.66%', top: 0, bottom: 0, width: '1px', backgroundColor: '#fff', borderLeft: '1px dashed rgba(255,255,255,0.7)' }} />
              </div>
            )}

            {/* Live Hero Typography Simulation Overlay */}
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
                <div style={{ fontSize: previewMode === 'desktop' ? '32px' : '22px', fontWeight: 300, letterSpacing: '0.15em', color: '#ffffff', fontFamily: 'serif', textTransform: 'uppercase' }}>
                  {heroTitle || 'CAPTURA LK'}
                </div>
                <div style={{ fontSize: previewMode === 'desktop' ? '9px' : '7px', letterSpacing: '0.22em', color: '#e0e0e0', marginTop: '6px', textTransform: 'uppercase', fontWeight: 400 }}>
                  {heroTagline || 'INSPIRED BY THE ELEGANCE OF SIMPLICITY'}
                </div>

                <div style={{ position: 'absolute', bottom: '12px', fontSize: '9px', color: '#ff6a13', backgroundColor: 'rgba(0,0,0,0.75)', padding: '2px 8px', borderRadius: '10px', border: '1px solid rgba(255,106,19,0.3)', letterSpacing: '0.05em' }}>
                  LIVE HERO SIMULATION
                </div>
              </div>
            )}

            {/* Drag helper hint */}
            <div 
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: 'rgba(0,0,0,0.65)',
                color: '#aaa',
                padding: '3px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Move style={{ width: '10px', height: '10px' }} />
              <span>Drag to Frame</span>
            </div>
          </div>

          {/* Quick Presets & Alignment Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ fontSize: '11px', color: '#777788', textTransform: 'uppercase', fontFamily: 'monospace' }}>Position:</span>
            <button
              type="button"
              onClick={() => applyPreset('top')}
              style={{ padding: '5px 11px', backgroundColor: '#161622', border: '1px solid #28283c', color: '#ccc', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
            >
              Focus Top (Faces)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('center')}
              style={{ padding: '5px 11px', backgroundColor: '#161622', border: '1px solid #28283c', color: '#ccc', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
            >
              Center
            </button>
            <button
              type="button"
              onClick={() => applyPreset('bottom')}
              style={{ padding: '5px 11px', backgroundColor: '#161622', border: '1px solid #28283c', color: '#ccc', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
            >
              Focus Bottom (Gown/Scenery)
            </button>
            <button
              type="button"
              onClick={handleRotate}
              style={{ padding: '5px 11px', backgroundColor: '#161622', border: '1px solid #28283c', color: '#ccc', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              title="Rotate 90 degrees"
            >
              <RotateCw style={{ width: '11px', height: '11px' }} />
              <span>Rotate</span>
            </button>
          </div>

          {/* Sliders Control Bar */}
          <div 
            style={{
              width: '100%',
              maxWidth: '880px',
              backgroundColor: '#101018',
              border: '1px solid #1c1c28',
              borderRadius: '8px',
              padding: '14px 18px',
              marginTop: '14px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px'
            }}
          >
            {/* Zoom Slider (0.4x to 3.5x allows zooming out completely to see whole photo) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
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
                  style={{ padding: '4px 8px', backgroundColor: '#1b1b26', border: '1px solid #2c2c3d', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}
                  title="Zoom Out"
                >
                  -
                </button>
                <input
                  type="range"
                  min="0.4"
                  max="3.0"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  style={{ flex: 1, accentColor: '#ff6a13' }}
                />
                <button
                  type="button"
                  onClick={() => applyPreset('zoomIn')}
                  style={{ padding: '4px 8px', backgroundColor: '#1b1b26', border: '1px solid #2c2c3d', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}
                  title="Zoom In"
                >
                  +
                </button>
              </div>
            </div>

            {/* Vertical Pan Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', color: '#aaa' }}>
                  Vertical Frame Position:
                </span>
                <span style={{ fontSize: '11px', color: '#aaa', fontFamily: 'monospace' }}>
                  {pan.y > 0 ? `+${Math.round(pan.y)}px` : `${Math.round(pan.y)}px`}
                </span>
              </div>
              <input
                type="range"
                min="-300"
                max="300"
                step="2"
                value={pan.y}
                onChange={(e) => setPan((prev) => ({ ...prev, y: parseInt(e.target.value) }))}
                style={{ width: '100%', accentColor: '#ff6a13' }}
              />
            </div>

            {/* Horizontal Pan Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', color: '#aaa' }}>
                  Horizontal Frame Position:
                </span>
                <span style={{ fontSize: '11px', color: '#aaa', fontFamily: 'monospace' }}>
                  {pan.x > 0 ? `+${Math.round(pan.x)}px` : `${Math.round(pan.x)}px`}
                </span>
              </div>
              <input
                type="range"
                min="-300"
                max="300"
                step="2"
                value={pan.x}
                onChange={(e) => setPan((prev) => ({ ...prev, x: parseInt(e.target.value) }))}
                style={{ width: '100%', accentColor: '#ff6a13' }}
              />
            </div>
          </div>

          {/* Toggles Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#888899', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showOverlayText}
                onChange={(e) => setShowOverlayText(e.target.checked)}
                style={{ accentColor: '#ff6a13' }}
              />
              <span>Show Hero Title Text Overlay</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#888899', cursor: 'pointer' }}>
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
              <span>Reset All Adjustments</span>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div 
          style={{
            padding: '14px 20px',
            borderTop: '1px solid #1c1c28',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#101018',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ fontSize: '11px', color: '#777788' }}>
            {imageDimensions.width ? `Source Image: ${imageDimensions.width} × ${imageDimensions.height}px` : 'Loading image...'}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '9px 18px',
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
                padding: '9px 24px',
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
              <span>{isProcessing ? 'Saving to Hero...' : 'Apply & Save to Hero'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
