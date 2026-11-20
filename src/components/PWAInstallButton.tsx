import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      await install();
      return;
    }
    setShowGuide(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
      >
        <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span>{isIOS ? 'Install on iOS' : 'Install App'}</span>
      </button>

      {showGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="install-guide-title"
          onClick={() => setShowGuide(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white border border-stone-200 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2 text-stone-900">
                <Smartphone className="w-5 h-5 text-orange-600 shrink-0" aria-hidden="true" />
                <h2 id="install-guide-title" className="text-lg font-bold">
                  Install Seoul Life Adventure
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="min-w-[40px] min-h-[40px] inline-flex items-center justify-center rounded-lg text-stone-500 hover:bg-stone-100 hover:text-stone-900 cursor-pointer"
                aria-label="Close install instructions"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-stone-700">
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                <p className="font-bold text-stone-900 mb-1">Android Chrome / Desktop Edge &amp; Chrome</p>
                <p>Open the browser menu and select <strong>Add to Home screen</strong> or <strong>Install Seoul Life Adventure</strong>.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                <p className="font-bold text-stone-900 mb-1">iPhone &amp; iPad Safari</p>
                <p>
                  1. Tap the <strong>Share</strong> button in the Safari toolbar.
                  <br />
                  2. Scroll down and tap <strong>Add to Home Screen</strong>.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="mt-5 w-full min-h-[44px] rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-sm font-bold transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
};
