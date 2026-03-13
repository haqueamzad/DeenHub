/* ============================================================
   DeenHub PWA — Screen Renderers
   ============================================================ */

const Screens = {
  currentScreen: 'home',
  prayerTimes: null,
  location: null,

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
        <button class="quran-toggle ${this.quranRepeatAyah ? 'active' : ''}" onclick="Screens.quranRepeatAyah=!Screens.quranRepeatAyah;Screens.renderQuran()">Repeat</button>
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
    if (this.quranPlayingAyah === ayahNum) {
      if (API.isPlaying()) {
        API.pauseAyah();
        this.renderQuranReader(document.getElementById('screen-quran'));
      } else {
        API.resumeAyah();
        this.renderQuranReader(document.getElementById('screen-quran'));
      }
    } else {
      this.quranPlayingAyah = ayahNum;
      const ayah = this.quranAyahs.find(a => a.number === ayahNum);
      if (ayah) {
        API.playAudio(ayah.audio, this.quranAudioSpeed, () => {
          this.quranPlayingAyah = null;
          if (this.quranRepeatAyah) {
            this.playAyah(ayahNum);
          } else {
            this.renderQuranReader(document.getElementById('screen-quran'));
          }
        });
        this.renderQuranReader(document.getElementById('screen-quran'));
      }
    }
  },

  pauseAyah() {
    API.pauseAyah();
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
    const bookmarks = Store.getBookmarks();
    const idx = bookmarks.indexOf(surahNum);
    if (idx >= 0) bookmarks.splice(idx, 1);
    else bookmarks.push(surahNum);
    Store.setBookmarks(bookmarks);
    this.renderQuranList(document.getElementById('screen-quran'));
    App.toast(idx >= 0 ? 'Removed from bookmarks' : 'Added to bookmarks');
  },

  copyAyah(surahNum, ayahNum) {
    const ayah = this.quranAyahs?.find(a => a.number === ayahNum);
    if (ayah) {
      const text = `${ayah.arabic}\n\n${ayah.translation}\n\n— Surah ${surahNum}:${ayahNum}`;
      navigator.clipboard.writeText(text).then(() => App.toast('Ayah copied to clipboard'));
    }
  },

  // ==== HADITH SCREEN ====
  hadithCollection: 'sahih_bukhari',
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
    const activeCol = collections.find(c => c.id === this.hadithCollection);

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
    { role: 'ai', text: "As-salamu alaykum! I'm your AI Islamic Scholar. Ask me anything about Islam — prayer, Quran, Hadith, fiqh, history, and more. All answers are sourced from authentic Islamic scholarship." }
  ],

  renderAI() {
    const el = document.getElementById('screen-ai');
    const scholarSVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:32px;height:32px">
      <circle cx="50" cy="30" r="15" fill="rgba(212,168,67,0.6)" stroke="rgba(212,168,67,0.8)" stroke-width="2"/>
      <path d="M50 48 L50 70 M50 55 L35 65 M50 55 L65 65" stroke="rgba(212,168,67,0.6)" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M30 20 Q50 10 70 20" stroke="rgba(212,168,67,0.4)" stroke-width="2" fill="none" stroke-linecap="round"/>
    </svg>`;

    el.innerHTML = `
      ${this._screenHeader('✨', 'Islamic Scholar', 'العالم الإسلامي')}
      <div class="chat-area" id="chat-messages">
        ${this.aiMessages.map(m => `
          <div class="chat-bubble ${m.role}" style="${m.role === 'ai' ? 'background:linear-gradient(135deg,rgba(212,168,67,0.1),rgba(212,168,67,0.05));border-left:3px solid var(--gold-light);border-radius:12px 12px 4px 12px' : 'background:rgba(52,152,219,0.2);border-radius:12px 4px 12px 12px'}">
            ${m.role === 'ai' ? '<div style="font-size:11px;color:var(--gold-light);font-weight:600;margin-bottom:4px;text-transform:uppercase">Islamic Scholar</div>' : ''}
            ${m.text}
          </div>
        `).join('')}
      </div>
      <div class="chat-input-wrap" style="border-top:1px solid rgba(212,168,67,0.15);padding-top:12px">
        <input class="chat-input" id="ai-input" type="text" placeholder="Ask about Islam..." style="border:1px solid var(--gold-light);border-radius:20px;padding:10px 16px" onkeydown="if(event.key==='Enter')Screens.sendAI()">
        <button class="chat-send" style="background:var(--primary-dark);color:var(--gold-light);border-radius:50%;width:40px;height:40px" onclick="Screens.sendAI()">⤴</button>
      </div>
    `;
    const msgs = document.getElementById('chat-messages');
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
  },

  sendAI() {
    const input = document.getElementById('ai-input');
    if (!input || !input.value.trim()) return;
    const q = input.value.trim();
    this.aiMessages.push({ role: 'user', text: q });
    const response = API.getAIResponse(q);
    this.aiMessages.push({ role: 'ai', text: response });
    Store.unlockAchievement('scholar_chat');
    this.renderAI();
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
          <button class="btn btn-outline" onclick="Screens.tasbihCount=0;Screens.renderTasbih()">Reset</button>
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

  incrementTasbih() {
    this.tasbihCount++;
    if (this.tasbihCount >= this.tasbihTarget) {
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

  async renderQibla() {
    const el = document.getElementById('screen-qibla');
    if (!this.location) this.location = await API.getLocation();
    this.qiblaAngle = API.calculateQibla(this.location.lat, this.location.lng);

    const compassSVG = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="width:160px;height:160px">
      <defs>
        <linearGradient id="compassGrad" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0" stop-color="rgba(212,168,67,0.2)"/>
          <stop offset="100" stop-color="rgba(212,168,67,0.05)"/>
        </linearGradient>
      </defs>
      <!-- Outer geometric ring -->
      <circle cx="100" cy="100" r="95" fill="none" stroke="var(--gold-light)" stroke-width="3" opacity="0.5"/>
      <!-- 8-point star -->
      <g stroke="rgba(212,168,67,0.3)" stroke-width="2" fill="none">
        ${Array.from({length:8}, (_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const x1 = 100 + 90 * Math.cos(angle);
          const y1 = 100 + 90 * Math.sin(angle);
          return `<line x1="100" y1="100" x2="${x1}" y2="${y1}"/>`;
        }).join('')}
      </g>
      <!-- Cardinal directions -->
      <text x="100" y="25" text-anchor="middle" font-size="14" fill="var(--gold-light)" font-weight="600">N</text>
      <text x="175" y="105" text-anchor="middle" font-size="14" fill="var(--text-sec)">E</text>
      <text x="100" y="185" text-anchor="middle" font-size="14" fill="var(--text-sec)">S</text>
      <text x="25" y="105" text-anchor="middle" font-size="14" fill="var(--text-sec)">W</text>
      <!-- Center circle -->
      <circle cx="100" cy="100" r="15" fill="rgba(212,168,67,0.2)" stroke="var(--gold-light)" stroke-width="2"/>
      <!-- Kaaba icon -->
      <text x="100" y="108" text-anchor="middle" font-size="18">🕋</text>
    </svg>`;

    const minaretSVG = `<svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg" style="width:40px;height:60px;opacity:0.6">
      <circle cx="50" cy="30" r="12" fill="rgba(212,168,67,0.7)"/>
      <rect x="45" y="40" width="10" height="70" fill="rgba(212,168,67,0.5)"/>
      <path d="M40 75 L50 70 L60 75" fill="rgba(212,168,67,0.4)"/>
    </svg>`;

    el.innerHTML = `
      ${this._screenHeader('🧭', 'Qibla Direction', 'اتجاه القبلة')}
      <div class="text-center mt-16">
        <div style="font-size:14px;color:var(--text-sec);margin-bottom:8px">Direction to Makkah</div>
        <div class="compass-degrees" style="font-size:32px;font-weight:700;color:var(--gold-light)">${Math.round(this.qiblaAngle)}°</div>
        <div class="compass-wrap" style="position:relative;margin:24px auto;width:200px;height:200px;display:flex;align-items:center;justify-content:center">
          <div style="position:absolute;left:-50px;top:50%;transform:translateY(-50%)">${minaretSVG}</div>
          <div style="position:absolute;right:-50px;top:50%;transform:translateY(-50%)">${minaretSVG}</div>
          <div style="position:relative;width:160px;height:160px">
            ${compassSVG}
            <div class="compass-needle" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(${this.qiblaAngle}deg);width:3px;height:70px;background:linear-gradient(180deg,var(--gold-light),rgba(212,168,67,0.3));border-radius:2px;box-shadow:0 0 12px rgba(212,168,67,0.6);transition:transform 0.3s"></div>
          </div>
        </div>
        <div class="compass-label" style="font-size:13px;color:var(--text-sec);margin-top:8px">Point your device north, then face the needle direction</div>
        <div class="card" style="border-left:4px solid var(--gold-light);margin-top:20px">
          <div class="text-sm text-sec">Your Location</div>
          <div style="font-weight:600;font-family:monospace">${this.location.lat.toFixed(4)}°N, ${Math.abs(this.location.lng).toFixed(4)}°${this.location.lng >= 0 ? 'E' : 'W'}</div>
        </div>
        <div class="card" style="border-left:4px solid var(--gold-light)">
          <div class="text-sm text-sec">Distance to Kaaba</div>
          <div style="font-weight:600;font-size:18px;color:var(--gold-light)">${this._distToKaaba(this.location.lat, this.location.lng)} km</div>
        </div>
      </div>
    `;
  },

  _distToKaaba(lat, lng) {
    const R = 6371;
    const dLat = (21.4225 - lat) * Math.PI / 180;
    const dLng = (39.8262 - lng) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat*Math.PI/180)*Math.cos(21.4225*Math.PI/180)*Math.sin(dLng/2)**2;
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

  // Build direct CDN audio URL for Quranic duas — NO API call, instant playback
  _getDuaAudioUrl(dua) {
    if (dua.audioUrl) return dua.audioUrl;
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
    return null;
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

    this._initDuaVoices();

    this.duaPlayingId = duaId;
    this.duaWordHighlightIdx = -1;
    this._duaWords = dua.arabic.split(/\s+/);

    // Get direct audio URL (instant — no API call)
    var audioUrl = this._getDuaAudioUrl(dua);

    // Calculate initial timing estimates
    var msPerWord = 480;
    this._duaEstDuration = Math.max(this._duaWords.length * msPerWord, 2500);
    this._duaStartTime = Date.now();

    // CRITICAL: Create Audio element IMMEDIATELY on user click (preserves user gesture for autoplay)
    if (audioUrl) {
      self._duaAudioPlayer = new Audio(audioUrl);
      self._duaAudioPlayer.volume = 0.8;

      self._duaAudioPlayer.addEventListener('loadedmetadata', function() {
        self._duaEstDuration = self._duaAudioPlayer.duration * 1000;
        self._duaStartTime = Date.now();
      });

      self._duaAudioPlayer.addEventListener('timeupdate', function() {
        if (!self.duaPlayingId || !self._duaAudioPlayer) return;
        var duration = self._duaAudioPlayer.duration || 1;
        var progress = self._duaAudioPlayer.currentTime / duration;
        var progressBar = document.getElementById('duaProgressBar');
        if (progressBar) progressBar.style.width = (progress * 100) + '%';
        // Word highlighting synced to audio progress
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
        self._duaAudioPlayer = null;
        self._startDuaTTS(dua, duaId);
      });

      // Play immediately — user gesture is still active
      self._duaAudioPlayer.play().then(function() {
        self._showDuaToast('🔊 ' + I18n.t('playingDua'));
      }).catch(function() {
        self._duaAudioPlayer = null;
        self._startDuaTTS(dua, duaId);
      });
    } else {
      // Non-Quranic dua — use TTS or reading mode
      if (!this._duaVoicesLoaded) {
        setTimeout(function() { self._startDuaTTS(dua, duaId); }, 300);
      } else {
        self._startDuaTTS(dua, duaId);
      }
    }

    this.renderDuas();

    setTimeout(function() {
      var card = document.querySelector('.dua-card-premium[data-dua-id="' + duaId + '"]');
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
  },

  // TTS-based dua playback with robust fallback to reading mode
  _startDuaTTS(dua, duaId) {
    var self = this;

    // Check if Arabic TTS is actually available before trying
    var hasArabicTTS = false;
    if ('speechSynthesis' in window) {
      var voices = speechSynthesis.getVoices();
      hasArabicTTS = voices.some(function(v) { return v.lang && v.lang.indexOf('ar') === 0; });
    }

    if ('speechSynthesis' in window && hasArabicTTS) {
      speechSynthesis.cancel();
      var utterance = new SpeechSynthesisUtterance(dua.arabic);
      utterance.lang = 'ar';
      utterance.rate = 0.75;
      utterance.pitch = 1;
      if (self._duaArabicVoice) utterance.voice = self._duaArabicVoice;
      self._duaUtterance = utterance;

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

      var ttsStarted = false;
      utterance.onstart = function() {
        ttsStarted = true;
        self._duaStartTime = Date.now();
        self._showDuaToast('🔊 ' + I18n.t('playingDua'));
      };

      utterance.onend = function() {
        Screens.onDuaAudioEnded();
      };

      utterance.onerror = function(e) {
        if (!ttsStarted && self.duaPlayingId === duaId) {
          self._startDuaReadingMode();
        } else {
          Screens.onDuaAudioEnded();
        }
      };

      speechSynthesis.speak(utterance);

      // Safety: if TTS doesn't start within 1.5s, fall back to reading mode
      setTimeout(function() {
        if (!ttsStarted && self.duaPlayingId === duaId) {
          speechSynthesis.cancel();
          self._startDuaReadingMode();
        }
      }, 1500);
    } else {
      // No Arabic TTS — go directly to reading mode (skip the 2s wait)
      self._startDuaReadingMode();
    }

    // Start the universal word highlighting timer
    self._duaTimer = setInterval(function() { Screens.onDuaTimeUpdate(); }, 50);
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
    if (this._duaTimer) { clearInterval(this._duaTimer); this._duaTimer = null; }
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
      <div class="form-group"><label class="form-label" style="color:var(--gold-light);font-weight:600">Gold & Jewelry Value ($)</label><input class="form-input" type="number" id="z-gold" placeholder="0.00" style="border:1px solid rgba(212,168,67,0.3)"></div>
      <div class="form-group"><label class="form-label" style="color:var(--gold-light);font-weight:600">Silver Value ($)</label><input class="form-input" type="number" id="z-silver" placeholder="0.00" style="border:1px solid rgba(212,168,67,0.3)"></div>
      <div class="form-group"><label class="form-label" style="color:var(--gold-light);font-weight:600">Cash & Bank Balances ($)</label><input class="form-input" type="number" id="z-cash" placeholder="0.00" style="border:1px solid rgba(212,168,67,0.3)"></div>
      <div class="form-group"><label class="form-label" style="color:var(--gold-light);font-weight:600">Stocks & Investments ($)</label><input class="form-input" type="number" id="z-stocks" placeholder="0.00" style="border:1px solid rgba(212,168,67,0.3)"></div>
      <div class="form-group"><label class="form-label" style="color:var(--gold-light);font-weight:600">Business / Rental Property ($)</label><input class="form-input" type="number" id="z-property" placeholder="0.00" style="border:1px solid rgba(212,168,67,0.3)"></div>
      <div class="form-group"><label class="form-label" style="color:var(--gold-light);font-weight:600">Debts & Liabilities ($)</label><input class="form-input" type="number" id="z-debts" placeholder="0.00" style="border:1px solid rgba(212,168,67,0.3)"></div>
      <button class="btn btn-primary w-full mt-8" style="border-radius:8px;font-weight:600" onclick="Screens.calcZakat()">Calculate Zakat</button>
      <div id="zakat-result"></div>
    `;
  },

  calcZakat() {
    const v = id => parseFloat(document.getElementById(id)?.value) || 0;
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

  // ==== COMMUNITY SCREEN ====
  communityTab: 'feed',

  renderCommunity() {
    const el = document.getElementById('screen-community');
    const tabs = ['Feed', 'Events', 'Mosques'];
    const posts = [
      { name: 'Ahmad M.', initials: 'AM', time: '2h ago', text: 'Just completed my 30-day Quran reading challenge! Alhamdulillah for the strength to be consistent.', likes: 24, comments: 8 },
      { name: 'Fatima K.', initials: 'FK', time: '4h ago', text: 'Reminder: Tahajjud prayer is one of the best voluntary prayers. Even 2 rakahs before Fajr can transform your spiritual life.', likes: 45, comments: 12 },
      { name: 'Omar H.', initials: 'OH', time: '6h ago', text: 'Our local masjid is organizing a community iftar this Friday. All are welcome! DM for details.', likes: 31, comments: 15 }
    ];
    const mosques = [
      { name: 'Islamic Center of Dallas', dist: '2.1 mi', rating: '4.8' },
      { name: 'East Plano Islamic Center', dist: '5.3 mi', rating: '4.7' },
      { name: 'Valley Ranch Islamic Center', dist: '8.2 mi', rating: '4.9' }
    ];

    el.innerHTML = `
      ${this._screenHeader('👥', 'The Ummah', 'الأمة')}
      <div style="display:flex;gap:8px;margin-bottom:12px">
        ${tabs.map(t => `<span class="chip ${t.toLowerCase() === this.communityTab ? 'active' : ''}" style="border-radius:20px;padding:8px 14px;border:2px solid ${t.toLowerCase() === this.communityTab ? 'var(--gold-light)' : 'rgba(212,168,67,0.3)'};background:${t.toLowerCase() === this.communityTab ? 'rgba(212,168,67,0.15)' : 'transparent'}" onclick="Screens.communityTab='${t.toLowerCase()}';Screens.renderCommunity()">${t}</span>`).join('')}
      </div>
      ${this.communityTab === 'feed' ? `
        ${posts.map(p => `
          <div class="card post-card" style="border-top:3px solid var(--gold-light);border-radius:12px">
            <div class="post-header" style="margin-bottom:12px">
              <div class="post-avatar" style="background:linear-gradient(135deg,var(--gold-light),rgba(212,168,67,0.5));border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--dark);flex-shrink:0">${p.initials}</div>
              <div class="post-meta"><div class="post-name" style="font-weight:600">${p.name}</div><div class="post-time" style="font-size:11px;color:var(--text-sec)">${p.time}</div></div>
            </div>
            <div class="post-body" style="line-height:1.6;margin-bottom:12px">${p.text}</div>
            <div class="post-actions" style="display:flex;gap:16px;padding-top:8px;border-top:1px solid rgba(212,168,67,0.15)">
              <span class="post-action" style="font-size:13px;color:var(--text-sec)">❤️ ${p.likes}</span>
              <span class="post-action" style="font-size:13px;color:var(--text-sec)">💬 ${p.comments}</span>
              <span class="post-action" style="font-size:13px;color:var(--text-sec)">🔁 Share</span>
            </div>
          </div>
        `).join('')}
      ` : this.communityTab === 'events' ? `
        <div class="card mb-8" style="border-left:4px solid var(--gold);border-radius:12px">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
            <span style="font-size:20px">🌙</span>
            <div style="font-weight:700">Community Iftar</div>
          </div>
          <div class="text-sm text-sec">Friday, 6:30 PM · Islamic Center of Dallas</div>
          <button class="btn btn-outline mt-8" style="font-size:12px;padding:6px 12px;border:1px solid var(--gold-light);color:var(--gold-light);border-radius:20px">RSVP</button>
        </div>
        <div class="card mb-8" style="border-left:4px solid var(--green);border-radius:12px">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
            <span style="font-size:20px">📖</span>
            <div style="font-weight:700">Quran Study Circle</div>
          </div>
          <div class="text-sm text-sec">Saturday, 10:00 AM · Online (Zoom)</div>
          <button class="btn btn-outline mt-8" style="font-size:12px;padding:6px 12px;border:1px solid var(--green);color:var(--green);border-radius:20px">Join</button>
        </div>
        <div class="card mb-8" style="border-left:4px solid var(--blue);border-radius:12px">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
            <span style="font-size:20px">🏀</span>
            <div style="font-weight:700">Youth Basketball Tournament</div>
          </div>
          <div class="text-sm text-sec">Sunday, 2:00 PM · EPIC Gymnasium</div>
          <button class="btn btn-outline mt-8" style="font-size:12px;padding:6px 12px;border:1px solid var(--blue);color:var(--blue);border-radius:20px">Register</button>
        </div>
      ` : `
        ${mosques.map(m => `
          <div class="card row mb-8" style="border-left:4px solid var(--gold-light);border-radius:12px">
            <div style="width:44px;height:44px;border-radius:12px;background:rgba(212,168,67,0.15);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">🕌</div>
            <div class="flex-1">
              <div style="font-weight:600">${m.name}</div>
              <div class="text-xs text-sec">${m.dist} · ⭐ ${m.rating}</div>
            </div>
          </div>
        `).join('')}
      `}
    `;
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
