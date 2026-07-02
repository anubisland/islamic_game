import type { GameProgress, StageProgress } from "../types";

const STORAGE_KEY = "islamic-quest-progress";

export function loadProgress(): GameProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as GameProgress;
  } catch {
    /* ignore corrupt data */
  }
  return { stages: {} };
}

export function saveProgress(progress: GameProgress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function updateStageProgress(
  progress: GameProgress,
  stageId: string,
  updates: Partial<StageProgress>,
): GameProgress {
  const next = { ...progress };
  next.stages = {
    ...next.stages,
    [stageId]: { ...next.stages[stageId], ...updates, stageId },
  };
  return next;
}
