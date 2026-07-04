import { useState } from "react";
import { useTranslation } from "../../../i18n";
import { type BattutaStage, battutaStages } from "../data/stages";
import { CityTrivia } from "../components/CityTrivia";
import { RouteOrder } from "../components/RouteOrder";
import { DistanceMath } from "../components/DistanceMath";
import { Timeline } from "../components/Timeline";

interface Props {
  stage: BattutaStage;
  onComplete: (stageId: string, correct: boolean) => void;
  onBack: () => void;
}

export function CityStage({ stage, onComplete, onBack }: Props) {
  const { lang, dir } = useTranslation();
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const total = battutaStages.length;
  const currentIndex = battutaStages.findIndex(s => s.id === stage.id);

  const L = (s: { ar: string; en: string }) => s[lang];

  function handlePuzzleComplete(correct: boolean) {
    setResult(correct ? "correct" : "wrong");
  }

  function handleContinue() {
    if (result === "correct") {
      onComplete(stage.id, true);
    }
  }

  function renderPuzzle() {
    const p = stage.puzzle;
    switch (p.type) {
      case "city-trivia":
        return (
          <CityTrivia
            question={p.question}
            options={p.options!}
            correctIndex={p.correctIndex!}
            info={p.info}
            lang={lang}
            onComplete={handlePuzzleComplete}
          />
        );
      case "route-order":
        return (
          <RouteOrder
            items={p.items!}
            correctOrder={p.correctOrder!}
            question={p.question}
            info={p.info}
            lang={lang}
            onComplete={handlePuzzleComplete}
          />
        );
      case "distance-math":
        return (
          <DistanceMath
            question={p.question}
            options={p.options!}
            correctIndex={p.correctIndex!}
            info={p.info}
            lang={lang}
            onComplete={handlePuzzleComplete}
          />
        );
      case "timeline":
        return (
          <Timeline
            items={p.items!}
            correctOrder={p.correctOrder!}
            question={p.question}
            info={p.info}
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
            <span>{L(stage.city)}</span>
          </h1>
          <span style={{ fontSize: "0.8rem", opacity: 0.9 }}>
            {currentIndex + 1}/{total}
          </span>
        </div>
      </header>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "1rem 0.75rem" }}>
        {/* City info */}
        <div style={{
          background: "linear-gradient(135deg, #f5e6c8, #e8d5a3)",
          borderRadius: "var(--radius)", padding: "1rem", marginBottom: "1rem",
          border: "2px solid #d4b87a",
        }}>
          <div style={{ fontSize: "0.75rem", color: "#6b5a3a", fontWeight: 600, marginBottom: "0.25rem" }}>
            {L(stage.region)}
          </div>
          <p style={{ fontSize: "0.85rem", lineHeight: 1.7, color: "#4a3520", margin: 0 }}>
            {L(stage.description)}
          </p>
          <div style={{
            marginTop: "0.5rem", background: "rgba(139,105,20,0.1)", borderRadius: 6,
            padding: "0.5rem 0.75rem", fontSize: "0.8rem", color: "#6b5a3a",
            border: "1px solid rgba(139,105,20,0.2)",
          }}>
            💡 {L(stage.funFact)}
          </div>
        </div>

        {/* Puzzle */}
        <div style={{
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

        {/* Result */}
        {result && (
          <div className="animate-fade-in-up">
            {result === "correct" ? (
              <div style={{
                background: "rgba(27,107,62,0.1)", border: "2px solid var(--green-primary)",
                borderRadius: "var(--radius)", padding: "1rem", textAlign: "center",
              }}>
                <div style={{ fontSize: "2rem" }}>🎉</div>
                <p style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--green-primary)" }}>
                  {lang === "ar" ? "إجابة صحيحة! أحسنت" : "Correct Answer! Excellent"}
                </p>
                <p style={{ fontSize: "0.85rem", color: "var(--text-light)", marginTop: "0.25rem" }}>
                  {lang === "ar" ? "يمكنك الآن التقدم إلى المحطة التالية" : "You can now proceed to the next stop"}
                </p>
                <button
                  onClick={handleContinue}
                  style={{
                    marginTop: "0.75rem", padding: "0.6rem 2rem",
                    background: "var(--green-primary)", color: "#fff",
                    border: "none", borderRadius: 8,
                    fontSize: "1rem", fontWeight: 700,
                  }}
                >
                  {lang === "ar" ? "→ المحطة التالية" : "Next Stop →"}
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
                <button
                  onClick={() => setResult(null)}
                  style={{
                    marginTop: "0.75rem", padding: "0.6rem 2rem",
                    background: "#a03030", color: "#fff",
                    border: "none", borderRadius: 8,
                    fontSize: "1rem", fontWeight: 700,
                  }}
                >
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
  background: "linear-gradient(135deg, #8B6914, #d4a017)",
  color: "#fff",
  padding: "0.7rem 0.75rem",
  position: "sticky",
  top: 0,
  zIndex: 100,
  boxShadow: "0 2px 16px rgba(0,0,0,0.15)",
};

const headerInner: React.CSSProperties = {
  maxWidth: 600,
  margin: "0 auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const backBtn: React.CSSProperties = {
  background: "rgba(255,255,255,0.15)",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.25)",
  padding: "0.35rem 0.75rem",
  borderRadius: 8,
  fontSize: "0.82rem",
  fontWeight: 600,
};
