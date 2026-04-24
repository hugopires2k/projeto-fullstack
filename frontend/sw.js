const CACHE_NAME = 'fullstack-v1';
const STATIC_ASSETS = ['/', '/index.html', '/styles.css', '/script.js', '/manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Requisições de API vão sempre para a rede
  if (event.request.url.includes('/api/')) {
    return event.respondWith(fetch(event.request));
  }

  // Assets estáticos: cache first, fallback para rede
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
