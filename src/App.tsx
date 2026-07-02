import { useState } from "react";
import { stages } from "./data/stages";
import { useProgress } from "./hooks/useProgress";
import { HomePage } from "./pages/HomePage";
import { StagePage } from "./pages/StagePage";

export default function App() {
  const { progress, updateStage, reset } = useProgress();
  const [currentStageIndex, setCurrentStageIndex] = useState<number | null>(null);

  if (currentStageIndex !== null) {
    const stage = stages[currentStageIndex];
    const prevStage = currentStageIndex > 0 ? stages[currentStageIndex - 1] : null;
    const prevProgress = prevStage ? progress.stages[prevStage.id] : undefined;

    return (
      <StagePage
        stage={stage}
        prevProgress={prevProgress}
        onComplete={(score, total) => {
          const stars = score >= total * 0.9 ? 3 : score >= total * 0.6 ? 2 : score > 0 ? 1 : 0;
          updateStage(stage.id, { completed: true, score, totalQuestions: total, stars });
          setCurrentStageIndex(null);
        }}
        onBack={() => setCurrentStageIndex(null)}
      />
    );
  }

  return (
    <HomePage
      progress={progress}
      onSelectStage={setCurrentStageIndex}
      onReset={reset}
    />
  );
}
