/* ============================================================
   DeenHub PWA — Environment Configuration
   Detects environment from hostname and provides config
   ============================================================ */

var Config = (function() {
  'use strict';

  // Detect environment from hostname
  function detectEnv() {
    var host = window.location.hostname;

    // Local development
    if (host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0') {
      return 'development';
    }

    // Cloudflare Pages preview/staging (branch deploys)
    // Pattern: <branch>.<project>.pages.dev
    if (host.includes('.pages.dev') && !host.match(/^[^.]+\.pages\.dev$/)) {
      return 'staging';
    }

    // GitHub Pages (legacy test)
    if (host.includes('github.io')) {
      return 'staging';
    }

    // Production: custom domain or root pages.dev
    return 'production';
  }

  var env = detectEnv();

  var configs = {
    development: {
      env: 'development',
      appName: 'DeenHub [DEV]',
      debug: true,
      analytics: false,
      sentryDSN: null,
      apiTimeout: 15000,
      cacheStrategy: 'network-first',
      swEnabled: false,
      showEnvBanner: true,
      bannerColor: '#FF6B6B',
      bannerText: 'LOCAL DEV'
    },
    staging: {
      env: 'staging',
      appName: 'DeenHub [TEST]',
      debug: true,
      analytics: false,
      sentryDSN: null,
      apiTimeout: 10000,
      cacheStrategy: 'network-first',
      swEnabled: true,
      showEnvBanner: true,
      bannerColor: '#FFAA33',
      bannerText: 'TEST'
    },
    production: {
      env: 'production',
      appName: 'DeenHub',
      debug: false,
      analytics: true,
      sentryDSN: null, // Add Sentry DSN here for error tracking
      apiTimeout: 8000,
      cacheStrategy: 'cache-first',
      swEnabled: true,
      showEnvBanner: false,
      bannerColor: null,
      bannerText: null
    }
  };

  var config = configs[env] || configs.production;

  // Inject environment banner for non-production
  if (config.showEnvBanner && typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
      var banner = document.createElement('div');
      banner.id = 'env-banner';
      banner.textContent = config.bannerText;
      banner.style.cssText =
        'position:fixed;top:0;left:0;right:0;z-index:99999;' +
        'background:' + config.bannerColor + ';color:#fff;' +
        'text-align:center;font-size:10px;font-weight:800;' +
        'padding:2px 0;letter-spacing:2px;opacity:0.9;' +
        'pointer-events:none;';
      document.body.appendChild(banner);
    });
  }

  // Debug logger — only logs in non-production
  function log() {
    if (config.debug && typeof console !== 'undefined') {
      console.log.apply(console, ['[DeenHub]'].concat(Array.prototype.slice.call(arguments)));
    }
  }

  function warn() {
    if (config.debug && typeof console !== 'undefined') {
      console.warn.apply(console, ['[DeenHub]'].concat(Array.prototype.slice.call(arguments)));
    }
  }

  return {
    env: config.env,
    appName: config.appName,
    debug: config.debug,
    analytics: config.analytics,
    sentryDSN: config.sentryDSN,
    apiTimeout: config.apiTimeout,
    cacheStrategy: config.cacheStrategy,
    swEnabled: config.swEnabled,
    isProd: env === 'production',
    isStaging: env === 'staging',
    isDev: env === 'development',
    log: log,
    warn: warn,

    // Version info — updated by build script
    version: '1.0.0',
    buildDate: '2026-03-14',
    commitHash: 'dev'
  };
})();
