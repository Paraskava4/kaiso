/**
 * Performance monitoring utilities
 * 
 * This module provides utilities for monitoring and optimizing
 * web performance metrics, especially for static export builds.
 */

// Web Vitals monitoring
export const reportWebVitals = (metric) => {
  // Only report in production
  if (process.env.NODE_ENV !== 'production') return;

  // Send to analytics service
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }

  // Log to console in development
  console.log('Web Vital:', metric);
};

// Resource timing analysis
export const analyzeResourceTiming = () => {
  if (typeof window === 'undefined') return;

  const resources = performance.getEntriesByType('resource');
  const slowResources = resources.filter(resource => resource.duration > 1000);

  if (slowResources.length > 0) {
    console.warn('Slow resources detected:', slowResources.map(r => ({
      name: r.name,
      duration: r.duration,
      size: r.transferSize
    })));
  }
};

// Bundle size monitoring
export const monitorBundleSize = () => {
  if (typeof window === 'undefined') return;

  const scripts = document.querySelectorAll('script[src]');
  let totalSize = 0;

  scripts.forEach(script => {
    const src = script.src;
    if (src.includes('_next/static')) {
      // This is a Next.js chunk
      fetch(src, { method: 'HEAD' })
        .then(response => {
          const size = response.headers.get('content-length');
          if (size) {
            totalSize += parseInt(size);
            console.log(`Chunk ${src}: ${(parseInt(size) / 1024).toFixed(2)}KB`);
          }
        })
        .catch(() => {
          // Ignore CORS errors
        });
    }
  });

  setTimeout(() => {
    console.log(`Total bundle size: ${(totalSize / 1024).toFixed(2)}KB`);
  }, 1000);
};

// Lazy loading performance
export const trackLazyLoading = (componentName) => {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    
    console.log(`${componentName} loaded in ${loadTime.toFixed(2)}ms`);
    
    // Report to analytics if available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'component_load', {
        event_category: 'Performance',
        event_label: componentName,
        value: Math.round(loadTime),
      });
    }
  };
};

// Memory usage monitoring
export const monitorMemoryUsage = () => {
  if (typeof window === 'undefined' || !performance.memory) return;

  const memory = performance.memory;
  const usage = {
    used: (memory.usedJSHeapSize / 1024 / 1024).toFixed(2) + 'MB',
    total: (memory.totalJSHeapSize / 1024 / 1024).toFixed(2) + 'MB',
    limit: (memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2) + 'MB'
  };

  console.log('Memory usage:', usage);
  
  // Warn if memory usage is high
  if (memory.usedJSHeapSize / memory.jsHeapSizeLimit > 0.8) {
    console.warn('High memory usage detected:', usage);
  }
};

// Initialize performance monitoring
export const initPerformanceMonitoring = () => {
  if (typeof window === 'undefined') return;

  // Monitor resource timing after page load
  window.addEventListener('load', () => {
    setTimeout(analyzeResourceTiming, 1000);
    setTimeout(monitorBundleSize, 2000);
    setTimeout(monitorMemoryUsage, 3000);
  });

  // Monitor memory usage periodically
  setInterval(monitorMemoryUsage, 30000); // Every 30 seconds
};
