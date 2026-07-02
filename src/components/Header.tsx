import { useTheme } from "../hooks/useTheme";
import { useTranslation } from "../i18n";

interface Props {
  onHome?: () => void;
  title?: string;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  onHub?: () => void;
}

export function Header({ onHome, title, soundEnabled, onToggleSound, onHub }: Props) {
  const { theme, toggle } = useTheme();
  const { t, lang, setLang } = useTranslation();

  return (
    <header style={styles.header}>
      <div style={styles.inner}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", overflow: "hidden" }}>
          <h1 style={styles.logo} onClick={onHome}>
            🌙 {t.home.title}
          </h1>

          {title && <span style={styles.title}>{title}</span>}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", flexShrink: 0 }}>
          {onToggleSound !== undefined && (
            <button
              onClick={onToggleSound}
              style={styles.themeBtn}
              title={soundEnabled ? t.header.mute : t.header.unmute}
            >
              {soundEnabled ? "🔊" : "🔇"}
            </button>
          )}

          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            style={styles.langBtn}
            title={lang === "ar" ? "English" : "العربية"}
          >
            {lang === "ar" ? "EN" : "AR"}
          </button>

          <button
            onClick={toggle}
            style={styles.themeBtn}
            title={theme === "light" ? t.header.darkMode : t.header.lightMode}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {onHub && (
            <button onClick={onHub} style={styles.homeBtn}>
              🧩 {lang === "ar" ? "الرئيسية" : "Home"}
            </button>
          )}

          {onHome && !onHub && (
            <button onClick={onHome} style={styles.homeBtn}>
              ← {t.header.home}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    background: "linear-gradient(135deg, var(--green-primary), var(--green-dark))",
    color: "#fff",
    padding: "0.6rem 0.75rem",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 2px 16px rgba(0,0,0,0.15)",
  },
  inner: {
    maxWidth: 960,
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0.5rem",
  },
  logo: {
    fontSize: "1.25rem",
    fontWeight: 800,
    cursor: "pointer",
    letterSpacing: "0.5px",
    whiteSpace: "nowrap",
  },
  title: {
    fontSize: "0.85rem",
    fontWeight: 600,
    opacity: 0.85,
    textAlign: "center",
    flex: 1,
  },
  themeBtn: {
    background: "rgba(255,255,255,0.12)",
    color: "#fff",
    padding: "0.35rem 0.6rem",
    borderRadius: 8,
    fontSize: "1rem",
    border: "1px solid rgba(255,255,255,0.2)",
  },
  langBtn: {
    background: "rgba(255,255,255,0.15)",
    color: "#fff",
    padding: "0.35rem 0.75rem",
    borderRadius: 8,
    fontSize: "0.8rem",
    fontWeight: 700,
    border: "1px solid rgba(255,255,255,0.25)",
    letterSpacing: 1,
  },
  homeBtn: {
    background: "rgba(255,255,255,0.12)",
    color: "#fff",
    padding: "0.35rem 1rem",
    borderRadius: 8,
    fontSize: "0.82rem",
    fontWeight: 600,
    border: "1px solid rgba(255,255,255,0.2)",
  },
};
