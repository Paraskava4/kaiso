/**
 * Performance Monitoring Utility
 * Tracks and optimizes page performance metrics
 */

import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.observers = new Map();
        this.isEnabled = process.env.NODE_ENV === 'production';
    }

    /**
     * Initialize performance monitoring
     */
    init() {
        if (!this.isEnabled) return;

        // Monitor Core Web Vitals
        this.monitorWebVitals();
        
        // Monitor custom metrics
        this.monitorCustomMetrics();
        
        // Monitor route changes
        this.monitorRouteChanges();
    }

    /**
     * Monitor Core Web Vitals
     */
    monitorWebVitals() {
        getCLS(this.handleMetric.bind(this));
        getFID(this.handleMetric.bind(this));
        getFCP(this.handleMetric.bind(this));
        getLCP(this.handleMetric.bind(this));
        getTTFB(this.handleMetric.bind(this));
    }

    /**
     * Handle metric data
     */
    handleMetric(metric) {
        this.metrics[metric.name] = metric.value;
        
        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`[Performance] ${metric.name}:`, metric.value);
        }

        // Send to analytics service in production
        if (this.isEnabled) {
            this.sendToAnalytics(metric);
        }
    }

    /**
     * Monitor custom performance metrics
     */
    monitorCustomMetrics() {
        // Monitor JavaScript execution time
        this.measureJSExecutionTime();
        
        // Monitor memory usage
        this.monitorMemoryUsage();
        
        // Monitor network performance
        this.monitorNetworkPerformance();
    }

    /**
     * Measure JavaScript execution time
     */
    measureJSExecutionTime() {
        const startTime = performance.now();
        
        // Measure time until page is interactive
        window.addEventListener('load', () => {
            const endTime = performance.now();
            const executionTime = endTime - startTime;
            
            this.handleMetric({
                name: 'JS_EXECUTION_TIME',
                value: executionTime,
                delta: executionTime,
                id: 'js-execution',
                navigationType: 'reload'
            });
        });
    }

    /**
     * Monitor memory usage
     */
    monitorMemoryUsage() {
        if ('memory' in performance) {
            const memory = performance.memory;
            
            this.handleMetric({
                name: 'MEMORY_USAGE',
                value: memory.usedJSHeapSize,
                delta: memory.usedJSHeapSize,
                id: 'memory-usage',
                navigationType: 'reload'
            });
        }
    }

    /**
     * Monitor network performance
     */
    monitorNetworkPerformance() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            
            this.handleMetric({
                name: 'NETWORK_SPEED',
                value: connection.downlink,
                delta: connection.downlink,
                id: 'network-speed',
                navigationType: 'reload'
            });
        }
    }

    /**
     * Monitor route changes
     */
    monitorRouteChanges() {
        let routeStartTime = performance.now();
        
        // Monitor route change start
        window.addEventListener('beforeunload', () => {
            routeStartTime = performance.now();
        });

        // Monitor route change end
        window.addEventListener('load', () => {
            const routeEndTime = performance.now();
            const routeChangeTime = routeEndTime - routeStartTime;
            
            this.handleMetric({
                name: 'ROUTE_CHANGE_TIME',
                value: routeChangeTime,
                delta: routeChangeTime,
                id: 'route-change',
                navigationType: 'navigate'
            });
        });
    }

    /**
     * Send metrics to analytics service
     */
    sendToAnalytics(metric) {
        // Implement your analytics service here
        // Example: Google Analytics, Mixpanel, etc.
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'web_vitals', {
                event_category: 'Performance',
                event_label: metric.name,
                value: Math.round(metric.value),
                non_interaction: true,
            });
        }

        // Send to custom analytics endpoint
        if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
            fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    metric: metric.name,
                    value: metric.value,
                    timestamp: Date.now(),
                    url: window.location.href,
                }),
            }).catch(error => {
                console.error('Failed to send analytics:', error);
            });
        }
    }

    /**
     * Get current performance metrics
     */
    getMetrics() {
        return { ...this.metrics };
    }

    /**
     * Get performance score
     */
    getPerformanceScore() {
        const metrics = this.getMetrics();
        let score = 100;

        // Deduct points for poor performance
        if (metrics.LCP > 2500) score -= 20;
        if (metrics.FID > 100) score -= 20;
        if (metrics.CLS > 0.1) score -= 20;
        if (metrics.FCP > 1800) score -= 20;
        if (metrics.TTFB > 800) score -= 20;

        return Math.max(0, score);
    }

    /**
     * Start performance measurement
     */
    startMeasure(name) {
        const startTime = performance.now();
        this.observers.set(name, startTime);
    }

    /**
     * End performance measurement
     */
    endMeasure(name) {
        const startTime = this.observers.get(name);
        if (startTime) {
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            this.handleMetric({
                name: `CUSTOM_${name.toUpperCase()}`,
                value: duration,
                delta: duration,
                id: name,
                navigationType: 'reload'
            });
            
            this.observers.delete(name);
            return duration;
        }
        return 0;
    }

    /**
     * Measure component render time
     */
    measureComponentRender(componentName, renderFunction) {
        this.startMeasure(`component_${componentName}`);
        const result = renderFunction();
        this.endMeasure(`component_${componentName}`);
        return result;
    }

    /**
     * Measure API call performance
     */
    measureAPICall(apiName, apiCall) {
        this.startMeasure(`api_${apiName}`);
        return apiCall().finally(() => {
            this.endMeasure(`api_${apiName}`);
        });
    }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

// Initialize on page load
if (typeof window !== 'undefined') {
    performanceMonitor.init();
}

export default performanceMonitor;

// Hook for React components
export const usePerformanceMonitor = () => {
    const startMeasure = (name) => performanceMonitor.startMeasure(name);
    const endMeasure = (name) => performanceMonitor.endMeasure(name);
    const getMetrics = () => performanceMonitor.getMetrics();
    const getScore = () => performanceMonitor.getPerformanceScore();

    return {
        startMeasure,
        endMeasure,
        getMetrics,
        getScore,
    };
};

// Higher-order component for performance monitoring
export const withPerformanceMonitoring = (Component, componentName) => {
    return function PerformanceMonitoredComponent(props) {
        const startTime = performance.now();
        
        React.useEffect(() => {
            const endTime = performance.now();
            const renderTime = endTime - startTime;
            
            performanceMonitor.handleMetric({
                name: `COMPONENT_RENDER_${componentName.toUpperCase()}`,
                value: renderTime,
                delta: renderTime,
                id: `component-${componentName}`,
                navigationType: 'reload'
            });
        });

        return React.createElement(Component, props);
    };
};
