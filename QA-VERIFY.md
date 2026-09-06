# Scenic v2 — Browser QA

- Result: PASS
- Browser: Chromium / Playwright 1.55.0
- Responsive rule: space/aspect-ratio driven; no single device size is treated as canonical.
- Home matrix: 320x568, 390x844, 430x932, 600x1024, 800x1280, 1024x768, 1280x800, 1672x941, 2560x1080.
- Additional checks: horizontal overflow, minimum interactive target size, image decoding, internal routes, music catalog and persistent audio element.
- Source commit: b84b1e7219e587bcdf745bf6fd232a903f85aca9

Temporary screenshots are stored in `.qa-preview/` for design review and must be removed before production merge.
