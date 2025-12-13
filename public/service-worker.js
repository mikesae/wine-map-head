self.addEventListener('install', (event) => {
    // Skip waiting to activate the new service worker immediately
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    // Take control of all pages immediately
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    // Simply fetch the request from the network without using any cache
    event.respondWith(fetch(event.request));
});