import type { TilePiece, TileSlot } from "../components/TilePuzzle";

export interface ArchitectStage {
  id: string;
  title: string;
  subtitle: string;
  era: string;
  eraIcon: string;
  icon: string;
  puzzleType?: "symmetry" | "tesselation";
  /** symmetry: Left half pattern (rows x halfCols) — 1-indexed color IDs */
  pattern?: number[][];
  /** Color palette for this era */
  palette?: string[];
  /** # of prefilled cells as hints */
  hints?: number;
  gridSize?: number;
  /** tesselation: pieces and slots */
  tiles?: TilePiece[];
  tileSlots?: TileSlot[];
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

  // ======== Umayyad (الأموي) ========
  {
    id: "umayyad-2",
    title: "قبة الصخرة",
    subtitle: "القبة الذهبية المباركة",
    era: "العصر الأموي",
    eraIcon: "🏛️",
    icon: "🌟",
    gridSize: 6,
    palette: [PALE_GOLD, DEEP_BLUE, WHITE],
    hints: 3,
    pattern: [
      [1, 1, 0], [1, 0, 1], [0, 1, 0],
      [0, 1, 0], [1, 0, 1], [1, 1, 0],
    ],
    info: {
      title: "قبة الصخرة",
      content: "بُنيت قبة الصخرة في القدس عام 691م بأمر من الخليفة عبد الملك بن مروان. وهي من أقدم المعالم الإسلامية، وتتميز بقبتها الذهبية وزخارفها الفسيفسائية الرائعة داخل البناء.",
    },
  },
  {
    id: "umayyad-3",
    title: "قوس المحراب",
    subtitle: "الأقواس الدائرية الأموية",
    era: "العصر الأموي",
    eraIcon: "🏛️",
    icon: "🏗️",
    gridSize: 6,
    palette: [PALE_GOLD, DEEP_BLUE, WHITE],
    hints: 3,
    pattern: [
      [1, 0, 1], [0, 1, 2], [0, 1, 2],
      [0, 1, 2], [0, 1, 2], [1, 0, 1],
    ],
    info: {
      title: "المحراب",
      content: "المحراب هو مكان إمامة الصلاة في المسجد. أول محراب في الإسلام أضافه الخليفة عثمان بن عفان، لكنه تطور في العصر الأموي ليصبح عنصراً معمارياً مزخرفاً يحدد اتجاه القبلة.",
    },
  },

  // ======== Abbasid (العباسي) ========
  {
    id: "abbasid-1",
    title: "مئذنة الملوية",
    subtitle: "المئذنة الحلزونية الفريدة",
    era: "العصر العباسي",
    eraIcon: "🏺",
    icon: "🕌",
    gridSize: 6,
    palette: [RUST, PALE_GOLD, WHITE],
    hints: 3,
    pattern: [
      [2, 2, 2], [2, 1, 2], [2, 1, 2],
      [2, 1, 2], [2, 1, 2], [2, 2, 2],
    ],
    info: {
      title: "مئذنة الملوية",
      content: "مئذنة الملوية في سامراء (العراق) بُنيت عام 852م في العصر العباسي. يبلغ ارتفاعها 52 متراً، وتتميز بشكلها الحلزوني الفريد الذي لا مثيل له في العالم. كانت جزءاً من مسجد سامراء الكبير.",
    },
  },
  {
    id: "abbasid-2",
    title: "زخارف الطوب",
    subtitle: "الخط الكوفي الهندسي",
    era: "العصر العباسي",
    eraIcon: "🏺",
    icon: "🔲",
    gridSize: 6,
    palette: [RUST, PALE_GOLD, WHITE],
    hints: 4,
    pattern: [
      [1, 0, 0], [1, 1, 0], [1, 1, 1],
      [1, 1, 1], [1, 1, 0], [1, 0, 0],
    ],
    info: {
      title: "الخط الكوفي الهندسي",
      content: "الخط الكوفي هو أقدم نوع من الخط العربي، ظهر في العصر العباسي. استخدم في زخرفة المساجد والقصور، وتميز بأشكاله الهندسية المنتظمة التي تتناغم مع فنون العمارة الإسلامية.",
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
  { key: "andalus", label: "الأندلس", icon: "🌺" },
  { key: "ottoman", label: "العصر العثماني", icon: "🗡️" },
];

export const TOTAL_ARCHITECT_STAGES = architectStages.length;
