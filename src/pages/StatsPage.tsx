import type { GameStats } from "../utils/stats";
import { Header } from "../components/Header";

interface Props {
  stats: GameStats;
  onBack: () => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
}

export function StatsPage({ stats, onBack, soundEnabled, onToggleSound }: Props) {
  return (
    <div>
      <Header onHome={onBack} title="الإحصاءات" soundEnabled={soundEnabled} onToggleSound={onToggleSound} />

      <div style={{ maxWidth: 500, margin: "0 auto", padding: "1rem 0.6rem" }}>
        <div
          className="animate-fade-in-up"
          style={{
            background: "var(--card-bg)",
            borderRadius: "var(--radius)",
            padding: "1.25rem",
            boxShadow: "var(--shadow-lg)",
            border: "1px solid var(--card-border)",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              color: "var(--green-primary)",
              fontSize: "1.15rem",
              marginBottom: "1.25rem",
            }}
          >
            📊 الإحصاءات
          </h2>

          <div style={gridStyle}>
            <StatBox
              label="المراحل المكتملة"
              value={`${stats.stagesCompleted} / ${stats.totalStages}`}
            />
            <StatBox
              label="النجوم"
              value={`${stats.totalStars} / ${stats.maxStars}`}
              color="var(--gold)"
            />
            <StatBox
              label="نسبة النجاح"
              value={`${stats.overallPercent}%`}
              color={
                stats.overallPercent >= 90
                  ? "var(--green-light)"
                  : stats.overallPercent >= 60
                    ? "var(--gold)"
                    : "#e74c3c"
              }
            />
            <StatBox
              label="الأسئلة المجابة"
              value={`${stats.totalCorrect} / ${stats.totalQuestionsAnswered}`}
            />
            <StatBox
              label="الشارات"
              value={`${stats.achievementsUnlocked} / ${stats.totalAchievements}`}
            />
          </div>

          {stats.bestStage && (
            <div
              style={{
                marginTop: "1rem",
                padding: "0.75rem",
                background: "rgba(212,160,43,0.08)",
                borderRadius: 8,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "0.8rem", color: "var(--text-light)" }}>أفضل مرحلة</div>
              <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--gold)" }}>
                {stats.bestStage.icon} {stats.bestStage.title} — {stats.bestStage.percent}%
              </div>
            </div>
          )}

          <div style={{ marginTop: "1.25rem" }}>
            <h3
              style={{
                fontSize: "0.9rem",
                fontWeight: 700,
                color: "var(--green-primary)",
                marginBottom: "0.75rem",
              }}
            >
              تفاصيل المراحل
            </h3>
            {stats.stageBreakdown.map((s) => (
              <div
                key={s.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 0.5rem",
                  borderBottom: "1px solid var(--border)",
                  fontSize: "0.85rem",
                }}
              >
                <span>{s.icon}</span>
                <span style={{ flex: 1, fontWeight: 600 }}>{s.title}</span>
                {s.completed ? (
                  <>
                    <span
                      style={{
                        fontWeight: 700,
                        color:
                          s.percent >= 90
                            ? "var(--green-light)"
                            : s.percent >= 60
                              ? "var(--gold)"
                              : "#e74c3c",
                      }}
                    >
                      {s.percent}%
                    </span>
                    <span>
                      {Array.from({ length: 3 }, (_, i) => (
                        <span key={i} style={{ color: i < s.stars ? "var(--gold)" : "#ddd", fontSize: "0.75rem" }}>
                          ★
                        </span>
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

function StatBox({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div
      style={{
        background: "var(--bg)",
        borderRadius: 10,
        padding: "0.75rem 0.5rem",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "0.72rem", color: "var(--text-light)", marginBottom: "0.25rem" }}>
        {label}
      </div>
      <div style={{ fontSize: "1.1rem", fontWeight: 800, color: color ?? "var(--text)" }}>
        {value}
      </div>
    </div>
  );
}

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "0.5rem",
};
