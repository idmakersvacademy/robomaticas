const particleCanvas = document.querySelector("#gameParticles");
const particleContext = particleCanvas?.getContext("2d");
const gameParticles = [];
const reduceGameFeelMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
let particleFrame = null;
let lastPointerMove = 0;

function resizeParticleCanvas() {
  if (!particleCanvas || !particleContext) return;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  particleCanvas.width = Math.floor(window.innerWidth * ratio);
  particleCanvas.height = Math.floor(window.innerHeight * ratio);
  particleCanvas.style.width = `${window.innerWidth}px`;
  particleCanvas.style.height = `${window.innerHeight}px`;
  particleContext.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function seedGameParticles() {
  if (!particleCanvas) return;
  gameParticles.length = 0;
  if (reduceGameFeelMotion() || window.matchMedia?.("(max-width: 900px)").matches) return;
  const count = Math.min(46, Math.max(24, Math.floor(window.innerWidth / 38)));
  for (let index = 0; index < count; index += 1) {
    gameParticles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 1.8 + 0.7,
      speed: Math.random() * 0.24 + 0.08,
      drift: Math.random() * 0.18 - 0.09,
      alpha: Math.random() * 0.34 + 0.12,
      hue: Math.random() > 0.5 ? "85, 246, 255" : "143, 104, 255",
    });
  }
}

function drawGameParticles() {
  if (!particleCanvas || !particleContext) return;
  if (document.hidden || reduceGameFeelMotion()) {
    particleFrame = null;
    return;
  }
  particleContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
  gameParticles.forEach((particle) => {
    particle.y -= particle.speed;
    particle.x += particle.drift;
    if (particle.y < -20) {
      particle.y = window.innerHeight + 20;
      particle.x = Math.random() * window.innerWidth;
    }
    if (particle.x < -20) particle.x = window.innerWidth + 20;
    if (particle.x > window.innerWidth + 20) particle.x = -20;

    particleContext.beginPath();
    particleContext.fillStyle = `rgba(${particle.hue}, ${particle.alpha})`;
    particleContext.shadowColor = `rgba(${particle.hue}, 0.7)`;
    particleContext.shadowBlur = 8;
    particleContext.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    particleContext.fill();
  });
  particleFrame = requestAnimationFrame(drawGameParticles);
}

function bootGameFeel() {
  resizeParticleCanvas();
  seedGameParticles();
  if (!particleFrame) drawGameParticles();
}

window.addEventListener("resize", () => {
  resizeParticleCanvas();
  seedGameParticles();
});

document.addEventListener("pointermove", (event) => {
  const now = performance.now();
  if (now - lastPointerMove < 80) return;
  lastPointerMove = now;
  const driftX = ((event.clientX / window.innerWidth) - 0.5) * 12;
  const driftY = ((event.clientY / window.innerHeight) - 0.5) * 10;
  document.documentElement.style.setProperty("--pointer-x", `${(event.clientX / window.innerWidth) * 100}%`);
  document.documentElement.style.setProperty("--pointer-y", `${(event.clientY / window.innerHeight) * 100}%`);
  document.documentElement.style.setProperty("--ambient-drift-x", `${driftX.toFixed(1)}px`);
  document.documentElement.style.setProperty("--ambient-drift-y", `${driftY.toFixed(1)}px`);
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    if (particleFrame) cancelAnimationFrame(particleFrame);
    particleFrame = null;
    return;
  }
  if (!particleFrame) drawGameParticles();
});

bootGameFeel();
