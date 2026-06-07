/**
 * fade-in.js
 * Activa la animación de entrada en todos los elementos .fade-in
 * usando IntersectionObserver para performance óptima.
 */
export function initFadeIn() {
  const elements = document.querySelectorAll(".fade-in");
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(el => observer.observe(el));
}
