/**
 * Accessibility Utilities
 * 
 * Common accessibility patterns and helper functions for WCAG 2.1 AA compliance
 */

/**
 * Handles keyboard events for custom interactive elements
 * Responds to Enter and Space key presses
 * 
 * @param callback - Function to call when Enter or Space is pressed
 * @returns Keyboard event handler
 */
export const handleKeyboardActivation = (callback: () => void) => {
  return (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback();
    }
  };
};

/**
 * Generates comprehensive status descriptions for screen readers
 * 
 * @param status - The status value
 * @returns Descriptive ARIA label for the status
 */
export const getStatusAriaLabel = (status: string): string => {
  const statusDescriptions: Record<string, string> = {
    'pending': 'Pending - Your request is waiting to be processed by our team',
    'in-progress': 'In Progress - Your request is currently being reviewed and processed',
    'completed': 'Completed - Your request has been successfully fulfilled',
    'cancelled': 'Cancelled - This request has been cancelled',
    'rejected': 'Rejected - This request could not be fulfilled',
    'on-hold': 'On Hold - This request is temporarily paused'
  };

  return `Request status: ${statusDescriptions[status] || status.charAt(0).toUpperCase() + status.slice(1)}`;
};

/**
 * Focus management utilities
 */
export const focusUtils = {
  /**
   * Sets focus to the first focusable element within a container
   * 
   * @param container - The container element
   */
  focusFirstElement: (container: HTMLElement) => {
    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const firstFocusable = container.querySelector(focusableSelector) as HTMLElement;
    if (firstFocusable) {
      firstFocusable.focus();
    }
  },

  /**
   * Traps focus within a container (for modals)
   * 
   * @param container - The container element
   * @param event - The keyboard event
   */
  trapFocus: (container: HTMLElement, event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;

    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableElements = Array.from(container.querySelectorAll(focusableSelector)) as HTMLElement[];
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  },

  /**
   * Restores focus to a previously focused element
   * 
   * @param element - The element to restore focus to
   */
  restoreFocus: (element: HTMLElement | null) => {
    if (element && element.focus) {
      element.focus();
    }
  }
};

/**
 * ARIA label generators for common UI patterns
 */
export const ariaLabels = {
  /**
   * Generates ARIA label for buttons with loading states
   * 
   * @param text - Button text
   * @param isLoading - Whether the button is in loading state
   * @returns Descriptive ARIA label
   */
  loadingButton: (text: string, isLoading: boolean): string => {
    return isLoading ? `${text} - Loading, please wait` : text;
  },

  /**
   * Generates ARIA label for form fields with validation
   * 
   * @param label - Field label
   * @param isRequired - Whether the field is required
   * @param hasError - Whether the field has an error
   * @returns Descriptive ARIA label
   */
  formField: (label: string, isRequired: boolean = false, hasError: boolean = false): string => {
    let ariaLabel = label;
    if (isRequired) ariaLabel += ', required';
    if (hasError) ariaLabel += ', has error';
    return ariaLabel;
  },

  /**
   * Generates ARIA label for navigation links
   * 
   * @param text - Link text
   * @param isCurrent - Whether this is the current page
   * @returns Descriptive ARIA label
   */
  navigationLink: (text: string, isCurrent: boolean = false): string => {
    return isCurrent ? `${text}, current page` : `Go to ${text}`;
  }
};

/**
 * Color contrast utilities
 */
export const contrastUtils = {
  /**
   * Gets high contrast focus ring classes for TailwindCSS
   * 
   * @param color - The primary color (defaults to 'primary')
   * @returns TailwindCSS classes for focus ring
   */
  getFocusRingClasses: (color: string = 'primary'): string => {
    return `focus:outline-none focus:ring-2 focus:ring-${color} focus:ring-offset-2`;
  },

  /**
   * Gets high contrast text classes based on background
   * 
   * @param isDark - Whether the background is dark
   * @returns TailwindCSS classes for text contrast
   */
  getTextContrastClasses: (isDark: boolean): string => {
    return isDark ? 'text-white' : 'text-gray-900';
  }
};

/**
 * Screen reader text utilities
 */
export const screenReaderUtils = {
  /**
   * Gets the CSS classes for visually hidden text
   * 
   * @returns CSS classes for screen reader only text
   */
  getHiddenTextClasses: (): string => 'sr-only',

  /**
   * Formats currency for screen readers
   * 
   * @param amount - The currency amount
   * @param currency - The currency symbol or code
   * @returns Object with display and screen reader versions
   */
  formatCurrency: (amount: number, currency: string = '₹') => ({
    display: `${currency}${amount}`,
    screenReader: `${amount} ${currency === '₹' ? 'rupees' : currency}`
  })
};

/**
 * Validation for WCAG compliance
 */
export const wcagValidation = {
  /**
   * Validates if text has sufficient contrast
   * This is a helper - actual testing should use tools like axe-core
   * 
   * @param foreground - Foreground color
   * @param background - Background color
   * @returns Whether contrast is likely sufficient
   */
  hasValidContrast: (foreground: string, background: string): boolean => {
    // This is a placeholder - in practice, use a proper contrast calculation library
    // or automated testing tools like axe-core
    console.warn('Use proper contrast testing tools like axe-core for production validation');
    return true;
  },

  /**
   * Validates if an element has proper accessibility attributes
   * 
   * @param element - The element to validate
   * @returns Validation results
   */
  validateElement: (element: HTMLElement) => {
    const issues: string[] = [];
    
    // Check for missing alt text on images
    if (element.tagName === 'IMG' && !element.getAttribute('alt')) {
      issues.push('Image missing alt text');
    }
    
    // Check for interactive elements without proper roles
    if (element.onclick && !['BUTTON', 'A'].includes(element.tagName) && !element.getAttribute('role')) {
      issues.push('Interactive element missing role attribute');
    }
    
    // Check for missing labels on form inputs
    if (['INPUT', 'SELECT', 'TEXTAREA'].includes(element.tagName)) {
      const hasLabel = element.getAttribute('aria-label') || 
                      element.getAttribute('aria-labelledby') || 
                      document.querySelector(`label[for="${element.id}"]`);
      if (!hasLabel) {
        issues.push('Form element missing label');
      }
    }
    
    return {
      isValid: issues.length === 0,
      issues
    };
  }
};

/**
 * Common accessibility constants
 */
export const A11Y_CONSTANTS = {
  // Minimum time for screen reader announcements
  ANNOUNCEMENT_TIMEOUT: 1000,
  URGENT_ANNOUNCEMENT_TIMEOUT: 2000,
  
  // Common ARIA roles
  ROLES: {
    BUTTON: 'button',
    LINK: 'link',
    HEADING: 'heading',
    STATUS: 'status',
    ALERT: 'alert',
    MAIN: 'main',
    NAVIGATION: 'navigation',
    BANNER: 'banner',
    CONTENTINFO: 'contentinfo'
  },
  
  // Common ARIA properties
  ARIA: {
    HIDDEN: 'aria-hidden',
    LABEL: 'aria-label',
    LABELLEDBY: 'aria-labelledby',
    DESCRIBEDBY: 'aria-describedby',
    EXPANDED: 'aria-expanded',
    LIVE: 'aria-live',
    REQUIRED: 'aria-required',
    INVALID: 'aria-invalid'
  }
} as const; 