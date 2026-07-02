import type { Stage } from "../types";
import { stages as stagesAr } from "./stages.ar";
import { stages as stagesEn } from "./stages.en";

export { stagesAr, stagesEn };

export const stages: Stage[] = stagesAr;

export function getStagesByLang(lang: string): Stage[] {
  return lang === "en" ? stagesEn : stagesAr;
}
