import React from 'react';
import { Map } from 'lucide-react';
import type { ActiveSession, LearningMode, LevelData } from '../types/game';
import { CultureStep } from './steps/CultureStep';
import { LearnStep } from './steps/LearnStep';
import { ListenStep } from './steps/ListenStep';
import { PuzzleStep } from './steps/PuzzleStep';
import { ScoreStep } from './steps/ScoreStep';
import { SpeakStep } from './steps/SpeakStep';
import { StoryStep } from './steps/StoryStep';

interface PlayViewProps {
  level: LevelData;
  session: ActiveSession;
  mode: LearningMode;
  totalLevels: number;
  computedStars: number;
  onChangeMode: (mode: LearningMode) => void;
  onExitToLevels: () => void;
  onUpdateSession: (updater: (prev: ActiveSession) => ActiveSession) => void;
  onAddCoins: (amount: number, withConfetti?: boolean) => void;
  onFinishLevel: () => void;
  onReplay: () => void;
  onNextLevel: () => void;
}

const STEP_LABELS = ['Story', 'Learn', 'Puzzle', 'Listen', 'Speak', 'Culture'];

export const PlayView: React.FC<PlayViewProps> = ({
  level,
  session,
  mode,
  totalLevels,
  computedStars,
  onChangeMode,
  onExitToLevels,
  onUpdateSession,
  onAddCoins,
  onFinishLevel,
  onReplay,
  onNextLevel,
}) => {
  return (
    <section className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 space-y-5">
      {/* Workspace Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-stone-900">
            {level.nameKo} · {level.nameEn}
          </h1>
          <p className="text-xs font-medium text-stone-500 mt-0.5">{level.grammar}</p>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg"
            role="group"
            aria-label="Audio Language Mode"
          >
            <button
              type="button"
              onClick={() => onChangeMode('ko')}
              className={`min-h-[34px] px-2.5 py-1 rounded-md text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                mode === 'ko'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🇰🇷 KO
            </button>
            <button
              type="button"
              onClick={() => onChangeMode('en')}
              className={`min-h-[34px] px-2.5 py-1 rounded-md text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                mode === 'en'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🇬🇧 EN
            </button>
          </div>

          <button
            type="button"
            onClick={onExitToLevels}
            className="inline-flex items-center gap-1.5 min-h-[40px] px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
          >
            <Map className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Map</span>
          </button>
        </div>
      </div>

      {/* 6-Step Progress Strip */}
      {session.step < 6 && (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5" aria-label="Chapter progress">
          {STEP_LABELS.map((label, idx) => {
            const done = idx < session.step;
            const current = idx === session.step;
            return (
              <div
                key={label}
                className={`text-center py-1.5 px-2 rounded-lg text-xs font-bold tabular-nums transition-colors ${
                  done
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : current
                      ? 'bg-orange-50 text-orange-800 border border-orange-400'
                      : 'bg-stone-100 text-stone-500 border border-transparent'
                }`}
              >
                {done ? '✓ ' : `${idx + 1}. `}
                {label}
              </div>
            );
          })}
        </div>
      )}

      {/* Active Step Content */}
      {session.step === 0 && (
        <StoryStep
          level={level}
          storyIdx={session.storyIdx}
          mode={mode}
          onPrevLine={() =>
            onUpdateSession((prev) => ({
              ...prev,
              storyIdx: Math.max(0, prev.storyIdx - 1),
            }))
          }
          onNextLine={() =>
            onUpdateSession((prev) => {
              if (prev.storyIdx < level.story.length - 1) {
                return { ...prev, storyIdx: prev.storyIdx + 1 };
              }
              return { ...prev, step: 1 };
            })
          }
        />
      )}

      {session.step === 1 && (
        <LearnStep
          level={level}
          mode={mode}
          onBackToStory={() =>
            onUpdateSession((prev) => ({ ...prev, step: 0 }))
          }
          onNextStep={() =>
            onUpdateSession((prev) => ({ ...prev, step: 2 }))
          }
        />
      )}

      {session.step === 2 && (
        <PuzzleStep
          level={level}
          mode={mode}
          onMistake={() =>
            onUpdateSession((prev) => ({
              ...prev,
              puzzleMistakes: prev.puzzleMistakes + 1,
            }))
          }
          onSolved={(coinsEarned) => {
            onAddCoins(coinsEarned, true);
          }}
          onNextStep={() =>
            onUpdateSession((prev) => ({ ...prev, step: 3 }))
          }
        />
      )}

      {session.step === 3 && (
        <ListenStep
          level={level}
          listenIdx={session.listenIdx}
          mode={mode}
          onAnswer={(isCorrect) => {
            if (isCorrect) {
              onUpdateSession((prev) => ({
                ...prev,
                listenScore: prev.listenScore + 1,
              }));
              onAddCoins(10, false);
            }
          }}
          onNextQuestion={() =>
            onUpdateSession((prev) => {
              if (prev.listenIdx < level.listening.length - 1) {
                return { ...prev, listenIdx: prev.listenIdx + 1 };
              }
              return { ...prev, step: 4 };
            })
          }
        />
      )}

      {session.step === 4 && (
        <SpeakStep
          level={level}
          mode={mode}
          speakDone={session.speakDone}
          onComplete={(info, coinsEarned) => {
            onUpdateSession((prev) => ({
              ...prev,
              speakInfo: info,
              speakDone: true,
            }));
            onAddCoins(coinsEarned, true);
          }}
          onNextStep={() =>
            onUpdateSession((prev) => ({ ...prev, step: 5 }))
          }
        />
      )}

      {session.step === 5 && (
        <CultureStep
          level={level}
          mode={mode}
          onSuccess={(coinsEarned) => {
            onAddCoins(coinsEarned, true);
          }}
          onFinishLevel={onFinishLevel}
        />
      )}

      {session.step === 6 && (
        <ScoreStep
          level={level}
          session={session}
          stars={computedStars}
          hasNextLevel={session.idx + 1 < totalLevels}
          onReplay={onReplay}
          onOpenLevels={onExitToLevels}
          onNextLevel={onNextLevel}
        />
      )}
    </section>
  );
};
