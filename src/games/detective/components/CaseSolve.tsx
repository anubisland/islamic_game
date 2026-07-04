import { useState } from "react";
import type { LangStr } from "../data/stages";

interface Props {
  question: LangStr;
  options: LangStr[];
  correctIndex: number;
  evidence: LangStr;
  lang: "ar" | "en";
  onComplete: (correct: boolean) => void;
}

export function CaseSolve({ question, options, correctIndex, evidence, lang, onComplete }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<"playing" | "wrong" | "complete">("playing");

  const t = (s: LangStr) => s[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  function handleSelect(idx: number) {
    if (status !== "playing") return;
    setSelected(idx);
  }

  function handleSubmit() {
    if (selected === null) return;
    const correct = selected === correctIndex;
    setStatus(correct ? "complete" : "wrong");
    if (correct) onComplete(true);
  }

  return (
    <div dir={dir} style={{ padding: "1rem" }}>
      <p style={{
        fontSize: "1rem", fontWeight: 600, color: "var(--text)",
        marginBottom: "1rem", lineHeight: 1.7,
        background: "rgba(21,101,192,0.06)", padding: "0.75rem",
        borderRadius: 8, border: "1px solid rgba(21,101,192,0.15)",
      }}>
        {t(question)}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {options.map((opt, i) => {
          const isSelected = selected === i;
          return (
            <div
              key={i}
              onClick={() => handleSelect(i)}
              style={{
                padding: "0.6rem 0.75rem", borderRadius: 8, cursor: "pointer",
                background: isSelected ? "rgba(139,69,19,0.1)" : "var(--card-bg)",
                border: isSelected ? "2px solid #8B4513" : "2px solid var(--border)",
                transition: "all 0.15s",
                display: "flex", alignItems: "center", gap: "0.5rem",
              }}
            >
              <span style={{
                width: 24, height: 24, borderRadius: "50%",
                border: isSelected ? "6px solid #8B4513" : "2px solid var(--text-light)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, transition: "all 0.15s",
                background: isSelected ? "#8B4513" : "transparent",
              }} />
              <span style={{ fontSize: "0.9rem", color: "var(--text)", fontWeight: 500 }}>
                {t(opt)}
              </span>
              {status === "complete" && i === correctIndex && (
                <span style={{ marginLeft: "auto", fontSize: "1.1rem" }}>✅</span>
              )}
            </div>
          );
        })}
      </div>

      {selected !== null && status === "playing" && (
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
            {lang === "ar" ? "❌ إجابة خاطئة" : "❌ Wrong answer"}
          </p>
          <button onClick={() => { setSelected(null); setStatus("playing"); }} style={{
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
