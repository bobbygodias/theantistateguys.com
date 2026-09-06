const audio = document.getElementById('audio');
const dialog = document.getElementById('music-dialog');
const list = document.getElementById('music-list');
const toast = document.getElementById('toast');
const titleEl = document.getElementById('track-title');
const currentEl = document.getElementById('time-current');
const totalEl = document.getElementById('time-total');

let releases = [];
let tracks = [];
let currentIndex = 0;
let toastTimer;

function formatTime(seconds){
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2,'0');
  return `${minutes}:${secs}`;
}

function showToast(message){
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('show');
  toastTimer = setTimeout(()=>toast.classList.remove('show'),2200);
}

function syncDisplay(){
  const track = tracks[currentIndex];
  titleEl.textContent = track?.title || 'Faixas';
  currentEl.textContent = formatTime(audio.currentTime);
  totalEl.textContent = formatTime(audio.duration);
  const play = document.getElementById('play-pause');
  play.setAttribute('aria-label', audio.paused ? 'Reproduzir' : 'Pausar');
  if (window.matchMedia('(min-width:1120px) and (min-height:680px)').matches){
    play.textContent = '';
  } else {
    play.textContent = audio.paused ? '▶' : '❚❚';
  }
  document.querySelectorAll('.track-row').forEach((row,index)=>row.classList.toggle('is-current',index===currentIndex));
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
      const index=globalIndex++;
      const button=document.createElement('button');
      button.type='button';
      button.className='track-row';
      button.innerHTML=`<span class="track-index">${String(index+1).padStart(2,'0')}</span><span class="track-name"></span><span class="track-state">PLAY</span>`;
      button.querySelector('.track-name').textContent=track.title;
      button.addEventListener('click',()=>{ loadTrack(index,{autoplay:true}); dialog.close(); });
      list.appendChild(button);
    });
  });
  syncDisplay();
}

async function loadMusic(){
  try{
    const response=await fetch('data/music.json',{cache:'no-store'});
    if(!response.ok) throw new Error('music catalog unavailable');
    const data=await response.json();
    releases=Array.isArray(data.releases)?data.releases:[];
    tracks=releases.flatMap(release=>(release.tracks||[]).map(track=>({...track,release:release.title||''})));
    if(!tracks.length) throw new Error('empty catalog');
    renderLibrary();
    loadTrack(0);
  }catch(error){
    titleEl.textContent='Faixas indisponíveis';
    showToast('Não foi possível carregar o catálogo de músicas.');
  }
}

document.getElementById('play-pause').addEventListener('click',togglePlay);
document.getElementById('stop-track').addEventListener('click',stopTrack);
document.getElementById('prev-track').addEventListener('click',previousTrack);
document.getElementById('next-track').addEventListener('click',nextTrack);
document.getElementById('open-library').addEventListener('click',()=>dialog.showModal());
document.getElementById('close-library').addEventListener('click',()=>dialog.close());
document.getElementById('intro-placeholder').addEventListener('click',()=>showToast('O vídeo de apresentação da banda ainda está em produção.'));

audio.addEventListener('play',syncDisplay);
audio.addEventListener('pause',syncDisplay);
audio.addEventListener('loadedmetadata',syncDisplay);
audio.addEventListener('timeupdate',syncDisplay);
audio.addEventListener('ended',()=>loadTrack(currentIndex+1,{autoplay:true}));
audio.addEventListener('error',()=>showToast('Não foi possível reproduzir esta faixa.'));

window.addEventListener('resize',syncDisplay,{passive:true});
loadMusic();
