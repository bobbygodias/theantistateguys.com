from pathlib import Path

# 1) Responsive Home is a first-class stylesheet, independent from History.
index = Path('index.html')
html = index.read_text(encoding='utf-8')
link = '  <link rel="stylesheet" href="responsive-home.css">\n'
anchor = '  <link rel="stylesheet" href="scenic-fixes.css">\n'
if link not in html:
    if anchor not in html:
        raise SystemExit('scenic-fixes stylesheet anchor not found')
    html = html.replace(anchor, anchor + link, 1)
index.write_text(html, encoding='utf-8')

history = Path('history-v5.css')
history_css = history.read_text(encoding='utf-8')
history_css = history_css.replace("@import url('responsive-home.css');\n\n", '', 1)
history.write_text(history_css, encoding='utf-8')

# 2) Make the cascade explicitly constrained-space-first.
responsive = Path('responsive-home.css')
css = responsive.read_text(encoding='utf-8')
marker = '/* GOLDEN-RULES-BASE */'
if marker not in css:
    base = '''/* GOLDEN-RULES-BASE\n   Constrained space is the baseline. Wide/sustainable proportions progressively\n   enhance into the canonical 1672:941 stage. Breakpoints describe composition\n   failure points, never device categories. */\n.desktop-stage{display:none!important}\n.mobile-home{display:block!important}\n\n'''
    css = css.replace('/* WIDE / LANDSCAPE-SUSTAINABLE SPACE', base + '/* WIDE / LANDSCAPE-SUSTAINABLE SPACE', 1)
responsive.write_text(css, encoding='utf-8')

# 3) Expand QA probes. These are samples of space, never device specifications.
qa = Path('.github/qa-scenic.mjs')
q = qa.read_text(encoding='utf-8')
needle = "  ['home-320x568', { width: 320, height: 568 }, true],\n"
extra = (
    needle
    + "  ['home-360x640', { width: 360, height: 640 }, true],\n"
    + "  ['home-375x667', { width: 375, height: 667 }, true],\n"
)
if "home-360x640" not in q:
    if needle not in q:
        raise SystemExit('QA matrix anchor not found')
    q = q.replace(needle, extra, 1)

needle2 = "  ['home-800x1280', { width: 800, height: 1280 }, true],\n"
extra2 = (
    needle2
    + "  ['home-768x1024', { width: 768, height: 1024 }, true],\n"
    + "  ['home-900x600', { width: 900, height: 600 }, false],\n"
)
if "home-768x1024" not in q:
    if needle2 not in q:
        raise SystemExit('QA matrix second anchor not found')
    q = q.replace(needle2, extra2, 1)

needle3 = "  ['home-1672x941', { width: 1672, height: 941 }, false],\n"
extra3 = (
    needle3
    + "  ['home-1920x1080', { width: 1920, height: 1080 }, false],\n"
)
if "home-1920x1080" not in q:
    if needle3 not in q:
        raise SystemExit('QA matrix third anchor not found')
    q = q.replace(needle3, extra3, 1)
qa.write_text(q, encoding='utf-8')

print('Golden frontend rules applied.')
