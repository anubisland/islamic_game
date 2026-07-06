import { useCallback, useEffect, useRef, useState } from "react";

const VOICE_KEY = "islamic-quest-voice";

export interface VoiceSlot {
  id: string;
  labelAr: string;
  labelEn: string;
  descAr: string;
  descEn: string;
  /** Substring to match in voice.name for Arabic */
  arName: string;
  /** Substring to match in voice.name for English */
  enName: string;
}

export const VOICE_SLOTS: VoiceSlot[] = [
  { id: "classic", labelAr: "حامد", labelEn: "Hamed", descAr: "فصيح", descEn: "Classic", arName: "Hamed", enName: "Guy" },
  { id: "gentle", labelAr: "زارية", labelEn: "Zariyah", descAr: "هادئ", descEn: "Gentle", arName: "Zariyah", enName: "Aria" },
  { id: "story", labelAr: "سلمى", labelEn: "Salma", descAr: "حكواتية", descEn: "Storyteller", arName: "Salma", enName: "Jenny" },
  { id: "warm", labelAr: "عبدالله", labelEn: "Abdullah", descAr: "ودود", descEn: "Warm", arName: "Abdullah", enName: "Ryan" },
  { id: "shakir", labelAr: "شاكر", labelEn: "Shakir", descAr: "مصري", descEn: "Egyptian", arName: "Shakir", enName: "Brian" },
  { id: "hoda", labelAr: "هدى", labelEn: "Hoda", descAr: "أنثى", descEn: "Female", arName: "Hoda", enName: "Zira" },
];

function loadVoicePref(): string {
  try { return localStorage.getItem(VOICE_KEY) ?? ""; } catch { return ""; }
}
function saveVoicePref(uri: string) {
  try { localStorage.setItem(VOICE_KEY, uri); } catch { /* ignore */ }
}

export function useSpeech() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceId, setVoiceId] = useState(loadVoicePref);
  const pollRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    window.speechSynthesis?.getVoices();
    try {
      const u = new SpeechSynthesisUtterance("");
      u.volume = 0;
      window.speechSynthesis?.speak(u);
      window.speechSynthesis?.cancel();
    } catch { /* ignore */ }

    function refresh() {
      const v = window.speechSynthesis?.getVoices() ?? [];
      if (v.length > 0) {
        setVoices(v);
        clearInterval(pollRef.current);
      }
    }

    pollRef.current = setInterval(refresh, 150);
    setTimeout(() => clearInterval(pollRef.current), 8000);

    window.speechSynthesis?.addEventListener("voiceschanged", refresh);
    return () => {
      clearInterval(pollRef.current);
      window.speechSynthesis?.removeEventListener("voiceschanged", refresh);
    };
  }, []);

  const setVoice = useCallback((id: string) => {
    setVoiceId(id);
    saveVoicePref(id);
  }, []);

  function resolveVoice(lang: "ar" | "en"): SpeechSynthesisVoice | null {
    // If user picked a slot, find a matching voice
    const slot = VOICE_SLOTS.find(s => s.id === voiceId);
    if (slot) {
      const name = lang === "ar" ? slot.arName : slot.enName;
      const prefix = lang === "ar" ? "ar" : "en";
      const match = voices.find(v => v.lang.startsWith(prefix) && v.name.includes(name));
      if (match) return match;
    }
    // Fallback: find any neural voice for this language
    const prefix = lang === "ar" ? "ar" : "en";
    const neural = voices.find(v => v.lang.startsWith(prefix) && (v.name.includes("Neural") || v.name.includes("Natural")));
    if (neural) return neural;
    // Any voice matching language
    return voices.find(v => v.lang.startsWith(prefix)) ?? null;
  }

  function speak(text: string, lang: "ar" | "en") {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const doSpeak = () => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === "ar" ? "ar-SA" : "en-US";
      utterance.rate = 0.85;
      utterance.pitch = 1;
      const voice = resolveVoice(lang);
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    };

    const v = window.speechSynthesis.getVoices();
    if (v.length === 0) {
      window.speechSynthesis.addEventListener("voiceschanged", doSpeak, { once: true });
      setTimeout(() => { if (!window.speechSynthesis.speaking) doSpeak(); }, 600);
      return;
    }
    doSpeak();
  }

  function stop() {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
  }

  return { speak, stop, voices, voiceId, setVoice, VOICE_SLOTS };
}