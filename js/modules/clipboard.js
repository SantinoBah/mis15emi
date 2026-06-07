/**
 * clipboard.js
 * Maneja el botón "Copiar alias" y el toast de confirmación.
 * @param {string} alias - config.regalos.alias
 */
export function initClipboard(alias) {
  const btn   = document.getElementById("btn-copy-alias");
  const toast = document.getElementById("toast");
  if (!btn) return;

  btn.addEventListener("click", () => {
    copyToClipboard(alias, btn, toast);
  });
}

function copyToClipboard(text, btn, toast) {
  const doSuccess = () => {
    btn.textContent = "✓";
    btn.classList.add("copied");
    showToast(toast);
    setTimeout(() => {
      btn.textContent = "Copiar";
      btn.classList.remove("copied");
    }, 2000);
  };

  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(doSuccess).catch(fallback);
  } else {
    fallback();
  }

  function fallback() {
    // Fallback para Safari/iOS sin Clipboard API
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.cssText = "position:fixed;opacity:0;top:0;left:0";
    document.body.appendChild(ta);
    ta.focus(); ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    doSuccess();
  }
}

function showToast(toast) {
  if (!toast) return;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}
