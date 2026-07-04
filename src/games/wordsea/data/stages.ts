export interface LangStr {
  ar: string;
  en: string;
}

export type WordPuzzleType = "word-fill" | "word-match";

export interface WordStage {
  id: string;
  title: LangStr;
  subtitle: LangStr;
  icon: string;
  puzzle: {
    type: WordPuzzleType;
    // word-fill: choose the correct word
    verse?: LangStr;
    options?: LangStr[];
    correctIndex?: number;
    // word-match: match left column to right column
    pairs?: { left: LangStr; right: LangStr }[];
    source?: LangStr;
  };
}

export const wordseaStages: WordStage[] = [
  {
    id: "allah-names",
    title: { ar: "أسماء الله الحسنى", en: "Beautiful Names of Allah" },
    subtitle: { ar: "صل بين الاسم ومعناه", en: "Match each name to its meaning" },
    icon: "🕊️",
    puzzle: {
      type: "word-match",
      pairs: [
        { left: { ar: "الرحمن", en: "Ar-Rahman" }, right: { ar: "الرحمن ذو الرحمة العامة", en: "The Most Gracious" } },
        { left: { ar: "الرحيم", en: "Ar-Raheem" }, right: { ar: "الرحيم ذو الرحمة الخاصة", en: "The Most Merciful" } },
        { left: { ar: "الملك", en: "Al-Malik" }, right: { ar: "المالك لكل شيء", en: "The Sovereign Lord" } },
        { left: { ar: "القدوس", en: "Al-Quddus" }, right: { ar: "المنزه عن كل نقص", en: "The Holy" } },
        { left: { ar: "السلام", en: "As-Salam" }, right: { ar: "المنعم بالسلامة", en: "The Source of Peace" } },
      ],
      source: { ar: "سورة الحشر، الآية 23", en: "Surah Al-Hashr, verse 23" },
    },
  },
  {
    id: "fatiha",
    title: { ar: "سورة الفاتحة", en: "Surah Al-Fatiha" },
    subtitle: { ar: "أكمل الآيات من سورة الفاتحة", en: "Complete the verses from Al-Fatiha" },
    icon: "📖",
    puzzle: {
      type: "word-fill",
      verse: { ar: "الْحَمْدُ لِلَّهِ رَبِّ ...", en: "All praise is due to Allah, Lord of the ..." },
      options: [
        { ar: "الْعَالَمِينَ", en: "worlds" },
        { ar: "الرَّحِيمِ", en: "the Merciful" },
        { ar: "الدِّينِ", en: "the Day of Judgment" },
        { ar: "الْمُسْتَقِيمَ", en: "the Straight" },
      ],
      correctIndex: 0,
      source: { ar: "الفاتحة، الآية 2", en: "Al-Fatiha, verse 2" },
    },
  },
  {
    id: "islam-pillars",
    title: { ar: "أركان الإسلام", en: "Pillars of Islam" },
    subtitle: { ar: "صل الركن بوصفه", en: "Match each pillar to its description" },
    icon: "🕌",
    puzzle: {
      type: "word-match",
      pairs: [
        { left: { ar: "الشهادتان", en: "Shahada" }, right: { ar: "الإقرار بوحدانية الله ورسالة محمد", en: "Declaration of faith" } },
        { left: { ar: "الصلاة", en: "Salah" }, right: { ar: "خمس صلوات في اليوم والليلة", en: "Five daily prayers" } },
        { left: { ar: "الزكاة", en: "Zakat" }, right: { ar: "إخراج مال معلوم لمن يستحقه", en: "Obligatory charity" } },
        { left: { ar: "الصيام", en: "Sawm" }, right: { ar: "الإمساك عن المفطرات في رمضان", en: "Fasting Ramadan" } },
        { left: { ar: "الحج", en: "Hajj" }, right: { ar: "زيارة بيت الله في مكة", en: "Pilgrimage to Mecca" } },
      ],
      source: { ar: "حديث جبريل عليه السلام", en: "Hadith of Jibril" },
    },
  },
  {
    id: "prophets",
    title: { ar: "الأنبياء والرسل", en: "Prophets and Messengers" },
    subtitle: { ar: "صل النبي بموقفه أو معجزته", en: "Match each prophet to his story" },
    icon: "🌟",
    puzzle: {
      type: "word-match",
      pairs: [
        { left: { ar: "نوح", en: "Nuh" }, right: { ar: "أمره الله ببناء السفينة", en: "Built the ark by Allah's command" } },
        { left: { ar: "إبراهيم", en: "Ibrahim" }, right: { ar: "ألقي في النار فكانت برداً وسلاماً", en: "Thrown into the fire" } },
        { left: { ar: "موسى", en: "Musa" }, right: { ar: "أوتي التوراة وفلق البحر", en: "Given the Torah, split the sea" } },
        { left: { ar: "عيسى", en: "Isa" }, right: { ar: "أوتي الإنجيل وأحيا الموتى بإذن الله", en: "Given the Gospel, raised the dead" } },
        { left: { ar: "محمد", en: "Muhammad" }, right: { ar: "خاتم الأنبياء وأوتي القرآن", en: "Seal of the prophets, given the Quran" } },
      ],
      source: { ar: "القرآن الكريم", en: "The Holy Quran" },
    },
  },
  {
    id: "quran-verses",
    title: { ar: "آيات قرآنية", en: "Quranic Verses" },
    subtitle: { ar: "أكمل الآية الكريمة", en: "Complete the noble verse" },
    icon: "📜",
    puzzle: {
      type: "word-fill",
      verse: { ar: "إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَ...", en: "Indeed, Allah orders justice and ..." },
      options: [
        { ar: "الْإِحْسَانِ", en: "excellence" },
        { ar: "الصَّبْرِ", en: "patience" },
        { ar: "الصَّلَاةِ", en: "prayer" },
        { ar: "التَّقْوَى", en: "righteousness" },
      ],
      correctIndex: 0,
      source: { ar: "النحل، الآية 90", en: "An-Nahl, verse 90" },
    },
  },
  {
    id: "akhlaq",
    title: { ar: "الأخلاق الإسلامية", en: "Islamic Manners" },
    subtitle: { ar: "صل الخلق بمعناه", en: "Match each manner to its meaning" },
    icon: "💚",
    puzzle: {
      type: "word-match",
      pairs: [
        { left: { ar: "الصدق", en: "Truthfulness" }, right: { ar: "قول الحق والابتعاد عن الكذب", en: "Speaking the truth" } },
        { left: { ar: "الأمانة", en: "Trustworthiness" }, right: { ar: "أداء الحقوق إلى أصحابها", en: "Returning rights to their owners" } },
        { left: { ar: "التواضع", en: "Humility" }, right: { ar: "عدم التكبر على الناس", en: "Not being arrogant" } },
        { left: { ar: "العفو", en: "Forgiveness" }, right: { ar: "ترك الانتقام والتسامح", en: "Letting go of revenge" } },
      ],
      source: { ar: "القرآن والسنة", en: "Quran and Sunnah" },
    },
  },
  {
    id: "hadith",
    title: { ar: "الحديث النبوي", en: "Prophetic Hadith" },
    subtitle: { ar: "أكمل الحديث الشريف", en: "Complete the noble hadith" },
    icon: "📿",
    puzzle: {
      type: "word-fill",
      verse: { ar: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا ...", en: "Actions are but by intentions, and each person will have but that which he ..." },
      options: [
        { ar: "نَوَى", en: "intended" },
        { ar: "عَمِلَ", en: "did" },
        { ar: "كَسَبَ", en: "earned" },
        { ar: "قَالَ", en: "said" },
      ],
      correctIndex: 0,
      source: { ar: "رواه البخاري ومسلم", en: "Narrated by Bukhari and Muslim" },
    },
  },
  {
    id: "fiqh",
    title: { ar: "الفقه والعبادات", en: "Fiqh and Worship" },
    subtitle: { ar: "صل المصطلح بمعناه", en: "Match each term to its meaning" },
    icon: "📚",
    puzzle: {
      type: "word-match",
      pairs: [
        { left: { ar: "الوضوء", en: "Wudu" }, right: { ar: "طهارة مائية بالماء على أعضاء مخصوصة", en: "Ablution with water" } },
        { left: { ar: "التيمم", en: "Tayammum" }, right: { ar: "طهارة ترابية عند عدم وجود الماء", en: "Dry ablution with earth" } },
        { left: { ar: "الزكاة", en: "Zakat" }, right: { ar: "عبادة مالية مفروضة على مال معين", en: "Obligatory charity on wealth" } },
        { left: { ar: "الصوم", en: "Sawm" }, right: { ar: "الامتناع عن المفطرات من الفجر للمغرب", en: "Abstaining from dawn to sunset" } },
      ],
      source: { ar: "أبواب الفقه الإسلامي", en: "Chapters of Islamic Fiqh" },
    },
  },
];

export const TOTAL_WORDSEA_STAGES = wordseaStages.length;
