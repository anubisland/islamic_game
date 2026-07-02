import { stages } from "../data/stages";
import type { Question } from "../types";

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function shuffleArray<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  let m = result.length;
  while (m) {
    m--;
    seed = seed * 16807 + 1;
    const i = Math.floor(seededRandom(seed) * (m + 1));
    [result[m], result[i]] = [result[i], result[m]];
  }
  return result;
}

export function generateDailyQuiz(): Question[] {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

  const allQuestions = stages.flatMap((s) => s.questions);
  const shuffled = shuffleArray(allQuestions, seed);
  return shuffled.slice(0, 5);
}

export function getDailyChallengeDate(): string {
  return new Date().toISOString().slice(0, 10);
}
