import type { Achievement } from "../types";

interface Props {
  achievement: Achievement;
  unlocked: boolean;
  isNew?: boolean;
}

export function AchievementBadge({ achievement, unlocked, isNew }: Props) {
  return (
    <div
      style={{
        ...styles.badge,
        opacity: unlocked ? 1 : 0.4,
        filter: unlocked ? "none" : "grayscale(1)",
        animation: isNew ? "starPop 0.6s ease forwards" : "none",
      }}
    >
      <div style={{ fontSize: "1.8rem", marginBottom: "0.35rem" }}>
        {unlocked ? achievement.icon : "🔒"}
      </div>
      <strong style={{ fontSize: "0.8rem", color: unlocked ? "var(--green-primary)" : "var(--text-light)" }}>
        {achievement.title}
      </strong>
      <span style={{ fontSize: "0.72rem", color: "var(--text-light)", textAlign: "center", lineHeight: 1.4 }}>
        {achievement.description}
      </span>
      {isNew && (
        <span
          style={{
            position: "absolute",
            top: -6,
            left: -6,
            background: "var(--gold)",
            color: "#fff",
            borderRadius: "50%",
            width: 24,
            height: 24,
            fontSize: "0.7rem",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 6px rgba(212,160,43,0.4)",
          }}
        >
          جديد
        </span>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  badge: {
    background: "var(--card-bg)",
    borderRadius: 12,
    padding: "1rem 0.75rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.25rem",
    boxShadow: "var(--shadow)",
    border: "1px solid rgba(0,0,0,0.04)",
    position: "relative",
    width: 130,
    flex: "1 1 100px",
    maxWidth: 140,
    transition: "opacity 0.3s, filter 0.3s",
  },
};
