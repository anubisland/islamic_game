import { useState, useEffect, useRef, type CSSProperties } from "react";
import type { ArchitectStage } from "../data/stages";
import { useTranslation } from "../../../i18n";
import { useSound } from "../../../hooks/useSound";

interface Props {
  stage: ArchitectStage;
  onComplete: (stageId: string, stars: number, time: number) => void;
  onBack: () => void;
}

export function SymmetryPuzzle({ stage, onComplete, onBack }: Props) {
  const { lang } = useTranslation();
  const sound = useSound();
  const gridSize = stage.gridSize ?? 6;
  const half = gridSize / 2;

  const leftPattern = stage.pattern!;
  const fullPattern = leftPattern.map(row => {
    const mirrored = [...row].reverse();
    return [...row, ...mirrored];
  });

  const [playerGrid, setPlayerGrid] = useState<number[][]>(() =>
    fullPattern.map(row => row.map((c, col) => (col < half ? c : 0)))
  );
  const [hintsUsed, setHintsUsed] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [time, setTime] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [stars, setStars] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!completed && !showInfo) {
      timerRef.current = setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [completed, showInfo]);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  function cycleColor(row: number, col: number) {
    if (completed || col < half) return;
    sound.click();
    const maxColor = stage.palette!.length;
    setPlayerGrid(prev => {
      const next = prev.map(r => [...r]);
      next[row][col] = (next[row][col] % maxColor) + 1;
      return next;
    });
  }

  function calcStars(elapsed: number, wrong: number) {
    const maxScore = gridSize * half;
    const accuracy = Math.max(0, 1 - wrong / Math.max(1, maxScore));
    const timeBonus = Math.max(0, 1 - elapsed / 120);
    return accuracy > 0.85 && timeBonus > 0.5 ? 3 : accuracy > 0.6 ? 2 : 1;
  }

  function checkSolution() {
    let correct = true;
    for (let r = 0; r < gridSize; r++) {
      for (let c = half; c < gridSize; c++) {
        if (playerGrid[r][c] !== fullPattern[r][c]) {
          correct = false;
        }
      }
    }
    if (correct) {
      if (timerRef.current) clearInterval(timerRef.current);
      const elapsed = time;
      const earned = calcStars(elapsed, wrongCount);
      setStars(earned);
      setCompleted(true);
      sound.complete();
      setTimeout(() => {
        setShowInfo(true);
        onComplete(stage.id, earned, elapsed);
      }, 600);
    } else {
      sound.wrong();
      setWrongCount(prev => prev + 1);
      alert(lang === "ar" ? "❌ ليس صحيحاً، حاول مرة أخرى" : "❌ Not correct, try again");
    }
  }

  function revealMoreHints() {
    setHintsUsed(prev => prev + 1);
    const emptyCells: [number, number][] = [];
    for (let r = 0; r < gridSize; r++) {
      for (let c = half; c < gridSize; c++) {
        if (playerGrid[r][c] === 0 && fullPattern[r][c] > 0) {
          emptyCells.push([r, c]);
        }
      }
    }
    if (emptyCells.length > 0) {
      const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      setPlayerGrid(prev => {
        const next = prev.map(row => [...row]);
        next[r][c] = fullPattern[r][c];
        return next;
      });
    }
  }

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
        <p style={{ fontSize: "0.82rem", color: "var(--text-light)", marginBottom: "1rem" }}>
          {lang === "ar" ? "أكمل النمط على اليسار ليعكس التناظر" : "Mirror the pattern on the right side"}
        </p>

        {/* Grid */}
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
            direction: "ltr",
            marginBottom: "0.75rem",
          }}
        >
          {playerGrid.flat().map((cell, idx) => {
            const row = Math.floor(idx / gridSize);
            const col = idx % gridSize;
            const isLeft = col < half;
            const isHint = isLeft && leftPattern[row]?.[col] > 0;
            const isEmpty = cell === 0;
            const color = cell > 0 && cell <= stage.palette!.length ? stage.palette![cell - 1] : "transparent";
            return (
              <div
                key={idx}
                onClick={() => cycleColor(row, col)}
                style={{
                  width: Math.min(48, (480 - 40) / gridSize),
                  height: Math.min(48, (480 - 40) / gridSize),
                  background: color,
                  borderRadius: 3,
                  border: isLeft ? "1px solid rgba(0,0,0,0.08)" : "1px dashed rgba(0,0,0,0.12)",
                  cursor: isLeft ? "default" : "pointer",
                  transition: "background 0.15s, transform 0.1s",
                  opacity: isHint ? 1 : isEmpty ? 0.3 : 1,
                  position: "relative",
                }}
                onMouseEnter={e => { if (!isLeft) e.currentTarget.style.transform = "scale(1.08)"; }}
                onMouseLeave={e => { if (!isLeft) e.currentTarget.style.transform = "scale(1)"; }}
              >
                {col === half - 1 && (
                  <div style={{
                    position: "absolute", top: 0, bottom: 0, left: "100%", width: 2, background: "var(--gold)", zIndex: 2,
                  }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Color key */}
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginBottom: "1rem", flexWrap: "wrap" }}>
          {stage.palette!.map((hex, i) => (
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
              {lang === "ar" ? "✅ تحقق من الإجابة" : "✅ Check Answer"}
            </button>
            <button onClick={revealMoreHints} style={btnSecondary}>
              💡 {lang === "ar" ? "مساعدة" : "Hint"} ({hintsUsed})
            </button>
          </div>
        )}

        {completed && showInfo && (
          <div className="animate-fade-in-up" style={{
            marginTop: "1rem",
            padding: "1rem",
            background: "var(--card-bg)",
            borderRadius: "var(--radius)",
            boxShadow: "var(--shadow-lg)",
            border: "1px solid var(--card-border)",
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
              {stars >= 3 ? "🏆" : stars >= 2 ? "⭐" : "💪"}
            </div>
            <h3 style={{ color: "var(--green-primary)", marginBottom: "0.5rem", fontSize: "1rem" }}>
              {lang === "ar" ? "أحسنت!" : "Well done!"}
            </h3>
            <div style={{ marginBottom: "0.75rem" }}>
              {Array(3).fill(0).map((_, i) => (
                <span key={i} style={{ fontSize: "2rem", color: i < stars ? "var(--gold)" : "#ddd" }}>★</span>
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

const backBtn: CSSProperties = {
  background: "rgba(255,255,255,0.12)", color: "#fff", padding: "0.35rem 0.85rem", borderRadius: 8, fontSize: "0.82rem", fontWeight: 600, border: "1px solid rgba(255,255,255,0.2)",
};

const btnPrimary: CSSProperties = {
  background: "linear-gradient(135deg, #5C6BC0, #3949AB)", color: "#fff", padding: "0.65rem 1.5rem", borderRadius: 10, fontSize: "0.9rem", fontWeight: 700, boxShadow: "0 2px 8px rgba(92,107,192,0.3)",
};

const btnSecondary: CSSProperties = {
  background: "transparent", color: "var(--green-primary)", padding: "0.65rem 1rem", borderRadius: 10, fontSize: "0.9rem", fontWeight: 600, border: "2px solid var(--green-primary)",
};
