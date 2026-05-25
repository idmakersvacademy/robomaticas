const energyReactorCounts = [2, 3, 4, 5, 6];
const reduceEnergyMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function startDeliveryLevel(index) {
  state.levelIndex = index;
  delivery.active = true;
  delivery.round = 1;
  delivery.score = 0;
  delivery.stars = 0;
  delivery.lives = 3;
  delivery.energy = 100;
  delivery.combo = 0;
  delivery.progress = 0;
  delivery.locked = false;
  delivery.question = null;
  els.deliveryLayout?.classList.remove("energy-success", "energy-error", "energy-distributing", "energy-imbalanced");
  setDeliveryMessage("Central Energetica lista para estabilizar reactores.", "happy");
  updateDeliveryHud();
  nextEnergyRound();
  showScreen("delivery");
}

function nextEnergyRound() {
  delivery.locked = false;
  delivery.question = createDeliveryQuestion();
  renderDeliveryQuestion();
  setDeliveryMessage("Reparte la energia en partes iguales.", "thinking");
}

function createDeliveryQuestion() {
  const operation = generarDivision(Math.min(3, delivery.round));
  const reactors = operation.b;
  const answer = operation.respuesta;
  return {
    cores: operation.a,
    reactors,
    answer,
  };
}

function renderDeliveryQuestion() {
  const question = delivery.question;
  if (!question) return;
  const operationText = `${question.cores} dividido entre ${question.reactors}`;

  els.deliveryPackageCount.textContent = question.cores;
  els.deliveryDroneCount.textContent = question.reactors;
  els.deliveryPackagesLabel.textContent = `${question.cores} nucleos`;
  els.deliveryDronesLabel.textContent = `${question.reactors} reactores`;
  els.deliveryEachLabel.textContent = "?";
  els.deliveryPackages.setAttribute("aria-label", `Banco con ${question.cores} nucleos de energia`);
  els.deliveryDrones.setAttribute("aria-label", `${question.reactors} reactores vacios`);
  els.deliveryEqualLine.textContent = "Elige cuantos nucleos recibe cada reactor.";
  els.deliveryPackages.innerHTML = energyCoresMarkup(question.cores);
  els.deliveryDrones.innerHTML = energyReactorsMarkup(question.reactors);
  els.deliveryOptions.innerHTML = "";
  els.deliveryLayout.classList.remove("energy-success", "energy-error", "energy-distributing", "energy-imbalanced");

  makeDeliveryOptions(question.answer).forEach((option) => {
    const button = document.createElement("button");
    button.className = "delivery-option";
    button.type = "button";
    button.setAttribute("aria-label", `${operationText}: ${option} nucleos por reactor`);
    button.innerHTML = `<strong>${option}</strong><span>por reactor</span>`;
    button.addEventListener("click", () => validateDeliveryAnswer(button, option));
    els.deliveryOptions.appendChild(button);
  });
}

function energyCoresMarkup(count) {
  return Array.from({ length: count }, (_, index) => (
    `<span class="energy-core" style="--core-index:${index}" aria-hidden="true"><span></span></span>`
  )).join("");
}

function energyReactorsMarkup(count) {
  return Array.from({ length: count }, (_, index) => `
    <article class="energy-reactor waiting" data-reactor="${index}" data-load="0" aria-label="Reactor ${index + 1} con 0 nucleos">
      <div class="reactor-shell">
        <span class="reactor-ring"></span>
        <span class="reactor-window"></span>
        <span class="reactor-fill"></span>
      </div>
      <strong class="reactor-count">0</strong>
      <div class="reactor-core-tray"></div>
    </article>
  `).join("");
}

function makeDeliveryOptions(answer) {
  const options = new Set(generarOpciones(answer, 3).filter((option) => option > 0));
  while (options.size < 3) {
    const value = answer + (enteroAleatorio(-4, 4) || 1);
    options.add(Math.max(1, value));
  }
  return mezclarOpciones([...options]).slice(0, 3);
}

function validateDeliveryAnswer(button, option) {
  if (delivery.locked || !delivery.question) return;
  const correct = option === delivery.question.answer;
  delivery.locked = true;
  els.deliveryEachLabel.textContent = option;
  els.deliveryLayout.classList.add("energy-distributing");
  els.deliveryOptions.querySelectorAll(".delivery-option").forEach((item) => {
    item.disabled = true;
  });
  button.classList.add(correct ? "correct" : "wrong");

  animateEnergyDistribution(option, correct).then(() => {
    if (correct) {
      completeEnergyRound();
      return;
    }

    failEnergyRound();
  });
}

function completeEnergyRound() {
  delivery.combo += 1;
  delivery.score += 120 + delivery.combo * 30;
  delivery.stars = Math.min(3, Math.floor(delivery.score / 300));
  delivery.energy = Math.min(100, delivery.energy + 8);
  delivery.progress = Math.min(100, delivery.progress + 20);
  setDeliveryMessage(randomFrom(["Reactores estables", "Energia balanceada", "Central activada"]), "happy");
  els.deliveryLayout.classList.remove("energy-distributing");
  els.deliveryLayout.classList.add("energy-success");
  popDeliveryParticles("success");
  playSound("delivery-correct");

  if (delivery.progress >= 100 || delivery.round >= 6) {
    setTimeout(completeDeliveryLevel, 900);
    updateDeliveryHud();
    return;
  }

  delivery.round += 1;
  updateDeliveryHud();
  setTimeout(() => {
    els.deliveryLayout.classList.remove("energy-success");
    nextEnergyRound();
  }, 900);
}

function failEnergyRound() {
  delivery.combo = 0;
  delivery.lives -= 1;
  delivery.energy = Math.max(0, delivery.energy - 18);
  setDeliveryMessage("Aun no estan iguales. Prueba otra cantidad.", "sad");
  els.deliveryLayout.classList.remove("energy-distributing");
  els.deliveryLayout.classList.add("energy-error", "energy-imbalanced");
  popDeliveryParticles("error");
  playSound("delivery-wrong");
  updateDeliveryHud();

  if (delivery.lives <= 0) {
    state.lives = 0;
    setTimeout(defeat, 850);
    return;
  }

  setTimeout(() => {
    delivery.locked = false;
    els.deliveryLayout.classList.remove("energy-error", "energy-imbalanced");
    renderDeliveryQuestion();
    setDeliveryMessage("Mira los reactores: cada uno necesita la misma cantidad.", "thinking");
  }, 1100);
}

function makeEnergyDistribution(selected) {
  const { cores, reactors, answer } = delivery.question;
  const counts = Array.from({ length: reactors }, () => 0);

  if (selected === answer) {
    return counts.map(() => answer);
  }

  if (selected > answer) {
    let remaining = cores;
    for (let i = 0; i < reactors; i += 1) {
      const amount = Math.min(selected, remaining);
      counts[i] = amount;
      remaining -= amount;
    }
    return counts;
  }

  counts.fill(selected);
  let remaining = cores - selected * reactors;
  let index = 0;
  while (remaining > 0) {
    counts[index % reactors] += 1;
    remaining -= 1;
    index += 1;
  }
  return counts;
}

function animateEnergyDistribution(selected, correct) {
  return new Promise((resolve) => {
    const reactors = [...els.deliveryDrones.querySelectorAll(".energy-reactor")];
    const counts = makeEnergyDistribution(selected);
    const maxCount = Math.max(...counts);
    const speed = reduceEnergyMotion() ? 18 : 74;
    let step = 0;

    els.deliveryEqualLine.textContent = "Enviando nucleos a los reactores...";
    reactors.forEach((reactor) => {
      reactor.classList.remove("waiting", "active", "dim", "error");
      reactor.classList.add("receiving");
      reactor.querySelector(".reactor-core-tray").innerHTML = "";
      reactor.querySelector(".reactor-count").textContent = "0";
      reactor.querySelector(".reactor-fill").style.transform = "scaleY(0)";
      reactor.dataset.load = "0";
      reactor.setAttribute("aria-label", `Reactor ${Number(reactor.dataset.reactor) + 1} con 0 nucleos`);
    });

    function moveNext() {
      const round = Math.floor(step / reactors.length);
      const reactorIndex = step % reactors.length;
      const reactor = reactors[reactorIndex];

      if (round < maxCount && counts[reactorIndex] > round) {
        addCoreToReactor(reactor, counts[reactorIndex]);
      }

      step += 1;
      if (step < maxCount * reactors.length) {
        setTimeout(moveNext, speed);
        return;
      }

      finishDistributionVisual(counts, correct);
      setTimeout(resolve, reduceEnergyMotion() ? 80 : 360);
    }

    moveNext();
  });
}

function addCoreToReactor(reactor, targetCount) {
  const sourceCore = els.deliveryPackages.querySelector(".energy-core");
  if (sourceCore) {
    flyCoreToReactor(sourceCore, reactor);
    sourceCore.classList.add("core-out");
    setTimeout(() => sourceCore.remove(), reduceEnergyMotion() ? 20 : 150);
  }

  const tray = reactor.querySelector(".reactor-core-tray");
  const core = document.createElement("span");
  core.className = "received-core";
  core.innerHTML = "<span></span>";
  tray.appendChild(core);

  const count = tray.children.length;
  const fill = reactor.querySelector(".reactor-fill");
  const ratio = Math.min(1, count / Math.max(1, targetCount));
  fill.style.transform = `scaleY(${ratio})`;
  reactor.querySelector(".reactor-count").textContent = count;
  reactor.dataset.load = String(count);
  reactor.setAttribute("aria-label", `Reactor ${Number(reactor.dataset.reactor) + 1} con ${count} nucleos`);
  reactor.classList.add("receiving-pop");
  setTimeout(() => reactor.classList.remove("receiving-pop"), 170);
}

function flyCoreToReactor(sourceCore, reactor) {
  if (reduceEnergyMotion() || window.matchMedia?.("(max-width: 520px)").matches) return;
  const start = sourceCore.getBoundingClientRect();
  const target = reactor.querySelector(".reactor-window").getBoundingClientRect();
  const flying = document.createElement("span");
  flying.className = "flying-core";
  flying.innerHTML = "<span></span>";
  flying.style.width = `${start.width}px`;
  flying.style.height = `${start.height}px`;
  flying.style.transform = `translate3d(${start.left}px, ${start.top}px, 0)`;
  document.body.appendChild(flying);

  requestAnimationFrame(() => {
    const tx = target.left + target.width / 2 - start.left - start.width / 2;
    const ty = target.top + target.height / 2 - start.top - start.height / 2;
    flying.style.transform = `translate3d(${start.left + tx}px, ${start.top + ty}px, 0) scale(0.58)`;
    flying.style.opacity = "0.18";
  });

  setTimeout(() => flying.remove(), 360);
}

function finishDistributionVisual(counts, correct) {
  const reactors = [...els.deliveryDrones.querySelectorAll(".energy-reactor")];
  const line = counts.join(" + ");
  els.deliveryEqualLine.textContent = correct
    ? `${line} = ${delivery.question.cores}. Cada reactor recibe ${delivery.question.answer}.`
    : `${line} = ${delivery.question.cores}. Los reactores necesitan cantidades iguales.`;

  reactors.forEach((reactor, index) => {
    reactor.classList.remove("receiving");
    reactor.classList.add(correct ? "active" : "dim");
    if (!correct && counts[index] !== delivery.question.answer) {
      reactor.classList.add("error");
    }
  });
}

function completeDeliveryLevel() {
  delivery.active = false;
  state.lives = delivery.lives;
  state.score = delivery.score;
  completeLevel();
}

function updateDeliveryHud() {
  els.deliveryStarsText.textContent = `${delivery.stars}/3`;
  els.deliveryLivesText.textContent = "♥".repeat(Math.max(0, delivery.lives)) + "♡".repeat(Math.max(0, 3 - delivery.lives));
  els.deliveryEnergyText.textContent = `${delivery.energy}%`;
  els.deliveryComboText.textContent = `x${delivery.combo}`;
  els.deliveryProgressBar.style.width = `${delivery.progress}%`;
  actualizarHUD({
    nivel: "Central Energetica",
    puntos: delivery.score,
    estrellas: `${delivery.stars}/3`,
    vidas: delivery.lives,
    energia: delivery.energy,
    combo: delivery.combo,
    progreso: `${Math.min(100, delivery.progress)}%`,
    mostrarEnergia: true,
    onMenu: () => {
      delivery.active = false;
      renderLevels();
      showScreen("level");
    },
  });
}

function setDeliveryMessage(message, mood) {
  els.deliveryMessage.textContent = message;
  const robo = els.deliveryRobo?.querySelector(".robot-wrap");
  if (!robo) return;
  robo.classList.remove("happy", "thinking", "sad", "speaking");
  robo.classList.add(mood, "speaking");
  clearTimeout(robo.speakingTimer);
  robo.speakingTimer = setTimeout(() => robo.classList.remove("speaking"), 900);
}

function popDeliveryParticles(type) {
  if (reduceEnergyMotion() || window.matchMedia?.("(max-width: 700px)").matches) return;
  els.deliveryParticles.innerHTML = "";
  const count = type === "success" ? 8 : 3;
  for (let i = 0; i < count; i += 1) {
    const particle = document.createElement("span");
    particle.className = `delivery-particle ${type}`;
    particle.style.left = `${rand(16, 84)}%`;
    particle.style.top = `${rand(24, 76)}%`;
    particle.style.animationDelay = `${Math.random() * 0.16}s`;
    els.deliveryParticles.appendChild(particle);
  }
}
