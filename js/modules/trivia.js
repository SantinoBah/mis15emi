/**
 * trivia.js
 * Construye y controla la trivia interactiva desde config.trivia.
 * @param {Object} triviaConfig - config.trivia
 */
export function initTrivia(triviaConfig) {
  const container = document.getElementById("trivia-container");
  if (!container || !triviaConfig?.preguntas?.length) return;

  const preguntas = triviaConfig.preguntas;
  const mensajes  = triviaConfig.mensajes_resultado;
  const letters   = ["A", "B", "C", "D"];
  let currentQ = 0, score = 0, answered = false;

  // Render inicial del HTML del juego
  container.innerHTML = `
    <div class="trivia-progress-bar">
      <div class="trivia-progress-fill" id="trivia-progress" style="width:0%"></div>
    </div>
    <div id="trivia-game">
      <p class="trivia-q-number" id="trivia-qnum"></p>
      <p class="trivia-question"  id="trivia-question"></p>
      <div class="trivia-options" id="trivia-options"></div>
      <div class="trivia-nav">
        <button class="btn-next" id="btn-trivia-next" style="display:none">Siguiente →</button>
      </div>
    </div>
    <div class="trivia-result" id="trivia-result" style="display:none">
      <p class="trivia-q-number">Tu resultado</p>
      <p class="trivia-score"      id="trivia-score-display"></p>
      <p class="trivia-result-msg" id="trivia-result-msg"></p>
      <button class="btn-restart"  id="btn-trivia-restart">Jugar de nuevo</button>
    </div>
  `;

  document.getElementById("btn-trivia-next").addEventListener("click", nextQuestion);
  document.getElementById("btn-trivia-restart").addEventListener("click", restart);

  renderQuestion();

  // ── funciones internas ──────────────────────────────────
  function renderQuestion() {
    const q = preguntas[currentQ];
    answered = false;

    document.getElementById("trivia-qnum").textContent =
      `Pregunta ${currentQ + 1} de ${preguntas.length}`;
    document.getElementById("trivia-question").textContent = q.pregunta;
    document.getElementById("trivia-progress").style.width =
      `${(currentQ / preguntas.length) * 100}%`;
    document.getElementById("btn-trivia-next").style.display = "none";

    const optContainer = document.getElementById("trivia-options");
    optContainer.innerHTML = q.opciones.map((opt, i) => `
      <button class="trivia-option" data-index="${i}">
        <span class="option-letter">${letters[i]}</span>${opt}
      </button>
    `).join("");

    optContainer.querySelectorAll(".trivia-option").forEach(btn => {
      btn.addEventListener("click", () => selectAnswer(parseInt(btn.dataset.index), q.correcta));
    });
  }

  function selectAnswer(idx, correct) {
    if (answered) return;
    answered = true;

    const btns = document.querySelectorAll(".trivia-option");
    btns.forEach(b => b.disabled = true);
    btns[correct].classList.add("correct");
    if (idx !== correct) {
      btns[idx].classList.add("wrong");
    } else {
      score++;
    }
    document.getElementById("btn-trivia-next").style.display = "block";
  }

  function nextQuestion() {
    currentQ++;
    if (currentQ < preguntas.length) {
      renderQuestion();
    } else {
      showResult();
    }
  }

  function showResult() {
    document.getElementById("trivia-game").style.display   = "none";
    document.getElementById("trivia-result").style.display = "block";
    document.getElementById("trivia-progress").style.width = "100%";
    document.getElementById("trivia-score-display").textContent = `${score}/${preguntas.length}`;
    document.getElementById("trivia-result-msg").textContent =
      mensajes[score] || mensajes[mensajes.length - 1];
  }

  function restart() {
    currentQ = 0; score = 0;
    document.getElementById("trivia-result").style.display = "none";
    document.getElementById("trivia-game").style.display   = "block";
    renderQuestion();
  }
}
