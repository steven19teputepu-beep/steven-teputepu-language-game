import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Mic, MicOff, Volume2 } from 'lucide-react';
import type { LearningMode, LevelData } from '../../types/game';
import { calcSpeakScore, playFeedbackTone, speakLang } from '../../utils/speech';
import { DualLine } from '../DualLine';

interface SpeakStepProps {
  level: LevelData;
  mode: LearningMode;
  speakDone: boolean;
  onComplete: (info: string, coinsEarned: number) => void;
  onNextStep: () => void;
}

interface SpeechRecInstance {
  lang: string;
  interimResults: boolean;
  onresult: ((ev: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((ev: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecConstructor = new () => SpeechRecInstance;

export const SpeakStep: React.FC<SpeakStepProps> = ({
  level,
  mode,
  speakDone,
  onComplete,
  onNextStep,
}) => {
  const sp = level.speaking;
  const target = mode === 'ko' ? sp.ko : sp.en;
  const lang = mode === 'ko' ? 'ko-KR' : 'en-US';
  const keywords = mode === 'ko' ? sp.kwKo : sp.kwEn;

  const [useReadAloud, setUseReadAloud] = useState(false);
  const [recording, setRecording] = useState(false);
  const [heard, setHeard] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const recRef = useRef<SpeechRecInstance | null>(null);

  useEffect(() => {
    const win = window as unknown as {
      SpeechRecognition?: SpeechRecConstructor;
      webkitSpeechRecognition?: SpeechRecConstructor;
    };
    const Rec = win.SpeechRecognition || win.webkitSpeechRecognition;
    setUseReadAloud(!Rec);
    setRecording(false);
    setHeard('');
    setScore(null);
    setErrorMsg('');
    return () => {
      try {
        recRef.current?.stop();
      } catch {
        // Ignore stop errors
      }
    };
  }, [level.id, mode]);

  const handleMicStart = () => {
    const win = window as unknown as {
      SpeechRecognition?: SpeechRecConstructor;
      webkitSpeechRecognition?: SpeechRecConstructor;
    };
    const Rec = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!Rec) {
      setUseReadAloud(true);
      return;
    }

    if (recording) {
      try {
        recRef.current?.stop();
      } catch {
        // Ignore
      }
      setRecording(false);
      return;
    }

    try {
      const r = new Rec();
      recRef.current = r;
      r.lang = lang;
      r.interimResults = false;
      setRecording(true);
      setErrorMsg('');

      r.onresult = (ev) => {
        setRecording(false);
        const transcript = ev.results[0][0].transcript;
        const computed = calcSpeakScore(transcript, target, keywords);
        setHeard(transcript);
        setScore(computed);
        if (computed >= 50) {
          playFeedbackTone('ok');
          if (!speakDone) {
            onComplete(`${computed}/100`, 15);
          }
        } else {
          playFeedbackTone('no');
        }
      };

      r.onerror = (ev) => {
        setRecording(false);
        if (
          ev.error === 'not-allowed' ||
          ev.error === 'audio-capture' ||
          ev.error === 'service-not-allowed'
        ) {
          setUseReadAloud(true);
        } else {
          setErrorMsg('Could not hear clearly. Try again or use Read Aloud Practice.');
        }
      };

      r.onend = () => {
        setRecording(false);
      };

      r.start();
    } catch {
      setRecording(false);
      setUseReadAloud(true);
    }
  };

  const handleReadAloud = () => {
    playFeedbackTone('ok');
    if (!speakDone) {
      onComplete('Read Aloud', 10);
    }
  };

  return (
    <div className="space-y-5">
      <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-extrabold text-orange-700">
            Say aloud in {mode === 'ko' ? 'Korean' : 'English'}:
          </span>
          <button
            type="button"
            onClick={() => speakLang(target, lang)}
            className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
          >
            <Volume2 className="w-4 h-4" aria-hidden="true" />
            <span>Listen Example</span>
          </button>
        </div>

        <DualLine ko={sp.ko} en={sp.en} mode={mode} size="lg" />
      </div>

      {!useReadAloud ? (
        <div className="text-center space-y-3 py-2">
          <button
            type="button"
            onClick={handleMicStart}
            className={`inline-flex items-center justify-center gap-2 min-h-[52px] px-7 py-3 rounded-xl text-white text-base font-extrabold transition-colors cursor-pointer whitespace-nowrap ${
              recording
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-orange-600 hover:bg-orange-700'
            }`}
          >
            {recording ? (
              <>
                <MicOff className="w-5 h-5" aria-hidden="true" />
                <span>Listening... Tap to Stop</span>
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" aria-hidden="true" />
                <span>Tap to Speak</span>
              </>
            )}
          </button>

          <div>
            <button
              type="button"
              onClick={() => setUseReadAloud(true)}
              className="min-h-[40px] px-3 py-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 underline underline-offset-4 cursor-pointer"
            >
              No Mic? Switch to Read Aloud Practice
            </button>
          </div>
        </div>
      ) : (
        <div className="p-5 rounded-xl bg-blue-50 border border-blue-200 text-center space-y-3">
          <p className="text-sm font-semibold text-blue-950">
            Read Aloud Practice: Listen to the example, say the sentence aloud clearly, then confirm below.
          </p>
          <button
            type="button"
            onClick={handleReadAloud}
            className="inline-flex items-center justify-center gap-2 min-h-[46px] px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>{speakDone ? 'Read Aloud Completed' : 'Practice by Reading Aloud (+10 Coins)'}</span>
          </button>
        </div>
      )}

      {heard && score !== null && (
        <div
          className={`p-4 rounded-xl border text-sm space-y-1 ${
            score >= 50
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-amber-50 border-amber-300 text-amber-950'
          }`}
          role="status"
        >
          <div>
            <span className="font-bold">You said:</span> &ldquo;{heard}&rdquo;
          </div>
          <div className="tabular-nums font-extrabold">
            Match Score: {score} / 100 {score >= 50 ? '— Great pronunciation! +15 Coins' : '— Try again for 50+'}
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-sm font-bold text-red-900" role="alert">
          {errorMsg}
        </div>
      )}

      {speakDone && (
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={onNextStep}
            className="inline-flex items-center gap-1.5 min-h-[46px] px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-extrabold transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>6. Culture Mission</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
};
