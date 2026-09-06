(()=>{
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
    tops.sort((a,b)=>a-b);
    const firstTop=tops[0];
    const cols=children.filter(node=>Math.abs(Math.round(node.getBoundingClientRect().top)-firstTop)<=2).length;
    return {cols,rows:tops.length};
  }
  function minTapSize(){
    const targets=[
      ...document.querySelectorAll('.site-nav a'),
      ...(activeRouteEl()?.querySelectorAll('a,button') || [])
    ].filter(el=>{
      const s=getComputedStyle(el);
      return s.display!=='none' && s.visibility!=='hidden';
    });
    if(!targets.length) return 0;
    return Math.round(Math.min(...targets.map(el=>{
      const r=el.getBoundingClientRect();
      return Math.min(r.width,r.height);
    })));
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
    meter.textContent=`QA V3 · visual ${vw}×${vh} · conteúdo ${cw}×${ch} · AR ${ratio} · DPR ${devicePixelRatio.toFixed(2)} · nav ${nav.cols}c/${nav.rows}r · mídia ${media.cols}c/${media.rows}r · rotaH ${routeH} · scrollY ${needsY?'sim':'não'} · ovX ${overflowX?'SIM':'não'} · tap≥${tap}px · ${activeRoute()}`;
  }

  let raf=0;
  function schedule(){
    cancelAnimationFrame(raf);
    raf=requestAnimationFrame(updateMeter);
  }

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
    document.querySelectorAll('.home-media,[data-route]').forEach(el=>ro.observe(el));
  }
  if('MutationObserver' in window){
    const mo=new MutationObserver(schedule);
    document.querySelectorAll('[data-route]').forEach(el=>mo.observe(el,{attributes:true,attributeFilter:['hidden','class']}));
  }
})();
