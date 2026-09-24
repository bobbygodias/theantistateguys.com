(() => {
  const machine = document.querySelector(".music-machine");
  const music = document.getElementById("audio");
  const library = document.getElementById("open-library");
  const controlIds = [
    "stop-track",
    "prev-track",
    "play-track",
    "next-track",
    "pause-track",
  ];
  const controls = controlIds.map((id) => document.getElementById(id));

  if (!machine || !music || controls.some((button) => !button)) return;

  /*
   * Final boombox: one static physical object. There is no CD, drawer,
   * open/close state or mechanical SFX. All internal UI stays attached to the
   * same intrinsic 672x464 radio coordinate system at every viewport size.
   */
  const cssId = "boombox-native-controls-css";
  if (!document.getElementById(cssId)) {
    const link = document.createElement("link");
    link.id = cssId;
    link.rel = "stylesheet";
    link.href = "boombox-native-controls.css?rev=20260924-1";
    document.head.appendChild(link);
  }

  if (library) library.hidden = true;

  controls.forEach((button) => {
    button.classList.add("boombox-hotspot");
    button.disabled = false;
    button.title = button.getAttribute("aria-label") || "Controle da boombox";
  });

  machine.dataset.playerState = "ready";
  music.preload = "metadata";
})();