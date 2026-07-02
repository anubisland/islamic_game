import { useState, useCallback } from "react";
import type { GameProgress } from "../types";
import { loadProgress, saveProgress, updateStageProgress } from "../utils/storage";

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

  const reset = useCallback(() => {
    const empty: GameProgress = { stages: {} };
    setProgress(empty);
    saveProgress(empty);
  }, []);

  return { progress, updateStage, reset };
}
