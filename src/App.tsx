import { useState } from "react";
import { stages } from "./data/stages";
import { achievements, checkAchievements } from "./data/achievements";
import { useProgress } from "./hooks/useProgress";
import { useSound } from "./hooks/useSound";
import { HomePage } from "./pages/HomePage";
import { StagePage } from "./pages/StagePage";
import { SettingsPage } from "./pages/SettingsPage";
import { StatsPage } from "./pages/StatsPage";
import { FlashcardPage } from "./pages/FlashcardPage";
import { loadLeaderboard, addScore } from "./utils/leaderboard";
import { computeStats } from "./utils/stats";
import { generateQuickQuiz } from "./utils/quickQuiz";
import type { LeaderboardEntry, Stage } from "./types";

export default function App() {
  const sound = useSound();
  const { progress, updateStage, addAchievement, toggleFlashcardLesson, setDifficulty, reset } = useProgress();
  const [currentStageIndex, setCurrentStageIndex] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [quickQuizStage, setQuickQuizStage] = useState<Stage | null>(null);
  const [flashcardStage, setFlashcardStage] = useState<Stage | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(loadLeaderboard);

  if (currentStageIndex !== null) {
    const stage = stages[currentStageIndex];

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
          checkAchievements(completedCount, stages.length, stageStars, completedIds).forEach((id) => {
            if (!progress.achievements?.includes(id)) {
              addAchievement(id);
              newUnlock = true;
            }
          });
          if (newUnlock) setTimeout(() => sound.achievement(), 300);

          setCurrentStageIndex(null);
        }}
        onBack={() => setCurrentStageIndex(null)}
      />
    );
  }

  if (showSettings) {
    return (
      <SettingsPage
        soundEnabled={sound.enabled}
        onToggleSound={() => sound.setEnabled(!sound.enabled)}
        onReset={reset}
        onBack={() => setShowSettings(false)}
      />
    );
  }

  if (showStats) {
    return (
      <StatsPage
        stats={computeStats(progress, achievements.length)}
        onBack={() => setShowStats(false)}
        soundEnabled={sound.enabled}
        onToggleSound={() => sound.setEnabled(!sound.enabled)}
      />
    );
  }

  if (quickQuizStage) {
    return (
      <StagePage
        stage={quickQuizStage}
        onComplete={() => setQuickQuizStage(null)}
        onBack={() => setQuickQuizStage(null)}
        soundEnabled={sound.enabled}
        onToggleSound={() => sound.setEnabled(!sound.enabled)}
      />
    );
  }

  if (flashcardStage) {
    return (
      <FlashcardPage
        stage={flashcardStage}
        knownLessons={progress.flashcards?.[flashcardStage.id] ?? []}
        onToggleLesson={(lessonId) => toggleFlashcardLesson(flashcardStage.id, lessonId)}
        onBack={() => setFlashcardStage(null)}
      />
    );
  }

  return (
    <HomePage
      progress={progress}
      leaderboard={leaderboard}
      onSelectStage={setCurrentStageIndex}
      onFlashcards={(index) => setFlashcardStage(stages[index])}
      onSettings={() => setShowSettings(true)}
      onStats={() => setShowStats(true)}
      onQuickQuiz={() => setQuickQuizStage(generateQuickQuiz())}
      onReset={reset}
      soundEnabled={sound.enabled}
      onToggleSound={() => sound.setEnabled(!sound.enabled)}
    />
  );
}
