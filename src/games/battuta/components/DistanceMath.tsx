import { useState } from "react";
import type { LangStr } from "../data/stages";

interface Props {
  question: LangStr;
  options: (LangStr | number)[];
  correctIndex: number;
  info: LangStr;
  lang: "ar" | "en";
  onComplete: (correct: boolean) => void;
}

export function DistanceMath({ question, options, correctIndex, info, lang, onComplete }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const t = (s: LangStr) => s[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  function handleClick(idx: number) {
    if (done) return;
    setSelected(idx);
    setDone(true);
    onComplete(idx === correctIndex);
  }

  return (
    <div dir={dir} style={{ padding: "1rem" }}>
      <p style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "1rem", lineHeight: 1.7 }}>
        {t(question)}
      </p>
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "1rem",
      }}>
        {options.map((opt, i) => {
          const label = typeof opt === "number" ? String(opt) : t(opt as LangStr);
          let bg = "var(--card-bg)";
          let border = "2px solid var(--border)";
          if (done) {
            if (i === correctIndex) { bg = "#1b6b3e"; border = "2px solid #1b6b3e"; }
            else if (i === selected) { bg = "#a03030"; border = "2px solid #a03030"; }
          }
          return (
            <button
              key={i}
              onClick={() => handleClick(i)}
              style={{
                padding: "1rem",
                background: bg,
                border,
                borderRadius: 8,
                color: done && (i === correctIndex || i === selected) ? "#fff" : "var(--text)",
                fontSize: "1.2rem",
                fontWeight: 700,
                cursor: done ? "default" : "pointer",
                transition: "all 0.2s",
              }}
            >
              {label}
              {i === correctIndex && done && " ✓"}
              {i === selected && i !== correctIndex && done && " ✗"}
            </button>
          );
        })}
      </div>
      {done && (
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
