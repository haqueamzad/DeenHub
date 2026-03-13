/* ============================================================
   DeenHub PWA — AI Islamic Scholar Engine
   Comprehensive knowledge base with smart search, live API
   integration, and authentic source citations.
   ============================================================ */

const Scholar = {

  // ---- Topic Categories ----
  categories: [
    { id: 'pillars', name: 'Five Pillars', icon: '🕌', nameAr: 'أركان الإسلام' },
    { id: 'quran', name: 'Quran', icon: '📖', nameAr: 'القرآن' },
    { id: 'hadith', name: 'Hadith', icon: '📜', nameAr: 'الحديث' },
    { id: 'prayer', name: 'Prayer', icon: '🤲', nameAr: 'الصلاة' },
    { id: 'fiqh', name: 'Fiqh', icon: '⚖️', nameAr: 'الفقه' },
    { id: 'seerah', name: 'Prophet\'s Life', icon: '🌙', nameAr: 'السيرة' },
    { id: 'aqeedah', name: 'Beliefs', icon: '💎', nameAr: 'العقيدة' },
    { id: 'history', name: 'History', icon: '🏛️', nameAr: 'التاريخ' },
    { id: 'ethics', name: 'Ethics', icon: '🌿', nameAr: 'الأخلاق' },
    { id: 'family', name: 'Family', icon: '👨‍👩‍👧', nameAr: 'الأسرة' },
    { id: 'finance', name: 'Finance', icon: '💰', nameAr: 'المالية' },
    { id: 'daily', name: 'Daily Life', icon: '☀️', nameAr: 'الحياة اليومية' }
  ],

  // ---- Suggested Questions ----
  suggestedQuestions: [
    "What are the five pillars of Islam?",
    "How do I perform wudu correctly?",
    "What is the importance of Surah Al-Fatihah?",
    "How many rakats are in each prayer?",
    "What breaks the fast in Ramadan?",
    "Who were the four rightly guided caliphs?",
    "What is the difference between Sunni and Shia?",
    "What are the conditions of Zakat?",
    "How to perform Salatul Janazah?",
    "What is Laylatul Qadr?"
  ],

  // ---- Synonym Map (keyword → canonical topic key) ----
  synonyms: {
    // Prayer
    'salah': 'prayer', 'salat': 'prayer', 'namaz': 'prayer', 'pray': 'prayer',
    'rakat': 'prayer_rakats', 'rakah': 'prayer_rakats', 'rakaat': 'prayer_rakats',
    'sujood': 'prayer_positions', 'ruku': 'prayer_positions', 'prostration': 'prayer_positions', 'bowing': 'prayer_positions',
    'tahajjud': 'tahajjud', 'qiyam': 'tahajjud', 'night prayer': 'tahajjud',
    'jumuah': 'jumuah', 'jummah': 'jumuah', 'friday prayer': 'jumuah', 'friday': 'jumuah',
    'janazah': 'janazah', 'funeral prayer': 'janazah', 'funeral': 'janazah',
    'eid prayer': 'eid_prayer', 'eid salah': 'eid_prayer',
    'adhan': 'adhan', 'azan': 'adhan', 'athan': 'adhan', 'call to prayer': 'adhan',
    // Wudu & Purity
    'wudu': 'wudu', 'wudhu': 'wudu', 'ablution': 'wudu', 'wash': 'wudu',
    'ghusl': 'ghusl', 'bath': 'ghusl', 'ritual bath': 'ghusl',
    'tayammum': 'tayammum', 'dry ablution': 'tayammum',
    // Quran
    'quran': 'quran', 'qur\'an': 'quran', 'koran': 'quran', 'mushaf': 'quran',
    'fatihah': 'fatihah', 'fatiha': 'fatihah', 'al-fatihah': 'fatihah', 'opening': 'fatihah',
    'ayatul kursi': 'ayatul_kursi', 'ayat al kursi': 'ayatul_kursi', 'throne verse': 'ayatul_kursi',
    'surah': 'quran_surahs', 'surahs': 'quran_surahs', 'chapters': 'quran_surahs',
    'tafsir': 'tafsir', 'tafseer': 'tafsir', 'interpretation': 'tafsir', 'exegesis': 'tafsir',
    'tajweed': 'tajweed', 'tajwid': 'tajweed', 'recitation rules': 'tajweed',
    'revelation': 'revelation', 'wahy': 'revelation',
    // Hadith
    'hadith': 'hadith', 'hadeeth': 'hadith', 'sunnah': 'hadith',
    'bukhari': 'hadith_collections', 'muslim': 'hadith_collections', 'sahih': 'hadith_collections',
    // Pillars
    'pillar': 'five_pillars', 'pillars': 'five_pillars', 'five pillars': 'five_pillars', 'arkan': 'five_pillars',
    'shahada': 'shahada', 'shahadah': 'shahada', 'testimony': 'shahada', 'declaration': 'shahada',
    // Fasting
    'fasting': 'fasting', 'fast': 'fasting', 'sawm': 'fasting', 'siyam': 'fasting', 'roza': 'fasting',
    'ramadan': 'ramadan', 'ramadhan': 'ramadan', 'ramazan': 'ramadan',
    'iftar': 'ramadan_practices', 'suhoor': 'ramadan_practices', 'sahur': 'ramadan_practices', 'sehri': 'ramadan_practices',
    'laylatul qadr': 'laylatul_qadr', 'night of power': 'laylatul_qadr', 'night of decree': 'laylatul_qadr', 'qadr': 'laylatul_qadr',
    'itikaf': 'itikaf', 'itikaaf': 'itikaf', 'retreat': 'itikaf',
    'taraweeh': 'taraweeh', 'tarawih': 'taraweeh', 'taravih': 'taraweeh',
    // Zakat
    'zakat': 'zakat', 'zakah': 'zakat', 'charity': 'zakat', 'alms': 'zakat',
    'sadaqah': 'sadaqah', 'sadaqa': 'sadaqah', 'voluntary charity': 'sadaqah',
    'nisab': 'zakat_nisab', 'nisaab': 'zakat_nisab',
    // Hajj
    'hajj': 'hajj', 'haj': 'hajj', 'pilgrimage': 'hajj',
    'umrah': 'umrah', 'umra': 'umrah', 'lesser pilgrimage': 'umrah',
    'tawaf': 'hajj_rituals', 'kaaba': 'hajj_rituals', 'ka\'bah': 'hajj_rituals',
    'arafat': 'hajj_rituals', 'mina': 'hajj_rituals', 'muzdalifah': 'hajj_rituals',
    'ihram': 'ihram',
    // Aqeedah (Beliefs)
    'iman': 'iman', 'faith': 'iman', 'belief': 'iman',
    'tawhid': 'tawhid', 'tawheed': 'tawhid', 'oneness': 'tawhid', 'monotheism': 'tawhid',
    'angel': 'angels', 'angels': 'angels', 'malaikah': 'angels',
    'jinn': 'jinn', 'jinns': 'jinn', 'djinn': 'jinn',
    'qadr': 'qadr_destiny', 'qadar': 'qadr_destiny', 'destiny': 'qadr_destiny', 'predestination': 'qadr_destiny', 'fate': 'qadr_destiny',
    'afterlife': 'afterlife', 'akhirah': 'afterlife', 'hereafter': 'afterlife', 'jannah': 'afterlife', 'paradise': 'afterlife', 'jahannam': 'afterlife', 'hell': 'afterlife',
    'day of judgment': 'day_of_judgment', 'judgement day': 'day_of_judgment', 'yawm al qiyamah': 'day_of_judgment', 'qiyamah': 'day_of_judgment',
    // Prophet & Seerah
    'prophet': 'prophet_muhammad', 'muhammad': 'prophet_muhammad', 'pbuh': 'prophet_muhammad', 'rasul': 'prophet_muhammad', 'messenger': 'prophet_muhammad',
    'companions': 'companions', 'sahaba': 'companions', 'sahabah': 'companions',
    'caliphs': 'caliphs', 'caliph': 'caliphs', 'khulafa': 'caliphs', 'rashidun': 'caliphs', 'abu bakr': 'caliphs', 'umar': 'caliphs', 'uthman': 'caliphs', 'ali': 'caliphs',
    'isra': 'isra_miraj', 'miraj': 'isra_miraj', 'night journey': 'isra_miraj', 'ascension': 'isra_miraj',
    'hijra': 'hijra', 'hijrah': 'hijra', 'migration': 'hijra',
    // Family & Social
    'marriage': 'marriage', 'nikah': 'marriage', 'wedding': 'marriage',
    'divorce': 'divorce', 'talaq': 'divorce',
    'children': 'children_islam', 'parenting': 'children_islam', 'upbringing': 'children_islam',
    'hijab': 'hijab', 'niqab': 'hijab', 'modest': 'hijab', 'modesty': 'hijab', 'covering': 'hijab',
    // Ethics & Character
    'tawbah': 'repentance', 'repent': 'repentance', 'repentance': 'repentance', 'forgive': 'repentance',
    'patience': 'sabr', 'sabr': 'sabr',
    'shukr': 'gratitude', 'gratitude': 'gratitude', 'thankful': 'gratitude',
    'tawakkul': 'tawakkul', 'trust in allah': 'tawakkul', 'reliance': 'tawakkul',
    'dhikr': 'dhikr', 'zikr': 'dhikr', 'remembrance': 'dhikr', 'remembrance of allah': 'dhikr',
    // Finance
    'riba': 'riba', 'interest': 'riba', 'usury': 'riba',
    'halal finance': 'islamic_finance', 'islamic finance': 'islamic_finance', 'islamic banking': 'islamic_finance',
    // Daily Life
    'halal': 'halal_haram', 'haram': 'halal_haram', 'permissible': 'halal_haram', 'forbidden': 'halal_haram',
    'food': 'halal_food', 'meat': 'halal_food', 'dietary': 'halal_food', 'eating': 'halal_food',
    'dua': 'dua', 'supplication': 'dua', 'du\'a': 'dua',
    'death': 'death_islam', 'funeral': 'death_islam', 'burial': 'death_islam', 'mourning': 'death_islam',
    // History
    'sunni': 'sunni_shia', 'shia': 'sunni_shia', 'shi\'a': 'sunni_shia', 'sect': 'sunni_shia', 'sects': 'sunni_shia',
    'sufism': 'sufism', 'sufi': 'sufism', 'tasawwuf': 'sufism',
    'islamic history': 'islamic_history', 'caliphate': 'islamic_history', 'ottoman': 'islamic_history',
    'islamic golden age': 'golden_age', 'golden age': 'golden_age', 'scholars': 'golden_age',
    // Misc
    'convert': 'conversion', 'revert': 'conversion', 'new muslim': 'conversion', 'how to become muslim': 'conversion',
    'bid\'ah': 'bidah', 'bidah': 'bidah', 'innovation': 'bidah',
    'shirk': 'shirk', 'idolatry': 'shirk', 'polytheism': 'shirk',
    'taqwa': 'taqwa', 'god-consciousness': 'taqwa', 'piety': 'taqwa',
    'islamic calendar': 'islamic_calendar', 'hijri': 'islamic_calendar', 'hijri calendar': 'islamic_calendar'
  },

  // ---- Comprehensive Knowledge Base ----
  // Each entry: { text, sources[], category, related[] }
  knowledge: {
    // === FIVE PILLARS ===
    five_pillars: {
      text: "The Five Pillars of Islam are the foundation of Muslim life:\n\n**1. Shahada** (Declaration of Faith) — Testifying that there is no god but Allah and Muhammad (PBUH) is His Messenger.\n\n**2. Salah** (Prayer) — Five daily prayers: Fajr (dawn), Dhuhr (noon), Asr (afternoon), Maghrib (sunset), Isha (night).\n\n**3. Zakat** (Obligatory Charity) — Giving 2.5% of qualifying wealth annually to those in need.\n\n**4. Sawm** (Fasting) — Fasting from dawn to sunset during the month of Ramadan.\n\n**5. Hajj** (Pilgrimage) — Making the pilgrimage to Makkah at least once in a lifetime for those who are physically and financially able.",
      sources: ["Sahih al-Bukhari 8", "Sahih Muslim 16"],
      category: 'pillars',
      related: ['shahada', 'prayer', 'zakat', 'fasting', 'hajj']
    },
    shahada: {
      text: "The Shahada is the Islamic declaration of faith and the first pillar of Islam:\n\n**Arabic:** أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ\n\n**Meaning:** \"I bear witness that there is no deity worthy of worship except Allah, and I bear witness that Muhammad is the Messenger of Allah.\"\n\nThe Shahada has two parts: Tawhid (monotheism — affirming Allah's oneness) and Risalah (prophethood — affirming Muhammad PBUH as the final messenger). Sincerely uttering the Shahada with understanding and conviction is what makes a person Muslim. It is recited in the Adhan, in prayer, and is the first thing whispered into a newborn's ear.",
      sources: ["Sahih Muslim 1:1", "Quran 3:18", "Quran 48:29"],
      category: 'pillars',
      related: ['five_pillars', 'tawhid', 'conversion']
    },

    // === PRAYER ===
    prayer: {
      text: "Salah (prayer) is the second pillar of Islam and the most important act of worship after the Shahada. Muslims perform five obligatory prayers daily:\n\n**Fajr** — 2 rakats, before sunrise\n**Dhuhr** — 4 rakats, after midday\n**Asr** — 4 rakats, late afternoon\n**Maghrib** — 3 rakats, just after sunset\n**Isha** — 4 rakats, nighttime\n\nEach prayer involves standing (Qiyam), bowing (Ruku), prostration (Sujood), and sitting (Tashahhud). Prayer must be preceded by Wudu (ablution) and performed facing the Qiblah (direction of the Kaaba in Makkah).\n\nThe Prophet (PBUH) said: \"The first matter that the slave will be brought to account for on the Day of Judgment is the prayer.\"",
      sources: ["Quran 2:43", "Quran 4:103", "Sunan an-Nasa'i 462", "Abu Dawud 864"],
      category: 'prayer',
      related: ['prayer_rakats', 'wudu', 'prayer_positions', 'jumuah']
    },
    prayer_rakats: {
      text: "The number of rakats (units) for each prayer:\n\n**Fajr:** 2 Sunnah + 2 Fard = 4 total\n**Dhuhr:** 4 Sunnah + 4 Fard + 2 Sunnah = 10 total\n**Asr:** 4 Fard (some scholars add 4 Sunnah before)\n**Maghrib:** 3 Fard + 2 Sunnah = 5 total\n**Isha:** 4 Fard + 2 Sunnah + 3 Witr = 9 total\n\n**Fard** = obligatory, **Sunnah** = recommended (based on Prophet's practice), **Witr** = strongly recommended odd-numbered prayer after Isha.\n\nTotal daily: 17 Fard rakats + up to 12 Sunnah Muakkadah (confirmed Sunnah). The Prophet (PBUH) said whoever prays 12 rakats of Sunnah daily, Allah will build a house for them in Paradise.",
      sources: ["Sahih Muslim 728", "Jami at-Tirmidhi 415", "Sunan Ibn Majah 1140"],
      category: 'prayer',
      related: ['prayer', 'tahajjud', 'prayer_positions']
    },
    prayer_positions: {
      text: "The key positions and movements in Salah:\n\n**1. Qiyam (Standing)** — Stand facing Qiblah, hands folded, recite Al-Fatihah and additional Quran.\n\n**2. Ruku (Bowing)** — Bow at the waist, hands on knees, back straight. Say \"Subhana Rabbiyal-Adheem\" (Glory to my Lord, the Most Great) 3 times.\n\n**3. I'tidal (Rising)** — Stand upright saying \"Sami Allahu liman hamidah\" (Allah hears those who praise Him).\n\n**4. Sujood (Prostration)** — Place forehead, nose, palms, knees, and toes on the ground. Say \"Subhana Rabbiyal-A'la\" (Glory to my Lord, the Most High) 3 times. This is the closest a servant is to Allah.\n\n**5. Jalsah (Sitting between prostrations)** — Sit briefly, then prostrate again.\n\n**6. Tashahhud (Final sitting)** — Recite the testimony of faith, send blessings on the Prophet, then give Salaam to end.",
      sources: ["Sahih al-Bukhari 828", "Sahih Muslim 482", "Abu Dawud 730"],
      category: 'prayer',
      related: ['prayer', 'prayer_rakats', 'wudu']
    },
    tahajjud: {
      text: "Tahajjud (Qiyam al-Layl) is the voluntary night prayer performed after Isha and before Fajr, ideally in the last third of the night.\n\n**How to pray:** Performed in sets of 2 rakats, typically 2-12 rakats total, concluded with Witr (odd number). There is no fixed number — pray as many as you wish.\n\n**Virtues:** Allah descends to the lowest heaven in the last third of every night and says: \"Who is calling upon Me that I may answer? Who is asking of Me that I may give? Who is seeking My forgiveness that I may forgive?\" It is the best prayer after the obligatory prayers.\n\n**Tips:** Start with what is easy — even 2 rakats. Set an alarm for the last third of the night. Make abundant dua during Sujood.",
      sources: ["Quran 17:79", "Sahih Muslim 1163", "Sahih al-Bukhari 1145", "Jami at-Tirmidhi 3498"],
      category: 'prayer',
      related: ['prayer', 'prayer_rakats', 'dhikr']
    },
    jumuah: {
      text: "Jumu'ah (Friday Prayer) is the congregational prayer performed every Friday at Dhuhr time. It is obligatory for adult Muslim men.\n\n**Structure:** 2 rakats Fard (instead of 4 Dhuhr), preceded by the Imam's Khutbah (sermon) in two parts.\n\n**Virtues:** The Prophet (PBUH) said: \"The best day on which the sun rises is Friday. On it Adam was created, on it he entered Paradise, and on it he was expelled.\" There is an hour on Friday during which no Muslim asks Allah for anything but He grants it.\n\n**Etiquette:** Take a bath (Ghusl), wear best clothes, apply fragrance, go early to the mosque, listen attentively to the Khutbah, recite Surah Al-Kahf, and increase Salawat upon the Prophet.",
      sources: ["Quran 62:9-10", "Sahih Muslim 854", "Sahih al-Bukhari 935", "Abu Dawud 1046"],
      category: 'prayer',
      related: ['prayer', 'adhan', 'dhikr']
    },
    janazah: {
      text: "Salatul Janazah (Funeral Prayer) is a communal obligation (Fard Kifayah) — if some Muslims perform it, the obligation is lifted from the rest.\n\n**How to perform:**\n\n1. **First Takbir** — Raise hands, fold them, recite Al-Fatihah silently.\n2. **Second Takbir** — Recite Salawat upon the Prophet (Ibrahimiyyah).\n3. **Third Takbir** — Make dua for the deceased: \"Allahumma-ghfir li-hayyinaa wa mayyitinaa...\" (O Allah, forgive our living and our dead...)\n4. **Fourth Takbir** — Make a brief dua, then give one Salaam to the right.\n\nThe entire prayer is performed standing — no Ruku or Sujood. The deceased is placed in front of the Imam.",
      sources: ["Sahih al-Bukhari 1333", "Sahih Muslim 963", "Abu Dawud 3201"],
      category: 'prayer',
      related: ['prayer', 'death_islam', 'dua']
    },
    eid_prayer: {
      text: "Eid Prayer is performed on the two Eid days: Eid al-Fitr (after Ramadan) and Eid al-Adha (during Hajj season). It is Wajib (obligatory) according to Hanafi school, and Sunnah Muakkadah according to others.\n\n**How to perform:** 2 rakats with extra Takbirat:\n- **First rakat:** 7 Takbirat after the opening Takbir, then Al-Fatihah + a Surah.\n- **Second rakat:** 5 Takbirat after standing up, then Al-Fatihah + a Surah.\n\nPerformed in congregation, ideally in an open area. The Khutbah comes after the prayer (unlike Jumu'ah). No Adhan or Iqamah is called.\n\n**Etiquette:** Take Ghusl, wear best clothes, eat dates before Eid al-Fitr prayer (but not before Eid al-Adha), take different routes to and from the prayer ground, and say Takbirat along the way.",
      sources: ["Sahih al-Bukhari 953", "Sahih Muslim 889", "Abu Dawud 1149"],
      category: 'prayer',
      related: ['prayer', 'ramadan', 'hajj']
    },
    adhan: {
      text: "The Adhan is the Islamic call to prayer, proclaimed 5 times daily from the mosque to announce prayer time.\n\n**Words of the Adhan:**\nAllahu Akbar (4x) — Allah is the Greatest\nAsh-hadu an la ilaha illa-Allah (2x) — I bear witness that there is no god but Allah\nAsh-hadu anna Muhammadan Rasulullah (2x) — I bear witness that Muhammad is the Messenger of Allah\nHayya 'ala-s-Salah (2x) — Come to prayer\nHayya 'ala-l-Falah (2x) — Come to success\nAllahu Akbar (2x) — Allah is the Greatest\nLa ilaha illa-Allah (1x) — There is no god but Allah\n\nFor Fajr, the additional phrase \"As-Salatu khayrun minan-nawm\" (Prayer is better than sleep) is added.\n\nThe first Muazzin (caller) in Islam was **Bilal ibn Rabah** (RA), an Ethiopian companion of the Prophet known for his beautiful voice.",
      sources: ["Sahih al-Bukhari 604", "Sahih Muslim 379", "Abu Dawud 499"],
      category: 'prayer',
      related: ['prayer', 'companions']
    },

    // === WUDU & PURITY ===
    wudu: {
      text: "Wudu (ablution) is the Islamic ritual of purification required before prayer, touching the Quran, and Tawaf.\n\n**Steps of Wudu:**\n1. **Niyyah** (intention) — Intend in your heart to perform Wudu.\n2. **Bismillah** — Say \"In the name of Allah.\"\n3. **Wash hands** 3 times.\n4. **Rinse mouth** 3 times (Madmadah).\n5. **Rinse nose** 3 times (Istinshaq).\n6. **Wash face** 3 times (from forehead hairline to chin, ear to ear).\n7. **Wash arms** to elbows, 3 times each, starting with the right.\n8. **Wipe head** (Masah) once — wet hands pass over the entire head.\n9. **Wipe ears** — index fingers inside, thumbs behind.\n10. **Wash feet** to ankles, 3 times each, starting with the right.\n\n**What breaks Wudu:** Natural discharge, sleeping deeply, bleeding (Hanafi), vomiting, touching private parts (Shafi'i).\n\nAfter Wudu, say: \"Ash-hadu an la ilaha illa-Allah wa ash-hadu anna Muhammadan 'abduhu wa rasuluh.\"",
      sources: ["Quran 5:6", "Sahih al-Bukhari 159", "Sahih Muslim 226", "Abu Dawud 101"],
      category: 'prayer',
      related: ['prayer', 'ghusl', 'tayammum']
    },
    ghusl: {
      text: "Ghusl is the full-body ritual washing required in certain situations:\n\n**When Ghusl is obligatory:**\n- After sexual intercourse\n- After ejaculation (even during sleep)\n- After menstruation ends\n- After postpartum bleeding ends\n- Upon accepting Islam (recommended)\n- Before Friday prayer (highly recommended)\n\n**How to perform Ghusl:**\n1. Make intention (Niyyah)\n2. Say Bismillah\n3. Wash both hands 3 times\n4. Wash private parts\n5. Perform complete Wudu\n6. Pour water over head 3 times, ensuring it reaches the roots of the hair\n7. Wash the entire body, starting with the right side then left\n8. Ensure water reaches every part of the body\n\nGhusl replaces Wudu — after Ghusl, you may pray without separate Wudu.",
      sources: ["Quran 4:43", "Sahih al-Bukhari 248", "Sahih Muslim 316"],
      category: 'prayer',
      related: ['wudu', 'tayammum', 'prayer']
    },
    tayammum: {
      text: "Tayammum (dry ablution) is the purification method using clean earth/dust when water is unavailable or harmful to use.\n\n**When Tayammum is permitted:**\n- No water available after reasonable search\n- Illness where water would cause harm\n- Extremely cold conditions where water use is dangerous\n- Only enough water for drinking (survival)\n\n**How to perform Tayammum:**\n1. Make intention (Niyyah)\n2. Say Bismillah\n3. Strike both palms lightly on clean earth/dust/stone\n4. Wipe the entire face once\n5. Strike palms again\n6. Wipe right arm to elbow, then left arm to elbow\n\nTayammum is invalidated by the same things that break Wudu, plus the availability of water.",
      sources: ["Quran 4:43", "Quran 5:6", "Sahih al-Bukhari 337", "Abu Dawud 321"],
      category: 'prayer',
      related: ['wudu', 'ghusl']
    },

    // === QURAN ===
    quran: {
      text: "The Quran is the holy book of Islam — the literal word of Allah revealed to Prophet Muhammad (PBUH) through Angel Jibreel (Gabriel) over 23 years (610-632 CE).\n\n**Key facts:**\n- 114 Surahs (chapters), 6,236 Ayat (verses)\n- Written in classical Arabic\n- Preserved letter-by-letter since revelation through oral and written transmission\n- Divided into 30 Juz (parts) for ease of recitation\n- Two types: Makki (revealed in Makkah — focus on faith) and Madani (revealed in Madinah — focus on law)\n\nThe Quran is the primary source of Islamic law, guidance, and spirituality. Muslims believe it is a miracle in its language, prophecies, scientific references, and preservation. The Prophet said: \"The best of you are those who learn the Quran and teach it.\"",
      sources: ["Quran 2:2", "Quran 15:9", "Quran 17:88", "Sahih al-Bukhari 5027"],
      category: 'quran',
      related: ['fatihah', 'ayatul_kursi', 'tafsir', 'tajweed', 'revelation']
    },
    fatihah: {
      text: "Surah Al-Fatihah (The Opening) is the first chapter of the Quran and the most recited Surah — it is a pillar of every rakat in prayer.\n\n**Arabic text:**\nبِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ\nالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ\nالرَّحْمَنِ الرَّحِيمِ\nمَالِكِ يَوْمِ الدِّينِ\nإِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ\nاهدِنَا الصِّرَاطَ الْمُسْتَقِيمَ\nصِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلاَ الضَّالِّينَ\n\nIt is called \"The Mother of the Book\" (Umm al-Kitab) and \"The Seven Oft-Repeated Verses.\" The Prophet (PBUH) said: \"No prayer is valid without the recitation of Al-Fatihah.\" It contains praise, worship, and supplication — a complete dua in just 7 verses.",
      sources: ["Quran 1:1-7", "Sahih al-Bukhari 756", "Sahih Muslim 395", "Quran 15:87"],
      category: 'quran',
      related: ['quran', 'prayer', 'ayatul_kursi']
    },
    ayatul_kursi: {
      text: "Ayatul Kursi (The Throne Verse) is Quran 2:255, regarded as the greatest verse in the Quran.\n\n**Arabic:** اللّهُ لاَ إِلَـهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الأَرْضِ...\n\n**Meaning:** \"Allah — there is no deity except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and on the earth...\"\n\n**Virtues:** The Prophet (PBUH) said: \"Whoever recites Ayatul Kursi after every obligatory prayer, nothing prevents him from entering Paradise except death.\" It provides protection from evil — recite it before sleeping, upon leaving the house, and after each prayer.",
      sources: ["Quran 2:255", "Sunan an-Nasa'i 9928", "Sahih al-Bukhari 5010"],
      category: 'quran',
      related: ['quran', 'fatihah', 'dhikr']
    },
    tafsir: {
      text: "Tafsir is the scholarly interpretation and explanation of the Quran. It draws on Arabic linguistics, Hadith, historical context (Asbab an-Nuzul), and legal reasoning.\n\n**Famous Tafsir works:**\n- **Tafsir Ibn Kathir** — by Imam Ibn Kathir (d. 1373 CE), most widely used, focuses on Hadith-based interpretation\n- **Tafsir al-Jalalayn** — concise, by two Jalals (al-Mahalli and as-Suyuti)\n- **Tafsir al-Tabari** — comprehensive historical tafsir by Ibn Jarir al-Tabari\n- **Tafsir al-Qurtubi** — focuses on legal rulings (ahkam)\n- **Fi Zilal al-Quran** — by Sayyid Qutb, modern literary approach\n\n**Types of Tafsir:** Tafsir bil-Ma'thur (based on transmitted reports), Tafsir bil-Ra'y (based on reasoning), and Tafsir al-Ishari (spiritual/mystical interpretation).",
      sources: ["Quran 3:7", "Sahih al-Bukhari 4993"],
      category: 'quran',
      related: ['quran', 'hadith', 'revelation']
    },
    tajweed: {
      text: "Tajweed is the set of rules governing the proper pronunciation and recitation of the Quran. The word means \"to make better\" or \"to beautify.\"\n\n**Key Tajweed concepts:**\n- **Makharij** — Articulation points for each Arabic letter\n- **Sifat** — Characteristics of letters (heavy, light, etc.)\n- **Noon Sakinah/Tanween rules** — Idh'har, Idgham, Iqlab, Ikhfa\n- **Meem Sakinah rules** — Idh'har Shafawi, Idgham Shafawi, Ikhfa Shafawi\n- **Madd (elongation)** — Natural Madd (2 counts), connected/separated Madd (4-6 counts)\n- **Qalqalah** — Echo/bouncing sound on certain letters (ق ط ب ج د)\n- **Waqf** — Rules for stopping and pausing\n\nLearning Tajweed is considered a communal obligation (Fard Kifayah), but applying basic rules when reciting is required for valid prayer according to many scholars.",
      sources: ["Quran 73:4", "Quran 25:32"],
      category: 'quran',
      related: ['quran', 'fatihah']
    },
    revelation: {
      text: "The Quran was revealed to Prophet Muhammad (PBUH) over 23 years through Angel Jibreel (Gabriel).\n\n**The first revelation:** In the Cave of Hira on Mount Nur near Makkah, during Ramadan 610 CE. Jibreel appeared and commanded: \"Iqra!\" (Read!) — the first five verses of Surah Al-Alaq (96:1-5).\n\n**How it was revealed:**\n- Sometimes like the ringing of a bell (most difficult form)\n- Sometimes Jibreel appeared in human form\n- Direct speech from Allah (during Isra and Mi'raj)\n\n**Preservation:** Companions memorized each revelation immediately. Written on palm leaves, bone fragments, and leather by designated scribes. Abu Bakr (RA) compiled the first complete written Mushaf. Uthman (RA) standardized the text in one dialect.\n\nThe last verse revealed was Quran 5:3: \"This day I have perfected for you your religion.\"",
      sources: ["Quran 96:1-5", "Quran 5:3", "Quran 2:185", "Sahih al-Bukhari 2"],
      category: 'quran',
      related: ['quran', 'prophet_muhammad', 'isra_miraj']
    },
    quran_surahs: {
      text: "The Quran contains 114 Surahs (chapters) of varying length:\n\n**Longest:** Al-Baqarah (286 verses) — covers law, stories, and guidance\n**Shortest:** Al-Kawthar (3 verses) — about the abundance given to the Prophet\n\n**Notable Surahs:**\n- **Al-Fatihah (1)** — The Opening, recited in every prayer\n- **Al-Baqarah (2)** — The Cow, longest surah, contains Ayatul Kursi\n- **Ya-Sin (36)** — Called \"the heart of the Quran\"\n- **Ar-Rahman (55)** — Beautiful description of Allah's blessings\n- **Al-Mulk (67)** — Protects from punishment of the grave\n- **Al-Kahf (18)** — Recommended to recite every Friday\n- **Al-Ikhlas (112)** — Equals one-third of the Quran in reward\n- **Al-Falaq (113) & An-Nas (114)** — Protection from evil\n\nSurahs are classified as Makki (revealed in Makkah, 86 surahs) or Madani (revealed in Madinah, 28 surahs).",
      sources: ["Sahih Muslim 804", "Sahih al-Bukhari 5015", "Jami at-Tirmidhi 2891"],
      category: 'quran',
      related: ['quran', 'fatihah', 'tafsir']
    },

    // === HADITH ===
    hadith: {
      text: "Hadith refers to the recorded sayings, actions, and approvals of Prophet Muhammad (PBUH). Along with the Quran, Hadith forms the foundation of Islamic law and guidance.\n\n**Components of a Hadith:**\n- **Isnad** (chain of narrators) — The people who transmitted the hadith\n- **Matn** (text) — The actual content of the hadith\n\n**Grades of authenticity:**\n- **Sahih** (authentic) — Continuous chain of trustworthy narrators\n- **Hasan** (good) — Slightly lesser chain but accepted\n- **Da'if** (weak) — Some deficiency in the chain\n- **Mawdu'** (fabricated) — Rejected completely\n\nScholars developed rigorous sciences ('Ulum al-Hadith) to verify each hadith's authenticity through examination of narrators' character, memory, and the chain's continuity.",
      sources: ["Quran 59:7", "Quran 4:80"],
      category: 'hadith',
      related: ['hadith_collections', 'prophet_muhammad']
    },
    hadith_collections: {
      text: "The six major Hadith collections (Al-Kutub as-Sittah) are considered the most authentic compilations:\n\n**1. Sahih al-Bukhari** — by Imam al-Bukhari (d. 870 CE), ~7,563 hadiths. Considered the most authentic book after the Quran.\n\n**2. Sahih Muslim** — by Imam Muslim (d. 875 CE), ~7,500 hadiths. Known for its excellent organization.\n\n**3. Sunan Abu Dawud** — focus on legal hadiths (ahkam)\n\n**4. Jami at-Tirmidhi** — includes grading of each hadith\n\n**5. Sunan an-Nasa'i** — known for strict authentication criteria\n\n**6. Sunan Ibn Majah** — comprehensive legal coverage\n\n**Other important collections:** Muwatta Imam Malik (oldest compilation), Musnad Ahmad (largest collection ~27,000 hadiths), Riyad as-Salihin by Imam an-Nawawi (organized by topic).",
      sources: ["Introduction to Sciences of Hadith — Ibn al-Salah"],
      category: 'hadith',
      related: ['hadith', 'prophet_muhammad']
    },

    // === FASTING & RAMADAN ===
    fasting: {
      text: "Sawm (fasting) is the fourth pillar of Islam. During Ramadan, Muslims fast from dawn (Fajr) to sunset (Maghrib).\n\n**What is required:** Abstaining from food, drink, smoking, and marital relations from Fajr until Maghrib.\n\n**Who must fast:** Every sane, adult Muslim. Exemptions include travelers, the sick, pregnant/nursing women, menstruating women, the elderly, and young children.\n\n**What breaks the fast:** Eating/drinking intentionally, vomiting intentionally, menstruation, and intentional marital relations.\n\n**What does NOT break the fast:** Eating/drinking forgetfully (finish and continue), using eye drops, injections (non-nutritional), blood tests, unintentional vomiting, and tasting food without swallowing.\n\n**Spiritual benefits:** Develops taqwa (God-consciousness), self-discipline, empathy for the poor, and gratitude.",
      sources: ["Quran 2:183-185", "Sahih al-Bukhari 1903", "Sahih Muslim 1151"],
      category: 'pillars',
      related: ['ramadan', 'ramadan_practices', 'laylatul_qadr']
    },
    ramadan: {
      text: "Ramadan is the ninth month of the Islamic calendar — the month in which the Quran was first revealed. It is the holiest month in Islam.\n\n**Key aspects:**\n- Obligatory fasting from dawn to sunset for all eligible Muslims\n- Increased Quran recitation (many aim to complete the entire Quran)\n- Taraweeh prayers every night after Isha\n- Laylatul Qadr (Night of Power) in the last 10 nights\n- Increased charity and good deeds\n- I'tikaf (spiritual retreat) in the last 10 days\n\n**The Prophet (PBUH) said:** \"When Ramadan begins, the gates of Paradise are opened, the gates of Hell are closed, and the devils are chained.\"\n\nRamadan ends with Eid al-Fitr, the festival of breaking the fast, preceded by Zakat al-Fitr (obligatory charity before Eid prayer).",
      sources: ["Quran 2:185", "Sahih al-Bukhari 1899", "Sahih Muslim 1079"],
      category: 'pillars',
      related: ['fasting', 'taraweeh', 'laylatul_qadr', 'itikaf']
    },
    ramadan_practices: {
      text: "Important Ramadan practices:\n\n**Suhoor (Pre-dawn meal):** Eat before Fajr time begins. The Prophet (PBUH) said: \"Eat Suhoor, for in Suhoor there is blessing.\" Even a sip of water counts.\n\n**Iftar (Breaking the fast):** Break fast immediately at Maghrib, preferably with dates and water. Dua at Iftar: \"Dhahaba adh-dhama'u wabtallatil-'urooqu wa thabatal-ajru in sha Allah\" (The thirst is gone, the veins are moistened, and the reward is confirmed, if Allah wills).\n\n**Taraweeh:** Voluntary night prayers in congregation, 8 or 20 rakats (both are valid).\n\n**Quran Recitation:** Many Muslims aim to complete the entire Quran during Ramadan.\n\n**Charity:** The Prophet was most generous in Ramadan. Give Zakat al-Fitr before Eid prayer.\n\n**Last 10 nights:** Seek Laylatul Qadr, increase worship, perform I'tikaf if possible.",
      sources: ["Sahih al-Bukhari 1923", "Abu Dawud 2357", "Sahih al-Bukhari 6"],
      category: 'pillars',
      related: ['ramadan', 'fasting', 'taraweeh', 'laylatul_qadr']
    },
    laylatul_qadr: {
      text: "Laylatul Qadr (The Night of Power/Decree) is the most blessed night in Islam — better than a thousand months (83+ years).\n\n**When is it?** In the odd nights of the last 10 days of Ramadan (21st, 23rd, 25th, 27th, or 29th). Most scholars favor the 27th night, but it may vary each year.\n\n**Signs:** A peaceful, serene night. The Prophet (PBUH) described it as a calm night, neither too hot nor too cold. The sun rises the next morning without strong rays.\n\n**What to do:**\n- Pray Tahajjud and extra night prayers\n- Recite Quran abundantly\n- Make lots of dua\n- Recite: \"Allahumma innaka 'afuwwun tuhibbul-'afwa fa'fu 'anni\" (O Allah, You are Forgiving and love forgiveness, so forgive me)\n- Give charity\n- Perform I'tikaf\n\nWorship on this night equals worship of over 1,000 months.",
      sources: ["Quran 97:1-5", "Sahih al-Bukhari 2014", "Jami at-Tirmidhi 3513", "Sahih Muslim 1170"],
      category: 'pillars',
      related: ['ramadan', 'tahajjud', 'dua']
    },
    taraweeh: {
      text: "Taraweeh is the special night prayer performed during Ramadan after the Isha prayer.\n\n**Key points:**\n- Sunnah Muakkadah (strongly recommended), not obligatory\n- Performed in congregation at the mosque or individually at home\n- Typically 8 or 20 rakats (both positions held by scholars)\n- The Quran is often completed over the course of Ramadan during Taraweeh\n- Followed by Witr prayer (3, 1, or more odd-number rakats)\n\nThe Prophet (PBUH) prayed it in congregation for a few nights, then stopped to prevent it from becoming obligatory. Umar (RA) later organized it as a congregational prayer.\n\nThe term \"Taraweeh\" means \"to rest\" — referring to resting between every four rakats.",
      sources: ["Sahih al-Bukhari 2012", "Sahih Muslim 761", "Muwatta Malik 6:2"],
      category: 'prayer',
      related: ['ramadan', 'prayer', 'tahajjud']
    },
    itikaf: {
      text: "I'tikaf is a spiritual retreat in the mosque, especially during the last 10 days of Ramadan.\n\n**What is I'tikaf?** Seclusion in the mosque with the intention of worship. The person stays in the mosque day and night, focusing on prayer, Quran, dhikr, and dua.\n\n**Rules:**\n- Must be performed in a mosque (some scholars allow women to do it at home)\n- Can only leave for necessities (bathroom, food if not available)\n- No marital relations during I'tikaf\n- Duration: The Prophet performed it for the last 10 days of Ramadan\n- Can be shorter (even a few hours has reward according to some scholars)\n\nThe Prophet (PBUH) consistently performed I'tikaf every Ramadan, and in his final year, he performed it for 20 days.",
      sources: ["Sahih al-Bukhari 2026", "Sahih Muslim 1172", "Quran 2:187"],
      category: 'pillars',
      related: ['ramadan', 'laylatul_qadr', 'tahajjud']
    },

    // === ZAKAT ===
    zakat: {
      text: "Zakat is the third pillar of Islam — obligatory charity of 2.5% of qualifying wealth held for one lunar year.\n\n**Conditions:**\n- Must be Muslim, sane, adult, and free\n- Wealth must exceed the Nisab threshold\n- Wealth must be held for one lunar year (Hawl)\n\n**Nisab threshold:** Equivalent to 85 grams of gold or 595 grams of silver (whichever is lower).\n\n**Zakat rate:** 2.5% on gold, silver, cash, investments, and business goods.\n\n**Eight categories of recipients (Quran 9:60):**\n1. The poor (Fuqara)\n2. The needy (Masakin)\n3. Zakat administrators\n4. Those whose hearts are to be reconciled\n5. Freeing slaves\n6. Those in debt\n7. In the cause of Allah\n8. The wayfarer (stranded traveler)\n\nZakat purifies wealth and creates social solidarity. It is NOT optional — refusing to pay Zakat is a major sin.",
      sources: ["Quran 9:60", "Quran 2:43", "Sahih al-Bukhari 1395", "Sahih Muslim 19"],
      category: 'pillars',
      related: ['zakat_nisab', 'sadaqah', 'five_pillars']
    },
    zakat_nisab: {
      text: "Nisab is the minimum amount of wealth a Muslim must possess before Zakat becomes obligatory.\n\n**Gold Nisab:** 85 grams of gold (approximately $5,500-$6,500 USD depending on market price)\n\n**Silver Nisab:** 595 grams of silver (approximately $450-$550 USD)\n\n**Which to use?** Most scholars recommend using the silver Nisab (the lower threshold) as it benefits more recipients. Some scholars allow using the gold Nisab.\n\n**Zakat rates by asset type:**\n- Cash, gold, silver, investments: 2.5%\n- Agricultural produce (irrigated): 5%\n- Agricultural produce (rain-fed): 10%\n- Livestock: varies by type and number\n- Mined minerals: 20%\n\n**Zakat al-Fitr:** Separate from annual Zakat — approximately $10-15 per person, paid before Eid al-Fitr prayer. Obligatory for every Muslim, even children.",
      sources: ["Sahih al-Bukhari 1447", "Abu Dawud 1567", "Sahih al-Bukhari 1503"],
      category: 'finance',
      related: ['zakat', 'sadaqah', 'islamic_finance']
    },
    sadaqah: {
      text: "Sadaqah is voluntary charity given purely for the pleasure of Allah, with no minimum amount or time requirement.\n\n**Types of Sadaqah:**\n- Monetary donations\n- Feeding the hungry\n- Smiling at someone (yes, this is Sadaqah!)\n- Removing harm from the path\n- Sharing knowledge\n- Speaking a good word\n- Planting a tree\n- Saying SubhanAllah, Alhamdulillah, etc.\n\nThe Prophet (PBUH) said: \"Every act of goodness is Sadaqah\" and \"Protect yourself from the Fire even if with half a date.\"\n\n**Sadaqah Jariyah** (ongoing charity) is especially virtuous — charity whose benefit continues after the giver's death: building a mosque, digging a well, spreading knowledge, or raising a righteous child. The Prophet said these good deeds continue to benefit you even after death.",
      sources: ["Sahih Muslim 1005", "Sahih al-Bukhari 1417", "Sahih Muslim 1631"],
      category: 'finance',
      related: ['zakat', 'ethics']
    },

    // === HAJJ ===
    hajj: {
      text: "Hajj is the fifth pillar of Islam — the annual pilgrimage to Makkah, obligatory once in a lifetime for every Muslim who is physically and financially able.\n\n**Key rituals of Hajj:**\n1. **Ihram** — Enter the sacred state at the Miqat\n2. **Tawaf** — Circumambulate the Kaaba 7 times\n3. **Sa'i** — Walk between Safa and Marwa 7 times\n4. **Day of Arafat** (9th Dhul Hijjah) — Stand at Arafat from noon to sunset (the pillar of Hajj)\n5. **Muzdalifah** — Spend the night, collect pebbles\n6. **Rami** — Stone the Jamarat (pillars) at Mina\n7. **Sacrifice** — Offer an animal (Eid al-Adha)\n8. **Shaving/cutting hair** — Men shave, women trim\n9. **Tawaf al-Ifadah** — Circumambulate the Kaaba again\n10. **Farewell Tawaf** — Final circumambulation before leaving\n\nThe Prophet (PBUH) said: \"An accepted Hajj has no reward except Paradise.\"",
      sources: ["Quran 3:97", "Quran 2:196-203", "Sahih al-Bukhari 1773", "Sahih Muslim 1349"],
      category: 'pillars',
      related: ['umrah', 'hajj_rituals', 'ihram']
    },
    umrah: {
      text: "Umrah is the lesser pilgrimage to Makkah, performed at any time of year. Unlike Hajj, it is not obligatory but is highly recommended (Sunnah Muakkadah).\n\n**Steps of Umrah:**\n1. **Ihram** — Enter the sacred state at the Miqat\n2. **Tawaf** — Circumambulate the Kaaba 7 times\n3. **Two rakats at Maqam Ibrahim** — Pray behind the Station of Abraham\n4. **Sa'i** — Walk between Safa and Marwa 7 times\n5. **Shaving or trimming hair** — Men shave or trim, women trim a fingertip's length\n\nThe Prophet (PBUH) said: \"Umrah to Umrah is an expiation for the sins between them.\" Umrah during Ramadan equals the reward of Hajj (in reward, not in fulfilling the Hajj obligation).",
      sources: ["Sahih al-Bukhari 1773", "Sahih Muslim 1256", "Sahih al-Bukhari 1782"],
      category: 'pillars',
      related: ['hajj', 'ihram', 'hajj_rituals']
    },
    hajj_rituals: {
      text: "Key sacred sites and rituals of Hajj:\n\n**The Kaaba:** The cubic structure in Masjid al-Haram, built by Ibrahim (AS) and Ismail (AS). Muslims face it during prayer (Qiblah). During Tawaf, pilgrims walk counterclockwise around it.\n\n**Maqam Ibrahim:** The stone bearing Ibrahim's (AS) footprints, located near the Kaaba.\n\n**Safa and Marwa:** Two hills between which Hajar ran searching for water for baby Ismail, until the spring of Zamzam miraculously appeared.\n\n**Plain of Arafat:** Standing here on the 9th of Dhul Hijjah is THE essential pillar of Hajj. \"Hajj is Arafat\" — without it, Hajj is invalid.\n\n**Muzdalifah:** Pilgrims spend the night here after Arafat.\n\n**Mina:** Where pilgrims stone the Jamarat, commemorating Ibrahim's rejection of Satan's temptations.\n\n**Zamzam:** The miraculous spring that has been flowing since Hajar's time, over 4,000 years ago.",
      sources: ["Quran 2:125-127", "Quran 2:158", "Sahih Muslim 1218"],
      category: 'pillars',
      related: ['hajj', 'umrah', 'ihram']
    },
    ihram: {
      text: "Ihram is the sacred state a pilgrim enters before performing Hajj or Umrah.\n\n**Men's dress:** Two white unstitched cloths — one wrapped around the waist (Izar), one draped over the shoulder (Rida). No underwear, socks, or head covering.\n\n**Women's dress:** Normal modest clothing. Face and hands should remain uncovered according to most scholars.\n\n**Prohibitions during Ihram:**\n- Cutting hair or nails\n- Wearing perfume or scented products\n- Marital relations\n- Hunting\n- Arguing or fighting\n- For men: covering the head, wearing stitched clothing\n\n**Talbiyah (recited throughout):** \"Labbayk Allahumma Labbayk, Labbayka la shareeka laka Labbayk. Innal-hamda wan-ni'mata laka wal-mulk, la shareeka lak.\" (Here I am, O Allah, here I am. You have no partner. Here I am. Praise, grace, and dominion are Yours. You have no partner.)",
      sources: ["Sahih al-Bukhari 1549", "Sahih Muslim 1184"],
      category: 'pillars',
      related: ['hajj', 'umrah', 'hajj_rituals']
    },

    // === BELIEFS (AQEEDAH) ===
    iman: {
      text: "Iman (faith) in Islam comprises six articles of belief:\n\n1. **Belief in Allah** — His existence, oneness, names, and attributes\n2. **Belief in Angels** — Created from light, carry out Allah's commands\n3. **Belief in Holy Books** — Quran, Torah, Gospel, Psalms, Scrolls of Ibrahim\n4. **Belief in Prophets** — From Adam to Muhammad (PBUH), 25 named in Quran\n5. **Belief in the Day of Judgment** — Resurrection, accountability, eternal life\n6. **Belief in Qadr (Divine Decree)** — Both good and bad come from Allah's wisdom\n\nThe famous Hadith of Jibreel defines Iman, Islam, and Ihsan (excellence in worship). Iman increases with good deeds and decreases with sin. The highest branch of Iman is saying \"La ilaha illa-Allah\" and the lowest is removing harm from the road.",
      sources: ["Sahih Muslim 8 (Hadith of Jibreel)", "Quran 2:285", "Sahih al-Bukhari 9"],
      category: 'aqeedah',
      related: ['tawhid', 'angels', 'qadr_destiny', 'day_of_judgment']
    },
    tawhid: {
      text: "Tawhid is the absolute oneness of Allah — the most fundamental concept in Islam and the essence of the Shahada.\n\n**Three categories:**\n\n1. **Tawhid ar-Rububiyyah** (Lordship) — Allah alone is the Creator, Sustainer, and Ruler of all that exists.\n\n2. **Tawhid al-Uluhiyyah** (Worship) — Allah alone deserves worship. No prayers, sacrifices, or devotion should be directed to anyone else.\n\n3. **Tawhid al-Asma' was-Sifat** (Names & Attributes) — Allah's names and attributes are unique. We affirm what He affirmed for Himself without comparison (tashbih) or denial (ta'til).\n\n**Allah's 99 Beautiful Names (Al-Asma al-Husna):** Ar-Rahman (The Most Merciful), Al-Malik (The King), Al-Quddus (The Holy), As-Salam (The Source of Peace), and many more. \"To Allah belong the Most Beautiful Names, so invoke Him by them.\"",
      sources: ["Quran 112:1-4", "Quran 7:180", "Quran 42:11", "Sahih al-Bukhari 7392"],
      category: 'aqeedah',
      related: ['iman', 'shahada', 'shirk']
    },
    angels: {
      text: "Angels (Malaikah) are beings created from light who carry out Allah's commands. Belief in angels is the second article of faith.\n\n**Notable Angels:**\n- **Jibreel (Gabriel)** — Brought revelation to the Prophets, the greatest angel\n- **Mikail (Michael)** — Responsible for rain and sustenance\n- **Israfil** — Will blow the trumpet on the Day of Judgment\n- **Azrael (Malak al-Mawt)** — Angel of Death\n- **Munkar and Nakir** — Question the dead in the grave\n- **Raqib and Atid** — Record every person's deeds (right shoulder: good deeds, left: bad deeds)\n- **Malik** — Guardian of Hellfire\n- **Ridwan** — Guardian of Paradise\n\nAngels do not eat, drink, sleep, or disobey Allah. They have no free will — they worship Allah continuously. They are different from Jinn, who have free will.",
      sources: ["Quran 2:285", "Quran 66:6", "Sahih al-Bukhari 3208", "Sahih Muslim 2637"],
      category: 'aqeedah',
      related: ['iman', 'jinn', 'revelation']
    },
    jinn: {
      text: "Jinn are beings created from smokeless fire, mentioned extensively in the Quran (an entire Surah — Al-Jinn, Chapter 72).\n\n**Key facts about Jinn:**\n- Created before humans, from smokeless fire\n- Have free will — some are Muslim, some are not\n- Can see us, but we generally cannot see them\n- Iblis (Shaytan/Satan) is a Jinn who refused to prostrate to Adam\n- They eat, drink, marry, and have children\n- They live in their own communities alongside humans\n\n**Protection from evil Jinn:**\n- Recite Ayatul Kursi (2:255)\n- Recite Surah Al-Falaq and An-Nas (last 2 Surahs)\n- Say Bismillah before eating, entering the house, etc.\n- Regular dhikr and morning/evening adhkar\n- Seek refuge in Allah: \"A'udhu billahi minash-shaytanir-rajim\"",
      sources: ["Quran 72:1-15", "Quran 55:15", "Quran 15:27", "Sahih Muslim 2174"],
      category: 'aqeedah',
      related: ['angels', 'iman', 'dhikr']
    },
    qadr_destiny: {
      text: "Qadr (Divine Decree/Predestination) is the sixth article of faith — belief that everything happens by Allah's will and knowledge.\n\n**Four levels of Qadr:**\n1. **Al-'Ilm (Knowledge)** — Allah knows everything that was, is, and will be\n2. **Al-Kitabah (Writing)** — Everything is written in Al-Lawh Al-Mahfuz (the Preserved Tablet)\n3. **Al-Mashee'ah (Will)** — Nothing happens except by Allah's will\n4. **Al-Khalq (Creation)** — Allah is the Creator of everything, including our actions\n\n**Does this mean we have no choice?** No — humans have free will to choose their actions, but Allah knows what they will choose. We are responsible for our choices and will be held accountable.\n\nThe Prophet (PBUH) said: \"Be mindful of Allah and He will protect you. Know that if the entire nation gathered to benefit you, they could not benefit you except with what Allah has written for you.\"",
      sources: ["Quran 54:49", "Quran 57:22", "Jami at-Tirmidhi 2516", "Sahih Muslim 2653"],
      category: 'aqeedah',
      related: ['iman', 'tawakkul', 'sabr']
    },
    afterlife: {
      text: "Islam teaches that this life is temporary and the Afterlife (Akhirah) is eternal.\n\n**After death:**\n1. **Barzakh** — The period between death and resurrection. The soul remains in a state of bliss or punishment in the grave.\n2. **Questioning in the grave** — Angels Munkar and Nakir ask three questions: Who is your Lord? What is your religion? Who is your Prophet?\n3. **Day of Judgment** — All of humanity will be resurrected and stand before Allah.\n4. **The Reckoning** — Deeds are weighed on the Scales (Mizan). Each person receives their book of deeds — in the right hand (success) or left hand (failure).\n5. **The Bridge (Sirat)** — Crosses over Hellfire to Paradise.\n\n**Jannah (Paradise):** Eternal bliss, rivers of milk and honey, reunited with loved ones, and the greatest reward — seeing Allah's Face.\n\n**Jahannam (Hell):** Punishment for disbelief and sin, though sinful Muslims may eventually be admitted to Paradise by Allah's mercy.",
      sources: ["Quran 3:185", "Quran 99:7-8", "Quran 56:1-56", "Sahih al-Bukhari 1338"],
      category: 'aqeedah',
      related: ['day_of_judgment', 'iman', 'repentance']
    },
    day_of_judgment: {
      text: "Yawm al-Qiyamah (The Day of Judgment) is a major belief in Islam — the day when all creation will be resurrected and held accountable.\n\n**Major signs before it:**\n- Appearance of the Mahdi\n- Return of Isa (Jesus) AS\n- Appearance of Dajjal (the False Messiah)\n- Ya'juj and Ma'juj (Gog and Magog)\n- The sun rising from the West\n- The Beast (Dabbat al-Ard)\n- Three major earthquakes\n\n**On that Day:**\n- The trumpet is blown by Israfil\n- All creation dies, then is resurrected\n- People stand before Allah in intense heat\n- The Prophets intercede (Shafa'ah)\n- The scales weigh deeds\n- Books of deeds are distributed\n- People cross the Sirat bridge\n\nThe Prophet (PBUH) will be the first to intercede, and his Ummah will be the first to be judged.",
      sources: ["Quran 99:1-8", "Quran 81:1-14", "Sahih Muslim 2937", "Sahih al-Bukhari 7121"],
      category: 'aqeedah',
      related: ['afterlife', 'iman']
    },

    // === PROPHET & SEERAH ===
    prophet_muhammad: {
      text: "Prophet Muhammad (PBUH) is the final messenger of Allah, sent as a mercy to all of mankind.\n\n**Key dates:**\n- Born: 570 CE in Makkah (Year of the Elephant)\n- First revelation: 610 CE in Cave Hira (age 40)\n- Hijra to Madinah: 622 CE\n- Conquest of Makkah: 630 CE\n- Farewell Pilgrimage: 632 CE\n- Passed away: 632 CE in Madinah (age 63)\n\n**Character:** Known as Al-Amin (The Trustworthy) and As-Sadiq (The Truthful) even before prophethood. He was the most generous, brave, humble, and kind of people.\n\n**Legacy:** His Sunnah (way of life) and Hadith (sayings) form the second source of Islamic law. He established the first Islamic state in Madinah, united the Arabian Peninsula, and left a message that spread to every continent.\n\nAllah says: \"And We have not sent you, except as a mercy to the worlds.\"",
      sources: ["Quran 21:107", "Quran 33:21", "Quran 68:4", "Sahih al-Bukhari 3559"],
      category: 'seerah',
      related: ['companions', 'caliphs', 'hijra', 'isra_miraj']
    },
    companions: {
      text: "The Sahabah (Companions) were the people who met the Prophet Muhammad (PBUH), believed in him, and died as Muslims.\n\n**The ten promised Paradise (Al-Ashara al-Mubashshara):**\n1. Abu Bakr as-Siddiq\n2. Umar ibn al-Khattab\n3. Uthman ibn Affan\n4. Ali ibn Abi Talib\n5. Talhah ibn Ubaydillah\n6. Zubayr ibn al-Awwam\n7. Abdur-Rahman ibn Awf\n8. Sa'd ibn Abi Waqqas\n9. Sa'id ibn Zayd\n10. Abu Ubaidah ibn al-Jarrah\n\n**Other notable Companions:** Bilal ibn Rabah (first Muazzin), Khadijah bint Khuwaylid (first Muslim, Prophet's wife), Abu Hurairah (narrated the most hadiths), Ibn Abbas (scholar of the Ummah), Aisha (greatest female scholar of hadith).\n\nThe Prophet said: \"The best of people is my generation, then those who follow them, then those who follow them.\"",
      sources: ["Sahih al-Bukhari 3673", "Jami at-Tirmidhi 3747", "Sahih al-Bukhari 2652"],
      category: 'seerah',
      related: ['prophet_muhammad', 'caliphs', 'adhan']
    },
    caliphs: {
      text: "The Khulafa ar-Rashidun (Four Rightly Guided Caliphs) led the Muslim community after the Prophet (PBUH):\n\n**1. Abu Bakr as-Siddiq (632-634 CE):**\n- First adult male to accept Islam\n- Compiled the Quran into one book\n- Fought the Wars of Apostasy (Riddah)\n- Title: As-Siddiq (The Truthful)\n\n**2. Umar ibn al-Khattab (634-644 CE):**\n- Expanded the Islamic state enormously (Persia, Egypt, Syria)\n- Established the Islamic calendar, Bayt al-Mal (treasury), and judicial system\n- Title: Al-Faruq (The Distinguisher)\n\n**3. Uthman ibn Affan (644-656 CE):**\n- Standardized the Quran text (Uthmanic Mushaf)\n- Expanded Masjid al-Nabawi and Masjid al-Haram\n- Title: Dhun-Nurayn (Possessor of Two Lights — married two of the Prophet's daughters)\n\n**4. Ali ibn Abi Talib (656-661 CE):**\n- First youth to accept Islam, the Prophet's cousin and son-in-law\n- Known for his justice, knowledge, and bravery\n- Title: Asadullah (The Lion of Allah)",
      sources: ["Sahih al-Bukhari 3671", "Sahih Muslim 2389", "Jami at-Tirmidhi 3748"],
      category: 'history',
      related: ['companions', 'prophet_muhammad', 'islamic_history']
    },
    isra_miraj: {
      text: "Al-Isra wal-Mi'raj is the Prophet's (PBUH) miraculous Night Journey from Makkah to Jerusalem (Al-Isra) and Ascension through the heavens (Al-Mi'raj).\n\n**Al-Isra:** The Prophet traveled on Al-Buraq (a heavenly creature) from Masjid al-Haram in Makkah to Masjid al-Aqsa in Jerusalem in a single night.\n\n**Al-Mi'raj:** From Jerusalem, the Prophet ascended through the seven heavens:\n- 1st Heaven: Met Adam (AS)\n- 2nd Heaven: Met Isa (Jesus) and Yahya (John) AS\n- 3rd Heaven: Met Yusuf (Joseph) AS\n- 4th Heaven: Met Idris (Enoch) AS\n- 5th Heaven: Met Harun (Aaron) AS\n- 6th Heaven: Met Musa (Moses) AS\n- 7th Heaven: Met Ibrahim (Abraham) AS\n\nBeyond the heavens, the Prophet reached Sidrat al-Muntaha and received the command of five daily prayers (originally 50, reduced through Musa's advice).",
      sources: ["Quran 17:1", "Sahih al-Bukhari 3887", "Sahih Muslim 162"],
      category: 'seerah',
      related: ['prophet_muhammad', 'prayer']
    },
    hijra: {
      text: "The Hijra (Migration) was the Prophet's (PBUH) journey from Makkah to Madinah in 622 CE, marking the beginning of the Islamic calendar.\n\n**Why the Hijra?** After 13 years of persecution in Makkah, where Muslims faced torture, boycotts, and assassination attempts, Allah commanded the migration to Yathrib (later renamed Madinah — \"The City of the Prophet\").\n\n**Key events:**\n- The people of Madinah (Ansar) pledged allegiance to the Prophet at Aqabah\n- Muslims migrated in small groups to avoid detection\n- The Prophet and Abu Bakr hid in Cave Thawr for three days while Quraysh searched for them\n- Allah protected them: a spider's web and dove's nest covered the cave entrance\n- They arrived in Quba (outskirts of Madinah), where the first mosque was built\n\n**Impact:** The Hijra established the first Islamic state, the Constitution of Madinah, and brotherhood between the Muhajirun (migrants) and Ansar (helpers).",
      sources: ["Quran 9:40", "Sahih al-Bukhari 3905", "Sahih Muslim 2009"],
      category: 'seerah',
      related: ['prophet_muhammad', 'companions']
    },

    // === ETHICS & CHARACTER ===
    repentance: {
      text: "Tawbah (repentance) is returning to Allah after sin. Allah loves those who repent sincerely, and His mercy encompasses all things.\n\n**Conditions for valid repentance:**\n1. Stop the sin immediately\n2. Feel genuine remorse and regret\n3. Make a firm intention never to return to it\n4. If the sin involved others' rights, restore those rights\n\n**Allah's promise:** \"Say, O My servants who have transgressed against themselves: do not despair of the mercy of Allah. Indeed, Allah forgives all sins. Indeed, it is He who is the Forgiving, the Merciful.\"\n\nThe Prophet (PBUH) said: \"Allah extends His Hand at night to accept the repentance of those who sinned during the day, and He extends His Hand during the day to accept the repentance of those who sinned during the night — until the sun rises from the West.\"\n\n**Istighfar (seeking forgiveness):** Say \"Astaghfirullah\" (I seek forgiveness from Allah) abundantly. The Prophet would seek forgiveness over 70 times a day.",
      sources: ["Quran 39:53", "Quran 2:222", "Sahih Muslim 2759", "Sahih al-Bukhari 6307"],
      category: 'ethics',
      related: ['sabr', 'taqwa', 'dhikr']
    },
    sabr: {
      text: "Sabr (patience) is one of the most emphasized virtues in Islam. It means perseverance in obeying Allah, enduring hardship, and restraining from sin.\n\n**Three types of Sabr:**\n1. **Patience in worship** — Persisting in prayer, fasting, and good deeds\n2. **Patience with trials** — Enduring illness, loss, poverty with faith\n3. **Patience from sin** — Restraining oneself from what is forbidden\n\nAllah says: \"Indeed, the patient will be given their reward without account.\" The rewards of patience are limitless.\n\nThe Prophet (PBUH) said: \"Amazing is the affair of the believer. Everything is good for him — and that is only for the believer. If something good happens, he is grateful, and that is good for him. If something bad happens, he is patient, and that is good for him.\"\n\n**How to develop Sabr:** Remember that trials are tests, make dua for patience, trust in Allah's plan (Tawakkul), and remember that hardship comes with ease.",
      sources: ["Quran 39:10", "Quran 94:5-6", "Sahih Muslim 2999"],
      category: 'ethics',
      related: ['gratitude', 'tawakkul', 'taqwa']
    },
    gratitude: {
      text: "Shukr (gratitude) is one of the highest stations of faith. Being thankful to Allah increases His blessings.\n\nAllah promises: \"If you are grateful, I will surely increase you; but if you deny, indeed, My punishment is severe.\"\n\n**How to show gratitude:**\n- Gratitude of the heart — Recognizing blessings come from Allah\n- Gratitude of the tongue — Saying Alhamdulillah, praising Allah\n- Gratitude of the limbs — Using blessings in obedience to Allah\n\nThe Prophet (PBUH) would pray Tahajjud until his feet swelled. When asked why he exerted himself so much despite being forgiven, he said: \"Should I not be a grateful servant?\"\n\n**Daily practice:** Say Alhamdulillah after eating, drinking, and waking up. Count your blessings regularly. Thank people — \"Whoever does not thank people has not thanked Allah.\"",
      sources: ["Quran 14:7", "Quran 31:12", "Sahih al-Bukhari 4837", "Abu Dawud 4811"],
      category: 'ethics',
      related: ['sabr', 'dhikr', 'taqwa']
    },
    tawakkul: {
      text: "Tawakkul is placing complete trust and reliance on Allah while taking the necessary means (actions).\n\n**Important:** Tawakkul does NOT mean being passive or not working. A man asked the Prophet if he should tie his camel or trust in Allah. The Prophet replied: \"Tie your camel, then put your trust in Allah.\"\n\n**How Tawakkul works:**\n1. Take all reasonable actions and preparations\n2. Make dua to Allah for success\n3. Accept the outcome — whatever Allah decrees is best\n4. Don't be anxious about things outside your control\n\nAllah says: \"And whoever relies upon Allah — then He is sufficient for him.\"\n\nThe Prophet (PBUH) said: \"If you truly put your trust in Allah as you should, He would provide for you as He provides for the birds — they go out hungry in the morning and return full in the evening.\"\n\nTawakkul brings peace of heart, removes anxiety, and strengthens faith.",
      sources: ["Quran 65:3", "Quran 3:159", "Jami at-Tirmidhi 2517", "Jami at-Tirmidhi 2344"],
      category: 'ethics',
      related: ['sabr', 'qadr_destiny', 'dua']
    },
    dhikr: {
      text: "Dhikr is the remembrance of Allah through specific phrases and supplications. It is one of the most beloved acts of worship.\n\n**Common Dhikr phrases:**\n- **SubhanAllah** (Glory be to Allah) — 33x after each prayer\n- **Alhamdulillah** (All praise is due to Allah) — 33x after each prayer\n- **Allahu Akbar** (Allah is the Greatest) — 34x after each prayer\n- **La ilaha illAllah** (There is no god but Allah)\n- **Astaghfirullah** (I seek forgiveness from Allah)\n- **La hawla wa la quwwata illa billah** (There is no power except with Allah)\n- **SubhanAllahi wa bihamdihi, SubhanAllahil-Adheem** — Two phrases light on the tongue, heavy on the scales\n\n**Benefits:** Peace of heart, protection from evil, forgiveness of sins, closeness to Allah.\n\nAllah says: \"Verily, in the remembrance of Allah do hearts find rest.\"",
      sources: ["Quran 13:28", "Quran 33:41-42", "Sahih al-Bukhari 6406", "Sahih Muslim 2694"],
      category: 'daily',
      related: ['dua', 'prayer', 'taqwa']
    },
    taqwa: {
      text: "Taqwa is God-consciousness — being mindful of Allah in every action, avoiding what He forbids, and doing what He commands. It is the most honored quality in Islam.\n\nAllah says: \"Indeed, the most noble of you in the sight of Allah is the most righteous of you (the one with the most Taqwa).\"\n\n**How to develop Taqwa:**\n- Pray all five daily prayers on time\n- Remember Allah constantly (dhikr)\n- Avoid sins, both major and minor\n- Guard your tongue, eyes, and heart\n- Be honest in all dealings\n- Eat only halal food\n- Keep good company\n- Reflect on death and the Afterlife\n- Study the Quran and act on its teachings\n\nUmar ibn al-Khattab asked Ubayy ibn Ka'b about Taqwa. Ubayy replied: \"Have you walked on a thorny path?\" Umar said, \"Yes.\" Ubayy asked, \"What did you do?\" Umar said, \"I gathered my garment and walked carefully.\" Ubayy said, \"That is Taqwa.\"",
      sources: ["Quran 49:13", "Quran 2:197", "Quran 3:102"],
      category: 'ethics',
      related: ['iman', 'dhikr', 'repentance']
    },

    // === FAMILY ===
    marriage: {
      text: "Marriage (Nikah) in Islam is a sacred contract and an act of worship. The Prophet (PBUH) said: \"Marriage is half of faith.\"\n\n**Requirements for a valid Nikah:**\n1. Consent of both bride and groom\n2. Wali (guardian) for the bride\n3. Two male witnesses\n4. Mahr (dowry) — a gift from the groom to the bride (her right)\n5. Offer and acceptance (Ijab and Qabul)\n\n**Rights and responsibilities:**\n- The husband must provide financially (housing, food, clothing)\n- Both should treat each other with kindness and mercy\n- The Prophet said: \"The best of you are those who are best to their wives\"\n\n**Etiquette:** Seek a spouse with good character and deen. Pray Salatul Istikhara before making a decision. Keep the wedding simple. The most blessed Nikah is the easiest (simplest).",
      sources: ["Quran 30:21", "Quran 4:4", "Sahih Muslim 1006", "Jami at-Tirmidhi 1162"],
      category: 'family',
      related: ['divorce', 'children_islam', 'hijab']
    },
    divorce: {
      text: "Divorce (Talaq) is permitted in Islam but is described as \"the most hated permissible thing to Allah.\"\n\n**Types of divorce:**\n- **Talaq** — Initiated by the husband (3 pronouncements with waiting periods between each)\n- **Khul'** — Initiated by the wife (returns her mahr/dowry)\n- **Faskh** — Judicial annulment by an Islamic court\n\n**The Iddah (waiting period):**\n- Divorced women: 3 menstrual cycles\n- Widows: 4 months and 10 days\n- Pregnant women: Until delivery\n\n**Reconciliation is encouraged:** After the first or second divorce, the couple can reconcile during the Iddah period. After the third divorce, they cannot remarry unless the wife marries and divorces another man naturally.\n\n**Children's rights:** Islam prioritizes the child's welfare. Generally, young children stay with the mother, with the father providing financial support.",
      sources: ["Quran 2:228-232", "Quran 65:1-6", "Abu Dawud 2178", "Sahih al-Bukhari 5273"],
      category: 'family',
      related: ['marriage', 'children_islam']
    },
    children_islam: {
      text: "Children are a trust (Amanah) from Allah. Parents have significant responsibilities in raising them.\n\n**Key parenting duties in Islam:**\n- Choose a good name for the child\n- Recite Adhan in the newborn's right ear\n- Perform Aqeeqah (sacrifice on the 7th day)\n- Teach them La ilaha illAllah as their first words\n- Teach them prayer by age 7, ensure it by age 10\n- Teach them Quran and Islamic knowledge\n- Treat all children fairly (no favoritism)\n- Be kind and merciful — the Prophet kissed his grandchildren and said: \"Whoever does not show mercy will not be shown mercy\"\n\n**Rights of children:** To be provided for, educated, treated with love, given a good upbringing, and taught the skills they need.\n\nThe Prophet said: \"Each of you is a shepherd and each of you is responsible for his flock.\"",
      sources: ["Quran 66:6", "Sahih al-Bukhari 5997", "Sahih Muslim 1829", "Abu Dawud 495"],
      category: 'family',
      related: ['marriage', 'prayer']
    },
    hijab: {
      text: "Hijab refers to modest dress and behavior in Islam, applicable to both men and women.\n\n**For women:** Covering the entire body except the face and hands in front of non-mahram men. The clothing should be loose, not transparent, not resembling men's clothing, and not be a source of vanity.\n\n**For men:** Must cover from the navel to the knee at minimum. Should dress modestly and lower their gaze.\n\n**Quranic basis:** \"And tell the believing women to lower their gaze and guard their chastity, and not to reveal their adornments except what normally appears, and let them draw their veils over their chests.\" (24:31)\n\n**Hijab is broader than clothing:** It encompasses behavior, speech, gaze, and interaction. It is about modesty, dignity, and obedience to Allah.\n\nThe hijab is a choice of faith, not oppression. Many Muslim women describe it as liberating — being valued for their character and intellect rather than appearance.",
      sources: ["Quran 24:30-31", "Quran 33:59", "Sahih al-Bukhari 5885"],
      category: 'family',
      related: ['prayer', 'taqwa']
    },

    // === FINANCE ===
    riba: {
      text: "Riba (interest/usury) is strictly prohibited in Islam. It is one of the major sins, mentioned alongside the gravest transgressions.\n\nAllah says: \"Allah has permitted trade and has forbidden interest.\" And: \"O you who believe, fear Allah and give up what remains of interest, if you are true believers.\"\n\nThe Prophet (PBUH) cursed the one who consumes Riba, the one who pays it, the one who writes the contract, and the two witnesses.\n\n**Why is it forbidden?**\n- It creates unfair wealth accumulation\n- It exploits those in need\n- It increases inequality\n- Money should grow through real economic activity, not lending\n\n**Islamic alternatives:** Profit-sharing (Mudarabah), partnership (Musharakah), cost-plus financing (Murabahah), leasing (Ijarah). These involve shared risk and are tied to real assets or services.",
      sources: ["Quran 2:275-279", "Quran 3:130", "Sahih Muslim 1598"],
      category: 'finance',
      related: ['islamic_finance', 'zakat', 'halal_haram']
    },
    islamic_finance: {
      text: "Islamic finance is a system of banking and financial services that operates in accordance with Shariah (Islamic law).\n\n**Core principles:**\n1. **No Riba (interest)** — Money cannot generate money through lending alone\n2. **Risk sharing** — Profit and loss shared between parties\n3. **Asset-backed transactions** — Must be tied to real economic activity\n4. **No excessive uncertainty (Gharar)** — Clear terms and conditions\n5. **No harmful activities (Haram)** — No alcohol, gambling, tobacco, weapons industry\n\n**Common Islamic finance instruments:**\n- **Murabahah** — Cost-plus financing (bank buys item, sells to you at a markup with installments)\n- **Mudarabah** — Profit-sharing partnership\n- **Musharakah** — Joint venture with shared profits and losses\n- **Ijarah** — Leasing arrangement\n- **Sukuk** — Islamic bonds (asset-backed securities)\n- **Takaful** — Islamic cooperative insurance",
      sources: ["Quran 2:275", "Quran 4:29"],
      category: 'finance',
      related: ['riba', 'zakat', 'halal_haram']
    },

    // === DAILY LIFE ===
    halal_haram: {
      text: "Halal (permissible) and Haram (forbidden) are fundamental concepts in Islamic law.\n\n**General principle:** Everything is Halal by default unless specifically prohibited. The prohibited things are few compared to what is permissible.\n\n**Major Haram actions:**\n- Shirk (associating partners with Allah)\n- Murder, theft, fraud\n- Adultery and fornication\n- Consuming alcohol and intoxicants\n- Gambling\n- Eating pork or improperly slaughtered meat\n- Riba (interest/usury)\n- Lying, backbiting, slander\n- Magic and fortune-telling\n- Disrespecting parents\n\n**The Prophet's guidance:** \"The halal is clear and the haram is clear, and between them are doubtful matters. Whoever avoids the doubtful matters has safeguarded his religion and his honor.\"\n\nWhen in doubt, it is better to abstain. Consult knowledgeable scholars for specific rulings.",
      sources: ["Quran 2:168", "Quran 5:3", "Sahih al-Bukhari 52", "Sahih Muslim 1599"],
      category: 'fiqh',
      related: ['halal_food', 'riba', 'taqwa']
    },
    halal_food: {
      text: "Islamic dietary guidelines are based on the Quran and Sunnah.\n\n**Forbidden foods:**\n- Pork and its derivatives\n- Blood\n- Carrion (dead animals not slaughtered properly)\n- Animals slaughtered in other than Allah's name\n- Alcohol and intoxicants\n- Predatory animals with fangs (lions, dogs, etc.)\n- Birds of prey with talons (eagles, hawks, etc.)\n- Animals not slaughtered by Zabiha method\n\n**Zabiha (Islamic slaughter):**\n- Slaughterer must be Muslim, Christian, or Jewish\n- Say \"Bismillah, Allahu Akbar\" at time of slaughter\n- Use a sharp knife for quick, humane cut\n- Cut the throat, windpipe, and blood vessels\n- Allow blood to drain completely\n\n**Seafood:** Fish is Halal even without slaughter (according to majority of scholars). The Hanafi school excludes shellfish.\n\n**Dua before eating:** \"Bismillah\" (In the name of Allah). After eating: \"Alhamdulillahi alladhi at'amana wa saqana wa ja'alana Muslimeen.\"",
      sources: ["Quran 2:173", "Quran 5:3-5", "Quran 6:118-119", "Sahih al-Bukhari 5376"],
      category: 'daily',
      related: ['halal_haram', 'dua']
    },
    dua: {
      text: "Dua (supplication) is the essence of worship — a direct conversation with Allah. No intermediary is needed.\n\n**Best times for Dua:**\n- Last third of the night (before Fajr)\n- Between Adhan and Iqamah\n- While prostrating (Sujood) in prayer\n- On Fridays (especially the last hour before Maghrib)\n- While fasting, before breaking the fast\n- During rain\n- When traveling\n- Laylatul Qadr\n\n**Etiquette of Dua:**\n1. Begin with praise of Allah and Salawat on the Prophet\n2. Face the Qiblah if possible\n3. Raise your hands\n4. Be sincere and humble\n5. Ask with certainty that Allah will answer\n6. Be persistent — don't give up\n7. End with Salawat on the Prophet and Ameen\n\nThe Prophet (PBUH) said: \"Dua is worship\" and \"Nothing repels divine decree like Dua.\"",
      sources: ["Quran 2:186", "Quran 40:60", "Jami at-Tirmidhi 3479", "Ahmad 10749"],
      category: 'daily',
      related: ['dhikr', 'prayer', 'tahajjud']
    },
    death_islam: {
      text: "Islam provides comprehensive guidance on death, dying, and mourning.\n\n**When someone is dying:**\n- Turn them to face the Qiblah\n- Remind them gently to say the Shahada\n- Recite Surah Ya-Sin\n\n**After death:**\n- Close the eyes, cover the body\n- Hasten the burial process\n- Perform Ghusl (washing) of the body\n- Shroud in white cloth (Kafan): 3 pieces for men, 5 for women\n- Perform Salatul Janazah\n- Bury in a Muslim cemetery, on the right side facing Qiblah\n\n**Mourning period:** 3 days for general mourning. A widow mourns for 4 months and 10 days (Iddah).\n\n**What is NOT allowed:** Wailing loudly, tearing clothes, striking oneself, building elaborate tombs. Grief and crying are natural and permitted.\n\n**What benefits the deceased:** Dua from the living, ongoing charity (Sadaqah Jariyah), knowledge they left behind, and a righteous child who prays for them.",
      sources: ["Sahih Muslim 920", "Sahih al-Bukhari 1254", "Sahih Muslim 1631", "Quran 2:234"],
      category: 'daily',
      related: ['janazah', 'afterlife', 'sadaqah']
    },

    // === HISTORY & SECTS ===
    sunni_shia: {
      text: "The major branches of Islam are Sunni (approximately 85-90% of Muslims) and Shia (approximately 10-15%).\n\n**Historical origin:** The split originated after the Prophet's (PBUH) death over the question of leadership. Sunnis accepted Abu Bakr as the first Caliph (chosen by consensus), while Shia believed leadership should have gone directly to Ali ibn Abi Talib (the Prophet's cousin and son-in-law).\n\n**Sunni Islam:** Follows the Quran, Sunnah, and the consensus of the Companions. Four major schools of jurisprudence: Hanafi, Maliki, Shafi'i, and Hanbali.\n\n**Shia Islam:** Places special emphasis on the Ahl al-Bayt (Prophet's household). Follows Twelve Imams descended from Ali and Fatimah. Major sub-groups: Twelver (majority), Ismaili, and Zaydi.\n\n**Common ground:** Both groups agree on the Quran, the five pillars, belief in one God, prophethood of Muhammad (PBUH), and the Day of Judgment. The differences are primarily in jurisprudence, hadith methodology, and leadership theology.",
      sources: ["Historical references"],
      category: 'history',
      related: ['caliphs', 'companions', 'islamic_history']
    },
    sufism: {
      text: "Sufism (Tasawwuf) is the spiritual and mystical dimension of Islam, focused on inner purification of the heart and closeness to Allah.\n\n**Core concepts:**\n- **Ihsan** — Worshipping Allah as though you see Him; even though you don't see Him, He sees you\n- **Tazkiyah** — Purification of the soul from negative traits\n- **Dhikr** — Constant remembrance of Allah\n- **Muraqabah** — Self-awareness and vigilance over one's spiritual state\n\n**Famous Sufi scholars:**\n- Hasan al-Basri (d. 728 CE) — early ascetic\n- Rabi'a al-Adawiyya — pioneered the concept of divine love\n- Al-Ghazali (d. 1111 CE) — \"Ihya Ulum al-Din\" (Revival of Religious Sciences)\n- Jalaluddin Rumi (d. 1273 CE) — renowned poet and mystic\n- Ibn Arabi (d. 1240 CE) — profound metaphysical writings\n\n**Important note:** Authentic Tasawwuf is rooted in the Quran and Sunnah. Scholars distinguish between legitimate spiritual development and practices that deviate from Islamic teachings.",
      sources: ["Sahih Muslim 8 (Hadith of Jibreel — Ihsan)", "Quran 13:28"],
      category: 'history',
      related: ['dhikr', 'taqwa', 'iman']
    },
    islamic_history: {
      text: "A brief overview of major Islamic historical periods:\n\n**1. Prophetic Era (610-632 CE):** Revelation, establishment of Islam in Makkah and Madinah.\n\n**2. Rashidun Caliphate (632-661 CE):** Four Rightly Guided Caliphs. Islam expanded to Persia, Egypt, and Syria.\n\n**3. Umayyad Caliphate (661-750 CE):** Islam spread to Spain, North Africa, and Central Asia. Arabic became the administrative language.\n\n**4. Abbasid Caliphate (750-1258 CE):** The Islamic Golden Age. Baghdad as the center of learning. Advances in science, medicine, mathematics, and philosophy.\n\n**5. Ottoman Empire (1299-1922 CE):** Longest-lasting Islamic empire. Controlled vast territories across three continents.\n\n**6. Other notable empires:** Mughal Empire (South Asia), Safavid Empire (Persia), Fatimid Caliphate (North Africa/Egypt).\n\nIslamic civilization made foundational contributions to algebra, astronomy, medicine, optics, chemistry, geography, and philosophy.",
      sources: ["Historical references"],
      category: 'history',
      related: ['caliphs', 'golden_age']
    },
    golden_age: {
      text: "The Islamic Golden Age (roughly 8th-14th century CE) was a period of extraordinary cultural, scientific, and intellectual achievement.\n\n**Notable Muslim scholars and their contributions:**\n- **Al-Khwarizmi** (d. 850) — Father of Algebra, algorithms named after him\n- **Ibn Sina (Avicenna)** (d. 1037) — \"Canon of Medicine\" was THE medical textbook in Europe for 600 years\n- **Al-Biruni** (d. 1048) — Calculated Earth's circumference with remarkable accuracy\n- **Ibn al-Haytham (Alhazen)** (d. 1040) — Father of Optics, pioneered the scientific method\n- **Al-Razi** (d. 925) — Distinguished between smallpox and measles, pioneer of pediatrics\n- **Al-Idrisi** (d. 1165) — Created the most accurate world map of his time\n- **Al-Jazari** (d. 1206) — Father of Robotics, invented programmable automata\n- **Ibn Khaldun** (d. 1406) — Father of Sociology and Historiography\n\n**Centers of learning:** Baghdad's House of Wisdom (Bayt al-Hikmah), Cordoba, Cairo, Samarkand, and many more.",
      sources: ["Historical references"],
      category: 'history',
      related: ['islamic_history', 'quran']
    },

    // === MISC ===
    conversion: {
      text: "Becoming Muslim is simple and beautiful. All it requires is sincere belief and reciting the Shahada:\n\n**Arabic:** أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ\n\n**Transliteration:** \"Ash-hadu an la ilaha illa-Allah, wa ash-hadu anna Muhammadan rasulullah\"\n\n**Meaning:** \"I bear witness that there is no god but Allah, and I bear witness that Muhammad is the Messenger of Allah.\"\n\n**After taking Shahada:**\n- Take a Ghusl (full body wash)\n- Learn the basics of prayer and start praying\n- Learn to read Surah Al-Fatihah\n- Connect with a local mosque community\n- Take it step by step — Allah does not burden a soul beyond its capacity\n- All previous sins are forgiven — you start with a clean slate!\n\nThe term \"revert\" is often used because Islam teaches that every person is born with a natural inclination (Fitrah) toward recognizing Allah.",
      sources: ["Quran 3:19", "Quran 2:256", "Sahih Muslim 121", "Sahih al-Bukhari 41"],
      category: 'aqeedah',
      related: ['shahada', 'prayer', 'wudu', 'five_pillars']
    },
    bidah: {
      text: "Bid'ah refers to innovations in religious matters — introducing new acts of worship not practiced or sanctioned by the Prophet (PBUH).\n\nThe Prophet said: \"Whoever introduces something in this matter of ours (Islam) that is not from it, it will be rejected.\" And: \"Every newly-invented thing is an innovation, every innovation is going astray, and every going astray is in the Fire.\"\n\n**Important distinction:** This applies to religious matters (worship, beliefs, rituals). Worldly innovations (technology, medicine, science) are NOT Bid'ah.\n\n**Examples scholars consider Bid'ah:** Celebrating the Prophet's birthday (Mawlid) — scholars differ on this; adding to prayer rituals; inventing new forms of worship not found in Quran/Sunnah.\n\n**Note:** There is scholarly disagreement on what constitutes Bid'ah. Some scholars distinguish between \"good\" Bid'ah (Bid'ah Hasanah) and \"bad\" Bid'ah (Bid'ah Sayyi'ah), while others consider all Bid'ah in worship to be rejected.",
      sources: ["Sahih al-Bukhari 2697", "Sahih Muslim 1718", "Sunan an-Nasa'i 1578"],
      category: 'fiqh',
      related: ['hadith', 'five_pillars']
    },
    shirk: {
      text: "Shirk is the unforgivable sin of associating partners with Allah — it is the opposite of Tawhid.\n\nAllah says: \"Indeed, Allah does not forgive association with Him, but He forgives what is less than that for whom He wills.\"\n\n**Types of Shirk:**\n\n**Major Shirk (nullifies faith):**\n- Worshipping other than Allah (idols, graves, saints)\n- Praying to or seeking help from the dead\n- Believing anyone shares Allah's attributes of creation, sustaining, or sovereignty\n- Making vows or sacrifices to other than Allah\n\n**Minor Shirk (does not nullify faith but is a serious sin):**\n- Showing off in worship (Riya')\n- Swearing by other than Allah\n- Saying \"If Allah and so-and-so wills\" (correct: \"If Allah wills, then so-and-so\")\n\n**Hidden Shirk:** The Prophet feared for his Ummah the minor shirk of showing off (Riya'). He advised: \"O Allah, I seek refuge in You from knowingly committing Shirk, and I seek Your forgiveness for what I do not know.\"",
      sources: ["Quran 4:48", "Quran 4:116", "Sahih Muslim 2985", "Ahmad 15639"],
      category: 'aqeedah',
      related: ['tawhid', 'iman', 'repentance']
    },
    islamic_calendar: {
      text: "The Islamic (Hijri) calendar is a lunar calendar with 12 months, used to determine Islamic holidays and obligations.\n\n**The 12 months:**\n1. **Muharram** — Sacred month, includes Ashura (10th)\n2. **Safar**\n3. **Rabi al-Awwal** — Prophet's birth month\n4. **Rabi al-Thani**\n5. **Jumada al-Ula**\n6. **Jumada al-Thani**\n7. **Rajab** — Sacred month, month of Isra and Mi'raj\n8. **Sha'ban** — Month before Ramadan, Night of Bara'ah (15th)\n9. **Ramadan** — Month of fasting and Quran\n10. **Shawwal** — Eid al-Fitr (1st), 6 days of fasting recommended\n11. **Dhul Qa'dah** — Sacred month\n12. **Dhul Hijjah** — Sacred month, Hajj, Eid al-Adha (10th), best first 10 days\n\n**Sacred months:** Muharram, Rajab, Dhul Qa'dah, and Dhul Hijjah — fighting was traditionally forbidden in these months.\n\nThe Hijri calendar began with the Prophet's migration (Hijra) to Madinah in 622 CE, established during the caliphate of Umar (RA).",
      sources: ["Quran 9:36", "Sahih al-Bukhari 4662", "Sahih Muslim 1679"],
      category: 'daily',
      related: ['ramadan', 'hajj', 'hijra']
    }
  },

  // ---- Smart Search Engine ----
  search(query) {
    if (!query || !query.trim()) return null;
    var q = query.toLowerCase().trim();

    // Step 1: Try direct synonym match
    var matchedKey = this._findBestMatch(q);
    if (matchedKey && this.knowledge[matchedKey]) {
      return this._formatResponse(matchedKey);
    }

    // Step 2: Try partial word matching across all synonym keys
    var bestScore = 0;
    var bestKey = null;
    var synonymKeys = Object.keys(this.synonyms);
    for (var i = 0; i < synonymKeys.length; i++) {
      var syn = synonymKeys[i];
      if (q.indexOf(syn) >= 0) {
        var score = syn.length; // longer matches are better
        if (score > bestScore) {
          bestScore = score;
          bestKey = this.synonyms[syn];
        }
      }
    }
    if (bestKey && this.knowledge[bestKey]) {
      return this._formatResponse(bestKey);
    }

    // Step 3: Try matching against knowledge base keys directly
    var knowledgeKeys = Object.keys(this.knowledge);
    for (var i = 0; i < knowledgeKeys.length; i++) {
      var key = knowledgeKeys[i];
      var keyWords = key.replace(/_/g, ' ');
      if (q.indexOf(keyWords) >= 0 || keyWords.indexOf(q) >= 0) {
        return this._formatResponse(key);
      }
    }

    // Step 4: Fuzzy search — split query into words and score each topic
    var queryWords = q.split(/\s+/).filter(function(w) { return w.length > 2; });
    if (queryWords.length > 0) {
      var scores = {};
      // Score against synonyms
      for (var i = 0; i < synonymKeys.length; i++) {
        var syn = synonymKeys[i];
        var synWords = syn.split(/\s+/);
        for (var j = 0; j < queryWords.length; j++) {
          for (var k = 0; k < synWords.length; k++) {
            if (synWords[k].indexOf(queryWords[j]) >= 0 || queryWords[j].indexOf(synWords[k]) >= 0) {
              var topicKey = this.synonyms[syn];
              scores[topicKey] = (scores[topicKey] || 0) + queryWords[j].length;
            }
          }
        }
      }
      // Score against knowledge text content
      for (var i = 0; i < knowledgeKeys.length; i++) {
        var key = knowledgeKeys[i];
        var text = this.knowledge[key].text.toLowerCase();
        for (var j = 0; j < queryWords.length; j++) {
          if (text.indexOf(queryWords[j]) >= 0) {
            scores[key] = (scores[key] || 0) + queryWords[j].length * 0.5;
          }
        }
      }
      // Find the best scoring topic
      var topKey = null;
      var topScore = 0;
      var scoreKeys = Object.keys(scores);
      for (var i = 0; i < scoreKeys.length; i++) {
        if (scores[scoreKeys[i]] > topScore) {
          topScore = scores[scoreKeys[i]];
          topKey = scoreKeys[i];
        }
      }
      if (topKey && this.knowledge[topKey] && topScore >= 3) {
        return this._formatResponse(topKey);
      }
    }

    // Step 5: No match found
    return null;
  },

  _findBestMatch(q) {
    // Exact match first
    if (this.synonyms[q]) return this.synonyms[q];
    if (this.knowledge[q]) return q;

    // Try multi-word synonym match (longest match wins)
    var bestLen = 0;
    var bestKey = null;
    var synonymKeys = Object.keys(this.synonyms);
    for (var i = 0; i < synonymKeys.length; i++) {
      var syn = synonymKeys[i];
      if (syn.length > 2 && q.indexOf(syn) >= 0 && syn.length > bestLen) {
        bestLen = syn.length;
        bestKey = this.synonyms[syn];
      }
    }
    return bestKey;
  },

  _formatResponse(key) {
    var entry = this.knowledge[key];
    if (!entry) return null;
    return {
      key: key,
      text: entry.text,
      sources: entry.sources || [],
      category: entry.category || '',
      related: (entry.related || []).filter(function(r) { return r !== key; }).slice(0, 4)
    };
  },

  // ---- Live Quran Verse Lookup ----
  async fetchQuranVerse(surah, ayah) {
    try {
      var url = 'https://api.alquran.cloud/v1/ayah/' + surah + ':' + ayah + '/editions/quran-uthmani,en.sahih';
      var res = await fetch(url);
      var data = await res.json();
      if (data.code === 200 && data.data && data.data.length >= 2) {
        return {
          arabic: data.data[0].text,
          translation: data.data[1].text,
          surah: data.data[0].surah.englishName,
          surahArabic: data.data[0].surah.name,
          ayah: data.data[0].numberInSurah,
          reference: data.data[0].surah.englishName + ' ' + surah + ':' + ayah
        };
      }
    } catch(e) {
      console.warn('Quran API error:', e);
    }
    return null;
  },

  // ---- Live Hadith Search ----
  async searchHadith(query) {
    // Uses sunnah.com or hadithapi.com
    // Since these require API keys, we provide curated hadith references inline instead
    return null;
  },

  // Get random suggested questions
  getRandomSuggestions(count) {
    var shuffled = this.suggestedQuestions.slice();
    for (var i = shuffled.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = temp;
    }
    return shuffled.slice(0, count || 4);
  },

  // Get topic name from key
  getTopicName(key) {
    return key.replace(/_/g, ' ').replace(/\b\w/g, function(l) { return l.toUpperCase(); });
  }
};
