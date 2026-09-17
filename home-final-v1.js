(() => {
  const machine = document.querySelector(".music-machine");
  const insert = document.getElementById("insert-cd");
  const eject = document.getElementById("eject-cd");
  const sfx = document.getElementById("cd-close-sfx");
  const music = document.getElementById("audio");
  const controls = [
    "stop-track",
    "prev-track",
    "play-pause",
    "next-track",
    "open-library",
  ].map((id) => document.getElementById(id));
  if (!machine || !insert || !eject) return;
  let state = "open",
    timer,
    readyTimer;
  function setState(next) {
    state = next;
    machine.dataset.cdState = next;
    controls.forEach((button) => (button.disabled = next !== "ready"));
    insert.disabled = next !== "open";
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
    document.getElementById("play-pause").focus({ preventScroll: true });
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
