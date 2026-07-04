import { useState } from "react";
import { ShopBoard } from "../components/ShopBoard";

interface Props {
  lang: "ar" | "en";
  onBack: () => void;
}

export function MarketHome({ lang, onBack }: Props) {
  const [started, setStarted] = useState(false);

  if (!started) {
    const dir = lang === "ar" ? "rtl" : "ltr";
    return (
      <div dir={dir} style={{
        maxWidth: 600, margin: "0 auto", padding: "1rem",
        textAlign: "center",
      }}>
        <button onClick={onBack} style={{
          background: "none", border: "none", cursor: "pointer",
          padding: "0.25rem 0", marginBottom: "0.5rem", display: "block",
          color: "var(--text-light)", fontSize: "0.85rem",
        }}>
          {lang === "ar" ? "← العودة إلى المركز" : "← Back to Hub"}
        </button>

        <div style={{
          background: "linear-gradient(135deg, #8B4513, #A0522D)",
          borderRadius: "var(--radius)", padding: "2rem 1.5rem",
          color: "#fff",
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏪</div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0 0 0.5rem 0" }}>
            {lang === "ar" ? "سوق المدينة" : "City Market"}
          </h1>
          <p style={{ fontSize: "0.9rem", opacity: 0.9, lineHeight: 1.7, margin: "0 0 1.5rem 0" }}>
            {lang === "ar"
              ? "في قلب المدينة المنورة في عصر الخلافة الراشدة، تبدأ رحلتك كتاجر صغير. اشترِ البضائع من القوافل، بعها للزبائن، وارتقِ بدكانك حتى تصبح شاه بندر التجار. احذر! فالتجارة أمانة، والبركة في الصدق."
              : "In the heart of Medina during the Caliphate era, your journey as a small merchant begins. Buy goods from caravans, sell to customers, and upgrade your shop to become Shah Bandar of Merchants. Beware! Trade is a trust, and barakah lies in honesty."}
          </p>
          <button onClick={() => setStarted(true)} style={{
            padding: "0.8rem 2.5rem", borderRadius: 8, border: "none",
            background: "#FFD700", color: "#3E2723",
            fontSize: "1.05rem", fontWeight: 700, cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}>
            {lang === "ar" ? "🛒 ابدأ التجارة" : "🛒 Start Trading"}
          </button>
        </div>
      </div>
    );
  }

  return <ShopBoard lang={lang} onBack={onBack} />;
}
