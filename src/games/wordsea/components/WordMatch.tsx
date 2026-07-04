import { useState } from "react";
import type { LangStr } from "../data/stages";

interface Props {
  pairs: { left: LangStr; right: LangStr }[];
  source: LangStr;
  lang: "ar" | "en";
  onComplete: (correct: boolean) => void;
}

export function WordMatch({ pairs, source, lang, onComplete }: Props) {
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [matched, setMatched] = useState<Record<number, number>>({});
  const [rightOrder] = useState(() => {
    const arr = pairs.map((_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });
  const [done, setDone] = useState(false);

  const t = (s: LangStr) => s[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  function handleLeftClick(idx: number) {
    if (done) return;
    if (matched[idx] !== undefined) return;
    setSelectedLeft(idx);
  }

  function handleRightClick(rightOrigIdx: number) {
    if (done) return;
    if (selectedLeft === null) return;
    const newMatched = { ...matched, [selectedLeft]: rightOrigIdx };
    setMatched(newMatched);
    setSelectedLeft(null);

    if (Object.keys(newMatched).length === pairs.length) {
      setDone(true);
      const correct = pairs.every((_, i) => newMatched[i] === i);
      onComplete(correct);
    }
  }

  return (
    <div dir={dir} style={{ padding: "1rem" }}>
      {/* Instructions */}
      <div style={{
        background: "rgba(21,101,192,0.08)", borderRadius: 8,
        padding: "0.6rem 0.75rem", marginBottom: "1rem",
        border: "1px solid rgba(21,101,192,0.2)",
        fontSize: "0.85rem", lineHeight: 1.7,
      }}>
        {lang === "ar" ? (
          <>
            <strong>📌 طريقة اللعب:</strong> اختر رقماً من القائمة اليسرى أولاً، ثم اختر المعنى المناسب له من القائمة اليمنى.
          </>
        ) : (
          <>
            <strong>📌 How to play:</strong> First select a number from the left list, then choose its matching meaning from the right list.
          </>
        )}
      </div>

      <div style={{
        display: "grid", gap: "0.75rem", marginBottom: "1rem",
      }}>
        {pairs.map((pair, leftIdx) => {
          const isSelected = selectedLeft === leftIdx;
          const matchedRight = matched[leftIdx];
          let bg = "var(--card-bg)";
          let bc = "var(--border)";
          if (matchedRight !== undefined) {
            bg = matchedRight === leftIdx ? "rgba(27,107,62,0.12)" : "rgba(160,48,48,0.12)";
            bc = matchedRight === leftIdx ? "#1b6b3e" : "#a03030";
          } else if (isSelected) {
            bg = "rgba(255,215,0,0.15)";
            bc = "#ffd700";
          }
          return (
            <button
              key={`l-${leftIdx}`}
              onClick={() => handleLeftClick(leftIdx)}
              style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                background: bg, border: `2px solid ${bc}`,
                borderRadius: 8, padding: "0.65rem 0.75rem",
                cursor: (done || matched[leftIdx] !== undefined) ? "default" : "pointer",
                transition: "all 0.2s",
              }}
            >
              <span style={{
                width: 28, height: 28, borderRadius: "50%",
                background: matchedRight !== undefined ? (matchedRight === leftIdx ? "#1b6b3e" : "#a03030") : isSelected ? "#ffd700" : "var(--border)",
                color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.75rem", fontWeight: 700, flexShrink: 0,
              }}>
                {matchedRight !== undefined ? (matchedRight === leftIdx ? "✓" : "✗") : leftIdx + 1}
              </span>
              <span style={{ fontSize: "0.95rem", fontWeight: 600, lineHeight: 1.4 }}>
                {t(pair.left)}
              </span>
              {matchedRight !== undefined && (
                <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: matchedRight === leftIdx ? "#1b6b3e" : "#a03030", fontWeight: 600 }}>
                  {t(pairs[matchedRight].right)}
                </span>
              )}
              {done && matchedRight === leftIdx && (
                <span style={{ marginLeft: "auto", fontSize: "1rem" }}>✅</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Right column */}
      {!done && (
        <div style={{
          background: "rgba(139,105,20,0.08)", borderRadius: 8, padding: "0.75rem",
          border: "2px solid #d4b87a", marginBottom: "0.75rem",
        }}>
          <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#8B6914", marginBottom: "0.5rem" }}>
            {lang === "ar" ? "اختر المعنى المناسب (اضغط على المعنى من هذه القائمة):" : "Choose the matching meaning (click a meaning from this list):"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            {rightOrder.map((origIdx) => {
              const isUsed = Object.values(matched).includes(origIdx);
              return (
                <button
                  key={`r-${origIdx}`}
                  onClick={() => !isUsed && handleRightClick(origIdx)}
                  style={{
                    padding: "0.5rem 0.75rem",
                    background: isUsed ? "rgba(200,200,200,0.3)" : "var(--card-bg)",
                    border: "2px solid var(--border)",
                    borderRadius: 6,
                    fontSize: "0.85rem", fontWeight: 500,
                    color: isUsed ? "#ccc" : "var(--text)",
                    cursor: isUsed ? "default" : "pointer",
                    opacity: isUsed ? 0.5 : 1,
                    textAlign: lang === "ar" ? "right" : "left",
                    transition: "all 0.2s",
                  }}
                >
                  {t(pairs[origIdx].right)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {done && (
        <div style={{
          background: "rgba(27,107,62,0.1)", borderRadius: 8, padding: "0.5rem 0.75rem",
          border: "1px solid var(--green-primary)", fontSize: "0.8rem", lineHeight: 1.6,
        }}>
          📖 {t(source)}
        </div>
      )}
    </div>
  );
}
