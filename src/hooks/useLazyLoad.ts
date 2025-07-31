import { useState, useEffect, useRef, useCallback } from 'react';

interface LazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
  root?: Element | null;
}

export const useLazyLoad = (options: LazyLoadOptions = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  const {
    threshold = 0.1,
    rootMargin = '50px',
    root = null,
  } = options;

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
      setIsVisible(true);
      setHasLoaded(true);
    }
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
      root,
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [handleIntersection, threshold, rootMargin, root]);

  return {
    elementRef,
    isVisible,
    hasLoaded,
  };
};

// Hook for lazy loading images
export const useLazyImage = (src: string, options: LazyLoadOptions = {}) => {
  const { elementRef, isVisible } = useLazyLoad(options);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isVisible && src && !imageSrc) {
      setIsLoading(true);
      setError(null);

      const img = new Image();
      img.onload = () => {
        setImageSrc(src);
        setIsLoading(false);
      };
      img.onerror = () => {
        setError('Failed to load image');
        setIsLoading(false);
      };
      img.src = src;
    }
  }, [isVisible, src, imageSrc]);

  return {
    elementRef,
    imageSrc,
    isLoading,
    error,
    isVisible,
  };
}; 