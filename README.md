# 🌸 Invitación Digital — Quinces

Plantilla modular para invitaciones de 15 años. Un solo archivo JSON controla toda la personalización.

---

## 🚀 Setup rápido (nuevo cliente)

1. **Duplicar carpeta** → renombrar `quinces-[nombre]`
2. **Editar `config.json`** con los datos del nuevo evento
3. **Reemplazar assets** en `assets/img/` y `assets/audio/`
4. **Deploy** → drag & drop a [Netlify](https://netlify.com) o `git push`

---

## 📁 Estructura

```
quinces-[nombre]/
├── config.json                 ← ★ ÚNICA fuente de verdad
├── index.html                  ← Estructura HTML (no tocar salvo cambios de layout)
├── assets/
│   ├── img/
│   │   ├── hero-portada.webp   ← Foto principal (recomendado: 800×1067px WebP)
│   │   └── galeria/
│   │       ├── 01.webp … 05.webp
│   └── audio/
│       └── cancion.mp3
├── css/
│   ├── main.css
│   ├── utils.css
│   └── sections/
│       ├── hero.css
│       ├── countdown.css
│       ├── gallery.css
│       └── rsvp.css
└── js/
    ├── app.js                  ← Entry point
    └── modules/
        ├── config-loader.js
        ├── countdown.js
        ├── audio-player.js
        ├── gallery.js
        ├── clipboard.js
        ├── trivia.js
        ├── rsvp.js
        └── fade-in.js
```

---

## ⚙️ config.json — referencia rápida

| Clave | Qué controla |
|---|---|
| `evento.nombre` | Nombre completo de la quinceañera |
| `evento.apodo` | Apodo (usado en trivia, RSVP) |
| `evento.fecha_iso` | Fecha del evento en ISO 8601 (para el countdown) |
| `hero.foto_path` | Ruta a la foto del hero (dejar vacío `""` para placeholder) |
| `salon.maps_url` | Link directo a Google Maps |
| `galeria.fotos` | Array de `{ src, alt }` — agregar/quitar fotos aquí |
| `dresscode.paleta` | Array de `{ nombre, hex }` para los chips de color |
| `regalos.alias` | Alias bancario (el botón Copiar lo usa) |
| `trivia.preguntas` | Array de preguntas con `pregunta`, `opciones[]`, `correcta` (índice 0-based) |
| `rsvp.forms_url` | Link al Google Forms real |
| `colores.*` | Paleta completa — se aplica como CSS vars en runtime |

---

## 🌐 URL personalizada por invitado

Agregá `?invitado=Familia+García` a la URL y el hero saluda por nombre automáticamente.

---

## 📲 Deploy en Netlify (drag & drop)

1. Ir a [app.netlify.com](https://app.netlify.com)
2. Arrastrar la carpeta del proyecto al área de deploy
3. ¡Listo! Netlify genera una URL pública al instante

> **Nota:** `index.html` usa `type="module"` en el script, lo que requiere ser servido
> desde un servidor HTTP (no abrir como archivo local con `file://`).
> Para probar localmente: `npx serve .` o la extensión Live Server de VS Code.

---

## 🔧 Agregar un nuevo módulo JS

1. Crear `js/modules/nuevo-modulo.js` con una función `export function initNuevoModulo(config) {}`
2. Importarla en `js/app.js`
3. Llamarla dentro del bloque `try` pasándole el config que necesite
