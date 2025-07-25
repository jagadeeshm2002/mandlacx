"use client";

import { useEffect, useState, useCallback } from 'react';

export interface ScrollAnimationState {
  scrollY: number;
  scrollProgress: number;
  isScrolling: boolean;
  direction: 'up' | 'down';
}

export function useScrollAnimation() {
  const [scrollState, setScrollState] = useState<ScrollAnimationState>({
    scrollY: 0,
    scrollProgress: 0,
    isScrolling: false,
    direction: 'down'
  });

  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = Math.min(currentScrollY / documentHeight, 1);
    
    const direction = currentScrollY > lastScrollY ? 'down' : 'up';
    
    setScrollState({
      scrollY: currentScrollY,
      scrollProgress,
      isScrolling: true,
      direction
    });

    setLastScrollY(currentScrollY);

    // Clear existing timeout
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    // Set new timeout to detect when scrolling stops
    const newTimeout = setTimeout(() => {
      setScrollState(prev => ({
        ...prev,
        isScrolling: false
      }));
    }, 150);

    setScrollTimeout(newTimeout);
  }, [lastScrollY, scrollTimeout]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [handleScroll, scrollTimeout]);

  return scrollState;
}

export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px',
        ...options
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, hasIntersected, options]);

  return { isIntersecting, hasIntersected };
}
