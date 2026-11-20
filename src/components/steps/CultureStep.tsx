import React, { useEffect, useState } from 'react';
import { CheckCircle2, Trophy, XCircle } from 'lucide-react';
import type { LearningMode, LevelData } from '../../types/game';
import { playFeedbackTone } from '../../utils/speech';
import { CharacterAvatar } from '../CharacterAvatar';
import { DualLine } from '../DualLine';
import { SceneBackdrop } from '../SceneBackdrop';

interface CultureStepProps {
  level: LevelData;
  mode: LearningMode;
  onSuccess: (coinsEarned: number) => void;
  onFinishLevel: () => void;
}

export const CultureStep: React.FC<CultureStepProps> = ({
  level,
  mode,
  onSuccess,
  onFinishLevel,
}) => {
  const c = level.culture;
  const [pickedIdx, setPickedIdx] = useState<number | null>(null);
  const [okDone, setOkDone] = useState(false);

  useEffect(() => {
    setPickedIdx(null);
    setOkDone(false);
  }, [level.id]);

  const handleSelect = (idx: number) => {
    if (okDone) return;
    setPickedIdx(idx);
    if (c.choices[idx].ok) {
      setOkDone(true);
      playFeedbackTone('ok');
      onSuccess(15);
    } else {
      playFeedbackTone('no');
    }
  };

  const selectedChoice = pickedIdx !== null ? c.choices[pickedIdx] : null;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-5 flex">
          <SceneBackdrop
            imageSrc={level.sceneImage}
            alt={level.sceneAlt}
            fallbackTint={level.accentTint}
            heightClass="min-h-[210px] lg:h-full"
          >
            <div className="flex justify-center pt-6">
              <CharacterAvatar id={c.characterId} label={c.who} active size="lg" />
            </div>
          </SceneBackdrop>
        </div>

        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-1.5">
            <p className="text-xs font-extrabold text-blue-800">Korean Culture Tip · {c.who}</p>
            <p className="text-sm font-bold text-stone-900">{c.tipKo}</p>
            <p className="text-sm font-medium text-stone-700">{c.tipEn}</p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <DualLine ko={c.qKo} en={c.qEn} mode={mode} size="md" />
          </div>

          <div className="space-y-2.5">
            {c.choices.map((ch, idx) => {
              let style =
                'border-stone-200 bg-white hover:border-orange-400 hover:bg-orange-50/40 text-stone-900';
              if (pickedIdx === idx) {
                style = ch.ok
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-950'
                  : 'border-red-400 bg-red-50 text-red-950';
              }

              return (
                <button
                  key={ch.ko}
                  type="button"
                  disabled={okDone}
                  onClick={() => handleSelect(idx)}
                  className={`w-full min-h-[56px] p-4 rounded-xl border text-left flex items-center justify-between gap-3 transition-colors cursor-pointer disabled:cursor-default ${style}`}
                >
                  <div>
                    <div className="text-sm sm:text-base font-extrabold">{ch.ko}</div>
                    <div className="text-xs sm:text-sm font-medium opacity-85 mt-0.5">{ch.en}</div>
                  </div>
                  {pickedIdx === idx && ch.ok && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />
                  )}
                  {pickedIdx === idx && !ch.ok && (
                    <XCircle className="w-5 h-5 text-red-600 shrink-0" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>

          {selectedChoice && (
            <div
              className={`p-3.5 rounded-xl border text-sm space-y-0.5 ${
                selectedChoice.ok
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-red-50 border-red-300 text-red-950'
              }`}
              role="status"
            >
              <div className="font-extrabold">{selectedChoice.fbKo}</div>
              <div className="font-semibold">{selectedChoice.fbEn}</div>
            </div>
          )}

          {okDone && (
            <div className="pt-1 flex justify-end">
              <button
                type="button"
                onClick={onFinishLevel}
                className="inline-flex items-center gap-2 min-h-[48px] px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-base font-extrabold transition-colors cursor-pointer whitespace-nowrap"
              >
                <Trophy className="w-4 h-4" aria-hidden="true" />
                <span>Finish Level</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
