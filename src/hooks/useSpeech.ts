function getBestVoice(lang: "ar" | "en"): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  const langPrefix = lang === "ar" ? "ar" : "en";

  // Prioritize neural / natural voices
  const neural = voices.find(v => v.lang.startsWith(langPrefix) && (v.name.includes("Neural") || v.name.includes("Natural")));
  if (neural) return neural;

  // Fallback to any voice matching the language, preferring female for Arabic, male for English
  const gender = lang === "ar" ? ["Hoda", "Zira"] : ["Mark", "David", "Jenny"];
  for (const name of gender) {
    const match = voices.find(v => v.lang.startsWith(langPrefix) && v.name.includes(name));
    if (match) return match;
  }

  // Last resort: first voice matching the language
  return voices.find(v => v.lang.startsWith(langPrefix)) ?? null;
}

export function useSpeech() {
  function speak(text: string, lang: "ar" | "en") {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    // On Chromium, voices are loaded asynchronously
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener("voiceschanged", () => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang === "ar" ? "ar-SA" : "en-US";
        utterance.rate = 0.85;
        utterance.pitch = 1;
        const voice = getBestVoice(lang);
        if (voice) utterance.voice = voice;
        window.speechSynthesis.speak(utterance);
      }, { once: true });
      // Edge case: voiceschanged may never fire; speak anyway
      setTimeout(() => {
        if (!window.speechSynthesis.speaking) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = lang === "ar" ? "ar-SA" : "en-US";
          utterance.rate = 0.85;
          const voice = getBestVoice(lang);
          if (voice) utterance.voice = voice;
          window.speechSynthesis.speak(utterance);
        }
      }, 300);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "ar" ? "ar-SA" : "en-US";
    utterance.rate = 0.85;
    utterance.pitch = 1;
    const voice = getBestVoice(lang);
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  }

  function stop() {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
  }

  return { speak, stop };
}
