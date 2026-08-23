import { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(() => {
    return window.matchMedia('(display-mode: standalone)').matches;
  });

  useEffect(() => {
    if (isInstalled) return;

    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const daysSinceDismissed = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) return;
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
  };

  if (isInstalled || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50">
      <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000000] overflow-hidden">
        {/* Header */}
        <div className="bg-[#00FF00] border-b-2 border-black p-4 text-black">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black text-[#00FF00] border-2 border-black flex items-center justify-center">
                <Smartphone className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-display font-black text-sm uppercase">INSTALL PWA</h3>
                <p className="font-mono text-[11px] font-bold text-gray-800">OFFLINE ENGINE ACCESS</p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 bg-white border border-black hover:bg-[#FF5500] hover:text-white"
              aria-label="Dismiss install prompt"
            >
              <X className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 bg-[#FDF6E3]">
          <ul className="space-y-1.5 mb-4 font-mono text-xs font-bold text-black">
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 bg-[#00FF00] border border-black flex items-center justify-center text-[10px]">✓</span>
              <span>Works 100% offline</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 bg-[#00FF00] border border-black flex items-center justify-center text-[10px]">✓</span>
              <span>Zero latency spec compilation</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 bg-[#00FF00] border border-black flex items-center justify-center text-[10px]">✓</span>
              <span>Standalone desktop & mobile app</span>
            </li>
          </ul>

          {/* Install Button */}
          <button
            onClick={handleInstallClick}
            className="w-full bg-[#FF00FF] text-white border-3 border-black shadow-[4px_4px_0px_0px_#000000] py-3 px-4 font-display font-black text-sm uppercase hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#000000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 stroke-[3]" />
            INSTALL ARCHITECH.AI
          </button>

          <button
            onClick={handleDismiss}
            className="w-full mt-2 font-mono text-[11px] font-bold text-gray-700 hover:text-black uppercase text-center"
          >
            MAYBE LATER
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
