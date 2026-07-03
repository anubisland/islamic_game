import { useState, useEffect, useRef, type CSSProperties } from "react";
import { useTranslation } from "../../../i18n";
import { useSound } from "../../../hooks/useSound";

interface Props {
  stage: {
    id: string;
    title: string;
    subtitle: string;
    icon: string;
    eraIcon: string;
    era: string;
    gridSize: number;
    pattern: number[][];
    palette: string[];
    hints: number;
    info: { title: string; content: string };
    /** Reference pattern shown when hint is active */
    reference?: number[][];
  };
  onComplete: (stageId: string, stars: number, time: number) => void;
  onBack: () => void;
}

export function FillPuzzle({ stage, onComplete, onBack }: Props) {
  const { lang } = useTranslation();
  const sound = useSound();
  const gridSize = stage.gridSize || 6;
  const fullPattern = stage.pattern;
  const fullRef = stage.reference ?? stage.pattern;

  const [playerGrid, setPlayerGrid] = useState<number[][]>(() =>
    fullPattern.map(row => row.map(c => c))
  );
  const [hintsUsed, setHintsUsed] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [time, setTime] = useState(0);
  const [showRef, setShowRef] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!completed && !showInfo) {
      timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [completed, showInfo]);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  function cycleCell(row: number, col: number) {
    if (completed) return;
    const cell = fullPattern[row]?.[col];
    if (cell > 0) return; // pre-filled
    sound.click();
    const maxColor = stage.palette.length;
    setPlayerGrid(prev => {
      const next = prev.map(r => [...r]);
      next[row][col] = (next[row][col] % maxColor) + 1;
      return next;
    });
  }

  function checkSolution() {
    let correct = true;
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (fullPattern[r][c] > 0 && playerGrid[r][c] !== fullPattern[r][c]) {
          correct = false;
        }
      }
    }
    if (correct) {
      if (timerRef.current) clearInterval(timerRef.current);
      setCompleted(true);
      sound.complete();
      const accuracy = Math.max(0, 1 - hintsUsed / Math.max(1, gridSize * gridSize));
      const stars = accuracy > 0.85 ? 3 : accuracy > 0.6 ? 2 : 1;
      setTimeout(() => {
        setShowInfo(true);
        onComplete(stage.id, stars, time);
      }, 600);
    } else {
      sound.wrong();
      alert(lang === "ar" ? "❌ لم يكتمل النمط بعد" : "❌ Pattern not complete yet");
    }
  }

  function revealHint() {
    setHintsUsed(prev => prev + 1);
    const empty: [number, number][] = [];
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (fullPattern[r][c] > 0 && playerGrid[r][c] !== fullPattern[r][c]) {
          empty.push([r, c]);
        }
      }
    }
    if (empty.length > 0) {
      const [r, c] = empty[Math.floor(Math.random() * empty.length)];
      setPlayerGrid(prev => {
        const next = prev.map(row => [...row]);
        next[r][c] = fullPattern[r][c];
        return next;
      });
    }
  }

  const cellSize = Math.min(48, (440 - 40) / gridSize);

  return (
    <div>
      <header style={headerStyle}>
        <div style={headerInner}>
          <button onClick={onBack} style={backBtn}>{lang === "ar" ? "← رجوع" : "← Back"}</button>
          <span style={{ fontSize: "0.85rem", opacity: 0.9 }}>{stage.eraIcon} {stage.era}</span>
          <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>
            ⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}
          </span>
        </div>
      </header>

      <div style={{ maxWidth: 500, margin: "0 auto", padding: "1rem 0.75rem", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
          <div>
            <h2 style={{ fontSize: "1.1rem", color: "var(--green-primary)", margin: 0 }}>
              {stage.icon} {stage.title}
            </h2>
            <p style={{ fontSize: "0.82rem", color: "var(--text-light)", margin: 0 }}>{stage.subtitle}</p>
          </div>
          <button
            onClick={() => setShowRef(!showRef)}
            style={{
              fontSize: "0.75rem", padding: "0.3rem 0.6rem",
              background: showRef ? "var(--green-light)" : "transparent",
              color: showRef ? "#fff" : "var(--green-primary)",
              borderRadius: 8, border: "1px solid var(--green-primary)",
              fontWeight: 600, whiteSpace: "nowrap",
            }}
          >
            {showRef
              ? (lang === "ar" ? "✕ إخفاء" : "✕ Hide")
              : (lang === "ar" ? "🔍 نموذج" : "🔍 Model")}
          </button>
        </div>

        {/* Grid */}
        <div style={{ position: "relative", display: "inline-block" }}>
          {/* Reference overlay */}
          {showRef && !completed && (
            <div style={{
              position: "absolute", inset: 0, zIndex: 5, opacity: 0.25, pointerEvents: "none",
              display: "grid",
              gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
              gap: 2, padding: 6,
            }}>
              {fullRef.flat().map((cell, idx) => {
                const color = cell > 0 && cell <= stage.palette.length ? stage.palette[cell - 1] : "transparent";
                return (
                  <div key={idx} style={{
                    width: cellSize, height: cellSize,
                    background: color,
                    borderRadius: 3,
                  }} />
                );
              })}
            </div>
          )}

          <div
            style={{
              display: "inline-grid",
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              gap: 2,
              padding: 6,
              background: "var(--card-bg)",
              borderRadius: 10,
              boxShadow: "var(--shadow-lg)",
              border: completed ? "3px solid var(--gold)" : "3px solid var(--border)",
              marginBottom: "0.75rem",
            }}
          >
            {playerGrid.flat().map((cell, idx) => {
              const row = Math.floor(idx / gridSize);
              const col = idx % gridSize;
              const isPrefilled = fullPattern[row]?.[col] > 0;
              const isEmpty = cell === 0;
              const color = cell > 0 && cell <= stage.palette.length ? stage.palette[cell - 1] : "transparent";
              return (
                <div
                  key={idx}
                  onClick={() => cycleCell(row, col)}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    background: color,
                    borderRadius: 3,
                    border: isPrefilled ? "1px solid rgba(0,0,0,0.08)" : "1px dashed rgba(0,0,0,0.12)",
                    cursor: isPrefilled ? "default" : "pointer",
                    transition: "background 0.15s, transform 0.1s",
                    opacity: isEmpty ? 0.3 : 1,
                  }}
                  onMouseEnter={e => { if (!isPrefilled) e.currentTarget.style.transform = "scale(1.08)"; }}
                  onMouseLeave={e => { if (!isPrefilled) e.currentTarget.style.transform = "scale(1)"; }}
                />
              );
            })}
          </div>
        </div>

        {/* Color key */}
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginBottom: "1rem", flexWrap: "wrap" }}>
          {stage.palette.map((hex, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", color: "var(--text-light)" }}>
              <div style={{ width: 16, height: 16, background: hex, borderRadius: 3, border: "1px solid rgba(0,0,0,0.1)" }} />
              <span>{i + 1}</span>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", color: "var(--text-light)" }}>
            <div style={{ width: 16, height: 16, background: "transparent", borderRadius: 3, border: "1px dashed rgba(0,0,0,0.2)" }} />
            <span>{lang === "ar" ? "اضغط" : "Tap"}</span>
          </div>
        </div>

        {/* Actions */}
        {!completed && (
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={checkSolution} style={btnPrimary}>
              {lang === "ar" ? "✅ تحقق" : "✅ Check"}
            </button>
            <button onClick={revealHint} style={btnSecondary}>
              💡 {lang === "ar" ? "مساعدة" : "Hint"} ({hintsUsed})
            </button>
          </div>
        )}

        {/* Complete */}
        {completed && showInfo && (
          <div className="animate-fade-in-up" style={{
            marginTop: "1rem", padding: "1rem",
            background: "var(--card-bg)", borderRadius: "var(--radius)",
            boxShadow: "var(--shadow-lg)", border: "1px solid var(--card-border)",
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🏆</div>
            <h3 style={{ color: "var(--green-primary)", marginBottom: "0.5rem", fontSize: "1rem" }}>
              {lang === "ar" ? "أحسنت!" : "Well done!"}
            </h3>
            <div style={{ marginBottom: "0.75rem" }}>
              {Array(3).fill(0).map((_, i) => (
                <span key={i} style={{ fontSize: "2rem", color: i < 3 ? "var(--gold)" : "#ddd" }}>★</span>
              ))}
            </div>
            <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--green-primary)", marginBottom: "0.5rem" }}>
              {stage.info.title}
            </div>
            <p style={{ fontSize: "0.85rem", lineHeight: 1.7, color: "var(--text)" }}>
              {stage.info.content}
            </p>
            <div style={{ fontSize: "0.8rem", color: "var(--text-light)", marginTop: "0.5rem" }}>
              ⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")} • 💡 {hintsUsed}
            </div>
            <button onClick={onBack} style={{ ...btnPrimary, marginTop: "0.75rem" }}>
              {lang === "ar" ? "العودة إلى القائمة" : "Back to list"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const headerStyle: CSSProperties = {
  background: "linear-gradient(135deg, #1a237e, #283593)", color: "#fff", padding: "0.5rem 0.75rem", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 16px rgba(0,0,0,0.15)",
};
const headerInner: CSSProperties = { maxWidth: 500, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" };
const backBtn: CSSProperties = { background: "rgba(255,255,255,0.12)", color: "#fff", padding: "0.35rem 0.85rem", borderRadius: 8, fontSize: "0.82rem", fontWeight: 600, border: "1px solid rgba(255,255,255,0.2)" };
const btnPrimary: CSSProperties = { background: "linear-gradient(135deg, #5C6BC0, #3949AB)", color: "#fff", padding: "0.65rem 1.5rem", borderRadius: 10, fontSize: "0.9rem", fontWeight: 700, boxShadow: "0 2px 8px rgba(92,107,192,0.3)" };
const btnSecondary: CSSProperties = { background: "transparent", color: "var(--green-primary)", padding: "0.65rem 1rem", borderRadius: 10, fontSize: "0.9rem", fontWeight: 600, border: "2px solid var(--green-primary)" };
