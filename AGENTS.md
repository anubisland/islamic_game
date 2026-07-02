# AGENTS.md — islamic_game

لعبة "رحلة الإيمان" — لعبة ويب تعليمية إسلامية متعددة المراحل.

## هيكل المشروع

```
src/
├── main.tsx          — نقطة الدخول
├── App.tsx           — التوجيه بين الشاشات (الرئيسية ← المرحلة)
├── index.css         — المتغيرات والأسس
├── types/index.ts    — الأنواع: Stage, Question, GameProgress
├── data/stages.ts    — محتوى المراحل الـ 5 (دروس + أسئلة)
├── hooks/useProgress — إدارة التقدم (localStorage)
├── components/       — Header, StageCard
└── pages/            — HomePage, StagePage
```

## الأوامر

| الأمر | الوصف |
|-------|-------|
| `npm run dev` | تشغيل خادم التطوير (Vite) |
| `npm run build` | بناء الإصدار النهائي (tsc + vite build) |
| `npm run preview` | معاينة البناء النهائي محلياً |
| `npm run lint` | فحص الكود (ESLint) |
| `npm run format` | تنسيق الكود (Prettier) |

## المكدس التقني

- **Vite** + **React 19** + **TypeScript** (build tool / UI / language)
- **localStorage** — حفظ التقدم (بدون backend)
- **RTL** — الاتجاه من اليمين لليسار (Arabic-first)
- **ESLint** + **Prettier** — فحص وتنسيق الكود

## قواعد التطوير

- كل المحتوى مكتوب مسبقاً في `src/data/stages.ts` — عند إضافة مرحلة جديدة، أضف كائن `Stage` للمصفوفة
- النظام متصل: لا يُفتح المستوى التالي إلا بإكمال السابق
- النجوم: ≥90% = 3 نجوم، ≥60% = 2، >0% = 1
- التخزين المحلي تحت المفتاح `islamic-quest-progress`
- لا موسيقى، لا صور ذوات أرواح، لا عناصر قمار
- أضف اختبارات `vitest` عند إضافة منطق جديد
