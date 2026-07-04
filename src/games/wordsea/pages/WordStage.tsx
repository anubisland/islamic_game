import { useState } from "react";
import { useTranslation } from "../../../i18n";
import { type WordStage, wordseaStages } from "../data/stages";
import { WordFill } from "../components/WordFill";
import { WordMatch } from "../components/WordMatch";

interface Props {
  stage: WordStage;
  onComplete: (stageId: string) => void;
  onBack: () => void;
}

export function WordStagePage({ stage, onComplete, onBack }: Props) {
  const { lang, dir } = useTranslation();
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [puzzleKey, setPuzzleKey] = useState(0);
  const total = wordseaStages.length;
  const currentIndex = wordseaStages.findIndex(s => s.id === stage.id);

  const L = (s: { ar: string; en: string }) => s[lang];

  function handlePuzzleComplete(correct: boolean) {
    setResult(correct ? "correct" : "wrong");
  }

  function handleRetry() {
    setResult(null);
    setPuzzleKey(k => k + 1);
  }

  function handleContinue() {
    onComplete(stage.id);
  }

  function renderPuzzle() {
    const p = stage.puzzle;
    switch (p.type) {
      case "word-fill":
        return (
          <WordFill
            verse={p.verse!}
            options={p.options!}
            correctIndex={p.correctIndex!}
            source={p.source!}
            lang={lang}
            onComplete={handlePuzzleComplete}
          />
        );
      case "word-match":
        return (
          <WordMatch
            pairs={p.pairs!}
            source={p.source!}
            lang={lang}
            onComplete={handlePuzzleComplete}
          />
        );
    }
  }

  return (
    <div dir={dir}>
      <header style={headerStyle}>
        <div style={headerInner}>
          <button onClick={onBack} style={backBtn}>
            {lang === "ar" ? "→" : "←"} {lang === "ar" ? "العودة" : "Back"}
          </button>
          <h1 style={{ fontSize: "1rem", fontWeight: 800, display: "flex", alignItems: "center", gap: 6 }}>
            <span>{stage.icon}</span>
            <span>{L(stage.title)}</span>
          </h1>
          <span style={{ fontSize: "0.8rem", opacity: 0.9 }}>
            {currentIndex + 1}/{total}
          </span>
        </div>
      </header>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "1rem 0.75rem" }}>
        <p style={{ fontSize: "0.85rem", color: "var(--text-light)", marginBottom: "0.75rem", lineHeight: 1.6 }}>
          {L(stage.subtitle)}
        </p>

        <div key={puzzleKey} style={{
          background: "var(--card-bg)", borderRadius: "var(--radius)",
          border: "2px solid var(--border)", marginBottom: "1rem",
        }}>
          <div style={{
            background: "var(--green-primary)", color: "#fff",
            padding: "0.6rem 1rem", borderRadius: "var(--radius) var(--radius) 0 0",
            fontSize: "0.9rem", fontWeight: 700,
          }}>
            🧩 {lang === "ar" ? "اللغز" : "Puzzle"}
          </div>
          {renderPuzzle()}
        </div>

        {result && (
          <div className="animate-fade-in-up">
            {result === "correct" ? (
              <div style={{
                background: "rgba(27,107,62,0.1)", border: "2px solid var(--green-primary)",
                borderRadius: "var(--radius)", padding: "1rem", textAlign: "center",
              }}>
                <div style={{ fontSize: "2rem" }}>🎉</div>
                <p style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--green-primary)" }}>
                  {lang === "ar" ? "إجابة صحيحة! أحسنت" : "Correct! Excellent"}
                </p>
                <button onClick={handleContinue} style={{
                  marginTop: "0.75rem", padding: "0.6rem 2rem",
                  background: "var(--green-primary)", color: "#fff",
                  border: "none", borderRadius: 8, fontSize: "1rem", fontWeight: 700, cursor: "pointer",
                }}>
                  {currentIndex < total - 1
                    ? (lang === "ar" ? "→ المستوى التالي" : "Next Level →")
                    : (lang === "ar" ? "🏁 العودة إلى القائمة" : "🏁 Back to List")}
                </button>
              </div>
            ) : (
              <div style={{
                background: "rgba(160,48,48,0.1)", border: "2px solid #a03030",
                borderRadius: "var(--radius)", padding: "1rem", textAlign: "center",
              }}>
                <div style={{ fontSize: "2rem" }}>🤔</div>
                <p style={{ fontWeight: 700, fontSize: "1.1rem", color: "#a03030" }}>
                  {lang === "ar" ? "ليس صحيحاً، حاول مرة أخرى" : "Not quite right, try again"}
                </p>
                <button onClick={handleRetry} style={{
                  marginTop: "0.75rem", padding: "0.6rem 2rem",
                  background: "#a03030", color: "#fff",
                  border: "none", borderRadius: 8, fontSize: "1rem", fontWeight: 700, cursor: "pointer",
                }}>
                  {lang === "ar" ? "🔄 حاول مرة أخرى" : "🔄 Try Again"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const headerStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #1565C0, #0d47a1)",
  color: "#fff", padding: "0.7rem 0.75rem", position: "sticky", top: 0, zIndex: 100,
  boxShadow: "0 2px 16px rgba(0,0,0,0.15)",
};

const headerInner: React.CSSProperties = {
  maxWidth: 600, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between",
};

const backBtn: React.CSSProperties = {
  background: "rgba(255,255,255,0.15)", color: "#fff",
  border: "1px solid rgba(255,255,255,0.25)", padding: "0.35rem 0.75rem",
  borderRadius: 8, fontSize: "0.82rem", fontWeight: 600,
};
