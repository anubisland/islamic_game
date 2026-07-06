import { useEffect, useState } from "react";
import { useSpeech, VOICE_SLOTS } from "../hooks/useSpeech";
import { useTranslation } from "../i18n";

interface Props {
  lang: "ar" | "en";
}

export function VoicePicker({ lang }: Props) {
  const { voices, voiceId, setVoice, speak } = useSpeech();
  const { t } = useTranslation();
  const [loaded, setLoaded] = useState(voices.length > 0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (voices.length > 0) {
      setLoaded(true);
      setLoading(false);
      return;
    }
    const timer = setTimeout(() => setLoading(false), 8000);
    const check = setInterval(() => {
      if (voices.length > 0) {
        setLoaded(true);
        setLoading(false);
        clearInterval(check);
        clearTimeout(timer);
      }
    }, 300);
    return () => { clearInterval(check); clearTimeout(timer); };
  }, [voices]);

  const prefix = lang === "ar" ? "ar" : "en";
  const available = voices.filter(v => v.lang.startsWith(prefix));

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "0.4rem",
      marginTop: "0.5rem", flexWrap: "wrap",
    }}>
      <span style={{ fontSize: "0.78rem", color: "var(--text-light)", whiteSpace: "nowrap" }}>
        🎤 {t.gameHub.voiceLabel}
      </span>
      {!loaded && loading ? (
        <span style={{ fontSize: "0.78rem", color: "var(--text-light)", fontStyle: "italic" }}>
          {lang === "ar" ? "جاري تحميل الأصوات..." : "Loading voices..."}
        </span>
      ) : !loaded || available.length === 0 ? (
        <span style={{ fontSize: "0.78rem", color: "var(--text-light)", fontStyle: "italic" }}>
          {lang === "ar" ? "لا تتوفر أصوات مناسبة" : "No voices available"}
        </span>
      ) : (
        <select
          value={voiceId}
          onChange={(e) => setVoice(e.target.value)}
          style={{
            flex: 1, minWidth: 140,
            padding: "0.25rem 0.35rem", borderRadius: 6,
            border: "1px solid var(--border)", fontSize: "0.78rem",
            background: "var(--card-bg)", color: "var(--text)",
          }}
        >
          <option value="">{t.gameHub.voiceAuto}</option>
          {VOICE_SLOTS.map((slot) => {
            const voiceName = lang === "ar" ? slot.arName : slot.enName;
            const hasMatch = available.some(v => v.name.includes(voiceName));
            const label = lang === "ar"
              ? `${slot.labelAr} / ${slot.labelEn} — ${slot.descAr}`
              : `${slot.labelEn} (${slot.labelAr}) — ${slot.descEn}`;
            return (
              <option key={slot.id} value={slot.id} disabled={!hasMatch}>
                {hasMatch ? "✅ " : "❌ "}{label}
              </option>
            );
          })}
        </select>
      )}
      {loaded && available.length > 0 && (
        <button
          onClick={() => speak(
            lang === "ar"
              ? "السلام عليكم ورحمة الله وبركاته، مرحباً بكم في ألعاب الذكاء الإسلامية"
              : "Hello and welcome to the Islamic IQ Games hub",
            lang
          )}
          style={{
            background: "var(--green-primary)", color: "#fff",
            border: "none", borderRadius: 6, padding: "0.25rem 0.6rem",
            fontSize: "0.78rem", cursor: "pointer", fontWeight: 600,
          }}
        >
          🔊
        </button>
      )}
    </div>
  );
}
