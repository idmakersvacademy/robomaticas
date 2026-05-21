function factoryMode() {
  return levels[state.levelIndex].type === "add" ? "add" : "multiply";
}

function getFactoryMachines() {
  return factoryMode() === "add" ? additionMachines : factoryMachines;
}

function startFactoryLevel(index) {
  state.levelIndex = index;
  const level = levels[index];
  const mode = factoryMode();
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
  factory.lives = 3;
  els.factoryScreen.classList.toggle("sum-arcade-screen", mode === "add");
  els.factoryScreen.classList.toggle("multiply-factory-screen", mode === "multiply");
  els.factoryScreen.classList.toggle("planet-clonix-screen", mode === "multiply");
  els.factoryEyebrow.textContent = level.label;
  els.factoryTitle.textContent = mode === "add" ? "Bahía de Sumas" : "PLANETA CLONIX";
  els.factoryStartButton.style.display = "inline-grid";
  els.factoryStartButton.textContent = mode === "add" ? "Iniciar Sumas" : "Crear Planeta";
  els.factoryOptions.innerHTML = "";
  els.cloneRoundBrief.textContent = mode === "add" ? "Conecta baterías para cargar la bahía." : "Cuantos clones nacen en total?";
  els.cloneEquation.textContent = mode === "add" ? "Estación en espera" : "Abre los portales";
  els.cloneGroups.innerHTML = "";
  setFactoryRoboMood("happy");
  setFactoryMessage(
    mode === "add"
      ? "Robo está listo para encender la bahía."
      : "Resuelve para evolucionar el planeta.",
  );
  updateFactoryHud();
  updateFactoryMachines();
  showScreen("factory");
  playSound("factory-start");
}

function beginFactoryRun() {
  const machines = getFactoryMachines();
  factory.started = true;
  els.factoryStartButton.style.display = "none";
  setFactoryMessage(machines[factory.machineIndex].activity);
  nextFactoryQuestion();
}

function nextFactoryQuestion() {
  factory.question = createFactoryQuestion();
  factory.locked = false;
  setFactoryRoboMood("thinking");
  els.cloneEquation.classList.remove("fusion-active", "wrong-shake");
  els.cloneRoundBrief.textContent = factory.question.brief;
  if (factory.question.equationMarkup) {
    els.cloneEquation.innerHTML = factory.question.equationMarkup;
  } else {
    els.cloneEquation.textContent = factory.question.equation;
  }
  els.factoryOptions.innerHTML = "";
  if (factoryMode() === "add") {
    els.cloneGroups.innerHTML = "";
    els.cloneGroups.classList.add("hidden");
  } else {
    els.cloneGroups.classList.remove("hidden");
    renderCloneGroups(factory.question.groups, factory.question.items, factory.question.groupLabel);
  }
  renderOpciones(factory.question.options);
}

function renderOpciones(options) {
  els.factoryOptions.innerHTML = "";
  options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "factory-option";
    button.type = "button";
    if (factoryMode() === "add") {
      button.classList.add("sum-answer-card");
      button.setAttribute("aria-label", `${option} de energia`);
      button.innerHTML = typeof generarOpcionSuma === "function" ? generarOpcionSuma(option) : option;
    } else {
      button.textContent = option;
    }
    button.addEventListener("click", () => validarRespuestaFactory(button, option));
    els.factoryOptions.appendChild(button);
  });
}

function createFactoryQuestion() {
  if (factoryMode() === "add") return generarPregunta();
  return createFactoryMultiplicationQuestion();
}



function answerFactoryQuestion(button, value) {
  validarRespuestaFactory(button, value);
}

function validarRespuestaFactory(button, value) {
  if (factory.locked || !factory.question || !factory.started) return;
  factory.locked = true;
  els.factoryOptions.querySelectorAll(".factory-option").forEach((item) => {
    item.disabled = true;
  });

  if (value === factory.question.answer) {
    button.classList.add("correct");
    factoryCorrect(button);
    return;
  }

  button.classList.add("wrong");
  factoryWrong(button);
}

function factoryCorrect(button) {
  if (factoryMode() === "add") {
    animarRespuestaCorrecta(button);
    return;
  }

  const machines = getFactoryMachines();
  factory.combo += 1;
  factory.score += 120 + factory.combo * 30;
  factory.progress = Math.min(100, factory.progress + 22 + factory.combo * 3);
  if (factoryMode() === "add") {
    animateAdditionFusion();
  }
  setFactoryRoboMood("celebrating");
  setFactoryMessage(`Correcto! Robo ${machines[factory.machineIndex].verb} el sistema.`);
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

function factoryWrong(button) {
  if (factoryMode() === "add") {
    animarRespuestaIncorrecta(button);
    return;
  }

  factory.combo = 0;
  factory.progress = Math.max(0, factory.progress - 10);
  setFactoryRoboMood("sad");
  setFactoryMessage(factoryMode() === "add" ? "Casi, intenta otra vez" : "Glitch digital! Un clon salio inestable. Intenta otra multiplicacion.");
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
  const machines = getFactoryMachines();
  factory.medals = Math.min(3, Math.floor((factory.machineIndex + 1) / 2) + 1);
  els.machineStage.querySelector(`[data-machine="${factory.machineIndex}"]`)?.classList.add("complete");
  popFactoryParticles("burst");
  setFactoryMessage(`${machines[factory.machineIndex].name} estabilizado! Nueva zona desbloqueada.`);
  playSound("lab-unlock");

  if (factory.machineIndex >= machines.length - 1) {
    setTimeout(completeFactoryLevel, 1000);
    return;
  }

  factory.machineIndex += 1;
  factory.progress = 0;
  updateFactoryHud();
  updateFactoryMachines();
  setTimeout(() => {
    setFactoryMessage(machines[factory.machineIndex].activity);
    nextFactoryQuestion();
  }, 1000);
}


function completeFactoryLevel() {
  factory.active = false;
  state.score = factory.score;
  state.lives = factoryMode() === "add" ? factory.lives : 3;
  completeLevel();
}

function updateFactoryHud() {
  const machines = getFactoryMachines();
  const mode = factoryMode();
  els.factoryScoreText.textContent = mode === "add" ? factory.score : factory.score;
  els.factoryComboText.textContent = mode === "add"
    ? "\u2665".repeat(Math.max(0, factory.lives)) + "\u2661".repeat(Math.max(0, 3 - factory.lives))
    : `x${factory.combo}`;
  els.factoryMachineText.textContent = mode === "add" ? `Nivel ${factory.machineIndex + 1}` : `${factory.machineIndex + 1}/${machines.length}`;
  els.factoryMoodText.textContent = factory.started ? machines[factory.machineIndex].name : "Listo";
  els.factoryProgressBar.style.width = `${factory.progress}%`;
  if (mode === "multiply") {
    els.factoryScreen.dataset.planetStage = String(factory.machineIndex);
  } else {
    delete els.factoryScreen.dataset.planetStage;
  }
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

function renderCloneGroups(groups, items, groupLabel = "Capsula") {
  els.cloneGroups.classList.remove("success", "glitch", "help");
  els.cloneGroups.innerHTML = "";
  const groupCount = Array.isArray(items) ? items.length : groups;
  for (let groupIndex = 0; groupIndex < groupCount; groupIndex += 1) {
    const itemCount = Array.isArray(items) ? items[groupIndex] : items;
    const pod = document.createElement("div");
    pod.className = "clone-group-pod";
    pod.style.animationDelay = `${groupIndex * 0.06}s`;
    const label = document.createElement("strong");
    label.textContent = factoryMode() === "multiply" ? `x${itemCount}` : `${groupLabel} ${groupIndex + 1}`;
    const grid = document.createElement("div");
    grid.className = "clone-mini-grid";
    for (let itemIndex = 0; itemIndex < itemCount; itemIndex += 1) {
      const clone = document.createElement("span");
      clone.className = "clone-dot";
      clone.style.animationDelay = `${(groupIndex * itemCount + itemIndex) * 0.025}s`;
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
