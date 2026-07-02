import { useState } from "react";
import type { Stage, StageProgress } from "../types";

interface Props {
  stage: Stage;
  progress?: StageProgress;
  locked: boolean;
  onClick: () => void;
}

export function StageCard({ stage, progress, locked, onClick }: Props) {
  const [hovered, setHovered] = useState(false);
  const stars = progress?.stars ?? 0;
  const completed = progress?.completed ?? false;

  let borderColor = "transparent";
  let bg = "var(--card-bg)";
  if (locked) {
    bg = "var(--cream)";
  } else if (completed) {
    borderColor = "var(--gold)";
  } else {
    borderColor = "var(--green-light)";
  }

  return (
    <button
      onClick={locked ? undefined : onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={locked}
      style={{
        ...styles.card,
        opacity: locked ? 0.55 : 1,
        cursor: locked ? "not-allowed" : "pointer",
        background: bg,
        borderColor,
        transform: hovered && !locked ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered && !locked ? "var(--shadow-lg)" : "var(--shadow)",
      }}
    >
      <div
        style={{
          ...styles.icon,
          filter: locked ? "grayscale(1)" : "none",
          animation: hovered && !locked ? "pulse 1s ease infinite" : "none",
        }}
      >
        {stage.icon}
      </div>

      <h3 style={{ ...styles.title, color: locked ? "var(--text-light)" : "var(--green-primary)" }}>
        {stage.title}
      </h3>

      <p style={styles.subtitle}>{stage.subtitle}</p>

      {completed && (
        <div style={styles.stars}>
          {Array.from({ length: 3 }, (_, i) => (
            <span
              key={i}
              style={{
                color: i < stars ? "var(--gold)" : "#ddd",
                animation: i < stars ? `starPop 0.5s ease ${i * 0.15}s forwards` : "none",
                display: "inline-block",
              }}
            >
              ★
            </span>
          ))}
        </div>
      )}

      {completed && (
        <span
          style={{
            fontSize: "0.75rem",
            color: "var(--green-light)",
            fontWeight: 600,
          }}
        >
          ✓ مكتمل
        </span>
      )}

      {locked && (
        <div style={styles.lockWrap}>
          <span style={styles.lockIcon}>🔒</span>
          <span style={styles.lockText}>غير متاح</span>
        </div>
      )}
    </button>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    borderRadius: "var(--radius)",
    padding: "1.5rem 1.25rem",
    boxShadow: "var(--shadow)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
    transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s, opacity 0.3s",
    border: "2px solid",
    minWidth: 160,
    flex: "1 1 180px",
    maxWidth: 260,
  },
  icon: { fontSize: "2.5rem", transition: "filter 0.3s", marginBottom: "0.25rem" },
  title: { fontSize: "1.1rem", fontWeight: 700, transition: "color 0.3s" },
  subtitle: {
    fontSize: "0.82rem",
    color: "var(--text-light)",
    textAlign: "center",
    lineHeight: 1.5,
  },
  stars: { display: "flex", gap: "0.35rem", fontSize: "1.3rem", marginTop: "0.25rem" },
  lockWrap: {
    display: "flex",
    alignItems: "center",
    gap: "0.35rem",
    marginTop: "0.25rem",
  },
  lockIcon: { fontSize: "1.2rem" },
  lockText: { fontSize: "0.8rem", color: "var(--text-light)", fontWeight: 600 },
};
