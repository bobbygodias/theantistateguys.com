from pathlib import Path

p = Path('index.html')
text = p.read_text(encoding='utf-8')
scenic = '  <link rel="stylesheet" href="scenic-fixes.css">\n'
history = '  <link rel="stylesheet" href="history-v5.css">\n'
internal = '  <link rel="stylesheet" href="internal-v2.css">\n'

if history not in text:
    if scenic not in text:
        raise SystemExit('scenic-fixes link not found')
    text = text.replace(scenic, scenic + history, 1)

if internal not in text:
    anchor = history if history in text else scenic
    text = text.replace(anchor, anchor + internal, 1)

p.write_text(text, encoding='utf-8')
