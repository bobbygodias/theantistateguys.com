# Bobby Dias & The Anti-State Guys — official website

Source for **https://theantistateguys.com**.

## Stack

- Static HTML/CSS/JavaScript
- No framework, no database, no analytics or trackers
- Privacy-enhanced YouTube embeds (`youtube-nocookie.com`)
- Daily GitHub Action caches the three latest videos from the official channel

## Local preview

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## GitHub Pages

The repository already contains `CNAME` with `theantistateguys.com` and `.nojekyll`.
Publish the root of the `main` branch in **Settings → Pages**.

## Content source

Official video channel: https://www.youtube.com/@TheAntiStateGuys

## Updating copy

- Main page: `index.html`
- Visual system: `qa-site-v3.css`, `qa-site-v3-cenography.css`, `qa-site-v3-internal.css`, `qa-site-v3-compat.css`
- YouTube rendering: `script.js`
- Video updater: `scripts/update_youtube.py`

Production is intentionally dependency-free so it can be hosted on GitHub Pages, Cloudflare Pages, or any static host without code changes.

## Underground Home — September 2026

The Home uses a photographic alley and an independent, functional boombox. The original supplied band wordmark is preserved as lossless WebP. The intro placeholder has been removed. See `TASG-SITE-25-UNDERGROUND-HOME.md` for the implementation and verification record.

The QA workflow now targets `index.html` directly. `qa-site-v3.html` is a compatibility redirect to that same page.

An optional development server is available with `npm ci` and `npm run dev`. Vite is development-only; GitHub Pages serves the static root without a build.
