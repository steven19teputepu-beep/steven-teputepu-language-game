import React from 'react';
import type { CharacterId } from '../types/game';

interface CharacterAvatarProps {
  id: CharacterId;
  label?: string;
  active?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const CHARACTER_CONFIG: Record<
  CharacterId,
  {
    bg: string;
    skin: string;
    hair: string;
    outfit: string;
    accent: string;
  }
> = {
  minjun: {
    bg: '#DBEAFE',
    skin: '#FCD5B5',
    hair: '#1E293B',
    outfit: '#2563EB',
    accent: '#F59E0B',
  },
  sarah: {
    bg: '#FFEDD5',
    skin: '#F9C9A7',
    hair: '#7C2D12',
    outfit: '#EA580C',
    accent: '#FDE047',
  },
  halmeoni: {
    bg: '#FCE7F3',
    skin: '#F5C6A5',
    hair: '#CBD5E1',
    outfit: '#BE185D',
    accent: '#FBCFE8',
  },
  mrkim: {
    bg: '#DCFCE7',
    skin: '#F7C9A6',
    hair: '#334155',
    outfit: '#FFFFFF',
    accent: '#059669',
  },
};

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  id,
  label,
  active = false,
  size = 'md',
}) => {
  const c = CHARACTER_CONFIG[id];
  const dim =
    size === 'sm' ? 'w-14 h-14' : size === 'lg' ? 'w-24 h-24' : 'w-20 h-20';

  return (
    <div className="flex flex-col items-center gap-1.5 select-none">
      <div
        className={`${dim} rounded-full border-2 ${
          active
            ? 'border-orange-500 shadow-md animate-hop'
            : 'border-white/90 shadow-sm animate-bob'
        } overflow-hidden bg-white transition-transform duration-200`}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
          <circle cx="50" cy="50" r="50" fill={c.bg} />
          {/* Shoulders / Outfit */}
          <path d="M18 98 C20 74, 80 74, 82 98 Z" fill={c.outfit} />
          {id === 'mrkim' && (
            <>
              {/* Green apron strap */}
              <path d="M36 78 L36 98 L64 98 L64 78 Z" fill={c.accent} />
            </>
          )}
          {id === 'halmeoni' && (
            <path d="M36 78 Q50 86 64 78" fill="none" stroke="#FFFFFF" strokeWidth="3" />
          )}

          {/* Hair back */}
          {id === 'sarah' && (
            <path d="M24 44 C22 72, 32 76, 36 72 L64 72 C68 76, 78 72, 76 44 Z" fill={c.hair} />
          )}
          {id === 'halmeoni' && (
            <circle cx="50" cy="20" r="11" fill={c.hair} />
          )}

          {/* Face */}
          <circle cx="50" cy="48" r="22" fill={c.skin} />

          {/* Cheeks */}
          <circle cx="37" cy="53" r="3.5" fill="#F87171" opacity="0.38" />
          <circle cx="63" cy="53" r="3.5" fill="#F87171" opacity="0.38" />

          {/* Eyes */}
          <circle cx="41" cy="47" r="2.8" fill="#0F172A" />
          <circle cx="59" cy="47" r="2.8" fill="#0F172A" />
          <circle cx="42" cy="46" r="0.9" fill="#FFFFFF" />
          <circle cx="60" cy="46" r="0.9" fill="#FFFFFF" />

          {/* Halmeoni glasses */}
          {id === 'halmeoni' && (
            <g fill="none" stroke="#92400E" strokeWidth="1.8">
              <circle cx="41" cy="47" r="6.5" />
              <circle cx="59" cy="47" r="6.5" />
              <line x1="47.5" y1="47" x2="52.5" y2="47" />
            </g>
          )}

          {/* Smile */}
          <path
            d={active ? 'M43 56 Q50 64 57 56' : 'M44 57 Q50 62 56 57'}
            fill="none"
            stroke="#7C2D12"
            strokeWidth="2.4"
            strokeLinecap="round"
          />

          {/* Hair front */}
          {id === 'minjun' && (
            <path
              d="M27 45 C27 25, 73 25, 73 45 C65 36, 56 38, 50 35 C42 39, 34 36, 27 45 Z"
              fill={c.hair}
            />
          )}
          {id === 'sarah' && (
            <path
              d="M27 46 C27 24, 73 24, 73 46 C64 34, 52 33, 46 39 C38 35, 32 39, 27 46 Z"
              fill={c.hair}
            />
          )}
          {id === 'halmeoni' && (
            <path
              d="M28 44 C28 24, 72 24, 72 44 C64 33, 55 32, 50 37 C45 32, 36 33, 28 44 Z"
              fill={c.hair}
            />
          )}
          {id === 'mrkim' && (
            <>
              <path
                d="M28 43 C28 26, 72 26, 72 43 C63 34, 37 34, 28 43 Z"
                fill={c.hair}
              />
              {/* Chef / market cap */}
              <path d="M31 28 C31 14, 69 14, 69 28 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
              <rect x="30" y="26" width="40" height="5" rx="2" fill="#059669" />
            </>
          )}
        </svg>
      </div>
      {label && (
        <span className="px-2.5 py-0.5 rounded-md bg-stone-900/80 text-white text-xs font-semibold whitespace-nowrap">
          {label}
        </span>
      )}
    </div>
  );
};
