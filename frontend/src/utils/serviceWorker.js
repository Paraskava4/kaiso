// Service Worker utility functions
// Provides helper functions for Service Worker management and communication

class ServiceWorkerManager {
    constructor() {
        this.registration = null;
        this.isSupported = 'serviceWorker' in navigator;
    }

    // Register Service Worker
    async register() {
        if (!this.isSupported) {
            console.log('Service Worker not supported');
            return false;
        }

        try {
            this.registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker registered:', this.registration.scope);
            
            // Listen for updates
            this.registration.addEventListener('updatefound', () => {
                this.handleUpdate();
            });

            return true;
        } catch (error) {
            console.error('Service Worker registration failed:', error);
            return false;
        }
    }

    // Handle Service Worker updates
    handleUpdate() {
        const newWorker = this.registration.installing;
        
        newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available
                this.showUpdateNotification();
            }
        });
    }

    // Show update notification to user
    showUpdateNotification() {
        if (confirm('New version available! Refresh to update?')) {
            window.location.reload();
        }
    }

    // Send message to Service Worker
    async sendMessage(message) {
        if (!navigator.serviceWorker.controller) {
            console.log('No Service Worker controller');
            return;
        }

        try {
            const response = await navigator.serviceWorker.controller.postMessage(message);
            return response;
        } catch (error) {
            console.error('Failed to send message to Service Worker:', error);
        }
    }

    // Clear all caches
    async clearCaches() {
        if (!this.isSupported) return;

        try {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map(cacheName => caches.delete(cacheName))
            );
            console.log('All caches cleared');
        } catch (error) {
            console.error('Failed to clear caches:', error);
        }
    }

    // Get cache size
    async getCacheSize() {
        if (!this.isSupported) return 0;

        try {
            const cacheNames = await caches.keys();
            let totalSize = 0;

            for (const cacheName of cacheNames) {
                const cache = await caches.open(cacheName);
                const keys = await cache.keys();
                
                for (const request of keys) {
                    const response = await cache.match(request);
                    if (response) {
                        const blob = await response.blob();
                        totalSize += blob.size;
                    }
                }
            }

            return totalSize;
        } catch (error) {
            console.error('Failed to calculate cache size:', error);
            return 0;
        }
    }

    // Preload critical resources
    async preloadResources(urls) {
        if (!this.isSupported) return;

        try {
            const cache = await caches.open('kaiso-preload');
            await cache.addAll(urls);
            console.log('Resources preloaded:', urls);
        } catch (error) {
            console.error('Failed to preload resources:', error);
        }
    }

    // Check if Service Worker is active
    isActive() {
        return navigator.serviceWorker.controller !== null;
    }

    // Get Service Worker status
    getStatus() {
        if (!this.isSupported) return 'not-supported';
        if (!this.registration) return 'not-registered';
        if (!navigator.serviceWorker.controller) return 'not-active';
        return 'active';
    }
}

// Create singleton instance
const serviceWorkerManager = new ServiceWorkerManager();

// Export functions
export const registerServiceWorker = () => serviceWorkerManager.register();
export const sendMessageToSW = (message) => serviceWorkerManager.sendMessage(message);
export const clearAllCaches = () => serviceWorkerManager.clearCaches();
export const getCacheSize = () => serviceWorkerManager.getCacheSize();
export const preloadResources = (urls) => serviceWorkerManager.preloadResources(urls);
export const isServiceWorkerActive = () => serviceWorkerManager.isActive();
export const getServiceWorkerStatus = () => serviceWorkerManager.getStatus();

// Export the manager instance
export default serviceWorkerManager;

// Auto-register on module load (for development)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // Only register in development for testing
    console.log('Service Worker utilities loaded');
}
