import type { Stage, Question } from "../types";
import { shuffleQuestions } from "./shuffle";

const QUIZ_SIZE = 10;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateQuickQuiz(
  stages: Stage[],
  title = "اختبار سريع",
  subtitle = "10 أسئلة عشوائية من جميع المراحل",
): Stage {
  const allQuestions: Question[] = [];
  for (const stage of stages) {
    for (const q of stage.questions) {
      allQuestions.push(q);
    }
  }

  const picked = shuffle(allQuestions).slice(0, Math.min(QUIZ_SIZE, allQuestions.length));
  const shuffled = shuffleQuestions(picked);

  return {
    id: "quick-quiz",
    title,
    subtitle,
    icon: "⚡",
    lessons: [],
    questions: shuffled,
  };
}
