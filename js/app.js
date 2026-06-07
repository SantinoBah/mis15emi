/**
 * app.js · Entry point
 * Carga config.json y luego inicializa cada módulo en orden.
 * Para añadir un nuevo módulo: importarlo aquí y llamarlo dentro del bloque try.
 */

import { loadConfig, applyCSSVars, injectContent } from "./modules/config-loader.js";
import { initCountdown }    from "./modules/countdown.js";
import { initAudioPlayer }  from "./modules/audio-player.js";
import { initGallery }      from "./modules/gallery.js";
import { initClipboard }    from "./modules/clipboard.js";
import { initTrivia }       from "./modules/trivia.js";
import { initRsvp }         from "./modules/rsvp.js";
import { initFadeIn }       from "./modules/fade-in.js";

(async () => {
  try {
    // 1. Cargar config
    const config = await loadConfig();

    // 2. Aplicar paleta de colores al :root (debe ir PRIMERO para evitar flash)
    applyCSSVars(config.colores);

    // 3. Inyectar todos los textos y contenidos estáticos
    injectContent(config);

    // 4. Inicializar módulos interactivos (reciben config para no re-leer JSON)
    initCountdown(config.evento.fecha_iso);
    initAudioPlayer();
    initGallery();
    initClipboard(config.regalos.alias);
    initTrivia(config.trivia);
    initRsvp(config.rsvp, config.evento.apodo);
    initFadeIn();

  } catch (err) {
    console.error("[app.js] Error al inicializar la aplicación:", err);
    // Fallback visible solo en desarrollo
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
      document.body.insertAdjacentHTML("afterbegin",
        `<div style="position:fixed;top:0;left:0;right:0;background:#C96458;color:#fff;
          padding:.75rem 1rem;font-family:monospace;font-size:.8rem;z-index:9999">
          ⚠ Error al cargar config.json — revisá la consola
        </div>`
      );
    }
  }
})();
