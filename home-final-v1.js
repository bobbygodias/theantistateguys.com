(() => {
  const machine = document.querySelector('.music-machine');
  const insertButton = document.getElementById('insert-cd');
  const ejectButton = document.getElementById('eject-cd');
  const closeSfx = document.getElementById('cd-close-sfx');
  const audio = document.getElementById('audio');
  const libraryButton = document.getElementById('open-library');
  const transportIds = ['stop-track','prev-track','play-pause','next-track'];
  const transportButtons = transportIds.map(id => document.getElementById(id)).filter(Boolean);

  if (!machine || !insertButton || !ejectButton) return;

  let state = machine.dataset.cdState || 'open';
  let timer = null;

  function setControlsEnabled(enabled){
    transportButtons.forEach(button => { button.disabled = !enabled; });
    if (libraryButton) libraryButton.disabled = !enabled;
  }

  function setState(next){
    state = next;
    machine.dataset.cdState = next;
    const ready = next === 'ready';
    const open = next === 'open';

    insertButton.disabled = !open;
    insertButton.setAttribute('aria-hidden', ready ? 'true' : 'false');
    ejectButton.disabled = !ready;
    setControlsEnabled(ready);
  }

  function playDrawerSound(){
    if (!closeSfx) return;
    try {
      closeSfx.pause();
      closeSfx.currentTime = 0;
      const promise = closeSfx.play();
      if (promise && typeof promise.catch === 'function') promise.catch(() => {});
    } catch (_) {}
  }

  function insertDisc(){
    if (state !== 'open') return;
    clearTimeout(timer);
    setState('closing');
    playDrawerSound();

    timer = window.setTimeout(() => {
      setState('ready');
      document.dispatchEvent(new CustomEvent('tasg:cd-ready'));
    }, 1500);
  }

  function ejectDisc(){
    if (state !== 'ready') return;
    clearTimeout(timer);

    if (audio) {
      audio.pause();
      try { audio.currentTime = 0; } catch (_) {}
    }

    setControlsEnabled(false);
    machine.dataset.cdState = 'opening';
    state = 'opening';

    timer = window.setTimeout(() => {
      setState('open');
      document.dispatchEvent(new CustomEvent('tasg:cd-open'));
    }, 700);
  }

  // Evita que a biblioteca drible a metáfora física do aparelho.
  document.addEventListener('click', event => {
    const track = event.target.closest?.('.track-row');
    if (!track || state === 'ready') return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);

  insertButton.addEventListener('click', insertDisc);
  ejectButton.addEventListener('click', ejectDisc);

  // Estado inicial: aparelho existe, mas transporte só acorda depois do CD entrar.
  setState('open');
})();
