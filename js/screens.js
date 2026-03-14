/* ============================================================
   DeenHub PWA — Screen Renderers
   ============================================================ */

const Screens = {
  currentScreen: 'home',
  prayerTimes: null,
  location: null,

  // ==== CLEANUP (call when leaving a screen) ====
  cleanup() {
    // Stop Qibla compass listeners
    if (this._qiblaWatchId) {
      window.removeEventListener('deviceorientationabsolute', this._qiblaOrientHandler);
      window.removeEventListener('deviceorientation', this._qiblaOrientHandler);
      this._qiblaWatchId = null;
      this._qiblaCompassActive = false;
    }
    // Stop Dua audio timer
    if (this._duaTimer) { clearInterval(this._duaTimer); this._duaTimer = null; }
    // Stop any compass RAF
    if (this._qiblaRAF) { cancelAnimationFrame(this._qiblaRAF); this._qiblaRAF = null; }
  },

  // ==== SHARED ISLAMIC HELPERS ====
  _screenHeader(icon, title, arabicTitle, subtitle) {
    const archSVG = `<svg style="width:100%;height:12px;margin-top:-6px" viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <path d="M0 10 Q50 0 100 0 Q150 0 200 10" stroke="rgba(212,168,67,0.4)" stroke-width="2" fill="none"/>
      <circle cx="100" cy="10" r="3" fill="rgba(212,168,67,0.6)"/>
    </svg>`;
    return `
      <div style="text-align:center;margin-bottom:20px">
        <div style="font-size:28px;margin-bottom:8px">${icon}</div>
        <div style="font-family:'Amiri',serif;font-size:24px;color:var(--gold-light);margin-bottom:2px;letter-spacing:0.5px">${arabicTitle}</div>
        <div style="font-size:18px;font-weight:600">${title}</div>
        ${subtitle ? `<div style="font-size:12px;color:var(--text-sec);margin-top:4px">${subtitle}</div>` : ''}
        ${archSVG}
      </div>
    `;
  },

  _islamicCard(content, extraClass = '') {
    return `
      <div class="card islamic-card ${extraClass}">
        <div style="position:relative;padding:12px">
          <div class="islamic-corner-bracket" style="top:0;left:0">◛</div>
          <div class="islamic-corner-bracket" style="top:0;right:0;transform:scaleX(-1)">◛</div>
          ${content}
          <div class="islamic-corner-bracket" style="bottom:0;left:0;transform:scaleY(-1)">◛</div>
          <div class="islamic-corner-bracket" style="bottom:0;right:0;transform:scale(-1,-1)">◛</div>
        </div>
      </div>
    `;
  },

  // ==== HOME SCREEN ====
  async renderHome() {
    const el = document.getElementById('screen-home');
    el.innerHTML = '<div class="loading-spinner"></div>';

    // Get location & prayer times
    if (!this.location) this.location = await API.getLocation();
    if (!this.prayerTimes) this.prayerTimes = await API.getPrayerTimes(this.location.lat, this.location.lng);

    const pt = this.prayerTimes;
    const streak = Store.getStreak() || Store.updateStreak();
    const todayPrayers = Store.getTodayPrayers();
    const { xp, level } = Store.getStats();

    // Determine next prayer
    const now = new Date();
    const t = (k) => I18n.t(k);
    const prayers = [
      { name: t('fajr'), time: pt.fajr },
      { name: t('dhuhr'), time: pt.dhuhr },
      { name: t('asr'), time: pt.asr },
      { name: t('maghrib'), time: pt.maghrib },
      { name: t('isha'), time: pt.isha }
    ];
    let nextPrayer = prayers[prayers.length - 1];
    for (const p of prayers) {
      const [h, m] = p.time.split(':').map(Number);
      const pTime = new Date(); pTime.setHours(h, m, 0, 0);
      if (pTime > now) { nextPrayer = p; break; }
    }

    // Countdown
    const [nh, nm] = nextPrayer.time.split(':').map(Number);
    const nextDate = new Date(); nextDate.setHours(nh, nm, 0, 0);
    if (nextDate <= now) nextDate.setDate(nextDate.getDate() + 1);
    const diff = nextDate - now;
    const hrs = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);

    // Format time
    const formatTime = (t) => {
      const [h, m] = t.split(':').map(Number);
      const ampm = h >= 12 ? 'PM' : 'AM';
      return `${h > 12 ? h - 12 : h || 12}:${String(m).padStart(2, '0')} ${ampm}`;
    };

    // Mosque silhouette SVG
    const mosqueSVG = `<svg class="mosque-silhouette" viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="mg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(255,255,255,0.08)"/><stop offset="1" stop-color="rgba(255,255,255,0)"/></linearGradient></defs><path d="M0 160 L0 120 Q0 110 10 110 L30 110 L30 80 Q30 70 40 65 L50 60 Q55 40 60 30 Q62 25 65 30 Q70 40 75 60 L85 65 Q95 70 95 80 L95 110 L120 110 L120 90 Q150 50 180 90 L180 110 L200 110 L200 70 Q200 40 210 20 Q212 10 215 5 Q218 10 220 20 Q230 40 230 70 L230 110 L250 110 L250 90 Q280 50 310 90 L310 110 L335 110 L335 80 Q335 70 345 65 L355 60 Q360 40 365 30 Q367 25 370 30 Q375 40 380 60 L390 65 Q400 70 400 80 L400 110 Q400 110 400 110 L400 160 Z" fill="url(#mg)"/><circle cx="65" cy="18" r="4" fill="rgba(212,168,67,0.4)"/><circle cx="215" cy="3" r="5" fill="rgba(212,168,67,0.5)"/><circle cx="370" cy="18" r="4" fill="rgba(212,168,67,0.4)"/></svg>`;

    // Ornamental divider
    const ornament = `<div class="islamic-ornament"><svg viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg"><path d="M0 10 L70 10" stroke="rgba(212,168,67,0.3)" stroke-width="1" fill="none"/><path d="M130 10 L200 10" stroke="rgba(212,168,67,0.3)" stroke-width="1" fill="none"/><path d="M80 10 L90 5 L100 10 L110 15 L120 10" stroke="rgba(212,168,67,0.5)" stroke-width="1.5" fill="none"/><circle cx="100" cy="10" r="3" fill="rgba(212,168,67,0.4)"/><circle cx="85" cy="7" r="1.5" fill="rgba(212,168,67,0.3)"/><circle cx="115" cy="13" r="1.5" fill="rgba(212,168,67,0.3)"/></svg></div>`;

    // Prayer icons (use translated names as keys)
    const prayerIcons = {};
    prayerIcons[t('fajr')] = '🌙';
    prayerIcons[t('dhuhr')] = '☀️';
    prayerIcons[t('asr')] = '🌤️';
    prayerIcons[t('maghrib')] = '🌅';
    prayerIcons[t('isha')] = '🌛';

    el.innerHTML = `
      <div class="prayer-hero crescent-stars">
        ${mosqueSVG}
        <div class="prayer-hero-content">
          <div class="prayer-label">${t('nextPrayer')}</div>
          <div class="prayer-name">${nextPrayer.name}</div>
          <div class="prayer-time-big">${formatTime(nextPrayer.time)}</div>
          <div class="prayer-countdown">in ${hrs}h ${mins}m</div>
        </div>
      </div>

      <div class="prayer-times-row">
        ${prayers.map(p => `
          <div class="prayer-cell ${p.name === nextPrayer.name ? 'current' : ''}">
            <div class="prayer-cell-icon">${prayerIcons[p.name] || ''}</div>
            <div class="prayer-cell-name">${p.name}</div>
            <div class="prayer-cell-time">${p.time}</div>
          </div>
        `).join('')}
      </div>

      <div class="streak-bar card-hover" onclick="Screens.logDailyPrayer()">
        <div class="streak-flame">🔥</div>
        <div class="streak-info">
          <div class="streak-count">${streak} ${t('dayStreak')}</div>
          <div class="streak-label">${todayPrayers.length}/5 ${t('prayersLogged')}</div>
        </div>
        <div class="streak-xp">+50 XP</div>
      </div>

      ${ornament}

      <div class="section-title">✦ ${t('quickActions')}</div>
      <div class="quick-grid">
        <div class="quick-item" onclick="App.navigate('quran')"><div class="quick-icon">📖</div><div class="quick-label">${t('quran')}</div></div>
        <div class="quick-item" onclick="App.navigate('hadith')"><div class="quick-icon">📜</div><div class="quick-label">${t('hadith')}</div></div>
        <div class="quick-item" onclick="App.navigate('ai')"><div class="quick-icon">✨</div><div class="quick-label">${t('aiScholar')}</div></div>
        <div class="quick-item" onclick="App.navigate('tasbih')"><div class="quick-icon">📿</div><div class="quick-label">${t('tasbih')}</div></div>
        <div class="quick-item" onclick="App.navigate('azan')" style="border:1.5px solid var(--gold);background:rgba(212,168,67,0.08)"><div class="quick-icon">🕌</div><div class="quick-label" style="color:var(--gold-light)">${t('azan')}</div></div>
        <div class="quick-item" onclick="App.navigate('qibla')"><div class="quick-icon">🧭</div><div class="quick-label">${t('qibla')}</div></div>
        <div class="quick-item" onclick="App.navigate('duas')"><div class="quick-icon">🤲</div><div class="quick-label">${t('duas')}</div></div>
        <div class="quick-item" onclick="App.navigate('zakat')"><div class="quick-icon">💰</div><div class="quick-label">${t('zakat')}</div></div>
        <div class="quick-item" onclick="App.navigate('calendar')"><div class="quick-icon">📅</div><div class="quick-label">${t('calendar')}</div></div>
      </div>

      ${ornament}

      <div class="section-title">✦ ${t('dailyVerse')}</div>
      <div class="verse-card card card-hover card-islamic" onclick="App.navigate('quran')">
        <div class="verse-bismillah">﷽</div>
        <div class="arabic-text" style="margin-bottom:12px;font-size:28px;line-height:2">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</div>
        <div class="verse-translation">In the name of Allah, the Most Gracious, the Most Merciful</div>
        <div class="verse-reference">— Surah Al-Fatihah 1:1</div>
      </div>

      <div class="card xp-card">
        <div class="row" style="justify-content:space-between">
          <div>
            <div class="xp-level-text">✦ ${t('level')} ${level}</div>
            <div style="font-size:11px;color:var(--text-sec)">${xp} ${t('xpEarned')}</div>
          </div>
          <div style="font-size:11px;color:var(--text-sec)">${500 - (xp % 500)} ${t('xpToNext')}</div>
        </div>
        <div class="xp-bar-wrap" style="max-width:100%;margin-top:8px">
          <div class="xp-bar-bg"><div class="xp-bar-fill" style="width:${(xp % 500) / 5}%"></div></div>
        </div>
      </div>
    `;
  },

  logDailyPrayer() {
    const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const today = Store.getTodayPrayers();
    const next = prayers.find(p => !today.includes(p));
    if (next) {
      Store.logPrayer(next);
      Store.unlockAchievement('first_prayer');
      App.toast(`${next} logged! +20 XP`);
      this.renderHome();
    } else {
      App.toast('All 5 prayers logged today!');
    }
  },

  // ==== QURAN SCREEN ====
  quranSurahs: null,
  quranSearch: '',
  quranView: 'list', // 'list', 'reader', 'search'
  quranActiveSurah: null,
  quranTab: 'surah', // 'surah', 'juz', 'bookmarks'
  quranShowTranslit: false,
  quranWordByWord: false,
  quranPlayingAyah: null,
  quranAyahs: null,
  quranSearchResults: [],
  quranSelectedReciter: 'ar.alafasy',
  quranSelectedTranslation: 'en.sahih',
  quranWordHighlightIdx: -1,
  quranAudioInterval: null,
  quranTajweed: false,
  quranFontSize: 24,
  quranAudioSpeed: 1.0,
  quranRepeatAyah: false,
  quranContinuousPlay: true, // auto-advance to next ayah

  // Tajweed color coding rules
  tajweedRules: [
    { name: 'ghunna', pattern: /[\u0646\u0645]\u0651/g, color: '#2ECC71' },
    { name: 'idgham', pattern: /\u0646[\u064E\u064F\u0650\u0652]?\s*[\u064A\u0631\u0645\u0644\u0648\u0646]/g, color: '#3498DB' },
    { name: 'ikhfaa', pattern: /\u0646[\u064E\u064F\u0650\u0652]?\s*[\u062A\u062B\u062C\u062F\u0630\u0632\u0633\u0634\u0635\u0636\u0637\u0638\u0641\u0642\u0643]/g, color: '#E67E22' },
    { name: 'iqlab', pattern: /\u0646[\u064E\u064F\u0650\u0652]?\s*\u0628/g, color: '#9B59B6' },
    { name: 'qalqalah', pattern: /[\u0642\u0637\u0628\u062C\u062F][\u0652\u0670]?/g, color: '#E74C3C' },
    { name: 'madd', pattern: /[\u0627\u0648\u064A][\u064E\u064F\u0650]?\u0653?[\u0627\u0670]?/g, color: '#1ABC9C' }
  ],

  applyTajweed(text) {
    if (!this.quranTajweed) return text;
    let result = text;
    this.tajweedRules.forEach(rule => {
      result = result.replace(rule.pattern, match =>
        `<span class="tajweed-${rule.name}" style="color:${rule.color};font-weight:bold;text-shadow:0 0 6px ${rule.color}40">${match}</span>`
      );
    });
    return result;
  },

  async renderQuran() {
    const el = document.getElementById('screen-quran');

    if (this.quranView === 'reader' && this.quranActiveSurah) {
      return this.renderQuranReader(el);
    }

    if (this.quranView === 'search') {
      return this.renderQuranSearch(el);
    }

    return this.renderQuranList(el);
  },

  async renderQuranList(el) {
    if (!this.quranSurahs) {
      el.innerHTML = '<div class="loading-spinner"></div>';
      this.quranSurahs = await API.getSurahList();
    }

    const bookmarks = Store.getBookmarks();
    const lastRead = Store.getLastRead();
    const progress = Store.getReadingProgress();

    const quranBookSVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:32px;height:32px">
      <path d="M25 20 L25 80 L50 70 L75 80 L75 20 Z" fill="rgba(212,168,67,0.8)" stroke="rgba(212,168,67,0.6)" stroke-width="2"/>
      <line x1="35" y1="25" x2="65" y2="25" stroke="rgba(30,40,60,0.6)" stroke-width="1.5"/>
      <line x1="35" y1="35" x2="65" y2="35" stroke="rgba(30,40,60,0.4)" stroke-width="1"/>
      <line x1="35" y1="45" x2="65" y2="45" stroke="rgba(30,40,60,0.4)" stroke-width="1"/>
      <line x1="35" y1="55" x2="65" y2="55" stroke="rgba(30,40,60,0.4)" stroke-width="1"/>
    </svg>`;

    let content = '';

    if (this.quranTab === 'surah') {
      let filtered = this.quranSurahs;
      if (this.quranSearch) {
        const q = this.quranSearch.toLowerCase();
        filtered = filtered.filter(s =>
          s.name.toLowerCase().includes(q) || s.translation.toLowerCase().includes(q) || String(s.number).includes(q)
        );
      }

      content = `
        <div class="search-bar">
          <span>🔍</span>
          <input type="text" placeholder="Search surahs..." value="${this.quranSearch}" oninput="Screens.quranSearch=this.value;Screens.renderQuran()">
        </div>
        ${lastRead ? `
          <div class="card card-hover mb-8" onclick="Screens.openSurah(${lastRead.surah})" style="border:1px solid var(--primary-dark);border-left:4px solid var(--gold-light)">
            <div class="row" style="justify-content:space-between">
              <div><div class="text-xs" style="color:var(--primary-light)">Continue Reading</div><div style="font-weight:600;margin-top:2px">Surah ${lastRead.surah}, Ayah ${lastRead.ayah}</div></div>
              <div style="font-size:20px">▶️</div>
            </div>
          </div>
        ` : ''}
        <div class="quran-progress">
          <div style="font-size:13px;font-weight:600">${progress.surahsStarted.size}/114 surahs started</div>
          <div class="quran-progress-bar">
            <div class="quran-progress-fill" style="width:${(progress.surahsStarted.size/114)*100}%"></div>
          </div>
          <div style="font-size:11px;color:var(--text-sec);margin-top:6px">Daily goal: ${progress.dailyGoal} ayahs · Today: ${progress.todayRead}</div>
        </div>
        <div>
          ${filtered.map(s => `
            <div class="list-item card-hover" onclick="Screens.openSurah(${s.number})" style="border-left:3px solid var(--gold-light);border-radius:8px;padding:12px">
              <div class="list-body" style="flex:1">
                <div style="display:flex;align-items:center;gap:8px">
                  <div class="list-num" style="background:rgba(212,168,67,0.15);border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-weight:600;color:var(--gold-light)">${s.number}</div>
                  <div>
                    <div class="list-title">${s.name}</div>
                    <div class="list-sub">${s.translation} · ${s.ayahs} ayahs</div>
                  </div>
                </div>
              </div>
              <div class="list-right" style="text-align:right">
                <div style="font-family:'Amiri',serif;font-size:18px;color:var(--gold-light);margin-bottom:4px">${s.arabic}</div>
                <div style="font-size:16px;cursor:pointer" onclick="event.stopPropagation();Screens.toggleBookmark(${s.number})">${bookmarks.includes(s.number) ? '❤️' : '🧡'}</div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else if (this.quranTab === 'juz') {
      content = `
        ${Array.from({length: 30}, (_, i) => {
          const juz = i + 1;
          const juzInfo = API.juzData[i];
          return `
            <div class="card card-hover" style="border-left:4px solid var(--gold-light);cursor:pointer" onclick="Screens.quranView='reader';Screens.quranActiveSurah=${juzInfo.surah};Screens.renderQuran()">
              <div class="row" style="align-items:center;gap:12px">
                <div style="width:44px;height:44px;border-radius:8px;background:linear-gradient(135deg,var(--gold-light),rgba(212,168,67,0.4));display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--dark)">${juz}</div>
                <div class="flex-1">
                  <div class="juz-name" style="font-weight:600">${juzInfo.name}</div>
                  <div class="juz-range" style="font-size:12px;color:var(--text-sec)">Surah ${juzInfo.surah}:${juzInfo.ayah}</div>
                </div>
                <div style="color:var(--gold-light)">→</div>
              </div>
            </div>
          `;
        }).join('')}
      `;
    } else if (this.quranTab === 'bookmarks') {
      const bookmarkedSurahs = this.quranSurahs?.filter(s => bookmarks.includes(s.number)) || [];
      content = `
        ${bookmarkedSurahs.length === 0 ? '<div class="empty-state"><div class="empty-icon">📖</div><div>No bookmarks yet</div></div>' : `
          ${bookmarkedSurahs.map(s => `
            <div class="list-item card-hover" onclick="Screens.openSurah(${s.number})" style="border-left:3px solid var(--gold-light);border-radius:8px;padding:12px">
              <div class="list-body" style="flex:1">
                <div style="display:flex;align-items:center;gap:8px">
                  <div class="list-num" style="background:rgba(212,168,67,0.15);border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-weight:600;color:var(--gold-light)">${s.number}</div>
                  <div>
                    <div class="list-title">${s.name}</div>
                    <div class="list-sub">${s.translation} · ${s.ayahs} ayahs</div>
                  </div>
                </div>
              </div>
              <div class="list-right" style="text-align:right">
                <div style="font-family:'Amiri',serif;font-size:18px;color:var(--gold-light)">❤️</div>
              </div>
            </div>
          `).join('')}
        `}
      `;
    }

    el.innerHTML = `
      ${this._screenHeader('📖', 'The Noble Quran', 'القرآن الكريم')}
      <div class="quran-tabs">
        <div class="quran-tab ${this.quranTab === 'surah' ? 'active' : ''}" onclick="Screens.quranTab='surah';Screens.renderQuran()">Surah</div>
        <div class="quran-tab ${this.quranTab === 'juz' ? 'active' : ''}" onclick="Screens.quranTab='juz';Screens.renderQuran()">Juz</div>
        <div class="quran-tab ${this.quranTab === 'bookmarks' ? 'active' : ''}" onclick="Screens.quranTab='bookmarks';Screens.renderQuran()">Bookmarks</div>
      </div>
      ${content}
    `;
  },

  async openSurah(num) {
    this.quranView = 'reader';
    this.quranActiveSurah = num;
    this.quranPlayingAyah = null;
    this.quranWordHighlightIdx = -1;
    this.renderQuran();
  },

  async renderQuranReader(el) {
    el.innerHTML = `
      <div class="sub-header">
        <button class="back-btn" onclick="Screens.quranView='list';Screens.quranActiveSurah=null;Screens.renderQuran()">←</button>
        <div class="sub-title">Loading...</div>
      </div>
      <div class="loading-spinner"></div>
    `;

    const ayahs = await API.getSurahText(this.quranActiveSurah, this.quranSelectedReciter, this.quranSelectedTranslation);
    this.quranAyahs = ayahs;
    const surah = this.quranSurahs?.find(s => s.number === this.quranActiveSurah) || { name: `Surah ${this.quranActiveSurah}` };

    Store.setLastRead(this.quranActiveSurah, 1);
    const read = Store.get('quranSurahsRead', 0) + 1;
    Store.set('quranSurahsRead', read);
    Store.unlockAchievement('quran_reader');

    el.innerHTML = `
      <div class="sub-header">
        <button class="back-btn" onclick="Screens.quranView='list';Screens.quranActiveSurah=null;Screens.quranPlayingAyah=null;Screens.renderQuran()">←</button>
        <div class="sub-title">${surah.name || 'Surah'}</div>
      </div>

      <div class="quran-settings-row">
        <select class="quran-select" onchange="Screens.quranSelectedReciter=this.value;Screens.renderQuran()">
          ${(() => {
            const styles = [...new Set(API.reciters.map(r => r.style || 'Other'))];
            return styles.map(s => `<optgroup label="${s}">${API.reciters.filter(r => (r.style||'Other')===s).map(r => `<option value="${r.id}" ${r.id === this.quranSelectedReciter ? 'selected' : ''}>${r.flag||''} ${r.name}</option>`).join('')}</optgroup>`).join('');
          })()}
        </select>
        <select class="quran-select" onchange="Screens.quranSelectedTranslation=this.value;Screens.renderQuran()">
          ${(() => {
            const langs = [];
            API.translations.forEach(t => { if (!langs.includes(t.lang)) langs.push(t.lang); });
            return langs.map(l => `<optgroup label="${l}">${API.translations.filter(t => t.lang===l).map(t => `<option value="${t.id}" ${t.id === this.quranSelectedTranslation ? 'selected' : ''}>${t.flag||''} ${t.name}</option>`).join('')}</optgroup>`).join('');
          })()}
        </select>
        <button class="quran-toggle ${this.quranShowTranslit ? 'active' : ''}" onclick="Screens.quranShowTranslit=!Screens.quranShowTranslit;Screens.renderQuran()">Transliteration</button>
        <button class="quran-toggle ${this.quranWordByWord ? 'active' : ''}" onclick="Screens.quranWordByWord=!Screens.quranWordByWord;Screens.renderQuran()">Word-by-Word</button>
        <button class="quran-toggle ${this.quranTajweed ? 'active' : ''}" onclick="Screens.quranTajweed=!Screens.quranTajweed;Screens.renderQuran()">Tajweed</button>
        <div class="quran-font-controls">
          <button class="quran-font-btn" onclick="Screens.quranFontSize=Math.max(16,Screens.quranFontSize-2);Screens.renderQuran()">A-</button>
          <span class="quran-font-size">${this.quranFontSize}px</span>
          <button class="quran-font-btn" onclick="Screens.quranFontSize=Math.min(40,Screens.quranFontSize+2);Screens.renderQuran()">A+</button>
        </div>
        <button class="quran-toggle" onclick="Screens.cycleAudioSpeed()">Speed: ${this.quranAudioSpeed}x</button>
        <button class="quran-toggle ${this.quranRepeatAyah ? 'active' : ''}" onclick="Screens.quranRepeatAyah=!Screens.quranRepeatAyah;if(Screens.quranRepeatAyah)Screens.quranContinuousPlay=false;Screens.renderQuran()">Repeat</button>
        <button class="quran-toggle ${this.quranContinuousPlay ? 'active' : ''}" onclick="Screens.quranContinuousPlay=!Screens.quranContinuousPlay;if(Screens.quranContinuousPlay)Screens.quranRepeatAyah=false;Screens.renderQuran()">Auto ▶</button>
      </div>

      ${this.quranTajweed ? `
        <div class="tajweed-legend">
          <div class="tajweed-legend-item"><div class="tajweed-legend-dot" style="background:#2ECC71"></div>Ghunna</div>
          <div class="tajweed-legend-item"><div class="tajweed-legend-dot" style="background:#3498DB"></div>Idgham</div>
          <div class="tajweed-legend-item"><div class="tajweed-legend-dot" style="background:#E67E22"></div>Ikhfaa</div>
          <div class="tajweed-legend-item"><div class="tajweed-legend-dot" style="background:#9B59B6"></div>Iqlab</div>
          <div class="tajweed-legend-item"><div class="tajweed-legend-dot" style="background:#E74C3C"></div>Qalqalah</div>
          <div class="tajweed-legend-item"><div class="tajweed-legend-dot" style="background:#1ABC9C"></div>Madd</div>
        </div>
      ` : ''}
      ${this.quranActiveSurah !== 1 && this.quranActiveSurah !== 9 ? `<div class="quran-bismillah islamic-arch" style="padding:16px;border:2px solid var(--gold-light);border-radius:12px;text-align:center;font-size:24px;color:var(--gold-light);font-family:'Amiri',serif;font-weight:600;margin:16px 0">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>` : ''}

      ${ayahs.length === 0 ? '<div class="empty-state"><div class="empty-icon">📖</div><div>Could not load ayahs. Check your connection.</div></div>' : `
        ${ayahs.map(a => `
          <div class="quran-ayah-card ${a.sajdah ? 'quran-sajdah' : ''} ${this.quranPlayingAyah === a.number ? 'ayah-playing' : ''}" data-ayah="${a.number}">
            <div class="quran-ayah-num">${this.quranActiveSurah}:${a.number}</div>
            <div class="quran-ayah-arabic" data-ayah-num="${a.number}" style="font-size:${this.quranFontSize}px">
              ${(this.quranWordByWord || this.quranPlayingAyah) ?
                a.words.map((w, idx) => `<span class="quran-word" data-word-idx="${idx}" data-ayah-num="${a.number}">${this.applyTajweed(w)}</span>`).join(' ') :
                this.applyTajweed(a.arabic)
              }
            </div>
            ${this.quranShowTranslit ? `<div class="quran-translit">${a.transliteration}</div>` : ''}
            <div class="quran-translation">${a.translation}</div>
            <div class="quran-ayah-actions">
              <button class="quran-ayah-btn ${this.quranPlayingAyah === a.number ? 'playing' : ''}" onclick="Screens.playAyah(${a.number})">${this.quranPlayingAyah === a.number && API.isPlaying() ? '⏸️' : '▶️'}</button>
              <button class="quran-ayah-btn" onclick="Screens.toggleBookmark(${this.quranActiveSurah})">❤️</button>
              <button class="quran-ayah-btn" onclick="Screens.copyAyah(${this.quranActiveSurah},${a.number})">📋</button>
            </div>
            ${this.quranPlayingAyah === a.number ? '<div class="quran-audio-progress"><div class="quran-audio-progress-bar" id="ayahProgressBar" style="width:0%"></div></div>' : ''}
          </div>
        `).join('')}

      <div class="quran-surah-nav">
        ${this.quranActiveSurah > 1 ? '<button class="btn btn-outline" onclick="Screens.openSurah(' + (this.quranActiveSurah - 1) + ')">← Previous Surah</button>' : '<div></div>'}
        ${this.quranActiveSurah < 114 ? '<button class="btn btn-primary" onclick="Screens.openSurah(' + (this.quranActiveSurah + 1) + ')">Next Surah →</button>' : '<div></div>'}
      </div>
      `}
    `;
  },

  playAyah(ayahNum) {
    var self = this;
    if (self.quranPlayingAyah === ayahNum) {
      if (API.isPlaying()) {
        API.pauseAyah();
        self.renderQuranReader(document.getElementById('screen-quran'));
      } else {
        API.resumeAyah();
        self.renderQuranReader(document.getElementById('screen-quran'));
      }
    } else {
      self.quranPlayingAyah = ayahNum;
      self._quranWordCount = 0;   // Reset so onAudioTimeUpdate recalculates
      self._quranLastWordIdx = -1;
      var ayah = null;
      if (self.quranAyahs) {
        for (var i = 0; i < self.quranAyahs.length; i++) {
          if (self.quranAyahs[i].number === ayahNum) { ayah = self.quranAyahs[i]; break; }
        }
      }
      if (ayah && ayah.audio) {
        API.playAudio(ayah.audio, self.quranAudioSpeed, function() {
          if (self.quranRepeatAyah) {
            // Repeat same ayah
            self.quranPlayingAyah = null;
            self.playAyah(ayahNum);
          } else if (self.quranContinuousPlay) {
            // Auto-advance to next ayah
            var nextAyah = null;
            if (self.quranAyahs) {
              for (var j = 0; j < self.quranAyahs.length; j++) {
                if (self.quranAyahs[j].number === ayahNum && j + 1 < self.quranAyahs.length) {
                  nextAyah = self.quranAyahs[j + 1];
                  break;
                }
              }
            }
            if (nextAyah && nextAyah.audio) {
              self.quranPlayingAyah = null;
              self.playAyah(nextAyah.number);
              // Scroll the next ayah into view
              setTimeout(function() {
                var nextCard = document.querySelector('[data-ayah="' + nextAyah.number + '"]');
                if (nextCard) nextCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }, 200);
            } else {
              // Reached end of surah
              self.quranPlayingAyah = null;
              self.renderQuranReader(document.getElementById('screen-quran'));
              App.toast('Surah complete. MashaAllah!');
            }
          } else {
            // Stop after this ayah
            self.quranPlayingAyah = null;
            self.renderQuranReader(document.getElementById('screen-quran'));
          }
        });
        self.renderQuranReader(document.getElementById('screen-quran'));
      }
    }
  },

  // Play entire surah from first ayah
  playAllAyahs() {
    if (this.quranAyahs && this.quranAyahs.length > 0) {
      this.quranContinuousPlay = true;
      this.playAyah(this.quranAyahs[0].number);
    }
  },

  // Stop all playback
  stopPlayback() {
    API.pauseAyah();
    this.quranPlayingAyah = null;
    this._quranWordCount = 0;
    this._quranLastWordIdx = -1;
    this.renderQuranReader(document.getElementById('screen-quran'));
  },

  pauseAyah() {
    API.pauseAyah();
  },

  // ---- Word-by-word highlighting during audio playback ----
  _quranWordCount: 0,
  _quranLastWordIdx: -1,

  onAudioTimeUpdate() {
    if (!this.quranPlayingAyah) return;
    var player = API.audioPlayer;
    if (!player || !player.duration || player.paused) return;

    var progress = player.currentTime / player.duration;

    // Update progress bar
    var bar = document.getElementById('ayahProgressBar');
    if (bar) bar.style.width = (progress * 100) + '%';

    // Find the playing ayah's word count
    var ayahNum = this.quranPlayingAyah;
    if (!this._quranWordCount) {
      var ayah = null;
      if (this.quranAyahs) {
        for (var i = 0; i < this.quranAyahs.length; i++) {
          if (this.quranAyahs[i].number === ayahNum) { ayah = this.quranAyahs[i]; break; }
        }
      }
      this._quranWordCount = ayah ? ayah.words.length : 0;
    }
    if (this._quranWordCount === 0) return;

    // Calculate which word should be active based on audio progress
    var wordIdx = Math.floor(progress * this._quranWordCount);
    if (wordIdx >= this._quranWordCount) wordIdx = this._quranWordCount - 1;

    // Only update DOM if word changed
    if (wordIdx === this._quranLastWordIdx) return;
    this._quranLastWordIdx = wordIdx;

    // Apply highlighting to word spans
    var words = document.querySelectorAll('.quran-word[data-ayah-num="' + ayahNum + '"]');
    for (var w = 0; w < words.length; w++) {
      var el = words[w];
      var idx = parseInt(el.getAttribute('data-word-idx'), 10);
      el.classList.remove('quran-word-active', 'quran-word-read', 'quran-word-upcoming');
      if (idx < wordIdx) {
        el.classList.add('quran-word-read');
      } else if (idx === wordIdx) {
        el.classList.add('quran-word-active');
      } else {
        el.classList.add('quran-word-upcoming');
      }
    }
  },

  cycleAudioSpeed() {
    const speeds = [1.0, 1.25, 1.5, 0.75];
    const idx = speeds.indexOf(this.quranAudioSpeed);
    this.quranAudioSpeed = speeds[(idx + 1) % speeds.length];
    if (this.quranPlayingAyah) {
      API.setAudioSpeed(this.quranAudioSpeed);
    }
    this.renderQuranReader(document.getElementById('screen-quran'));
  },

  toggleBookmark(surahNum) {
    var wasSaved = Store.getBookmarks().indexOf(surahNum) >= 0;
    Store.toggleBookmark(surahNum);
    this.renderQuranList(document.getElementById('screen-quran'));
    App.toast(wasSaved ? 'Removed from bookmarks' : 'Added to bookmarks');
  },

  copyAyah(surahNum, ayahNum) {
    const ayah = this.quranAyahs?.find(a => a.number === ayahNum);
    if (ayah) {
      const text = `${ayah.arabic}\n\n${ayah.translation}\n\n— Surah ${surahNum}:${ayahNum}`;
      navigator.clipboard.writeText(text).then(() => App.toast('Ayah copied to clipboard'));
    }
  },

  // ==== HADITH SCREEN ====
  hadithCollection: 'bukhari',
  hadithSearch: '',

  renderHadith() {
    const el = document.getElementById('screen-hadith');
    const collections = API.hadithCollections;
    const hadithList = API.getHadith(this.hadithCollection);
    let filtered = hadithList;
    if (this.hadithSearch) {
      const q = this.hadithSearch.toLowerCase();
      filtered = filtered.filter(h => h.text.toLowerCase().includes(q) || h.narrator.toLowerCase().includes(q));
    }
    const activeCol = collections.find(c => c.id === this.hadithCollection) || collections[0];

    const scrollSVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:32px;height:32px">
      <rect x="25" y="15" width="50" height="70" fill="none" stroke="rgba(212,168,67,0.8)" stroke-width="2" rx="3"/>
      <line x1="35" y1="25" x2="65" y2="25" stroke="rgba(212,168,67,0.6)" stroke-width="1.5"/>
      <line x1="35" y1="35" x2="65" y2="35" stroke="rgba(212,168,67,0.4)" stroke-width="1"/>
      <line x1="35" y1="45" x2="65" y2="45" stroke="rgba(212,168,67,0.4)" stroke-width="1"/>
      <line x1="35" y1="55" x2="65" y2="55" stroke="rgba(212,168,67,0.4)" stroke-width="1"/>
    </svg>`;

    const gradeColor = (grade) => {
      if (grade === 'Sahih') return 'rgba(46,204,113,.25)';
      if (grade === 'Hasan') return 'rgba(52,152,219,.25)';
      return 'rgba(155,89,182,.25)';
    };

    const gradeTextColor = (grade) => {
      if (grade === 'Sahih') return 'var(--green)';
      if (grade === 'Hasan') return 'var(--blue)';
      return 'var(--purple)';
    };

    el.innerHTML = `
      ${this._screenHeader('📜', 'Prophetic Hadith', 'الحديث النبوي')}
      <div class="search-bar">
        <span>🔍</span>
        <input type="text" placeholder="Search hadith..." value="${this.hadithSearch}" oninput="Screens.hadithSearch=this.value;Screens.renderHadith()">
      </div>
      <div style="overflow-x:auto;white-space:nowrap;margin-bottom:12px;padding-bottom:4px">
        ${collections.map(c => `
          <span class="chip ${c.id === this.hadithCollection ? 'active' : ''}" style="border-radius:20px;padding:8px 16px" onclick="Screens.hadithCollection='${c.id}';Screens.hadithSearch='';Screens.renderHadith()">
            ${c.icon} ${c.name.split(' ').pop()}
          </span>
        `).join('')}
      </div>
      <div class="card" style="border-left:4px solid var(--gold-light)">
        <div style="font-weight:600">${activeCol.name}</div>
        <div class="text-xs text-sec">${activeCol.count.toLocaleString()} hadith · Showing ${filtered.length} sample</div>
      </div>
      ${filtered.map(h => `
        <div class="card islamic-card" style="border-left:3px solid var(--gold-light);position:relative">
          <div class="islamic-corner-bracket" style="top:8px;left:8px;font-size:16px;color:var(--gold-light)">◛</div>
          <div class="row mb-8" style="justify-content:space-between">
            <span class="badge" style="background:rgba(212,168,67,.15);color:var(--gold-light);border-radius:20px">#${h.num}</span>
            <span class="badge" style="background:${gradeColor(h.grade)};color:${gradeTextColor(h.grade)};border-radius:20px;font-weight:600">${h.grade}</span>
          </div>
          <div style="font-size:14px;line-height:1.7;margin-bottom:12px;color:var(--text-primary)">${h.text}</div>
          <div style="padding-top:8px;border-top:1px solid rgba(212,168,67,0.15)">
            <div class="text-xs text-sec">📖 ${h.book} · Narrator: ${h.narrator}</div>
          </div>
          <div class="islamic-corner-bracket" style="bottom:8px;right:8px;font-size:16px;color:var(--gold-light);transform:scale(-1,-1)">◛</div>
        </div>
      `).join('')}
      ${filtered.length === 0 ? '<div class="empty-state"><div class="empty-icon">📜</div><div>No hadith found matching your search.</div></div>' : ''}
    `;
  },

  // ==== AI SCHOLAR SCREEN ====
  aiMessages: [
    { role: 'ai', text: "As-salamu alaykum! I'm your AI Islamic Scholar. Ask me anything about Islam — prayer, Quran, Hadith, fiqh, history, and more. All answers include authentic sources.", data: null }
  ],

  _escapeHTML: function(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  },

  renderAI() {
    var self = this;
    var el = document.getElementById('screen-ai');
    if (!el) return;

    // Build messages HTML
    var messagesHTML = '';
    for (var i = 0; i < self.aiMessages.length; i++) {
      var m = self.aiMessages[i];
      if (m.role === 'user') {
        messagesHTML += '<div style="display:flex;justify-content:flex-end;margin:8px 0"><div style="background:rgba(52,152,219,0.2);border-radius:16px 4px 16px 16px;padding:10px 14px;max-width:80%;font-size:14px;line-height:1.5">' + self._escapeHTML(m.text) + '</div></div>';
      } else {
        messagesHTML += self._aiScholarBubble(m);
      }
    }

    // Build suggestion pills
    var pills = [
      { label: 'What is Halal?', q: 'what is halal' },
      { label: 'Five Pillars', q: 'five pillars of islam' },
      { label: 'How to Pray?', q: 'how to perform salah' },
      { label: 'Wudu Steps', q: 'how to perform wudu' },
      { label: 'Ramadan', q: 'fasting in ramadan' },
      { label: 'Zakat', q: 'what is zakat' }
    ];
    var pillsHTML = '';
    for (var i = 0; i < pills.length; i++) {
      pillsHTML += '<button class="ai-pill" data-q="' + pills[i].q + '">' + pills[i].label + '</button>';
    }

    // Set full HTML — NO inline onclick handlers
    el.innerHTML =
      self._screenHeader('\u2728', 'AI Scholar', '\u0627\u0644\u0639\u0627\u0644\u0645 \u0627\u0644\u0625\u0633\u0644\u0627\u0645\u064a') +
      '<div class="chat-area" id="chat-messages">' + messagesHTML + '</div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:6px;padding:4px 0 8px">' + pillsHTML + '</div>' +
      '<div class="chat-input-wrap">' +
        '<input class="chat-input" id="ai-input" type="text" placeholder="Ask about Islam...">' +
        '<button class="chat-send" id="ai-send-btn">\u27A4</button>' +
      '</div>';

    // Attach event listeners programmatically (works on all mobile browsers)
    var sendBtn = document.getElementById('ai-send-btn');
    var inputEl = document.getElementById('ai-input');

    if (sendBtn) {
      sendBtn.addEventListener('click', function() { self.sendAI(); });
      sendBtn.addEventListener('touchend', function(e) { e.preventDefault(); self.sendAI(); });
    }
    if (inputEl) {
      inputEl.addEventListener('keydown', function(e) { if (e.key === 'Enter') self.sendAI(); });
      inputEl.focus();
    }

    // Attach pill click listeners
    var pillBtns = el.querySelectorAll('.ai-pill');
    for (var i = 0; i < pillBtns.length; i++) {
      (function(btn) {
        btn.addEventListener('click', function() { self.aiAsk(btn.getAttribute('data-q')); });
        btn.addEventListener('touchend', function(e) { e.preventDefault(); self.aiAsk(btn.getAttribute('data-q')); });
      })(pillBtns[i]);
    }

    // Attach related topic button listeners
    var relBtns = el.querySelectorAll('.ai-related-btn');
    for (var i = 0; i < relBtns.length; i++) {
      (function(btn) {
        btn.addEventListener('click', function() { self.aiAsk(btn.getAttribute('data-q')); });
        btn.addEventListener('touchend', function(e) { e.preventDefault(); self.aiAsk(btn.getAttribute('data-q')); });
      })(relBtns[i]);
    }

    // Scroll to bottom
    var msgs = document.getElementById('chat-messages');
    if (msgs) setTimeout(function() { msgs.scrollTop = msgs.scrollHeight; }, 50);
  },

  _aiScholarBubble: function(msg) {
    var entry = (msg && msg.data) || {};
    var rawText = entry.text || (msg && msg.text) || '';
    var text = rawText.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--gold-light)">$1</strong>').replace(/\n/g, '<br>');
    var sources = entry.sources || [];
    var related = entry.related || [];
    var category = entry.category || '';

    var catLabel = '';
    if (category && typeof Scholar !== 'undefined') {
      for (var i = 0; i < Scholar.categories.length; i++) {
        if (Scholar.categories[i].id === category) {
          catLabel = ' <span style="font-size:10px;background:rgba(212,168,67,0.1);padding:2px 8px;border-radius:10px;color:var(--text-secondary)">' + Scholar.categories[i].icon + ' ' + Scholar.categories[i].name + '</span>';
          break;
        }
      }
    }

    var sourcesHTML = '';
    if (sources.length > 0) {
      var srcTags = '';
      for (var i = 0; i < sources.length; i++) {
        srcTags += '<span style="font-size:11px;padding:2px 8px;border-radius:10px;background:rgba(212,168,67,0.08);color:var(--text-secondary);border:1px solid rgba(212,168,67,0.12)">' + sources[i] + '</span>';
      }
      sourcesHTML = '<div style="margin-top:10px;padding-top:8px;border-top:1px solid rgba(212,168,67,0.1)">' +
        '<div style="font-size:10px;color:var(--gold-light);font-weight:600;text-transform:uppercase;margin-bottom:4px">Sources</div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:4px">' + srcTags + '</div></div>';
    }

    var relatedHTML = '';
    if (related.length > 0) {
      var relTags = '';
      for (var i = 0; i < related.length; i++) {
        var r = related[i];
        var label = r.replace(/_/g, ' ');
        label = label.charAt(0).toUpperCase() + label.slice(1);
        relTags += '<button class="ai-related-btn" data-q="' + r.replace(/_/g, ' ') + '">' + label + '</button>';
      }
      relatedHTML = '<div style="margin-top:8px;padding-top:6px;border-top:1px solid rgba(212,168,67,0.08)">' +
        '<div style="font-size:10px;color:var(--text-secondary);margin-bottom:4px">Related:</div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:4px">' + relTags + '</div></div>';
    }

    return '<div style="margin:8px 0"><div style="background:linear-gradient(135deg,rgba(212,168,67,0.1),rgba(212,168,67,0.03));border-left:3px solid var(--gold-light);border-radius:12px;padding:12px 14px">' +
      '<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px"><span style="font-size:11px;color:var(--gold-light);font-weight:700;text-transform:uppercase;letter-spacing:0.5px">Scholar</span>' + catLabel + '</div>' +
      '<div style="font-size:14px;line-height:1.7;color:var(--text-primary)">' + text + '</div>' +
      sourcesHTML + relatedHTML +
    '</div></div>';
  },

  sendAI: function() {
    var input = document.getElementById('ai-input');
    if (!input || !input.value.trim()) return;
    var q = input.value.trim();
    input.value = '';

    this.aiMessages.push({ role: 'user', text: q });

    try {
      var result = API.getAIResponse(q);
      if (typeof result === 'string') {
        this.aiMessages.push({ role: 'ai', text: result, data: null });
      } else {
        this.aiMessages.push({ role: 'ai', text: result.text || '', data: result });
      }
    } catch(e) {
      this.aiMessages.push({ role: 'ai', text: 'Sorry, I could not find an answer. Try rephrasing your question.', data: null });
    }

    Store.unlockAchievement('scholar_chat');
    this.renderAI();
  },

  aiAsk: function(question) {
    var input = document.getElementById('ai-input');
    if (input) {
      input.value = question;
      this.sendAI();
    }
  },

  // ==== TASBIH SCREEN ====
  tasbihCount: 0,
  tasbihTarget: 33,
  tasbihPhrase: 'SubhanAllah',

  renderTasbih() {
    const el = document.getElementById('screen-tasbih');
    const total = Store.getTasbihTotal();
    const progress = (this.tasbihCount / this.tasbihTarget) * 360;
    const phrases = [
      { en: 'SubhanAllah', ar: 'سُبْحَانَ اللَّهِ' },
      { en: 'Alhamdulillah', ar: 'الْحَمْدُ لِلَّهِ' },
      { en: 'Allahu Akbar', ar: 'اللَّهُ أَكْبَرُ' },
      { en: 'La ilaha illallah', ar: 'لَا إِلٰهَ إِلَّا اللَّهُ' },
      { en: 'Astaghfirullah', ar: 'أَسْتَغْفِرُ اللَّهَ' }
    ];

    const rosarySVG = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto">
      <defs>
        <linearGradient id="beadGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="rgba(212,168,67,0.9)"/>
          <stop offset="100" stop-color="rgba(180,140,50,0.9)"/>
        </linearGradient>
      </defs>
      <!-- Ring -->
      <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(212,168,67,0.3)" stroke-width="8" opacity="0.3"/>
      <!-- Geometric star pattern -->
      <g stroke="rgba(212,168,67,0.2)" stroke-width="1" fill="none">
        ${Array.from({length:8}, (_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const x1 = 100 + 80 * Math.cos(angle);
          const y1 = 100 + 80 * Math.sin(angle);
          return `<line x1="100" y1="100" x2="${x1}" y2="${y1}"/>`;
        }).join('')}
      </g>
      <!-- Beads -->
      ${Array.from({length:33}, (_, i) => {
        const angle = (i / 33) * Math.PI * 2;
        const x = 100 + 70 * Math.cos(angle);
        const y = 100 + 70 * Math.sin(angle);
        const isActive = i < this.tasbihCount;
        return `<circle cx="${x}" cy="${y}" r="5" fill="${isActive ? 'var(--gold-light)' : 'rgba(212,168,67,0.3)'}" stroke="rgba(212,168,67,0.5)" stroke-width="1"/>`;
      }).join('')}
    </svg>`;

    el.innerHTML = `
      ${this._screenHeader('📿', 'Glorification', 'التسبيح')}
      <div class="text-center mt-8">
        <div style="font-family:'Amiri',serif;font-size:28px;color:var(--gold-light);margin-bottom:12px;letter-spacing:1px">${phrases.find(p => p.en === this.tasbihPhrase)?.ar || ''}</div>
        <div class="tasbih-phrases">
          ${phrases.map(p => `
            <span class="tasbih-phrase ${p.en === this.tasbihPhrase ? 'active' : ''}" style="border-radius:20px;padding:8px 12px;border:2px solid ${p.en === this.tasbihPhrase ? 'var(--gold-light)' : 'rgba(212,168,67,0.3)'};color:${p.en === this.tasbihPhrase ? 'var(--gold-light)' : 'var(--text-sec)'}" onclick="Screens.tasbihPhrase='${p.en}';Screens.renderTasbih()">${p.en}</span>
          `).join('')}
        </div>
        <div style="margin:24px 0">
          ${rosarySVG}
        </div>
        <div class="tasbih-count" style="font-size:48px;font-weight:700;color:var(--gold-light);margin:16px 0">${this.tasbihCount}</div>
        <div class="tasbih-target" style="font-size:16px;color:var(--text-sec)">of ${this.tasbihTarget}</div>
        <div class="tasbih-ring" style="width:140px;height:140px;margin:20px auto;border:4px solid var(--gold-light);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;background:radial-gradient(circle,rgba(212,168,67,0.05),transparent);font-size:32px;font-weight:700;color:var(--gold-light);transition:all 0.2s" onclick="Screens.incrementTasbih()">TAP</div>
        <div class="row" style="justify-content:center;gap:12px;margin:24px 0">
          <button class="btn btn-outline" onclick="Screens.resetTasbih()">Reset</button>
          <button class="btn btn-primary" onclick="Screens.tasbihTarget=Screens.tasbihTarget===33?99:Screens.tasbihTarget===99?100:33;Screens.renderTasbih()">Target: ${this.tasbihTarget}</button>
        </div>
        <div class="card" style="border:2px solid var(--gold-light);border-radius:12px">
          <div style="font-size:12px;color:var(--gold-light);text-transform:uppercase;font-weight:600;margin-bottom:8px">Lifetime Total</div>
          <div style="font-weight:700;font-size:24px;color:var(--gold-light)">${total.toLocaleString()}</div>
          <div style="font-size:11px;color:var(--text-sec);margin-top:6px">Keep glorifying Allah</div>
        </div>
      </div>
    `;
  },

  resetTasbih() {
    if (this.tasbihCount === 0) return;
    if (confirm('Reset tasbih counter to 0?')) {
      this.tasbihCount = 0;
      this.renderTasbih();
    }
  },

  incrementTasbih() {
    // Haptic feedback
    if (navigator.vibrate) navigator.vibrate(15);
    this.tasbihCount++;
    if (this.tasbihCount >= this.tasbihTarget) {
      if (navigator.vibrate) navigator.vibrate([30, 50, 30]); // completion pattern
      Store.addTasbih(this.tasbihTarget);
      Store.addXP(25);
      if (Store.getTasbihTotal() >= 100) Store.unlockAchievement('tasbih_100');
      if (Store.getTasbihTotal() >= 1000) Store.unlockAchievement('tasbih_1000');
      App.toast(`Completed ${this.tasbihTarget}x ${this.tasbihPhrase}! +25 XP`);
      this.tasbihCount = 0;
    }
    this.renderTasbih();
    // Haptic-like visual feedback
    const ring = document.querySelector('.tasbih-ring');
    if (ring) { ring.style.transform = 'scale(.92)'; setTimeout(() => ring.style.transform = '', 120); }
  },

  // ==== QIBLA SCREEN ====
  qiblaAngle: 0,
  _qiblaHeading: 0,
  _qiblaWatchId: null,
  _qiblaCompassActive: false,

  async renderQibla() {
    var self = this;
    var el = document.getElementById('screen-qibla');
    if (!el) return;

    // Get location
    if (!this.location) this.location = await API.getLocation();
    this.qiblaAngle = API.calculateQibla(this.location.lat, this.location.lng);
    var dist = this._distToKaaba(this.location.lat, this.location.lng);

    el.innerHTML =
      self._screenHeader('\uD83E\uDDED', 'Qibla Finder', '\u0627\u062A\u062C\u0627\u0647 \u0627\u0644\u0642\u0628\u0644\u0629') +

      // Main compass container
      '<div style="display:flex;flex-direction:column;align-items:center;padding:8px 0">' +

        // Status indicator
        '<div id="qibla-status" class="qibla-status">' +
          '<span class="qibla-status-dot"></span> Locating Qibla...' +
        '</div>' +

        // Degree display
        '<div style="margin:8px 0 16px;text-align:center">' +
          '<div id="qibla-deg" style="font-size:42px;font-weight:700;color:var(--gold-light);font-family:Playfair Display,serif;line-height:1">' + Math.round(self.qiblaAngle) + '\u00B0</div>' +
          '<div style="font-size:12px;color:var(--text-secondary);margin-top:2px">from North</div>' +
        '</div>' +

        // Compass ring
        '<div class="qibla-compass-container">' +
          '<div class="qibla-compass-ring" id="qibla-compass">' +
            // Tick marks (every 30 degrees)
            self._qiblaTickMarks() +
            // Cardinal labels
            '<div class="qibla-cardinal" style="top:8px;left:50%;transform:translateX(-50%)">N</div>' +
            '<div class="qibla-cardinal" style="right:8px;top:50%;transform:translateY(-50%);color:var(--text-secondary)">E</div>' +
            '<div class="qibla-cardinal" style="bottom:8px;left:50%;transform:translateX(-50%);color:var(--text-secondary)">S</div>' +
            '<div class="qibla-cardinal" style="left:8px;top:50%;transform:translateY(-50%);color:var(--text-secondary)">W</div>' +
            // Qibla arrow
            '<div class="qibla-arrow" id="qibla-arrow" style="transform:rotate(' + self.qiblaAngle + 'deg)">' +
              '<div class="qibla-arrow-line"></div>' +
              '<div class="qibla-arrow-head">\u25B2</div>' +
              '<div class="qibla-kaaba">\uD83D\uDD4B</div>' +
            '</div>' +
            // Center dot
            '<div class="qibla-center-dot"></div>' +
          '</div>' +

          // You-are-here indicator at bottom of compass
          '<div class="qibla-you-indicator">\u25B2<br><span style="font-size:9px;letter-spacing:1px">YOU</span></div>' +
        '</div>' +

        // Instruction
        '<div id="qibla-instruction" style="font-size:13px;color:var(--text-secondary);margin:16px 0 8px;text-align:center">' +
          'Hold your phone flat and rotate until the arrow points up' +
        '</div>' +

        // Info cards
        '<div style="display:flex;gap:10px;width:100%;margin-top:8px">' +
          '<div class="card" style="flex:1;text-align:center;border-top:3px solid var(--gold-light);padding:12px">' +
            '<div style="font-size:24px;margin-bottom:4px">\uD83D\uDD4B</div>' +
            '<div style="font-size:11px;color:var(--text-secondary)">Distance</div>' +
            '<div style="font-size:18px;font-weight:700;color:var(--gold-light)">' + dist.toLocaleString() + ' km</div>' +
          '</div>' +
          '<div class="card" style="flex:1;text-align:center;border-top:3px solid var(--primary);padding:12px">' +
            '<div style="font-size:24px;margin-bottom:4px">\uD83D\uDCCD</div>' +
            '<div style="font-size:11px;color:var(--text-secondary)">Your Location</div>' +
            '<div style="font-size:13px;font-weight:600;font-family:monospace;margin-top:2px">' +
              self.location.lat.toFixed(4) + '\u00B0' + (self.location.lat >= 0 ? 'N' : 'S') + ', ' +
              Math.abs(self.location.lng).toFixed(4) + '\u00B0' + (self.location.lng >= 0 ? 'E' : 'W') +
            '</div>' +
          '</div>' +
        '</div>' +

        // Calibrate button
        '<button id="qibla-calibrate" class="qibla-calibrate-btn">Calibrate Compass</button>' +

      '</div>';

    // Start device compass
    self._startQiblaCompass();

    // Calibrate button
    var calBtn = document.getElementById('qibla-calibrate');
    if (calBtn) {
      calBtn.addEventListener('click', function() {
        self._startQiblaCompass();
        calBtn.textContent = 'Calibrating...';
        setTimeout(function() { calBtn.textContent = 'Calibrate Compass'; }, 1500);
      });
    }
  },

  _qiblaTickMarks: function() {
    var html = '';
    for (var i = 0; i < 360; i += 10) {
      var isMajor = i % 30 === 0;
      var h = isMajor ? 12 : 6;
      var w = isMajor ? 2 : 1;
      var color = isMajor ? 'rgba(212,168,67,0.6)' : 'rgba(212,168,67,0.2)';
      html += '<div style="position:absolute;top:0;left:50%;width:' + w + 'px;height:' + h + 'px;background:' + color + ';transform-origin:50% 130px;transform:translateX(-50%) rotate(' + i + 'deg)"></div>';
    }
    return html;
  },

  _startQiblaCompass: function() {
    var self = this;

    // Stop existing listener
    if (self._qiblaWatchId) {
      window.removeEventListener('deviceorientationabsolute', self._qiblaOrientHandler);
      window.removeEventListener('deviceorientation', self._qiblaOrientHandler);
    }

    // Throttle compass updates to ~20fps via RAF to save battery
    self._qiblaPendingHeading = null;
    self._qiblaRAF = null;

    var applyCompassUpdate = function() {
      self._qiblaRAF = null;
      var heading = self._qiblaPendingHeading;
      if (heading === null) return;

      self._qiblaHeading = heading;
      var compassEl = document.getElementById('qibla-compass');
      if (compassEl) compassEl.style.transform = 'rotate(' + (-heading) + 'deg)';

      var diff = Math.abs(heading - self.qiblaAngle);
      if (diff > 180) diff = 360 - diff;

      var statusEl = document.getElementById('qibla-status');
      var instructEl = document.getElementById('qibla-instruction');

      if (diff < 5) {
        if (navigator.vibrate && !self._qiblaVibrated) { navigator.vibrate(100); self._qiblaVibrated = true; }
        if (statusEl) { statusEl.className = 'qibla-status qibla-found'; statusEl.innerHTML = '<span class="qibla-status-dot found"></span> Facing Qibla!'; }
        if (instructEl) instructEl.textContent = 'You are facing the Kaaba. Allahu Akbar!';
      } else {
        self._qiblaVibrated = false;
        if (diff < 15) {
          if (statusEl) { statusEl.className = 'qibla-status qibla-close'; statusEl.innerHTML = '<span class="qibla-status-dot close"></span> Almost there...'; }
          if (instructEl) instructEl.textContent = 'Turn slightly ' + (self._qiblaTurnDir(heading) ? 'right' : 'left');
        } else {
          if (statusEl) { statusEl.className = 'qibla-status'; statusEl.innerHTML = '<span class="qibla-status-dot"></span> Finding Qibla...'; }
          if (instructEl) instructEl.textContent = 'Hold your phone flat and rotate until the arrow points up';
        }
      }
    };

    self._qiblaOrientHandler = function(e) {
      var heading = 0;
      if (e.webkitCompassHeading !== undefined) {
        heading = e.webkitCompassHeading;
      } else if (e.alpha !== null) {
        heading = (360 - e.alpha) % 360;
      } else {
        return;
      }
      self._qiblaPendingHeading = heading;
      if (!self._qiblaRAF) {
        self._qiblaRAF = requestAnimationFrame(applyCompassUpdate);
      }
    };

    // Try absolute orientation first, fall back to relative
    if (window.DeviceOrientationEvent) {
      // iOS 13+ requires permission
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission().then(function(state) {
          if (state === 'granted') {
            window.addEventListener('deviceorientation', self._qiblaOrientHandler);
            self._qiblaCompassActive = true;
          }
        }).catch(function() {});
      } else {
        // Android / other browsers
        window.addEventListener('deviceorientationabsolute', self._qiblaOrientHandler);
        window.addEventListener('deviceorientation', self._qiblaOrientHandler);
        self._qiblaCompassActive = true;
      }
      self._qiblaWatchId = true;
    }

    // Update status
    var statusEl = document.getElementById('qibla-status');
    if (statusEl) {
      statusEl.innerHTML = '<span class="qibla-status-dot"></span> Compass active';
    }
  },

  _qiblaTurnDir: function(heading) {
    // Returns true for right, false for left
    var diff = this.qiblaAngle - heading;
    if (diff < 0) diff += 360;
    return diff < 180;
  },

  _distToKaaba: function(lat, lng) {
    var R = 6371;
    var dLat = (21.4225 - lat) * Math.PI / 180;
    var dLng = (39.8262 - lng) * Math.PI / 180;
    var a = Math.pow(Math.sin(dLat/2), 2) + Math.cos(lat*Math.PI/180) * Math.cos(21.4225*Math.PI/180) * Math.pow(Math.sin(dLng/2), 2);
    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
  },

  // ==== DUAS SCREEN ====
  duaCategory: 'morning',
  duaPlayingId: null,
  duaWordHighlightIdx: -1,
  duaShowTranslit: true,
  _duaUtterance: null,
  _duaTimer: null,
  _duaStartTime: 0,
  _duaEstDuration: 0,
  _duaWords: [],
  _duaVoicesLoaded: false,
  _duaArabicVoice: null,
  _duaAudioMode: 'tts', // 'tts' or 'reading'

  renderDuas() {
    // Pre-load TTS voices on first render
    if (!this._duaVoicesLoaded) this._initDuaVoices();
    const el = document.getElementById('screen-duas');
    const categories = API.getDuaCategories();
    const duas = API.getDuas(this.duaCategory);
    const cat = categories.find(c => c.id === this.duaCategory);
    const favs = Store.get('duaFavorites', []);

    el.innerHTML = `
      ${this._screenHeader('🤲', 'Supplications', 'الدعاء')}
      <div class="dua-header-bar" style="margin-bottom:16px">
        <div style="font-weight:600;margin-bottom:8px">${cat ? cat.name : ''} Duas</div>
        <div class="text-xs text-sec">${duas.length} supplications from Hisnul Muslim</div>
      </div>

      <div style="overflow-x:auto;white-space:nowrap;margin-bottom:14px;padding-bottom:4px">
        ${categories.map(c => `
          <span class="chip ${c.id === this.duaCategory ? 'active' : ''}" style="border-radius:20px;padding:8px 14px;border:2px solid ${c.id === this.duaCategory ? 'var(--gold-light)' : 'rgba(212,168,67,0.3)'};background:${c.id === this.duaCategory ? 'rgba(212,168,67,0.15)' : 'transparent'}" onclick="Screens.duaCategory='${c.id}';Screens.stopDuaAudio();Screens.renderDuas()">
            ${c.icon} ${c.name}
          </span>
        `).join('')}
      </div>

      ${duas.map((d, i) => {
        const words = d.arabic.split(/\s+/);
        const isPlaying = this.duaPlayingId === d.id;
        const isFav = favs.includes(d.id);
        return `
          <div class="dua-card-premium ${isPlaying ? 'dua-playing' : ''}" style="border-left:4px solid var(--gold-light);border-radius:12px;padding:14px;position:relative" data-dua-id="${d.id}">
            <div class="islamic-corner-bracket" style="top:6px;left:6px;font-size:14px;color:var(--gold-light)">◛</div>
            <div class="dua-card-top" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
              <div class="dua-num-badge" style="background:rgba(212,168,67,0.2);color:var(--gold-light);border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:12px">${i + 1}</div>
              <div class="dua-card-btns" style="display:flex;gap:8px">
                ${d.repeat > 1 ? '<span class="dua-repeat-badge" style="background:rgba(212,168,67,0.15);color:var(--gold-light);border-radius:12px;padding:4px 10px;font-size:11px;font-weight:600">' + d.repeat + 'x</span>' : ''}
                <button class="dua-action-btn ${isFav ? 'dua-fav-active' : ''}" style="background:none;border:none;cursor:pointer;font-size:16px" onclick="event.stopPropagation();Screens.toggleDuaFav('${d.id}');">${isFav ? '❤️' : '🧡'}</button>
                <button class="dua-action-btn" style="background:none;border:none;cursor:pointer;font-size:16px" onclick="event.stopPropagation();Screens.copyDua('${d.id}');">📋</button>
              </div>
            </div>

            <div class="dua-arabic-premium" style="font-family:'Amiri',serif;font-size:20px;text-align:right;margin-bottom:12px;line-height:2" data-dua-id="${d.id}">
              ${words.map((w, idx) => '<span class="dua-word" data-word-idx="' + idx + '" data-dua-id="' + d.id + '">' + w + '</span>').join(' ')}
            </div>

            ${this.duaShowTranslit && d.translit ? '<div class="dua-translit-line" style="font-size:12px;color:var(--text-sec);margin-bottom:8px;font-style:italic">' + d.translit + '</div>' : ''}

            <div class="dua-trans-line" style="font-size:13px;line-height:1.6;margin-bottom:12px;color:var(--text-primary)">${d.trans}</div>

            <div class="dua-card-footer" style="display:flex;justify-content:space-between;align-items:center;padding-top:8px;border-top:1px solid rgba(212,168,67,0.15)">
              <div class="dua-ref-line" style="font-size:11px;color:var(--text-sec)">📖 ${d.ref}</div>
              <button class="dua-play-btn ${isPlaying ? 'playing' : ''}" style="background:none;border:none;cursor:pointer;font-size:18px" onclick="Screens.playDua('${d.id}')">
                ${isPlaying ? '⏸️' : '▶️'}
              </button>
            </div>

            ${isPlaying ? '<div class="dua-audio-progress"><div class="dua-audio-progress-bar" id="duaProgressBar" style="width:0%"></div></div>' : ''}
          </div>
        `;
      }).join('')}

      ${duas.length === 0 ? '<div class="empty-state"><div class="empty-icon">🤲</div><div>No duas in this category.</div></div>' : ''}
    `;
  },

  // Initialize TTS voices (call once at startup or first play)
  _initDuaVoices() {
    if (this._duaVoicesLoaded) return;
    if (!('speechSynthesis' in window)) {
      this._duaAudioMode = 'tts'; // We'll still try TTS first
      this._duaVoicesLoaded = true;
      return;
    }
    var self = this;
    var pickVoice = function() {
      var voices = speechSynthesis.getVoices();
      if (!voices.length) return false;
      var arabic = voices.filter(function(v) { return v.lang && v.lang.indexOf('ar') === 0; });
      if (arabic.length) {
        var google = arabic.filter(function(v) { return v.name.toLowerCase().indexOf('google') >= 0; });
        self._duaArabicVoice = google.length ? google[0] : arabic[0];
        self._duaAudioMode = 'tts';
      } else {
        self._duaArabicVoice = null;
        self._duaAudioMode = 'tts'; // Still try - browser may support Arabic without dedicated voice
      }
      self._duaVoicesLoaded = true;
      return true;
    };
    if (!pickVoice()) {
      speechSynthesis.onvoiceschanged = function() {
        pickVoice();
      };
      setTimeout(function() {
        if (!self._duaVoicesLoaded) pickVoice();
        if (!self._duaVoicesLoaded) {
          self._duaAudioMode = 'tts';
          self._duaVoicesLoaded = true;
        }
      }, 2000);
    }
  },

  // Dua audio player (HTML5 Audio element for real audio playback)
  _duaAudioPlayer: null,

  // Cumulative ayah offsets: _surahOffsets[n] = total ayahs in surahs 1..n
  // So global ayah number = _surahOffsets[surahNum - 1] + ayahInSurah
  _surahOffsets: [0,7,293,493,669,789,954,1160,1235,1364,1473,1596,1707,1750,1802,1901,2029,2140,2250,2348,2483,2595,2673,2791,2855,2932,3159,3252,3340,3409,3469,3503,3533,3606,3660,3705,3788,3970,4058,4133,4218,4272,4325,4414,4473,4510,4545,4583,4671,4723,4768,4828,4877,4939,4994,5072,5168,5197,5219,5243,5256,5270,5281,5292,5310,5322,5334,5364,5416,5468,5512,5540,5568,5588,5644,5684,5715,5765,5805,5851,5893,5922,5941,5977,6002,6024,6041,6060,6086,6116,6136,6151,6172,6183,6191,6199,6218,6223,6231,6239,6250,6261,6269,6272,6281,6286,6290,6297,6300,6306,6309,6314,6318,6323],

  // Build audio URL for ANY dua — Quranic CDN or Google Translate TTS
  _getDuaAudioUrl(dua) {
    if (dua.audioUrl) return dua.audioUrl;
    // Quranic duas: direct CDN URL
    var ref = dua.ref || '';
    var match = ref.match(/Quran\s+(\d+):(\d+)/i);
    if (match) {
      var surahNum = parseInt(match[1]);
      var ayahNum = parseInt(match[2]);
      if (surahNum >= 1 && surahNum <= 114 && ayahNum >= 1 && this._surahOffsets[surahNum - 1] !== undefined) {
        var globalAyah = this._surahOffsets[surahNum - 1] + ayahNum;
        return 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/' + globalAyah + '.mp3';
      }
    }
    // All other duas: Google Translate TTS for Arabic text
    if (dua.arabic) {
      var text = dua.arabic;
      // Google TTS has ~200 char limit; truncate if needed
      if (text.length > 200) text = text.substring(0, 200);
      return 'https://translate.google.com/translate_tts?ie=UTF-8&tl=ar&client=tw-ob&q=' + encodeURIComponent(text);
    }
    return null;
  },

  // Setup Audio element with all event listeners for dua playback
  _setupDuaAudio(audioUrl, dua, duaId) {
    var self = this;
    self._duaAudioPlayer = new Audio(audioUrl);
    self._duaAudioPlayer.volume = 0.8;

    self._duaAudioPlayer.addEventListener('loadedmetadata', function() {
      if (self._duaAudioPlayer) {
        self._duaEstDuration = self._duaAudioPlayer.duration * 1000;
        self._duaStartTime = Date.now();
      }
    });

    self._duaAudioPlayer.addEventListener('timeupdate', function() {
      if (!self.duaPlayingId || !self._duaAudioPlayer) return;
      var duration = self._duaAudioPlayer.duration || 1;
      var progress = self._duaAudioPlayer.currentTime / duration;
      var progressBar = document.getElementById('duaProgressBar');
      if (progressBar) progressBar.style.width = (progress * 100) + '%';
      var words = self._duaWords;
      var totalChars = words.reduce(function(sum, w) { return sum + w.length; }, 0);
      var cumulative = 0;
      var wordIdx = 0;
      for (var i = 0; i < words.length; i++) {
        cumulative += words[i].length / totalChars;
        if (progress < cumulative) { wordIdx = i; break; }
        if (i === words.length - 1) wordIdx = i;
      }
      self._syncDuaWordHighlight(wordIdx);
    });

    self._duaAudioPlayer.addEventListener('ended', function() {
      Screens.onDuaAudioEnded();
    });

    self._duaAudioPlayer.addEventListener('error', function() {
      clearTimeout(self._duaLoadTimeout);
      self._duaAudioPlayer = null;
      // Audio failed — fall back to TTS then reading mode
      self._startDuaTTS(dua, duaId);
    });

    // Timeout: if audio doesn't load within 8s, fall back (archive.org can be slower)
    self._duaLoadTimeout = setTimeout(function() {
      if (self._duaAudioPlayer && self._duaAudioPlayer.readyState === 0) {
        self._duaAudioPlayer.pause();
        self._duaAudioPlayer = null;
        self._startDuaTTS(dua, duaId);
      }
    }, 8000);
  },

  playDua(duaId) {
    var self = this;
    var duas = API.getDuas(this.duaCategory);
    var dua = duas.find(function(d) { return d.id === duaId; });
    if (!dua) return;

    // Toggle off if already playing
    if (this.duaPlayingId === duaId) {
      this.stopDuaAudio();
      this.renderDuas();
      return;
    }

    // Stop any existing playback
    this.stopDuaAudio();
    if (this.quranPlayingAyah) this.pauseAyah();

    this.duaPlayingId = duaId;
    this.duaWordHighlightIdx = -1;
    this._duaWords = dua.arabic.split(/\s+/);

    // Get audio URL — works for ALL duas (Quranic CDN or Google TTS)
    var audioUrl = this._getDuaAudioUrl(dua);

    // Calculate initial timing estimates
    var msPerWord = 480;
    this._duaEstDuration = Math.max(this._duaWords.length * msPerWord, 2500);
    this._duaStartTime = Date.now();

    // CRITICAL: Create Audio element IMMEDIATELY on user click (preserves user gesture)
    if (audioUrl) {
      self._setupDuaAudio(audioUrl, dua, duaId);
      self._duaAudioPlayer.play().then(function() {
        clearTimeout(self._duaLoadTimeout);
        self._showDuaToast('🔊 ' + I18n.t('playingDua'));
        self.renderDuas();
      }).catch(function() {
        clearTimeout(self._duaLoadTimeout);
        self._duaAudioPlayer = null;
        self._startDuaTTS(dua, duaId);
      });
    } else {
      self._startDuaTTS(dua, duaId);
    }

    this.renderDuas();

    setTimeout(function() {
      var card = document.querySelector('.dua-card-premium[data-dua-id="' + duaId + '"]');
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
  },

  // TTS fallback: Google Arabic TTS → speechSynthesis → reading mode
  _startDuaTTS(dua, duaId) {
    var self = this;

    // Try Google Translate Arabic TTS as first fallback (sounds much better than speechSynthesis)
    if (dua.arabic) {
      var text = dua.arabic;
      if (text.length > 200) text = text.substring(0, 200);
      var googleUrl = 'https://translate.google.com/translate_tts?ie=UTF-8&tl=ar&client=tw-ob&q=' + encodeURIComponent(text);
      self._setupDuaAudio(googleUrl, dua, duaId);
      self._duaAudioPlayer.play().then(function() {
        clearTimeout(self._duaLoadTimeout);
        self._showDuaToast('🔊 ' + I18n.t('playingDua'));
        self.renderDuas();
      }).catch(function() {
        clearTimeout(self._duaLoadTimeout);
        self._duaAudioPlayer = null;
        // Google TTS failed — try speechSynthesis
        self._trySpeechSynthesis(dua, duaId);
      });
      return;
    }

    // No Arabic text — try speechSynthesis directly
    self._trySpeechSynthesis(dua, duaId);
  },

  // speechSynthesis fallback
  _trySpeechSynthesis(dua, duaId) {
    var self = this;
    if (!('speechSynthesis' in window)) {
      self._startDuaReadingMode();
      self._duaTimer = setInterval(function() { Screens.onDuaTimeUpdate(); }, 50);
      return;
    }

    var voices = speechSynthesis.getVoices();
    var hasArabic = voices.some(function(v) { return v.lang && v.lang.indexOf('ar') === 0; });

    if (hasArabic) {
      self._speakWithTTS(dua.arabic, 'ar-SA', 0.8, dua, duaId, true);
    } else if (dua.translit) {
      self._speakWithTTS(dua.translit, 'en-US', 0.85, dua, duaId, false);
    } else {
      self._startDuaReadingMode();
    }

    if (!self._duaTimer) {
      self._duaTimer = setInterval(function() { Screens.onDuaTimeUpdate(); }, 50);
    }
  },

  // Shared TTS speaker — handles onstart/onend/onerror with fallback to reading mode
  _speakWithTTS(text, lang, rate, dua, duaId, isArabic) {
    var self = this;
    speechSynthesis.cancel();

    var utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = 1;

    // Pick the best voice for this language
    var voices = speechSynthesis.getVoices();
    var bestVoice = null;
    for (var i = 0; i < voices.length; i++) {
      if (voices[i].lang && voices[i].lang.indexOf(lang.split('-')[0]) === 0) {
        bestVoice = voices[i];
        if (voices[i].name.toLowerCase().indexOf('google') >= 0) break;
      }
    }
    if (bestVoice) utterance.voice = bestVoice;
    self._duaUtterance = utterance;
    self._duaTTSActive = true;

    // Word boundary highlighting (works best with Arabic text)
    if (isArabic) {
      utterance.onboundary = function(e) {
        if (e.name === 'word' && self.duaPlayingId) {
          var charIdx = e.charIndex;
          var pos = 0;
          for (var i = 0; i < self._duaWords.length; i++) {
            if (charIdx <= pos + self._duaWords[i].length) {
              self._syncDuaWordHighlight(i);
              break;
            }
            pos += self._duaWords[i].length + 1;
          }
        }
      };
    }

    var ttsStarted = false;
    var ttsHandled = false;

    utterance.onstart = function() {
      ttsStarted = true;
      self._duaTTSActive = true;
      self._duaStartTime = Date.now();
      if (isArabic) {
        self._showDuaToast('🔊 ' + I18n.t('playingDua'));
      } else {
        self._showDuaToast('🔊 ' + I18n.t('playingDua') + ' (transliteration)');
      }
    };

    utterance.onend = function() {
      self._duaTTSActive = false;
      if (ttsHandled) return;
      ttsHandled = true;
      if (ttsStarted) {
        Screens.onDuaAudioEnded();
      } else if (isArabic && dua.translit) {
        // Arabic TTS completed silently — try English transliteration
        self._speakWithTTS(dua.translit, 'en-US', 0.85, dua, duaId, false);
      } else {
        self._startDuaReadingMode();
      }
    };

    utterance.onerror = function(e) {
      self._duaTTSActive = false;
      if (ttsHandled) return;
      ttsHandled = true;
      if (isArabic && dua.translit) {
        // Arabic TTS errored — try English transliteration
        self._speakWithTTS(dua.translit, 'en-US', 0.85, dua, duaId, false);
      } else {
        self._startDuaReadingMode();
      }
    };

    speechSynthesis.speak(utterance);

    // Safety timeout
    setTimeout(function() {
      if (!ttsStarted && self.duaPlayingId === duaId && !ttsHandled) {
        ttsHandled = true;
        speechSynthesis.cancel();
        self._duaTTSActive = false;
        if (isArabic && dua.translit) {
          self._speakWithTTS(dua.translit, 'en-US', 0.85, dua, duaId, false);
        } else {
          self._startDuaReadingMode();
        }
      }
    }, 3000);
  },

  // Pure reading mode — word-by-word highlighting at a steady pace with visual feedback
  _startDuaReadingMode() {
    this._duaAudioMode = 'reading';
    this._duaStartTime = Date.now();
    this._duaEstDuration = Math.max(this._duaWords.length * 550, 3000);
    this._showDuaToast('📖 ' + I18n.t('readingMode'));
    if (!this._duaTimer) {
      this._duaTimer = setInterval(function() { Screens.onDuaTimeUpdate(); }, 50);
    }
  },

  _syncDuaWordHighlight(wordIdx) {
    var duaWords = document.querySelectorAll('.dua-word[data-dua-id="' + this.duaPlayingId + '"]');
    if (wordIdx === this.duaWordHighlightIdx) return;
    this.duaWordHighlightIdx = wordIdx;
    duaWords.forEach(function(el, idx) {
      el.classList.remove('dua-word-active', 'dua-word-read', 'dua-word-upcoming');
      if (idx < wordIdx) el.classList.add('dua-word-read');
      else if (idx === wordIdx) el.classList.add('dua-word-active');
      else el.classList.add('dua-word-upcoming');
    });
  },

  _showDuaToast(msg) {
    var old = document.getElementById('dua-toast');
    if (old) old.remove();
    var toast = document.createElement('div');
    toast.id = 'dua-toast';
    toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:rgba(30,40,60,0.95);color:#FFD700;padding:10px 20px;border-radius:20px;font-size:13px;z-index:9999;border:1px solid rgba(255,215,0,0.3);backdrop-filter:blur(8px);transition:opacity 0.5s;max-width:85%;text-align:center';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(function() { toast.style.opacity = '0'; }, 3000);
    setTimeout(function() { if (toast.parentNode) toast.remove(); }, 3600);
  },

  stopDuaAudio() {
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    if (this._duaAudioPlayer) {
      this._duaAudioPlayer.pause();
      this._duaAudioPlayer.src = '';
      this._duaAudioPlayer = null;
    }
    if (this._duaLoadTimeout) { clearTimeout(this._duaLoadTimeout); this._duaLoadTimeout = null; }
    if (this._duaTimer) { clearInterval(this._duaTimer); this._duaTimer = null; }
    this._duaTTSActive = false;
    this.duaPlayingId = null;
    this.duaWordHighlightIdx = -1;
    this._duaUtterance = null;
    this._duaWords = [];
  },

  onDuaTimeUpdate() {
    if (!this.duaPlayingId || !this._duaWords.length) return;

    var elapsed = Date.now() - this._duaStartTime;
    var progress = Math.min(elapsed / this._duaEstDuration, 1);

    var progressBar = document.getElementById('duaProgressBar');
    if (progressBar) progressBar.style.width = (progress * 100) + '%';

    var words = this._duaWords;
    var totalChars = words.reduce(function(sum, w) { return sum + w.length; }, 0);
    var cumulative = 0;
    var wordIdx = 0;
    for (var i = 0; i < words.length; i++) {
      cumulative += words[i].length / totalChars;
      if (progress < cumulative) { wordIdx = i; break; }
      if (i === words.length - 1) wordIdx = i;
    }

    var duaWords = document.querySelectorAll('.dua-word[data-dua-id="' + this.duaPlayingId + '"]');

    if (wordIdx !== this.duaWordHighlightIdx) {
      this.duaWordHighlightIdx = wordIdx;

      duaWords.forEach(function(el, idx) {
        el.classList.remove('dua-word-active', 'dua-word-read', 'dua-word-upcoming');
        if (idx < wordIdx) {
          el.classList.add('dua-word-read');
        } else if (idx === wordIdx) {
          el.classList.add('dua-word-active');
        } else {
          el.classList.add('dua-word-upcoming');
        }
      });

      var activeWord = duaWords[wordIdx];
      if (activeWord) {
        var rect = activeWord.getBoundingClientRect();
        var viewportH = window.innerHeight;
        if (rect.top < 80 || rect.bottom > viewportH - 120) {
          activeWord.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }

    if (progress >= 1) {
      this.onDuaAudioEnded();
    }
  },

  onDuaAudioEnded() {
    if (this._duaTimer) { clearInterval(this._duaTimer); this._duaTimer = null; }
    var wasPlaying = this.duaPlayingId;
    this.duaPlayingId = null;
    this.duaWordHighlightIdx = -1;
    this._duaUtterance = null;
    this._duaWords = [];
    if ('speechSynthesis' in window) speechSynthesis.cancel();

    if (wasPlaying) {
      var duas = API.getDuas(this.duaCategory);
      var idx = duas.findIndex(function(d) { return d.id === wasPlaying; });
      if (idx >= 0 && idx < duas.length - 1) {
        setTimeout(function() { Screens.playDua(duas[idx + 1].id); }, 800);
        return;
      }
    }

    this.renderDuas();
    Store.unlockAchievement('dua_listener');
  },

  toggleDuaFav(duaId) {
    var favs = Store.get('duaFavorites', []);
    var idx = favs.indexOf(duaId);
    if (idx >= 0) favs.splice(idx, 1);
    else favs.push(duaId);
    Store.set('duaFavorites', favs);
    this.renderDuas();
    App.toast(idx >= 0 ? 'Removed from favorites' : 'Added to favorites');
  },

  copyDua(duaId) {
    var allCats = Object.keys(API.duas);
    var dua = null;
    for (var c = 0; c < allCats.length; c++) {
      dua = API.duas[allCats[c]].find(function(d) { return d.id === duaId; });
      if (dua) break;
    }
    if (dua) {
      var text = dua.arabic + '\n\n' + dua.translit + '\n\n' + dua.trans + '\n\n— ' + dua.ref;
      navigator.clipboard.writeText(text).then(function() { App.toast('Dua copied to clipboard'); });
    }
  },

  // ==== ZAKAT SCREEN ====
  renderZakat() {
    const el = document.getElementById('screen-zakat');
    const zakatSVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:32px;height:32px;margin-bottom:8px">
      <path d="M50 10 L70 30 L70 70 Q70 80 60 85 L40 85 Q30 80 30 70 L30 30 Z" fill="rgba(212,168,67,0.7)" stroke="rgba(212,168,67,0.9)" stroke-width="2"/>
      <line x1="40" y1="40" x2="60" y2="40" stroke="rgba(30,40,60,0.6)" stroke-width="1.5"/>
      <line x1="40" y1="55" x2="60" y2="55" stroke="rgba(30,40,60,0.4)" stroke-width="1"/>
    </svg>`;

    el.innerHTML = `
      ${this._screenHeader('💰', 'Purification of Wealth', 'الزكاة')}
      <div class="card" style="border:2px solid var(--gold-light);background:linear-gradient(135deg,rgba(212,168,67,0.1),rgba(212,168,67,0.05))">
        <div style="font-size:13px;color:var(--gold-light);text-transform:uppercase;font-weight:600">Nisab Threshold</div>
        <div style="font-size:20px;font-weight:700;color:var(--text-primary);margin:6px 0">~$5,500 USD</div>
        <div class="text-xs text-sec">2.5% of qualifying wealth held for one lunar year</div>
      </div>
      <div class="section-title">Calculate Your Zakat</div>
      <div class="form-group"><label class="form-label" style="color:var(--gold-light);font-weight:600">Gold & Jewelry Value ($)</label><input class="form-input" type="number" id="z-gold" placeholder="0.00" min="0" style="border:1px solid rgba(212,168,67,0.3)"></div>
      <div class="form-group"><label class="form-label" style="color:var(--gold-light);font-weight:600">Silver Value ($)</label><input class="form-input" type="number" id="z-silver" placeholder="0.00" min="0" style="border:1px solid rgba(212,168,67,0.3)"></div>
      <div class="form-group"><label class="form-label" style="color:var(--gold-light);font-weight:600">Cash & Bank Balances ($)</label><input class="form-input" type="number" id="z-cash" placeholder="0.00" min="0" style="border:1px solid rgba(212,168,67,0.3)"></div>
      <div class="form-group"><label class="form-label" style="color:var(--gold-light);font-weight:600">Stocks & Investments ($)</label><input class="form-input" type="number" id="z-stocks" placeholder="0.00" min="0" style="border:1px solid rgba(212,168,67,0.3)"></div>
      <div class="form-group"><label class="form-label" style="color:var(--gold-light);font-weight:600">Business / Rental Property ($)</label><input class="form-input" type="number" id="z-property" placeholder="0.00" min="0" style="border:1px solid rgba(212,168,67,0.3)"></div>
      <div class="form-group"><label class="form-label" style="color:var(--gold-light);font-weight:600">Debts & Liabilities ($)</label><input class="form-input" type="number" id="z-debts" placeholder="0.00" style="border:1px solid rgba(212,168,67,0.3)"></div>
      <button class="btn btn-primary w-full mt-8" style="border-radius:8px;font-weight:600" onclick="Screens.calcZakat()">Calculate Zakat</button>
      <div id="zakat-result"></div>
    `;
  },

  calcZakat() {
    var v = function(id) { var el = document.getElementById(id); return el ? (parseFloat(el.value) || 0) : 0; };
    const result = API.calculateZakat(v('z-gold'), v('z-silver'), v('z-cash'), v('z-stocks'), v('z-property'), v('z-debts'));
    Store.unlockAchievement('zakat_calc');
    document.getElementById('zakat-result').innerHTML = `
      <div class="zakat-result mt-16" style="background:linear-gradient(135deg,rgba(212,168,67,0.15),rgba(212,168,67,0.05));border:2px solid var(--gold-light);border-radius:12px;padding:16px;text-align:center">
        <div style="font-size:12px;opacity:.8;color:var(--text-sec);text-transform:uppercase;font-weight:600">${result.eligible ? 'Your Zakat Due' : 'Below Nisab Threshold'}</div>
        <div class="zakat-amount" style="font-size:36px;font-weight:700;color:var(--gold-light);margin:12px 0">$${result.amount.toFixed(2)}</div>
        <div class="zakat-label-sm" style="font-size:12px;color:var(--text-sec)">Net assets: $${result.net.toLocaleString()} | Nisab: $${result.nisab.toLocaleString()}</div>
      </div>
    `;
  },

  // ==== CALENDAR SCREEN ====
  calMonth: new Date().getMonth(),
  calYear: new Date().getFullYear(),

  renderCalendar() {
    const el = document.getElementById('screen-calendar');
    const hijri = API.getHijriDate();
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const firstDay = new Date(this.calYear, this.calMonth, 1).getDay();
    const daysInMonth = new Date(this.calYear, this.calMonth + 1, 0).getDate();
    const today = new Date();
    const isCurrentMonth = this.calMonth === today.getMonth() && this.calYear === today.getFullYear();

    // Islamic events (approximate)
    const events = [
      { name: 'Ramadan begins', date: '2026-02-18', color: 'var(--gold)' },
      { name: 'Laylat al-Qadr', date: '2026-03-15', color: 'var(--purple)' },
      { name: 'Eid al-Fitr', date: '2026-03-20', color: 'var(--green)' },
      { name: 'Eid al-Adha', date: '2026-05-27', color: 'var(--green)' },
      { name: 'Islamic New Year', date: '2026-06-17', color: 'var(--blue)' },
    ];
    const monthEvents = events.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === this.calMonth && d.getFullYear() === this.calYear;
    });
    const eventDays = monthEvents.map(e => new Date(e.date).getDate());

    const crescentSVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:24px;height:24px;margin-right:8px">
      <path d="M50 20 A30 30 0 1 1 50 80 A25 25 0 1 0 50 20" fill="var(--gold-light)" opacity="0.8"/>
    </svg>`;

    el.innerHTML = `
      ${this._screenHeader('📅', 'Hijri Calendar', 'التقويم الهجري')}
      <div class="card" style="background:linear-gradient(135deg,var(--primary-dark),var(--primary));border-left:4px solid var(--gold-light)">
        <div style="display:flex;align-items:center;gap:8px">
          ${crescentSVG}
          <div>
            <div style="font-size:12px;opacity:.8;text-transform:uppercase;font-weight:600">Islamic Date</div>
            <div style="font-size:18px;font-weight:700">${hijri.day} ${hijri.monthName} ${hijri.year} AH</div>
          </div>
        </div>
      </div>

      <div class="row mb-16" style="justify-content:space-between;align-items:center">
        <button class="back-btn" onclick="Screens.calMonth--;if(Screens.calMonth<0){Screens.calMonth=11;Screens.calYear--;}Screens.renderCalendar()">←</button>
        <div style="font-weight:700;font-size:16px">${months[this.calMonth]} ${this.calYear}</div>
        <button class="back-btn" onclick="Screens.calMonth++;if(Screens.calMonth>11){Screens.calMonth=0;Screens.calYear++;}Screens.renderCalendar()">→</button>
      </div>

      <div class="cal-grid">
        ${days.map(d => `<div class="cal-day-header">${d}</div>`).join('')}
        ${Array(firstDay).fill('<div class="cal-day empty"></div>').join('')}
        ${Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const isToday = isCurrentMonth && day === today.getDate();
          const isEvent = eventDays.includes(day);
          return `<div class="cal-day ${isToday ? 'today' : ''} ${isEvent ? 'event-day' : ''}" style="${isToday ? 'background:var(--gold-light);color:var(--dark);box-shadow:0 0 12px rgba(212,168,67,0.6);border-radius:50%' : ''}">${day}</div>`;
        }).join('')}
      </div>

      ${monthEvents.length > 0 ? `
        <div class="section-title">Events This Month</div>
        ${monthEvents.map(e => `
          <div class="card row mb-8" style="border-left:4px solid ${e.color};border-radius:8px">
            <div style="flex-shrink:0;margin-right:12px">🕌</div>
            <div class="flex-1">
              <div style="font-weight:600">${e.name}</div>
              <div class="text-xs text-sec">${new Date(e.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
            </div>
          </div>
        `).join('')}
      ` : ''}
    `;
  },

  // ==== COMMUNITY SCREEN (World-Class Muslim Engagement) ====
  communityTab: 'mosques',
  _communityMosques: null,
  _communityHalal: null,
  _communityRadius: 32, // km (~20 mi)
  _communityShowAll: false,
  _communitySearch: '',
  _communityFilter: 'all',

  async renderCommunity() {
    var self = this;
    var el = document.getElementById('screen-community');
    if (!el) return;

    var tabs = [
      { id: 'mosques', label: '\uD83D\uDD4C Mosques' },
      { id: 'halal', label: '\uD83C\uDF5B Halal Food' },
      { id: 'events', label: '\uD83D\uDCC5 Events' },
      { id: 'dates', label: '\u2B50 Islamic Dates' },
      { id: 'inspire', label: '\uD83D\uDCA1 Inspire' }
    ];

    // Build tab bar
    var tabsHTML = '';
    for (var i = 0; i < tabs.length; i++) {
      var t = tabs[i];
      var isActive = t.id === self.communityTab;
      tabsHTML += '<button class="ummah-tab' + (isActive ? ' active' : '') + '" data-tab="' + t.id + '">' + t.label + '</button>';
    }

    el.innerHTML =
      self._screenHeader('\uD83C\uDF0D', 'Muslim Community', '\u0627\u0644\u0623\u0645\u0629 \u0627\u0644\u0625\u0633\u0644\u0627\u0645\u064A\u0629', 'Mosques, Halal Food & Islamic Life near you') +
      '<div class="ummah-tabs">' + tabsHTML + '</div>' +
      '<div id="ummah-content"></div>';

    // Attach tab listeners
    var tabBtns = el.querySelectorAll('.ummah-tab');
    for (var i = 0; i < tabBtns.length; i++) {
      (function(btn) {
        btn.addEventListener('click', function() {
          self.communityTab = btn.getAttribute('data-tab');
          self._communityShowAll = false;
          self._communitySearch = '';
          self._communityFilter = 'all';
          self.renderCommunity();
        });
        btn.addEventListener('touchend', function(e) {
          e.preventDefault();
          self.communityTab = btn.getAttribute('data-tab');
          self._communityShowAll = false;
          self._communitySearch = '';
          self._communityFilter = 'all';
          self.renderCommunity();
        });
      })(tabBtns[i]);
    }

    // Render active tab content
    var tab = self.communityTab;
    if (tab === 'mosques') self._renderCommunityMosques();
    else if (tab === 'halal') self._renderCommunityHalal();
    else if (tab === 'events') self._renderCommunityEvents();
    else if (tab === 'dates') self._renderCommunityDates();
    else if (tab === 'inspire') self._renderCommunityInspire();
  },

  // ---- SKELETON LOADER ----
  _skeletonCards: function(count) {
    var html = '';
    for (var i = 0; i < count; i++) {
      html += '<div class="ummah-card ummah-skeleton"><div class="ummah-card-header">' +
        '<div class="skel-circle"></div>' +
        '<div class="skel-lines"><div class="skel-line w70"></div><div class="skel-line w40"></div></div>' +
        '<div class="skel-badge"></div>' +
      '</div></div>';
    }
    return html;
  },

  // ---- RADIUS SELECTOR ----
  _radiusBar: function(type) {
    var self = this;
    var radii = [
      { km: 8, label: '5 mi' },
      { km: 16, label: '10 mi' },
      { km: 32, label: '20 mi' },
      { km: 80, label: '50 mi' }
    ];
    var html = '<div class="ummah-radius-bar">';
    for (var i = 0; i < radii.length; i++) {
      var r = radii[i];
      html += '<button class="ummah-radius-btn' + (self._communityRadius === r.km ? ' active' : '') + '" data-km="' + r.km + '">' + r.label + '</button>';
    }
    html += '</div>';
    return html;
  },

  _attachRadiusListeners: function(type) {
    var self = this;
    var btns = document.querySelectorAll('.ummah-radius-btn');
    for (var i = 0; i < btns.length; i++) {
      (function(btn) {
        btn.addEventListener('click', function() {
          var km = parseInt(btn.getAttribute('data-km'));
          if (km !== self._communityRadius) {
            self._communityRadius = km;
            API._nearbyCache = {}; // Clear API cache so new radius fetches fresh
            if (type === 'mosques') { self._communityMosques = null; self._renderCommunityMosques(); }
            else { self._communityHalal = null; self._renderCommunityHalal(); }
          }
        });
      })(btns[i]);
    }
  },

  // ---- SEARCH BAR ----
  _searchBar: function(placeholder) {
    return '<div class="ummah-search-wrap">' +
      '<span class="ummah-search-icon">\uD83D\uDD0D</span>' +
      '<input class="ummah-search-input" id="ummah-search" type="text" placeholder="' + placeholder + '" value="' + this._escapeHTML(this._communitySearch) + '">' +
    '</div>';
  },

  // ---- FAVORITES ----
  _isFav: function(id) {
    var favs = Store.get('ummahFavs', []);
    for (var i = 0; i < favs.length; i++) { if (favs[i] === id) return true; }
    return false;
  },
  _toggleFav: function(id) {
    var favs = Store.get('ummahFavs', []);
    var idx = -1;
    for (var i = 0; i < favs.length; i++) { if (favs[i] === id) { idx = i; break; } }
    if (idx >= 0) { favs.splice(idx, 1); App.toast('Removed from favorites'); }
    else { favs.push(id); App.toast('Saved to favorites!'); }
    Store.set('ummahFavs', favs);
    // Re-render current tab
    if (this.communityTab === 'mosques') this._renderCommunityMosques();
    else if (this.communityTab === 'halal') this._renderCommunityHalal();
  },

  // ---- OPEN NOW CHECKER ----
  _isOpenNow: function(hoursStr) {
    if (!hoursStr) return null; // unknown
    try {
      var now = new Date();
      var dayNames = ['Su','Mo','Tu','We','Th','Fr','Sa'];
      var today = dayNames[now.getDay()];
      var nowMin = now.getHours() * 60 + now.getMinutes();
      // Simple parser for common formats like "Mo-Fr 09:00-22:00; Sa-Su 10:00-20:00"
      var parts = hoursStr.split(';');
      for (var i = 0; i < parts.length; i++) {
        var part = parts[i].trim();
        if (part === '24/7') return true;
        var match = part.match(/^([A-Za-z, -]+)\s+(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/);
        if (!match) continue;
        var dayRange = match[1];
        var openMin = parseInt(match[2]) * 60 + parseInt(match[3]);
        var closeMin = parseInt(match[4]) * 60 + parseInt(match[5]);
        // Check if today falls in the day range
        var dayIncluded = false;
        var ranges = dayRange.split(',');
        for (var j = 0; j < ranges.length; j++) {
          var r = ranges[j].trim();
          if (r.indexOf('-') >= 0) {
            var ds = r.split('-');
            var startIdx = dayNames.indexOf(ds[0].trim());
            var endIdx = dayNames.indexOf(ds[1].trim());
            var todayIdx = dayNames.indexOf(today);
            if (startIdx >= 0 && endIdx >= 0 && todayIdx >= 0) {
              if (startIdx <= endIdx) { if (todayIdx >= startIdx && todayIdx <= endIdx) dayIncluded = true; }
              else { if (todayIdx >= startIdx || todayIdx <= endIdx) dayIncluded = true; }
            }
          } else if (r === today) dayIncluded = true;
        }
        if (dayIncluded && nowMin >= openMin && nowMin < closeMin) return true;
      }
      return false;
    } catch(e) { return null; }
  },

  // ---- MOSQUES TAB ----
  async _renderCommunityMosques() {
    var self = this;
    var content = document.getElementById('ummah-content');
    if (!content) return;

    // Show skeleton loading
    content.innerHTML = self._searchBar('Search mosques...') + self._radiusBar('mosques') + self._skeletonCards(4);

    try {
      if (!self.location) self.location = await API.getLocation();
      if (!self._communityMosques) {
        self._communityMosques = await API.getNearbyMosques(self.location.lat, self.location.lng, self._communityRadius);
      }
    } catch(e) {
      content.innerHTML = '<div class="ummah-error"><div style="font-size:36px;margin-bottom:8px">\u26A0\uFE0F</div>' +
        '<div style="font-weight:600;margin-bottom:4px">Could not load mosques</div>' +
        '<div style="font-size:12px;color:var(--text-sec);margin-bottom:12px">' + (e.message || 'Network error. Check your connection.') + '</div>' +
        '<button class="ummah-retry-btn" onclick="Screens._communityMosques=null;Screens._renderCommunityMosques()">Retry</button></div>';
      return;
    }

    var mosques = self._communityMosques || [];
    var radiusMi = Math.round(self._communityRadius * 0.621);

    // Filter by search
    var filtered = mosques;
    if (self._communitySearch) {
      var q = self._communitySearch.toLowerCase();
      filtered = [];
      for (var i = 0; i < mosques.length; i++) {
        if (mosques[i].name.toLowerCase().indexOf(q) >= 0 || (mosques[i].address && mosques[i].address.toLowerCase().indexOf(q) >= 0)) {
          filtered.push(mosques[i]);
        }
      }
    }

    // Sort favorites first
    var favs = Store.get('ummahFavs', []);
    filtered.sort(function(a, b) {
      var aFav = favs.indexOf('m_' + a.id) >= 0 ? 0 : 1;
      var bFav = favs.indexOf('m_' + b.id) >= 0 ? 0 : 1;
      if (aFav !== bFav) return aFav - bFav;
      return a.dist - b.dist;
    });

    if (filtered.length === 0) {
      content.innerHTML = self._searchBar('Search mosques...') + self._radiusBar('mosques') +
        '<div class="ummah-empty"><div style="font-size:48px;margin-bottom:12px">\uD83D\uDD4C</div>' +
        '<div style="font-weight:600;margin-bottom:4px">' + (self._communitySearch ? 'No matching mosques' : 'No mosques found within ' + radiusMi + ' miles') + '</div>' +
        '<div style="font-size:12px;color:var(--text-sec)">' + (self._communitySearch ? 'Try a different search term' : 'Try expanding your search radius or enable GPS') + '</div></div>';
      self._attachRadiusListeners('mosques');
      self._attachSearchListener('mosques');
      return;
    }

    var limit = self._communityShowAll ? filtered.length : Math.min(filtered.length, 20);
    var html = self._searchBar('Search mosques...') + self._radiusBar('mosques');
    html += '<div class="ummah-count">' + filtered.length + ' mosque' + (filtered.length !== 1 ? 's' : '') + ' within ' + radiusMi + ' miles</div>';

    for (var i = 0; i < limit; i++) {
      var m = filtered[i];
      var distLabel = m.dist < 0.1 ? 'Nearby' : m.dist.toFixed(1) + ' mi';
      var isFav = self._isFav('m_' + m.id);
      var detailParts = [];
      if (m.address) detailParts.push(m.address);
      if (m.denomination) detailParts.push(m.denomination.charAt(0).toUpperCase() + m.denomination.slice(1));
      var detailStr = detailParts.join(' \u00B7 ');

      // Badges
      var badges = '';
      if (isFav) badges += '<span class="ummah-tag fav-tag">\u2764\uFE0F Favorite</span>';
      if (m.wheelchair === 'yes') badges += '<span class="ummah-tag access-tag">\u267F Accessible</span>';
      if (m.denomination) badges += '<span class="ummah-tag denom-tag">' + self._escapeHTML(m.denomination) + '</span>';

      // Action buttons
      var actionBtns = '<button class="ummah-action-link ummah-fav-btn" data-fav="m_' + m.id + '">' + (isFav ? '\u2764\uFE0F Saved' : '\uD83E\uDD0D Save') + '</button>';
      if (m.phone) actionBtns += '<a href="tel:' + m.phone + '" class="ummah-action-link">\uD83D\uDCDE Call</a>';
      if (m.website) actionBtns += '<a href="' + self._escapeHTML(m.website) + '" target="_blank" rel="noopener" class="ummah-action-link">\uD83C\uDF10 Website</a>';
      actionBtns += '<a href="https://www.google.com/maps/dir/?api=1&destination=' + m.lat + ',' + m.lng + '" target="_blank" rel="noopener" class="ummah-action-link ummah-dir-link">\uD83D\uDDFA\uFE0F Directions</a>';

      html += '<div class="ummah-card mosque-card ummah-card-anim" style="animation-delay:' + (i * 0.04) + 's">' +
        '<div class="ummah-card-header">' +
          '<div class="ummah-card-icon mosque-icon">\uD83D\uDD4C</div>' +
          '<div class="ummah-card-info">' +
            '<div class="ummah-card-name">' + self._escapeHTML(m.name) + '</div>' +
            (detailStr ? '<div class="ummah-card-detail">' + self._escapeHTML(detailStr) + '</div>' : '') +
          '</div>' +
          '<div class="ummah-card-dist">' + distLabel + '</div>' +
        '</div>' +
        (badges ? '<div class="ummah-badges">' + badges + '</div>' : '') +
        '<div class="ummah-card-actions">' + actionBtns + '</div>' +
      '</div>';
    }

    if (!self._communityShowAll && filtered.length > 20) {
      html += '<button class="ummah-load-more" onclick="Screens._communityShowAll=true;Screens._renderCommunityMosques()">Show all ' + filtered.length + ' mosques</button>';
    }
    html += '<div class="ummah-source">Data from OpenStreetMap \u00B7 <a href="https://www.openstreetmap.org/" target="_blank" style="color:var(--gold-light)">Contribute</a></div>';
    content.innerHTML = html;
    self._attachRadiusListeners('mosques');
    self._attachSearchListener('mosques');
    self._attachFavListeners();
  },

  // ---- HALAL FOOD TAB ----
  async _renderCommunityHalal() {
    var self = this;
    var content = document.getElementById('ummah-content');
    if (!content) return;

    content.innerHTML = self._searchBar('Search halal food...') + self._radiusBar('halal') + self._skeletonCards(4);

    try {
      if (!self.location) self.location = await API.getLocation();
      if (!self._communityHalal) {
        self._communityHalal = await API.getNearbyHalal(self.location.lat, self.location.lng, self._communityRadius);
      }
    } catch(e) {
      content.innerHTML = '<div class="ummah-error"><div style="font-size:36px;margin-bottom:8px">\u26A0\uFE0F</div>' +
        '<div style="font-weight:600;margin-bottom:4px">Could not load restaurants</div>' +
        '<div style="font-size:12px;color:var(--text-sec);margin-bottom:12px">' + (e.message || 'Network error') + '</div>' +
        '<button class="ummah-retry-btn" onclick="Screens._communityHalal=null;Screens._renderCommunityHalal()">Retry</button></div>';
      return;
    }

    var places = self._communityHalal || [];
    var radiusMi = Math.round(self._communityRadius * 0.621);
    var amenityIcons = { restaurant: '\uD83C\uDF7D\uFE0F', fast_food: '\uD83C\uDF54', cafe: '\u2615' };

    // Filter by search & cuisine filter
    var filtered = places;
    if (self._communitySearch) {
      var q = self._communitySearch.toLowerCase();
      filtered = [];
      for (var i = 0; i < places.length; i++) {
        var p = places[i];
        if (p.name.toLowerCase().indexOf(q) >= 0 || (p.cuisine && p.cuisine.toLowerCase().indexOf(q) >= 0) || (p.address && p.address.toLowerCase().indexOf(q) >= 0)) {
          filtered.push(p);
        }
      }
    }

    // Get unique cuisines for filter
    var cuisineSet = {};
    for (var i = 0; i < places.length; i++) {
      if (places[i].cuisine) {
        var cs = places[i].cuisine.split(/[;,]/);
        for (var j = 0; j < cs.length; j++) {
          var c = cs[j].trim().toLowerCase();
          if (c && c !== 'halal') cuisineSet[c] = (cuisineSet[c] || 0) + 1;
        }
      }
    }
    var topCuisines = Object.keys(cuisineSet).sort(function(a,b){ return cuisineSet[b]-cuisineSet[a]; }).slice(0, 6);

    // Sort favs first
    var favs = Store.get('ummahFavs', []);
    filtered.sort(function(a, b) {
      var aFav = favs.indexOf('h_' + a.id) >= 0 ? 0 : 1;
      var bFav = favs.indexOf('h_' + b.id) >= 0 ? 0 : 1;
      if (aFav !== bFav) return aFav - bFav;
      return a.dist - b.dist;
    });

    if (filtered.length === 0) {
      content.innerHTML = self._searchBar('Search halal food...') + self._radiusBar('halal') +
        '<div class="ummah-empty"><div style="font-size:48px;margin-bottom:12px">\uD83C\uDF5B</div>' +
        '<div style="font-weight:600;margin-bottom:4px">' + (self._communitySearch ? 'No matching restaurants' : 'No halal restaurants within ' + radiusMi + ' miles') + '</div>' +
        '<div style="font-size:12px;color:var(--text-sec)">OpenStreetMap data may be limited in your area.<br><a href="https://www.openstreetmap.org/" target="_blank" style="color:var(--gold-light)">Help add halal places</a></div></div>';
      self._attachRadiusListeners('halal');
      self._attachSearchListener('halal');
      return;
    }

    var limit = self._communityShowAll ? filtered.length : Math.min(filtered.length, 20);
    var html = self._searchBar('Search halal food...') + self._radiusBar('halal');

    // Cuisine filter chips
    if (topCuisines.length > 0) {
      html += '<div class="ummah-cuisine-filters">';
      html += '<button class="ummah-cuisine-chip' + (self._communityFilter === 'all' ? ' active' : '') + '" data-cuisine="all">All</button>';
      for (var i = 0; i < topCuisines.length; i++) {
        var c = topCuisines[i];
        html += '<button class="ummah-cuisine-chip' + (self._communityFilter === c ? ' active' : '') + '" data-cuisine="' + c + '">' + c.charAt(0).toUpperCase() + c.slice(1) + ' (' + cuisineSet[c] + ')</button>';
      }
      html += '</div>';
    }

    html += '<div class="ummah-count">' + filtered.length + ' halal place' + (filtered.length !== 1 ? 's' : '') + ' within ' + radiusMi + ' miles</div>';

    for (var i = 0; i < limit; i++) {
      var p = filtered[i];
      var distLabel = p.dist < 0.1 ? 'Nearby' : p.dist.toFixed(1) + ' mi';
      var icon = amenityIcons[p.amenity] || '\uD83C\uDF7D\uFE0F';
      var cuisineLabel = p.cuisine ? p.cuisine.replace(/;/g, ', ') : 'Halal';
      if (cuisineLabel.length > 40) cuisineLabel = cuisineLabel.substring(0, 40) + '...';
      var isFav = self._isFav('h_' + p.id);
      var openStatus = self._isOpenNow(p.openingHours);
      var openBadge = '';
      if (openStatus === true) openBadge = '<span class="ummah-open-badge open">\u25CF Open Now</span>';
      else if (openStatus === false) openBadge = '<span class="ummah-open-badge closed">\u25CF Closed</span>';

      var detailParts = [];
      if (p.address) detailParts.push(p.address);
      var detailStr = detailParts.join(' \u00B7 ');

      var badges = '';
      if (isFav) badges += '<span class="ummah-tag fav-tag">\u2764\uFE0F Favorite</span>';
      var typeLabel = p.amenity === 'fast_food' ? 'Fast Food' : p.amenity === 'cafe' ? 'Caf\u00E9' : 'Restaurant';
      badges += '<span class="ummah-tag type-tag">' + typeLabel + '</span>';

      var actionBtns = '<button class="ummah-action-link ummah-fav-btn" data-fav="h_' + p.id + '">' + (isFav ? '\u2764\uFE0F Saved' : '\uD83E\uDD0D Save') + '</button>';
      if (p.phone) actionBtns += '<a href="tel:' + p.phone + '" class="ummah-action-link">\uD83D\uDCDE Call</a>';
      if (p.website) actionBtns += '<a href="' + self._escapeHTML(p.website) + '" target="_blank" rel="noopener" class="ummah-action-link">\uD83C\uDF10 Website</a>';
      actionBtns += '<a href="https://www.google.com/maps/dir/?api=1&destination=' + p.lat + ',' + p.lng + '" target="_blank" rel="noopener" class="ummah-action-link ummah-dir-link">\uD83D\uDDFA\uFE0F Directions</a>';

      html += '<div class="ummah-card halal-card ummah-card-anim" style="animation-delay:' + (i * 0.04) + 's">' +
        '<div class="ummah-card-header">' +
          '<div class="ummah-card-icon halal-icon">' + icon + '</div>' +
          '<div class="ummah-card-info">' +
            '<div class="ummah-card-name">' + self._escapeHTML(p.name) + openBadge + '</div>' +
            '<div class="ummah-cuisine-tag">' + self._escapeHTML(cuisineLabel) + '</div>' +
            (detailStr ? '<div class="ummah-card-detail">' + self._escapeHTML(detailStr) + '</div>' : '') +
            (p.openingHours ? '<div class="ummah-card-hours">\u23F0 ' + self._escapeHTML(p.openingHours) + '</div>' : '') +
          '</div>' +
          '<div class="ummah-card-dist">' + distLabel + '</div>' +
        '</div>' +
        (badges ? '<div class="ummah-badges">' + badges + '</div>' : '') +
        '<div class="ummah-card-actions">' + actionBtns + '</div>' +
      '</div>';
    }

    if (!self._communityShowAll && filtered.length > 20) {
      html += '<button class="ummah-load-more" onclick="Screens._communityShowAll=true;Screens._renderCommunityHalal()">Show all ' + filtered.length + ' restaurants</button>';
    }
    html += '<div class="ummah-source">Data from OpenStreetMap \u00B7 <a href="https://www.openstreetmap.org/" target="_blank" style="color:var(--gold-light)">Contribute</a></div>';
    content.innerHTML = html;
    self._attachRadiusListeners('halal');
    self._attachSearchListener('halal');
    self._attachFavListeners();
    self._attachCuisineFilterListeners();
  },

  _attachSearchListener: function(type) {
    var self = this;
    var input = document.getElementById('ummah-search');
    if (!input) return;
    var timer = null;
    input.addEventListener('input', function() {
      clearTimeout(timer);
      timer = setTimeout(function() {
        self._communitySearch = input.value.trim();
        if (type === 'mosques') self._renderCommunityMosques();
        else self._renderCommunityHalal();
      }, 300);
    });
  },

  _attachFavListeners: function() {
    var self = this;
    var btns = document.querySelectorAll('.ummah-fav-btn');
    for (var i = 0; i < btns.length; i++) {
      (function(btn) {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          self._toggleFav(btn.getAttribute('data-fav'));
        });
      })(btns[i]);
    }
  },

  _attachCuisineFilterListeners: function() {
    var self = this;
    var chips = document.querySelectorAll('.ummah-cuisine-chip');
    for (var i = 0; i < chips.length; i++) {
      (function(chip) {
        chip.addEventListener('click', function() {
          self._communityFilter = chip.getAttribute('data-cuisine');
          // Filter halal results
          if (self._communityFilter !== 'all' && self._communityHalal) {
            self._communitySearch = self._communityFilter;
          } else {
            self._communitySearch = '';
          }
          self._renderCommunityHalal();
        });
      })(chips[i]);
    }
  },

  // ---- EVENTS TAB ----
  _renderCommunityEvents() {
    var content = document.getElementById('ummah-content');
    if (!content) return;

    var events = API.getIslamicEvents();
    var fastDays = API.getSunnahFastingDays();
    var hijri = API.getHijriDate();

    var html = '<div class="ummah-hijri-banner">' +
      '<div class="ummah-hijri-crescent">\u262A</div>' +
      '<div class="ummah-hijri-date">' + hijri.day + ' ' + hijri.monthName + ' ' + hijri.year + ' AH</div>' +
      '<div class="ummah-hijri-sub">' + new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) + '</div>' +
    '</div>';

    // Upcoming events
    html += '<div class="ummah-section-title">\u2728 Upcoming Islamic Events</div>';
    var shownEvents = 0;
    for (var i = 0; i < events.length; i++) {
      var ev = events[i];
      if (ev.daysUntil < -7) continue;
      shownEvents++;
      var dateStr = ev.gregorianDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      var urgencyClass = ev.daysUntil <= 0 ? 'ummah-event-today' : ev.daysUntil <= 7 ? 'ummah-event-soon' : '';
      var timeLabel = ev.daysUntil <= 0 ? 'Today!' : ev.daysUntil === 1 ? 'Tomorrow' : ev.daysUntil + ' days';
      var catBadge = '';
      if (ev.category === 'eid') catBadge = '<span class="ummah-tag eid-tag">\uD83C\uDF89 Eid</span>';
      else if (ev.category === 'sunnah') catBadge = '<span class="ummah-tag sunnah-tag">\u2606 Sunnah</span>';
      else catBadge = '<span class="ummah-tag major-tag">\u2605 Major</span>';

      html += '<div class="ummah-event-card ummah-card-anim ' + urgencyClass + '" style="border-left-color:' + ev.color + ';animation-delay:' + (shownEvents * 0.05) + 's">' +
        '<div class="ummah-event-icon">' + ev.icon + '</div>' +
        '<div class="ummah-event-info">' +
          '<div class="ummah-event-name">' + ev.name + ' ' + catBadge + '</div>' +
          '<div class="ummah-event-desc">' + ev.desc + '</div>' +
          '<div class="ummah-event-meta">' + ev.hijriLabel + ' \u00B7 ~' + dateStr + '</div>' +
        '</div>' +
        '<div class="ummah-event-countdown' + (ev.daysUntil <= 7 ? ' soon' : '') + '">' + timeLabel + '</div>' +
      '</div>';
    }

    // Sunnah fasting
    html += '<div class="ummah-section-title" style="margin-top:20px">\uD83C\uDF19 Sunnah Fasting Schedule</div>';
    html += '<div class="ummah-fast-grid">';
    for (var i = 0; i < fastDays.length; i++) {
      var fd = fastDays[i];
      var fDate = new Date();
      fDate.setDate(fDate.getDate() + fd.daysUntil);
      var fLabel = fd.daysUntil === 0 ? 'Today' : fd.daysUntil === 1 ? 'Tomorrow' : fDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      var fIcon = fd.type === 'white' ? '\uD83C\uDF15' : '\uD83C\uDF19';
      html += '<div class="ummah-fast-card ummah-card-anim" style="animation-delay:' + (i * 0.06) + 's">' +
        '<span class="ummah-fast-icon">' + fIcon + '</span>' +
        '<span class="ummah-fast-name">' + fd.name + '</span>' +
        '<span class="ummah-fast-date">' + fLabel + '</span>' +
      '</div>';
    }
    html += '</div>';

    // Quick dua of the day
    html += '<div class="ummah-section-title" style="margin-top:20px">\uD83E\uDD32 Dua of the Day</div>';
    var duas = [
      { ar: '\u0631\u0628\u0651\u064E\u0646\u0627 \u0622\u062A\u0650\u0646\u0627 \u0641\u064A \u0627\u0644\u062F\u0651\u064F\u0646\u0652\u064A\u0627 \u062D\u064E\u0633\u064E\u0646\u064E\u0629\u064B \u0648\u064E\u0641\u064A \u0627\u0644\u0622\u062E\u0650\u0631\u064E\u0629\u0650 \u062D\u064E\u0633\u064E\u0646\u064E\u0629\u064B \u0648\u064E\u0642\u0650\u0646\u0627 \u0639\u064E\u0630\u0627\u0628\u064E \u0627\u0644\u0646\u0651\u064E\u0627\u0631\u0650', en: 'Our Lord, give us in this world good and in the Hereafter good, and protect us from the punishment of the Fire.', ref: 'Quran 2:201' },
      { ar: '\u0631\u064E\u0628\u0651\u0650 \u0632\u0650\u062F\u0652\u0646\u0650\u064A \u0639\u0650\u0644\u0652\u0645\u064B\u0627', en: 'My Lord, increase me in knowledge.', ref: 'Quran 20:114' },
      { ar: '\u0631\u064E\u0628\u0651\u064E\u0646\u064E\u0627 \u0644\u0627 \u062A\u064F\u0632\u0650\u063A\u0652 \u0642\u064F\u0644\u064F\u0648\u0628\u064E\u0646\u064E\u0627 \u0628\u064E\u0639\u0652\u062F\u064E \u0625\u0650\u0630\u0652 \u0647\u064E\u062F\u064E\u064A\u0652\u062A\u064E\u0646\u064E\u0627', en: 'Our Lord, let not our hearts deviate after You have guided us.', ref: 'Quran 3:8' }
    ];
    var todayDua = duas[new Date().getDate() % duas.length];
    html += '<div class="ummah-dua-card">' +
      '<div style="font-family:\'Amiri\',serif;font-size:20px;color:var(--gold-light);line-height:1.8;text-align:center;margin-bottom:10px">' + todayDua.ar + '</div>' +
      '<div style="font-size:13px;color:var(--text-primary);line-height:1.6;text-align:center;font-style:italic">"' + todayDua.en + '"</div>' +
      '<div style="font-size:11px;color:var(--gold);text-align:center;margin-top:8px">\u2014 ' + todayDua.ref + '</div>' +
    '</div>';

    content.innerHTML = html;
  },

  // ---- ISLAMIC DATES TAB ----
  _renderCommunityDates() {
    var content = document.getElementById('ummah-content');
    if (!content) return;

    var hijri = API.getHijriDate();
    var months = ['Muharram','Safar','Rabi al-Awwal','Rabi al-Thani','Jumada al-Ula','Jumada al-Thani','Rajab','Sha\'ban','Ramadan','Shawwal','Dhul Qi\'dah','Dhul Hijjah'];
    var monthIcons = ['\uD83C\uDF1F','\uD83C\uDF3F','\uD83D\uDC9A','\uD83C\uDF31','\u2744\uFE0F','\uD83C\uDF3A','\u2B50','\uD83C\uDF19','\uD83C\uDF19','\uD83C\uDF89','\uD83D\uDD4B','\uD83D\uDD4B'];
    var monthDescriptions = [
      'Sacred month. Fasting encouraged. Contains Ashura (10th).',
      'No special events. Good time for voluntary worship.',
      'Birth month of Prophet Muhammad (PBUH) \u2014 12th Rabi al-Awwal.',
      'Continue good deeds and voluntary fasting.',
      'Named after the dry cold weather. Focus on dhikr.',
      'Prepare spiritually for the sacred months ahead.',
      'Sacred month. Isra & Mi\'raj on 27th. Increase worship.',
      'Month before Ramadan. Night of Bara\'ah on 15th. Start preparation.',
      'The holy month of fasting, Quran, and Laylat al-Qadr.',
      'Month of Eid al-Fitr. Six fasts of Shawwal recommended.',
      'Month of preparation for Hajj. Increase good deeds.',
      'Month of Hajj, Arafah (9th), and Eid al-Adha (10th). First 10 days are blessed.'
    ];
    var sacredMonths = [1, 7, 11, 12];

    var html = '<div class="ummah-dates-hero">' +
      '<div class="ummah-dates-crescent">\u262A</div>' +
      '<div style="font-size:56px;font-weight:700;color:var(--gold-light);font-family:\'Amiri\',serif">' + hijri.day + '</div>' +
      '<div style="font-size:22px;font-weight:600;color:var(--text-primary)">' + hijri.monthName + '</div>' +
      '<div style="font-size:15px;color:var(--text-sec)">' + hijri.year + ' AH</div>' +
      '<div style="font-size:11px;color:var(--gold);margin-top:8px">' + new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) + '</div>' +
    '</div>';

    // Current month spotlight
    html += '<div class="ummah-section-title">' + monthIcons[hijri.month - 1] + ' Month of ' + hijri.monthName + '</div>';
    var isSacred = sacredMonths.indexOf(hijri.month) >= 0;
    html += '<div class="ummah-month-info">' +
      (isSacred ? '<span class="ummah-tag sacred-tag">\u2728 Sacred Month</span> ' : '') +
      (monthDescriptions[hijri.month - 1] || '') +
    '</div>';

    // All 12 months
    html += '<div class="ummah-section-title" style="margin-top:20px">\uD83D\uDD4B Hijri Calendar ' + hijri.year + ' AH</div>';
    for (var i = 0; i < 12; i++) {
      var isCurrent = (i + 1) === hijri.month;
      var isS = sacredMonths.indexOf(i + 1) >= 0;
      html += '<div class="ummah-month-card ummah-card-anim' + (isCurrent ? ' current' : '') + '" style="animation-delay:' + (i * 0.04) + 's">' +
        '<div class="ummah-month-num' + (isS ? ' sacred' : '') + '">' + monthIcons[i] + '</div>' +
        '<div class="ummah-month-details">' +
          '<div class="ummah-month-name">' + months[i] +
            (isCurrent ? ' <span class="ummah-current-badge">Current</span>' : '') +
            (isS ? ' <span class="ummah-sacred-badge">Sacred</span>' : '') +
          '</div>' +
          '<div class="ummah-month-desc">' + monthDescriptions[i] + '</div>' +
        '</div>' +
      '</div>';
    }

    // Sacred months info
    html += '<div class="ummah-sacred-box">' +
      '<div style="font-weight:700;color:var(--gold-light);margin-bottom:8px;font-size:15px">\u2728 The Four Sacred Months</div>' +
      '<div style="font-size:13px;color:var(--text-sec);line-height:1.7">Muharram, Rajab, Dhul Qi\'dah, and Dhul Hijjah are the four sacred months in Islam. Good deeds in these months are multiplied, and wrongdoing is more severe. The Prophet (PBUH) encouraged extra fasting and worship during these months.</div>' +
      '<div style="font-size:11px;color:var(--gold);margin-top:8px">\u2014 Based on Quran 9:36</div>' +
    '</div>';

    content.innerHTML = html;
  },

  // ---- INSPIRE TAB ----
  _renderCommunityInspire() {
    var self = this;
    var content = document.getElementById('ummah-content');
    if (!content) return;

    var inspiration = API.getDailyInspiration();
    var stats = Store.getStats();
    var hijri = API.getHijriDate();

    var html = '';

    // Daily inspiration hero
    var isQuran = inspiration.type === 'quran';
    html += '<div class="ummah-inspire-hero">' +
      '<div class="ummah-inspire-icon">' + (isQuran ? '\uD83D\uDCD6' : '\uD83D\uDCDC') + '</div>' +
      '<div class="ummah-inspire-label">' + (isQuran ? 'Verse of the Day' : 'Hadith of the Day') + '</div>' +
      '<div class="ummah-inspire-text">\u201C' + inspiration.text + '\u201D</div>' +
      '<div class="ummah-inspire-source">\u2014 ' + inspiration.source + '</div>' +
    '</div>';

    // Dashboard
    html += '<div class="ummah-section-title">\uD83D\uDCCA Your Muslim Dashboard</div>';
    html += '<div class="ummah-dashboard-grid">' +
      '<div class="ummah-stat-card fire"><div class="ummah-stat-num">' + (stats.streak || 0) + '</div><div class="ummah-stat-label">\uD83D\uDD25 Day Streak</div></div>' +
      '<div class="ummah-stat-card pray"><div class="ummah-stat-num">' + (stats.totalPrayers || 0) + '</div><div class="ummah-stat-label">\uD83D\uDE4F Prayers</div></div>' +
      '<div class="ummah-stat-card tasbih"><div class="ummah-stat-num">' + (stats.tasbihTotal || 0).toLocaleString() + '</div><div class="ummah-stat-label">\uD83D\uDCFF Tasbih</div></div>' +
      '<div class="ummah-stat-card level"><div class="ummah-stat-num">Lv ' + (stats.level || 1) + '</div><div class="ummah-stat-label">\u2B50 ' + (stats.xp || 0) + ' XP</div></div>' +
    '</div>';

    // Quick actions
    html += '<div class="ummah-section-title" style="margin-top:20px">\uD83D\uDE80 Quick Actions</div>';
    var actions = [
      { icon: '\uD83D\uDCFF', label: 'Tasbih', screen: 'tasbih' },
      { icon: '\uD83E\uDDED', label: 'Qibla', screen: 'qibla' },
      { icon: '\uD83E\uDD32', label: 'Duas', screen: 'duas' },
      { icon: '\uD83D\uDD4C', label: 'Azan', screen: 'azan' },
      { icon: '\uD83D\uDCB0', label: 'Zakat', screen: 'zakat' },
      { icon: '\uD83D\uDCC5', label: 'Calendar', screen: 'calendar' }
    ];
    html += '<div class="ummah-actions-grid">';
    for (var i = 0; i < actions.length; i++) {
      var a = actions[i];
      html += '<div class="ummah-action-card ummah-card-anim" style="animation-delay:' + (i * 0.06) + 's" onclick="App.navigate(\'' + a.screen + '\')">' +
        '<div class="ummah-action-icon">' + a.icon + '</div>' +
        '<div class="ummah-action-label">' + a.label + '</div>' +
      '</div>';
    }
    html += '</div>';

    // 99 Names of Allah — FULL SET
    var dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    var names99 = [
      ['Ar-Rahman','\u0627\u0644\u0631\u064E\u0651\u062D\u0645\u064E\u0646','The Most Gracious'],['Ar-Rahim','\u0627\u0644\u0631\u064E\u0651\u062D\u064A\u0645','The Most Merciful'],
      ['Al-Malik','\u0627\u0644\u0645\u064E\u0644\u0650\u0643','The King'],['Al-Quddus','\u0627\u0644\u0642\u064F\u062F\u064F\u0651\u0648\u0633','The Most Holy'],
      ['As-Salam','\u0627\u0644\u0633\u064E\u0651\u0644\u0627\u0645','The Source of Peace'],['Al-Mu\'min','\u0627\u0644\u0645\u064F\u0624\u0645\u0650\u0646','The Guardian of Faith'],
      ['Al-Muhaymin','\u0627\u0644\u0645\u064F\u0647\u064E\u064A\u0645\u0650\u0646','The Protector'],['Al-Aziz','\u0627\u0644\u0639\u064E\u0632\u064A\u0632','The Almighty'],
      ['Al-Jabbar','\u0627\u0644\u062C\u064E\u0628\u064E\u0651\u0627\u0631','The Compeller'],['Al-Mutakabbir','\u0627\u0644\u0645\u064F\u062A\u064E\u0643\u064E\u0628\u0650\u0651\u0631','The Greatest'],
      ['Al-Khaliq','\u0627\u0644\u062E\u064E\u0627\u0644\u0650\u0642','The Creator'],['Al-Bari','\u0627\u0644\u0628\u064E\u0627\u0631\u0650\u0626','The Evolver'],
      ['Al-Musawwir','\u0627\u0644\u0645\u064F\u0635\u064E\u0648\u0650\u0651\u0631','The Fashioner'],['Al-Ghaffar','\u0627\u0644\u063A\u064E\u0641\u0651\u064E\u0627\u0631','The Forgiver'],
      ['Al-Qahhar','\u0627\u0644\u0642\u064E\u0647\u0651\u064E\u0627\u0631','The Subduer'],['Al-Wahhab','\u0627\u0644\u0648\u064E\u0647\u0651\u064E\u0627\u0628','The Bestower'],
      ['Ar-Razzaq','\u0627\u0644\u0631\u064E\u0651\u0632\u064E\u0627\u0642','The Provider'],['Al-Fattah','\u0627\u0644\u0641\u064E\u062A\u0651\u064E\u0627\u062D','The Opener'],
      ['Al-Alim','\u0627\u0644\u0639\u064E\u0644\u0650\u064A\u0645','The All-Knowing'],['Al-Qabid','\u0627\u0644\u0642\u064E\u0627\u0628\u0650\u0636','The Constrictor'],
      ['Al-Basit','\u0627\u0644\u0628\u064E\u0627\u0633\u0650\u0637','The Expander'],['Al-Khafid','\u0627\u0644\u062E\u064E\u0627\u0641\u0650\u0636','The Abaser'],
      ['Ar-Rafi','\u0627\u0644\u0631\u064E\u0651\u0627\u0641\u0650\u0639','The Exalter'],['Al-Mu\'izz','\u0627\u0644\u0645\u064F\u0639\u0650\u0632\u0651','The Bestower of Honor'],
      ['Al-Mudhill','\u0627\u0644\u0645\u064F\u0630\u0650\u0644\u0651','The Humiliator'],['As-Sami','\u0627\u0644\u0633\u064E\u0645\u0650\u064A\u0639','The All-Hearing'],
      ['Al-Basir','\u0627\u0644\u0628\u064E\u0635\u0650\u064A\u0631','The All-Seeing'],['Al-Hakam','\u0627\u0644\u062D\u064E\u0643\u064E\u0645','The Judge'],
      ['Al-Adl','\u0627\u0644\u0639\u064E\u062F\u0652\u0644','The Just'],['Al-Latif','\u0627\u0644\u0644\u064E\u0637\u0650\u064A\u0641','The Subtle One'],
      ['Al-Khabir','\u0627\u0644\u062E\u064E\u0628\u0650\u064A\u0631','The All-Aware'],['Al-Halim','\u0627\u0644\u062D\u064E\u0644\u0650\u064A\u0645','The Forbearing'],
      ['Al-Azim','\u0627\u0644\u0639\u064E\u0638\u0650\u064A\u0645','The Magnificent'],['Al-Ghafur','\u0627\u0644\u063A\u064E\u0641\u064F\u0648\u0631','The All-Forgiving'],
      ['Ash-Shakur','\u0627\u0644\u0634\u064E\u0643\u064F\u0648\u0631','The Most Appreciative'],['Al-Aliyy','\u0627\u0644\u0639\u064E\u0644\u0650\u064A\u0651','The Most High'],
      ['Al-Kabir','\u0627\u0644\u0643\u064E\u0628\u0650\u064A\u0631','The Most Great'],['Al-Hafiz','\u0627\u0644\u062D\u064E\u0641\u0650\u064A\u0638','The Preserver'],
      ['Al-Muqit','\u0627\u0644\u0645\u064F\u0642\u0650\u064A\u062A','The Nourisher'],['Al-Hasib','\u0627\u0644\u062D\u064E\u0633\u0650\u064A\u0628','The Reckoner'],
      ['Al-Jalil','\u0627\u0644\u062C\u064E\u0644\u0650\u064A\u0644','The Majestic'],['Al-Karim','\u0627\u0644\u0643\u064E\u0631\u0650\u064A\u0645','The Most Generous'],
      ['Ar-Raqib','\u0627\u0644\u0631\u064E\u0642\u0650\u064A\u0628','The Watchful'],['Al-Mujib','\u0627\u0644\u0645\u064F\u062C\u0650\u064A\u0628','The Responsive'],
      ['Al-Wasi','\u0627\u0644\u0648\u064E\u0627\u0633\u0650\u0639','The All-Encompassing'],['Al-Hakim','\u0627\u0644\u062D\u064E\u0643\u0650\u064A\u0645','The Most Wise'],
      ['Al-Wadud','\u0627\u0644\u0648\u064E\u062F\u064F\u0648\u062F','The Most Loving'],['Al-Majid','\u0627\u0644\u0645\u064E\u062C\u0650\u064A\u062F','The Most Glorious'],
      ['Al-Ba\'ith','\u0627\u0644\u0628\u064E\u0627\u0639\u0650\u062B','The Resurrector'],['Ash-Shahid','\u0627\u0644\u0634\u064E\u0647\u0650\u064A\u062F','The Witness'],
      ['Al-Haqq','\u0627\u0644\u062D\u064E\u0642\u0651','The Truth'],['Al-Wakil','\u0627\u0644\u0648\u064E\u0643\u0650\u064A\u0644','The Trustee'],
      ['Al-Qawiyy','\u0627\u0644\u0642\u064E\u0648\u0650\u064A\u0651','The Most Strong'],['Al-Matin','\u0627\u0644\u0645\u064E\u062A\u0650\u064A\u0646','The Firm One'],
      ['Al-Waliyy','\u0627\u0644\u0648\u064E\u0644\u0650\u064A\u0651','The Protecting Friend'],['Al-Hamid','\u0627\u0644\u062D\u064E\u0645\u0650\u064A\u062F','The Praiseworthy'],
      ['Al-Muhsi','\u0627\u0644\u0645\u064F\u062D\u0652\u0635\u0650\u064A','The Counter'],['Al-Mubdi','\u0627\u0644\u0645\u064F\u0628\u0652\u062F\u0650\u0626','The Originator'],
      ['Al-Mu\'id','\u0627\u0644\u0645\u064F\u0639\u0650\u064A\u062F','The Restorer'],['Al-Muhyi','\u0627\u0644\u0645\u064F\u062D\u0652\u064A\u0650\u064A','The Giver of Life'],
      ['Al-Mumit','\u0627\u0644\u0645\u064F\u0645\u0650\u064A\u062A','The Bringer of Death'],['Al-Hayy','\u0627\u0644\u062D\u064E\u064A\u0651','The Ever-Living'],
      ['Al-Qayyum','\u0627\u0644\u0642\u064E\u064A\u0651\u064F\u0648\u0645','The Self-Subsisting'],['Al-Wajid','\u0627\u0644\u0648\u064E\u0627\u062C\u0650\u062F','The Finder'],
      ['Al-Majid','\u0627\u0644\u0645\u064E\u0627\u062C\u0650\u062F','The Noble'],['Al-Wahid','\u0627\u0644\u0648\u064E\u0627\u062D\u0650\u062F','The One'],
      ['As-Samad','\u0627\u0644\u0635\u064E\u0645\u064E\u062F','The Eternal'],['Al-Qadir','\u0627\u0644\u0642\u064E\u0627\u062F\u0650\u0631','The Able'],
      ['Al-Muqtadir','\u0627\u0644\u0645\u064F\u0642\u0652\u062A\u064E\u062F\u0650\u0631','The Powerful'],['Al-Muqaddim','\u0627\u0644\u0645\u064F\u0642\u064E\u062F\u0651\u0650\u0645','The Expediter'],
      ['Al-Mu\'akhkhir','\u0627\u0644\u0645\u064F\u0624\u064E\u062E\u0651\u0650\u0631','The Delayer'],['Al-Awwal','\u0627\u0644\u0623\u064E\u0648\u064E\u0651\u0644','The First'],
      ['Al-Akhir','\u0627\u0644\u0622\u062E\u0650\u0631','The Last'],['Az-Zahir','\u0627\u0644\u0638\u064E\u0651\u0627\u0647\u0650\u0631','The Manifest'],
      ['Al-Batin','\u0627\u0644\u0628\u064E\u0627\u0637\u0650\u0646','The Hidden'],['Al-Wali','\u0627\u0644\u0648\u064E\u0627\u0644\u0650\u064A','The Governor'],
      ['Al-Muta\'ali','\u0627\u0644\u0645\u064F\u062A\u064E\u0639\u064E\u0627\u0644\u0650\u064A','The Most Exalted'],['Al-Barr','\u0627\u0644\u0628\u064E\u0631\u0651','The Source of Goodness'],
      ['At-Tawwab','\u0627\u0644\u062A\u064E\u0648\u0651\u064E\u0627\u0628','The Acceptor of Repentance'],['Al-Muntaqim','\u0627\u0644\u0645\u064F\u0646\u0652\u062A\u064E\u0642\u0650\u0645','The Avenger'],
      ['Al-Afuww','\u0627\u0644\u0639\u064E\u0641\u064F\u0648\u0651','The Pardoner'],['Ar-Ra\'uf','\u0627\u0644\u0631\u064E\u0651\u0624\u064F\u0648\u0641','The Most Kind'],
      ['Malik al-Mulk','\u0645\u064E\u0627\u0644\u0650\u0643 \u0627\u0644\u0645\u064F\u0644\u0652\u0643','Owner of Sovereignty'],['Dhul-Jalali wal-Ikram','\u0630\u064F\u0648 \u0627\u0644\u062C\u064E\u0644\u0627\u0644\u0650 \u0648\u0627\u0644\u0625\u0643\u0652\u0631\u0627\u0645','Lord of Majesty and Generosity'],
      ['Al-Muqsit','\u0627\u0644\u0645\u064F\u0642\u0652\u0633\u0650\u0637','The Equitable'],['Al-Jami','\u0627\u0644\u062C\u064E\u0627\u0645\u0650\u0639','The Gatherer'],
      ['Al-Ghani','\u0627\u0644\u063A\u064E\u0646\u0650\u064A\u0651','The Self-Sufficient'],['Al-Mughni','\u0627\u0644\u0645\u064F\u063A\u0652\u0646\u0650\u064A','The Enricher'],
      ['Al-Mani','\u0627\u0644\u0645\u064E\u0627\u0646\u0650\u0639','The Preventer'],['Ad-Darr','\u0627\u0644\u0636\u064E\u0627\u0631\u0651','The Distresser'],
      ['An-Nafi','\u0627\u0644\u0646\u064E\u0651\u0627\u0641\u0650\u0639','The Benefactor'],['An-Nur','\u0627\u0644\u0646\u064F\u0651\u0648\u0631','The Light'],
      ['Al-Hadi','\u0627\u0644\u0647\u064E\u0627\u062F\u0650\u064A','The Guide'],['Al-Badi','\u0627\u0644\u0628\u064E\u062F\u0650\u064A\u0639','The Originator'],
      ['Al-Baqi','\u0627\u0644\u0628\u064E\u0627\u0642\u0650\u064A','The Everlasting'],['Al-Warith','\u0627\u0644\u0648\u064E\u0627\u0631\u0650\u062B','The Inheritor'],
      ['Ar-Rashid','\u0627\u0644\u0631\u064E\u0651\u0634\u0650\u064A\u062F','The Guide to the Right Path'],['As-Sabur','\u0627\u0644\u0635\u064E\u0628\u064F\u0648\u0631','The Most Patient']
    ];
    var todayIdx = dayOfYear % 99;
    var todayName = names99[todayIdx];

    html += '<div class="ummah-section-title" style="margin-top:20px">\u2728 99 Names of Allah (' + (todayIdx + 1) + '/99)</div>';
    html += '<div class="ummah-name-card">' +
      '<div class="ummah-name-number">' + (todayIdx + 1) + '</div>' +
      '<div style="font-family:\'Amiri\',serif;font-size:40px;color:var(--gold-light);margin:10px 0;text-shadow:0 0 20px rgba(212,168,67,0.3)">' + todayName[1] + '</div>' +
      '<div style="font-size:20px;font-weight:700;color:var(--text-primary)">' + todayName[0] + '</div>' +
      '<div style="font-size:14px;color:var(--text-sec);margin-top:4px">' + todayName[2] + '</div>' +
    '</div>';

    // Mini grid of surrounding names
    html += '<div class="ummah-names-grid">';
    for (var i = -3; i <= 3; i++) {
      var idx = ((todayIdx + i) % 99 + 99) % 99;
      var n = names99[idx];
      var isCurrent = i === 0;
      html += '<div class="ummah-names-mini' + (isCurrent ? ' current' : '') + '">' +
        '<div style="font-family:\'Amiri\',serif;font-size:' + (isCurrent ? '18' : '14') + 'px;color:' + (isCurrent ? 'var(--gold-light)' : 'var(--text-sec)') + '">' + n[1] + '</div>' +
        '<div style="font-size:9px;color:var(--text-muted)">' + n[0] + '</div>' +
      '</div>';
    }
    html += '</div>';

    content.innerHTML = html;
  },

  // ==== AZAN PLAYER SCREEN ====
  azanSelectedVoice: null,

  renderAzan() {
    const el = document.getElementById('screen-azan');
    const lib = API.azanLibrary;
    const settings = Store.getAzanSettings();
    const isPlaying = API.isAzanPlaying();
    const currentVoice = this.azanSelectedVoice || settings.voice || 'makkah';
    const currentAzan = API.getAzanById(currentVoice);

    // Mosque silhouette SVG for the player
    const mosqueSVG = `<svg viewBox="0 0 300 100" style="width:100%;height:80px;margin-bottom:8px" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="azanMosque" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(212,168,67,0.15)"/><stop offset="1" stop-color="rgba(212,168,67,0)"/></linearGradient></defs>
      <path d="M0 100 L0 70 Q0 60 10 60 L30 60 L30 40 Q40 20 50 10 Q52 5 55 10 Q65 20 75 40 L75 60 L100 60 L100 40 Q120 10 140 40 L140 60 L150 60 L150 30 Q150 10 160 5 Q162 0 165 5 Q175 10 175 30 L175 60 L190 60 L190 40 Q210 10 230 40 L230 60 L255 60 L255 40 Q265 20 275 10 Q277 5 280 10 Q290 20 300 40 L300 60 Q300 60 300 60 L300 100 Z" fill="url(#azanMosque)"/>
      <circle cx="55" cy="6" r="3" fill="rgba(212,168,67,0.4)"/>
      <circle cx="165" cy="2" r="4" fill="rgba(212,168,67,0.5)"/>
      <circle cx="280" cy="6" r="3" fill="rgba(212,168,67,0.4)"/>
    </svg>`;

    // Audio wave animation bars
    const waveBars = Array.from({length: 12}, (_, i) =>
      `<div style="width:3px;height:${8 + Math.random()*20}px;background:${isPlaying ? 'var(--gold-light)' : 'var(--text-muted)'};border-radius:2px;transition:height 0.3s;animation:${isPlaying ? `azanWave 0.8s ease-in-out ${i*0.1}s infinite alternate` : 'none'}"></div>`
    ).join('');

    // Muezzin icon helper
    const muezzinIcon = (id) => {
      if (id === 'makkah') return '🕋';
      if (id === 'madinah' || id === 'madinah1952') return '🌟';
      if (id === 'mishary' || id === 'alafasy' || id === 'fajr') return '🎤';
      if (id === 'egyptian' || id === 'abdulbaset') return '🇪🇬';
      if (id === 'qatami' || id === 'tareq') return '🇸🇦';
      if (id === 'halab') return '🇸🇾';
      if (id === 'kurtish') return '🏔️';
      return '🕌';
    };

    el.innerHTML = `
      ${this._screenHeader('🕌', 'Azan Player', 'الأذان', '12 beautiful Azan recordings from around the world')}

      <!-- Main Player Card -->
      <div style="background:linear-gradient(135deg,rgba(13,124,102,0.2),rgba(17,29,51,0.9));border:2px solid rgba(212,168,67,0.2);border-radius:20px;padding:24px;margin-bottom:16px;text-align:center;position:relative;overflow:hidden">
        ${mosqueSVG}
        <div style="font-family:'Amiri',serif;font-size:32px;color:var(--gold-light);margin-bottom:4px;text-shadow:0 0 20px rgba(212,168,67,0.3)">
          اللَّهُ أَكْبَرُ
        </div>
        <div style="font-size:13px;color:var(--text-sec);margin-bottom:16px">Allahu Akbar — God is the Greatest</div>

        <!-- Now Playing Info -->
        <div style="font-size:16px;font-weight:700;margin-bottom:4px">${currentAzan.name}</div>
        <div style="font-size:12px;color:var(--text-sec);margin-bottom:4px">${currentAzan.muezzin}</div>
        <div style="font-size:11px;color:var(--gold);margin-bottom:16px">${currentAzan.origin} · ${currentAzan.style}</div>

        <!-- Wave Visualizer -->
        <div style="display:flex;align-items:center;justify-content:center;gap:4px;height:32px;margin-bottom:16px">
          ${waveBars}
        </div>

        <!-- Play/Stop Button -->
        <div style="display:flex;justify-content:center;gap:12px;margin-bottom:12px">
          <button onclick="Screens.playAzanFromScreen()" style="width:64px;height:64px;border-radius:50%;border:3px solid ${isPlaying ? 'var(--red)' : 'var(--gold-light)'};background:${isPlaying ? 'rgba(231,76,60,0.15)' : 'rgba(212,168,67,0.15)'};color:${isPlaying ? 'var(--red)' : 'var(--gold-light)'};font-size:24px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;box-shadow:0 0 20px ${isPlaying ? 'rgba(231,76,60,0.2)' : 'rgba(212,168,67,0.2)'}">
            ${isPlaying ? '⏹️' : '▶️'}
          </button>
        </div>
        <div style="font-size:11px;color:var(--text-muted)">${isPlaying ? 'Now playing — tap to stop' : 'Tap to play Azan'}</div>
      </div>

      <!-- Volume Control -->
      <div class="card" style="margin-bottom:16px">
        <div style="display:flex;align-items:center;gap:12px">
          <span style="font-size:16px">🔇</span>
          <input type="range" min="0" max="100" value="${settings.volume}" style="flex:1;accent-color:var(--gold)" oninput="Store.setAzanSetting('volume',parseInt(this.value));document.getElementById('azan-vol-label').textContent=this.value+'%'" onchange="Store.setAzanSetting('volume',parseInt(this.value))">
          <span style="font-size:16px">🔊</span>
          <span id="azan-vol-label" style="font-size:12px;color:var(--text-sec);min-width:35px">${settings.volume}%</span>
        </div>
      </div>

      <!-- Muezzin Selection Grid -->
      <div class="section-title">✦ Choose Muezzin</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
        ${lib.map(a => `
          <div onclick="Screens.selectAzanVoice('${a.id}')" style="background:${currentVoice === a.id ? 'linear-gradient(135deg,rgba(212,168,67,0.15),rgba(13,124,102,0.15))' : 'rgba(17,29,51,0.6)'};border:2px solid ${currentVoice === a.id ? 'var(--gold-light)' : 'rgba(212,168,67,0.15)'};border-radius:14px;padding:14px 12px;cursor:pointer;transition:all 0.2s;position:relative;overflow:hidden">
            ${currentVoice === a.id ? '<div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--gold-light),transparent)"></div>' : ''}
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
              <span style="font-size:22px">${muezzinIcon(a.id)}</span>
              <div style="flex:1">
                <div style="font-weight:700;font-size:13px;color:${currentVoice === a.id ? 'var(--gold-light)' : 'var(--text)'}">${a.name}</div>
                <div style="font-size:11px;color:var(--text-sec)">${a.muezzin}</div>
              </div>
              ${currentVoice === a.id ? '<div style="color:var(--gold-light);font-weight:700">✓</div>' : ''}
            </div>
            <div style="font-size:10px;color:var(--text-muted)">${a.origin} · ${a.style}</div>
          </div>
        `).join('')}
      </div>

      <!-- Azan Auto-Play Settings -->
      <div class="section-title">✦ Auto Azan Settings</div>
      <div class="card" style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <span style="font-weight:600">🔔 Auto Azan at Prayer Times</span>
          <div class="toggle ${settings.enabled ? 'on' : ''}" onclick="Store.setAzanSetting('enabled',!Store.getAzanSettings().enabled);Screens.renderAzan()">
            <div class="toggle-knob"></div>
          </div>
        </div>
        <div style="font-size:11px;color:var(--text-sec)">When enabled, Azan will play automatically at each prayer time</div>
      </div>

      ${settings.enabled ? `
      <div class="card" style="margin-bottom:12px">
        <div style="font-weight:600;margin-bottom:12px;color:var(--gold-light)">Per-Prayer Toggle</div>
        ${['fajr','dhuhr','asr','maghrib','isha'].map(p => {
          const icons = {fajr:'🌙',dhuhr:'☀️',asr:'🌤️',maghrib:'🌅',isha:'🌛'};
          const names = {fajr:'Fajr',dhuhr:'Dhuhr',asr:'Asr',maghrib:'Maghrib',isha:'Isha'};
          return `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;${p !== 'isha' ? 'border-bottom:1px solid rgba(212,168,67,0.1)' : ''}">
            <span>${icons[p]} ${names[p]}</span>
            <div class="toggle ${settings.prayers[p] ? 'on' : ''}" onclick="Store.setSetting('azan${names[p]}',!Store.getSetting('azan${names[p]}',true));Screens.renderAzan()">
              <div class="toggle-knob"></div>
            </div>
          </div>`;
        }).join('')}
      </div>

      <div class="card" style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <span>📱 Browser Notifications</span>
          <div class="toggle ${settings.notifications ? 'on' : ''}" onclick="Store.setAzanSetting('notify',!Store.getAzanSettings().notifications);if(!Store.getAzanSettings().notifications)Notification.requestPermission();Screens.renderAzan()">
            <div class="toggle-knob"></div>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <span>📺 Full-Screen Azan Display</span>
          <div class="toggle ${settings.fullScreen ? 'on' : ''}" onclick="Store.setAzanSetting('fullScreen',!Store.getAzanSettings().fullScreen);Screens.renderAzan()">
            <div class="toggle-knob"></div>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span>📳 Vibration</span>
          <div class="toggle ${settings.vibrate ? 'on' : ''}" onclick="Store.setAzanSetting('vibrate',!Store.getAzanSettings().vibrate);Screens.renderAzan()">
            <div class="toggle-knob"></div>
          </div>
        </div>
      </div>
      ` : ''}

      <!-- Test Button -->
      <button onclick="App.triggerAzan({key:'test',name:'Test',time:new Date().getHours()+':'+String(new Date().getMinutes()).padStart(2,'0'),icon:'🕌'},Store.getAzanSettings())" style="width:100%;padding:14px;border-radius:14px;border:2px solid var(--gold);background:rgba(212,168,67,0.1);color:var(--gold-light);font-weight:700;font-size:14px;cursor:pointer;margin-bottom:20px;transition:all 0.2s">
        🕌 Test Full Azan Experience
      </button>

      <div style="text-align:center;padding:8px;font-size:11px;color:var(--text-muted)">
        Audio sourced from Internet Archive · Free for personal use
      </div>
    `;

    // Add CSS animation for wave bars
    if (!document.getElementById('azan-wave-css')) {
      const style = document.createElement('style');
      style.id = 'azan-wave-css';
      style.textContent = '@keyframes azanWave { 0% { height: 6px; } 100% { height: 28px; } }';
      document.head.appendChild(style);
    }
  },

  selectAzanVoice(voiceId) {
    this.azanSelectedVoice = voiceId;
    Store.setAzanSetting('voice', voiceId);
    // If currently playing, stop and replay with new voice
    if (API.isAzanPlaying()) {
      API.stopAzan();
      setTimeout(() => this.playAzanFromScreen(), 200);
    }
    this.renderAzan();
  },

  playAzanFromScreen() {
    if (API.isAzanPlaying()) {
      API.stopAzan();
      this.renderAzan();
      return;
    }
    const settings = Store.getAzanSettings();
    const voiceId = this.azanSelectedVoice || settings.voice || 'makkah';
    const vol = settings.volume / 100;
    API.playAzan(voiceId, vol).then(() => {
      this.renderAzan();
      // Re-render when azan ends to update UI
      window.addEventListener('azanEnded', () => {
        this.renderAzan();
      }, { once: true });
    });
    // Update UI immediately to show playing state
    setTimeout(() => this.renderAzan(), 100);
  },

  // ==== AZAN SETTINGS PANEL (for Profile screen) ====
  renderAzanSettings() {
    const s = Store.getAzanSettings();
    const lib = API.azanLibrary;
    const currentAzan = API.getAzanById(s.voice);
    const isPlaying = API.isAzanPlaying();

    return `
      <div class="azan-settings-panel">
        <!-- Master Azan Toggle -->
        <div class="setting-item">
          <span class="setting-label">🔔 Azan Enabled</span>
          <div class="toggle ${s.enabled ? 'on' : ''}" onclick="Store.setAzanSetting('enabled',!Store.getAzanSettings().enabled);Screens.renderProfile()">
            <div class="toggle-knob"></div>
          </div>
        </div>

        <!-- Muezzin Voice Selection -->
        <div class="azan-voice-section">
          <div class="azan-section-title">Muezzin Voice</div>
          <div class="azan-voice-grid">
            ${lib.map(a => `
              <div class="azan-voice-card ${s.voice === a.id ? 'selected' : ''}" style="border:2px solid ${s.voice === a.id ? 'var(--gold-light)' : 'rgba(212,168,67,0.2)'};border-radius:12px;padding:12px;cursor:pointer;text-align:center;background:${s.voice === a.id ? 'rgba(212,168,67,0.1)' : 'transparent'}" onclick="Store.setAzanSetting('voice','${a.id}');Screens.renderProfile()">
                <div class="azan-voice-icon" style="font-size:24px;margin-bottom:6px">${a.id === 'makkah' ? '🕋' : a.id === 'madinah' || a.id === 'madinah1952' ? '🌟' : a.id === 'mishary' || a.id === 'alafasy' || a.id === 'fajr' ? '🎤' : a.id === 'egyptian' || a.id === 'abdulbaset' ? '🇪🇬' : a.id === 'qatami' || a.id === 'tareq' ? '🇸🇦' : a.id === 'halab' ? '🇸🇾' : a.id === 'kurtish' ? '🏔️' : '🕌'}</div>
                <div class="azan-voice-name" style="font-weight:600;font-size:12px">${a.name}</div>
                <div class="azan-voice-origin" style="font-size:10px;color:var(--text-sec)">${a.origin}</div>
                ${s.voice === a.id ? '<div class="azan-voice-check" style="margin-top:6px;color:var(--gold-light)">✓</div>' : ''}
              </div>
            `).join('')}
          </div>
          <!-- Preview Button -->
          <div class="azan-preview-row" style="margin-top:12px">
            <button class="azan-preview-btn ${isPlaying ? 'playing' : ''}" style="width:100%;background:var(--primary-dark);color:var(--gold-light);border:1px solid var(--gold-light);border-radius:8px;padding:10px;font-weight:600" onclick="${isPlaying ? 'API.stopAzan();Screens.renderProfile()' : `App.testAzan('${s.voice}');setTimeout(()=>Screens.renderProfile(),300)`}">
              ${isPlaying ? '⏹ Stop Preview' : `▶ Preview: ${currentAzan.name}`}
            </button>
          </div>
        </div>

        <!-- Volume Control -->
        <div class="azan-volume-section" style="margin-top:16px">
          <div class="azan-section-title">🔊 Volume: ${s.volume}%</div>
          <div class="azan-volume-row" style="display:flex;align-items:center;gap:8px;margin-top:8px">
            <span style="font-size:12px">🔇</span>
            <input type="range" class="azan-volume-slider" min="0" max="100" value="${s.volume}"
              oninput="Store.setAzanSetting('volume',parseInt(this.value));document.querySelector('.azan-vol-pct').textContent=this.value+'%'"
              onchange="Store.setAzanSetting('volume',parseInt(this.value))" style="flex:1">
            <span style="font-size:12px">🔊</span>
            <span class="azan-vol-pct" style="font-weight:600;width:40px">${s.volume}%</span>
          </div>
        </div>

        <!-- Per-Prayer Azan Toggles -->
        <div class="azan-prayer-toggles" style="margin-top:16px">
          <div class="azan-section-title">Per-Prayer Azan</div>
          ${['fajr','dhuhr','asr','maghrib','isha'].map(p => {
            const icons = {fajr:'🌙',dhuhr:'☀️',asr:'🌤️',maghrib:'🌅',isha:'🌛'};
            const names = {fajr:'Fajr',dhuhr:'Dhuhr',asr:'Asr',maghrib:'Maghrib',isha:'Isha'};
            return `
            <div class="azan-prayer-row" style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(212,168,67,0.1)">
              <div style="display:flex;align-items:center;gap:8px">
                <span style="font-size:18px">${icons[p]}</span>
                <span style="font-weight:600">${names[p]}</span>
              </div>
              <div class="toggle ${s.prayers[p] ? 'on' : ''}" style="cursor:pointer" onclick="Store.setSetting('azan${names[p]}',!Store.getSetting('azan${names[p]}',true));Screens.renderProfile()">
                <div class="toggle-knob"></div>
              </div>
            </div>`;
          }).join('')}
        </div>

        <!-- Fajr Special Voice -->
        <div class="azan-fajr-special" style="margin-top:16px;padding-top:16px;border-top:1px solid rgba(212,168,67,0.15)">
          <div class="setting-item">
            <span class="setting-label">🌙 Special Fajr Voice</span>
            <div class="toggle ${s.fajrSpecial ? 'on' : ''}" onclick="Store.setAzanSetting('fajrSpecial',!Store.getAzanSettings().fajrSpecial);Screens.renderProfile()">
              <div class="toggle-knob"></div>
            </div>
          </div>
          ${s.fajrSpecial ? `
            <select class="quran-select" style="width:100%;margin-top:8px;border:1px solid rgba(212,168,67,0.3);border-radius:8px;padding:8px" onchange="Store.setAzanSetting('fajrVoice',this.value)">
              ${lib.map(a => `<option value="${a.id}" ${s.fajrVoice === a.id ? 'selected' : ''}>${a.name} - ${a.muezzin}</option>`).join('')}
            </select>
          ` : ''}
        </div>

        <!-- Pre-Azan Alert -->
        <div class="azan-prealert-section" style="margin-top:16px;padding-top:16px;border-top:1px solid rgba(212,168,67,0.15)">
          <div class="azan-section-title">⏰ Pre-Azan Alert</div>
          <div class="azan-prealert-options" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">
            ${[0, 5, 10, 15, 30].map(m => `
              <button class="azan-prealert-btn ${s.preAlert === m ? 'active' : ''}"
                style="flex:1;min-width:60px;padding:8px;border-radius:20px;border:2px solid ${s.preAlert === m ? 'var(--gold-light)' : 'rgba(212,168,67,0.3)'};background:${s.preAlert === m ? 'rgba(212,168,67,0.15)' : 'transparent'};color:${s.preAlert === m ? 'var(--gold-light)' : 'var(--text-sec)'};font-weight:600;cursor:pointer"
                onclick="Store.setAzanSetting('preAlert',${m});Screens.renderProfile()">
                ${m === 0 ? 'Off' : m + 'm'}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Notification & Display Settings -->
        <div class="azan-notif-section" style="margin-top:16px;padding-top:16px;border-top:1px solid rgba(212,168,67,0.15)">
          <div class="azan-section-title">Notification & Display</div>
          <div class="setting-item" style="padding:8px 0">
            <span class="setting-label">🔔 Browser Notifications</span>
            <div class="toggle ${s.notifications ? 'on' : ''}" onclick="Store.setAzanSetting('notify',!Store.getAzanSettings().notifications);if(!Store.getAzanSettings().notifications)Notification.requestPermission();Screens.renderProfile()">
              <div class="toggle-knob"></div>
            </div>
          </div>
          <div class="setting-item" style="padding:8px 0">
            <span class="setting-label">📱 Full-Screen Azan</span>
            <div class="toggle ${s.fullScreen ? 'on' : ''}" onclick="Store.setAzanSetting('fullScreen',!Store.getAzanSettings().fullScreen);Screens.renderProfile()">
              <div class="toggle-knob"></div>
            </div>
          </div>
          <div class="setting-item" style="padding:8px 0">
            <span class="setting-label">📳 Vibration</span>
            <div class="toggle ${s.vibrate ? 'on' : ''}" onclick="Store.setAzanSetting('vibrate',!Store.getAzanSettings().vibrate);Screens.renderProfile()">
              <div class="toggle-knob"></div>
            </div>
          </div>
        </div>

        <!-- Test Azan Button -->
        <button class="azan-test-btn" style="width:100%;margin-top:20px;background:linear-gradient(135deg,var(--gold-light),rgba(212,168,67,0.7));color:var(--dark);border:none;border-radius:8px;padding:12px;font-weight:700;font-size:14px;cursor:pointer" onclick="App.triggerAzan({key:'test',name:'Test',time:new Date().getHours()+':'+String(new Date().getMinutes()).padStart(2,'0'),icon:'🕌'},Store.getAzanSettings())">
          🕌 Test Full Azan Experience
        </button>
      </div>
    `;
  },

  // ==== PROFILE SCREEN ====
  renderProfile() {
    const el = document.getElementById('screen-profile');
    const stats = Store.getStats();
    const achievements = Store.getAchievements();
    const t = (k) => I18n.t(k);
    const curLang = I18n.getCurrentLanguage();
    const achievementList = [
      { id: 'first_prayer', icon: '🧎', name: t('achFirstPrayer'), desc: t('achFirstPrayerDesc') },
      { id: 'week_streak', icon: '🔥', name: t('ach7DayStreak'), desc: t('ach7DayStreakDesc') },
      { id: 'quran_reader', icon: '📖', name: t('achQuranReader'), desc: t('achQuranReaderDesc') },
      { id: 'tasbih_100', icon: '📿', name: t('achDhikrDevotee'), desc: t('achDhikrDevoteeDesc') },
      { id: 'tasbih_1000', icon: '✨', name: t('achDhikrMaster'), desc: t('achDhikrMasterDesc') },
      { id: 'zakat_calc', icon: '💰', name: t('achZakat'), desc: t('achZakatDesc') },
      { id: 'scholar_chat', icon: '🧑‍🎓', name: t('achKnowledge'), desc: t('achKnowledgeDesc') }
    ];

    // Build language selector grid
    const langGroups = I18n.getLanguageGroups();
    let langSelectorHTML = '';
    for (const [groupName, codes] of Object.entries(langGroups)) {
      const langs = codes.map(c => I18n.supportedLanguages.find(l => l.code === c)).filter(Boolean);
      langSelectorHTML += `<div style="font-size:11px;color:var(--gold-light);font-weight:600;margin:12px 0 6px;opacity:0.8">${groupName}</div>`;
      langSelectorHTML += `<div style="display:flex;flex-wrap:wrap;gap:6px">`;
      langSelectorHTML += langs.map(l => `
        <button onclick="I18n.setLanguage('${l.code}')" style="
          padding:6px 10px;border-radius:8px;font-size:12px;cursor:pointer;
          border:1px solid ${I18n.currentLang === l.code ? 'var(--gold-light)' : 'rgba(212,168,67,0.2)'};
          background:${I18n.currentLang === l.code ? 'rgba(212,168,67,0.2)' : 'transparent'};
          color:${I18n.currentLang === l.code ? 'var(--gold-light)' : 'var(--text-sec)'};
          font-weight:${I18n.currentLang === l.code ? '700' : '400'};
          transition:all 0.2s">${l.flag} ${l.native}</button>
      `).join('');
      langSelectorHTML += `</div>`;
    }

    el.innerHTML = `
      ${this._screenHeader('👤', t('profile'), 'الملف الشخصي')}
      <div class="profile-card" style="background:linear-gradient(135deg,rgba(212,168,67,0.15),rgba(212,168,67,0.05));border:2px solid var(--gold-light);border-radius:16px;padding:20px;text-align:center;margin-bottom:20px">
        <div class="profile-avatar" style="background:linear-gradient(135deg,var(--gold-light),rgba(212,168,67,0.5));border-radius:50%;width:60px;height:60px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:24px;color:var(--dark);margin:0 auto 12px">A</div>
        <div class="profile-name" style="font-size:18px;font-weight:700;margin-bottom:4px">Allen</div>
        <div class="profile-level" style="font-size:14px;color:var(--gold-light);font-weight:600">${t('level')} ${stats.level} · ${stats.xp} XP</div>
        <div class="xp-bar-wrap" style="margin-top:12px">
          <div class="xp-bar-bg"><div class="xp-bar-fill" style="width:${(stats.xp % 500) / 5}%;background:linear-gradient(90deg,var(--gold-light),rgba(212,168,67,0.7))"></div></div>
          <div class="xp-text" style="font-size:10px;color:var(--text-sec);margin-top:4px">${500 - (stats.xp % 500)} ${t('xpToNext')}</div>
        </div>
      </div>

      <div class="stats-grid">
        <div class="card stat-card" style="background:linear-gradient(135deg,rgba(212,168,67,0.1),transparent);border:1px solid rgba(212,168,67,0.3);border-radius:12px;text-align:center;padding:16px">
          <div class="stat-num" style="font-size:24px;font-weight:700;color:var(--gold-light)">${stats.streak}</div>
          <div class="stat-label" style="font-size:12px;color:var(--text-sec);margin-top:4px">${t('dayStreak')}</div>
        </div>
        <div class="card stat-card" style="background:linear-gradient(135deg,rgba(52,152,219,0.1),transparent);border:1px solid rgba(52,152,219,0.3);border-radius:12px;text-align:center;padding:16px">
          <div class="stat-num" style="font-size:24px;font-weight:700;color:var(--blue)">${stats.totalPrayers}</div>
          <div class="stat-label" style="font-size:12px;color:var(--text-sec);margin-top:4px">${t('prayersLogged')}</div>
        </div>
        <div class="card stat-card" style="background:linear-gradient(135deg,rgba(46,204,113,0.1),transparent);border:1px solid rgba(46,204,113,0.3);border-radius:12px;text-align:center;padding:16px">
          <div class="stat-num" style="font-size:24px;font-weight:700;color:var(--green)">${stats.tasbihTotal}</div>
          <div class="stat-label" style="font-size:12px;color:var(--text-sec);margin-top:4px">${t('tasbih')}</div>
        </div>
      </div>

      <div class="section-title">${t('achievements')}</div>
      ${achievementList.map(a => `
        <div class="achievement-item" style="display:flex;align-items:center;gap:12px;padding:12px;margin-bottom:8px;background:${achievements[a.id] ? 'rgba(212,168,67,0.1)' : 'rgba(255,255,255,0.02)'};border-radius:12px;border:1px solid ${achievements[a.id] ? 'rgba(212,168,67,0.3)' : 'rgba(212,168,67,0.1)'}">
          <div class="achievement-icon" style="width:40px;height:40px;border-radius:50%;background:${achievements[a.id] ? 'rgba(212,168,67,0.3)' : 'rgba(255,255,255,0.05)'};display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;border:2px solid ${achievements[a.id] ? 'var(--gold-light)' : 'rgba(212,168,67,0.2)'}">${a.icon}</div>
          <div class="achievement-info" style="flex:1">
            <div class="achievement-name" style="font-weight:600;${!achievements[a.id] ? 'opacity:.5' : 'color:var(--gold-light)'}">${a.name}</div>
            <div class="achievement-desc" style="font-size:11px;color:var(--text-sec)">${achievements[a.id] ? t('unlocked') : a.desc}</div>
          </div>
        </div>
      `).join('')}

      <div class="section-title mt-16">🌍 ${t('language')}</div>
      <div class="card" style="border:1px solid rgba(212,168,67,0.3);border-radius:12px;padding:16px;margin-bottom:16px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
          <span style="font-size:24px">${curLang.flag}</span>
          <div>
            <div style="font-weight:700;color:var(--gold-light)">${curLang.native}</div>
            <div style="font-size:11px;color:var(--text-sec)">${curLang.name} · ${I18n.supportedLanguages.length} languages available</div>
          </div>
        </div>
        ${langSelectorHTML}
      </div>

      <div class="section-title mt-16">🕌 ${t('azanSettings')}</div>
      ${Screens.renderAzanSettings()}

      <div class="section-title mt-16">${t('settings')}</div>
      <div class="setting-item">
        <span class="setting-label">${t('darkMode')}</span>
        <div class="toggle on"><div class="toggle-knob"></div></div>
      </div>

      <div class="card mt-16 text-center" style="border:1px solid var(--gold-light);background:rgba(212,168,67,0.05)">
        <div style="font-size:12px;color:var(--gold-light);font-weight:600">🔒 ${t('privacyFirst')}</div>
        <div class="text-xs text-sec mt-8">${t('privacyDesc')}</div>
      </div>

      <div class="text-center mt-16 mb-16">
        <div class="text-xs text-sec">DeenHub v3.0.0</div>
        <div class="text-xs text-sec">${t('builtWithLove')}</div>
      </div>
    `;
  }
};
