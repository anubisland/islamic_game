import { useState, useEffect, useRef, type CSSProperties } from "react";
import { useTranslation } from "../../../i18n";
import { useSound } from "../../../hooks/useSound";

export interface MosaicTileData {
  id: string;
  edges: [number, number, number, number];
}

interface Props {
  stage: {
    id: string;
    title: string;
    subtitle: string;
    era: string;
    eraIcon: string;
    icon: string;
    mosaicData: { gridSize: number; tiles: MosaicTileData[] };
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

const EDGE_W = 4;

function TileView({
  tile,
  palette,
  size,
  selected,
  onClick,
  mismatch,
}: {
  tile: MosaicTileData;
  palette: string[];
  size: number;
  selected?: boolean;
  onClick?: () => void;
  mismatch?: boolean;
}) {
  const [t, r, b, l] = tile.edges;
  return (
    <div
      onClick={onClick}
      style={{
        width: size,
        height: size,
        border: `${EDGE_W}px solid ${mismatch ? "#C62828" : selected ? "#FFD600" : "#888"}`,
        borderTopColor: t === 0 ? (mismatch ? "#C62828" : "transparent") : palette[t - 1],
        borderRightColor: r === 0 ? (mismatch ? "#C62828" : "transparent") : palette[r - 1],
        borderBottomColor: b === 0 ? (mismatch ? "#C62828" : "transparent") : palette[b - 1],
        borderLeftColor: l === 0 ? (mismatch ? "#C62828" : "transparent") : palette[l - 1],
        boxSizing: "border-box",
        cursor: onClick ? "pointer" : undefined,
        transition: "border-color 0.15s, box-shadow 0.2s",
        boxShadow: selected
          ? "0 0 0 2px #FFD600, 0 2px 8px rgba(255,214,0,0.3)"
          : mismatch
          ? "0 0 0 2px #C62828"
          : undefined,
        borderRadius: 2,
        background: "var(--card-bg)",
        flexShrink: 0,
      }}
    />
  );
}

interface CheckResult {
  ok: boolean;
  mismatches: Set<string>;
}

function checkPuzzle(
  grid: (MosaicTileData | null)[][]
): CheckResult {
  const size = grid.length;
  const mismatches = new Set<string>();
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const tile = grid[y][x];
      if (!tile) continue;
      if (y < size - 1) {
        const below = grid[y + 1][x];
        if (below && tile.edges[2] !== below.edges[0]) {
          mismatches.add(tile.id);
          mismatches.add(below.id);
        }
      }
      if (x < size - 1) {
        const right = grid[y][x + 1];
        if (right && tile.edges[1] !== right.edges[3]) {
          mismatches.add(tile.id);
          mismatches.add(right.id);
        }
      }
    }
  }
  return { ok: mismatches.size === 0, mismatches };
}

export function MosaicPuzzle({ stage, onComplete, onBack }: Props) {
  const { lang } = useTranslation();
  const sound = useSound();

  const size = stage.mosaicData.gridSize;
  const tiles = stage.mosaicData.tiles;
  const [pool, setPool] = useState<MosaicTileData[]>(() => shuffle(tiles));
  const [grid, setGrid] = useState<(MosaicTileData | null)[][]>(() =>
    Array.from({ length: size }, () => Array(size).fill(null))
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null);
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

  function handlePoolClick(tile: MosaicTileData) {
    if (completed || showInfo) return;
    setSelectedId(prev => (prev === tile.id ? null : tile.id));
    setCheckResult(null);
  }

  function handleSlotClick(x: number, y: number) {
    if (completed || showInfo) return;
    const existing = grid[y][x];
    if (existing) {
      setPool(p => [...p, existing]);
      setGrid(g => {
        const n = g.map(r => [...r]);
        n[y][x] = null;
        return n;
      });
      setSelectedId(null);
      setCheckResult(null);
      return;
    }
    if (!selectedId) return;
    const idx = pool.findIndex(t => t.id === selectedId);
    if (idx === -1) return;
    sound.click();
    const tile = pool[idx];
    setGrid(g => {
      const n = g.map(r => [...r]);
      n[y][x] = tile;
      return n;
    });
    setPool(p => p.filter((_, i) => i !== idx));
    setSelectedId(null);
    setCheckResult(null);
  }

  function handleCheck() {
    if (completed || showInfo) return;
    const result = checkPuzzle(grid);
    if (result.ok) {
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
      setCheckResult(result);
      setTimeout(() => setCheckResult(null), 2000);
    }
  }

  function resetPuzzle() {
    if (completed || showInfo) return;
    setPool(shuffle(tiles));
    setGrid(Array.from({ length: size }, () => Array(size).fill(null)));
    setSelectedId(null);
    setCheckResult(null);
  }

  const TILE = Math.min(48, Math.floor((window.innerWidth - 48) / size));

  return (
    <div>
      <header style={headerStyle}>
        <div style={headerInner}>
          <button onClick={onBack} style={backBtn}>{lang === "ar" ? "← رجوع" : "← Back"}</button>
          <span style={{ fontSize: "0.75rem", opacity: 0.9 }}>{stage.eraIcon} {stage.era}</span>
          <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</span>
        </div>
      </header>

      <div style={{ maxWidth: 420, margin: "0 auto", padding: "0.5rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "1rem", color: "var(--green-primary)", margin: "0 0 0.25rem" }}>
          {stage.icon} {stage.title}
        </h2>
        <p style={{ fontSize: "0.78rem", color: "var(--text-light)", marginBottom: "0.25rem" }}>
          {lang === "ar"
            ? "ضع البلاطات في الشبكة بحيث تتطابق ألوان الحواف المتجاورة"
            : "Place tiles so touching edges share the same color"}
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", fontSize: "0.78rem", marginBottom: "0.25rem" }}>
          <div>
            {lang === "ar" ? `الأخطاء: ${mistakes}` : `Mistakes: ${mistakes}`}
          </div>
          <div>
            {[0, 1, 2].map(i => {
              const starCount = mistakes === 0 ? 3 : mistakes <= 1 ? 2 : 1;
              return (
                <span key={i} style={{ fontSize: "1rem", color: i < starCount ? "var(--gold)" : "#ddd" }}>★</span>
              );
            })}
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: "inline-block", padding: 6, background: "var(--card-bg)", borderRadius: 8, border: "1px solid var(--border)", marginBottom: "0.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${size}, ${TILE + EDGE_W * 2}px)`, gap: 0 }}>
            {grid.flat().map((tile, idx) => {
              const x = idx % size;
              const y = Math.floor(idx / size);
              const mm = checkResult && tile ? checkResult.mismatches.has(tile.id) : false;
              return (
                <div
                  key={`slot-${x}-${y}`}
                  onClick={() => handleSlotClick(x, y)}
                  style={{
                    width: TILE + EDGE_W * 2,
                    height: TILE + EDGE_W * 2,
                    background: tile ? undefined : "rgba(0,0,0,0.04)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 0.15s",
                  }}
                >
                  {tile && (
                    <TileView
                      tile={tile}
                      palette={stage.palette}
                      size={TILE}
                      mismatch={mm}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Pool */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center", marginBottom: "0.5rem", padding: 6, background: "var(--card-bg)", borderRadius: 8, border: "1px solid var(--border)", minHeight: TILE + EDGE_W * 2 + 12 }}>
          {pool.length === 0 && (
            <div style={{ fontSize: "0.72rem", color: "var(--text-light)", padding: "0.5rem" }}>
              {lang === "ar" ? "كل البلاطات موضوعة!" : "All tiles placed!"}
            </div>
          )}
          {pool.map(tile => (
            <TileView
              key={tile.id}
              tile={tile}
              palette={stage.palette}
              size={TILE}
              selected={selectedId === tile.id}
              onClick={() => handlePoolClick(tile)}
            />
          ))}
        </div>

        {/* Check / Reset */}
        {!completed && (
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={handleCheck}
              disabled={pool.length > 0}
              style={{
                background: pool.length > 0
                  ? "var(--disabled)"
                  : "linear-gradient(135deg, #5C6BC0, #3949AB)",
                color: "#fff",
                padding: "0.55rem 1.5rem",
                borderRadius: 10,
                fontSize: "0.85rem",
                fontWeight: 700,
                border: "none",
                cursor: pool.length > 0 ? "not-allowed" : "pointer",
                boxShadow: pool.length > 0 ? undefined : "0 2px 8px rgba(92,107,192,0.3)",
                opacity: pool.length > 0 ? 0.5 : 1,
              }}
            >
              {lang === "ar" ? "✅ تحقق من التطابق" : "✅ Check Match"}
            </button>
            <button
              onClick={resetPuzzle}
              style={{
                background: "transparent",
                color: "var(--text-light)",
                padding: "0.55rem 1rem",
                borderRadius: 10,
                fontSize: "0.8rem",
                fontWeight: 600,
                border: "1px solid var(--border)",
                cursor: "pointer",
              }}
            >
              {lang === "ar" ? "🔄 إعادة تعيين" : "🔄 Reset"}
            </button>
          </div>
        )}

        {/* Completion */}
        {completed && showInfo && (
          <div className="animate-fade-in-up" style={infoCard}>
            <div style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>🏆</div>
            <h3 style={{ color: "var(--green-primary)", margin: "0 0 0.25rem", fontSize: "1rem" }}>
              {lang === "ar" ? "أحسنت! تطابق الفسيفساء!" : "Mosaic complete!"}
            </h3>
            <div style={{ marginBottom: "0.5rem" }}>
              {[0, 1, 2].map(i => {
                const starCount = mistakes === 0 ? 3 : mistakes <= 1 ? 2 : 1;
                return (
                  <span key={i} style={{ fontSize: "1.5rem", color: i < starCount ? "var(--gold)" : "#ddd" }}>
                    {i < starCount ? "★" : "☆"}
                  </span>
                );
              })}
            </div>
            {mistakes > 0 && (
              <div style={{ fontSize: "0.78rem", color: "var(--text-light)", marginBottom: "0.25rem" }}>
                {lang === "ar" ? `عدد المحاولات الخاطئة: ${mistakes}` : `Wrong attempts: ${mistakes}`}
              </div>
            )}
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
const btnPrimary: CSSProperties = { background: "linear-gradient(135deg, #5C6BC0, #3949AB)", color: "#fff", padding: "0.6rem 1.5rem", borderRadius: 10, fontSize: "0.85rem", fontWeight: 700, boxShadow: "0 2px 8px rgba(92,107,192,0.3)", marginTop: "0.5rem", border: "none", cursor: "pointer" };
const infoCard: CSSProperties = {
  marginTop: "1rem", padding: "1rem",
  background: "var(--card-bg)", borderRadius: "var(--radius)",
  boxShadow: "var(--shadow-lg)", border: "1px solid var(--card-border)",
};
