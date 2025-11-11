// Service Worker for KAISO Research
// Version: 1.0.0
// Provides caching, offline functionality, and performance optimization

const CACHE_NAME = 'kaiso-v1.0.0';
const STATIC_CACHE = 'kaiso-static-v1.0.0';
const API_CACHE = 'kaiso-api-v1.0.0';
const IMAGE_CACHE = 'kaiso-images-v1.0.0';

// Files to cache immediately
const STATIC_ASSETS = [
    '/',
    '/aboutus',
    '/blog',
    '/contactus',
    '/home',
    '/_next/static/css/ace9b5274b21e8cc.css',
    '/_next/static/chunks/framework-1548034a53843b9f.js',
    '/_next/static/chunks/main-dcf4e6e00a513a91.js',
    '/_next/static/chunks/pages/_app-4702323b40f4eb67.js'
];

// API endpoints to cache
const API_ENDPOINTS = [
    '/api/navbar',
    '/api/home',
    '/api/menu',
    '/api/categories',
    '/api/blogCategories'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('Service Worker: Installation complete');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Service Worker: Installation failed', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && 
                            cacheName !== API_CACHE && 
                            cacheName !== IMAGE_CACHE) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activation complete');
                return self.clients.claim();
            })
    );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip chrome-extension and other non-http requests
    if (!url.protocol.startsWith('http')) {
        return;
    }
    
    // Strategy 1: Static assets (Cache First)
    if (isStaticAsset(request)) {
        event.respondWith(cacheFirst(request, STATIC_CACHE));
        return;
    }
    
    // Strategy 2: Images (Cache First with fallback)
    if (isImage(request)) {
        event.respondWith(cacheFirst(request, IMAGE_CACHE));
        return;
    }
    
    // Strategy 3: API requests (Network First with cache fallback)
    if (isApiRequest(request)) {
        event.respondWith(networkFirst(request, API_CACHE));
        return;
    }
    
    // Strategy 4: HTML pages (Network First with cache fallback)
    if (isHtmlRequest(request)) {
        event.respondWith(networkFirst(request, STATIC_CACHE));
        return;
    }
    
    // Strategy 5: Other requests (Network First)
    event.respondWith(networkFirst(request, STATIC_CACHE));
});

// Cache First Strategy
async function cacheFirst(request, cacheName) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.error('Cache First failed:', error);
        return new Response('Offline - Content not available', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Network First Strategy
async function networkFirst(request, cacheName) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('Network failed, trying cache:', error);
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline page for HTML requests
        if (isHtmlRequest(request)) {
            return new Response(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Offline - KAISO Research</title>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                        .offline { color: #666; }
                    </style>
                </head>
                <body>
                    <h1>You're Offline</h1>
                    <p class="offline">Please check your internet connection and try again.</p>
                    <button onclick="window.location.reload()">Retry</button>
                </body>
                </html>
            `, {
                headers: { 'Content-Type': 'text/html' }
            });
        }
        
        return new Response('Offline - Content not available', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Helper functions
function isStaticAsset(request) {
    const url = new URL(request.url);
    return url.pathname.startsWith('/_next/static/') ||
           url.pathname.endsWith('.js') ||
           url.pathname.endsWith('.css') ||
           url.pathname.endsWith('.woff2') ||
           url.pathname.endsWith('.woff');
}

function isImage(request) {
    const url = new URL(request.url);
    return url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i) ||
           url.pathname.startsWith('/images/') ||
           url.pathname.startsWith('/icons/');
}

function isApiRequest(request) {
    const url = new URL(request.url);
    return url.pathname.startsWith('/api/') ||
           url.hostname === 'api.kaisoresearch.com'; //||
           //url.hostname === 'kaiso.kmsoft.org';
}

function isHtmlRequest(request) {
    return request.headers.get('accept')?.includes('text/html');
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    console.log('Service Worker: Background sync', event.tag);
    
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    // Handle offline actions when connection is restored
    console.log('Service Worker: Performing background sync');
    // Add your offline action handling here
}

// Push notifications (optional)
self.addEventListener('push', (event) => {
    console.log('Service Worker: Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'New update available',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    
    event.waitUntil(
        self.registration.showNotification('KAISO Research', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    console.log('Service Worker: Notification clicked');
    
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow('/')
    );
});

console.log('Service Worker: Script loaded');
