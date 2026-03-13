/* ============================================================
   DeenHub PWA — App Controller
   ============================================================ */

const App = {
  currentTab: 'home',
  subScreen: null, // for tasbih, qibla, duas, zakat, calendar
  _azanMonitorId: null,
  _azanTriggeredToday: {}, // track which prayers already triggered

  async init() {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(e => console.log('SW registration skipped:', e.message));
    }

    // Initialize streak on first visit
    if (!Store.get('xp')) {
      Store.set('xp', 0);
      Store.set('level', 1);
      Store.set('streak', 0);
    }

    // Initialize i18n system (auto-detect or load saved language)
    I18n.init();
    I18n.updateTabBar();

    // Request notification permission early
    this.requestNotificationPermission();

    // Render initial screen
    this.navigate('home');

    // Update time every minute
    setInterval(() => {
      if (this.currentTab === 'home' && !this.subScreen) Screens.renderHome();
    }, 60000);

    // Start Azan prayer time monitor (checks every 30 seconds)
    this.startAzanMonitor();
  },

  // ---- Azan Prayer Time Monitor ----
  async startAzanMonitor() {
    // Check every 30 seconds if it's prayer time
    this._azanMonitorId = setInterval(() => this.checkPrayerTime(), 30000);
    // Also check immediately
    setTimeout(() => this.checkPrayerTime(), 5000);
  },

  async checkPrayerTime() {
    const settings = Store.getAzanSettings();
    if (!settings.enabled) return;

    // Get prayer times (use cached if available)
    if (!Screens.prayerTimes) {
      if (!Screens.location) Screens.location = await API.getLocation();
      Screens.prayerTimes = await API.getPrayerTimes(Screens.location.lat, Screens.location.lng);
    }
    const pt = Screens.prayerTimes;
    if (!pt) return;

    const now = new Date();
    const today = now.toDateString();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Reset triggers at midnight
    if (this._lastAzanDate !== today) {
      this._azanTriggeredToday = {};
      this._lastAzanDate = today;
    }

    const prayers = [
      { key: 'fajr', name: 'Fajr', time: pt.fajr, icon: '\uD83C\uDF19' },
      { key: 'dhuhr', name: 'Dhuhr', time: pt.dhuhr, icon: '\u2600\uFE0F' },
      { key: 'asr', name: 'Asr', time: pt.asr, icon: '\uD83C\uDF24\uFE0F' },
      { key: 'maghrib', name: 'Maghrib', time: pt.maghrib, icon: '\uD83C\uDF05' },
      { key: 'isha', name: 'Isha', time: pt.isha, icon: '\uD83C\uDF1B' }
    ];

    for (const prayer of prayers) {
      // Skip if this prayer is disabled
      if (!settings.prayers[prayer.key]) continue;
      // Skip if already triggered today
      if (this._azanTriggeredToday[prayer.key]) continue;

      const [h, m] = prayer.time.split(':').map(Number);
      const prayerMinutes = h * 60 + m;

      // Check pre-alert (minutes before prayer)
      if (settings.preAlert > 0) {
        const preAlertMinutes = prayerMinutes - settings.preAlert;
        const preKey = prayer.key + '_pre';
        if (!this._azanTriggeredToday[preKey] && currentMinutes >= preAlertMinutes && currentMinutes < preAlertMinutes + 1) {
          this._azanTriggeredToday[preKey] = true;
          this.showPreAzanAlert(prayer, settings.preAlert);
        }
      }

      // Check if it's prayer time (within 1-minute window)
      if (currentMinutes >= prayerMinutes && currentMinutes < prayerMinutes + 1) {
        this._azanTriggeredToday[prayer.key] = true;
        this.triggerAzan(prayer, settings);
      }
    }
  },

  async triggerAzan(prayer, settings) {
    // Determine which voice to use
    let voiceId = settings.voice;
    if (settings.fajrSpecial && prayer.key === 'fajr' && settings.fajrVoice) {
      voiceId = settings.fajrVoice;
    }

    // Play Azan audio
    const vol = settings.volume / 100;
    await API.playAzan(voiceId, vol);

    // Vibrate if supported and enabled
    if (settings.vibrate && navigator.vibrate) {
      navigator.vibrate([300, 100, 300, 100, 500]);
    }

    // Show full-screen overlay if enabled
    if (settings.fullScreen) {
      this.showAzanOverlay(prayer, voiceId);
    }

    // Browser notification
    if (settings.notifications) {
      this.sendAzanNotification(prayer);
    }

    // Log trigger to prevent duplicate
    Store.setLastAzanTrigger(prayer.key);
  },

  showPreAzanAlert(prayer, minutes) {
    this.toast(`${prayer.icon} ${prayer.name} in ${minutes} minutes`);
    if (Store.getAzanSettings().notifications) {
      this.sendNotification(`${prayer.name} in ${minutes} min`, `Prepare for ${prayer.name} prayer`);
    }
  },

  showAzanOverlay(prayer, voiceId) {
    const azan = API.getAzanById(voiceId);
    // Remove existing overlay if any
    const existing = document.getElementById('azan-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'azan-overlay';
    overlay.className = 'azan-overlay';
    overlay.innerHTML = `
      <div class="azan-overlay-content">
        <div class="azan-overlay-mosque">\uD83D\uDD4C</div>
        <div class="azan-overlay-arabic">
          \u0627\u0644\u0644\u0647\u064F \u0623\u0643\u0652\u0628\u064E\u0631\u064F
        </div>
        <div class="azan-overlay-english">Allahu Akbar</div>
        <div class="azan-overlay-prayer">${prayer.icon} ${prayer.name}</div>
        <div class="azan-overlay-time">${prayer.time}</div>
        <div class="azan-overlay-muezzin">${azan.muezzin}</div>
        <div class="azan-overlay-wave">
          <div class="azan-wave-bar"></div>
          <div class="azan-wave-bar"></div>
          <div class="azan-wave-bar"></div>
          <div class="azan-wave-bar"></div>
          <div class="azan-wave-bar"></div>
          <div class="azan-wave-bar"></div>
          <div class="azan-wave-bar"></div>
        </div>
        <div class="azan-overlay-actions">
          <button class="azan-overlay-btn azan-stop-btn" onclick="App.dismissAzan()">Stop</button>
          <button class="azan-overlay-btn azan-pray-btn" onclick="App.dismissAzan();Screens.logDailyPrayer();App.toast('${prayer.name} logged!')">Prayed</button>
        </div>
        <div class="azan-overlay-dua">
          <div class="azan-dua-arabic">\u0627\u0644\u0644\u0647\u0645 \u0631\u0628 \u0647\u0630\u0647 \u0627\u0644\u062F\u0639\u0648\u0629 \u0627\u0644\u062A\u0627\u0645\u0629</div>
          <div class="azan-dua-english">O Allah, Lord of this perfect call...</div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('show'));

    // Auto-dismiss when Azan ends
    window.addEventListener('azanEnded', () => this.dismissAzan(), { once: true });
  },

  dismissAzan() {
    API.stopAzan();
    const overlay = document.getElementById('azan-overlay');
    if (overlay) {
      overlay.classList.remove('show');
      setTimeout(() => overlay.remove(), 500);
    }
  },

  // ---- Notification System ----
  async requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      // Don't ask immediately, wait for user interaction
    }
  },

  async sendAzanNotification(prayer) {
    await this.sendNotification(
      `${prayer.icon} ${prayer.name} Prayer Time`,
      `It's time for ${prayer.name} prayer (${prayer.time}). May Allah accept your prayers.`
    );
  },

  async sendNotification(title, body) {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'default') {
      await Notification.requestPermission();
    }
    if (Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: 'icons/icon-192.png',
          badge: 'icons/icon-192.png',
          tag: 'deenhub-azan',
          requireInteraction: true,
          vibrate: [300, 100, 300]
        });
      } catch (e) {
        console.warn('Notification failed:', e);
      }
    }
  },

  // ---- Test Azan (for settings preview) ----
  async testAzan(voiceId) {
    const settings = Store.getAzanSettings();
    const vol = settings.volume / 100;
    await API.previewAzan(voiceId || settings.voice, vol);
  },

  navigate(screen) {
    // Sub-screens that overlay
    const subScreens = ['tasbih', 'qibla', 'duas', 'zakat', 'calendar', 'azan'];
    const mainTabs = ['home', 'quran', 'hadith', 'ai', 'community', 'profile'];

    if (subScreens.includes(screen)) {
      this.subScreen = screen;
      // Hide all screens
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      document.getElementById(`screen-${screen}`).classList.add('active');
      // Update header
      this.updateHeader(screen);
      // Render
      this.renderScreen(screen);
      return;
    }

    // Main tab
    this.subScreen = null;
    this.currentTab = screen;

    // Update screen visibility
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(`screen-${screen}`).classList.add('active');

    // Update tabs
    document.querySelectorAll('.tab-item').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === screen);
    });

    // Update header
    this.updateHeader(screen);

    // Render
    this.renderScreen(screen);

    // Scroll to top
    document.querySelector('.screen-area').scrollTop = 0;
  },

  renderScreen(screen) {
    switch (screen) {
      case 'home': Screens.renderHome(); break;
      case 'quran': Screens.renderQuran(); break;
      case 'hadith': Screens.renderHadith(); break;
      case 'ai': Screens.renderAI(); break;
      case 'community': Screens.renderCommunity(); break;
      case 'profile': Screens.renderProfile(); break;
      case 'tasbih': Screens.renderTasbih(); break;
      case 'qibla': Screens.renderQibla(); break;
      case 'duas': Screens.renderDuas(); break;
      case 'zakat': Screens.renderZakat(); break;
      case 'calendar': Screens.renderCalendar(); break;
      case 'azan': Screens.renderAzan(); break;
    }
  },

  updateHeader(screen) {
    const t = (k) => I18n.t(k);
    const titles = {
      home: [t('appName'), t('appSubtitle')],
      quran: [t('quran'), '114 ' + t('surah')],
      hadith: [t('hadith'), '8 Collections'],
      ai: [t('aiScholar'), t('askAboutIslam')],
      community: [t('ummah'), t('theUmmah')],
      profile: [t('profile'), t('level')],
      tasbih: [t('tasbih'), t('glorification')],
      qibla: [t('qibla'), t('qiblaDirection')],
      duas: [t('duas'), t('supplications')],
      zakat: [t('zakat'), t('purificationWealth')],
      calendar: [t('calendar'), t('hijriCalendar')],
      azan: [t('azan'), t('azanPlayer')]
    };
    const [title, sub] = titles[screen] || ['DeenHub', ''];
    document.getElementById('header-title').textContent = title;
    document.getElementById('header-subtitle').textContent = sub;

    // Show/hide back button for sub-screens
    const backBtn = document.getElementById('header-back');
    if (this.subScreen) {
      backBtn.classList.remove('hidden');
    } else {
      backBtn.classList.add('hidden');
    }
  },

  goBack() {
    this.navigate(this.currentTab);
  },

  toast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
  }
};

// Boot
document.addEventListener('DOMContentLoaded', () => App.init());
