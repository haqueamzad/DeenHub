/* ============================================================
   DeenHub PWA — Screen Renderers
   ============================================================ */

const Screens = {
  currentScreen: 'home',
  prayerTimes: null,
  location: null,

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
    const prayers = [
      { name: 'Fajr', time: pt.fajr },
      { name: 'Dhuhr', time: pt.dhuhr },
      { name: 'Asr', time: pt.asr },
      { name: 'Maghrib', time: pt.maghrib },
      { name: 'Isha', time: pt.isha }
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

    // Prayer icons
    const prayerIcons = { Fajr: '🌙', Dhuhr: '☀️', Asr: '🌤️', Maghrib: '🌅', Isha: '🌛' };

    el.innerHTML = `
      <div class="prayer-hero crescent-stars">
        ${mosqueSVG}
        <div class="prayer-hero-content">
          <div class="prayer-label">✦ NEXT PRAYER ✦</div>
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
        <div class="streak-flame">\uD83D\uDD25</div>
        <div class="streak-info">
          <div class="streak-count">${streak} Day Streak</div>
          <div class="streak-label">${todayPrayers.length}/5 prayers logged</div>
        </div>
        <div class="streak-xp">+50 XP</div>
      </div>

      ${ornament}

      <div class="section-title">✦ Quick Actions</div>
      <div class="quick-grid">
        <div class="quick-item" onclick="App.navigate('quran')"><div class="quick-icon">📖</div><div class="quick-label">Quran</div></div>
        <div class="quick-item" onclick="App.navigate('hadith')"><div class="quick-icon">📜</div><div class="quick-label">Hadith</div></div>
        <div class="quick-item" onclick="App.navigate('ai')"><div class="quick-icon">✨</div><div class="quick-label">AI Scholar</div></div>
        <div class="quick-item" onclick="App.navigate('tasbih')"><div class="quick-icon">📿</div><div class="quick-label">Tasbih</div></div>
        <div class="quick-item" onclick="App.navigate('qibla')"><div class="quick-icon">🧭</div><div class="quick-label">Qibla</div></div>
        <div class="quick-item" onclick="App.navigate('duas')"><div class="quick-icon">🤲</div><div class="quick-label">Duas</div></div>
        <div class="quick-item" onclick="App.navigate('zakat')"><div class="quick-icon">💰</div><div class="quick-label">Zakat</div></div>
        <div class="quick-item" onclick="App.navigate('calendar')"><div class="quick-icon">📅</div><div class="quick-label">Calendar</div></div>
      </div>

      ${ornament}

      <div class="section-title">✦ Daily Verse</div>
      <div class="verse-card card card-hover card-islamic" onclick="App.navigate('quran')">
        <div class="verse-bismillah">﷽</div>
        <div class="arabic-text" style="margin-bottom:12px;font-size:28px;line-height:2">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</div>
        <div class="verse-translation">In the name of Allah, the Most Gracious, the Most Merciful</div>
        <div class="verse-reference">— Surah Al-Fatihah 1:1</div>
      </div>

      <div class="card xp-card">
        <div class="row" style="justify-content:space-between">
          <div>
            <div class="xp-level-text">✦ Level ${level}</div>
            <div style="font-size:11px;color:var(--text-sec)">${xp} XP earned</div>
          </div>
          <div style="font-size:11px;color:var(--text-sec)">${500 - (xp % 500)} XP to next level</div>
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
          <div class="card card-hover mb-8" onclick="Screens.openSurah(${lastRead.surah})" style="border:1px solid var(--primary-dark)">
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
            <div class="list-item" onclick="Screens.openSurah(${s.number})">
              <div class="list-num">${s.number}</div>
              <div class="list-body">
                <div class="list-title">${s.name}</div>
                <div class="list-sub">${s.translation} · ${s.ayahs} ayahs · ${s.type}</div>
              </div>
              <div class="list-right">
                <div style="font-family:'Amiri',serif;font-size:18px;color:var(--gold-light)">${s.arabic}</div>
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
            <div class="juz-card" onclick="Screens.quranView='reader';Screens.quranActiveSurah=${juzInfo.surah};Screens.renderQuran()">
              <div class="juz-num">${juz}</div>
              <div class="juz-info">
                <div class="juz-name">${juzInfo.name}</div>
                <div class="juz-range">Surah ${juzInfo.surah}:${juzInfo.ayah}</div>
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
            <div class="list-item" onclick="Screens.openSurah(${s.number})">
              <div class="list-num">${s.number}</div>
              <div class="list-body">
                <div class="list-title">${s.name}</div>
                <div class="list-sub">${s.translation} · ${s.ayahs} ayahs</div>
              </div>
              <div class="list-right">
                <div style="font-family:'Amiri',serif;font-size:18px;color:var(--gold-light)">${s.arabic}</div>
                <div style="font-size:16px;cursor:pointer" onclick="event.stopPropagation();Screens.toggleBookmark(${s.number})">❤️</div>
              </div>
            </div>
          `).join('')}
        `}
      `;
    }

    el.innerHTML = `
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
          ${API.reciters.map(r => `<option value="${r.id}" ${r.id === this.quranSelectedReciter ? 'selected' : ''}>${r.name}</option>`).join('')}
        </select>
        <select class="quran-select" onchange="Screens.quranSelectedTranslation=this.value;Screens.renderQuran()">
          ${API.translations.map(t => `<option value="${t.id}" ${t.id === this.quranSelectedTranslation ? 'selected' : ''}>${t.name}</option>`).join('')}
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
      ${this.quranActiveSurah !== 1 && this.quranActiveSurah !== 9 ? `<div class="quran-bismillah islamic-arch">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>` : ''}

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
        API.pauseAudio();
        this.renderQuran();
      } else {
        API.resumeAudio();
        this.renderQuran();
      }
    } else {
      const ayah = this.quranAyahs?.find(a => a.number === ayahNum);
      if (ayah && ayah.audio) {
        this.quranPlayingAyah = ayahNum;
        this.quranWordHighlightIdx = -1;
        // Auto-enable word-by-word when playing
        if (!this.quranWordByWord) {
          this._wordByWordAutoEnabled = true;
          this.quranWordByWord = true;
        }
        API.playAyahAudio(ayah.audio);
        if (API.audioPlayer) API.audioPlayer.playbackRate = this.quranAudioSpeed;
        this.renderQuran();

        // Scroll the playing ayah card into view
        setTimeout(() => {
          const card = document.querySelector(`.quran-ayah-card[data-ayah="${ayahNum}"]`);
          if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  },

  pauseAyah() {
    API.pauseAudio();
    this.quranPlayingAyah = null;
    // Restore word-by-word if it was auto-enabled
    if (this._wordByWordAutoEnabled) {
      this.quranWordByWord = false;
      this._wordByWordAutoEnabled = false;
    }
    this.renderQuran();
  },

  cycleAudioSpeed() {
    const speeds = [0.5, 0.75, 1.0, 1.25, 1.5];
    const idx = speeds.indexOf(this.quranAudioSpeed);
    this.quranAudioSpeed = speeds[(idx + 1) % speeds.length];
    if (API.audioPlayer) API.audioPlayer.playbackRate = this.quranAudioSpeed;
    this.renderQuran();
  },

  onAyahAudioEnded() {
    if (this.quranRepeatAyah && this.quranPlayingAyah) {
      const ayahNum = this.quranPlayingAyah;
      this.quranPlayingAyah = null;
      setTimeout(() => this.playAyah(ayahNum), 300);
    } else {
      this.playNextAyah();
    }
  },

  playAllAyahs() {
    if (this.quranAyahs && this.quranAyahs.length > 0) {
      this.playAyah(this.quranAyahs[0].number);
    }
  },

  playNextAyah() {
    if (this.quranPlayingAyah && this.quranAyahs) {
      const currentIdx = this.quranAyahs.findIndex(a => a.number === this.quranPlayingAyah);
      if (currentIdx < this.quranAyahs.length - 1) {
        this.playAyah(this.quranAyahs[currentIdx + 1].number);
      }
    }
  },

  playPrevAyah() {
    if (this.quranPlayingAyah && this.quranAyahs) {
      const currentIdx = this.quranAyahs.findIndex(a => a.number === this.quranPlayingAyah);
      if (currentIdx > 0) {
        this.playAyah(this.quranAyahs[currentIdx - 1].number);
      }
    }
  },

  onAudioTimeUpdate() {
    if (!this.quranPlayingAyah || !this.quranAyahs) return;
    const ayah = this.quranAyahs.find(a => a.number === this.quranPlayingAyah);
    if (!ayah || !API.audioPlayer || !API.audioPlayer.duration) return;

    const duration = API.audioPlayer.duration;
    const currentTime = API.audioPlayer.currentTime;
    const progress = currentTime / duration;

    // Update progress bar
    const progressBar = document.getElementById('ayahProgressBar');
    if (progressBar) progressBar.style.width = (progress * 100) + '%';

    // Word highlighting with weighted timing (longer words get more time)
    const words = ayah.words;
    const totalChars = words.reduce((sum, w) => sum + w.length, 0);
    let cumulative = 0;
    let wordIdx = 0;
    for (let i = 0; i < words.length; i++) {
      cumulative += words[i].length / totalChars;
      if (progress < cumulative) { wordIdx = i; break; }
      if (i === words.length - 1) wordIdx = i;
    }

    // Get only words belonging to the currently playing ayah
    const ayahWords = document.querySelectorAll(`.quran-word[data-ayah-num="${this.quranPlayingAyah}"]`);

    if (wordIdx !== this.quranWordHighlightIdx) {
      this.quranWordHighlightIdx = wordIdx;

      ayahWords.forEach((el, idx) => {
        el.classList.remove('quran-word-active', 'quran-word-read', 'quran-word-upcoming');
        if (idx < wordIdx) {
          el.classList.add('quran-word-read');
        } else if (idx === wordIdx) {
          el.classList.add('quran-word-active');
        } else {
          el.classList.add('quran-word-upcoming');
        }
      });

      // Auto-scroll to keep active word in view
      const activeWord = ayahWords[wordIdx];
      if (activeWord) {
        const rect = activeWord.getBoundingClientRect();
        const viewportH = window.innerHeight;
        if (rect.top < 80 || rect.bottom > viewportH - 120) {
          activeWord.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  },

  toggleTransliteration() {
    this.quranShowTranslit = !this.quranShowTranslit;
    Store.setSetting('showTranslit', this.quranShowTranslit);
    this.renderQuran();
  },

  toggleWordByWord() {
    this.quranWordByWord = !this.quranWordByWord;
    Store.setSetting('wordByWord', this.quranWordByWord);
    this.renderQuran();
  },

  async renderQuranSearch(el) {
    el.innerHTML = `
      <div class="search-bar">
        <span>🔍</span>
        <input type="text" placeholder="Search Quran..." id="quran-search-input" onkeydown="if(event.key==='Enter')Screens.searchQuranAction()" value="${this.quranSearch}">
      </div>
      ${this.quranSearchResults.length > 0 ? `
        ${this.quranSearchResults.map(r => `
          <div class="quran-search-result" onclick="Screens.openSurah(${r.surah})">
            <div style="font-weight:600">${r.surahName} ${r.ayah}</div>
            <div style="font-size:13px;color:var(--text-sec);margin-top:4px">${r.text.substring(0, 100)}...</div>
          </div>
        `).join('')}
      ` : this.quranSearch ? '<div class="empty-state"><div class="empty-icon">📖</div><div>No results found</div></div>' : ''}
    `;
  },

  async searchQuranAction() {
    const input = document.getElementById('quran-search-input');
    if (input && input.value.trim()) {
      this.quranSearch = input.value.trim();
      this.quranSearchResults = await API.searchQuran(this.quranSearch, this.quranSelectedTranslation);
      this.renderQuran();
    }
  },

  copyAyah(surah, ayahNum) {
    const ayah = this.quranAyahs?.find(a => a.number === ayahNum);
    if (ayah) {
      navigator.clipboard.writeText(ayah.arabic).then(() => App.toast('Copied to clipboard'));
    }
  },

  toggleBookmark(num) {
    Store.toggleBookmark(num);
    this.renderQuran();
    App.toast('Bookmark updated');
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
    const activeCol = collections.find(c => c.id === this.hadithCollection);

    el.innerHTML = `
      <div class="search-bar">
        <span>\uD83D\uDD0D</span>
        <input type="text" placeholder="Search hadith..." value="${this.hadithSearch}" oninput="Screens.hadithSearch=this.value;Screens.renderHadith()">
      </div>
      <div style="overflow-x:auto;white-space:nowrap;margin-bottom:12px;padding-bottom:4px">
        ${collections.map(c => `
          <span class="chip ${c.id === this.hadithCollection ? 'active' : ''}" onclick="Screens.hadithCollection='${c.id}';Screens.hadithSearch='';Screens.renderHadith()">
            ${c.icon} ${c.name.split(' ').pop()}
          </span>
        `).join('')}
      </div>
      <div class="card mb-8">
        <div style="font-weight:600">${activeCol.name}</div>
        <div class="text-xs text-sec">${activeCol.count.toLocaleString()} hadith \u00B7 Showing ${filtered.length} sample</div>
      </div>
      ${filtered.map(h => `
        <div class="card mb-8">
          <div class="row mb-8" style="justify-content:space-between">
            <span class="badge" style="background:rgba(13,124,102,.2);color:var(--primary-light)">#${h.num}</span>
            <span class="badge" style="background:rgba(46,204,113,.15);color:var(--green)">${h.grade}</span>
          </div>
          <div style="font-size:14px;line-height:1.6;margin-bottom:8px">${h.text}</div>
          <div class="text-xs text-sec">Narrated by ${h.narrator} \u00B7 Book of ${h.book}</div>
        </div>
      `).join('')}
      ${filtered.length === 0 ? '<div class="empty-state"><div class="empty-icon">\uD83D\uDCDC</div>No hadith found matching your search.</div>' : ''}
    `;
  },

  // ==== AI SCHOLAR SCREEN ====
  aiMessages: [
    { role: 'ai', text: "As-salamu alaykum! I'm your AI Islamic Scholar. Ask me anything about Islam — prayer, Quran, Hadith, fiqh, history, and more. All answers are sourced from authentic Islamic scholarship." }
  ],

  renderAI() {
    const el = document.getElementById('screen-ai');
    el.innerHTML = `
      <div class="chat-area" id="chat-messages">
        ${this.aiMessages.map(m => `
          <div class="chat-bubble ${m.role}">${m.text}</div>
        `).join('')}
      </div>
      <div class="chat-input-wrap">
        <input class="chat-input" id="ai-input" type="text" placeholder="Ask about Islam..." onkeydown="if(event.key==='Enter')Screens.sendAI()">
        <button class="chat-send" onclick="Screens.sendAI()">\u27A4</button>
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
    const phrases = ['SubhanAllah', 'Alhamdulillah', 'Allahu Akbar', 'La ilaha illallah', 'Astaghfirullah'];

    el.innerHTML = `
      <div class="text-center mt-16">
        <div class="tasbih-phrases">
          ${phrases.map(p => `
            <span class="tasbih-phrase ${p === this.tasbihPhrase ? 'active' : ''}" onclick="Screens.tasbihPhrase='${p}';Screens.renderTasbih()">${p}</span>
          `).join('')}
        </div>
        <div class="tasbih-count">${this.tasbihCount}</div>
        <div class="tasbih-target">of ${this.tasbihTarget}</div>
        <div class="tasbih-ring" onclick="Screens.incrementTasbih()">
          <div class="tasbih-ring-progress" style="transform:rotate(${progress}deg)"></div>
          <div class="tasbih-ring-text">TAP</div>
        </div>
        <div class="row" style="justify-content:center;gap:12px;margin-bottom:20px">
          <button class="btn btn-outline" onclick="Screens.tasbihCount=0;Screens.renderTasbih()">Reset</button>
          <button class="btn btn-primary" onclick="Screens.tasbihTarget=Screens.tasbihTarget===33?99:Screens.tasbihTarget===99?100:33;Screens.renderTasbih()">Target: ${this.tasbihTarget}</button>
        </div>
        <div class="card">
          <div class="row" style="justify-content:space-between">
            <div class="text-sec text-sm">Lifetime Total</div>
            <div style="font-weight:700;color:var(--primary-light)">${total.toLocaleString()}</div>
          </div>
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

    el.innerHTML = `
      <div class="text-center mt-16">
        <div style="font-size:14px;color:var(--text-sec);margin-bottom:4px">Direction to Makkah</div>
        <div class="compass-degrees">${Math.round(this.qiblaAngle)}\u00B0</div>
        <div class="compass-wrap">
          <div class="compass-ring">
            <div class="compass-needle" style="transform:rotate(${this.qiblaAngle}deg)"></div>
            <div class="compass-kaaba">\uD83D\uDD4B</div>
          </div>
        </div>
        <div class="compass-label">Point your device north, then face the needle direction</div>
        <div class="card mt-16">
          <div class="text-sm text-sec">Your Location</div>
          <div style="font-weight:600">${this.location.lat.toFixed(4)}\u00B0N, ${Math.abs(this.location.lng).toFixed(4)}\u00B0${this.location.lng >= 0 ? 'E' : 'W'}</div>
        </div>
        <div class="card">
          <div class="text-sm text-sec">Distance to Kaaba</div>
          <div style="font-weight:600">${this._distToKaaba(this.location.lat, this.location.lng)} km</div>
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
      <div class="dua-header-bar">
        <div class="dua-header-info">
          <div class="dua-header-icon">${cat ? cat.icon : '\uD83E\uDD32'}</div>
          <div>
            <div class="dua-header-title">${cat ? cat.name : ''} Duas</div>
            <div class="dua-header-count">${duas.length} supplications from Hisnul Muslim</div>
          </div>
        </div>
        <button class="quran-toggle ${this.duaShowTranslit ? 'active' : ''}" onclick="Screens.duaShowTranslit=!Screens.duaShowTranslit;Screens.renderDuas()">Transliteration</button>
      </div>

      <div style="overflow-x:auto;white-space:nowrap;margin-bottom:14px;padding-bottom:4px">
        ${categories.map(c => `
          <span class="chip ${c.id === this.duaCategory ? 'active' : ''}" onclick="Screens.duaCategory='${c.id}';Screens.stopDuaAudio();Screens.renderDuas()">
            ${c.icon} ${c.name} <span class="dua-cat-badge">${c.count}</span>
          </span>
        `).join('')}
      </div>

      ${duas.map((d, i) => {
        const words = d.arabic.split(/\s+/);
        const isPlaying = this.duaPlayingId === d.id;
        const isFav = favs.includes(d.id);
        return `
          <div class="dua-card-premium ${isPlaying ? 'dua-playing' : ''}" data-dua-id="${d.id}">
            <div class="dua-card-top">
              <div class="dua-num-badge">${i + 1}</div>
              <div class="dua-card-btns">
                ${d.repeat > 1 ? '<span class="dua-repeat-badge">' + d.repeat + 'x</span>' : ''}
                <button class="dua-action-btn ${isFav ? 'dua-fav-active' : ''}" onclick="event.stopPropagation();Screens.toggleDuaFav('${d.id}');">\u2764\uFE0F</button>
                <button class="dua-action-btn" onclick="event.stopPropagation();Screens.copyDua('${d.id}');">\uD83D\uDCCB</button>
              </div>
            </div>

            <div class="dua-arabic-premium" data-dua-id="${d.id}">
              ${words.map((w, idx) => '<span class="dua-word" data-word-idx="' + idx + '" data-dua-id="' + d.id + '">' + w + '</span>').join(' ')}
            </div>

            ${this.duaShowTranslit && d.translit ? '<div class="dua-translit-line">' + d.translit + '</div>' : ''}

            <div class="dua-trans-line">${d.trans}</div>

            <div class="dua-card-footer">
              <div class="dua-ref-line">\uD83D\uDCDA ${d.ref}</div>
              <button class="dua-play-btn ${isPlaying ? 'playing' : ''}" onclick="Screens.playDua('${d.id}')">
                ${isPlaying ? '\u23F8\uFE0F' : '\u25B6\uFE0F'}
              </button>
            </div>

            ${isPlaying ? '<div class="dua-audio-progress"><div class="dua-audio-progress-bar" id="duaProgressBar" style="width:0%"></div></div>' : ''}
          </div>
        `;
      }).join('')}

      ${duas.length === 0 ? '<div class="empty-state"><div class="empty-icon">\uD83E\uDD32</div>No duas in this category.</div>' : ''}
    `;
  },

  // Initialize TTS voices (call once at startup or first play)
  _initDuaVoices() {
    if (this._duaVoicesLoaded) return;
    if (!('speechSynthesis' in window)) {
      this._duaAudioMode = 'reading';
      this._duaVoicesLoaded = true;
      return;
    }
    var self = this;
    var pickVoice = function() {
      var voices = speechSynthesis.getVoices();
      if (!voices.length) return false;
      // Prefer Arabic voices, then any voice
      var arabic = voices.filter(function(v) { return v.lang && v.lang.indexOf('ar') === 0; });
      if (arabic.length) {
        // Prefer Google Arabic if available (higher quality)
        var google = arabic.filter(function(v) { return v.name.toLowerCase().indexOf('google') >= 0; });
        self._duaArabicVoice = google.length ? google[0] : arabic[0];
        self._duaAudioMode = 'tts';
      } else {
        self._duaArabicVoice = null;
        self._duaAudioMode = 'reading';
      }
      self._duaVoicesLoaded = true;
      return true;
    };
    // Try immediate
    if (!pickVoice()) {
      // Chrome loads voices async — wait for event
      speechSynthesis.onvoiceschanged = function() {
        pickVoice();
      };
      // Also try after a small delay as fallback
      setTimeout(function() {
        if (!self._duaVoicesLoaded) pickVoice();
        // If still no voices after 2s, go reading mode
        if (!self._duaVoicesLoaded) {
          self._duaAudioMode = 'reading';
          self._duaVoicesLoaded = true;
        }
      }, 2000);
    }
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

    // Stop any existing playback (dua or Quran)
    this.stopDuaAudio();
    if (this.quranPlayingAyah) this.pauseAyah();

    // Ensure voices are initialized
    this._initDuaVoices();

    this.duaPlayingId = duaId;
    this.duaWordHighlightIdx = -1;
    this._duaWords = dua.arabic.split(/\s+/);

    // Calculate word timing based on character weight
    var totalChars = this._duaWords.reduce(function(s, w) { return s + w.length; }, 0);
    var msPerWord = this._duaAudioMode === 'tts' ? 480 : 600; // reading mode is slower pace
    this._duaEstDuration = Math.max(this._duaWords.length * msPerWord, 2500);
    this._duaStartTime = Date.now();

    var startPlayback = function() {
      if (self._duaAudioMode === 'tts' && 'speechSynthesis' in window) {
        speechSynthesis.cancel();
        var utterance = new SpeechSynthesisUtterance(dua.arabic);
        utterance.lang = 'ar';
        utterance.rate = 0.75;
        utterance.pitch = 1;
        if (self._duaArabicVoice) utterance.voice = self._duaArabicVoice;
        self._duaUtterance = utterance;

        // Use boundary events for real word sync if available
        utterance.onboundary = function(e) {
          if (e.name === 'word' && self.duaPlayingId) {
            // Map character index to word index
            var charIdx = e.charIndex;
            var pos = 0;
            for (var i = 0; i < self._duaWords.length; i++) {
              if (charIdx <= pos + self._duaWords[i].length) {
                self._syncDuaWordHighlight(i);
                break;
              }
              pos += self._duaWords[i].length + 1; // +1 for space
            }
          }
        };

        var ttsStarted = false;
        utterance.onstart = function() {
          ttsStarted = true;
          // Re-estimate duration once TTS actually starts
          self._duaStartTime = Date.now();
        };

        utterance.onend = function() {
          Screens.onDuaAudioEnded();
        };

        utterance.onerror = function(e) {
          // If TTS fails, switch to reading mode for this playback
          if (!ttsStarted && self.duaPlayingId === duaId) {
            self._duaAudioMode = 'reading';
            self._duaStartTime = Date.now();
            self._duaEstDuration = Math.max(self._duaWords.length * 600, 2500);
            // Show reading mode indicator
            self._showDuaToast('Reading mode — follow the highlighted words');
          } else {
            Screens.onDuaAudioEnded();
          }
        };

        speechSynthesis.speak(utterance);

        // Safety: if TTS doesn't start within 1.5s, fall back to reading mode
        setTimeout(function() {
          if (!ttsStarted && self.duaPlayingId === duaId) {
            self._duaAudioMode = 'reading';
            self._duaStartTime = Date.now();
            self._duaEstDuration = Math.max(self._duaWords.length * 600, 2500);
            self._showDuaToast('Reading mode — follow the highlighted words');
          }
        }, 1500);
      } else {
        // Pure reading mode — no audio, just word-by-word highlighting
        self._showDuaToast('Reading mode — follow along with the highlighted words');
      }

      // Start the universal word highlighting timer
      self._duaTimer = setInterval(function() { Screens.onDuaTimeUpdate(); }, 50);
    };

    // If voices haven't loaded yet, wait briefly then start
    if (!this._duaVoicesLoaded) {
      setTimeout(function() { startPlayback(); }, 300);
    } else {
      startPlayback();
    }

    this.renderDuas();

    // Scroll playing card into view
    setTimeout(function() {
      var card = document.querySelector('.dua-card-premium[data-dua-id="' + duaId + '"]');
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
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
    // Remove existing toast
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

    // Update progress bar
    var progressBar = document.getElementById('duaProgressBar');
    if (progressBar) progressBar.style.width = (progress * 100) + '%';

    // Weighted timing based on word character length (same algorithm as Quran)
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

      // Auto-scroll to keep active word visible
      var activeWord = duaWords[wordIdx];
      if (activeWord) {
        var rect = activeWord.getBoundingClientRect();
        var viewportH = window.innerHeight;
        if (rect.top < 80 || rect.bottom > viewportH - 120) {
          activeWord.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }

    // End when progress reaches 1
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

    // Auto-play next dua in category
    if (wasPlaying) {
      var duas = API.getDuas(this.duaCategory);
      var idx = duas.findIndex(function(d) { return d.id === wasPlaying; });
      if (idx >= 0 && idx < duas.length - 1) {
        // Small delay before next dua
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
      var text = dua.arabic + '\n\n' + dua.translit + '\n\n' + dua.trans + '\n\n\u2014 ' + dua.ref;
      navigator.clipboard.writeText(text).then(function() { App.toast('Dua copied to clipboard'); });
    }
  },

  // ==== ZAKAT SCREEN ====
  renderZakat() {
    const el = document.getElementById('screen-zakat');
    el.innerHTML = `
      <div class="card" style="border:1px solid var(--gold);background:rgba(212,168,67,.08)">
        <div style="font-size:14px;color:var(--gold)">Nisab Threshold: ~$5,500 USD</div>
        <div class="text-xs text-sec mt-8">2.5% of qualifying wealth held for one lunar year</div>
      </div>
      <div class="section-title">Calculate Your Zakat</div>
      <div class="form-group"><label class="form-label">Gold & Jewelry Value ($)</label><input class="form-input" type="number" id="z-gold" placeholder="0.00"></div>
      <div class="form-group"><label class="form-label">Silver Value ($)</label><input class="form-input" type="number" id="z-silver" placeholder="0.00"></div>
      <div class="form-group"><label class="form-label">Cash & Bank Balances ($)</label><input class="form-input" type="number" id="z-cash" placeholder="0.00"></div>
      <div class="form-group"><label class="form-label">Stocks & Investments ($)</label><input class="form-input" type="number" id="z-stocks" placeholder="0.00"></div>
      <div class="form-group"><label class="form-label">Business / Rental Property ($)</label><input class="form-input" type="number" id="z-property" placeholder="0.00"></div>
      <div class="form-group"><label class="form-label">Debts & Liabilities ($)</label><input class="form-input" type="number" id="z-debts" placeholder="0.00"></div>
      <button class="btn btn-primary w-full mt-8" onclick="Screens.calcZakat()">Calculate Zakat</button>
      <div id="zakat-result"></div>
    `;
  },

  calcZakat() {
    const v = id => parseFloat(document.getElementById(id)?.value) || 0;
    const result = API.calculateZakat(v('z-gold'), v('z-silver'), v('z-cash'), v('z-stocks'), v('z-property'), v('z-debts'));
    Store.unlockAchievement('zakat_calc');
    document.getElementById('zakat-result').innerHTML = `
      <div class="zakat-result mt-16">
        <div style="font-size:13px;opacity:.8">${result.eligible ? 'Your Zakat Due' : 'Below Nisab Threshold'}</div>
        <div class="zakat-amount">$${result.amount.toFixed(2)}</div>
        <div class="zakat-label-sm">Net assets: $${result.net.toLocaleString()} | Nisab: $${result.nisab.toLocaleString()}</div>
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

    el.innerHTML = `
      <div class="card" style="background:linear-gradient(135deg,var(--primary-dark),var(--primary))">
        <div style="font-size:13px;opacity:.8">Islamic Date</div>
        <div style="font-size:20px;font-weight:700">${hijri.day} ${hijri.monthName} ${hijri.year} AH</div>
      </div>

      <div class="row mb-16" style="justify-content:space-between;align-items:center">
        <button class="back-btn" onclick="Screens.calMonth--;if(Screens.calMonth<0){Screens.calMonth=11;Screens.calYear--;}Screens.renderCalendar()">\u2190</button>
        <div style="font-weight:700;font-size:16px">${months[this.calMonth]} ${this.calYear}</div>
        <button class="back-btn" onclick="Screens.calMonth++;if(Screens.calMonth>11){Screens.calMonth=0;Screens.calYear++;}Screens.renderCalendar()">\u2192</button>
      </div>

      <div class="cal-grid">
        ${days.map(d => `<div class="cal-day-header">${d}</div>`).join('')}
        ${Array(firstDay).fill('<div class="cal-day empty"></div>').join('')}
        ${Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const isToday = isCurrentMonth && day === today.getDate();
          const isEvent = eventDays.includes(day);
          return `<div class="cal-day ${isToday ? 'today' : ''} ${isEvent ? 'event-day' : ''}">${day}</div>`;
        }).join('')}
      </div>

      ${monthEvents.length > 0 ? `
        <div class="section-title">Events This Month</div>
        ${monthEvents.map(e => `
          <div class="card row mb-8">
            <div style="width:4px;height:36px;border-radius:2px;background:${e.color};flex-shrink:0"></div>
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
      <div style="display:flex;gap:8px;margin-bottom:12px">
        ${tabs.map(t => `<span class="chip ${t.toLowerCase() === this.communityTab ? 'active' : ''}" onclick="Screens.communityTab='${t.toLowerCase()}';Screens.renderCommunity()">${t}</span>`).join('')}
      </div>
      ${this.communityTab === 'feed' ? `
        ${posts.map(p => `
          <div class="card post-card">
            <div class="post-header">
              <div class="post-avatar">${p.initials}</div>
              <div class="post-meta"><div class="post-name">${p.name}</div><div class="post-time">${p.time}</div></div>
            </div>
            <div class="post-body">${p.text}</div>
            <div class="post-actions">
              <span class="post-action">\u2764\uFE0F ${p.likes}</span>
              <span class="post-action">\uD83D\uDCAC ${p.comments}</span>
              <span class="post-action">\uD83D\uDD01 Share</span>
            </div>
          </div>
        `).join('')}
      ` : this.communityTab === 'events' ? `
        <div class="card mb-8" style="border-left:4px solid var(--gold)">
          <div style="font-weight:700">Community Iftar</div>
          <div class="text-sm text-sec">Friday, 6:30 PM \u00B7 Islamic Center of Dallas</div>
          <button class="btn btn-outline mt-8" style="font-size:12px;padding:6px 12px">RSVP</button>
        </div>
        <div class="card mb-8" style="border-left:4px solid var(--green)">
          <div style="font-weight:700">Quran Study Circle</div>
          <div class="text-sm text-sec">Saturday, 10:00 AM \u00B7 Online (Zoom)</div>
          <button class="btn btn-outline mt-8" style="font-size:12px;padding:6px 12px">Join</button>
        </div>
        <div class="card mb-8" style="border-left:4px solid var(--blue)">
          <div style="font-weight:700">Youth Basketball Tournament</div>
          <div class="text-sm text-sec">Sunday, 2:00 PM \u00B7 EPIC Gymnasium</div>
          <button class="btn btn-outline mt-8" style="font-size:12px;padding:6px 12px">Register</button>
        </div>
      ` : `
        ${mosques.map(m => `
          <div class="card row mb-8">
            <div style="width:44px;height:44px;border-radius:12px;background:var(--surface);display:flex;align-items:center;justify-content:center;font-size:20px">\uD83D\uDD4C</div>
            <div class="flex-1">
              <div style="font-weight:600">${m.name}</div>
              <div class="text-xs text-sec">${m.dist} \u00B7 \u2B50 ${m.rating}</div>
            </div>
          </div>
        `).join('')}
      `}
    `;
  },

  // ==== AZAN SETTINGS PANEL ====
  renderAzanSettings() {
    const s = Store.getAzanSettings();
    const lib = API.azanLibrary;
    const currentAzan = API.getAzanById(s.voice);
    const isPlaying = API.isAzanPlaying();

    return `
      <div class="azan-settings-panel">
        <!-- Master Azan Toggle -->
        <div class="setting-item">
          <span class="setting-label">\uD83D\uDD14 Azan Enabled</span>
          <div class="toggle ${s.enabled ? 'on' : ''}" onclick="Store.setAzanSetting('enabled',!Store.getAzanSettings().enabled);Screens.renderProfile()">
            <div class="toggle-knob"></div>
          </div>
        </div>

        <!-- Muezzin Voice Selection -->
        <div class="azan-voice-section">
          <div class="azan-section-title">Muezzin Voice</div>
          <div class="azan-voice-grid">
            ${lib.map(a => `
              <div class="azan-voice-card ${s.voice === a.id ? 'selected' : ''}" onclick="Store.setAzanSetting('voice','${a.id}');Screens.renderProfile()">
                <div class="azan-voice-icon">${a.id === 'makkah' ? '\uD83D\uDD4B' : a.id === 'madinah' ? '\uD83C\uDF1F' : a.id.includes('mishary') ? '\uD83C\uDFA4' : a.id === 'turkish' ? '\uD83C\uDDF9\uD83C\uDDF7' : a.id === 'alaqsa' ? '\uD83C\uDDFA\uD83C\uDDE6' : a.id === 'egyptian' ? '\uD83C\uDDEA\uD83C\uDDEC' : a.id === 'peaceful' ? '\uD83C\uDF3F' : a.id === 'short' ? '\u23F1' : '\uD83D\uDD4C'}</div>
                <div class="azan-voice-name">${a.name}</div>
                <div class="azan-voice-origin">${a.origin}</div>
                ${s.voice === a.id ? '<div class="azan-voice-check">\u2713</div>' : ''}
              </div>
            `).join('')}
          </div>
          <!-- Preview Button -->
          <div class="azan-preview-row">
            <button class="azan-preview-btn ${isPlaying ? 'playing' : ''}" onclick="${isPlaying ? 'API.stopAzan();Screens.renderProfile()' : `App.testAzan('${s.voice}');setTimeout(()=>Screens.renderProfile(),300)`}">
              ${isPlaying ? '\u23F9 Stop Preview' : `\u25B6 Preview: ${currentAzan.name}`}
            </button>
          </div>
        </div>

        <!-- Volume Control -->
        <div class="azan-volume-section">
          <div class="azan-section-title">\uD83D\uDD0A Volume: ${s.volume}%</div>
          <div class="azan-volume-row">
            <span class="azan-vol-label">\uD83D\uDD07</span>
            <input type="range" class="azan-volume-slider" min="0" max="100" value="${s.volume}"
              oninput="Store.setAzanSetting('volume',parseInt(this.value));document.querySelector('.azan-vol-pct').textContent=this.value+'%'"
              onchange="Store.setAzanSetting('volume',parseInt(this.value))">
            <span class="azan-vol-label">\uD83D\uDD0A</span>
            <span class="azan-vol-pct">${s.volume}%</span>
          </div>
        </div>

        <!-- Per-Prayer Azan Toggles -->
        <div class="azan-prayer-toggles">
          <div class="azan-section-title">Per-Prayer Azan</div>
          ${['fajr','dhuhr','asr','maghrib','isha'].map(p => {
            const icons = {fajr:'\uD83C\uDF19',dhuhr:'\u2600\uFE0F',asr:'\uD83C\uDF24\uFE0F',maghrib:'\uD83C\uDF05',isha:'\uD83C\uDF1B'};
            const names = {fajr:'Fajr',dhuhr:'Dhuhr',asr:'Asr',maghrib:'Maghrib',isha:'Isha'};
            return `
            <div class="azan-prayer-row">
              <span class="azan-prayer-icon">${icons[p]}</span>
              <span class="azan-prayer-name">${names[p]}</span>
              <div class="toggle ${s.prayers[p] ? 'on' : ''}" onclick="Store.setSetting('azan${names[p]}',!Store.getSetting('azan${names[p]}',true));Screens.renderProfile()">
                <div class="toggle-knob"></div>
              </div>
            </div>`;
          }).join('')}
        </div>

        <!-- Fajr Special Voice -->
        <div class="azan-fajr-special">
          <div class="setting-item">
            <span class="setting-label">\uD83C\uDF19 Special Fajr Voice</span>
            <div class="toggle ${s.fajrSpecial ? 'on' : ''}" onclick="Store.setAzanSetting('fajrSpecial',!Store.getAzanSettings().fajrSpecial);Screens.renderProfile()">
              <div class="toggle-knob"></div>
            </div>
          </div>
          ${s.fajrSpecial ? `
            <select class="quran-select" style="width:100%;margin-top:8px" onchange="Store.setAzanSetting('fajrVoice',this.value)">
              ${lib.map(a => `<option value="${a.id}" ${s.fajrVoice === a.id ? 'selected' : ''}>${a.name} - ${a.muezzin}</option>`).join('')}
            </select>
          ` : ''}
        </div>

        <!-- Pre-Azan Alert -->
        <div class="azan-prealert-section">
          <div class="azan-section-title">\u23F0 Pre-Azan Alert</div>
          <div class="azan-prealert-options">
            ${[0, 5, 10, 15, 30].map(m => `
              <button class="azan-prealert-btn ${s.preAlert === m ? 'active' : ''}"
                onclick="Store.setAzanSetting('preAlert',${m});Screens.renderProfile()">
                ${m === 0 ? 'Off' : m + ' min'}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Notification & Display Settings -->
        <div class="azan-notif-section">
          <div class="azan-section-title">Notification & Display</div>
          <div class="setting-item">
            <span class="setting-label">\uD83D\uDD14 Browser Notifications</span>
            <div class="toggle ${s.notifications ? 'on' : ''}" onclick="Store.setAzanSetting('notify',!Store.getAzanSettings().notifications);if(!Store.getAzanSettings().notifications)Notification.requestPermission();Screens.renderProfile()">
              <div class="toggle-knob"></div>
            </div>
          </div>
          <div class="setting-item">
            <span class="setting-label">\uD83D\uDCF1 Full-Screen Azan</span>
            <div class="toggle ${s.fullScreen ? 'on' : ''}" onclick="Store.setAzanSetting('fullScreen',!Store.getAzanSettings().fullScreen);Screens.renderProfile()">
              <div class="toggle-knob"></div>
            </div>
          </div>
          <div class="setting-item">
            <span class="setting-label">\uD83D\uDCF3 Vibration</span>
            <div class="toggle ${s.vibrate ? 'on' : ''}" onclick="Store.setAzanSetting('vibrate',!Store.getAzanSettings().vibrate);Screens.renderProfile()">
              <div class="toggle-knob"></div>
            </div>
          </div>
        </div>

        <!-- Test Azan Button -->
        <button class="azan-test-btn" onclick="App.triggerAzan({key:'test',name:'Test',time:new Date().getHours()+':'+String(new Date().getMinutes()).padStart(2,'0'),icon:'\uD83D\uDD4C'},Store.getAzanSettings())">
          \uD83D\uDD4C Test Full Azan Experience
        </button>
      </div>
    `;
  },

  // ==== PROFILE SCREEN ====
  renderProfile() {
    const el = document.getElementById('screen-profile');
    const stats = Store.getStats();
    const achievements = Store.getAchievements();
    const achievementList = [
      { id: 'first_prayer', icon: '\uD83E\uDDF3', name: 'First Prayer', desc: 'Log your first prayer' },
      { id: 'week_streak', icon: '\uD83D\uDD25', name: '7-Day Streak', desc: 'Maintain a 7-day streak' },
      { id: 'quran_reader', icon: '\uD83D\uDCD6', name: 'Quran Reader', desc: 'Read a complete surah' },
      { id: 'tasbih_100', icon: '\uD83D\uDCFF', name: 'Dhikr Devotee', desc: 'Complete 100 tasbih' },
      { id: 'tasbih_1000', icon: '\u2728', name: 'Dhikr Master', desc: 'Complete 1,000 tasbih' },
      { id: 'zakat_calc', icon: '\uD83D\uDCB0', name: 'Zakat Calculator', desc: 'Calculate your zakat' },
      { id: 'scholar_chat', icon: '\uD83E\uDDD1\u200D\uD83C\uDF93', name: 'Knowledge Seeker', desc: 'Ask the AI Scholar' }
    ];

    el.innerHTML = `
      <div class="profile-card">
        <div class="profile-avatar">A</div>
        <div class="profile-name">Allen</div>
        <div class="profile-level">Level ${stats.level} \u00B7 ${stats.xp} XP</div>
        <div class="xp-bar-wrap">
          <div class="xp-bar-bg"><div class="xp-bar-fill" style="width:${(stats.xp % 500) / 5}%"></div></div>
          <div class="xp-text">${500 - (stats.xp % 500)} XP to level ${stats.level + 1}</div>
        </div>
      </div>

      <div class="stats-grid">
        <div class="card stat-card"><div class="stat-num">${stats.streak}</div><div class="stat-label">Day Streak</div></div>
        <div class="card stat-card"><div class="stat-num">${stats.totalPrayers}</div><div class="stat-label">Prayers</div></div>
        <div class="card stat-card"><div class="stat-num">${stats.tasbihTotal}</div><div class="stat-label">Tasbih</div></div>
      </div>

      <div class="section-title">Achievements</div>
      ${achievementList.map(a => `
        <div class="achievement-item">
          <div class="achievement-icon ${achievements[a.id] ? 'unlocked' : ''}">${a.icon}</div>
          <div class="achievement-info">
            <div class="achievement-name" style="${achievements[a.id] ? '' : 'opacity:.5'}">${a.name}</div>
            <div class="achievement-desc">${achievements[a.id] ? 'Unlocked!' : a.desc}</div>
          </div>
        </div>
      `).join('')}

      <div class="section-title mt-16">\uD83D\uDD4C Azan Settings</div>
      ${Screens.renderAzanSettings()}

      <div class="section-title mt-16">Settings</div>
      <div class="setting-item">
        <span class="setting-label">Dark Mode</span>
        <div class="toggle on"><div class="toggle-knob"></div></div>
      </div>

      <div class="card mt-16 text-center" style="border:1px solid var(--surface)">
        <div style="font-size:13px;color:var(--text-sec)">\uD83D\uDD12 Privacy First</div>
        <div class="text-xs text-sec mt-8">All data stays on your device. Zero tracking. Zero data collection.</div>
      </div>

      <div class="text-center mt-16 mb-16">
        <div class="text-xs text-sec">DeenHub v2.0.0</div>
        <div class="text-xs text-sec">Built with \u2764\uFE0F for the Ummah</div>
      </div>
    `;
  }
};
