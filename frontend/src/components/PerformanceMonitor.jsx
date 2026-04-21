import { useEffect } from 'react';

/**
 * Performance monitoring component
 * Tracks Web Vitals and reports performance metrics
 */
const PerformanceMonitor = () => {
  useEffect(() => {
    // Only run in production
    if (import.meta.env.DEV) return;

    // Track Web Vitals
    const trackWebVitals = () => {
      if ('PerformanceObserver' in window) {
        try {
          // Largest Contentful Paint (LCP)
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            const lcp = lastEntry.renderTime || lastEntry.loadTime;
            
            // Log or send to analytics
            if (lcp > 2500) {
              console.warn('[Performance] LCP is slow:', lcp.toFixed(2), 'ms');
            }
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

          // First Input Delay (FID)
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              const fid = entry.processingStart - entry.startTime;
              if (fid > 100) {
                console.warn('[Performance] FID is slow:', fid.toFixed(2), 'ms');
              }
            });
          });
          fidObserver.observe({ entryTypes: ['first-input'] });

          // Cumulative Layout Shift (CLS)
          let clsScore = 0;
          const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!entry.hadRecentInput) {
                clsScore += entry.value;
                if (clsScore > 0.1) {
                  console.warn('[Performance] CLS is high:', clsScore.toFixed(4));
                }
              }
            }
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch {
          // Silently fail if PerformanceObserver is not supported
        }
      }
    };

    // Track page load performance
    const trackPageLoad = () => {
      if ('performance' in window && 'timing' in performance) {
        window.addEventListener('load', () => {
          setTimeout(() => {
            const timing = performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
            
            console.log('[Performance] Page Load:', loadTime, 'ms');
            console.log('[Performance] DOM Ready:', domReady, 'ms');
            
            // Warn if page load is slow
            if (loadTime > 3000) {
              console.warn('[Performance] Page load is slow');
            }
          }, 0);
        });
      }
    };

    // Track resource loading
    const trackResources = () => {
      if ('performance' in window && 'getEntriesByType' in performance) {
        window.addEventListener('load', () => {
          setTimeout(() => {
            const resources = performance.getEntriesByType('resource');
            const slowResources = resources.filter(r => r.duration > 1000);
            
            if (slowResources.length > 0) {
              console.warn('[Performance] Slow resources:', slowResources.map(r => ({
                name: r.name,
                duration: r.duration.toFixed(2) + 'ms'
              })));
            }
          }, 0);
        });
      }
    };

    // Initialize tracking
    trackWebVitals();
    trackPageLoad();
    trackResources();

    // Cleanup
    return () => {
      // PerformanceObserver cleanup is automatic
    };
  }, []);

  // This component doesn't render anything
  return null;
};

export default PerformanceMonitor;
