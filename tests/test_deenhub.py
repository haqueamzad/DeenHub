#!/usr/bin/env python3
"""
DeenHub PWA — Comprehensive Test Suite
Tests: HTML structure, CSS integrity, JS syntax, API endpoints, asset loading,
       Quran UI features (toggles, tajweed, font controls, navigation)
"""

import os
import re
import json
import unittest
import requests
from pathlib import Path
from bs4 import BeautifulSoup

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
CSS_FILE = BASE_DIR / "css" / "app.css"
JS_DIR = BASE_DIR / "js"
INDEX_FILE = BASE_DIR / "index.html"
MANIFEST_FILE = BASE_DIR / "manifest.json"
SW_FILE = BASE_DIR / "sw.js"

LIVE_URL = "https://haqueamzad.github.io/DeenHub/"
QURAN_API = "https://api.alquran.cloud/v1"


class TestHTMLStructure(unittest.TestCase):
    """Validate index.html structure and required elements."""

    @classmethod
    def setUpClass(cls):
        cls.html = INDEX_FILE.read_text(encoding="utf-8")
        cls.soup = BeautifulSoup(cls.html, "html.parser")

    def test_doctype(self):
        self.assertTrue(self.html.strip().startswith("<!DOCTYPE html"))

    def test_viewport_meta(self):
        meta = self.soup.find("meta", attrs={"name": "viewport"})
        self.assertIsNotNone(meta, "viewport meta tag missing")

    def test_manifest_link(self):
        link = self.soup.find("link", attrs={"rel": "manifest"})
        self.assertIsNotNone(link, "manifest link missing")
        self.assertEqual(link["href"], "manifest.json")

    def test_css_link(self):
        link = self.soup.find("link", attrs={"rel": "stylesheet", "href": "css/app.css"})
        self.assertIsNotNone(link, "app.css stylesheet link missing")

    def test_js_scripts_present(self):
        scripts = [s.get("src", "") for s in self.soup.find_all("script")]
        for js in ["js/api.js", "js/storage.js", "js/screens.js", "js/app.js"]:
            self.assertTrue(any(js in s for s in scripts), f"{js} script tag missing")

    def test_app_div(self):
        self.assertIsNotNone(self.soup.find("div", id="app"), "#app container missing")

    def test_header_elements(self):
        self.assertIsNotNone(self.soup.find("div", class_="header"), ".header missing")
        self.assertIsNotNone(self.soup.find("div", id="header-title"), "#header-title missing")

    def test_tab_bar(self):
        tabs = self.soup.find("div", class_="tab-bar")
        self.assertIsNotNone(tabs, ".tab-bar missing")

    def test_screen_area(self):
        screens = self.soup.find_all("div", class_="screen")
        self.assertGreater(len(screens), 0, "No .screen containers found")


class TestCSSIntegrity(unittest.TestCase):
    """Validate CSS file structure, required selectors, and syntax."""

    @classmethod
    def setUpClass(cls):
        cls.css = CSS_FILE.read_text(encoding="utf-8")

    def test_file_not_empty(self):
        self.assertGreater(len(self.css), 1000, "CSS file unexpectedly small")

    def test_root_variables(self):
        for var in ["--primary", "--bg", "--card", "--surface", "--text", "--gold"]:
            self.assertIn(var, self.css, f"CSS variable {var} missing")

    def test_balanced_braces(self):
        opens = self.css.count("{")
        closes = self.css.count("}")
        self.assertEqual(opens, closes, f"Unbalanced braces: {opens} open vs {closes} close")

    # --- Quran UI CSS selectors ---
    def test_quran_tab_styles(self):
        self.assertIn(".quran-tab", self.css)
        self.assertIn(".quran-tab.active", self.css)

    def test_quran_ayah_card(self):
        self.assertIn(".quran-ayah-card", self.css)

    def test_quran_word_styles(self):
        self.assertIn(".quran-word", self.css)
        self.assertIn(".quran-word-active", self.css)
        self.assertIn(".quran-word-read", self.css)

    def test_tajweed_classes(self):
        for rule in ["ghunna", "idgham", "ikhfaa", "iqlab", "qalqalah", "madd"]:
            self.assertIn(f".tajweed-{rule}", self.css, f"Tajweed class .tajweed-{rule} missing")

    def test_tajweed_legend(self):
        self.assertIn(".tajweed-legend", self.css)
        self.assertIn(".tajweed-legend-item", self.css)
        self.assertIn(".tajweed-legend-dot", self.css)

    def test_font_controls(self):
        self.assertIn(".quran-font-controls", self.css)
        self.assertIn(".quran-font-btn", self.css)
        self.assertIn(".quran-font-size", self.css)

    def test_surah_nav(self):
        self.assertIn(".quran-surah-nav", self.css)

    def test_play_all_btn(self):
        self.assertIn(".quran-play-all-btn", self.css)

    def test_audio_progress(self):
        self.assertIn(".quran-audio-progress", self.css)
        self.assertIn(".quran-audio-progress-bar", self.css)

    def test_settings_row(self):
        self.assertIn(".quran-settings-row", self.css)

    def test_toggle_styles(self):
        self.assertIn(".quran-toggle", self.css)
        self.assertIn(".quran-toggle.active", self.css)

    def test_bismillah(self):
        self.assertIn(".quran-bismillah", self.css)

    def test_juz_card(self):
        self.assertIn(".juz-card", self.css)
        self.assertIn(".juz-num", self.css)

    def test_search_styles(self):
        self.assertIn(".quran-search-result", self.css)
        self.assertIn(".quran-search-highlight", self.css)

    def test_audio_bar(self):
        self.assertIn(".quran-audio-bar", self.css)

    def test_word_pulse_animation(self):
        self.assertIn("@keyframes wordPulse", self.css)

    def test_no_syntax_errors_basic(self):
        """Check for common CSS syntax issues."""
        # No double semicolons
        self.assertNotRegex(self.css, r";;(?!\s*/\*)")
        # No empty rules (basic check)
        empty_rules = re.findall(r"\{[\s]*\}", self.css)
        self.assertEqual(len(empty_rules), 0, f"Found {len(empty_rules)} empty CSS rules")


class TestJavaScriptFiles(unittest.TestCase):
    """Validate JS files exist, are non-empty, and have basic structural integrity."""

    def test_all_js_files_exist(self):
        for name in ["api.js", "storage.js", "screens.js", "app.js"]:
            path = JS_DIR / name
            self.assertTrue(path.exists(), f"{name} missing")
            self.assertGreater(path.stat().st_size, 100, f"{name} too small")

    def test_screens_js_quran_features(self):
        code = (JS_DIR / "screens.js").read_text(encoding="utf-8")
        # Toggle buttons should be <button> not <label>
        self.assertIn("quran-toggle", code, "quran-toggle class missing in screens.js")
        # Tajweed feature
        self.assertIn("tajweed", code.lower(), "Tajweed feature missing")
        # Transliteration
        self.assertIn("transliteration", code.lower(), "Transliteration feature missing")
        # Font size controls
        self.assertIn("quranFontSize", code, "quranFontSize state missing")
        # Audio speed
        self.assertIn("quranAudioSpeed", code, "quranAudioSpeed state missing")
        # Play all
        self.assertIn("playAllAyahs", code, "playAllAyahs function missing")
        # Surah navigation
        self.assertIn("quran-surah-nav", code, "Surah navigation UI missing")

    def test_screens_js_no_broken_toggles(self):
        """Ensure toggles use button elements, not label+checkbox."""
        code = (JS_DIR / "screens.js").read_text(encoding="utf-8")
        # Count occurrences of old toggle pattern vs new
        old_pattern = re.findall(r'type=["\']checkbox["\'].*?quran', code, re.IGNORECASE)
        self.assertEqual(len(old_pattern), 0, "Found old checkbox-based toggle pattern")

    def test_app_js_structure(self):
        code = (JS_DIR / "app.js").read_text(encoding="utf-8")
        self.assertIn("navigate", code, "navigate function missing in app.js")

    def test_api_js_structure(self):
        code = (JS_DIR / "api.js").read_text(encoding="utf-8")
        self.assertIn("alquran", code.lower(), "Quran API reference missing in api.js")

    def test_service_worker(self):
        self.assertTrue(SW_FILE.exists(), "sw.js missing")
        code = SW_FILE.read_text(encoding="utf-8")
        self.assertIn("install", code.lower(), "SW install handler missing")


class TestManifest(unittest.TestCase):
    """Validate PWA manifest.json."""

    @classmethod
    def setUpClass(cls):
        cls.manifest = json.loads(MANIFEST_FILE.read_text(encoding="utf-8"))

    def test_name(self):
        self.assertIn("name", self.manifest)

    def test_short_name(self):
        self.assertIn("short_name", self.manifest)

    def test_start_url(self):
        self.assertIn("start_url", self.manifest)

    def test_display(self):
        self.assertEqual(self.manifest.get("display"), "standalone")

    def test_icons(self):
        icons = self.manifest.get("icons", [])
        self.assertGreater(len(icons), 0, "No icons in manifest")
        sizes = [i.get("sizes") for i in icons]
        self.assertTrue(any("192" in s for s in sizes if s), "192px icon missing")

    def test_theme_color(self):
        self.assertIn("theme_color", self.manifest)


def _can_reach_network():
    try:
        requests.get("https://api.alquran.cloud/v1/surah", timeout=5)
        return True
    except Exception:
        return False

_NETWORK = _can_reach_network()


@unittest.skipUnless(_NETWORK, "Network not available in sandbox")
class TestQuranAPI(unittest.TestCase):
    """Test Al-Quran Cloud API endpoints used by the app."""

    def test_surah_list(self):
        r = requests.get(f"{QURAN_API}/surah", timeout=15)
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertEqual(data["code"], 200)
        self.assertEqual(len(data["data"]), 114, "Should have 114 surahs")

    def test_surah_al_fatiha(self):
        r = requests.get(f"{QURAN_API}/surah/1", timeout=15)
        self.assertEqual(r.status_code, 200)
        data = r.json()["data"]
        self.assertEqual(data["number"], 1)
        self.assertEqual(data["numberOfAyahs"], 7)
        self.assertEqual(data["englishName"], "Al-Faatiha")

    def test_surah_with_translation(self):
        r = requests.get(f"{QURAN_API}/surah/1/en.asad", timeout=15)
        self.assertEqual(r.status_code, 200)
        data = r.json()["data"]
        self.assertGreater(len(data["ayahs"]), 0)
        self.assertIn("text", data["ayahs"][0])

    def test_surah_with_transliteration(self):
        r = requests.get(f"{QURAN_API}/surah/1/en.transliteration", timeout=15)
        self.assertEqual(r.status_code, 200)

    def test_audio_edition(self):
        r = requests.get(f"{QURAN_API}/surah/1/ar.alafasy", timeout=15)
        self.assertEqual(r.status_code, 200)
        data = r.json()["data"]
        self.assertIn("audio", data["ayahs"][0])

    def test_search_endpoint(self):
        r = requests.get(f"{QURAN_API}/search/mercy/all/en.asad", timeout=15)
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertGreater(data["data"]["count"], 0, "Search should return results")

    def test_juz_endpoint(self):
        r = requests.get(f"{QURAN_API}/juz/1/quran-uthmani", timeout=15)
        self.assertEqual(r.status_code, 200)


@unittest.skipUnless(_NETWORK, "Network not available in sandbox")
class TestLiveSite(unittest.TestCase):
    """Test the deployed GitHub Pages site."""

    @classmethod
    def setUpClass(cls):
        try:
            cls.response = requests.get(LIVE_URL, timeout=20)
            cls.available = True
        except Exception:
            cls.available = False

    def test_site_reachable(self):
        self.assertTrue(self.available, "Live site not reachable")
        self.assertEqual(self.response.status_code, 200)

    def test_html_content(self):
        if not self.available:
            self.skipTest("Site not reachable")
        self.assertIn("DeenHub", self.response.text)

    def test_css_accessible(self):
        r = requests.get(LIVE_URL + "css/app.css", timeout=15)
        self.assertEqual(r.status_code, 200)
        self.assertIn("--primary", r.text)

    def test_js_accessible(self):
        for js in ["js/app.js", "js/screens.js", "js/api.js", "js/storage.js"]:
            r = requests.get(LIVE_URL + js, timeout=15)
            self.assertEqual(r.status_code, 200, f"{js} not accessible")

    def test_manifest_accessible(self):
        r = requests.get(LIVE_URL + "manifest.json", timeout=15)
        self.assertEqual(r.status_code, 200)

    def test_service_worker_accessible(self):
        r = requests.get(LIVE_URL + "sw.js", timeout=15)
        self.assertEqual(r.status_code, 200)


class TestQuranToggleFeatures(unittest.TestCase):
    """Test that Quran toggle features are properly implemented in screens.js."""

    @classmethod
    def setUpClass(cls):
        cls.code = (JS_DIR / "screens.js").read_text(encoding="utf-8")

    def test_toggle_buttons_use_button_element(self):
        """Toggles should use <button> with quran-toggle class."""
        matches = re.findall(r'<button[^>]*class=["\'][^"\']*quran-toggle[^"\']*["\']', self.code)
        self.assertGreater(len(matches), 0, "No <button> toggles found")

    def test_tajweed_toggle_exists(self):
        self.assertRegex(self.code, r'(?i)tajweed.*toggle|toggle.*tajweed')

    def test_transliteration_toggle_exists(self):
        self.assertRegex(self.code, r'(?i)translit.*toggle|toggle.*translit')

    def test_translation_toggle_exists(self):
        self.assertRegex(self.code, r'(?i)translat|showTranslation')

    def test_font_size_increase_decrease(self):
        self.assertIn("quranFontSize", self.code)
        # Check for increment/decrement logic
        self.assertRegex(self.code, r'quranFontSize\s*[\+\-]=|quranFontSize\s*=\s*.*[\+\-]')

    def test_audio_speed_cycling(self):
        self.assertIn("cycleAudioSpeed", self.code)
        self.assertIn("quranAudioSpeed", self.code)

    def test_repeat_ayah_toggle(self):
        self.assertIn("quranRepeatAyah", self.code)

    def test_apply_tajweed_function(self):
        self.assertIn("applyTajweed", self.code)

    def test_play_all_ayahs_function(self):
        self.assertIn("playAllAyahs", self.code)

    def test_on_ayah_audio_ended(self):
        self.assertIn("onAyahAudioEnded", self.code)


class TestAzanSystem(unittest.TestCase):
    """Test the Azan/Adhan audio and notification system."""

    @classmethod
    def setUpClass(cls):
        cls.api_code = (JS_DIR / "api.js").read_text(encoding="utf-8")
        cls.app_code = (JS_DIR / "app.js").read_text(encoding="utf-8")
        cls.storage_code = (JS_DIR / "storage.js").read_text(encoding="utf-8")
        cls.screens_code = (JS_DIR / "screens.js").read_text(encoding="utf-8")
        cls.css = CSS_FILE.read_text(encoding="utf-8")

    # ---- API Layer: Azan Audio ----
    def test_azan_library_exists(self):
        self.assertIn("azanLibrary", self.api_code)

    def test_azan_library_has_multiple_voices(self):
        """Should have at least 8 muezzin voices."""
        count = self.api_code.count("id: '")
        self.assertGreaterEqual(count, 8, "Should have at least 8 Azan voices")

    def test_azan_voices_include_makkah(self):
        self.assertIn("makkah", self.api_code)
        self.assertIn("Makkah", self.api_code)

    def test_azan_voices_include_mishary(self):
        self.assertIn("mishary", self.api_code)
        self.assertIn("Mishary", self.api_code)

    def test_azan_voices_include_turkish(self):
        self.assertIn("turkish", self.api_code)

    def test_azan_voices_include_madinah(self):
        self.assertIn("madinah", self.api_code)

    def test_azan_voices_include_alaqsa(self):
        self.assertIn("alaqsa", self.api_code)

    def test_azan_voices_include_egyptian(self):
        self.assertIn("egyptian", self.api_code)

    def test_play_azan_function(self):
        self.assertIn("playAzan", self.api_code)

    def test_stop_azan_function(self):
        self.assertIn("stopAzan", self.api_code)

    def test_preview_azan_function(self):
        self.assertIn("previewAzan", self.api_code)

    def test_fallback_azan(self):
        self.assertIn("playFallbackAzan", self.api_code)
        self.assertIn("AudioContext", self.api_code)

    def test_azan_volume_control(self):
        self.assertIn("setAzanVolume", self.api_code)

    def test_azan_cdn_urls(self):
        self.assertIn("cdn.aladhan.com/audio/adhans", self.api_code)

    # ---- App Layer: Prayer Monitor ----
    def test_prayer_monitor_exists(self):
        self.assertIn("startAzanMonitor", self.app_code)

    def test_check_prayer_time(self):
        self.assertIn("checkPrayerTime", self.app_code)

    def test_trigger_azan(self):
        self.assertIn("triggerAzan", self.app_code)

    def test_pre_azan_alert(self):
        self.assertIn("showPreAzanAlert", self.app_code)

    def test_azan_overlay(self):
        self.assertIn("showAzanOverlay", self.app_code)

    def test_dismiss_azan(self):
        self.assertIn("dismissAzan", self.app_code)

    def test_notification_system(self):
        self.assertIn("sendAzanNotification", self.app_code)
        self.assertIn("Notification", self.app_code)

    def test_notification_permission(self):
        self.assertIn("requestNotificationPermission", self.app_code)

    def test_test_azan_function(self):
        self.assertIn("testAzan", self.app_code)

    def test_vibration_support(self):
        self.assertIn("vibrate", self.app_code)

    # ---- Storage: Azan Settings ----
    def test_azan_settings_storage(self):
        self.assertIn("getAzanSettings", self.storage_code)

    def test_azan_per_prayer_settings(self):
        for prayer in ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"]:
            self.assertIn(f"azan{prayer}", self.storage_code)

    def test_azan_voice_setting(self):
        self.assertIn("azanVoice", self.storage_code)

    def test_azan_volume_setting(self):
        self.assertIn("azanVolume", self.storage_code)

    def test_azan_pre_alert_setting(self):
        self.assertIn("azanPreAlert", self.storage_code)

    def test_fajr_special_voice(self):
        self.assertIn("azanFajrVoice", self.storage_code)
        self.assertIn("azanFajrSpecial", self.storage_code)

    def test_azan_trigger_tracking(self):
        self.assertIn("getLastAzanTrigger", self.storage_code)
        self.assertIn("setLastAzanTrigger", self.storage_code)

    # ---- UI: Azan Settings ----
    def test_azan_settings_ui(self):
        self.assertIn("renderAzanSettings", self.screens_code)

    def test_azan_voice_grid_ui(self):
        self.assertIn("azan-voice-grid", self.screens_code)
        self.assertIn("azan-voice-card", self.screens_code)

    def test_azan_preview_button(self):
        self.assertIn("azan-preview-btn", self.screens_code)

    def test_azan_volume_slider(self):
        self.assertIn("azan-volume-slider", self.screens_code)

    def test_per_prayer_toggle_ui(self):
        self.assertIn("azan-prayer-toggles", self.screens_code)

    def test_fajr_special_ui(self):
        self.assertIn("Special Fajr Voice", self.screens_code)

    def test_pre_alert_ui(self):
        self.assertIn("azan-prealert-btn", self.screens_code)

    def test_test_azan_button(self):
        self.assertIn("azan-test-btn", self.screens_code)

    # ---- CSS: Azan Styles ----
    def test_azan_overlay_css(self):
        self.assertIn(".azan-overlay", self.css)

    def test_azan_voice_card_css(self):
        self.assertIn(".azan-voice-card", self.css)
        self.assertIn(".azan-voice-card.selected", self.css)

    def test_azan_wave_animation(self):
        self.assertIn("@keyframes waveBar", self.css)
        self.assertIn(".azan-wave-bar", self.css)

    def test_azan_volume_slider_css(self):
        self.assertIn(".azan-volume-slider", self.css)

    def test_azan_overlay_arabic_text(self):
        self.assertIn(".azan-overlay-arabic", self.css)

    def test_azan_pray_button_css(self):
        self.assertIn(".azan-pray-btn", self.css)

    def test_azan_dua_section(self):
        self.assertIn(".azan-overlay-dua", self.css)


if __name__ == "__main__":
    unittest.main(verbosity=2)
