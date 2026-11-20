import { useCallback, useMemo, useState } from 'react';
import { ConfettiBurst } from './components/ConfettiBurst';
import { LevelsView } from './components/LevelsView';
import { OfflineBanner } from './components/OfflineBanner';
import { PlayView } from './components/PlayView';
import { SettingsView } from './components/SettingsView';
import { StartView } from './components/StartView';
import { TopBar } from './components/TopBar';
import {
  getDefaultSaveState,
  LEVELS,
  loadSaveState,
  persistSaveState,
} from './data/levels';
import type {
  ActiveSession,
  LearningMode,
  SaveState,
  ScreenView,
} from './types/game';
import { playFeedbackTone } from './utils/speech';

function createFreshSession(idx: number): ActiveSession {
  return {
    idx,
    step: 0,
    storyIdx: 0,
    puzzleMistakes: 0,
    listenIdx: 0,
    listenScore: 0,
    speakInfo: null,
    speakDone: false,
    coins: 0,
  };
}

export default function App() {
  const [saveState, setSaveState] = useState<SaveState>(() => loadSaveState());
  const [screen, setScreen] = useState<ScreenView>('start');
  const [session, setSession] = useState<ActiveSession | null>(null);
  const [confettiKey, setConfettiKey] = useState(0);
  const [lastEarnedStars, setLastEarnedStars] = useState(1);

  const updateSave = useCallback((updater: (prev: SaveState) => SaveState) => {
    setSaveState((prev) => {
      const next = updater(prev);
      persistSaveState(next);
      return next;
    });
  }, []);

  const totalStars = useMemo(
    () =>
      Object.values(saveState.results).reduce(
        (sum, res) => sum + (res?.stars ?? 0),
        0
      ),
    [saveState.results]
  );

  const handleChangeMode = useCallback(
    (mode: LearningMode) => {
      updateSave((prev) => ({ ...prev, mode }));
    },
    [updateSave]
  );

  const handleNavigate = useCallback((nextScreen: ScreenView) => {
    if (nextScreen !== 'play') {
      setSession(null);
    }
    setScreen(nextScreen);
  }, []);

  const handlePlayLevel = useCallback((idx: number) => {
    setSession(createFreshSession(idx));
    setScreen('play');
  }, []);

  const handleAddCoins = useCallback(
    (amount: number, withConfetti = false) => {
      setSession((prev) =>
        prev ? { ...prev, coins: prev.coins + amount } : prev
      );
      updateSave((prev) => ({ ...prev, coins: prev.coins + amount }));
      if (withConfetti) {
        setConfettiKey((k) => k + 1);
      }
    },
    [updateSave]
  );

  const handleFinishLevel = useCallback(() => {
    if (!session) return;
    const lvl = LEVELS[session.idx];
    let stars = 1;
    if (session.listenScore >= 2 && session.puzzleMistakes <= 1) {
      stars = 2;
    }
    if (
      session.listenScore === lvl.listening.length &&
      session.puzzleMistakes === 0
    ) {
      stars = 3;
    }

    setLastEarnedStars(stars);
    updateSave((prev) => {
      const existing = prev.results[lvl.id];
      const nextUnlocked =
        session.idx + 1 > prev.unlocked && session.idx + 1 < LEVELS.length
          ? session.idx + 1
          : prev.unlocked;

      return {
        ...prev,
        unlocked: nextUnlocked,
        results: {
          ...prev.results,
          [lvl.id]: {
            stars: Math.max(stars, existing?.stars ?? 0),
            listenScore: session.listenScore,
            speakInfo: session.speakInfo || 'Done',
            done: true,
          },
        },
      };
    });

    setConfettiKey((k) => k + 1);
    playFeedbackTone('win');
    setSession((prev) => (prev ? { ...prev, step: 6 } : prev));
  }, [session, updateSave]);

  const handleResetSave = useCallback(() => {
    const fresh = getDefaultSaveState();
    persistSaveState(fresh);
    setSaveState(fresh);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
      <TopBar
        coins={saveState.coins}
        stars={totalStars}
        screen={screen}
        onNavigate={handleNavigate}
      />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6 sm:py-8">
        {screen === 'start' && (
          <StartView
            levels={LEVELS}
            saveState={saveState}
            onChangeMode={handleChangeMode}
            onStart={() => handleNavigate('levels')}
            onOpenLevels={() => handleNavigate('levels')}
            onPlayLevel={handlePlayLevel}
          />
        )}

        {screen === 'levels' && (
          <LevelsView
            levels={LEVELS}
            saveState={saveState}
            onChangeMode={handleChangeMode}
            onPlayLevel={handlePlayLevel}
            onBackHome={() => handleNavigate('start')}
          />
        )}

        {screen === 'play' && session && (
          <PlayView
            level={LEVELS[session.idx]}
            session={session}
            mode={saveState.mode}
            totalLevels={LEVELS.length}
            computedStars={lastEarnedStars}
            onChangeMode={handleChangeMode}
            onExitToLevels={() => handleNavigate('levels')}
            onUpdateSession={(updater) =>
              setSession((prev) => (prev ? updater(prev) : prev))
            }
            onAddCoins={handleAddCoins}
            onFinishLevel={handleFinishLevel}
            onReplay={() => handlePlayLevel(session.idx)}
            onNextLevel={() => handlePlayLevel(session.idx + 1)}
          />
        )}

        {screen === 'settings' && (
          <SettingsView
            mode={saveState.mode}
            onChangeMode={handleChangeMode}
            onResetSave={handleResetSave}
            onBack={() => handleNavigate('levels')}
          />
        )}
      </main>

      <ConfettiBurst burstKey={confettiKey} />
      <OfflineBanner />
    </div>
  );
}
