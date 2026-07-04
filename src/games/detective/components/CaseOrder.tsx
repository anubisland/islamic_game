import { useState } from "react";
import type { LangStr } from "../data/stages";

interface Props {
  items: LangStr[];
  correctOrder: number[];
  evidence: LangStr;
  lang: "ar" | "en";
  onComplete: (correct: boolean) => void;
}

export function CaseOrder({ items, correctOrder, evidence, lang, onComplete }: Props) {
  const [order, setOrder] = useState<number[]>(
    () => [...items.keys()].sort(() => Math.random() - 0.5)
  );
  const [status, setStatus] = useState<"playing" | "wrong" | "complete">("playing");
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const t = (s: LangStr) => s[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  function handleSwap(idx: number) {
    if (status !== "playing") return;
    if (draggedIdx === null) {
      setDraggedIdx(idx);
    } else {
      const next = [...order];
      [next[draggedIdx], next[idx]] = [next[idx], next[draggedIdx]];
      setOrder(next);
      setDraggedIdx(null);
    }
  }

  function handleSubmit() {
    const correct = order.every((v, i) => v === correctOrder[i]);
    setStatus(correct ? "complete" : "wrong");
    if (correct) onComplete(true);
  }

  const allSelected = order.length === items.length;

  return (
    <div dir={dir} style={{ padding: "1rem" }}>
      <p style={{ color: "var(--text-light)", fontSize: "0.9rem", marginBottom: "1rem", lineHeight: 1.7 }}>
        {lang === "ar"
          ? "اضغط على عنصر لتحديده، ثم اضغط على عنصر آخر لتبديل مكانهما."
          : "Tap one item to select it, then tap another to swap their positions."}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {order.map((itemIdx, pos) => (
          <div
            key={`${draggedIdx}-${pos}`}
            onClick={() => handleSwap(pos)}
            style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              padding: "0.6rem 0.75rem", borderRadius: 8, cursor: "pointer",
              background: draggedIdx === pos ? "rgba(139,69,19,0.15)" : "var(--card-bg)",
              border: draggedIdx === pos ? "2px solid #8B4513" : "2px solid var(--border)",
              transition: "all 0.15s",
              opacity: status === "complete" ? 1 : undefined,
            }}
          >
            <span style={{
              width: 26, height: 26, borderRadius: "50%",
              background: "var(--green-primary)", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.8rem", fontWeight: 700, flexShrink: 0,
            }}>
              {pos + 1}
            </span>
            <span style={{
              fontSize: "0.9rem", color: "var(--text)", fontWeight: 500,
              textAlign: lang === "ar" ? "right" : "left",
              flex: 1,
            }}>
              {t(items[itemIdx])}
            </span>
            {status === "complete" && (
              <span style={{ fontSize: "1.1rem" }}>✅</span>
            )}
          </div>
        ))}
      </div>

      {allSelected && status === "playing" && (
        <button onClick={handleSubmit} style={{
          width: "100%", marginTop: "1rem", padding: "0.75rem",
          borderRadius: 8, border: "none",
          background: "var(--green-primary)", color: "#fff",
          fontSize: "1rem", fontWeight: 700, cursor: "pointer",
        }}>
          {lang === "ar" ? "تحقق من الإجابة" : "Check answer"}
        </button>
      )}

      {status === "wrong" && (
        <div style={{
          marginTop: "1rem", padding: "0.75rem", borderRadius: 8,
          background: "#fce4e4", border: "1px solid #e53935",
        }}>
          <p style={{ color: "#c62828", fontWeight: 600, marginBottom: "0.25rem" }}>
            {lang === "ar" ? "❌ الترتيب غير صحيح، حاول مرة أخرى" : "❌ Wrong order, try again"}
          </p>
          <button onClick={() => setStatus("playing")} style={{
            padding: "0.5rem 1rem", borderRadius: 6, border: "none",
            background: "#e53935", color: "#fff", cursor: "pointer",
            fontWeight: 600, marginTop: "0.5rem",
          }}>
            {lang === "ar" ? "إعادة المحاولة" : "Try Again"}
          </button>
        </div>
      )}

      {status === "complete" && (
        <div style={{
          marginTop: "1rem", padding: "0.75rem", borderRadius: 8,
          background: "rgba(21,101,192,0.08)", border: "1px solid #1565C0",
        }}>
          <p style={{ fontSize: "0.85rem", color: "var(--text)", lineHeight: 1.7 }}>
            <strong>{lang === "ar" ? "🔍 الحقيقة:" : "🔍 The Truth:"}</strong> {t(evidence)}
          </p>
        </div>
      )}
    </div>
  );
}
