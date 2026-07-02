import { useCallback, useRef } from "react";

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

function playTone(freq: number, duration: number, type: OscillatorType = "sine", volume = 0.15) {
  try {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, c.currentTime);
    gain.gain.setValueAtTime(volume, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + duration);
  } catch {
    /* audio not supported */
  }
}

function playSequence(notes: [number, number, OscillatorType?][], baseDelay = 0) {
  notes.forEach(([freq, dur, type], i) => {
    setTimeout(() => playTone(freq, dur, type ?? "sine"), baseDelay + i * (dur * 1000 + 40));
  });
}

export function useSound() {
  const enabledRef = useRef(true);

  const click = useCallback(() => {
    if (!enabledRef.current) return;
    playTone(800, 0.05, "square", 0.03);
  }, []);

  const correct = useCallback(() => {
    if (!enabledRef.current) return;
    playSequence([
      [523, 0.15, "sine"],
      [659, 0.25, "sine"],
    ]);
  }, []);

  const wrong = useCallback(() => {
    if (!enabledRef.current) return;
    playSequence([
      [330, 0.2, "sine"],
      [262, 0.3, "sine"],
    ]);
  }, []);

  const achievement = useCallback(() => {
    if (!enabledRef.current) return;
    playSequence([
      [523, 0.12, "sine"],
      [659, 0.12, "sine"],
      [784, 0.35, "sine"],
    ]);
  }, []);

  const complete = useCallback(() => {
    if (!enabledRef.current) return;
    playSequence([
      [523, 0.12, "sine"],
      [659, 0.12, "sine"],
      [784, 0.12, "sine"],
      [1047, 0.4, "sine"],
    ]);
  }, []);

  return { click, correct, wrong, achievement, complete, enabledRef };
}
