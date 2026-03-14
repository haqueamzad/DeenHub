/**
 * DeenHub PWA — API Module Tests
 */
const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { localStorageMock } = require('./setup');

// Load Store first (API depends on it indirectly)
const fs = require('fs');
const storeCode = fs.readFileSync(__dirname + '/../js/storage.js', 'utf8');
new Function(storeCode)();

// Load API
const apiCode = fs.readFileSync(__dirname + '/../js/api.js', 'utf8');
const API = new Function(apiCode + '; return API;')();

// ============================================================
// HADITH TESTS
// ============================================================

describe('API — Hadith Collections', () => {
  it('should have 8 collections', () => {
    assert.equal(API.hadithCollections.length, 8);
  });

  it('should include Bukhari, Muslim, and major collections', () => {
    const ids = API.hadithCollections.map(c => c.id);
    assert.ok(ids.includes('bukhari'));
    assert.ok(ids.includes('muslim'));
    assert.ok(ids.includes('abudawud'));
    assert.ok(ids.includes('tirmidhi'));
    assert.ok(ids.includes('nasai'));
    assert.ok(ids.includes('ibnmajah'));
    assert.ok(ids.includes('malik'));
    assert.ok(ids.includes('ahmad'));
  });

  it('each collection should have id, name, count, icon', () => {
    for (const c of API.hadithCollections) {
      assert.ok(c.id, `Missing id for collection`);
      assert.ok(c.name, `Missing name for ${c.id}`);
      assert.ok(c.count > 0, `Invalid count for ${c.id}`);
      assert.ok(c.icon, `Missing icon for ${c.id}`);
    }
  });
});

describe('API — getHadith()', () => {
  it('should return sample hadith for bukhari', () => {
    const hadith = API.getHadith('bukhari');
    assert.ok(hadith.length > 0);
    assert.ok(hadith[0].text.length > 0);
  });

  it('should return sample hadith for all 8 collections', () => {
    const ids = ['bukhari', 'muslim', 'abudawud', 'tirmidhi', 'nasai', 'ibnmajah', 'malik', 'ahmad'];
    for (const id of ids) {
      const hadith = API.getHadith(id);
      assert.ok(hadith.length > 0, `No hadith returned for ${id}`);
    }
  });

  it('should return empty array for invalid collection', () => {
    const hadith = API.getHadith('nonexistent');
    assert.deepEqual(hadith, []);
  });

  it('hadith should have required fields', () => {
    const hadith = API.getHadith('bukhari');
    for (const h of hadith) {
      assert.ok(typeof h.num === 'number', 'Missing num');
      assert.ok(typeof h.text === 'string' && h.text.length > 0, 'Missing text');
      assert.ok(typeof h.narrator === 'string', 'Missing narrator');
      assert.ok(typeof h.grade === 'string', 'Missing grade');
      assert.ok(typeof h.book === 'string', 'Missing book');
    }
  });

  it('should NOT return hadith for "sahih_bukhari" (old bug ID)', () => {
    const hadith = API.getHadith('sahih_bukhari');
    assert.deepEqual(hadith, [], 'Should return empty — "sahih_bukhari" is invalid, correct ID is "bukhari"');
  });
});

// ============================================================
// QURAN DATA TESTS
// ============================================================

describe('API — Reciters', () => {
  it('should have at least 15 reciters', () => {
    assert.ok(API.reciters.length >= 15);
  });

  it('each reciter should have id, name, flag, style', () => {
    for (const r of API.reciters) {
      assert.ok(r.id, 'Missing id');
      assert.ok(r.name, 'Missing name');
      assert.ok(r.flag, 'Missing flag');
      assert.ok(r.style, 'Missing style');
    }
  });

  it('should include Alafasy as default reciter', () => {
    const alafasy = API.reciters.find(r => r.id === 'ar.alafasy');
    assert.ok(alafasy, 'Alafasy should be in reciters list');
    assert.equal(alafasy.name, 'Mishary Rashid Alafasy');
  });
});

describe('API — Translations', () => {
  it('should have translations for multiple languages', () => {
    const langs = new Set(API.translations.map(t => t.langCode));
    assert.ok(langs.has('en'), 'Missing English');
    assert.ok(langs.has('ur'), 'Missing Urdu');
    assert.ok(langs.has('bn'), 'Missing Bengali');
    assert.ok(langs.has('ar'), 'Missing Arabic');
    assert.ok(langs.has('fr'), 'Missing French');
    assert.ok(langs.has('tr'), 'Missing Turkish');
  });

  it('each translation should have id, name, lang, langCode, flag', () => {
    for (const t of API.translations) {
      assert.ok(t.id, 'Missing id');
      assert.ok(t.name, 'Missing name');
      assert.ok(t.lang, 'Missing lang');
      assert.ok(t.langCode, 'Missing langCode');
      assert.ok(t.flag, 'Missing flag');
    }
  });

  it('should include Sahih International as default', () => {
    const sahih = API.translations.find(t => t.id === 'en.sahih');
    assert.ok(sahih);
    assert.equal(sahih.name, 'Sahih International');
  });
});

describe('API — Juz Data', () => {
  it('should have exactly 30 juz entries', () => {
    assert.equal(API.juzData.length, 30);
  });

  it('should start with juz 1 and end with juz 30', () => {
    assert.equal(API.juzData[0].juz, 1);
    assert.equal(API.juzData[29].juz, 30);
  });

  it('each juz should have juz, surah, ayah, name', () => {
    for (const j of API.juzData) {
      assert.ok(typeof j.juz === 'number');
      assert.ok(typeof j.surah === 'number');
      assert.ok(typeof j.ayah === 'number');
      assert.ok(typeof j.name === 'string' && j.name.length > 0);
    }
  });
});

// ============================================================
// API METHODS TESTS
// ============================================================

describe('API — getPrayerTimes()', () => {
  it('should return prayer times for valid coordinates', async () => {
    const pt = await API.getPrayerTimes(32.77, -96.80);
    assert.ok(pt.fajr);
    assert.ok(pt.dhuhr);
    assert.ok(pt.asr);
    assert.ok(pt.maghrib);
    assert.ok(pt.isha);
  });

  it('should return fallback on API failure', async () => {
    const originalFetch = global.fetch;
    global.fetch = async () => { throw new Error('Network failure'); };
    const pt = await API.getPrayerTimes(0, 0);
    assert.ok(pt.fajr);
    assert.ok(pt.dhuhr);
    global.fetch = originalFetch;
  });
});

describe('API — getSurahList()', () => {
  beforeEach(() => { API.surahList = null; }); // reset cache

  it('should return a list of surahs', async () => {
    const list = await API.getSurahList();
    assert.ok(Array.isArray(list));
    assert.ok(list.length > 0);
  });

  it('surahs should have correct structure', async () => {
    const list = await API.getSurahList();
    const first = list[0];
    assert.equal(first.number, 1);
    assert.equal(first.name, 'Al-Fatihah');
    assert.ok(first.arabic);
    assert.ok(first.translation);
    assert.equal(first.ayahs, 7);
  });

  it('should cache surah list', async () => {
    await API.getSurahList();
    assert.ok(API.surahList !== null);
    const list2 = await API.getSurahList();
    assert.ok(list2 === API.surahList, 'Should return cached list');
  });
});

describe('API — searchQuran()', () => {
  it('should return search results', async () => {
    const results = await API.searchQuran('mercy');
    assert.ok(Array.isArray(results));
    assert.ok(results.length > 0);
    assert.ok(results[0].surah);
    assert.ok(results[0].surahName);
    assert.ok(results[0].text);
  });

  it('should return empty on failure', async () => {
    const originalFetch = global.fetch;
    global.fetch = async () => { throw new Error('fail'); };
    const results = await API.searchQuran('test');
    assert.deepEqual(results, []);
    global.fetch = originalFetch;
  });
});

// ============================================================
// AUDIO PLAYER TESTS
// ============================================================

describe('API — Audio Player', () => {
  beforeEach(() => {
    API.audioPlayer = null;
    API.audioCurrentUrl = null;
    API.audioState = 'paused';
  });

  it('should initialize audio player', () => {
    const player = API.initAudioPlayer();
    assert.ok(player);
    assert.ok(API.audioPlayer === player);
  });

  it('should reuse existing player', () => {
    const p1 = API.initAudioPlayer();
    const p2 = API.initAudioPlayer();
    assert.ok(p1 === p2);
  });

  it('should set state to playing on playAyahAudio', () => {
    API.playAyahAudio('https://example.com/audio.mp3');
    assert.equal(API.audioState, 'playing');
    assert.equal(API.audioCurrentUrl, 'https://example.com/audio.mp3');
  });

  it('should pause audio', () => {
    API.playAyahAudio('https://example.com/audio.mp3');
    API.pauseAudio();
    assert.equal(API.audioState, 'paused');
  });

  it('should resume audio', () => {
    API.playAyahAudio('https://example.com/audio.mp3');
    API.pauseAudio();
    API.resumeAudio();
    assert.equal(API.audioState, 'playing');
  });

  it('should report isPlaying correctly', () => {
    assert.equal(API.isPlaying(), false);
    API.playAyahAudio('https://example.com/audio.mp3');
    // Note: Our mock Audio sets paused=false on play
    assert.equal(API.isPlaying(), true);
    API.pauseAudio();
    assert.equal(API.isPlaying(), false);
  });

  it('should set playback rate via playAudio', () => {
    API.playAudio('https://example.com/audio.mp3', 1.5);
    assert.equal(API.audioPlayer.playbackRate, 1.5);
  });

  it('aliases pauseAyah and resumeAyah should work', () => {
    API.playAyahAudio('https://example.com/audio.mp3');
    API.pauseAyah();
    assert.equal(API.audioState, 'paused');
    API.resumeAyah();
    assert.equal(API.audioState, 'playing');
  });
});

// ============================================================
// DUAS DATA TESTS
// ============================================================

describe('API — Duas Data', () => {
  it('should have morning duas', () => {
    assert.ok(API.duas.morning.length > 0);
  });

  it('should have evening duas', () => {
    assert.ok(API.duas.evening.length > 0);
  });

  it('dua should have required fields', () => {
    const dua = API.duas.morning[0];
    assert.ok(dua.id, 'Missing id');
    assert.ok(dua.arabic, 'Missing arabic');
    assert.ok(dua.trans, 'Missing translation');
    assert.ok(dua.ref, 'Missing reference');
  });
});

// ============================================================
// LOCATION TESTS
// ============================================================

describe('API — getLocation()', () => {
  it('should return an object with lat and lng properties', async () => {
    // The getLocation function uses navigator.geolocation which may not be
    // available in Node.js test environment. Test the fallback behavior.
    global.App = { toast: () => {} };
    try {
      const loc = await API.getLocation();
      assert.ok(typeof loc.lat === 'number', 'lat should be a number');
      assert.ok(typeof loc.lng === 'number', 'lng should be a number');
    } catch (e) {
      // If geolocation not supported, that's expected in Node.js
      assert.ok(e === 'Geolocation not supported' || e.message === 'Geolocation not supported');
    }
    delete global.App;
  });

  it('getLocation should be an async function', () => {
    assert.equal(typeof API.getLocation, 'function');
    // Verify it returns a promise
    global.App = { toast: () => {} };
    const result = API.getLocation();
    assert.ok(result instanceof Promise || (result && typeof result.then === 'function'));
    // Clean up the pending promise
    result.catch(() => {});
    delete global.App;
  });

  it('fallback coordinates should be Dallas, TX', () => {
    // Verify the hardcoded fallback in the source code
    const src = fs.readFileSync(__dirname + '/../js/api.js', 'utf8');
    assert.ok(src.includes('32.7767'), 'Should contain Dallas lat');
    assert.ok(src.includes('-96.7970'), 'Should contain Dallas lng');
  });
});
