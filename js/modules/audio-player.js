/**
 * audio-player.js
 * Sin autoplay — el usuario inicia la música con el botón.
 * El botón cambia entre ícono de nota y ondas animadas.
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

  btn.addEventListener("click", () => {
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play()
        .then(() => setPlaying(true))
        .catch(err => console.warn("Audio bloqueado:", err));
    }
  });
}
