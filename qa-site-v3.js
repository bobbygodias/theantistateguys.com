(()=>{
  const meter=document.getElementById('qa-meter');
  const close=document.getElementById('qa-dialog-close');
  const dialog=document.getElementById('music-dialog');
  close?.addEventListener('click',()=>dialog?.close());

  function activeRoute(){
    return document.querySelector('[data-route].is-active')?.dataset.route || 'home';
  }
  function columnCount(el){
    if(!el) return 0;
    const value=getComputedStyle(el).gridTemplateColumns;
    if(!value || value==='none') return 0;
    return value.split(' ').filter(Boolean).length;
  }
  function updateMeter(){
    if(!meter) return;
    const vv=window.visualViewport;
    const vw=Math.round(vv?.width || innerWidth);
    const vh=Math.round(vv?.height || innerHeight);
    const ratio=(vw/Math.max(vh,1)).toFixed(2);
    const mediaCols=columnCount(document.querySelector('.home-media'));
    const navCols=columnCount(document.querySelector('.site-nav'));
    meter.textContent=`QA V3 · ${vw}×${vh} CSS · AR ${ratio} · DPR ${devicePixelRatio.toFixed(2)} · nav ${navCols}c · mídia ${mediaCols}c · ${activeRoute()}`;
  }
  updateMeter();
  addEventListener('resize',updateMeter,{passive:true});
  visualViewport?.addEventListener('resize',updateMeter,{passive:true});
  addEventListener('hashchange',()=>requestAnimationFrame(updateMeter));
  document.addEventListener('click',event=>{
    if(event.target.closest('[data-route-link]')) requestAnimationFrame(updateMeter);
  });
})();
