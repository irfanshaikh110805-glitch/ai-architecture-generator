/**
 * Accessibility Utilities
 * Helper functions for improved accessibility
 */

/**
 * Announce message to screen readers
 * @param {string} message - Message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
export const announceToScreenReader = (message, priority = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Trap focus within a modal or dialog
 * @param {HTMLElement} element - Container element
 */
export const trapFocus = (element) => {
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  const handleTabKey = (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
    
    if (e.key === 'Escape') {
      element.dispatchEvent(new CustomEvent('close'));
    }
  };
  
  element.addEventListener('keydown', handleTabKey);
  firstElement?.focus();
  
  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
};

/**
 * Generate unique ID for accessibility
 * @param {string} prefix - Prefix for the ID
 * @returns {string} Unique ID
 */
export const generateA11yId = (prefix = 'a11y') => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Check if user prefers reduced motion
 * @returns {boolean} True if reduced motion is preferred
 */
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get appropriate animation duration based on user preference
 * @param {number} defaultDuration - Default duration in ms
 * @returns {number} Duration in ms
 */
export const getAnimationDuration = (defaultDuration = 300) => {
  return prefersReducedMotion() ? 0 : defaultDuration;
};

/**
 * Manage focus when navigating programmatically
 * @param {string} elementId - ID of element to focus
 * @param {boolean} scrollIntoView - Whether to scroll into view
 */
export const manageFocus = (elementId, scrollIntoView = true) => {
  const element = document.getElementById(elementId);
  if (element) {
    // Make element focusable if not already
    if (!element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '-1');
    }
    element.focus();
    
    if (scrollIntoView) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
};

/**
 * Create skip link for keyboard navigation
 * @param {string} targetId - ID of main content
 * @param {string} label - Label for skip link
 */
export const createSkipLink = (targetId = 'main-content', label = 'Skip to main content') => {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg';
  skipLink.textContent = label;
  
  skipLink.addEventListener('click', (e) => {
    e.preventDefault();
    manageFocus(targetId);
  });
  
  document.body.insertBefore(skipLink, document.body.firstChild);
};

/**
 * Add ARIA live region for dynamic content
 * @param {string} id - ID for the live region
 * @param {string} priority - 'polite' or 'assertive'
 * @returns {HTMLElement} Live region element
 */
export const createLiveRegion = (id = 'live-region', priority = 'polite') => {
  let liveRegion = document.getElementById(id);
  
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = id;
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);
  }
  
  return liveRegion;
};

/**
 * Update live region with new message
 * @param {string} message - Message to announce
 * @param {string} regionId - ID of live region
 */
export const updateLiveRegion = (message, regionId = 'live-region') => {
  const liveRegion = document.getElementById(regionId) || createLiveRegion(regionId);
  liveRegion.textContent = message;
};

/**
 * Check color contrast ratio
 * @param {string} foreground - Foreground color (hex)
 * @param {string} background - Background color (hex)
 * @returns {number} Contrast ratio
 */
export const getContrastRatio = (foreground, background) => {
  const getLuminance = (hex) => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };
  
  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};

/**
 * Keyboard navigation helper
 * @param {KeyboardEvent} event - Keyboard event
 * @param {Object} handlers - Handler functions for each key
 */
export const handleKeyboardNav = (event, handlers = {}) => {
  const { key } = event;
  const handler = handlers[key] || handlers[key.toLowerCase()];
  
  if (handler) {
    event.preventDefault();
    handler(event);
  }
};

export default {
  announceToScreenReader,
  trapFocus,
  generateA11yId,
  prefersReducedMotion,
  getAnimationDuration,
  manageFocus,
  createSkipLink,
  createLiveRegion,
  updateLiveRegion,
  getContrastRatio,
  handleKeyboardNav,
};
