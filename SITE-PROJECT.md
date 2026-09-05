# TheAntiStateGuys.com — Project Source / Continuity File

## Objective

Official website of **Bobby Dias & The Anti-State Guys**:

**https://theantistateguys.com**

Canonical source: GitHub repository `bobbygodias/theantistateguys.com`.

## Infrastructure

- **GitHub**: source code and GitHub Pages hosting.
- **Cloudflare**: registrar / DNS only.
- **GitHub Pages**: deploy from `main / (root)`.
- **Custom domain**: `theantistateguys.com`.
- **HTTPS**: enforced.
- **MEGA S4**: public MP3 object storage for the site's music player.

Cloudflare DNS:
- apex A records point to GitHub Pages.
- `www` CNAME points to `bobbygodias.github.io`.
- records are DNS-only.

## Architecture

Dependency-free static website:
- HTML
- CSS
- Vanilla JavaScript
- no database
- no WordPress
- no analytics/tracking
- no frontend framework runtime

The site uses hash-based route switching so the audio element can remain alive while visitors move between Home, História, Contato, Integrantes and Shows.

## Visual direction — current

The old editorial/yellow scaffold is no longer the design target.

Current direction is a **diegetic / scenic underground alley interface** based on Bobby's rough visual mockup and subsequent concept review:
- narrow urban alley with a completely dark vanishing point;
- damaged brick/masonry/concrete surfaces;
- warm, restrained, coherent lighting;
- shadowed anonymous figure conceptually based on Santiago, identifiable only by posture/clothing language;
- boombox positioned at the corner between sidewalk and alley as an actual functional music player;
- navigation labels presented as physical signage integrated into the scene;
- Bobby's custom hand-modified band wordmark, not a generic replacement font;
- intro-video frame embedded in the environment;
- Instagram and YouTube links represented as scene objects rather than floating modern UI;
- no anarchist symbols or generic ideological graffiti/slogans;
- responsive art direction for phone, tablet, desktop and large/TV displays.

## Home / interaction model

### Navigation
- HOME
- HISTÓRIA
- CONTATO
- INTEGRANTES
- SHOWS

### Boombox
Functional controls:
- previous
- play / pause
- stop
- next
- automatic next track
- library / track picker
- title and elapsed/duration display
- gentle speaker-cone animation while playing

Audio remains mounted outside the route sections so playback can continue when navigating to another site area.

### Intro video
A framed placeholder exists on the Home wall.
The planned intro video has not been delivered yet and must remain explicitly marked as in production until Bobby supplies the final link.

### External channels
Currently used:
- Instagram: `https://www.instagram.com/theantistateguys/`
- YouTube: `https://www.youtube.com/@TheAntiStateGuys`

Palco MP3 is intentionally omitted from the current design pass.

## Music hosting

MEGA S4 bucket:
`theantistateguys-media`

Current public tracks in `data/music.json`:
- **Renascer**
- **Não Há Cor (Don't Tread On Me)**

URLs are S4 object URLs supplied directly by Bobby.

The catalog lives in GitHub (`data/music.json`); MP3 bytes live in MEGA S4.
Album/EP cover images can remain in GitHub Pages because they are lightweight.

## Content / band data

Project sources include:
- official band history and biographies;
- individual photographs of all six members;
- full-band photographs;
- custom band logo/wordmark assets;
- official YouTube source.

Member list:
- Bobby Dias — vocal / composer / multiinstrumentalist
- Break — drums / percussion
- Lukas McFly — bass / backing vocal
- Marcus Young — lead guitar / backing vocal
- Thomaz — rhythm guitar / backing vocal
- Santiago — vocal / DJ / sound design

## Repository assets

Existing useful assets include:
- `assets/band-hero.jpg`
- `assets/band-city.webp`
- `assets/members/bobby.webp`
- `assets/members/break.webp`
- `assets/members/mcfly.webp`
- `assets/members/young.webp`
- `assets/members/thomaz.webp`
- `assets/members/santiago.webp`
- `assets/wordmark.svg` — tracing of Bobby's custom band lettering

## Redesign deployment — 2026-09-05

Safety branch created:
`redesign-v1`

Redesign files staged and then fast-forwarded to `main`:
- `index.html`
- `styles.css`
- `script.js`
- `assets/wordmark.svg`
- `data/music.json`

Pages deployment for main commit:
`9e34021a52bf8011c62936429a90c724206ffb04`

GitHub Pages build/deployment run:
`33983992922`

Result: **completed / success**.

Local Chromium QA using `page.set_content()` was performed because this execution environment cannot resolve public DNS names. Checks passed:
- desktop viewport 1440×900 has no horizontal overflow;
- mobile viewport 390×844 has no horizontal overflow;
- one H1;
- no duplicate element IDs;
- route switching works for all five areas;
- music library dialog opens/closes;
- two catalog tracks load into UI state;
- no JavaScript page errors in the local interaction test.

## Immediate next QA

Bobby should refresh the live site and review the actual public rendering on his device. We then iterate visually on the scene, proportions, perspective, signage, wordmark placement and responsive composition based on the real device screenshots.

The intro video remains a placeholder until its final YouTube/video link exists.
