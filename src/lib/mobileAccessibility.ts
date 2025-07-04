/**
 * Mobile Accessibility Utilities
 * 
 * Tools and utilities for enhanced mobile accessibility experience
 */

/**
 * Touch target size constants following WCAG 2.1 AA guidelines
 */
export const TOUCH_TARGET_SIZE = {
  MINIMUM: 44, // pixels - WCAG 2.1 AA minimum
  RECOMMENDED: 48, // pixels - better UX
  SPACING: 8 // pixels - minimum spacing between targets
};

/**
 * Check if current device is likely a touch device
 */
export const isTouchDevice = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * Check if current viewport is mobile-sized
 */
export const isMobileViewport = (): boolean => {
  return window.innerWidth < 768; // Using Tailwind's md breakpoint
};

/**
 * Enhanced focus management for mobile devices
 */
export const manageMobileFocus = () => {
  // Prevent zoom on input focus for mobile
  const preventZoom = (e: FocusEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport && isMobileViewport()) {
        // Temporarily disable zoom
        const originalContent = viewport.getAttribute('content');
        viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
        
        // Restore original viewport after focus
        const restoreViewport = () => {
          if (originalContent) {
            viewport.setAttribute('content', originalContent);
          }
          target.removeEventListener('blur', restoreViewport);
        };
        
        target.addEventListener('blur', restoreViewport);
      }
    }
  };

  // Add focus event listeners
  document.addEventListener('focusin', preventZoom);
  
  // Cleanup function
  return () => {
    document.removeEventListener('focusin', preventZoom);
  };
};

/**
 * Touch target size validator
 */
export const validateTouchTarget = (element: HTMLElement): {
  isValid: boolean;
  actualSize: { width: number; height: number };
  recommendations: string[];
} => {
  const rect = element.getBoundingClientRect();
  const recommendations: string[] = [];
  
  const isWidthValid = rect.width >= TOUCH_TARGET_SIZE.MINIMUM;
  const isHeightValid = rect.height >= TOUCH_TARGET_SIZE.MINIMUM;
  
  if (!isWidthValid) {
    recommendations.push(`Increase width to at least ${TOUCH_TARGET_SIZE.MINIMUM}px (current: ${Math.round(rect.width)}px)`);
  }
  
  if (!isHeightValid) {
    recommendations.push(`Increase height to at least ${TOUCH_TARGET_SIZE.MINIMUM}px (current: ${Math.round(rect.height)}px)`);
  }
  
  return {
    isValid: isWidthValid && isHeightValid,
    actualSize: { width: rect.width, height: rect.height },
    recommendations
  };
};

/**
 * Scan page for touch target compliance
 */
export const auditTouchTargets = (): {
  total: number;
  compliant: number;
  issues: Array<{
    element: HTMLElement;
    tagName: string;
    text: string;
    issues: string[];
  }>;
} => {
  const interactiveElements = document.querySelectorAll(
    'button, [role="button"], a, input[type="button"], input[type="submit"], input[type="checkbox"], input[type="radio"]'
  );
  
  const issues: Array<{
    element: HTMLElement;
    tagName: string;
    text: string;
    issues: string[];
  }> = [];
  
  let compliant = 0;
  
  interactiveElements.forEach(el => {
    const element = el as HTMLElement;
    const validation = validateTouchTarget(element);
    
    if (validation.isValid) {
      compliant++;
    } else {
      issues.push({
        element,
        tagName: element.tagName,
        text: element.textContent?.trim() || element.getAttribute('aria-label') || 'No text',
        issues: validation.recommendations
      });
    }
  });
  
  return {
    total: interactiveElements.length,
    compliant,
    issues
  };
};

/**
 * Mobile-friendly CSS classes for touch targets
 */
export const MOBILE_TOUCH_CLASSES = {
  // Minimum touch target size
  minTouch: 'min-h-[44px] min-w-[44px]',
  
  // Recommended touch target size
  recommendedTouch: 'min-h-[48px] min-w-[48px]',
  
  // Touch spacing
  touchSpacing: 'p-2 m-1',
  
  // Focus indicators for mobile
  mobileFocus: 'focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none',
  
  // Mobile-optimized buttons
  mobileButton: 'min-h-[48px] px-4 py-3 text-base font-medium rounded-lg',
  
  // Mobile-optimized form fields
  mobileInput: 'min-h-[48px] px-4 py-3 text-base rounded-lg',
};

/**
 * Apply mobile accessibility enhancements to an element
 */
export const enhanceForMobile = (element: HTMLElement, options: {
  touchTarget?: boolean;
  focusIndicator?: boolean;
  preventZoom?: boolean;
} = {}) => {
  const { touchTarget = true, focusIndicator = true, preventZoom = false } = options;
  
  if (touchTarget) {
    // Ensure minimum touch target size
    const validation = validateTouchTarget(element);
    if (!validation.isValid) {
      element.style.minWidth = `${TOUCH_TARGET_SIZE.MINIMUM}px`;
      element.style.minHeight = `${TOUCH_TARGET_SIZE.MINIMUM}px`;
      element.style.padding = '8px';
    }
  }
  
  if (focusIndicator) {
    // Enhanced focus indicators for mobile
    element.classList.add('focus:ring-2', 'focus:ring-primary', 'focus:ring-offset-2', 'focus:outline-none');
  }
  
  if (preventZoom && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA')) {
    // Prevent zoom on focus for form fields
    element.addEventListener('focus', () => {
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport && isMobileViewport()) {
        const originalContent = viewport.getAttribute('content');
        viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
        
        element.addEventListener('blur', () => {
          if (originalContent) {
            viewport.setAttribute('content', originalContent);
          }
        }, { once: true });
      }
    });
  }
};

/**
 * Mobile screen reader optimizations
 */
export const optimizeForMobileScreenReaders = () => {
  // Reduce verbosity on mobile screen readers
  if (isMobileViewport() && isTouchDevice()) {
    // Add mobile-specific ARIA optimizations
    const decorativeImages = document.querySelectorAll('img[aria-hidden="true"]');
    decorativeImages.forEach(img => {
      // Ensure decorative images are truly hidden on mobile
      img.setAttribute('role', 'presentation');
    });
    
    // Optimize navigation for mobile screen readers
    const nav = document.querySelector('nav');
    if (nav) {
      nav.setAttribute('aria-label', 'Main navigation - swipe to explore options');
    }
  }
};

/**
 * Generate mobile accessibility report
 */
export const generateMobileA11yReport = (): {
  touchTargets: ReturnType<typeof auditTouchTargets>;
  viewport: {
    isMobile: boolean;
    width: number;
    height: number;
  };
  device: {
    isTouch: boolean;
    userAgent: string;
  };
  recommendations: string[];
} => {
  const touchTargets = auditTouchTargets();
  const viewport = {
    isMobile: isMobileViewport(),
    width: window.innerWidth,
    height: window.innerHeight
  };
  
  const device = {
    isTouch: isTouchDevice(),
    userAgent: navigator.userAgent
  };
  
  const recommendations: string[] = [];
  
  if (touchTargets.issues.length > 0) {
    recommendations.push(`Fix ${touchTargets.issues.length} touch target size issues`);
  }
  
  if (viewport.isMobile && !device.isTouch) {
    recommendations.push('Consider touch-friendly interactions even on non-touch mobile devices');
  }
  
  if (viewport.width < 320) {
    recommendations.push('Viewport is very narrow - ensure content is accessible');
  }
  
  return {
    touchTargets,
    viewport,
    device,
    recommendations
  };
};

/**
 * Auto-enhance page for mobile accessibility
 */
export const autoEnhanceMobileAccessibility = () => {
  if (isMobileViewport() || isTouchDevice()) {
    // Auto-enhance all interactive elements
    const interactiveElements = document.querySelectorAll(
      'button, [role="button"], a, input[type="button"], input[type="submit"]'
    );
    
    interactiveElements.forEach(el => {
      enhanceForMobile(el as HTMLElement);
    });
    
    // Optimize for mobile screen readers
    optimizeForMobileScreenReaders();
    
    // Set up mobile focus management
    manageMobileFocus();
    
    console.log('🔧 Mobile accessibility enhancements applied');
  }
}; 