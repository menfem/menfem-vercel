// ABOUTME: Mobile optimization utilities for responsive design and touch interactions
// ABOUTME: Provides helpers for mobile-first design patterns and performance

export const MOBILE_BREAKPOINTS = {
  xs: '320px',
  sm: '640px', 
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const;

export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
};

export const isTablet = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 768 && window.innerWidth < 1024;
};

export const isDesktop = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 1024;
};

export const isTouchDevice = () => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Mobile-optimized component props
export const getMobileProps = (baseProps: Record<string, any>) => {
  if (typeof window === 'undefined') return baseProps;
  
  if (isMobile()) {
    return {
      ...baseProps,
      // Optimize for mobile
      className: `${baseProps.className || ''} touch-manipulation`,
      style: {
        ...baseProps.style,
        WebkitTapHighlightColor: 'transparent',
      }
    };
  }
  
  return baseProps;
};

// Responsive grid utilities
export const getResponsiveGridCols = (mobile: number, tablet: number, desktop: number) => {
  return `grid-cols-${mobile} md:grid-cols-${tablet} lg:grid-cols-${desktop}`;
};

// Touch-friendly button sizing
export const getTouchFriendlySize = (baseSize: 'sm' | 'md' | 'lg') => {
  if (!isTouchDevice()) return baseSize;
  
  // Ensure minimum 44px touch target for mobile
  switch (baseSize) {
    case 'sm': return 'md';
    case 'md': return 'lg';
    case 'lg': return 'lg';
    default: return 'md';
  }
};

// Mobile-first animation preferences
export const respectsReducedMotion = () => {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Optimized loading for mobile
export const getMobileImageProps = (src: string, alt: string) => {
  return {
    src,
    alt,
    loading: 'lazy' as const,
    decoding: 'async' as const,
    // Add mobile-optimized sizes
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  };
};

// Mobile-friendly modal/dialog positioning
export const getMobileModalProps = () => {
  if (!isMobile()) return {};
  
  return {
    className: 'sm:max-w-lg max-w-full mx-4',
    style: {
      maxHeight: '90vh',
      overflowY: 'auto' as const,
    }
  };
};

// Responsive text sizing
export const getResponsiveTextSize = (base: string) => {
  // Automatically scale down text on mobile
  const sizeMap: Record<string, string> = {
    'text-6xl': 'text-4xl sm:text-6xl',
    'text-5xl': 'text-3xl sm:text-5xl',
    'text-4xl': 'text-2xl sm:text-4xl',
    'text-3xl': 'text-xl sm:text-3xl',
    'text-2xl': 'text-lg sm:text-2xl',
    'text-xl': 'text-lg sm:text-xl',
  };
  
  return sizeMap[base] || base;
};

// Mobile-optimized spacing
export const getResponsiveSpacing = (base: string) => {
  const spacingMap: Record<string, string> = {
    'p-8': 'p-4 sm:p-8',
    'p-6': 'p-4 sm:p-6',
    'px-8': 'px-4 sm:px-8',
    'py-8': 'py-4 sm:py-8',
    'gap-8': 'gap-4 sm:gap-8',
    'gap-6': 'gap-4 sm:gap-6',
    'space-y-8': 'space-y-4 sm:space-y-8',
    'space-y-6': 'space-y-4 sm:space-y-6',
  };
  
  return spacingMap[base] || base;
};

// Video player mobile optimizations
export const getMobileVideoProps = () => {
  return {
    controls: true,
    playsInline: true, // Prevents fullscreen on iOS
    preload: isMobile() ? 'none' : 'metadata', // Save bandwidth on mobile
  };
};

// Form optimizations for mobile
export const getMobileFormProps = () => {
  return {
    autoComplete: 'on',
    spellCheck: false,
    autoCorrect: 'off' as const,
    autoCapitalize: 'off' as const,
  };
};

// Course player mobile optimizations
export const getCoursePlayerMobileLayout = () => {
  if (!isMobile()) {
    return {
      navigationWidth: 'w-80',
      contentLayout: 'flex-row',
      showSidebar: true,
    };
  }
  
  return {
    navigationWidth: 'w-full',
    contentLayout: 'flex-col',
    showSidebar: false, // Hide by default on mobile
  };
};