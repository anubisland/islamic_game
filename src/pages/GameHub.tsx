import { useState, useCallback } from "react";
import { useTranslation } from "../i18n";
import { useSpeech } from "../hooks/useSpeech";
import { TOTAL_DETECTIVE_STAGES } from "../games/detective/data/stages";

interface Props {
  onSelectGame: (gameId: string) => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
}

export function GameHub({ onSelectGame, soundEnabled, onToggleSound }: Props) {
  const { t, lang, setLang, dir } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const { speak, stop } = useSpeech();
  const gh = t.gameHub;

  const handleSpeak = useCallback(() => {
    if (speaking) { stop(); setSpeaking(false); return; }
    const text = `${gh.introCard.title}. ${gh.introCard.desc}${expanded ? ` ${gh.introCard.features.join(". ")}` : ""}`;
    setSpeaking(true);
    speak(text, lang);
    const check = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        clearInterval(check);
        setSpeaking(false);
      }
    }, 200);
  }, [speaking, expanded, gh, lang, speak, stop]);

  return (
    <div dir={dir}>
      <header style={headerStyle}>
        <div style={headerInner}>
          <h1 style={logoStyle}>🧩 {gh.title}</h1>
          <div style={{ display: "flex", gap: "0.35rem" }}>
            {onToggleSound !== undefined && (
              <button onClick={onToggleSound} style={iconBtn} title={soundEnabled ? t.header.mute : t.header.unmute}>
                {soundEnabled ? "🔊" : "🔇"}
              </button>
            )}
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              style={langBtn}
            >
              {lang === "ar" ? "EN" : "AR"}
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "1.5rem 0.75rem" }}>
        <p style={{ textAlign: "center", color: "var(--text-light)", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
          {gh.subtitle}
        </p>

        {/* Intro card */}
        <div
          className="animate-fade-in-up"
          style={{
            background: "linear-gradient(135deg, var(--green-primary), #0f4d2e)",
            color: "#fff",
            borderRadius: "var(--radius)",
            padding: "1.5rem",
            marginBottom: "1.5rem",
            boxShadow: "0 6px 24px rgba(27,107,62,0.3)",
          }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem", textAlign: "center" }}>🕌</div>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "0.75rem", textAlign: "center" }}>
            {gh.introCard.title}
            <button onClick={handleSpeak} style={{
              background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "50%", width: 32, height: 32, cursor: "pointer",
              fontSize: "0.9rem", marginLeft: "0.5rem", verticalAlign: "middle",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              color: speaking ? "#FFD700" : "#fff",
            }}>
              {speaking ? "⏹" : "🔊"}
            </button>
          </h2>
          <p style={{ lineHeight: 1.8, fontSize: "0.9rem", opacity: 0.9, marginBottom: "1rem" }}>
            {gh.introCard.desc}
          </p>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              background: "rgba(255,255,255,0.15)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.25)",
              padding: "0.4rem 1rem",
              borderRadius: 8,
              fontSize: "0.82rem",
              fontWeight: 600,
              width: "100%",
            }}
          >
            {expanded ? "▲" : "▼"} {expanded ? "إخفاء" : lang === "ar" ? "المزيد" : "More"}
          </button>
          {expanded && (
            <div className="animate-slide-down" style={{ marginTop: "1rem" }}>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {gh.introCard.features.map((feat: string, i: number) => (
                  <li key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
                    <span style={{ fontSize: "1.1rem" }}>✅</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Game cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <GameCard
            icon="🕌"
            title={lang === "ar" ? "رحلة الإيمان" : "Faith Journey"}
            subtitle={lang === "ar" ? "لعبة تعليمية إسلامية متعددة المراحل" : "Multi-stage Islamic educational game"}
            desc={lang === "ar"
              ? "15 مرحلة تعليمية تغطي أركان الإسلام، السيرة النبوية، القرآن الكريم، الفقه، الأذكار، الحديث، رمضان، الحج، الإسراء والمعراج، الخلفاء الراشدون وغيرها"
              : "15 educational stages covering Pillars of Islam, Prophetic biography, Quran, jurisprudence, remembrances, hadith, Ramadan, Hajj, Isra wal-Miraj, Rightly Caliphs and more"}
            stagesCount={15}
            questionsCount={88}
            onClick={() => onSelectGame("faith-journey")}
          />

          {/* Architect Game */}
          <GameCard
            icon="🎨"
            title={lang === "ar" ? "المهندس المسلم" : "Muslim Architect"}
            subtitle={lang === "ar" ? "ألغاز التناظر الهندسي من العمارة الإسلامية" : "Symmetry puzzles from Islamic architecture"}
            desc={lang === "ar"
              ? "أكمل الأنماط الهندسية المتناظرة من روائع العمارة الإسلامية عبر العصور: الأموي، العباسي، الأندلس، والعثماني. كل لغز يعرّفك على معلم معماري إسلامي فريد."
              : "Complete symmetric geometric patterns from Islamic architecture masterpieces across ages: Umayyad, Abbasid, Andalusia, and Ottoman. Each puzzle teaches you about a unique Islamic architectural wonder."}
            stagesCount={12}
            questionsCount={12}
            onClick={() => onSelectGame("architect")}
          />

          {/* Ibn Battuta Game */}
          <GameCard
            icon="🧭"
            title={lang === "ar" ? "رحلة ابن بطوطة" : "Ibn Battuta's Journey"}
            subtitle={lang === "ar" ? "مغامرات وألغاز جغرافية عبر العالم الإسلامي" : "Geography puzzles and adventure across the Islamic world"}
            desc={lang === "ar"
              ? "سافر مع ابن بطوطة في رحلته الشهيرة التي استمرت 30 عاماً. حل الألغاز المنطقية والتاريخية والرياضية لتتقدم من مدينة إلى أخرى، وتعرف على الحضارة الإسلامية في مختلف بقاع العالم."
              : "Travel with Ibn Battuta on his famous 30-year journey. Solve logic, history, and math puzzles to advance from city to city, discovering Islamic civilization across the world."}
            stagesCount={10}
            questionsCount={10}
            onClick={() => onSelectGame("battuta")}
          />

          {/* Word Sea Game */}
          <GameCard
            icon="📖"
            title={lang === "ar" ? "بحر الكلمات" : "Word Sea"}
            subtitle={lang === "ar" ? "ألغاز لغوية من القرآن والسنة" : "Word puzzles from Quran and Sunnah"}
            desc={lang === "ar"
              ? "اختبر معرفتك بالكلمات والمفاهيم الإسلامية من القرآن الكريم والحديث النبوي. صل الكلمات بمعانيها، وأكمل الآيات، وتعلم المصطلحات الدينية."
              : "Test your knowledge of Islamic words and concepts from the Holy Quran and Prophetic Hadith. Match words to meanings, complete verses, and learn religious terms."}
            stagesCount={8}
            questionsCount={8}
            onClick={() => onSelectGame("wordsea")}
          />

          {/* Detective Game */}
          <GameCard
            icon="🔍"
            title={lang === "ar" ? "المحقق التاريخي" : "Historical Detective"}
            subtitle={lang === "ar" ? "حل الألغاز التاريخية واكتشف الحقيقة" : "Solve historical mysteries and discover the truth"}
            desc={lang === "ar"
              ? "ارتدِ عباءة المحقق وابحث في أعظم ألغاز التاريخ الإسلامي. رتب الأحداث التاريخية، حدد الإجابات الصحيحة، واكتشف الحقيقة المخبأة وراء كل قضية."
              : "Put on the detective's cloak and investigate the greatest mysteries of Islamic history. Arrange historical events, identify correct answers, and uncover the truth hidden behind each case."}
            stagesCount={TOTAL_DETECTIVE_STAGES}
            questionsCount={TOTAL_DETECTIVE_STAGES}
            onClick={() => onSelectGame("detective")}
          />

          {/* Market Game */}
          <GameCard
            icon="🏪"
            title={lang === "ar" ? "سوق المدينة" : "City Market"}
            subtitle={lang === "ar" ? "محاكاة تجارة وإدارة في العصر الإسلامي" : "Trade simulation in the Islamic era"}
            desc={lang === "ar"
              ? "ابدأ كتاجر صغير في سوق المدينة المنورة. اشترِ البضائع من القوافل، بعها للزبائن، وسّع دكانك، وادفع الزكاة. وازن بين الربح والبركة، وتجنب الغش والاحتكار لتصبح شاه بندر التجار!"
              : "Start as a small merchant in the Medina market. Buy goods from caravans, sell to customers, expand your shop, and pay zakat. Balance profit with barakah, avoid cheating and hoarding to become Shah Bandar of Merchants!"}
            stagesCount={1}
            questionsCount={1}
            onClick={() => onSelectGame("market")}
          />
        </div>
      </div>
    </div>
  );
}

function GameCard({
  icon, title, subtitle, desc, stagesCount, questionsCount, onClick,
}: {
  icon: string; title: string; subtitle: string; desc: string;
  stagesCount: number; questionsCount: number; onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="animate-scale-in"
      style={{
        background: "var(--card-bg)",
        borderRadius: "var(--radius)",
        padding: "1.25rem",
        boxShadow: hovered ? "var(--shadow-lg)" : "var(--shadow)",
        border: "2px solid var(--green-primary)",
        transition: "all 0.3s",
        transform: hovered ? "translateY(-4px)" : "none",
        cursor: "pointer",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
        <span style={{ fontSize: "2.5rem" }}>{icon}</span>
        <div>
          <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--green-primary)" }}>{title}</h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-light)" }}>{subtitle}</p>
        </div>
      </div>
      <p style={{ fontSize: "0.85rem", lineHeight: 1.7, color: "var(--text)", marginBottom: "0.75rem" }}>{desc}</p>
      <div style={{ display: "flex", gap: "1rem", fontSize: "0.82rem", color: "var(--text-light)" }}>
        <span>📚 {stagesCount} {stagesCount > 1 ? "مراحل" : "مرحلة"}</span>
        <span>🧠 {questionsCount} {questionsCount > 1 ? "سؤالاً" : "سؤال"}</span>
      </div>
    </div>
  );
}

const headerStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #0f4d2e, var(--green-dark))",
  color: "#fff",
  padding: "0.7rem 0.75rem",
  position: "sticky",
  top: 0,
  zIndex: 100,
  boxShadow: "0 2px 16px rgba(0,0,0,0.15)",
};

const headerInner: React.CSSProperties = {
  maxWidth: 700,
  margin: "0 auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const logoStyle: React.CSSProperties = {
  fontSize: "1.15rem",
  fontWeight: 800,
  letterSpacing: "0.5px",
};

const iconBtn: React.CSSProperties = {
  background: "rgba(255,255,255,0.12)",
  color: "#fff",
  padding: "0.35rem 0.6rem",
  borderRadius: 8,
  fontSize: "1rem",
  border: "1px solid rgba(255,255,255,0.2)",
};

const langBtn: React.CSSProperties = {
  background: "rgba(255,255,255,0.15)",
  color: "#fff",
  padding: "0.35rem 0.85rem",
  borderRadius: 8,
  fontSize: "0.82rem",
  fontWeight: 700,
  border: "1px solid rgba(255,255,255,0.25)",
  letterSpacing: 1,
};
