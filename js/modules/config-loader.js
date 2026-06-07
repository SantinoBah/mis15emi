/**
 * config-loader.js
 * Carga config.json e inyecta todos los datos en el DOM y las variables CSS.
 * Es el primer módulo que corre. El resto de los módulos reciben el objeto
 * `config` ya resuelto a través de app.js.
 */

/**
 * Carga y retorna el objeto de configuración.
 * @returns {Promise<Object>} config
 */
export async function loadConfig() {
  const res = await fetch("config.json");
  if (!res.ok) throw new Error(`No se pudo cargar config.json (${res.status})`);
  return res.json();
}

/**
 * Aplica las variables de color del config como CSS custom properties
 * en :root, para que todo el CSS pueda usarlas directamente.
 * @param {Object} colores - config.colores
 */
export function applyCSSVars(colores) {
  const root = document.documentElement;
  root.style.setProperty("--c-rose",       colores.rose);
  root.style.setProperty("--c-rose-light", colores.rose_light);
  root.style.setProperty("--c-rose-pale",  colores.rose_pale);
  root.style.setProperty("--c-gold",       colores.gold);
  root.style.setProperty("--c-gold-light", colores.gold_light);
  root.style.setProperty("--c-cream",      colores.cream);
  root.style.setProperty("--c-dark",       colores.dark);
  root.style.setProperty("--c-mid",        colores.mid);
  // Border derivado del gold con transparencia
  root.style.setProperty("--c-border", hexToRgba(colores.gold, 0.25));
}

/**
 * Inyecta los textos estáticos en el DOM.
 * Todos los IDs referencian los comentarios en index.html.
 * @param {Object} config
 */
export function injectContent(config) {
  // ── META ──────────────────────────────────────
  document.title = config.meta.titulo_pagina;
  setMeta("description",    config.meta.descripcion);
  setMeta("og:title",       config.meta.titulo_pagina);
  setMeta("og:description", config.meta.descripcion);
  setMeta("og:image",       config.meta.og_image);

  // ── HERO ──────────────────────────────────────
  const invitado = getUrlParam("invitado");
  setText("hero-greeting",
    invitado
      ? `¡Hola, ${decodeURIComponent(invitado)}! 🌸`
      : config.hero.saludo_default
  );
  // Foto hero: si el path existe, crea la imagen; si no, muestra placeholder SVG
  const frame = document.getElementById("hero-frame");
  if (config.hero.foto_path) {
    frame.innerHTML = `<img src="${config.hero.foto_path}" alt="Foto de ${config.evento.nombre}" class="hero-photo-img">`;
  } else {
    frame.innerHTML = heroPlaceholder(config.evento.nombre);
  }
  setText("hero-nombre",    config.evento.nombre);
  setText("hero-subtitulo", config.hero.subtitulo);
  setText("hero-fecha",     config.evento.fecha_display);

  // ── AUDIO ─────────────────────────────────────
  const audio = document.getElementById("bg-music");
  audio.src = config.audio.src;

  // ── BIENVENIDA ────────────────────────────────
  setHTML("bienvenida-texto", nl2br(config.bienvenida.texto));
  setText("bienvenida-firma", config.bienvenida.firma);

  // ── SALÓN ─────────────────────────────────────
  setText("salon-nombre",     config.salon.nombre);
  setText("salon-fecha-hora", `${config.evento.fecha_display} · ${config.salon.horario}`);
  setText("salon-direccion",  config.salon.direccion);
  setAttr("btn-maps", "href", config.salon.maps_url);

  // ── GALERÍA ───────────────────────────────────
  setText("galeria-titulo", config.galeria.titulo);
  buildGallery(config.galeria.fotos);

  // ── DRESS CODE ────────────────────────────────
  setText("dresscode-descripcion",  config.dresscode.descripcion);
  setText("dresscode-restriccion",  config.dresscode.restriccion);
  buildColorPalette(config.dresscode.paleta);

  // ── INSTAGRAM ─────────────────────────────────
  setText("instagram-hashtag",     config.instagram.hashtag);
  setAttr("btn-instagram", "href", config.instagram.url);

  // ── PLAYLIST ──────────────────────────────────
  setHTML("playlist-texto",        nl2br(config.playlist.texto));
  setAttr("btn-playlist", "href",  config.playlist.forms_url);

  // ── REGALOS ───────────────────────────────────
  setHTML("regalos-intro",   nl2br(config.regalos.texto_intro));
  setText("regalo-titular",  config.regalos.titular);
  setText("regalo-banco",    config.regalos.banco);
  setText("regalo-cbu",      config.regalos.cbu);
  setText("regalo-alias",    config.regalos.alias);
  setText("regalos-footer",  config.regalos.texto_footer);

  // ── TRIVIA ────────────────────────────────────
  setText("trivia-apodo", config.evento.apodo);

  // ── RSVP ──────────────────────────────────────
  setText("rsvp-fecha-limite",    config.rsvp.fecha_limite_display);
  setText("rsvp-mensaje-exito",   config.rsvp.mensaje_exito);
  buildDietOptions(config.rsvp.opciones_dieta);
  // Apodo en el label del campo mensaje
  document.querySelectorAll(".rsvp-apodo").forEach(el => {
    el.textContent = config.evento.apodo;
  });

  // ── FOOTER ────────────────────────────────────
  setText("footer-nombre", config.evento.nombre);
  setText("footer-fecha",  `${config.evento.fecha_display} · quince años`);
}

// ─────────────────────────────────────────────────────────
// HELPERS PRIVADOS
// ─────────────────────────────────────────────────────────

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function setHTML(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = value;
}

function setAttr(id, attr, value) {
  const el = document.getElementById(id);
  if (el) el.setAttribute(attr, value);
}

function setMeta(name, content) {
  const el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
  if (el) el.setAttribute("content", content);
}

function getUrlParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

/** Convierte \n en <br> para textos multilinea del JSON */
function nl2br(str) {
  return (str || "").replace(/\n/g, "<br>");
}

/** Genera la galería de fotos dinámicamente */
function buildGallery(fotos) {
  const grid = document.getElementById("gallery-grid");
  if (!grid || !fotos?.length) return;

  grid.innerHTML = fotos.map((foto, i) => `
    <div class="gallery-item ${i === 0 ? 'gallery-item--wide' : ''}" role="listitem">
      <img src="${foto.src}" alt="${foto.alt}" loading="lazy">
    </div>
  `).join("");
}

/** Genera los chips de paleta de colores del dress code */
function buildColorPalette(paleta) {
  const container = document.getElementById("dresscode-palette");
  if (!container || !paleta?.length) return;

  container.innerHTML = paleta.map(color => `
    <div class="color-chip" role="listitem">
      <div class="color-chip-dot" style="background:${color.hex}" title="${color.nombre}"></div>
      <span class="color-chip-name">${color.nombre}</span>
    </div>
  `).join("");
}

/** Genera los checkboxes/campos de dieta desde el config */
function buildDietOptions(opciones) {
  const container = document.getElementById("diet-options-container");
  if (!container || !opciones?.length) return;

  container.innerHTML = opciones.map(op => {
    if (op.tipo === "texto") {
      return `
        <div class="diet-option diet-option--texto" data-value="${op.valor}" role="button" tabindex="0">
          <div class="diet-check">
            <svg viewBox="0 0 10 10">
              <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="#fff" stroke-width="1.5" fill="none"/>
            </svg>
          </div>
          <span>${op.label}</span>
        </div>
        <input
          type="text"
          class="diet-text-input"
          id="diet-text-${op.valor}"
          placeholder="${op.placeholder || ''}"
          style="display:none"
        >
      `;
    }
    return `
      <div class="diet-option" data-value="${op.valor}" role="button" tabindex="0">
        <div class="diet-check">
          <svg viewBox="0 0 10 10">
            <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="#fff" stroke-width="1.5" fill="none"/>
          </svg>
        </div>
        <span>${op.label}</span>
      </div>
    `;
  }).join("");

  // Evento directo en cada opción (más confiable que delegación en mobile)
  container.querySelectorAll(".diet-option").forEach(el => {
    function toggle() {
      el.classList.toggle("checked");
      const textInput = document.getElementById(`diet-text-${el.dataset.value}`);
      if (textInput) {
        textInput.style.display = el.classList.contains("checked") ? "block" : "none";
        if (el.classList.contains("checked")) textInput.focus();
      }
    }
    el.addEventListener("click", toggle);
    el.addEventListener("keydown", e => { if (e.key === " " || e.key === "Enter") toggle(); });
  });
}

/** Placeholder SVG para cuando no hay foto de hero */
function heroPlaceholder(nombre) {
  return `
    <div class="hero-photo-placeholder">
      <svg viewBox="0 0 48 48" width="48" height="48">
        <path d="M24 8a8 8 0 1 1 0 16A8 8 0 0 1 24 8zm0 20c10 0 16 4.5 16 7v2H8v-2c0-2.5 6-7 16-7z" fill="currentColor"/>
      </svg>
      <span>Foto de ${nombre}</span>
    </div>
  `;
}

/** Convierte hex a rgba */
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
