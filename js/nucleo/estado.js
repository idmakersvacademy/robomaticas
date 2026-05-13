function loadProgress() {
  const fallback = { unlocked: 3, stars: {} };
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved?.unlocked ? { ...saved, unlocked: Math.max(saved.unlocked, 3) } : fallback;
  } catch {
    return fallback;
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.storage));
}

const state = {
  screen: "start",
  levelIndex: 0,
  player: { x: 1, y: 1 },
  lives: 3,
  score: 0,
  map: [],
  pending: null,
  question: null,
  storage: loadProgress(),
};

const battle = {
  active: false,
  round: 1,
  enemyIndex: 0,
  enemyHp: 100,
  enemyMaxHp: 100,
  roboHp: 100,
  lives: 3,
  score: 0,
  combo: 0,
  question: null,
  locked: false,
};

const battleEnemies = [
  { name: "Chispa Digital", className: "virus", hp: 70, damage: 22 },
  { name: "Gota Electrica", className: "slime", hp: 90, damage: 24 },
  { name: "Dron Calculador", className: "drone", hp: 115, damage: 26 },
  { name: "Cubo Travieso", className: "cube", hp: 145, damage: 28 },
];

const factoryMachines = [
  { name: "Semilla estelar", activity: "Abre portales y cuenta las criaturas.", verb: "desperto vida en" },
  { name: "Bosque neon", activity: "Cada portal crea el mismo grupo de criaturas.", verb: "hizo crecer" },
  { name: "Ciudad luminosa", activity: "Multiplica grupos para construir nuevas zonas.", verb: "construyo" },
  { name: "Orbitas vivas", activity: "Cuenta el total para activar las luces del planeta.", verb: "ilumino" },
  { name: "Planeta Clonix", activity: "Completa la multiplicacion y evoluciona el planeta.", verb: "evoluciono" },
];

const additionMachines = [
  { name: "Recarga el nucleo", activity: "Cuenta las energias y selecciona la respuesta correcta.", verb: "recargo" },
  { name: "Activa la consola", activity: "Suma las baterias y toca la capsula correcta.", verb: "activo" },
  { name: "Llena el reactor", activity: "Cuenta la energia total para ayudar a Robo.", verb: "cargo" },
  { name: "Conecta la antena", activity: "Encuentra cuanta energia hay en total.", verb: "conecto" },
  { name: "Enciende el portal", activity: "Elige la respuesta correcta para abrir el portal.", verb: "encendio" },
];

const factory = {
  active: false,
  started: false,
  machineIndex: 0,
  score: 0,
  combo: 0,
  progress: 0,
  question: null,
  locked: false,
  medals: 0,
  lives: 3,
};

const els = {
  screens: document.querySelectorAll(".screen"),
  playButton: document.querySelector("#playButton"),
  levelsButton: document.querySelector("#levelsButton"),
  startAdventureButton: document.querySelector("#startAdventureButton"),
  backStartButton: document.querySelector("#backStartButton"),
  levelGrid: document.querySelector("#levelGrid"),
  conceptEyebrow: document.querySelector("#conceptEyebrow"),
  conceptTitle: document.querySelector("#conceptTitle"),
  conceptIntro: document.querySelector("#conceptIntro"),
  conceptDemo: document.querySelector("#conceptDemo"),
  conceptNote: document.querySelector("#conceptNote"),
  levelLabel: document.querySelector("#levelLabel"),
  levelTitle: document.querySelector("#levelTitle"),
  scoreText: document.querySelector("#scoreText"),
  livesText: document.querySelector("#livesText"),
  roboDialog: document.querySelector("#roboDialog"),
  guideRobo: document.querySelector("#guideRobo"),
  world: document.querySelector("#world"),
  mapTaskText: document.querySelector("#mapTaskText"),
  questionModal: document.querySelector("#questionModal"),
  questionReason: document.querySelector("#questionReason"),
  operationText: document.querySelector("#operationText"),
  options: document.querySelector("#options"),
  questionFeedback: document.querySelector("#questionFeedback"),
  victoryStars: document.querySelector("#victoryStars"),
  victoryText: document.querySelector("#victoryText"),
  nextLevelButton: document.querySelector("#nextLevelButton"),
  victoryLevelsButton: document.querySelector("#victoryLevelsButton"),
  retryButton: document.querySelector("#retryButton"),
  defeatLevelsButton: document.querySelector("#defeatLevelsButton"),
  confetti: document.querySelector("#confetti"),
  mobileControls: document.querySelectorAll("[data-move]"),
  battleArena: document.querySelector("#battleArena"),
  battleScoreText: document.querySelector("#battleScoreText"),
  battleComboText: document.querySelector("#battleComboText"),
  enemyProgressText: document.querySelector("#enemyProgressText"),
  battleLivesText: document.querySelector("#battleLivesText"),
  roboHpBar: document.querySelector("#roboHpBar"),
  battleMessage: document.querySelector("#battleMessage"),
  enemyCountdownText: document.querySelector("#enemyCountdownText"),
  laserLane: document.querySelector("#laserLane"),
  battleOperation: document.querySelector("#battleOperation"),
  battleOptions: document.querySelector("#battleOptions"),
  enemyRoundText: document.querySelector("#enemyRoundText"),
  enemyNameText: document.querySelector("#enemyNameText"),
  enemyHpText: document.querySelector("#enemyHpText"),
  enemyHpBar: document.querySelector("#enemyHpBar"),
  battleEnemy: document.querySelector("#battleEnemy"),
  battleRobo: document.querySelector("#battleRobo"),
  battleParticles: document.querySelector("#battleParticles"),
  battleExitButton: document.querySelector("#battleExitButton"),
  factoryLayout: document.querySelector("#factoryLayout"),
  factoryScreen: document.querySelector("#factoryScreen"),
  factoryScoreText: document.querySelector("#factoryScoreText"),
  factoryComboText: document.querySelector("#factoryComboText"),
  factoryMachineText: document.querySelector("#factoryMachineText"),
  factoryEyebrow: document.querySelector(".factory-topbar .eyebrow"),
  factoryTitle: document.querySelector(".factory-topbar h2"),
  factoryMoodText: document.querySelector("#factoryMoodText"),
  factoryRobo: document.querySelector("#factoryRobo"),
  factoryMedals: document.querySelector("#factoryMedals"),
  machineStage: document.querySelector("#machineStage"),
  factoryMessage: document.querySelector("#factoryMessage"),
  factoryProgressBar: document.querySelector("#factoryProgressBar"),
  cloneRoundBrief: document.querySelector("#cloneRoundBrief"),
  cloneEquation: document.querySelector("#cloneEquation"),
  cloneGroups: document.querySelector("#cloneGroups"),
  factoryOptions: document.querySelector("#factoryOptions"),
  factoryStartButton: document.querySelector("#factoryStartButton"),
  labHelpButton: document.querySelector("#labHelpButton"),
  factoryExitButton: document.querySelector("#factoryExitButton"),
  factoryParticles: document.querySelector("#factoryParticles"),
};
