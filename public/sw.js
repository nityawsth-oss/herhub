/* eslint-disable no-restricted-globals */

// HerHub Offline Progressive Web App Service Worker
const CACHE_NAME = 'herhub-offline-cache-v1';

// Install Event
self.addEventListener('install', (event) => {
  console.log('[HerHub Sentinel SW] Installing service worker...');
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
  console.log('[HerHub Sentinel SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[HerHub Sentinel SW] Clearing older cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Dynamic Stale-While-Revalidate Caching
self.addEventListener('fetch', (event) => {
  // Only handle HTTP/HTTPS GET requests
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http')) return;

  // Skip browser extension requests or non-app schemas
  const url = new URL(event.request.url);

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        // Fetch from network in background or as primary
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            // Only cache valid basic or cors responses
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => {
            // Network failed (Device is OFFLINE)
            if (cachedResponse) {
              return cachedResponse;
            }
            // If user is navigating to another page/route while offline, serve index.html (SPA routing)
            if (event.request.mode === 'navigate') {
              return cache.match('/') || cache.match('/index.html');
            }
            return null;
          });

        // If we have cached copy, return it immediately for instant offline responsiveness, else wait for network
        return cachedResponse || fetchPromise;
      });
    })
  );
});
