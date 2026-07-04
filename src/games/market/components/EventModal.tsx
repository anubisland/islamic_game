import type { LangStr } from "../data/schema";
import type { MarketEvent } from "../data/schema";

interface Props {
  event: MarketEvent;
  lang: "ar" | "en";
  onChoice: (goldChange: number, barakahChange: number, eventId: string) => void;
}

export function EventModal({ event, lang, onChoice }: Props) {
  const dir = lang === "ar" ? "rtl" : "ltr";
  const t = (s: LangStr) => s[lang];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.6)", display: "flex",
      alignItems: "center", justifyContent: "center",
      padding: "1rem",
    }}>
      <div dir={dir} style={{
        maxWidth: 500, width: "100%",
        background: "#fff", borderRadius: 12,
        padding: "1.25rem", boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      }}>
        <div style={{ fontSize: "2rem", textAlign: "center", marginBottom: "0.75rem" }}>⚖️</div>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#3E2723", textAlign: "center", margin: "0 0 0.5rem 0" }}>
          {t(event.title)}
        </h2>
        <p style={{ fontSize: "0.85rem", color: "#555", lineHeight: 1.7, marginBottom: "1rem", textAlign: "center" }}>
          {t(event.description)}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {event.choices.filter((c): c is NonNullable<typeof c> => c != null).map((choice, idx) => (
            <button
              key={idx}
              onClick={() => onChoice(choice.effect.gold, choice.effect.barakah, event.id)}
              style={{
                padding: "0.7rem 0.75rem", borderRadius: 8, border: "1px solid var(--border)",
                background: "var(--card-bg)", cursor: "pointer",
                textAlign: lang === "ar" ? "right" : "left",
                fontSize: "0.85rem", fontWeight: 500, color: "var(--text)",
                lineHeight: 1.5,
              }}
            >
              <div>{t(choice.text)}</div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-light)", marginTop: "0.25rem" }}>
                {choice.effect.gold !== 0 && `🪙 ${choice.effect.gold > 0 ? "+" : ""}${choice.effect.gold} `}
                {choice.effect.barakah !== 0 && `⭐ ${choice.effect.barakah > 0 ? "+" : ""}${choice.effect.barakah}`}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
