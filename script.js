const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 40);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!open));
  mainNav?.classList.toggle('is-open', !open);
});

mainNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menuToggle?.setAttribute('aria-expanded', 'false');
  mainNav.classList.remove('is-open');
}));

const formatDate = (iso) => {
  try {
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(new Date(iso));
  } catch {
    return '';
  }
};

async function loadVideos() {
  const grid = document.getElementById('video-grid');
  if (!grid) return;

  try {
    const response = await fetch('data/videos.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('feed unavailable');
    const videos = await response.json();
    if (!Array.isArray(videos) || videos.length === 0) throw new Error('empty feed');

    grid.replaceChildren(...videos.slice(0, 3).map(video => {
      const article = document.createElement('article');
      article.className = 'video-card';

      const frame = document.createElement('div');
      frame.className = 'video-frame';
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.id)}`;
      iframe.title = video.title || 'Vídeo de Bobby Dias & The Anti-State Guys';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      frame.appendChild(iframe);

      const info = document.createElement('div');
      info.className = 'video-info';
      const title = document.createElement('h3');
      title.textContent = video.title || 'Vídeo oficial';
      info.appendChild(title);
      if (video.published) {
        const time = document.createElement('time');
        time.dateTime = video.published;
        time.textContent = formatDate(video.published);
        info.appendChild(time);
      }

      article.append(frame, info);
      return article;
    }));
  } catch {
    grid.innerHTML = `
      <div class="video-fallback">
        <p>Os vídeos estão no canal oficial.</p>
        <a href="https://www.youtube.com/@TheAntiStateGuys" target="_blank" rel="noopener noreferrer">Abrir The Anti-State Guys no YouTube ↗</a>
      </div>`;
  }
}

loadVideos();
