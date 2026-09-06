from pathlib import Path

root = Path(__file__).resolve().parents[1]
index = root / "index.html"
html = index.read_text(encoding="utf-8")

html = html.replace("assets/wordmark-custom.webp", "assets/wordmark.svg")

css_link = '<link rel="stylesheet" href="scenic-fixes.css">'
if css_link not in html:
    html = html.replace(
        '<link rel="stylesheet" href="styles.css">',
        '<link rel="stylesheet" href="styles.css">\n  ' + css_link,
        1,
    )

index.write_text(html, encoding="utf-8")

required = [
    "assets/home-scene.webp",
    "assets/photos-pose-6.webp",
    "assets/studio.webp",
    "assets/members/thomaz.webp",
    "assets/wordmark.svg",
    "scenic-fixes.css",
]
missing = [path for path in required if not (root / path).exists()]
if missing:
    raise SystemExit("Missing scenic assets: " + ", ".join(missing))

if "#fotos" not in html or 'data-route="fotos"' not in html:
    raise SystemExit("Fotos route is missing from index.html")
if "theantistateguys@gmail.com" not in html or "bobbygodias@gmail.com" not in html:
    raise SystemExit("Contact e-mails are missing from index.html")
if "NO MOMENTO, O PALCO É O ESTÚDIO." not in html or "assets/studio.webp" not in html:
    raise SystemExit("Shows/Studio content is missing from index.html")

print("scenic-v2 finalized")
