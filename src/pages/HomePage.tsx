import type { GameProgress, LeaderboardEntry } from "../types";
import { stages } from "../data/stages";
import { achievements } from "../data/achievements";
import { StageCard } from "../components/StageCard";
import { AchievementBadge } from "../components/AchievementBadge";
import { Leaderboard } from "../components/Leaderboard";
import { Header } from "../components/Header";

interface Props {
  progress: GameProgress;
  leaderboard: LeaderboardEntry[];
  onSelectStage: (index: number) => void;
  onFlashcards: (index: number) => void;
  onSettings: () => void;
  onStats: () => void;
  onQuickQuiz: () => void;
  onReset: () => void;
}

export function HomePage({ progress, leaderboard, onSelectStage, onFlashcards, onSettings, onStats, onQuickQuiz, onReset }: Props) {
  const completedCount = Object.values(progress.stages).filter((s) => s.completed).length;
  const pct = stages.length > 0 ? (completedCount / stages.length) * 100 : 0;
  const unlockedIds = progress.achievements ?? [];

  return (
    <div>
      <Header />

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "1.5rem 0.75rem" }}>
        <div
          className="animate-fade-in-up"
          style={{
            textAlign: "center",
            marginBottom: "1.5rem",
            background: "linear-gradient(135deg, var(--card-bg), #faf8f4)",
            borderRadius: "var(--radius)",
            padding: "1.5rem 1rem",
            boxShadow: "var(--shadow)",
            border: "1px solid var(--card-border)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "0.25rem" }}>
              <button
                onClick={onStats}
                style={{ background: "transparent", border: "none", fontSize: "1.15rem", cursor: "pointer", padding: "0.25rem" }}
                title="الإحصاءات"
              >
                📊
              </button>
              <button
                onClick={onSettings}
                style={{ background: "transparent", border: "none", fontSize: "1.15rem", cursor: "pointer", padding: "0.25rem" }}
                title="الإعدادات"
              >
                ⚙️
              </button>
            </div>
            <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--green-primary)" }}>
              🕌 مرحباً بك في رحلة الإيمان
            </p>
            <div />
          </div>
          <p
            style={{
              fontSize: "0.9rem",
              color: "var(--text-light)",
              marginTop: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            اختر مرحلة وابدأ التعلم
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-light)", whiteSpace: "nowrap" }}>
              {completedCount} / {stages.length}
            </span>
            <div
              style={{
                flex: 1,
                maxWidth: 300,
                height: 10,
                background: "var(--progress-bg)",
                borderRadius: 5,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${pct}%`,
                  background: "linear-gradient(90deg, var(--green-light), var(--gold))",
                  borderRadius: 5,
                  transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                }}
              />
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <button
              onClick={onQuickQuiz}
              style={{
                background: "linear-gradient(135deg, var(--gold), #b8922a)",
                color: "#fff",
                padding: "0.7rem 2rem",
                borderRadius: 10,
                fontSize: "1rem",
                fontWeight: 700,
                boxShadow: "0 3px 12px rgba(212,160,43,0.35)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
            >
              ⚡ اختبار سريع
            </button>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1.25rem",
            justifyContent: "center",
          }}
        >
          {stages.map((stage, i) => {
            const locked = false;
            return (
              <div
                key={stage.id}
                className="animate-fade-in-up"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationFillMode: "both",
                }}
              >
                <StageCard
                  stage={stage}
                  progress={progress.stages[stage.id]}
                  locked={locked}
                  onClick={() => onSelectStage(i)}
                />
                {!locked && (
                  <button
                    onClick={() => onFlashcards(i)}
                    title="بطاقات تعليمية"
                    style={{
                      display: "block",
                      margin: "0.35rem auto 0",
                      background: "transparent",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      padding: "0.25rem 0.75rem",
                      fontSize: "0.8rem",
                      color: "var(--text-light)",
                      fontWeight: 600,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--green-light)";
                      e.currentTarget.style.color = "var(--green-light)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.color = "var(--text-light)";
                    }}
                  >
                    📇 بطاقات تعليمية
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {unlockedIds.length > 0 && (
          <div
            className="animate-fade-in"
            style={{ marginTop: "2.5rem" }}
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
              🏅 الشارات
            </h3>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.75rem",
                justifyContent: "center",
              }}
            >
              {achievements.map((ach) => (
                <AchievementBadge
                  key={ach.id}
                  achievement={ach}
                  unlocked={unlockedIds.includes(ach.id)}
                />
              ))}
            </div>
          </div>
        )}

        {leaderboard.length > 0 && (
          <div style={{ marginTop: "2rem" }}>
            <Leaderboard entries={leaderboard} />
          </div>
        )}

        {completedCount > 0 && (
          <div
            className="animate-fade-in"
            style={{ textAlign: "center", marginTop: "2.5rem" }}
          >
            <button
              onClick={onReset}
              style={{
                background: "transparent",
                color: "var(--text-light)",
                padding: "0.5rem 1.5rem",
                borderRadius: 8,
                border: "1px solid var(--border)",
                fontSize: "0.82rem",
                fontWeight: 600,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#e74c3c";
                e.currentTarget.style.color = "#e74c3c";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#d0ccc4";
                e.currentTarget.style.color = "var(--text-light)";
              }}
            >
              ← إعادة تعيين التقدم
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
