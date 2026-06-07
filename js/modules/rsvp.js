/**
 * rsvp.js
 * Conecta el formulario visual con Google Sheets via Apps Script.
 * @param {Object} rsvpConfig - config.rsvp
 * @param {string} apodo      - config.evento.apodo
 */
export function initRsvp(rsvpConfig, apodo) {
  const formWrap  = document.getElementById("rsvp-form-wrap");
  const success   = document.getElementById("rsvp-success");
  const btnSi     = document.getElementById("btn-si");
  const btnNo     = document.getElementById("btn-no");
  const extra     = document.getElementById("extra-fields");
  const btnSend   = document.getElementById("btn-rsvp-submit");
  if (!formWrap || !btnSend) return;

  let rsvpChoice = "si";

  // Toggle Sí / No
  btnSi?.addEventListener("click", () => setChoice("si"));
  btnNo?.addEventListener("click", () => setChoice("no"));

  function setChoice(v) {
    rsvpChoice = v;
    btnSi.classList.toggle("active-si", v === "si");
    btnSi.classList.toggle("active",    v === "si");
    btnNo.classList.toggle("active",    v === "no");
    if (extra) extra.style.display = v === "si" ? "block" : "none";
  }

  // Submit
  btnSend.addEventListener("click", async () => {
    const nombreInput = document.getElementById("f-nombre");
    const nombre = nombreInput?.value.trim();
    if (!nombre) {
      nombreInput.style.borderColor = "#C96458";
      nombreInput.focus();
      return;
    }

    // Recopilar restricciones marcadas
    const dietChecked = [...document.querySelectorAll(".diet-option.checked")]
      .map(el => el.dataset.value);

    // Recopilar textos libres (alergias / otro)
    const detalleExtra = ["alergia", "otro"]
      .map(v => {
        const input = document.getElementById(`diet-text-${v}`);
        return input?.value.trim()
          ? `${v === "alergia" ? "Alergias" : "Otro"}: ${input.value.trim()}`
          : null;
      })
      .filter(Boolean)
      .join(" | ");

    const acomp = document.getElementById("f-acomp")?.value || "";
    const mensaje = document.getElementById("f-mensaje")?.value.trim() || "";

    const payload = {
      nombre:       nombre,
      asistencia:   rsvpChoice === "si" ? "Sí" : "No",
      acompanantes: acomp,
      restricciones: dietChecked.join(", ") || "ninguna",
      detalle_extra: detalleExtra,
      mensaje:      mensaje
    };

    // UI: estado cargando
    btnSend.textContent = "Enviando...";
    btnSend.disabled = true;

    try {
      await fetch(rsvpConfig.apps_script_url, {
        method:  "POST",
        mode:    "no-cors", // Apps Script requiere no-cors
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload)
      });
      // no-cors no devuelve respuesta legible, pero si no lanzó error = ok
      showSuccess(nombre);
    } catch (err) {
      console.error("Error al enviar RSVP:", err);
      btnSend.textContent = "Confirmar asistencia";
      btnSend.disabled = false;
      // Mostrar error inline
      showError();
    }
  });

  function showSuccess(nombre) {
    formWrap.style.display = "none";
    success.style.display  = "block";
    const nameDisplay = document.getElementById("rsvp-name-display");
    if (nameDisplay) nameDisplay.textContent = nombre.split(" ")[0];
  }

  function showError() {
    let err = document.getElementById("rsvp-error");
    if (!err) {
      err = document.createElement("p");
      err.id = "rsvp-error";
      err.style.cssText = "color:#C96458;font-family:var(--font-sans);font-size:.8rem;text-align:center;margin-top:.75rem";
      btnSend.insertAdjacentElement("afterend", err);
    }
    err.textContent = "Hubo un problema al enviar. Intentá de nuevo.";
  }
}
