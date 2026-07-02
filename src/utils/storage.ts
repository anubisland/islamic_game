import type { GameProgress, StageProgress } from "../types";

const STORAGE_KEY = "islamic-quest-progress";

export function loadProgress(): GameProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as GameProgress;
      return { stages: parsed.stages ?? {}, achievements: parsed.achievements ?? [] };
    }
  } catch {
    /* ignore corrupt data */
  }
  return { stages: {}, achievements: [] };
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

export function addAchievement(
  progress: GameProgress,
  achievementId: string,
): GameProgress {
  if (progress.achievements.includes(achievementId)) return progress;
  return { ...progress, achievements: [...progress.achievements, achievementId] };
}
