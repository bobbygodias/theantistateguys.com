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
- Visual system: `styles.css`
- YouTube rendering: `script.js`
- Video updater: `scripts/update_youtube.py`

The site is intentionally dependency-free so it can be hosted on GitHub Pages, Cloudflare Pages, or any static host without code changes.
