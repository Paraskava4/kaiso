// Core Web Vitals reporting utility
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';

// Function to send metrics to analytics
function sendToAnalytics(metric) {
    // Send to Google Analytics 4
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', metric.name, {
            event_category: 'Web Vitals',
            event_label: metric.id,
            value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
            non_interaction: true,
        });
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
        console.log('Web Vital:', metric.name, metric.value);
    }

    // Send to custom analytics endpoint (optional)
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
        fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: metric.name,
                value: metric.value,
                id: metric.id,
                delta: metric.delta,
                navigationType: metric.navigationType,
                timestamp: Date.now(),
            }),
        }).catch(console.error);
    }
}

// Initialize Core Web Vitals reporting
export function reportWebVitals() {
    onCLS(sendToAnalytics);
    onINP(sendToAnalytics); // INP replaced FID in newer versions
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
}

// Performance budget thresholds
export const PERFORMANCE_BUDGETS = {
    LCP: 2500, // Largest Contentful Paint (ms)
    INP: 200,  // Interaction to Next Paint (ms) - replaced FID
    CLS: 0.1,  // Cumulative Layout Shift
    FCP: 1800, // First Contentful Paint (ms)
    TTFB: 800, // Time to First Byte (ms)
};

// Check if metrics meet performance budgets
export function checkPerformanceBudget(metric) {
    const budget = PERFORMANCE_BUDGETS[metric.name];
    if (budget && metric.value > budget) {
        console.warn(`Performance budget exceeded for ${metric.name}: ${metric.value} > ${budget}`);
        return false;
    }
    return true;
}
