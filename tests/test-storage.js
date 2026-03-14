/**
 * DeenHub PWA — Storage Module Tests
 */
const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { localStorageMock } = require('./setup');

// Load the Store module
const fs = require('fs');
const storeCode = fs.readFileSync(__dirname + '/../js/storage.js', 'utf8');
const Store = new Function(storeCode + '; return Store;')();

// ============================================================
// TESTS
// ============================================================

describe('Store — Basic get/set/remove', () => {
  beforeEach(() => localStorageMock.clear());

  it('should return fallback when key does not exist', () => {
    assert.equal(Store.get('nonexistent'), null);
    assert.equal(Store.get('nonexistent', 42), 42);
  });

  it('should set and get a string value', () => {
    Store.set('name', 'DeenHub');
    assert.equal(Store.get('name'), 'DeenHub');
  });

  it('should set and get a number value', () => {
    Store.set('count', 99);
    assert.equal(Store.get('count'), 99);
  });

  it('should set and get an object', () => {
    Store.set('data', { a: 1, b: 'two' });
    assert.deepEqual(Store.get('data'), { a: 1, b: 'two' });
  });

  it('should set and get an array', () => {
    Store.set('list', [1, 2, 3]);
    assert.deepEqual(Store.get('list'), [1, 2, 3]);
  });

  it('should remove a key', () => {
    Store.set('temp', 'value');
    assert.equal(Store.get('temp'), 'value');
    Store.remove('temp');
    assert.equal(Store.get('temp'), null);
  });

  it('should use prefixed keys in localStorage', () => {
    Store.set('mykey', 'myval');
    const raw = localStorage.getItem('deenhub_mykey');
    assert.equal(raw, '"myval"');
  });
});

describe('Store — XP & Gamification', () => {
  beforeEach(() => localStorageMock.clear());

  it('should start with 0 XP and level 1', () => {
    assert.equal(Store.getXP(), 0);
    assert.equal(Store.getLevel(), 1);
  });

  it('should add XP and compute level correctly', () => {
    const result = Store.addXP(250);
    assert.equal(result.xp, 250);
    assert.equal(result.level, 1); // floor(250/500) + 1 = 1

    const result2 = Store.addXP(300);
    assert.equal(result2.xp, 550);
    assert.equal(result2.level, 2); // floor(550/500) + 1 = 2
  });

  it('should accumulate XP across multiple calls', () => {
    Store.addXP(100);
    Store.addXP(200);
    Store.addXP(300);
    assert.equal(Store.getXP(), 600);
  });

  it('should calculate level thresholds correctly', () => {
    Store.addXP(999);
    assert.equal(Store.getLevel(), 2);  // floor(999/500) + 1 = 2

    Store.addXP(1);
    assert.equal(Store.getLevel(), 3);  // floor(1000/500) + 1 = 3

    Store.addXP(500);
    assert.equal(Store.getLevel(), 4);  // floor(1500/500) + 1 = 4
  });
});

describe('Store — Streak', () => {
  beforeEach(() => localStorageMock.clear());

  it('should start with streak 0', () => {
    assert.equal(Store.getStreak(), 0);
  });

  it('should set streak to 1 on first update', () => {
    const streak = Store.updateStreak();
    assert.equal(streak, 1);
  });

  it('should not increment if same day', () => {
    Store.updateStreak();
    const streak = Store.updateStreak();
    assert.equal(streak, 1);
  });
});

describe('Store — Prayer Log', () => {
  beforeEach(() => localStorageMock.clear());

  it('should start with empty today prayers', () => {
    assert.deepEqual(Store.getTodayPrayers(), []);
  });

  it('should log a prayer', () => {
    const logged = Store.logPrayer('Fajr');
    assert.ok(logged.includes('Fajr'));
  });

  it('should not log duplicate prayer', () => {
    Store.logPrayer('Fajr');
    const logged = Store.logPrayer('Fajr');
    assert.equal(logged.length, 1);
  });

  it('should log multiple different prayers', () => {
    Store.logPrayer('Fajr');
    Store.logPrayer('Dhuhr');
    Store.logPrayer('Asr');
    const today = Store.getTodayPrayers();
    assert.equal(today.length, 3);
    assert.ok(today.includes('Fajr'));
    assert.ok(today.includes('Dhuhr'));
    assert.ok(today.includes('Asr'));
  });

  it('should award XP for logging prayer', () => {
    Store.logPrayer('Fajr');
    assert.equal(Store.getXP(), 20);
  });

  it('should not award duplicate XP for same prayer', () => {
    Store.logPrayer('Fajr');
    Store.logPrayer('Fajr');
    assert.equal(Store.getXP(), 20);
  });
});

describe('Store — Tasbih', () => {
  beforeEach(() => localStorageMock.clear());

  it('should start at 0', () => {
    assert.equal(Store.getTasbihTotal(), 0);
  });

  it('should add counts', () => {
    Store.addTasbih(33);
    assert.equal(Store.getTasbihTotal(), 33);
    Store.addTasbih(33);
    assert.equal(Store.getTasbihTotal(), 66);
  });
});

describe('Store — Bookmarks', () => {
  beforeEach(() => localStorageMock.clear());

  it('should start with empty bookmarks', () => {
    assert.deepEqual(Store.getBookmarks(), []);
  });

  it('should toggle bookmark on', () => {
    const bm = Store.toggleBookmark(1);
    assert.ok(bm.includes(1));
  });

  it('should toggle bookmark off', () => {
    Store.toggleBookmark(1);
    const bm = Store.toggleBookmark(1);
    assert.ok(!bm.includes(1));
  });

  it('should manage multiple bookmarks', () => {
    Store.toggleBookmark(1);
    Store.toggleBookmark(36);
    Store.toggleBookmark(67);
    const bm = Store.getBookmarks();
    assert.equal(bm.length, 3);
    assert.deepEqual(bm, [1, 36, 67]);
  });
});

describe('Store — Last Read', () => {
  beforeEach(() => localStorageMock.clear());

  it('should return null when no last read', () => {
    assert.equal(Store.getLastRead(), null);
  });

  it('should save and retrieve last read', () => {
    Store.setLastRead(2, 255);
    const lr = Store.getLastRead();
    assert.equal(lr.surah, 2);
    assert.equal(lr.ayah, 255);
    assert.ok(lr.timestamp > 0);
  });
});

describe('Store — Settings', () => {
  beforeEach(() => localStorageMock.clear());

  it('should return default value for missing setting', () => {
    assert.equal(Store.getSetting('darkMode', true), true);
  });

  it('should save and retrieve setting', () => {
    Store.setSetting('darkMode', false);
    assert.equal(Store.getSetting('darkMode', true), false);
  });
});

describe('Store — Achievements', () => {
  beforeEach(() => localStorageMock.clear());

  it('should return default achievements (all false)', () => {
    const a = Store.getAchievements();
    assert.equal(a.first_prayer, false);
    assert.equal(a.week_streak, false);
    assert.equal(a.quran_reader, false);
  });

  it('should unlock achievement and award XP', () => {
    const unlocked = Store.unlockAchievement('first_prayer');
    assert.equal(unlocked, true);
    assert.equal(Store.getXP(), 100);
    assert.equal(Store.getAchievements().first_prayer, true);
  });

  it('should not re-award XP for already unlocked', () => {
    Store.unlockAchievement('first_prayer');
    const unlocked = Store.unlockAchievement('first_prayer');
    assert.equal(unlocked, false);
    assert.equal(Store.getXP(), 100); // only 100, not 200
  });
});

describe('Store — Stats Summary', () => {
  beforeEach(() => localStorageMock.clear());

  it('should return stats object with correct structure', () => {
    const stats = Store.getStats();
    assert.equal(typeof stats.xp, 'number');
    assert.equal(typeof stats.level, 'number');
    assert.equal(typeof stats.streak, 'number');
    assert.equal(typeof stats.totalPrayers, 'number');
    assert.equal(typeof stats.tasbihTotal, 'number');
  });

  it('should reflect accumulated data', () => {
    Store.logPrayer('Fajr');
    Store.logPrayer('Dhuhr');
    Store.addTasbih(100);
    const stats = Store.getStats();
    assert.equal(stats.totalPrayers, 2);
    assert.equal(stats.tasbihTotal, 100);
    assert.equal(stats.xp, 40); // 20 + 20
  });
});

describe('Store — Quran Settings', () => {
  beforeEach(() => localStorageMock.clear());

  it('should return defaults', () => {
    const qs = Store.getQuranSettings();
    assert.equal(qs.reciter, 'ar.alafasy');
    assert.equal(qs.translation, 'en.sahih');
    assert.equal(qs.showTranslit, false);
  });

  it('should save custom settings', () => {
    Store.setQuranSettings({ reciter: 'ar.husary', translation: 'en.pickthall', showTranslit: true });
    const qs = Store.getQuranSettings();
    assert.equal(qs.reciter, 'ar.husary');
    assert.equal(qs.translation, 'en.pickthall');
    assert.equal(qs.showTranslit, true);
  });
});

describe('Store — Reading Progress', () => {
  beforeEach(() => localStorageMock.clear());

  it('should start with zero progress', () => {
    const p = Store.getReadingProgress();
    assert.equal(p.totalAyahsRead, 0);
    assert.equal(p.todayRead, 0);
  });

  it('should log ayah read and increment progress', () => {
    Store.logAyahRead(1, 1);
    Store.logAyahRead(1, 2);
    Store.logAyahRead(2, 1);
    const p = Store.getReadingProgress();
    assert.equal(p.totalAyahsRead, 3);
    assert.equal(p.todayRead, 3);
    assert.ok(p.surahsStarted.has(1));
    assert.ok(p.surahsStarted.has(2));
  });

  it('should award XP per ayah', () => {
    Store.logAyahRead(1, 1);
    Store.logAyahRead(1, 2);
    assert.equal(Store.getXP(), 10); // 5 per ayah
  });
});

describe('Store — Azan Settings', () => {
  beforeEach(() => localStorageMock.clear());

  it('should return default azan settings', () => {
    const s = Store.getAzanSettings();
    assert.equal(s.enabled, true);
    assert.equal(s.voice, 'makkah');
    assert.equal(s.volume, 80);
    assert.equal(s.prayers.fajr, true);
    assert.equal(s.prayers.isha, true);
    assert.equal(s.notifications, true);
    assert.equal(s.fullScreen, true);
  });

  it('should save azan setting', () => {
    Store.setAzanSetting('volume', 50);
    const s = Store.getAzanSettings();
    assert.equal(s.volume, 50);
  });
});

describe('Store — Date Key format', () => {
  it('should produce YYYY-MM-DD format', () => {
    const d = new Date(2026, 0, 5); // Jan 5, 2026
    assert.equal(Store._dateKey(d), '2026-01-05');
  });

  it('should pad single-digit months and days', () => {
    const d = new Date(2025, 2, 3); // Mar 3, 2025
    assert.equal(Store._dateKey(d), '2025-03-03');
  });
});
