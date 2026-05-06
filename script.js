const STORAGE_KEY = "aventura_matematica_robo";

const levels = [
  { id: 1, title: "Parque Espacial", type: "add", icon: "+", intro: "Suma la energia de cada estacion para abrir el camino." },
];

const baseMap = [
  "##########",
  "#P..D.C.G#",
  "#.##.##..#",
  "#..C...#.#",
  "##.###E..#",
  "#..E..D..#",
  "#...##...#",
  "##########",
];

const state = {
  screen: "start",
  levelIndex: 0,
  player: { x: 1, y: 1 },
  lives: 3,
  score: 0,
  map: [],
  pending: null,
  question: null,
  storage: loadProgress(),
};

const els = {
  screens: document.querySelectorAll(".screen"),
  playButton: document.querySelector("#playButton"),
  startAdventureButton: document.querySelector("#startAdventureButton"),
  backStartButton: document.querySelector("#backStartButton"),
  levelGrid: document.querySelector("#levelGrid"),
  levelLabel: document.querySelector("#levelLabel"),
  levelTitle: document.querySelector("#levelTitle"),
  scoreText: document.querySelector("#scoreText"),
  livesText: document.querySelector("#livesText"),
  roboDialog: document.querySelector("#roboDialog"),
  guideRobo: document.querySelector("#guideRobo"),
  world: document.querySelector("#world"),
  questionModal: document.querySelector("#questionModal"),
  questionReason: document.querySelector("#questionReason"),
  operationText: document.querySelector("#operationText"),
  options: document.querySelector("#options"),
  questionFeedback: document.querySelector("#questionFeedback"),
  victoryStars: document.querySelector("#victoryStars"),
  victoryText: document.querySelector("#victoryText"),
  nextLevelButton: document.querySelector("#nextLevelButton"),
  victoryLevelsButton: document.querySelector("#victoryLevelsButton"),
  retryButton: document.querySelector("#retryButton"),
  defeatLevelsButton: document.querySelector("#defeatLevelsButton"),
  confetti: document.querySelector("#confetti"),
  mobileControls: document.querySelectorAll("[data-move]"),
};

function loadProgress() {
  const fallback = { unlocked: 1, stars: {} };
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || fallback;
  } catch {
    return fallback;
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.storage));
}

function showScreen(name) {
  state.screen = name;
  els.screens.forEach((screen) => {
    screen.classList.toggle("active", screen.id === `${name}Screen`);
  });
}

function renderLevels() {
  els.levelGrid.innerHTML = "";
  levels.forEach((level, index) => {
    const unlocked = level.id <= state.storage.unlocked;
    const stars = state.storage.stars[level.id] || 0;
    const card = document.createElement("article");
    card.className = `level-card ${unlocked ? "" : "locked"}`;
    card.innerHTML = `
      <div class="level-icon">${unlocked ? level.icon : "🔒"}</div>
      <div>
        <p class="eyebrow">Nivel ${level.id}</p>
        <h3>${level.title}</h3>
      </div>
      <div class="stars">${"★".repeat(stars)}${"☆".repeat(3 - stars)}</div>
      <button class="${unlocked ? "primary-btn" : "ghost-btn"}" ${unlocked ? "" : "disabled"}>
        ${unlocked ? "Entrar" : "Bloqueado"}
      </button>
    `;

    if (unlocked) {
      card.querySelector("button").addEventListener("click", () => startLevel(index));
    }

    els.levelGrid.appendChild(card);
  });
}

function startLevel(index) {
  state.levelIndex = index;
  state.lives = 3;
  state.score = 0;
  state.pending = null;
  state.question = null;
  state.map = baseMap.map((row) => row.split(""));
  findPlayer();
  updateHud();
  renderWorld();
  setRobo(levels[index].intro, "happy");
  showScreen("game");
}

function findPlayer() {
  state.map.forEach((row, y) => {
    row.forEach((tile, x) => {
      if (tile === "P") {
        state.player = { x, y };
        state.map[y][x] = ".";
      }
    });
  });
}

function renderWorld() {
  els.world.innerHTML = "";
  state.map.forEach((row, y) => {
    row.forEach((tile, x) => {
      const cell = document.createElement("div");
      cell.className = `tile ${tileClass(tile)} decor-${(x + y) % 6} depth-${(x * 3 + y * 5) % 4}`;
      cell.innerHTML = `
        <span class="tile-aura"></span>
        <span class="tile-cap"></span>
        <span class="tile-detail"></span>
      `;

      if (state.player.x === x && state.player.y === y) {
        const player = document.createElement("div");
        player.className = "player";
        cell.appendChild(player);
      } else {
        const entity = entityFor(tile);
        if (entity) cell.appendChild(entity);
      }

      els.world.appendChild(cell);
    });
  });
}

function tileClass(tile) {
  if (tile === "#") return "wall";
  if (tile === "G") return "goal";
  return "path";
}

function entityFor(tile) {
  const data = {
    D: ["door", "🚪"],
    C: ["chest", "▣"],
    E: ["enemy", "!"],
    G: ["goal-flag", "⚑"],
  }[tile];

  if (!data) return null;
  const el = document.createElement("div");
  el.className = `entity ${data[0]}`;
  el.textContent = data[1];
  return el;
}

function move(dx, dy) {
  if (state.screen !== "game" || state.question) return;

  const nx = state.player.x + dx;
  const ny = state.player.y + dy;
  const tile = state.map[ny]?.[nx];
  if (!tile || tile === "#") {
    setRobo("Ese camino esta bloqueado. Busca otra ruta.", "thinking");
    return;
  }

  if (["D", "C", "E"].includes(tile)) {
    state.pending = { x: nx, y: ny, tile };
    openQuestion(tile);
    return;
  }

  if (tile === "G") {
    completeLevel();
    return;
  }

  state.player = { x: nx, y: ny };
  renderWorld();
}

function openQuestion(tile) {
  const reasons = {
    D: "Para abrir esta puerta, resuelve la operacion.",
    C: "Para abrir el cofre, elige el resultado correcto.",
    E: "Para vencer al enemigo, calcula con Robo.",
  };

  state.question = createQuestion();
  els.questionReason.textContent = reasons[tile];
  els.operationText.textContent = state.question.text;
  els.questionFeedback.textContent = "Elige una respuesta.";
  els.options.innerHTML = "";

  state.question.options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "option-btn";
    button.type = "button";
    button.textContent = option;
    button.addEventListener("click", () => answerQuestion(button, option));
    els.options.appendChild(button);
  });

  setRobo(reasons[tile], "thinking");
  els.questionModal.classList.remove("hidden");
}

function createQuestion() {
  const level = levels[state.levelIndex];
  const type = level.type === "mixed" ? randomFrom(["add", "subtract", "multiply", "divide"]) : level.type;
  const max = Math.min(12, 5 + level.id * 2);
  let a = rand(1, max);
  let b = rand(1, max);
  let answer = 0;
  let symbol = "+";

  if (type === "add") {
    answer = a + b;
    symbol = "+";
  }

  if (type === "subtract") {
    if (b > a) [a, b] = [b, a];
    answer = a - b;
    symbol = "-";
  }

  if (type === "multiply") {
    a = rand(2, Math.min(10, max));
    b = rand(2, Math.min(10, max));
    answer = a * b;
    symbol = "x";
  }

  if (type === "divide") {
    b = rand(2, Math.min(10, max));
    answer = rand(2, Math.min(10, max));
    a = b * answer;
    symbol = "/";
  }

  return {
    text: `${a} ${symbol} ${b}`,
    answer,
    options: makeOptions(answer),
  };
}

function makeOptions(answer) {
  const options = new Set([answer]);
  while (options.size < 4) {
    const spread = Math.max(4, Math.ceil(answer / 3));
    options.add(Math.max(0, answer + rand(-spread, spread) || answer + 1));
  }
  return shuffle([...options]);
}

function answerQuestion(button, value) {
  if (!state.question) return;
  const optionButtons = els.options.querySelectorAll(".option-btn");
  optionButtons.forEach((item) => {
    item.disabled = true;
  });

  const correct = value === state.question.answer;
  button.classList.add(correct ? "correct" : "wrong");

  if (correct) {
    playSound("correct");
    state.score += pointsForPending();
    resolvePending();
    els.questionFeedback.textContent = "¡Excelente calculo!";
    setRobo("¡Excelente calculo!", "happy");
    setTimeout(closeQuestion, 550);
  } else {
    playSound("wrong");
    state.lives -= 1;
    updateHud();
    els.questionFeedback.textContent = "Intenta otra vez, tu puedes.";
    setRobo("Intenta otra vez, tu puedes.", "sad");

    if (state.lives <= 0) {
      setTimeout(defeat, 650);
    } else {
      setTimeout(() => {
        optionButtons.forEach((item) => {
          item.disabled = false;
        });
        button.disabled = true;
      }, 650);
    }
  }
}

function pointsForPending() {
  if (!state.pending) return 10;
  return { D: 15, C: 25, E: 20 }[state.pending.tile] || 10;
}

function resolvePending() {
  if (!state.pending) return;
  state.map[state.pending.y][state.pending.x] = ".";
  state.player = { x: state.pending.x, y: state.pending.y };
  state.pending = null;
  updateHud();
  renderWorld();
}

function closeQuestion() {
  state.question = null;
  els.questionModal.classList.add("hidden");
}

function completeLevel() {
  const level = levels[state.levelIndex];
  const stars = Math.max(1, state.lives);
  state.storage.stars[level.id] = Math.max(state.storage.stars[level.id] || 0, stars);
  state.storage.unlocked = Math.max(state.storage.unlocked, Math.min(level.id + 1, levels.length));
  saveProgress();

  els.victoryStars.textContent = "★".repeat(stars) + "☆".repeat(3 - stars);
  els.victoryText.textContent = `Parque Espacial completado con ${state.score} puntos.`;
  els.nextLevelButton.style.display = level.id < levels.length ? "inline-block" : "none";
  fireConfetti();
  playSound("win");
  showScreen("victory");
}

function defeat() {
  closeQuestion();
  playSound("lose");
  showScreen("defeat");
}

function updateHud() {
  const level = levels[state.levelIndex];
  els.levelLabel.textContent = "Mision de sumas";
  els.levelTitle.textContent = level.title;
  els.scoreText.textContent = state.score;
  els.livesText.textContent = "♥".repeat(Math.max(0, state.lives)) + "♡".repeat(Math.max(0, 3 - state.lives));
}

function setRobo(message, mood) {
  els.roboDialog.textContent = message;
  els.guideRobo.classList.remove("happy", "thinking", "sad", "speaking");
  els.guideRobo.classList.add(mood, "speaking");
  clearTimeout(els.guideRobo.speakingTimer);
  els.guideRobo.speakingTimer = setTimeout(() => {
    els.guideRobo.classList.remove("speaking");
  }, 900);
}

function fireConfetti() {
  els.confetti.innerHTML = "";
  const colors = ["#ff6b6b", "#ffd23f", "#20d8ee", "#62c96f", "#7667ff"];
  for (let i = 0; i < 50; i += 1) {
    const piece = document.createElement("span");
    piece.style.left = `${rand(0, 100)}%`;
    piece.style.background = randomFrom(colors);
    piece.style.animationDelay = `${Math.random() * 0.45}s`;
    els.confetti.appendChild(piece);
  }
}

function playSound(name) {
  // Conecta aqui archivos mp3 si los agregas al proyecto.
  // Ejemplo: new Audio(`assets/${name}.mp3`).play();
  return name;
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFrom(items) {
  return items[rand(0, items.length - 1)];
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function handleKey(event) {
  const key = event.key.toLowerCase();
  const moves = {
    arrowup: [0, -1],
    w: [0, -1],
    arrowdown: [0, 1],
    s: [0, 1],
    arrowleft: [-1, 0],
    a: [-1, 0],
    arrowright: [1, 0],
    d: [1, 0],
  };

  if (!moves[key]) return;
  event.preventDefault();
  move(...moves[key]);
}

els.playButton.addEventListener("click", () => {
  showScreen("concept");
});

els.startAdventureButton.addEventListener("click", () => startLevel(0));
els.backStartButton.addEventListener("click", () => showScreen("start"));
els.victoryLevelsButton.addEventListener("click", () => {
  showScreen("concept");
});
els.defeatLevelsButton.addEventListener("click", () => {
  showScreen("concept");
});
els.retryButton.addEventListener("click", () => startLevel(state.levelIndex));
els.nextLevelButton.addEventListener("click", () => {
  showScreen("concept");
});
els.mobileControls.forEach((button) => {
  button.addEventListener("click", () => {
    const moves = {
      up: [0, -1],
      down: [0, 1],
      left: [-1, 0],
      right: [1, 0],
    };
    move(...moves[button.dataset.move]);
  });
});

document.addEventListener("keydown", handleKey);
renderLevels();
