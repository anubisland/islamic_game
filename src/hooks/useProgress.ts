import { useState, useCallback } from "react";
import type { Difficulty, GameProgress } from "../types";
import {
  loadProgress,
  saveProgress,
  updateStageProgress,
  addAchievement as addAchievementUtil,
} from "../utils/storage";

export function useProgress() {
  const [progress, setProgress] = useState<GameProgress>(loadProgress);

  const save = useCallback((next: GameProgress) => {
    setProgress(next);
    saveProgress(next);
  }, []);

  const updateStage = useCallback(
    (stageId: string, updates: Parameters<typeof updateStageProgress>[2]) => {
      save(updateStageProgress(progress, stageId, updates));
    },
    [progress, save],
  );

  const addAchievement = useCallback(
    (achievementId: string) => {
      save(addAchievementUtil(progress, achievementId));
    },
    [progress, save],
  );

  const toggleFlashcardLesson = useCallback(
    (stageId: string, lessonId: string) => {
      const current = progress.flashcards?.[stageId] ?? [];
      const next = current.includes(lessonId)
        ? current.filter((id) => id !== lessonId)
        : [...current, lessonId];
      save({
        ...progress,
        flashcards: { ...progress.flashcards, [stageId]: next },
      });
    },
    [progress, save],
  );

  const setDifficulty = useCallback(
    (d: Difficulty) => {
      save({ ...progress, difficulty: d });
    },
    [progress, save],
  );

  const reset = useCallback(() => {
    const empty: GameProgress = { stages: {}, achievements: [] };
    setProgress(empty);
    saveProgress(empty);
  }, []);

  return { progress, updateStage, addAchievement, toggleFlashcardLesson, setDifficulty, reset };
}
