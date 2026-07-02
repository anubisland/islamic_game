import { useState, useEffect, useRef } from "react";
import type { Stage, StageProgress } from "../types";
import { Header } from "../components/Header";
import { useSound } from "../hooks/useSound";

const TIME_PER_QUESTION = 15;

type Phase = "intro" | "lessons" | "quiz" | "result";

interface Props {
  stage: Stage;
  prevProgress?: StageProgress;
  onComplete: (score: number, total: number) => void;
  onBack: () => void;
}

function calcStars(s: number, total: number): number {
  const pct = s / total;
  if (pct >= 0.9) return 3;
  if (pct >= 0.6) return 2;
  if (pct > 0) return 1;
  return 0;
}

function PhaseContainer({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <div
      className="animate-fade-in-up"
      style={{
        animationDelay: `${delay}s`,
        animationFillMode: "both",
      }}
    >
      {children}
    </div>
  );
}

export function StagePage({ stage, onComplete, onBack }: Props) {
  const sound = useSound();
  const [phase, setPhase] = useState<Phase>("intro");
  const [lessonIndex, setLessonIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [timeExpired, setTimeExpired] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stars = calcStars(score, stage.questions.length);

  function clearTimer() {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  useEffect(() => {
    if (phase !== "quiz" || showExplanation) {
      clearTimer();
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearTimer();
          setTimeExpired(true);
          setShowExplanation(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return clearTimer;
  }, [phase, questionIndex, showExplanation]);

  function handleAnswer(index: number) {
    if (showExplanation) return;
    clearTimer();
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (index === stage.questions[questionIndex].correctIndex) {
      setScore((s) => s + 1);
      sound.correct();
    } else {
      sound.wrong();
    }
  }

  function nextQuestion() {
    sound.click();
    setSelectedAnswer(null);
    setShowExplanation(false);
    setTimeLeft(TIME_PER_QUESTION);
    setTimeExpired(false);
    if (questionIndex < stage.questions.length - 1) {
      setQuestionIndex((i) => i + 1);
    } else {
      sound.complete();
      setPhase("result");
    }
  }

  function handleBackToStages() {
    sound.click();
    onComplete(score, stage.questions.length);
  }

  const currentQuestion = stage.questions[questionIndex];
  const btnPrimary: React.CSSProperties = {
    background: "linear-gradient(135deg, var(--green-primary), var(--green-dark))",
    color: "#fff",
    padding: "0.75rem 2rem",
    borderRadius: 8,
    fontSize: "1rem",
    fontWeight: 600,
    boxShadow: "0 2px 8px rgba(27,107,62,0.3)",
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

  return (
    <div>
      <Header onHome={onBack} title={stage.title} />

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "1.5rem 1rem" }}>
        {phase === "intro" && (
          <PhaseContainer>
            <div style={cardStyle}>
              <div
                className="animate-scale-in"
                style={{ fontSize: "4rem", marginBottom: "1rem" }}
              >
                {stage.icon}
              </div>
              <h2 style={{ color: "var(--green-primary)", marginBottom: "0.5rem", fontSize: "1.4rem" }}>
                {stage.title}
              </h2>
              <p
                style={{
                  color: "var(--text-light)",
                  marginBottom: "1.5rem",
                  fontSize: "0.95rem",
                }}
              >
                {stage.subtitle}
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "1.5rem",
                  justifyContent: "center",
                  marginBottom: "2rem",
                  fontSize: "0.9rem",
                  color: "var(--text-light)",
                }}
              >
                <span>📚 {stage.lessons.length} دروس</span>
                <span>🧠 {stage.questions.length} أسئلة</span>
              </div>
              <button
                style={btnPrimary}
                onClick={() => { sound.click(); setPhase("lessons"); }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                ابدأ التعلم
              </button>
            </div>
          </PhaseContainer>
        )}

        {phase === "lessons" && (
          <PhaseContainer>
            <div style={cardStyle}>
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

              <div
                style={{
                  height: 4,
                  background: "var(--progress-bg)",
                  borderRadius: 2,
                  marginBottom: "1.25rem",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${((lessonIndex + 1) / stage.lessons.length) * 100}%`,
                    background: "var(--green-light)",
                    borderRadius: 2,
                    transition: "width 0.4s",
                  }}
                />
              </div>

              <h3
                className="animate-slide-down"
                style={{
                  color: "var(--green-primary)",
                  marginBottom: "1rem",
                  fontSize: "1.15rem",
                }}
              >
                {stage.lessons[lessonIndex].title}
              </h3>
              <p
                className="animate-fade-in"
                style={{ lineHeight: 1.9, fontSize: "1rem", color: "var(--text)" }}
              >
                {stage.lessons[lessonIndex].content}
              </p>
              <div
                style={{
                  marginTop: "2rem",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                {lessonIndex > 0 ? (
                  <button
                    style={btnSecondary}
                    onClick={() => { sound.click(); setLessonIndex((i) => i - 1); }}
                  >
                    → السابق
                  </button>
                ) : (
                  <div />
                )}
                {lessonIndex < stage.lessons.length - 1 ? (
                  <button
                    style={btnPrimary}
                    onClick={() => { sound.click(); setLessonIndex((i) => i + 1); }}
                  >
                    التالي ←
                  </button>
                ) : (
                  <button
                    style={{
                      ...btnPrimary,
                      background: "linear-gradient(135deg, var(--gold), #b8922a)",
                      boxShadow: "0 2px 8px rgba(212,160,43,0.3)",
                    }}
                    onClick={() => { sound.click(); setPhase("quiz"); }}
                  >
                    ابدأ الاختبار
                  </button>
                )}
              </div>
            </div>
          </PhaseContainer>
        )}

        {phase === "quiz" && currentQuestion && (
          <PhaseContainer>
            <div style={cardStyle}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.75rem",
                  fontSize: "0.85rem",
                  color: "var(--text-light)",
                }}
              >
                <span>سؤال {questionIndex + 1} من {stage.questions.length}</span>
                <span style={{ fontWeight: 700, color: "var(--green-primary)" }}>
                  {score} ✓
                </span>
              </div>

              <div
                style={{
                  height: 4,
                  background: "var(--progress-bg)",
                  borderRadius: 2,
                  marginBottom: "0.5rem",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${((questionIndex + 1) / stage.questions.length) * 100}%`,
                    background: "var(--gold)",
                    borderRadius: 2,
                    transition: "width 0.4s",
                  }}
                />
              </div>

              <div
                style={{
                  height: 6,
                  background: "var(--progress-bg)",
                  borderRadius: 3,
                  marginBottom: "1.25rem",
                  overflow: "hidden",
                  direction: "ltr",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${(timeLeft / TIME_PER_QUESTION) * 100}%`,
                    background:
                      timeLeft > 10
                        ? "var(--green-light)"
                        : timeLeft > 5
                          ? "var(--gold)"
                          : "#e74c3c",
                    borderRadius: 3,
                    transition: "width 1s linear",
                  }}
                />
              </div>

              <h3
                className="animate-slide-down"
                style={{ fontSize: "1.1rem", marginBottom: "1.25rem", lineHeight: 1.7 }}
              >
                {currentQuestion.text}
              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {currentQuestion.options.map((opt, i) => {
                  let bg = "var(--card-bg)";
                  let border = "2px solid var(--border)";
                  const hoverBg = "#f5f0e6";
                  if (showExplanation) {
                    if (i === currentQuestion.correctIndex) {
                      bg = "#e8f5e9";
                      border = "2px solid var(--green-light)";
                    } else if (i === selectedAnswer) {
                      bg = "#fdecea";
                      border = "2px solid #e74c3c";
                    }
                  }
                  return (
                    <button
                      key={i}
                      style={{
                        padding: "0.9rem 1rem",
                        borderRadius: 10,
                        background: bg,
                        border,
                        textAlign: "right",
                        fontSize: "1rem",
                        cursor: showExplanation ? "default" : "pointer",
                        transition: "all 0.2s",
                        fontWeight: selectedAnswer === i ? 600 : 400,
                      }}
                      onClick={() => handleAnswer(i)}
                      disabled={showExplanation}
                      onMouseEnter={(e) => {
                        if (!showExplanation) e.currentTarget.style.background = hoverBg;
                      }}
                      onMouseLeave={(e) => {
                        if (!showExplanation) e.currentTarget.style.background = bg;
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {showExplanation && (
                <div
                  className="animate-slide-down"
                  style={{
                    marginTop: "1rem",
                    padding: "1rem",
                    background: timeExpired ? "#fff3e0" : "#f0f7ff",
                    borderRadius: 10,
                    borderRight: timeExpired
                      ? "4px solid #e74c3c"
                      : "4px solid var(--green-primary)",
                    fontSize: "0.9rem",
                    lineHeight: 1.7,
                  }}
                >
                  {timeExpired && (
                    <strong style={{ color: "#e74c3c", display: "block", marginBottom: "0.5rem" }}>
                      ⏰ انتهى الوقت!
                    </strong>
                  )}
                  💡 {currentQuestion.explanation}
                </div>
              )}

              {showExplanation && (
                <button
                  style={{
                    ...btnPrimary,
                    marginTop: "1.25rem",
                    width: "100%",
                  }}
                  onClick={nextQuestion}
                >
                  {questionIndex < stage.questions.length - 1
                    ? "التالي ←"
                    : "عرض النتيجة 🎯"}
                </button>
              )}
            </div>
          </PhaseContainer>
        )}

        {phase === "result" && (
          <PhaseContainer delay={0.1}>
            <div style={cardStyle}>
              <div
                className="animate-scale-in"
                style={{ fontSize: "4rem", marginBottom: "0.75rem" }}
              >
                {stars >= 3 ? "🏆" : stars >= 1 ? "⭐" : "💪"}
              </div>

              <h2
                className="animate-fade-in-up"
                style={{
                  color: "var(--green-primary)",
                  marginBottom: "0.75rem",
                  fontSize: "1.3rem",
                }}
              >
                {score === stage.questions.length
                  ? "إتقان تام! أحسنت"
                  : score >= stage.questions.length * 0.6
                    ? "جيد جداً! واصل التقدم"
                    : "حاول مرة أخرى لتتحسن"}
              </h2>

              <p
                className="animate-fade-in"
                style={{ fontSize: "1.1rem", color: "var(--text-light)", marginBottom: "1rem" }}
              >
                حصلت على {score} من {stage.questions.length}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  justifyContent: "center",
                  marginBottom: "1.5rem",
                }}
              >
                {Array.from({ length: 3 }, (_, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: "3rem",
                      color: i < stars ? "var(--gold)" : "#ddd",
                      display: "inline-block",
                      animation: i < stars ? `starPop 0.6s ease ${i * 0.2 + 0.3}s forwards` : "none",
                      opacity: i < stars ? 0 : 1,
                      textShadow: i < stars ? "0 2px 12px rgba(212,160,43,0.4)" : "none",
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>

              <button
                style={{
                  ...btnPrimary,
                  minWidth: 220,
                }}
                onClick={handleBackToStages}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(27,107,62,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(27,107,62,0.3)";
                }}
              >
                العودة إلى المراحل
              </button>
            </div>
          </PhaseContainer>
        )}
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: "var(--card-bg)",
  borderRadius: "var(--radius)",
  padding: "2rem",
  boxShadow: "var(--shadow-lg)",
  border: "1px solid var(--card-border)",
};
