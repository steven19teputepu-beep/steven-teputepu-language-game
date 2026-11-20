import React from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Volume2 } from 'lucide-react';
import type { LearningMode, LevelData } from '../../types/game';
import { speakByMode } from '../../utils/speech';

interface LearnStepProps {
  level: LevelData;
  mode: LearningMode;
  onBackToStory: () => void;
  onNextStep: () => void;
}

export const LearnStep: React.FC<LearnStepProps> = ({
  level,
  mode,
  onBackToStory,
  onNextStep,
}) => {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-extrabold text-stone-900">
          5 Key Words · {level.nameEn}
        </h2>
        <p className="text-sm text-stone-600 mt-0.5">
          Tap the speaker button on each card to hear the pronunciation.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {level.words.map((word) => (
          <div
            key={word.ko}
            className="flex items-center justify-between gap-3 p-4 rounded-xl bg-stone-50 border border-stone-200"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-3xl leading-none shrink-0" aria-hidden="true">
                {word.pic}
              </span>
              <div className="min-w-0">
                <div
                  className={`truncate ${
                    mode === 'ko'
                      ? 'text-lg font-extrabold text-stone-900'
                      : 'text-base font-bold text-stone-700'
                  }`}
                >
                  {word.ko}
                </div>
                <div
                  className={`truncate ${
                    mode === 'en'
                      ? 'text-base font-extrabold text-blue-700'
                      : 'text-sm font-semibold text-stone-600'
                  }`}
                >
                  {word.en}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => speakByMode(word.ko, word.en, mode)}
              aria-label={`Listen to ${word.ko} (${word.en})`}
              className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-xl bg-orange-600 hover:bg-orange-700 text-white transition-colors shrink-0 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3">
        <BookOpen className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="text-sm text-blue-950">
          <span className="font-extrabold">Grammar Focus ({level.id}): </span>
          <span className="font-semibold">{level.grammar}</span>
        </div>
      </div>

      <div className="pt-2 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBackToStory}
          className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Story</span>
        </button>

        <button
          type="button"
          onClick={onNextStep}
          className="inline-flex items-center gap-1.5 min-h-[44px] px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
        >
          <span>3. Sentence Puzzle</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
