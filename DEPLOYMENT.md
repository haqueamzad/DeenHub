# DeenHub PWA — Deployment Guide

## Architecture Overview

```
  develop (your daily work)
     │
     ▼  Pull Request + Tests Pass
  staging (test environment)
     │
     ▼  Pull Request + Tests Pass + Manual Approval
    main (production)
```

**Environments:**

| Environment | Branch    | URL                                  | Purpose          |
|------------|-----------|--------------------------------------|------------------|
| Development | local     | localhost:8080                       | Local coding     |
| Staging     | staging   | staging.deenhub.pages.dev            | QA & testing     |
| Production  | main      | deenhub.app (or deenhub.pages.dev)   | Live users       |

**Scaling:** Cloudflare Pages serves from 300+ edge locations worldwide. Static assets are cached at the edge. No server to manage — handles millions of requests automatically.

---

## Initial Setup (One Time)

### 1. Create Cloudflare Account

1. Go to https://dash.cloudflare.com/sign-up
2. Create a free account
3. Go to **Workers & Pages** > **Create** > **Pages**
4. Connect your GitHub repo: `haqueamzad/DeenHub`
5. Configure build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/` (or `DeenHub-PWA` if in a subdirectory)

### 2. Set Up GitHub Secrets

In your GitHub repo, go to **Settings** > **Secrets and variables** > **Actions**, and add:

- `CLOUDFLARE_API_TOKEN` — Create at https://dash.cloudflare.com/profile/api-tokens with "Cloudflare Pages: Edit" permission
- `CLOUDFLARE_ACCOUNT_ID` — Found in the Cloudflare dashboard sidebar

### 3. Create Git Branches

Run these from your terminal:

```bash
cd DeenHub-PWA

# Create staging branch from main
git checkout main
git checkout -b staging
git push -u origin staging

# Create develop branch from staging
git checkout -b develop
git push -u origin develop
```

### 4. Buy & Configure Domain (Optional)

1. Buy a domain (e.g., deenhub.app) from Cloudflare Registrar ($12-15/year)
2. In Cloudflare Pages project > **Custom domains** > Add `deenhub.app`
3. DNS is configured automatically if domain is on Cloudflare
4. HTTPS is automatic and free

### 5. Set Up Branch Protection (Recommended)

In GitHub repo **Settings** > **Branches** > **Add rule**:

For `main`:
- Require pull request reviews (1 approver)
- Require status checks to pass (select "Run Tests")
- No direct pushes

For `staging`:
- Require status checks to pass

---

## Daily Workflow

### Making Changes

```bash
# 1. Start from develop
git checkout develop
git pull origin develop

# 2. Make your changes
# ... edit files ...

# 3. Test locally
npm test
npm run build           # verify build works
npm run start:dist      # preview at localhost:8080

# 4. Commit and push
git add -A
git commit -m "Description of changes"
git push origin develop
```

### Deploying to Staging (Test)

```bash
# Create a PR from develop → staging
gh pr create --base staging --head develop --title "Release: description"

# Or via GitHub UI: Pull Requests > New > base:staging ← compare:develop
```

When the PR is merged, GitHub Actions will automatically:
1. Run all 127 tests
2. Build the optimized dist/ folder
3. Deploy to staging.deenhub.pages.dev

**Test on staging** — open staging.deenhub.pages.dev on your phone and verify.

### Deploying to Production

```bash
# Create a PR from staging → main
gh pr create --base main --head staging --title "Production: description"

# Or via GitHub UI: Pull Requests > New > base:main ← compare:staging
```

When merged, the same pipeline deploys to production (deenhub.pages.dev or your custom domain).

---

## Build System

### Commands

| Command             | Description                              |
|--------------------|------------------------------------------|
| `npm test`         | Run all 127 unit tests                   |
| `npm run build`    | Build for production (outputs to dist/)  |
| `npm run build:staging` | Build for staging                   |
| `npm run start`    | Serve source locally                     |
| `npm run start:dist` | Serve built output locally             |

### What the Build Does

1. Minifies CSS (~24% reduction)
2. Minifies JS (removes comments, blank lines)
3. Stamps version, build date, and commit hash into config.js
4. Generates Cloudflare `_headers` (security + aggressive caching)
5. Generates `_redirects` (SPA routing)
6. Auto-busts service worker cache with commit hash
7. Outputs everything to `dist/`

---

## Environment Detection

The app automatically detects its environment from the hostname:

- `localhost` / `127.0.0.1` → **development** (orange "DEV" banner, debug logging, SW disabled)
- `*.pages.dev` (branch deploy) / `github.io` → **staging** (yellow "TEST" banner, debug logging)
- Custom domain or root pages.dev → **production** (no banner, no debug, analytics enabled)

---

## Monitoring & Scaling

### Cloudflare Analytics (Free)

Built into Cloudflare Pages dashboard — shows requests, bandwidth, and geographic distribution.

### Optional Add-ons ($10-30/month range)

- **Sentry** (sentry.io) — Error tracking, free tier covers 5K events/month
- **Plausible** (plausible.io) — Privacy-friendly analytics ($9/month)
- **Cloudflare Web Analytics** — Free, no cookies, add one script tag

### Scaling Characteristics

DeenHub is a static PWA — it scales automatically:

- **Static assets:** Served from Cloudflare's CDN (300+ PoPs), cached at edge, unlimited bandwidth on free plan
- **API calls:** Go directly from user's browser to third-party APIs (aladhan.com, alquran.cloud) — your infrastructure bears zero API load
- **Service Worker:** Caches everything locally after first visit — repeat visits require zero network requests
- **Offline:** Full app works offline after first load

**1 million users/year** = ~2.7K visits/day. Cloudflare's free plan handles orders of magnitude more than this.

---

## Rollback

If a production deploy has issues:

```bash
# Option 1: Revert in Cloudflare dashboard
# Go to Pages > deenhub > Deployments > click previous deploy > "Rollback to this deploy"

# Option 2: Git revert
git checkout main
git revert HEAD
git push origin main
# This triggers a new deploy with the reverted code
```

---

## Checklist Before First Production Deploy

- [ ] All 127 tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] Staging tested on iPhone Safari
- [ ] Staging tested on Android Chrome
- [ ] Cloudflare Pages project created and connected to GitHub
- [ ] GitHub secrets configured (CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID)
- [ ] Branch protection rules set
- [ ] Domain purchased and configured (optional)
- [ ] Service worker cache version is unique
