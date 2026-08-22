import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// Service Worker Registration (Production Only)
if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('[PWA] Service Worker registered successfully:', registration.scope);
        })
        .catch((error) => {
          console.log('[PWA] Service Worker registration failed:', error);
        });
    });
  } else {
    // In development / local testing, unregister existing service workers to avoid caching old bundles
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
        console.log('[PWA] Unregistered stale service worker in local environment');
      }
    });
    if ('caches' in window) {
      caches.keys().then((names) => {
        for (const name of names) {
          caches.delete(name);
        }
      });
    }
  }
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
