/* ============================================================
   DeenHub PWA — API Layer (Real Islamic APIs)
   ============================================================ */

const API = {
  // ---- Geolocation ----
  async getLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) return reject('Geolocation not supported');
      navigator.geolocation.getCurrentPosition(
        pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        err => {
          console.warn('Geolocation denied, using default (Dallas, TX)');
          resolve({ lat: 32.7767, lng: -96.7970 });
        },
        { timeout: 8000, enableHighAccuracy: false }
      );
    });
  },

  // ---- Prayer Times (Aladhan API) ----
  async getPrayerTimes(lat, lng) {
    try {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const yyyy = today.getFullYear();
      const url = `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${lat}&longitude=${lng}&method=2`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.code === 200) {
        const t = data.data.timings;
        return {
          fajr: t.Fajr, sunrise: t.Sunrise, dhuhr: t.Dhuhr,
          asr: t.Asr, maghrib: t.Maghrib, isha: t.Isha,
          date: data.data.date
        };
      }
    } catch (e) { console.error('Prayer API error:', e); }
    // Fallback
    return { fajr: '5:12', sunrise: '6:38', dhuhr: '12:15', asr: '3:45', maghrib: '6:22', isha: '7:42', date: null };
  },

  // ---- Quran (Al-Quran Cloud API) ----
  surahList: null,
  quranCache: {},

  reciters: [
    // ★ Popular
    { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy', flag: '🇰🇼', style: 'Murattal' },
    { id: 'ar.abdulbasitmurattal', name: 'Abdul Basit (Murattal)', flag: '🇪🇬', style: 'Murattal' },
    { id: 'ar.abdulbasitmujawwad', name: 'Abdul Basit (Mujawwad)', flag: '🇪🇬', style: 'Mujawwad' },
    { id: 'ar.abdurrahmaansudais', name: 'Abdurrahmaan As-Sudais', flag: '🇸🇦', style: 'Murattal' },
    { id: 'ar.husary', name: 'Mahmoud Khalil Al-Husary', flag: '🇪🇬', style: 'Murattal' },
    { id: 'ar.husarymujawwad', name: 'Al-Husary (Mujawwad)', flag: '🇪🇬', style: 'Mujawwad' },
    { id: 'ar.minshawi', name: 'Mohamed Siddiq El-Minshawi', flag: '🇪🇬', style: 'Murattal' },
    { id: 'ar.minshawimujawwad', name: 'El-Minshawi (Mujawwad)', flag: '🇪🇬', style: 'Mujawwad' },
    // ★ Renowned Reciters
    { id: 'ar.muhammadayyoub', name: 'Muhammad Ayyub', flag: '🇸🇦', style: 'Murattal' },
    { id: 'ar.ahmedajamy', name: 'Ahmed ibn Ali al-Ajamy', flag: '🇸🇦', style: 'Murattal' },
    { id: 'ar.maaborali', name: 'Maher Al-Muaiqly', flag: '🇸🇦', style: 'Murattal' },
    { id: 'ar.parhizgar', name: 'Shahriar Parhizgar', flag: '🇮🇷', style: 'Murattal' },
    { id: 'ar.ibrahimakhbar', name: 'Ibrahim Al-Akhdar', flag: '🇸🇦', style: 'Murattal' },
    { id: 'ar.abdullahbasfar', name: 'Abdullah Basfar', flag: '🇸🇦', style: 'Murattal' },
    { id: 'ar.haboribrahim', name: 'Hani Ar-Rifai', flag: '🇸🇦', style: 'Murattal' },
    { id: 'ar.mahermuaiqly', name: 'Maher Al Muaiqly', flag: '🇸🇦', style: 'Murattal' },
    // ★ International Reciters
    { id: 'ar.saaboramadan', name: 'Saad Al-Ghamdi', flag: '🇸🇦', style: 'Murattal' },
    { id: 'ar.aaborahman', name: 'Abdurrahman Al-Ossi', flag: '🇸🇦', style: 'Murattal' },
    { id: 'ar.walk', name: 'Ibrahim Walk', flag: '🇺🇸', style: 'English' },
    { id: 'ar.shaatree', name: 'Abu Bakr Al-Shatri', flag: '🇸🇦', style: 'Murattal' },
    { id: 'ar.khalifaaltoneiji', name: 'Khalifa Al-Tunaiji', flag: '🇦🇪', style: 'Murattal' },
    { id: 'ar.muhammadjibreel', name: 'Muhammad Jibreel', flag: '🇪🇬', style: 'Murattal' },
    { id: 'ar.abdulbari', name: 'Abdul Bari ath-Thubaity', flag: '🇸🇦', style: 'Murattal' },
    { id: 'ar.nabilrifa', name: 'Nabil Ar-Rifai', flag: '🇸🇾', style: 'Murattal' },
    { id: 'ar.hudhaify', name: 'Ali Al-Hudhaify', flag: '🇸🇦', style: 'Murattal' },
    { id: 'ar.tablawy', name: 'Muhammad Al-Tablawi', flag: '🇪🇬', style: 'Mujawwad' }
  ],

  translations: [
    // ═══ English ═══
    { id: 'en.sahih', name: 'Sahih International', lang: 'English', langCode: 'en', flag: '🇬🇧' },
    { id: 'en.asad', name: 'Muhammad Asad', lang: 'English', langCode: 'en', flag: '🇬🇧' },
    { id: 'en.pickthall', name: 'Pickthall', lang: 'English', langCode: 'en', flag: '🇬🇧' },
    { id: 'en.yusufali', name: 'Yusuf Ali', lang: 'English', langCode: 'en', flag: '🇬🇧' },
    { id: 'en.shakir', name: 'Shakir', lang: 'English', langCode: 'en', flag: '🇬🇧' },
    { id: 'en.hilali', name: 'Hilali & Khan', lang: 'English', langCode: 'en', flag: '🇬🇧' },
    { id: 'en.ahmedali', name: 'Ahmed Ali', lang: 'English', langCode: 'en', flag: '🇬🇧' },
    { id: 'en.sarwar', name: 'Sarwar', lang: 'English', langCode: 'en', flag: '🇬🇧' },
    // ═══ Urdu ═══
    { id: 'ur.ahmedali', name: 'Ahmed Ali', lang: 'Urdu', langCode: 'ur', flag: '🇵🇰' },
    { id: 'ur.jalandhry', name: 'Jalandhry', lang: 'Urdu', langCode: 'ur', flag: '🇵🇰' },
    { id: 'ur.maududi', name: 'Maududi', lang: 'Urdu', langCode: 'ur', flag: '🇵🇰' },
    // ═══ Bangla ═══
    { id: 'bn.bengali', name: 'Muhiuddin Khan', lang: 'বাংলা', langCode: 'bn', flag: '🇧🇩' },
    { id: 'bn.hoque', name: 'Zohurul Hoque', lang: 'বাংলা', langCode: 'bn', flag: '🇧🇩' },
    // ═══ Arabic (Tafsir) ═══
    { id: 'ar.jalalayn', name: 'Tafsir al-Jalalayn', lang: 'العربية', langCode: 'ar', flag: '🇸🇦' },
    { id: 'ar.muyassar', name: 'Tafsir al-Muyassar', lang: 'العربية', langCode: 'ar', flag: '🇸🇦' },
    // ═══ French ═══
    { id: 'fr.hamidullah', name: 'Hamidullah', lang: 'Français', langCode: 'fr', flag: '🇫🇷' },
    // ═══ Spanish ═══
    { id: 'es.cortes', name: 'Julio Cortes', lang: 'Español', langCode: 'es', flag: '🇪🇸' },
    { id: 'es.asad', name: 'Asad (Spanish)', lang: 'Español', langCode: 'es', flag: '🇪🇸' },
    // ═══ German ═══
    { id: 'de.aburida', name: 'Abu Rida', lang: 'Deutsch', langCode: 'de', flag: '🇩🇪' },
    { id: 'de.bubenheim', name: 'Bubenheim & Elyas', lang: 'Deutsch', langCode: 'de', flag: '🇩🇪' },
    // ═══ Turkish ═══
    { id: 'tr.ates', name: 'Süleyman Ateş', lang: 'Türkçe', langCode: 'tr', flag: '🇹🇷' },
    { id: 'tr.diyanet', name: 'Diyanet İşleri', lang: 'Türkçe', langCode: 'tr', flag: '🇹🇷' },
    { id: 'tr.ozturk', name: 'Öztürk', lang: 'Türkçe', langCode: 'tr', flag: '🇹🇷' },
    { id: 'tr.yazir', name: 'Elmalılı Yazır', lang: 'Türkçe', langCode: 'tr', flag: '🇹🇷' },
    { id: 'tr.yildirim', name: 'Suat Yıldırım', lang: 'Türkçe', langCode: 'tr', flag: '🇹🇷' },
    { id: 'tr.yuksel', name: 'Edip Yüksel', lang: 'Türkçe', langCode: 'tr', flag: '🇹🇷' },
    // ═══ Russian ═══
    { id: 'ru.kuliev', name: 'Kuliev', lang: 'Русский', langCode: 'ru', flag: '🇷🇺' },
    { id: 'ru.osmanov', name: 'Osmanov', lang: 'Русский', langCode: 'ru', flag: '🇷🇺' },
    { id: 'ru.krachkovsky', name: 'Krachkovsky', lang: 'Русский', langCode: 'ru', flag: '🇷🇺' },
    // ═══ Indonesian / Malay ═══
    { id: 'id.indonesian', name: 'Indonesian Ministry', lang: 'Bahasa Indonesia', langCode: 'id', flag: '🇮🇩' },
    { id: 'id.muntakhab', name: 'Muntakhab', lang: 'Bahasa Indonesia', langCode: 'id', flag: '🇮🇩' },
    { id: 'ms.basmeih', name: 'Basmeih', lang: 'Bahasa Melayu', langCode: 'ms', flag: '🇲🇾' },
    // ═══ Persian (Farsi) ═══
    { id: 'fa.makarem', name: 'Makarem', lang: 'فارسی', langCode: 'fa', flag: '🇮🇷' },
    { id: 'fa.ansarian', name: 'Ansarian', lang: 'فارسی', langCode: 'fa', flag: '🇮🇷' },
    { id: 'fa.fooladvand', name: 'Fooladvand', lang: 'فارسی', langCode: 'fa', flag: '🇮🇷' },
    { id: 'fa.ghomshei', name: 'Ghomshei', lang: 'فارسی', langCode: 'fa', flag: '🇮🇷' },
    // ═══ Hindi ═══
    { id: 'hi.hindi', name: 'Suhel Farooq Khan', lang: 'हिन्दी', langCode: 'hi', flag: '🇮🇳' },
    // ═══ Chinese ═══
    { id: 'zh.jian', name: 'Ma Jian (Simplified)', lang: '中文', langCode: 'zh', flag: '🇨🇳' },
    // ═══ Japanese ═══
    { id: 'ja.japanese', name: 'Japanese Translation', lang: '日本語', langCode: 'ja', flag: '🇯🇵' },
    // ═══ Korean ═══
    { id: 'ko.korean', name: 'Korean Translation', lang: '한국어', langCode: 'ko', flag: '🇰🇷' },
    // ═══ Italian ═══
    { id: 'it.piccardo', name: 'Piccardo', lang: 'Italiano', langCode: 'it', flag: '🇮🇹' },
    // ═══ Portuguese ═══
    { id: 'pt.elhayek', name: 'El-Hayek', lang: 'Português', langCode: 'pt', flag: '🇧🇷' },
    // ═══ Dutch ═══
    { id: 'nl.keyzer', name: 'Keyzer', lang: 'Nederlands', langCode: 'nl', flag: '🇳🇱' },
    // ═══ Swedish ═══
    { id: 'sv.bernstrom', name: 'Bernström', lang: 'Svenska', langCode: 'sv', flag: '🇸🇪' },
    // ═══ Polish ═══
    { id: 'pl.bielawskiego', name: 'Bielawski', lang: 'Polski', langCode: 'pl', flag: '🇵🇱' },
    // ═══ Czech ═══
    { id: 'cs.hrbek', name: 'Hrbek', lang: 'Čeština', langCode: 'cs', flag: '🇨🇿' },
    // ═══ Tamil ═══
    { id: 'ta.tamil', name: 'Jan Turst Foundation', lang: 'தமிழ்', langCode: 'ta', flag: '🇮🇳' },
    // ═══ Malayalam ═══
    { id: 'ml.abdulhameed', name: 'Abdul Hameed & Parappur', lang: 'മലയാളം', langCode: 'ml', flag: '🇮🇳' },
    // ═══ Thai ═══
    { id: 'th.thai', name: 'Thai Translation', lang: 'ไทย', langCode: 'th', flag: '🇹🇭' },
    // ═══ Swahili ═══
    { id: 'sw.barwani', name: 'Al-Barwani', lang: 'Kiswahili', langCode: 'sw', flag: '🇹🇿' },
    // ═══ Hausa ═══
    { id: 'ha.gumi', name: 'Abubakar Gumi', lang: 'Hausa', langCode: 'ha', flag: '🇳🇬' },
    // ═══ Somali ═══
    { id: 'so.abduh', name: 'M. Abduh', lang: 'Soomaali', langCode: 'so', flag: '🇸🇴' },
    // ═══ Amazigh ═══
    { id: 'ber.mensur', name: 'Ramdane At Mansour', lang: 'ⵜⴰⵎⴰⵣⵉⵖⵜ', langCode: 'ber', flag: '🇩🇿' },
    // ═══ Albanian ═══
    { id: 'sq.ahmeti', name: 'Sherif Ahmeti', lang: 'Shqip', langCode: 'sq', flag: '🇦🇱' },
    { id: 'sq.nahi', name: 'Feti Mehdiu', lang: 'Shqip', langCode: 'sq', flag: '🇦🇱' },
    // ═══ Bosnian ═══
    { id: 'bs.korkut', name: 'Korkut', lang: 'Bosanski', langCode: 'bs', flag: '🇧🇦' },
    { id: 'bs.mlivo', name: 'Mlivo', lang: 'Bosanski', langCode: 'bs', flag: '🇧🇦' },
    // ═══ Azerbaijani ═══
    { id: 'az.mammadaliyev', name: 'Mammadaliyev & Bünyadov', lang: 'Azərbaycan', langCode: 'az', flag: '🇦🇿' },
    { id: 'az.musayev', name: 'Musayev', lang: 'Azərbaycan', langCode: 'az', flag: '🇦🇿' },
    // ═══ Uzbek ═══
    { id: 'uz.sodik', name: 'Muhammad Sodik', lang: "O'zbek", langCode: 'uz', flag: '🇺🇿' },
    // ═══ Kurdish ═══
    { id: 'ku.asan', name: 'Burhan Muhammad-Amin', lang: 'Kurdî', langCode: 'ku', flag: '🇮🇶' },
    // ═══ Tatar ═══
    { id: 'tt.nugman', name: 'Yakub Ibn Nugman', lang: 'Татарча', langCode: 'tt', flag: '🇷🇺' },
    // ═══ Sindhi ═══
    { id: 'sd.amroti', name: 'Amroti', lang: 'سنڌي', langCode: 'sd', flag: '🇵🇰' },
    // ═══ Pashto ═══
    { id: 'ps.abdulwali', name: 'Abdulwali Khan', lang: 'پښتو', langCode: 'ps', flag: '🇦🇫' },
    // ═══ Divehi (Maldivian) ═══
    { id: 'dv.divehi', name: 'Office of the President', lang: 'ދިވެހި', langCode: 'dv', flag: '🇲🇻' },
    // ═══ Uyghur ═══
    { id: 'ug.saleh', name: 'Muhammad Saleh', lang: 'ئۇيغۇرچە', langCode: 'ug', flag: '🇨🇳' },
    // ═══ Nepali ═══
    { id: 'ne.nepali', name: 'Ahl-e-Hadith Central Soc.', lang: 'नेपाली', langCode: 'ne', flag: '🇳🇵' },
    // ═══ Romanian ═══
    { id: 'ro.grigore', name: 'Grigore', lang: 'Română', langCode: 'ro', flag: '🇷🇴' },
    // ═══ Bulgarian ═══
    { id: 'bg.theophanov', name: 'Theophanov', lang: 'Български', langCode: 'bg', flag: '🇧🇬' },
    // ═══ Norwegian ═══
    { id: 'no.berg', name: 'Einar Berg', lang: 'Norsk', langCode: 'no', flag: '🇳🇴' }
  ],

  juzData: [
    { juz: 1, surah: 1, ayah: 1, name: 'Alif Lam Meem' },
    { juz: 2, surah: 1, ayah: 187, name: 'Sayaqul' },
    { juz: 3, surah: 2, ayah: 253, name: 'Tilka Ar-Rusul' },
    { juz: 4, surah: 3, ayah: 93, name: 'Lantanal Birr' },
    { juz: 5, surah: 4, ayah: 24, name: 'Wal-Muhsanat' },
    { juz: 6, surah: 4, ayah: 148, name: 'Laa Yuhibbullah' },
    { juz: 7, surah: 5, ayah: 83, name: 'Wa Iza Sami-u' },
    { juz: 8, surah: 6, ayah: 111, name: 'Wa Lau Anna' },
    { juz: 9, surah: 7, ayah: 88, name: 'Qalal Malau' },
    { juz: 10, surah: 8, ayah: 41, name: 'Wa A-lamuwa' },
    { juz: 11, surah: 9, ayah: 92, name: 'Ya Ayyuhalladhina' },
    { juz: 12, surah: 11, ayah: 6, name: 'Wa Ma Min Dabbatin' },
    { juz: 13, surah: 12, ayah: 53, name: 'Wa Ma Ubarrihu' },
    { juz: 14, surah: 15, ayah: 1, name: 'Alif Lam Ra' },
    { juz: 15, surah: 17, ayah: 1, name: 'Subhana Allathi' },
    { juz: 16, surah: 18, ayah: 74, name: 'Qala Alakayta' },
    { juz: 17, surah: 21, ayah: 1, name: 'Iqtaraba' },
    { juz: 18, surah: 23, ayah: 1, name: 'Qad Aflaha' },
    { juz: 19, surah: 25, ayah: 21, name: 'Wa Qala Alladhina' },
    { juz: 20, surah: 27, ayah: 56, name: 'Amma Yakfurun' },
    { juz: 21, surah: 29, ayah: 46, name: 'Wa A-manna' },
    { juz: 22, surah: 33, ayah: 31, name: 'Wa Man Yaqnit' },
    { juz: 23, surah: 36, ayah: 1, name: 'Ya Sin' },
    { juz: 24, surah: 39, ayah: 32, name: 'Fa Kafahu' },
    { juz: 25, surah: 43, ayah: 45, name: 'Faqad Anistu' },
    { juz: 26, surah: 46, ayah: 1, name: 'Ha Meem' },
    { juz: 27, surah: 51, ayah: 31, name: 'Wa Adhdhariyan' },
    { juz: 28, surah: 58, ayah: 1, name: 'Qad Sami-a' },
    { juz: 29, surah: 67, ayah: 1, name: 'Tabarak' },
    { juz: 30, surah: 78, ayah: 1, name: 'Amma Yatasaaluun' }
  ],

  async getSurahList() {
    if (this.surahList) return this.surahList;
    try {
      const res = await fetch('https://api.alquran.cloud/v1/surah');
      const data = await res.json();
      if (data.code === 200) {
        this.surahList = data.data.map(s => ({
          number: s.number,
          name: s.englishName,
          arabic: s.name,
          translation: s.englishNameTranslation,
          ayahs: s.numberOfAyahs,
          type: s.revelationType
        }));
        return this.surahList;
      }
    } catch (e) { console.error('Surah list error:', e); }
    return this._fallbackSurahs();
  },

  async getSurahText(number, reciterId = 'ar.alafasy', translationId = 'en.sahih') {
    const cacheKey = `${number}_${reciterId}_${translationId}`;
    if (this.quranCache[cacheKey]) return this.quranCache[cacheKey];

    try {
      const [arRes, enRes, trRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/surah/${number}/${reciterId}`),
        fetch(`https://api.alquran.cloud/v1/surah/${number}/${translationId}`),
        fetch(`https://api.alquran.cloud/v1/surah/${number}/en.transliteration`)
      ]);
      const [arData, enData, trData] = await Promise.all([arRes.json(), enRes.json(), trRes.json()]);

      if (arData.code === 200 && enData.code === 200 && trData.code === 200) {
        const result = arData.data.ayahs.map((a, i) => ({
          number: a.numberInSurah,
          globalNumber: a.number,
          arabic: a.text,
          translation: enData.data.ayahs[i]?.text || '',
          transliteration: trData.data.ayahs[i]?.text || '',
          audio: a.audio || '',
          words: a.text.split(' '),
          juz: a.juz,
          page: a.page,
          sajdah: a.sajdah || false
        }));
        this.quranCache[cacheKey] = result;
        return result;
      }
    } catch (e) { console.error('Surah text error:', e); }
    return [];
  },

  async searchQuran(query, translationId = 'en.sahih') {
    try {
      const res = await fetch(`https://api.alquran.cloud/v1/search/${encodeURIComponent(query)}/all/${translationId}`);
      const data = await res.json();
      if (data.code === 200) {
        return data.data.matches.map(m => ({
          surah: m.surah.number,
          surahName: m.surah.englishName,
          ayah: m.numberInSurah,
          text: m.text
        }));
      }
    } catch (e) { console.error('Search error:', e); }
    return [];
  },

  getJuzSurahs(juzNumber) {
    const juzInfo = this.juzData[juzNumber - 1];
    if (!juzInfo) return [];

    if (juzNumber === 30) {
      return this.surahList?.filter(s => s.number >= 78) || [];
    } else {
      const nextJuz = this.juzData[juzNumber];
      const endSurah = nextJuz.surah;
      return this.surahList?.filter(s => s.number >= juzInfo.surah && s.number <= endSurah) || [];
    }
  },

  // ---- Audio Player ----
  audioPlayer: null,
  audioCurrentUrl: null,
  audioState: 'paused',

  initAudioPlayer() {
    if (!this.audioPlayer) {
      this.audioPlayer = new Audio();
      this.audioPlayer.addEventListener('ended', () => {
        this.audioState = 'paused';
        if (Screens.onAyahAudioEnded) Screens.onAyahAudioEnded();
      });
      this.audioPlayer.addEventListener('timeupdate', () => {
        if (Screens.onAudioTimeUpdate) Screens.onAudioTimeUpdate();
      });
    }
    return this.audioPlayer;
  },

  playAyahAudio(url) {
    const player = this.initAudioPlayer();
    if (this.audioCurrentUrl !== url) {
      player.src = url;
      this.audioCurrentUrl = url;
    }
    player.play();
    this.audioState = 'playing';
  },

  pauseAudio() {
    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.audioState = 'paused';
    }
  },

  resumeAudio() {
    if (this.audioPlayer) {
      this.audioPlayer.play();
      this.audioState = 'playing';
    }
  },

  isPlaying() {
    return this.audioState === 'playing' && this.audioPlayer && !this.audioPlayer.paused;
  },

  getAudioDuration() {
    return this.audioPlayer?.duration || 0;
  },

  getAudioCurrentTime() {
    return this.audioPlayer?.currentTime || 0;
  },

  setAudioCurrentTime(time) {
    if (this.audioPlayer) this.audioPlayer.currentTime = time;
  },

  // ---- Hadith Data (bundled for offline) ----
  hadithCollections: [
    { id: 'bukhari', name: 'Sahih al-Bukhari', count: 7563, icon: '\uD83D\uDCD7' },
    { id: 'muslim', name: 'Sahih Muslim', count: 5362, icon: '\uD83D\uDCD8' },
    { id: 'abudawud', name: 'Sunan Abu Dawud', count: 5274, icon: '\uD83D\uDCD9' },
    { id: 'tirmidhi', name: 'Jami at-Tirmidhi', count: 3956, icon: '\uD83D\uDCDA' },
    { id: 'nasai', name: 'Sunan an-Nasai', count: 5758, icon: '\uD83D\uDCD3' },
    { id: 'ibnmajah', name: 'Sunan Ibn Majah', count: 4341, icon: '\uD83D\uDCD2' },
    { id: 'malik', name: "Muwatta Malik", count: 1832, icon: '\uD83D\uDCD4' },
    { id: 'ahmad', name: 'Musnad Ahmad', count: 26363, icon: '\uD83D\uDCD5' }
  ],

  // Sample hadith for each collection (pre-bundled for offline)
  sampleHadith: {
    bukhari: [
      { num: 1, text: "Actions are judged by intentions, and each person will be rewarded according to their intention.", narrator: "Umar ibn al-Khattab", grade: "Sahih", book: "Revelation", chapter: 1 },
      { num: 6, text: "The Prophet was the most generous of people, and he used to be even more generous during Ramadan.", narrator: "Ibn Abbas", grade: "Sahih", book: "Belief", chapter: 1 },
      { num: 8, text: "Islam is built upon five pillars: testifying that there is no god but Allah and Muhammad is His Messenger, establishing prayer, paying Zakat, making Hajj, and fasting Ramadan.", narrator: "Ibn Umar", grade: "Sahih", book: "Belief", chapter: 2 },
      { num: 13, text: "None of you truly believes until he loves for his brother what he loves for himself.", narrator: "Anas ibn Malik", grade: "Sahih", book: "Belief", chapter: 7 },
      { num: 16, text: "Whoever believes in Allah and the Last Day should speak good or remain silent.", narrator: "Abu Hurairah", grade: "Sahih", book: "Belief", chapter: 8 },
      { num: 52, text: "That which is lawful is clear and that which is unlawful is clear, and between them are doubtful matters.", narrator: "An-Nu'man ibn Bashir", grade: "Sahih", book: "Belief", chapter: 39 }
    ],
    muslim: [
      { num: 1, text: "The strong believer is better and more beloved to Allah than the weak believer, while there is good in both.", narrator: "Abu Hurairah", grade: "Sahih", book: "Qadr", chapter: 34 },
      { num: 2, text: "Verily, Allah does not look at your appearance or wealth, but He looks at your hearts and actions.", narrator: "Abu Hurairah", grade: "Sahih", book: "Righteousness", chapter: 33 },
      { num: 3, text: "He who relieves a believer of one of the hardships of this world, Allah will relieve him of a hardship on the Day of Resurrection.", narrator: "Abu Hurairah", grade: "Sahih", book: "Remembrance", chapter: 38 }
    ],
    abudawud: [
      { num: 1, text: "The best of you are those who learn the Quran and teach it.", narrator: "Uthman ibn Affan", grade: "Sahih", book: "Quran", chapter: 1 },
      { num: 2, text: "Make things easy and do not make them difficult, give good news and do not drive people away.", narrator: "Anas ibn Malik", grade: "Sahih", book: "Knowledge", chapter: 3 }
    ],
    tirmidhi: [
      { num: 1, text: "Take advantage of five before five: your youth before old age, your health before sickness, your wealth before poverty, your free time before becoming busy, and your life before death.", narrator: "Ibn Abbas", grade: "Sahih", book: "Zuhd", chapter: 25 }
    ],
    nasai: [
      { num: 1, text: "The most beloved deeds to Allah are the most consistent of them, even if they are small.", narrator: "Aisha", grade: "Sahih", book: "Night Prayer", chapter: 1 }
    ],
    ibnmajah: [
      { num: 1, text: "Seeking knowledge is an obligation upon every Muslim.", narrator: "Anas ibn Malik", grade: "Hasan", book: "Introduction", chapter: 17 }
    ],
    malik: [
      { num: 1, text: "I have left among you two things; you will never go astray as long as you hold fast to them: the Book of Allah and the Sunnah of His Messenger.", narrator: "Malik", grade: "Sahih", book: "Qadr", chapter: 3 }
    ],
    ahmad: [
      { num: 1, text: "Be in this world as if you were a stranger or a traveler.", narrator: "Ibn Umar", grade: "Sahih", book: "Zuhd", chapter: 1 }
    ]
  },

  getHadith(collection) {
    return this.sampleHadith[collection] || [];
  },

  // ---- Duas (Hisnul Muslim / Fortress of the Muslim - Comprehensive) ----
  duas: {
    morning: [
      { id: 'm1', arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", translit: "Asbahnaa wa asbahal-mulku lillaah, walhamdu lillaah, laa ilaaha illallaahu wahdahu laa shareeka lah, lahul-mulku wa lahul-hamdu wa Huwa 'alaa kulli shay'in Qadeer", trans: "We have reached the morning and at this very time the whole kingdom belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah alone, without partner. To Him belongs all sovereignty and praise, and He is over all things omnipotent.", ref: "Muslim 4/2088", repeat: 1 },
      { id: 'm2', arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ", translit: "Allaahumma bika asbahnaa wa bika amsaynaa wa bika nahyaa wa bika namootu wa ilaykan-nushoor", trans: "O Allah, by Your leave we have reached the morning, by Your leave we have reached the evening, by Your leave we live and die, and unto You is our resurrection.", ref: "Tirmidhi 5/466", repeat: 1 },
      { id: 'm3', arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي", translit: "Allaahumma innee as'alukal-'aafiyata fid-dunyaa wal-aakhirah. Allaahumma innee as'alukal-'afwa wal'aafiyata fee deenee wa dunyaaya wa ahlee wa maalee", trans: "O Allah, I ask You for well-being in this world and the Hereafter. O Allah, I ask You for pardon and well-being in my religion, my worldly affairs, my family and my wealth.", ref: "Ibn Majah 2/332", repeat: 1 },
      { id: 'm4', arabic: "اللَّهُمَّ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ فَاطِرَ السَّمَاوَاتِ وَالْأَرْضِ رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ", translit: "Allaahumma 'aalimal-ghaybi wash-shahaadati faatiras-samaawaati wal-ardhi Rabba kulli shay'in wa maleekah, ash-hadu an laa ilaaha illaa Anta, a'oothu bika min sharri nafsee wa min sharrish-shaytaani wa shirkihi", trans: "O Allah, Knower of the unseen and the seen, Creator of the heavens and the earth, Lord and Sovereign of all things, I bear witness that none has the right to be worshipped except You. I take refuge in You from the evil of my soul and the evil of Satan and his associates.", ref: "Abu Dawud 4/317", repeat: 1 },
      { id: 'm5', arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ", translit: "Bismillaahil-lathee laa yadhurru ma'as-mihi shay'un fil-ardhi wa laa fis-samaa'i wa Huwas-Samee'ul-'Aleem", trans: "In the name of Allah with whose name nothing on earth or in the heavens can cause harm, and He is the All-Hearing, All-Knowing.", ref: "Tirmidhi 1/465", repeat: 3 },
      { id: 'm6', arabic: "اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ", translit: "Allaahumma innee asbahtu ush-hiduka wa ush-hidu hamalata 'arshika wa malaa'ikataka wa jamee'a khalqika annaka Antallaahu laa ilaaha illaa Anta wa anna Muhammadan 'abduka wa Rasooluk", trans: "O Allah, I have reached the morning, and I call on You, the bearers of Your Throne, Your angels, and all of Your creation to witness that You are Allah, none has the right to be worshipped except You, alone without partner, and that Muhammad is Your slave and messenger.", ref: "Abu Dawud 4/317", repeat: 4 },
      { id: 'm7', arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", translit: "Subhaanallaahi wa bihamdih", trans: "Glory is to Allah and praise is to Him.", ref: "Muslim 4/2071", repeat: 100 },
      { id: 'm8', arabic: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", translit: "Laa ilaaha illallaahu wahdahu laa shareeka lah, lahul-mulku wa lahul-hamdu wa Huwa 'alaa kulli shay'in Qadeer", trans: "None has the right to be worshipped except Allah alone, without partner. To Him belongs all sovereignty and praise, and He is over all things omnipotent.", ref: "Bukhari 4/95", repeat: 10 }
    ],
    evening: [
      { id: 'e1', arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", translit: "Amsaynaa wa amsal-mulku lillaah, walhamdu lillaah, laa ilaaha illallaahu wahdahu laa shareeka lah, lahul-mulku wa lahul-hamdu wa Huwa 'alaa kulli shay'in Qadeer", trans: "We have reached the evening and at this very time the whole kingdom belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah alone, without partner.", ref: "Muslim 4/2088", repeat: 1 },
      { id: 'e2', arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ", translit: "Allaahumma bika amsaynaa wa bika asbahnaa wa bika nahyaa wa bika namootu wa ilaykal-maseer", trans: "O Allah, by Your leave we have reached the evening, by Your leave we have reached the morning, by Your leave we live and die, and unto You is our return.", ref: "Tirmidhi 5/466", repeat: 1 },
      { id: 'e3', arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ", translit: "A'oothu bikalimaatil-laahit-taammaati min sharri maa khalaq", trans: "I seek refuge in the perfect words of Allah from the evil of what He has created.", ref: "Muslim 4/2081", repeat: 3 },
      { id: 'e4', arabic: "اللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ", translit: "Allaahumma maa amsaa bee min ni'matin aw bi-ahadin min khalqika faminka wahdaka laa shareeka laka falakal-hamdu wa lakash-shukr", trans: "O Allah, what blessing I or any of Your creation have come upon this evening is from You alone, without partner, so for You is all praise and unto You all thanks.", ref: "Abu Dawud 4/318", repeat: 1 },
      { id: 'e5', arabic: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ أَصْلِحْ لِي شَأْنِي كُلَّهُ وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ", translit: "Yaa Hayyu yaa Qayyoomu birahmatika astagheethu aslih lee sha'nee kullahu wa laa takilnee ilaa nafsee tarfata 'ayn", trans: "O Ever-Living, O Self-Sustaining, in Your mercy I seek relief. Set right all my affairs and do not leave me to myself even for the blink of an eye.", ref: "Hakim 1/545", repeat: 1 }
    ],
    sleep: [
      { id: 's1', arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا", translit: "Bismika Allaahumma amootu wa ahyaa", trans: "In Your name, O Allah, I die and I live.", ref: "Bukhari 11/113", repeat: 1 },
      { id: 's2', arabic: "اللَّهُمَّ إِنَّكَ خَلَقْتَ نَفْسِي وَأَنْتَ تَوَفَّاهَا لَكَ مَمَاتُهَا وَمَحْيَاهَا إِنْ أَحْيَيْتَهَا فَاحْفَظْهَا وَإِنْ أَمَتَّهَا فَاغْفِرْ لَهَا اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ", translit: "Allaahumma innaka khalaqta nafsee wa Anta tawaffaahaa laka mamaatuhaa wa mahyaahaa in ahyaytahaa fahfadh-haa wa in amattahaa faghfir lahaa. Allaahumma innee as'alukal-'aafiyah", trans: "O Allah, verily You have created my soul and You shall take its life. To You belongs its life and death. If You keep it alive then protect it, and if You cause it to die then forgive it. O Allah, I ask You for well-being.", ref: "Muslim 4/2083", repeat: 1 },
      { id: 's3', arabic: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ", translit: "Allaahumma qinee 'athaabaka yawma tab'athu 'ibaadak", trans: "O Allah, protect me from Your punishment on the Day You resurrect Your servants.", ref: "Abu Dawud 4/311", repeat: 3 },
      { id: 's4', arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَكَفَانَا وَآوَانَا فَكَمْ مِمَّنْ لَا كَافِيَ لَهُ وَلَا مُؤْوِيَ", translit: "Alhamdu lillaahil-lathee at'amanaa wa saqaanaa wa kafaanaa wa aawaanaa fakam mimman laa kaafiya lahu wa laa mu'wee", trans: "All praise is for Allah, who fed us and gave us drink, and who is sufficient for us and has sheltered us, for how many have none to suffice them or shelter them.", ref: "Muslim 4/2085", repeat: 1 }
    ],
    waking: [
      { id: 'w1', arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ", translit: "Alhamdu lillaahil-lathee ahyaanaa ba'da maa amaatanaa wa ilayhin-nushoor", trans: "All praise is for Allah who gave us life after having taken it from us, and unto Him is the resurrection.", ref: "Bukhari 11/113", repeat: 1 },
      { id: 'w2', arabic: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ", translit: "Laa ilaaha illallaahu wahdahu laa shareeka lah, lahul-mulku wa lahul-hamdu wa Huwa 'alaa kulli shay'in Qadeer. Subhaanallaahi walhamdu lillaahi wa laa ilaaha illallaahu wallaahu akbar. Wa laa hawla wa laa quwwata illaa billaahil-'Aliyyil-'Adheem", trans: "None has the right to be worshipped except Allah alone without partner. To Him belongs all sovereignty and praise, and He is over all things omnipotent. Glory is to Allah, praise is to Allah, none has the right to be worshipped except Allah, Allah is the Greatest, and there is no might or power except with Allah the Most High, the Most Great.", ref: "Bukhari (Fath Al-Bari 3/39)", repeat: 1 }
    ],
    prayer: [
      { id: 'p1', arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", translit: "Rabbanaaa aatinaa fid-dunyaa hasanatan wa fil-aakhirati hasanatan wa qinaa 'athaaban-naar", trans: "Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.", ref: "Quran 2:201", repeat: 1 },
      { id: 'p2', arabic: "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِنْ ذُرِّيَّتِي رَبَّنَا وَتَقَبَّلْ دُعَاءِ", translit: "Rabbij'alnee muqeemas-salaati wa min thurriyyatee Rabbanaa wa taqabbal du'aa'", trans: "My Lord, make me an establisher of prayer, and from my descendants. Our Lord, accept my supplication.", ref: "Quran 14:40", repeat: 1 },
      { id: 'p3', arabic: "سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَاللَّهُ أَكْبَرُ", translit: "Subhaanallaah, Alhamdu lillaah, Allaahu akbar", trans: "Glory is to Allah (33x), Praise is to Allah (33x), Allah is the Greatest (34x) - said after every prayer.", ref: "Muslim 1/418", repeat: 33 },
      { id: 'p4', arabic: "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ", translit: "Allaahumma a'innee 'alaa thikrika wa shukrika wa husni 'ibaadatik", trans: "O Allah, help me to remember You, to give You thanks, and to worship You in the best way.", ref: "Abu Dawud 2/86", repeat: 1 },
      { id: 'p5', arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ وَمِنْ عَذَابِ جَهَنَّمَ وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ", translit: "Allaahumma innee a'oothu bika min 'athaabil-qabri wa min 'athaabi Jahannama wa min fitnatil-mahyaa walmamaati wa min sharri fitnatil-Maseehid-Dajjaal", trans: "O Allah, I seek refuge in You from the punishment of the grave, the torment of the Fire, the trials of life and death, and the evil of the trial of the False Messiah.", ref: "Bukhari 2/102", repeat: 1 }
    ],
    protection: [
      { id: 'pr1', arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ", translit: "Bismillaahil-lathee laa yadhurru ma'as-mihi shay'un fil-ardhi wa laa fis-samaa'i wa Huwas-Samee'ul-'Aleem", trans: "In the name of Allah with whose name nothing on earth or in the heavens can cause harm, and He is the All-Hearing, All-Knowing.", ref: "Tirmidhi 1/465", repeat: 3 },
      { id: 'pr2', arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ وَالْبُخْلِ وَالْجُبْنِ وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ", translit: "Allaahumma innee a'oothu bika minal-hammi walhazani wal'ajzi walkasali walbukhli waljubni wa dhala'id-dayni wa ghalabatir-rijaal", trans: "O Allah, I seek refuge in You from anxiety and sorrow, weakness and laziness, miserliness and cowardice, the burden of debts and from being overpowered by men.", ref: "Bukhari 7/158", repeat: 1 },
      { id: 'pr3', arabic: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ", translit: "Hasbiyal-laahu laa ilaaha illaa Huwa 'alayhi tawakkaltu wa Huwa Rabbul-'Arshil-'Adheem", trans: "Allah is sufficient for me. There is no deity except Him. On Him I have relied, and He is the Lord of the Great Throne.", ref: "Quran 9:129", repeat: 7 },
      { id: 'pr4', arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ الَّتِي لَا يُجَاوِزُهُنَّ بَرٌّ وَلَا فَاجِرٌ مِنْ شَرِّ مَا خَلَقَ وَذَرَأَ وَبَرَأَ", translit: "A'oothu bikalimaatil-laahit-taamaatil-latee laa yujaawizuhunna barrun wa laa faajir, min sharri maa khalaqa wa thara'a wa bara'a", trans: "I seek refuge in the perfect words of Allah which neither the righteous nor the wicked can transgress, from the evil of what He has created, made, and originated.", ref: "Ahmad 3/419", repeat: 1 },
      { id: 'pr5', arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِوَجْهِكَ الْكَرِيمِ وَكَلِمَاتِكَ التَّامَّاتِ مِنْ شَرِّ مَا أَنْتَ آخِذٌ بِنَاصِيَتِهِ", translit: "Allaahumma innee a'oothu biwajhikal-kareemi wa kalimaatikat-taammaati min sharri maa Anta aakhithun binaasiyatih", trans: "O Allah, I seek refuge in Your Noble Face and Your perfect words from the evil of that which You seize by its forelock.", ref: "Abu Dawud 4/12", repeat: 1 }
    ],
    travel: [
      { id: 't1', arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ", translit: "Subhaanal-lathee sakhkhara lanaa haathaa wa maa kunnaa lahu muqrineen. Wa innaa ilaa Rabbinaa lamunqaliboon", trans: "Glory be to Him who has subjected this to us, for we could never have it by our efforts. And verily, to Our Lord we shall return.", ref: "Quran 43:13-14", repeat: 1 },
      { id: 't2', arabic: "اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى وَمِنَ الْعَمَلِ مَا تَرْضَى اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا وَاطْوِ عَنَّا بُعْدَهُ", translit: "Allaahumma innaa nas'aluka fee safarinaa haathal-birra wattaqwaa wa minal-'amali maa tardhaa. Allaahumma hawwin 'alaynaa safaranaa haathaa watwi 'annaa bu'dah", trans: "O Allah, we ask You in this journey for righteousness and piety, and for deeds that please You. O Allah, make this journey easy for us and shorten the distance.", ref: "Muslim 2/998", repeat: 1 },
      { id: 't3', arabic: "آيِبُونَ تَائِبُونَ عَابِدُونَ لِرَبِّنَا حَامِدُونَ", translit: "Aa'iboona taa'iboona 'aabidoona li-Rabbinaa haamidoon", trans: "We return, repent, worship, and praise our Lord.", ref: "Muslim 2/998", repeat: 1 }
    ],
    food: [
      { id: 'f1', arabic: "بِسْمِ اللَّهِ", translit: "Bismillaah", trans: "In the name of Allah.", ref: "Abu Dawud 3/347", repeat: 1 },
      { id: 'f2', arabic: "بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ", translit: "Bismillaahi wa 'alaa barakatillaah", trans: "In the name of Allah and with the blessings of Allah.", ref: "Abu Dawud 3/347", repeat: 1 },
      { id: 'f3', arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ", translit: "Alhamdu lillaahil-lathee at'amanee haathaa wa razaqaneehi min ghayri hawlin minnee wa laa quwwah", trans: "All praise is for Allah who fed me this and provided it for me without any might nor power from myself.", ref: "Tirmidhi/Abu Dawud", repeat: 1 },
      { id: 'f4', arabic: "الْحَمْدُ لِلَّهِ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ غَيْرَ مَكْفِيٍّ وَلَا مُوَدَّعٍ وَلَا مُسْتَغْنًى عَنْهُ رَبَّنَا", translit: "Alhamdu lillaahi hamdan katheeran tayyiban mubaarakan feehi ghayra makfiyyin wa laa muwadda'in wa laa mustaghnan 'anhu Rabbanaa", trans: "Praise be to Allah, much praise, good and blessed. Our Lord, it is not compensated, nor is it bid farewell, nor is it dispensed with.", ref: "Bukhari 6/214", repeat: 1 }
    ],
    home: [
      { id: 'h1', arabic: "بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى رَبِّنَا تَوَكَّلْنَا", translit: "Bismillaahi walajnaa wa bismillaahi kharajnaa wa 'alaa Rabbinaa tawakkalnaa", trans: "In the name of Allah we enter and in the name of Allah we leave, and upon our Lord we place our trust.", ref: "Abu Dawud 4/325", repeat: 1 },
      { id: 'h2', arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ", translit: "Bismillaahi tawakkaltu 'alallaahi wa laa hawla wa laa quwwata illaa billaah", trans: "In the name of Allah, I place my trust in Allah. There is no might nor power except with Allah.", ref: "Tirmidhi 5/490", repeat: 1 },
      { id: 'h3', arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ أَنْ أَضِلَّ أَوْ أُضَلَّ أَوْ أَزِلَّ أَوْ أُزَلَّ أَوْ أَظْلِمَ أَوْ أُظْلَمَ أَوْ أَجْهَلَ أَوْ يُجْهَلَ عَلَيَّ", translit: "Allaahumma innee a'oothu bika an adhilla aw udhalla aw azilla aw uzalla aw adhlima aw udhlama aw ajhala aw yujhala 'alayy", trans: "O Allah, I seek refuge in You lest I misguide others or be misguided, lest I cause others to slip or be caused to slip, lest I oppress or be oppressed, lest I behave foolishly or be treated foolishly.", ref: "Abu Dawud 4/325", repeat: 1 }
    ],
    mosque: [
      { id: 'ms1', arabic: "أَعُوذُ بِاللَّهِ الْعَظِيمِ وَبِوَجْهِهِ الْكَرِيمِ وَسُلْطَانِهِ الْقَدِيمِ مِنَ الشَّيْطَانِ الرَّجِيمِ", translit: "A'oothu billaahil-'Adheemi wa biwajhihil-kareemi wa sultaanihil-qadeemi minash-Shaytaanir-rajeem", trans: "I seek refuge in Almighty Allah, by His Noble Face, by His primordial power, from Satan the outcast.", ref: "Abu Dawud", repeat: 1 },
      { id: 'ms2', arabic: "بِسْمِ اللَّهِ وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ", translit: "Bismillaahi wassalaatu wassalaamu 'alaa Rasoolillaah. Allaahummaf-tah lee abwaaba rahmatik", trans: "In the name of Allah, and prayers and peace be upon the Messenger of Allah. O Allah, open the gates of Your mercy for me.", ref: "Muslim 1/494", repeat: 1 },
      { id: 'ms3', arabic: "بِسْمِ اللَّهِ وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ", translit: "Bismillaahi wassalaatu wassalaamu 'alaa Rasoolillaah. Allaahumma innee as'aluka min fadhlika", trans: "In the name of Allah, and prayers and peace be upon the Messenger of Allah. O Allah, I ask You from Your favor (said when leaving the mosque).", ref: "Muslim 1/494", repeat: 1 }
    ],
    quran: [
      { id: 'q1', arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", translit: "Rabbanaaa aatinaa fid-dunyaa hasanatan wa fil-aakhirati hasanatan wa qinaa 'athaaban-naar", trans: "Our Lord, give us in this world that which is good and in the Hereafter that which is good, and protect us from the punishment of the Fire.", ref: "Quran 2:201", repeat: 1 },
      { id: 'q2', arabic: "رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِنْ لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ", translit: "Rabbanaa dhalamnaaa anfusanaa wa in lam taghfir lanaa wa tarhamnaa lanakoonanna minal-khaasireen", trans: "Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers.", ref: "Quran 7:23", repeat: 1 },
      { id: 'q3', arabic: "رَبَّنَا لَا تُؤَاخِذْنَا إِنْ نَسِينَا أَوْ أَخْطَأْنَا رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِنْ قَبْلِنَا", translit: "Rabbanaa laa tu'aakhithnaa in naseenaa aw akhtaanaa. Rabbanaa wa laa tahmil 'alaynaa isran kamaa hamaltahu 'alal-latheena min qablinaa", trans: "Our Lord, do not impose blame upon us if we forget or make a mistake. Our Lord, and lay not upon us a burden like that which You laid upon those before us.", ref: "Quran 2:286", repeat: 1 },
      { id: 'q4', arabic: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا", translit: "Rabbanaa hab lanaa min azwaajinaa wa thurriyyaatinaa qurrata a'yunin waj'alnaa lilmuttaqeena imaamaa", trans: "Our Lord, grant us from among our spouses and offspring comfort to our eyes and make us leaders for the righteous.", ref: "Quran 25:74", repeat: 1 },
      { id: 'q5', arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي يَفْقَهُوا قَوْلِي", translit: "Rabbish-rah lee sadree wa yassir lee amree wahlul 'uqdatan min lisaanee yafqahoo qawlee", trans: "My Lord, expand for me my chest, ease my task for me, and untie the knot from my tongue that they may understand my speech.", ref: "Quran 20:25-28", repeat: 1 },
      { id: 'q6', arabic: "رَبِّ زِدْنِي عِلْمًا", translit: "Rabbi zidnee 'ilmaa", trans: "My Lord, increase me in knowledge.", ref: "Quran 20:114", repeat: 1 },
      { id: 'q7', arabic: "رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ", translit: "Rabbanaa taqabbal minnee innaka Antas-Samee'ul-'Aleem", trans: "Our Lord, accept from us. Indeed You are the Hearing, the Knowing.", ref: "Quran 2:127", repeat: 1 },
      { id: 'q8', arabic: "رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا وَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ", translit: "Rabbanaaa afrigh 'alaynaa sabran wa thabbit aqdaamanaa wansurnaa 'alal-qawmil-kaafireen", trans: "Our Lord, pour upon us patience and plant firmly our feet and give us victory over the disbelieving people.", ref: "Quran 2:250", repeat: 1 }
    ],
    forgiveness: [
      { id: 'fg1', arabic: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ", translit: "Astaghfirullaaha al-'adheema alathee laa ilaaha illaa Huwal-Hayyul-Qayyoomu wa atoobu ilayh", trans: "I seek the forgiveness of Allah the Mighty, whom there is none worthy of worship except He, the Living, the Sustainer, and I turn to Him in repentance.", ref: "Tirmidhi 5/569", repeat: 3 },
      { id: 'fg2', arabic: "رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ", translit: "Rabbigh-fir lee wa tub 'alayya innaka Antat-Tawwaabur-Raheem", trans: "My Lord, forgive me and turn to me in mercy, for You are the Oft-Returning, Most Merciful.", ref: "Abu Dawud 2/85", repeat: 100 },
      { id: 'fg3', arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ", translit: "Allaahumma Anta Rabbee laa ilaaha illaa Anta khalaqtanee wa anaa 'abduka wa anaa 'alaa 'ahdika wa wa'dika mastata'tu a'oothu bika min sharri maa sana'tu aboo'u laka bini'matika 'alayya wa aboo'u bithanbee faghfir lee fa-innahu laa yaghfiruth-thunooba illaa Anta", trans: "O Allah, You are my Lord. None has the right to be worshipped except You. You created me and I am Your servant, and I abide by Your covenant and promise as best I can. I seek refuge in You from the evil of what I have done. I acknowledge Your favor upon me and I acknowledge my sin, so forgive me, for verily none can forgive sin except You.", ref: "Bukhari 7/150 (Sayyidul-Istighfar)", repeat: 1 }
    ],
    anxiety: [
      { id: 'ax1', arabic: "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ", translit: "Laa ilaaha illaa Anta subhaanaka innee kuntu minadh-dhaalimeen", trans: "None has the right to be worshipped except You. Glory be to You! Verily, I have been of the wrongdoers.", ref: "Quran 21:87", repeat: 1 },
      { id: 'ax2', arabic: "اللَّهُمَّ إِنِّي عَبْدُكَ ابْنُ عَبْدِكَ ابْنُ أَمَتِكَ نَاصِيَتِي بِيَدِكَ مَاضٍ فِيَّ حُكْمُكَ عَدْلٌ فِيَّ قَضَاؤُكَ أَسْأَلُكَ بِكُلِّ اسْمٍ هُوَ لَكَ سَمَّيْتَ بِهِ نَفْسَكَ", translit: "Allaahumma innee 'abduka ibnu 'abdika ibnu amatika naasiyatee biyadika maadhin fiyya hukmuka 'adlun fiyya qadhaa'uka as'aluka bikulli ismin huwa laka sammayta bihi nafsak", trans: "O Allah, I am Your slave, son of Your slave, son of Your maidservant. My forelock is in Your hand, Your command over me is forever executed, and Your decree over me is just. I ask You by every name belonging to You...", ref: "Ahmad 1/391", repeat: 1 },
      { id: 'ax3', arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ وَالْبُخْلِ وَالْجُبْنِ وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ", translit: "Allaahumma innee a'oothu bika minal-hammi walhazani wal'ajzi walkasali walbukhli waljubni wa dhala'id-dayni wa ghalabatir-rijaal", trans: "O Allah, I seek refuge in You from anxiety and sorrow, weakness and laziness, miserliness and cowardice, the burden of debts and from being overpowered by men.", ref: "Bukhari 7/158", repeat: 1 },
      { id: 'ax4', arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ", translit: "Hasbunallaahu wa ni'mal-wakeel", trans: "Allah is sufficient for us, and He is the best Disposer of affairs.", ref: "Quran 3:173", repeat: 1 }
    ],
    sickness: [
      { id: 'sk1', arabic: "أَذْهِبِ الْبَأْسَ رَبَّ النَّاسِ وَاشْفِ أَنْتَ الشَّافِي لَا شِفَاءَ إِلَّا شِفَاؤُكَ شِفَاءً لَا يُغَادِرُ سَقَمًا", translit: "Ath-hibil-ba'sa Rabban-naasi washfi Antash-Shaafee laa shifaa'a illaa shifaa'uka shifaa'an laa yughaadiru saqamaa", trans: "Remove the hardship, O Lord of mankind. Grant cure, for You are the Healer. There is no cure but Your cure — a cure that leaves behind no ailment.", ref: "Bukhari 7/131", repeat: 1 },
      { id: 'sk2', arabic: "بِسْمِ اللَّهِ أَرْقِيكَ مِنْ كُلِّ شَيْءٍ يُؤْذِيكَ مِنْ شَرِّ كُلِّ نَفْسٍ أَوْ عَيْنِ حَاسِدٍ اللَّهُ يَشْفِيكَ بِسْمِ اللَّهِ أَرْقِيكَ", translit: "Bismillaahi arqeeka min kulli shay'in yu'theeka min sharri kulli nafsin aw 'ayni haasidin Allaahu yashfeeka bismillaahi arqeek", trans: "In the name of Allah I perform ruqyah for you, from everything that is harming you, from the evil of every soul or envious eye. May Allah heal you, in the name of Allah I perform ruqyah for you.", ref: "Muslim 4/1718", repeat: 3 },
      { id: 'sk3', arabic: "أَسْأَلُ اللَّهَ الْعَظِيمَ رَبَّ الْعَرْشِ الْعَظِيمِ أَنْ يَشْفِيَكَ", translit: "As'alullaaha al-'adheema Rabbal-'arshil-'adheemi an yashfiyak", trans: "I ask Allah the Mighty, the Lord of the Mighty Throne, to cure you.", ref: "Tirmidhi 2/210", repeat: 7 }
    ],
    daily: [
      { id: 'd1', arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا", translit: "Allaahumma innee as'aluka 'ilman naafi'an wa rizqan tayyiban wa 'amalan mutaqabbalaa", trans: "O Allah, I ask You for beneficial knowledge, good sustenance, and accepted deeds.", ref: "Ibn Majah 1/152", repeat: 1 },
      { id: 'd2', arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ عَلَيْكَ تَوَكَّلْتُ وَأَنْتَ رَبُّ الْعَرْشِ الْعَظِيمِ", translit: "Allaahumma Anta Rabbee laa ilaaha illaa Anta 'alayka tawakkaltu wa Anta Rabbul-'Arshil-'Adheem", trans: "O Allah, You are my Lord. There is no deity except You. In You I place my trust, and You are Lord of the Mighty Throne.", ref: "Ibn Majah 1/557", repeat: 1 },
      { id: 'd3', arabic: "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ اللَّهُمَّ أْجُرْنِي فِي مُصِيبَتِي وَأَخْلِفْ لِي خَيْرًا مِنْهَا", translit: "Innaa lillaahi wa innaa ilayhi raaji'oon. Allaahummajurnee fee museebatee wa akhlif lee khayran minhaa", trans: "Indeed we belong to Allah and indeed to Him we will return. O Allah, reward me for my affliction and replace it for me with something better.", ref: "Muslim 2/632", repeat: 1 },
      { id: 'd4', arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ", translit: "Laa hawla wa laa quwwata illaa billaah", trans: "There is no might nor power except with Allah.", ref: "Bukhari 11/213", repeat: 1 },
      { id: 'd5', arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ", translit: "Allaahumma salli 'alaa Muhammadin wa 'alaa aali Muhammadin kamaa sallayta 'alaa Ibraaheema wa 'alaa aali Ibraaheema innaka Hameedun Majeed", trans: "O Allah, send prayers upon Muhammad and the family of Muhammad, as You sent prayers upon Ibrahim and the family of Ibrahim. You are indeed Worthy of Praise, Full of Glory.", ref: "Bukhari 6/408", repeat: 10 }
    ]
  },

  // Dua audio URLs (using Quran.com CDN for Quranic duas, placeholder for hadith duas)
  duaAudioBase: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/',

  getDuas(category) {
    return this.duas[category] || [];
  },

  getDuaCategories() {
    return [
      { id: 'morning', name: 'Morning', icon: '\uD83C\uDF05', count: this.duas.morning.length },
      { id: 'evening', name: 'Evening', icon: '\uD83C\uDF07', count: this.duas.evening.length },
      { id: 'sleep', name: 'Sleep', icon: '\uD83C\uDF19', count: this.duas.sleep.length },
      { id: 'waking', name: 'Waking', icon: '\u2600\uFE0F', count: this.duas.waking.length },
      { id: 'prayer', name: 'Prayer', icon: '\uD83E\uDDF3', count: this.duas.prayer.length },
      { id: 'quran', name: 'Quranic', icon: '\uD83D\uDCD6', count: this.duas.quran.length },
      { id: 'forgiveness', name: 'Forgiveness', icon: '\uD83E\uDD32', count: this.duas.forgiveness.length },
      { id: 'protection', name: 'Protection', icon: '\uD83D\uDEE1\uFE0F', count: this.duas.protection.length },
      { id: 'anxiety', name: 'Anxiety', icon: '\uD83E\uDE77', count: this.duas.anxiety.length },
      { id: 'sickness', name: 'Healing', icon: '\uD83C\uDF3F', count: this.duas.sickness.length },
      { id: 'travel', name: 'Travel', icon: '\u2708\uFE0F', count: this.duas.travel.length },
      { id: 'food', name: 'Food', icon: '\uD83C\uDF7D\uFE0F', count: this.duas.food.length },
      { id: 'home', name: 'Home', icon: '\uD83C\uDFE0', count: this.duas.home.length },
      { id: 'mosque', name: 'Mosque', icon: '\uD83D\uDD4C', count: this.duas.mosque.length },
      { id: 'daily', name: 'Daily', icon: '\u2B50', count: this.duas.daily.length }
    ];
  },

  // ---- Qibla Calculation ----
  calculateQibla(lat, lng) {
    const kaabaLat = 21.4225 * Math.PI / 180;
    const kaabaLng = 39.8262 * Math.PI / 180;
    const myLat = lat * Math.PI / 180;
    const myLng = lng * Math.PI / 180;
    const dLng = kaabaLng - myLng;
    const x = Math.sin(dLng);
    const y = Math.cos(myLat) * Math.tan(kaabaLat) - Math.sin(myLat) * Math.cos(dLng);
    let qibla = Math.atan2(x, y) * 180 / Math.PI;
    return (qibla + 360) % 360;
  },

  // ---- Zakat ----
  calculateZakat(gold, silver, cash, stocks, property, debts) {
    const total = (gold || 0) + (silver || 0) + (cash || 0) + (stocks || 0) + (property || 0);
    const net = total - (debts || 0);
    const nisab = 5500; // approx $5,500 USD (85g gold)
    const eligible = net >= nisab;
    const amount = eligible ? net * 0.025 : 0;
    return { total, net, nisab, eligible, amount };
  },

  // ---- AI Scholar (keyword-based) ----
  aiResponses: {
    prayer: "Prayer (Salah) is the second pillar of Islam. Muslims pray five times daily: Fajr (dawn), Dhuhr (noon), Asr (afternoon), Maghrib (sunset), and Isha (night). Each prayer connects the believer directly to Allah. The Prophet (PBUH) said: 'The first matter that the slave will be brought to account for on the Day of Judgment is prayer.'",
    quran: "The Quran is the holy book of Islam, revealed to Prophet Muhammad (PBUH) over 23 years through Angel Jibreel. It contains 114 surahs (chapters) and 6,236 ayahs (verses). It is the primary source of Islamic law and guidance. The Prophet said: 'The best of you are those who learn the Quran and teach it.'",
    ramadan: "Ramadan is the ninth month of the Islamic calendar, during which Muslims fast from dawn to sunset. It commemorates the first revelation of the Quran to Prophet Muhammad (PBUH). Fasting during Ramadan is one of the Five Pillars of Islam. It includes increased prayer, Quran recitation, charity, and self-reflection.",
    hajj: "Hajj is the annual Islamic pilgrimage to Makkah, Saudi Arabia. It is the fifth pillar of Islam and is obligatory for every able-bodied Muslim who can afford it, at least once in their lifetime. The rituals include Tawaf (circling the Kaaba), Sa'i (walking between Safa and Marwa), and standing at Arafat.",
    zakat: "Zakat is the third pillar of Islam — obligatory charity of 2.5% of qualifying wealth annually. It purifies wealth and helps those in need. It is calculated on savings held for one lunar year that exceed the Nisab threshold (approximately 85 grams of gold). Recipients include the poor, needy, and travelers.",
    fasting: "Fasting (Sawm) is the fourth pillar of Islam. During Ramadan, Muslims abstain from food, drink, and other physical needs from dawn to sunset. The purpose is to develop self-discipline, God-consciousness (taqwa), and empathy for the less fortunate.",
    wudu: "Wudu (ablution) is the Islamic ritual of washing before prayer. The steps are: intention (niyyah), washing hands 3x, rinsing mouth 3x, nose 3x, face 3x, arms to elbows 3x, wiping the head once, and washing feet to ankles 3x. Wudu is required before Salah and touching the Quran.",
    shahada: "The Shahada is the Islamic declaration of faith: 'La ilaha illallah, Muhammadur Rasulullah' — There is no god but Allah, and Muhammad is His Messenger. It is the first pillar of Islam and the most fundamental expression of belief.",
    default: "As-salamu alaykum! I can help you learn about Islamic topics including prayer, the Quran, Hadith, Ramadan, Hajj, Zakat, fasting, Wudu, and more. Please ask me any question about Islam and I'll do my best to provide accurate, sourced information."
  },

  getAIResponse(question) {
    const q = question.toLowerCase();
    for (const [key, response] of Object.entries(this.aiResponses)) {
      if (key !== 'default' && q.includes(key)) return response;
    }
    if (q.includes('salah') || q.includes('pray')) return this.aiResponses.prayer;
    if (q.includes('fast') || q.includes('sawm')) return this.aiResponses.fasting;
    if (q.includes('ablution') || q.includes('wash')) return this.aiResponses.wudu;
    if (q.includes('pillar')) return "The Five Pillars of Islam are: 1) Shahada (declaration of faith), 2) Salah (five daily prayers), 3) Zakat (obligatory charity of 2.5%), 4) Sawm (fasting during Ramadan), and 5) Hajj (pilgrimage to Makkah). These are the foundation of a Muslim's faith and practice.";
    if (q.includes('prophet') || q.includes('muhammad') || q.includes('pbuh')) return "Prophet Muhammad (PBUH) was the final messenger of Allah, born in Makkah in 570 CE. He received the first revelation of the Quran at age 40 in the Cave of Hira. His life (Sunnah) and sayings (Hadith) form the second most important source of Islamic guidance after the Quran.";
    return this.aiResponses.default;
  },

  // ---- Islamic Calendar (approximate) ----
  getHijriDate() {
    const today = new Date();
    // Approximate Hijri conversion
    const jd = Math.floor((today.getTime() / 86400000) + 2440587.5);
    const l = jd - 1948440 + 10632;
    const n = Math.floor((l - 1) / 10631);
    const l2 = l - 10631 * n + 354;
    const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) + Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
    const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
    const month = Math.floor((24 * l3) / 709);
    const day = l3 - Math.floor((709 * month) / 24);
    const year = 30 * n + j - 30;
    const months = ['Muharram','Safar','Rabi al-Awwal','Rabi al-Thani','Jumada al-Ula','Jumada al-Thani','Rajab','Shaban','Ramadan','Shawwal','Dhul Qadah','Dhul Hijjah'];
    return { day, month, year, monthName: months[month - 1] || 'Unknown' };
  },

  // ---- Fallback data ----
  _fallbackSurahs() {
    return [
      { number: 1, name: "Al-Fatihah", arabic: "الفاتحة", translation: "The Opening", ayahs: 7, type: "Meccan" },
      { number: 2, name: "Al-Baqarah", arabic: "البقرة", translation: "The Cow", ayahs: 286, type: "Medinan" },
      { number: 3, name: "Ali 'Imran", arabic: "آل عمران", translation: "Family of Imran", ayahs: 200, type: "Medinan" },
      { number: 4, name: "An-Nisa", arabic: "النساء", translation: "The Women", ayahs: 176, type: "Medinan" },
      { number: 36, name: "Ya-Sin", arabic: "يس", translation: "Ya Sin", ayahs: 83, type: "Meccan" },
      { number: 55, name: "Ar-Rahman", arabic: "الرحمن", translation: "The Beneficent", ayahs: 78, type: "Medinan" },
      { number: 67, name: "Al-Mulk", arabic: "الملك", translation: "The Sovereignty", ayahs: 30, type: "Meccan" },
      { number: 112, name: "Al-Ikhlas", arabic: "الإخلاص", translation: "The Sincerity", ayahs: 4, type: "Meccan" },
      { number: 113, name: "Al-Falaq", arabic: "الفلق", translation: "The Daybreak", ayahs: 5, type: "Meccan" },
      { number: 114, name: "An-Nas", arabic: "الناس", translation: "Mankind", ayahs: 6, type: "Meccan" }
    ];
  },

  // ---- Azan / Adhan Audio System ----
  azanAudio: null,
  azanFading: false,

  // Curated library of real Azan recordings from Internet Archive (verified working)
  // Source: https://archive.org/details/adhans_sunnah
  azanLibrary: [
    {
      id: 'makkah',
      name: 'Makkah (Al-Haram)',
      muezzin: 'Sheikh Ali Ahmed Mulla',
      desc: 'Official Makkah Haramain Azan',
      url: 'https://archive.org/download/adhans_sunnah/adhan_makkah.mp3',
      origin: 'Makkah, Saudi Arabia',
      style: 'Hijazi'
    },
    {
      id: 'mishary',
      name: 'Mishary Rashid Alafasy',
      muezzin: 'Mishary Rashid Alafasy',
      desc: 'Beautiful melodious Azan by the renowned Kuwaiti reciter',
      url: 'https://archive.org/download/adhans_sunnah/adhan_mishari.mp3',
      origin: 'Kuwait',
      style: 'Kuwaiti'
    },
    {
      id: 'madinah',
      name: 'Madinah (Al-Nabawi)',
      muezzin: 'Madinah Muezzin',
      desc: 'From the Prophet\'s Mosque in Madinah',
      url: 'https://archive.org/download/adhans_sunnah/adhan_madina.mp3',
      origin: 'Madinah, Saudi Arabia',
      style: 'Hijazi'
    },
    {
      id: 'egyptian',
      name: 'Egyptian Classic',
      muezzin: 'Egyptian Muezzin',
      desc: 'Traditional Egyptian Azan with rich maqam melody',
      url: 'https://archive.org/download/adhans_sunnah/adhan_egypt.mp3',
      origin: 'Cairo, Egypt',
      style: 'Egyptian/Maqam Bayati'
    },
    {
      id: 'abdulbaset',
      name: 'Abdul Basit',
      muezzin: 'Sheikh Abdul Basit Abdul Samad',
      desc: 'Legendary Egyptian Quran reciter\'s Azan',
      url: 'https://archive.org/download/adhans_sunnah/adhan_abdul_baset.mp3',
      origin: 'Egypt',
      style: 'Egyptian Classical'
    },
    {
      id: 'alafasy',
      name: 'Alafasy (Extended)',
      muezzin: 'Mishary Rashid Alafasy',
      desc: 'Full-length beautiful rendition by Alafasy',
      url: 'https://archive.org/download/adhans_sunnah/Athan_alafasi_nice.mp3',
      origin: 'Kuwait',
      style: 'Kuwaiti'
    },
    {
      id: 'qatami',
      name: 'Nasser Al-Qatami',
      muezzin: 'Nasser Al-Qatami',
      desc: 'Renowned Saudi reciter with powerful voice',
      url: 'https://archive.org/download/adhans_sunnah/adhan_nasser_al_qatami.mp3',
      origin: 'Saudi Arabia',
      style: 'Najdi'
    },
    {
      id: 'fajr',
      name: 'Fajr Azan (Mishary)',
      muezzin: 'Mishary Rashid Alafasy',
      desc: 'Special dawn prayer Azan — serene and spiritual',
      url: 'https://archive.org/download/adhans_sunnah/adhan_morning_mishari.mp3',
      origin: 'Kuwait',
      style: 'Fajr Special'
    },
    {
      id: 'halab',
      name: 'Aleppo (Syrian)',
      muezzin: 'Syrian Muezzin',
      desc: 'Traditional Syrian Halabi style Azan',
      url: 'https://archive.org/download/adhans_sunnah/adhan_halab.mp3',
      origin: 'Aleppo, Syria',
      style: 'Syrian/Halabi'
    },
    {
      id: 'madinah1952',
      name: 'Madinah Classic (1952)',
      muezzin: 'Historic Madinah Muezzin',
      desc: 'Rare historical recording from Masjid Al-Nabawi',
      url: 'https://archive.org/download/adhans_sunnah/adhan_madina_1952.mp3',
      origin: 'Madinah, Saudi Arabia',
      style: 'Historic Hijazi'
    },
    {
      id: 'tareq',
      name: 'Tareq Mohammad',
      muezzin: 'Tareq Mohammad',
      desc: 'Beautiful full-length Azan with rich vocal range',
      url: 'https://archive.org/download/adhans_sunnah/Azan_Tareq_Mohammad.mp3',
      origin: 'Middle East',
      style: 'Classical Arabic'
    },
    {
      id: 'kurtish',
      name: 'Kurdish Style',
      muezzin: 'Molana (Kurdish)',
      desc: 'Unique Kurdish-influenced Azan melody',
      url: 'https://archive.org/download/adhans_sunnah/athan_molana_kurtish.mp3',
      origin: 'Kurdistan',
      style: 'Kurdish'
    }
  ],

  getAzanById(id) {
    return this.azanLibrary.find(a => a.id === id) || this.azanLibrary[0];
  },

  async playAzan(azanId, volume = 0.8) {
    this.stopAzan();
    const azan = this.getAzanById(azanId || Store.getSetting('azanVoice', 'makkah'));
    try {
      this.azanAudio = new Audio(azan.url);
      this.azanAudio.volume = Math.min(1, Math.max(0, volume));
      this.azanAudio.crossOrigin = 'anonymous';
      this.azanAudio.addEventListener('ended', () => {
        this.azanAudio = null;
        // Dispatch custom event so UI can update
        window.dispatchEvent(new CustomEvent('azanEnded'));
      });
      this.azanAudio.addEventListener('error', (e) => {
        console.warn('Azan audio failed, trying fallback tone:', e);
        this.playFallbackAzan(volume);
      });
      await this.azanAudio.play();
      return true;
    } catch (e) {
      console.warn('Azan play error:', e);
      this.playFallbackAzan(volume);
      return false;
    }
  },

  stopAzan() {
    if (this.azanAudio) {
      this.azanAudio.pause();
      this.azanAudio.currentTime = 0;
      this.azanAudio = null;
    }
    this.azanFading = false;
  },

  setAzanVolume(vol) {
    if (this.azanAudio) {
      this.azanAudio.volume = Math.min(1, Math.max(0, vol));
    }
  },

  isAzanPlaying() {
    return this.azanAudio && !this.azanAudio.paused;
  },

  // Fallback: simple tonal Azan using Web Audio API
  playFallbackAzan(volume = 0.8) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const gainNode = ctx.createGain();
      gainNode.gain.value = volume * 0.3;
      gainNode.connect(ctx.destination);
      // Play a simple melodic pattern reminiscent of Azan tones
      const notes = [440, 494, 523, 587, 523, 494, 440, 392, 440];
      const durations = [0.8, 0.4, 0.8, 1.2, 0.8, 0.4, 0.8, 0.6, 1.5];
      let startTime = ctx.currentTime + 0.1;
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const noteGain = ctx.createGain();
        noteGain.gain.setValueAtTime(volume * 0.2, startTime);
        noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + durations[i]);
        osc.connect(noteGain);
        noteGain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + durations[i]);
        startTime += durations[i] + 0.1;
      });
    } catch (e) {
      console.warn('Fallback azan failed:', e);
    }
  },

  // Preview an Azan (play for 15 seconds then fade out)
  async previewAzan(azanId, volume = 0.8) {
    await this.playAzan(azanId, volume);
    if (this.azanAudio) {
      setTimeout(() => {
        if (this.azanAudio && !this.azanFading) {
          this.azanFading = true;
          const fadeInterval = setInterval(() => {
            if (this.azanAudio && this.azanAudio.volume > 0.05) {
              this.azanAudio.volume = Math.max(0, this.azanAudio.volume - 0.05);
            } else {
              clearInterval(fadeInterval);
              this.stopAzan();
            }
          }, 100);
        }
      }, 15000);
    }
  }
};
