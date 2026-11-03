import React, { useEffect, useRef, useState } from 'react';

/**
 * RevealOnScroll
 * Smooth, hardware-accelerated luxury reveal animation triggered on scroll.
 */
export default function RevealOnScroll({ 
  children, 
  className = '', 
  delay = 0, 
  direction = 'up', // 'up' | 'down' | 'left' | 'right' | 'none'
  threshold = 0.12,
  duration = 850,
  once = false, // Set to false so it re-triggers every time scrolling up or down
  useBlur = true
}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        } else {
          if (!once) {
            setIsVisible(false);
          }
        }
      },
      {
        threshold: threshold,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    const currentEl = elementRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
    };
  }, [threshold, once]);

  const getTransform = () => {
    if (isVisible) return 'translate3d(0, 0, 0) scale(1)';
    switch (direction) {
      case 'up':
        return 'translate3d(0, 42px, 0) scale(0.97)';
      case 'down':
        return 'translate3d(0, -42px, 0) scale(0.97)';
      case 'left':
        return 'translate3d(42px, 0, 0) scale(0.97)';
      case 'right':
        return 'translate3d(-42px, 0, 0) scale(0.97)';
      default:
        return 'translate3d(0, 0, 0) scale(0.97)';
    }
  };

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        filter: useBlur ? (isVisible ? 'blur(0px)' : 'blur(4px)') : 'none',
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, filter ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: 'opacity, transform, filter',
      }}
    >
      {children}
    </div>
  );
}
