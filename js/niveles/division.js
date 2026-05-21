const deliveryDroneCounts = [2, 3, 4, 5, 6];

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
  delivery.traffic = false;
  delivery.locked = false;
  delivery.question = null;
  els.deliveryLayout?.classList.remove("traffic-mode", "delivery-success", "delivery-error", "delivery-distributing", "delivery-imbalanced");
  els.trafficModeButton?.classList.remove("active");
  setDeliveryMessage("Central Delivery listo para repartir paquetes.", "happy");
  updateDeliveryHud();
  nextDeliveryRoute();
  showScreen("delivery");
}

function nextDeliveryRoute() {
  delivery.locked = false;
  delivery.question = createDeliveryQuestion();
  renderDeliveryQuestion();
  setDeliveryMessage(delivery.traffic ? "Ruta rápida: entrega en modo turbo." : "Reparte todos los paquetes por igual.", "thinking");
}

function createDeliveryQuestion() {
  const level = levels[state.levelIndex];
  const maxEach = Math.min(10, 3 + level.id);
  const drones = randomFrom(deliveryDroneCounts);
  const answer = rand(2, maxEach);
  return {
    packages: drones * answer,
    drones,
    answer,
  };
}

function renderDeliveryQuestion() {
  const question = delivery.question;
  if (!question) return;
  const operationText = `${question.packages} dividido entre ${question.drones}`;
  els.deliveryPackageCount.textContent = question.packages;
  els.deliveryDroneCount.textContent = question.drones;
  els.deliveryPackagesLabel.textContent = `${question.packages} paquetes`;
  els.deliveryDronesLabel.textContent = `${question.drones} drones`;
  els.deliveryEachLabel.textContent = "?";
  els.deliveryPackages.setAttribute("aria-label", `Bodega con ${question.packages} paquetes`);
  els.deliveryDrones.setAttribute("aria-label", `${question.drones} drones esperando paquetes`);
  els.deliveryEqualLine.textContent = "Selecciona una respuesta para ver el reparto.";
  els.deliveryPackages.innerHTML = energyPackagesMarkup(question.packages);
  els.deliveryDrones.innerHTML = deliveryDronesMarkup(question.drones);
  els.deliveryOptions.innerHTML = "";
  els.deliveryLayout.classList.remove("delivery-success", "delivery-error", "delivery-distributing", "delivery-imbalanced");

  makeDeliveryOptions(question.answer).forEach((option) => {
    const button = document.createElement("button");
    button.className = "delivery-option";
    button.type = "button";
    button.setAttribute("aria-label", `${operationText}: ${option} paquetes por drone`);
    button.innerHTML = `<strong>${option}</strong><span>por drone</span>`;
    button.addEventListener("click", () => validateDeliveryAnswer(button, option));
    els.deliveryOptions.appendChild(button);
  });
}

function energyPackagesMarkup(count) {
  return Array.from({ length: count }, (_, index) => (
    `<span class="energy-package" style="--delay:${index * 0.018}s">${energyPackageSvg()}</span>`
  )).join("");
}

function deliveryDronesMarkup(count) {
  return Array.from({ length: count }, (_, index) => `
    <article class="delivery-drone waiting" data-drone="${index}" data-load="0" aria-label="Drone ${index + 1} con 0 paquetes" style="--delay:${index * 0.05}s">
      ${deliveryDroneSvg(index)}
      <strong class="drone-count">0</strong>
      <div class="drone-bay"></div>
    </article>
  `).join("");
}

function deliveryDroneSvg(index = 0) {
  const accent = ["#55f6ff", "#7effa7", "#ffdf55"][index % 3];
  return `
    <svg class="drone-svg" viewBox="0 0 160 128" aria-hidden="true">
      <defs>
        <linearGradient id="deliveryBotBody${index}" x1="42" y1="24" x2="118" y2="106" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#f8fcff"/>
          <stop offset="0.45" stop-color="${accent}"/>
          <stop offset="1" stop-color="#2767ff"/>
        </linearGradient>
      </defs>
      <ellipse class="drone-shadow" cx="80" cy="118" rx="50" ry="8"/>
      <path class="drone-antenna" d="M80 30 C84 16 96 15 102 25"/>
      <circle class="drone-light" cx="103" cy="25" r="5"/>
      <g class="drone-wing left">
        <rect x="18" y="50" width="32" height="12" rx="6"/>
        <circle cx="24" cy="56" r="12"/>
        <path class="drone-propeller" d="M6 56 C16 48 32 48 42 56 C32 64 16 64 6 56Z"/>
      </g>
      <g class="drone-wing right">
        <rect x="110" y="50" width="32" height="12" rx="6"/>
        <circle cx="136" cy="56" r="12"/>
        <path class="drone-propeller" d="M118 56 C128 48 144 48 154 56 C144 64 128 64 118 56Z"/>
      </g>
      <rect class="drone-body" x="45" y="28" width="70" height="68" rx="24" fill="url(#deliveryBotBody${index})"/>
      <rect class="drone-screen" x="58" y="44" width="44" height="30" rx="13"/>
      <circle class="drone-eye-svg eye-left" cx="70" cy="58" r="5"/>
      <circle class="drone-eye-svg eye-right" cx="90" cy="58" r="5"/>
      <path class="drone-mouth happy-mouth" d="M70 68 Q80 75 90 68"/>
      <path class="drone-mouth sad-mouth" d="M70 72 Q80 66 90 72"/>
      <path class="drone-mouth error-mouth" d="M70 70 L90 70"/>
      <rect class="drone-cargo-slot" x="58" y="82" width="44" height="12" rx="6"/>
      <path class="drone-arm left" d="M50 82 C36 86 32 94 35 103"/>
      <path class="drone-arm right" d="M110 82 C124 86 128 94 125 103"/>
      <path class="drone-jet left" d="M58 98 C52 108 56 116 64 121 C70 113 68 105 64 98"/>
      <path class="drone-jet right" d="M96 98 C90 108 94 116 102 121 C108 113 106 105 102 98"/>
    </svg>
  `;
}

function energyPackageSvg() {
  return `
    <svg class="package-svg" viewBox="0 0 74 58" aria-hidden="true">
      <path class="package-shadow" d="M15 50 C25 57 50 57 60 50 C48 46 27 46 15 50Z"/>
      <path class="package-body" d="M12 15 L31 6 H60 L67 17 L59 45 L37 53 L12 44 Z"/>
      <path class="package-top" d="M12 15 L31 6 H60 L44 16 Z"/>
      <path class="package-side" d="M44 16 L67 17 L59 45 L37 53 Z"/>
      <path class="package-ribbon" d="M34 9 L44 16 L37 53 L28 49 L35 18 Z"/>
      <circle class="package-spark" cx="24" cy="22" r="4"/>
      <path class="package-line" d="M18 36 H31"/>
    </svg>
  `;
}

function makeDeliveryOptions(answer) {
  const options = new Set([answer]);
  while (options.size < 3) {
    const offset = rand(-3, 3) || 2;
    options.add(Math.max(1, answer + offset));
  }
  return shuffle([...options]);
}

function validateDeliveryAnswer(button, option) {
  if (delivery.locked || !delivery.question) return;
  const correct = option === delivery.question.answer;
  delivery.locked = true;
  els.deliveryEachLabel.textContent = option;
  els.deliveryLayout.classList.add("delivery-distributing");
  els.deliveryOptions.querySelectorAll(".delivery-option").forEach((item) => {
    item.disabled = true;
  });
  button.classList.add(correct ? "correct" : "wrong");

  animateDeliveryDistribution(option, correct).then(() => {
    if (correct) {
      completeDeliveryRoute();
      return;
    }

    failDeliveryRoute();
  });
}

function completeDeliveryRoute() {
  delivery.combo += 1;
  delivery.score += 120 + delivery.combo * 30;
  delivery.stars = Math.min(3, Math.floor(delivery.score / 300));
  delivery.energy = Math.min(100, delivery.energy + 8);
  delivery.progress = Math.min(100, delivery.progress + (delivery.traffic ? 26 : 20));
  setDeliveryMessage(randomFrom(["Entrega perfecta", "Reparto exacto", "Ruta completada"]), "happy");
  els.deliveryLayout.classList.remove("delivery-distributing");
  els.deliveryLayout.classList.add("delivery-success");
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
    els.deliveryLayout.classList.remove("delivery-success");
    nextDeliveryRoute();
  }, 900);
}

function failDeliveryRoute() {
  delivery.combo = 0;
  delivery.lives -= 1;
  delivery.energy = Math.max(0, delivery.energy - 18);
  setDeliveryMessage("NO QUEDARON IGUALES", "sad");
  els.deliveryLayout.classList.remove("delivery-distributing");
  els.deliveryLayout.classList.add("delivery-error", "delivery-imbalanced");
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
    els.deliveryLayout.classList.remove("delivery-error", "delivery-imbalanced");
    renderDeliveryQuestion();
    setDeliveryMessage("Intenta otra vez: todos deben recibir la misma cantidad.", "thinking");
  }, 1100);
}

function makeDeliveryDistribution(selected) {
  const { packages, drones, answer } = delivery.question;
  const counts = Array.from({ length: drones }, () => 0);

  if (selected === answer) {
    return counts.map(() => answer);
  }

  if (selected > answer) {
    let remaining = packages;
    for (let i = 0; i < drones; i += 1) {
      const amount = Math.min(selected, remaining);
      counts[i] = amount;
      remaining -= amount;
    }
    return counts;
  }

  counts.fill(selected);
  let remaining = packages - selected * drones;
  let index = 0;
  while (remaining > 0) {
    counts[index % drones] += 1;
    remaining -= 1;
    index += 1;
  }
  return counts;
}

function animateDeliveryDistribution(selected, correct) {
  return new Promise((resolve) => {
    const drones = [...els.deliveryDrones.querySelectorAll(".delivery-drone")];
    const counts = makeDeliveryDistribution(selected);
    const maxCount = Math.max(...counts);
    const speed = delivery.traffic ? 58 : 82;
    let step = 0;

    els.deliveryEqualLine.textContent = "Repartiendo paquetes uno por uno...";
    drones.forEach((drone) => {
      drone.classList.remove("waiting", "happy", "sad", "error");
      drone.classList.add("receiving");
      drone.querySelector(".drone-bay").innerHTML = "";
      drone.querySelector(".drone-count").textContent = "0";
      drone.dataset.load = "0";
      drone.setAttribute("aria-label", `Drone ${Number(drone.dataset.drone) + 1} con 0 paquetes`);
    });

    function moveNext() {
      let moved = false;
      const round = Math.floor(step / drones.length);
      const droneIndex = step % drones.length;
      const drone = drones[droneIndex];

      if (round < maxCount && counts[droneIndex] > round) {
        addPackageToDrone(drone);
        moved = true;
      }

      step += 1;
      if (step < maxCount * drones.length) {
        setTimeout(moveNext, moved ? speed : 18);
        return;
      }

      finishDistributionVisual(counts, correct);
      setTimeout(resolve, 420);
    }

    moveNext();
  });
}

function addPackageToDrone(drone) {
  const sourcePackage = els.deliveryPackages.querySelector(".energy-package");
  if (sourcePackage) {
    flyPackageToDrone(sourcePackage, drone);
    sourcePackage.classList.add("package-out");
    setTimeout(() => sourcePackage.remove(), 150);
  }

  const bay = drone.querySelector(".drone-bay");
  const pack = document.createElement("span");
  pack.className = "received-package";
  pack.innerHTML = energyPackageSvg();
  bay.appendChild(pack);
  const count = bay.children.length;
  drone.querySelector(".drone-count").textContent = count;
  drone.dataset.load = String(count);
  drone.setAttribute("aria-label", `Drone ${Number(drone.dataset.drone) + 1} con ${count} paquetes`);
  drone.classList.add("receiving-pop");
  setTimeout(() => drone.classList.remove("receiving-pop"), 180);
}

function flyPackageToDrone(sourcePackage, drone) {
  if (window.matchMedia?.("(prefers-reduced-motion: reduce), (max-width: 520px)").matches) return;
  const start = sourcePackage.getBoundingClientRect();
  const target = drone.querySelector(".drone-bay").getBoundingClientRect();
  const flying = document.createElement("span");
  flying.className = "flying-package";
  flying.innerHTML = energyPackageSvg();
  flying.style.width = `${start.width}px`;
  flying.style.height = `${start.height}px`;
  flying.style.transform = `translate3d(${start.left}px, ${start.top}px, 0)`;
  document.body.appendChild(flying);

  requestAnimationFrame(() => {
    const tx = target.left + target.width / 2 - start.left - start.width / 2;
    const ty = target.top + target.height / 2 - start.top - start.height / 2;
    flying.style.transform = `translate3d(${start.left + tx}px, ${start.top + ty}px, 0) scale(0.48) rotate(18deg)`;
    flying.style.opacity = "0.15";
  });

  setTimeout(() => flying.remove(), 420);
}

function finishDistributionVisual(counts, correct) {
  const drones = [...els.deliveryDrones.querySelectorAll(".delivery-drone")];
  const line = counts.join(" + ");
  els.deliveryEqualLine.textContent = correct
    ? `${line} = ${delivery.question.packages}. Cada drone recibe ${delivery.question.answer}.`
    : `${line} = ${delivery.question.packages}. No todos recibieron igual.`;
  drones.forEach((drone, index) => {
    drone.classList.remove("receiving");
    drone.classList.add(correct ? "happy" : "sad");
    if (!correct && counts[index] !== delivery.question.answer) {
      drone.classList.add("error");
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

function toggleTrafficMode() {
  delivery.traffic = !delivery.traffic;
  els.deliveryLayout?.classList.toggle("traffic-mode", delivery.traffic);
  els.trafficModeButton?.classList.toggle("active", delivery.traffic);
  setDeliveryMessage(delivery.traffic ? "Ruta rápida activada." : "Ruta normal activada.", "happy");
  playSound("traffic-mode");
}

function popDeliveryParticles(type) {
  if (window.matchMedia?.("(prefers-reduced-motion: reduce), (max-width: 700px)").matches) return;
  els.deliveryParticles.innerHTML = "";
  const count = type === "success" ? 14 : 6;
  for (let i = 0; i < count; i += 1) {
    const particle = document.createElement("span");
    particle.className = `delivery-particle ${type}`;
    particle.style.left = `${rand(8, 92)}%`;
    particle.style.top = `${rand(18, 84)}%`;
    particle.style.animationDelay = `${Math.random() * 0.25}s`;
    els.deliveryParticles.appendChild(particle);
  }
}
