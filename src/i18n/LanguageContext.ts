import { createContext } from "react";
import type { Stage, Lang } from "../types";
import type { ar } from "./ar";

export interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: typeof ar;
  dir: "rtl" | "ltr";
  stages: Stage[];
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);
