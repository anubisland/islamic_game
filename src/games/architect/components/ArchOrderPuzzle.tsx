import { useState, useRef, useEffect, type CSSProperties } from "react";
import { useTranslation } from "../../../i18n";
import { useSound } from "../../../hooks/useSound";

export interface ArchData {
  id: string;
  width: number;
  color: string;
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
    arches: ArchData[];
    palette: string[];
    info: { title: string; content: string };
  };
  onComplete: (stageId: string, stars: number, time: number) => void;
  onBack: () => void;
}

export function ArchOrderPuzzle({ stage, onComplete, onBack }: Props) {
  const { lang } = useTranslation();
  const sound = useSound();

  const [shuffledArches, setShuffledArches] = useState<ArchData[]>([]);
  const [nextOrder, setNextOrder] = useState(1);
  const [placed, setPlaced] = useState<Set<string>>(new Set());
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [time, setTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setShuffledArches([...stage.arches].sort(() => Math.random() - 0.5));
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

  function handleArchClick(arch: ArchData) {
    if (completed || placed.has(arch.id)) return;

    if (arch.order === nextOrder) {
      sound.click();
      setPlaced(prev => new Set(prev).add(arch.id));
      if (nextOrder >= stage.arches.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        setCompleted(true);
        sound.complete();
        setTimeout(() => {
          setShowInfo(true);
          onComplete(stage.id, 3, time);
        }, 600);
      } else {
        setNextOrder(n => n + 1);
      }
    } else {
      sound.wrong();
      setWrongId(arch.id);
      setTimeout(() => setWrongId(null), 400);
    }
  }

  // Sorted by order (1=largest outer) for the mihrab display
  const sortedArches = [...stage.arches].sort((a, b) => a.order - b.order);
  const maxWidth = 100;
  const minWidth = 30;
  const archStyles = sortedArches.map((arch, _i) => {
    const pct = minWidth + ((arch.width - 1) / (Math.max(...stage.arches.map(a => a.width)) - 1)) * (maxWidth - minWidth);
    return {
      ...arch,
      widthPct: pct,
      heightPct: pct * 0.5,
    };
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
            ? "رتّب الأقواس من الأكبر للأصغر لتشكيل المحراب"
            : "Order the arches from largest to smallest to form the mihrab"}
        </p>

        {/* Mihrab area */}
        <div style={mihrabContainer}>
          {archStyles.map(arch => {
            const isPlaced = placed.has(arch.id);
            return (
              <div
                key={arch.id}
                style={{
                  ...archBase,
                  width: `${arch.widthPct}%`,
                  height: `${arch.heightPct}%`,
                  background: isPlaced ? arch.color : "transparent",
                  border: isPlaced
                    ? "none"
                    : `1px solid ${arch.color}40`,
                  zIndex: arch.order,
                  opacity: isPlaced ? 0.9 : 0.2,
                  transition: "opacity 0.3s, background 0.3s",
                }}
              />
            );
          })}
          {/* Mihrab base/back wall */}
          <div style={{
            position: "absolute", bottom: 0, left: "10%", right: "10%",
            height: "30%", background: "linear-gradient(to top, rgba(0,0,0,0.3), transparent)",
            borderRadius: "0 0 10px 10px",
            pointerEvents: "none",
          }} />
        </div>

        {/* Scattered arches */}
        <div style={{
          display: "flex", gap: "0.5rem", justifyContent: "center",
          flexWrap: "wrap", marginTop: "0.75rem",
          minHeight: 50,
        }}>
          {shuffledArches.filter(a => !placed.has(a.id)).map(arch => {
            const isWrong = wrongId === arch.id;
            return (
              <button
                key={arch.id}
                onClick={() => handleArchClick(arch)}
                style={{
                  ...archChip,
                  background: arch.color,
                  animation: isWrong ? "shake 0.3s" : "none",
                  boxShadow: isWrong ? "0 0 0 3px var(--red)" : "0 2px 6px rgba(0,0,0,0.15)",
                }}
              >
                <span style={{
                  fontSize: "0.75rem", fontWeight: 700,
                  color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,0.4)",
                }}>
                  {lang === "ar" ? arch.labelAr : arch.labelEn}
                </span>
              </button>
            );
          })}
        </div>

        {/* Progress */}
        <div style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "var(--text-light)" }}>
          {placed.size}/{stage.arches.length} {lang === "ar" ? "أقواس" : "arches"} ✓
        </div>

        {shuffledArches.filter(a => !placed.has(a.id)).length === 0 && !completed && (
          <p style={{ color: "var(--green-primary)", fontWeight: 700, marginTop: "0.5rem" }}>
            {lang === "ar" ? "✓ تم ترتيب جميع الأقواس!" : "✓ All arches ordered!"}
          </p>
        )}

        {/* Complete */}
        {completed && showInfo && (
          <div className="animate-fade-in-up" style={infoCard}>
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

const mihrabContainer: CSSProperties = {
  position: "relative",
  width: "100%",
  maxWidth: 300,
  height: 200,
  margin: "0 auto",
  background: "linear-gradient(180deg, #0d1b2a 0%, #1b2838 60%, #2c3e50 100%)",
  borderRadius: "100px 100px 12px 12px",
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
  overflow: "hidden",
  border: "1px solid rgba(212,160,43,0.3)",
  boxShadow: "inset 0 0 30px rgba(0,0,0,0.5)",
};

const archBase: CSSProperties = {
  position: "absolute",
  bottom: 0,
  borderRadius: "50% 50% 0 0",
  pointerEvents: "none",
};

const archChip: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0.4rem 0.85rem",
  borderRadius: "50% 50% 8px 8px",
  cursor: "pointer",
  border: "none",
  minWidth: 70,
  minHeight: 36,
  transition: "transform 0.15s, box-shadow 0.15s",
};

const infoCard: CSSProperties = {
  marginTop: "1rem", padding: "1rem",
  background: "var(--card-bg)", borderRadius: "var(--radius)",
  boxShadow: "var(--shadow-lg)", border: "1px solid var(--card-border)",
};
