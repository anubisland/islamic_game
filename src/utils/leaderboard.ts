import type { LeaderboardEntry } from "../types";

const STORAGE_KEY = "islamic-quest-leaderboard";
const MAX_ENTRIES = 10;

export function loadLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const entries = JSON.parse(raw) as LeaderboardEntry[];
      // Deduplicate: keep only the latest entry per stageId
      const seen = new Map<string, LeaderboardEntry>();
      for (const e of entries) {
        const existing = seen.get(e.stageId);
        if (!existing || new Date(e.date).getTime() > new Date(existing.date).getTime()) {
          seen.set(e.stageId, e);
        }
      }
      const deduped = [...seen.values()].sort((a, b) => {
        const pctA = a.score / a.total;
        const pctB = b.score / b.total;
        if (pctB !== pctA) return pctB - pctA;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      // If data was deduplicated, clean up localStorage for next load
      if (deduped.length < entries.length) {
        saveLeaderboard(deduped);
      }
      return deduped;
    }
  } catch {
    /* ignore */
  }
  return [];
}

export function saveLeaderboard(entries: LeaderboardEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function addScore(
  entry: LeaderboardEntry,
): LeaderboardEntry[] {
  const current = loadLeaderboard();
  // Remove any previous entry for the same stage so each stage appears once (best result)
  const filtered = current.filter(e => e.stageId !== entry.stageId);
  filtered.push(entry);
  filtered.sort((a, b) => {
    const pctA = a.score / a.total;
    const pctB = b.score / b.total;
    if (pctB !== pctA) return pctB - pctA;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  const trimmed = filtered.slice(0, MAX_ENTRIES);
  saveLeaderboard(trimmed);
  return trimmed;
}
