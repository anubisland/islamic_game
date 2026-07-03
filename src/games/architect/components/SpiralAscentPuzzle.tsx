import { useState, useRef, useEffect, type CSSProperties } from "react";
import { useTranslation } from "../../../i18n";
import { useSound } from "../../../hooks/useSound";

export interface SpiralNode {
  id: string;
  order: number;
  labelAr: string;
  labelEn: string;
}

interface Props {
  stage: {
    id: string;
    title: string;
    subtitle: string;
    era: string;
    eraIcon: string;
    icon: string;
    spiralNodes: SpiralNode[];
    palette: string[];
    info: { title: string; content: string };
  };
  onComplete: (stageId: string, stars: number, time: number) => void;
  onBack: () => void;
}

export function SpiralAscentPuzzle({ stage, onComplete, onBack }: Props) {
  const { lang } = useTranslation();
  const sound = useSound();

  const [shuffled, setShuffled] = useState<SpiralNode[]>([]);
  const [nextOrder, setNextOrder] = useState(1);
  const [placed, setPlaced] = useState<Set<string>>(new Set());
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [time, setTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setShuffled([...stage.spiralNodes].sort(() => Math.random() - 0.5));
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

  function handleClick(node: SpiralNode) {
    if (completed || placed.has(node.id)) return;
    if (node.order === nextOrder) {
      sound.click();
      setPlaced(prev => new Set(prev).add(node.id));
      if (nextOrder >= stage.spiralNodes.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        setCompleted(true);
        sound.complete();
        setTimeout(() => { setShowInfo(true); onComplete(stage.id, 3, time); }, 600);
      } else {
        setNextOrder(n => n + 1);
      }
    } else {
      sound.wrong();
      setWrongId(node.id);
      setTimeout(() => setWrongId(null), 400);
    }
  }

  const sorted = [...stage.spiralNodes].sort((a, b) => a.order - b.order);
  const nodeColors = ["#D4A02B", "#1565C0", "#2E7D32", "#C62828", "#6A1B9A", "#E65100", "#00695C", "#37474F"];

  // Calculate positions: zigzag up the minaret
  const towerW = 80;
  const towerH = 260;
  const spiralNodes = sorted.map((n, i) => {
    const y = (i / (sorted.length - 1 || 1)) * (towerH - 40) + 20;
    const zig = i % 2 === 0 ? 0.25 : 0.75; // left then right alternating
    const xOffset = (1 - i / (sorted.length - 1 || 1)) * 15; // more room at bottom
    const x = 8 + xOffset + zig * (towerW - 16 - xOffset * 2);
    const isPlaced = placed.has(n.id);
    return { ...n, y, x, isPlaced };
  });

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

      <div style={{ maxWidth: 420, margin: "0 auto", padding: "0.75rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "1.1rem", color: "var(--green-primary)", margin: "0 0 0.25rem" }}>
          {stage.icon} {stage.title}
        </h2>
        <p style={{ fontSize: "0.82rem", color: "var(--text-light)", marginBottom: "0.75rem" }}>
          {lang === "ar"
            ? "اتبع المسار الحلزوني للمئذنة من الأسفل للأعلى"
            : "Follow the minaret's spiral path from bottom to top"}
        </p>

        {/* Minaret visual */}
        <div style={{
          position: "relative", width: towerW + 40, height: towerH, margin: "0 auto",
          background: "linear-gradient(180deg, #8D6E63, #A1887F 40%, #BCAAA4 70%, #D7CCC8)",
          borderRadius: "8px 8px 4px 4px",
          clipPath: `polygon(${16}px 0, ${towerW + 24}px 0, ${towerW + 40}px 100%, 0 100%)`,
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        }}>
          {/* Spiral line */}
          <svg width={towerW + 40} height={towerH} style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
            <polyline
              points={spiralNodes.map(n => `${n.x},${n.y}`).join(" ")}
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth={2}
              strokeDasharray="4 4"
            />
          </svg>

          {/* Nodes on the minaret */}
          {spiralNodes.map(n => {
            const col = nodeColors[n.order % nodeColors.length];
            return (
              <div
                key={n.id}
                style={{
                  position: "absolute",
                  left: n.x - 8,
                  top: n.y - 8,
                  width: n.isPlaced ? 18 : 14,
                  height: n.isPlaced ? 18 : 14,
                  borderRadius: "50%",
                  background: n.isPlaced ? col : "transparent",
                  border: n.isPlaced ? "2px solid #fff" : `2px solid ${col}60`,
                  opacity: n.isPlaced ? 1 : 0.4,
                  zIndex: 10,
                  transition: "all 0.3s",
                  boxShadow: n.isPlaced ? "0 0 8px rgba(255,255,255,0.5)" : "none",
                }}
              >
                {n.isPlaced && (
                  <span style={{ fontSize: "0.6rem", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontWeight: 700 }}>
                    {n.order}
                  </span>
                )}
              </div>
            );
          })}

          {/* Top dome */}
          <div style={{
            position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
            width: 24, height: 16, background: "#D4A02B",
            borderRadius: "50% 50% 0 0",
          }} />

          {/* Base */}
          <div style={{
            position: "absolute", bottom: -6, left: -8, right: -8,
            height: 12, background: "#795548", borderRadius: 2,
          }} />
        </div>

        {/* Scattered buttons */}
        <div style={{ display: "flex", gap: "0.4rem", justifyContent: "center", flexWrap: "wrap", marginTop: "0.75rem", minHeight: 44 }}>
          {shuffled.filter(n => !placed.has(n.id)).map(n => {
            const isWrong = wrongId === n.id;
            const col = nodeColors[n.order % nodeColors.length];
            return (
              <button
                key={n.id}
                onClick={() => handleClick(n)}
                style={{
                  padding: "0.35rem 0.75rem", borderRadius: 20, fontSize: "0.78rem", fontWeight: 600,
                  background: col, color: "#fff", border: isWrong ? "3px solid var(--red)" : "none",
                  cursor: "pointer", animation: isWrong ? "shake 0.3s" : "none",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                  transition: "transform 0.15s",
                }}
              >
                {lang === "ar" ? n.labelAr : n.labelEn}
              </button>
            );
          })}
        </div>

        {/* Progress */}
        <div style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "var(--text-light)" }}>
          {placed.size}/{stage.spiralNodes.length} {lang === "ar" ? "مستويات" : "levels"} ✓
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
const btnPrimary: CSSProperties = { background: "linear-gradient(135deg, #5C6BC0, #3949AB)", color: "#fff", padding: "0.65rem 1.5rem", borderRadius: 10, fontSize: "0.9rem", fontWeight: 700, boxShadow: "0 2px 8px rgba(92,107,192,0.3)", marginTop: "0.75rem" };
const infoCard: CSSProperties = {
  marginTop: "1rem", padding: "1rem",
  background: "var(--card-bg)", borderRadius: "var(--radius)",
  boxShadow: "var(--shadow-lg)", border: "1px solid var(--card-border)",
};
