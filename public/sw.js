// Minimal service worker: cache-first for static assets, network fallback.
// Bumped to v2 to evict previously cached broken responsive variants.
const CACHE_NAME = 'reliant-ai-v2';
const PRECACHE_URLS = [
  '/',
  '/project-metalforge.webp',
  '/project-oilfield.webp',
  '/project-homeservices.webp',
  '/project-medical.webp',
  '/project-metalforge-1200.webp',
  '/project-oilfield-1200.webp',
  '/project-homeservices-1200.webp',
  '/project-medical-1200.webp',
  '/project-homeservices-400.webp',
  '/project-medical-400.webp',
  '/project-homeservices-800.webp',
  '/project-medical-800.webp',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) return caches.delete(k);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  // Only handle GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  // Only handle same-origin requests
  if (url.origin !== location.origin) return;

  // Simple cache-first for static extensions
  if (request.destination === 'image' || /\.(?:js|css|webp|png|jpg|jpeg|svg|woff2?)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request)
          .then((res) => {
            // Put a copy in cache
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            return res;
          })
          .catch(() => cached || fetch(request));
      })
    );
  }
});
