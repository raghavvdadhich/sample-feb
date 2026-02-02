const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const againBtn = document.getElementById("againBtn");
const buttons = document.getElementById("buttons");
const success = document.getElementById("success");
const title = document.getElementById("title");
const subtitle = document.getElementById("subtitle");
const emoji = document.getElementById("emoji");

// --- Viral behavior tweaks ---
let noCount = 0;
const noPhrases = [
  "No 🙃",
  "Are you sure? 😳",
  "Think again 😌",
  "Grace… pls 🥺",
  "Don't do me like that 💔",
  "Last chance 😭",
  "Ok but… why 😵",
  "Be my Valentine 😠💘",
  "You meant YES 😤"
];

function rand(min, max){ return Math.random() * (max - min) + min; }

function moveNoButton() {
  // Make the NO button jump around within the card area
  const card = document.getElementById("card");
  const rect = card.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  const padding = 16;
  const maxX = rect.width - btnRect.width - padding;
  const maxY = 72; // keep it near the buttons row

  const x = rand(padding, Math.max(padding, maxX));
  const y = rand(8, Math.max(8, maxY));

  noBtn.style.position = "absolute";
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
}

function growYesButton() {
  const scale = 1 + Math.min(noCount, 10) * 0.12;
  yesBtn.style.transform = `scale(${scale})`;
}

noBtn.addEventListener("mouseenter", () => {
  noCount++;
  noBtn.textContent = noPhrases[Math.min(noCount, noPhrases.length - 1)];
  moveNoButton();
  growYesButton();
  emoji.textContent = noCount < 3 ? "🥺" : noCount < 6 ? "😭" : "😤";
});

noBtn.addEventListener("click", (e) => {
  // On mobile, taps should also trigger the dodge.
  e.preventDefault();
  noCount++;
  noBtn.textContent = noPhrases[Math.min(noCount, noPhrases.length - 1)];
  moveNoButton();
  growYesButton();
  emoji.textContent = noCount < 3 ? "🥺" : noCount < 6 ? "😭" : "😤";
});

yesBtn.addEventListener("click", () => {
  title.textContent = "Grace said YES!! 💖";
  subtitle.textContent = "Best decision ever 😌";
  buttons.classList.add("hidden");
  success.classList.remove("hidden");
  emoji.textContent = "😍";
  startConfetti(1600);
});

againBtn.addEventListener("click", () => {
  // reset
  noCount = 0;
  title.textContent = "Grace, will you be my Valentine? 💘";
  subtitle.textContent = "Be honest… there’s only one correct answer 😌";
  buttons.classList.remove("hidden");
  success.classList.add("hidden");
  yesBtn.style.transform = "";
  noBtn.style.position = "";
  noBtn.style.left = "";
  noBtn.style.top = "";
  noBtn.textContent = "No 🙃";
  emoji.textContent = "🥺";
});

// ---- Lightweight confetti (canvas) ----
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
let confetti = [];
let animId = null;

function resize() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
window.addEventListener("resize", resize);
resize();

function makePiece() {
  return {
    x: rand(0, window.innerWidth),
    y: rand(-20, -window.innerHeight),
    r: rand(3, 7),
    vx: rand(-2, 2),
    vy: rand(2.5, 5.5),
    rot: rand(0, Math.PI),
    vr: rand(-0.15, 0.15),
    shape: Math.random() < 0.5 ? "rect" : "circle",
    hue: rand(320, 360) // pink/purple range
  };
}

function draw() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (const p of confetti) {
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = `hsl(${p.hue} 90% 60%)`;

    if (p.shape === "rect") {
      ctx.fillRect(-p.r, -p.r, p.r * 2.2, p.r * 1.2);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  confetti = confetti.filter(p => p.y < window.innerHeight + 30);
  if (confetti.length > 0) animId = requestAnimationFrame(draw);
  else cancelAnimationFrame(animId);
}

function startConfetti(durationMs = 1200) {
  const start = performance.now();
  confetti = [];

  function addLoop(t) {
    const elapsed = t - start;
    if (elapsed < durationMs) {
      for (let i = 0; i < 10; i++) confetti.push(makePiece());
      requestAnimationFrame(addLoop);
    }
  }

  requestAnimationFrame(addLoop);
  if (!animId) draw();
}
