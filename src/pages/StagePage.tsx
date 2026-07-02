import { useState, useEffect, useRef } from "react";
import type { Difficulty, Stage } from "../types";
import { Header } from "../components/Header";
import { useSound } from "../hooks/useSound";
import { shuffleQuestions } from "../utils/shuffle";

const DIFFICULTY_CONFIG: Record<Difficulty, { time: number; lives: number }> = {
  practice: { time: 0, lives: 999 },
  easy: { time: 20, lives: 5 },
  normal: { time: 15, lives: 3 },
  hard: { time: 10, lives: 2 },
};

type Phase = "intro" | "lessons" | "quiz" | "result" | "review";

interface WrongAnswer {
  question: string;
  selected: string;
  correct: string;
  explanation: string;
}

interface Props {
  stage: Stage;
  difficulty?: Difficulty;
  onSetDifficulty?: (d: Difficulty) => void;
  onComplete: (score: number, total: number) => void;
  onBack: () => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
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

export function StagePage({ stage, difficulty = "normal", onSetDifficulty, onComplete, onBack, soundEnabled, onToggleSound }: Props) {
  const sound = useSound();
  const config = DIFFICULTY_CONFIG[difficulty];
  const [phase, setPhase] = useState<Phase>("intro");
  const [lessonIndex, setLessonIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(config.time);
  const [timeExpired, setTimeExpired] = useState(false);
  const [lives, setLives] = useState(config.lives);
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [shuffledQuestions, setShuffledQuestions] = useState(shuffleQuestions(stage.questions));
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stars = calcStars(score, shuffledQuestions.length);

  function clearTimer() {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  useEffect(() => {
    if (phase !== "quiz" || showExplanation || config.time === 0) {
      clearTimer();
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearTimer();
          setTimeExpired(true);
          setShowExplanation(true);
          const q = shuffledQuestions[questionIndex];
          setWrongAnswers((prev) => [
            ...prev,
            {
              question: q.text,
              selected: "— (انتهى الوقت)",
              correct: q.options[q.correctIndex],
              explanation: q.explanation,
            },
          ]);
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
    const q = shuffledQuestions[questionIndex];
    if (index === q.correctIndex) {
      setScore((s) => s + 1);
      sound.correct();
    } else {
      sound.wrong();
      setWrongAnswers((prev) => [
        ...prev,
        {
          question: q.text,
          selected: q.options[index],
          correct: q.options[q.correctIndex],
          explanation: q.explanation,
        },
      ]);
      if (difficulty !== "practice") {
        const nextLives = lives - 1;
        setLives(nextLives);
        if (nextLives <= 0) {
          setTimeout(() => {
            setPhase("result");
          }, 1500);
        }
      }
    }
  }

  function nextQuestion() {
    sound.click();
    setSelectedAnswer(null);
    setShowExplanation(false);
    setTimeLeft(config.time);
    setTimeExpired(false);
    if (lives <= 0) return;
    if (questionIndex < shuffledQuestions.length - 1) {
      setQuestionIndex((i) => i + 1);
    } else {
      sound.complete();
      setPhase("result");
    }
  }

  function handleBackToStages() {
    sound.click();
    onComplete(score, shuffledQuestions.length);
  }

  const currentQuestion = shuffledQuestions[questionIndex];
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
      <Header onHome={onBack} title={stage.title} soundEnabled={soundEnabled} onToggleSound={onToggleSound} />

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "1rem 0.6rem" }}>
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

              {onSetDifficulty && (
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    justifyContent: "center",
                    marginBottom: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  {(["practice", "easy", "normal", "hard"] as Difficulty[]).map((d) => {
                    const labels: Record<Difficulty, string> = {
                      practice: "🧘 تدريبي",
                      easy: "سهل 🟢",
                      normal: "متوسط 🟡",
                      hard: "صعب 🔴",
                    };
                    const isActive = difficulty === d;
                    const colors: Record<Difficulty, string> = {
                      practice: "var(--green-light)",
                      easy: "#27ae60",
                      normal: "var(--gold)",
                      hard: "#e74c3c",
                    };
                    return (
                      <button
                        key={d}
                        onClick={() => onSetDifficulty(d)}
                        style={{
                          padding: "0.35rem 0.85rem",
                          borderRadius: 8,
                          fontSize: "0.82rem",
                          fontWeight: 700,
                          background: isActive ? colors[d] : "transparent",
                          color: isActive ? "#fff" : "var(--text-light)",
                          border: `2px solid ${isActive ? colors[d] : "var(--border)"}`,
                        }}
                      >
                        {labels[d]}
                      </button>
                    );
                  })}
                </div>
              )}

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
                    onClick={() => { sound.click(); setLives(config.lives); setShuffledQuestions(shuffleQuestions(stage.questions)); setPhase("quiz"); }}
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
                <span>سؤال {questionIndex + 1} من {shuffledQuestions.length}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  {difficulty !== "practice" && (
                    <span style={{ display: "flex", gap: "0.2rem", fontSize: "1rem" }}>
                      {Array.from({ length: config.lives }, (_, i) => (
                        <span key={i} style={{ opacity: i < lives ? 1 : 0.2 }}>
                          ❤️
                        </span>
                      ))}
                    </span>
                  )}
                  <span style={{ fontWeight: 700, color: "var(--green-primary)" }}>
                    {score} ✓
                  </span>
                  {difficulty === "practice" && (
                    <span style={{ fontSize: "0.78rem", color: "var(--green-light)", fontWeight: 600 }}>
                      🧘 تدريبي
                    </span>
                  )}
                </div>
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
                    width: `${((questionIndex + 1) / shuffledQuestions.length) * 100}%`,
                    background: "var(--gold)",
                    borderRadius: 2,
                    transition: "width 0.4s",
                  }}
                />
              </div>

              {difficulty !== "practice" && (
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
                      width: `${(timeLeft / config.time) * 100}%`,
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
              )}

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
                        padding: "0.85rem 0.9rem",
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
                  onClick={lives <= 0 ? () => { sound.click(); setPhase("result"); } : nextQuestion}
                >
                  {lives <= 0
                    ? "عرض النتيجة 🎯"
                    : questionIndex < shuffledQuestions.length - 1
                      ? "التالي ←"
                      : "عرض النتيجة 🎯"}
                </button>
              )}
            </div>
          </PhaseContainer>
        )}

        {phase === "result" && (
          <PhaseContainer delay={0.1}>
            {stars >= 2 && <ConfettiOverlay />}
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
                {score === shuffledQuestions.length
                  ? "إتقان تام! أحسنت"
                  : score >= shuffledQuestions.length * 0.6
                    ? "جيد جداً! واصل التقدم"
                    : "حاول مرة أخرى لتتحسن"}
              </h2>

              <p
                className="animate-fade-in"
                style={{ fontSize: "1.1rem", color: "var(--text-light)", marginBottom: "1rem" }}
              >
                حصلت على {score} من {shuffledQuestions.length}
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

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "center" }}>
                {wrongAnswers.length > 0 && (
                  <button
                    style={{
                      ...btnSecondary,
                      background: "#fff3cd",
                      border: "2px solid var(--gold)",
                      color: "#856404",
                      minWidth: 220,
                    }}
                    onClick={() => setPhase("review")}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    📝 مراجعة الأخطاء ({wrongAnswers.length})
                  </button>
                )}
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
            </div>
          </PhaseContainer>
        )}

        {phase === "review" && (
          <PhaseContainer>
            <div style={cardStyle}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                }}
              >
                <span style={{ fontSize: "0.85rem", color: "var(--text-light)", fontWeight: 600 }}>
                  📝 مراجعة الأخطاء
                </span>
                <button onClick={() => setPhase("result")} style={btnSecondary}>
                  العودة ←
                </button>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {wrongAnswers.map((wa, i) => (
                  <div
                    key={i}
                    className="animate-fade-in-up"
                    style={{
                      padding: "1rem",
                      borderRadius: 10,
                      background: "#fdecea",
                      borderRight: "4px solid #e74c3c",
                      animationDelay: `${i * 0.1}s`,
                      animationFillMode: "both",
                    }}
                  >
                    <p style={{ fontWeight: 700, marginBottom: "0.5rem", fontSize: "0.95rem" }}>
                      {i + 1}. {wa.question}
                    </p>
                    <p style={{ fontSize: "0.85rem", color: "#e74c3c", marginBottom: "0.25rem" }}>
                      ✗ إجابتك: {wa.selected}
                    </p>
                    <p style={{ fontSize: "0.85rem", color: "var(--green-light)", marginBottom: "0.5rem" }}>
                      ✓ الإجابة الصحيحة: {wa.correct}
                    </p>
                    <p style={{ fontSize: "0.82rem", color: "var(--text-light)" }}>
                      💡 {wa.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </PhaseContainer>
        )}
      </div>
    </div>
  );
}

const CONFETTI = (() => {
  const colors = ["#d4a02b", "#27ae60", "#e74c3c", "#3498db", "#f39c12", "#9b59b6"];
  const shapes = ["circle", "square", "star"];
  return Array.from({ length: 30 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 1.5,
    size: 6 + Math.random() * 8,
    shape: shapes[Math.floor(Math.random() * shapes.length)],
    color: colors[i % colors.length],
  }));
})();

function ConfettiOverlay() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 50 }}>
      {CONFETTI.map((p, i) => {
        const isStar = p.shape === "star";
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: "-10px",
              left: `${p.left}%`,
              width: isStar ? "auto" : p.size,
              height: isStar ? "auto" : p.size,
              fontSize: isStar ? p.size + 6 : undefined,
              color: p.color,
              background: isStar ? "transparent" : p.color,
              borderRadius: p.shape === "circle" ? "50%" : p.shape === "square" ? "2px" : undefined,
              animation: `confetti 2s ease ${p.delay}s forwards`,
              opacity: 0,
            }}
          >
            {isStar ? "★" : null}
          </div>
        );
      })}
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: "var(--card-bg)",
  borderRadius: "var(--radius)",
  padding: "1.25rem",
  boxShadow: "var(--shadow-lg)",
  border: "1px solid var(--card-border)",
};
