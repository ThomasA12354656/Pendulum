const canvas = document.getElementById("pendulumCanvas");
const ctx = canvas.getContext("2d");

let angle = Math.PI / 4;
let angleVel = 0;
let angleAcc = 0;

let origin = { x: canvas.width / 2, y: 50 };
let length = 200;
let gravity = 9.8;
let mass = 10;
let damping = 0.995;

let airResistance = false;
let showTrail = true;
let trail = [];

document.getElementById("gravitySlider").oninput = (e) => {
  gravity = parseFloat(e.target.value);
  document.getElementById("gravityValue").textContent = gravity;
};
document.getElementById("lengthSlider").oninput = (e) => {
  length = parseFloat(e.target.value);
  document.getElementById("lengthValue").textContent = length;
};
document.getElementById("massSlider").oninput = (e) => {
  mass = parseFloat(e.target.value);
  document.getElementById("massValue").textContent = mass;
};
document.getElementById("airResistance").onchange = (e) => {
  airResistance = e.target.checked;
};
document.getElementById("trailToggle").onchange = (e) => {
  showTrail = e.target.checked;
};

function resetPendulum() {
  angle = Math.PI / 4;
  angleVel = 0;
  trail = [];
}

function update() {
  angleAcc = (-gravity / length) * Math.sin(angle);
  angleVel += angleAcc;
  
  if (airResistance) {
    angleVel *= 1 - 0.01 * mass; // simulate more damping with mass
  } else {
    angleVel *= damping;
  }

  angle += angleVel;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const x = origin.x + length * Math.sin(angle);
  const y = origin.y + length * Math.cos(angle);

  // Save trail
  if (showTrail) {
    trail.push({ x, y });
    if (trail.length > 100) trail.shift();
    ctx.beginPath();
    ctx.strokeStyle = "#00ffe077";
    for (let i = 0; i < trail.length - 1; i++) {
      ctx.moveTo(trail[i].x, trail[i].y);
      ctx.lineTo(trail[i + 1].x, trail[i + 1].y);
    }
    ctx.stroke();
  }

  // Draw pendulum rod
  ctx.beginPath();
  ctx.moveTo(origin.x, origin.y);
  ctx.lineTo(x, y);
  ctx.strokeStyle = "#00ffe0";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw pendulum bob
  ctx.beginPath();
  ctx.arc(x, y, mass, 0, Math.PI * 2);
  ctx.fillStyle = "#00ffe0";
  ctx.fill();
  ctx.strokeStyle = "#00b8a8";
  ctx.stroke();
}

function animate() {
  update();
  draw();
  requestAnimationFrame(animate);
}

animate();
