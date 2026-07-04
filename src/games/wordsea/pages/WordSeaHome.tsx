import { useTranslation } from "../../../i18n";
import { wordseaStages, type WordStage } from "../data/stages";

interface Props {
  onSelectStage: (stage: WordStage) => void;
  onBack: () => void;
  completed: Set<string>;
}

export function WordSeaHome({ onSelectStage, onBack, completed }: Props) {
  const { lang, dir } = useTranslation();

  const L = (s: { ar: string; en: string }) => s[lang];

  return (
    <div dir={dir}>
      <header style={headerStyle}>
        <div style={headerInner}>
          <button onClick={onBack} style={backBtn}>
            {lang === "ar" ? "→" : "←"} {lang === "ar" ? "العودة" : "Back"}
          </button>
          <h1 style={{ fontSize: "1.1rem", fontWeight: 800 }}>
            📖 {lang === "ar" ? "بحر الكلمات" : "Word Sea"}
          </h1>
          <div style={{ width: 60 }} />
        </div>
      </header>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "1rem 0.75rem" }}>
        <div style={{
          background: "linear-gradient(135deg, #1565C0, #0d47a1)",
          color: "#fff", borderRadius: "var(--radius)", padding: "1.25rem", marginBottom: "1.5rem",
          boxShadow: "0 6px 24px rgba(21,101,192,0.3)",
        }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem", textAlign: "center" }}>📖</div>
          <h2 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "0.5rem", textAlign: "center" }}>
            {lang === "ar" ? "🌊 بحر الكلمات" : "🌊 Word Sea"}
          </h2>
          <p style={{ lineHeight: 1.8, fontSize: "0.88rem", opacity: 0.95 }}>
            {lang === "ar"
              ? "اختبر معرفتك بالكلمات والمفاهيم الإسلامية! في هذه اللعبة ستواجه أسئلة لغوية من القرآن الكريم والحديث النبوي الشريف. صل الكلمات بمعانيها، وأكمل الآيات، وتعرف على المصطلحات الإسلامية."
              : "Test your knowledge of Islamic words and concepts! Face linguistic challenges from the Holy Quran and Prophetic Hadith. Match words to meanings, complete verses, and discover Islamic terminology."}
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {wordseaStages.map((stage, i) => {
            const isCompleted = completed.has(stage.id);
            const locked = i > 0 && !completed.has(wordseaStages[i - 1].id);
            return (
              <button
                key={stage.id}
                onClick={() => { if (!locked) onSelectStage(stage); }}
                disabled={locked}
                style={{
                  display: "flex", alignItems: "center", gap: "0.75rem",
                  background: locked ? "rgba(200,200,200,0.1)" : "var(--card-bg)",
                  border: `2px solid ${locked ? "#ccc" : isCompleted ? "var(--green-primary)" : "var(--border)"}`,
                  borderRadius: "var(--radius)", padding: "0.75rem",
                  cursor: locked ? "default" : "pointer", opacity: locked ? 0.55 : 1,
                  transition: "all 0.2s", textAlign: "start", width: "100%",
                }}
              >
                <span style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: locked ? "#ccc" : isCompleted ? "var(--green-primary)" : "var(--border)",
                  color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.85rem", fontWeight: 700, flexShrink: 0,
                }}>
                  {locked ? "🔒" : isCompleted ? "✓" : i + 1}
                </span>
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 700, fontSize: "0.95rem", color: locked ? "#999" : "var(--text)" }}>
                    {L(stage.title)}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-light)", display: "block" }}>
                    {L(stage.subtitle)}
                  </span>
                </div>
                <span style={{ fontSize: "1.2rem" }}>{locked ? "🔒" : stage.icon}</span>
              </button>
            );
          })}
        </div>
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
