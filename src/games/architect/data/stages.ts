import type { TilePiece, TileSlot } from "../components/TilePuzzle";
import type { PatternRound } from "../components/PatternMatrixPuzzle";
import type { TransformRound } from "../components/TransformationPuzzle";
import type { MosaicTileData } from "../components/MosaicPuzzle";
import type { ArchData } from "../components/ArchOrderPuzzle";

interface BalanceArch {
  id: string;
  weight: number;
  color: string;
  labelAr: string;
  labelEn: string;
}

export interface ArchitectStage {
  id: string;
  title: string;
  subtitle: string;
  era: string;
  eraIcon: string;
  icon: string;
  puzzleType?: "symmetry" | "tesselation" | "fill" | "archbalance" | "patternmatrix" | "transform" | "mosaic" | "archorder";
  /** symmetry: Left half pattern (rows x halfCols) — 1-indexed color IDs */
  /** fill: Full grid pattern (rows x cols) — 0=empty, >0=prefilled */
  pattern?: number[][];
  /** Color palette for this era */
  palette?: string[];
  /** # of prefilled cells as hints */
  hints?: number;
  gridSize?: number;
  /** fill: Reference pattern shown as overlay (defaults to pattern) */
  reference?: number[][];
  /** tesselation: pieces and slots */
  tiles?: TilePiece[];
  tileSlots?: TileSlot[];
  /** archbalance: arch pieces for balance puzzle */
  arches?: BalanceArch[];
  leftLabel?: string;
  rightLabel?: string;
  /** patternmatrix: pattern rounds */
  rounds?: PatternRound[];
  /** transform: transformation rounds */
  transformRounds?: TransformRound[];
  /** archorder: click arches in ascending order by width */
  archOrderArches?: ArchData[];
  /** mosaic: edge-matching mosaic tiles */
  mosaicData?: { gridSize: number; tiles: MosaicTileData[] };
  /** Info shown after completion */
  info: { title: string; content: string };
}

const PALE_GOLD = "#D4A02B";
const DEEP_BLUE = "#1565C0";
const FOREST = "#2E7D32";
const RUST = "#C62828";
const WHITE = "#ECEFF1";

export const architectStages: ArchitectStage[] = [
  // ======== Umayyad (الأموي) — Tutorial Level ========
  {
    id: "umayyad-1",
    title: "محراب المسجد الأموي",
    subtitle: "النجمة الثمانية الذهبية",
    era: "العصر الأموي",
    eraIcon: "🏛️",
    icon: "✨",
    puzzleType: "tesselation",
    pattern: [
      [1, 0, 0], [0, 1, 0], [0, 0, 1],
      [0, 0, 1], [0, 1, 0], [1, 0, 0],
    ],
    palette: [PALE_GOLD, "#008080", WHITE],
    tiles: [
      { id: "tri-top", shape: "triangle", color: PALE_GOLD, label: "مثلث ذهبي ١", slotId: "slot-top" },
      { id: "tri-left", shape: "triangle", color: PALE_GOLD, label: "مثلث ذهبي ٢", slotId: "slot-left" },
      { id: "tri-right", shape: "triangle", color: PALE_GOLD, label: "مثلث ذهبي ٣", slotId: "slot-right" },
      { id: "dia-ne", shape: "diamond", color: "#008080", label: "معين فيروزي ١", slotId: "slot-ne", initialRotation: 45 },
      { id: "dia-sw", shape: "diamond", color: "#008080", label: "معين فيروزي ٢", slotId: "slot-sw" },
    ],
    tileSlots: [
      { id: "slot-top", x: 50, y: 16, accepts: "triangle", color: PALE_GOLD, correctRotation: 0 },
      { id: "slot-left", x: 16, y: 50, accepts: "triangle", color: PALE_GOLD, correctRotation: 270 },
      { id: "slot-right", x: 84, y: 50, accepts: "triangle", color: PALE_GOLD, correctRotation: 90 },
      { id: "slot-ne", x: 72, y: 28, accepts: "diamond", color: "#008080", correctRotation: 0 },
      { id: "slot-sw", x: 28, y: 72, accepts: "diamond", color: "#008080", correctRotation: 0 },
    ],
    info: {
      title: "الجامع الأموي — محراب دمشق",
      content: "بُني الجامع الأموي في دمشق عام 715م بأمر من الخليفة الوليد بن عبد الملك. يتميز بمحرابه المزين بالفسيفساء الذهبية والنجمة الثمانية الإسلامية التي تزين جدرانه، وتعد من أروع فنون العمارة الإسلامية في العالم.",
    },
  },

  // ======== Umayyad (الأموي) — Mosaic Fill ========
  {
    id: "umayyad-2",
    title: "قبة الصخرة",
    subtitle: "فسيفساء القبة الذهبية",
    era: "العصر الأموي",
    eraIcon: "🏛️",
    icon: "🌟",
    puzzleType: "fill",
    gridSize: 6,
    palette: [PALE_GOLD, DEEP_BLUE, WHITE],
    hints: 4,
    pattern: [
      [0, 0, 2, 2, 0, 0],
      [0, 2, 1, 1, 2, 0],
      [2, 1, 1, 1, 1, 2],
      [2, 1, 1, 1, 1, 2],
      [0, 2, 1, 1, 2, 0],
      [0, 0, 2, 0, 0, 0],
    ],
    info: {
      title: "قبة الصخرة — القدس الشريف",
      content: "بُنيت قبة الصخرة في القدس عام 691م بأمر من الخليفة عبد الملك بن مروان. وهي من أقدم المعالم الإسلامية وأجملها، وتتميز بقبتها الذهبية البالغ ارتفاعها 35 متراً، وزخارفها الفسيفسائية الرائعة التي تزين جدرانها الداخلية والخارجية.",
    },
  },
  {
    id: "umayyad-3",
    title: "قوس المحراب",
    subtitle: "التوازن المعماري",
    era: "العصر الأموي",
    eraIcon: "🏛️",
    icon: "⚖️",
    puzzleType: "archbalance",
    leftLabel: "الجهة اليسرى",
    rightLabel: "الجهة اليمنى",
    arches: [
      { id: "a1", weight: 5, color: PALE_GOLD, labelAr: "قوس ذهبي ثقيل", labelEn: "Heavy gold arch" },
      { id: "a2", weight: 4, color: DEEP_BLUE, labelAr: "قوس أزرق", labelEn: "Blue arch" },
      { id: "a3", weight: 3, color: RUST, labelAr: "قوس أحمر", labelEn: "Red arch" },
      { id: "a4", weight: 3, color: WHITE, labelAr: "قوس أبيض", labelEn: "White arch" },
      { id: "a5", weight: 2, color: FOREST, labelAr: "قوس أخضر", labelEn: "Green arch" },
      { id: "a6", weight: 1, color: PALE_GOLD, labelAr: "قوس ذهبي خفيف", labelEn: "Light gold arch" },
    ],
    info: {
      title: "المحراب — توازن القوسين",
      content: "المحراب هو مكان إمامة الصلاة في المسجد. أول محراب في الإسلام أضافه الخليفة عثمان بن عفان، لكنه تطور في العصر الأموي ليصبح عنصراً معمارياً مزخرفاً. التوازن المعماري هو أحد أسس العمارة الإسلامية، حيث يجب أن يكون الجانبان متساويين في الوزن البصري والهيكلي.",
    },
  },

  // ======== Abbasid (العباسي) ========
  {
    id: "abbasid-1",
    title: "مئذنة الملوية",
    subtitle: "فك شيفرة الزخارف الحلزونية",
    era: "العصر العباسي",
    eraIcon: "🏺",
    icon: "🧩",
    puzzleType: "patternmatrix",
    rounds: [
      {
        difficulty: "سهل",
        grid: [
          [{ color: "#D4A02B", shape: "circle" }, { color: "#1565C0", shape: "square" }, { color: "#C62828", shape: "diamond" }],
          [{ color: "#1565C0", shape: "diamond" }, { color: "#C62828", shape: "circle" }, { color: "#D4A02B", shape: "square" }],
          [{ color: "#C62828", shape: "square" }, { color: "#D4A02B", shape: "diamond" }, null],
        ],
        options: [
          { color: "#1565C0", shape: "circle" },
          { color: "#C62828", shape: "circle" },
          { color: "#D4A02B", shape: "circle" },
          { color: "#1565C0", shape: "square" },
        ],
        correctIndex: 0,
      },
      {
        difficulty: "متوسط",
        grid: [
          [{ color: "#D4A02B", shape: "circle" }, { color: "#1565C0", shape: "diamond" }, { color: "#2E7D32", shape: "triangle" }],
          [{ color: "#1565C0", shape: "triangle" }, { color: "#2E7D32", shape: "circle" }, null],
          [{ color: "#2E7D32", shape: "diamond" }, { color: "#D4A02B", shape: "triangle" }, { color: "#1565C0", shape: "circle" }],
        ],
        options: [
          { color: "#D4A02B", shape: "square" },
          { color: "#1565C0", shape: "square" },
          { color: "#D4A02B", shape: "circle" },
          { color: "#2E7D32", shape: "square" },
        ],
        correctIndex: 3,
      },
      {
        difficulty: "صعب",
        grid: [
          [{ color: "#D4A02B", shape: "triangle" }, { color: "#1565C0", shape: "square" }, { color: "#2E7D32", shape: "circle" }],
          [{ color: "#1565C0", shape: "circle" }, null, { color: "#D4A02B", shape: "square" }],
          [{ color: "#2E7D32", shape: "square" }, { color: "#D4A02B", shape: "circle" }, { color: "#1565C0", shape: "triangle" }],
        ],
        options: [
          { color: "#2E7D32", shape: "triangle" },
          { color: "#1565C0", shape: "triangle" },
          { color: "#D4A02B", shape: "triangle" },
          { color: "#1565C0", shape: "circle" },
        ],
        correctIndex: 2,
      },
    ],
    info: {
      title: "مئذنة الملوية",
      content: "مئذنة الملوية في سامراء (العراق) بُنيت عام 852م في العصر العباسي. يبلغ ارتفاعها 52 متراً، وتتميز بشكلها الحلزوني الفريد الذي لا مثيل له في العالم. كانت جزءاً من مسجد سامراء الكبير. تحتوي زخارفها على أنماط هندسية متكررة تشبه ألغاز المصفوفات المنطقية.",
    },
  },
  {
    id: "abbasid-2",
    title: "زخارف الطوب",
    subtitle: "التدوير الذهني للأنماط",
    era: "العصر العباسي",
    eraIcon: "🏺",
    icon: "🔄",
    puzzleType: "transform",
    palette: [RUST, "#D4A02B", "#1565C0"],
    transformRounds: [
      {
        source: [[1,0,0,1],[0,1,1,0],[0,1,1,0],[1,0,0,1]],
        hintAr: "اختر النمط بعد تدويره 90° باتجاه عقارب الساعة",
        hintEn: "Pick the pattern after 90° clockwise rotation",
        options: [
          [[1,0,0,1],[0,1,1,0],[0,1,1,0],[1,0,0,1]],
          [[1,0,0,0],[0,1,1,0],[0,1,1,0],[1,0,0,1]],
          [[1,0,1,0],[0,1,0,1],[1,0,1,0],[0,1,0,1]],
          [[1,0,1,0],[1,1,0,0],[0,0,1,1],[0,1,0,1]],
        ],
        correctIndex: 2,
      },
      {
        source: [[0,1,0],[1,0,1],[0,1,0]],
        hintAr: "اختر النمط بعد انعكاس أفقي (مرآة يسار←يمين)",
        hintEn: "Pick the pattern after horizontal reflection",
        options: [
          [[0,1,0],[1,0,1],[0,1,0]],
          [[0,1,0],[0,1,0],[0,1,0]],
          [[1,0,1],[0,1,0],[1,0,1]],
          [[0,1,0],[0,1,0],[1,0,1]],
        ],
        correctIndex: 0,
      },
      {
        source: [[1,1,0,0],[1,0,0,1],[0,0,1,1],[0,1,1,0]],
        hintAr: "اختر النمط بعد تدويره 180°",
        hintEn: "Pick the pattern after 180° rotation",
        options: [
          [[1,1,0,0],[1,0,0,1],[0,0,1,1],[0,1,1,0]],
          [[0,1,1,0],[1,1,0,0],[0,0,1,1],[1,0,0,1]],
          [[0,1,1,0],[1,1,0,0],[1,0,0,1],[0,0,1,1]],
          [[0,1,1,0],[0,0,1,1],[1,0,0,1],[1,1,0,0]],
        ],
        correctIndex: 3,
      },
    ],
    info: {
      title: "الخط الكوفي الهندسي",
      content: "الخط الكوفي هو أقدم نوع من الخط العربي، ظهر في العصر العباسي. استخدم في زخرفة المساجد والقصور، وتميز بأشكاله الهندسية المنتظمة التي تتناغم مع فنون العمارة الإسلامية. التدوير والانعكاس هما من أساسيات الزخرفة الهندسية الإسلامية.",
    },
  },
  {
    id: "abbasid-3",
    title: "قصر الأخيضر",
    subtitle: "الحصن العباسي المنيع",
    era: "العصر العباسي",
    eraIcon: "🏺",
    icon: "🏰",
    gridSize: 6,
    palette: [RUST, PALE_GOLD, WHITE],
    hints: 3,
    pattern: [
      [2, 2, 0], [2, 1, 0], [2, 1, 0],
      [2, 1, 0], [2, 1, 0], [2, 2, 0],
    ],
    info: {
      title: "قصر الأخيضر",
      content: "قصر الأخيضر في كربلاء (العراق) من أروع القصور العباسية المحصنة، بُني في القرن الثامن الميلادي. يتميز بأسواره العالية وأقواسه الضخمة، ويعكس عبقرية الهندسة المعمارية الإسلامية في التحصينات.",
    },
  },

  // ======== Mamluk (المملوكي) ========
  {
    id: "mamluk-1",
    title: "فسيفساء السلطان",
    subtitle: "تطابق الحواف — الزليج المملوكي",
    era: "العصر المملوكي",
    eraIcon: "🕌",
    icon: "🔷",
    puzzleType: "mosaic",
    palette: ["#C62828", "#D4A02B", "#1565C0"],
    mosaicData: {
      gridSize: 3,
      tiles: [
        { id: "t0", edges: [0, 1, 2, 0] },
        { id: "t1", edges: [0, 2, 3, 1] },
        { id: "t2", edges: [0, 0, 1, 2] },
        { id: "t3", edges: [2, 3, 1, 0] },
        { id: "t4", edges: [3, 1, 2, 3] },
        { id: "t5", edges: [1, 0, 3, 1] },
        { id: "t6", edges: [1, 2, 0, 0] },
        { id: "t7", edges: [2, 3, 0, 2] },
        { id: "t8", edges: [3, 0, 0, 3] },
      ],
    },
    info: {
      title: "الزليج المملوكي",
      content: "الزليج هو فن الفسيفساء الهندسية الذي ازدهر في العصر المملوكي (1250-1517م). استخدم في تزيين المساجد والمدارس والقصور، واشتهرت به دمشق والقاهرة. يتميز الزليج المملوكي بألوانه الزاهية (الأحمر والأزرق والذهبي) وأشكاله الهندسية الدقيقة التي تعكس عمق الفن الإسلامي.",
    },
  },
  {
    id: "mamluk-2",
    title: "أقواس المدرسة",
    subtitle: "ترتيب الأقواس حسب العرض",
    era: "العصر المملوكي",
    eraIcon: "🕌",
    icon: "🏗️",
    puzzleType: "archorder",
    palette: ["#C62828", "#D4A02B", "#1565C0", "#2E7D32", "#008080", "#6A1B9A"],
    archOrderArches: [
      { id: "a1", width: 1, color: "#D4A02B", order: 1, labelAr: "قوس ضيق ذهبي", labelEn: "Narrow gold arch" },
      { id: "a2", width: 2, color: "#1565C0", order: 2, labelAr: "قوس أزرق معتدل", labelEn: "Moderate blue arch" },
      { id: "a3", width: 3, color: "#2E7D32", order: 3, labelAr: "قوس أخضر متوسط", labelEn: "Medium green arch" },
      { id: "a4", width: 4, color: "#C62828", order: 4, labelAr: "قوس أحمر عريض", labelEn: "Wide red arch" },
      { id: "a5", width: 5, color: "#008080", order: 5, labelAr: "قوس فيروزي أوسع", labelEn: "Wider teal arch" },
      { id: "a6", width: 6, color: "#6A1B9A", order: 6, labelAr: "قوس أرجواني عريض جداً", labelEn: "Widest purple arch" },
    ],
    info: {
      title: "المدرسة المملوكية",
      content: "المدارس المملوكية في القاهرة من أجمل نماذج العمارة الإسلامية، تميزت بأقواسها المتنوعة والأسوار المزخرفة. اشتهر العصر المملوكي ببناء المدارس التي تضم مسجداً ومكتبة وغرفاً للطلاب. من أشهرها مدرسة السلطان حسن ومدرسة قلاوون التي ما زالت شامخة حتى اليوم.",
    },
  },

  // ======== Andalusia (الأندلس) ========
  {
    id: "andalus-1",
    title: "محراب قرطبة",
    subtitle: "قوس الحذوة الأندلسي",
    era: "الأندلس",
    eraIcon: "🌺",
    icon: "🎨",
    gridSize: 6,
    palette: [PALE_GOLD, FOREST, WHITE],
    hints: 3,
    pattern: [
      [0, 0, 1], [0, 1, 2], [0, 1, 2],
      [0, 1, 2], [0, 1, 2], [0, 0, 1],
    ],
    info: {
      title: "مسجد قرطبة",
      content: "جامع قرطبة (الأندلس/إسبانيا) من روائع العمارة الإسلامية، بُني في القرن الثامن. يتميز بأقواسه الحذوية (Horseshoe arches) ذات اللونين الأبيض والأحمر، ومحرابه المزخرف بالفسيفساء الذهبية.",
    },
  },
  {
    id: "andalus-2",
    title: "زخارف قصر الحمراء",
    subtitle: "الزخارف النباتية المعقدة",
    era: "الأندلس",
    eraIcon: "🌺",
    icon: "🏛️",
    gridSize: 6,
    palette: [PALE_GOLD, FOREST, WHITE],
    hints: 3,
    pattern: [
      [2, 1, 0], [2, 2, 1], [2, 1, 0],
      [2, 1, 0], [2, 2, 1], [2, 1, 0],
    ],
    info: {
      title: "قصر الحمراء",
      content: "قصر الحمراء في غرناطة (إسبانيا) تحفة معمارية إسلامية فريدة. يتميز بزخارفه النباتية والهندسية المعقدة المنحوتة في الجص، ونقوشه القرآنية، وفسيفسائه الملونة التي تزين الجدران والأسقف.",
    },
  },
  {
    id: "andalus-3",
    title: "شرفات الأسود",
    subtitle: "نافورة الأسود الشهيرة",
    era: "الأندلس",
    eraIcon: "🌺",
    icon: "🦁",
    gridSize: 6,
    palette: [PALE_GOLD, FOREST, WHITE],
    hints: 4,
    pattern: [
      [1, 0, 0], [0, 2, 0], [1, 0, 1],
      [0, 2, 0], [1, 0, 1], [1, 1, 0],
    ],
    info: {
      title: "نافورة الأسود",
      content: "نافورة الأسود في قصر الحمراء من أشهر معالم الأندلس. تتوسط بهو الأسود (Patio de los Leones)، وتحملها 12 تمثالاً لأسود من الرخام. ترمز إلى القوة والجمال في الفن الإسلامي الأندلسي.",
    },
  },

  // ======== Ottoman (العثماني) ========
  {
    id: "ottoman-1",
    title: "قبة المسجد الأزرق",
    subtitle: "القباب المتداخلة المهيبة",
    era: "العصر العثماني",
    eraIcon: "🗡️",
    icon: "🔵",
    gridSize: 6,
    palette: [DEEP_BLUE, PALE_GOLD, WHITE],
    hints: 3,
    pattern: [
      [1, 1, 1], [1, 2, 1], [0, 1, 0],
      [0, 1, 0], [1, 2, 1], [1, 1, 1],
    ],
    info: {
      title: "المسجد الأزرق",
      content: "الجامع الأزرق (جامع السلطان أحمد) في إسطنبول بُني عام 1616م. سمي بالأزرق لاحتوائه على أكثر من 20 ألف بلاطة خزفية زرقاء اللون. يتميز بقبته الكبيرة المتداخلة ومآذنه الست التي صارت رمزاً للمدينة.",
    },
  },
  {
    id: "ottoman-2",
    title: "مئذنة السلطان",
    subtitle: "مآذن إسطنبول الشامخة",
    era: "العصر العثماني",
    eraIcon: "🗡️",
    icon: "🗼",
    gridSize: 6,
    palette: [DEEP_BLUE, PALE_GOLD, WHITE],
    hints: 3,
    pattern: [
      [0, 0, 1], [0, 1, 1], [1, 1, 0],
      [1, 1, 0], [0, 1, 1], [0, 0, 1],
    ],
    info: {
      title: "المآذن العثمانية",
      content: "المآذن العثمانية تتميز بشكلها الرفيع كقلم الرصاص، وتنتهي بمخروط حاد. جامع السلطان أحمد يمتلك 6 مآذن، وهي ميزة فريدة بين مساجد إسطنبول. يبلغ ارتفاع كل مئذنة 64 متراً.",
    },
  },
  {
    id: "ottoman-3",
    title: "تاج محل",
    subtitle: "لؤلؤة العمارة المغولية الإسلامية",
    era: "العصر العثماني",
    eraIcon: "🗡️",
    icon: "💎",
    gridSize: 6,
    palette: [DEEP_BLUE, PALE_GOLD, WHITE],
    hints: 4,
    pattern: [
      [1, 0, 0], [1, 2, 0], [1, 2, 0],
      [1, 2, 0], [1, 2, 0], [1, 0, 0],
    ],
    info: {
      title: "تاج محل",
      content: "تاج محل في أغرا (الهند) بُني بين 1631-1648 بأمر من الإمبراطور شاه جهان. يجمع بين العمارة الإسلامية والفارسية والهندية. يتميز بقبته الرخامية البيضاء الهائلة وتناسقه الهندسي المثالي.",
    },
  },
];

export const ARCHITECT_ERA_ORDER = [
  { key: "umayyad", label: "العصر الأموي", icon: "🏛️" },
  { key: "abbasid", label: "العصر العباسي", icon: "🏺" },
  { key: "mamluk", label: "العصر المملوكي", icon: "🕌" },
  { key: "andalus", label: "الأندلس", icon: "🌺" },
  { key: "ottoman", label: "العصر العثماني", icon: "🗡️" },
];

export const TOTAL_ARCHITECT_STAGES = architectStages.length;
