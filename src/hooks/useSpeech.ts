export function useSpeech() {
  function speak(text: string, lang: "ar" | "en") {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "ar" ? "ar-SA" : "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }

  function stop() {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
  }

  return { speak, stop };
}
