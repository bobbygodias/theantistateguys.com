(() => {
  const header = document.querySelector(".site-header");
  const toggle = document.getElementById("site-menu-toggle");
  const setMenu = (open) => {
    header.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  };
  toggle.addEventListener("click", () =>
    setMenu(!header.classList.contains("menu-open")),
  );
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-route-link]")) setMenu(false);
  });
  window.addEventListener("hashchange", () => setMenu(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && header.classList.contains("menu-open")) {
      setMenu(false);
      toggle.focus();
    }
  });
})();

// Casual media-saving deterrent, not DRM. Public asset URLs remain retrievable.
document.addEventListener("contextmenu", (event) => {
  if (event.target.closest("img,video,audio,.music-machine,.home-world"))
    event.preventDefault();
});
document.addEventListener("dragstart", (event) => {
  if (event.target.closest("img,video,audio")) event.preventDefault();
});

// Keep the established official channel feed reachable from the music library.
(() => {
  const dialog = document.getElementById("music-dialog");
  let loaded = false;
  document
    .getElementById("open-library")
    ?.addEventListener("click", async () => {
      if (loaded) return;
      loaded = true;
      try {
        const response = await fetch("data/videos.json");
        if (!response.ok) throw new Error("feed");
        const videos = await response.json();
        const section = document.createElement("section");
        section.className = "official-videos";
        const title = document.createElement("h3");
        title.textContent = "NO YOUTUBE";
        section.append(title);
        videos
          .filter((video) => /^[\w-]{11}$/.test(video.id))
          .slice(0, 6)
          .forEach((video) => {
            const link = document.createElement("a");
            link.href = "https://www.youtube.com/watch?v=" + video.id;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent =
              video.title
                .replace(
                  /^Bobby Dias\s*(?:&|•)\s*The Anti-State Guys\s*[-•—]?\s*/i,
                  "",
                )
                .replace(/\s+#.*/, "")
                .trim() + " ↗";
            section.append(link);
          });
        if (section.children.length > 1)
          dialog.querySelector(".dialog-shell").append(section);
      } catch {
        loaded = false;
      }
    });
})();
