from pathlib import Path

index = Path('index.html')
html = index.read_text(encoding='utf-8')
html = html.replace(
    'ENSAIO FOTOGRÁFICO · GABRIELLE',
    'ENSAIO FOTOGRÁFICO · GABRYELLE ARACKELLY',
)
index.write_text(html, encoding='utf-8')

css = Path('scenic-fixes.css')
text = css.read_text(encoding='utf-8')
marker = '/* TABLET-SCENIC-HOTFIX */'
block = '''

/* TABLET-SCENIC-HOTFIX */
/* Tablets preserve the approved cinematic Home instead of the stacked phone composition. */
@media (min-width:621px) and (max-width:980px){
  .desktop-stage{display:block!important}
  .mobile-home{display:none!important}
}
/* TABLET-SCENIC-HOTFIX-END */
'''
if marker not in text:
    text += block
css.write_text(text, encoding='utf-8')
