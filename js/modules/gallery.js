/**
 * gallery.js
 * El grid ya fue construido por config-loader.js (buildGallery).
 * Este módulo puede extenderse para lightbox, swipe, etc.
 * Por ahora inicializa el lazy-loading reforzado para browsers sin soporte nativo.
 */
export function initGallery() {
  // Lazy loading nativo ya está en los <img loading="lazy">
  // IntersectionObserver como polyfill para browsers viejos
  if ("IntersectionObserver" in window) return; // nativo soportado, no hace falta

  const imgs = document.querySelectorAll("#gallery-grid img[loading='lazy']");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const img = e.target;
        if (img.dataset.src) img.src = img.dataset.src;
        io.unobserve(img);
      }
    });
  });
  imgs.forEach(img => io.observe(img));
}
