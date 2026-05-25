function animarEntradaElemento(elemento, clase = "rm-enter") {
  if (!elemento) return;
  elemento.classList.remove(clase);
  void elemento.offsetWidth;
  elemento.classList.add(clase);
}

function animarCorrecto(elemento) {
  if (!elemento) return;
  elemento.classList.remove("rm-correct");
  void elemento.offsetWidth;
  elemento.classList.add("rm-correct");
}

function animarIncorrecto(elemento) {
  if (!elemento) return;
  elemento.classList.remove("rm-wrong");
  void elemento.offsetWidth;
  elemento.classList.add("rm-wrong");
}

function animarPerderVida() {
  animarIncorrecto(document.querySelector("#hudVidas"));
}

function animarGanarEstrella() {
  animarCorrecto(document.querySelector("#hudEstrellas"));
}

function animarCombo() {
  animarCorrecto(document.querySelector("#hudCombo"));
}

function animarCambioPregunta(selector = ".operation-card, .cloneEquation, .delivery-question, .question-box, .table-play-card") {
  const panel = document.querySelector(selector);
  if (panel) animarEntradaElemento(panel, "rm-question-pop");
}

function animarInicioNivel(screen) {
  animarEntradaElemento(screen || document.querySelector(".screen.active"), "rm-level-start");
  animarEntradaElemento(document.querySelector(".rm-hud"), "rm-enter");
}

function cambiarPantallaConTransicion(callback) {
  document.body.classList.add("rm-transition-out");

  setTimeout(() => {
    if (typeof callback === "function") callback();
    document.body.classList.remove("rm-transition-out");
    document.body.classList.add("rm-transition-in");

    setTimeout(() => {
      document.body.classList.remove("rm-transition-in");
    }, 350);
  }, 250);
}

function mensajeAleatorio(tipo) {
  const mensajes = {
    correcto: [
      "¡Excelente! Robo cargo energia.",
      "¡Buen calculo! Sistema estable.",
      "¡Perfecto! La mision avanza.",
    ],
    incorrecto: [
      "Casi, revisemos otra vez.",
      "No pasa nada, intentemos con calma.",
      "Robo detecto un error, probemos de nuevo.",
    ],
    victoria: [
      "¡Mision completada!",
      "¡Nivel superado con exito!",
      "¡RoboMaticas esta listo para el siguiente reto!",
    ],
  };

  const lista = mensajes[tipo] || mensajes.correcto;
  return lista[Math.floor(Math.random() * lista.length)];
}

function cambiarEstadoRobo(estado, objetivo = null) {
  const robo = objetivo?.querySelector?.(".robot-wrap") || objetivo || document.querySelector(".robot-wrap");
  if (!robo) return;

  const estados = [
    "normal",
    "feliz",
    "concentrado",
    "atacando",
    "enojado",
    "herido",
    "derrotado",
    "celebrando",
  ];

  robo.dataset.estado = estado;
  robo.classList.remove(...estados.map((item) => `robo-${item}`));
  robo.classList.add(`robo-${estado}`);
}

function irAlMenuPrincipal() {
  const path = window.location.pathname.replace(/\\/g, "/");
  const rutas = path.includes("/niveles/") || path.includes("/levels/")
    ? ["../index.html", "../../index.html", "/index.html"]
    : ["index.html", "./index.html", "/index.html"];

  window.location.href = rutas[0];
}
