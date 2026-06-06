// Service Worker for ArchitechAI PWA
// Version 1.1.0 - Fixed API request handling and 503 errors

const CACHE_NAME = 'architechai-v1.1';
const RUNTIME_CACHE = 'architechai-runtime-v1.1';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/logo.jpg',
  '/manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Installed successfully');
        return self.skipWaiting(); // Activate immediately
      })
      .catch((error) => {
        console.error('[Service Worker] Installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // Delete old caches
              return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
            })
            .map((cacheName) => {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[Service Worker] Activated successfully');
        return self.clients.claim(); // Take control immediately
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests (except API calls to our backend)
  if (url.origin !== location.origin) {
    // Allow API calls to backend even if different origin
    if (!url.pathname.startsWith('/api/')) {
      return;
    }
  }

  // API requests - Network first, don't cache on failure
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkOnlyForAPI(request));
    return;
  }

  // Static assets - Cache first, network fallback
  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image' ||
    request.destination === 'font'
  ) {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }

  // HTML pages - Network first, cache fallback, offline page as last resort
  if (request.destination === 'document') {
    event.respondWith(networkFirstWithOfflineFallback(request));
    return;
  }

  // Default - Network first
  event.respondWith(networkFirstStrategy(request));
});

// Network only for API calls (don't interfere with API requests)
async function networkOnlyForAPI(request) {
  try {
    return await fetch(request);
  } catch (error) {
    console.log('[Service Worker] API request failed (offline):', request.url, error);
    
    // Return offline response for API calls
    return new Response(
      JSON.stringify({
        error: 'You are offline. Please check your internet connection.',
        offline: true
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Network first strategy (for API calls)
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Only cache complete successful responses (not partial content)
    if (networkResponse.ok && networkResponse.status === 200) {
      const cache = await caches.open(RUNTIME_CACHE);
      // Clone before caching to avoid consuming the response
      cache.put(request, networkResponse.clone()).catch(err => {
        console.log('[Service Worker] Failed to cache response:', err);
      });
    }
    
    return networkResponse;
  } catch (err) {
    console.log('[Service Worker] Network request failed, trying cache:', request.url, err);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for API calls
    return new Response(
      JSON.stringify({
        error: 'You are offline. Please check your internet connection.',
        offline: true
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Cache first strategy (for static assets)
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    // Only cache complete successful responses
    if (networkResponse.ok && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone()).catch(err => {
        console.log('[Service Worker] Failed to cache asset:', err);
      });
    }
    
    return networkResponse;
  } catch (err) {
    console.error('[Service Worker] Failed to fetch:', request.url, err);
    
    // Return a fallback response
    return new Response('Asset not available offline', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Network first with offline fallback (for HTML pages)
async function networkFirstWithOfflineFallback(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Only cache complete successful responses
    if (networkResponse.ok && networkResponse.status === 200) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone()).catch(err => {
        console.log('[Service Worker] Failed to cache page:', err);
      });
    }
    
    return networkResponse;
  } catch (err) {
    console.log('[Service Worker] Network failed, trying cache:', request.url, err);
    
    // Try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Show offline page
    const offlinePage = await caches.match('/offline.html');
    if (offlinePage) {
      return offlinePage;
    }
    
    // Last resort fallback
    return new Response('You are offline', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Background sync for failed requests (future enhancement)
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
  
  if (event.tag === 'sync-architectures') {
    event.waitUntil(syncArchitectures());
  }
});

async function syncArchitectures() {
  // TODO: Implement background sync for failed architecture generations
  console.log('[Service Worker] Syncing architectures...');
}

// Push notifications (future enhancement)
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New update available',
    icon: '/logo.jpg',
    badge: '/logo.jpg',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View',
        icon: '/logo.jpg'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/logo.jpg'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('ArchitechAI', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      self.clients.openWindow('/')
    );
  }
});

// Message handler for communication with main app
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(RUNTIME_CACHE)
        .then((cache) => cache.addAll(event.data.urls))
    );
  }
});

console.log('[Service Worker] Loaded successfully');
