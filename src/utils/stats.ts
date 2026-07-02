import type { GameProgress } from "../types";
import { stages } from "../data/stages";

export interface GameStats {
  totalQuestionsAnswered: number;
  totalCorrect: number;
  overallPercent: number;
  stagesCompleted: number;
  totalStages: number;
  totalStars: number;
  maxStars: number;
  achievementsUnlocked: number;
  totalAchievements: number;
  bestStage: { title: string; icon: string; percent: number } | null;
  stageBreakdown: {
    id: string;
    title: string;
    icon: string;
    completed: boolean;
    stars: number;
    percent: number;
  }[];
}

export function computeStats(
  progress: GameProgress,
  totalAchievements: number,
): GameStats {
  let totalQuestionsAnswered = 0;
  let totalCorrect = 0;
  let totalStars = 0;
  let stagesCompleted = 0;
  const maxStars = stages.length * 3;
  let bestStage: GameStats["bestStage"] = null;

  const stageBreakdown = stages.map((s) => {
    const sp = progress.stages[s.id];
    const completed = sp?.completed ?? false;
    const stars = sp?.stars ?? 0;
    const percent = sp && sp.totalQuestions > 0 ? Math.round((sp.score / sp.totalQuestions) * 100) : 0;

    if (completed) {
      stagesCompleted++;
      totalStars += stars;
      totalQuestionsAnswered += sp!.totalQuestions;
      totalCorrect += sp!.score;
      if (!bestStage || percent > bestStage.percent) {
        bestStage = { title: s.title, icon: s.icon, percent };
      }
    }

    return { id: s.id, title: s.title, icon: s.icon, completed, stars, percent };
  });

  return {
    totalQuestionsAnswered,
    totalCorrect,
    overallPercent: totalQuestionsAnswered > 0 ? Math.round((totalCorrect / totalQuestionsAnswered) * 100) : 0,
    stagesCompleted,
    totalStages: stages.length,
    totalStars,
    maxStars,
    achievementsUnlocked: progress.achievements?.length ?? 0,
    totalAchievements,
    bestStage,
    stageBreakdown,
  };
}
