function installFinalHomeUI(){
  if (!document.querySelector('link[data-home-final]')){
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='home-final-v1.css?rev=1';
    link.dataset.homeFinal='1';
    document.head.appendChild(link);
  }

  const machine=document.querySelector('.music-machine');
  if (machine){
    if (!document.getElementById('cd-tray')){
      const tray=document.createElement('div');
      tray.className='cd-tray';
      tray.id='cd-tray';
      tray.setAttribute('aria-hidden','true');
      machine.appendChild(tray);
    }
    if (!document.getElementById('cd-insert')){
      const disc=document.createElement('button');
      disc.type='button';
      disc.className='cd-disc-button';
      disc.id='cd-insert';
      disc.setAttribute('aria-label','Inserir CD no player');
      machine.appendChild(disc);
    }
    const controls=machine.querySelector('.player-controls');
    if (controls && !document.getElementById('eject-track')){
      const eject=document.createElement('button');
      eject.type='button';
      eject.id='eject-track';
      eject.setAttribute('aria-label','Ejetar CD');
      eject.textContent='EJ';
      controls.appendChild(eject);
    }
  }

  // O contato pessoal não faz parte da direção aprovada.
  document.querySelector('a[href="mailto:bobbygodias@gmail.com"]')?.remove();
}

installFinalHomeUI();

const audio = document.getElementById('audio');
const cdSfx = new Audio('assets/cd-tray-close.mp3');
cdSfx.preload='auto';
const dialog = document.getElementById('music-dialog');
const list = document.getElementById('music-list');
const toast = document.getElementById('toast');

const desktopTitle = document.getElementById('track-title');
const desktopCurrent = document.getElementById('time-current');
const desktopTotal = document.getElementById('time-total');
const mobileTitle = document.getElementById('mobile-track-title');
const mobileCurrent = document.getElementById('mobile-time-current');
const mobileTotal = document.getElementById('mobile-time-total');

const cdInsert = document.getElementById('cd-insert');
const ejectTrack = document.getElementById('eject-track');
const libraryButton = document.getElementById('open-library');
const playbackButtons = ['play-pause','stop-track','prev-track','next-track','eject-track']
  .map(id => document.getElementById(id))
  .filter(Boolean);

let releases = [];
let tracks = [];
let currentIndex = 0;
let toastTimer;
let cdLoaded = false;
let cdBusy = false;

function formatTime(seconds){
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2,'0');
  return `${m}:${s}`;
}

function showToast(message){
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('show');
  toastTimer = setTimeout(()=>toast.classList.remove('show'),2200);
}

function setPlayerAvailability(){
  playbackButtons.forEach(button => {
    button.disabled = !cdLoaded || cdBusy;
    button.setAttribute('aria-disabled', String(!cdLoaded || cdBusy));
  });
  if (libraryButton){
    libraryButton.disabled = !cdLoaded || cdBusy;
    libraryButton.setAttribute('aria-disabled', String(!cdLoaded || cdBusy));
  }
}

function syncDisplay(){
  const track = tracks[currentIndex];
  const title = cdLoaded ? (track?.title || 'Faixas') : (cdBusy ? 'CARREGANDO CD...' : 'INSIRA O CD');

  if (desktopTitle) desktopTitle.textContent = title;
  if (mobileTitle) mobileTitle.textContent = title;

  const current = cdLoaded ? formatTime(audio.currentTime) : '0:00';
  const total = cdLoaded ? formatTime(audio.duration) : '0:00';

  if (desktopCurrent) desktopCurrent.textContent = current;
  if (mobileCurrent) mobileCurrent.textContent = current;
  if (desktopTotal) desktopTotal.textContent = total;
  if (mobileTotal) mobileTotal.textContent = total;

  const playing = cdLoaded && !audio.paused && !audio.ended;
  document.body.classList.toggle('is-playing', playing);
  document.body.classList.toggle('cd-is-loaded', cdLoaded);
  document.body.classList.toggle('cd-is-loading', cdBusy);

  document.querySelectorAll('#play-pause,#mobile-play').forEach(btn=>{
    btn.textContent = playing ? 'Ⅱ' : '▶';
    btn.setAttribute('aria-label', playing ? 'Pausar' : 'Reproduzir');
    btn.setAttribute('aria-pressed', playing ? 'true' : 'false');
  });

  document.querySelectorAll('.track-row').forEach((row,i)=>{
    const currentTrack = i === currentIndex;
    row.classList.toggle('is-current', currentTrack);
    if(currentTrack) row.setAttribute('aria-current','true');
    else row.removeAttribute('aria-current');
  });

  setPlayerAvailability();
}

function loadTrack(index,{autoplay=false}={}){
  if (!tracks.length) return;
  currentIndex = (index + tracks.length) % tracks.length;
  const track = tracks[currentIndex];
  audio.src = track.url;
  audio.load();
  syncDisplay();
  if (autoplay && cdLoaded){
    audio.play().catch(()=>showToast('Toque em play para iniciar o áudio.'));
  }
}

function ensureCd(){
  if (cdLoaded) return true;
  if (!cdBusy) showToast('Toque no CD e feche a gaveta primeiro.');
  return false;
}

function togglePlay(){
  if (!ensureCd() || !tracks.length) return;
  if (!audio.src) loadTrack(currentIndex);
  if (audio.paused) audio.play().catch(()=>showToast('O navegador bloqueou o início automático. Toque novamente.'));
  else audio.pause();
}

function stopTrack(){
  if (!ensureCd()) return;
  audio.pause();
  try{audio.currentTime=0}catch{}
  syncDisplay();
}

function previousTrack(){
  if (!ensureCd()) return;
  loadTrack(currentIndex-1,{autoplay:!audio.paused});
}

function nextTrack(){
  if (!ensureCd()) return;
  loadTrack(currentIndex+1,{autoplay:!audio.paused});
}

function finishCdInsert(){
  cdBusy = false;
  cdLoaded = true;
  syncDisplay();
  showToast('CD carregado. Player pronto.');
  document.getElementById('play-pause')?.focus({preventScroll:true});
}

function insertCd(){
  if (cdLoaded || cdBusy) return;
  cdBusy = true;
  syncDisplay();

  if (cdSfx){
    try{
      cdSfx.pause();
      cdSfx.currentTime = 0;
      cdSfx.playbackRate = 1.15;
      cdSfx.play().catch(()=>{});
    }catch{}
  }

  // A animação visual fecha primeiro; o efeito pode terminar naturalmente.
  window.setTimeout(finishCdInsert, 2450);
}

function ejectCd(){
  if (!cdLoaded || cdBusy) return;
  audio.pause();
  try{audio.currentTime=0}catch{}
  if (dialog?.open) dialog.close();
  cdLoaded = false;
  cdBusy = false;
  syncDisplay();
  showToast('CD ejetado.');
  window.setTimeout(()=>cdInsert?.focus({preventScroll:true}),60);
}

function renderLibrary(){
  list.innerHTML='';
  let globalIndex=0;
  releases.forEach(release=>{
    const heading=document.createElement('h3');
    heading.className='release-title';
    heading.textContent=release.title || 'Faixas';
    list.appendChild(heading);

    (release.tracks||[]).forEach(track=>{
      const idx=globalIndex++;
      const btn=document.createElement('button');
      btn.type='button';
      btn.className='track-row';
      btn.innerHTML=`<span class="track-index">${String(idx+1).padStart(2,'0')}</span><span class="track-name"></span><span class="track-state">PLAY</span>`;
      btn.querySelector('.track-name').textContent=track.title;
      btn.addEventListener('click',()=>{
        if (!ensureCd()) return;
        loadTrack(idx,{autoplay:true});
        dialog.close();
      });
      list.appendChild(btn);
    });
  });
  syncDisplay();
}

async function loadMusic(){
  try{
    const res=await fetch('data/music.json',{cache:'no-store'});
    if(!res.ok) throw new Error('music catalog unavailable');
    const data=await res.json();
    releases=Array.isArray(data.releases)?data.releases:[];
    tracks=releases.flatMap(r=>(r.tracks||[]).map(t=>({...t,release:r.title||''})));
    if(!tracks.length) throw new Error('empty catalog');
    renderLibrary();
    loadTrack(0);
  }catch(err){
    if (desktopTitle) desktopTitle.textContent='Faixas indisponíveis';
    if (mobileTitle) mobileTitle.textContent='Faixas indisponíveis';
    showToast('Não foi possível carregar o catálogo de músicas.');
  }
}

function bind(id,fn){ document.getElementById(id)?.addEventListener('click',fn); }
['play-pause','mobile-play'].forEach(id=>bind(id,togglePlay));
['stop-track','mobile-stop'].forEach(id=>bind(id,stopTrack));
['prev-track','mobile-prev'].forEach(id=>bind(id,previousTrack));
['next-track','mobile-next'].forEach(id=>bind(id,nextTrack));
['open-library','mobile-library'].forEach(id=>bind(id,()=>{
  if (!ensureCd()) return;
  dialog?.showModal();
}));
bind('cd-insert',insertCd);
bind('eject-track',ejectCd);
bind('qa-dialog-close',()=>dialog?.close());

audio.addEventListener('play',syncDisplay);
audio.addEventListener('pause',syncDisplay);
audio.addEventListener('loadedmetadata',syncDisplay);
audio.addEventListener('timeupdate',syncDisplay);
audio.addEventListener('ended',()=>{
  if (cdLoaded) loadTrack(currentIndex+1,{autoplay:true});
});
audio.addEventListener('error',()=>showToast('Não foi possível reproduzir esta faixa.'));

function resetScroll(){
  const main=document.querySelector('main');
  if(main && typeof main.scrollTo==='function') main.scrollTo({top:0,left:0,behavior:'instant'});
  else window.scrollTo({top:0,left:0,behavior:'instant'});
}

function focusRouteHeading(route){
  if(!route) return;
  const labelledBy=route.getAttribute('aria-labelledby');
  const heading=(labelledBy && document.getElementById(labelledBy)) || route.querySelector('h1,h2');
  if(!heading) return;
  if(!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex','-1');
  requestAnimationFrame(()=>heading.focus({preventScroll:true}));
}

function setRoute(name,{replace=false,focusHeading=false}={}){
  const route = document.querySelector(`[data-route="${name}"]`) || document.querySelector('[data-route="home"]');
  document.querySelectorAll('[data-route]').forEach(section=>{
    const active=section===route;
    section.hidden=!active;
    section.classList.toggle('is-active',active);
  });
  document.querySelectorAll('[data-route-link]').forEach(link=>{
    const active=link.dataset.routeLink===route.dataset.route;
    link.classList.toggle('is-active',active);
    if(active) link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
  });
  const hash=`#${route.dataset.route}`;
  if(location.hash!==hash) history[replace?'replaceState':'pushState'](null,'',hash);
  resetScroll();
  if(focusHeading) focusRouteHeading(route);
}

document.addEventListener('click',event=>{
  const link=event.target.closest('[data-route-link]');
  if(!link)return;
  event.preventDefault();
  setRoute(link.dataset.routeLink,{focusHeading:true});
});
window.addEventListener('hashchange',()=>setRoute(location.hash.slice(1)||'home',{replace:true,focusHeading:true}));

setRoute(location.hash.slice(1)||'home',{replace:true});
setPlayerAvailability();
loadMusic();
