import React from 'react';
import { ArrowLeft, Lock, Play, RotateCcw, Star } from 'lucide-react';
import type { LearningMode, LevelData, SaveState } from '../types/game';

interface LevelsViewProps {
  levels: LevelData[];
  saveState: SaveState;
  onChangeMode: (mode: LearningMode) => void;
  onPlayLevel: (index: number) => void;
  onBackHome: () => void;
}

export const LevelsView: React.FC<LevelsViewProps> = ({
  levels,
  saveState,
  onChangeMode,
  onPlayLevel,
  onBackHome,
}) => {
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900">Select Level</h1>
          <p className="text-sm text-stone-600 mt-0.5">
            Complete each chapter&apos;s Story, Words, Puzzle, Listening, Speaking, and Culture Mission.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg"
            role="group"
            aria-label="Learning Mode"
          >
            <button
              type="button"
              onClick={() => onChangeMode('ko')}
              className={`min-h-[36px] px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                saveState.mode === 'ko'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🇰🇷 Learn Korean
            </button>
            <button
              type="button"
              onClick={() => onChangeMode('en')}
              className={`min-h-[36px] px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                saveState.mode === 'en'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🇬🇧 Learn English
            </button>
          </div>

          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Home</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {levels.map((lvl, idx) => {
          const isUnlocked = idx <= saveState.unlocked;
          const res = saveState.results[lvl.id];
          const stars = res?.stars ?? 0;

          return (
            <article
              key={lvl.id}
              className={`bg-white border rounded-2xl overflow-hidden flex flex-col justify-between transition-colors ${
                isUnlocked ? 'border-stone-200 hover:border-orange-300' : 'border-stone-200 bg-stone-50 opacity-75'
              }`}
            >
              <div>
                <div className="aspect-video w-full bg-stone-100 overflow-hidden relative">
                  <img
                    src={lvl.sceneImage}
                    alt={lvl.sceneAlt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-lg font-extrabold text-stone-900">
                      {lvl.nameKo} · {lvl.nameEn}
                    </h2>
                    <div className="flex items-center gap-0.5 shrink-0" aria-label={`${stars} of 3 stars`}>
                      {[0, 1, 2].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${s < stars ? 'fill-amber-400 text-amber-500' : 'text-stone-300'}`}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  </div>

                  <p className="mt-2 text-xs sm:text-sm text-stone-600">
                    <span className="font-bold text-stone-800">Grammar:</span> {lvl.grammar}
                  </p>

                  {res?.done && (
                    <p className="mt-2 text-xs font-semibold text-emerald-700 tabular-nums">
                      Best Listening: {res.listenScore}/{lvl.listening.length} · Speaking: {res.speakInfo}
                    </p>
                  )}
                </div>
              </div>

              <div className="px-5 pb-5">
                {isUnlocked ? (
                  <button
                    type="button"
                    onClick={() => onPlayLevel(idx)}
                    className={`w-full min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl text-sm font-bold transition-colors cursor-pointer whitespace-nowrap ${
                      res?.done
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-orange-600 hover:bg-orange-700 text-white'
                    }`}
                  >
                    {res?.done ? (
                      <>
                        <RotateCcw className="w-4 h-4" aria-hidden="true" />
                        <span>Replay Level</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" aria-hidden="true" />
                        <span>Play Level</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl bg-stone-200 text-stone-500 text-sm font-semibold cursor-not-allowed whitespace-nowrap"
                  >
                    <Lock className="w-4 h-4" aria-hidden="true" />
                    <span>Finish {levels[idx - 1].id} First</span>
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
