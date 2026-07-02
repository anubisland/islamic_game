export interface Stage {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  lessons: Lesson[];
  questions: Question[];
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface StageProgress {
  stageId: string;
  completed: boolean;
  score: number;
  totalQuestions: number;
  stars: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  stageId?: string;
}

export interface LeaderboardEntry {
  stageId: string;
  stageTitle: string;
  stageIcon: string;
  score: number;
  total: number;
  stars: number;
  date: string;
}

export type Difficulty = "practice" | "easy" | "normal" | "hard";

export interface GameProgress {
  stages: Record<string, StageProgress>;
  achievements: string[];
  flashcards?: Record<string, string[]>;
  difficulty?: Difficulty;
}
