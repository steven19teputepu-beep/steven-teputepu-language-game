import React, { useEffect } from 'react';
import { ArrowLeft, ArrowRight, Volume2 } from 'lucide-react';
import type { LearningMode, LevelData } from '../../types/game';
import { speakByMode, speakLang } from '../../utils/speech';
import { CharacterAvatar } from '../CharacterAvatar';
import { DualLine } from '../DualLine';
import { SceneBackdrop } from '../SceneBackdrop';

interface StoryStepProps {
  level: LevelData;
  storyIdx: number;
  mode: LearningMode;
  onPrevLine: () => void;
  onNextLine: () => void;
}

export const StoryStep: React.FC<StoryStepProps> = ({
  level,
  storyIdx,
  mode,
  onPrevLine,
  onNextLine,
}) => {
  const line = level.story[storyIdx];
  const isLast = storyIdx === level.story.length - 1;

  useEffect(() => {
    speakByMode(line.ko, line.en, mode);
  }, [level.id, storyIdx, mode, line.ko, line.en]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left/Top Stage */}
        <div className="lg:col-span-7 flex">
          <SceneBackdrop
            imageSrc={level.sceneImage}
            alt={level.sceneAlt}
            fallbackTint={level.accentTint}
            heightClass="min-h-[240px] lg:h-full"
          >
            <div className="flex items-end justify-around gap-4 pt-8">
              <CharacterAvatar
                id={line.characterId}
                label={line.who}
                active
                size="md"
              />
              <CharacterAvatar
                id={line.partnerId}
                label={line.partner}
                active={false}
                size="md"
              />
            </div>
          </SceneBackdrop>
        </div>

        {/* Right/Bottom Dialogue Box */}
        <div className="lg:col-span-5 bg-stone-50 border border-stone-200 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-extrabold text-orange-700 tabular-nums">
                Scene {storyIdx + 1} of {level.story.length} · {line.who}
              </span>
            </div>

            <div className="bg-white border border-stone-200 rounded-xl p-4">
              <DualLine ko={line.ko} en={line.en} mode={mode} size="lg" />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => speakByMode(line.ko, line.en, mode)}
                className="inline-flex items-center gap-1.5 min-h-[42px] px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
              >
                <Volume2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{mode === 'ko' ? 'Hear Korean' : 'Hear English'}</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  mode === 'ko'
                    ? speakLang(line.en, 'en-US')
                    : speakLang(line.ko, 'ko-KR')
                }
                className="inline-flex items-center gap-1.5 min-h-[42px] px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
              >
                <Volume2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{mode === 'ko' ? 'Hear English' : 'Hear Korean'}</span>
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onPrevLine}
              disabled={storyIdx === 0}
              className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 disabled:opacity-45 disabled:cursor-not-allowed text-stone-700 text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={onNextLine}
              className="inline-flex items-center gap-1.5 min-h-[44px] px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>{isLast ? '2. Learn Words' : 'Next'}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
