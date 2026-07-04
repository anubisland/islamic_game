import { useState } from "react";
import type { LangStr } from "../data/stages";

interface Props {
  items: LangStr[];
  correctOrder: number[];
  question: LangStr;
  info: LangStr;
  lang: "ar" | "en";
  onComplete: (correct: boolean) => void;
}

export function Timeline({ items, correctOrder, question, info, lang, onComplete }: Props) {
  const [order, setOrder] = useState<number[]>(items.map((_, i) => i));
  const [done, setDone] = useState(false);

  const t = (s: LangStr) => s[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  function moveUp(idx: number) {
    if (idx === 0 || done) return;
    const next = [...order];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    setOrder(next);
  }

  function moveDown(idx: number) {
    if (idx === order.length - 1 || done) return;
    const next = [...order];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    setOrder(next);
  }

  function check() {
    setDone(true);
    const correct = order.every((v, i) => v === correctOrder[i]);
    onComplete(correct);
  }

  return (
    <div dir={dir} style={{ padding: "1rem" }}>
      <p style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "1rem", lineHeight: 1.7 }}>
        {t(question)}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", marginBottom: "1rem" }}>
        {order.map((origIdx, pos) => (
          <div
            key={origIdx}
            style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              background: done
                ? order[pos] === correctOrder[pos]
                  ? "rgba(27,107,62,0.15)"
                  : "rgba(160,48,48,0.15)"
                : "var(--card-bg)",
              border: `2px solid ${
                done
                  ? order[pos] === correctOrder[pos]
                    ? "#1b6b3e"
                    : "#a03030"
                  : "var(--border)"
              }`,
              borderRadius: 8, padding: "0.6rem 0.75rem",
              transition: "all 0.2s",
            }}
          >
            <span style={{
              width: 28, height: 28, borderRadius: "50%",
              background: done
                ? order[pos] === correctOrder[pos]
                  ? "#1b6b3e"
                  : "#a03030"
                : "var(--green-primary)",
              color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.75rem", fontWeight: 700, flexShrink: 0,
            }}>
              {pos + 1}
            </span>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>
                {t(items[origIdx])}
              </span>
            </div>
            {!done && (
              <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <button onClick={() => moveUp(pos)} style={arrowBtn} disabled={pos === 0}>▲</button>
                <button onClick={() => moveDown(pos)} style={arrowBtn} disabled={pos === order.length - 1}>▼</button>
              </span>
            )}
            {done && order[pos] === correctOrder[pos] && (
              <span style={{ color: "#1b6b3e", fontWeight: 700, fontSize: "1rem" }}>✓</span>
            )}
            {done && order[pos] !== correctOrder[pos] && (
              <span style={{ color: "#a03030", fontWeight: 700, fontSize: "1rem" }}>✗</span>
            )}
          </div>
        ))}
      </div>
      {!done ? (
        <button
          onClick={check}
          style={{
            width: "100%", padding: "0.75rem",
            background: "var(--green-primary)", color: "#fff",
            border: "none", borderRadius: 8,
            fontSize: "1rem", fontWeight: 700,
          }}
        >
          {lang === "ar" ? "✓ تحقق من الترتيب" : "✓ Check Order"}
        </button>
      ) : (
        <div className="animate-fade-in-up" style={{
          background: "rgba(27,107,62,0.1)", borderRadius: 8,
          padding: "0.75rem", border: "1px solid var(--green-primary)",
          fontSize: "0.85rem", lineHeight: 1.7,
        }}>
          <span style={{ fontWeight: 700 }}>💡 {t(info)}</span>
        </div>
      )}
    </div>
  );
}

const arrowBtn: React.CSSProperties = {
  background: "none", border: "none",
  fontSize: "0.7rem", cursor: "pointer",
  padding: "2px 4px", color: "var(--text-light)",
  lineHeight: 1,
};
