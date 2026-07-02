import { useState, useCallback, useMemo, type ReactNode } from "react";
import { stages as stagesAr } from "../data/stages.ar";
import { stages as stagesEn } from "../data/stages.en";
import { ar } from "./ar";
import { en } from "./en";
import { LanguageContext } from "./LanguageContext";
import type { Lang } from "../types";

const STORAGE_KEY = "islamic-quest-lang";

function loadLang(): Lang {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "ar" || v === "en") return v;
  } catch { /* ignore */ }
  return "ar";
}

function saveLang(l: Lang) {
  try { localStorage.setItem(STORAGE_KEY, l); } catch { /* ignore */ }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(loadLang);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    saveLang(l);
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
  }, []);

  const value = useMemo(() => ({
    lang,
    setLang,
    t: lang === "ar" ? ar : en,
    dir: lang === "ar" ? "rtl" as const : "ltr" as const,
    stages: lang === "ar" ? stagesAr : stagesEn,
  }), [lang, setLang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
