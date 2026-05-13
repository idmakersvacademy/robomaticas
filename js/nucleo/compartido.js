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
