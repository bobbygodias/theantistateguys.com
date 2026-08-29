# TheAntiStateGuys.com — Project Source / Continuity File

## Objective

Official website of **Bobby Dias & The Anti-State Guys**:

**https://theantistateguys.com**

Domain: Cloudflare.  
Canonical source: GitHub repository `bobbygodias/theantistateguys.com`.

## Content sources

- Official YouTube channel: `https://www.youtube.com/@TheAntiStateGuys`
- Band history and biographies supplied in the project sources.
- Original band photographs and six individual member photographs supplied by Bobby.

## Architecture

Dependency-free static website:
- HTML
- CSS
- Vanilla JavaScript
- no database
- no WordPress
- no analytics/tracking
- no framework runtime

Reason: fast, low-maintenance, auditable, privacy-respecting and portable between GitHub Pages, Cloudflare Pages or any static host.

## Visual direction

Editorial / underground / rehearsal-room aesthetic inspired by late-1990s/early-2000s music zines:
- coal-black background
- off-white typography
- dry acid-yellow accent
- large condensed/display typography
- rehearsal photo as hero
- second full-band photo as editorial break
- no corporate card-grid aesthetic
- member profiles as expandable roster with individual photography
- chronological band history

## Information architecture

1. Hero — Goiânia / Nu-Metal / Grunge / Underground
2. Band history — BreakNews → “O Forasteiro” → rehearsal → new formation/name
3. Full-band editorial photograph
4. Six member profiles
5. Latest official videos
6. Closing/footer

## Automated YouTube update

`scripts/update_youtube.py` resolves the official YouTube handle, reads the public upload feed and caches up to three recent uploads in `data/videos.json`.

Workflow: `.github/workflows/update-videos.yml`  
Schedule: daily + manual dispatch.

Embeds use `youtube-nocookie.com`. If YouTube is unavailable, the site falls back safely to a link to the official channel.

## SEO / host support

Included:
- `CNAME` → `theantistateguys.com`
- `.nojekyll`
- `robots.txt`
- `sitemap.xml`
- Open Graph metadata
- Twitter large-image metadata
- responsive images
- custom `404.html`
- SVG favicon

## Repository status — 2026-08-28

Repository: `bobbygodias/theantistateguys.com`

**The complete v1 source is now committed to `main`.**

Photography commit:
`a5538688c7ca46b065f9929c41e0d468067294e7`

Verified repository tree includes:
- `index.html`
- `styles.css`
- `script.js`
- 404 / CNAME / robots / sitemap
- YouTube updater + GitHub Action
- hero JPEG/WebP
- mobile hero WebP
- second full-band WebP
- six optimized member WebPs

Repository tree audit passed: every image referenced by the current page exists in Git.

## Deployment decision

Preferred operational architecture remains:

**GitHub = canonical source**  
**Cloudflare Pages = deployment/CDN/custom domain**

Reason: the domain is already a Cloudflare zone, so Cloudflare Pages can attach the apex domain and TLS directly while the source stays open and portable in GitHub.

GitHub Pages remains a valid fallback. GitHub currently requires the publishing source/custom-domain setting to be explicitly enabled; the presence of `CNAME` alone does not activate Pages.

## Remaining sequence

1. Connect/deploy the GitHub repository in Cloudflare Pages.
2. Attach `theantistateguys.com` as the production custom domain.
3. Configure/confirm `www` → apex redirect.
4. Confirm HTTPS.
5. Run live desktop/mobile visual QA.
6. Confirm latest-video updater on a GitHub runner.
7. Make copy/layout adjustments after Bobby reviews the actual live site.


## Deployment checkpoint — 2026-08-29

- GitHub Pages enabled from `main / (root)`.
- Custom domain: `theantistateguys.com`.
- Cloudflare DNS points apex and `www` to GitHub Pages.
- DNS verification passed in GitHub.
- Enforce HTTPS enabled.
- This commit intentionally triggers the first Pages publication after Pages was enabled.
