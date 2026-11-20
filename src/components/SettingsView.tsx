import React, { useState } from 'react';
import { ArrowLeft, Download, RotateCcw, Smartphone } from 'lucide-react';
import type { LearningMode } from '../types/game';

interface SettingsViewProps {
  mode: LearningMode;
  onChangeMode: (mode: LearningMode) => void;
  onResetSave: () => void;
  onBack: () => void;
}

const MANIFEST_EXPORT = {
  id: '/',
  name: 'Seoul Life Adventure',
  short_name: 'Seoul Life',
  description: 'Cartoon Korean and English daily life and Korean culture learning game (Levels 1A to 2B).',
  start_url: '/',
  scope: '/',
  display: 'standalone',
  background_color: '#FAFAF9',
  theme_color: '#EA580C',
  categories: ['education', 'games'],
  icons: [
    { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: '/pwa-maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
};

const SW_EXPORT = `const CACHE = 'seoul-life-v1';
const FILES = ['/', '/index.html', '/manifest.webmanifest', '/icon.svg', '/pwa-192x192.png', '/pwa-512x512.png'];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).catch(() => {}));
  self.skipWaiting();
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((r) => r || fetch(e.request).then((res) => {
      if (res && res.status === 200) {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match('/index.html')))
  );
});`;

const ICON_SVG_EXPORT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="108" fill="#EA580C"/>
  <circle cx="395" cy="115" r="46" fill="#FDE047"/>
  <path d="M0 360 Q140 300 280 355 T512 340 L512 404 Q512 512 404 512 L108 512 Q0 512 0 404 Z" fill="#10B981"/>
  <circle cx="256" cy="242" r="118" fill="#FFFFFF"/>
  <text x="256" y="270" text-anchor="middle" font-size="92" font-family="sans-serif" font-weight="900" fill="#EA580C">가A</text>
</svg>`;

function triggerDownload(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 900);
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  mode,
  onChangeMode,
  onResetSave,
  onBack,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleConfirmReset = () => {
    onResetSave();
    setConfirmReset(false);
    setResetSuccess(true);
  };

  return (
    <section className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-extrabold text-stone-900">Settings &amp; Export</h1>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back</span>
        </button>
      </div>

      {/* Learning Mode & Progress Reset */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-5">
        <div>
          <h2 className="text-base font-extrabold text-stone-900">Learning Mode</h2>
          <p className="text-sm text-stone-600 mt-0.5">
            Switch between Korean audio + Hangul focus or English audio + English focus.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onChangeMode('ko')}
              className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer whitespace-nowrap ${
                mode === 'ko'
                  ? 'bg-orange-600 text-white'
                  : 'border border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
              }`}
            >
              🇰🇷 Learn Korean
            </button>
            <button
              type="button"
              onClick={() => onChangeMode('en')}
              className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer whitespace-nowrap ${
                mode === 'en'
                  ? 'bg-blue-600 text-white'
                  : 'border border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
              }`}
            >
              🇬🇧 Learn English
            </button>
          </div>
        </div>

        <div className="pt-5 border-t border-stone-100">
          <h2 className="text-base font-extrabold text-stone-900">Saved Progress</h2>
          <p className="text-sm text-stone-600 mt-0.5">
            Reset all earned coins, stars, and unlocked level progress stored in this browser.
          </p>

          {!confirmReset ? (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setConfirmReset(true);
                  setResetSuccess(false);
                }}
                className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                <span>Reset Save</span>
              </button>
              {resetSuccess && (
                <span className="text-sm font-semibold text-emerald-700">
                  Progress reset to Level 1A.
                </span>
              )}
            </div>
          ) : (
            <div className="mt-3 p-4 rounded-xl bg-red-50 border border-red-200 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-red-900">
                Reset all stars, coins, and level progress?
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="min-h-[40px] px-3.5 py-2 rounded-lg bg-white border border-stone-300 text-stone-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReset}
                  className="min-h-[40px] px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PWA & Google Play Store Export */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-stone-900">
          <Smartphone className="w-5 h-5 text-blue-600 shrink-0" aria-hidden="true" />
          <h2 className="text-base font-extrabold">Download &amp; Google Play Store Steps</h2>
        </div>

        <p className="text-sm font-semibold text-stone-700 leading-relaxed">
          Download code from AI Studio &gt; Go to pwabuilder.com &gt; Upload &gt; Download AAB &gt; Upload AAB to Google Play Console
        </p>

        <div className="flex flex-wrap gap-2.5 pt-1">
          <button
            type="button"
            onClick={() =>
              triggerDownload(
                'manifest.json',
                JSON.stringify(MANIFEST_EXPORT, null, 2),
                'application/manifest+json'
              )
            }
            className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>Download manifest.json</span>
          </button>

          <button
            type="button"
            onClick={() =>
              triggerDownload('sw.js', SW_EXPORT, 'application/javascript')
            }
            className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>Download sw.js</span>
          </button>

          <button
            type="button"
            onClick={() =>
              triggerDownload('icon-512.svg', ICON_SVG_EXPORT, 'image/svg+xml')
            }
            className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>Download icon-512.svg</span>
          </button>
        </div>
      </div>
    </section>
  );
};
