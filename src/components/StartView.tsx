import React from 'react';
import { ArrowRight, Lock, Play, RotateCcw, Star } from 'lucide-react';
import type { LearningMode, LevelData, SaveState } from '../types/game';
import { CharacterAvatar } from './CharacterAvatar';
import { SceneBackdrop } from './SceneBackdrop';

interface StartViewProps {
  levels: LevelData[];
  saveState: SaveState;
  onChangeMode: (mode: LearningMode) => void;
  onStart: () => void;
  onOpenLevels: () => void;
  onPlayLevel: (index: number) => void;
}

export const StartView: React.FC<StartViewProps> = ({
  levels,
  saveState,
  onChangeMode,
  onStart,
  onOpenLevels,
  onPlayLevel,
}) => {
  const doneCount = Object.values(saveState.results).filter((r) => r && r.done).length;
  const totalStars = Object.values(saveState.results).reduce(
    (sum, r) => sum + (r?.stars ?? 0),
    0
  );

  return (
    <div className="space-y-8">
      {/* Hero Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6 bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold tracking-wide text-orange-700 mb-2">
              Korean &amp; English Story Adventure · Levels 1A–2B
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900 text-balance leading-tight">
              Seoul Life Adventure
            </h1>
            <p className="mt-3 text-base text-stone-600 leading-relaxed max-w-xl">
              Follow Minjun, Sarah, Halmeoni, and Mr. Kim across Seoul through interactive stories, word puzzles, listening challenges, speaking practice, and cultural missions.
            </p>

            {/* Interactive Mode Selector */}
            <div className="mt-6">
              <p className="text-xs font-bold text-stone-500 mb-2">Choose Your Audio &amp; Focus Mode</p>
              <div
                className="grid grid-cols-2 gap-2 p-1.5 bg-stone-100 rounded-xl"
                role="group"
                aria-label="Learning Mode"
              >
                <button
                  type="button"
                  onClick={() => onChangeMode('ko')}
                  className={`min-h-[48px] px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                    saveState.mode === 'ko'
                      ? 'bg-white text-stone-900 shadow-sm border border-stone-200'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <div className="text-sm font-bold whitespace-nowrap">🇰🇷 Learn Korean</div>
                  <div className="text-xs text-stone-500">Korean audio + focus</div>
                </button>
                <button
                  type="button"
                  onClick={() => onChangeMode('en')}
                  className={`min-h-[48px] px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                    saveState.mode === 'en'
                      ? 'bg-white text-stone-900 shadow-sm border border-stone-200'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <div className="text-sm font-bold whitespace-nowrap">🇬🇧 Learn English</div>
                  <div className="text-xs text-stone-500">English audio + focus</div>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-7 pt-5 border-t border-stone-100 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onStart}
              className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-base font-extrabold transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
            >
              <span>{doneCount > 0 ? 'Continue Adventure' : 'Start Adventure'}</span>
              <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            </button>

            {doneCount > 0 && (
              <button
                type="button"
                onClick={onOpenLevels}
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-3 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-sm font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Level Map ({doneCount}/4)</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Illustrated Cast Showcase */}
        <div className="lg:col-span-6 flex">
          <SceneBackdrop
            imageSrc={levels[0].sceneImage}
            alt={levels[0].sceneAlt}
            heightClass="min-h-[280px] lg:h-full"
          >
            <div className="grid grid-cols-4 gap-2 sm:gap-3 items-end pt-10">
              <CharacterAvatar id="minjun" label="민준 Minjun" active size="sm" />
              <CharacterAvatar id="sarah" label="사라 Sarah" active size="sm" />
              <CharacterAvatar id="halmeoni" label="할머니 Halmeoni" size="sm" />
              <CharacterAvatar id="mrkim" label="김 사장님 Mr. Kim" size="sm" />
            </div>
          </SceneBackdrop>
        </div>
      </section>

      {/* 4-Column Curriculum Strip */}
      <section aria-labelledby="curriculum-heading">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
          <h2 id="curriculum-heading" className="text-lg font-extrabold text-stone-900">
            Four Daily Life Chapters
          </h2>
          <p className="text-xs font-semibold text-stone-500 tabular-nums">
            {saveState.coins} Coins · {totalStars}/12 Stars · {doneCount}/4 Chapters Complete
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {levels.map((lvl, i) => {
            const unlocked = i <= saveState.unlocked;
            const res = saveState.results[lvl.id];
            const stars = res?.stars ?? 0;

            return (
              <div
                key={lvl.id}
                className={`bg-white border border-stone-200 rounded-xl overflow-hidden flex flex-col justify-between transition-colors ${
                  unlocked ? 'hover:border-orange-300' : 'opacity-70 bg-stone-50'
                }`}
              >
                <div>
                  <div className="aspect-video w-full bg-stone-100 overflow-hidden">
                    <img
                      src={lvl.sceneImage}
                      alt={lvl.sceneAlt}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-extrabold text-stone-900">
                        {lvl.nameKo} · {lvl.nameEn}
                      </h3>
                      <div className="flex items-center gap-0.5 text-amber-500 shrink-0" aria-label={`${stars} of 3 stars`}>
                        {[0, 1, 2].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${s < stars ? 'fill-amber-400 text-amber-500' : 'text-stone-300'}`}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-1.5 text-xs text-stone-600 line-clamp-2">
                      {lvl.grammar}
                    </p>
                  </div>
                </div>

                <div className="px-4 pb-4">
                  {unlocked ? (
                    <button
                      type="button"
                      onClick={() => onPlayLevel(i)}
                      className={`w-full min-h-[40px] inline-flex items-center justify-center gap-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                        res?.done
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-stone-900 hover:bg-stone-800 text-white'
                      }`}
                    >
                      {res?.done ? (
                        <>
                          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Replay {lvl.id}</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Play {lvl.id}</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="w-full min-h-[40px] inline-flex items-center justify-center gap-1.5 rounded-lg bg-stone-100 text-stone-500 text-xs font-semibold cursor-not-allowed whitespace-nowrap"
                    >
                      <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Finish {levels[i - 1].id} First</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
