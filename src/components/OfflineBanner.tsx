import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      className="fixed bottom-4 left-4 z-40 flex items-center gap-2 rounded-lg bg-amber-700 px-3.5 py-2 text-xs font-semibold text-white shadow-lg"
      role="status"
      aria-live="polite"
    >
      <WifiOff className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>Offline Mode — Saved levels and cached assets ready</span>
    </div>
  );
};
