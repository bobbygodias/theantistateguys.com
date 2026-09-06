from pathlib import Path

p = Path('responsive-home.css')
css = p.read_text(encoding='utf-8')
old = '''@media (min-aspect-ratio: 11/10) and (max-width:1200px){\n  .prev-hit,.play-hit,.stop-hit,.next-hit{height:5.2%;width:3%}\n  .prev-hit{left:15.7%}.play-hit{left:18.3%}.stop-hit{left:20.9%}.next-hit{left:23.5%}\n}\n'''
new = '''@media (min-aspect-ratio: 11/10) and (max-width:1200px){\n  /* Keep the artwork untouched; enlarge only invisible interaction rectangles.\n     Centers remain aligned to the physical boombox buttons. */\n  .prev-hit,.play-hit,.stop-hit,.next-hit{height:6%;width:3.2%}\n  .prev-hit{left:15.6%}.play-hit{left:18.2%}.stop-hit{left:20.8%}.next-hit{left:23.4%}\n}\n'''
if old not in css:
    raise SystemExit('compact wide block not found or already changed')
p.write_text(css.replace(old, new, 1), encoding='utf-8')
print('Compact-wide hitboxes enlarged without changing artwork.')
