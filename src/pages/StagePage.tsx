import { useState } from "react";
import type { Stage, StageProgress } from "../types";
import { Header } from "../components/Header";

type Phase = "intro" | "lessons" | "quiz" | "result";

interface Props {
  stage: Stage;
  prevProgress?: StageProgress;
  onComplete: (score: number, total: number) => void;
  onBack: () => void;
}

export function StagePage({ stage, onComplete, onBack }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [lessonIndex, setLessonIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  function calcStars(s: number, total: number): number {
    const pct = s / total;
    if (pct >= 0.9) return 3;
    if (pct >= 0.6) return 2;
    if (pct > 0) return 1;
    return 0;
  }

  function handleAnswer(index: number) {
    if (showExplanation) return;
    setSelectedAnswer(index);
    setShowExplanation(true);

    const correct = index === stage.questions[questionIndex].correctIndex;
    if (correct) setScore((s) => s + 1);
  }

  function nextQuestion() {
    setSelectedAnswer(null);
    setShowExplanation(false);
    if (questionIndex < stage.questions.length - 1) {
      setQuestionIndex((i) => i + 1);
    } else {
      setPhase("result");
    }
  }

  function handleBackToStages() {
    onComplete(score, stage.questions.length);
  }

  const currentQuestion = stage.questions[questionIndex];

  return (
    <div>
      <Header onHome={onBack} />

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "1.5rem 1rem" }}>
        {phase === "intro" && (
          <div
            style={{
              background: "var(--card-bg)",
              borderRadius: "var(--radius)",
              padding: "2rem",
              boxShadow: "var(--shadow)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{stage.icon}</div>
            <h2 style={{ color: "var(--green-primary)", marginBottom: "0.5rem" }}>
              {stage.title}
            </h2>
            <p style={{ color: "var(--text-light)", marginBottom: "1.5rem" }}>
              {stage.subtitle}
            </p>
            <p style={{ fontSize: "0.9rem", color: "var(--text-light)", marginBottom: "1.5rem" }}>
              تحتوي هذه المرحلة على {stage.lessons.length} دروس و {stage.questions.length} أسئلة
            </p>
            <button style={btnPrimary} onClick={() => setPhase("lessons")}>
              ابدأ التعلم 📚
            </button>
          </div>
        )}

        {phase === "lessons" && (
          <div
            style={{
              background: "var(--card-bg)",
              borderRadius: "var(--radius)",
              padding: "2rem",
              boxShadow: "var(--shadow)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1rem",
                fontSize: "0.85rem",
                color: "var(--text-light)",
              }}
            >
              <span>
                درس {lessonIndex + 1} من {stage.lessons.length}
              </span>
            </div>
            <h3
              style={{
                color: "var(--green-primary)",
                marginBottom: "1rem",
                fontSize: "1.1rem",
              }}
            >
              {stage.lessons[lessonIndex].title}
            </h3>
            <p style={{ lineHeight: 1.8, fontSize: "1rem", color: "var(--text)" }}>
              {stage.lessons[lessonIndex].content}
            </p>
            <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "space-between" }}>
              {lessonIndex > 0 && (
                <button
                  style={btnSecondary}
                  onClick={() => setLessonIndex((i) => i - 1)}
                >
                  السابق
                </button>
              )}
              <div />
              {lessonIndex < stage.lessons.length - 1 ? (
                <button style={btnPrimary} onClick={() => setLessonIndex((i) => i + 1)}>
                  التالي
                </button>
              ) : (
                <button style={btnPrimary} onClick={() => setPhase("quiz")}>
                  ابدأ الاختبار 🧠
                </button>
              )}
            </div>
          </div>
        )}

        {phase === "quiz" && currentQuestion && (
          <div
            style={{
              background: "var(--card-bg)",
              borderRadius: "var(--radius)",
              padding: "2rem",
              boxShadow: "var(--shadow)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1rem",
                fontSize: "0.85rem",
                color: "var(--text-light)",
              }}
            >
              <span>
                سؤال {questionIndex + 1} من {stage.questions.length}
              </span>
              <span>النتيجة: {score}</span>
            </div>

            <h3
              style={{
                fontSize: "1.1rem",
                marginBottom: "1.25rem",
                lineHeight: 1.6,
              }}
            >
              {currentQuestion.text}
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {currentQuestion.options.map((opt, i) => {
                let bg = "var(--card-bg)";
                let border = "2px solid #e0e0e0";
                if (showExplanation) {
                  if (i === currentQuestion.correctIndex) {
                    bg = "#e8f5e9";
                    border = "2px solid var(--green-light)";
                  } else if (i === selectedAnswer && i !== currentQuestion.correctIndex) {
                    bg = "#fdecea";
                    border = "2px solid #e74c3c";
                  }
                }
                return (
                  <button
                    key={i}
                    style={{
                      padding: "0.85rem 1rem",
                      borderRadius: 8,
                      background: bg,
                      border,
                      textAlign: "right",
                      fontSize: "1rem",
                      cursor: showExplanation ? "default" : "pointer",
                      transition: "background 0.2s",
                    }}
                    onClick={() => handleAnswer(i)}
                    disabled={showExplanation}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {showExplanation && (
              <div
                style={{
                  marginTop: "1rem",
                  padding: "0.85rem",
                  background: "#f0f7ff",
                  borderRadius: 8,
                  borderRight: "4px solid var(--green-primary)",
                  fontSize: "0.9rem",
                  lineHeight: 1.6,
                }}
              >
                {currentQuestion.explanation}
              </div>
            )}

            {showExplanation && (
              <button
                style={{ ...btnPrimary, marginTop: "1rem", width: "100%" }}
                onClick={nextQuestion}
              >
                {questionIndex < stage.questions.length - 1 ? "التالي ←" : "عرض النتيجة"}
              </button>
            )}
          </div>
        )}

        {phase === "result" && (
          <div
            style={{
              background: "var(--card-bg)",
              borderRadius: "var(--radius)",
              padding: "2rem",
              boxShadow: "var(--shadow)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
              {calcStars(score, stage.questions.length) >= 3
                ? "🏆"
                : calcStars(score, stage.questions.length) >= 1
                  ? "⭐"
                  : "💪"}
            </div>
            <h2 style={{ color: "var(--green-primary)", marginBottom: "0.5rem" }}>
              {score === stage.questions.length
                ? "إتقان تام! أحسنت 🌟"
                : score >= stage.questions.length * 0.6
                  ? "جيد جداً! واصل التقدم"
                  : "حاول مرة أخرى لتتحسن"}
            </h2>
            <p style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
              {score} / {stage.questions.length}
            </p>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>
              {Array.from({ length: 3 }, (_, i) => (
                <span key={i} style={{ color: i < calcStars(score, stage.questions.length) ? "var(--gold)" : "#ddd" }}>
                  ★
                </span>
              ))}
            </div>
            <button style={btnPrimary} onClick={handleBackToStages}>
              العودة إلى المراحل
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const btnPrimary: React.CSSProperties = {
  background: "linear-gradient(135deg, var(--green-primary), var(--green-dark))",
  color: "#fff",
  padding: "0.75rem 2rem",
  borderRadius: 8,
  fontSize: "1rem",
  fontWeight: 600,
};

const btnSecondary: React.CSSProperties = {
  background: "transparent",
  color: "var(--green-primary)",
  padding: "0.75rem 2rem",
  borderRadius: 8,
  fontSize: "1rem",
  fontWeight: 600,
  border: "2px solid var(--green-primary)",
};
