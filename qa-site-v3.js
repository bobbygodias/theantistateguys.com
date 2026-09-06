(()=>{
  const compat=document.createElement('link');
  compat.rel='stylesheet';
  compat.href='qa-site-v3-compat.css';
  compat.dataset.qaCompat='true';
  document.head.appendChild(compat);

  const meter=document.getElementById('qa-meter');
  const close=document.getElementById('qa-dialog-close');
  const dialog=document.getElementById('music-dialog');
  const main=document.querySelector('main');
  const navEl=document.querySelector('.site-nav');
  close?.addEventListener('click',()=>dialog?.close());

  function activeRouteEl(){
    return document.querySelector('[data-route].is-active') || document.querySelector('[data-route="home"]');
  }
  function activeRoute(){
    return activeRouteEl()?.dataset.route || 'home';
  }
  function isVisible(node){
    if(!node) return false;
    const s=getComputedStyle(node);
    if(s.display==='none' || s.visibility==='hidden' || Number(s.opacity)===0) return false;
    const r=node.getBoundingClientRect();
    return r.width>1 && r.height>1;
  }
  function gridShape(el){
    if(!el) return {cols:0,rows:0};
    const children=[...el.children].filter(isVisible);
    if(!children.length) return {cols:0,rows:0};
    const tops=[];
    children.forEach(node=>{
      const top=Math.round(node.getBoundingClientRect().top);
      if(!tops.some(v=>Math.abs(v-top)<=2)) tops.push(top);
    });
    tops.sort((a,b)=>a-b);
    const firstTop=tops[0];
    const cols=children.filter(node=>Math.abs(Math.round(node.getBoundingClientRect().top)-firstTop)<=2).length;
    return {cols,rows:tops.length};
  }
  function visibleTargets(){
    return [
      ...document.querySelectorAll('.site-nav a'),
      ...(activeRouteEl()?.querySelectorAll('a,button') || [])
    ].filter(isVisible);
  }
  function minTapSize(){
    const targets=visibleTargets();
    if(!targets.length) return 0;
    return Math.round(Math.min(...targets.map(el=>{
      const r=el.getBoundingClientRect();
      return Math.min(r.width,r.height);
    })));
  }
  function horizontalClipCount(){
    const route=activeRouteEl();
    const bounds=main?.getBoundingClientRect();
    if(!route || !bounds) return 0;
    const candidates=[...route.querySelectorAll(
      'a,button,img:not([alt=""]),.player-display,.sheet-label,.show-stamp,h2,h3,article,figure'
    )].filter(isVisible);
    return candidates.filter(el=>{
      const r=el.getBoundingClientRect();
      return r.left < bounds.left-2 || r.right > bounds.right+2;
    }).length;
  }
  function semanticIssueCount(){
    let issues=0;
    const ids=new Set();
    document.querySelectorAll('[id]').forEach(el=>{
      if(ids.has(el.id)) issues++;
      else ids.add(el.id);
    });
    document.querySelectorAll('img').forEach(img=>{
      if(!img.hasAttribute('alt')) issues++;
    });
    document.querySelectorAll('button').forEach(btn=>{
      const name=(btn.getAttribute('aria-label') || btn.getAttribute('aria-labelledby') || btn.textContent || '').trim();
      if(!name) issues++;
    });
    return issues;
  }
  function radioIndependent(){
    const radio=document.querySelector('.boombox-art');
    if(!radio) return false;
    const bg=getComputedStyle(radio).backgroundImage || '';
    return bg.includes('jvc-player.svg') && !bg.includes('home-scene.webp');
  }
  function supportFlags(){
    return {
      cq:CSS.supports?.('container-type','size') ?? false,
      cu:CSS.supports?.('width','1cqi') ?? false,
      dvh:CSS.supports?.('height','100dvh') ?? false
    };
  }

  function updateMeter(){
    if(!meter) return;
    const vv=window.visualViewport;
    const vw=Math.round(vv?.width || innerWidth);
    const vh=Math.round(vv?.height || innerHeight);
    const mainRect=main?.getBoundingClientRect();
    const cw=Math.round(mainRect?.width || 0);
    const ch=Math.round(mainRect?.height || 0);
    const ratio=(cw/Math.max(ch,1)).toFixed(2);
    const nav=gridShape(navEl);
    const media=gridShape(document.querySelector('.home-media'));
    const route=activeRouteEl();
    const needsY=!!main && main.scrollHeight>main.clientHeight+2;
    const overflowX=!!main && main.scrollWidth>main.clientWidth+2;
    const routeH=Math.round(route?.scrollHeight || 0);
    const tap=minTapSize();
    const clipX=horizontalClipCount();
    const semantics=semanticIssueCount();
    const radioOK=radioIndependent();
    const support=supportFlags();
    const hardIssues=[];
    if(overflowX) hardIssues.push('overflow-x');
    if(tap>0 && tap<44) hardIssues.push(`tap-${tap}`);
    if(clipX>0) hardIssues.push(`clip-x-${clipX}`);
    if(semantics>0) hardIssues.push(`sem-${semantics}`);
    if(!radioOK) hardIssues.push('radio-raster');
    const hardOK=hardIssues.length===0;
    meter.dataset.qaHard=hardOK?'ok':'fail';
    meter.textContent=`${hardOK?'HARD-OK':'HARD-FAIL '+hardIssues.join(',')} · visual ${vw}×${vh} · conteúdo ${cw}×${ch} · AR ${ratio} · DPR ${devicePixelRatio.toFixed(2)} · nav ${nav.cols}c/${nav.rows}r · mídia ${media.cols}c/${media.rows}r · rotaH ${routeH} · scrollY ${needsY?'sim':'não'} · ovX ${overflowX?'SIM':'não'} · clipX ${clipX} · tap≥${tap}px · sem ${semantics} · rádio ${radioOK?'indep':'RASTER'} · CQ ${support.cq?'sim':'fallback'} · CU ${support.cu?'sim':'fallback'} · DVH ${support.dvh?'sim':'fallback'} · ${activeRoute()}`;
  }

  let raf=0;
  function schedule(){
    cancelAnimationFrame(raf);
    raf=requestAnimationFrame(updateMeter);
  }

  compat.addEventListener('load',schedule,{once:true});
  updateMeter();
  addEventListener('resize',schedule,{passive:true});
  visualViewport?.addEventListener('resize',schedule,{passive:true});
  visualViewport?.addEventListener('scroll',schedule,{passive:true});
  addEventListener('hashchange',schedule);
  main?.addEventListener('scroll',schedule,{passive:true});
  document.addEventListener('click',event=>{
    if(event.target.closest('[data-route-link],#open-library,#qa-dialog-close')) schedule();
  });

  if('ResizeObserver' in window){
    const ro=new ResizeObserver(schedule);
    if(main) ro.observe(main);
    if(navEl) ro.observe(navEl);
    document.querySelectorAll('.home-media,[data-route],.boombox-art').forEach(el=>ro.observe(el));
  }
  if('MutationObserver' in window){
    const mo=new MutationObserver(schedule);
    document.querySelectorAll('[data-route]').forEach(el=>roObserveSafe(el,mo));
  }

  function roObserveSafe(el,observer){
    observer.observe(el,{attributes:true,attributeFilter:['hidden','class']});
  }
})();
