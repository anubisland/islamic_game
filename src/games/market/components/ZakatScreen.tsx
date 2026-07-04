import { useState } from "react";

interface Props {
  due: number;
  gold: number;
  lang: "ar" | "en";
  onPaid: (amount: number) => void;
  onSkip: () => void;
}

export function ZakatScreen({ due, gold, lang, onPaid, onSkip }: Props) {
  const [customAmount, setCustomAmount] = useState("");
  const dir = lang === "ar" ? "rtl" : "ltr";

  function handleExact() {
    if (gold >= due) onPaid(due);
  }

  function handleCustom() {
    const amt = parseInt(customAmount, 10);
    if (isNaN(amt) || amt <= 0) return;
    if (amt > gold) return;
    onPaid(amt);
  }

  const dirStyle: React.CSSProperties = dir === "rtl" ? { textAlign: "right" as const } : {};

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.6)", display: "flex",
      alignItems: "center", justifyContent: "center",
      padding: "1rem",
    }}>
      <div dir={dir} style={{
        maxWidth: 500, width: "100%",
        background: "linear-gradient(135deg, #1B5E20, #2E7D32)",
        borderRadius: 12, padding: "1.5rem",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        color: "#fff",
      }}>
        <div style={{ fontSize: "3rem", textAlign: "center", marginBottom: "0.75rem" }}>🤲</div>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, textAlign: "center", margin: "0 0 0.25rem 0", ...dirStyle }}>
          {lang === "ar" ? "حان وقت الزكاة!" : "Zakat Time!"}
        </h2>
        <p style={{ fontSize: "0.85rem", opacity: 0.9, textAlign: "center", marginBottom: "1rem", lineHeight: 1.6, ...dirStyle }}>
          {lang === "ar"
            ? `مر حول كامل على مالك. الزكاة المستحقة هي ${due} دينار (2.5% من إجمالي ثروتك).`
            : `A full year has passed on your wealth. Zakat due is ${due} dinars (2.5% of total wealth).`}
        </p>

        <div style={{
          background: "rgba(255,255,255,0.1)", borderRadius: 8,
          padding: "0.75rem", marginBottom: "1rem",
        }}>
          <p style={{ fontSize: "0.8rem", opacity: 0.8, margin: "0 0 0.25rem 0" }}>
            {lang === "ar" ? "المبلغ المستحق:" : "Amount due:"}
          </p>
          <p style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
            {due} 🪙
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <button onClick={handleExact} disabled={gold < due} style={{
            padding: "0.7rem", borderRadius: 8, border: "none",
            background: gold >= due ? "#FFD700" : "#666",
            color: gold >= due ? "#1B5E20" : "#999",
            fontSize: "0.9rem", fontWeight: 700, cursor: gold >= due ? "pointer" : "default",
            ...dirStyle,
          }}>
            {lang === "ar" ? `دفع ${due} دينار (المبلغ المحدد)` : `Pay ${due} dinars (exact amount)`}
          </button>

          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder={lang === "ar" ? "مبلغ آخر..." : "Other amount..."}
              style={{
                flex: 1, padding: "0.6rem 0.75rem", borderRadius: 6, border: "none",
                fontSize: "0.85rem",
              }}
            />
            <button onClick={handleCustom} disabled={!customAmount} style={{
              padding: "0.6rem 1rem", borderRadius: 6, border: "none",
              background: customAmount ? "#FFD700" : "#666",
              color: customAmount ? "#1B5E20" : "#999",
              fontSize: "0.85rem", fontWeight: 700, cursor: customAmount ? "pointer" : "default",
            }}>
              {lang === "ar" ? "دفع" : "Pay"}
            </button>
          </div>

          <button onClick={onSkip} style={{
            padding: "0.6rem", borderRadius: 8, border: "1px solid rgba(255,255,255,0.3)",
            background: "transparent", color: "rgba(255,255,255,0.7)",
            fontSize: "0.8rem", cursor: "pointer",
          }}>
            {lang === "ar" ? "تخطي (ستخسر 20 بركة)" : "Skip (lose 20 barakah)"}
          </button>
        </div>
      </div>
    </div>
  );
}
