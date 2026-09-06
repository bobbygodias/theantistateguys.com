const audio = document.getElementById('audio');
const dialog = document.getElementById('music-dialog');
const list = document.getElementById('music-list');
const toast = document.getElementById('toast');

const desktopTitle = document.getElementById('track-title');
const desktopCurrent = document.getElementById('time-current');
const desktopTotal = document.getElementById('time-total');
const mobileTitle = document.getElementById('mobile-track-title');
const mobileCurrent = document.getElementById('mobile-time-current');
const mobileTotal = document.getElementById('mobile-time-total');

let releases = [];
let tracks = [];
let currentIndex = 0;
let toastTimer;

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
function syncDisplay(){
  const track = tracks[currentIndex];
  const title = track?.title || 'Faixas';
  if (desktopTitle) desktopTitle.textContent = title;
  if (mobileTitle) mobileTitle.textContent = title;
  if (desktopCurrent) desktopCurrent.textContent = formatTime(audio.currentTime);
  if (mobileCurrent) mobileCurrent.textContent = formatTime(audio.currentTime);
  if (desktopTotal) desktopTotal.textContent = formatTime(audio.duration);
  if (mobileTotal) mobileTotal.textContent = formatTime(audio.duration);
  document.body.classList.toggle('is-playing', !audio.paused && !audio.ended);
  document.querySelectorAll('#play-pause,#mobile-play').forEach(btn=>{
    btn.setAttribute('aria-label', audio.paused ? 'Reproduzir' : 'Pausar');
  });
  document.querySelectorAll('.track-row').forEach((row,i)=>row.classList.toggle('is-current',i===currentIndex));
}
function loadTrack(index,{autoplay=false}={}){
  if (!tracks.length) return;
  currentIndex = (index + tracks.length) % tracks.length;
  const track = tracks[currentIndex];
  audio.src = track.url;
  audio.load();
  syncDisplay();
  if (autoplay) audio.play().catch(()=>showToast('Toque em play para iniciar o áudio.'));
}
function togglePlay(){
  if (!tracks.length) return;
  if (!audio.src) loadTrack(currentIndex);
  if (audio.paused) audio.play().catch(()=>showToast('O navegador bloqueou o início automático. Toque novamente.'));
  else audio.pause();
}
function stopTrack(){ audio.pause(); try{audio.currentTime=0}catch{} syncDisplay(); }
function previousTrack(){ loadTrack(currentIndex-1,{autoplay:!audio.paused}); }
function nextTrack(){ loadTrack(currentIndex+1,{autoplay:!audio.paused}); }

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
      btn.addEventListener('click',()=>{ loadTrack(idx,{autoplay:true}); dialog.close(); });
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
['open-library','mobile-library'].forEach(id=>bind(id,()=>dialog?.showModal()));
['intro-placeholder','mobile-intro-placeholder'].forEach(id=>bind(id,()=>showToast('O vídeo de apresentação da banda ainda está em produção.')));

audio.addEventListener('play',syncDisplay);
audio.addEventListener('pause',syncDisplay);
audio.addEventListener('loadedmetadata',syncDisplay);
audio.addEventListener('timeupdate',syncDisplay);
audio.addEventListener('ended',()=>loadTrack(currentIndex+1,{autoplay:true}));
audio.addEventListener('error',()=>showToast('Não foi possível reproduzir esta faixa.'));

function resetScroll(){
  const main=document.querySelector('main');
  if(main && typeof main.scrollTo==='function') main.scrollTo({top:0,left:0,behavior:'instant'});
  else window.scrollTo({top:0,left:0,behavior:'instant'});
}
function setRoute(name,{replace=false}={}){
  const route = document.querySelector(`[data-route="${name}"]`) || document.querySelector('[data-route="home"]');
  document.querySelectorAll('[data-route]').forEach(section=>{
    const active=section===route;
    section.hidden=!active;
    section.classList.toggle('is-active',active);
  });
  document.querySelectorAll('[data-route-link]').forEach(link=>{
    const active=link.dataset.routeLink===route.dataset.route;
    link.classList.toggle('is-active',active);
    if(active) link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current');
  });
  const hash=`#${route.dataset.route}`;
  if(location.hash!==hash) history[replace?'replaceState':'pushState'](null,'',hash);
  resetScroll();
}
document.addEventListener('click',event=>{
  const link=event.target.closest('[data-route-link]');
  if(!link)return;
  event.preventDefault();
  setRoute(link.dataset.routeLink);
});
window.addEventListener('hashchange',()=>setRoute(location.hash.slice(1)||'home',{replace:true}));
setRoute(location.hash.slice(1)||'home',{replace:true});
loadMusic();
