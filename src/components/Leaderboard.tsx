import type { LeaderboardEntry } from "../types";

interface Props {
  entries: LeaderboardEntry[];
}

export function Leaderboard({ entries }: Props) {
  if (entries.length === 0) return null;

  return (
    <div
      className="animate-fade-in"
      style={{
        background: "var(--card-bg)",
        borderRadius: "var(--radius)",
        padding: "1rem",
        boxShadow: "var(--shadow)",
        maxWidth: 500,
        margin: "0 auto",
      }}
    >
      <h3
        style={{
          textAlign: "center",
          fontSize: "1rem",
          fontWeight: 700,
          color: "var(--green-primary)",
          marginBottom: "1rem",
        }}
      >
        🏆 أفضل النتائج
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {entries.map((e, i) => {
          const pct = Math.round((e.score / e.total) * 100);
          const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`;
          return (
            <div
              key={`${e.stageId}-${e.date}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.6rem 0.75rem",
                background: i < 3 ? "rgba(212,160,43,0.06)" : "transparent",
                borderRadius: 8,
                borderBottom: i < entries.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              <span style={{ fontSize: "1.1rem", minWidth: 28, textAlign: "center" }}>
                {medal}
              </span>
              <span style={{ fontSize: "1.2rem" }}>{e.stageIcon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{e.stageTitle}</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-light)" }}>
                  {e.score}/{e.total} • {new Date(e.date).toLocaleDateString("ar-SA")}
                </div>
              </div>
              <div
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: pct >= 90 ? "var(--gold)" : pct >= 60 ? "var(--green-light)" : "var(--text-light)",
                  whiteSpace: "nowrap",
                }}
              >
                {pct}%
              </div>
              <div style={{ display: "flex", gap: "0.15rem" }}>
                {Array.from({ length: e.stars }, (_, j) => (
                  <span key={j} style={{ color: "var(--gold)", fontSize: "0.8rem" }}>★</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
