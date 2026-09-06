from pathlib import Path

src = Path('history-v4.css').read_text(encoding='utf-8').strip()
p = Path('scenic-fixes.css')
text = p.read_text(encoding='utf-8')
start = '/* HISTORY-V4-START */'
end = '/* HISTORY-V4-END */'
if start in text and end in text:
    a = text.index(start)
    b = text.index(end, a) + len(end)
    text = text[:a].rstrip() + '\n\n' + text[b:].lstrip()
block = f"{start}\n{src}\n{end}"
p.write_text(text.rstrip() + '\n\n' + block + '\n', encoding='utf-8')
