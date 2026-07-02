import { useState, useCallback } from "react";
import type { Stage } from "../types";

interface Props {
  stage: Stage;
  knownLessons: string[];
  onToggleLesson: (lessonId: string) => void;
  onBack: () => void;
}

export function FlashcardPage({ stage, knownLessons, onToggleLesson, onBack }: Props) {
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);

  const lesson = stage.lessons[cardIndex];
  const isKnown = knownLessons.includes(lesson.id);
  const progress = stage.lessons.length > 0
    ? `${cardIndex + 1} / ${stage.lessons.length}`
    : "0 / 0";

  const handleNext = useCallback(() => {
    setFlipped(false);
    if (cardIndex + 1 < stage.lessons.length) {
      setCardIndex((i) => i + 1);
    } else {
      setDone(true);
    }
  }, [cardIndex, stage.lessons.length]);

  const handlePrev = useCallback(() => {
    if (cardIndex > 0) {
      setFlipped(false);
      setCardIndex((i) => i - 1);
    }
  }, [cardIndex]);

  const handleFlip = useCallback(() => {
    setFlipped((f) => !f);
  }, []);

  if (stage.lessons.length === 0) {
    return (
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "2rem 1rem", textAlign: "center" }}>
        <p style={{ color: "var(--text-light)", marginBottom: "1rem" }}>لا توجد دروس في هذه المرحلة</p>
        <button onClick={onBack} style={btnSecondary}>→ العودة</button>
      </div>
    );
  }

  if (done) {
    const knownCount = knownLessons.length;
    const totalCount = stage.lessons.length;
    return (
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "2rem 1rem", textAlign: "center" }}>
        <div className="animate-scale-in" style={cardStyle}>
          <p style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🎉</p>
          <h2 style={{ color: "var(--green-primary)", marginBottom: "0.5rem", fontSize: "1.3rem" }}>
            أحسنت! أكملت جميع البطاقات
          </h2>
          <p style={{ color: "var(--text-light)", fontSize: "0.9rem" }}>
            تعرفت على {knownCount} من {totalCount} درس
          </p>
        </div>
        <button
          onClick={() => {
            setDone(false);
            setCardIndex(0);
            setFlipped(false);
          }}
          style={{ ...btnPrimary, marginTop: "1rem" }}
        >
          🔄 إعادة المراجعة
        </button>
        <button onClick={onBack} style={{ ...btnSecondary, marginTop: "0.75rem" }}>
          → العودة
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: "1rem 0.75rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <button onClick={onBack} style={btnSecondary}>→ العودة</button>
        <span style={{ fontSize: "0.85rem", color: "var(--text-light)", fontWeight: 600 }}>{progress}</span>
      </div>

      <div
        style={{
          background: "var(--card-bg)",
          borderRadius: "var(--radius)",
          padding: "0.75rem",
          boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--card-border)",
          marginBottom: "1rem",
          minHeight: 280,
        }}
      >
        <p style={{
          textAlign: "center",
          fontSize: "0.82rem",
          color: "var(--text-light)",
          marginBottom: "0.75rem",
          fontWeight: 600,
        }}>
          المرحلة {cardIndex + 1}: {lesson.title}
        </p>

        <div
          onClick={handleFlip}
          style={{
            perspective: 1000,
            cursor: "pointer",
            minHeight: 180,
          }}
        >
          <div
            className={flipped ? "card-flipped" : ""}
            style={{
              transition: "transform 0.5s ease",
              transformStyle: "preserve-3d",
              position: "relative",
              transform: flipped ? "rotateX(180deg)" : "none",
            }}
          >
            <div
              style={{
                backfaceVisibility: "hidden",
                padding: "1.25rem",
                borderRadius: 12,
                background: "var(--cream)",
                border: "1px solid var(--card-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 180,
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <span style={{ fontSize: "2rem" }}>📖</span>
              <p style={{ fontWeight: 600, color: "var(--green-primary)", textAlign: "center" }}>
                {lesson.title}
              </p>
              <p style={{ fontSize: "0.8rem", color: "var(--text-light)" }}>
                اضغط للاطلاع على الشرح
              </p>
            </div>

            <div
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateX(180deg)",
                position: "absolute",
                inset: 0,
                padding: "1.25rem",
                borderRadius: 12,
                background: "var(--card-bg)",
                border: "1px solid var(--card-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 180,
              }}
            >
              <p style={{ textAlign: "center", lineHeight: 1.7, fontSize: "0.9rem", color: "var(--text)" }}>
                {lesson.content}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginBottom: "1rem" }}>
        <button
          onClick={() => { onToggleLesson(lesson.id); }}
          style={{
            padding: "0.6rem 1.25rem",
            borderRadius: 10,
            border: `2px solid ${isKnown ? "var(--green-light)" : "var(--border)"}`,
            background: isKnown ? "#e8f5e9" : "transparent",
            color: isKnown ? "var(--green-light)" : "var(--text-light)",
            fontWeight: 700,
            fontSize: "0.9rem",
          }}
        >
          {isKnown ? "✅ أعرفه" : "📚 أتعلمه"}
        </button>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
        <button onClick={handlePrev} disabled={cardIndex === 0} style={{
          ...btnSecondary,
          opacity: cardIndex === 0 ? 0.4 : 1,
        }}>
          → السابق
        </button>
        <button onClick={handleNext} style={btnPrimary}>
          {cardIndex + 1 < stage.lessons.length ? "التالي ←" : "الانتهاء 🎉"}
        </button>
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: "var(--card-bg)",
  borderRadius: "var(--radius)",
  padding: "1.5rem",
  boxShadow: "var(--shadow-lg)",
  border: "1px solid var(--card-border)",
};

const btnPrimary: React.CSSProperties = {
  background: "linear-gradient(135deg, var(--green-light), var(--green-dark))",
  color: "#fff",
  padding: "0.65rem 1.5rem",
  borderRadius: 10,
  fontSize: "0.9rem",
  fontWeight: 700,
};

const btnSecondary: React.CSSProperties = {
  background: "transparent",
  color: "var(--text-light)",
  padding: "0.65rem 1.5rem",
  borderRadius: 10,
  border: "1px solid var(--border)",
  fontSize: "0.9rem",
  fontWeight: 600,
};
