import type { GameStats } from "../utils/stats";
import { Header } from "../components/Header";

interface Props {
  stats: GameStats;
  onBack: () => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
}

export function StatsPage({ stats, onBack, soundEnabled, onToggleSound }: Props) {
  const pct = stats.stagesCompleted > 0
    ? Math.round((stats.stagesCompleted / stats.totalStages) * 100)
    : 0;

  return (
    <div>
      <Header onHome={onBack} title="الإحصاءات" soundEnabled={soundEnabled} onToggleSound={onToggleSound} />

      <div style={{ maxWidth: 500, margin: "0 auto", padding: "1rem 0.6rem" }}>
        <div className="animate-fade-in-up" style={cardStyle}>
          <h2 style={{ textAlign: "center", color: "var(--green-primary)", fontSize: "1.15rem", marginBottom: "1.25rem" }}>
            📊 الإحصاءات
          </h2>

          <div style={gridStyle}>
            <StatBox label="المراحل" value={`${stats.stagesCompleted}/${stats.totalStages}`} icon="📚" />
            <StatBox label="النجوم" value={`${stats.totalStars}/${stats.maxStars}`} icon="⭐" color="var(--gold)" />
            <StatBox
              label="نسبة النجاح"
              value={`${stats.overallPercent}%`}
              icon="🎯"
              color={
                stats.overallPercent >= 90 ? "var(--green-light)" : stats.overallPercent >= 60 ? "var(--gold)" : "#e74c3c"
              }
            />
            <StatBox label="الشارات" value={`${stats.achievementsUnlocked}/${stats.totalAchievements}`} icon="🏅" />
          </div>

          {stats.stagesCompleted > 0 && (
            <>
              <div style={{ marginTop: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.35rem" }}>
                  <span style={{ color: "var(--text-light)" }}>📈 التقدم الكلي</span>
                  <span style={{ fontWeight: 700, color: "var(--green-primary)" }}>{pct}%</span>
                </div>
                <div style={{ height: 10, background: "var(--progress-bg)", borderRadius: 5, overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${pct}%`,
                      background: "linear-gradient(90deg, var(--green-light), var(--gold))",
                      borderRadius: 5,
                      transition: "width 0.6s",
                    }}
                  />
                </div>
              </div>

              {stats.totalStars > 0 && (
                <div
                  style={{
                    marginTop: "1rem",
                    padding: "0.75rem",
                    background: "rgba(212,160,43,0.08)",
                    borderRadius: 10,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "0.8rem", color: "var(--text-light)" }}>
                    {stats.bestStage?.icon ?? ""} أفضل مرحلة
                  </div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--gold)" }}>
                    {stats.bestStage?.title ?? ""} — {stats.bestStage?.percent ?? 0}%
                  </div>
                </div>
              )}
            </>
          )}

          <div style={{ marginTop: "1.25rem" }}>
            <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--green-primary)", marginBottom: "0.75rem" }}>
              تفاصيل المراحل
            </h3>
            {stats.stageBreakdown.map((s) => (
              <div key={s.id} style={rowStyle}>
                <span style={{ fontSize: "1rem" }}>{s.icon}</span>
                <span style={{ flex: 1, fontWeight: 600, fontSize: "0.85rem" }}>{s.title}</span>
                {s.completed ? (
                  <>
                    <div style={{ width: 60, height: 6, background: "var(--progress-bg)", borderRadius: 3, overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${s.percent}%`,
                          background: s.percent >= 90 ? "var(--green-light)" : s.percent >= 60 ? "var(--gold)" : "#e74c3c",
                          borderRadius: 3,
                          transition: "width 0.4s",
                        }}
                      />
                    </div>
                    <span style={{
                      fontWeight: 700,
                      fontSize: "0.78rem",
                      minWidth: 32,
                      textAlign: "center",
                      color: s.percent >= 90 ? "var(--green-light)" : s.percent >= 60 ? "var(--gold)" : "#e74c3c",
                    }}>
                      {s.percent}%
                    </span>
                    <span style={{ fontSize: "0.7rem", minWidth: 40, textAlign: "center" }}>
                      {Array.from({ length: 3 }, (_, i) => (
                        <span key={i} style={{ color: i < s.stars ? "var(--gold)" : "#ddd" }}>★</span>
                      ))}
                    </span>
                  </>
                ) : (
                  <span style={{ color: "var(--text-light)", fontSize: "0.8rem" }}>🔒</span>
                )}
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "1.25rem" }}>
            <button
              style={{
                background: "transparent",
                color: "var(--green-primary)",
                border: "2px solid var(--green-primary)",
                padding: "0.5rem 2rem",
                borderRadius: 8,
                fontSize: "0.9rem",
                fontWeight: 600,
              }}
              onClick={onBack}
            >
              ← العودة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, icon, color }: { label: string; value: string; icon: string; color?: string }) {
  return (
    <div
      style={{
        background: "var(--bg)",
        borderRadius: 10,
        padding: "0.75rem 0.5rem",
        textAlign: "center",
        border: "1px solid var(--card-border)",
      }}
    >
      <div style={{ fontSize: "1.2rem", marginBottom: "0.15rem" }}>{icon}</div>
      <div style={{ fontSize: "0.7rem", color: "var(--text-light)", marginBottom: "0.15rem" }}>{label}</div>
      <div style={{ fontSize: "1.1rem", fontWeight: 800, color: color ?? "var(--text)" }}>{value}</div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: "var(--card-bg)",
  borderRadius: "var(--radius)",
  padding: "1.25rem",
  boxShadow: "var(--shadow-lg)",
  border: "1px solid var(--card-border)",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "0.5rem",
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.4rem",
  padding: "0.45rem 0.4rem",
  borderBottom: "1px solid var(--border)",
  fontSize: "0.85rem",
};
