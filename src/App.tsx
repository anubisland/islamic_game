import { useState } from "react";
import { stages } from "./data/stages";
import { checkAchievements } from "./data/achievements";
import { useProgress } from "./hooks/useProgress";
import { useSound } from "./hooks/useSound";
import { HomePage } from "./pages/HomePage";
import { StagePage } from "./pages/StagePage";
import { loadLeaderboard, addScore } from "./utils/leaderboard";
import type { LeaderboardEntry } from "./types";

export default function App() {
  const sound = useSound();
  const { progress, updateStage, addAchievement, reset } = useProgress();
  const [currentStageIndex, setCurrentStageIndex] = useState<number | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(loadLeaderboard);

  if (currentStageIndex !== null) {
    const stage = stages[currentStageIndex];
    const prevStage = currentStageIndex > 0 ? stages[currentStageIndex - 1] : null;
    const prevProgress = prevStage ? progress.stages[prevStage.id] : undefined;

    return (
      <StagePage
        stage={stage}
        prevProgress={prevProgress}
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
          checkAchievements(completedCount, stages.length, stageStars).forEach((id) => {
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

  return (
    <HomePage
      progress={progress}
      leaderboard={leaderboard}
      onSelectStage={setCurrentStageIndex}
      onReset={reset}
    />
  );
}
