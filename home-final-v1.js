(() => {
  const machine = document.querySelector(".music-machine");
  const insert = document.getElementById("insert-cd");
  const legacyEject = document.getElementById("eject-cd");
  const legacyLibrary = document.getElementById("open-library");
  const sfx = document.getElementById("cd-close-sfx");
  const music = document.getElementById("audio");
  const controls = [
    "stop-track",
    "prev-track",
    "play-pause",
    "next-track",
  ]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (!machine || !insert) return;

  // Load the native-control geometry after the canonical CSS. The artwork is
  // untouched: only invisible interaction zones are changed.
  if (!document.querySelector('link[data-boombox-native-controls="true"]')) {
    const nativeControlsCss = document.createElement("link");
    nativeControlsCss.rel = "stylesheet";
    nativeControlsCss.href = "boombox-native-controls.css?rev=20260917-1";
    nativeControlsCss.dataset.boomboxNativeControls = "true";
    document.head.appendChild(nativeControlsCss);
  }

  machine.classList.add("boombox-native-controls");

  // Remove the artificial visual interface immediately, before the override
  // stylesheet finishes loading, so slow connections never flash grey buttons.
  [legacyEject, legacyLibrary].forEach((button) => {
    if (!button) return;
    button.hidden = true;
    button.disabled = true;
    button.tabIndex = -1;
    button.setAttribute("aria-hidden", "true");
  });

  controls.forEach((button) => {
    button.classList.add("boombox-hotspot");
    button.style.background = "transparent";
    button.style.boxShadow = "none";
    button.style.borderColor = "transparent";
    button.style.color = "transparent";
  });

  let state = "open";
  let timer;
  let readyTimer;

  function setState(next) {
    state = next;
    machine.dataset.cdState = next;
    controls.forEach((button) => (button.disabled = next !== "ready"));
    insert.disabled = next !== "open";
    insert.setAttribute("aria-hidden", String(next !== "open"));
    machine.setAttribute("aria-busy", String(next === "closing"));
  }

  function ready() {
    if (state !== "closing") return;
    clearTimeout(readyTimer);
    setState("ready");
    document.getElementById("play-pause")?.focus({ preventScroll: true });
    if (music) {
      music.preload = "metadata";
      music.load();
    }
    document.dispatchEvent(new CustomEvent("tasg:cd-ready"));
  }

  insert.addEventListener("click", () => {
    if (state !== "open") return;
    setState("closing");

    // Unlock the provided effect inside the user gesture, then play it at the
    // real closing moment. If audio is blocked, visual state still completes.
    if (sfx) {
      sfx.muted = true;
      sfx
        .play()
        .then(() => {
          sfx.pause();
          sfx.currentTime = 0;
          sfx.muted = false;
        })
        .catch(() => {
          sfx.muted = false;
        });
    }

    timer = setTimeout(() => {
      if (state !== "closing") return;
      if (!sfx) {
        ready();
        return;
      }
      sfx.currentTime = 0;
      sfx.muted = false;
      sfx.play().catch(ready);
      readyTimer = setTimeout(ready, 8500);
    }, 950);
  });

  sfx?.addEventListener("ended", ready);
  sfx?.addEventListener("error", ready);

  // The library is no longer part of the visible radio. Keep the existing
  // dialog/data code isolated for now, but block programmatic track selection
  // until the physical CD has completed its closing state.
  document.addEventListener(
    "click",
    (event) => {
      if (event.target.closest?.(".track-row") && state !== "ready") {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true,
  );

  setState("open");
})();
