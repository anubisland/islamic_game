import { useState, useRef, type CSSProperties } from "react";
import { useTranslation } from "../../../i18n";
import { useSound } from "../../../hooks/useSound";

export interface TileSlot {
  id: string;
  /** Center x,y as % of container size */
  x: number;
  y: number;
  /** Shape to accept: "triangle" | "diamond" */
  accepts: string;
  /** Color hex that should go here */
  color: string;
  /** Correct rotation in degrees */
  correctRotation: number;
}

export interface TilePiece {
  id: string;
  shape: "triangle" | "diamond";
  color: string;
  label: string;
  /** The slot this piece belongs to */
  slotId: string;
  /** Starting rotation in degrees (default 0) */
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

export function TilePuzzle({ title, subtitle, slotSize = 90, pieces: piecesInit, slots, info, onComplete }: Props) {
  const { lang } = useTranslation();
  const sound = useSound();
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [rotation, setRotation] = useState<Record<string, number>>(() =>
    Object.fromEntries(piecesInit.map(p => [p.id, p.initialRotation ?? 0]))
  );
  const [completed, setCompleted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [dragging, setDragging] = useState<string | null>(null);
  const dragRef = useRef<{ x: number; y: number; startX: number; startY: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [wrongShake, setWrongShake] = useState<string | null>(null);

  const available = piecesInit.filter(p => !placed[p.id]);

  function selectPiece(id: string) {
    if (completed) return;
    sound.click();
    setSelected(prev => prev === id ? null : id);
  }

  function rotatePiece(id: string) {
    if (dragging) return;
    sound.click();
    setRotation(prev => ({ ...prev, [id]: ((prev[id] ?? 0) + 45) % 360 }));
  }

  function handleDragStart(id: string, e: React.MouseEvent | React.TouchEvent) {
    if (completed) return;
    setSelected(id);
    setDragging(id);
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    dragRef.current = {
      x: clientX - rect.left,
      y: clientY - rect.top,
      startX: clientX,
      startY: clientY,
    };
    setDragPos({ x: clientX - rect.left - 30, y: clientY - rect.top - 30 });
  }

  function handleDragMove(e: React.MouseEvent | React.TouchEvent) {
    if (!dragging) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setDragPos({ x: clientX - rect.left - 30, y: clientY - rect.top - 30 });
  }

  function handleDragEnd(e: React.MouseEvent | React.TouchEvent) {
    if (!dragging) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clientX = "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
    const clientY = "changedTouches" in e ? e.changedTouches[0].clientY : e.clientY;
    const relX = clientX - rect.left;
    const relY = clientY - rect.top;

    const piece = piecesInit.find(p => p.id === dragging);
    if (!piece) { setDragging(null); setDragPos(null); return; }

    const slot = slots.find(s => s.id === piece.slotId);
    if (!slot) { setDragging(null); setDragPos(null); return; }

    const slotAbsX = (slot.x / 100) * rect.width;
    const slotAbsY = (slot.y / 100) * rect.height;
    const dist = Math.sqrt((relX - slotAbsX) ** 2 + (relY - slotAbsY) ** 2);
    const rotOk = Math.abs(((rotation[piece.id] ?? 0) - slot.correctRotation) % 360) < 22.5 ||
                  Math.abs(((rotation[piece.id] ?? 0) - slot.correctRotation) % 360 - 360) < 22.5;

    if (dist < slotSize && rotOk) {
      sound.correct();
      setPlaced(prev => ({ ...prev, [piece.id]: slot.id }));
      setSelected(null);
      const remainingNew = piecesInit.filter(p => p.id !== piece.id && !placed[p.id]).length - 1;
      if (remainingNew === 0) {
        setCompleted(true);
        setTimeout(() => { setShowInfo(true); onComplete(); }, 600);
      }
    } else {
      sound.wrong();
      setWrongShake(piece.id);
      setTimeout(() => setWrongShake(null), 400);
    }

    setDragging(null);
    setDragPos(null);
  }

  return (
    <div
      ref={containerRef}
      style={{
        maxWidth: 500,
        margin: "0 auto",
        padding: "1rem 0.75rem",
        userSelect: "none",
        touchAction: "none",
        position: "relative",
      }}
      onMouseMove={handleDragMove}
      onTouchMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onTouchEnd={handleDragEnd}
    >
      <h2 style={{ fontSize: "1.1rem", color: "var(--green-primary)", textAlign: "center", marginBottom: "0.25rem" }}>
        {title}
      </h2>
      <p style={{ fontSize: "0.82rem", color: "var(--text-light)", textAlign: "center", marginBottom: "0.75rem" }}>
        {subtitle}
      </p>

      {/* Pattern area */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1",
          maxWidth: 360,
          margin: "0 auto",
          background: "linear-gradient(135deg, #f5f0e6, #e8dcc8)",
          borderRadius: 14,
          border: completed ? "3px solid var(--gold)" : "3px solid var(--border)",
          overflow: "hidden",
        }}
      >
        {/* Background decorative pattern */}
        <svg viewBox="0 0 300 300" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.15 }}>
          <defs>
            <pattern id="bg-pattern" patternUnits="userSpaceOnUse" width="30" height="30">
              <path d="M0 15 L15 0 L30 15 L15 30Z" fill="none" stroke="#1b6b3e" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="300" height="300" fill="url(#bg-pattern)" />
        </svg>

        {/* Slot outlines */}
        {slots.map(slot => {
          const isFilled = Object.values(placed).includes(slot.id);
          const isTriangle = slot.accepts === "triangle";
          return (
            <div
              key={slot.id}
              style={{
                position: "absolute",
                left: `calc(${slot.x}% - ${slotSize / 2}px)`,
                top: `calc(${slot.y}% - ${slotSize / 2}px)`,
                width: slotSize,
                height: slotSize,
                border: isFilled ? "2px solid var(--gold)" : "2px dashed rgba(0,0,0,0.2)",
                borderRadius: isTriangle ? "0" : "10px",
                transform: `rotate(${slot.correctRotation}deg)`,
                clipPath: isTriangle ? "polygon(50% 0%, 0% 100%, 100% 100%)" : "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                background: isFilled ? slot.color : "rgba(255,255,255,0.3)",
                transition: "background 0.3s, border-color 0.3s",
                zIndex: 1,
              }}
            />
          );
        })}

        {/* Placed pieces */}
        {piecesInit.filter(p => placed[p.id]).map(p => {
          const slot = slots.find(s => s.id === p.slotId);
          if (!slot) return null;
          return (
            <div
              key={p.id}
              style={{
                position: "absolute",
                left: `calc(${slot.x}% - ${slotSize / 2}px)`,
                top: `calc(${slot.y}% - ${slotSize / 2}px)`,
                width: slotSize,
                height: slotSize,
                transform: `rotate(${rotation[p.id] ?? slot.correctRotation}deg)`,
                clipPath: p.shape === "triangle" ? "polygon(50% 0%, 0% 100%, 100% 100%)" : "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                background: p.color,
                borderRadius: p.shape === "diamond" ? "0" : "0",
                zIndex: 2,
                animation: "fadeIn 0.3s ease",
              }}
            />
          );
        })}

        {/* Drag ghost */}
        {dragging && dragPos && (
          <div
            style={{
              position: "absolute",
              left: dragPos.x,
              top: dragPos.y,
              width: slotSize,
              height: slotSize,
              transform: `rotate(${rotation[dragging] ?? 0}deg)`,
              clipPath: (piecesInit.find(p => p.id === dragging)?.shape === "triangle")
                ? "polygon(50% 0%, 0% 100%, 100% 100%)"
                : "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
              background: piecesInit.find(p => p.id === dragging)?.color ?? "#ccc",
              opacity: 0.8,
              zIndex: 10,
              borderRadius: piecesInit.find(p => p.id === dragging)?.shape === "diamond" ? "0" : "0",
              pointerEvents: "none",
            }}
          />
        )}
      </div>

      {/* Toolbox */}
      {!completed && (
        <div style={{
          display: "flex",
          gap: "0.75rem",
          justifyContent: "center",
          marginTop: "1rem",
          flexWrap: "wrap",
          minHeight: 70,
          padding: "0.5rem",
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
              const isWrong = wrongShake === p.id;
              return (
                <div key={p.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
                  <div
                    onMouseDown={(e) => handleDragStart(p.id, e)}
                    onTouchStart={(e) => handleDragStart(p.id, e)}
                    onClick={() => { if (!dragging) selectPiece(p.id); }}
                    style={{
                      width: 60,
                      height: 60,
                      clipPath: p.shape === "triangle"
                        ? "polygon(50% 0%, 0% 100%, 100% 100%)"
                        : "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                      background: p.color,
                      transform: `rotate(${rotation[p.id] ?? 0}deg)`,
                      cursor: "grab",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      boxShadow: isSelected
                        ? "0 0 0 3px var(--gold), 0 4px 12px rgba(0,0,0,0.2)"
                        : "0 2px 8px rgba(0,0,0,0.15)",
                      animation: isWrong ? "shake 0.4s ease" : "none",
                      borderRadius: p.shape === "diamond" ? "0" : "0",
                    }}
                  />
                  {isSelected && (
                    <button
                      onClick={() => rotatePiece(p.id)}
                      style={{
                        fontSize: "0.7rem",
                        padding: "0.15rem 0.5rem",
                        background: "var(--green-light)",
                        color: "#fff",
                        borderRadius: 6,
                        fontWeight: 600,
                        whiteSpace: "nowrap",
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
          marginTop: "1rem",
          padding: "1.25rem",
          background: "var(--card-bg)",
          borderRadius: "var(--radius)",
          boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--card-border)",
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
  color: "#fff",
  padding: "0.65rem 2rem",
  borderRadius: 10,
  fontSize: "0.9rem",
  fontWeight: 700,
};
