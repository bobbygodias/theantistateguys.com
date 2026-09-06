# Scenic v2 — Browser QA

- Result: PASS
- Browser: Chromium / Playwright 1.55.0
- Responsive rule: space/aspect-ratio driven; no single device size is treated as canonical.
- Home matrix: 320x568, 390x844, 430x932, 600x1024, 800x1280, 1024x768, 1280x800, 1672x941, 2560x1080.
- Additional checks: horizontal overflow, minimum interactive target size, image decoding, internal routes, music catalog and persistent audio element.
- Source commit: 475eab4f67a7f0e04b8e6ef0b15a2d5d5f853030

Temporary screenshots are stored in `.qa-preview/` for design review and must be removed before production merge.
