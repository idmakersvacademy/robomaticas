const RM_LEVEL_SCREENS = new Set(["game", "battle", "factory", "delivery"]);
let rmHudRendering = false;

function migrarProgresoAntiguo() {
  const clavesAntiguas = [
    `numero${"nautas"}_progreso`,
    `numero${"nautas"}_robo`,
    `educa${"games"}_progreso`,
    "robomaticas_progreso",
  ];

  try {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const progreso = clavesAntiguas.map((clave) => localStorage.getItem(clave)).find(Boolean);
    if (progreso) localStorage.setItem(STORAGE_KEY, progreso);
  } catch {
    // El progreso no debe bloquear el juego si el navegador limita localStorage.
  }
}

function crearHUD(config = {}) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", () => crearHUD(config), { once: true });
    return null;
  }

  let hud = obtenerHUDElemento();
  if (!hud) {
    hud = document.createElement("header");
    hud.className = "rm-hud";
    hud.setAttribute("aria-label", "Estado del nivel");
    document.body.prepend(hud);
  }

  actualizarHUD(config);
  if (hud) hud.hidden = false;
  return hud;
}

function obtenerHUDElemento() {
  const huds = [...document.querySelectorAll(".rm-hud")];
  huds.slice(1).forEach((hud) => hud.remove());
  return huds[0] || null;
}

function inicializarHUDNivel(config = {}) {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", () => inicializarHUDNivel(config), { once: true });
    return null;
  }

  const hud = obtenerHUDElemento();
  if (hud) {
    hud.hidden = false;
    return hud;
  }

  const level = levels?.[state?.levelIndex] || {};
  return crearHUD({
    nivel: level.title || config.nivel || "Nivel",
    puntos: 0,
    estrellas: "0/3",
    vidas: 3,
    energia: 100,
    combo: 0,
    progreso: "0/0",
    mostrarEnergia: false,
    onMenu: () => {
      renderLevels();
      showScreen("level");
    },
    ...config,
  });
}

function crearTarjetaHUD(label, value, id) {
  return `
    <div class="rm-hud-card" ${id ? `data-hud-card="${id}"` : ""}>
      <span class="rm-hud-label">${label}</span>
      <strong ${id ? `id="${id}"` : ""}>${value}</strong>
    </div>
  `;
}

function actualizarHUD({
  nivel = "",
  puntos = 0,
  estrellas = "0/3",
  vidas = 3,
  energia = null,
  combo = 0,
  progreso = null,
  mostrarPuntos = true,
  mostrarEstrellas = true,
  mostrarVidas = true,
  mostrarEnergia = false,
  mostrarCombo = true,
  mostrarProgreso = true,
  onMenu = null,
} = {}) {
  let hud = obtenerHUDElemento();
  if (!hud) {
    if (rmHudRendering) return null;
    rmHudRendering = true;
    hud = crearHUD({
      nivel,
      puntos,
      estrellas,
      vidas,
      energia,
      combo,
      progreso,
      mostrarPuntos,
      mostrarEstrellas,
      mostrarVidas,
      mostrarEnergia,
      mostrarCombo,
      mostrarProgreso,
      onMenu,
    });
    rmHudRendering = false;
    return hud;
  }

  hud.hidden = false;
  const vidasTexto = typeof vidas === "string"
    ? vidas
    : "\u2665".repeat(Math.max(0, vidas)) + "\u2661".repeat(Math.max(0, 3 - vidas));

  hud.innerHTML = `
    ${crearTarjetaHUD("NIVEL", nivel, "hudNivel")}
    ${mostrarPuntos ? crearTarjetaHUD("PUNTOS", puntos, "hudPuntos") : ""}
    ${mostrarEstrellas ? crearTarjetaHUD("ESTRELLAS", estrellas, "hudEstrellas") : ""}
    ${mostrarVidas ? crearTarjetaHUD("VIDAS", vidasTexto, "hudVidas") : ""}
    ${mostrarEnergia ? crearTarjetaHUD("ENERGIA", `${energia ?? 100}%`, "hudEnergia") : ""}
    ${mostrarCombo ? crearTarjetaHUD("COMBO", `x${combo}`, "hudCombo") : ""}
    ${mostrarProgreso ? crearTarjetaHUD("PROGRESO", progreso ?? "0/0", "hudProgreso") : ""}
    <button class="rm-menu-btn" id="btnMenuHUD" type="button">Menu</button>
  `;

  hud.querySelector("#btnMenuHUD")?.addEventListener("click", () => {
    abrirModalMenu(typeof onMenu === "function" ? onMenu : null);
  });

  return hud;
}

function ocultarHUD() {
  const hud = obtenerHUDElemento();
  if (hud) hud.hidden = true;
}

function insertarLogoRoboMaticas() {
  if (document.querySelector(".rm-brand-logo")) return;

  const logo = document.createElement("div");
  logo.className = "rm-brand-logo";
  logo.setAttribute("aria-label", "RoboMaticas");
  logo.textContent = "RoboMaticas";
  document.body.appendChild(logo);
}

function mostrarLogoRoboMaticas(visible = true) {
  insertarLogoRoboMaticas();
  const logo = document.querySelector(".rm-brand-logo");
  if (logo) logo.hidden = !visible;
}

function abrirModalMenu(onConfirm = null) {
  let modal = document.querySelector("#rmModalMenu");

  if (!modal) {
    modal = document.createElement("div");
    modal.id = "rmModalMenu";
    modal.className = "rm-modal";
    modal.innerHTML = `
      <div class="rm-modal-card" role="dialog" aria-modal="true" aria-labelledby="rmModalMenuTitle">
        <p class="rm-modal-kicker">Pausa de mision</p>
        <h2 id="rmModalMenuTitle">Volver al menu</h2>
        <p>Tu avance de esta ronda podria perderse.</p>
        <div class="rm-modal-actions">
          <button class="rm-modal-secondary" id="rmCancelarMenu" type="button">Seguir jugando</button>
          <button class="rm-modal-primary" id="rmConfirmarMenu" type="button">Volver al menu</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector("#rmCancelarMenu")?.addEventListener("click", () => {
      modal.classList.remove("activo");
    });
  }

  modal._onConfirm = onConfirm;
  const confirmar = modal.querySelector("#rmConfirmarMenu");
  if (confirmar) confirmar.onclick = confirmarMenuUnaVez;
  modal.classList.add("activo");
}

function confirmarMenuUnaVez() {
  const modal = document.querySelector("#rmModalMenu");
  modal?.classList.remove("activo");
  if (typeof modal?._onConfirm === "function") {
    modal._onConfirm();
    return;
  }
  renderLevels();
  showScreen("level");
}

document.addEventListener("visibilitychange", () => {
  document.body.classList.toggle("juego-pausado", document.hidden);
});
