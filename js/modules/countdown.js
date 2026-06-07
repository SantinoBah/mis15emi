/**
 * countdown.js
 * Actualiza el contador regresivo cada segundo.
 * @param {string} fechaIso - config.evento.fecha_iso
 */
export function initCountdown(fechaIso) {
  const target = new Date(fechaIso);
  const pad    = n => String(n).padStart(2, "0");
  const els    = {
    days:  document.getElementById("cd-days"),
    hours: document.getElementById("cd-hours"),
    mins:  document.getElementById("cd-mins"),
    secs:  document.getElementById("cd-secs"),
  };

  function tick() {
    const diff = target - new Date();
    if (diff <= 0) {
      Object.values(els).forEach(el => { if (el) el.textContent = "00"; });
      return;
    }
    if (els.days)  els.days.textContent  = pad(Math.floor(diff / 86400000));
    if (els.hours) els.hours.textContent = pad(Math.floor((diff % 86400000) / 3600000));
    if (els.mins)  els.mins.textContent  = pad(Math.floor((diff % 3600000) / 60000));
    if (els.secs)  els.secs.textContent  = pad(Math.floor((diff % 60000) / 1000));
  }

  tick();
  setInterval(tick, 1000);
}
