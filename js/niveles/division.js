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
  setDeliveryMessage("Robo Delivery listo para repartir paquetes.", "happy");
  updateDeliveryHud();
  nextDeliveryRoute();
  showScreen("delivery");
}

function nextDeliveryRoute() {
  delivery.locked = false;
  delivery.question = createDeliveryQuestion();
  renderDeliveryQuestion();
  setDeliveryMessage(delivery.traffic ? "Trafico Robotico: entrega rapido!" : "Reparte todos los paquetes por igual.", "thinking");
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
  els.deliveryPackageCount.textContent = question.packages;
  els.deliveryDroneCount.textContent = question.drones;
  els.deliveryPackagesLabel.textContent = `${question.packages} paquetes`;
  els.deliveryDronesLabel.textContent = `${question.drones} drones`;
  els.deliveryEachLabel.textContent = "?";
  els.deliveryEqualLine.textContent = "Selecciona una respuesta para ver el reparto.";
  els.deliveryPackages.innerHTML = energyPackagesMarkup(question.packages);
  els.deliveryDrones.innerHTML = deliveryDronesMarkup(question.drones);
  els.deliveryOptions.innerHTML = "";
  els.deliveryLayout.classList.remove("delivery-success", "delivery-error", "delivery-distributing", "delivery-imbalanced");

  makeDeliveryOptions(question.answer).forEach((option) => {
    const button = document.createElement("button");
    button.className = "delivery-option";
    button.type = "button";
    button.innerHTML = `<strong>${option}</strong><span>por drone</span>`;
    button.addEventListener("click", () => validateDeliveryAnswer(button, option));
    els.deliveryOptions.appendChild(button);
  });
}

function energyPackagesMarkup(count) {
  return Array.from({ length: count }, (_, index) => (
    `<span class="energy-package" style="--delay:${index * 0.025}s">${energyPackageSvg()}</span>`
  )).join("");
}

function deliveryDronesMarkup(count) {
  return Array.from({ length: count }, (_, index) => `
    <article class="delivery-drone waiting" data-drone="${index}" style="--delay:${index * 0.06}s">
      ${deliveryDroneSvg(index)}
      <strong class="drone-count">0</strong>
      <div class="drone-bay"></div>
    </article>
  `).join("");
}

function deliveryDroneSvg(index = 0) {
  const accent = ["#55f6ff", "#8f68ff", "#7effa7"][index % 3];
  return `
    <svg class="drone-svg" viewBox="0 0 150 112" aria-hidden="true">
      <defs>
        <linearGradient id="droneBody${index}" x1="22" y1="14" x2="124" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#ffffff"/>
          <stop offset="0.38" stop-color="${accent}"/>
          <stop offset="1" stop-color="#2a55ff"/>
        </linearGradient>
        <radialGradient id="droneGlow${index}" cx="50%" cy="45%" r="58%">
          <stop offset="0" stop-color="#ffffff" stop-opacity="0.62"/>
          <stop offset="0.45" stop-color="${accent}" stop-opacity="0.36"/>
          <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
        </radialGradient>
        <filter id="droneShadow${index}" x="-30%" y="-40%" width="160%" height="190%">
          <feDropShadow dx="0" dy="9" stdDeviation="8" flood-color="${accent}" flood-opacity="0.38"/>
        </filter>
      </defs>
      <ellipse class="drone-shadow" cx="75" cy="104" rx="42" ry="8"/>
      <g class="drone-prop left"><ellipse cx="25" cy="32" rx="24" ry="8"/><circle cx="25" cy="32" r="9"/></g>
      <g class="drone-prop right"><ellipse cx="125" cy="32" rx="24" ry="8"/><circle cx="125" cy="32" r="9"/></g>
      <path class="drone-antenna" d="M75 22 C78 9 88 7 93 15"/>
      <circle class="drone-light" cx="94" cy="15" r="6"/>
      <rect class="drone-body" x="39" y="24" width="72" height="58" rx="25" fill="url(#droneBody${index})" filter="url(#droneShadow${index})"/>
      <ellipse class="drone-glow" cx="75" cy="52" rx="48" ry="36" fill="url(#droneGlow${index})"/>
      <circle class="drone-eye-svg eye-left" cx="64" cy="50" r="7"/>
      <circle class="drone-eye-svg eye-right" cx="86" cy="50" r="7"/>
      <path class="drone-mouth happy-mouth" d="M64 64 Q75 74 86 64"/>
      <path class="drone-mouth sad-mouth" d="M64 70 Q75 60 86 70"/>
      <path class="drone-mouth error-mouth" d="M66 67 L84 67"/>
      <rect class="drone-cargo-slot" x="57" y="78" width="36" height="10" rx="5"/>
      <path class="drone-jet left" d="M55 86 C49 96 53 103 60 108 C66 101 65 94 60 86"/>
      <path class="drone-jet right" d="M90 86 C84 96 88 103 95 108 C101 101 100 94 95 86"/>
    </svg>
  `;
}

function energyPackageSvg() {
  return `
    <svg class="package-svg" viewBox="0 0 74 58" aria-hidden="true">
      <defs>
        <linearGradient id="packageFace" x1="9" y1="7" x2="64" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#dfffff"/>
          <stop offset="0.45" stop-color="#55f6ff"/>
          <stop offset="1" stop-color="#236cff"/>
        </linearGradient>
        <filter id="packageGlow" x="-35%" y="-50%" width="170%" height="210%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#55f6ff" flood-opacity="0.48"/>
        </filter>
      </defs>
      <path class="package-shadow" d="M15 50 C25 57 50 57 60 50 C48 46 27 46 15 50Z"/>
      <path class="package-body" d="M12 15 L31 6 H60 L67 17 L59 45 L37 53 L12 44 Z" filter="url(#packageGlow)"/>
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
  setDeliveryMessage(randomFrom(["ENTREGA PERFECTA", "COMBO PERFECTO", "SUPER ENTREGA"]), "happy");
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
  drone.classList.add("receiving-pop");
  setTimeout(() => drone.classList.remove("receiving-pop"), 180);
}

function flyPackageToDrone(sourcePackage, drone) {
  const start = sourcePackage.getBoundingClientRect();
  const target = drone.querySelector(".drone-bay").getBoundingClientRect();
  const flying = document.createElement("span");
  flying.className = "flying-package";
  flying.innerHTML = energyPackageSvg();
  flying.style.left = `${start.left}px`;
  flying.style.top = `${start.top}px`;
  flying.style.width = `${start.width}px`;
  flying.style.height = `${start.height}px`;
  document.body.appendChild(flying);

  requestAnimationFrame(() => {
    const tx = target.left + target.width / 2 - start.left - start.width / 2;
    const ty = target.top + target.height / 2 - start.top - start.height / 2;
    flying.style.transform = `translate(${tx}px, ${ty}px) scale(0.48) rotate(18deg)`;
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
  setDeliveryMessage(delivery.traffic ? "Trafico Robotico activado!" : "Ruta normal activada.", "happy");
  playSound("traffic-mode");
}

function popDeliveryParticles(type) {
  els.deliveryParticles.innerHTML = "";
  const count = type === "success" ? 34 : 18;
  for (let i = 0; i < count; i += 1) {
    const particle = document.createElement("span");
    particle.className = `delivery-particle ${type}`;
    particle.style.left = `${rand(8, 92)}%`;
    particle.style.top = `${rand(18, 84)}%`;
    particle.style.animationDelay = `${Math.random() * 0.25}s`;
    els.deliveryParticles.appendChild(particle);
  }
}
