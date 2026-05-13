const STORAGE_KEY = "numeronautas_robo";

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

const maps = [
  baseMap,
  [
    "##########",
    "#P.C..D.G#",
    "#.##.##..#",
    "#..E.C.#.#",
    "##.###D..#",
    "#..C..E..#",
    "#...##...#",
    "##########",
  ],
  [
    "##########",
    "#P.D..C.G#",
    "#..#.##..#",
    "##.E...#.#",
    "#..###D..#",
    "#.C..E...#",
    "#...##...#",
    "##########",
  ],
  [
    "##########",
    "#P..E.C.G#",
    "#.##.##D.#",
    "#..C...#.#",
    "##.###E..#",
    "#..D..C..#",
    "#...##...#",
    "##########",
  ],
  [
    "##########",
    "#P.C.E..G#",
    "#.##.##D.#",
    "#..D...#.#",
    "##.###C..#",
    "#..E..D..#",
    "#...##...#",
    "##########",
  ],
  [
    "##########",
    "#P.E.DC.G#",
    "#.##.##..#",
    "#..C...#.#",
    "##.###E..#",
    "#..D..C..#",
    "#...##...#",
    "##########",
  ],
  [
    "##########",
    "#P.D.EC.G#",
    "#.##.##..#",
    "#..E...#.#",
    "##.###C..#",
    "#..D..E..#",
    "#...##...#",
    "##########",
  ],
  [
    "##########",
    "#P.ECD..G#",
    "#.##.##E.#",
    "#..C...#.#",
    "##.###D..#",
    "#..E..C..#",
    "#...##...#",
    "##########",
  ],
];

const levels = [
  {
    id: 1,
    title: "Bahia de Sumas",
    type: "add",
    icon: "+",
    intro: "Suma la energia de cada estacion para abrir el camino.",
    label: "Mision de sumas",
    task: "Junta cantidades",
  },
  {
    id: 2,
    title: "Operacion Resta",
    type: "subtract",
    icon: "-",
    intro: "Robo entra a Operacion Resta, una arena futurista donde cada respuesta correcta dispara un ataque brillante.",
    label: "Mision de restas",
    task: "Derrota con restas",
  },
  {
    id: 3,
    title: "Numeronautas: Laboratorio de Clones",
    type: "multiply",
    icon: "x",
    intro: "Ayuda a Robo a restaurar un laboratorio futurista creando clones con multiplicaciones.",
    label: "Mision de multiplicacion",
    task: "Crea clones",
  },
  {
    id: 4,
    title: "Isla Divisora",
    type: "divide",
    icon: "/",
    intro: "Divide energia en partes iguales para estabilizar la isla.",
    label: "Mision de division",
    task: "Reparte cantidades",
  },
  {
    id: 5,
    title: "Circuito Relampago",
    type: "mixed",
    icon: "+-",
    intro: "Combina suma y resta antes de que se cierre el circuito.",
    label: "Mision mixta",
    task: "Suma y resta",
    pool: ["add", "subtract"],
  },
  {
    id: 6,
    title: "Fabrica de Patrones",
    type: "mixed",
    icon: "x/",
    intro: "Alterna multiplicaciones y divisiones para ordenar la fabrica.",
    label: "Mision de patrones",
    task: "Multiplica y divide",
    pool: ["multiply", "divide"],
  },
  {
    id: 7,
    title: "Laberinto Numeral",
    type: "mixed",
    icon: "?",
    intro: "Usa todas las operaciones para guiar a Robo por el laberinto.",
    label: "Mision combinada",
    task: "Resuelve de todo",
  },
  {
    id: 8,
    title: "Portal Maestro",
    type: "mixed",
    icon: "*",
    intro: "El reto final mezcla todo lo aprendido para abrir el gran portal.",
    label: "Reto maestro",
    task: "Domina el portal",
  },
];

const conceptByType = {
  add: {
    title: "Sumar es juntar",
    intro: "Cuando sumamos, unimos dos grupos para saber cuantos hay en total.",
    note: "Ejemplo: 2 estrellas + 3 estrellas = 5 estrellas.",
    demo: [
      ["dots", 2, "2"],
      ["symbol", "+"],
      ["dots", 3, "3"],
      ["symbol", "="],
      ["total", "5"],
    ],
  },
  subtract: {
    title: "Restar es quitar y contar lo que queda",
    intro: "Cuando restamos, empezamos con una cantidad. Luego quitamos, usamos o perdemos una parte. El resultado nos dice cuanto queda.",
    note: "Ejemplo: Robo tenia 9 cargas. Uso 4 cargas en su ataque. Le quedaron 5 cargas.",
    demo: [
      ["battleDots", 9, 4, "9"],
      ["symbol", "-"],
      ["used", 4, "4"],
      ["symbol", "="],
      ["battleDots", 5, 0, "5"],
    ],
  },
  multiply: {
    title: "Multiplicar es crear grupos iguales",
    intro: "En el laboratorio, Robo usa la multiplicacion para crear varios grupos iguales de clones.",
    note: "Ejemplo: 3 capsulas crean 4 clones cada una. 3 x 4 = 12 clones.",
    demo: [
      ["total", "3"],
      ["symbol", "x"],
      ["total", "4"],
      ["symbol", "="],
      ["total", "12"],
    ],
  },
  divide: {
    title: "Dividir es repartir",
    intro: "Cuando dividimos, repartimos una cantidad en partes iguales.",
    note: "Ejemplo: 12 baterias / 3 estaciones = 4 baterias por estacion.",
    demo: [
      ["total", "12"],
      ["symbol", "/"],
      ["total", "3"],
      ["symbol", "="],
      ["total", "4"],
    ],
  },
  mixed: {
    title: "Elige la herramienta correcta",
    intro: "En las misiones mixtas puede aparecer cualquier operacion. Mira bien el simbolo antes de responder.",
    note: "Consejo: primero identifica si debes juntar, quitar, repetir grupos o repartir.",
    demo: [
      ["total", "+"],
      ["symbol", "-"],
      ["total", "x"],
      ["symbol", "/"],
      ["total", "?"],
    ],
  },
};

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

const battle = {
  active: false,
  round: 1,
  enemyIndex: 0,
  enemyHp: 100,
  enemyMaxHp: 100,
  roboHp: 100,
  lives: 3,
  score: 0,
  combo: 0,
  question: null,
  locked: false,
};

const battleEnemies = [
  { name: "Chispa Digital", className: "virus", hp: 70, damage: 22 },
  { name: "Gota Electrica", className: "slime", hp: 90, damage: 24 },
  { name: "Dron Calculador", className: "drone", hp: 115, damage: 26 },
  { name: "Cubo Travieso", className: "cube", hp: 145, damage: 28 },
];

const factoryMachines = [
  { name: "Camara de clonacion", activity: "Crea clones resolviendo la multiplicacion.", verb: "creo clones en" },
  { name: "Reactor multiplicador", activity: "Llena el reactor con energia matematica.", verb: "cargo" },
  { name: "ADN digital", activity: "Estabiliza el codigo antes de que aparezca el glitch.", verb: "estabilizo" },
  { name: "Clones defectuosos", activity: "Repara clones eligiendo el resultado correcto.", verb: "reparo" },
  { name: "Puerta tecnologica", activity: "Desbloquea la siguiente zona del laboratorio.", verb: "desbloqueo" },
];

const factory = {
  active: false,
  started: false,
  machineIndex: 0,
  score: 0,
  combo: 0,
  progress: 0,
  question: null,
  locked: false,
  medals: 0,
};

const els = {
  screens: document.querySelectorAll(".screen"),
  playButton: document.querySelector("#playButton"),
  levelsButton: document.querySelector("#levelsButton"),
  startAdventureButton: document.querySelector("#startAdventureButton"),
  backStartButton: document.querySelector("#backStartButton"),
  levelGrid: document.querySelector("#levelGrid"),
  conceptEyebrow: document.querySelector("#conceptEyebrow"),
  conceptTitle: document.querySelector("#conceptTitle"),
  conceptIntro: document.querySelector("#conceptIntro"),
  conceptDemo: document.querySelector("#conceptDemo"),
  conceptNote: document.querySelector("#conceptNote"),
  levelLabel: document.querySelector("#levelLabel"),
  levelTitle: document.querySelector("#levelTitle"),
  scoreText: document.querySelector("#scoreText"),
  livesText: document.querySelector("#livesText"),
  roboDialog: document.querySelector("#roboDialog"),
  guideRobo: document.querySelector("#guideRobo"),
  world: document.querySelector("#world"),
  mapTaskText: document.querySelector("#mapTaskText"),
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
  battleArena: document.querySelector("#battleArena"),
  battleScoreText: document.querySelector("#battleScoreText"),
  battleComboText: document.querySelector("#battleComboText"),
  enemyProgressText: document.querySelector("#enemyProgressText"),
  battleLivesText: document.querySelector("#battleLivesText"),
  roboHpBar: document.querySelector("#roboHpBar"),
  battleMessage: document.querySelector("#battleMessage"),
  enemyCountdownText: document.querySelector("#enemyCountdownText"),
  laserLane: document.querySelector("#laserLane"),
  battleOperation: document.querySelector("#battleOperation"),
  battleOptions: document.querySelector("#battleOptions"),
  enemyRoundText: document.querySelector("#enemyRoundText"),
  enemyNameText: document.querySelector("#enemyNameText"),
  enemyHpText: document.querySelector("#enemyHpText"),
  enemyHpBar: document.querySelector("#enemyHpBar"),
  battleEnemy: document.querySelector("#battleEnemy"),
  battleRobo: document.querySelector("#battleRobo"),
  battleParticles: document.querySelector("#battleParticles"),
  battleExitButton: document.querySelector("#battleExitButton"),
  factoryLayout: document.querySelector("#factoryLayout"),
  factoryScoreText: document.querySelector("#factoryScoreText"),
  factoryComboText: document.querySelector("#factoryComboText"),
  factoryMachineText: document.querySelector("#factoryMachineText"),
  factoryMoodText: document.querySelector("#factoryMoodText"),
  factoryRobo: document.querySelector("#factoryRobo"),
  factoryMedals: document.querySelector("#factoryMedals"),
  machineStage: document.querySelector("#machineStage"),
  conveyorBelt: document.querySelector("#conveyorBelt"),
  factoryBox: document.querySelector("#factoryBox"),
  factoryMessage: document.querySelector("#factoryMessage"),
  factoryProgressBar: document.querySelector("#factoryProgressBar"),
  cloneRoundBrief: document.querySelector("#cloneRoundBrief"),
  cloneEquation: document.querySelector("#cloneEquation"),
  cloneGroups: document.querySelector("#cloneGroups"),
  factoryOptions: document.querySelector("#factoryOptions"),
  factoryStartButton: document.querySelector("#factoryStartButton"),
  labHelpButton: document.querySelector("#labHelpButton"),
  factoryExitButton: document.querySelector("#factoryExitButton"),
  factoryParticles: document.querySelector("#factoryParticles"),
};

function loadProgress() {
  const fallback = { unlocked: 3, stars: {} };
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved?.unlocked ? { ...saved, unlocked: Math.max(saved.unlocked, 3) } : fallback;
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
      <div class="level-icon">${unlocked ? level.icon : "Bloq"}</div>
      <div>
        <p class="eyebrow">Nivel ${level.id}</p>
        <h3>${level.title}</h3>
        <p class="level-type">${level.label}</p>
      </div>
      <div class="stars">${"\u2605".repeat(stars)}${"\u2606".repeat(3 - stars)}</div>
      <button class="${unlocked ? "primary-btn" : "ghost-btn"}" ${unlocked ? "" : "disabled"}>
        ${unlocked ? "Entrar" : "Bloqueado"}
      </button>
    `;

    if (unlocked) {
      card.querySelector("button").addEventListener("click", () => showConcept(index));
    }

    els.levelGrid.appendChild(card);
  });
}

function showConcept(index) {
  state.levelIndex = index;
  const level = levels[index];
  const concept = conceptByType[level.type] || conceptByType.mixed;
  els.conceptEyebrow.textContent = `Nivel ${level.id}: ${level.title}`;
  els.conceptTitle.textContent = concept.title;
  els.conceptIntro.textContent = concept.intro;
  els.conceptNote.textContent = concept.note;
  els.conceptDemo.innerHTML = concept.demo.map(renderConceptPart).join("");
  els.startAdventureButton.textContent = `Iniciar ${level.title}`;
  showScreen("concept");
}

function renderConceptPart(part) {
  if (part[0] === "symbol") return `<div class="sum-symbol">${part[1]}</div>`;
  if (part[0] === "total") return `<div class="demo-total"><span>${part[1]}</span></div>`;
  if (part[0] === "used") {
    const dots = Array.from({ length: part[1] }, () => "<span></span>").join("");
    return `<div class="demo-group used-energy">${dots}<strong>${part[2]}</strong></div>`;
  }
  if (part[0] === "battleDots") {
    const dots = Array.from({ length: part[1] }, (_, index) => `<span class="${index < part[2] ? "spent" : ""}"></span>`).join("");
    return `<div class="demo-group battle-energy">${dots}<strong>${part[3]}</strong></div>`;
  }
  const dots = Array.from({ length: part[1] }, () => "<span></span>").join("");
  return `<div class="demo-group">${dots}<strong>${part[2]}</strong></div>`;
}

function startLevel(index) {
  if (levels[index].type === "subtract") {
    startBattleLevel(index);
    return;
  }

  if (levels[index].type === "multiply") {
    startFactoryLevel(index);
    return;
  }

  state.levelIndex = index;
  state.lives = 3;
  state.score = 0;
  state.pending = null;
  state.question = null;
  state.map = maps[index].map((row) => row.split(""));
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
    D: ["door", ""],
    C: ["chest", ""],
    E: ["enemy", ""],
    G: ["goal-flag", ""],
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
    E: "Para vencer al obstaculo, calcula con Robo.",
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
  const type = level.type === "mixed" ? randomFrom(level.pool || ["add", "subtract", "multiply", "divide"]) : level.type;
  const max = Math.min(20, 5 + level.id * 2);
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
    const guess = answer + rand(-spread, spread);
    options.add(Math.max(0, guess === answer ? answer + 1 : guess));
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
    els.questionFeedback.textContent = "Excelente calculo!";
    setRobo("Excelente calculo!", "happy");
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

function startBattleLevel(index) {
  state.levelIndex = index;
  state.lives = 3;
  state.score = 0;
  battle.active = true;
  battle.round = 1;
  battle.enemyIndex = 0;
  battle.roboHp = 100;
  battle.lives = 3;
  battle.score = 0;
  battle.combo = 0;
  battle.locked = false;
  setupBattleEnemy();
  setBattleRoboMood("happy");
  updateBattleHud();
  setBattleMessage("Robo entro a Operacion Resta. Resuelve restas para lanzar ataques brillantes.");
  showScreen("battle");
  playSound("battle-start");
  nextBattleQuestion();
}

function setupBattleEnemy() {
  const enemy = battleEnemies[battle.enemyIndex];
  battle.enemyMaxHp = enemy.hp + Math.max(0, battle.round - 1) * 12;
  battle.enemyHp = battle.enemyMaxHp;
  els.enemyNameText.textContent = enemy.name;
  els.enemyRoundText.textContent = `Ronda ${battle.round}`;
  els.battleEnemy.className = `math-enemy ${enemy.className} spawn`;
  setTimeout(() => els.battleEnemy.classList.remove("spawn"), 500);
}

function nextBattleQuestion() {
  battle.question = createBattleQuestion();
  battle.locked = false;
  setBattleRoboMood("thinking");
  els.battleOperation.textContent = battle.question.text;
  els.battleOptions.innerHTML = "";

  battle.question.options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "battle-option";
    button.type = "button";
    button.textContent = option;
    button.addEventListener("click", () => answerBattleQuestion(button, option));
    els.battleOptions.appendChild(button);
  });
}

function createBattleQuestion() {
  const tier = Math.min(5, battle.round);
  const max = 8 + tier * 5;
  let a = rand(5 + tier, max);
  let b = rand(1, Math.max(2, Math.floor(max * 0.55)));
  if (b > a) [a, b] = [b, a];
  const answer = a - b;
  return {
    text: `${a} - ${b} = ?`,
    answer,
    options: makeOptions(answer),
  };
}

function answerBattleQuestion(button, value) {
  if (battle.locked || !battle.question) return;
  battle.locked = true;
  const buttons = els.battleOptions.querySelectorAll(".battle-option");
  buttons.forEach((item) => {
    item.disabled = true;
  });

  if (value === battle.question.answer) {
    button.classList.add("correct");
    battleCorrect();
    return;
  }

  button.classList.add("wrong");
  battleWrong();
}

function battleCorrect() {
  const damage = 28 + Math.min(35, battle.combo * 5);
  battle.combo += 1;
  battle.score += 90 + battle.combo * 20;
  battle.enemyHp = Math.max(0, battle.enemyHp - damage);

  setBattleMessage(`Correcto! Combo x${battle.combo}. Robo dispara un laser.`);
  playSound("attack");
  setBattleRoboMood("happy");
  els.battleRobo.classList.add("attacking");
  animateLaser();
  popParticles("hit");
  els.battleEnemy.classList.add("hit");
  setTimeout(() => {
    els.battleRobo.classList.remove("attacking");
    els.battleEnemy.classList.remove("hit");
  }, 520);
  updateBattleHud();

  if (battle.enemyHp <= 0) {
    setTimeout(defeatBattleEnemy, 650);
    return;
  }

  setTimeout(nextBattleQuestion, 760);
}

function battleWrong() {
  battle.combo = 0;
  battle.roboHp = Math.max(0, battle.roboHp - battleEnemies[battle.enemyIndex].damage);

  setBattleMessage("Intenta otra vez! El enemigo contraataca.");
  playSound("wrong");
  setBattleRoboMood("sad");
  popParticles("damage");
  els.battleArena.classList.add("shake");
  els.battleEnemy.classList.add("attacking");
  els.battleRobo.classList.add("damaged");
  setTimeout(() => {
    els.battleArena.classList.remove("shake");
    els.battleEnemy.classList.remove("attacking");
    els.battleRobo.classList.remove("damaged");
  }, 520);

  if (battle.roboHp <= 0) {
    battle.lives -= 1;
    state.lives = battle.lives;
    battle.roboHp = battle.lives > 0 ? 100 : 0;
  }

  updateBattleHud();

  if (battle.lives <= 0) {
    setTimeout(() => {
      battle.active = false;
      playSound("lose");
      showScreen("defeat");
    }, 760);
    return;
  }

  setTimeout(nextBattleQuestion, 900);
}

function defeatBattleEnemy() {
  battle.score += 180 + battle.round * 40;
  setBattleMessage("Enemigo derrotado!");
  playSound("explosion");
  setBattleRoboMood("celebrating");
  popParticles("burst");
  updateBattleHud();

  if (battle.enemyIndex >= battleEnemies.length - 1) {
    setTimeout(completeBattleLevel, 900);
    return;
  }

  battle.enemyIndex += 1;
  battle.round += 1;
  setTimeout(() => {
    setupBattleEnemy();
    updateBattleHud();
    nextBattleQuestion();
  }, 900);
}

function completeBattleLevel() {
  battle.active = false;
  state.score = battle.score;
  state.lives = battle.lives;
  completeLevel();
}

function updateBattleHud() {
  const enemyPercent = Math.max(0, Math.round((battle.enemyHp / battle.enemyMaxHp) * 100));
  const enemiesLeft = Math.max(0, battleEnemies.length - battle.enemyIndex);
  els.battleScoreText.textContent = battle.score;
  els.battleComboText.textContent = `x${battle.combo}`;
  els.enemyProgressText.textContent = `${battle.enemyIndex + 1}/${battleEnemies.length}`;
  els.enemyCountdownText.textContent = enemiesLeft === 1 ? "Ultimo enemigo!" : `Faltan ${enemiesLeft} enemigos`;
  els.battleLivesText.textContent = `${battle.lives} vidas`;
  els.roboHpBar.style.width = `${battle.roboHp}%`;
  els.enemyHpText.textContent = `${enemyPercent}%`;
  els.enemyHpBar.style.width = `${enemyPercent}%`;
}

function setBattleRoboMood(mood) {
  const robo = els.battleRobo.querySelector(".robot-wrap");
  if (!robo) return;
  robo.classList.remove("happy", "thinking", "sad", "speaking", "celebrating");
  robo.classList.add(mood, "speaking");
  clearTimeout(robo.moodTimer);
  robo.moodTimer = setTimeout(() => {
    if (mood !== "thinking") {
      robo.classList.remove("speaking", "celebrating");
      robo.classList.add("thinking");
    }
  }, 850);
}

function setBattleMessage(message) {
  els.battleMessage.textContent = message;
  els.battleMessage.classList.remove("pulse");
  requestAnimationFrame(() => els.battleMessage.classList.add("pulse"));
}

function startFactoryLevel(index) {
  state.levelIndex = index;
  state.lives = 3;
  state.score = 0;
  factory.active = true;
  factory.started = false;
  factory.machineIndex = 0;
  factory.score = 0;
  factory.combo = 0;
  factory.progress = 0;
  factory.locked = false;
  factory.medals = 0;
  els.factoryStartButton.style.display = "inline-grid";
  els.factoryOptions.innerHTML = "";
  els.cloneRoundBrief.textContent = "El sistema espera una orden de clonacion.";
  els.cloneEquation.textContent = "Inicia el laboratorio";
  els.cloneGroups.innerHTML = "";
  setFactoryRoboMood("happy");
  setFactoryMessage("El laboratorio esta inestable. Presiona Iniciar Laboratorio para crear clones con multiplicaciones.");
  updateFactoryHud();
  updateFactoryMachines();
  showScreen("factory");
  playSound("factory-start");
}

function beginFactoryRun() {
  factory.started = true;
  els.factoryStartButton.style.display = "none";
  setFactoryMessage(factoryMachines[factory.machineIndex].activity);
  nextFactoryQuestion();
}

function nextFactoryQuestion() {
  factory.question = createFactoryQuestion();
  factory.locked = false;
  setFactoryRoboMood("thinking");
  els.cloneRoundBrief.textContent = factory.question.brief;
  els.cloneEquation.textContent = factory.question.equation;
  els.factoryOptions.innerHTML = "";
  renderCloneGroups(factory.question.groups, factory.question.items);
  resetFactoryBox();

  factory.question.options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "factory-option";
    button.type = "button";
    button.textContent = option;
    button.addEventListener("click", () => answerFactoryQuestion(button, option));
    els.factoryOptions.appendChild(button);
  });
}

function createFactoryQuestion() {
  const tier = factory.machineIndex + 1;
  const low = tier <= 2 ? 2 : 4;
  const high = Math.min(12, 4 + tier * 2);
  const groups = rand(low, high);
  const clones = rand(2, high);
  const answer = groups * clones;
  const scenarios = [
    `Activa ${groups} capsulas. Cada una creara ${clones} clones.`,
    `Enciende ${groups} tubos. Cada tubo generara ${clones} mini robots.`,
    `Carga ${groups} plataformas. Cada plataforma tendra ${clones} nucleos.`,
    `Estabiliza ${groups} camaras. Cada camara clonara ${clones} criaturas.`,
  ];
  const brief = randomFrom(scenarios);
  return {
    text: `${groups} x ${clones} = ?`,
    brief,
    equation: `${groups} x ${clones} = ?`,
    groups,
    items: clones,
    answer,
    options: makeOptions(answer),
  };
}

function answerFactoryQuestion(button, value) {
  if (factory.locked || !factory.question || !factory.started) return;
  factory.locked = true;
  els.factoryOptions.querySelectorAll(".factory-option").forEach((item) => {
    item.disabled = true;
  });

  if (value === factory.question.answer) {
    button.classList.add("correct");
    factoryCorrect();
    return;
  }

  button.classList.add("wrong");
  factoryWrong();
}

function factoryCorrect() {
  factory.combo += 1;
  factory.score += 120 + factory.combo * 30;
  factory.progress = Math.min(100, factory.progress + 22 + factory.combo * 3);
  setFactoryRoboMood("celebrating");
  setFactoryMessage(`Correcto! Robo ${factoryMachines[factory.machineIndex].verb} el sistema y genero energia.`);
  playSound("clone-success");
  els.factoryLayout.classList.add("machine-on");
  els.cloneGroups.classList.add("success");
  els.machineStage.querySelector(`[data-machine="${factory.machineIndex}"]`)?.classList.add("powered");
  releaseCloneWave(factory.question.answer, false);
  popFactoryParticles("spark");
  updateFactoryHud();

  if (factory.progress >= 100) {
    setTimeout(completeFactoryMachine, 760);
    return;
  }

  setTimeout(() => {
    els.factoryLayout.classList.remove("machine-on");
    els.cloneGroups.classList.remove("success");
    nextFactoryQuestion();
  }, 820);
}

function factoryWrong() {
  factory.combo = 0;
  factory.progress = Math.max(0, factory.progress - 10);
  setFactoryRoboMood("sad");
  setFactoryMessage("Glitch digital! Un clon salio inestable. Intenta otra multiplicacion.");
  playSound("clone-error");
  els.factoryLayout.classList.add("factory-error");
  els.cloneGroups.classList.add("glitch");
  els.cloneEquation.classList.add("wrong-shake");
  releaseCloneWave(Math.min(8, factory.question.answer), true);
  popFactoryParticles("error");
  updateFactoryHud();

  setTimeout(() => {
    els.factoryLayout.classList.remove("factory-error");
    els.cloneGroups.classList.remove("glitch");
    els.cloneEquation.classList.remove("wrong-shake");
    nextFactoryQuestion();
  }, 900);
}

function completeFactoryMachine() {
  factory.medals = Math.min(3, Math.floor((factory.machineIndex + 1) / 2) + 1);
  els.machineStage.querySelector(`[data-machine="${factory.machineIndex}"]`)?.classList.add("complete");
  popFactoryParticles("burst");
  setFactoryMessage(`${factoryMachines[factory.machineIndex].name} estabilizado! Nueva zona desbloqueada.`);
  playSound("lab-unlock");

  if (factory.machineIndex >= factoryMachines.length - 1) {
    setTimeout(completeFactoryLevel, 1000);
    return;
  }

  factory.machineIndex += 1;
  factory.progress = 0;
  updateFactoryHud();
  updateFactoryMachines();
  setTimeout(() => {
    setFactoryMessage(factoryMachines[factory.machineIndex].activity);
    nextFactoryQuestion();
  }, 1000);
}

function completeFactoryLevel() {
  factory.active = false;
  state.score = factory.score;
  state.lives = 3;
  completeLevel();
}

function updateFactoryHud() {
  els.factoryScoreText.textContent = factory.score;
  els.factoryComboText.textContent = `x${factory.combo}`;
  els.factoryMachineText.textContent = `${factory.machineIndex + 1}/${factoryMachines.length}`;
  els.factoryMoodText.textContent = factory.started ? factoryMachines[factory.machineIndex].name : "Listo";
  els.factoryProgressBar.style.width = `${factory.progress}%`;
  els.factoryMedals.querySelectorAll("span").forEach((medal, index) => {
    medal.classList.toggle("earned", index < factory.medals);
  });
}

function updateFactoryMachines() {
  els.machineStage.querySelectorAll(".machine-card").forEach((card, index) => {
    card.classList.toggle("active", index === factory.machineIndex);
    card.classList.toggle("locked", index > factory.machineIndex);
  });
}

function setFactoryMessage(message) {
  els.factoryMessage.textContent = message;
  els.factoryMessage.classList.remove("pulse");
  requestAnimationFrame(() => els.factoryMessage.classList.add("pulse"));
}

function setFactoryRoboMood(mood) {
  const robo = els.factoryRobo.querySelector(".robot-wrap");
  if (!robo) return;
  robo.classList.remove("happy", "thinking", "sad", "speaking", "celebrating");
  robo.classList.add(mood, "speaking");
}

function renderCloneGroups(groups, items) {
  els.cloneGroups.classList.remove("success", "glitch", "help");
  els.cloneGroups.innerHTML = "";
  for (let groupIndex = 0; groupIndex < groups; groupIndex += 1) {
    const pod = document.createElement("div");
    pod.className = "clone-group-pod";
    pod.style.animationDelay = `${groupIndex * 0.06}s`;
    const label = document.createElement("strong");
    label.textContent = `Capsula ${groupIndex + 1}`;
    const grid = document.createElement("div");
    grid.className = "clone-mini-grid";
    for (let itemIndex = 0; itemIndex < items; itemIndex += 1) {
      const clone = document.createElement("span");
      clone.className = "clone-dot";
      clone.style.animationDelay = `${(groupIndex * items + itemIndex) * 0.025}s`;
      grid.appendChild(clone);
    }
    pod.append(label, grid);
    els.cloneGroups.appendChild(pod);
  }
}

function releaseCloneWave(total, defective) {
  const amount = Math.min(total, 24);
  for (let i = 0; i < amount; i += 1) {
    const clone = document.createElement("span");
    clone.className = `released-clone ${defective ? "defective" : ""}`;
    clone.style.left = `${rand(24, 70)}%`;
    clone.style.top = `${rand(36, 62)}%`;
    clone.style.setProperty("--dx", `${rand(-130, 130)}px`);
    clone.style.setProperty("--dy", `${rand(-120, 55)}px`);
    clone.style.animationDelay = `${i * 0.025}s`;
    els.factoryParticles.appendChild(clone);
    setTimeout(() => clone.remove(), 1100);
  }
}

function resetFactoryBox() {
  els.factoryBox.classList.remove("run");
  void els.factoryBox.offsetWidth;
  els.factoryBox.classList.add("run");
}

function popFactoryParticles(type) {
  const count = type === "burst" ? 34 : 18;
  for (let i = 0; i < count; i += 1) {
    const particle = document.createElement("span");
    particle.className = `factory-particle ${type}`;
    particle.style.left = `${rand(26, 76)}%`;
    particle.style.top = `${rand(18, 72)}%`;
    particle.style.setProperty("--dx", `${rand(-100, 100)}px`);
    particle.style.setProperty("--dy", `${rand(-90, 70)}px`);
    els.factoryParticles.appendChild(particle);
    setTimeout(() => particle.remove(), 900);
  }
}

function animateLaser() {
  const laser = document.createElement("span");
  laser.className = "laser-shot";
  els.laserLane.appendChild(laser);
  setTimeout(() => laser.remove(), 520);
}

function popParticles(type) {
  const count = type === "burst" ? 34 : 18;
  for (let i = 0; i < count; i += 1) {
    const particle = document.createElement("span");
    particle.className = `battle-particle ${type}`;
    particle.style.left = `${type === "damage" ? rand(20, 38) : rand(58, 78)}%`;
    particle.style.top = `${rand(28, 58)}%`;
    particle.style.setProperty("--dx", `${rand(-90, 90)}px`);
    particle.style.setProperty("--dy", `${rand(-90, 70)}px`);
    particle.style.animationDelay = `${Math.random() * 0.12}s`;
    els.battleParticles.appendChild(particle);
    setTimeout(() => particle.remove(), 900);
  }
}

function completeLevel() {
  const level = levels[state.levelIndex];
  const stars = Math.max(1, state.lives);
  state.storage.stars[level.id] = Math.max(state.storage.stars[level.id] || 0, stars);
  state.storage.unlocked = Math.max(state.storage.unlocked, Math.min(level.id + 1, levels.length));
  saveProgress();

  els.victoryStars.textContent = "\u2605".repeat(stars) + "\u2606".repeat(3 - stars);
  els.victoryText.textContent = `${level.title} completado con ${state.score} puntos.`;
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
  els.levelLabel.textContent = level.label;
  els.levelTitle.textContent = level.title;
  els.mapTaskText.textContent = level.task;
  els.scoreText.textContent = state.score;
  els.livesText.textContent = "\u2665".repeat(Math.max(0, state.lives)) + "\u2661".repeat(Math.max(0, 3 - state.lives));
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
  const nextIndex = Math.max(0, Math.min(state.storage.unlocked - 1, levels.length - 1));
  showConcept(nextIndex);
});

els.levelsButton.addEventListener("click", () => {
  renderLevels();
  showScreen("level");
});

els.battleExitButton.addEventListener("click", () => {
  battle.active = false;
  renderLevels();
  showScreen("level");
});

els.factoryStartButton.addEventListener("click", beginFactoryRun);
els.labHelpButton.addEventListener("click", () => {
  els.cloneGroups.classList.toggle("help");
});
els.factoryExitButton.addEventListener("click", () => {
  factory.active = false;
  renderLevels();
  showScreen("level");
});

els.startAdventureButton.addEventListener("click", () => startLevel(state.levelIndex));
els.backStartButton.addEventListener("click", () => showScreen("start"));
els.victoryLevelsButton.addEventListener("click", () => {
  renderLevels();
  showScreen("level");
});
els.defeatLevelsButton.addEventListener("click", () => {
  renderLevels();
  showScreen("level");
});
els.retryButton.addEventListener("click", () => startLevel(state.levelIndex));
els.nextLevelButton.addEventListener("click", () => {
  showConcept(Math.min(state.levelIndex + 1, levels.length - 1));
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
