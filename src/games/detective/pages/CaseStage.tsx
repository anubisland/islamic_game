import { useState, useEffect } from "react";
import type { LangStr } from "../data/stages";
import type { DetectiveStage } from "../data/stages";
import { detectiveStages } from "../data/stages";
import { CaseOrder } from "../components/CaseOrder";
import { CaseSolve } from "../components/CaseSolve";

interface Props {
  stage: DetectiveStage;
  lang: "ar" | "en";
  onComplete: () => void;
}

export function CaseStage({ stage, lang, onComplete }: Props) {
  const [puzzleKey, setPuzzleKey] = useState(0);
  const [showNext, setShowNext] = useState(false);
  const dir = lang === "ar" ? "rtl" : "ltr";
  const t = (s: LangStr) => s[lang];
  const isLast = stage.id === detectiveStages[detectiveStages.length - 1].id;

  useEffect(() => {
    setPuzzleKey((k) => k + 1);
    setShowNext(false);
  }, [stage.id]);

  function handleComplete(correct: boolean) {
    if (correct) setShowNext(true);
  }

  function handleNext() {
    onComplete();
  }

  function handleRetry() {
    setPuzzleKey((k) => k + 1);
    setShowNext(false);
  }

  return (
    <div dir={dir} style={{
      maxWidth: 700, margin: "0 auto", padding: "1rem",
    }}>
      {/* Stage header */}
      <div style={{
        display: "flex", alignItems: "center", gap: "0.5rem",
        marginBottom: "0.5rem",
      }}>
        <span style={{ fontSize: "1.5rem" }}>{stage.icon}</span>
        <div>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text)", margin: 0 }}>
            {t(stage.title)}
          </h2>
          <p style={{ fontSize: "0.8rem", color: "var(--text-light)", margin: 0 }}>
            {t(stage.era)} • {t(stage.intro)}
          </p>
        </div>
      </div>

      {/* Puzzle */}
      <div key={puzzleKey} style={{
        background: "var(--card-bg)", borderRadius: "var(--radius)",
        border: "1px solid var(--border)", overflow: "hidden",
      }}>
        {stage.puzzle.type === "case-order" && stage.puzzle.items && stage.puzzle.correctOrder && (
          <CaseOrder
            items={stage.puzzle.items}
            correctOrder={stage.puzzle.correctOrder}
            evidence={stage.puzzle.evidence!}
            lang={lang}
            onComplete={handleComplete}
          />
        )}
        {stage.puzzle.type === "case-solve" && stage.puzzle.question && stage.puzzle.options && (
          <CaseSolve
            question={stage.puzzle.question}
            options={stage.puzzle.options}
            correctIndex={stage.puzzle.correctIndex!}
            evidence={stage.puzzle.evidence!}
            lang={lang}
            onComplete={handleComplete}
          />
        )}
      </div>

      {/* Bottom buttons */}
      <div style={{
        display: "flex", gap: "0.5rem", marginTop: "1rem",
        justifyContent: "center",
      }}>
        {showNext && isLast && (
          <>
            <div style={{
              padding: "0.75rem 1.5rem", borderRadius: 8,
              background: "rgba(255,215,0,0.12)", border: "1px solid #FFD700",
              textAlign: "center", marginBottom: "0.5rem",
            }}>
              <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "#8B6914" }}>
                {lang === "ar" ? "🏆 لقد حللتَ جميع القضايا! أحسنت!" : "🏆 You solved all cases! Well done!"}
              </span>
            </div>
            <button onClick={handleNext} style={{
              padding: "0.75rem 2rem", borderRadius: 8, border: "none",
              background: "var(--green-primary)", color: "#fff",
              fontSize: "1rem", fontWeight: 700, cursor: "pointer",
            }}>
              {lang === "ar" ? "✅ العودة إلى القائمة" : "✅ Back to List"}
            </button>
          </>
        )}
        {showNext && !isLast && (
          <button onClick={handleNext} style={{
            padding: "0.75rem 2rem", borderRadius: 8, border: "none",
            background: "var(--green-primary)", color: "#fff",
            fontSize: "1rem", fontWeight: 700, cursor: "pointer",
          }}>
            {lang === "ar" ? "🔍 القضية التالية" : "🔍 Next Case"}
          </button>
        )}
        <button onClick={handleRetry} style={{
          padding: "0.6rem 1.25rem", borderRadius: 8,
          border: "2px solid var(--border)", background: "transparent",
          color: "var(--text)", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer",
        }}>
          {lang === "ar" ? "إعادة التحقيق" : "Reinvestigate"}
        </button>
      </div>
    </div>
  );
}
