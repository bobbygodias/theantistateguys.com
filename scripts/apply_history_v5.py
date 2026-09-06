from pathlib import Path

p = Path('index.html')
text = p.read_text(encoding='utf-8')
needle = '  <link rel="stylesheet" href="scenic-fixes.css">\n'
link = '  <link rel="stylesheet" href="history-v5.css">\n'
if link not in text:
    if needle not in text:
        raise SystemExit('scenic-fixes link not found')
    text = text.replace(needle, needle + link, 1)
    p.write_text(text, encoding='utf-8')
