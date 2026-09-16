(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.getElementById('site-menu-toggle');
  const setMenu = open => {
    header.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  };
  toggle.addEventListener('click', () => setMenu(!header.classList.contains('menu-open')));
  document.addEventListener('click', event => {
    if (event.target.closest('[data-route-link]')) setMenu(false);
  });
  window.addEventListener('hashchange', () => setMenu(false));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && header.classList.contains('menu-open')) {setMenu(false);toggle.focus();}
  });
})();

// Casual media-saving deterrent, not DRM. Public asset URLs remain retrievable.
document.addEventListener('contextmenu', event => {
  if (event.target.closest('img,video,audio,.music-machine,.home-world')) event.preventDefault();
});
document.addEventListener('dragstart', event => {
  if (event.target.closest('img,video,audio')) event.preventDefault();
});
