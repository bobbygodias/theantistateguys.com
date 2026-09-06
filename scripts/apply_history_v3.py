from pathlib import Path

css = r'''/* HISTORY-V3-START */
/* History is a physical archive a few meters away from the Home alley. */
#historia{background:#060403}
#historia .internal-bg{
  background:
    linear-gradient(90deg,rgba(4,3,2,.97) 0%,rgba(6,4,3,.78) 34%,rgba(5,3,2,.56) 63%,rgba(3,2,1,.92) 100%),
    radial-gradient(circle at 68% 24%,rgba(185,112,54,.12),transparent 28%),
    url('assets/home-scene.webp') 39% center/cover no-repeat;
  filter:saturate(.62) contrast(1.22) brightness(.44);
}
#historia .history-sheet{
  width:min(1320px,95vw);
  padding:clamp(28px,3.4vw,52px);
  background:
    linear-gradient(90deg,rgba(9,6,4,.86),rgba(17,10,6,.48) 56%,rgba(8,5,3,.78)),
    repeating-linear-gradient(90deg,rgba(170,100,48,.028) 0 1px,transparent 1px 14px);
  border:1px solid rgba(111,66,34,.34);
  box-shadow:0 28px 80px rgba(0,0,0,.48),inset 0 0 70px rgba(0,0,0,.46);
  clip-path:polygon(.35% .5%,99.7% 0,100% 99.25%,.2% 100%);
}
#historia .history-sheet::before{
  inset:9px;border:1px solid rgba(157,92,44,.12);
  box-shadow:inset 0 0 52px rgba(0,0,0,.44);
}
#historia .sheet-label{
  display:inline-block;margin:0 0 12px;padding:7px 11px 6px;
  color:#23170e;background:linear-gradient(#a97745,#7a4d2a);
  border:1px solid #301b0d;
  box-shadow:0 5px 14px rgba(0,0,0,.48),inset 0 0 0 1px rgba(236,190,126,.12);
  transform:rotate(-.45deg);text-shadow:none;
}
#historia .history-sheet>h2{
  position:relative;width:max-content;max-width:100%;
  margin:4px 0 clamp(24px,3vw,42px);
  color:#cfb58c;font-size:clamp(46px,6vw,88px);line-height:.92;
  letter-spacing:-.045em;text-shadow:0 5px 20px rgba(0,0,0,.72);
  transform:rotate(-.25deg);
}
#historia .history-sheet>h2::after{
  content:"";position:absolute;left:2%;right:-6%;bottom:-13px;height:3px;
  background:linear-gradient(90deg,#7c4724,rgba(124,71,36,.15),transparent);
  transform:rotate(.35deg);
}
#historia .history-layout{
  grid-template-columns:minmax(0,1.12fr) minmax(310px,.72fr);
  gap:clamp(32px,5vw,74px);align-items:start;
}
#historia .history-copy{
  display:grid;gap:16px;padding:0;background:none;border:0;box-shadow:none;
  color:#21180f;font-size:clamp(16px,1.25vw,18px);line-height:1.64;
}
#historia .history-copy p{
  position:relative;margin:0;
  padding:clamp(18px,2.2vw,27px) clamp(20px,2.5vw,30px);
  border:1px solid rgba(47,31,19,.72);color:#21180f;
  background:
    repeating-linear-gradient(0deg,rgba(60,43,28,.035) 0 1px,transparent 1px 5px),
    radial-gradient(circle at 86% 20%,rgba(74,47,25,.08),transparent 18%),
    linear-gradient(103deg,#b79c73,#a48a67 52%,#8f7658);
  box-shadow:0 12px 24px rgba(0,0,0,.43),inset 0 0 28px rgba(73,49,29,.10);
  clip-path:polygon(.5% 1%,99.6% 0,100% 97.8%,.2% 100%);
}
#historia .history-copy p::before{
  content:"";position:absolute;width:68px;height:17px;top:-9px;
  left:clamp(26px,9%,72px);background:rgba(139,111,74,.56);
  box-shadow:0 2px 4px rgba(0,0,0,.22);transform:rotate(-2deg);
}
#historia .history-copy p:nth-child(2){transform:translateX(2.2%) rotate(.32deg);width:97%}
#historia .history-copy p:nth-child(3){transform:translateX(-1.1%) rotate(-.28deg);width:99%}
#historia .history-copy p:nth-child(4){transform:translateX(1.4%) rotate(.22deg);width:98.5%}
#historia .history-copy strong{color:#17100a;font-weight:800}
#historia .history-copy .history-close{
  width:max-content;max-width:92%;padding:13px 18px 12px;
  color:#c9a774;background:#17100b;border:1px solid rgba(137,84,43,.65);
  font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  letter-spacing:.04em;transform:translateX(4%) rotate(-.7deg);clip-path:none;
}
#historia .history-copy .history-close::before{display:none}
#historia .pinned-photo{
  position:sticky;top:92px;padding:10px 10px 38px;
  background:linear-gradient(112deg,#bda47d,#9e835f 58%,#826b50);
  border:1px solid #3f2817;
  box-shadow:0 24px 54px rgba(0,0,0,.64),0 0 0 8px rgba(5,3,2,.30),inset 0 0 30px rgba(58,36,19,.13);
  transform:rotate(1.15deg);
}
#historia .pinned-photo::before{
  top:-12px;left:34%;width:96px;height:25px;
  background:rgba(151,121,80,.66);transform:rotate(-3.5deg);
}
#historia .pinned-photo::after{
  content:"";position:absolute;width:20px;height:20px;right:14px;bottom:12px;
  border:1px solid rgba(62,40,23,.38);border-radius:50%;
  box-shadow:inset 0 0 0 3px rgba(91,57,31,.08);
}
#historia .pinned-photo img{filter:saturate(.70) contrast(1.13) brightness(.84) sepia(.08)}
#historia .pinned-photo figcaption{color:#342518;letter-spacing:.08em}

@media (max-width:860px){
  #historia .history-sheet{width:min(96vw,760px);padding:24px 18px 34px}
  #historia .history-layout{grid-template-columns:1fr;gap:30px}
  #historia .history-copy{font-size:16px;line-height:1.62}
  #historia .history-copy p,
  #historia .history-copy p:nth-child(n){width:100%;transform:none;padding:18px 18px 20px}
  #historia .history-copy .history-close{width:max-content;max-width:96%;transform:rotate(-.45deg)}
  #historia .pinned-photo{position:relative;top:auto;width:min(92%,520px);margin:0 auto}
}
/* HISTORY-V3-END */'''

path = Path('scenic-fixes.css')
text = path.read_text(encoding='utf-8')
start = '/* HISTORY-V3-START */'
end = '/* HISTORY-V3-END */'
if start in text and end in text:
    a = text.index(start)
    b = text.index(end, a) + len(end)
    text = text[:a].rstrip() + '\n\n' + text[b:].lstrip()
path.write_text(text.rstrip() + '\n\n' + css + '\n', encoding='utf-8')
print('History v3 applied')
