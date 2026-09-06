(()=>{
  const meter=document.getElementById('qa-meter');
  const close=document.getElementById('qa-dialog-close');
  const dialog=document.getElementById('music-dialog');
  close?.addEventListener('click',()=>dialog?.close());

  function activeRoute(){
    return document.querySelector('[data-route].is-active')?.dataset.route || 'home';
  }

  function gridShape(el){
    if(!el) return {cols:0,rows:0};
    const children=[...el.children].filter(node=>{
      const s=getComputedStyle(node);
      return s.display!=='none' && s.visibility!=='hidden';
    });
    if(!children.length) return {cols:0,rows:0};
    const tops=[];
    children.forEach(node=>{
      const top=Math.round(node.getBoundingClientRect().top);
      if(!tops.some(v=>Math.abs(v-top)<=2)) tops.push(top);
    });
    const firstTop=tops[0];
    const cols=children.filter(node=>Math.abs(Math.round(node.getBoundingClientRect().top)-firstTop)<=2).length;
    return {cols,rows:tops.length};
  }

  function updateMeter(){
    if(!meter) return;
    const vv=window.visualViewport;
    const vw=Math.round(vv?.width || innerWidth);
    const vh=Math.round(vv?.height || innerHeight);
    const main=document.querySelector('main');
    const mainRect=main?.getBoundingClientRect();
    const cw=Math.round(mainRect?.width || 0);
    const ch=Math.round(mainRect?.height || 0);
    const ratio=(cw/Math.max(ch,1)).toFixed(2);
    const nav=gridShape(document.querySelector('.site-nav'));
    const media=gridShape(document.querySelector('.home-media'));
    meter.textContent=`QA V3 · visual ${vw}×${vh} · conteúdo ${cw}×${ch} · AR ${ratio} · DPR ${devicePixelRatio.toFixed(2)} · nav ${nav.cols}c/${nav.rows}r · mídia ${media.cols}c/${media.rows}r · ${activeRoute()}`;
  }

  const schedule=()=>requestAnimationFrame(updateMeter);
  updateMeter();
  addEventListener('resize',schedule,{passive:true});
  visualViewport?.addEventListener('resize',schedule,{passive:true});
  visualViewport?.addEventListener('scroll',schedule,{passive:true});
  addEventListener('hashchange',schedule);
  document.addEventListener('click',event=>{
    if(event.target.closest('[data-route-link]')) schedule();
  });
})();
