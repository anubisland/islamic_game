export interface LangStr {
  ar: string;
  en: string;
}

export type CasePuzzleType = "case-order" | "case-solve";

export interface DetectiveStage {
  id: string;
  title: LangStr;
  era: LangStr;
  intro: LangStr;
  icon: string;
  puzzle: {
    type: CasePuzzleType;
    // case-order: arrange events/clues
    items?: LangStr[];
    correctOrder?: number[];
    // case-solve: choose the correct conclusion
    question?: LangStr;
    options?: LangStr[];
    correctIndex?: number;
    evidence?: LangStr;
  };
}

export const detectiveStages: DetectiveStage[] = [
  {
    id: "revelation",
    title: { ar: "لغز بداية الوحي", en: "Mystery of the First Revelation" },
    era: { ar: "السيرة النبوية", en: "Prophetic Biography" },
    intro: {
      ar: "في غار حراء، حدث أعظم حدث في تاريخ البشرية. رتب الأحداث التالية حسب تسلسلها الصحيح لتحل اللغز.",
      en: "In the Cave of Hira, the greatest event in human history occurred. Arrange the following events in correct order to solve the mystery.",
    },
    icon: "🕯️",
    puzzle: {
      type: "case-order",
      items: [
        { ar: "نزول جبريل عليه السلام", en: "Angel Jibril descends" },
        { ar: "قول الملك: اقرأ", en: "The angel says: Read" },
        { ar: "نزول سورة العلق", en: "Surah Al-Alaq revealed" },
        { ar: "رجوع النبي إلى خديجة", en: "Prophet returns to Khadija" },
      ],
      correctOrder: [0, 1, 2, 3],
      evidence: {
        ar: "بدأ الوحي بنزول جبريل على النبي ﷺ في غار حراء، فقال له: اقرأ، فنزلت أول آيات سورة العلق، ثم رجع النبي إلى خديجة رضي الله عنها.",
        en: "Revelation began with Jibril's descent upon the Prophet in the Cave of Hira, saying: Read. The first verses of Surah Al-Alaq were revealed, then the Prophet returned to Khadija.",
      },
    },
  },
  {
    id: "hijra",
    title: { ar: "لغز الهجرة النبوية", en: "Mystery of the Hijra" },
    era: { ar: "السيرة النبوية", en: "Prophetic Biography" },
    intro: {
      ar: "هاجر النبي ﷺ من مكة إلى المدينة في رحلة مليئة بالأحداث. رتب الأحداث بالترتيب الصحيح.",
      en: "The Prophet migrated from Mecca to Medina in a journey full of events. Arrange the events in correct order.",
    },
    icon: "🐪",
    puzzle: {
      type: "case-order",
      items: [
        { ar: "وصول النبي إلى المدينة", en: "Prophet arrives in Medina" },
        { ar: "الاختباء في غار ثور", en: "Hiding in Cave of Thawr" },
        { ar: "الخروج من مكة", en: "Departure from Mecca" },
        { ar: "بناء المسجد النبوي", en: "Building the Prophet's Mosque" },
      ],
      correctOrder: [2, 1, 0, 3],
      evidence: {
        ar: "خرج النبي من مكة متجهاً إلى المدينة، اختبأ في غار ثور مع أبي بكر، ثم واصلا الطريق حتى وصلا المدينة وبني المسجد النبوي.",
        en: "The Prophet left Mecca heading to Medina, hid in Cave of Thawr with Abu Bakr, then continued to Medina and built the Prophet's Mosque.",
      },
    },
  },
  {
    id: "badr",
    title: { ar: "لغز غزوة بدر", en: "Mystery of Badr" },
    era: { ar: "الغزوات", en: "Battles" },
    intro: {
      ar: "في غزوة بدر الأولى، كان هناك تفاصيل مهمة. أي من الخيارات التالية تصف عدد المشركين في غزوة بدر؟",
      en: "In the Battle of Badr, key details mattered. Which option correctly describes the polytheists' numbers?",
    },
    icon: "⚔️",
    puzzle: {
      type: "case-solve",
      question: {
        ar: "كم كان عدد المشركين في غزوة بدر؟",
        en: "How many polytheists fought in the Battle of Badr?",
      },
      options: [
        { ar: "1000 مقاتل", en: "1000 fighters" },
        { ar: "500 مقاتل", en: "500 fighters" },
        { ar: "700 مقاتل", en: "700 fighters" },
        { ar: "1300 مقاتل", en: "1300 fighters" },
      ],
      correctIndex: 0,
      evidence: {
        ar: "كان المشركون في غزوة بدر نحو 1000 مقاتل بينما كان المسلمون 313 مقاتلاً، ومع ذلك نصر الله المسلمين.",
        en: "The polytheists at Badr were about 1000 fighters while the Muslims were 313, yet Allah granted victory to the Muslims.",
      },
    },
  },
  {
    id: "conquest",
    title: { ar: "لغز فتح مكة", en: "Mystery of the Conquest of Mecca" },
    era: { ar: "السيرة النبوية", en: "Prophetic Biography" },
    intro: {
      ar: "فتح مكة كان حدثاً عظيماً. رتب الأحداث التالية بالترتيب الصحيح.",
      en: "The Conquest of Mecca was a momentous event. Arrange the following events in correct order.",
    },
    icon: "🏛️",
    puzzle: {
      type: "case-order",
      items: [
        { ar: "دخول النبي مكة", en: "Prophet enters Mecca" },
        { ar: "تحطيم الأصنام", en: "Destroying the idols" },
        { ar: "العفو عن أهل مكة", en: "Amnesty for the people of Mecca" },
        { ar: "التجهيز للفتح", en: "Preparation for conquest" },
      ],
      correctOrder: [3, 0, 1, 2],
      evidence: {
        ar: "جهز النبي للفتح، ثم دخل مكة متواضعاً، وحطم الأصنام حول الكعبة، ثم عفا عن أهل مكة قائلاً: اذهبوا فأنتم الطلقاء.",
        en: "The Prophet prepared for conquest, entered Mecca humbly, destroyed the idols around the Kaaba, then granted amnesty saying: Go, you are free.",
      },
    },
  },
  {
    id: "yarmouk",
    title: { ar: "لغز معركة اليرموك", en: "Mystery of Yarmouk" },
    era: { ar: "الخلافة الراشدة", en: "Rightly Guided Caliphate" },
    intro: {
      ar: "معركة اليرموك كانت من أعظم المعارك في التاريخ الإسلامي. أي من هذه المعلومات صحيحة عنها؟",
      en: "The Battle of Yarmouk was among the greatest battles in Islamic history. Which fact is correct about it?",
    },
    icon: "🛡️",
    puzzle: {
      type: "case-solve",
      question: {
        ar: "من كان قائد جيش المسلمين في معركة اليرموك؟",
        en: "Who was the commander of the Muslim army at Yarmouk?",
      },
      options: [
        { ar: "خالد بن الوليد", en: "Khalid ibn al-Walid" },
        { ar: "أبو بكر الصديق", en: "Abu Bakr al-Siddiq" },
        { ar: "عمر بن الخطاب", en: "Umar ibn al-Khattab" },
        { ar: "أبو عبيدة بن الجراح", en: "Abu Ubayda ibn al-Jarrah" },
      ],
      correctIndex: 0,
      evidence: {
        ar: "كان قائد المسلمين في معركة اليرموك (636م) هو خالد بن الوليد رضي الله عنه، وقد انتصر فيها المسلمون على الروم.",
        en: "The Muslim commander at the Battle of Yarmouk (636 CE) was Khalid ibn al-Walid, and the Muslims defeated the Byzantines.",
      },
    },
  },
  {
    id: "andalusia",
    title: { ar: "لغز الأندلس", en: "Mystery of Andalusia" },
    era: { ar: "تاريخ الأندلس", en: "History of Andalusia" },
    intro: {
      ar: "الأندلس كانت حضارة إسلامية عريقة. رتب هذه الأحداث التاريخية بالترتيب الصحيح.",
      en: "Andalusia was a great Islamic civilization. Arrange these historical events in correct order.",
    },
    icon: "🏰",
    puzzle: {
      type: "case-order",
      items: [
        { ar: "سقوط غرناطة", en: "Fall of Granada" },
        { ar: "الفتح الإسلامي للأندلس", en: "Islamic conquest of Andalusia" },
        { ar: "عصر الخلافة الأموية", en: "Umayyad Caliphate era" },
        { ar: "دولة الطوائف", en: "Taifa kingdoms" },
      ],
      correctOrder: [1, 2, 3, 0],
      evidence: {
        ar: "فتح المسلمون الأندلس عام 711م، ثم قامت الدولة الأموية، ثم دخلت الأندلس عصر الطوائف، وأخيراً سقطت غرناطة عام 1492م.",
        en: "Muslims conquered Andalusia in 711 CE, then the Umayyad state flourished, followed by the Taifa period, and finally Granada fell in 1492 CE.",
      },
    },
  },
  {
    id: "kairouan",
    title: { ar: "لغز القيروان", en: "Mystery of Kairouan" },
    era: { ar: "الفتوحات الإسلامية", en: "Islamic Conquests" },
    intro: {
      ar: "مدينة القيروان كانت أول مدينة إسلامية في إفريقيا. اختر الإجابة الصحيحة.",
      en: "Kairouan was the first Islamic city in Africa. Choose the correct answer.",
    },
    icon: "⛲",
    puzzle: {
      type: "case-solve",
      question: {
        ar: "من هو الصحابي الذي أسس مدينة القيروان؟",
        en: "Which companion founded the city of Kairouan?",
      },
      options: [
        { ar: "عقبة بن نافع", en: "Uqba ibn Nafi" },
        { ar: "عمرو بن العاص", en: "Amr ibn al-As" },
        { ar: "سعد بن أبي وقاص", en: "Sad ibn Abi Waqqas" },
        { ar: "طارق بن زياد", en: "Tariq ibn Ziyad" },
      ],
      correctIndex: 0,
      evidence: {
        ar: "أسس عقبة بن نافع رضي الله عنه مدينة القيروان عام 670م لتكون قاعدة للفتوحات الإسلامية في إفريقيا.",
        en: "Uqba ibn Nafi founded Kairouan in 670 CE as a base for Islamic conquests in Africa.",
      },
    },
  },
  {
    id: "caliphs-era",
    title: { ar: "لغز عصر الخلفاء", en: "Mystery of the Caliphs Era" },
    era: { ar: "الخلافة الراشدة", en: "Rightly Guided Caliphate" },
    intro: {
      ar: "عصر الخلفاء الراشدين كان عصراً ذهبياً. رتب الخلفاء الراشدين حسب توليهم الخلافة.",
      en: "The era of the Rightly Guided Caliphs was a golden age. Arrange the caliphs in order of their succession.",
    },
    icon: "👑",
    puzzle: {
      type: "case-order",
      items: [
        { ar: "علي بن أبي طالب", en: "Ali ibn Abi Talib" },
        { ar: "عمر بن الخطاب", en: "Umar ibn al-Khattab" },
        { ar: "أبو بكر الصديق", en: "Abu Bakr al-Siddiq" },
        { ar: "عثمان بن عفان", en: "Uthman ibn Affan" },
      ],
      correctOrder: [2, 1, 3, 0],
      evidence: {
        ar: "الخلفاء الراشدون بالترتيب: أبو بكر، عمر، عثمان، علي رضي الله عنهم أجمعين.",
        en: "The Rightly Guided Caliphs in order: Abu Bakr, Umar, Uthman, Ali. May Allah be pleased with them all.",
      },
    },
  },
];

export const TOTAL_DETECTIVE_STAGES = detectiveStages.length;
