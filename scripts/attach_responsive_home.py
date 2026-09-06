from pathlib import Path

path = Path('history-v5.css')
text = path.read_text(encoding='utf-8')
imp = "@import url('responsive-home.css');\n\n"
if not text.startswith(imp):
    path.write_text(imp + text, encoding='utf-8')
print('responsive Home stylesheet attached')
