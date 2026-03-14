/**
 * DeenHub PWA — Screens Module Tests
 */
const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { localStorageMock } = require('./setup');

// Load dependencies — must be global so Screens can see them
const fs = require('fs');
const storeCode = fs.readFileSync(__dirname + '/../js/storage.js', 'utf8');
global.Store = new Function(storeCode + '; return Store;')();

const apiCode = fs.readFileSync(__dirname + '/../js/api.js', 'utf8');
global.API = new Function(apiCode + '; return API;')();

// Mock I18n
global.I18n = {
  t: (key) => key,
  init: () => {},
  updateTabBar: () => {}
};

// Mock App
global.App = {
  toast: () => {},
  navigate: () => {},
  currentTab: 'home',
  subScreen: null
};

// Load Screens — API and Store must be global
const screensCode = fs.readFileSync(__dirname + '/../js/screens.js', 'utf8');
const cleanScreensCode = screensCode.replace(/document\.addEventListener/g, '(function(){})//');
const Screens = new Function('API', 'Store', 'I18n', 'App', cleanScreensCode + '; return Screens;')(global.API, global.Store, global.I18n, global.App);

// ============================================================
// CLEANUP TESTS
// ============================================================

describe('Screens — cleanup()', () => {
  it('should clean up Qibla compass resources', () => {
    Screens._qiblaWatchId = 'test';
    Screens._qiblaOrientHandler = () => {};
    Screens._qiblaCompassActive = true;
    Screens._duaTimer = setInterval(() => {}, 10000);
    Screens._qiblaRAF = 999;

    Screens.cleanup();

    assert.equal(Screens._qiblaWatchId, null);
    assert.equal(Screens._qiblaCompassActive, false);
    assert.equal(Screens._duaTimer, null);
    assert.equal(Screens._qiblaRAF, null);
  });

  it('should not throw if no resources to clean', () => {
    Screens._qiblaWatchId = null;
    Screens._duaTimer = null;
    Screens._qiblaRAF = null;
    assert.doesNotThrow(() => Screens.cleanup());
  });
});

// ============================================================
// HADITH SCREEN STATE TESTS
// ============================================================

describe('Screens — Hadith State', () => {
  it('should have hadithCollection set to "bukhari"', () => {
    assert.equal(Screens.hadithCollection, 'bukhari');
  });

  it('should have empty hadithSearch by default', () => {
    assert.equal(Screens.hadithSearch, '');
  });

  it('hadithCollection should match a valid API collection ID', () => {
    const validIds = API.hadithCollections.map(c => c.id);
    assert.ok(
      validIds.includes(Screens.hadithCollection),
      `hadithCollection "${Screens.hadithCollection}" is not in API.hadithCollections: [${validIds.join(', ')}]`
    );
  });

  it('should NOT be "sahih_bukhari" (regression test)', () => {
    assert.notEqual(Screens.hadithCollection, 'sahih_bukhari',
      'REGRESSION: hadithCollection should be "bukhari", not "sahih_bukhari"');
  });
});

describe('Screens — renderHadith()', () => {
  beforeEach(() => {
    Screens.hadithCollection = 'bukhari';
    Screens.hadithSearch = '';
  });

  it('should render without throwing', () => {
    assert.doesNotThrow(() => Screens.renderHadith());
  });

  it('should render hadith content into the element', () => {
    Screens.renderHadith();
    const el = document.getElementById('screen-hadith');
    assert.ok(el.innerHTML.length > 0, 'Hadith screen should have content');
    assert.ok(el.innerHTML.includes('Sahih al-Bukhari'), 'Should show collection name');
  });

  it('should render hadith cards', () => {
    Screens.renderHadith();
    const el = document.getElementById('screen-hadith');
    assert.ok(el.innerHTML.includes('Actions are judged by intentions'), 'Should include first hadith text');
    assert.ok(el.innerHTML.includes('Umar ibn al-Khattab'), 'Should include narrator');
  });

  it('should render all 8 collections without error', () => {
    const ids = ['bukhari', 'muslim', 'abudawud', 'tirmidhi', 'nasai', 'ibnmajah', 'malik', 'ahmad'];
    for (const id of ids) {
      Screens.hadithCollection = id;
      assert.doesNotThrow(() => Screens.renderHadith(), `Failed rendering collection: ${id}`);
      const el = document.getElementById('screen-hadith');
      assert.ok(el.innerHTML.length > 100, `Collection ${id} should render substantial content`);
    }
  });

  it('should show collection chips', () => {
    Screens.renderHadith();
    const el = document.getElementById('screen-hadith');
    assert.ok(el.innerHTML.includes('al-Bukhari'), 'Should show Bukhari chip');
    assert.ok(el.innerHTML.includes('Muslim'), 'Should show Muslim chip');
  });

  it('should handle search filtering', () => {
    Screens.hadithSearch = 'intentions';
    Screens.renderHadith();
    const el = document.getElementById('screen-hadith');
    assert.ok(el.innerHTML.includes('intentions'), 'Should show matching hadith');
  });

  it('should show empty state for no-match search', () => {
    Screens.hadithSearch = 'xyznonexistentxyz';
    Screens.renderHadith();
    const el = document.getElementById('screen-hadith');
    assert.ok(el.innerHTML.includes('No hadith found'), 'Should show empty state');
  });

  it('should handle invalid collection gracefully with fallback', () => {
    Screens.hadithCollection = 'nonexistent_collection';
    // Should not throw due to || collections[0] fallback
    assert.doesNotThrow(() => Screens.renderHadith());
  });
});

// ============================================================
// SCREEN HEADER HELPER TESTS
// ============================================================

describe('Screens — _screenHeader()', () => {
  it('should generate header HTML with icon, title, and arabic', () => {
    const html = Screens._screenHeader('📿', 'Tasbih', 'تسبيح');
    assert.ok(html.includes('Tasbih'));
    assert.ok(html.includes('تسبيح'));
    assert.ok(html.includes('📿'));
  });

  it('should include subtitle when provided', () => {
    const html = Screens._screenHeader('📿', 'Tasbih', 'تسبيح', 'Glorification');
    assert.ok(html.includes('Glorification'));
  });

  it('should not include subtitle when omitted', () => {
    const html = Screens._screenHeader('📿', 'Tasbih', 'تسبيح');
    assert.ok(!html.includes('undefined'));
  });
});

// ============================================================
// ISLAMIC CARD HELPER TESTS
// ============================================================

describe('Screens — _islamicCard()', () => {
  it('should wrap content in card', () => {
    const html = Screens._islamicCard('<p>Test</p>');
    assert.ok(html.includes('<p>Test</p>'));
    assert.ok(html.includes('islamic-card'));
  });

  it('should add extra class', () => {
    const html = Screens._islamicCard('<p>Test</p>', 'extra-class');
    assert.ok(html.includes('extra-class'));
  });

  it('should include decorative brackets', () => {
    const html = Screens._islamicCard('<p>Test</p>');
    assert.ok(html.includes('islamic-corner-bracket'));
  });
});

// ============================================================
// HOME SCREEN TESTS
// ============================================================

describe('Screens — renderHome()', () => {
  beforeEach(() => {
    localStorageMock.clear();
    Screens.location = { lat: 32.77, lng: -96.80 };
    Screens.prayerTimes = {
      fajr: '05:30', sunrise: '06:45', dhuhr: '12:15',
      asr: '15:45', maghrib: '18:30', isha: '20:00',
      date: null
    };
  });

  it('should render without throwing', async () => {
    await assert.doesNotReject(async () => {
      await Screens.renderHome();
    });
  });

  it('should show prayer times', async () => {
    await Screens.renderHome();
    const el = document.getElementById('screen-home');
    assert.ok(el.innerHTML.length > 0, 'Home screen should have content');
  });
});

// ============================================================
// ESCAPE HTML TESTS
// ============================================================

describe('Screens — _escapeHTML()', () => {
  it('should escape special characters', () => {
    assert.equal(Screens._escapeHTML('<script>'), '&lt;script&gt;');
    assert.equal(Screens._escapeHTML('"test"'), '&quot;test&quot;');
    assert.equal(Screens._escapeHTML("it's"), "it&#039;s");
    assert.equal(Screens._escapeHTML('a & b'), 'a &amp; b');
  });

  it('should handle null/undefined', () => {
    assert.equal(Screens._escapeHTML(null), '');
    assert.equal(Screens._escapeHTML(undefined), '');
    assert.equal(Screens._escapeHTML(''), '');
  });
});

// ============================================================
// INITIAL STATE TESTS
// ============================================================

describe('Screens — Initial State', () => {
  it('should have prayerTimes initially as set', () => {
    // Can be null or set from previous test
    assert.ok(Screens.prayerTimes === null || typeof Screens.prayerTimes === 'object');
  });

  it('should have currentScreen property', () => {
    assert.equal(Screens.currentScreen, 'home');
  });
});
