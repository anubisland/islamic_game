export interface LangStr {
  ar: string;
  en: string;
}

export interface BattutaStage {
  id: string;
  city: LangStr;
  region: LangStr;
  description: LangStr;
  funFact: LangStr;
  icon: string;
  puzzle: {
    type: "city-trivia" | "route-order" | "distance-math" | "timeline";
    question: LangStr;
    options?: (LangStr | number)[];
    correctIndex?: number;
    items?: LangStr[];
    correctOrder?: number[];
    info: LangStr;
  };
  // For map layout — percentage positions
  mapX: number;
  mapY: number;
}

export const battutaStages: BattutaStage[] = [
  {
    id: "tangier",
    city: { ar: "طنجة", en: "Tangier" },
    region: { ar: "المغرب", en: "Morocco" },
    description: {
      ar: "من هنا انطلقت رحلة ابن بطوطة في 13 يونيو 1325م، عندما غادر طنجة متجهاً إلى مكة لأداء فريضة الحج، ليبدأ بذلك رحلة استمرت 30 عاماً وقطع فيها أكثر من 120 ألف كيلومتر.",
      en: "From here Ibn Battuta began his journey on June 13, 1325, leaving Tangier heading to Mecca for Hajj, starting a 30-year journey covering over 120,000 kilometers.",
    },
    funFact: {
      ar: "كان عمر ابن بطوطة 21 عاماً فقط عندما بدأ رحلته من طنجة!",
      en: "Ibn Battuta was only 21 years old when he started his journey from Tangier!",
    },
    icon: "🌊",
    puzzle: {
      type: "city-trivia",
      question: {
        ar: "ما هو البحر الذي يطل على مدينة طنجة، منطلق رحلة ابن بطوطة؟",
        en: "Which sea overlooks Tangier, the starting point of Ibn Battuta's journey?",
      },
      options: [
        { ar: "البحر الأبيض المتوسط", en: "Mediterranean Sea" },
        { ar: "المحيط الأطلسي", en: "Atlantic Ocean" },
        { ar: "البحر الأحمر", en: "Red Sea" },
        { ar: "بحر العرب", en: "Arabian Sea" },
      ],
      correctIndex: 0,
      info: {
        ar: "تقع طنجة على الساحل الشمالي للمغرب عند مضيق جبل طارق، حيث يلتقي البحر الأبيض المتوسط بالمحيط الأطلسي.",
        en: "Tangier is located on the northern coast of Morocco at the Strait of Gibraltar, where the Mediterranean meets the Atlantic Ocean.",
      },
    },
    mapX: 10,
    mapY: 80,
  },
  {
    id: "alexandria",
    city: { ar: "الإسكندرية", en: "Alexandria" },
    region: { ar: "مصر", en: "Egypt" },
    description: {
      ar: "كانت الإسكندرية أول محطة رئيسية لابن بطوطة بعد 35 يوماً من السفر براً وبحراً. انبهر بمنارتها الشهيرة وأسواقها المزدحمة.",
      en: "Alexandria was Ibn Battuta's first major stop after 35 days of travel by land and sea. He was amazed by its famous lighthouse and bustling markets.",
    },
    funFact: {
      ar: "زار ابن بطوطة الإسكندرية وكانت منارة الإسكندرية لا تزال قائمة آنذاك!",
      en: "Ibn Battuta visited Alexandria when the Lighthouse of Alexandria was still standing!",
    },
    icon: "⚓",
    puzzle: {
      type: "route-order",
      question: {
        ar: "رتب المدن التي زارها ابن بطوطة بالترتيب الصحيح من البداية حتى الإسكندرية:",
        en: "Arrange the cities Ibn Battuta visited in correct order from start to Alexandria:",
      },
      items: [
        { ar: "طنجة", en: "Tangier" },
        { ar: "تونس", en: "Tunis" },
        { ar: "الجزائر", en: "Algiers" },
        { ar: "الإسكندرية", en: "Alexandria" },
      ],
      correctOrder: [0, 2, 1, 3],
      info: {
        ar: "اتجه ابن بطوطة من طنجة على طول الساحل الشمالي لأفريقيا ماراً بالجزائر وتونس ثم عبر البحر إلى الإسكندرية.",
        en: "Ibn Battuta traveled from Tangier along the North African coast through Algiers and Tunis, then crossed the sea to Alexandria.",
      },
    },
    mapX: 18,
    mapY: 65,
  },
  {
    id: "cairo",
    city: { ar: "القاهرة", en: "Cairo" },
    region: { ar: "مصر", en: "Egypt" },
    description: {
      ar: "وصل ابن بطوطة إلى القاهرة، أكبر مدن العالم الإسلامي آنذاك. وصفها بأنها 'أم المدن' وانبهر بجامع الأزهر والأسواق المصرية.",
      en: "Ibn Battuta arrived in Cairo, then the largest city in the Islamic world. He described it as 'Mother of Cities' and admired Al-Azhar Mosque and Egyptian markets.",
    },
    funFact: {
      ar: "كان عدد سكان القاهرة في القرن الرابع عشر يقترب من نصف مليون نسمة!",
      en: "Cairo's population in the 14th century was nearly half a million people!",
    },
    icon: "🏛️",
    puzzle: {
      type: "city-trivia",
      question: {
        ar: "ما هو الجامع التاريخي الشهير الذي زاره ابن بطوطة في القاهرة؟",
        en: "Which historic mosque did Ibn Battuta visit in Cairo?",
      },
      options: [
        { ar: "جامع الأزهر", en: "Al-Azhar Mosque" },
        { ar: "الجامع الأموي", en: "Umayyad Mosque" },
        { ar: "المسجد النبوي", en: "Prophet's Mosque" },
        { ar: "المسجد الحرام", en: "Sacred Mosque" },
      ],
      correctIndex: 0,
      info: {
        ar: "جامع الأزهر أنشئ عام 970م وهو أحد أقدم المساجد في القاهرة، وكان مركزاً علمياً كبيراً في عصر ابن بطوطة.",
        en: "Al-Azhar Mosque was built in 970 CE and is one of the oldest mosques in Cairo, and was a major scholarly center in Ibn Battuta's time.",
      },
    },
    mapX: 28,
    mapY: 60,
  },
  {
    id: "damascus",
    city: { ar: "دمشق", en: "Damascus" },
    region: { ar: "الشام", en: "Levant" },
    description: {
      ar: "بعد زيارة مكة وأداء الحج، توجه ابن بطوطة إلى دمشق. وصفها بأنها 'جنة الشرق' وانبهر بجامعها الأموي وأسواقها وأخلاق أهلها.",
      en: "After visiting Mecca for Hajj, Ibn Battuta headed to Damascus. He described it as 'Paradise of the East' and admired its Umayyad Mosque and the character of its people.",
    },
    funFact: {
      ar: "مكث ابن بطوطة في دمشق عدة أشهر يتلقى العلم على كبار علمائها!",
      en: "Ibn Battuta stayed in Damascus for several months studying under its great scholars!",
    },
    icon: "🌿",
    puzzle: {
      type: "distance-math",
      question: {
        ar: "قطع ابن بطوطة من القاهرة إلى دمشق مسافة تقدر بـ 850 كم. إذا كان يسير بمعدل 35 كم يومياً، كم يوماً تقريباً استغرقت رحلته؟",
        en: "Ibn Battuta traveled from Cairo to Damascus about 850 km. If he walked 35 km per day, approximately how many days did his journey take?",
      },
      options: [20, 24, 28, 35],
      correctIndex: 1,
      info: {
        ar: "850 ÷ 35 ≈ 24.3 يوماً. في الواقع استغرقت الرحلة أكثر من ذلك بسبب التوقف في المدن والظروف المختلفة.",
        en: "850 ÷ 35 ≈ 24.3 days. In reality, the journey took longer due to stops in cities and various conditions.",
      },
    },
    mapX: 40,
    mapY: 45,
  },
  {
    id: "mecca",
    city: { ar: "مكة", en: "Mecca" },
    region: { ar: "الحجاز", en: "Hejaz" },
    description: {
      ar: "كانت مكة الهدف الأول لرحلة ابن بطوطة. أدى فريضة الحج ووصف الكعبة المشرفة والمشاعر المقدسة بأجمل العبارات، وبقي فيها فترة للدراسة.",
      en: "Mecca was the primary goal of Ibn Battuta's journey. He performed Hajj, described the Kaaba and holy sites beautifully, and stayed to study.",
    },
    funFact: {
      ar: "حج ابن بطوطة إلى مكة المكرمة سبع مرات خلال رحلته!",
      en: "Ibn Battuta performed Hajj in Mecca seven times during his journey!",
    },
    icon: "🕋",
    puzzle: {
      type: "timeline",
      question: {
        ar: "رتب الأحداث التالية حسب التسلسل الزمني الصحيح في رحلة ابن بطوطة:",
        en: "Arrange the following events in correct chronological order in Ibn Battuta's journey:",
      },
      items: [
        { ar: "زيارة الإسكندرية والقاهرة", en: "Visiting Alexandria and Cairo" },
        { ar: "أداء فريضة الحج في مكة", en: "Performing Hajj in Mecca" },
        { ar: "الانطلاق من طنجة", en: "Departing from Tangier" },
        { ar: "الوصول إلى دمشق", en: "Arriving in Damascus" },
      ],
      correctOrder: [2, 0, 1, 3],
      info: {
        ar: "انطلق من طنجة (1325) ← الإسكندرية والقاهرة ← الحج في مكة ← ثم إلى دمشق.",
        en: "Departed Tangier (1325) → Alexandria and Cairo → Hajj in Mecca → then to Damascus.",
      },
    },
    mapX: 42,
    mapY: 72,
  },
  {
    id: "baghdad",
    city: { ar: "بغداد", en: "Baghdad" },
    region: { ar: "العراق", en: "Iraq" },
    description: {
      ar: "توجه ابن بطوطة من دمشق إلى بغداد عبر الصحراء. وصف بغداد بأنها مدينة العلم والحضارة، وزار المدارس والمكتبات العريقة فيها.",
      en: "Ibn Battuta traveled from Damascus to Baghdad through the desert. He described Baghdad as a city of knowledge and civilization, visiting its historic schools and libraries.",
    },
    funFact: {
      ar: "لما زار ابن بطوطة بغداد، كانت المدينة لا تزال تتعافى من دمار التتار بعد 70 عاماً!",
      en: "When Ibn Battuta visited Baghdad, the city was still recovering from the Mongol destruction 70 years earlier!",
    },
    icon: "📚",
    puzzle: {
      type: "city-trivia",
      question: {
        ar: "بأي لقب كان يُعرف ابن بطوطة في العالم الإسلامي؟",
        en: "By what title was Ibn Battuta known in the Islamic world?",
      },
      options: [
        { ar: "أمير المؤمنين", en: "Commander of the Faithful" },
        { ar: "رحالة الإسلام", en: "Traveler of Islam" },
        { ar: "شيخ الجغرافيين", en: "Sheikh of Geographers" },
        { ar: "ابن حوقل الثاني", en: "The Second Ibn Hawqal" },
      ],
      correctIndex: 1,
      info: {
        ar: "ابن بطوطة لقب بـ 'رحالة الإسلام' لأنه زار几乎所有 البلاد الإسلامية في عصره وجاب أكثر من 40 دولة.",
        en: "Ibn Battuta was called 'Traveler of Islam' because he visited almost all Islamic lands of his time, traveling through over 40 countries.",
      },
    },
    mapX: 52,
    mapY: 58,
  },
  {
    id: "constantinople",
    city: { ar: "القسطنطينية", en: "Constantinople" },
    region: { ar: "الأناضول", en: "Anatolia" },
    description: {
      ar: "وصل ابن بطوطة إلى القسطنطينية عاصمة البيزنطيين، وكانت أول مدينة أوروبية كبرى يزورها. التقى بالإمبراطور ووصف آيا صوفيا.",
      en: "Ibn Battuta reached Constantinople, the Byzantine capital, his first major European city. He met the emperor and described Hagia Sophia.",
    },
    funFact: {
      ar: "استقبل الإمبراطور البيزنطي أندرونيكوس الثالث ابن بطوطة بحفاوة في قصره!",
      en: "Emperor Andronikos III welcomed Ibn Battuta warmly in his palace!",
    },
    icon: "🏰",
    puzzle: {
      type: "distance-math",
      question: {
        ar: "سافر ابن بطوطة من بغداد إلى القسطنطينية عبر الأناضول مسافة 2000 كم. إذا قطع 60% من المسافة براً والباقي بحراً، فكم كيلومتراً قطع بحراً؟",
        en: "Ibn Battuta traveled from Baghdad to Constantinople through Anatolia (2000 km). If he covered 60% by land and the rest by sea, how many km did he travel by sea?",
      },
      options: [600, 700, 800, 900],
      correctIndex: 2,
      info: {
        ar: "2000 × 0.4 = 800 كم بحراً (عبر البحر الأسود وبحر مرمرة).",
        en: "2000 × 0.4 = 800 km by sea (across the Black Sea and Sea of Marmara).",
      },
    },
    mapX: 60,
    mapY: 20,
  },
  {
    id: "delhi",
    city: { ar: "دلهي", en: "Delhi" },
    region: { ar: "الهند", en: "India" },
    description: {
      ar: "وصل ابن بطوطة إلى دلهي عاصمة سلطنة الهند. استقبله السلطان محمد بن تغلق وعينه قاضياً للمذهب المالكي، وبقي في دلهي 8 سنوات.",
      en: "Ibn Battuta arrived in Delhi, capital of the Sultanate of India. Sultan Muhammad bin Tughlaq appointed him as a Maliki judge, and he stayed 8 years.",
    },
    funFact: {
      ar: "عمل ابن بطوطة قاضياً في دلهي لمدة 8 سنوات وكان ذلك أطول فترة أقامها في مدينة واحدة!",
      en: "Ibn Battuta served as a judge in Delhi for 8 years, the longest he ever stayed in any city!",
    },
    icon: "🐘",
    puzzle: {
      type: "route-order",
      question: {
        ar: "رتب المحطات الرئيسية في رحلة ابن بطوطة بالترتيب الصحيح:",
        en: "Arrange the major stops in Ibn Battuta's journey in correct order:",
      },
      items: [
        { ar: "دلهي", en: "Delhi" },
        { ar: "بغداد", en: "Baghdad" },
        { ar: "مكة", en: "Mecca" },
        { ar: "القسطنطينية", en: "Constantinople" },
      ],
      correctOrder: [1, 2, 3, 0],
      info: {
        ar: "المسار: بغداد → مكة → القسطنطينية → دلهي",
        en: "Path: Baghdad → Mecca → Constantinople → Delhi",
      },
    },
    mapX: 72,
    mapY: 35,
  },
  {
    id: "china",
    city: { ar: "الصين", en: "China" },
    region: { ar: "كوانزو", en: "Quanzhou" },
    description: {
      ar: "كانت الصين أبعد محطة في رحلة ابن بطوطة. وصل إلى ميناء كوانزو (مدينة الزيتون) على الساحل الصيني، وزار معابدها وأسواقها وتعجب من الصناعة الصينية.",
      en: "China was the farthest stop in Ibn Battuta's journey. He reached Quanzhou (City of Olives) on the Chinese coast, visiting its temples, markets, and marveling at Chinese craftsmanship.",
    },
    funFact: {
      ar: "كان ابن بطوطة من أوائل الرحالة الذين وصفوا الصين بالتفصيل للعالم الإسلامي!",
      en: "Ibn Battuta was among the first travelers to describe China in detail to the Islamic world!",
    },
    icon: "🐉",
    puzzle: {
      type: "timeline",
      question: {
        ar: "رتب المحطات النهائية لرحلة ابن بطوطة بالترتيب الصحيح:",
        en: "Arrange the final stops of Ibn Battuta's journey in correct order:",
      },
      items: [
        { ar: "العودة إلى طنجة", en: "Return to Tangier" },
        { ar: "زيارة الصين", en: "Visiting China" },
        { ar: "الإقامة في دلهي", en: "Stay in Delhi" },
        { ar: "عبور جبال الهند", en: "Crossing the Indian mountains" },
      ],
      correctOrder: [2, 3, 1, 0],
      info: {
        ar: "دلهي ← جبال الهند ← الصين ← العودة إلى طنجة.",
        en: "Delhi → Indian mountains → China → Return to Tangier.",
      },
    },
    mapX: 88,
    mapY: 15,
  },
  {
    id: "return",
    city: { ar: "العودة إلى طنجة", en: "Return to Tangier" },
    region: { ar: "نهاية الرحلة", en: "Journey's End" },
    description: {
      ar: "بعد 30 عاماً من الترحال، عاد ابن بطوطة إلى طنجة عام 1354م. ثم سافر إلى الأندلس وزار غرناطة، وأملى رحلته 'الرحلة: تحفة النظار في غرائب الأمصار' على ابن جزي الكلبي.",
      en: "After 30 years of travel, Ibn Battuta returned to Tangier in 1354. He then visited Andalusia and Granada, and dictated his journey 'Rihla: A Gift to Those Who Contemplate the Wonders of Cities' to Ibn Juzayy.",
    },
    funFact: {
      ar: "قطع ابن بطوطة أكثر من 120,000 كيلومتر، أي ما يعادل 3 أضعاف محيط الأرض!",
      en: "Ibn Battuta covered over 120,000 km, equal to 3 times the Earth's circumference!",
    },
    icon: "🏠",
    puzzle: {
      type: "city-trivia",
      question: {
        ar: "كم سنة استغرقت رحلة ابن بطوطة الشهيرة؟",
        en: "How many years did Ibn Battuta's famous journey last?",
      },
      options: [
        { ar: "20 عاماً", en: "20 years" },
        { ar: "24 عاماً", en: "24 years" },
        { ar: "30 عاماً", en: "30 years" },
        { ar: "35 عاماً", en: "35 years" },
      ],
      correctIndex: 2,
      info: {
        ar: "استغرقت رحلة ابن بطوطة 30 عاماً من 1325 إلى 1354م، قطع خلالها أكثر من 120 ألف كيلومتر وزار أكثر من 40 دولة.",
        en: "Ibn Battuta's journey lasted 30 years from 1325 to 1354, covering over 120,000 km and visiting more than 40 countries.",
      },
    },
    mapX: 88,
    mapY: 82,
  },
];

export const TOTAL_BATTUTA_STAGES = battutaStages.length;
