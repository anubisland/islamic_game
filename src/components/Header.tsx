interface Props {
  onHome?: () => void;
}

export function Header({ onHome }: Props) {
  return (
    <header
      style={{
        background: "linear-gradient(135deg, var(--green-primary), var(--green-dark))",
        color: "#fff",
        padding: "1rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <h1
        style={{ fontSize: "1.3rem", fontWeight: 700, cursor: onHome ? "pointer" : "default" }}
        onClick={onHome}
      >
        🌙 رحلة الإيمان
      </h1>
      {onHome && (
        <button
          onClick={onHome}
          style={{
            background: "rgba(255,255,255,0.15)",
            color: "#fff",
            padding: "0.4rem 1rem",
            borderRadius: 8,
            fontSize: "0.85rem",
          }}
        >
          الرئيسية
        </button>
      )}
    </header>
  );
}
