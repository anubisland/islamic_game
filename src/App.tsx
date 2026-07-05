import { useEffect, useState } from "react";
import { achievements, checkAchievements } from "./data/achievements";
import { useProgress } from "./hooks/useProgress";
import { useSound } from "./hooks/useSound";
import { useTranslation } from "./i18n";
import { HomePage } from "./pages/HomePage";
import { StagePage } from "./pages/StagePage";
import { SettingsPage } from "./pages/SettingsPage";
import { StatsPage } from "./pages/StatsPage";
import { FlashcardPage } from "./pages/FlashcardPage";
import { GameHub } from "./pages/GameHub";
import { ArchitectHome } from "./games/architect/pages/ArchitectHome";
import { PuzzlePage } from "./games/architect/pages/PuzzlePage";
import type { ArchitectStage } from "./games/architect/data/stages";
import { JourneyMap } from "./games/battuta/pages/JourneyMap";
import { CityStage } from "./games/battuta/pages/CityStage";
import type { BattutaStage } from "./games/battuta/data/stages";
import { WordSeaHome } from "./games/wordsea/pages/WordSeaHome";
import { WordStagePage } from "./games/wordsea/pages/WordStage";
import type { WordStage } from "./games/wordsea/data/stages";
import { DetectiveHome } from "./games/detective/pages/DetectiveHome";
import { CaseStage } from "./games/detective/pages/CaseStage";
import type { DetectiveStage } from "./games/detective/data/stages";
import { MarketHome } from "./games/market/pages/MarketHome";
import { loadLeaderboard, addScore } from "./utils/leaderboard";
import { computeStats } from "./utils/stats";
import { generateQuickQuiz } from "./utils/quickQuiz";
import { generateDailyQuiz, getDailyChallengeDate } from "./utils/dailyQuiz";
import { saveProgress } from "./utils/storage";
import type { LeaderboardEntry, Stage } from "./types";

const GAMES_STORAGE_KEY = "islamic-game-all-progress";

interface GamesProgress {
  architectCompleted: string[];
  architectStars: Record<string, number>;
  battutaCompleted: string[];
  wordseaCompleted: string[];
  detectiveCompleted: string[];
}

function loadGamesProgress(): GamesProgress {
  try {
    const raw = localStorage.getItem(GAMES_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return {
    architectCompleted: [],
    architectStars: {},
    battutaCompleted: [],
    wordseaCompleted: [],
    detectiveCompleted: [],
  };
}

function saveGamesProgress(data: GamesProgress): void {
  localStorage.setItem(GAMES_STORAGE_KEY, JSON.stringify(data));
}

type Screen =
  | { id: "hub" }
  | { id: "home" }
  | { id: "stage"; index: number }
  | { id: "settings" }
  | { id: "stats" }
  | { id: "quick-quiz" }
  | { id: "flashcard"; index: number }
  | { id: "daily" }
  | { id: "architect" }
  | { id: "architect-puzzle"; stage: ArchitectStage }
  | { id: "battuta" }
  | { id: "battuta-stage"; stage: BattutaStage }
  | { id: "wordsea" }
  | { id: "wordsea-stage"; stage: WordStage }
  | { id: "detective" }
  | { id: "detective-stage"; stage: DetectiveStage }
  | { id: "market" };

export default function App() {
  const sound = useSound();
  const { progress, updateStage, addAchievement, toggleFlashcardLesson, setDifficulty, reset } = useProgress();
  const { stages, lang } = useTranslation();
  const [screen, setScreen] = useState<Screen>({ id: "hub" });
  const [dailyDate, setDailyDate] = useState(() => localStorage.getItem("daily-challenge-date") ?? "");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(loadLeaderboard);
  const [initialLoad] = useState(() => loadGamesProgress());
  const [battutaCompleted, setBattutaCompleted] = useState<Set<string>>(new Set(initialLoad.battutaCompleted));
  const [wordseaCompleted, setWordseaCompleted] = useState<Set<string>>(new Set(initialLoad.wordseaCompleted));
  const [detectiveCompleted, setDetectiveCompleted] = useState<Set<string>>(new Set(initialLoad.detectiveCompleted));
  const [architectCompleted, setArchitectCompleted] = useState<Set<string>>(new Set(initialLoad.architectCompleted));
  const [architectStars, setArchitectStars] = useState<Record<string, number>>(initialLoad.architectStars);

  useEffect(() => {
    saveGamesProgress({
      architectCompleted: [...architectCompleted],
      architectStars,
      battutaCompleted: [...battutaCompleted],
      wordseaCompleted: [...wordseaCompleted],
      detectiveCompleted: [...detectiveCompleted],
    });
  }, [architectCompleted, architectStars, battutaCompleted, wordseaCompleted, detectiveCompleted]);

  function handleReset() {
    reset();
    setLeaderboard([]);
    setArchitectCompleted(new Set());
    setArchitectStars({});
    setBattutaCompleted(new Set());
    setWordseaCompleted(new Set());
    setDetectiveCompleted(new Set());
    localStorage.removeItem("islamic-quest-leaderboard");
    localStorage.removeItem("daily-challenge-date");
    localStorage.removeItem(GAMES_STORAGE_KEY);
    setDailyDate("");
  }

  if (screen.id === "stage") {
    const stage = stages[screen.index];
    return (
      <StagePage
        stage={stage}
        difficulty={progress.difficulty ?? "normal"}
        onSetDifficulty={setDifficulty}
        soundEnabled={sound.enabled}
        onToggleSound={() => sound.setEnabled(!sound.enabled)}
        onComplete={(score, total) => {
          const stars = score >= total * 0.9 ? 3 : score >= total * 0.6 ? 2 : score > 0 ? 1 : 0;
          updateStage(stage.id, { completed: true, score, totalQuestions: total, stars });

          const entry: LeaderboardEntry = {
            stageId: stage.id,
            stageTitle: stage.title,
            stageIcon: stage.icon,
            score,
            total,
            stars,
            date: new Date().toISOString(),
          };
          setLeaderboard(addScore(entry));

          const alreadyCompleted = Object.values(progress.stages).filter((s) => s.completed).length;
          const completedCount = alreadyCompleted + (progress.stages[stage.id]?.completed ? 0 : 1);
          const stageStars: Record<string, number> = {};
          Object.entries(progress.stages).forEach(([id, p]) => {
            stageStars[id] = p.stars;
          });
          stageStars[stage.id] = stars;

          let newUnlock = false;
          const completedIds = Object.entries(progress.stages)
            .filter(([, p]) => p.completed)
            .map(([id]) => id);
          if (!completedIds.includes(stage.id) && stars > 0) completedIds.push(stage.id);
          const perfectStageIds = Object.entries(progress.stages)
            .filter(([, p]) => p.score === p.totalQuestions && p.totalQuestions > 0)
            .map(([id]) => id);
          if (score === total) perfectStageIds.push(stage.id);
          checkAchievements(completedCount, stages.length, stageStars, completedIds, perfectStageIds).forEach((id) => {
            if (!progress.achievements?.includes(id)) {
              addAchievement(id);
              newUnlock = true;
            }
          });
          if (newUnlock) setTimeout(() => sound.achievement(), 300);

          setScreen({ id: "home" });
        }}
        onBack={() => setScreen({ id: "home" })}
      />
    );
  }

  if (screen.id === "home") {
    return (
      <HomePage
        progress={progress}
        leaderboard={leaderboard}
        onSelectStage={(index) => setScreen({ id: "stage", index })}
        onFlashcards={(index) => setScreen({ id: "flashcard", index })}
        onSettings={() => setScreen({ id: "settings" })}
        onStats={() => setScreen({ id: "stats" })}
        onQuickQuiz={() => setScreen({ id: "quick-quiz" })}
        onDailyChallenge={() => setScreen({ id: "daily" })}
        dailyCompleted={dailyDate === getDailyChallengeDate()}
        onReset={handleReset}
        soundEnabled={sound.enabled}
        onToggleSound={() => sound.setEnabled(!sound.enabled)}
        onBackToHub={() => setScreen({ id: "hub" })}
      />
    );
  }

  if (screen.id === "settings") {
    return (
      <SettingsPage
        soundEnabled={sound.enabled}
        onToggleSound={() => sound.setEnabled(!sound.enabled)}
        onReset={handleReset}
        onBack={() => setScreen({ id: "home" })}
        progress={progress}
        onImportProgress={(data) => {
          saveProgress(data);
          window.location.reload();
        }}
      />
    );
  }

  if (screen.id === "stats") {
    return (
      <StatsPage
        stats={computeStats(progress, achievements.length, stages)}
        onBack={() => setScreen({ id: "home" })}
        soundEnabled={sound.enabled}
        onToggleSound={() => sound.setEnabled(!sound.enabled)}
      />
    );
  }

  if (screen.id === "quick-quiz") {
    const qqTitle = lang === "ar" ? "اختبار سريع" : "Quick Quiz";
    const qqSubtitle = lang === "ar" ? "10 أسئلة عشوائية من جميع المراحل" : "10 random questions from all stages";
    const quizStage = generateQuickQuiz(stages, qqTitle, qqSubtitle);
    return (
      <StagePage
        stage={quizStage}
        onComplete={() => setScreen({ id: "hub" })}
        onBack={() => setScreen({ id: "hub" })}
        soundEnabled={sound.enabled}
        onToggleSound={() => sound.setEnabled(!sound.enabled)}
      />
    );
  }

  if (screen.id === "flashcard") {
    const stage = stages[screen.index];
    return (
      <FlashcardPage
        stage={stage}
        knownLessons={progress.flashcards?.[stage.id] ?? []}
        onToggleLesson={(lessonId) => toggleFlashcardLesson(stage.id, lessonId)}
        onBack={() => setScreen({ id: "home" })}
      />
    );
  }

  if (screen.id === "architect") {
    return (
      <ArchitectHome
        onSelectPuzzle={(stage) => setScreen({ id: "architect-puzzle", stage })}
        onBack={() => setScreen({ id: "hub" })}
        completedPuzzles={Object.fromEntries([...architectCompleted].map(id => [id, true]))}
        puzzleStars={architectStars}
        soundEnabled={sound.enabled}
        onToggleSound={() => sound.setEnabled(!sound.enabled)}
      />
    );
  }

  if (screen.id === "architect-puzzle") {
    return (
      <PuzzlePage
        stage={screen.stage}
        onComplete={(stageId, stars) => {
          const newCompleted = new Set(architectCompleted);
          newCompleted.add(stageId);
          setArchitectCompleted(newCompleted);
          setArchitectStars(prev => ({ ...prev, [stageId]: stars }));
          setScreen({ id: "architect" });
        }}
        onBack={() => setScreen({ id: "architect" })}
      />
    );
  }

  if (screen.id === "battuta") {
    return (
      <JourneyMap
        onSelectStage={(stage) => setScreen({ id: "battuta-stage", stage })}
        onBack={() => setScreen({ id: "hub" })}
        completed={battutaCompleted}
      />
    );
  }

  if (screen.id === "battuta-stage") {
    return (
      <CityStage
        stage={screen.stage}
        onComplete={(stageId) => {
          const newCompleted = new Set(battutaCompleted);
          newCompleted.add(stageId);
          setBattutaCompleted(newCompleted);
          setScreen({ id: "battuta" });
        }}
        onBack={() => setScreen({ id: "battuta" })}
      />
    );
  }

  if (screen.id === "wordsea") {
    return (
      <WordSeaHome
        onSelectStage={(stage) => setScreen({ id: "wordsea-stage", stage })}
        onBack={() => setScreen({ id: "hub" })}
        completed={wordseaCompleted}
      />
    );
  }

  if (screen.id === "wordsea-stage") {
    return (
      <WordStagePage
        stage={screen.stage}
        onComplete={(stageId) => {
          const newCompleted = new Set(wordseaCompleted);
          newCompleted.add(stageId);
          setWordseaCompleted(newCompleted);
          setScreen({ id: "wordsea" });
        }}
        onBack={() => setScreen({ id: "wordsea" })}
      />
    );
  }

  if (screen.id === "detective") {
    return (
      <DetectiveHome
        onSelectStage={(stage) => setScreen({ id: "detective-stage", stage })}
        onBack={() => setScreen({ id: "hub" })}
        completed={detectiveCompleted}
        lang={lang}
      />
    );
  }

  if (screen.id === "detective-stage") {
    return (
      <CaseStage
        stage={screen.stage}
        lang={lang}
        onComplete={() => {
          const newCompleted = new Set(detectiveCompleted);
          newCompleted.add(screen.stage.id);
          setDetectiveCompleted(newCompleted);
          setScreen({ id: "detective" });
        }}
      />
    );
  }

  if (screen.id === "market") {
    return (
      <MarketHome
        lang={lang}
        onBack={() => setScreen({ id: "hub" })}
      />
    );
  }

  if (screen.id === "daily") {
    const today = getDailyChallengeDate();
    const dailyTitle = lang === "ar"
      ? `التحدي اليومي — ${today}`
      : `Daily Challenge — ${today}`;
    const dailyStage: Stage = {
      id: "daily",
      title: dailyTitle,
      subtitle: lang === "ar" ? "5 أسئلة عشوائية من جميع المراحل" : "5 random questions from all stages",
      icon: "⏱️",
      lessons: [],
      questions: generateDailyQuiz(stages),
    };
    return (
      <StagePage
        stage={dailyStage}
        onComplete={() => {
          localStorage.setItem("daily-challenge-date", today);
          setDailyDate(today);
          setScreen({ id: "hub" });
        }}
        onBack={() => setScreen({ id: "hub" })}
        soundEnabled={sound.enabled}
        onToggleSound={() => sound.setEnabled(!sound.enabled)}
      />
    );
  }

  return (
    <GameHub
      onSelectGame={(gameId) => {
        if (gameId === "faith-journey") setScreen({ id: "home" });
        if (gameId === "architect") setScreen({ id: "architect" });
        if (gameId === "battuta") setScreen({ id: "battuta" });
        if (gameId === "wordsea") setScreen({ id: "wordsea" });
        if (gameId === "detective") setScreen({ id: "detective" });
        if (gameId === "market") setScreen({ id: "market" });
      }}
      soundEnabled={sound.enabled}
      onToggleSound={() => sound.setEnabled(!sound.enabled)}
    />
  );
}
