const ROUTES = ['home', 'historia', 'contato', 'integrantes', 'shows'];

const routeSections = new Map(
  [...document.querySelectorAll('[data-route]')].map(section => [section.dataset.route, section])
);
const routeLinks = [...document.querySelectorAll('[data-route-link]')];

function normalizeRoute(value) {
  return ROUTES.includes(value) ? value : 'home';
}

function activateRoute(route, { focus = false } = {}) {
  const next = normalizeRoute(route);

  for (const [name, section] of routeSections) {
    const active = name === next;
    section.hidden = !active;
    section.classList.toggle('is-active', active);
  }

  for (const link of routeLinks) {
    const active = link.dataset.routeLink === next;
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }

  document.body.dataset.route = next;
  if (focus) {
    const section = routeSections.get(next);
    const heading = section?.querySelector('h1, h2');
    heading?.setAttribute('tabindex', '-1');
    heading?.focus({ preventScroll: true });
  }

  window.scrollTo({ top: 0, behavior: 'instant' });
}

function routeFromHash() {
  return normalizeRoute(location.hash.replace(/^#/, ''));
}

window.addEventListener('hashchange', () => activateRoute(routeFromHash(), { focus: true }));
routeLinks.forEach(link => {
  link.addEventListener('click', event => {
    const route = link.dataset.routeLink;
    if (routeFromHash() === route) {
      event.preventDefault();
      activateRoute(route);
    }
  });
});
activateRoute(routeFromHash());

const audio = document.getElementById('audio-player');
const boombox = document.getElementById('boombox');
const trackTitle = document.getElementById('track-title');
const chipTitle = document.getElementById('chip-title');
const timeCurrent = document.getElementById('time-current');
const timeTotal = document.getElementById('time-total');
const playPause = document.getElementById('play-pause');
const stopButton = document.getElementById('stop-track');
const prevButton = document.getElementById('prev-track');
const nextButton = document.getElementById('next-track');
const musicDialog = document.getElementById('music-dialog');
const openLibrary = document.getElementById('open-library');
const chipButton = document.getElementById('now-playing-chip');
const closeLibrary = document.getElementById('close-library');
const releaseList = document.getElementById('release-list');
const introPlaceholder = document.getElementById('intro-placeholder');

let releases = [];
let tracks = [];
let currentIndex = 0;
let playerReady = false;

const formatTime = seconds => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

function currentTrack() {
  return tracks[currentIndex] ?? null;
}

function setPlaybackVisual(isPlaying) {
  boombox?.classList.toggle('is-playing', isPlaying);
  playPause?.classList.toggle('is-playing', isPlaying);
  playPause?.setAttribute('aria-label', isPlaying ? 'Pausar' : 'Reproduzir');
}

function updateTrackDisplay() {
  const track = currentTrack();
  const label = track?.title ?? 'Nenhuma faixa';
  trackTitle.textContent = label;
  chipTitle.textContent = label;
  document.querySelectorAll('.track-row').forEach((row, index) => {
    row.classList.toggle('is-current', index === currentIndex);
    const state = row.querySelector('.track-state');
    if (state) state.textContent = index === currentIndex ? (audio.paused ? 'SELECIONADA' : 'TOCANDO') : 'OUVIR';
  });
}

function setMediaSession(track) {
  if (!('mediaSession' in navigator) || !track) return;
  try {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: 'Bobby Dias & The Anti-State Guys',
      album: track.releaseTitle || 'Faixas online'
    });
  } catch {}
}

function loadTrack(index, { autoplay = false } = {}) {
  if (!tracks.length) return;
  currentIndex = (index + tracks.length) % tracks.length;
  const track = currentTrack();
  audio.src = track.url;
  audio.load();
  timeCurrent.textContent = '0:00';
  timeTotal.textContent = '0:00';
  updateTrackDisplay();
  setMediaSession(track);

  if (autoplay) {
    audio.play().catch(() => setPlaybackVisual(false));
  }
}

function nextTrack({ autoplay = !audio.paused } = {}) {
  loadTrack(currentIndex + 1, { autoplay });
}

function previousTrack({ autoplay = !audio.paused } = {}) {
  if (audio.currentTime > 4) {
    audio.currentTime = 0;
    return;
  }
  loadTrack(currentIndex - 1, { autoplay });
}

function stopPlayback() {
  audio.pause();
  audio.currentTime = 0;
  setPlaybackVisual(false);
  updateTrackDisplay();
}

function togglePlayback() {
  if (!playerReady || !currentTrack()) return;
  if (audio.paused) {
    audio.play().catch(error => {
      console.warn('Playback blocked or unavailable:', error);
      setPlaybackVisual(false);
    });
  } else {
    audio.pause();
  }
}

function buildLibrary() {
  releaseList.replaceChildren();
  let flatIndex = 0;

  releases.forEach(release => {
    const title = document.createElement('div');
    title.className = 'release-title';
    title.textContent = release.title || 'Faixas';
    releaseList.appendChild(title);

    release.tracks.forEach(track => {
      const index = flatIndex++;
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'track-row';
      row.dataset.trackIndex = String(index);

      const no = document.createElement('span');
      no.className = 'track-index';
      no.textContent = String(index + 1).padStart(2, '0');

      const name = document.createElement('strong');
      name.textContent = track.title;

      const state = document.createElement('span');
      state.className = 'track-state';
      state.textContent = 'OUVIR';

      row.append(no, name, state);
      row.addEventListener('click', () => {
        loadTrack(index, { autoplay: true });
        musicDialog.close();
      });

      releaseList.appendChild(row);
    });
  });

  updateTrackDisplay();
}

async function loadMusicCatalog() {
  try {
    const response = await fetch('data/music.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    releases = Array.isArray(data.releases) ? data.releases : [];
    tracks = releases.flatMap(release =>
      (Array.isArray(release.tracks) ? release.tracks : []).map(track => ({
        ...track,
        releaseTitle: release.title || ''
      }))
    );

    if (!tracks.length) throw new Error('Catálogo vazio');

    playerReady = true;
    buildLibrary();
    loadTrack(0);
  } catch (error) {
    console.error('Não foi possível carregar o catálogo musical:', error);
    playerReady = false;
    trackTitle.textContent = 'Faixas temporariamente indisponíveis';
    chipTitle.textContent = 'Player indisponível';
    [playPause, stopButton, prevButton, nextButton, openLibrary, chipButton].forEach(button => {
      if (button) button.disabled = true;
    });
  }
}

playPause?.addEventListener('click', togglePlayback);
stopButton?.addEventListener('click', stopPlayback);
prevButton?.addEventListener('click', () => previousTrack());
nextButton?.addEventListener('click', () => nextTrack());

audio?.addEventListener('play', () => {
  setPlaybackVisual(true);
  updateTrackDisplay();
});
audio?.addEventListener('pause', () => {
  setPlaybackVisual(false);
  updateTrackDisplay();
});
audio?.addEventListener('ended', () => nextTrack({ autoplay: true }));
audio?.addEventListener('timeupdate', () => {
  timeCurrent.textContent = formatTime(audio.currentTime);
  timeTotal.textContent = formatTime(audio.duration);
});
audio?.addEventListener('loadedmetadata', () => {
  timeTotal.textContent = formatTime(audio.duration);
});
audio?.addEventListener('error', () => {
  setPlaybackVisual(false);
  const track = currentTrack();
  if (track) trackTitle.textContent = `${track.title} — erro ao carregar`;
});

openLibrary?.addEventListener('click', () => musicDialog.showModal());
chipButton?.addEventListener('click', () => musicDialog.showModal());
closeLibrary?.addEventListener('click', () => musicDialog.close());
musicDialog?.addEventListener('click', event => {
  if (event.target === musicDialog) musicDialog.close();
});

introPlaceholder?.addEventListener('click', () => {
  const note = document.getElementById('intro-note');
  note.textContent = 'O vídeo de apresentação da banda ainda está em produção.';
  introPlaceholder.animate(
    [{ opacity: 1 }, { opacity: .72 }, { opacity: 1 }],
    { duration: 420, easing: 'ease-out' }
  );
});

if ('mediaSession' in navigator) {
  try {
    navigator.mediaSession.setActionHandler('play', () => audio.play());
    navigator.mediaSession.setActionHandler('pause', () => audio.pause());
    navigator.mediaSession.setActionHandler('previoustrack', () => previousTrack());
    navigator.mediaSession.setActionHandler('nexttrack', () => nextTrack());
    navigator.mediaSession.setActionHandler('stop', stopPlayback);
    navigator.mediaSession.setActionHandler('seekto', details => {
      if (typeof details.seekTime === 'number' && Number.isFinite(audio.duration)) {
        audio.currentTime = Math.min(audio.duration, Math.max(0, details.seekTime));
      }
    });
  } catch {}
}

loadMusicCatalog();
