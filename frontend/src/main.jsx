import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('[PWA] Service Worker registered successfully:', registration.scope);

        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000); // Check every hour

        // Handle service worker updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available
              console.log('[PWA] New version available! Refresh to update.');
              
              // Show update notification (optional)
              if (window.confirm('A new version is available! Reload to update?')) {
                newWorker.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
              }
            }
          });
        });
      })
      .catch((error) => {
        console.log('[PWA] Service Worker registration failed:', error);
      });

    // Handle service worker controller change
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('[PWA] Service Worker controller changed, reloading...');
      window.location.reload();
    });
  });
}

// Online/Offline detection
window.addEventListener('online', () => {
  console.log('[PWA] Connection restored');
  // Show notification or update UI
});

window.addEventListener('offline', () => {
  console.log('[PWA] Connection lost');
  // Show notification or update UI
});

// Log PWA installation status
if (window.matchMedia('(display-mode: standalone)').matches) {
  console.log('[PWA] Running as installed app');
} else {
  console.log('[PWA] Running in browser');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
