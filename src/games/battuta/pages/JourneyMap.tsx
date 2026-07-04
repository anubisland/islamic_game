import { useTranslation } from "../../../i18n";
import { battutaStages, type BattutaStage } from "../data/stages";

interface Props {
  onSelectStage: (stage: BattutaStage) => void;
  onBack: () => void;
}

export function JourneyMap({ onSelectStage, onBack }: Props) {
  const { lang, dir } = useTranslation();

  function handleStageClick(stage: BattutaStage) {
    onSelectStage(stage);
  }

  const L = (s: { ar: string; en: string }) => s[lang];

  return (
    <div dir={dir}>
      <header style={headerStyle}>
        <div style={headerInner}>
          <button onClick={onBack} style={backBtn}>
            {lang === "ar" ? "→" : "←"} {lang === "ar" ? "العودة" : "Back"}
          </button>
          <h1 style={{ fontSize: "1.1rem", fontWeight: 800 }}>
            🧭 {lang === "ar" ? "رحلة ابن بطوطة" : "Ibn Battuta's Journey"}
          </h1>
          <div style={{ width: 60 }} />
        </div>
      </header>

      <div style={{
        maxWidth: 600, margin: "0 auto", padding: "1rem 0.75rem",
      }}>
        <p style={{ textAlign: "center", color: "var(--text-light)", fontSize: "0.9rem", marginBottom: "1.5rem", lineHeight: 1.7 }}>
          {lang === "ar"
            ? "سافر مع ابن بطوطة عبر العالم الإسلامي! حل الألغاز لتتقدم في الرحلة."
            : "Travel with Ibn Battuta across the Islamic world! Solve puzzles to advance on your journey."}
        </p>

        {/* Map area */}
        <div style={{
          position: "relative",
          background: "linear-gradient(135deg, #f5e6c8, #e8d5a3)",
          borderRadius: "var(--radius)",
          minHeight: 500,
          padding: "1.5rem 1rem",
          border: "2px solid #d4b87a",
          overflow: "hidden",
        }}>
          {/* Decorative compass */}
          <div style={{ position: "absolute", top: 8, left: 8, fontSize: "1.5rem", opacity: 0.5 }}>🧭</div>

          {/* Path connections */}
          <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
            {battutaStages.map((stage, i) => {
              if (i === 0) return null;
              const prev = battutaStages[i - 1];
              return (
                <line
                  key={`path-${i}`}
                  x1={`${prev.mapX}%`} y1={`${prev.mapY}%`}
                  x2={`${stage.mapX}%`} y2={`${stage.mapY}%`}
                  stroke="#b8965c"
                  strokeWidth={3}
                  strokeDasharray="6 4"
                  opacity={0.6}
                />
              );
            })}
          </svg>

          {/* City markers */}
          {battutaStages.map((stage, i) => {
            const isCompleted = false;
            const isFirst = i === 0;
            return (
              <button
                key={stage.id}
                onClick={() => handleStageClick(stage)}
                style={{
                  position: "absolute",
                  left: `${stage.mapX}%`,
                  top: `${stage.mapY}%`,
                  transform: "translate(-50%, -50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  transition: "transform 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translate(-50%, -50%) scale(1.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translate(-50%, -50%)"; }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: isCompleted
                    ? "linear-gradient(135deg, #1b6b3e, #2e8b57)"
                    : isFirst
                      ? "linear-gradient(135deg, #c0392b, #e74c3c)"
                      : "linear-gradient(135deg, #8B6914, #d4a017)",
                  border: `3px solid ${isCompleted ? "#1b6b3e" : isFirst ? "#c0392b" : "#b8965c"}`,
                  boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.2rem",
                }}>
                  {isCompleted ? "✅" : stage.icon}
                </div>
                <span style={{
                  fontSize: "0.7rem", fontWeight: 700,
                  color: "#4a3520", textShadow: "0 1px 2px rgba(255,255,255,0.8)",
                  whiteSpace: "nowrap", maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis",
                  background: "rgba(255,255,255,0.85)",
                  padding: "2px 6px", borderRadius: 4,
                }}>
                  {L(stage.city)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Stage list */}
        <div style={{ marginTop: "1.5rem" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem", color: "var(--text-light)" }}>
            {lang === "ar" ? "محطات الرحلة" : "Journey Stops"}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {battutaStages.map((stage, i) => {
              const isCompleted = false;
              return (
                <button
                  key={stage.id}
                  onClick={() => handleStageClick(stage)}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.75rem",
                    background: "var(--card-bg)",
                    border: `2px solid ${isCompleted ? "var(--green-primary)" : "var(--border)"}`,
                    borderRadius: "var(--radius)",
                    padding: "0.75rem",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    textAlign: "start",
                    width: "100%",
                  }}
                >
                  <span style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: isCompleted ? "var(--green-primary)" : "var(--border)",
                    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.85rem", fontWeight: 700, flexShrink: 0,
                  }}>
                    {isCompleted ? "✓" : i + 1}
                  </span>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                      {L(stage.city)}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-light)", display: "block" }}>
                      {L(stage.region)}
                    </span>
                  </div>
                  <span style={{ fontSize: "1.2rem" }}>{stage.icon}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

const headerStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #8B6914, #d4a017)",
  color: "#fff",
  padding: "0.7rem 0.75rem",
  position: "sticky",
  top: 0,
  zIndex: 100,
  boxShadow: "0 2px 16px rgba(0,0,0,0.15)",
};

const headerInner: React.CSSProperties = {
  maxWidth: 600,
  margin: "0 auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const backBtn: React.CSSProperties = {
  background: "rgba(255,255,255,0.15)",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.25)",
  padding: "0.35rem 0.75rem",
  borderRadius: 8,
  fontSize: "0.82rem",
  fontWeight: 600,
};
