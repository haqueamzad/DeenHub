/**
 * DeenHub PWA — App Module Tests
 */
const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { localStorageMock, elements } = require('./setup');

// Load dependencies — must be global so App can see Store and API
const fs = require('fs');
global.Store = new Function(fs.readFileSync(__dirname + '/../js/storage.js', 'utf8') + '; return Store;')();
global.API = new Function(fs.readFileSync(__dirname + '/../js/api.js', 'utf8') + '; return API;')();

// Mock I18n
global.I18n = {
  init: () => {},
  updateTabBar: () => {},
  t: (key) => key
};

// Mock Screens
global.Screens = {
  cleanup: () => {},
  renderHome: () => {},
  renderQuran: () => {},
  renderHadith: () => {},
  renderAI: () => {},
  renderCommunity: () => {},
  renderProfile: () => {},
  renderTasbih: () => {},
  renderQibla: () => {},
  renderDuas: () => {},
  renderZakat: () => {},
  renderCalendar: () => {},
  renderAzan: () => {},
  prayerTimes: null,
  location: null,
  logDailyPrayer: () => {},
  onAyahAudioEnded: null,
  onAudioTimeUpdate: null
};

// Load App (it will call document.addEventListener which is mocked)
const appCode = fs.readFileSync(__dirname + '/../js/app.js', 'utf8');
// Remove the DOMContentLoaded listener and keyboard listener to avoid side effects
const cleanAppCode = appCode
  .replace(/document\.addEventListener\('keydown'[\s\S]*?\}\);/, '')
  .replace(/document\.addEventListener\('DOMContentLoaded'[\s\S]*?\}\);/, '');
const App = new Function(cleanAppCode + '; return App;')();

// Ensure screen elements exist
['home', 'quran', 'hadith', 'ai', 'community', 'profile', 'tasbih', 'qibla', 'duas', 'zakat', 'calendar', 'azan'].forEach(s => {
  const el = document.getElementById(`screen-${s}`);
  el.classList._classes = new Set();
});
document.getElementById('header-title');
document.getElementById('header-subtitle');
const backBtn = document.getElementById('header-back');
backBtn.classList._classes = new Set(['hidden']);
document.getElementById('toast');
document.getElementById('offline-banner');
const screenArea = document.getElementById('screen-area');
if (screenArea) screenArea.scrollTop = 0;

// ============================================================
// NAVIGATION TESTS
// ============================================================

describe('App — Navigation', () => {
  beforeEach(() => {
    App.currentTab = 'home';
    App.subScreen = null;
  });

  it('should have "home" as default tab', () => {
    assert.equal(App.currentTab, 'home');
    assert.equal(App.subScreen, null);
  });

  it('should navigate to quran tab', () => {
    App.navigate('quran');
    assert.equal(App.currentTab, 'quran');
    assert.equal(App.subScreen, null);
  });

  it('should navigate to hadith tab', () => {
    App.navigate('hadith');
    assert.equal(App.currentTab, 'hadith');
    assert.equal(App.subScreen, null);
  });

  it('should navigate to all main tabs', () => {
    const mainTabs = ['home', 'quran', 'hadith', 'ai', 'community', 'profile'];
    for (const tab of mainTabs) {
      App.navigate(tab);
      assert.equal(App.currentTab, tab, `Failed to navigate to ${tab}`);
      assert.equal(App.subScreen, null, `subScreen should be null for ${tab}`);
    }
  });

  it('should handle sub-screens correctly', () => {
    App.navigate('home');
    App.navigate('tasbih');
    assert.equal(App.subScreen, 'tasbih');
    assert.equal(App.currentTab, 'home'); // main tab unchanged
  });

  it('should handle all sub-screens', () => {
    const subScreens = ['tasbih', 'qibla', 'duas', 'zakat', 'calendar', 'azan'];
    for (const sub of subScreens) {
      App.navigate(sub);
      assert.equal(App.subScreen, sub, `Failed for sub-screen ${sub}`);
    }
  });

  it('goBack should return to current main tab', () => {
    App.navigate('home');
    App.navigate('tasbih');
    assert.equal(App.subScreen, 'tasbih');
    App.goBack();
    assert.equal(App.subScreen, null);
    assert.equal(App.currentTab, 'home');
  });

  it('should show back button for sub-screens', () => {
    App.navigate('tasbih');
    assert.ok(!backBtn.classList.contains('hidden'), 'Back button should be visible');
  });

  it('should hide back button for main tabs', () => {
    App.navigate('home');
    assert.ok(backBtn.classList.contains('hidden'), 'Back button should be hidden');
  });
});

// ============================================================
// HEADER TESTS
// ============================================================

describe('App — Header', () => {
  it('should update header title for each screen', () => {
    const titleEl = document.getElementById('header-title');
    const subtitleEl = document.getElementById('header-subtitle');

    App.updateHeader('hadith');
    assert.equal(titleEl.textContent, 'hadith'); // I18n.t returns key
    assert.equal(subtitleEl.textContent, '8 Collections');
  });

  it('should handle all screen titles without error', () => {
    const screens = ['home', 'quran', 'hadith', 'ai', 'community', 'profile', 'tasbih', 'qibla', 'duas', 'zakat', 'calendar', 'azan'];
    for (const s of screens) {
      assert.doesNotThrow(() => App.updateHeader(s), `Failed for screen: ${s}`);
    }
  });

  it('should fallback for unknown screen', () => {
    const titleEl = document.getElementById('header-title');
    App.updateHeader('unknown');
    assert.equal(titleEl.textContent, 'DeenHub');
  });
});

// ============================================================
// TOAST TESTS
// ============================================================

describe('App — Toast', () => {
  it('should show toast message', () => {
    const toast = document.getElementById('toast');
    App.toast('Test message');
    assert.equal(toast.textContent, 'Test message');
    assert.ok(toast.classList.contains('show'));
  });
});

// ============================================================
// RENDER SCREEN TESTS
// ============================================================

describe('App — renderScreen', () => {
  it('should call correct render method for each screen', () => {
    const called = {};
    const originalScreens = { ...global.Screens };

    // Override each render method to track calls
    const screens = ['Home', 'Quran', 'Hadith', 'AI', 'Community', 'Profile', 'Tasbih', 'Qibla', 'Duas', 'Zakat', 'Calendar', 'Azan'];
    for (const s of screens) {
      Screens[`render${s}`] = () => { called[s] = true; };
    }

    App.renderScreen('home'); assert.ok(called.Home);
    App.renderScreen('quran'); assert.ok(called.Quran);
    App.renderScreen('hadith'); assert.ok(called.Hadith);
    App.renderScreen('ai'); assert.ok(called.AI);
    App.renderScreen('community'); assert.ok(called.Community);
    App.renderScreen('profile'); assert.ok(called.Profile);
    App.renderScreen('tasbih'); assert.ok(called.Tasbih);
    App.renderScreen('qibla'); assert.ok(called.Qibla);
    App.renderScreen('duas'); assert.ok(called.Duas);
    App.renderScreen('zakat'); assert.ok(called.Zakat);
    App.renderScreen('calendar'); assert.ok(called.Calendar);
    App.renderScreen('azan'); assert.ok(called.Azan);

    // Restore
    Object.assign(Screens, originalScreens);
  });
});

// ============================================================
// AZAN MONITOR TESTS
// ============================================================

describe('App — Azan Monitor', () => {
  beforeEach(() => {
    localStorageMock.clear();
    App._azanTriggeredToday = {};
    App._lastAzanDate = undefined;
  });

  it('should have _azanTriggeredToday object', () => {
    assert.ok(typeof App._azanTriggeredToday === 'object');
  });

  it('should not crash if Screens.prayerTimes is null', async () => {
    Screens.prayerTimes = null;
    Screens.location = { lat: 32.77, lng: -96.80 };
    // checkPrayerTime fetches prayer times if not cached
    await assert.doesNotReject(async () => {
      await App.checkPrayerTime();
    });
  });
});

// ============================================================
// NETWORK MONITOR TESTS
// ============================================================

describe('App — Network Monitor', () => {
  it('should setup without error', () => {
    assert.doesNotThrow(() => App._setupNetworkMonitor());
  });
});

// ============================================================
// NOTIFICATION TESTS
// ============================================================

describe('App — Notifications', () => {
  it('should send notification when permission granted', async () => {
    Notification.permission = 'granted';
    await assert.doesNotReject(async () => {
      await App.sendNotification('Test', 'Body');
    });
  });

  it('should handle missing Notification API', async () => {
    const origNotif = global.Notification;
    delete global.Notification;
    global.window = global.window || {};
    // sendNotification checks 'Notification' in window
    await assert.doesNotReject(async () => {
      await App.sendNotification('Test', 'Body');
    });
    global.Notification = origNotif;
  });
});
