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
    transformRounds: TransformRound[];
    palette: string[];
    info: { title: string; content: string };
  };
  onComplete: (stageId: string, stars: number, time: number) => void;
  onBack: () => void;
}

function cloneGrid(grid: number[][]): number[][] {
  return grid.map(r => [...r]);
}

function rotateCW(grid: number[][]): number[][] {
  const n = grid.length;
  const r = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      r[j][n - 1 - i] = grid[i][j];
  return r;
}

function rotateCCW(grid: number[][]): number[][] {
  const n = grid.length;
  const r = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      r[n - 1 - j][i] = grid[i][j];
  return r;
}

function flipH(grid: number[][]): number[][] {
  return grid.map(r => [...r].reverse());
}

function flipV(grid: number[][]): number[][] {
  return [...grid].reverse();
}

function gridsEqual(a: number[][], b: number[][]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++)
    for (let j = 0; j < a[i].length; j++)
      if (a[i][j] !== b[i][j]) return false;
  return true;
}

function GridPreview({ grid, palette, size = 20 }: { grid: number[][]; palette: string[]; size?: number }) {
  return (
    <div style={{
      display: "inline-grid",
      gridTemplateColumns: `repeat(${grid[0]?.length ?? 4}, ${size}px)`,
      gap: 1,
      padding: 4,
      background: "var(--card-bg)",
      borderRadius: 6,
      border: "1px solid var(--border)",
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    }}>
      {grid.flat().map((cell, i) => (
        <div key={i} style={{
          width: size, height: size,
          background: cell > 0 && cell <= palette.length ? palette[cell - 1] : "transparent",
          borderRadius: 1,
          transition: "background 0.15s",
        }} />
      ))}
    </div>
  );
}

export function TransformationPuzzle({ stage, onComplete, onBack }: Props) {
  const { lang } = useTranslation();
  const sound = useSound();

  const [currentRound, setCurrentRound] = useState(0);
  const [workspace, setWorkspace] = useState(() => cloneGrid(stage.transformRounds[0].source));
  const [transformHistory, setTransformHistory] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [feedbackType, setFeedbackType] = useState<"correct" | "wrong" | "">("");
  const [time, setTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const round = stage.transformRounds[currentRound];
  const correctAnswer = round.options[round.correctIndex];
  const isCorrect = gridsEqual(workspace, correctAnswer);

  useEffect(() => {
    if (!completed && !showInfo) {
      timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [completed, showInfo]);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  function applyTransform(fn: (g: number[][]) => number[][], label: string) {
    if (completed || showInfo) return;
    setWorkspace(fn);
    setTransformHistory(h => [...h, label]);
    setFeedbackMsg("");
    setFeedbackType("");
  }

  function checkAnswer() {
    if (completed || showInfo) return;
    if (isCorrect) {
      sound.click();
      setFeedbackType("correct");
      setFeedbackMsg(lang === "ar"
        ? "✅ صحيح! أحسنت"
        : "✅ Correct! Well done");
      setTimeout(() => {
        const next = currentRound + 1;
        if (next >= stage.transformRounds.length) {
          if (timerRef.current) clearInterval(timerRef.current);
          setCompleted(true);
          sound.complete();
          const stars =
            mistakes === 0 ? 3
            : mistakes <= 1 ? 2
            : 1;
          setTimeout(() => { setShowInfo(true); onComplete(stage.id, stars, time); }, 700);
        } else {
          setCurrentRound(next);
          setWorkspace(cloneGrid(stage.transformRounds[next].source));
          setTransformHistory([]);
          setFeedbackMsg("");
          setFeedbackType("");
        }
      }, 800);
    } else {
      sound.wrong();
      setMistakes(m => m + 1);
      setFeedbackType("wrong");
      setFeedbackMsg(lang === "ar"
        ? "❌ ليس صحيحاً. طبق التحويلات على النمط الأصلي ثم تحقق مرة أخرى"
        : "❌ Not correct. Apply transformations to the original pattern and check again");
      setTimeout(() => {
        setFeedbackMsg("");
        setFeedbackType("");
      }, 2000);
    }
  }

  function resetWorkspace() {
    if (completed || showInfo) return;
    setWorkspace(cloneGrid(round.source));
    setTransformHistory([]);
    setFeedbackMsg("");
    setFeedbackType("");
  }

  const btn: CSSProperties = {
    padding: "0.4rem 0.65rem", borderRadius: 8, fontSize: "0.78rem", fontWeight: 700,
    border: "1px solid var(--border)", background: "var(--card-bg)", cursor: "pointer",
    color: "var(--text)", transition: "all 0.15s",
  };

  return (
    <div>
      <header style={headerStyle}>
        <div style={headerInner}>
          <button onClick={onBack} style={backBtn}>{lang === "ar" ? "← رجوع" : "← Back"}</button>
          <span style={{ fontSize: "0.85rem", opacity: 0.9 }}>{stage.eraIcon} {stage.era}</span>
          <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</span>
        </div>
      </header>

      <div style={{ maxWidth: 420, margin: "0 auto", padding: "0.75rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "1.1rem", color: "var(--green-primary)", margin: "0 0 0.25rem" }}>
          {stage.icon} {stage.title}
        </h2>
        <p style={{ fontSize: "0.82rem", color: "var(--text-light)", marginBottom: "0.5rem" }}>
          {lang === "ar"
            ? "طبّق التحويلات على النمط الأصلي حتى يتطابق مع النتيجة الصحيحة"
            : "Apply transformations to match the correct result"}
        </p>

        {/* Stats bar */}
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "0.5rem", fontSize: "0.82rem" }}>
          <div style={{ color: mistakes > 0 ? "#C62828" : "var(--text-light)", fontWeight: 700 }}>
            {lang === "ar" ? `الأخطاء: ${mistakes}` : `Mistakes: ${mistakes}`}
          </div>
          <div>
            {[0, 1, 2].map(i => {
              const starCount = mistakes === 0 ? 3 : mistakes <= 1 ? 2 : 1;
              return (
                <span key={i} style={{ fontSize: "1.2rem", color: i < starCount ? "var(--gold)" : "#ddd", transition: "color 0.3s" }}>
                  ★
                </span>
              );
            })}
          </div>
        </div>

        <div style={{ fontSize: "0.78rem", color: "var(--text-light)", marginBottom: "0.5rem" }}>
          {lang === "ar" ? `جولة ${currentRound + 1}/${stage.transformRounds.length}` : `Round ${currentRound + 1}/${stage.transformRounds.length}`}
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

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", alignItems: "flex-start", marginBottom: "0.75rem" }}>
          {/* Source pattern */}
          <div>
            <div style={{ fontSize: "0.65rem", color: "var(--text-light)", marginBottom: "0.15rem" }}>
              {lang === "ar" ? "الأصلي" : "Source"}
            </div>
            <GridPreview grid={round.source} palette={stage.palette} size={22} />
          </div>

          {/* Arrow */}
          <div style={{ paddingTop: "1.2rem", fontSize: "1.2rem", color: "var(--text-light)" }}>→</div>

          {/* Workspace (current transformed state) */}
          <div>
            <div style={{ fontSize: "0.65rem", color: "var(--text-light)", marginBottom: "0.15rem" }}>
              {lang === "ar" ? "بعد التحويل" : "After transform"}
            </div>
            <div style={{
              display: "inline-block",
              padding: 4,
              borderRadius: 6,
              border: isCorrect ? "2px solid #2E7D32" : "2px solid var(--gold)",
              transition: "border-color 0.3s",
            }}>
              <GridPreview grid={workspace} palette={stage.palette} size={22} />
            </div>
          </div>
        </div>

        {/* Transform controls */}
        <div style={{ display: "flex", gap: "0.35rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "0.5rem" }}>
          <button
            onClick={() => applyTransform(rotateCW, "↻ 90°")}
            style={btn}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(92,107,192,0.12)"; e.currentTarget.style.borderColor = "#5C6BC0"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "var(--card-bg)"; e.currentTarget.style.borderColor = "var(--border)"; }}
          >↻ 90°</button>
          <button
            onClick={() => applyTransform(rotateCCW, "↺ 90°")}
            style={btn}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(92,107,192,0.12)"; e.currentTarget.style.borderColor = "#5C6BC0"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "var(--card-bg)"; e.currentTarget.style.borderColor = "var(--border)"; }}
          >↺ 90°</button>
          <button
            onClick={() => applyTransform(flipH, "↔")}
            style={btn}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(92,107,192,0.12)"; e.currentTarget.style.borderColor = "#5C6BC0"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "var(--card-bg)"; e.currentTarget.style.borderColor = "var(--border)"; }}
          >↔ أفقي</button>
          <button
            onClick={() => applyTransform(flipV, "↕")}
            style={btn}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(92,107,192,0.12)"; e.currentTarget.style.borderColor = "#5C6BC0"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "var(--card-bg)"; e.currentTarget.style.borderColor = "var(--border)"; }}
          >↕ عمودي</button>
        </div>

        {/* Transform history */}
        {transformHistory.length > 0 && (
          <div style={{ fontSize: "0.72rem", color: "var(--text-light)", marginBottom: "0.5rem" }}>
            {lang === "ar" ? "التحويلات المطبقة: " : "Applied: "}
            {transformHistory.join(" → ")}
          </div>
        )}

        {/* Feedback message */}
        {feedbackMsg && (
          <div className="animate-slide-down" style={{
            fontSize: "0.82rem", fontWeight: 700,
            color: feedbackType === "correct" ? "#2E7D32" : "#C62828",
            marginBottom: "0.5rem", padding: "0.35rem 0.5rem",
            background: feedbackType === "correct"
              ? "rgba(46,125,50,0.08)"
              : "rgba(198,40,40,0.08)",
            borderRadius: 8, display: "inline-block",
          }}>
            {feedbackMsg}
          </div>
        )}

        {/* Action buttons */}
        {!completed && (
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={checkAnswer}
              style={{
                background: "linear-gradient(135deg, #5C6BC0, #3949AB)",
                color: "#fff", padding: "0.6rem 1.5rem", borderRadius: 10,
                fontSize: "0.9rem", fontWeight: 700, border: "none", cursor: "pointer",
                boxShadow: "0 2px 8px rgba(92,107,192,0.3)",
              }}
            >{lang === "ar" ? "✅ تحقق من الإجابة" : "✅ Check Answer"}</button>
            <button
              onClick={resetWorkspace}
              style={{
                background: "transparent", color: "var(--text-light)",
                padding: "0.6rem 1rem", borderRadius: 10,
                fontSize: "0.85rem", fontWeight: 600, border: "1px solid var(--border)",
                cursor: "pointer",
              }}
            >{lang === "ar" ? "🔄 إعادة تعيين" : "🔄 Reset"}</button>
          </div>
        )}

        {/* Completion */}
        {completed && showInfo && (
          <div className="animate-fade-in-up" style={infoCard}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🏆</div>
            <h3 style={{ color: "var(--green-primary)", marginBottom: "0.5rem", fontSize: "1rem" }}>
              {lang === "ar" ? "أحسنت!" : "Well done!"}
            </h3>
            <div style={{ marginBottom: "0.75rem" }}>
              {[0, 1, 2].map(i => {
                const starCount = mistakes === 0 ? 3 : mistakes <= 1 ? 2 : 1;
                return (
                  <span key={i} style={{ fontSize: "2rem", color: i < starCount ? "var(--gold)" : "#ddd" }}>
                    {i < starCount ? "★" : "☆"}
                  </span>
                );
              })}
            </div>
            {mistakes > 0 && (
              <div style={{ fontSize: "0.82rem", color: "var(--text-light)", marginBottom: "0.5rem" }}>
                {lang === "ar" ? `عدد الأخطاء: ${mistakes}` : `Mistakes: ${mistakes}`}
              </div>
            )}
            <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--green-primary)", marginBottom: "0.5rem" }}>
              {stage.info.title}
            </div>
            <p style={{ fontSize: "0.85rem", lineHeight: 1.7, color: "var(--text)" }}>{stage.info.content}</p>
            <div style={{ fontSize: "0.8rem", color: "var(--text-light)", marginTop: "0.5rem" }}>
              ⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}
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
