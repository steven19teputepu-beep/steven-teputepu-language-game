import type { LearningMode } from '../types/game';

export function speakLang(text: string, lang: 'ko-KR' | 'en-US'): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.92;
    window.speechSynthesis.speak(utterance);
  } catch {
    // Ignore speech synthesis failures on unsupported environments
  }
}

export function speakByMode(koText: string, enText: string, mode: LearningMode): void {
  if (mode === 'ko') {
    speakLang(koText, 'ko-KR');
  } else {
    speakLang(enText, 'en-US');
  }
}

export function playFeedbackTone(kind: 'ok' | 'no' | 'win'): void {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const notes =
      kind === 'win'
        ? [523.25, 659.25, 783.99, 1046.5]
        : kind === 'ok'
          ? [523.25, 659.25]
          : [260, 210];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = kind === 'no' ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.08, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.16);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.18);
    });
  } catch {
    // Ignore Web Audio restrictions
  }
}

function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[a.length][b.length];
}

export function calcSpeakScore(heard: string, target: string, keywords: string[]): number {
  const clean = (s: string) =>
    (s || '')
      .toLowerCase()
      .replace(/[?.!,"'~]/g, '')
      .trim();
  const h = clean(heard);
  const t = clean(target);
  if (!h) return 0;

  const hn = h.replace(/\s+/g, '');
  const tn = t.replace(/\s+/g, '');
  const sim = Math.max(
    0,
    1 - levenshtein(hn, tn) / Math.max(hn.length, tn.length, 1)
  );

  let hits = 0;
  (keywords || []).forEach((k) => {
    const ck = clean(k);
    if (h.includes(ck) || hn.includes(ck)) hits++;
  });
  const kwRatio = keywords && keywords.length ? hits / keywords.length : sim;
  return Math.min(100, Math.max(0, Math.round((sim * 0.6 + kwRatio * 0.4) * 100)));
}
