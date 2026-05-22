function showScreen(name) {
  if (name === "start") updateHomeProgress();
  state.screen = name;
  els.screens.forEach((screen) => {
    const isActive = screen.id === `${name}Screen`;
    screen.classList.toggle("active", isActive);
    screen.hidden = !isActive;
  });
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}

function updateHomeProgress() {
  const unlocked = Math.min(state.storage.unlocked, levels.length);
  const stars = Object.values(state.storage.stars).reduce((total, value) => total + value, 0);
  const nextLevel = levels[Math.max(0, Math.min(unlocked - 1, levels.length - 1))];
  if (els.homeMissionCount) els.homeMissionCount.textContent = `${unlocked}/${levels.length}`;
  if (els.homeStarCount) els.homeStarCount.textContent = stars;
  if (els.homeNextMission) els.homeNextMission.textContent = `Nivel ${nextLevel.id}`;
}

function renderLevels() {
  els.levelGrid.innerHTML = "";
  levels.forEach((level, index) => {
    const unlocked = canAccessLevel(index);
    const stars = state.storage.stars[level.id] || 0;
    const operations = [level.type];
    const card = document.createElement("article");
    card.className = `level-card level-${level.type} ${unlocked ? "" : "locked"}`;

    const icon = document.createElement("div");
    icon.className = "level-icon";
    icon.textContent = unlocked ? level.icon : "Bloq";

    const body = document.createElement("div");
    const eyebrow = document.createElement("p");
    eyebrow.className = "eyebrow";
    eyebrow.textContent = `Nivel ${level.id}`;
    const title = document.createElement("h3");
    title.textContent = level.title;
    const type = document.createElement("p");
    type.className = "level-type";
    type.textContent = level.label;
    const ops = document.createElement("div");
    ops.className = "level-ops";
    operations.forEach((operation) => {
      const op = document.createElement("span");
      op.textContent = operationSymbol(operation);
      ops.appendChild(op);
    });
    body.append(eyebrow, title, type);
    body.appendChild(ops);

    const starsEl = document.createElement("div");
    starsEl.className = "stars";
    starsEl.textContent = "\u2605".repeat(stars) + "\u2606".repeat(3 - stars);

    const button = document.createElement("button");
    button.className = unlocked ? "primary-btn" : "ghost-btn";
    button.type = "button";
    button.disabled = !unlocked;
    button.textContent = unlocked ? "Entrar" : "Bloqueado";
    if (unlocked) button.addEventListener("click", () => showConcept(index));

    card.append(icon, body, starsEl, button);

    els.levelGrid.appendChild(card);
  });
}

function operationSymbol(operation) {
  return {
    add: "+",
    subtract: "-",
    multiply: "x",
    divide: "/",
  }[operation] || "?";
}

function showConcept(index) {
  if (!canAccessLevel(index)) {
    renderLevels();
    showScreen("level");
    return;
  }

  state.levelIndex = index;
  const level = levels[index];
  const concept = level.concept || conceptByType[level.type];
  els.conceptEyebrow.textContent = `Nivel ${level.id}: ${level.title}`;
  els.conceptDemo.className = "sum-demo";
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
  if (part[0] === "clones") return `<div class="demo-group demo-clones">${cloneMarkup(part[1], "concept-clone")}</div>`;
  if (part[0] === "cloneTotal") return `<div class="demo-total demo-total-clones"><span class="result-ghost"><strong>${part[1]}</strong></span></div>`;
  if (part[0] === "batteries") return `<div class="demo-group demo-batteries">${energyBatteryMarkup(part[1], "concept-battery")}</div>`;
  if (part[0] === "batteryTotal") return `<div class="demo-total demo-battery-total"><span>${part[1]}</span></div>`;
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

function cloneMarkup(count, className = "clone-dot") {
  return Array.from({ length: count }, (_, index) => `<span class="${className}" style="animation-delay: ${index * 0.04}s"></span>`).join("");
}

function energyBatteryMarkup(count, className = "energy-battery") {
  return Array.from({ length: count }, (_, index) => `<span class="${className}" style="animation-delay: ${index * 0.045}s"></span>`).join("");
}

function startLevel(index) {
  if (!canAccessLevel(index)) {
    renderLevels();
    showScreen("level");
    return;
  }

  if (levels[index].type === "subtract") {
    startBattleLevel(index);
    return;
  }

  if (["add", "multiply"].includes(levels[index].type)) {
    startFactoryLevel(index);
    return;
  }

  if (levels[index].type === "divide") {
    startDeliveryLevel(index);
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
  state.question.locked = false;
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
  const type = level.type;
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
  if (!state.question || state.question.locked) return;
  state.question.locked = true;
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
        if (state.question) state.question.locked = false;
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
