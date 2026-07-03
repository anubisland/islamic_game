import { useState, useRef, useEffect, type CSSProperties } from "react";
import { useTranslation } from "../../../i18n";
import { useSound } from "../../../hooks/useSound";

export interface TransformRound {
  source: number[][];
  options: number[][][];
  correctIndex: number;
  hintAr: string;
  hintEn: string;
}

interface Props {
  stage: {
    id: string;
    title: string;
    subtitle: string;
    era: string;
    eraIcon: string;
    icon: string;
    rounds: TransformRound[];
    palette: string[];
    info: { title: string; content: string };
  };
  onComplete: (stageId: string, stars: number, time: number) => void;
  onBack: () => void;
}

function MiniGrid({ grid, palette }: { grid: number[][]; palette: string[] }) {
  return (
    <div style={{
      display: "inline-grid",
      gridTemplateColumns: `repeat(${grid[0]?.length ?? 4}, 1fr)`,
      gap: 1,
      padding: 3,
      background: "var(--card-bg)",
      borderRadius: 4,
      border: "1px solid var(--border)",
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    }}>
      {grid.flat().map((cell, i) => (
        <div key={i} style={{
          width: 18, height: 18,
          background: cell > 0 && cell <= palette.length ? palette[cell - 1] : "transparent",
          borderRadius: 1,
        }} />
      ))}
    </div>
  );
}

export function TransformationPuzzle({ stage, onComplete, onBack }: Props) {
  const { lang } = useTranslation();
  const sound = useSound();

  const [currentRound, setCurrentRound] = useState(0);
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
          setSelected(null);
          setRevealed(false);
        }
      }, 600);
    } else {
      sound.wrong();
      setSelected(null);
    }
  }

  return (
    <div>
      <header style={headerStyle}>
        <div style={headerInner}>
          <button onClick={onBack} style={backBtn}>{lang === "ar" ? "← رجوع" : "← Back"}</button>
          <span style={{ fontSize: "0.85rem", opacity: 0.9 }}>{stage.eraIcon} {stage.era}</span>
          <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</span>
        </div>
      </header>

      <div style={{ maxWidth: 400, margin: "0 auto", padding: "0.75rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "1.1rem", color: "var(--green-primary)", margin: "0 0 0.25rem" }}>
          {stage.icon} {stage.title}
        </h2>
        <p style={{ fontSize: "0.82rem", color: "var(--text-light)", marginBottom: "0.5rem" }}>
          {lang === "ar"
            ? "دُر النمط ذهنياً واختر النتيجة الصحيحة"
            : "Mentally transform the pattern and pick the correct result"}
        </p>

        <div style={{ fontSize: "0.78rem", color: "var(--text-light)", marginBottom: "0.5rem" }}>
          {lang === "ar" ? `جولة ${currentRound + 1}/${stage.rounds.length}` : `Round ${currentRound + 1}/${stage.rounds.length}`}
        </div>

        {/* Hint */}
        <div style={{
          fontSize: "0.82rem", fontWeight: 700, color: "var(--green-primary)",
          marginBottom: "0.75rem", padding: "0.35rem 0.75rem",
          background: "rgba(92,107,192,0.08)", borderRadius: 8,
          display: "inline-block",
        }}>
          {lang === "ar" ? round.hintAr : round.hintEn}
        </div>

        {/* Source pattern */}
        <div style={{ marginBottom: "0.5rem" }}>
          <div style={{ fontSize: "0.7rem", color: "var(--text-light)", marginBottom: "0.25rem" }}>
            {lang === "ar" ? "النمط الأصلي" : "Original pattern"}
          </div>
          <MiniGrid grid={round.source} palette={stage.palette} />
        </div>

        {/* Arrow */}
        <div style={{ fontSize: "1.2rem", color: "var(--text-light)", marginBottom: "0.5rem" }}>↓</div>

        {/* Options */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.5rem",
          justifyItems: "center", marginBottom: "0.75rem",
        }}>
          {round.options.map((opt, idx) => {
            const isSelected = selected === idx;
            const isCorrect = revealed && idx === round.correctIndex;
            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                style={{
                  background: isCorrect
                    ? "rgba(46,125,50,0.12)"
                    : isSelected && !isCorrect
                      ? "rgba(198,40,40,0.1)"
                      : "transparent",
                  border: isCorrect
                    ? "3px solid #2E7D32"
                    : isSelected && !isCorrect
                      ? "3px solid #C62828"
                      : "2px solid transparent",
                  borderRadius: 10, padding: "0.35rem",
                  cursor: revealed ? "default" : "pointer",
                  opacity: revealed && !isCorrect ? 0.3 : 1,
                  transition: "all 0.2s",
                }}
                disabled={revealed}
              >
                <MiniGrid grid={opt} palette={stage.palette} />
              </button>
            );
          })}
        </div>

        {/* Completion */}
        {completed && showInfo && (
          <div className="animate-fade-in-up" style={infoCard}>
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
              {lang === "ar" ? `النتيجة: ${currentRound}/${stage.rounds.length}` : `Score: ${currentRound}/${stage.rounds.length}`} • ⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}
            </div>
            <button onClick={onBack} style={btnPrimary}>
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
const btnPrimary: CSSProperties = { background: "linear-gradient(135deg, #5C6BC0, #3949AB)", color: "#fff", padding: "0.65rem 1.5rem", borderRadius: 10, fontSize: "0.9rem", fontWeight: 700, boxShadow: "0 2px 8px rgba(92,107,192,0.3)", marginTop: "0.75rem", border: "none", cursor: "pointer" };
const infoCard: CSSProperties = {
  marginTop: "1rem", padding: "1rem",
  background: "var(--card-bg)", borderRadius: "var(--radius)",
  boxShadow: "var(--shadow-lg)", border: "1px solid var(--card-border)",
};
