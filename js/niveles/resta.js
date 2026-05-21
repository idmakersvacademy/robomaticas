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
