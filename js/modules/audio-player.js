/**
 * audio-player.js
 * - Intenta reproducir música automáticamente al cargar.
 * - Si el browser bloquea el autoplay, espera el primer toque del usuario.
 * - Botón pill top-right con label dinámica "Música / Pausar".
 */
export function initAudioPlayer() {
  const btn   = document.getElementById("music-btn");
  const label = document.getElementById("music-label");
  const audio = document.getElementById("bg-music");
  if (!btn || !audio) return;

  audio.volume = 0.5;
  let playing = false;

  function setPlaying(state) {
    playing = state;
    btn.classList.toggle("playing", state);
    if (label) label.textContent = state ? "Pausar" : "Música";
  }

  // Intentar autoplay directo
  audio.play()
    .then(() => setPlaying(true))
    .catch(() => {
      // Browser bloqueó autoplay — esperamos primer interacción del usuario
      const unlockEvents = ["touchstart", "touchend", "click", "keydown"];
      function unlock() {
        audio.play().then(() => {
          setPlaying(true);
          unlockEvents.forEach(e => document.removeEventListener(e, unlock));
        }).catch(() => {});
      }
      unlockEvents.forEach(e => document.addEventListener(e, unlock, { once: true }));
    });

  // Botón manual
  btn.addEventListener("click", (e) => {
    e.stopPropagation(); // no dispara el listener de unlock
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  });
}
