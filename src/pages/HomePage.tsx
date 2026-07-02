import type { GameProgress } from "../types";
import { stages } from "../data/stages";
import { StageCard } from "../components/StageCard";
import { Header } from "../components/Header";

interface Props {
  progress: GameProgress;
  onSelectStage: (index: number) => void;
  onReset: () => void;
}

export function HomePage({ progress, onSelectStage, onReset }: Props) {
  const completedCount = Object.values(progress.stages).filter((s) => s.completed).length;

  return (
    <div>
      <Header />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
        <div
          style={{
            textAlign: "center",
            marginBottom: "2rem",
            background: "var(--card-bg)",
            borderRadius: "var(--radius)",
            padding: "1.5rem",
            boxShadow: "var(--shadow)",
          }}
        >
          <p style={{ fontSize: "1rem", color: "var(--text-light)" }}>
            أكملت {completedCount} من {stages.length} مراحل
          </p>
          <div
            style={{
              height: 8,
              background: "#e0e0e0",
              borderRadius: 4,
              marginTop: "0.75rem",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${(completedCount / stages.length) * 100}%`,
                background: "linear-gradient(90deg, var(--green-light), var(--gold))",
                borderRadius: 4,
                transition: "width 0.4s",
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "center",
          }}
        >
          {stages.map((stage, i) => {
            const prev = i === 0 ? undefined : progress.stages[stages[i - 1].id];
            const locked = i > 0 && !prev?.completed;
            return (
              <StageCard
                key={stage.id}
                stage={stage}
                progress={progress.stages[stage.id]}
                locked={locked}
                onClick={() => onSelectStage(i)}
              />
            );
          })}
        </div>

        {completedCount > 0 && (
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <button
              onClick={onReset}
              style={{
                background: "transparent",
                color: "var(--text-light)",
                padding: "0.4rem 1.2rem",
                borderRadius: 8,
                border: "1px solid #ccc",
                fontSize: "0.8rem",
              }}
            >
              إعادة تعيين التقدم
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
