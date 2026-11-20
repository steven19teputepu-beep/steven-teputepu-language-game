import React from 'react';
import type { LearningMode } from '../types/game';

interface DualLineProps {
  ko: string;
  en: string;
  mode: LearningMode;
  size?: 'md' | 'lg';
}

export const DualLine: React.FC<DualLineProps> = ({
  ko,
  en,
  mode,
  size = 'lg',
}) => {
  const koClass =
    size === 'lg'
      ? mode === 'ko'
        ? 'text-xl sm:text-2xl font-extrabold text-stone-900'
        : 'text-lg sm:text-xl font-bold text-stone-700'
      : mode === 'ko'
        ? 'text-base sm:text-lg font-extrabold text-stone-900'
        : 'text-sm sm:text-base font-bold text-stone-700';

  const enClass =
    size === 'lg'
      ? mode === 'en'
        ? 'text-lg sm:text-xl font-extrabold text-blue-700 mt-1.5'
        : 'text-sm sm:text-base font-semibold text-stone-600 mt-1'
      : mode === 'en'
        ? 'text-sm sm:text-base font-extrabold text-blue-700 mt-1'
        : 'text-xs sm:text-sm font-medium text-stone-600 mt-0.5';

  return (
    <div className="leading-snug">
      <div className={koClass}>{ko}</div>
      <div className={enClass}>{en}</div>
    </div>
  );
};
