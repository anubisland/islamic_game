import { useState, useRef, useEffect, type CSSProperties } from "react";
import { useTranslation } from "../../../i18n";
import { useSound } from "../../../hooks/useSound";

interface PatternCell {
  color: string;
  shape: "circle" | "square" | "diamond" | "triangle";
}

export interface PatternRound {
  grid: (PatternCell | null)[][];
  options: PatternCell[];
  correctIndex: number;
  difficulty: string;
}

interface Props {
  stage: {
    id: string;
    title: string;
    subtitle: string;
    era: string;
    eraIcon: string;
    icon: string;
    rounds: PatternRound[];
    info: { title: string; content: string };
  };
  onComplete: (stageId: string, stars: number, time: number) => void;
  onBack: () => void;
}

const SHAPE_SYMBOLS: Record<string, string> = {
  circle: "●", square: "■", diamond: "◆", triangle: "▲",
};

function RenderShape({ cell, size }: { cell: PatternCell; size: number }) {
  const s = size * 0.5;
  return (
    <div style={{
      width: size, height: size, display: "flex", alignItems: "center",
      justifyContent: "center", fontSize: s, fontWeight: 700,
      lineHeight: 1, color: cell.color, textShadow: "0 1px 1px rgba(0,0,0,0.1)",
    }}>
      {SHAPE_SYMBOLS[cell.shape]}
    </div>
  );
}

export function PatternMatrixPuzzle({ stage, onComplete, onBack }: Props) {
  const { lang } = useTranslation();
  const sound = useSound();

  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [time, setTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const round = stage.rounds[currentRound];

  useEffect(() => {
    if (!completed && !showInfo) {
      timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [completed, showInfo]);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  function handleSelect(idx: number) {
    if (revealed || completed) return;
    setSelected(idx);
    if (idx === round.correctIndex) {
      sound.click();
      setRevealed(true);
      setTimeout(() => {
        const next = currentRound + 1;
        if (next >= stage.rounds.length) {
          if (timerRef.current) clearInterval(timerRef.current);
          setCompleted(true);
          sound.complete();
          setTimeout(() => { setShowInfo(true); onComplete(stage.id, 3, time); }, 600);
        } else {
          setCurrentRound(next);
          setScore(s => s + 1);
          setSelected(null);
          setRevealed(false);
        }
      }, 600);
    } else {
      sound.wrong();
      setSelected(null);
    }
  }

  const cellSize = 64;

  return (
    <div>
      <header style={headerStyle}>
        <div style={headerInner}>
          <button onClick={onBack} style={backBtn}>{lang === "ar" ? "← رجوع" : "← Back"}</button>
          <span style={{ fontSize: "0.85rem", opacity: 0.9 }}>{stage.eraIcon} {stage.era}</span>
          <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</span>
        </div>
      </header>

      <div style={{ maxWidth: 440, margin: "0 auto", padding: "0.75rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "1.1rem", color: "var(--green-primary)", margin: "0 0 0.25rem" }}>
          {stage.icon} {stage.title}
        </h2>
        <p style={{ fontSize: "0.82rem", color: "var(--text-light)", marginBottom: "0.35rem" }}>
          {lang === "ar"
            ? "اكتشف قاعدة النمط واختر الشكل الناقص"
            : "Discover the pattern rule and pick the missing shape"}
        </p>

        {/* Progress */}
        <div style={{ fontSize: "0.78rem", color: "var(--text-light)", marginBottom: "0.5rem" }}>
          {lang === "ar" ? `جولة ${currentRound + 1}/${stage.rounds.length}` : `Round ${currentRound + 1}/${stage.rounds.length}`}
          {" • "}
          {round.difficulty}
        </div>

        {/* Pattern grid */}
        <div style={{
          display: "inline-grid", gridTemplateColumns: "repeat(3, auto)", gap: 4,
          padding: 8, background: "var(--card-bg)", borderRadius: 12,
          boxShadow: "var(--shadow-lg)", marginBottom: "0.75rem",
        }}>
          {round.grid.flat().map((cell, idx) => {
            if (!cell) {
              return (
                <div key={idx} style={{
                  width: cellSize, height: cellSize, background: "rgba(0,0,0,0.05)",
                  borderRadius: 8, display: "flex", alignItems: "center",
                  justifyContent: "center", border: "2px dashed #5C6BC0",
                }}>
                  <span style={{ fontSize: "1.3rem", color: "#5C6BC0", fontWeight: 700 }}>?</span>
                </div>
              );
            }
            return (
              <div key={idx} style={{
                width: cellSize, height: cellSize, background: "rgba(245,240,230,0.5)",
                borderRadius: 8, display: "flex", alignItems: "center",
                justifyContent: "center", border: "1px solid var(--border)",
              }}>
                <RenderShape cell={cell} size={cellSize - 12} />
              </div>
            );
          })}
        </div>

        {/* Options */}
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
          {round.options.map((opt, idx) => {
            const isSelected = selected === idx;
            const isCorrect = revealed && idx === round.correctIndex;
            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                style={{
                  width: 64, height: 64, borderRadius: 10,
                  background: isCorrect
                    ? "rgba(46,125,50,0.15)"
                    : isSelected && !isCorrect
                      ? "rgba(198,40,40,0.12)"
                      : "var(--card-bg)",
                  border: isCorrect
                    ? "3px solid #2E7D32"
                    : isSelected && !isCorrect
                      ? "3px solid #C62828"
                      : "2px solid var(--border)",
                  cursor: revealed ? "default" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s",
                  opacity: revealed && !isCorrect ? 0.3 : 1,
                }}
                disabled={revealed}
              >
                <RenderShape cell={opt} size={36} />
              </button>
            );
          })}
        </div>

        {/* Completion */}
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
              {Array(3).fill(0).map((_, i) => (<span key={i} style={{ fontSize: "2rem", color: "var(--gold)" }}>★</span>))}
            </div>
            <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--green-primary)", marginBottom: "0.5rem" }}>
              {stage.info.title}
            </div>
            <p style={{ fontSize: "0.85rem", lineHeight: 1.7, color: "var(--text)" }}>{stage.info.content}</p>
            <div style={{ fontSize: "0.8rem", color: "var(--text-light)", marginTop: "0.5rem" }}>
              {lang === "ar" ? `النتيجة: ${score}/${stage.rounds.length}` : `Score: ${score}/${stage.rounds.length}`} • ⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}
            </div>
            <button onClick={onBack} style={{
              background: "linear-gradient(135deg, #5C6BC0, #3949AB)", color: "#fff",
              padding: "0.65rem 1.5rem", borderRadius: 10, fontSize: "0.9rem", fontWeight: 700,
              marginTop: "0.75rem", border: "none", cursor: "pointer",
            }}>
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
