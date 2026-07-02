import { useTheme } from "../hooks/useTheme";

interface Props {
  onHome?: () => void;
  title?: string;
}

export function Header({ onHome, title }: Props) {
  const { theme, toggle } = useTheme();

  return (
    <header style={styles.header}>
      <div style={styles.inner}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", overflow: "hidden" }}>
          <h1 style={styles.logo} onClick={onHome}>
            🌙 رحلة الإيمان
          </h1>

          {title && <span style={styles.title}>{title}</span>}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", flexShrink: 0 }}>
          <button
            onClick={toggle}
            style={styles.themeBtn}
            title={theme === "light" ? "الوضع الليلي" : "الوضع النهاري"}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {onHome && (
            <button onClick={onHome} style={styles.homeBtn}>
              ← الرئيسية
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
