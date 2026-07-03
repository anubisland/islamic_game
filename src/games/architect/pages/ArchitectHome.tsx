import { useState } from "react";
import { architectStages, ARCHITECT_ERA_ORDER, type ArchitectStage } from "../data/stages";
import { useTranslation } from "../../../i18n";

interface Props {
  onSelectPuzzle: (stage: ArchitectStage) => void;
  onBack: () => void;
  completedPuzzles: Record<string, boolean>;
  puzzleStars: Record<string, number>;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
}

export function ArchitectHome({ onSelectPuzzle, onBack, completedPuzzles, puzzleStars, soundEnabled, onToggleSound }: Props) {
  const { lang } = useTranslation();
  const [selectedEra, setSelectedEra] = useState<string | null>(null);

  const filtered = selectedEra
    ? architectStages.filter(s => s.id.startsWith(selectedEra))
    : architectStages;

  const completedCount = Object.values(completedPuzzles).filter(Boolean).length;

  return (
    <div>
      <header style={headerStyle}>
        <div style={headerInner}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <h1 style={{ fontSize: "1.15rem", fontWeight: 800, cursor: "pointer", letterSpacing: "0.5px" }} onClick={onBack}>
              🎨 {lang === "ar" ? "المهندس المسلم" : "Muslim Architect"}
            </h1>
            {selectedEra && (
              <span style={{ fontSize: "0.82rem", opacity: 0.8 }}>— {architectStages.find(s => s.id.startsWith(selectedEra))?.era}</span>
            )}
          </div>
          <div style={{ display: "flex", gap: "0.35rem", alignItems: "center" }}>
            {onToggleSound && (
              <button onClick={onToggleSound} style={headerBtn}>
                {soundEnabled ? "🔊" : "🔇"}
              </button>
            )}
            <button onClick={onBack} style={{ ...headerBtn, fontSize: "0.82rem" }}>
              {lang === "ar" ? "← العودة" : "← Back"}
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "1rem 0.75rem" }}>
        <div style={progressBar}>
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--green-primary)" }}>
            🏗️ {completedCount}/{architectStages.length}
          </span>
          <div style={barTrack}>
            <div style={{ ...barFill, width: `${(completedCount / architectStages.length) * 100}%` }} />
          </div>
        </div>

        {/* Era filters */}
        <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1rem", flexWrap: "wrap" }}>
          <button
            onClick={() => setSelectedEra(null)}
            style={selectedEra === null ? eraBtnActive : eraBtn}
          >
            {lang === "ar" ? "الكل" : "All"}
          </button>
          {ARCHITECT_ERA_ORDER.map(e => (
            <button
              key={e.key}
              onClick={() => setSelectedEra(selectedEra === e.key ? null : e.key)}
              style={selectedEra === e.key ? eraBtnActive : eraBtn}
            >
              {e.icon} {e.label}
            </button>
          ))}
        </div>

        {/* Puzzle grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "0.75rem" }}>
          {filtered.map((s, i) => {
            const done = completedPuzzles[s.id];
            const stars = puzzleStars[s.id] ?? 0;
            return (
              <div
                key={s.id}
                className="animate-fade-in-up"
                style={{
                  animationDelay: `${i * 0.05}s`,
                  animationFillMode: "both",
                }}
              >
                <button
                  onClick={() => onSelectPuzzle(s)}
                  style={{
                    ...puzzleCard,
                    borderColor: done ? "var(--gold)" : "var(--border)",
                    opacity: selectedEra && !s.id.startsWith(selectedEra) ? 0.4 : 1,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "var(--shadow-lg)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "var(--shadow)"; }}
                >
                  {s.puzzleType === "tesselation" && s.tileSlots ? (
                  <TileMiniPreview slots={s.tileSlots} />
                ) : s.puzzleType === "archbalance" && s.arches ? (
                  <BalanceMiniPreview arches={s.arches} />
                ) : s.puzzleType === "patternmatrix" && s.rounds ? (
                  <MatrixMiniPreview />
                ) : (
                  <MiniGrid pattern={s.pattern ?? []} palette={s.palette ?? ["#ccc"]} />
                )}
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, marginTop: "0.35rem", color: "var(--text)" }}>
                    {s.title}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-light)" }}>{s.subtitle}</div>
                  {done && (
                    <div style={{ fontSize: "0.75rem", marginTop: "0.25rem" }}>
                      {Array(3).fill(0).map((_, j) => (
                        <span key={j} style={{ color: j < stars ? "var(--gold)" : "#ddd" }}>★</span>
                      ))}
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MiniGrid({ pattern, palette }: { pattern: number[][]; palette: string[] }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${pattern[0]?.length ?? 3}, 1fr)`,
      gap: 1,
      width: 72,
      height: 72,
      margin: "0 auto",
    }}>
      {pattern.slice(0, 6).flat().map((c, i) => (
        <div key={i} style={{
          background: c > 0 && c <= palette.length ? palette[c - 1] : "transparent",
          borderRadius: 1,
          width: "100%",
          aspectRatio: "1",
        }} />
      ))}
    </div>
  );
}

function TileMiniPreview({ slots }: { slots: { x: number; y: number; color: string; accepts: string }[] }) {
  return (
    <div style={{
      width: 72,
      height: 72,
      margin: "0 auto",
      position: "relative",
      background: "rgba(245,240,230,0.5)",
      borderRadius: 6,
    }}>
      {slots.map((s, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `calc(${s.x}% * 0.72 - 10px)`,
          top: `calc(${s.y}% * 0.72 - 10px)`,
          width: 20,
          height: 20,
          clipPath: s.accepts === "triangle"
            ? "polygon(50% 0%, 0% 100%, 100% 100%)"
            : "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
          background: s.color,
          opacity: 0.6,
        }} />
      ))}
    </div>
  );
}

function BalanceMiniPreview({ arches }: { arches: { weight: number; color: string }[] }) {
  const left = arches.filter((_, i) => i % 2 === 0);
  const right = arches.filter((_, i) => i % 2 !== 0);
  return (
    <div style={{ width: 72, height: 72, margin: "0 auto", display: "flex", gap: 2, alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column-reverse", gap: 1, alignItems: "center" }}>
        {left.map((a, i) => (
          <div key={i} style={{ width: 28, background: a.color, borderRadius: "2px 2px 0 0", height: Math.max(8, a.weight * 5), opacity: 0.7 }} />
        ))}
      </div>
      <div style={{ width: 4, height: 60, background: "#5C6BC0", borderRadius: 2 }} />
      <div style={{ display: "flex", flexDirection: "column-reverse", gap: 1, alignItems: "center" }}>
        {right.map((a, i) => (
          <div key={i} style={{ width: 28, background: a.color, borderRadius: "2px 2px 0 0", height: Math.max(8, a.weight * 5), opacity: 0.7 }} />
        ))}
      </div>
    </div>
  );
}

function MatrixMiniPreview() {
  const shapes = ["●", "■", "◆"];
  const colors = ["#D4A02B", "#1565C0", "#C62828"];
  return (
    <div style={{ width: 72, height: 72, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, padding: 2 }}>
      {[0, 1, 2, 3, 4, 5, 6, 7, -1].map((i, idx) => (
        <div key={idx} style={{
          background: "rgba(245,240,230,0.5)", borderRadius: 2,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: i >= 0 ? "0.7rem" : "0.8rem",
          color: i >= 0 ? colors[i % 3] : "#5C6BC0", fontWeight: 700,
        }}>
          {i >= 0 ? shapes[i % 3] : "?"}
        </div>
      ))}
    </div>
  );
}

const headerStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #1a237e, #283593)",
  color: "#fff",
  padding: "0.6rem 0.75rem",
  position: "sticky",
  top: 0,
  zIndex: 100,
  boxShadow: "0 2px 16px rgba(0,0,0,0.15)",
};

const headerInner: React.CSSProperties = { maxWidth: 700, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" };

const headerBtn: React.CSSProperties = {
  background: "rgba(255,255,255,0.12)", color: "#fff", padding: "0.35rem 0.6rem", borderRadius: 8, fontSize: "1rem", border: "1px solid rgba(255,255,255,0.2)",
};

const progressBar: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem",
};

const barTrack: React.CSSProperties = {
  flex: 1, height: 8, background: "var(--progress-bg)", borderRadius: 4, overflow: "hidden",
};

const barFill: React.CSSProperties = {
  height: "100%", background: "linear-gradient(90deg, #5C6BC0, var(--gold))", borderRadius: 4, transition: "width 0.5s",
};

const puzzleCard: React.CSSProperties = {
  background: "var(--card-bg)", borderRadius: "var(--radius)", padding: "0.75rem", border: "2px solid var(--border)", boxShadow: "var(--shadow)", transition: "all 0.3s", width: "100%", textAlign: "center",
};

const eraBtn: React.CSSProperties = {
  padding: "0.35rem 0.75rem", borderRadius: 8, fontSize: "0.78rem", fontWeight: 600, background: "transparent", color: "var(--text-light)", border: "1px solid var(--border)",
};

const eraBtnActive: React.CSSProperties = {
  ...eraBtn, background: "#5C6BC0", color: "#fff", borderColor: "#5C6BC0",
};
