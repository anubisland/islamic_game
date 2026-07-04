# AGENTS.md — islamic_game

منصة ألعاب إسلامية تعليمية — React + TypeScript + Vite.

## State

- **React 19 + TypeScript 6 + Vite 8** — `vite.config.ts` at root
- Two games in the hub:
  - **رحلة الإيمان** — 15 مرحلة تعليمية (أسئلة متعددة الخيارات)
  - **المهندس المسلم** — 12 لغزاً هندسياً (تناظر، فسيفساء، تعبئة، توازن، مصفوفات، تحويل)
  - قالب future game جاهز في GameHub
- i18n: عربي / English (language toggle EN/AR in header)
- Deploy: GitHub Actions (`.github/workflows/pages.yml`) → push to `main` branch triggers auto build+deploy to Pages
- No CI, no test framework currently

## File layout (key paths)

```
src/
  App.tsx                     ← routing state machine (screens)
  main.tsx                    ← entry point
  pages/
    GameHub.tsx                ← main screen (pick a game)
    HomePage.tsx               ← faith-journey home
    StagePage.tsx              ← Q&A stage view
  games/architect/
    pages/
      ArchitectHome.tsx        ← architect game hub (era filters + puzzle grid)
      PuzzlePage.tsx           ← dispatches to puzzle component by puzzleType
    components/
      TilePuzzle.tsx           ← puzzleType: "tesselation"
      FillPuzzle.tsx           ← puzzleType: "fill"
      SymmetryPuzzle.tsx       ← default puzzleType (symmetry)
      ArchBalancePuzzle.tsx    ← puzzleType: "archbalance"
      ArchOrderPuzzle.tsx      ← written but NOT wired into any stage
      PatternMatrixPuzzle.tsx  ← puzzleType: "patternmatrix"
      SpiralAscentPuzzle.tsx   ← written but NOT wired into any stage
      TransformationPuzzle.tsx ← puzzleType: "transform"
    data/stages.ts             ← 12 stages across 4 eras (Umayyad, Abbasid, Andalusia, Ottoman)
  i18n/                        ← LanguageProvider, useTranslation, ar.ts, en.ts
  components/                  ← Header, Leaderboard, StageCard, AchievementBadge
  hooks/                       ← useProgress, useSound, useTheme
  utils/                       ← storage, stats, leaderboard, shuffle, dailyQuiz, quickQuiz
  data/                        ← stages.ar.ts, stages.en.ts, achievements.ts, stages.ts
```

## Commands

```bash
npm run dev       # Vite dev server
npm run build     # tsc -b && vite build
npm run lint      # eslint .
npm run format    # prettier --write "src/**/*.{ts,tsx,css}"
npm run preview   # vite preview
npm run deploy    # DEPRECATED — push to `main` instead (triggers GitHub Actions)
```

## Architecture notes

- `App.tsx` is a state machine over `Screen` type — each screen renders a page.
- Routing is NOT react-router; it's a simple `useState<Screen>` pattern.
- GameHub renders two `GameCard`s and routes to `faith-journey` or `architect`.
- **المهندس المسلم**: PuzzlePage reads `stage.puzzleType` and picks the component.
  - Add a new puzzle type: create component, add case in PuzzlePage, add data in stages.ts.
- Stages data is in `src/games/architect/data/stages.ts`.
  - Each stage has `puzzleType`, `pattern`, `palette`, and type-specific fields.
- i18n: `useTranslation()` → `{ t, lang, setLang, dir }`.
  - All text lives in `src/i18n/ar.ts` / `en.ts`.

## Currently unused / incomplete

- `ArchOrderPuzzle` component exists but no stage uses `puzzleType: "archorder"`.
- `SpiralAscentPuzzle` component exists but no stage uses `puzzleType: "spiral"`.
- `completedPuzzles` and `puzzleStars` passed as `{}` to ArchitectHome (not persisted yet).

## Conventions

- CSS: inline styles + CSS variables (`--green-primary`, `--card-bg`, etc.)
- Avoid adding new npm deps unless necessary
- All new strings must go in both `src/i18n/ar.ts` and `src/i18n/en.ts`
- Stages are ordered by era in `architectStages` array
