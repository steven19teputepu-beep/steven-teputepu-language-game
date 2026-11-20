import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Volume2, XCircle } from 'lucide-react';
import type { LearningMode, LevelData } from '../../types/game';
import { playFeedbackTone, speakByMode } from '../../utils/speech';

interface ListenStepProps {
  level: LevelData;
  listenIdx: number;
  mode: LearningMode;
  onAnswer: (isCorrect: boolean) => void;
  onNextQuestion: () => void;
}

export const ListenStep: React.FC<ListenStepProps> = ({
  level,
  listenIdx,
  mode,
  onAnswer,
  onNextQuestion,
}) => {
  const question = level.listening[listenIdx];
  const [pickedIdx, setPickedIdx] = useState<number | null>(null);
  const isLast = listenIdx === level.listening.length - 1;

  useEffect(() => {
    setPickedIdx(null);
    speakByMode(question.ko, question.en, mode);
  }, [level.id, listenIdx, mode, question.ko, question.en]);

  const handleChoose = (idx: number) => {
    if (pickedIdx !== null) return;
    setPickedIdx(idx);
    const ok = question.opts[idx].ok;
    playFeedbackTone(ok ? 'ok' : 'no');
    onAnswer(ok);
  };

  const answered = pickedIdx !== null;
  const chosenOption = answered ? question.opts[pickedIdx] : null;

  return (
    <div className="space-y-5">
      <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 text-center space-y-3">
        <p className="text-xs font-extrabold text-stone-500 tabular-nums">
          Question {listenIdx + 1} of {level.listening.length}
        </p>
        <p className="text-base font-bold text-stone-900">
          Listen to the audio, then select the matching sentence.
        </p>
        <button
          type="button"
          onClick={() => speakByMode(question.ko, question.en, mode)}
          className="inline-flex items-center gap-2 min-h-[46px] px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
        >
          <Volume2 className="w-4 h-4" aria-hidden="true" />
          <span>Play Audio</span>
        </button>
      </div>

      <div className="space-y-2.5">
        {question.opts.map((opt, idx) => {
          let style =
            'border-stone-200 bg-white hover:border-orange-400 hover:bg-orange-50/40 text-stone-900';
          if (answered) {
            if (opt.ok) {
              style = 'border-emerald-500 bg-emerald-50 text-emerald-950';
            } else if (idx === pickedIdx) {
              style = 'border-red-400 bg-red-50 text-red-950';
            } else {
              style = 'border-stone-200 bg-stone-50 text-stone-500 opacity-75';
            }
          }

          return (
            <button
              key={opt.ko}
              type="button"
              disabled={answered}
              onClick={() => handleChoose(idx)}
              className={`w-full min-h-[56px] p-4 rounded-xl border text-left flex items-center justify-between gap-3 transition-colors cursor-pointer disabled:cursor-default ${style}`}
            >
              <div>
                <div className="text-base font-extrabold">{opt.ko}</div>
                <div className="text-sm font-medium opacity-85 mt-0.5">{opt.en}</div>
              </div>
              {answered && opt.ok && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />
              )}
              {answered && !opt.ok && idx === pickedIdx && (
                <XCircle className="w-5 h-5 text-red-600 shrink-0" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>

      {answered && chosenOption && (
        <div className="space-y-3">
          <div
            className={`p-3.5 rounded-xl border text-sm font-bold ${
              chosenOption.ok
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-red-50 border-red-300 text-red-900'
            }`}
            role="status"
          >
            {chosenOption.ok
              ? 'Correct! +10 Coins earned.'
              : `Audio said: "${question.ko}" (${question.en})`}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onNextQuestion}
              className="inline-flex items-center gap-1.5 min-h-[46px] px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-extrabold transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>{isLast ? '5. Speaking Quiz' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
