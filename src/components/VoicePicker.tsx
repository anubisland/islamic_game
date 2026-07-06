import { useSpeech, VOICE_SLOTS } from "../hooks/useSpeech";
import { useTranslation } from "../i18n";

interface Props {
  lang: "ar" | "en";
}

export function VoicePicker({ lang }: Props) {
  const { voiceId, setVoice, speakKey, speaking } = useSpeech();
  const { t } = useTranslation();

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "0.4rem",
      marginTop: "0.5rem", flexWrap: "wrap",
    }}>
      <span style={{ fontSize: "0.78rem", color: "var(--text-light)", whiteSpace: "nowrap" }}>
        🎤 {t.gameHub.voiceLabel}
      </span>
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
        {VOICE_SLOTS.map((slot) => {
          const label = lang === "ar"
            ? `${slot.labelAr} — ${slot.descAr}`
            : `${slot.labelEn} — ${slot.descEn}`;
          return (
            <option key={slot.id} value={slot.id}>{label}</option>
          );
        })}
      </select>
      <button
        onClick={() => {
          if (speaking) {
            window.speechSynthesis?.cancel();
            const audio = document.querySelector("audio");
            if (audio) { audio.pause(); audio.currentTime = 0; }
            return;
          }
          speakKey("gamehub_intro_collapsed", lang);
        }}
        style={{
          background: "var(--green-primary)", color: "#fff",
          border: "none", borderRadius: 6, padding: "0.25rem 0.6rem",
          fontSize: "0.78rem", cursor: "pointer", fontWeight: 600,
        }}
      >
        {speaking ? "⏹" : "🔊"}
      </button>
    </div>
  );
}
