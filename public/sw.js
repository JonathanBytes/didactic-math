const DEFAULT_VERSION = 'dev';
const CACHE_PREFIX = 'matematica-didactica';
const { searchParams } = new URL(self.location.href);
const CACHE_VERSION = searchParams.get('version') || DEFAULT_VERSION;
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VERSION}`;
const PRECACHE_URLS = ['/', '/index.html', '/manifest.json'];

const matchCurrentCache = async (request) => {
  const cache = await caches.open(CACHE_NAME);
  return cache.match(request);
};

const putInCurrentCache = async (request, response) => {
  if (!response || response.status !== 200 || (response.type !== 'basic' && response.type !== 'cors')) {
    return;
  }

  const requestUrl = new URL(request.url);
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response);
};

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .catch((error) => {
        console.log('Cache install failed:', error);
      })
  );
  self.skipWaiting();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const request = event.request;

  const handleNetworkFirst = async () => {
    try {
      const response = await fetch(request);
      await putInCurrentCache(request, response.clone());
      return response;
    } catch (error) {
      const cachedResponse = await matchCurrentCache(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      throw error;
    }
  };

  // Network-first for navigations (HTML)
  const isNavigationRequest =
    request.mode === 'navigate' ||
    (request.headers.get('accept') || '').includes('text/html');

  if (isNavigationRequest) {
    event.respondWith(handleNetworkFirst());
    return;
  }

  // Cache-first for other GET requests
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }

      try {
        const networkResponse = await fetch(request);
        await putInCurrentCache(request, networkResponse.clone());
        return networkResponse;
      } catch (error) {
        if (cachedResponse) {
          return cachedResponse;
        }
        throw error;
      }
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      const deletions = cacheNames
        .filter((cacheName) => cacheName.startsWith(CACHE_PREFIX) && cacheName !== CACHE_NAME)
        .map((cacheName) => caches.delete(cacheName));

      await Promise.all(deletions);
      await self.clients.claim();
    })()
  );
});
