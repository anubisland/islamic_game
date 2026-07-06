import { useCallback, useEffect, useRef, useState } from "react";

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
  const pollRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    // Prime Chrome's voice engine
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

    // Poll aggressively for voices (Chrome bug workaround)
    pollRef.current = setInterval(refresh, 150);
    setTimeout(() => clearInterval(pollRef.current), 8000);

    window.speechSynthesis?.addEventListener("voiceschanged", refresh);
    return () => {
      clearInterval(pollRef.current);
      window.speechSynthesis?.removeEventListener("voiceschanged", refresh);
    };
  }, []);

  const setVoice = useCallback((uri: string) => {
    setVoiceURI(uri);
    saveVoicePref(uri);
  }, []);

  function pickVoice(lang: "ar" | "en"): SpeechSynthesisVoice | null {
    if (voiceURI) {
      const preferred = voices.find(v => v.voiceURI === voiceURI);
      if (preferred) return preferred;
    }
    const prefix = lang === "ar" ? "ar" : "en";
    const neural = voices.find(v => v.lang.startsWith(prefix) && (v.name.includes("Neural") || v.name.includes("Natural")));
    if (neural) return neural;
    // Known Windows Arabic voices: Shaker, Hamed, Hoda, Zira
    // Known Windows English voices: Jenny, Mark, David, Zira
    const names = lang === "ar" ? ["Shaker", "Hamed", "Hoda", "Zira"] : ["Jenny", "Mark", "David", "Zira"];
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

  return { speak, stop, voices, voiceURI, setVoice };
}
