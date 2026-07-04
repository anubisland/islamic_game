import { useState } from "react";
import type { LangStr } from "../data/stages";

interface Props {
  verse: LangStr;
  options: LangStr[];
  correctIndex: number;
  source: LangStr;
  lang: "ar" | "en";
  onComplete: (correct: boolean) => void;
}

export function WordFill({ verse, options, correctIndex, source, lang, onComplete }: Props) {
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
      <div style={{
        background: "rgba(27,107,62,0.06)", borderRadius: 8,
        padding: "1rem", marginBottom: "1rem",
        border: "1px solid rgba(27,107,62,0.15)",
        fontSize: "1.15rem", lineHeight: 2, fontWeight: 500,
        textAlign: lang === "ar" ? "right" : "left",
      }}>
        {t(verse)}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "0.75rem" }}>
        {options.map((opt, i) => {
          let bg = "var(--card-bg)";
          let bc = "var(--border)";
          let tc = "var(--text)";
          if (done) {
            if (i === correctIndex) { bg = "#1b6b3e"; bc = "#1b6b3e"; tc = "#fff"; }
            else if (i === selected) { bg = "#a03030"; bc = "#a03030"; tc = "#fff"; }
          }
          return (
            <button
              key={i}
              onClick={() => handleClick(i)}
              style={{
                padding: "0.75rem 1rem", background: bg, border: `2px solid ${bc}`,
                borderRadius: 8, color: tc, fontSize: "1rem", fontWeight: 600,
                textAlign: lang === "ar" ? "right" : "left",
                cursor: done ? "default" : "pointer", transition: "all 0.2s",
              }}
            >
              {t(opt)}
              {i === correctIndex && done && " ✓"}
              {i === selected && i !== correctIndex && done && " ✗"}
            </button>
          );
        })}
      </div>
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
