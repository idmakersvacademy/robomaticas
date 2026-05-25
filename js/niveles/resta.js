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
  reiniciarOperacionesNivel("resta");
  setupBattleEnemy();
  setBattleRoboMood("happy");
  updateBattleHud();
  setBattleMessage("Robo entró a Operacion Resta. Resuelve restas para lanzar ataques brillantes.");
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
  if (typeof animarCambioPregunta === "function") animarCambioPregunta(".operation-card");

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
  const question = generarOperacionSinRepetir("resta", () => generarResta(Math.min(3, battle.round)));
  return {
    text: `${question.texto} = ?`,
    answer: question.respuesta,
    options: generarOpciones(question.respuesta, 4),
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
    if (typeof animarCorrecto === "function") animarCorrecto(button);
    battleCorrect();
    return;
  }

  button.classList.add("wrong");
  if (typeof animarIncorrecto === "function") animarIncorrecto(button);
  battleWrong();
}

function battleCorrect() {
  const damage = 28 + Math.min(35, battle.combo * 5);
  battle.combo += 1;
  battle.score += 90 + battle.combo * 20;
  battle.enemyHp = Math.max(0, battle.enemyHp - damage);

  setBattleMessage(`${mensajeAleatorio("correcto")} Combo x${battle.combo}.`);
  playSound("attack");
  setBattleRoboMood("atacando");
  els.battleRobo.classList.add("attacking");
  animateLaser();
  popParticles("hit");
  daniarEnemigoVisual(els.battleEnemy, battle.enemyHp <= 0);
  setTimeout(() => {
    els.battleRobo.classList.remove("attacking");
    setBattleRoboMood("happy");
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

  setBattleMessage(mensajeAleatorio("incorrecto"));
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
    setBattleRoboMood(battle.lives > 0 ? "herido" : "derrotado");
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
  els.battleEnemy.classList.add("defeated");
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
  actualizarHUD({
    nivel: "Operacion Resta",
    puntos: battle.score,
    estrellas: `${state.storage.stars[levels[state.levelIndex].id] || 0}/3`,
    vidas: battle.lives,
    combo: battle.combo,
    progreso: `${battle.enemyIndex + 1}/${battleEnemies.length}`,
    onMenu: () => {
      battle.active = false;
      renderLevels();
      showScreen("level");
    },
  });
}

function setBattleRoboMood(mood) {
  const robo = els.battleRobo.querySelector(".robot-wrap");
  if (!robo) return;
  const moodClass = {
    normal: "happy",
    feliz: "happy",
    concentrado: "thinking",
    atacando: "happy",
    enojado: "sad",
    herido: "sad",
    derrotado: "sad",
    celebrando: "celebrating",
  }[mood] || mood;
  robo.classList.remove("happy", "thinking", "sad", "speaking", "celebrating");
  robo.classList.add(moodClass, "speaking");
  if (typeof cambiarEstadoRobo === "function") cambiarEstadoRobo(mood, robo);
  clearTimeout(robo.moodTimer);
  robo.moodTimer = setTimeout(() => {
    if (moodClass !== "thinking") {
      robo.classList.remove("speaking", "celebrating");
      robo.classList.add("thinking");
      if (typeof cambiarEstadoRobo === "function") cambiarEstadoRobo("concentrado", robo);
    }
  }, 850);
}

function daniarEnemigoVisual(enemigo, derrotado = false) {
  if (!enemigo) return;
  enemigo.classList.remove("hit", "enemy-damage", "defeated");
  void enemigo.offsetWidth;
  enemigo.classList.add("hit", "enemy-damage");
  setTimeout(() => enemigo.classList.remove("hit", "enemy-damage"), 700);
  if (derrotado) {
    setTimeout(() => enemigo.classList.add("defeated"), 420);
  }
}

function setBattleMessage(message) {
  els.battleMessage.textContent = message;
  els.battleMessage.classList.remove("pulse");
  requestAnimationFrame(() => els.battleMessage.classList.add("pulse"));
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
