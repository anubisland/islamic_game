import type { Achievement } from "../types";

export const achievements: Achievement[] = [
  {
    id: "first-step",
    title: "الخطوة الأولى",
    description: "أكمل أول مرحلة في اللعبة",
    icon: "👣",
  },
  {
    id: "knowledge-seeker",
    title: "طالب العلم",
    description: "أكمل 3 مراحل",
    icon: "📚",
  },
  {
    id: "faith-journey",
    title: "رحلة الإيمان",
    description: "أكمل جميع المراحل",
    icon: "🕌",
  },
  {
    id: "golden-star",
    title: "النجمة الذهبية",
    description: "احصل على 3 نجوم في أي مرحلة",
    icon: "⭐",
  },
  {
    id: "perfectionist",
    title: "الكمال",
    description: "احصل على 3 نجوم في جميع المراحل",
    icon: "💎",
  },
  {
    id: "full-score",
    title: "الدرجة الكاملة",
    description: "أجب على جميع الأسئلة بشكل صحيح في مرحلة واحدة",
    icon: "🎯",
  },
  {
    id: "faqih",
    title: "الفقيه",
    description: "أكمل مرحلة الفقه والعبادات",
    icon: "📜",
    stageId: "fiqh",
  },
  {
    id: "dhaakir",
    title: "الذاكر",
    description: "أكمل مرحلة الأذكار والأدعية",
    icon: "🕊️",
    stageId: "adhkar",
  },
  {
    id: "muhaddith",
    title: "المحدث",
    description: "أكمل مرحلة الحديث النبوي",
    icon: "📗",
    stageId: "hadith",
  },
  {
    id: "saaim",
    title: "الصائم",
    description: "أكمل مرحلة رمضان والصيام",
    icon: "🌙",
    stageId: "ramadan",
  },
  {
    id: "haajj",
    title: "الحاج",
    description: "أكمل مرحلة الحج والعمرة",
    icon: "🕋",
    stageId: "hajj",
  },
  {
    id: "miraji",
    title: "المعارجي",
    description: "أكمل مرحلة الإسراء والمعراج",
    icon: "🐎",
    stageId: "isra-wal-miraj",
  },
  {
    id: "raashid",
    title: "الراشدي",
    description: "أكمل مرحلة الخلفاء الراشدون",
    icon: "⚔️",
    stageId: "khulafa",
  },
];

export function checkAchievements(
  completedStages: number,
  totalStages: number,
  stageStars: Record<string, number>,
  completedStageIds: string[] = [],
): string[] {
  const earned: string[] = [];
  const allStarCounts = Object.values(stageStars);

  if (completedStages >= 1) earned.push("first-step");
  if (completedStages >= 3) earned.push("knowledge-seeker");
  if (completedStages >= totalStages) earned.push("faith-journey");
  if (allStarCounts.some((s) => s >= 3)) earned.push("golden-star");
  if (allStarCounts.length === totalStages && allStarCounts.every((s) => s >= 3)) {
    earned.push("perfectionist");
  }

  if (completedStageIds.includes("fiqh")) earned.push("faqih");
  if (completedStageIds.includes("adhkar")) earned.push("dhaakir");
  if (completedStageIds.includes("hadith")) earned.push("muhaddith");
  if (completedStageIds.includes("ramadan")) earned.push("saaim");
  if (completedStageIds.includes("hajj")) earned.push("haajj");
  if (completedStageIds.includes("isra-wal-miraj")) earned.push("miraji");
  if (completedStageIds.includes("khulafa")) earned.push("raashid");

  return earned;
}
