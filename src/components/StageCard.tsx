import type { Stage, StageProgress } from "../types";

interface Props {
  stage: Stage;
  progress?: StageProgress;
  locked: boolean;
  onClick: () => void;
}

export function StageCard({ stage, progress, locked, onClick }: Props) {
  const stars = progress?.stars ?? 0;

  return (
    <button
      onClick={locked ? undefined : onClick}
      style={{
        ...styles.card,
        opacity: locked ? 0.5 : 1,
        cursor: locked ? "not-allowed" : "pointer",
      }}
      disabled={locked}
    >
      <div style={styles.icon}>{stage.icon}</div>
      <h3 style={styles.title}>{stage.title}</h3>
      <p style={styles.subtitle}>{stage.subtitle}</p>

      {progress?.completed && (
        <div style={styles.stars}>
          {Array.from({ length: 3 }, (_, i) => (
            <span key={i} style={{ color: i < stars ? "var(--gold)" : "#ddd" }}>
              ★
            </span>
          ))}
        </div>
      )}

      {locked && <span style={styles.lock}>🔒</span>}
    </button>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: "var(--card-bg)",
    borderRadius: "var(--radius)",
    padding: "1.5rem",
    boxShadow: "var(--shadow)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
    transition: "transform 0.2s, box-shadow 0.2s",
    border: "2px solid transparent",
    minWidth: 200,
  },
  icon: { fontSize: "2.5rem" },
  title: { fontSize: "1.15rem", fontWeight: 700, color: "var(--green-primary)" },
  subtitle: { fontSize: "0.85rem", color: "var(--text-light)", textAlign: "center" },
  stars: { display: "flex", gap: "0.25rem", fontSize: "1.25rem" },
  lock: { fontSize: "1.5rem", marginTop: "0.25rem" },
};
