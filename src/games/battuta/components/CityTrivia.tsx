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

export function CityTrivia({ question, options, correctIndex, info, lang, onComplete }: Props) {
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
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
        {options.map((opt, i) => {
          const label = typeof opt === "number" ? String(opt) : t(opt as LangStr);
          let bg = "var(--card-bg)";
          let borderClr = "var(--border)";
          let txtClr = "var(--text)";
          if (done) {
            if (i === correctIndex) { bg = "#1b6b3e"; borderClr = "#1b6b3e"; txtClr = "#fff"; }
            else if (i === selected) { bg = "#a03030"; borderClr = "#a03030"; txtClr = "#fff"; }
          } else if (selected === i) {
            bg = "#2a5f8a";
          }
          return (
            <button
              key={i}
              onClick={() => handleClick(i)}
              style={{
                padding: "0.75rem 1rem",
                background: bg,
                border: `2px solid ${borderClr}`,
                borderRadius: 8,
                color: txtClr,
                fontSize: "0.95rem",
                fontWeight: 500,
                textAlign: "start",
                cursor: done ? "default" : "pointer",
                transition: "all 0.2s",
              }}
            >
              {label}
              {selected === i && !done && " ←"}
            </button>
          );
        })}
      </div>
      {done && (
        <div className="animate-fade-in-up" style={{
          background: "rgba(27,107,62,0.1)",
          borderRadius: 8,
          padding: "0.75rem",
          border: "1px solid var(--green-primary)",
          fontSize: "0.85rem",
          lineHeight: 1.7,
        }}>
          <span style={{ fontWeight: 700 }}>💡 {t(info)}</span>
        </div>
      )}
    </div>
  );
}
