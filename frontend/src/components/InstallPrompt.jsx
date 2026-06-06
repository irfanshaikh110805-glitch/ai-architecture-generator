import { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';

/**
 * InstallPrompt Component
 * 
 * Displays a prompt to install the PWA when the app is installable.
 * Handles the beforeinstallprompt event and provides a user-friendly install button.
 */
const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(() => {
    // Initialize state based on display mode
    return window.matchMedia('(display-mode: standalone)').matches;
  });

  useEffect(() => {
    // Don't set up listeners if already installed
    if (isInstalled) {
      return;
    }

    // Check if already dismissed
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const daysSinceDismissed = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
      
      // Show again after 7 days
      if (daysSinceDismissed < 7) {
        return;
      }
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      console.log('[InstallPrompt] beforeinstallprompt event fired');
      
      // Prevent the default browser install prompt
      e.preventDefault();
      
      // Store the event for later use
      setDeferredPrompt(e);
      
      // Show our custom install prompt after a delay
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000); // Show after 3 seconds
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
      console.log('[InstallPrompt] App installed successfully');
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [isInstalled]); // Added isInstalled to dependency array

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log('[InstallPrompt] No deferred prompt available');
      return;
    }

    // Show the browser's install prompt
    deferredPrompt.prompt();

    // Wait for the user's response
    const { outcome } = await deferredPrompt.userChoice;
    console.log('[InstallPrompt] User choice:', outcome);

    if (outcome === 'accepted') {
      console.log('[InstallPrompt] User accepted the install prompt');
    } else {
      console.log('[InstallPrompt] User dismissed the install prompt');
    }

    // Clear the deferred prompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
  };

  // Don't show if already installed or no prompt available
  if (isInstalled || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Install ArchitechAI</h3>
                <p className="text-sm text-white/90">Get the app experience</p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-white/80 hover:text-white transition-colors p-1"
              aria-label="Dismiss install prompt"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <ul className="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-300">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Works offline</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Faster loading</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Home screen access</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Native app experience</span>
            </li>
          </ul>

          {/* Install Button */}
          <button
            onClick={handleInstallClick}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <Download className="w-5 h-5 group-hover:animate-bounce" />
            Install Now
          </button>

          {/* Dismiss Link */}
          <button
            onClick={handleDismiss}
            className="w-full mt-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
