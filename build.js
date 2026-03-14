#!/usr/bin/env node

/**
 * DeenHub PWA — Build Script
 *
 * Produces an optimized /dist folder ready for deployment:
 *   - Minifies CSS (removes comments, collapses whitespace)
 *   - Minifies JS (basic safe minification)
 *   - Stamps version, build date, and commit hash into config.js
 *   - Copies static assets (icons, manifest, index.html)
 *   - Generates _headers file for Cloudflare Pages (cache control)
 *   - Generates _redirects file for SPA routing
 *
 * Usage:
 *   node build.js                    # builds for production
 *   DEPLOY_ENV=staging node build.js # builds for staging
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');
const ENV = process.env.DEPLOY_ENV || 'production';
const COMMIT = (process.env.COMMIT_HASH || 'local').substring(0, 8);
const VERSION = require('./package.json').version || '1.0.0';
const BUILD_DATE = new Date().toISOString().split('T')[0];

console.log(`\n🏗️  Building DeenHub PWA`);
console.log(`   Environment: ${ENV}`);
console.log(`   Version:     ${VERSION}`);
console.log(`   Commit:      ${COMMIT}`);
console.log(`   Date:        ${BUILD_DATE}\n`);

// ── Helpers ──────────────────────────────────────────────

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function copyDir(src, dest) {
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  }
}

/**
 * Basic CSS minification (no dependencies needed):
 * - Removes comments
 * - Collapses whitespace
 * - Removes unnecessary semicolons
 */
function minifyCSS(css) {
  return css
    // Remove comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Collapse whitespace around selectors and properties
    .replace(/\s*([{}:;,>~+])\s*/g, '$1')
    // Collapse multiple spaces/newlines
    .replace(/\s+/g, ' ')
    // Remove spaces around media queries
    .replace(/@media\s+/g, '@media ')
    // Remove trailing semicolons before closing braces
    .replace(/;}/g, '}')
    // Trim
    .trim();
}

/**
 * Basic JS minification (safe, no AST parsing):
 * - Removes single-line comments (but not URLs with //)
 * - Removes multi-line comments
 * - Collapses multiple blank lines
 * - Trims lines
 */
function minifyJS(js) {
  return js
    // Remove multi-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove single-line comments (careful with URLs and regex)
    .replace(/([^:\/])\/\/(?!\/).*$/gm, '$1')
    // Collapse multiple blank lines into one
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    // Trim each line
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n')
    .trim();
}

// ── Build Steps ──────────────────────────────────────────

// 1. Clean dist
if (fs.existsSync(DIST)) {
  fs.rmSync(DIST, { recursive: true });
}
ensureDir(DIST);
console.log('✅ Cleaned dist/');

// 2. Copy static assets
copyFile(path.join(ROOT, 'index.html'), path.join(DIST, 'index.html'));
copyFile(path.join(ROOT, 'manifest.json'), path.join(DIST, 'manifest.json'));
copyDir(path.join(ROOT, 'icons'), path.join(DIST, 'icons'));
console.log('✅ Copied static assets');

// 3. Minify CSS
ensureDir(path.join(DIST, 'css'));
const cssRaw = fs.readFileSync(path.join(ROOT, 'css/app.css'), 'utf8');
const cssMin = minifyCSS(cssRaw);
fs.writeFileSync(path.join(DIST, 'css/app.css'), cssMin);
const cssRatio = ((1 - cssMin.length / cssRaw.length) * 100).toFixed(1);
console.log(`✅ Minified CSS (${(cssRaw.length / 1024).toFixed(0)}KB → ${(cssMin.length / 1024).toFixed(0)}KB, -${cssRatio}%)`);

// 4. Minify JS files & stamp config
ensureDir(path.join(DIST, 'js'));
const jsFiles = ['config.js', 'storage.js', 'i18n.js', 'api.js', 'scholar.js', 'screens.js', 'app.js'];
let totalJsRaw = 0;
let totalJsMin = 0;

for (const file of jsFiles) {
  let jsRaw = fs.readFileSync(path.join(ROOT, 'js', file), 'utf8');

  // Stamp config.js with build info
  if (file === 'config.js') {
    jsRaw = jsRaw
      .replace("version: '1.0.0'", `version: '${VERSION}'`)
      .replace("buildDate: '2026-03-14'", `buildDate: '${BUILD_DATE}'`)
      .replace("commitHash: 'dev'", `commitHash: '${COMMIT}'`);
  }

  const jsMin = minifyJS(jsRaw);
  fs.writeFileSync(path.join(DIST, 'js', file), jsMin);
  totalJsRaw += jsRaw.length;
  totalJsMin += jsMin.length;
}

const jsRatio = ((1 - totalJsMin / totalJsRaw) * 100).toFixed(1);
console.log(`✅ Minified ${jsFiles.length} JS files (${(totalJsRaw / 1024).toFixed(0)}KB → ${(totalJsMin / 1024).toFixed(0)}KB, -${jsRatio}%)`);

// 5. Copy and update service worker (bump cache name with commit hash)
let swContent = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
swContent = swContent.replace(
  /const CACHE_NAME = '[^']+'/,
  `const CACHE_NAME = 'deenhub-${VERSION}-${COMMIT}'`
);
fs.writeFileSync(path.join(DIST, 'sw.js'), minifyJS(swContent));
console.log('✅ Built service worker with cache-busting version');

// 6. Generate Cloudflare Pages _headers file
const headers = `
# Security headers
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(self), camera=(), microphone=()

# Cache static assets aggressively (1 year, immutable for hashed files)
/css/*
  Cache-Control: public, max-age=31536000, immutable

/js/*
  Cache-Control: public, max-age=31536000, immutable

/icons/*
  Cache-Control: public, max-age=31536000, immutable

# HTML & SW: short cache, must revalidate
/index.html
  Cache-Control: public, max-age=0, must-revalidate

/sw.js
  Cache-Control: public, max-age=0, must-revalidate

/manifest.json
  Cache-Control: public, max-age=3600
`.trim();

fs.writeFileSync(path.join(DIST, '_headers'), headers);
console.log('✅ Generated _headers (security + cache control)');

// 7. Generate _redirects for SPA (all routes → index.html)
const redirects = `
# SPA fallback — serve index.html for all routes
/*  /index.html  200
`.trim();

fs.writeFileSync(path.join(DIST, '_redirects'), redirects);
console.log('✅ Generated _redirects (SPA routing)');

// 8. Generate build manifest
const manifest = {
  version: VERSION,
  env: ENV,
  commit: COMMIT,
  buildDate: BUILD_DATE,
  files: [],
};

function listFiles(dir, prefix) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      listFiles(fullPath, prefix + entry.name + '/');
    } else {
      const stat = fs.statSync(fullPath);
      manifest.files.push({
        path: prefix + entry.name,
        size: stat.size,
      });
    }
  }
}
listFiles(DIST, '/');
manifest.totalSize = manifest.files.reduce((sum, f) => sum + f.size, 0);

fs.writeFileSync(
  path.join(DIST, 'build-manifest.json'),
  JSON.stringify(manifest, null, 2)
);

console.log(`\n🚀 Build complete!`);
console.log(`   Output: dist/`);
console.log(`   Files:  ${manifest.files.length}`);
console.log(`   Total:  ${(manifest.totalSize / 1024).toFixed(0)} KB\n`);
