function handleKey(event) {
  const key = event.key.toLowerCase();
  const moves = {
    arrowup: [0, -1],
    w: [0, -1],
    arrowdown: [0, 1],
    s: [0, 1],
    arrowleft: [-1, 0],
    a: [-1, 0],
    arrowright: [1, 0],
    d: [1, 0],
  };

  if (!moves[key]) return;
  event.preventDefault();
  move(...moves[key]);
}

els.playButton.addEventListener("click", () => {
  const nextIndex = Math.max(0, Math.min(state.storage.unlocked - 1, levels.length - 1));
  showConcept(nextIndex);
});

els.levelsButton.addEventListener("click", () => {
  renderLevels();
  showScreen("level");
});

els.battleExitButton.addEventListener("click", () => {
  abrirModalMenu(() => {
    battle.active = false;
    renderLevels();
    showScreen("level");
  });
});

els.factoryStartButton.addEventListener("click", beginFactoryRun);
els.labHelpButton.addEventListener("click", () => {
  els.cloneGroups.classList.toggle("help");
});
els.factoryExitButton.addEventListener("click", () => {
  abrirModalMenu(() => {
    factory.active = false;
    renderLevels();
    showScreen("level");
  });
});
els.deliveryExitButton.addEventListener("click", () => {
  abrirModalMenu(() => {
    delivery.active = false;
    renderLevels();
    showScreen("level");
  });
});

els.startAdventureButton.addEventListener("click", () => startLevel(state.levelIndex));
els.conceptMenuButton.addEventListener("click", () => {
  abrirModalMenu(() => {
    renderLevels();
    showScreen("level");
  });
});
els.backStartButton.addEventListener("click", () => showScreen("start"));
els.victoryLevelsButton.addEventListener("click", () => {
  abrirModalMenu(() => {
    renderLevels();
    showScreen("level");
  });
});
els.defeatLevelsButton.addEventListener("click", () => {
  abrirModalMenu(() => {
    renderLevels();
    showScreen("level");
  });
});
els.retryButton.addEventListener("click", () => startLevel(state.levelIndex));
els.nextLevelButton.addEventListener("click", () => {
  showConcept(Math.min(state.levelIndex + 1, levels.length - 1));
});
els.mobileControls.forEach((button) => {
  button.addEventListener("click", () => {
    const moves = {
      up: [0, -1],
      down: [0, 1],
      left: [-1, 0],
      right: [1, 0],
    };
    move(...moves[button.dataset.move]);
  });
});

document.addEventListener("keydown", handleKey);
updateHomeProgress();
renderLevels();
