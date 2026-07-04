import { useState, useRef, useEffect, type CSSProperties } from "react";
import { useTranslation } from "../../../i18n";
import { useSound } from "../../../hooks/useSound";

interface Props {
  stage: {
    id: string;
    title: string;
    subtitle: string;
    era: string;
    eraIcon: string;
    icon: string;
    ablaqData: {
      rows: number;
      cols: number;
      fixed: (string | null)[][]; // color or null (gap)
    };
    palette: string[];
    info: { title: string; content: string };
  };
  onComplete: (stageId: string, stars: number, time: number) => void;
  onBack: () => void;
}

function shuffle<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

export function AblaqPuzzle({ stage, onComplete, onBack }: Props) {
  const { lang } = useTranslation();
  const sound = useSound();

  const { rows, cols, fixed } = stage.ablaqData;

  const [grid, setGrid] = useState<(string | null)[][]>(() =>
    fixed.map(row => [...row])
  );
  const [pool, setPool] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [feedback, setFeedback] = useState<{ msg: string; type: "ok" | "wrong" } | null>(null);
  const [time, setTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize pool: for each null in fixed, compute correct alternating color
  useEffect(() => {
    const colors: string[] = [];
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        if (fixed[r][c] === null) {
          const left = c > 0 ? grid[r][c - 1] ?? "" : "";
          const above = r > 0 ? grid[r - 1][c] ?? "" : "";
          const hint = left || above;
          const correct = hint ? stage.palette.find(p => p !== hint) ?? stage.palette[0] : stage.palette[0];
          colors.push(correct);
        }
    setPool(shuffle(colors));
  }, []);

  useEffect(() => {
    if (!completed && !showInfo) {
      timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [completed, showInfo]);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  function handleColorClick(color: string) {
    if (completed || showInfo) return;
    setSelectedColor(prev => (prev === color ? null : color));
    setFeedback(null);
  }

  function handleSlotClick(r: number, c: number) {
    if (completed || showInfo) return;
    if (fixed[r][c] !== null) return;

    const current = grid[r][c];
    if (current !== null) {
      setGrid(g => {
        const n = g.map(row => [...row]);
        n[r][c] = null;
        return n;
      });
      setPool(p => [...p, current]);
      setSelectedColor(null);
      setFeedback(null);
      return;
    }

    if (!selectedColor) return;

    sound.click();
    setGrid(g => {
      const n = g.map(row => [...row]);
      n[r][c] = selectedColor;
      return n;
    });
    setPool(p => {
      const idx = p.indexOf(selectedColor);
      if (idx === -1) return p;
      return p.filter((_, i) => i !== idx);
    });
    setSelectedColor(null);
    setFeedback(null);
  }

  function checkAllFilled(): boolean {
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        if (grid[r][c] === null) return false;
    return true;
  }

  function isAlternatingCorrect(): boolean {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const val = grid[r][c];
        if (val === null) return false;
        if (c > 0 && grid[r][c - 1] !== null && grid[r][c - 1] === val) return false;
        if (r > 0 && grid[r - 1][c] !== null && grid[r - 1][c] === val) return false;
      }
    }
    return true;
  }

  function handleCheck() {
    if (completed || showInfo) return;
    if (!checkAllFilled()) {
      setFeedback({
        msg: lang === "ar" ? "ضع كل الأحجار أولاً" : "Place all stones first",
        type: "wrong",
      });
      setTimeout(() => setFeedback(null), 1500);
      return;
    }
    if (isAlternatingCorrect()) {
      sound.click();
      if (timerRef.current) clearInterval(timerRef.current);
      setCompleted(true);
      sound.complete();
      const stars = mistakes === 0 ? 3 : mistakes <= 1 ? 2 : 1;
      setTimeout(() => {
        setShowInfo(true);
        onComplete(stage.id, stars, time);
      }, 700);
    } else {
      sound.wrong();
      setMistakes(m => m + 1);
      setFeedback({
        msg: lang === "ar" ? "❌ الألوان غير متناوبة بشكل صحيح. تأكد من تناوب الألوان في كل صف" : "❌ Colors don't alternate correctly. Check each row alternates",
        type: "wrong",
      });
      setTimeout(() => setFeedback(null), 2500);
    }
  }

  const CELL = rows > 2 ? 32 : 40;

  return (
    <div>
      <header style={headerStyle}>
        <div style={headerInner}>
          <button onClick={onBack} style={backBtn}>{lang === "ar" ? "← رجوع" : "← Back"}</button>
          <span style={{ fontSize: "0.78rem", opacity: 0.9 }}>{stage.eraIcon} {stage.era}</span>
          <span style={{ fontSize: "0.78rem", fontWeight: 700 }}>⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</span>
        </div>
      </header>

      <div style={{ maxWidth: 420, margin: "0 auto", padding: "0.5rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "1rem", color: "var(--green-primary)", margin: "0 0 0.25rem" }}>
          {stage.icon} {stage.title}
        </h2>
        <p style={{ fontSize: "0.78rem", color: "var(--text-light)", marginBottom: "0.25rem" }}>
          {lang === "ar"
            ? "أكمل نمط الأبلق — الألوان تتناوب في كل صف. ضع الحجر المناسب في كل فراغ"
            : "Complete the ablaq pattern — colors alternate in each row and column"}
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", fontSize: "0.78rem", marginBottom: "0.25rem" }}>
          <div style={{ color: mistakes > 0 ? "#C62828" : "var(--text-light)", fontWeight: 700 }}>
            {lang === "ar" ? `الأخطاء: ${mistakes}` : `Mistakes: ${mistakes}`}
          </div>
          <div>
            {[0, 1, 2].map(i => (
              <span key={i} style={{ fontSize: "1rem", color: i < (mistakes === 0 ? 3 : mistakes <= 1 ? 2 : 1) ? "var(--gold)" : "#ddd" }}>★</span>
            ))}
          </div>
        </div>

        {/* Wall */}
        <div style={{ display: "inline-block", padding: 8, background: "#5D4037", borderRadius: 6, border: "2px solid #3E2723", marginBottom: "0.5rem", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)" }}>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, ${CELL}px)`, gap: 1 }}>
            {grid.flatMap((row, r) =>
              row.map((cell, c) => {
                const isFixed = fixed[r][c] !== null;
                const isEmpty = cell === null;
                return (
                  <div
                    key={`${r}-${c}`}
                    onClick={() => handleSlotClick(r, c)}
                    style={{
                      width: CELL,
                      height: CELL,
                      background: isEmpty ? "rgba(255,255,255,0.08)" : cell,
                      border: isEmpty
                        ? "2px dashed rgba(255,255,255,0.3)"
                        : isFixed
                        ? "2px solid rgba(255,255,255,0.5)"
                        : "2px solid transparent",
                      cursor: isFixed ? "default" : "pointer",
                      transition: "all 0.15s",
                      boxSizing: "border-box",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: isEmpty ? (selectedColor ? "0" : "0.8rem") : "0",
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    {isEmpty && !selectedColor ? "?" : ""}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Loose stones */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center",
          marginBottom: "0.5rem", padding: 8,
          background: "var(--card-bg)", borderRadius: 8, border: "1px solid var(--border)",
          minHeight: 40,
        }}>
          {pool.length === 0 && (
            <div style={{ fontSize: "0.72rem", color: "var(--text-light)", padding: "0.3rem" }}>
              {lang === "ar" ? "كل الأحجار موضوعة!" : "All stones placed!"}
            </div>
          )}
          {pool.map((color, i) => (
            <div
              key={`stone-${i}`}
              onClick={() => handleColorClick(color)}
              style={{
                width: 36,
                height: 36,
                background: color,
                borderRadius: 4,
                cursor: "pointer",
                boxShadow: selectedColor === color
                  ? "0 0 0 3px #FFD600, 0 2px 8px rgba(255,214,0,0.3)"
                  : "0 1px 4px rgba(0,0,0,0.15)",
                transition: "box-shadow 0.15s, transform 0.1s",
                transform: selectedColor === color ? "scale(1.1)" : "scale(1)",
                border: "1px solid rgba(0,0,0,0.1)",
              }}
            />
          ))}
        </div>

        {feedback && (
          <div style={{
            fontSize: "0.82rem", fontWeight: 700,
            color: feedback.type === "ok" ? "#2E7D32" : "#C62828",
            marginBottom: "0.5rem", padding: "0.3rem 0.5rem",
            background: feedback.type === "ok" ? "rgba(46,125,50,0.08)" : "rgba(198,40,40,0.08)",
            borderRadius: 8, display: "inline-block",
          }}>
            {feedback.msg}
          </div>
        )}

        {!completed && (
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
            <button onClick={handleCheck} style={btnPrimary}>
              {lang === "ar" ? "✅ تحقق" : "✅ Check"}
            </button>
          </div>
        )}

        {completed && showInfo && (
          <div className="animate-fade-in-up" style={infoCard}>
            <div style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>🏆</div>
            <h3 style={{ color: "var(--green-primary)", margin: "0 0 0.25rem", fontSize: "1rem" }}>
              {lang === "ar" ? "أحسنت! اكتمل جدار الأبلق!" : "Ablaq wall complete!"}
            </h3>
            <div style={{ marginBottom: "0.5rem" }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{ fontSize: "1.5rem", color: i < (mistakes === 0 ? 3 : mistakes <= 1 ? 2 : 1) ? "var(--gold)" : "#ddd" }}>
                  {i < (mistakes === 0 ? 3 : mistakes <= 1 ? 2 : 1) ? "★" : "☆"}
                </span>
              ))}
            </div>
            <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--green-primary)", marginBottom: "0.25rem" }}>
              {stage.info.title}
            </div>
            <p style={{ fontSize: "0.82rem", lineHeight: 1.7, color: "var(--text)" }}>{stage.info.content}</p>
            <div style={{ fontSize: "0.75rem", color: "var(--text-light)", marginTop: "0.25rem" }}>
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
const backBtn: CSSProperties = { background: "rgba(255,255,255,0.12)", color: "#fff", padding: "0.35rem 0.85rem", borderRadius: 8, fontSize: "0.78rem", fontWeight: 600, border: "1px solid rgba(255,255,255,0.2)" };
const btnPrimary: CSSProperties = { background: "linear-gradient(135deg, #5C6BC0, #3949AB)", color: "#fff", padding: "0.55rem 1.5rem", borderRadius: 10, fontSize: "0.85rem", fontWeight: 700, boxShadow: "0 2px 8px rgba(92,107,192,0.3)", border: "none", cursor: "pointer" };
const infoCard: CSSProperties = {
  marginTop: "1rem", padding: "1rem",
  background: "var(--card-bg)", borderRadius: "var(--radius)",
  boxShadow: "var(--shadow-lg)", border: "1px solid var(--card-border)",
};
