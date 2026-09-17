(() => {
  const machine = document.querySelector(".music-machine");
  const insert = document.getElementById("insert-cd");
  const eject = document.getElementById("eject-cd");
  const library = document.getElementById("open-library");
  const sfx = document.getElementById("cd-close-sfx");
  const music = document.getElementById("audio");
  const controls = [
    "stop-track",
    "prev-track",
    "play-pause",
    "next-track",
  ].map((id) => document.getElementById(id));

  if (!machine || !insert || !eject || controls.some((button) => !button)) return;

  /*
   * The approved radio artwork is the UI. Do not draw replacement buttons.
   * Load an interaction-only stylesheet that maps transparent HTML buttons to
   * the physical keys already present in the 672x464 boombox image.
   */
  const cssId = "boombox-native-controls-css";
  if (!document.getElementById(cssId)) {
    const link = document.createElement("link");
    link.id = cssId;
    link.rel = "stylesheet";
    link.href = "boombox-native-controls.css?rev=20260917-2";
    document.head.appendChild(link);
  }

  // Prevent one-frame flashes of the old auxiliary UI while the override CSS loads.
  eject.hidden = true;
  if (library) library.hidden = true;

  controls.forEach((button) => {
    button.classList.add("boombox-hotspot");
    button.title = button.getAttribute("aria-label") || "Controle da boombox";
  });

  let state = "open",
    timer,
    readyTimer;

  function setState(next) {
    state = next;
    machine.dataset.cdState = next;
    controls.forEach((button) => (button.disabled = next !== "ready"));
    insert.disabled = next !== "open";
    // Eject remains an internal state hook only; it has no visible UI.
    eject.disabled = next !== "ready";
    insert.setAttribute("aria-hidden", String(next !== "open"));
    machine.setAttribute(
      "aria-busy",
      String(next === "closing" || next === "opening"),
    );
  }

  function ready() {
    if (state !== "closing") return;
    clearTimeout(readyTimer);
    setState("ready");
    document.getElementById("play-pause")?.focus({ preventScroll: true });
    music.preload = "metadata";
    music.load();
    document.dispatchEvent(new CustomEvent("tasg:cd-ready"));
  }

  insert.addEventListener("click", () => {
    if (state !== "open") return;
    setState("closing");

    // Unlock the provided effect in this touch gesture, then play it at closure.
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

  /*
   * Keep the old eject state transition internally available for regression
   * tooling/future use, but there is deliberately no visible EJECT control.
   */
  eject.addEventListener("click", () => {
    if (state !== "ready") return;
    clearTimeout(timer);
    clearTimeout(readyTimer);
    music.pause();
    try {
      music.currentTime = 0;
    } catch {}
    sfx?.pause();
    setState("opening");
    timer = setTimeout(() => {
      setState("open");
      insert.focus({ preventScroll: true });
      document.dispatchEvent(new CustomEvent("tasg:cd-open"));
    }, 700);
  });

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
