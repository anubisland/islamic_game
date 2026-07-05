import type { Stage } from "../types";

export const stages: Stage[] = [
  {
    id: "arkane-islam",
    title: "Pillars of Islam",
    subtitle: "The five pillars upon which Islam is built",
    icon: "🕋",
    lessons: [
      {
        id: "shahada",
        title: "The Shahada",
        content:
          "The Shahada (testimony of faith) is the first and foundation of the Pillars of Islam. It states: 'I bear witness that there is no god but Allah, and I bear witness that Muhammad is the Messenger of Allah.' Through it, one enters Islam.",
      },
      {
        id: "salah",
        title: "Prayer (Salah)",
        content:
          "Salah is the second pillar of Islam and the mainstay of the religion. Allah has obligated five daily prayers upon every Muslim: Fajr (dawn), Dhuhr (noon), Asr (afternoon), Maghrib (sunset), and Isha (night).",
      },
      {
        id: "zakat",
        title: "Zakat (Charity)",
        content:
          "Zakat is the third pillar, a financial worship obligated by Allah upon those who are able. It is given annually at a rate of 2.5% of saved wealth to those who deserve it, such as the poor and needy.",
      },
      {
        id: "sawm",
        title: "Fasting (Sawm)",
        content:
          "Fasting is the fourth pillar, referring to fasting the month of Ramadan. The Muslim abstains from food, drink, and desires from dawn until sunset, drawing closer to Allah through acts of worship.",
      },
      {
        id: "hajj",
        title: "Pilgrimage (Hajj)",
        content:
          "Hajj is the fifth pillar, an obligation upon every able Muslim once in a lifetime. It is performed in Mecca during the month of Dhul-Hijjah, with specific rituals.",
      },
    ],
    questions: [
      {
        id: "ai-q1",
        text: "What is the first pillar of Islam?",
        options: ["Prayer (Salah)", "The Shahada", "Zakat", "Fasting"],
        correctIndex: 1,
        explanation: "The Shahada is the first pillar of Islam and the foundation of entering the faith.",
      },
      {
        id: "ai-q2",
        text: "How many daily prayers are obligated upon a Muslim?",
        options: ["Three", "Four", "Five", "Seven"],
        correctIndex: 2,
        explanation: "Allah has obligated five daily prayers upon every Muslim.",
      },
      {
        id: "ai-q3",
        text: "What is the Zakat rate on saved wealth?",
        options: ["1%", "2.5%", "5%", "10%"],
        correctIndex: 1,
        explanation: "Zakat is 2.5% of wealth that has been held for one lunar year.",
      },
      {
        id: "ai-q4",
        text: "In which month do Muslims fast?",
        options: ["Muharram", "Rajab", "Ramadan", "Shaban"],
        correctIndex: 2,
        explanation: "Fasting the month of Ramadan is the fourth pillar of Islam.",
      },
      {
        id: "ai-q5",
        text: "Where is Hajj performed?",
        options: ["Medina", "Jerusalem", "Mecca", "Cairo"],
        correctIndex: 2,
        explanation: "Hajj is performed in Mecca and its sacred sites.",
      },
      {
        id: "ai-q6",
        text: "Which pillar of Islam is called 'the mainstay of the religion'?",
        options: ["Shahada", "Salah", "Zakat", "Hajj"],
        correctIndex: 1,
        explanation: "Salah is the mainstay of the religion and the second pillar.",
      },
      {
        id: "ai-q7",
        text: "How often does a Muslim give Zakat?",
        options: ["Every week", "Every month", "Every year", "Every day"],
        correctIndex: 2,
        explanation: "Zakat is given once a year when the wealth has completed one lunar year.",
      },
      {
        id: "ai-q8",
        text: "What does a fasting person abstain from from dawn to sunset?",
        options: ["Food only", "Drink only", "Food, drink, and desires", "Speech only"],
        correctIndex: 2,
        explanation: "The fasting person abstains from food, drink, and desires from dawn until sunset.",
      },
    ],
  },
  {
    id: "arkane-iman",
    title: "Pillars of Faith (Iman)",
    subtitle: "The foundations of Islamic creed",
    icon: "✨",
    lessons: [
      {
        id: "belief-allah",
        title: "Belief in Allah",
        content:
          "Belief in Allah is the first and greatest pillar of faith. We believe in Allah's existence, Lordship, Divinity, and His names and attributes. We worship Him alone with no partners.",
      },
      {
        id: "belief-angels",
        title: "Belief in Angels",
        content:
          "Angels are beings created from light, created by Allah to worship Him and carry out His commands. Among them are Jibril (revelation), Mika'il (provision), Israfil (blowing the Trumpet), and the Angel of Death (taking souls).",
      },
      {
        id: "belief-books",
        title: "Belief in the Books",
        content:
          "Allah revealed books to His messengers as guidance for humanity. These include the Torah to Moses, the Gospel to Jesus, the Psalms to David, and the Noble Quran to Muhammad ﷺ, which is the final and most complete book.",
      },
      {
        id: "belief-messengers",
        title: "Belief in the Messengers",
        content:
          "Allah sent messengers as bearers of good news and warners. The first was Noah and the last is Muhammad ﷺ. We must believe in all the messengers and prophets mentioned by Allah.",
      },
      {
        id: "belief-lastday",
        title: "Belief in the Last Day",
        content:
          "The Last Day is the Day of Judgment when Allah will resurrect all people for accountability and reward. We believe in everything Allah and His Messenger told us about it: resurrection, gathering, the scale, the bridge, Paradise and Hellfire. Belief in the Last Day motivates a believer to be conscious of Allah and do righteous deeds.",
      },
      {
        id: "belief-decree",
        title: "Belief in Divine Decree (Qadr)",
        content:
          "Belief in divine decree is the sixth pillar of faith. We believe that Allah has decreed all things by His knowledge and wisdom, and everything that happens in the universe is by Allah's will and decree. We believe in destiny, both its good and its bad, while taking necessary means and relying on Allah.",
      },
    ],
    questions: [
      {
        id: "aim-q1",
        text: "How many pillars of faith are there?",
        options: ["Three", "Four", "Five", "Six"],
        correctIndex: 3,
        explanation: "The six pillars of faith: belief in Allah, His angels, His books, His messengers, the Last Day, and divine decree.",
      },
      {
        id: "aim-q2",
        text: "Which angel is entrusted with revelation?",
        options: ["Mika'il", "Jibril", "Israfil", "Angel of Death"],
        correctIndex: 1,
        explanation: "Jibril (Gabriel) is the angel entrusted with delivering revelation.",
      },
      {
        id: "aim-q3",
        text: "Which book was revealed to Prophet Jesus (peace be upon him)?",
        options: ["Torah", "Psalms", "Gospel", "Quran"],
        correctIndex: 2,
        explanation: "The Gospel (Injil) was revealed to Prophet Jesus.",
      },
      {
        id: "aim-q4",
        text: "Who is the first messenger?",
        options: ["Abraham", "Moses", "Noah", "Adam"],
        correctIndex: 2,
        explanation: "Noah (Nuh) is the first messenger sent to humanity.",
      },
      {
        id: "aim-q5",
        text: "Belief in divine decree (Qadr), its good and bad, belongs to which pillar?",
        options: ["Third pillar", "Fourth pillar", "Fifth pillar", "Sixth pillar"],
        correctIndex: 3,
        explanation: "Belief in divine decree, its good and bad, is the sixth pillar of faith.",
      },
    ],
  },
  {
    id: "seerah",
    title: "The Prophetic Biography",
    subtitle: "The life of the best of humanity, Muhammad ﷺ",
    icon: "🌙",
    lessons: [
      {
        id: "birth",
        title: "Birth and Early Life",
        content:
          "Prophet Muhammad ﷺ was born in Mecca in the Year of the Elephant (570 CE). He grew up an orphan; his father died before his birth, and his mother Amina died when he was six. He was then cared for by his grandfather Abdul-Muttalib and later his uncle Abu Talib.",
      },
      {
        id: "revelation",
        title: "The First Revelation",
        content:
          "The revelation came to the Prophet ﷺ while he was in the Cave of Hira during Ramadan. The first revealed words were: {Read! In the Name of your Lord Who created}. He was forty years old at the time.",
      },
      {
        id: "hijra",
        title: "The Migration to Medina",
        content:
          "The Prophet ﷺ migrated from Mecca to Medina by Allah's command after the persecution by the polytheists intensified. This migration marked the beginning of the Islamic state and the Hijri calendar.",
      },
    ],
    questions: [
      {
        id: "sr-q1",
        text: "In which year was the Prophet ﷺ born?",
        options: ["Year of the Elephant", "Year of Revelation", "Year of Hijra", "Year of Hudaybiyyah"],
        correctIndex: 0,
        explanation: "The Prophet ﷺ was born in the Year of the Elephant (570 CE).",
      },
      {
        id: "sr-q2",
        text: "Where was the Prophet ﷺ when the first revelation came?",
        options: ["Cave of Thawr", "Cave of Hira", "The Sacred Mosque", "Khadija's house"],
        correctIndex: 1,
        explanation: "The Prophet ﷺ was in the Cave of Hira worshipping when Jibril brought the revelation.",
      },
      {
        id: "sr-q3",
        text: "How old was the Prophet ﷺ when revelation came?",
        options: ["Thirty", "Forty", "Fifty", "Sixty"],
        correctIndex: 1,
        explanation: "The Prophet ﷺ was forty years old when the revelation came.",
      },
      {
        id: "sr-q4",
        text: "Where did the Prophet ﷺ migrate to?",
        options: ["Mecca", "Medina", "Jerusalem", "Ta'if"],
        correctIndex: 1,
        explanation: "The Prophet ﷺ migrated from Mecca to Medina by Allah's command.",
      },
      {
        id: "sr-q5",
        text: "Who was the first woman to believe in the Prophet ﷺ?",
        options: ["Aisha", "Khadija", "Fatima", "Maryam"],
        correctIndex: 1,
        explanation: "Khadija bint Khuwaylid was the first to believe in the Prophet ﷺ.",
      },
    ],
  },
  {
    id: "quran",
    title: "The Noble Quran",
    subtitle: "The miraculous word of Allah",
    icon: "📖",
    lessons: [
      {
        id: "what-is-quran",
        title: "What is the Quran?",
        content:
          "The Noble Quran is the word of Allah revealed to Muhammad ﷺ, worship through its recitation, transmitted through continuous testimony (tawatur), preserved in hearts and scripts, beginning with Surah Al-Fatihah and ending with Surah An-Nas.",
      },
      {
        id: "surahs",
        title: "Chapters of the Quran",
        content:
          "The Quran contains 114 surahs (chapters), including Meccan (revealed before Hijra) and Medinan (revealed after Hijra). The longest surah is Al-Baqarah (286 verses) and the shortest is Al-Kawthar (3 verses).",
      },
    ],
    questions: [
      {
        id: "qr-q1",
        text: "How many surahs are in the Noble Quran?",
        options: ["100", "114", "120", "124"],
        correctIndex: 1,
        explanation: "The Noble Quran contains 114 surahs.",
      },
      {
        id: "qr-q2",
        text: "What is the longest surah in the Quran?",
        options: ["Aal-e-Imran", "Al-Baqarah", "An-Nisa", "Al-Kahf"],
        correctIndex: 1,
        explanation: "Surah Al-Baqarah is the longest surah with 286 verses.",
      },
      {
        id: "qr-q3",
        text: "With which surah does the Quran begin?",
        options: ["Al-Fatihah", "Al-Baqarah", "An-Nas", "Al-Ikhlas"],
        correctIndex: 0,
        explanation: "The Quran begins with Surah Al-Fatihah.",
      },
      {
        id: "qr-q4",
        text: "What does 'Meccan surah' mean?",
        options: ["Revealed in Medina", "Revealed before Hijra", "Revealed at night", "Revealed in Ramadan"],
        correctIndex: 1,
        explanation: "Meccan surahs were revealed before the Prophet's migration to Medina.",
      },
      {
        id: "qr-q5",
        text: "How many parts (juz) does the Quran have?",
        options: ["20 parts", "30 parts", "40 parts", "10 parts"],
        correctIndex: 1,
        explanation: "The Quran is divided into 30 parts (juz) for ease of memorization and recitation.",
      },
    ],
  },
  {
    id: "adab",
    title: "Islamic Etiquette",
    subtitle: "The Muslim's character in daily life",
    icon: "🌸",
    lessons: [
      {
        id: "greeting",
        title: "Greeting and Salutation",
        content:
          "Allah has prescribed that a Muslim greets by saying 'Assalamu Alaikum wa Rahmatullahi wa Barakatuh' (Peace be upon you and Allah's mercy and blessings), and responds with 'Wa Alaikum Assalam wa Rahmatullahi wa Barakatuh'. Greetings spread love among people.",
      },
      {
        id: "eating",
        title: "Etiquette of Eating",
        content:
          "It is recommended for a Muslim to say 'Bismillah' (In the name of Allah) before eating, eat with the right hand, and not overeat. The Prophet ﷺ said: 'The son of Adam fills no vessel worse than his stomach.'",
      },
      {
        id: "parents",
        title: "Kindness to Parents",
        content:
          "Kindness to parents is among the greatest deeds after Tawheed (monotheism). Allah says: {And your Lord has decreed that you worship none but Him and that you be dutiful to your parents}.",
      },
    ],
    questions: [
      {
        id: "ad-q1",
        text: "What is the best greeting in Islam?",
        options: ["Good morning", "Assalamu Alaikum", "Hello", "Welcome"],
        correctIndex: 1,
        explanation: "The Islamic greeting is 'Assalamu Alaikum wa Rahmatullahi wa Barakatuh'.",
      },
      {
        id: "ad-q2",
        text: "What does a Muslim say before eating?",
        options: ["Alhamdulillah", "Bismillah", "La ilaha illallah", "Allahu Akbar"],
        correctIndex: 1,
        explanation: "A Muslim says 'Bismillah' (In the name of Allah) before eating.",
      },
      {
        id: "ad-q3",
        text: "With which hand does a Muslim eat?",
        options: ["Left hand", "Right hand", "Both hands", "Either hand"],
        correctIndex: 1,
        explanation: "It is Sunnah for a Muslim to eat with the right hand.",
      },
      {
        id: "ad-q4",
        text: "Kindness to parents comes after which act of worship?",
        options: ["Prayer", "Tawheed", "Fasting", "Zakat"],
        correctIndex: 1,
        explanation: "Kindness to parents is among the greatest deeds after Tawheed (monotheism).",
      },
      {
        id: "ad-q5",
        text: "What do you say when a Muslim sneezes?",
        options: ["Yarhamukallah", "Bismillah", "Alhamdulillah", "Allahu Akbar"],
        correctIndex: 0,
        explanation: "The sneezer says 'Alhamdulillah', and the response is 'Yarhamukallah' (May Allah have mercy on you).",
      },
    ],
  },
  {
    id: "tawheed",
    title: "Tawheed (Monotheism)",
    subtitle: "Singling out Allah in worship and divinity",
    icon: "🤲",
    lessons: [
      {
        id: "tawheed-types",
        title: "Types of Tawheed",
        content:
          "Tawheed is divided into three categories: Tawheed of Lordship (believing Allah is the Creator, Provider, Sustainer), Tawheed of Divinity (singling out Allah in worship), and Tawheed of Names and Attributes (believing in Allah's names and attributes as revealed without distortion or denial).",
      },
      {
        id: "shirk",
        title: "Shirk (Associating Partners with Allah)",
        content:
          "Shirk is the greatest sin and major transgression, which is to set up rivals with Allah in worship. Allah says: {Indeed, Allah does not forgive association with Him, but He forgives what is less than that for whom He wills}. Shirk is of two types: major shirk (expelling from the faith) and minor shirk (like showing off).",
      },
      {
        id: "tawheed-benefits",
        title: "Fruits of Tawheed",
        content:
          "Tawheed is the greatest blessing Allah has bestowed upon His servants. Its fruits include: entering Paradise and salvation from Hellfire, security and tranquility in this life and the next, expiation of sins, and the Prophet's ﷺ intercession for the people of Tawheed.",
      },
    ],
    questions: [
      {
        id: "tw-q1",
        text: "How many types of Tawheed are there?",
        options: ["Two", "Three", "Four", "Five"],
        correctIndex: 1,
        explanation: "Tawheed is of three types: Lordship, Divinity, and Names and Attributes.",
      },
      {
        id: "tw-q2",
        text: "What is the greatest sin and major transgression?",
        options: ["Adultery", "Theft", "Shirk", "Disobeying parents"],
        correctIndex: 2,
        explanation: "Shirk is the greatest sin. Allah says: {Indeed, Allah does not forgive association with Him}.",
      },
      {
        id: "tw-q3",
        text: "Tawheed of Divinity means:",
        options: ["Believing Allah is the Creator", "Singling out Allah in worship", "Believing in Allah's names", "Believing in angels"],
        correctIndex: 1,
        explanation: "Tawheed of Divinity is to single out Allah alone in worship.",
      },
      {
        id: "tw-q4",
        text: "What is minor shirk?",
        options: ["Idol worship", "Showing off (riya)", "Cursing Allah", "Cursing religion"],
        correctIndex: 1,
        explanation: "Showing off (riya) is minor shirk because it is performing worship for other than Allah.",
      },
      {
        id: "tw-q5",
        text: "Among the fruits of Tawheed is:",
        options: ["Increased wealth only", "Entering Paradise and salvation from Hellfire", "Health only", "Long life only"],
        correctIndex: 1,
        explanation: "Among the greatest fruits of Tawheed is entering Paradise and salvation from Hellfire.",
      },
    ],
  },
  {
    id: "sahaba",
    title: "The Noble Companions",
    subtitle: "The best generation and the finest of the Ummah",
    icon: "⚔️",
    lessons: [
      {
        id: "khulafa",
        title: "The Rightly Guided Caliphs",
        content:
          "The Rightly Guided Caliphs are the best of the Companions and the first to assume leadership of the Muslims after the Prophet ﷺ. They are in order: Abu Bakr As-Siddiq, Umar ibn Al-Khattab, Uthman ibn Affan, Ali ibn Abi Talib. The Prophet said: 'Follow my Sunnah and the Sunnah of the Rightly Guided Caliphs after me.'",
      },
      {
        id: "notable-sahaba",
        title: "Famous Companions",
        content:
          "Among the famous Companions: Khadija bint Khuwaylid (first to believe), Hamza ibn Abdul-Muttalib (leader of martyrs), Bilal ibn Rabah (the Prophet's muezzin), Aisha (Mother of the Believers), Abdullah ibn Abbas (scholar of the Ummah), and Khalid ibn Al-Walid (the drawn sword of Allah).",
      },
    ],
    questions: [
      {
        id: "sh-q1",
        text: "How many Rightly Guided Caliphs are there?",
        options: ["Three", "Four", "Five", "Six"],
        correctIndex: 1,
        explanation: "The Rightly Guided Caliphs are four: Abu Bakr, Umar, Uthman, Ali.",
      },
      {
        id: "sh-q2",
        text: "Who was the first Rightly Guided Caliph?",
        options: ["Umar ibn Al-Khattab", "Uthman ibn Affan", "Abu Bakr As-Siddiq", "Ali ibn Abi Talib"],
        correctIndex: 2,
        explanation: "Abu Bakr As-Siddiq was the first Rightly Guided Caliph.",
      },
      {
        id: "sh-q3",
        text: "Who is the leader of the martyrs?",
        options: ["Khalid ibn Al-Walid", "Hamza ibn Abdul-Muttalib", "Umar ibn Al-Khattab", "Bilal ibn Rabah"],
        correctIndex: 1,
        explanation: "Hamza ibn Abdul-Muttalib, the Prophet's uncle, is the leader of the martyrs.",
      },
      {
        id: "sh-q4",
        text: "Who was the Prophet's muezzin (caller to prayer)?",
        options: ["Ali ibn Abi Talib", "Bilal ibn Rabah", "Abu Bakr As-Siddiq", "Khalid ibn Al-Walid"],
        correctIndex: 1,
        explanation: "Bilal ibn Rabah was the muezzin of the Prophet ﷺ.",
      },
      {
        id: "sh-q5",
        text: "Who was called 'the drawn sword of Allah'?",
        options: ["Khalid ibn Al-Walid", "Hamza ibn Abdul-Muttalib", "Umar ibn Al-Khattab", "Uthman ibn Affan"],
        correctIndex: 0,
        explanation: "The Prophet ﷺ gave Khalid ibn Al-Walid the title 'the drawn sword of Allah'.",
      },
    ],
  },
  {
    id: "prophets",
    title: "The Prophets and Messengers",
    subtitle: "Stories of the messengers, peace be upon them",
    icon: "🕊️",
    lessons: [
      {
        id: "prophet-adam",
        title: "Adam and Noah (peace be upon them)",
        content:
          "Adam is the first human and first prophet, created by Allah from clay and breathed into him of His spirit. Noah is the first messenger, who called his people for 950 years and was commanded by Allah to build the ark that saved the believers from the flood.",
      },
      {
        id: "prophet-ibrahim",
        title: "Abraham and Moses (peace be upon them)",
        content:
          "Abraham (Ibrahim) is the friend of Allah (Khalilullah), who called his people to abandon idol worship and broke their idols. He built the Kaaba with his son Ishmael. Moses (Musa) spoke directly to Allah, was sent to Pharaoh, supported with miracles, and was given the Torah.",
      },
      {
        id: "prophet-isa",
        title: "Jesus and Muhammad (peace be upon them)",
        content:
          "Jesus (Isa) is the messenger of Allah and His word bestowed upon Mary, supported by miracles such as raising the dead by Allah's permission. Muhammad ﷺ is the seal of the prophets and messengers, sent by Allah as a mercy to all worlds, and the Noble Quran was revealed to him.",
      },
    ],
    questions: [
      {
        id: "pr-q1",
        text: "Who is the first messenger?",
        options: ["Adam", "Noah", "Abraham", "Moses"],
        correctIndex: 1,
        explanation: "Noah (Nuh) is the first messenger.",
      },
      {
        id: "pr-q2",
        text: "Who is the friend of Allah (Khalilullah)?",
        options: ["Moses", "Jesus", "Abraham", "Noah"],
        correctIndex: 2,
        explanation: "Abraham (Ibrahim) is the friend of Allah.",
      },
      {
        id: "pr-q3",
        text: "Which prophet did Allah speak to directly?",
        options: ["Abraham", "Noah", "Jesus", "Moses"],
        correctIndex: 3,
        explanation: "Moses (Musa) spoke directly to Allah and was called Kalimullah (the one spoken to by Allah).",
      },
      {
        id: "pr-q4",
        text: "How many years did Noah call his people?",
        options: ["500 years", "750 years", "950 years", "1000 years"],
        correctIndex: 2,
        explanation: "Noah called his people for 950 years as mentioned in the Quran.",
      },
      {
        id: "pr-q5",
        text: "Who is the seal of the prophets and messengers?",
        options: ["Jesus", "Moses", "Abraham", "Muhammad ﷺ"],
        correctIndex: 3,
        explanation: "Muhammad ﷺ is the seal of the prophets and messengers.",
      },
    ],
  },
  {
    id: "fiqh",
    title: "Jurisprudence and Worship",
    subtitle: "Practical rulings in daily worship",
    icon: "📜",
    lessons: [
      {
        id: "tahara",
        title: "Purification (Taharah)",
        content:
          "Purification is half of faith and a condition for the validity of prayer. It includes wudu (ablution: washing the face, hands, wiping the head, and washing the feet), ghusl (ritual bath) after janabah (major impurity), and tayammum (dry ablution) when water is unavailable. The Prophet said: 'Purification is half of faith.'",
      },
      {
        id: "salah-rulings",
        title: "Rulings of Prayer",
        content:
          "Salah is obligatory upon every mature, sane Muslim. It has pillars (like standing, bowing, prostration), obligations (like the first tashahhud), and Sunnahs. The five prayers are performed at specified times, shortened during travel, and combined when needed.",
      },
    ],
    questions: [
      {
        id: "fq-q1",
        text: "Purification is a condition for the validity of which act of worship?",
        options: ["Fasting", "Prayer", "Zakat", "Hajj"],
        correctIndex: 1,
        explanation: "Purification is a condition for the validity of prayer. The Prophet said: 'Allah does not accept prayer without purification.'",
      },
      {
        id: "fq-q2",
        text: "How many main parts of wudu (ablution) are there?",
        options: ["Three", "Four", "Five", "Six"],
        correctIndex: 1,
        explanation: "The four main parts of wudu: face, hands, head, feet.",
      },
      {
        id: "fq-q3",
        text: "What is Tayammum?",
        options: ["Washing with water", "Ablution with clean earth when water is unavailable", "Prayer without ablution", "Wiping the head only"],
        correctIndex: 1,
        explanation: "Tayammum is a substitute for wudu or ghusl using clean earth when water is unavailable or cannot be used.",
      },
      {
        id: "fq-q4",
        text: "How many pillars (arkan) of prayer are there?",
        options: ["10 pillars", "14 pillars", "17 pillars", "20 pillars"],
        correctIndex: 2,
        explanation: "There are 14 pillars of prayer according to the majority of scholars, including standing, bowing, and prostration.",
      },
      {
        id: "fq-q5",
        text: "When is prayer shortened during travel?",
        options: ["During rain", "When traveling the prescribed distance", "Only during Ramadan", "During vacation"],
        correctIndex: 1,
        explanation: "Four-unit prayers are shortened to two units when traveling the prescribed shar'i distance.",
      },
    ],
  },
  {
    id: "adhkar",
    title: "Remembrances and Supplications",
    subtitle: "Morning and evening remembrances and daily supplications",
    icon: "🕊️",
    lessons: [
      {
        id: "morning-evening",
        title: "Morning and Evening Remembrances",
        content:
          "Morning and evening remembrances are the Muslim's daily fortress. They begin after Fajr prayer (for morning) and after Asr prayer (for evening). Important ones include: Ayat al-Kursi, Al-Mu'awwidhat (surahs of refuge), 'Subhan Allah wa bihamdihi' 100 times, 'La ilaha illallah wahdahu la sharika lah'.",
      },
      {
        id: "daily-supplications",
        title: "Daily Supplications",
        content:
          "The Prophet ﷺ taught us supplications for every occasion: waking up, entering the restroom, leaving it, wearing clothes, eating, drinking, mounting an animal, entering the home, leaving it, and sleeping. All of these protect the Muslim and keep them mindful of Allah at every moment.",
      },
    ],
    questions: [
      {
        id: "az-q1",
        text: "When are morning remembrances recited?",
        options: ["After Fajr prayer", "At noon", "Before sleep", "After Isha"],
        correctIndex: 0,
        explanation: "Morning remembrances are recited after Fajr prayer until sunrise.",
      },
      {
        id: "az-q2",
        text: "What does a Muslim say when entering the home?",
        options: ["Bismillahi walajna wa bismillahi kharajna", "Assalamu Alaikum", "Alhamdulillah", "La ilaha illallah"],
        correctIndex: 0,
        explanation: "Upon entering: 'Bismillahi walajna, wa bismillahi kharajna, wa ala Rabbina tawakkalna'.",
      },
      {
        id: "az-q3",
        text: "How many times did the Prophet ﷺ say 'Subhan Allah wa bihamdihi' daily?",
        options: ["50 times", "100 times", "200 times", "300 times"],
        correctIndex: 1,
        explanation: "The Prophet said: 'Whoever says Subhan Allah wa bihamdihi 100 times a day, his sins are forgiven.'",
      },
      {
        id: "az-q4",
        text: "When is the supplication for leaving the home said?",
        options: ["Upon seeing the moon", "Upon leaving the home", "Upon waking up", "Upon eating"],
        correctIndex: 1,
        explanation: "Upon leaving: 'Bismillah, tawakkaltu ala Allah, wa la hawla wa la quwwata illa billah'.",
      },
      {
        id: "az-q5",
        text: "What is the meaning of 'Adhkar'?",
        options: ["Prayers", "Remembrances of Allah", "Fasting", "Charity"],
        correctIndex: 1,
        explanation: "Adhkar are words of remembrance of Allah recited at specific times and occasions.",
      },
    ],
  },
  {
    id: "hadith",
    title: "Prophetic Hadith",
    subtitle: "Selected sayings from the Prophet's Sunnah",
    icon: "📗",
    lessons: [
      {
        id: "hadith-importance",
        title: "The Status of Sunnah",
        content:
          "The Prophetic Sunnah is the second source of legislation after the Noble Quran. Allah says: {And whatever the Messenger gives you, take it, and whatever he forbids you, abstain from it}. Hadith are classified into authentic (sahih), good (hasan), and weak (da'if) based on their chain of narration and text.",
      },
      {
        id: "famous-hadiths",
        title: "Comprehensive Hadiths",
        content:
          "Among the comprehensive hadiths: 'Actions are judged by intentions' (sincerity), 'Part of the perfection of one's Islam is leaving what does not concern him' (good character), 'None of you truly believes until he loves for his brother what he loves for himself' (altruism), 'Fear Allah wherever you are, and follow a bad deed with a good one to erase it' (piety).",
      },
    ],
    questions: [
      {
        id: "hd-q1",
        text: "Which companion narrated the most hadiths?",
        options: ["Umar ibn Al-Khattab", "Abu Hurairah", "Ali ibn Abi Talib", "Abdullah ibn Umar"],
        correctIndex: 1,
        explanation: "Abu Hurairah narrated the most hadiths (5,374 hadiths).",
      },
      {
        id: "hd-q2",
        text: "What does 'authentic hadith' (sahih) mean?",
        options: ["Narrated by liars", "Continuous chain of reliable narrators", "Narrated by unknown persons", "Contradicts the Quran"],
        correctIndex: 1,
        explanation: "A sahih hadith has a continuous chain of upright, precise narrators from beginning to end.",
      },
      {
        id: "hd-q3",
        text: "What is the first hadith in Sahih Al-Bukhari?",
        options: ["Actions are judged by intentions", "Islam is built on five", "None of you truly believes", "Part of perfection of Islam"],
        correctIndex: 0,
        explanation: "The first hadith in Sahih Al-Bukhari: 'Actions are judged by intentions, and every person will get what they intended.'",
      },
      {
        id: "hd-q4",
        text: "How many books are there in the Six Books of Hadith (Kutub al-Sittah)?",
        options: ["Four", "Five", "Six", "Seven"],
        correctIndex: 2,
        explanation: "The six books: Bukhari, Muslim, Abu Dawood, Tirmidhi, Nasa'i, Ibn Majah.",
      },
      {
        id: "hd-q5",
        text: "Who compiled Sahih Muslim?",
        options: ["Al-Bukhari", "Muslim ibn Al-Hajjaj", "Abu Dawood", "Al-Tirmidhi"],
        correctIndex: 1,
        explanation: "Muslim ibn Al-Hajjaj Al-Naysaburi compiled Sahih Muslim, the second of the six books.",
      },
    ],
  },
  {
    id: "ramadan",
    title: "Ramadan and Fasting",
    subtitle: "The virtues of Ramadan and rulings of fasting",
    icon: "🌙",
    lessons: [
      {
        id: "fasting-rulings",
        title: "Rulings of Fasting",
        content:
          "Fasting is the fourth pillar of Islam. Every mature, sane Muslim must fast the month of Ramadan. The fasting person abstains from food, drink, and marital relations from dawn to sunset. Exceptions include the sick, traveler, pregnant, nursing, and menstruating women, who make up missed days later.",
      },
      {
        id: "ramadan-virtues",
        title: "Virtues of Ramadan",
        content:
          "Ramadan is the month of the Quran, containing the Night of Decree (Laylat al-Qadr) which is better than a thousand months. The gates of Paradise are opened and the gates of Hell are closed. The Prophet said: 'Whoever fasts Ramadan with faith and seeking reward, his previous sins are forgiven.' The last ten nights are when the Prophet would increase worship and i'tikaf.",
      },
    ],
    questions: [
      {
        id: "rm-q1",
        text: "In which surah was fasting obligated?",
        options: ["One surah", "Several surahs", "Not mentioned in Quran", "Only in Surah Al-Baqarah"],
        correctIndex: 3,
        explanation: "Fasting was obligated in Surah Al-Baqarah: {O you who have believed, decreed upon you is fasting}.",
      },
      {
        id: "rm-q2",
        text: "When does the fast begin and end?",
        options: ["At sunset", "From dawn to sunset", "From midnight", "At Isha prayer"],
        correctIndex: 1,
        explanation: "Fasting is from true dawn to sunset, with the intention made during the night.",
      },
      {
        id: "rm-q3",
        text: "What is Laylat al-Qadr (the Night of Decree)?",
        options: ["Mid-Sha'ban night", "A night in the last ten of Ramadan, better than a thousand months", "Night of Isra", "Night of Mawlid"],
        correctIndex: 1,
        explanation: "Laylat al-Qadr is in the last ten nights of Ramadan, better than a thousand months, when the Quran was revealed.",
      },
      {
        id: "rm-q4",
        text: "Who is excused from fasting and must make up missed days?",
        options: ["The disbeliever", "The sick and traveler", "The child", "The insane"],
        correctIndex: 1,
        explanation: "The sick and traveler are excused from fasting and make up missed days as mentioned in the Quran.",
      },
      {
        id: "rm-q5",
        text: "What is the ruling on one who deliberately breaks the fast without excuse?",
        options: ["Nothing", "Must expiate by fasting two consecutive months", "Make up one day", "Feed the poor"],
        correctIndex: 1,
        explanation: "One who deliberately breaks the fast by intercourse must expiate by fasting two consecutive months. One who breaks it by eating must repent and make up the day according to most scholars.",
      },
    ],
  },
  {
    id: "hajj",
    title: "Hajj and Umrah",
    subtitle: "Rituals of Hajj and Umrah and their rulings",
    icon: "🕋",
    lessons: [
      {
        id: "hajj-importance",
        title: "The Virtue of Hajj",
        content:
          "Hajj is the fifth pillar of Islam, obligated once in a lifetime upon those who are able. The Prophet said: 'Whoever performs Hajj and does not engage in obscenity or sin, returns as on the day his mother bore him.' Hajj is to the Sacred House of Allah in Mecca, involving great rituals such as Tawaf, Sa'i, and standing at Arafah.",
      },
      {
        id: "umrah",
        title: "Umrah",
        content:
          "Umrah is visiting the Sacred House of Allah for Tawaf, Sa'i, and shaving or trimming the hair. The Prophet said: 'Umrah to the next Umrah is an expiation for what is between them.' Umrah is recommended at any time of the year, best during Ramadan. It is called the lesser Hajj.",
      },
    ],
    questions: [
      {
        id: "hj-q1",
        text: "How many times is Hajj obligated upon a Muslim?",
        options: ["Every year", "Once in a lifetime", "Twice", "Every 5 years"],
        correctIndex: 1,
        explanation: "Hajj is obligated once in a lifetime upon those who are able; more is voluntary.",
      },
      {
        id: "hj-q2",
        text: "What is the greatest pillar of Hajj?",
        options: ["Tawaf", "Sa'i", "Standing at Arafah", "Stoning the Jamarat"],
        correctIndex: 2,
        explanation: "Standing at Arafah is the greatest pillar of Hajj. The Prophet said: 'Hajj is Arafah.'",
      },
      {
        id: "hj-q3",
        text: "How does Umrah begin?",
        options: ["With Ihram and intention", "With Tawaf", "With shaving", "With Sa'i"],
        correctIndex: 0,
        explanation: "Umrah begins with Ihram and intention from the miqat, then Tawaf, then Sa'i, then shaving.",
      },
      {
        id: "hj-q4",
        text: "What is Tawaf?",
        options: ["Prayer in the Haram", "Circumambulating the Kaaba 7 times", "Climbing Safa", "Stoning the Jamarat"],
        correctIndex: 1,
        explanation: "Tawaf is circumambulating the Kaaba seven times, starting from the Black Stone.",
      },
      {
        id: "hj-q5",
        text: "What is meant by Miqat?",
        options: ["The time of Hajj only", "The place from which pilgrim enters Ihram", "A type of Tawaf", "A special supplication"],
        correctIndex: 1,
        explanation: "Miqat is the designated place for entering Ihram for Hajj or Umrah, varying by direction of arrival.",
      },
    ],
  },
  {
    id: "isra-wal-miraj",
    title: "Al-Isra wal-Miraj",
    subtitle: "The Prophet's miraculous night journey",
    icon: "🐎",
    lessons: [
      {
        id: "isra",
        title: "Al-Isra (The Night Journey)",
        content:
          "Al-Isra is the earthly journey in which the Prophet ﷺ was taken by night from the Sacred Mosque in Mecca to Al-Aqsa Mosque in Jerusalem on the Buraq. Allah says: {Exalted is He who took His servant by night from the Sacred Mosque to Al-Aqsa Mosque}. This occurred one year before the Hijra.",
      },
      {
        id: "miraj",
        title: "Al-Miraj (The Ascension)",
        content:
          "Al-Miraj is the Prophet's ascension from Al-Aqsa Mosque through the seven heavens. He met the prophets in each heaven: Adam in the first, Jesus and John in the second, Joseph in the third, Idris in the fourth, Aaron in the fifth, Moses in the sixth, Abraham in the seventh. Then the five daily prayers were prescribed.",
      },
    ],
    questions: [
      {
        id: "im-q1",
        text: "From which mosque did Al-Isra begin?",
        options: ["The Prophet's Mosque", "The Sacred Mosque", "Al-Aqsa Mosque", "Quba Mosque"],
        correctIndex: 1,
        explanation: "Al-Isra began from the Sacred Mosque in Mecca to Al-Aqsa Mosque in Jerusalem.",
      },
      {
        id: "im-q2",
        text: "What was the Prophet's mount during Al-Isra?",
        options: ["Camel", "Horse", "Buraq", "She-camel"],
        correctIndex: 2,
        explanation: "The Prophet rode the Buraq, a white beast larger than a donkey and smaller than a mule.",
      },
      {
        id: "im-q3",
        text: "What did Allah prescribe during the night of Al-Miraj?",
        options: ["Fasting", "Zakat", "Prayer", "Hajj"],
        correctIndex: 2,
        explanation: "Prayer was prescribed during the night of Al-Miraj: initially 50 prayers, then reduced to 5 with the reward of 50.",
      },
      {
        id: "im-q4",
        text: "How many heavens did the Prophet ascend through?",
        options: ["Five", "Seven", "Nine", "Ten"],
        correctIndex: 1,
        explanation: "The Prophet ascended through seven heavens, meeting prophets in each heaven.",
      },
      {
        id: "im-q5",
        text: "When did Al-Isra wal-Miraj occur?",
        options: ["One year before Hijra", "One year after Hijra", "The year of conquest", "Before the prophethood"],
        correctIndex: 0,
        explanation: "Al-Isra wal-Miraj occurred one year before the Prophet's migration (Hijra) to Medina.",
      },
    ],
  },
  {
    id: "khulafa",
    title: "The Rightly Guided Caliphs",
    subtitle: "Abu Bakr, Umar, Uthman, and Ali, may Allah be pleased with them",
    icon: "⚔️",
    lessons: [
      {
        id: "abu-bakr",
        title: "Abu Bakr As-Siddiq",
        content:
          "Abu Bakr Abdullah ibn Abi Quhafah As-Siddiq, the first Rightly Guided Caliph and the first man to embrace Islam. He was called As-Siddiq (the truthful) for his immediate belief in the Prophet's night journey. He was the Prophet's companion during the migration. His caliphate lasted two years, during which he fought the apostates and compiled the Quran. The Prophet said: 'If I were to take a close friend, I would take Abu Bakr as a close friend.'",
      },
      {
        id: "umar-uthman-ali",
        title: "Umar, Uthman, and Ali",
        content:
          "Umar ibn Al-Khattab Al-Faruq, the second Caliph; during his reign vast territories were conquered and the Hijri calendar was organized. Uthman ibn Affan Dhun-Nurayn, the third Caliph, compiled the Quran into a single volume. Ali ibn Abi Talib, the fourth Caliph, the Prophet's cousin and husband of his daughter Fatima. The Prophet said: 'Whoever I am his master, Ali is his master.'",
      },
    ],
    questions: [
      {
        id: "kl-q1",
        text: "Who was the first Rightly Guided Caliph?",
        options: ["Umar ibn Al-Khattab", "Abu Bakr As-Siddiq", "Uthman ibn Affan", "Ali ibn Abi Talib"],
        correctIndex: 1,
        explanation: "Abu Bakr As-Siddiq was the first Rightly Guided Caliph after the Prophet's death.",
      },
      {
        id: "kl-q2",
        text: "Why was Umar called Al-Faruq?",
        options: ["For his frequent fasting", "Because Allah distinguished truth from falsehood through him", "Because he was a knight", "For his beautiful voice"],
        correctIndex: 1,
        explanation: "Umar was called Al-Faruq because Allah manifested Islam through him and distinguished truth from falsehood by his embrace of Islam.",
      },
      {
        id: "kl-q3",
        text: "Who initiated the compilation of the Quran into one volume?",
        options: ["Abu Bakr", "Umar", "Uthman", "Ali"],
        correctIndex: 2,
        explanation: "Uthman ibn Affan compiled the Quran into one volume and sent copies to the provinces.",
      },
      {
        id: "kl-q4",
        text: "How long did Abu Bakr's caliphate last?",
        options: ["Two years", "Four years", "Six years", "Ten years"],
        correctIndex: 0,
        explanation: "Abu Bakr's caliphate lasted approximately two years (11 AH - 13 AH).",
      },
      {
        id: "kl-q5",
        text: "Who was the Prophet's cousin and fourth Caliph?",
        options: ["Al-Abbas", "Ali ibn Abi Talib", "Abdullah ibn Al-Zubayr", "Al-Hasan ibn Ali"],
        correctIndex: 1,
        explanation: "Ali ibn Abi Talib was the Prophet's cousin, husband of his daughter Fatima, and the fourth Rightly Guided Caliph.",
      },
    ],
  },
];
