const GALACTIC_TABLES_KEY = "numeronautas_tablas_galacticas";

const galacticTables = {
  current: 1,
  factor: 1,
  locked: false,
  progress: loadGalacticTablesProgress(),
  returnScreen: "start",
};

const tableThemes = [
  { color: "#55f6ff", accent: "#7667ff", icon: "orb" },
  { color: "#7effa7", accent: "#22d8ee", icon: "sprout" },
  { color: "#ffdf55", accent: "#ff8f5a", icon: "star" },
  { color: "#ff7bc8", accent: "#8f68ff", icon: "comet" },
  { color: "#8f68ff", accent: "#55f6ff", icon: "moon" },
  { color: "#4cffc4", accent: "#1f91ee", icon: "planet" },
  { color: "#ff8f5a", accent: "#ffdf55", icon: "rocket" },
  { color: "#61a8ff", accent: "#4cffc4", icon: "ring" },
  { color: "#d78bff", accent: "#55f6ff", icon: "nova" },
];

function loadGalacticTablesProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(GALACTIC_TABLES_KEY)) || {};
    return sanitizeGalacticTablesProgress(saved);
  } catch {
    return sanitizeGalacticTablesProgress();
  }
}

function saveGalacticTablesProgress() {
  galacticTables.progress = sanitizeGalacticTablesProgress(galacticTables.progress);
  try {
    localStorage.setItem(GALACTIC_TABLES_KEY, JSON.stringify(galacticTables.progress));
  } catch {
    // Las tablas siguen funcionando aunque el guardado local no este disponible.
  }
}

function sanitizeGalacticTablesProgress(rawProgress = {}) {
  const progress = { completed: {}, practiced: {} };

  for (let table = 1; table <= 9; table += 1) {
    const practicedTable = rawProgress.practiced?.[table] || {};
    for (let factor = 1; factor <= 9; factor += 1) {
      if (practicedTable[factor] === true) {
        progress.practiced[table] ||= {};
        progress.practiced[table][factor] = true;
      }
    }

    if (Object.keys(progress.practiced[table] || {}).length === 9 && rawProgress.completed?.[table] === true) {
      progress.completed[table] = true;
    }
  }

  return progress;
}

function completedTablesCount() {
  return Object.keys(galacticTables.progress.completed).length;
}

function renderGalacticTables() {
  const grid = document.querySelector("#tablesGrid");
  if (!grid) return;
  grid.innerHTML = "";

  for (let table = 1; table <= 9; table += 1) {
    const theme = tableThemes[table - 1];
    const completed = Boolean(galacticTables.progress.completed[table]);
    const card = document.createElement("button");
    card.className = `table-module ${completed ? "completed" : ""}`;
    card.type = "button";
    card.style.setProperty("--table-color", theme.color);
    card.style.setProperty("--table-accent", theme.accent);
    card.innerHTML = `
      <span class="table-planet-number">${table}</span>
      <span class="table-creature ${theme.icon}" aria-hidden="true"></span>
      <span class="table-number">Tabla del ${table}</span>
      <span class="table-mini-products">${table}x1 · ${table}x5 · ${table}x9</span>
      <span class="table-stars">${completed ? "★★★" : "☆☆☆"}</span>
    `;
    card.addEventListener("click", () => openGalacticTable(table));
    grid.appendChild(card);
  }

  updateGalacticTablesProgress();
}

function updateGalacticTablesProgress() {
  const count = completedTablesCount();
  const progressText = document.querySelector("#tablesProgressText");
  const progressBar = document.querySelector("#tablesProgressBar");
  const totalStars = document.querySelector("#tablesTotalStars");
  if (progressText) progressText.textContent = `${count}/9`;
  if (progressBar) progressBar.style.width = `${(count / 9) * 100}%`;
  if (totalStars) totalStars.textContent = `${"★".repeat(Math.min(3, Math.ceil(count / 3)))}${"☆".repeat(3 - Math.min(3, Math.ceil(count / 3)))}`;
}

function openGalacticTables(returnScreen = "start") {
  galacticTables.returnScreen = returnScreen;
  renderGalacticTables();
  showGalacticTablesList();
  showScreen("tables");
  playGalacticTone(520, 0.06);
}

function showGalacticTablesList() {
  document.querySelector("#tablesSelectView")?.classList.remove("hidden");
  document.querySelector("#tableDetailView")?.classList.add("hidden");
}

function openGalacticTable(table) {
  galacticTables.current = table;
  galacticTables.factor = nextTableFactor(table);
  galacticTables.locked = false;
  const theme = tableThemes[table - 1];
  const detail = document.querySelector("#tableDetailView");
  const select = document.querySelector("#tablesSelectView");
  const orbit = document.querySelector("#tableOrbitCard");
  if (!detail || !select) return;

  select.classList.add("hidden");
  detail.classList.remove("hidden");
  detail.style.setProperty("--table-color", theme.color);
  detail.style.setProperty("--table-accent", theme.accent);
  orbit?.style.setProperty("--table-color", theme.color);
  orbit?.style.setProperty("--table-accent", theme.accent);
  document.querySelector("#tableDetailEyebrow").textContent = `Tabla del ${table}`;
  document.querySelector("#tableDetailTitle").textContent = `Portal Galactico ${table}`;
  renderTableChallenge();
  playGalacticTone(620 + table * 18, 0.07);
}

function nextTableFactor(table) {
  const practiced = galacticTables.progress.practiced?.[table] || {};
  for (let factor = 1; factor <= 9; factor += 1) {
    if (!practiced[factor]) return factor;
  }
  return 1;
}

function renderTableChallenge() {
  const table = galacticTables.current;
  const factor = galacticTables.factor;
  const operations = document.querySelector("#tableOperations");
  const answers = document.querySelector("#tableAnswerOptions");
  const feedback = document.querySelector("#tablePracticeFeedback");
  if (!operations || !answers) return;

  operations.innerHTML = "";
  operations.appendChild(createTableOperation(table, factor));
  answers.innerHTML = "";
  makeTableOptions(table * factor).forEach((option) => {
    const button = document.createElement("button");
    button.className = "table-answer-btn";
    button.type = "button";
    button.textContent = option;
    button.addEventListener("click", () => validateTableAnswer(option, button));
    answers.appendChild(button);
  });
  if (feedback) feedback.textContent = "Cuenta las criaturas y toca el total.";
  updateTableCompleteButton();
}

function createTableOperation(table, factor) {
  const result = table * factor;
  const practiced = Boolean(galacticTables.progress.practiced?.[table]?.[factor]);
  const row = document.createElement("article");
  row.className = `table-operation-card active-challenge ${practiced ? "done" : ""}`;
  row.style.setProperty("--delay", `${factor * 0.035}s`);
  row.innerHTML = `
    <div class="table-equation">
      <strong>${table} × ${factor}</strong>
      <span>= ?</span>
    </div>
    <div class="visual-groups" aria-label="${table} grupos de ${factor}">
      ${Array.from({ length: table }, (_, groupIndex) => `
        <div class="visual-group" style="--group-delay: ${groupIndex * 0.04}s">
          ${Array.from({ length: factor }, (_, itemIndex) => `<span class="tiny-creature" style="--item-delay: ${(groupIndex * factor + itemIndex) * 0.015}s"></span>`).join("")}
        </div>
      `).join("")}
    </div>
  `;
  return row;
}

function makeTableOptions(answer) {
  const options = new Set([answer]);
  while (options.size < 3) {
    const offset = Math.floor(Math.random() * 7) - 3;
    const value = Math.max(1, answer + (offset || 2));
    options.add(value);
  }
  return [...options].sort(() => Math.random() - 0.5);
}

function validateTableAnswer(option, button) {
  if (galacticTables.locked) return;
  const answer = galacticTables.current * galacticTables.factor;
  if (option !== answer) {
    button.classList.add("wrong");
    document.querySelector("#tablePracticeFeedback").textContent = "Casi, cuenta los grupos otra vez.";
    playGalacticTone(260, 0.07);
    setTimeout(() => button.classList.remove("wrong"), 520);
    return;
  }

  galacticTables.locked = true;
  button.classList.add("correct");
  document.querySelector("#tablePracticeFeedback").textContent = "¡Genial! Portal completado.";
  completeTableOperation(galacticTables.current, galacticTables.factor);
}

function completeTableOperation(table, factor) {
  galacticTables.progress.practiced[table] ||= {};
  galacticTables.progress.practiced[table][factor] = true;
  saveGalacticTablesProgress();
  updateTableCompleteButton();
  playGalacticTone(600 + factor * 22, 0.045);

  if (tablePracticeCount(table) === 9) {
    completeGalacticTable();
    return;
  }

  setTimeout(() => {
    galacticTables.factor = nextTableFactor(table);
    galacticTables.locked = false;
    renderTableChallenge();
  }, 760);
}

function tablePracticeCount(table) {
  return Object.keys(galacticTables.progress.practiced?.[table] || {}).length;
}

function updateTableCompleteButton() {
  const button = document.querySelector("#tableCompleteButton");
  const roundText = document.querySelector("#tableRoundText");
  const roundBar = document.querySelector("#tableRoundBar");
  if (!button) return;
  const count = tablePracticeCount(galacticTables.current);
  const completed = Boolean(galacticTables.progress.completed[galacticTables.current]);
  button.textContent = completed ? "Tabla completada" : `Progreso ${count}/9`;
  button.disabled = !completed && count < 9;
  if (roundText) roundText.textContent = completed ? "Tabla completada" : `Reto ${Math.min(count + 1, 9)} de 9`;
  if (roundBar) roundBar.style.width = `${(count / 9) * 100}%`;
}

function completeGalacticTable() {
  galacticTables.progress.completed[galacticTables.current] = true;
  saveGalacticTablesProgress();
  updateTableCompleteButton();
  renderGalacticTables();
  document.querySelector("#tableDetailView")?.classList.add("completed-pop");
  setTimeout(() => document.querySelector("#tableDetailView")?.classList.remove("completed-pop"), 680);
  document.querySelector("#tablePracticeFeedback").textContent = "¡Tabla completada! Tu planeta gano estrellas.";
  playGalacticTone(780, 0.08);
}

function playGalacticTone(frequency = 520, duration = 0.05) {
  try {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.value = 0.035;
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
    oscillator.stop(context.currentTime + duration);
  } catch {
    playSound("galactic-table");
  }
}

document.querySelector("#factoryTablesButton")?.addEventListener("click", () => openGalacticTables("factory"));
document.querySelector("#tablesBackButton")?.addEventListener("click", () => showScreen(galacticTables.returnScreen));
document.querySelector("#tableBackButton")?.addEventListener("click", showGalacticTablesList);
