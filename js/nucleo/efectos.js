const particleCanvas = document.querySelector("#gameParticles");
const particleContext = particleCanvas?.getContext("2d");
const gameParticles = [];

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
  const count = Math.min(70, Math.max(34, Math.floor(window.innerWidth / 26)));
  for (let index = 0; index < count; index += 1) {
    gameParticles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 2.2 + 0.8,
      speed: Math.random() * 0.34 + 0.12,
      drift: Math.random() * 0.28 - 0.14,
      alpha: Math.random() * 0.42 + 0.16,
      hue: Math.random() > 0.5 ? "85, 246, 255" : "143, 104, 255",
    });
  }
}

function drawGameParticles() {
  if (!particleCanvas || !particleContext) return;
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
    particleContext.shadowBlur = 12;
    particleContext.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    particleContext.fill();
  });
  requestAnimationFrame(drawGameParticles);
}

function bootGameFeel() {
  resizeParticleCanvas();
  seedGameParticles();
  drawGameParticles();
}

window.addEventListener("resize", () => {
  resizeParticleCanvas();
  seedGameParticles();
});

document.addEventListener("pointermove", (event) => {
  document.documentElement.style.setProperty("--pointer-x", `${(event.clientX / window.innerWidth) * 100}%`);
  document.documentElement.style.setProperty("--pointer-y", `${(event.clientY / window.innerHeight) * 100}%`);
});

bootGameFeel();
