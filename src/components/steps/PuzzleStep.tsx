import React, { useEffect, useState } from 'react';
import { ArrowRight, Check, RotateCcw, Volume2 } from 'lucide-react';
import type { LearningMode, LevelData } from '../../types/game';
import { playFeedbackTone, speakByMode } from '../../utils/speech';
import { DualLine } from '../DualLine';

interface PuzzleStepProps {
  level: LevelData;
  mode: LearningMode;
  onMistake: () => void;
  onSolved: (coinsEarned: number) => void;
  onNextStep: () => void;
}

interface PoolToken {
  id: string;
  text: string;
}

function shuffleTokens(tokens: PoolToken[]): PoolToken[] {
  const arr = [...tokens];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const PuzzleStep: React.FC<PuzzleStepProps> = ({
  level,
  mode,
  onMistake,
  onSolved,
  onNextStep,
}) => {
  const pz = level.puzzle;
  const targetTokens = mode === 'ko' ? pz.tokensKo : pz.tokensEn;
  const extraToken = mode === 'ko' ? pz.extraKo : pz.extraEn;

  const [pool, setPool] = useState<PoolToken[]>([]);
  const [picked, setPicked] = useState<PoolToken[]>([]);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    const initial = [...targetTokens, extraToken].map((text, idx) => ({
      id: `${level.id}-${mode}-${idx}-${text}`,
      text,
    }));
    setPool(shuffleTokens(initial));
    setPicked([]);
    setFeedback(null);
    setSolved(false);
  }, [level.id, mode, targetTokens, extraToken]);

  const handleAdd = (token: PoolToken) => {
    if (solved) return;
    setPool((prev) => prev.filter((t) => t.id !== token.id));
    setPicked((prev) => [...prev, token]);
    setFeedback(null);
  };

  const handleRemove = (token: PoolToken) => {
    if (solved) return;
    setPicked((prev) => prev.filter((t) => t.id !== token.id));
    setPool((prev) => [...prev, token]);
    setFeedback(null);
  };

  const handleReset = () => {
    if (solved) return;
    setPool((prev) => [...prev, ...picked]);
    setPicked([]);
    setFeedback(null);
  };

  const handleCheck = () => {
    if (solved || picked.length === 0) return;
    const built = picked.map((t) => t.text).join(' ').trim();
    const expected = targetTokens.join(' ').trim();

    if (built === expected) {
      setSolved(true);
      setFeedback({ ok: true, text: 'Correct! +10 Coins earned.' });
      playFeedbackTone('ok');
      onSolved(10);
    } else {
      playFeedbackTone('no');
      onMistake();
      setFeedback({
        ok: false,
        text: `Not quite! Hint: ${mode === 'ko' ? pz.hintKo : pz.hintEn}`,
      });
    }
  };

  return (
    <div className="space-y-5">
      <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
        <p className="text-xs font-extrabold text-orange-700 mb-2">
          Tap words in order to build this sentence:
        </p>
        <DualLine ko={pz.ko} en={pz.en} mode={mode} size="lg" />
      </div>

      {/* Drop Zone */}
      <div
        className="min-h-[68px] p-3 rounded-xl border-2 border-dashed border-orange-400 bg-orange-50/40 flex flex-wrap items-center gap-2"
        aria-label="Selected sentence words"
      >
        {picked.length === 0 ? (
          <span className="text-sm font-medium text-stone-400 px-1">
            Tap word tiles below to assemble the sentence...
          </span>
        ) : (
          picked.map((token) => (
            <button
              key={token.id}
              type="button"
              disabled={solved}
              onClick={() => handleRemove(token)}
              className="min-h-[42px] px-3.5 py-2 rounded-lg bg-orange-100 border border-orange-400 text-orange-950 font-bold text-sm sm:text-base transition-colors hover:bg-orange-200 disabled:cursor-default cursor-pointer"
            >
              {token.text}
            </button>
          ))
        )}
      </div>

      {/* Word Pool */}
      <div className="flex flex-wrap gap-2" aria-label="Available word tiles">
        {pool.map((token) => (
          <button
            key={token.id}
            type="button"
            disabled={solved}
            onClick={() => handleAdd(token)}
            className="min-h-[42px] px-3.5 py-2 rounded-lg bg-white border border-stone-300 hover:border-orange-500 hover:bg-orange-50 text-stone-900 font-bold text-sm sm:text-base shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            {token.text}
          </button>
        ))}
      </div>

      {/* Action Controls */}
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={handleCheck}
          disabled={picked.length === 0 || solved}
          className="inline-flex items-center gap-1.5 min-h-[44px] px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-45 disabled:cursor-not-allowed text-white text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
        >
          <Check className="w-4 h-4" aria-hidden="true" />
          <span>Check</span>
        </button>

        <button
          type="button"
          onClick={handleReset}
          disabled={solved || picked.length === 0}
          className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 disabled:opacity-45 disabled:cursor-not-allowed text-stone-700 text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          <span>Reset</span>
        </button>

        <button
          type="button"
          onClick={() => speakByMode(pz.ko, pz.en, mode)}
          className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
        >
          <Volume2 className="w-4 h-4" aria-hidden="true" />
          <span>Hear Sentence</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl border text-sm font-bold ${
            feedback.ok
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-red-50 border-red-300 text-red-900'
          }`}
          role="status"
        >
          {feedback.text}
        </div>
      )}

      {solved && (
        <div className="pt-1 flex justify-end">
          <button
            type="button"
            onClick={onNextStep}
            className="inline-flex items-center gap-1.5 min-h-[46px] px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-extrabold transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>4. Listening Quiz</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
};
