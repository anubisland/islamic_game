import { useCallback, useRef, useState } from "react";

const VOICE_KEY = "islamic-quest-voice";

export interface VoiceSlot {
  id: string;
  labelAr: string;
  labelEn: string;
  descAr: string;
  descEn: string;
  arVoice: string;
  enVoice: string;
}

export const VOICE_SLOTS: VoiceSlot[] = [
  { id: "classic", labelAr: "حامد", labelEn: "Hamed", descAr: "صوت فصيح", descEn: "Classic male", arVoice: "ar-SA-HamedNeural", enVoice: "en-US-GuyNeural" },
  { id: "gentle", labelAr: "زارية", labelEn: "Zariyah", descAr: "صوت هادئ", descEn: "Gentle female", arVoice: "ar-SA-ZariyahNeural", enVoice: "en-US-AriaNeural" },
  { id: "story", labelAr: "سلمى", labelEn: "Salma", descAr: "حكواتية", descEn: "Storyteller female", arVoice: "ar-EG-SalmaNeural", enVoice: "en-US-JennyNeural" },
  { id: "warm", labelAr: "عبدالله", labelEn: "Abdullah", descAr: "صوت ودود", descEn: "Warm male", arVoice: "ar-OM-AbdullahNeural", enVoice: "en-GB-RyanNeural" },
  { id: "shakir", labelAr: "شاكر", labelEn: "Shakir", descAr: "صوت مصري", descEn: "Egyptian male", arVoice: "ar-EG-ShakirNeural", enVoice: "en-US-BrianNeural" },
];

function loadVoicePref(): string {
  try { return localStorage.getItem(VOICE_KEY) ?? "shakir"; } catch { return "shakir"; }
}
function saveVoicePref(id: string) {
  try { localStorage.setItem(VOICE_KEY, id); } catch { /* ignore */ }
}

export function useSpeech() {
  const [voiceId, setVoiceId] = useState(loadVoicePref);
  const [speaking, setSpeaking] = useState(false);
  const currentAudio = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    if (currentAudio.current) {
      currentAudio.current.pause();
      currentAudio.current = null;
    }
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  const setVoice = useCallback((id: string) => {
    setVoiceId(id);
    saveVoicePref(id);
  }, []);

  const speakKey = useCallback((key: string, lang: "ar" | "en") => {
    stop();
    const slot = VOICE_SLOTS.find(s => s.id === voiceId) ?? VOICE_SLOTS[4];
    const url = `${import.meta.env.BASE_URL}audio/${slot.id}/${key}_${lang}.mp3`;
    const audio = new Audio(url);
    audio.preload = "auto";
    audio.onended = () => { setSpeaking(false); currentAudio.current = null; };
    audio.onerror = () => { setSpeaking(false); currentAudio.current = null; };
    audio.onplay = () => setSpeaking(true);
    currentAudio.current = audio;
    audio.play().catch(() => setSpeaking(false));
  }, [voiceId, stop]);

  return { speak: speakKey, stop, speakKey, voiceId, setVoice, VOICE_SLOTS, speaking };
}
