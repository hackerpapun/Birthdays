const PI2 = Math.PI * 2;
const random = (min, max) => (Math.random() * (max - min + 1) + min) | 0;
const timestamp = () => new Date().getTime();

class Birthday {
  constructor() {
    this.resize();
    this.fireworks = [];
    this.counter = 0;
    this.isRunning = true; // Controls animation state
  }

  resize() {
    this.width = canvas.width = window.innerWidth;
    this.height = canvas.height = window.innerHeight;

    let center = (this.width / 2) | 0;
    this.spawnA = (center - center / 4) | 0;
    this.spawnB = (center + center / 4) | 0;
    this.spawnC = this.height * 0.1;
    this.spawnD = this.height * 0.5;
  }

  onClick(evt) {
    if (!this.isRunning) return;

    let x = evt.clientX || (evt.touches && evt.touches[0].pageX);
    let y = evt.clientY || (evt.touches && evt.touches[0].pageY);

    let count = random(5, 10);
    for (let i = 0; i < count; i++) {
      this.fireworks.push(
        new Firework(
          random(this.spawnA, this.spawnB),
          this.height,
          x,
          y,
          random(0, 360),
          random(30, 110)
        )
      );
    }

    this.counter = -1;
  }

  update(delta) {
    if (!this.isRunning) return; // Stop updates when animation ends

    ctx.globalCompositeOperation = "hard-light";
    ctx.fillStyle = `rgba(20,20,20,${7 * delta})`;
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.globalCompositeOperation = "lighter";
    for (let firework of this.fireworks) firework.update(delta);

    this.counter += delta * 3;
    if (this.counter >= 1) {
      this.fireworks.push(
        new Firework(
          random(this.spawnA, this.spawnB),
          this.height,
          random(0, this.width),
          random(this.spawnC, this.spawnD),
          random(0, 360),
          random(30, 110)
        )
      );
      this.counter = 0;
    }

    if (this.fireworks.length > 1000)
      this.fireworks = this.fireworks.filter((firework) => !firework.dead);

    this.drawMessage();
  }

  drawMessage() {
    ctx.font = window.innerWidth < 600 ? "bold 40px Arial" : "bold 80px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.shadowColor = "purple";
    ctx.shadowBlur = 20;
    ctx.fillText("Happy Birthday", this.width / 2, this.height / 2);

    ctx.font = window.innerWidth < 600 ? "bold 30px Arial" : "bold 60px Arial";
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.shadowColor = "purple";
    ctx.fillText("Khusi", this.width / 2, this.height / 2 + 50);
    ctx.shadowBlur = 0;
  }

  stopFireworks() {
    this.isRunning = false; // Stop new updates
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear fireworks
    this.showChatbot(); // Show chatbot
  }

  showChatbot() {
    document.getElementById("chatbot").style.display = "block"; // Make chatbot visible
  }
}

class Firework {
  constructor(x, y, targetX, targetY, shade, offsprings) {
    this.dead = false;
    this.offsprings = offsprings;
    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.shade = shade;
    this.history = [];
  }

  update(delta) {
    if (this.dead) return;

    let xDiff = this.targetX - this.x;
    let yDiff = this.targetY - this.y;
    if (Math.abs(xDiff) > 3 || Math.abs(yDiff) > 3) {
      this.x += xDiff * 2 * delta;
      this.y += yDiff * 2 * delta;
      this.history.push({ x: this.x, y: this.y });

      if (this.history.length > 20) this.history.shift();
    } else {
      if (this.offsprings && !this.madeChilds) {
        let babies = this.offsprings / 2;
        for (let i = 0; i < babies; i++) {
          let targetX =
            (this.x + this.offsprings * Math.cos((PI2 * i) / babies)) | 0;
          let targetY =
            (this.y + this.offsprings * Math.sin((PI2 * i) / babies)) | 0;

          birthday.fireworks.push(
            new Firework(this.x, this.y, targetX, targetY, this.shade, 0)
          );
        }
      }
      this.madeChilds = true;
      this.history.shift();
    }

    if (this.history.length === 0) this.dead = true;
    else if (this.offsprings) {
      for (let i = 0; this.history.length > i; i++) {
        let point = this.history[i];
        ctx.beginPath();
        ctx.fillStyle = `hsl(${this.shade},100%,${i}%)`;
        ctx.arc(point.x, point.y, 1, 0, PI2, false);
        ctx.fill();
      }
    } else {
      ctx.beginPath();
      ctx.fillStyle = `hsl(${this.shade},100%,50%)`;
      ctx.arc(this.x, this.y, 1, 0, PI2, false);
      ctx.fill();
    }
  }
}

let canvas = document.getElementById("birthday");
let ctx = canvas.getContext("2d");

let then = timestamp();
let birthday = new Birthday();
window.onresize = () => birthday.resize();
document.onclick = (evt) => birthday.onClick(evt);
document.ontouchstart = (evt) => birthday.onClick(evt);

function loop() {
  if (birthday.isRunning) {
    requestAnimationFrame(loop);
    let now = timestamp();
    let delta = now - then;
    then = now;
    birthday.update(delta / 1000);
  }
}
loop();

setTimeout(() => {
  birthday.stopFireworks();
}, 10000);
