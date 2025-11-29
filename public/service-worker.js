self.addEventListener('install', (event) => {
    // Skip waiting to activate the new service worker immediately
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== 'vinmapinfo-cache') {
                        return caches.delete(cache); // Clear old caches
                    }
                })
            );
        })
    );
    self.clients.claim(); // Take control of all pages immediately
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});