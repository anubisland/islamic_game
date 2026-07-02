export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function shuffleQuestions<T extends { options: string[]; correctIndex: number }>(
  questions: T[],
): T[] {
  const shuffled = shuffle(questions);
  return shuffled.map((q) => {
    const opts = q.options.map((text, idx) => ({ text, originalIndex: idx }));
    const shuffledOpts = shuffle(opts);
    const newCorrectIndex = shuffledOpts.findIndex((o) => o.originalIndex === q.correctIndex);
    return {
      ...q,
      options: shuffledOpts.map((o) => o.text),
      correctIndex: newCorrectIndex,
    };
  });
}
