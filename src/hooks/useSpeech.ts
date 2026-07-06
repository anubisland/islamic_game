import { useCallback, useEffect, useState } from "react";

const VOICE_KEY = "islamic-quest-voice";

function loadVoicePref(): string {
  try { return localStorage.getItem(VOICE_KEY) ?? ""; } catch { return ""; }
}
function saveVoicePref(uri: string) {
  try { localStorage.setItem(VOICE_KEY, uri); } catch { /* ignore */ }
}

export function useSpeech() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceURI, setVoiceURI] = useState(loadVoicePref);

  // Load voices when they become available
  useEffect(() => {
    function update() { setVoices(window.speechSynthesis.getVoices()); }
    update();
    window.speechSynthesis.addEventListener("voiceschanged", update);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", update);
  }, []);

  const setVoice = useCallback((uri: string) => {
    setVoiceURI(uri);
    saveVoicePref(uri);
  }, []);

  function pickVoice(lang: "ar" | "en"): SpeechSynthesisVoice | null {
    // If user selected a voice, use it
    if (voiceURI) {
      const preferred = voices.find(v => v.voiceURI === voiceURI);
      if (preferred) return preferred;
    }
    // Auto-pick best available
    const prefix = lang === "ar" ? "ar" : "en";
    const neural = voices.find(v => v.lang.startsWith(prefix) && (v.name.includes("Neural") || v.name.includes("Natural")));
    if (neural) return neural;
    const names = lang === "ar" ? ["Hoda", "Zira"] : ["Jenny", "Mark", "David"];
    for (const n of names) {
      const m = voices.find(v => v.lang.startsWith(prefix) && v.name.includes(n));
      if (m) return m;
    }
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
      const voice = pickVoice(lang);
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener("voiceschanged", doSpeak, { once: true });
      setTimeout(() => { if (!window.speechSynthesis.speaking) doSpeak(); }, 300);
      return;
    }
    doSpeak();
  }

  function stop() {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
  }

  return { speak, stop, voices, voiceURI, setVoice };
}
