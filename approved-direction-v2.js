(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.getElementById('site-menu-toggle');
  const nav = document.getElementById('site-nav');
  if (!header || !toggle || !nav) return;
  const setOpen = (open) => {
    header.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  };
  toggle.addEventListener('click', () => setOpen(!header.classList.contains('menu-open')));
  nav.addEventListener('click', event => { if (event.target.closest('[data-route-link]')) setOpen(false); });
  document.querySelector('.site-mark')?.addEventListener('click', () => setOpen(false));
  window.addEventListener('hashchange', () => setOpen(false));
  window.matchMedia('(min-width: 721px)').addEventListener?.('change', event => { if (event.matches) setOpen(false); });
})();