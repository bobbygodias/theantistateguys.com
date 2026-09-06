from pathlib import Path

p = Path('responsive-home.css')
css = p.read_text(encoding='utf-8')
old = '''  .mobile-boombox-photo{\n    position:absolute!important;\n    inset:0!important;\n    background:url('assets/home-scene.webp') 1.2% 99.4%/325% auto no-repeat!important;\n  }\n'''
new = '''  .mobile-boombox-photo{\n    position:absolute!important;\n    inset:0!important;\n    background:url('assets/home-scene.webp') 1.2% 99.4%/325% auto no-repeat!important;\n    /* Extract the physical boombox from the scene instead of showing a rectangular crop.\n       The surrounding alley remains the single continuous background. */\n    clip-path:polygon(21% 18%,79% 18%,79% 27%,92% 30%,94% 82%,8% 82%,8% 31%,21% 28%);\n    filter:drop-shadow(0 14px 12px rgba(0,0,0,.78));\n  }\n'''
if old not in css:
    raise SystemExit('mobile boombox photo block not found')
p.write_text(css.replace(old, new, 1), encoding='utf-8')
print('Vertical boombox extracted from rectangular scenic crop.')
