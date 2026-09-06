from pathlib import Path
p = Path('responsive-home.css')
s = p.read_text(encoding='utf-8')
s = s.replace("url('assets/home-scene.webp') 41% center/auto 100% no-repeat;", "url('assets/home-scene.webp') 41% 56%/auto 125% no-repeat;")
s = s.replace("url('assets/home-scene.webp') 39% center/auto 100% no-repeat;", "url('assets/home-scene.webp') 39% 56%/auto 128% no-repeat;")
p.write_text(s, encoding='utf-8')
print('responsive Home crop tuned')
