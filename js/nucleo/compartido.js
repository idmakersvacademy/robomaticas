function completeLevel() {
  const level = levels[state.levelIndex];
  const stars = Math.max(1, state.lives);
  state.storage.stars[level.id] = Math.max(state.storage.stars[level.id] || 0, stars);
  state.storage.unlocked = Math.max(state.storage.unlocked, Math.min(level.id + 1, levels.length));
  saveProgress();

  els.victoryStars.textContent = "\u2605".repeat(stars) + "\u2606".repeat(3 - stars);
  els.victoryText.textContent = `${mensajeAleatorio("victoria")} ${level.title} completo ${state.score} puntos.`;
  els.nextLevelButton.style.display = level.id < levels.length ? "inline-block" : "none";
  fireConfetti();
  playSound("win");
  showScreen("victory");
  if (typeof animarCorrecto === "function") {
    animarCorrecto(els.victoryStars);
    animarEntradaElemento(document.querySelector(".result-card"), "rm-level-start");
  }
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
  actualizarHUD({
    nivel: level.title,
    puntos: state.score,
    vidas: state.lives,
    estrellas: `${state.storage.stars[level.id] || 0}/3`,
    combo: 0,
    progreso: level.task,
    mostrarCombo: false,
    onMenu: () => {
      renderLevels();
      showScreen("level");
    },
  });
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

const soundCache = {};
const soundVolume = {
  correct: 0.55,
  wrong: 0.45,
  win: 0.65,
  lose: 0.55,
  "clone-success": 0.55,
  "clone-error": 0.45,
  "factory-start": 0.5,
  "battle-start": 0.55,
  attack: 0.5,
  explosion: 0.55,
  "lab-unlock": 0.6,
  "delivery-correct": 0.55,
  "delivery-wrong": 0.45,
  "traffic-mode": 0.5,
  "galactic-table": 0.55,
};
const allowedSounds = new Set(Object.keys(soundVolume));
const soundLastPlayed = {};
const SOUND_COOLDOWN_MS = 70;
const soundFallbacks = {
  "delivery-correct": "correct",
  "delivery-wrong": "wrong",
  "traffic-mode": "battle-start",
  "galactic-table": "lab-unlock",
};

function playSound(name) {
  if (!allowedSounds.has(name) || typeof Audio === "undefined") return null;

  try {
    const fileName = soundFallbacks[name] || name;
    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    if (now - (soundLastPlayed[name] || 0) < SOUND_COOLDOWN_MS) return null;
    soundLastPlayed[name] = now;

    if (!soundCache[name]) {
      const audio = new Audio(`assets/sounds/${fileName}.mp3`);
      audio.preload = "auto";
      audio.volume = soundVolume[name] ?? 0.5;
      audio.addEventListener("error", () => {
        delete soundCache[name];
      }, { once: true });
      soundCache[name] = audio;
    }

    const sound = soundCache[name].cloneNode();
    sound.volume = soundVolume[name] ?? 0.5;
    sound.play().catch(() => {});
    return sound;
  } catch {
    return null;
  }
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
