# TheAntiStateGuys.com — Project Source / Continuity File

## Objective
Build and publish the official website of **Bobby Dias & The Anti-State Guys** at:

**https://theantistateguys.com**

The domain is managed in Cloudflare. The source code is intended to live on GitHub under Bobby's account (`bobbygodias`).

## Current content sources
- Official YouTube channel: `https://www.youtube.com/@TheAntiStateGuys`
- Band history and biographies supplied in the project sources.
- Main band photograph supplied by Bobby: `Bobby Dias & The Anti-State Guys - Pic by BD.png` (3840×2160).

## v1 architecture decision
A dependency-free static website:
- HTML
- CSS
- Vanilla JavaScript
- no database
- no WordPress
- no analytics/tracking
- no framework runtime

Reason: extremely low maintenance, fast loading, portable between GitHub Pages and Cloudflare Pages, easy to audit and preserve.

## v1 visual direction
Editorial / underground / rehearsal-room aesthetic inspired by late-1990s/early-2000s music zines:
- coal black background
- off-white typography
- dry acid-yellow accent
- very large condensed/display typography
- original 4K band photograph as the main hero image
- no corporate card-grid aesthetic
- member profiles presented as an expandable roster
- chronological band history

## Information architecture
1. Hero
   - Bobby Dias & The Anti-State Guys
   - Goiânia, Goiás, Brasil
   - Nu-Metal / Grunge / Underground
   - links to history and official YouTube channel
2. Band history
   - BreakNews origin
   - “O Forasteiro”
   - Break's birthday performance
   - Bobby's invitation to rehearsal
   - renaming to Bobby Dias & The Anti-State Guys
   - new Nu-Metal + Grunge direction
3. Members
   - Bobby Dias
   - Break
   - Lukas McFly
   - Marcus Young
   - Thomaz
   - Santiago
4. Videos
   - intended to display the three newest uploads from the official YouTube channel
   - privacy-enhanced embeds through `youtube-nocookie.com`
5. Closing/footer

## Automated YouTube update
`/scripts/update_youtube.py` resolves the YouTube handle, reads the public YouTube RSS feed and caches the newest three uploads in `/data/videos.json`.

GitHub Action:
`.github/workflows/update-videos.yml`

Schedule: daily, plus manual dispatch.

If YouTube changes its markup or is temporarily unavailable, the updater does not break the site; the existing JSON is preserved and the page falls back to the official-channel link.

## SEO / static-host files already included
- `CNAME` → `theantistateguys.com`
- `.nojekyll`
- `robots.txt`
- `sitemap.xml`
- Open Graph metadata
- Twitter large-image card metadata
- responsive image variants
- `404.html`
- SVG favicon

## Deployment options
### Preferred operational architecture
**GitHub repository = canonical source**
**Cloudflare Pages = deployment/CDN/custom domain**

Reason: the domain is already managed by Cloudflare, so the custom apex domain and TLS are simpler while the source remains fully portable and open in GitHub.

### Fully valid alternative
GitHub Pages can publish the same repository directly. The included `CNAME` and `.nojekyll` already support this path.

## Repository
Created and confirmed on 2026-08-28:

`bobbygodias/theantistateguys.com`

The repository is the canonical source for the official website.

## Current local build
Prepared as v1 in this session with:
- `index.html`
- `styles.css`
- `script.js`
- optimized hero images
- second full-band photograph
- optimized photographs for all six member profiles
- automatic YouTube updater
- GitHub Action
- domain/SEO files

Static validation completed:
- 6 member entries present
- 1 H1
- no broken internal anchors
- all referenced local assets exist
- Python updater compiles successfully

## Next sequence
1. Populate `bobbygodias/theantistateguys.com` with the v1 source.
2. Review the live staging result and tune copy/layout.
3. Enable deployment (Cloudflare Pages preferred, GitHub Pages also valid).
4. Attach `theantistateguys.com` as the canonical custom domain.
5. Confirm HTTPS, apex domain, `www` redirect, mobile rendering, and latest-video automation.
