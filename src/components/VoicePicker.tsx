import { useEffect, useState } from "react";
import { useSpeech } from "../hooks/useSpeech";
import { useTranslation } from "../i18n";

interface Props {
  lang: "ar" | "en";
}

export function VoicePicker({ lang }: Props) {
  const { voices, voiceURI, setVoice, speak } = useSpeech();
  const { t } = useTranslation();
  const [loaded, setLoaded] = useState(voices.length > 0);

  useEffect(() => {
    if (voices.length > 0) setLoaded(true);
  }, [voices]);

  const filtered = voices.filter(v => v.lang.startsWith(lang === "ar" ? "ar" : "en"));

  if (!loaded || filtered.length === 0) return null;

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "0.4rem",
      marginTop: "0.5rem", flexWrap: "wrap",
    }}>
      <span style={{ fontSize: "0.78rem", color: "var(--text-light)", whiteSpace: "nowrap" }}>
        🎤 {t.gameHub.voiceLabel}
      </span>
      <select
        value={voiceURI}
        onChange={(e) => setVoice(e.target.value)}
        style={{
          flex: 1, minWidth: 120,
          padding: "0.25rem 0.35rem", borderRadius: 6,
          border: "1px solid var(--border)", fontSize: "0.78rem",
          background: "var(--card-bg)", color: "var(--text)",
        }}
      >
        <option value="">{t.gameHub.voiceAuto}</option>
        {filtered.map((v) => (
          <option key={v.voiceURI} value={v.voiceURI}>
            {v.name} ({v.lang})
          </option>
        ))}
      </select>
      <button
        onClick={() => speak(lang === "ar" ? "السلام عليكم ورحمة الله وبركاته" : "Hello, welcome to the Islamic games hub", lang)}
        style={{
          background: "var(--green-primary)", color: "#fff",
          border: "none", borderRadius: 6, padding: "0.25rem 0.6rem",
          fontSize: "0.78rem", cursor: "pointer", fontWeight: 600,
        }}
      >
        🔊
      </button>
    </div>
  );
}
