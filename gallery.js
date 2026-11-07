(() => {
  const grid = document.getElementById("gallery-grid");
  const lightbox = document.getElementById("lightbox");
  if (!grid || !lightbox) return;

  const buttons = [...grid.querySelectorAll(".gallery-item")];
  const filters = [...document.querySelectorAll(".filter-btn")];
  const image = lightbox.querySelector("img");
  const caption = lightbox.querySelector("figcaption");
  let visibleItems = buttons;
  let currentIndex = 0;
  let lastFocus = null;

  function setFilter(filter) {
    visibleItems = buttons.filter((item) => filter === "all" || item.dataset.category === filter);
    buttons.forEach((item) => {
      const visible = visibleItems.includes(item);
      item.classList.toggle("filtered-out", !visible);
      if (visible) {
        item.classList.remove("gallery-enter");
        void item.offsetWidth;
        item.classList.add("gallery-enter");
      }
    });
  }

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      filters.forEach((filterButton) => {
        const active = filterButton === button;
        filterButton.classList.toggle("active", active);
        filterButton.setAttribute("aria-pressed", String(active));
      });
      setFilter(button.dataset.filter);
    });
  });

  function showImage(index) {
    currentIndex = (index + visibleItems.length) % visibleItems.length;
    const item = visibleItems[currentIndex];
    image.src = item.dataset.image;
    image.alt = item.querySelector("img").alt;
    caption.textContent = item.dataset.caption;
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    image.src = "";
    lastFocus?.focus();
  }

  grid.addEventListener("click", (event) => {
    const item = event.target.closest(".gallery-item");
    if (!item || item.classList.contains("filtered-out")) return;
    lastFocus = item;
    showImage(visibleItems.indexOf(item));
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    lightbox.querySelector(".lightbox-close").focus();
  });

  lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
  lightbox.querySelector(".lightbox-prev").addEventListener("click", () => showImage(currentIndex - 1));
  lightbox.querySelector(".lightbox-next").addEventListener("click", () => showImage(currentIndex + 1));
  lightbox.addEventListener("click", (event) => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("open")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showImage(currentIndex - 1);
    if (event.key === "ArrowRight") showImage(currentIndex + 1);
  });

  document.querySelectorAll(".comparison-slider").forEach((slider) => {
    slider.addEventListener("input", () => {
      slider.closest(".comparison-card").querySelector(".comparison-image").style.setProperty("--split", `${slider.value}%`);
    });
  });
})();
