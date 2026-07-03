import { useState, useRef, type CSSProperties } from "react";
import { useTranslation } from "../../../i18n";
import { useSound } from "../../../hooks/useSound";

export interface TileSlot {
  id: string;
  x: number;
  y: number;
  accepts: "triangle" | "diamond";
  color: string;
  correctRotation: number;
}

export interface TilePiece {
  id: string;
  shape: "triangle" | "diamond";
  color: string;
  label: string;
  slotId: string;
  initialRotation?: number;
}

interface Props {
  title: string;
  subtitle: string;
  slotSize?: number;
  pieces: TilePiece[];
  slots: TileSlot[];
  info: { title: string; content: string };
  onComplete: () => void;
}

export function TilePuzzle({ title, subtitle, slotSize = 80, pieces: piecesInit, slots, info, onComplete }: Props) {
  const { lang } = useTranslation();
  const sound = useSound();
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [rotation, setRotation] = useState<Record<string, number>>(() =>
    Object.fromEntries(piecesInit.map(p => [p.id, p.initialRotation ?? 0]))
  );
  const [completed, setCompleted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [showRef, setShowRef] = useState(false);
  const areaRef = useRef<HTMLDivElement>(null);

  const available = piecesInit.filter(p => !placed[p.id]);

  function selectPiece(id: string) {
    if (completed) return;
    sound.click();
    setSelected(prev => (prev === id ? null : id));
  }

  function rotateSelected() {
    if (!selected || completed) return;
    sound.click();
    setRotation(prev => ({ ...prev, [selected]: ((prev[selected] ?? 0) + 45) % 360 }));
  }

  function tryPlace(pieceId: string, slotX: number, slotY: number) {
    const piece = piecesInit.find(p => p.id === pieceId);
    if (!piece) return false;
    const slot = slots.find(s => s.id === piece.slotId);
    if (!slot) return false;

    const sx = (slot.x / 100) * (areaRef.current?.clientWidth ?? 300);
    const sy = (slot.y / 100) * (areaRef.current?.clientHeight ?? 300);
    const dist = Math.sqrt((slotX - sx) ** 2 + (slotY - sy) ** 2);
    const r = rotation[piece.id] ?? 0;
    const rotOk = Math.abs((r - slot.correctRotation) % 360) < 22.5 ||
                  Math.abs((r - slot.correctRotation) % 360 - 360) < 22.5;

    if (dist < slotSize + 10 && rotOk) {
      sound.correct();
      setPlaced(prev => ({ ...prev, [pieceId]: slot.id }));
      setSelected(null);
      const left = piecesInit.filter(p => p.id !== pieceId && !placed[p.id]).length - 1;
      if (left === 0) {
        setCompleted(true);
        setTimeout(() => { setShowInfo(true); onComplete(); }, 600);
      }
      return true;
    }
    return false;
  }

  function handleAreaClick(e: React.MouseEvent) {
    if (!selected || completed) return;
    const rect = areaRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (!tryPlace(selected, x, y)) {
      sound.wrong();
      setWrongId(selected);
      setSelected(null);
      setTimeout(() => setWrongId(null), 300);
    }
  }

  function handleTouchSlot(slotX: number, slotY: number) {
    if (!selected || completed) return;
    if (!tryPlace(selected, slotX, slotY)) {
      sound.wrong();
      setWrongId(selected);
      setSelected(null);
      setTimeout(() => setWrongId(null), 300);
    }
  }

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: "1rem 0.75rem", userSelect: "none" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.1rem", color: "var(--green-primary)", margin: 0 }}>{title}</h2>
          <p style={{ fontSize: "0.82rem", color: "var(--text-light)", margin: 0 }}>{subtitle}</p>
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
            : (lang === "ar" ? "🔍 شكل كامل" : "🔍 Reference")}
        </button>
      </div>

      {/* Guide */}
      <div style={{
        padding: "0.5rem 0.75rem",
        background: "rgba(212,160,43,0.12)",
        borderRadius: 8,
        border: "1px solid rgba(212,160,43,0.3)",
        fontSize: "0.82rem",
        color: "var(--text)",
        marginBottom: "0.75rem",
        textAlign: "center",
        lineHeight: 1.6,
      }}>
        {selected
          ? (lang === "ar"
              ? "👆 اضغط على الفراغ المناسب في النجمة لوضع القطعة، أو اضغط 🔄 لتدويرها"
              : "👆 Tap the correct slot on the star to place the piece, or tap 🔄 to rotate")
          : (lang === "ar"
              ? "💡 اختر قطعة من الأسفل، ثم اضغط على مكانها في النجمة لتركيبها. استخدم 🔄 للتدوير"
              : "💡 Pick a piece below, then tap its place on the star. Use 🔄 to rotate")}
      </div>

      {/* Pattern area */}
      <div
        ref={areaRef}
        onClick={handleAreaClick}
        style={{
          position: "relative", width: "100%", aspectRatio: "1", maxWidth: 360,
          margin: "0 auto",
          background: "linear-gradient(135deg, #f5f0e6, #e8dcc8)",
          borderRadius: 14,
          border: completed ? "3px solid var(--gold)" : "3px solid var(--border)",
          overflow: "hidden",
          cursor: selected ? "crosshair" : "default",
        }}
      >
        {/* Decorative bg */}
        <svg viewBox="0 0 300 300" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.10 }}>
          <defs>
            <pattern id="bg-p" patternUnits="userSpaceOnUse" width="30" height="30">
              <path d="M0 15 L15 0 L30 15 L15 30Z" fill="none" stroke="#1b6b3e" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="300" height="300" fill="url(#bg-p)" />
        </svg>

        {/* Reference overlay */}
        {showRef && !completed && (
          <div style={{ position: "absolute", inset: 0, zIndex: 5, opacity: 0.35, pointerEvents: "none" }}>
            {slots.map(slot => (
              <div key={slot.id} style={{
                position: "absolute",
                left: `calc(${slot.x}% - ${slotSize / 2}px)`,
                top: `calc(${slot.y}% - ${slotSize / 2}px)`,
                width: slotSize,
                height: slotSize,
                transform: `rotate(${slot.correctRotation}deg)`,
                clipPath: slot.accepts === "triangle"
                  ? "polygon(50% 0%, 0% 100%, 100% 100%)"
                  : "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                background: slot.color,
                border: "1px solid rgba(0,0,0,0.15)",
              }} />
            ))}
          </div>
        )}

        {/* Star center decorative */}
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          width: slotSize * 0.5, height: slotSize * 0.5,
          background: "rgba(212,160,43,0.15)",
          borderRadius: "50%",
          zIndex: 0,
          border: "1px solid rgba(212,160,43,0.25)",
        }} />

        {/* Slot outlines */}
        {slots.map(slot => {
          const isFilled = Object.values(placed).includes(slot.id);
          const isTri = slot.accepts === "triangle";
          return (
            <div
              key={slot.id}
              onClick={(e) => { e.stopPropagation(); if (selected) handleTouchSlot(
                (slot.x / 100) * (areaRef.current?.clientWidth ?? 300),
                (slot.y / 100) * (areaRef.current?.clientHeight ?? 300)
              ); }}
              style={{
                position: "absolute",
                left: `calc(${slot.x}% - ${slotSize / 2}px)`,
                top: `calc(${slot.y}% - ${slotSize / 2}px)`,
                width: slotSize,
                height: slotSize,
                border: isFilled ? "2px solid var(--gold)" : "2px dashed rgba(0,0,0,0.25)",
                transform: `rotate(${slot.correctRotation}deg)`,
                clipPath: isTri ? "polygon(50% 0%, 0% 100%, 100% 100%)" : "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                background: isFilled ? slot.color : "rgba(255,255,255,0.3)",
                transition: "background 0.3s, border-color 0.3s",
                zIndex: 1,
                cursor: selected ? "pointer" : "default",
              }}
            />
          );
        })}

        {/* Placed pieces */}
        {piecesInit.filter(p => placed[p.id]).map(p => {
          const slot = slots.find(s => s.id === p.slotId);
          if (!slot) return null;
          return (
            <div key={p.id} style={{
              position: "absolute",
              left: `calc(${slot.x}% - ${slotSize / 2}px)`,
              top: `calc(${slot.y}% - ${slotSize / 2}px)`,
              width: slotSize,
              height: slotSize,
              transform: `rotate(${rotation[p.id] ?? slot.correctRotation}deg)`,
              clipPath: p.shape === "triangle" ? "polygon(50% 0%, 0% 100%, 100% 100%)" : "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
              background: p.color,
              zIndex: 2,
              animation: "fadeIn 0.3s ease",
              boxShadow: "0 0 6px rgba(0,0,0,0.15)",
            }} />
          );
        })}
      </div>

      {/* Toolbox */}
      {!completed && (
        <div style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          marginTop: "1rem",
          flexWrap: "wrap",
          minHeight: 90,
          padding: "0.75rem",
          background: "var(--card-bg)",
          borderRadius: 10,
          border: "1px solid var(--border)",
        }}>
          {available.length === 0 ? (
            <span style={{ color: "var(--text-light)", fontSize: "0.85rem", padding: "0.5rem" }}>
              {lang === "ar" ? "✔️ تم وضع جميع القطع!" : "✔️ All pieces placed!"}
            </span>
          ) : (
            available.map(p => {
              const isSelected = selected === p.id;
              const isWrong = wrongId === p.id;
              return (
                <div key={p.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}>
                  <div
                    onClick={() => selectPiece(p.id)}
                    style={{
                      width: 64,
                      height: 64,
                      clipPath: p.shape === "triangle"
                        ? "polygon(50% 0%, 0% 100%, 100% 100%)"
                        : "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                      background: p.color,
                      transform: `rotate(${rotation[p.id] ?? 0}deg)`,
                      cursor: "pointer",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      boxShadow: isSelected
                        ? "0 0 0 3px var(--gold), 0 4px 12px rgba(0,0,0,0.25)"
                        : "0 2px 8px rgba(0,0,0,0.15)",
                      animation: isWrong ? "shake 0.4s ease" : "none",
                    }}
                  />
                  {isSelected && (
                    <button
                      onClick={rotateSelected}
                      style={{
                        fontSize: "0.7rem", padding: "0.2rem 0.5rem",
                        background: "var(--green-light)", color: "#fff",
                        borderRadius: 6, fontWeight: 600, whiteSpace: "nowrap",
                      }}
                    >
                      🔄 {lang === "ar" ? "تدوير" : "Rotate"} ({(rotation[p.id] ?? 0) % 360}°)
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Complete + Info */}
      {completed && showInfo && (
        <div className="animate-fade-in-up" style={{
          marginTop: "1rem", padding: "1.25rem",
          background: "var(--card-bg)", borderRadius: "var(--radius)",
          boxShadow: "var(--shadow-lg)", border: "1px solid var(--card-border)",
          textAlign: "center",
        }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🏆</div>
          <h3 style={{ color: "var(--green-primary)", fontSize: "1.15rem", marginBottom: "0.75rem" }}>
            {lang === "ar" ? "أحسنت يا مهندس!" : "Well done, Architect!"}
          </h3>
          <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--gold)", marginBottom: "0.5rem" }}>
            {info.title}
          </div>
          <p style={{ fontSize: "0.85rem", lineHeight: 1.7, color: "var(--text)", marginBottom: "1rem" }}>
            {info.content}
          </p>
          <button onClick={onComplete} style={btnStyle}>
            {lang === "ar" ? "العودة إلى القائمة" : "Back to list"}
          </button>
        </div>
      )}
    </div>
  );
}

const btnStyle: CSSProperties = {
  background: "linear-gradient(135deg, var(--green-primary), var(--green-dark))",
  color: "#fff", padding: "0.65rem 2rem", borderRadius: 10, fontSize: "0.9rem", fontWeight: 700,
};
