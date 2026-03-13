/* ============================================================
   DeenHub PWA — Internationalization (i18n) System
   48+ Languages · RTL Support · Auto-detect
   ============================================================ */

const I18n = {
  currentLang: 'en',
  rtlLanguages: ['ar', 'ur', 'fa', 'ps', 'sd', 'ug', 'dv', 'ku'],

  // All supported UI languages
  supportedLanguages: [
    { code: 'en', name: 'English', native: 'English', flag: '🇬🇧', dir: 'ltr' },
    { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦', dir: 'rtl' },
    { code: 'ur', name: 'Urdu', native: 'اردو', flag: '🇵🇰', dir: 'rtl' },
    { code: 'bn', name: 'Bangla', native: 'বাংলা', flag: '🇧🇩', dir: 'ltr' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
    { code: 'tr', name: 'Turkish', native: 'Türkçe', flag: '🇹🇷', dir: 'ltr' },
    { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷', dir: 'ltr' },
    { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸', dir: 'ltr' },
    { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
    { code: 'ru', name: 'Russian', native: 'Русский', flag: '🇷🇺', dir: 'ltr' },
    { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia', flag: '🇮🇩', dir: 'ltr' },
    { code: 'ms', name: 'Malay', native: 'Bahasa Melayu', flag: '🇲🇾', dir: 'ltr' },
    { code: 'fa', name: 'Persian', native: 'فارسی', flag: '🇮🇷', dir: 'rtl' },
    { code: 'zh', name: 'Chinese', native: '中文', flag: '🇨🇳', dir: 'ltr' },
    { code: 'ja', name: 'Japanese', native: '日本語', flag: '🇯🇵', dir: 'ltr' },
    { code: 'ko', name: 'Korean', native: '한국어', flag: '🇰🇷', dir: 'ltr' },
    { code: 'it', name: 'Italian', native: 'Italiano', flag: '🇮🇹', dir: 'ltr' },
    { code: 'pt', name: 'Portuguese', native: 'Português', flag: '🇧🇷', dir: 'ltr' },
    { code: 'nl', name: 'Dutch', native: 'Nederlands', flag: '🇳🇱', dir: 'ltr' },
    { code: 'sv', name: 'Swedish', native: 'Svenska', flag: '🇸🇪', dir: 'ltr' },
    { code: 'pl', name: 'Polish', native: 'Polski', flag: '🇵🇱', dir: 'ltr' },
    { code: 'th', name: 'Thai', native: 'ไทย', flag: '🇹🇭', dir: 'ltr' },
    { code: 'sw', name: 'Swahili', native: 'Kiswahili', flag: '🇹🇿', dir: 'ltr' },
    { code: 'so', name: 'Somali', native: 'Soomaali', flag: '🇸🇴', dir: 'ltr' },
    { code: 'ha', name: 'Hausa', native: 'Hausa', flag: '🇳🇬', dir: 'ltr' },
    { code: 'sq', name: 'Albanian', native: 'Shqip', flag: '🇦🇱', dir: 'ltr' },
    { code: 'bs', name: 'Bosnian', native: 'Bosanski', flag: '🇧🇦', dir: 'ltr' },
    { code: 'az', name: 'Azerbaijani', native: 'Azərbaycan', flag: '🇦🇿', dir: 'ltr' },
    { code: 'uz', name: 'Uzbek', native: "O'zbek", flag: '🇺🇿', dir: 'ltr' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳', dir: 'ltr' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳', dir: 'ltr' },
    { code: 'ne', name: 'Nepali', native: 'नेपाली', flag: '🇳🇵', dir: 'ltr' },
    { code: 'ro', name: 'Romanian', native: 'Română', flag: '🇷🇴', dir: 'ltr' },
    { code: 'bg', name: 'Bulgarian', native: 'Български', flag: '🇧🇬', dir: 'ltr' },
    { code: 'no', name: 'Norwegian', native: 'Norsk', flag: '🇳🇴', dir: 'ltr' },
    { code: 'cs', name: 'Czech', native: 'Čeština', flag: '🇨🇿', dir: 'ltr' },
    { code: 'ps', name: 'Pashto', native: 'پښتو', flag: '🇦🇫', dir: 'rtl' },
    { code: 'sd', name: 'Sindhi', native: 'سنڌي', flag: '🇵🇰', dir: 'rtl' },
    { code: 'ku', name: 'Kurdish', native: 'Kurdî', flag: '🇮🇶', dir: 'rtl' },
    { code: 'tt', name: 'Tatar', native: 'Татарча', flag: '🇷🇺', dir: 'ltr' }
  ],

  // ── Translation strings ──
  strings: {
    // ══════════════════════════════════════════════
    //  ENGLISH (Default / Fallback)
    // ══════════════════════════════════════════════
    en: {
      // App
      appName: 'DeenHub',
      appSubtitle: 'Your Islamic Companion',
      // Tabs
      home: 'Home',
      quran: 'Quran',
      hadith: 'Hadith',
      ai: 'AI',
      ummah: 'Ummah',
      profile: 'Profile',
      // Home
      nextPrayer: '✦ NEXT PRAYER ✦',
      quickActions: 'Quick Actions',
      dailyVerse: 'Daily Verse',
      dayStreak: 'Day Streak',
      prayersLogged: 'prayers logged',
      level: 'Level',
      xpEarned: 'XP earned',
      xpToNext: 'XP to next level',
      // Prayers
      fajr: 'Fajr', dhuhr: 'Dhuhr', asr: 'Asr', maghrib: 'Maghrib', isha: 'Isha',
      sunrise: 'Sunrise',
      // Quick actions
      tasbih: 'Tasbih',
      azan: 'Azan',
      qibla: 'Qibla',
      duas: 'Duas',
      zakat: 'Zakat',
      calendar: 'Calendar',
      aiScholar: 'AI Scholar',
      // Quran
      surah: 'Surah',
      juz: 'Juz',
      bookmarks: 'Bookmarks',
      searchSurahs: 'Search surahs...',
      continueReading: 'Continue Reading',
      surahsStarted: 'surahs started',
      ayahs: 'ayahs',
      transliteration: 'Transliteration',
      wordByWord: 'Word-by-Word',
      tajweed: 'Tajweed',
      speed: 'Speed',
      repeat: 'Repeat',
      previousSurah: '← Previous Surah',
      nextSurah: 'Next Surah →',
      addedBookmark: 'Added to bookmarks',
      removedBookmark: 'Removed from bookmarks',
      copiedClipboard: 'Ayah copied to clipboard',
      // Tajweed
      ghunna: 'Ghunna', idgham: 'Idgham', ikhfaa: 'Ikhfaa',
      iqlab: 'Iqlab', qalqalah: 'Qalqalah', madd: 'Madd',
      // Hadith
      propheticHadith: 'Prophetic Hadith',
      searchHadith: 'Search hadith...',
      noHadithFound: 'No hadith found matching your search.',
      narrator: 'Narrator',
      // AI
      islamicScholar: 'Islamic Scholar',
      askAboutIslam: 'Ask about Islam...',
      aiGreeting: "As-salamu alaykum! I'm your AI Islamic Scholar. Ask me anything about Islam — prayer, Quran, Hadith, fiqh, history, and more.",
      // Tasbih
      glorification: 'Glorification',
      lifetimeTotal: 'Lifetime Total',
      keepGlorifying: 'Keep glorifying Allah',
      reset: 'Reset',
      target: 'Target',
      tap: 'TAP',
      completed: 'Completed',
      // Qibla
      qiblaDirection: 'Qibla Direction',
      directionToMakkah: 'Direction to Makkah',
      pointDevice: 'Point your device north, then face the needle direction',
      yourLocation: 'Your Location',
      distanceToKaaba: 'Distance to Kaaba',
      // Duas
      supplications: 'Supplications',
      fromHisnulMuslim: 'supplications from Hisnul Muslim',
      playingDua: 'Playing dua recitation',
      readingMode: 'Reading mode — follow the highlighted words',
      duaCopied: 'Dua copied to clipboard',
      addedFavorites: 'Added to favorites',
      removedFavorites: 'Removed from favorites',
      // Zakat
      purificationWealth: 'Purification of Wealth',
      nisabThreshold: 'Nisab Threshold',
      nisabDescription: '2.5% of qualifying wealth held for one lunar year',
      calculateZakat: 'Calculate Your Zakat',
      goldJewelry: 'Gold & Jewelry Value ($)',
      silverValue: 'Silver Value ($)',
      cashBank: 'Cash & Bank Balances ($)',
      stocksInvest: 'Stocks & Investments ($)',
      businessRental: 'Business / Rental Property ($)',
      debtsLiabilities: 'Debts & Liabilities ($)',
      calculateBtn: 'Calculate Zakat',
      yourZakatDue: 'Your Zakat Due',
      belowNisab: 'Below Nisab Threshold',
      netAssets: 'Net assets',
      nisab: 'Nisab',
      // Calendar
      hijriCalendar: 'Hijri Calendar',
      islamicDate: 'Islamic Date',
      eventsThisMonth: 'Events This Month',
      sun: 'Sun', mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat',
      ramadanBegins: 'Ramadan begins',
      laylatAlQadr: 'Laylat al-Qadr',
      eidAlFitr: 'Eid al-Fitr',
      eidAlAdha: 'Eid al-Adha',
      islamicNewYear: 'Islamic New Year',
      // Community
      theUmmah: 'The Ummah',
      feed: 'Feed',
      events: 'Events',
      mosques: 'Mosques',
      share: 'Share',
      rsvp: 'RSVP',
      join: 'Join',
      register: 'Register',
      // Azan
      azanPlayer: 'Azan Player',
      azanSubtitle: '12 beautiful Azan recordings from around the world',
      nowPlaying: 'Now playing — tap to stop',
      tapToPlay: 'Tap to play Azan',
      chooseMuezzin: '✦ Choose Muezzin',
      autoAzanSettings: '✦ Auto Azan Settings',
      autoAzan: 'Auto Azan at Prayer Times',
      autoAzanDesc: 'When enabled, Azan will play automatically at each prayer time',
      perPrayerToggle: 'Per-Prayer Toggle',
      browserNotif: 'Browser Notifications',
      fullScreenAzan: 'Full-Screen Azan Display',
      vibration: 'Vibration',
      testAzan: 'Test Full Azan Experience',
      azanFooter: 'Audio sourced from Internet Archive · Free for personal use',
      // Profile
      achievements: 'Achievements',
      azanSettings: 'Azan Settings',
      settings: 'Settings',
      darkMode: 'Dark Mode',
      language: 'Language',
      privacyFirst: 'PRIVACY FIRST',
      privacyDesc: 'All data stays on your device. Zero tracking. Zero data collection.',
      builtWithLove: 'Built with ❤️ for the Ummah',
      // Achievement names
      achFirstPrayer: 'First Prayer',
      achFirstPrayerDesc: 'Log your first prayer',
      ach7DayStreak: '7-Day Streak',
      ach7DayStreakDesc: 'Maintain a 7-day streak',
      achQuranReader: 'Quran Reader',
      achQuranReaderDesc: 'Read a complete surah',
      achDhikrDevotee: 'Dhikr Devotee',
      achDhikrDevoteeDesc: 'Complete 100 tasbih',
      achDhikrMaster: 'Dhikr Master',
      achDhikrMasterDesc: 'Complete 1,000 tasbih',
      achZakat: 'Zakat Calculator',
      achZakatDesc: 'Calculate your zakat',
      achKnowledge: 'Knowledge Seeker',
      achKnowledgeDesc: 'Ask the AI Scholar',
      unlocked: 'Unlocked!'
    },

    // ══════════════════════════════════════════════
    //  ARABIC (العربية)
    // ══════════════════════════════════════════════
    ar: {
      appName: 'دين هب',
      appSubtitle: 'رفيقك الإسلامي',
      home: 'الرئيسية', quran: 'القرآن', hadith: 'الحديث', ai: 'الذكاء', ummah: 'الأمة', profile: 'الملف',
      nextPrayer: '✦ الصلاة القادمة ✦',
      quickActions: 'إجراءات سريعة',
      dailyVerse: 'آية اليوم',
      dayStreak: 'أيام متتالية',
      prayersLogged: 'صلاة مسجلة',
      level: 'المستوى',
      xpEarned: 'نقاط مكتسبة',
      xpToNext: 'نقاط للمستوى التالي',
      fajr: 'الفجر', dhuhr: 'الظهر', asr: 'العصر', maghrib: 'المغرب', isha: 'العشاء',
      sunrise: 'الشروق',
      tasbih: 'تسبيح', azan: 'أذان', qibla: 'قبلة', duas: 'أدعية', zakat: 'زكاة', calendar: 'التقويم', aiScholar: 'عالم الذكاء',
      surah: 'سورة', juz: 'جزء', bookmarks: 'المفضلة',
      searchSurahs: 'ابحث في السور...',
      continueReading: 'متابعة القراءة',
      surahsStarted: 'سور بدأت',
      ayahs: 'آيات',
      transliteration: 'نقحرة',
      wordByWord: 'كلمة بكلمة',
      tajweed: 'تجويد',
      speed: 'السرعة',
      repeat: 'تكرار',
      previousSurah: '← السورة السابقة',
      nextSurah: 'السورة التالية →',
      addedBookmark: 'أُضيف إلى المفضلة',
      removedBookmark: 'أُزيل من المفضلة',
      copiedClipboard: 'تم نسخ الآية',
      ghunna: 'غنة', idgham: 'إدغام', ikhfaa: 'إخفاء',
      iqlab: 'إقلاب', qalqalah: 'قلقلة', madd: 'مد',
      propheticHadith: 'الحديث النبوي',
      searchHadith: 'ابحث في الأحاديث...',
      noHadithFound: 'لم يتم العثور على أحاديث.',
      narrator: 'الراوي',
      islamicScholar: 'العالم الإسلامي',
      askAboutIslam: 'اسأل عن الإسلام...',
      aiGreeting: 'السلام عليكم! أنا عالمك الإسلامي بالذكاء الاصطناعي. اسألني أي شيء عن الإسلام.',
      glorification: 'التسبيح',
      lifetimeTotal: 'المجموع الكلي',
      keepGlorifying: 'واصل تسبيح الله',
      reset: 'إعادة',
      target: 'الهدف',
      tap: 'اضغط',
      completed: 'مكتمل',
      qiblaDirection: 'اتجاه القبلة',
      directionToMakkah: 'الاتجاه إلى مكة',
      pointDevice: 'وجّه جهازك نحو الشمال ثم اتّبع اتجاه الإبرة',
      yourLocation: 'موقعك',
      distanceToKaaba: 'المسافة إلى الكعبة',
      supplications: 'الأدعية',
      fromHisnulMuslim: 'أدعية من حصن المسلم',
      playingDua: 'جاري تشغيل الدعاء',
      readingMode: 'وضع القراءة — تابع الكلمات المُضاءة',
      duaCopied: 'تم نسخ الدعاء',
      addedFavorites: 'أُضيف إلى المفضلة',
      removedFavorites: 'أُزيل من المفضلة',
      purificationWealth: 'تزكية المال',
      nisabThreshold: 'حد النصاب',
      nisabDescription: '٢.٥٪ من المال المؤهل المحتفظ به لسنة قمرية',
      calculateZakat: 'احسب زكاتك',
      goldJewelry: 'قيمة الذهب والمجوهرات ($)',
      silverValue: 'قيمة الفضة ($)',
      cashBank: 'النقد والأرصدة البنكية ($)',
      stocksInvest: 'الأسهم والاستثمارات ($)',
      businessRental: 'العقارات التجارية ($)',
      debtsLiabilities: 'الديون والالتزامات ($)',
      calculateBtn: 'احسب الزكاة',
      yourZakatDue: 'زكاتك المستحقة',
      belowNisab: 'أقل من حد النصاب',
      netAssets: 'صافي الأصول',
      nisab: 'النصاب',
      hijriCalendar: 'التقويم الهجري',
      islamicDate: 'التاريخ الإسلامي',
      eventsThisMonth: 'أحداث هذا الشهر',
      sun: 'أحد', mon: 'إثنين', tue: 'ثلاثاء', wed: 'أربعاء', thu: 'خميس', fri: 'جمعة', sat: 'سبت',
      ramadanBegins: 'بداية رمضان',
      laylatAlQadr: 'ليلة القدر',
      eidAlFitr: 'عيد الفطر',
      eidAlAdha: 'عيد الأضحى',
      islamicNewYear: 'رأس السنة الهجرية',
      theUmmah: 'الأمة',
      feed: 'المنشورات', events: 'الأحداث', mosques: 'المساجد',
      share: 'مشاركة', rsvp: 'تأكيد', join: 'انضم', register: 'تسجيل',
      azanPlayer: 'مشغل الأذان',
      azanSubtitle: '١٢ تسجيل أذان جميل من حول العالم',
      nowPlaying: 'قيد التشغيل — اضغط للإيقاف',
      tapToPlay: 'اضغط لتشغيل الأذان',
      chooseMuezzin: '✦ اختر المؤذن',
      autoAzanSettings: '✦ إعدادات الأذان التلقائي',
      autoAzan: 'أذان تلقائي في أوقات الصلاة',
      autoAzanDesc: 'عند التفعيل، سيتم تشغيل الأذان تلقائياً في كل وقت صلاة',
      perPrayerToggle: 'تبديل لكل صلاة',
      browserNotif: 'إشعارات المتصفح',
      fullScreenAzan: 'عرض الأذان بملء الشاشة',
      vibration: 'الاهتزاز',
      testAzan: 'اختبار تجربة الأذان الكاملة',
      azanFooter: 'الصوت من أرشيف الإنترنت · مجاني للاستخدام الشخصي',
      achievements: 'الإنجازات',
      azanSettings: 'إعدادات الأذان',
      settings: 'الإعدادات',
      darkMode: 'الوضع الداكن',
      language: 'اللغة',
      privacyFirst: 'الخصوصية أولاً',
      privacyDesc: 'جميع البيانات تبقى على جهازك. بدون تتبع. بدون جمع بيانات.',
      builtWithLove: 'صُنع بـ ❤️ للأمة',
      achFirstPrayer: 'أول صلاة', achFirstPrayerDesc: 'سجّل أول صلاة لك',
      ach7DayStreak: '٧ أيام متتالية', ach7DayStreakDesc: 'حافظ على ٧ أيام متتالية',
      achQuranReader: 'قارئ القرآن', achQuranReaderDesc: 'اقرأ سورة كاملة',
      achDhikrDevotee: 'مُسبّح', achDhikrDevoteeDesc: 'أكمل ١٠٠ تسبيحة',
      achDhikrMaster: 'سيد الذكر', achDhikrMasterDesc: 'أكمل ١٠٠٠ تسبيحة',
      achZakat: 'حاسبة الزكاة', achZakatDesc: 'احسب زكاتك',
      achKnowledge: 'طالب العلم', achKnowledgeDesc: 'اسأل العالم الرقمي',
      unlocked: 'مُنجَز!'
    },

    // ══════════════════════════════════════════════
    //  URDU (اردو)
    // ══════════════════════════════════════════════
    ur: {
      appName: 'دین ہب',
      appSubtitle: 'آپ کا اسلامی ساتھی',
      home: 'ہوم', quran: 'قرآن', hadith: 'حدیث', ai: 'اے آئی', ummah: 'امت', profile: 'پروفائل',
      nextPrayer: '✦ اگلی نماز ✦',
      quickActions: 'فوری اعمال',
      dailyVerse: 'آج کی آیت',
      dayStreak: 'روزانہ سلسلہ',
      prayersLogged: 'نمازیں ریکارڈ',
      level: 'سطح',
      fajr: 'فجر', dhuhr: 'ظہر', asr: 'عصر', maghrib: 'مغرب', isha: 'عشاء',
      sunrise: 'طلوع آفتاب',
      tasbih: 'تسبیح', azan: 'اذان', qibla: 'قبلہ', duas: 'دعائیں', zakat: 'زکاة', calendar: 'تقویم', aiScholar: 'اے آئی عالم',
      surah: 'سورت', juz: 'پارہ', bookmarks: 'نشانیاں',
      searchSurahs: 'سورتیں تلاش کریں...',
      continueReading: 'پڑھنا جاری رکھیں',
      ayahs: 'آیات',
      transliteration: 'تلفظ',
      wordByWord: 'لفظ بلفظ',
      tajweed: 'تجوید',
      speed: 'رفتار',
      repeat: 'دوبارہ',
      previousSurah: '← پچھلی سورت',
      nextSurah: 'اگلی سورت →',
      propheticHadith: 'حدیث نبوی',
      searchHadith: 'حدیث تلاش کریں...',
      narrator: 'راوی',
      islamicScholar: 'اسلامی عالم',
      askAboutIslam: 'اسلام کے بارے میں پوچھیں...',
      aiGreeting: 'السلام علیکم! میں آپ کا اسلامی عالم ہوں۔ اسلام کے بارے میں کچھ بھی پوچھیں۔',
      glorification: 'تسبیح',
      lifetimeTotal: 'کل مجموعی',
      reset: 'ری سیٹ',
      target: 'ہدف',
      tap: 'تھپکی',
      qiblaDirection: 'قبلہ کی سمت',
      directionToMakkah: 'مکہ کی طرف',
      supplications: 'دعائیں',
      purificationWealth: 'مال کی تزکیہ',
      calculateZakat: 'اپنی زکاة حساب کریں',
      calculateBtn: 'زکاة حساب کریں',
      hijriCalendar: 'ہجری تقویم',
      islamicDate: 'اسلامی تاریخ',
      achievements: 'کامیابیاں',
      settings: 'ترتیبات',
      darkMode: 'ڈارک موڈ',
      language: 'زبان',
      privacyFirst: 'رازداری اولین',
      privacyDesc: 'تمام ڈیٹا آپ کے آلے پر رہتا ہے۔ کوئی ٹریکنگ نہیں۔',
      builtWithLove: '❤️ امت کے لیے بنایا گیا'
    },

    // ══════════════════════════════════════════════
    //  BANGLA (বাংলা)
    // ══════════════════════════════════════════════
    bn: {
      appName: 'দীনহাব',
      appSubtitle: 'আপনার ইসলামিক সঙ্গী',
      home: 'হোম', quran: 'কুরআন', hadith: 'হাদিস', ai: 'এআই', ummah: 'উম্মাহ', profile: 'প্রোফাইল',
      nextPrayer: '✦ পরবর্তী নামাজ ✦',
      quickActions: 'দ্রুত কাজ',
      dailyVerse: 'আজকের আয়াত',
      dayStreak: 'ধারাবাহিকতা',
      prayersLogged: 'নামাজ রেকর্ড',
      level: 'স্তর',
      fajr: 'ফজর', dhuhr: 'যোহর', asr: 'আসর', maghrib: 'মাগরিব', isha: 'ইশা',
      sunrise: 'সূর্যোদয়',
      tasbih: 'তাসবিহ', azan: 'আযান', qibla: 'কিবলা', duas: 'দোয়া', zakat: 'যাকাত', calendar: 'ক্যালেন্ডার', aiScholar: 'এআই আলেম',
      surah: 'সূরা', juz: 'পারা', bookmarks: 'বুকমার্ক',
      searchSurahs: 'সূরা খুঁজুন...',
      continueReading: 'পড়া চালিয়ে যান',
      ayahs: 'আয়াত',
      transliteration: 'প্রতিবর্ণীকরণ',
      wordByWord: 'শব্দে শব্দে',
      tajweed: 'তাজবীদ',
      speed: 'গতি',
      repeat: 'পুনরাবৃত্তি',
      propheticHadith: 'নবী হাদিস',
      searchHadith: 'হাদিস খুঁজুন...',
      islamicScholar: 'ইসলামিক আলেম',
      askAboutIslam: 'ইসলাম সম্পর্কে জিজ্ঞাসা করুন...',
      glorification: 'তাসবিহ',
      lifetimeTotal: 'মোট',
      reset: 'রিসেট',
      target: 'লক্ষ্য',
      tap: 'ট্যাপ',
      qiblaDirection: 'কিবলার দিক',
      directionToMakkah: 'মক্কার দিকে',
      supplications: 'দোয়াসমূহ',
      purificationWealth: 'সম্পদের পবিত্রতা',
      calculateZakat: 'আপনার যাকাত গণনা করুন',
      calculateBtn: 'যাকাত গণনা',
      hijriCalendar: 'হিজরি ক্যালেন্ডার',
      islamicDate: 'ইসলামিক তারিখ',
      achievements: 'অর্জন',
      settings: 'সেটিংস',
      darkMode: 'ডার্ক মোড',
      language: 'ভাষা',
      privacyFirst: 'গোপনীয়তা প্রথম',
      privacyDesc: 'সমস্ত ডেটা আপনার ডিভাইসে থাকে। কোনো ট্র্যাকিং নেই।',
      builtWithLove: '❤️ উম্মাহর জন্য তৈরি'
    },

    // ══════════════════════════════════════════════
    //  TURKISH (Türkçe)
    // ══════════════════════════════════════════════
    tr: {
      appName: 'DeenHub',
      appSubtitle: 'İslami Yardımcınız',
      home: 'Ana Sayfa', quran: 'Kuran', hadith: 'Hadis', ai: 'Yapay Zeka', ummah: 'Ümmet', profile: 'Profil',
      nextPrayer: '✦ SONRAKİ NAMAZ ✦',
      quickActions: 'Hızlı İşlemler',
      dailyVerse: 'Günün Ayeti',
      dayStreak: 'Günlük Seri',
      prayersLogged: 'namaz kaydedildi',
      level: 'Seviye',
      fajr: 'Sabah', dhuhr: 'Öğle', asr: 'İkindi', maghrib: 'Akşam', isha: 'Yatsı',
      sunrise: 'Güneş Doğuşu',
      tasbih: 'Tespih', azan: 'Ezan', qibla: 'Kıble', duas: 'Dualar', zakat: 'Zekat', calendar: 'Takvim', aiScholar: 'Yapay Zeka Alim',
      surah: 'Sure', juz: 'Cüz', bookmarks: 'Yer İmleri',
      searchSurahs: 'Sure ara...',
      continueReading: 'Okumaya Devam Et',
      ayahs: 'ayet',
      transliteration: 'Transliterasyon',
      wordByWord: 'Kelime Kelime',
      tajweed: 'Tecvid',
      speed: 'Hız',
      repeat: 'Tekrar',
      propheticHadith: 'Peygamber Hadisi',
      searchHadith: 'Hadis ara...',
      islamicScholar: 'İslami Alim',
      askAboutIslam: 'İslam hakkında sor...',
      glorification: 'Tesbih',
      lifetimeTotal: 'Toplam',
      reset: 'Sıfırla',
      target: 'Hedef',
      tap: 'DOKUN',
      qiblaDirection: 'Kıble Yönü',
      directionToMakkah: 'Mekke Yönü',
      supplications: 'Dualar',
      purificationWealth: 'Malın Arınması',
      calculateZakat: 'Zekatınızı Hesaplayın',
      calculateBtn: 'Zekat Hesapla',
      hijriCalendar: 'Hicri Takvim',
      islamicDate: 'İslami Tarih',
      achievements: 'Başarılar',
      settings: 'Ayarlar',
      darkMode: 'Karanlık Mod',
      language: 'Dil',
      privacyFirst: 'GİZLİLİK ÖNCELİKLİ',
      privacyDesc: 'Tüm veriler cihazınızda kalır. İzleme yok. Veri toplama yok.',
      builtWithLove: '❤️ ile Ümmet için yapıldı'
    },

    // ══════════════════════════════════════════════
    //  FRENCH (Français)
    // ══════════════════════════════════════════════
    fr: {
      appName: 'DeenHub',
      appSubtitle: 'Votre Compagnon Islamique',
      home: 'Accueil', quran: 'Coran', hadith: 'Hadith', ai: 'IA', ummah: 'Oumma', profile: 'Profil',
      nextPrayer: '✦ PROCHAINE PRIÈRE ✦',
      quickActions: 'Actions Rapides',
      dailyVerse: 'Verset du Jour',
      dayStreak: 'Jours Consécutifs',
      prayersLogged: 'prières enregistrées',
      level: 'Niveau',
      fajr: 'Fajr', dhuhr: 'Dhuhr', asr: 'Asr', maghrib: 'Maghrib', isha: 'Isha',
      sunrise: 'Lever du Soleil',
      tasbih: 'Tasbih', azan: 'Adhan', qibla: 'Qibla', duas: "Du'as", zakat: 'Zakat', calendar: 'Calendrier', aiScholar: 'Érudit IA',
      surah: 'Sourate', juz: 'Juz', bookmarks: 'Favoris',
      searchSurahs: 'Rechercher des sourates...',
      continueReading: 'Continuer la Lecture',
      ayahs: 'versets',
      transliteration: 'Translittération',
      wordByWord: 'Mot par Mot',
      tajweed: 'Tajweed',
      speed: 'Vitesse',
      repeat: 'Répéter',
      propheticHadith: 'Hadith Prophétique',
      searchHadith: 'Rechercher un hadith...',
      islamicScholar: 'Érudit Islamique',
      askAboutIslam: "Demandez sur l'Islam...",
      glorification: 'Glorification',
      lifetimeTotal: 'Total Global',
      reset: 'Réinitialiser',
      target: 'Objectif',
      tap: 'APPUYEZ',
      qiblaDirection: 'Direction de la Qibla',
      directionToMakkah: 'Direction de la Mecque',
      supplications: 'Invocations',
      purificationWealth: 'Purification de la Richesse',
      calculateZakat: 'Calculez Votre Zakat',
      calculateBtn: 'Calculer la Zakat',
      hijriCalendar: 'Calendrier Hégirien',
      islamicDate: 'Date Islamique',
      achievements: 'Réalisations',
      settings: 'Paramètres',
      darkMode: 'Mode Sombre',
      language: 'Langue',
      privacyFirst: 'CONFIDENTIALITÉ D\'ABORD',
      privacyDesc: 'Toutes les données restent sur votre appareil. Aucun suivi.',
      builtWithLove: 'Fait avec ❤️ pour la Oumma'
    },

    // ══════════════════════════════════════════════
    //  SPANISH (Español)
    // ══════════════════════════════════════════════
    es: {
      appName: 'DeenHub',
      appSubtitle: 'Tu Compañero Islámico',
      home: 'Inicio', quran: 'Corán', hadith: 'Hadiz', ai: 'IA', ummah: 'Ummah', profile: 'Perfil',
      nextPrayer: '✦ PRÓXIMA ORACIÓN ✦',
      quickActions: 'Acciones Rápidas',
      dailyVerse: 'Verso del Día',
      dayStreak: 'Racha de Días',
      prayersLogged: 'oraciones registradas',
      level: 'Nivel',
      fajr: 'Fajr', dhuhr: 'Dhuhr', asr: 'Asr', maghrib: 'Maghrib', isha: 'Isha',
      sunrise: 'Amanecer',
      tasbih: 'Tasbih', azan: 'Adán', qibla: 'Qibla', duas: 'Duas', zakat: 'Zakat', calendar: 'Calendario', aiScholar: 'Erudito IA',
      surah: 'Sura', juz: 'Juz', bookmarks: 'Marcadores',
      searchSurahs: 'Buscar suras...',
      continueReading: 'Continuar Leyendo',
      ayahs: 'aleyas',
      transliteration: 'Transliteración',
      wordByWord: 'Palabra por Palabra',
      tajweed: 'Tajweed',
      speed: 'Velocidad',
      repeat: 'Repetir',
      propheticHadith: 'Hadiz Profético',
      searchHadith: 'Buscar hadiz...',
      islamicScholar: 'Erudito Islámico',
      askAboutIslam: 'Pregunte sobre el Islam...',
      glorification: 'Glorificación',
      lifetimeTotal: 'Total General',
      reset: 'Reiniciar',
      target: 'Meta',
      tap: 'TOCA',
      qiblaDirection: 'Dirección de la Qibla',
      directionToMakkah: 'Dirección a la Meca',
      supplications: 'Súplicas',
      purificationWealth: 'Purificación de la Riqueza',
      calculateZakat: 'Calcule Su Zakat',
      calculateBtn: 'Calcular Zakat',
      hijriCalendar: 'Calendario Islámico',
      islamicDate: 'Fecha Islámica',
      achievements: 'Logros',
      settings: 'Configuración',
      darkMode: 'Modo Oscuro',
      language: 'Idioma',
      privacyFirst: 'PRIVACIDAD PRIMERO',
      privacyDesc: 'Todos los datos se quedan en tu dispositivo. Sin rastreo.',
      builtWithLove: 'Hecho con ❤️ para la Ummah'
    },

    // ══════════════════════════════════════════════
    //  HINDI (हिन्दी)
    // ══════════════════════════════════════════════
    hi: {
      appName: 'दीनहब',
      appSubtitle: 'आपका इस्लामी साथी',
      home: 'होम', quran: 'क़ुरआन', hadith: 'हदीस', ai: 'एआई', ummah: 'उम्मा', profile: 'प्रोफ़ाइल',
      nextPrayer: '✦ अगली नमाज़ ✦',
      quickActions: 'त्वरित कार्य',
      dailyVerse: 'आज की आयत',
      dayStreak: 'लगातार दिन',
      prayersLogged: 'नमाज़ रिकॉर्ड',
      level: 'स्तर',
      fajr: 'फज्र', dhuhr: 'ज़ुहर', asr: 'अस्र', maghrib: 'मग़रिब', isha: 'इशा',
      sunrise: 'सूर्योदय',
      tasbih: 'तस्बीह', azan: 'अज़ान', qibla: 'क़िबला', duas: 'दुआएँ', zakat: 'ज़कात', calendar: 'कैलेंडर', aiScholar: 'एआई आलिम',
      surah: 'सूरह', juz: 'पारा', bookmarks: 'बुकमार्क',
      searchSurahs: 'सूरह खोजें...',
      continueReading: 'पढ़ना जारी रखें',
      ayahs: 'आयतें',
      glorification: 'तस्बीह',
      lifetimeTotal: 'कुल',
      reset: 'रीसेट',
      tap: 'टैप',
      qiblaDirection: 'क़िबला की दिशा',
      supplications: 'दुआएँ',
      calculateZakat: 'अपनी ज़कात गणना करें',
      calculateBtn: 'ज़कात गणना',
      hijriCalendar: 'हिजरी कैलेंडर',
      achievements: 'उपलब्धियाँ',
      settings: 'सेटिंग्स',
      darkMode: 'डार्क मोड',
      language: 'भाषा',
      builtWithLove: '❤️ उम्मा के लिए बनाया गया'
    },

    // ══════════════════════════════════════════════
    //  RUSSIAN (Русский)
    // ══════════════════════════════════════════════
    ru: {
      appName: 'DeenHub',
      appSubtitle: 'Ваш Исламский Помощник',
      home: 'Главная', quran: 'Коран', hadith: 'Хадис', ai: 'ИИ', ummah: 'Умма', profile: 'Профиль',
      nextPrayer: '✦ СЛЕДУЮЩИЙ НАМАЗ ✦',
      quickActions: 'Быстрые Действия',
      dailyVerse: 'Аят Дня',
      dayStreak: 'Дней Подряд',
      prayersLogged: 'намазов записано',
      level: 'Уровень',
      fajr: 'Фаджр', dhuhr: 'Зухр', asr: 'Аср', maghrib: 'Магриб', isha: 'Иша',
      sunrise: 'Восход',
      tasbih: 'Тасбих', azan: 'Азан', qibla: 'Кибла', duas: 'Дуа', zakat: 'Закят', calendar: 'Календарь', aiScholar: 'ИИ Учёный',
      surah: 'Сура', juz: 'Джуз', bookmarks: 'Закладки',
      searchSurahs: 'Поиск сур...',
      continueReading: 'Продолжить Чтение',
      ayahs: 'аятов',
      glorification: 'Прославление',
      lifetimeTotal: 'Всего',
      reset: 'Сброс',
      tap: 'НАЖМИ',
      qiblaDirection: 'Направление Киблы',
      supplications: 'Мольбы',
      calculateZakat: 'Рассчитайте Закят',
      calculateBtn: 'Рассчитать Закят',
      hijriCalendar: 'Хиджра Календарь',
      achievements: 'Достижения',
      settings: 'Настройки',
      darkMode: 'Тёмный Режим',
      language: 'Язык',
      builtWithLove: 'Сделано с ❤️ для Уммы'
    },

    // ══════════════════════════════════════════════
    //  INDONESIAN (Bahasa Indonesia)
    // ══════════════════════════════════════════════
    id: {
      appName: 'DeenHub',
      appSubtitle: 'Pendamping Islami Anda',
      home: 'Beranda', quran: 'Quran', hadith: 'Hadits', ai: 'AI', ummah: 'Umat', profile: 'Profil',
      nextPrayer: '✦ SHALAT BERIKUTNYA ✦',
      quickActions: 'Aksi Cepat',
      dailyVerse: 'Ayat Hari Ini',
      dayStreak: 'Hari Berturut-turut',
      prayersLogged: 'shalat tercatat',
      level: 'Level',
      fajr: 'Subuh', dhuhr: 'Dzuhur', asr: 'Ashar', maghrib: 'Maghrib', isha: 'Isya',
      sunrise: 'Terbit Matahari',
      tasbih: 'Tasbih', azan: 'Adzan', qibla: 'Kiblat', duas: 'Doa', zakat: 'Zakat', calendar: 'Kalender', aiScholar: 'Ulama AI',
      surah: 'Surah', juz: 'Juz', bookmarks: 'Penanda',
      searchSurahs: 'Cari surah...',
      continueReading: 'Lanjutkan Membaca',
      ayahs: 'ayat',
      glorification: 'Dzikir',
      lifetimeTotal: 'Total',
      reset: 'Reset',
      tap: 'KETUK',
      qiblaDirection: 'Arah Kiblat',
      supplications: 'Doa-doa',
      calculateZakat: 'Hitung Zakat Anda',
      calculateBtn: 'Hitung Zakat',
      hijriCalendar: 'Kalender Hijriah',
      achievements: 'Pencapaian',
      settings: 'Pengaturan',
      darkMode: 'Mode Gelap',
      language: 'Bahasa',
      builtWithLove: 'Dibuat dengan ❤️ untuk Umat'
    },

    // ══════════════════════════════════════════════
    //  PERSIAN / FARSI (فارسی)
    // ══════════════════════════════════════════════
    fa: {
      appName: 'دین‌هاب',
      appSubtitle: 'همراه اسلامی شما',
      home: 'خانه', quran: 'قرآن', hadith: 'حدیث', ai: 'هوش مصنوعی', ummah: 'امت', profile: 'پروفایل',
      nextPrayer: '✦ نماز بعدی ✦',
      quickActions: 'دسترسی سریع',
      dailyVerse: 'آیه روز',
      dayStreak: 'روزهای متوالی',
      prayersLogged: 'نماز ثبت شده',
      level: 'سطح',
      fajr: 'صبح', dhuhr: 'ظهر', asr: 'عصر', maghrib: 'مغرب', isha: 'عشا',
      sunrise: 'طلوع آفتاب',
      tasbih: 'تسبیح', azan: 'اذان', qibla: 'قبله', duas: 'دعاها', zakat: 'زکات', calendar: 'تقویم', aiScholar: 'عالم هوشمند',
      surah: 'سوره', juz: 'جزء', bookmarks: 'نشانک‌ها',
      searchSurahs: 'جستجوی سوره...',
      continueReading: 'ادامه مطالعه',
      ayahs: 'آیات',
      glorification: 'ذکر',
      lifetimeTotal: 'مجموع کل',
      reset: 'بازنشانی',
      tap: 'بزن',
      qiblaDirection: 'جهت قبله',
      supplications: 'دعاها',
      calculateZakat: 'محاسبه زکات',
      calculateBtn: 'محاسبه',
      hijriCalendar: 'تقویم هجری',
      achievements: 'دستاوردها',
      settings: 'تنظیمات',
      darkMode: 'حالت تاریک',
      language: 'زبان',
      builtWithLove: 'ساخته شده با ❤️ برای امت'
    },

    // ══════════════════════════════════════════════
    //  CHINESE (中文)
    // ══════════════════════════════════════════════
    zh: {
      appName: 'DeenHub',
      appSubtitle: '您的伊斯兰伴侣',
      home: '首页', quran: '古兰经', hadith: '圣训', ai: 'AI', ummah: '穆斯林社区', profile: '个人资料',
      nextPrayer: '✦ 下一次礼拜 ✦',
      quickActions: '快速操作',
      dailyVerse: '每日经文',
      dayStreak: '连续天数',
      prayersLogged: '次礼拜已记录',
      level: '等级',
      fajr: '晨礼', dhuhr: '晌礼', asr: '脯礼', maghrib: '昏礼', isha: '宵礼',
      sunrise: '日出',
      tasbih: '念珠', azan: '唤礼', qibla: '朝向', duas: '祈祷', zakat: '天课', calendar: '日历', aiScholar: 'AI学者',
      surah: '章', juz: '卷', bookmarks: '书签',
      searchSurahs: '搜索章节...',
      continueReading: '继续阅读',
      ayahs: '节',
      glorification: '赞念',
      lifetimeTotal: '总计',
      reset: '重置',
      tap: '点击',
      qiblaDirection: '朝拜方向',
      supplications: '祈祷词',
      calculateZakat: '计算天课',
      calculateBtn: '计算',
      hijriCalendar: '伊斯兰历',
      achievements: '成就',
      settings: '设置',
      darkMode: '暗色模式',
      language: '语言',
      builtWithLove: '为穆斯林社区用❤️制作'
    },

    // ══════════════════════════════════════════════
    //  JAPANESE (日本語)
    // ══════════════════════════════════════════════
    ja: {
      appName: 'DeenHub',
      appSubtitle: 'イスラムの友',
      home: 'ホーム', quran: 'クルアーン', hadith: 'ハディース', ai: 'AI', ummah: 'ウンマ', profile: 'プロフィール',
      nextPrayer: '✦ 次の礼拝 ✦',
      quickActions: 'クイックアクション',
      dailyVerse: '今日の節',
      dayStreak: '連続日数',
      prayersLogged: '礼拝記録',
      level: 'レベル',
      fajr: 'ファジル', dhuhr: 'ズフル', asr: 'アスル', maghrib: 'マグリブ', isha: 'イシャー',
      sunrise: '日の出',
      tasbih: 'タスビーフ', azan: 'アザーン', qibla: 'キブラ', duas: 'ドゥアー', zakat: 'ザカート', calendar: 'カレンダー', aiScholar: 'AI学者',
      surah: 'スーラ', juz: 'ジュズ', bookmarks: 'ブックマーク',
      searchSurahs: 'スーラを検索...',
      continueReading: '読み続ける',
      ayahs: '節',
      glorification: '賛美',
      lifetimeTotal: '合計',
      reset: 'リセット',
      tap: 'タップ',
      qiblaDirection: 'キブラの方角',
      supplications: '祈り',
      calculateZakat: 'ザカート計算',
      calculateBtn: '計算する',
      hijriCalendar: 'ヒジュラ暦',
      achievements: '実績',
      settings: '設定',
      darkMode: 'ダークモード',
      language: '言語',
      builtWithLove: 'ウンマのために❤️で作られました'
    },

    // ══════════════════════════════════════════════
    //  KOREAN (한국어)
    // ══════════════════════════════════════════════
    ko: {
      appName: 'DeenHub',
      appSubtitle: '이슬람의 동반자',
      home: '홈', quran: '꾸란', hadith: '하디스', ai: 'AI', ummah: '움마', profile: '프로필',
      nextPrayer: '✦ 다음 예배 ✦',
      quickActions: '빠른 작업',
      dailyVerse: '오늘의 구절',
      dayStreak: '연속 일수',
      prayersLogged: '예배 기록',
      level: '레벨',
      fajr: '파즈르', dhuhr: '두흐르', asr: '아스르', maghrib: '마그립', isha: '이샤',
      sunrise: '일출',
      tasbih: '타스비흐', azan: '아잔', qibla: '키블라', duas: '두아', zakat: '자카트', calendar: '달력', aiScholar: 'AI 학자',
      surah: '수라', juz: '주즈', bookmarks: '북마크',
      searchSurahs: '수라 검색...',
      continueReading: '계속 읽기',
      ayahs: '절',
      glorification: '찬미',
      lifetimeTotal: '총합',
      reset: '초기화',
      tap: '탭',
      qiblaDirection: '키블라 방향',
      supplications: '기도',
      calculateZakat: '자카트 계산',
      calculateBtn: '계산',
      hijriCalendar: '히즈라력',
      achievements: '업적',
      settings: '설정',
      darkMode: '다크 모드',
      language: '언어',
      builtWithLove: '움마를 위해 ❤️으로 제작'
    },

    // ══════════════════════════════════════════════
    //  GERMAN (Deutsch)
    // ══════════════════════════════════════════════
    de: {
      appName: 'DeenHub',
      appSubtitle: 'Ihr Islamischer Begleiter',
      home: 'Startseite', quran: 'Koran', hadith: 'Hadith', ai: 'KI', ummah: 'Umma', profile: 'Profil',
      nextPrayer: '✦ NÄCHSTES GEBET ✦',
      quickActions: 'Schnellaktionen',
      dailyVerse: 'Vers des Tages',
      dayStreak: 'Tage in Folge',
      prayersLogged: 'Gebete erfasst',
      level: 'Stufe',
      fajr: 'Fadschr', dhuhr: 'Dhuhr', asr: 'Asr', maghrib: 'Maghrib', isha: 'Ischa',
      sunrise: 'Sonnenaufgang',
      tasbih: 'Tasbih', azan: 'Adhan', qibla: 'Qibla', duas: 'Bittgebete', zakat: 'Zakat', calendar: 'Kalender', aiScholar: 'KI-Gelehrter',
      surah: 'Sure', juz: 'Dschuz', bookmarks: 'Lesezeichen',
      searchSurahs: 'Suren suchen...',
      continueReading: 'Weiterlesen',
      ayahs: 'Verse',
      glorification: 'Lobpreisung',
      lifetimeTotal: 'Gesamt',
      reset: 'Zurücksetzen',
      tap: 'TIPPEN',
      qiblaDirection: 'Qibla-Richtung',
      supplications: 'Bittgebete',
      calculateZakat: 'Berechnen Sie Ihre Zakat',
      calculateBtn: 'Zakat Berechnen',
      hijriCalendar: 'Hidschra-Kalender',
      achievements: 'Erfolge',
      settings: 'Einstellungen',
      darkMode: 'Dunkelmodus',
      language: 'Sprache',
      builtWithLove: 'Mit ❤️ für die Umma gemacht'
    },

    // ══════════════════════════════════════════════
    //  MALAY (Bahasa Melayu)
    // ══════════════════════════════════════════════
    ms: {
      appName: 'DeenHub',
      appSubtitle: 'Sahabat Islam Anda',
      home: 'Laman', quran: 'Quran', hadith: 'Hadis', ai: 'AI', ummah: 'Ummah', profile: 'Profil',
      nextPrayer: '✦ SOLAT SETERUSNYA ✦',
      quickActions: 'Tindakan Pantas',
      dailyVerse: 'Ayat Hari Ini',
      dayStreak: 'Hari Berturut-turut',
      prayersLogged: 'solat dicatat',
      level: 'Tahap',
      fajr: 'Subuh', dhuhr: 'Zohor', asr: 'Asar', maghrib: 'Maghrib', isha: 'Isyak',
      tasbih: 'Tasbih', azan: 'Azan', qibla: 'Kiblat', duas: 'Doa', zakat: 'Zakat', calendar: 'Kalendar', aiScholar: 'Ulama AI',
      surah: 'Surah', juz: 'Juzuk', bookmarks: 'Penanda',
      searchSurahs: 'Cari surah...',
      continueReading: 'Teruskan Membaca',
      ayahs: 'ayat',
      glorification: 'Zikir',
      settings: 'Tetapan',
      darkMode: 'Mod Gelap',
      language: 'Bahasa',
      builtWithLove: 'Dibina dengan ❤️ untuk Ummah'
    },

    // ══════════════════════════════════════════════
    //  ITALIAN (Italiano)
    // ══════════════════════════════════════════════
    it: {
      appName: 'DeenHub',
      appSubtitle: 'Il Tuo Compagno Islamico',
      home: 'Home', quran: 'Corano', hadith: 'Hadith', ai: 'IA', ummah: 'Ummah', profile: 'Profilo',
      nextPrayer: '✦ PROSSIMA PREGHIERA ✦',
      quickActions: 'Azioni Rapide',
      dailyVerse: 'Verso del Giorno',
      dayStreak: 'Giorni Consecutivi',
      prayersLogged: 'preghiere registrate',
      level: 'Livello',
      fajr: 'Fajr', dhuhr: 'Dhuhr', asr: 'Asr', maghrib: 'Maghrib', isha: 'Isha',
      tasbih: 'Tasbih', azan: 'Adhan', qibla: 'Qibla', duas: 'Preghiere', zakat: 'Zakat', calendar: 'Calendario', aiScholar: 'Studioso IA',
      surah: 'Sura', juz: 'Juz', bookmarks: 'Segnalibri',
      searchSurahs: 'Cerca sure...',
      continueReading: 'Continua a Leggere',
      ayahs: 'versetti',
      glorification: 'Glorificazione',
      settings: 'Impostazioni',
      darkMode: 'Modalità Scura',
      language: 'Lingua',
      builtWithLove: 'Fatto con ❤️ per la Ummah'
    },

    // ══════════════════════════════════════════════
    //  PORTUGUESE (Português)
    // ══════════════════════════════════════════════
    pt: {
      appName: 'DeenHub',
      appSubtitle: 'Seu Companheiro Islâmico',
      home: 'Início', quran: 'Alcorão', hadith: 'Hadith', ai: 'IA', ummah: 'Ummah', profile: 'Perfil',
      nextPrayer: '✦ PRÓXIMA ORAÇÃO ✦',
      quickActions: 'Ações Rápidas',
      dailyVerse: 'Versículo do Dia',
      dayStreak: 'Dias Seguidos',
      prayersLogged: 'orações registradas',
      level: 'Nível',
      fajr: 'Fajr', dhuhr: 'Dhuhr', asr: 'Asr', maghrib: 'Maghrib', isha: 'Isha',
      tasbih: 'Tasbih', azan: 'Adhan', qibla: 'Qibla', duas: 'Súplicas', zakat: 'Zakat', calendar: 'Calendário', aiScholar: 'Erudito IA',
      surah: 'Sura', juz: 'Juz', bookmarks: 'Favoritos',
      searchSurahs: 'Pesquisar suras...',
      continueReading: 'Continuar Lendo',
      ayahs: 'versículos',
      glorification: 'Glorificação',
      settings: 'Configurações',
      darkMode: 'Modo Escuro',
      language: 'Idioma',
      builtWithLove: 'Feito com ❤️ para a Ummah'
    },

    // ══════════════════════════════════════════════
    //  THAI (ไทย)
    // ══════════════════════════════════════════════
    th: {
      appName: 'DeenHub',
      appSubtitle: 'ผู้ช่วยอิสลามของคุณ',
      home: 'หน้าแรก', quran: 'อัลกุรอาน', hadith: 'หะดีษ', ai: 'AI', ummah: 'อุมมะฮ์', profile: 'โปรไฟล์',
      nextPrayer: '✦ ละหมาดถัดไป ✦',
      quickActions: 'การดำเนินการด่วน',
      dailyVerse: 'อายะฮ์ประจำวัน',
      fajr: 'ฟัจร์', dhuhr: 'ซุฮ์ร', asr: 'อัสร์', maghrib: 'มัฆริบ', isha: 'อิชาอ์',
      tasbih: 'ตัสบีห์', azan: 'อะซาน', qibla: 'กิบละฮ์', duas: 'ดุอาอ์', zakat: 'ซะกาต', calendar: 'ปฏิทิน',
      surah: 'ซูเราะฮ์', juz: 'ญุซ', bookmarks: 'บุ๊กมาร์ก',
      settings: 'การตั้งค่า',
      darkMode: 'โหมดมืด',
      language: 'ภาษา',
      builtWithLove: 'สร้างด้วย ❤️ เพื่ออุมมะฮ์'
    },

    // ══════════════════════════════════════════════
    //  SWAHILI (Kiswahili)
    // ══════════════════════════════════════════════
    sw: {
      appName: 'DeenHub',
      appSubtitle: 'Mwandani Wako wa Kiislamu',
      home: 'Nyumbani', quran: 'Qurani', hadith: 'Hadithi', ai: 'AI', ummah: 'Ummah', profile: 'Wasifu',
      nextPrayer: '✦ SWALA INAYOFUATA ✦',
      quickActions: 'Vitendo vya Haraka',
      dailyVerse: 'Aya ya Leo',
      fajr: 'Alfajiri', dhuhr: 'Adhuhuri', asr: 'Alasiri', maghrib: 'Magharibi', isha: 'Ishaa',
      tasbih: 'Tasbihi', azan: 'Adhana', qibla: 'Qibla', duas: 'Dua', zakat: 'Zaka', calendar: 'Kalenda',
      surah: 'Sura', juz: 'Juzu', bookmarks: 'Alama',
      settings: 'Mipangilio',
      darkMode: 'Hali ya Giza',
      language: 'Lugha',
      builtWithLove: 'Imetengenezwa kwa ❤️ kwa Ummah'
    },

    // ══════════════════════════════════════════════
    //  SOMALI (Soomaali)
    // ══════════════════════════════════════════════
    so: {
      appName: 'DeenHub',
      appSubtitle: 'Saaxiibkaaga Islaamiga',
      home: 'Guriga', quran: 'Quraanka', hadith: 'Xadiis', ai: 'AI', ummah: 'Ummada', profile: 'Bogga',
      nextPrayer: '✦ SALAADDA XIGTA ✦',
      fajr: 'Salaadda Subax', dhuhr: 'Salaadda Duhur', asr: 'Salaadda Casar', maghrib: 'Salaadda Maqrib', isha: 'Salaadda Cishaa',
      tasbih: 'Tasbiix', azan: 'Aadaan', qibla: 'Qiblada', duas: 'Ducooyin', zakat: 'Sakada', calendar: 'Kalandarka',
      settings: 'Goobaha',
      language: 'Luuqad',
      builtWithLove: 'Loo sameeyay ❤️ Ummada'
    },

    // ══════════════════════════════════════════════
    //  DUTCH (Nederlands)
    // ══════════════════════════════════════════════
    nl: {
      appName: 'DeenHub',
      appSubtitle: 'Uw Islamitische Metgezel',
      home: 'Start', quran: 'Koran', hadith: 'Hadith', ai: 'AI', ummah: 'Ummah', profile: 'Profiel',
      nextPrayer: '✦ VOLGEND GEBED ✦',
      quickActions: 'Snelle Acties',
      dailyVerse: 'Vers van de Dag',
      fajr: 'Fajr', dhuhr: 'Dhuhr', asr: 'Asr', maghrib: 'Maghrib', isha: 'Isha',
      tasbih: 'Tasbih', azan: 'Adhan', qibla: 'Qibla', duas: 'Smeekbeden', zakat: 'Zakat', calendar: 'Kalender',
      settings: 'Instellingen',
      darkMode: 'Donkere Modus',
      language: 'Taal',
      builtWithLove: 'Gemaakt met ❤️ voor de Ummah'
    },

    // ══════════════════════════════════════════════
    //  POLISH (Polski)
    // ══════════════════════════════════════════════
    pl: {
      appName: 'DeenHub',
      appSubtitle: 'Twój Islamski Towarzysz',
      home: 'Strona główna', quran: 'Koran', hadith: 'Hadis', ai: 'AI', ummah: 'Ummah', profile: 'Profil',
      nextPrayer: '✦ NASTĘPNA MODLITWA ✦',
      fajr: 'Fadżr', dhuhr: 'Zuhr', asr: 'Asr', maghrib: 'Maghrib', isha: 'Isza',
      settings: 'Ustawienia',
      darkMode: 'Tryb Ciemny',
      language: 'Język',
      builtWithLove: 'Stworzone z ❤️ dla Ummy'
    },

    // ══════════════════════════════════════════════
    //  SWEDISH (Svenska)
    // ══════════════════════════════════════════════
    sv: {
      appName: 'DeenHub',
      appSubtitle: 'Din Islamiska Följeslagare',
      home: 'Hem', quran: 'Koranen', hadith: 'Hadith', ai: 'AI', ummah: 'Ummah', profile: 'Profil',
      nextPrayer: '✦ NÄSTA BÖN ✦',
      fajr: 'Fajr', dhuhr: 'Dhuhr', asr: 'Asr', maghrib: 'Maghrib', isha: 'Isha',
      settings: 'Inställningar',
      darkMode: 'Mörkt Läge',
      language: 'Språk',
      builtWithLove: 'Gjord med ❤️ för Ummah'
    },

    // ══════════════════════════════════════════════
    //  TAMIL (தமிழ்)
    // ══════════════════════════════════════════════
    ta: {
      appName: 'DeenHub',
      appSubtitle: 'உங்கள் இஸ்லாமிய துணை',
      home: 'முகப்பு', quran: 'குர்ஆன்', hadith: 'ஹதீஸ்', ai: 'AI', ummah: 'உம்மா', profile: 'சுயவிவரம்',
      nextPrayer: '✦ அடுத்த தொழுகை ✦',
      fajr: 'சுப்ஹ்', dhuhr: 'லுஹர்', asr: 'அஸர்', maghrib: 'மஃரிப்', isha: 'இஷா',
      tasbih: 'தஸ்பீஹ்', azan: 'அதான்', qibla: 'கிப்லா', duas: 'துஆக்கள்', zakat: 'ஜகாத்', calendar: 'நாட்காட்டி',
      settings: 'அமைப்புகள்',
      language: 'மொழி',
      builtWithLove: 'உம்மாவுக்காக ❤️ உடன் உருவாக்கப்பட்டது'
    },

    // ══════════════════════════════════════════════
    //  ALBANIAN (Shqip)
    // ══════════════════════════════════════════════
    sq: {
      appName: 'DeenHub',
      appSubtitle: 'Shoqëruesi Juaj Islamik',
      home: 'Ballina', quran: 'Kurani', hadith: 'Hadithi', ai: 'AI', ummah: 'Umeti', profile: 'Profili',
      nextPrayer: '✦ NAMAZI I RADHËS ✦',
      fajr: 'Sabahu', dhuhr: 'Dreka', asr: 'Ikindia', maghrib: 'Akshami', isha: 'Jacia',
      settings: 'Cilësimet',
      language: 'Gjuha',
      builtWithLove: 'Ndërtuar me ❤️ për Umetin'
    },

    // ══════════════════════════════════════════════
    //  BOSNIAN (Bosanski)
    // ══════════════════════════════════════════════
    bs: {
      appName: 'DeenHub',
      appSubtitle: 'Vaš Islamski Pratilac',
      home: 'Početna', quran: 'Kur\'an', hadith: 'Hadis', ai: 'AI', ummah: 'Ummet', profile: 'Profil',
      nextPrayer: '✦ SLJEDEĆI NAMAZ ✦',
      fajr: 'Sabah', dhuhr: 'Podne', asr: 'Ikindija', maghrib: 'Akšam', isha: 'Jacija',
      settings: 'Postavke',
      language: 'Jezik',
      builtWithLove: 'Napravljeno s ❤️ za Ummet'
    },

    // ══════════════════════════════════════════════
    //  AZERBAIJANI (Azərbaycan)
    // ══════════════════════════════════════════════
    az: {
      appName: 'DeenHub',
      appSubtitle: 'İslami Yoldaşınız',
      home: 'Ana Səhifə', quran: 'Quran', hadith: 'Hədis', ai: 'Sİ', ummah: 'Ümmət', profile: 'Profil',
      nextPrayer: '✦ NÖVBƏTİ NAMAZ ✦',
      fajr: 'Sübh', dhuhr: 'Zöhr', asr: 'Əsr', maghrib: 'Məğrib', isha: 'İşa',
      settings: 'Parametrlər',
      language: 'Dil',
      builtWithLove: 'Ümmət üçün ❤️ ilə yaradılmışdır'
    }
  },

  // ── Core methods ──

  init() {
    // Load saved language or auto-detect
    const saved = Store.get('appLanguage');
    if (saved && this.strings[saved]) {
      this.currentLang = saved;
    } else {
      this.autoDetect();
    }
    this.applyDirection();
  },

  autoDetect() {
    const browserLang = (navigator.language || navigator.userLanguage || 'en').split('-')[0].toLowerCase();
    if (this.strings[browserLang]) {
      this.currentLang = browserLang;
    } else {
      this.currentLang = 'en';
    }
  },

  setLanguage(langCode) {
    if (this.strings[langCode] || langCode === 'en') {
      this.currentLang = langCode;
      Store.set('appLanguage', langCode);
      this.applyDirection();
      // Re-render current screen
      App.navigate(App.subScreen || App.currentTab);
      // Update tab bar
      this.updateTabBar();
      // Update header
      App.updateHeader(App.subScreen || App.currentTab);
    }
  },

  applyDirection() {
    const dir = this.rtlLanguages.includes(this.currentLang) ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', this.currentLang);
    document.body.style.direction = dir;
  },

  // Get a translated string with fallback to English
  t(key) {
    const langStrings = this.strings[this.currentLang];
    if (langStrings && langStrings[key] !== undefined) {
      return langStrings[key];
    }
    // Fallback to English
    return this.strings.en[key] || key;
  },

  // Get current language info
  getCurrentLanguage() {
    return this.supportedLanguages.find(l => l.code === this.currentLang) || this.supportedLanguages[0];
  },

  // Update bottom tab bar with current language
  updateTabBar() {
    const tabs = document.querySelectorAll('.tab-item');
    const tabKeys = ['home', 'quran', 'hadith', 'ai', 'ummah', 'profile'];
    tabs.forEach((tab, i) => {
      const label = tab.querySelector('div:nth-child(2)');
      if (label && tabKeys[i]) {
        label.textContent = this.t(tabKeys[i]);
      }
    });
  },

  // Get grouped languages for the selector UI
  getLanguageGroups() {
    const groups = {
      '🌍 Major Languages': ['en', 'ar', 'ur', 'bn', 'hi', 'tr', 'fr', 'es', 'de', 'ru', 'zh', 'ja', 'ko'],
      '🌏 Southeast Asian': ['id', 'ms', 'th', 'ta', 'ml'],
      '🌍 Middle East & Central Asia': ['fa', 'ps', 'ku', 'az', 'uz', 'tt', 'sd', 'ug'],
      '🌍 European': ['it', 'pt', 'nl', 'sv', 'pl', 'cs', 'ro', 'bg', 'no', 'sq', 'bs'],
      '🌍 African': ['sw', 'so', 'ha'],
      '🌏 South Asian': ['ne', 'dv']
    };
    return groups;
  }
};
