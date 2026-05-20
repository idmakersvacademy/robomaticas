const energyLab = {
  active: false,
  started: false,
  round: 1,
  lives: 3,
  score: 0,
  stars: 0,
  progress: 0,
  charge: 0,
  visualValue: 0,
  animation: null,
  stepIndex: 0,
  locked: false,
  question: null,
};

const energyLabEls = {};

function getEnergyLabEls() {
  if (energyLabEls.screen) return energyLabEls;
  Object.assign(energyLabEls, {
    screen: document.querySelector("#energyLabScreen"),
    layout: document.querySelector("#energyLabLayout"),
    stars: document.querySelector("#energyLabStars"),
    lives: document.querySelector("#energyLabLives"),
    progressText: document.querySelector("#energyLabProgressText"),
    progressBar: document.querySelector("#energyLabProgressBar"),
    exitButton: document.querySelector("#energyLabExitButton"),
    startButton: document.querySelector("#energyLabStartButton"),
    eyebrow: document.querySelector("#energyLabScreen .energy-lab-hud .eyebrow"),
    title: document.querySelector("#energyLabScreen .energy-lab-hud h2"),
    operation: document.querySelector("#energyLabOperation"),
    prompt: document.querySelector("#energyLabPrompt"),
    options: document.querySelector("#energyLabOptions"),
    stepOne: document.querySelector("#energyStepOne"),
    stepTwo: document.querySelector("#energyStepTwo"),
    reactor: document.querySelector("#energyReactor"),
    reactorFill: document.querySelector("#reactorEnergyFill"),
    reactorChargeText: document.querySelector("#reactorChargeText"),
    panelLeft: document.querySelector("#energyLabScreen .panel-left"),
    panelRight: document.querySelector("#energyLabScreen .panel-right"),
    machine: document.querySelector("#energyMissionMachine"),
    particles: document.querySelector("#energyLabParticles"),
    message: document.querySelector("#energyLabMessage"),
    robo: document.querySelector("#energyLabRobo .robot-wrap"),
  });
  return energyLabEls;
}

function startEnergyLabLevel(index) {
  state.levelIndex = index;
  state.lives = 3;
  state.score = 0;
  energyLab.active = true;
  energyLab.started = false;
  energyLab.round = 1;
  energyLab.lives = 3;
  energyLab.score = 0;
  energyLab.stars = 0;
  energyLab.progress = 0;
  energyLab.charge = 0;
  energyLab.visualValue = 0;
  energyLab.animation = null;
  energyLab.stepIndex = 0;
  energyLab.locked = false;
  energyLab.question = null;

  const els = getEnergyLabEls();
  const config = energyLabConfig();
  els.screen.className = `screen energy-lab-screen ${config.themeClass}`;
  els.layout.dataset.mission = levels[index].id;
  els.screen.classList.remove("success-pulse", "short-circuit");
  els.options.innerHTML = "";
  els.eyebrow.textContent = `Nivel ${levels[index].id}`;
  els.title.textContent = config.title;
  els.operation.textContent = config.placeholder;
  els.prompt.textContent = config.readyPrompt;
  els.stepOne.textContent = config.stepOneLabel;
  els.stepTwo.textContent = config.stepTwoLabel;
  els.panelLeft.textContent = config.panelLeft;
  els.panelRight.textContent = config.panelRight;
  els.startButton.style.display = "inline-grid";
  els.startButton.textContent = config.startText;
  els.machine.innerHTML = renderMissionMachineIdle(config);
  setEnergyLabMessage(config.readyMessage, "happy");
  updateEnergyLabHud();
  updateEnergyLabSteps();
  showScreen("energyLab");
}

function beginEnergyLabRun() {
  energyLab.started = true;
  getEnergyLabEls().startButton.style.display = "none";
  setEnergyLabMessage(energyLabConfig().beginMessage, "thinking");
  nextEnergyLabQuestion();
}

function energyLabConfig() {
  const level = levels[state.levelIndex] || levels[4];
  return {
    5: {
      themeClass: "control-center-theme",
      title: "Torre de Compuertas",
      placeholder: "5 + 3 - 2",
      readyPrompt: "Abre la torre cuando Robo este listo.",
      readyMessage: "La torre esta apagada. Vamos a cargarla viendo capsulas entrar y salir.",
      beginMessage: "Mira las capsulas del reactor. Primero entran nuevas cargas.",
      stepOneLabel: "1 Entran capsulas",
      stepTwoLabel: "2 Sale energia",
      panelLeft: "ENTRAN",
      panelRight: "SALEN",
      startText: "Abrir compuertas",
      roundComplete: ["Torre cargada.", "Las compuertas quedaron estables.", "Robo conto el flujo perfecto."],
      nouns: { first: "capsulas", second: "capsulas" },
    },
    6: {
      themeClass: "factory-danger-theme",
      title: "Fabrica Chispa",
      placeholder: "10 - 2 x 3",
      readyPrompt: "Lanza el rescate industrial cuando Robo este listo.",
      readyMessage: "La banda se trabo: faltan piezas exactas para reiniciar.",
      beginMessage: "Primero los brazos mecanicos fabrican grupos de piezas.",
      stepOneLabel: "1 Fabrica piezas",
      stepTwoLabel: "2 Resta recursos",
      panelLeft: "PARTS",
      panelRight: "FIX",
      startText: "Lanzar rescate",
      roundComplete: ["Modulo reparado.", "La banda vuelve a moverse.", "Los robots trabajadores encendieron luces verdes."],
      nouns: { first: "piezas", second: "recursos" },
    },
    7: {
      themeClass: "space-engine-theme",
      title: "Motor Portal Orion",
      placeholder: "4 x 6 / 2",
      readyPrompt: "Arma el salto cuando Robo este listo.",
      readyMessage: "El portal Orion flota apagado esperando combustible.",
      beginMessage: "Primero llena el nucleo multiplicando celdas de combustible.",
      stepOneLabel: "1 Genera energia",
      stepTwoLabel: "2 Distribuye energia",
      panelLeft: "FUEL",
      panelRight: "WARP",
      startText: "Armar salto",
      roundComplete: ["Anillo de portal estable.", "Motores sincronizados.", "Combustible repartido sin turbulencia."],
      nouns: { first: "combustible", second: "sistemas" },
    },
    8: {
      themeClass: "master-lab-theme",
      title: "Laboratorio Prisma",
      placeholder: "12 / 3 + 4",
      readyPrompt: "Inicia la mezcla prisma cuando Robo este listo.",
      readyMessage: "Las muestras flotan en tubos y el reactor espera una formula.",
      beginMessage: "Primero reparte las muestras en tubos iguales.",
      stepOneLabel: "1 Distribuye recursos",
      stepTwoLabel: "2 Suma potencia",
      panelLeft: "LAB",
      panelRight: "SYNC",
      startText: "Mezclar prisma",
      roundComplete: ["Formula balanceada.", "Cristales de energia alineados.", "El reactor prisma brilla estable."],
      nouns: { first: "muestras", second: "potencia" },
    },
  }[level.id];
}

function createEnergyLabQuestion() {
  const level = levels[state.levelIndex];
  if (level.id === 6) return createFactoryDangerQuestion();
  if (level.id === 7) return createSpaceEngineQuestion();
  if (level.id === 8) return createMasterLabQuestion();
  return createControlCenterQuestion();
}

function createControlCenterQuestion() {
  const start = rand(5, 8 + energyLab.round);
  const firstChange = rand(2, 4);
  const core = start + firstChange;
  const secondChange = rand(1, Math.min(3, core - 1));
  const answer = core - secondChange;

  return {
    start,
    valorInicial: start,
    firstOperator: "+",
    firstChange,
    secondOperator: "-",
    secondChange,
    firstAction: "agrega",
    secondAction: "libera",
    core,
    answer,
    operacionTexto: `${start} + ${firstChange} - ${secondChange}`,
    text: `${start} + ${firstChange} - ${secondChange}`,
    pasos: [
      {
        tipo: "sumar",
        operador: "+",
        cantidad: firstChange,
        pregunta: `Primero agrega ${firstChange} capsulas. Cuanta energia hay ahora?`,
        respuestaCorrecta: core,
        opciones: makeEnergyLabOptions(core),
        robo: `Primero cargamos ${firstChange} capsulas nuevas.`,
      },
      {
        tipo: "restar",
        operador: "-",
        cantidad: secondChange,
        pregunta: `Ahora se usa ${secondChange} capsula${secondChange > 1 ? "s" : ""}. Cuanta energia queda?`,
        respuestaCorrecta: answer,
        opciones: makeEnergyLabOptions(answer),
        robo: `Ahora descontamos ${secondChange} uso${secondChange > 1 ? "s" : ""} de energia.`,
      },
    ],
  };
}

function createFactoryDangerQuestion() {
  const groups = rand(2, 4);
  const pieces = rand(2, 5);
  const core = groups * pieces;
  const base = core + rand(4, 12);
  return {
    start: base,
    firstOperator: "x",
    firstChange: `${groups} x ${pieces}`,
    secondOperator: "-",
    secondChange: core,
    firstAction: "fabrica",
    secondAction: "resta",
    core,
    answer: base - core,
    text: `${base} - ${groups} x ${pieces}`,
  };
}

function createSpaceEngineQuestion() {
  const divisor = randomFrom([2, 3, 4]);
  const groups = divisor * rand(1, 3);
  const fuel = rand(2, 5);
  const core = groups * fuel;
  return {
    start: groups,
    firstOperator: "x",
    firstChange: `${groups} x ${fuel}`,
    secondOperator: "/",
    secondChange: divisor,
    firstAction: "genera",
    secondAction: "distribuye",
    core,
    answer: core / divisor,
    text: `${groups} x ${fuel} / ${divisor}`,
  };
}

function createMasterLabQuestion() {
  const divisor = randomFrom([2, 3, 4, 5]);
  const each = rand(2, 6);
  const total = divisor * each;
  const boost = rand(2, 7);
  return {
    start: total,
    firstOperator: "/",
    firstChange: `${total} / ${divisor}`,
    secondOperator: "+",
    secondChange: boost,
    firstAction: "distribuye",
    secondAction: "suma",
    core: each,
    answer: each + boost,
    text: `${total} / ${divisor} + ${boost}`,
  };
}

function nextEnergyLabQuestion() {
  const els = getEnergyLabEls();
  energyLab.question = createEnergyLabQuestion();
  energyLab.stepIndex = 0;
  energyLab.locked = false;
  energyLab.animation = null;
  energyLab.visualValue = energyLab.question.start;
  els.stepOne.textContent = stepBadge(1);
  els.stepTwo.textContent = stepBadge(2);
  els.operation.textContent = energyLab.question.text;
  els.prompt.textContent = stepPrompt(1);
  setEnergyLabMessage(stepMessage(1), "thinking");
  updateEnergyLabSteps();
  renderMissionMachine();
  if (isGateTowerLevel()) {
    const firstStep = currentGateStep();
    els.prompt.textContent = `Empiezas con ${energyLab.question.start} capsulas encendidas. Mira el reactor.`;
    setEnergyLabMessage(`Primero contamos ${energyLab.question.start} capsulas dentro de la torre.`, "thinking");
    renderEnergyLabOptions(firstStep.opciones);
    setEnergyLabOptionsDisabled(true);
    setTimeout(mostrarPasoActual, 650);
    return;
  }
  renderEnergyLabOptions(makeEnergyLabOptions(energyLab.question.core));
}

function renderMissionMachineIdle(config) {
  return `
    <div class="mission-title">${config.title}</div>
    <div class="mission-visual idle" aria-hidden="true">
      <span></span><span></span><span></span><span></span>
    </div>
  `;
}

function renderMissionMachine() {
  const els = getEnergyLabEls();
  const level = levels[state.levelIndex];
  const question = energyLab.question;
  const step = energyLab.stepIndex;
  const firstActive = step === 0 ? "active" : "done";
  const secondActive = step === 1 ? "active" : "";

  if (level.id === 5) {
    els.machine.innerHTML = renderGateTowerMachine();
    return;
  }

  const templates = {
    6: `
      <div class="mission-title">Rescate de banda Chispa</div>
      <div class="factory-rescue ${firstActive}">
        <div class="factory-warning"><span></span><span></span><span></span></div>
        ${factoryCrates(question.firstChange)}
        <span class="mechanic-arm"></span>
        <strong>${question.core} piezas listas</strong>
      </div>
      <div class="resource-strip conveyor-budget ${secondActive}">
        <span>Tanque ${question.start}</span>
        <span class="resource-drain">-${question.core}</span>
        <strong>Quedan ${question.answer}</strong>
      </div>
    `,
    7: `
      <div class="mission-title">Motor Portal Orion</div>
      <div class="portal-core ${firstActive}">
        <div class="portal-ring-mini">${fuelPods(question.core)}</div>
        <strong>${question.firstChange}</strong>
      </div>
      <div class="engine-split orbital-split ${secondActive}">
        ${enginePorts(question.secondChange)}
        <strong>${question.answer} cargas por motor</strong>
      </div>
    `,
    8: `
      <div class="mission-title">Mezclador Prisma</div>
      <div class="prism-bench ${firstActive}">
        <div class="sample-rack">${sampleTubes(question.start)}</div>
        <strong>${question.firstChange}</strong>
      </div>
      <div class="power-boost prism-boost ${secondActive}">
        <span>${question.core}</span>
        <strong>+ ${question.secondChange}</strong>
        <span>${question.answer}</span>
        <i></i>
        <em>reactor listo</em>
      </div>
    `,
  };

  els.machine.innerHTML = templates[level.id] || templates[5];
}

function isGateTowerLevel() {
  return levels[state.levelIndex]?.id === 5;
}

function currentGateStep() {
  return energyLab.question?.pasos?.[energyLab.stepIndex];
}

function renderGateTowerMachine() {
  const question = energyLab.question;
  const step = currentGateStep();
  const animationClass = energyLab.animation ? `is-${energyLab.animation.tipo}` : "";
  const outgoing = energyLab.animation?.tipo === "restar" ? energyLab.animation.cantidad : 0;
  return `
    <div class="gate-tower-playfield ${animationClass}">
      <div class="gate-operation-pill">${question.operacionTexto}</div>
      <div class="gate-step-chip ${step?.tipo || ""}">
        <span>Paso ${energyLab.stepIndex + 1}</span>
        <strong>${step?.operador || "+"}${step?.cantidad || 0}</strong>
      </div>
      <div class="gate-reactor-panel" aria-label="${energyLab.visualValue} capsulas de energia">
        <div class="gate-reactor-shell">
          <span class="gate-reactor-glow"></span>
          <div class="gate-capsule-grid">${renderEnergia(energyLab.visualValue)}</div>
          ${outgoing ? `<div class="gate-exit-stream">${renderEnergia(outgoing, "leaving")}</div>` : ""}
        </div>
        <div class="gate-energy-meter">
          <span style="--gate-charge: ${Math.min(100, energyLab.visualValue * 8)}%"></span>
        </div>
        <strong class="gate-count">${energyLab.visualValue}</strong>
      </div>
    </div>
  `;
}

function renderEnergia(cantidad, extraClass = "") {
  const animation = energyLab.animation;
  const enteringFrom = animation?.tipo === "sumar" ? Math.max(0, cantidad - animation.cantidad) : Infinity;
  return Array.from({ length: Math.max(0, cantidad) }, (_, index) => {
    const entering = index >= enteringFrom ? " entering" : "";
    return `<span class="gate-capsule ${extraClass}${entering}" style="--delay: ${index * 0.035}s"></span>`;
  }).join("");
}

function animarEntrada(cantidad) {
  return runGateAnimation("sumar", cantidad);
}

function animarSalida(cantidad) {
  return runGateAnimation("restar", cantidad);
}

function runGateAnimation(tipo, cantidad) {
  energyLab.locked = true;
  energyLab.animation = { tipo, cantidad };
  renderMissionMachine();
  setEnergyLabOptionsDisabled(true);
  getEnergyLabEls().screen.classList.toggle("energy-gain", tipo === "sumar");
  getEnergyLabEls().screen.classList.toggle("energy-release", tipo === "restar");

  return new Promise((resolve) => {
    setTimeout(() => {
      energyLab.animation = null;
      getEnergyLabEls().screen.classList.remove("energy-gain", "energy-release");
      renderMissionMachine();
      energyLab.locked = false;
      setEnergyLabOptionsDisabled(false);
      resolve();
    }, 720);
  });
}

function mostrarPasoActual() {
  const step = currentGateStep();
  if (!step) return;
  const els = getEnergyLabEls();
  energyLab.visualValue = step.respuestaCorrecta;
  els.operation.textContent = energyLab.question.operacionTexto;
  els.prompt.textContent = step.pregunta;
  setEnergyLabMessage(step.robo, "thinking");
  updateEnergyLabSteps();
  renderMissionMachine();
  renderEnergyLabOptions(step.opciones);

  if (step.tipo === "sumar") {
    animarEntrada(step.cantidad);
    return;
  }

  animarSalida(step.cantidad);
}

function energyCells(count, className) {
  return `<div class="energy-cells ${className}">${Array.from({ length: Math.min(count, 12) }, () => "<span></span>").join("")}</div>`;
}

function factoryCrates(label) {
  const match = String(label).match(/(\d+) x (\d+)/);
  const groups = Number(match?.[1] || 2);
  const pieces = Number(match?.[2] || 2);
  return `<div class="factory-crates">${Array.from({ length: groups }, (_, index) => `<span><small>${index + 1}</small>${pieces}</span>`).join("")}</div>`;
}

function fuelPods(count) {
  return `<div class="fuel-pods">${Array.from({ length: Math.min(count, 16) }, () => "<span></span>").join("")}</div>`;
}

function enginePorts(count) {
  return `<div class="engine-ports">${Array.from({ length: Math.min(count, 5) }, () => "<span></span>").join("")}</div>`;
}

function sampleTubes(total) {
  return `<div class="sample-tubes">${Array.from({ length: Math.min(total, 18) }, () => "<span></span>").join("")}</div>`;
}

function stepPrompt(step) {
  const question = energyLab.question;
  if (step === 1) {
    return {
      "+": `Paso 1: agrega ${question.firstChange} de energia.`,
      "-": `Paso 1: libera ${question.firstChange} de energia.`,
      "x": `Paso 1: arma ${question.firstChange} piezas primero.`,
      "/": `Paso 1: reparte ${question.firstChange} recursos primero.`,
    }[question.firstOperator];
  }

  return {
    "+": `Paso 2: suma ${question.secondChange} para potenciar.`,
    "-": `Paso 2: resta ${question.secondChange} recursos usados.`,
    "/": `Paso 2: distribuye ${question.core} entre ${question.secondChange} sistemas.`,
  }[question.secondOperator];
}

function stepBadge(step) {
  const question = energyLab.question;
  if (step === 1) {
    return {
      "+": "1 Cargar panel",
      "-": "1 Liberar energia",
      "x": "1 Construir piezas",
      "/": "1 Distribuir recursos",
    }[question.firstOperator];
  }

  return {
    "+": "2 Potenciar sistema",
    "-": "2 Descontar uso",
    "/": "2 Repartir motores",
  }[question.secondOperator];
}

function stepMessage(step) {
  const level = levels[state.levelIndex];
  if (step === 1) {
    return {
      5: "Toca el nuevo nivel de energia del panel.",
      6: "La multiplicacion crea las piezas antes de restar.",
      7: "Genera combustible espacial con multiplicacion.",
      8: "Distribuye los recursos con division antes de sumar.",
    }[level.id];
  }

  return {
    5: "Bien. Ahora completa el segundo cambio de energia.",
    6: "Ahora resta esas piezas usadas del recurso total.",
    7: "Ahora reparte el combustible entre los sistemas.",
    8: "Ahora suma potencia al laboratorio.",
  }[level.id];
}

function stepTwoOperation() {
  const question = energyLab.question;
  return `${question.core} ${question.secondOperator} ${question.secondChange}`;
}

function renderEnergyLabOptions(options) {
  const els = getEnergyLabEls();
  els.options.innerHTML = "";
  options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "energy-option";
    button.type = "button";
    button.textContent = option;
    button.setAttribute("aria-label", `Responder ${option}`);
    button.addEventListener("click", () => answerEnergyLabStep(button, option));
    els.options.appendChild(button);
  });
}

function setEnergyLabOptionsDisabled(disabled) {
  getEnergyLabEls().options.querySelectorAll("button").forEach((item) => {
    item.disabled = disabled;
  });
}

function makeEnergyLabOptions(answer) {
  const options = new Set([answer]);
  while (options.size < 3) {
    const spread = Math.max(3, Math.ceil(answer / 2));
    const guess = Math.max(1, answer + rand(-spread, spread));
    options.add(guess === answer ? answer + 1 : guess);
  }
  return shuffle([...options]);
}

function answerEnergyLabStep(button, value) {
  if (energyLab.locked || !energyLab.question || !energyLab.started) return;
  energyLab.locked = true;
  setEnergyLabOptionsDisabled(true);

  const expected = isGateTowerLevel()
    ? currentGateStep().respuestaCorrecta
    : energyLab.stepIndex === 0 ? energyLab.question.core : energyLab.question.answer;
  if (value === expected) {
    button.classList.add("correct");
    energyLabCorrectStep();
    return;
  }

  button.classList.add("wrong");
  energyLabWrongStep(expected);
}

function energyLabCorrectStep() {
  const els = getEnergyLabEls();
  playSound("energy-lab-correct");
  energyLab.score += energyLab.stepIndex === 0 ? 80 : 150;
  const gateStep = currentGateStep();
  const direction = isGateTowerLevel()
    ? gateStep.operador
    : energyLab.stepIndex === 0 ? energyLab.question.firstOperator : energyLab.question.secondOperator;
  const chargeDelta = ["+", "x"].includes(direction) ? 14 : -8;
  energyLab.charge = Math.max(8, Math.min(100, energyLab.charge + chargeDelta + (energyLab.stepIndex === 1 ? 12 : 0)));
  els.reactor.classList.add("charged");
  els.screen.classList.add("success-pulse", direction === "+" ? "energy-gain" : "energy-release");
  popEnergyLabParticles(["+", "x"].includes(direction) ? "gain" : "release");
  updateEnergyLabHud();
  mostrarFeedbackCorrecto();
  setEnergyLabMood("happy");

  setTimeout(() => {
    els.reactor.classList.remove("charged");
    els.screen.classList.remove("success-pulse", "energy-gain", "energy-release");

    if (energyLab.stepIndex === 0) {
      energyLab.stepIndex = 1;
      if (isGateTowerLevel()) {
        mostrarPasoActual();
        return;
      }
      energyLab.locked = false;
      els.prompt.textContent = stepPrompt(2);
      els.operation.textContent = stepTwoOperation();
      setEnergyLabMessage(stepMessage(2), "thinking");
      updateEnergyLabSteps();
      renderMissionMachine();
      renderEnergyLabOptions(makeEnergyLabOptions(energyLab.question.answer));
      return;
    }

    completeEnergyLabRound();
  }, 650);
}

function energyLabWrongStep(expected) {
  const els = getEnergyLabEls();
  playSound("energy-lab-wrong");
  energyLab.lives = Math.max(0, energyLab.lives - 1);
  state.lives = energyLab.lives;
  els.screen.classList.add("short-circuit");
  els.reactor.classList.add("short");
  popEnergyLabParticles("error");
  updateEnergyLabHud();
  mostrarFeedbackIncorrecto(expected);

  if (energyLab.lives <= 0) {
    setTimeout(() => {
      energyLab.active = false;
      showScreen("defeat");
    }, 900);
    return;
  }

  setTimeout(() => {
    els.screen.classList.remove("short-circuit");
    els.reactor.classList.remove("short");
    energyLab.locked = false;
    getEnergyLabEls().options.querySelectorAll("button").forEach((item) => {
      item.classList.remove("wrong");
    });
    setEnergyLabOptionsDisabled(false);
    const step = currentGateStep();
    setEnergyLabMessage(isGateTowerLevel() && step ? step.robo : "Probemos otra vez: mira si la energia sube o baja.", "thinking");
  }, 950);
}

function completeEnergyLabRound() {
  energyLab.progress = Math.min(100, energyLab.progress + 25);
  energyLab.stars = isGateTowerLevel() ? Math.max(1, energyLab.lives) : Math.min(3, Math.max(1, Math.ceil(energyLab.progress / 34)));
  setEnergyLabMessage(randomFrom(energyLabConfig().roundComplete), "happy");
  updateEnergyLabHud();
  renderMissionMachine();

  if (energyLab.progress >= 100 || energyLab.round >= 4) {
    setTimeout(completeEnergyLabLevel, 850);
    return;
  }

  energyLab.round += 1;
  setTimeout(nextEnergyLabQuestion, 850);
}

function completeEnergyLabLevel() {
  energyLab.active = false;
  state.score = energyLab.score;
  state.lives = energyLab.lives;
  energyLab.stars = Math.max(1, energyLab.lives);
  completeLevel();
}

function updateEnergyLabHud() {
  const els = getEnergyLabEls();
  els.stars.textContent = `${energyLab.stars}/3`;
  els.lives.textContent = "\u2665".repeat(Math.max(0, energyLab.lives)) + "\u2661".repeat(Math.max(0, 3 - energyLab.lives));
  els.progressText.textContent = `${energyLab.progress}%`;
  els.progressBar.style.width = `${energyLab.progress}%`;
  els.reactorFill.style.setProperty("--charge", `${energyLab.charge}%`);
  els.reactorChargeText.textContent = `${energyLab.charge}%`;
}

function validarRespuesta(valor) {
  const buttons = [...getEnergyLabEls().options.querySelectorAll("button")];
  const button = buttons.find((item) => Number(item.textContent) === Number(valor));
  if (button) answerEnergyLabStep(button, valor);
}

function actualizarHUD() {
  updateEnergyLabHud();
}

function mostrarFeedbackCorrecto() {
  const step = currentGateStep();
  if (isGateTowerLevel() && step) {
    setEnergyLabMessage(`Correcto: ahora hay ${step.respuestaCorrecta} capsulas.`, "happy");
    return;
  }
  setEnergyLabMessage("Respuesta correcta. El sistema se ilumina.", "happy");
}

function mostrarFeedbackIncorrecto(expected) {
  if (isGateTowerLevel()) {
    setEnergyLabMessage(`Mira las capsulas otra vez. Este paso deja ${expected}.`, "sad");
    return;
  }
  setEnergyLabMessage(`Alerta suave: revisa el flujo. Ese paso debe dejar ${expected} de energia.`, "sad");
}

function completarNivel() {
  completeEnergyLabLevel();
}

function updateEnergyLabSteps() {
  const els = getEnergyLabEls();
  els.stepOne.classList.toggle("active", energyLab.stepIndex === 0);
  els.stepOne.classList.toggle("done", energyLab.stepIndex > 0);
  els.stepTwo.classList.toggle("active", energyLab.stepIndex === 1);
  els.stepTwo.classList.toggle("done", false);
}

function setEnergyLabMessage(message, mood) {
  getEnergyLabEls().message.textContent = message;
  setEnergyLabMood(mood);
}

function setEnergyLabMood(mood) {
  const robo = getEnergyLabEls().robo;
  if (!robo) return;
  robo.classList.remove("happy", "thinking", "sad", "speaking", "celebrating");
  robo.classList.add(mood, "speaking");
  clearTimeout(robo.energyLabTimer);
  robo.energyLabTimer = setTimeout(() => robo.classList.remove("speaking"), 900);
}

function popEnergyLabParticles(type) {
  const els = getEnergyLabEls();
  const colors = {
    gain: ["#55f6ff", "#7effa7", "#45ffd2"],
    release: ["#ffdf55", "#8f68ff", "#55f6ff"],
    error: ["#ff4f61", "#ffdf55", "#8f68ff"],
  }[type] || ["#55f6ff", "#7effa7", "#ffdf55"];
  const count = type === "error" ? 18 : 28;
  for (let index = 0; index < count; index += 1) {
    const particle = document.createElement("span");
    particle.style.setProperty("--x", `${rand(34, 66)}%`);
    particle.style.setProperty("--y", `${rand(30, 70)}%`);
    particle.style.setProperty("--dx", `${rand(-140, 140)}px`);
    particle.style.setProperty("--dy", `${rand(-130, 90)}px`);
    particle.style.setProperty("--color", randomFrom(colors));
    els.particles.appendChild(particle);
    setTimeout(() => particle.remove(), 900);
  }
}

document.querySelector("#energyLabStartButton")?.addEventListener("click", beginEnergyLabRun);
document.querySelector("#energyLabExitButton")?.addEventListener("click", () => {
  energyLab.active = false;
  renderLevels();
  showScreen("level");
});
