// ABOUTME: Performance optimization utilities for the MenFem platform
// ABOUTME: Provides caching, lazy loading, and performance monitoring helpers

import { cache } from 'react';

// Image optimization helpers
export const getOptimizedImageProps = (
  src: string,
  alt: string,
  width?: number,
  height?: number
) => {
  return {
    src,
    alt,
    width,
    height,
    loading: 'lazy' as const,
    decoding: 'async' as const,
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    style: {
      maxWidth: '100%',
      height: 'auto',
    }
  };
};

// Debounced search helper
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);
  
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

// Memoized data fetchers
export const getCachedCourses = cache(async (filters?: any) => {
  // This would integrate with your actual data fetching
  const searchParams = new URLSearchParams(filters);
  const cacheKey = `courses-${searchParams.toString()}`;
  
  // Implementation would go here
  return [];
});

export const getCachedProducts = cache(async (filters?: any) => {
  const searchParams = new URLSearchParams(filters);
  const cacheKey = `products-${searchParams.toString()}`;
  
  return [];
});

// Lazy loading utilities
export const createLazyComponent = <T extends Record<string, any>>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>
) => {
  return React.lazy(importFn);
};

// Performance monitoring
export class PerformanceMonitor {
  private metrics: Map<string, number> = new Map();
  
  start(key: string) {
    this.metrics.set(key, performance.now());
  }
  
  end(key: string): number {
    const startTime = this.metrics.get(key);
    if (!startTime) return 0;
    
    const duration = performance.now() - startTime;
    this.metrics.delete(key);
    
    // Log performance metrics in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`⚡ Performance: ${key} took ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }
  
  measure<T>(key: string, fn: () => T): T {
    this.start(key);
    const result = fn();
    this.end(key);
    return result;
  }
  
  async measureAsync<T>(key: string, fn: () => Promise<T>): Promise<T> {
    this.start(key);
    const result = await fn();
    this.end(key);
    return result;
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Batch processing for analytics events
export class EventBatcher {
  private events: any[] = [];
  private batchSize = 10;
  private flushInterval = 5000; // 5 seconds
  private timeoutId: NodeJS.Timeout | null = null;
  
  add(event: any) {
    this.events.push({
      ...event,
      timestamp: Date.now(),
    });
    
    if (this.events.length >= this.batchSize) {
      this.flush();
    } else if (!this.timeoutId) {
      this.timeoutId = setTimeout(() => this.flush(), this.flushInterval);
    }
  }
  
  private async flush() {
    if (this.events.length === 0) return;
    
    const eventsToSend = [...this.events];
    this.events = [];
    
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    
    try {
      await fetch('/api/analytics/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: eventsToSend }),
      });
    } catch (error) {
      console.error('Failed to send analytics batch:', error);
      // Re-add events for retry
      this.events.unshift(...eventsToSend);
    }
  }
}

export const eventBatcher = new EventBatcher();

// Resource preloading helpers
export const preloadResource = (href: string, as: string) => {
  if (typeof document === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
};

export const preloadImage = (src: string) => {
  if (typeof document === 'undefined') return;
  
  const img = new Image();
  img.src = src;
};

// Memory optimization for large lists
export const useVirtualization = (
  items: any[],
  itemHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = React.useState(0);
  
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );
  
  const visibleItems = items.slice(visibleStart, visibleEnd);
  const offsetY = visibleStart * itemHeight;
  const totalHeight = items.length * itemHeight;
  
  return {
    visibleItems,
    offsetY,
    totalHeight,
    setScrollTop,
  };
};

// Bundle size optimization helpers
export const loadScriptAsync = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// Critical CSS inlining (for SSR)
export const getCriticalCSS = (route: string) => {
  // This would be populated during build time
  const criticalStyles = {
    '/': 'body{font-family:system-ui}',
    '/pricing': '.pricing-grid{display:grid}',
    '/courses': '.course-grid{display:grid}',
  };
  
  return criticalStyles[route as keyof typeof criticalStyles] || '';
};

// Service worker registration
export const registerServiceWorker = () => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }
  
  navigator.serviceWorker.register('/sw.js')
    .then((registration) => {
      console.log('SW registered: ', registration);
    })
    .catch((registrationError) => {
      console.log('SW registration failed: ', registrationError);
    });
};

// Web vitals tracking
export const trackWebVitals = (metric: any) => {
  if (process.env.NODE_ENV === 'production') {
    // Send to analytics
    eventBatcher.add({
      type: 'web_vital',
      name: metric.name,
      value: metric.value,
      id: metric.id,
    });
  }
};