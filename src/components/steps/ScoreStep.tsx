import React from 'react';
import { ArrowRight, Map, RotateCcw, Star, Trophy } from 'lucide-react';
import type { ActiveSession, LevelData } from '../../types/game';

interface ScoreStepProps {
  level: LevelData;
  session: ActiveSession;
  stars: number;
  hasNextLevel: boolean;
  onReplay: () => void;
  onOpenLevels: () => void;
  onNextLevel: () => void;
}

export const ScoreStep: React.FC<ScoreStepProps> = ({
  level,
  session,
  stars,
  hasNextLevel,
  onReplay,
  onOpenLevels,
  onNextLevel,
}) => {
  return (
    <div className="max-w-xl mx-auto py-4 text-center space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
          Chapter Complete
        </p>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
          {level.nameKo} ({level.nameEn})
        </h2>

        <div className="flex items-center justify-center gap-2 pt-2" aria-label={`${stars} of 3 stars`}>
          {[0, 1, 2].map((idx) => (
            <Star
              key={idx}
              className={`w-10 h-10 ${
                idx < stars
                  ? 'fill-amber-400 text-amber-500'
                  : 'text-stone-200 fill-stone-100'
              }`}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-left">
        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
          <div className="text-xs font-semibold text-stone-500">Coins Earned</div>
          <div className="text-xl font-extrabold text-orange-600 tabular-nums mt-1">
            +{session.coins}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
          <div className="text-xs font-semibold text-stone-500">Listening</div>
          <div className="text-xl font-extrabold text-stone-900 tabular-nums mt-1">
            {session.listenScore} / {level.listening.length}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
          <div className="text-xs font-semibold text-stone-500">Speaking</div>
          <div className="text-base sm:text-lg font-extrabold text-emerald-700 mt-1 truncate">
            {session.speakInfo || 'Done'}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={onReplay}
          className="inline-flex items-center gap-1.5 min-h-[46px] px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          <span>Replay</span>
        </button>

        <button
          type="button"
          onClick={onOpenLevels}
          className="inline-flex items-center gap-1.5 min-h-[46px] px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
        >
          <Map className="w-4 h-4" aria-hidden="true" />
          <span>All Levels</span>
        </button>

        {hasNextLevel ? (
          <button
            type="button"
            onClick={onNextLevel}
            className="inline-flex items-center gap-2 min-h-[48px] px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-base font-extrabold transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>Next Level</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenLevels}
            className="inline-flex items-center gap-2 min-h-[48px] px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-base font-extrabold transition-colors cursor-pointer whitespace-nowrap"
          >
            <Trophy className="w-4 h-4" aria-hidden="true" />
            <span>All Chapters Complete</span>
          </button>
        )}
      </div>
    </div>
  );
};
