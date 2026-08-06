// Minimal service worker: cache-first for static assets, network fallback.
// v3 fixes corrupted image cache where -1200 variants were cached as HTML fallback
const CACHE_NAME = 'reliant-ai-v3';
const PRECACHE_URLS = [
  '/',
  '/project-metalforge.webp',
  '/project-oilfield.webp',
  '/project-homeservices.webp',
  '/project-medical.webp',
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
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== location.origin) return;

  const isStatic =
    request.destination === 'image' ||
    /\.(?:js|css|webp|png|jpg|jpeg|svg|woff2?)$/.test(url.pathname);

  if (!isStatic) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      // If cached response is HTML but request is for image/js/css, treat as corrupt
      if (cached) {
        const ct = cached.headers.get('content-type') || '';
        const isHtml = ct.includes('text/html');
        const expectsImage = request.destination === 'image' || /\.(?:webp|png|jpg|jpeg|avif)$/.test(url.pathname);
        if (isHtml && expectsImage) {
          // Evict corrupt entry and fall through to network
          caches.open(CACHE_NAME).then((c) => c.delete(request));
        } else {
          return cached;
        }
      }
      return fetch(request)
        .then((res) => {
          // Don't cache HTML responses for static asset requests
          const ct = res.headers.get('content-type') || '';
          if (ct.includes('text/html') && /\.(?:webp|png|jpg|jpeg|avif|js|css)$/.test(url.pathname)) {
            return res;
          }
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return res;
        })
        .catch(() => cached || fetch(request));
    })
  );
});
