import type { LeaderboardEntry } from "../types";

const STORAGE_KEY = "islamic-quest-leaderboard";
const MAX_ENTRIES = 10;

export function loadLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as LeaderboardEntry[];
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
  current.push(entry);
  current.sort((a, b) => {
    const pctA = a.score / a.total;
    const pctB = b.score / b.total;
    if (pctB !== pctA) return pctB - pctA;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  const trimmed = current.slice(0, MAX_ENTRIES);
  saveLeaderboard(trimmed);
  return trimmed;
}
