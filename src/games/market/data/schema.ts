export interface LangStr {
  ar: string;
  en: string;
}

// === GOODS (بضائع) ===
export interface Good {
  id: string;
  name: LangStr;
  icon: string;
  baseCost: number;       // base buy price per unit
  baseSellPrice: number;  // base sell price per unit
  volatility: number;     // price fluctuation factor (0-1)
  season: "all" | "summer" | "winter";
  category: "food" | "cloth" | "luxury" | "raw";
  zakatable: boolean;     // subject to zakat?
}

export const GOODS: Good[] = [
  { id: "dates",    name: { ar: "تمر", en: "Dates" },        icon: "🌴", baseCost: 3,  baseSellPrice: 5,  volatility: 0.2, season: "all",    category: "food",  zakatable: true },
  { id: "wheat",    name: { ar: "قمح", en: "Wheat" },        icon: "🌾", baseCost: 2,  baseSellPrice: 4,  volatility: 0.3, season: "summer", category: "food",  zakatable: true },
  { id: "olive",    name: { ar: "زيت زيتون", en: "Olive Oil" }, icon: "🫒", baseCost: 5,  baseSellPrice: 8,  volatility: 0.15, season: "winter", category: "food",  zakatable: true },
  { id: "cloth",    name: { ar: "قماش حرير", en: "Silk Cloth" }, icon: "🧵", baseCost: 10, baseSellPrice: 16, volatility: 0.25, season: "all",    category: "cloth", zakatable: true },
  { id: "wool",     name: { ar: "صوف", en: "Wool" },         icon: "🐑", baseCost: 4,  baseSellPrice: 7,  volatility: 0.2,  season: "winter", category: "cloth", zakatable: true },
  { id: "perfume",  name: { ar: "عطر", en: "Perfume" },      icon: "🧴", baseCost: 15, baseSellPrice: 25, volatility: 0.35, season: "all",    category: "luxury", zakatable: true },
  { id: "spices",   name: { ar: "بهارات", en: "Spices" },    icon: "🌶️", baseCost: 8,  baseSellPrice: 14, volatility: 0.4,  season: "all",    category: "luxury", zakatable: true },
  { id: "iron",     name: { ar: "حديد", en: "Iron" },        icon: "⚒️", baseCost: 6,  baseSellPrice: 10, volatility: 0.15, season: "all",    category: "raw",   zakatable: false },
];

// === CUSTOMER PROFILES ===
export interface CustomerProfile {
  id: string;
  name: LangStr;
  icon: string;
  patience: number;     // how many turns before leaving
  priceSensitivity: number; // 0-1: 0 = pays anything, 1 = very picky
  requestCount: number;  // how many items they want
}

export const CUSTOMERS: CustomerProfile[] = [
  { id: "elder",   name: { ar: "شيخ كبير", en: "Elder" },       icon: "🧓", patience: 5, priceSensitivity: 0.3, requestCount: 1 },
  { id: "trader",  name: { ar: "تاجر قادم", en: "Visiting Merchant" }, icon: "🧕", patience: 3, priceSensitivity: 0.7, requestCount: 3 },
  { id: "woman",   name: { ar: "امرأة", en: "Woman" },          icon: "👩", patience: 4, priceSensitivity: 0.5, requestCount: 1 },
  { id: "youth",   name: { ar: "شاب", en: "Youth" },            icon: "🧑", patience: 2, priceSensitivity: 0.8, requestCount: 2 },
  { id: "bedouin", name: { ar: "بدوي", en: "Bedouin" },         icon: "🧕", patience: 6, priceSensitivity: 0.2, requestCount: 1 },
];

// === CARAVANS (قوافل) ===
export interface CaravanOffer {
  goodId: string;
  quantity: number;
  unitPrice: number;      // negotiated price
  risk: "safe" | "delayed" | "perishable";
}

export interface Caravan {
  origin: LangStr;
  icon: string;
  offers: CaravanOffer[];
  profitShare: number;    // % they take (mudaraba)
}

// === ETHICAL EVENTS (أحداث أخلاقية) ===
export interface EventChoice {
  text: LangStr;
  effect: {
    gold: number;         // immediate gold change
    barakah: number;      // barakah/reputation change (-10 to +10)
    description: LangStr; // what happens after
  };
}

export interface MarketEvent {
  id: string;
  title: LangStr;
  description: LangStr;
  choices: [EventChoice, EventChoice, EventChoice?]; // 2-3 choices
}

export const MARKET_EVENTS: MarketEvent[] = [
  {
    id: "spoiled-dates",
    title: { ar: "تمر فاسد", en: "Spoiled Dates" },
    description: {
      ar: "وجدت أن بعض التمر في أسفل الصندوق أصابه البلل بسبب المطر. ماذا تفعل؟",
      en: "You found that some dates at the bottom of the crate got wet from rain. What do you do?",
    },
    choices: [
      {
        text: { ar: "خلطه وبيعه كالمعتاد", en: "Mix and sell as usual" },
        effect: {
          gold: 30, barakah: -8,
          description: { ar: "كسبت مالاً سريعاً لكن العملاء اشتكوا وسمعتك تضررت.", en: "Quick profit but customers complained and your reputation suffered." },
        },
      },
      {
        text: { ar: "فصل التمر الفاسد وبيع الجيد فقط", en: "Separate spoiled ones, sell only good" },
        effect: {
          gold: -10, barakah: 5,
          description: { ar: "خسرت بعض المال لكن العملاء أثنوا على أمانتك.", en: "Lost some money but customers praised your honesty." },
        },
      },
    ],
  },
  {
    id: "hoarding",
    title: { ar: "احتكار القمح", en: "Wheat Hoarding" },
    description: {
      ar: "هناك شح في القمح بالسوق. يمكنك شراء كل القمح المتوفر وبيعه بسعر مضاعف.",
      en: "There's a wheat shortage. You could buy all available wheat and sell at double price.",
    },
    choices: [
      {
        text: { ar: "احتكار القمح لرفع السعر", en: "Hoard wheat to raise price" },
        effect: {
          gold: 100, barakah: -12,
          description: { ar: "ربحت كثيراً لكن المحتسب فرض عليك غرامة والمتسوقون غاضبون.", en: "Big profit but the inspector fined you and shoppers are angry." },
        },
      },
      {
        text: { ar: "البيع بسعر عادل للمحتاجين", en: "Sell at fair price to those in need" },
        effect: {
          gold: -20, barakah: 10,
          description: { ar: "ربحك قليل لكن الجميع يدعو لك بالبركة.", en: "Low profit but everyone prays for barakah upon you." },
        },
      },
    ],
  },
  {
    id: "false-weights",
    title: { ar: "ميزان ناقص", en: "False Scale" },
    description: {
      ar: "وجدت أن الميزان الذي اشتريته حديثاً يعطي وزناً أقل من الحقيقي. ماذا تفعل؟",
      en: "You discovered your new scale gives less weight than actual. What do you do?",
    },
    choices: [
      {
        text: { ar: "استخدامه كما هو، المشتري لا يدري", en: "Use it as is, the buyer won't know" },
        effect: {
          gold: 50, barakah: -10,
          description: { ar: "ربح إضافي لكن وزع增长了 غضب الله.", en: "Extra profit but you incurred Allah's displeasure." },
        },
      },
      {
        text: { ar: "إصلاح الميزان فوراً", en: "Fix the scale immediately" },
        effect: {
          gold: -15, barakah: 8,
          description: { ar: "أنفقت على الإصلاح لكن الجميع عرف بأمانتك.", en: "Spent on repairs but everyone knows your honesty." },
        },
      },
    ],
  },
  {
    id: "beggar",
    title: { ar: "سائل محتاج", en: "A Needy Beggar" },
    description: {
      ar: "جاء رجل فقير يطلب المساعدة، يقول إن أطفاله جياع.",
      en: "A poor man comes asking for help, saying his children are hungry.",
    },
    choices: [
      {
        text: { ar: "إعطاؤه تمراً ودراهم", en: "Give him dates and coins" },
        effect: {
          gold: -10, barakah: 7,
          description: { ar: "دعا لك بالبركة في مالك.", en: "He prayed for barakah in your wealth." },
        },
      },
      {
        text: { ar: "طرده قائلاً تعال غداً", en: "Turn him away, say come tomorrow" },
        effect: {
          gold: 0, barakah: -3,
          description: { ar: "شعرت بالضيق وبعض الزبائن رأوا الموقف.", en: "Felt uneasy and some customers saw the encounter." },
        },
      },
      {
        text: { ar: "توظيفه في دكانك", en: "Hire him in your shop" },
        effect: {
          gold: -5, barakah: 10,
          description: { ar: "أصبح عاملاً أميناً ودعا لك بالتوفيق.", en: "He became a loyal worker and prayed for your success." },
        },
      },
    ],
  },
];

// === STAGES / SHOP EXPANSION LEVELS ===
export interface ShopUpgrade {
  level: number;
  name: LangStr;
  icon: string;
  cost: number;           // gold needed
  minBarakah: number;     // minimum barakah required
  capacity: number;       // max inventory slots
  customerPerTurn: number; // customers per turn
  description: LangStr;
}

export const SHOP_UPGRADES: ShopUpgrade[] = [
  {
    level: 1,
    name: { ar: "دكان صغير", en: "Small Shop" },
    icon: "🏪",
    cost: 0,
    minBarakah: 0,
    capacity: 20,
    customerPerTurn: 2,
    description: { ar: "دكان متواضع في السوق المحلي", en: "A modest shop in the local market" },
  },
  {
    level: 2,
    name: { ar: "دكان متوسط", en: "Medium Shop" },
    icon: "🏬",
    cost: 150,
    minBarakah: 5,
    capacity: 40,
    customerPerTurn: 4,
    description: { ar: "دكان أوسع مع مستودع صغير", en: "A wider shop with a small warehouse" },
  },
  {
    level: 3,
    name: { ar: "تاجر قوافل", en: "Caravan Merchant" },
    icon: "🐪",
    cost: 400,
    minBarakah: 10,
    capacity: 70,
    customerPerTurn: 6,
    description: { ar: "تملك قافلة وتتاجر مع المدن البعيدة", en: "Own a caravan and trade with distant cities" },
  },
  {
    level: 4,
    name: { ar: "وكالة تجارية", en: "Trade Agency" },
    icon: "🏛️",
    cost: 800,
    minBarakah: 15,
    capacity: 120,
    customerPerTurn: 8,
    description: { ar: "وكالة تستورد وتصدر البضائع", en: "An agency importing and exporting goods" },
  },
  {
    level: 5,
    name: { ar: "شاه بندر التجار", en: "Shah Bandar of Merchants" },
    icon: "👑",
    cost: 1500,
    minBarakah: 20,
    capacity: 200,
    customerPerTurn: 12,
    description: { ar: "أكبر تاجر في المدينة، لك قصر وكالة كبيرة", en: "The city's greatest merchant, with a palace and grand agency" },
  },
];

// === ZAKAT CALCULATION ===
export const NISAB_THRESHOLD = 85; // gold coins equivalent (nisab for zakat)
export const ZAKAT_RATE = 0.025;   // 2.5%

// === GENERATED PRICE HELPERS ===
export function getCurrentPrice(good: Good, gameTurn: number, marketFluctuation: number): { buyPrice: number; sellPrice: number } {
  const seasonalFactor = good.season === "summer" ? 0.8 : good.season === "winter" ? 1.2 : 1;
  const fluctuation = 1 + (Math.sin(gameTurn * 0.5 + GOODS.indexOf(good)) * good.volatility * 0.3);
  const randomJitter = 1 + (marketFluctuation - 0.5) * 0.2;
  const buyPrice = Math.round(good.baseCost * seasonalFactor * fluctuation * randomJitter);
  const sellPrice = Math.round(good.baseSellPrice * seasonalFactor * fluctuation * randomJitter * 1.3);
  return { buyPrice, sellPrice };
}

// === PLAYER STATE TYPE ===
export interface PlayerState {
  gold: number;
  barakah: number;
  shopLevel: number;
  inventory: Record<string, number>; // goodId -> quantity
  year: number;
  turn: number;
  totalEarned: number;
  totalCharity: number;
  transactions: TransactionRecord[];
  completedEvents: string[];
}

export interface TransactionRecord {
  turn: number;
  type: "buy" | "sell" | "charity" | "upgrade" | "event" | "zakat";
  goodId?: string;
  quantity?: number;
  unitPrice?: number;
  total: number;
  description: LangStr;
}
