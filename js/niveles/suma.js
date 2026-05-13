function createFactoryAdditionQuestion() {
  const tier = factory.machineIndex + 1;
  const max = Math.min(8, 4 + tier);
  const left = rand(2, max);
  const right = rand(2, max);
  const answer = left + right;
  return {
    text: `${left} + ${right} = ?`,
    brief: "Cuanta energia hay en total?",
    equation: `${left} + ${right} = ?`,
    equationMarkup: `
      <span class="addition-clone-set energy-set">${generarBaterias(left)}</span>
      <span class="addition-symbol">+</span>
      <span class="addition-clone-set energy-set">${generarBaterias(right)}</span>
      <span class="addition-symbol">=</span>
      <span class="addition-question">?</span>
    `,
    groups: 2,
    items: [left, right],
    groupLabel: "Grupo",
    answer,
    options: makeAdditionOptions(answer),
  };
}

function generarBaterias(cantidad, className = "energy-battery") {
  return Array.from({ length: cantidad }, (_, index) => `<span class="${className}" style="animation-delay: ${index * 0.045}s"></span>`).join("");
}

function generarOpcionSuma(valor) {
  return `<span class="answer-number">${valor}</span>`;
}

function generarPregunta() {
  return createFactoryAdditionQuestion();
}

function makeAdditionOptions(answer) {
  const options = new Set([answer]);
  while (options.size < 3) {
    const offset = rand(-2, 2);
    const value = Math.max(2, answer + (offset || 1));
    options.add(value);
  }
  return shuffle([...options]);
}

function animarRespuestaCorrecta(button) {
  factory.score += 1;
  setFactoryRoboMood("celebrating");
  setFactoryMessage("Genial!");
  playSound("clone-success");
  els.factoryLayout.classList.add("machine-on");
  button?.classList.add("chosen");
  animateAdditionFusion();
  flyAnswerEnergyToRobo(button);
  popFactoryParticles("spark");
  updateFactoryHud();

  setTimeout(() => {
    els.factoryLayout.classList.remove("machine-on");
    if (factory.machineIndex >= getFactoryMachines().length - 1) {
      completeFactoryLevel();
      return;
    }
    factory.machineIndex += 1;
    updateFactoryHud();
    nextFactoryQuestion();
  }, 1150);
}

function animarRespuestaIncorrecta(button) {
  factory.lives = Math.max(0, factory.lives - 1);
  state.lives = factory.lives;
  setFactoryRoboMood("thinking");
  setFactoryMessage("Casi, intenta otra vez");
  playSound("clone-error");
  button?.classList.add("wrong");
  els.factoryLayout.classList.add("factory-error");
  els.cloneEquation.classList.add("wrong-shake");
  popFactoryParticles("error");
  updateFactoryHud();

  setTimeout(() => {
    els.factoryLayout.classList.remove("factory-error");
    els.cloneEquation.classList.remove("wrong-shake");
    if (factory.lives <= 0) {
      factory.active = false;
      showScreen("defeat");
      return;
    }
    factory.locked = false;
    button?.classList.remove("wrong");
    els.factoryOptions.querySelectorAll(".factory-option").forEach((item) => {
      item.disabled = false;
    });
  }, 850);
}

function flyAnswerEnergyToRobo(button) {
  const source = button?.getBoundingClientRect();
  const target = els.factoryRobo?.getBoundingClientRect();
  const screen = els.factoryScreen?.getBoundingClientRect();
  if (!source || !target || !screen) return;

  const amount = Math.min(factory.question.answer, 14);
  for (let index = 0; index < amount; index += 1) {
    const energy = document.createElement("span");
    energy.className = "energy-battery flying-energy-battery";
    const startX = source.left + source.width * (0.25 + Math.random() * 0.5) - screen.left;
    const startY = source.top + source.height * (0.28 + Math.random() * 0.5) - screen.top;
    const endX = target.left + target.width * 0.5 - screen.left - startX;
    const endY = target.top + target.height * 0.42 - screen.top - startY;
    energy.style.left = `${startX}px`;
    energy.style.top = `${startY}px`;
    energy.style.setProperty("--fly-x", `${endX}px`);
    energy.style.setProperty("--fly-y", `${endY}px`);
    energy.style.animationDelay = `${index * 0.035}s`;
    els.factoryParticles.appendChild(energy);
    setTimeout(() => energy.remove(), 980);
  }
}

function animateAdditionFusion() {
  const result = els.cloneEquation.querySelector(".addition-question");
  if (!result) return;
  result.textContent = "";
  result.classList.add("revealing");
  els.cloneEquation.classList.add("fusion-active");

  els.cloneEquation.querySelectorAll(".addition-clone-set .energy-battery").forEach((battery, index) => {
    battery.style.setProperty("--fusion-delay", `${index * 0.035}s`);
    battery.classList.add("fusion-clone");
  });

  setTimeout(() => {
    result.textContent = factory.question.answer;
    result.classList.remove("revealing");
    result.classList.add("revealed");
  }, 180);
}
