/**
 * DeenHub PWA — Test Setup
 * Provides browser API mocks for Node.js environment
 */

// ---- localStorage mock ----
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
    get length() { return Object.keys(store).length; },
    key: (i) => Object.keys(store)[i] || null,
    _store: () => store
  };
})();

global.localStorage = localStorageMock;

// ---- navigator mock ----
global.navigator = {
  geolocation: {
    getCurrentPosition: (success) => {
      success({ coords: { latitude: 32.7767, longitude: -96.7970 } });
    }
  },
  onLine: true,
  vibrate: () => true,
  serviceWorker: { register: () => Promise.resolve() }
};

// ---- window mock ----
global.window = {
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => {}
};

// ---- document mock ----
const elements = {};
global.document = {
  getElementById: (id) => elements[id] || createMockElement(id),
  querySelectorAll: () => [],
  querySelector: () => createMockElement('mock'),
  createElement: (tag) => createMockElement(tag),
  addEventListener: () => {},
  body: { appendChild: () => {} },
  activeElement: null
};

function createMockElement(id) {
  const el = {
    id,
    innerHTML: '',
    textContent: '',
    className: '',
    classList: {
      _classes: new Set(),
      add: function(c) { this._classes.add(c); },
      remove: function(c) { this._classes.delete(c); },
      toggle: function(c, force) {
        if (force === undefined) {
          this._classes.has(c) ? this._classes.delete(c) : this._classes.add(c);
        } else if (force) {
          this._classes.add(c);
        } else {
          this._classes.delete(c);
        }
      },
      contains: function(c) { return this._classes.has(c); }
    },
    style: {},
    dataset: {},
    scrollTop: 0,
    appendChild: () => {},
    remove: () => {},
    addEventListener: () => {},
    removeEventListener: () => {}
  };
  elements[id] = el;
  return el;
}

// ---- fetch mock ----
global.fetch = async (url) => {
  // Prayer times API
  if (url.includes('api.aladhan.com')) {
    return {
      ok: true,
      json: async () => ({
        code: 200,
        data: {
          timings: {
            Fajr: '05:30', Sunrise: '06:45', Dhuhr: '12:15',
            Asr: '15:45', Maghrib: '18:30', Isha: '20:00'
          },
          date: { hijri: { day: '14', month: { en: 'Ramadan' }, year: '1447' } }
        }
      })
    };
  }
  // Quran surah list
  if (url.includes('api.alquran.cloud/v1/surah') && !url.includes('/v1/surah/')) {
    return {
      ok: true,
      json: async () => ({
        code: 200,
        data: [
          { number: 1, englishName: 'Al-Fatihah', name: 'الفاتحة', englishNameTranslation: 'The Opening', numberOfAyahs: 7, revelationType: 'Meccan' },
          { number: 2, englishName: 'Al-Baqarah', name: 'البقرة', englishNameTranslation: 'The Cow', numberOfAyahs: 286, revelationType: 'Medinan' },
          { number: 114, englishName: 'An-Nas', name: 'الناس', englishNameTranslation: 'Mankind', numberOfAyahs: 6, revelationType: 'Meccan' }
        ]
      })
    };
  }
  // Quran search
  if (url.includes('api.alquran.cloud/v1/search')) {
    return {
      ok: true,
      json: async () => ({
        code: 200,
        data: { matches: [{ surah: { number: 1, englishName: 'Al-Fatihah' }, numberInSurah: 1, text: 'Test match' }] }
      })
    };
  }
  // Overpass (mosque/halal search)
  if (url.includes('overpass-api.de')) {
    return {
      ok: true,
      json: async () => ({ elements: [{ type: 'node', id: 1, lat: 32.77, lon: -96.79, tags: { name: 'Test Mosque', amenity: 'place_of_worship' } }] })
    };
  }
  // Default
  return { ok: true, json: async () => ({}) };
};

// ---- Audio mock ----
global.Audio = class Audio {
  constructor() {
    this.src = '';
    this.paused = true;
    this.currentTime = 0;
    this.duration = 120;
    this.playbackRate = 1;
    this.onended = null;
    this._listeners = {};
  }
  play() { this.paused = false; return Promise.resolve(); }
  pause() { this.paused = true; }
  addEventListener(event, fn) {
    this._listeners[event] = this._listeners[event] || [];
    this._listeners[event].push(fn);
  }
  removeEventListener() {}
};

// ---- Notification mock ----
global.Notification = class Notification {
  static permission = 'granted';
  static requestPermission = async () => 'granted';
  constructor(title, opts) {
    this.title = title;
    this.body = opts?.body || '';
  }
};

// ---- requestAnimationFrame / cancelAnimationFrame ----
global.requestAnimationFrame = (fn) => setTimeout(fn, 0);
global.cancelAnimationFrame = (id) => clearTimeout(id);

// ---- setInterval / clearInterval (already available in Node) ----

// ---- Date mock helper ----
function mockDate(dateString) {
  const RealDate = Date;
  const mockNow = new RealDate(dateString).getTime();
  global.Date = class extends RealDate {
    constructor(...args) {
      if (args.length === 0) return new RealDate(mockNow);
      return new (Function.prototype.bind.apply(RealDate, [null, ...args]))();
    }
    static now() { return mockNow; }
  };
  return () => { global.Date = RealDate; };
}

// Export helpers
module.exports = { localStorageMock, createMockElement, mockDate, elements };
