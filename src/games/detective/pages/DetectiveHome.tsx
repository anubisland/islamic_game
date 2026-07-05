import type { LangStr } from "../data/stages";
import type { DetectiveStage } from "../data/stages";
import { detectiveStages, TOTAL_DETECTIVE_STAGES } from "../data/stages";
import { GameProgressCharts } from "../../../components/GameProgressCharts";

interface Props {
  completed: Set<string>;
  lang: "ar" | "en";
  onSelectStage: (stage: DetectiveStage) => void;
  onBack: () => void;
}

export function DetectiveHome({ completed, lang, onSelectStage, onBack }: Props) {
  const dir = lang === "ar" ? "rtl" : "ltr";
  const t = (s: LangStr) => s[lang];

  function isStageLocked(index: number): boolean {
    if (index === 0) return false;
    return !completed.has(detectiveStages[index - 1].id);
  }

  return (
    <div dir={dir} style={{ maxWidth: 700, margin: "0 auto", padding: "1rem" }}>
      {/* Back button */}
      <button onClick={onBack} style={{
        background: "none", border: "none", cursor: "pointer",
        padding: "0.25rem 0", marginBottom: "0.5rem",
        color: "var(--text-light)", fontSize: "0.85rem",
      }}>
        {lang === "ar" ? "← العودة إلى المركز" : "← Back to Hub"}
      </button>

      {/* Intro card */}
      <div style={{
        background: "linear-gradient(135deg, #3E2723, #4E342E)",
        borderRadius: "var(--radius)", padding: "1.25rem",
        textAlign: "center", marginBottom: "1.25rem",
        color: "#fff",
      }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🔍</div>
        <h1 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0, marginBottom: "0.25rem" }}>
          {lang === "ar" ? "المحقق التاريخي" : "Historical Detective"}
        </h1>
        <p style={{ fontSize: "0.85rem", opacity: 0.9, margin: 0, lineHeight: 1.6 }}>
          {lang === "ar"
            ? "حل الألغاز التاريخية، رتب الأحداث، واكتشف الحقيقة وراء أعظم لحظات التاريخ الإسلامي"
            : "Solve historical mysteries, arrange events, and discover the truth behind the greatest moments of Islamic history"}
        </p>
        <p style={{ fontSize: "0.75rem", opacity: 0.7, marginTop: "0.5rem" }}>
          {lang === "ar"
            ? `${TOTAL_DETECTIVE_STAGES} قضية للتحقيق`
            : `${TOTAL_DETECTIVE_STAGES} cases to investigate`}
        </p>
      </div>

      {/* Progress charts */}
      <GameProgressCharts
        completed={completed.size}
        total={detectiveStages.length}
        stages={detectiveStages.map((s) => ({
          title: s.title[lang],
          icon: s.icon ?? "🔍",
          done: completed.has(s.id),
        }))}
        lang={lang}
      />

      {/* Stage list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {detectiveStages.map((stage, idx) => {
          const locked = isStageLocked(idx);
          const done = completed.has(stage.id);

          return (
            <div
              key={stage.id}
              onClick={() => { if (!locked && !done) onSelectStage(stage); }}
              style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                padding: "0.85rem", borderRadius: "var(--radius)",
                background: "var(--card-bg)",
                border: done
                  ? "2px solid var(--green-primary)"
                  : locked
                  ? "2px solid var(--border)"
                  : "2px solid #FFD700",
                cursor: locked ? "default" : "pointer",
                opacity: locked ? 0.5 : 1,
                transition: "all 0.15s",
              }}
            >
              {/* Icon */}
              <span style={{ fontSize: "1.5rem" }}>{done ? "✅" : locked ? "🔒" : stage.icon}</span>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontSize: "0.95rem", fontWeight: 600,
                  color: "var(--text)", margin: 0,
                }}>
                  {idx + 1}. {t(stage.title)}
                </h3>
                <p style={{
                  fontSize: "0.78rem", color: "var(--text-light)",
                  margin: 0, marginTop: "0.15rem",
                }}>
                  {t(stage.era)} • {stage.puzzle.type === "case-order"
                    ? (lang === "ar" ? "ترتيب أحداث" : "Arrange events")
                    : (lang === "ar" ? "اختيار الإجابة" : "Choose answer")}
                </p>
              </div>

              {/* Status badge */}
              {done ? (
                <span style={{
                  fontSize: "0.7rem", fontWeight: 600,
                  color: "var(--green-primary)",
                }}>
                  {lang === "ar" ? "✓ تم" : "✓ Done"}
                </span>
              ) : locked ? (
                <span style={{ fontSize: "0.7rem", color: "var(--text-light)" }}>
                  {lang === "ar" ? "مقفلة" : "Locked"}
                </span>
              ) : (
                <span style={{
                  fontSize: "0.7rem", fontWeight: 600, color: "#FFD700",
                }}>
                  {lang === "ar" ? "★ تحقيق" : "★ Solve"}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
