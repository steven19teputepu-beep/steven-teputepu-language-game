import React from 'react';
import type { ScreenView } from '../types/game';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { PWAInstallButton } from './PWAInstallButton';

interface TopBarProps {
  coins: number;
  stars: number;
  screen: ScreenView;
  onNavigate: (screen: ScreenView) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  coins,
  stars,
  screen,
  onNavigate,
}) => {
  const isOnline = useOnlineStatus();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-stone-200">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Single-element Brand wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('start')}
          className="text-base sm:text-lg font-extrabold tracking-tight text-stone-900 hover:text-orange-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
        >
          Seoul Life
        </button>

        {/* Zone 2: Clean nav links + unboxed tabular-nums progress */}
        <div className="flex items-center gap-4 sm:gap-6 text-sm min-w-0">
          <nav className="flex items-center gap-4 sm:gap-5 font-semibold text-stone-600">
            <button
              type="button"
              onClick={() => onNavigate('levels')}
              className={`whitespace-nowrap shrink-0 py-1 cursor-pointer transition-colors hover:text-stone-900 ${
                screen === 'levels' || screen === 'play'
                  ? 'text-orange-600 underline underline-offset-4 decoration-2'
                  : ''
              }`}
            >
              Levels
            </button>
            <button
              type="button"
              onClick={() => onNavigate('settings')}
              className={`whitespace-nowrap shrink-0 py-1 cursor-pointer transition-colors hover:text-stone-900 ${
                screen === 'settings'
                  ? 'text-orange-600 underline underline-offset-4 decoration-2'
                  : ''
              }`}
            >
              Settings
            </button>
          </nav>

          <div
            className="hidden sm:flex items-center gap-2 text-xs font-semibold text-stone-600 tabular-nums whitespace-nowrap shrink-0"
            aria-label={`Coins ${coins}, Stars ${stars}, Status ${isOnline ? 'Online' : 'Offline'}`}
          >
            <span>{coins} Coins</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>{stars} Stars</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className={isOnline ? 'text-emerald-700' : 'text-amber-700'}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

        {/* Zone 3: Single primary action */}
        <div className="flex items-center shrink-0">
          <PWAInstallButton />
        </div>
      </div>
    </header>
  );
};
