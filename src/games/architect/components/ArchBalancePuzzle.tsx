import { useState, useRef, useEffect, type CSSProperties } from "react";
import { useTranslation } from "../../../i18n";
import { useSound } from "../../../hooks/useSound";

interface BalanceArch {
  id: string;
  weight: number;
  color: string;
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
    arches: BalanceArch[];
    leftLabel: string;
    rightLabel: string;
    info: { title: string; content: string };
  };
  onComplete: (stageId: string, stars: number, time: number) => void;
  onBack: () => void;
}

export function ArchBalancePuzzle({ stage, onComplete, onBack }: Props) {
  const { lang } = useTranslation();
  const sound = useSound();

  const [leftSide, setLeftSide] = useState<string[]>([]);
  const [rightSide, setRightSide] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [msgType, setMsgType] = useState<"ok" | "error" | null>(null);
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

  function totalWeight(ids: string[]) {
    return ids.reduce((sum, id) => sum + (stage.arches.find(a => a.id === id)?.weight ?? 0), 0);
  }

  function assignToSide(archId: string, side: "left" | "right") {
    if (completed) return;
    // Remove from both sides first
    const newLeft = leftSide.filter(id => id !== archId);
    const newRight = rightSide.filter(id => id !== archId);
    if (side === "left") newLeft.push(archId);
    else newRight.push(archId);
    setLeftSide(newLeft);
    setRightSide(newRight);
    setMessage(null);
  }

  function removeFromSide(archId: string) {
    if (completed) return;
    setLeftSide(prev => prev.filter(id => id !== archId));
    setRightSide(prev => prev.filter(id => id !== archId));
    setMessage(null);
  }

  function checkBalance() {
    const assigned = new Set([...leftSide, ...rightSide]);
    if (assigned.size < stage.arches.length) {
      setMessage(lang === "ar" ? "❌ لم توزع كل الأقواس بعد" : "❌ Not all arches placed yet");
      setMsgType("error");
      sound.wrong();
      return;
    }
    const left = totalWeight(leftSide);
    const right = totalWeight(rightSide);
    if (left === right) {
      sound.complete();
      if (timerRef.current) clearInterval(timerRef.current);
      setCompleted(true);
      setMessage(lang === "ar" ? "✓ متوازن!" : "✓ Balanced!");
      setMsgType("ok");
      setTimeout(() => { setShowInfo(true); onComplete(stage.id, 3, time); }, 600);
    } else {
      sound.wrong();
      const diff = Math.abs(left - right);
      setMessage(lang === "ar"
        ? `❌ غير متوازن! الفرق ${diff} — الجهة ${left > right ? "اليسرى" : "اليمنى"} أثقل`
        : `❌ Unbalanced! Diff ${diff} — ${left > right ? "Left" : "Right"} is heavier`);
      setMsgType("error");
    }
  }

  const leftW = totalWeight(leftSide);
  const rightW = totalWeight(rightSide);
  const maxW = Math.max(leftW, rightW, 1);

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
        <p style={{ fontSize: "0.82rem", color: "var(--text-light)", marginBottom: "0.75rem" }}>
          {lang === "ar" ? "وزّع الأقواس على الجانبين لتحقيق التوازن" : "Distribute arches on both sides to achieve balance"}
        </p>

        {/* Balance scale */}
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginBottom: "0.5rem" }}>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-light)", marginBottom: "0.15rem" }}>
              {lang === "ar" ? stage.leftLabel : "Left side"}
            </div>
            <div style={{
              background: "linear-gradient(180deg, #1a237e, #283593)", borderRadius: 8,
              minHeight: 100, padding: "0.35rem", border: "2px solid rgba(92,107,192,0.5)",
              display: "flex", flexDirection: "column", gap: "0.25rem", alignItems: "center",
            }}>
              {leftSide.map(id => {
                const arch = stage.arches.find(a => a.id === id)!;
                return (
                  <div key={id} onClick={() => removeFromSide(id)} style={{
                    background: arch.color, borderRadius: "50% 50% 4px 4px",
                    padding: "0.15rem 0.5rem", color: "#fff", fontWeight: 700,
                    fontSize: "0.75rem", cursor: "pointer", width: "70%",
                    transition: "transform 0.15s",
                  }}>
                    {arch.weight}
                  </div>
                );
              })}
              <div style={{ flex: 1 }} />
              <div style={{ color: "#fff", fontSize: "0.85rem", fontWeight: 700, borderTop: "1px solid rgba(255,255,255,0.2)", width: "100%", paddingTop: "0.25rem" }}>
                = {leftW}
              </div>
            </div>
          </div>

          {/* Scale visual */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", paddingBottom: 8 }}>
            <div style={{
              width: 4, height: 60, background: "#5C6BC0", borderRadius: 2,
              transform: leftW !== rightW ? `rotate(${((leftW - rightW) / maxW) * 15}deg)` : "rotate(0deg)",
              transformOrigin: "top center", transition: "transform 0.4s",
            }} />
            <div style={{ width: 60, height: 6, background: "#5C6BC0", borderRadius: 2 }} />
          </div>

          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-light)", marginBottom: "0.15rem" }}>
              {lang === "ar" ? stage.rightLabel : "Right side"}
            </div>
            <div style={{
              background: "linear-gradient(180deg, #1a237e, #283593)", borderRadius: 8,
              minHeight: 100, padding: "0.35rem", border: "2px solid rgba(92,107,192,0.5)",
              display: "flex", flexDirection: "column", gap: "0.25rem", alignItems: "center",
            }}>
              {rightSide.map(id => {
                const arch = stage.arches.find(a => a.id === id)!;
                return (
                  <div key={id} onClick={() => removeFromSide(id)} style={{
                    background: arch.color, borderRadius: "50% 50% 4px 4px",
                    padding: "0.15rem 0.5rem", color: "#fff", fontWeight: 700,
                    fontSize: "0.75rem", cursor: "pointer", width: "70%",
                    transition: "transform 0.15s",
                  }}>
                    {arch.weight}
                  </div>
                );
              })}
              <div style={{ flex: 1 }} />
              <div style={{ color: "#fff", fontSize: "0.85rem", fontWeight: 700, borderTop: "1px solid rgba(255,255,255,0.2)", width: "100%", paddingTop: "0.25rem" }}>
                = {rightW}
              </div>
            </div>
          </div>
        </div>

        {/* Arch pieces pool */}
        <div style={{ display: "flex", gap: "0.35rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "0.5rem" }}>
          {stage.arches.filter(a => !leftSide.includes(a.id) && !rightSide.includes(a.id)).map(arch => (
            <div key={arch.id} style={{
              background: arch.color, borderRadius: "50% 50% 6px 6px",
              padding: "0.3rem 0.6rem", color: "#fff", fontWeight: 700,
              fontSize: "0.85rem", minWidth: 44, textAlign: "center",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }}>
              <div>{arch.weight}</div>
              <div style={{ display: "flex", gap: "0.15rem", justifyContent: "center", marginTop: "0.2rem" }}>
                <button onClick={() => assignToSide(arch.id, "left")} style={sideBtn}>←</button>
                <button onClick={() => assignToSide(arch.id, "right")} style={sideBtn}>→</button>
              </div>
            </div>
          ))}
        </div>

        {/* Message */}
        {message && (
          <div style={{
            fontSize: "0.82rem", fontWeight: 700,
            color: msgType === "ok" ? "var(--green-primary)" : "var(--red)",
            marginBottom: "0.35rem",
          }}>
            {message}
          </div>
        )}

        {/* Check button */}
        {!completed && (
          <button onClick={checkBalance} style={{
            background: "linear-gradient(135deg, #5C6BC0, #3949AB)", color: "#fff",
            padding: "0.6rem 1.5rem", borderRadius: 10, fontSize: "0.9rem", fontWeight: 700,
            boxShadow: "0 2px 8px rgba(92,107,192,0.3)", border: "none", cursor: "pointer",
          }}>
            {lang === "ar" ? "⚖️ تحقق من التوازن" : "⚖️ Check Balance"}
          </button>
        )}

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
              ⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}
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
const sideBtn: CSSProperties = { background: "rgba(255,255,255,0.25)", color: "#fff", border: "none", borderRadius: 4, padding: "0.1rem 0.35rem", fontSize: "0.7rem", cursor: "pointer", fontWeight: 700 };
