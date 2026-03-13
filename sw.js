const CACHE_NAME = 'deenhub-v1.0';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/app.css',
  '/js/app.js',
  '/js/screens.js',
  '/js/api.js',
  '/js/storage.js',
  '/manifest.json'
];

// Install — cache core shell
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate — clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch — network-first for APIs, cache-first for static
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Network-first for API calls
  if (url.hostname.includes('aladhan.com') || url.hostname.includes('alquran.cloud') || url.hostname.includes('cdn.jsdelivr.net')) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Cache-first for static assets
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
