import { useState, useEffect, useRef, useMemo, type CSSProperties } from "react";
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
  };
  onComplete: (stageId: string, stars: number, time: number) => void;
  onBack: () => void;
}

export function FillPuzzle({ stage, onComplete, onBack }: Props) {
  const { lang } = useTranslation();
  const sound = useSound();
  const gridSize = stage.gridSize || 6;
  const target = stage.pattern;

  const hintSet = useMemo(() => {
    const hintable: [number, number][] = [];
    for (let r = 0; r < gridSize; r++)
      for (let c = 0; c < gridSize; c++)
        if (target[r][c] > 0) hintable.push([r, c]);
    const shuffled = [...hintable].sort(() => Math.random() - 0.5);
    const take = Math.min(stage.hints, shuffled.length);
    return new Set(shuffled.slice(0, take).map(([r, c]) => `${r},${c}`));
  }, []);

  const isPrefilled = useRef(hintSet);
  if (isPrefilled.current !== hintSet) isPrefilled.current = hintSet;

  function initGrid(): number[][] {
    const grid: number[][] = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
    for (const key of hintSet) {
      const [r, c] = key.split(",").map(Number);
      grid[r][c] = target[r][c];
    }
    return grid;
  }

  const [playerGrid, setPlayerGrid] = useState<number[][]>(initGrid);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [time, setTime] = useState(0);
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
    if (hintSet.has(`${row},${col}`)) return;
    sound.click();
    const maxColor = stage.palette.length;
    setPlayerGrid(prev => {
      const next = prev.map(r => [...r]);
      next[row][col] = (next[row][col] % maxColor) + 1;
      return next;
    });
  }

  function checkSolution() {
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (playerGrid[r][c] !== target[r][c]) {
          sound.wrong();
          alert(lang === "ar" ? "❌ لم يكتمل النمط بعد" : "❌ Pattern not complete yet");
          return;
        }
      }
    }
    if (timerRef.current) clearInterval(timerRef.current);
    setCompleted(true);
    sound.complete();
    const accuracy = Math.max(0, 1 - hintsUsed / Math.max(1, gridSize * gridSize));
    const stars = accuracy > 0.85 ? 3 : accuracy > 0.6 ? 2 : 1;
    setTimeout(() => {
      setShowInfo(true);
      onComplete(stage.id, stars, time);
    }, 600);
  }

  function revealHint() {
    setHintsUsed(prev => prev + 1);
    const empty: [number, number][] = [];
    for (let r = 0; r < gridSize; r++)
      for (let c = 0; c < gridSize; c++)
        if (target[r][c] > 0 && !hintSet.has(`${r},${c}`) && playerGrid[r][c] !== target[r][c])
          empty.push([r, c]);
    if (empty.length > 0) {
      const [r, c] = empty[Math.floor(Math.random() * empty.length)];
      setPlayerGrid(prev => {
        const next = prev.map(row => [...row]);
        next[r][c] = target[r][c];
        return next;
      });
    }
  }

  const cellSize = Math.min(44, (380 - 40) / gridSize);
  const refSize = 56;

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
        <h2 style={{ fontSize: "1.1rem", color: "var(--green-primary)", marginBottom: "0.25rem" }}>
          {stage.icon} {stage.title}
        </h2>
        <p style={{ fontSize: "0.82rem", color: "var(--text-light)", marginBottom: "0.75rem" }}>
          {lang === "ar" ? "أكمل فسيفساء القبة حسب النموذج المصغر" : "Complete the dome mosaic according to the mini model"}
        </p>

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", alignItems: "flex-start" }}>
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
            }}
          >
            {playerGrid.flat().map((cell, idx) => {
              const row = Math.floor(idx / gridSize);
              const col = idx % gridSize;
              const prefilled = hintSet.has(`${row},${col}`);
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
                    border: prefilled ? "1px solid rgba(0,0,0,0.08)" : "1px dashed rgba(0,0,0,0.15)",
                    cursor: prefilled ? "default" : "pointer",
                    transition: "background 0.15s, transform 0.1s",
                    opacity: isEmpty && !prefilled ? 0.35 : 1,
                  }}
                  onMouseEnter={e => { if (!prefilled) e.currentTarget.style.transform = "scale(1.1)"; }}
                  onMouseLeave={e => { if (!prefilled) e.currentTarget.style.transform = "scale(1)"; }}
                />
              );
            })}
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.7rem", color: "var(--text-light)", marginBottom: "0.25rem", fontWeight: 600 }}>
              {lang === "ar" ? "النموذج" : "Model"}
            </div>
            <div
              style={{
                display: "inline-grid",
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                gap: 1,
                padding: 4,
                background: "var(--card-bg)",
                borderRadius: 6,
                border: "2px solid var(--gold)",
                opacity: 0.7,
                pointerEvents: "none",
              }}
            >
              {target.flat().map((cell, idx) => {
                const color = cell > 0 && cell <= stage.palette.length ? stage.palette[cell - 1] : "transparent";
                return (
                  <div key={idx} style={{
                    width: Math.floor(refSize / gridSize),
                    height: Math.floor(refSize / gridSize),
                    background: color,
                    borderRadius: 1,
                  }} />
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginTop: "0.75rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
          {stage.palette.map((hex, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", color: "var(--text-light)" }}>
              <div style={{ width: 16, height: 16, background: hex, borderRadius: 3, border: "1px solid rgba(0,0,0,0.1)" }} />
              <span>{i + 1}</span>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", color: "var(--text-light)" }}>
            <div style={{ width: 16, height: 16, background: "transparent", borderRadius: 3, border: "1px dashed rgba(0,0,0,0.2)" }} />
            <span>{lang === "ar" ? "فارغ" : "Empty"}</span>
          </div>
        </div>

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
                <span key={i} style={{ fontSize: "2rem", color: "var(--gold)" }}>★</span>
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
