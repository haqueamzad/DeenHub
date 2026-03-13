/* ============================================================
   DeenHub PWA — Storage Layer (Privacy-First, On-Device Only)
   ============================================================ */

const Store = {
  _prefix: 'deenhub_',

  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(this._prefix + key);
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  },

  set(key, value) {
    try { localStorage.setItem(this._prefix + key, JSON.stringify(value)); }
    catch (e) { console.warn('Storage write failed:', e); }
  },

  remove(key) {
    localStorage.removeItem(this._prefix + key);
  },

  // ---- XP & Gamification ----
  addXP(amount) {
    const xp = this.get('xp', 0) + amount;
    this.set('xp', xp);
    const level = Math.floor(xp / 500) + 1;
    this.set('level', level);
    return { xp, level };
  },

  getXP() { return this.get('xp', 0); },
  getLevel() { return this.get('level', 1); },

  // ---- Streak ----
  updateStreak() {
    const today = new Date().toDateString();
    const lastDate = this.get('lastPrayerDate', '');
    let streak = this.get('streak', 0);
    if (lastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastDate === yesterday.toDateString()) {
        streak += 1;
      } else if (lastDate !== '') {
        streak = 1; // reset
      } else {
        streak = 1; // first time
      }
      this.set('streak', streak);
      this.set('lastPrayerDate', today);
      this.addXP(50); // daily streak XP
    }
    return streak;
  },
  getStreak() { return this.get('streak', 0); },

  // ---- Prayer Log ----
  logPrayer(name) {
    const today = new Date().toDateString();
    const log = this.get('prayerLog', {});
    if (!log[today]) log[today] = [];
    if (!log[today].includes(name)) {
      log[today].push(name);
      this.set('prayerLog', log);
      this.addXP(20);
    }
    return log[today];
  },
  getTodayPrayers() {
    const log = this.get('prayerLog', {});
    return log[new Date().toDateString()] || [];
  },

  // ---- Tasbih ----
  getTasbihTotal() { return this.get('tasbihTotal', 0); },
  addTasbih(count) {
    const total = this.get('tasbihTotal', 0) + count;
    this.set('tasbihTotal', total);
    return total;
  },

  // ---- Quran Bookmarks ----
  getBookmarks() { return this.get('bookmarks', []); },
  toggleBookmark(surahNum) {
    const bookmarks = this.getBookmarks();
    const idx = bookmarks.indexOf(surahNum);
    if (idx > -1) bookmarks.splice(idx, 1);
    else bookmarks.push(surahNum);
    this.set('bookmarks', bookmarks);
    return bookmarks;
  },

  // ---- Last Read ----
  setLastRead(surahNum, ayah) {
    this.set('lastRead', { surah: surahNum, ayah, timestamp: Date.now() });
  },
  getLastRead() { return this.get('lastRead', null); },

  // ---- Settings ----
  getSetting(key, fallback = true) { return this.get('setting_' + key, fallback); },
  setSetting(key, value) { this.set('setting_' + key, value); },

  // ---- Achievements ----
  getAchievements() {
    return this.get('achievements', {
      first_prayer: false,
      week_streak: false,
      quran_reader: false,
      tasbih_100: false,
      tasbih_1000: false,
      zakat_calc: false,
      community_join: false,
      scholar_chat: false
    });
  },
  unlockAchievement(id) {
    const a = this.getAchievements();
    if (!a[id]) {
      a[id] = true;
      this.set('achievements', a);
      this.addXP(100);
      return true; // newly unlocked
    }
    return false;
  },

  // ---- Stats Summary ----
  getStats() {
    const log = this.get('prayerLog', {});
    const totalPrayers = Object.values(log).reduce((sum, arr) => sum + arr.length, 0);
    return {
      xp: this.getXP(),
      level: this.getLevel(),
      streak: this.getStreak(),
      totalPrayers,
      tasbihTotal: this.getTasbihTotal(),
      quranRead: this.get('quranSurahsRead', 0)
    };
  },

  // ---- Enhanced Quran Settings ----
  getQuranSettings() {
    return {
      reciter: this.getSetting('reciter', 'ar.alafasy'),
      translation: this.getSetting('translation', 'en.sahih'),
      showTranslit: this.getSetting('showTranslit', false),
      wordByWord: this.getSetting('wordByWord', false)
    };
  },

  setQuranSettings(obj) {
    if (obj.reciter) this.setSetting('reciter', obj.reciter);
    if (obj.translation) this.setSetting('translation', obj.translation);
    if (obj.showTranslit !== undefined) this.setSetting('showTranslit', obj.showTranslit);
    if (obj.wordByWord !== undefined) this.setSetting('wordByWord', obj.wordByWord);
  },

  // ---- Reading Progress ----
  getReadingProgress() {
    const surahsStarted = new Set(this.get('surahsStarted', []));
    const totalAyahsRead = this.get('totalAyahsRead', 0);
    const dailyGoal = this.get('dailyGoal', 10);
    const todayRead = this.getTodayReadCount();
    return { surahsStarted, totalAyahsRead, dailyGoal, todayRead };
  },

  logAyahRead(surah, ayah) {
    const surahsStarted = new Set(this.get('surahsStarted', []));
    surahsStarted.add(surah);
    this.set('surahsStarted', Array.from(surahsStarted));

    const totalAyahsRead = this.get('totalAyahsRead', 0) + 1;
    this.set('totalAyahsRead', totalAyahsRead);

    const today = new Date().toDateString();
    const readLog = this.get('readLog', {});
    if (!readLog[today]) readLog[today] = 0;
    readLog[today]++;
    this.set('readLog', readLog);

    this.addXP(5);
  },

  setDailyGoal(ayahs) {
    this.set('dailyGoal', ayahs);
  },

  getTodayReadCount() {
    const readLog = this.get('readLog', {});
    const today = new Date().toDateString();
    return readLog[today] || 0;
  },

  // ---- Enhanced Last Read with scroll position ----
  setLastReadEnhanced(surahNum, ayah, scrollPos = 0) {
    this.set('lastRead', { surah: surahNum, ayah, timestamp: Date.now(), scrollPos });
  },

  // ---- Azan / Adhan Settings ----
  getAzanSettings() {
    return {
      enabled: this.getSetting('azanEnabled', true),
      voice: this.getSetting('azanVoice', 'makkah'),
      volume: this.getSetting('azanVolume', 80),
      preAlert: this.getSetting('azanPreAlert', 0), // minutes before, 0 = disabled
      fajrVoice: this.getSetting('azanFajrVoice', ''), // empty = use default voice
      fajrSpecial: this.getSetting('azanFajrSpecial', false),
      // Per-prayer enable/disable
      prayers: {
        fajr: this.getSetting('azanFajr', true),
        dhuhr: this.getSetting('azanDhuhr', true),
        asr: this.getSetting('azanAsr', true),
        maghrib: this.getSetting('azanMaghrib', true),
        isha: this.getSetting('azanIsha', true)
      },
      // Notification settings
      notifications: this.getSetting('azanNotify', true),
      fullScreen: this.getSetting('azanFullScreen', true),
      vibrate: this.getSetting('azanVibrate', true)
    };
  },

  setAzanSetting(key, value) {
    this.setSetting('azan' + key.charAt(0).toUpperCase() + key.slice(1), value);
  },

  // Track last triggered Azan to prevent duplicates
  getLastAzanTrigger() {
    return this.get('lastAzanTrigger', { prayer: '', date: '' });
  },
  setLastAzanTrigger(prayer) {
    this.set('lastAzanTrigger', { prayer, date: new Date().toDateString() });
  }
};
