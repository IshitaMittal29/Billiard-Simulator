// =======================
// Backend session handling
// =======================
let sessionId = null;
const playerName = "Ishita";

let score = 0;
let turn = 1;
let shots = 0;

function startGame() {
    fetch(`/api/game/start?playerName=${playerName}`)
        .then(res => res.json())
        .then(data => {
            sessionId = data.sessionId;
            console.log("Game session started:", data);
        })
        .catch(err => console.error("Backend not reachable", err));
}

startGame();


// =======================
// Canvas setup
// =======================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;


// =======================
// Ball class
// =======================
class Ball {
    constructor(x, y, radius, color, isCue = false) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.isCue = isCue;
        this.vx = 0;
        this.vy = 0;
    }

    draw() {
        // Shadow
        ctx.beginPath();
        ctx.arc(this.x + 3, this.y + 5, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.fill();

        const gradient = ctx.createRadialGradient(
            this.x - this.radius / 3,
            this.y - this.radius / 3,
            this.radius / 3,
            this.x,
            this.y,
            this.radius
        );

        gradient.addColorStop(0, "#ffffff");
        gradient.addColorStop(0.3, this.color);
        gradient.addColorStop(1, "#000000");

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        this.vx *= 0.99;
        this.vy *= 0.99;

        if (Math.abs(this.vx) < 0.01) this.vx = 0;
        if (Math.abs(this.vy) < 0.01) this.vy = 0;

        if (this.x <= this.radius || this.x >= WIDTH - this.radius) {
            this.vx = -this.vx;
        }
        if (this.y <= this.radius || this.y >= HEIGHT - this.radius) {
            this.vy = -this.vy;
        }
    }

    isMoving() {
        return Math.abs(this.vx) > 0 || Math.abs(this.vy) > 0;
    }
}


// =======================
// Game objects
// =======================
const balls = [];

const cueBall = new Ball(200, HEIGHT / 2, 12, "#eaeaea", true);
balls.push(cueBall);

balls.push(new Ball(600, HEIGHT / 2 - 15, 12, "#c0392b"));
balls.push(new Ball(630, HEIGHT / 2, 12, "#f1c40f"));
balls.push(new Ball(600, HEIGHT / 2 + 15, 12, "#2980b9"));


// =======================
// Mouse interaction
// =======================
let isDragging = false;
let mouseX = 0;
let mouseY = 0;

canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

    const dx = mouseX - cueBall.x;
    const dy = mouseY - cueBall.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= cueBall.radius + 5 && !anyBallMoving()) {
        isDragging = true;
    }
});

canvas.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

canvas.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;

    const dx = cueBall.x - mouseX;
    const dy = cueBall.y - mouseY;

    cueBall.vx += dx * 0.05;
    cueBall.vy += dy * 0.05;

    shots++;

    // Turn logic
    setTimeout(() => {
        turn++;
    }, 1200);

    if (sessionId) {
        fetch("/api/game/shot", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                sessionId,
                power: Math.sqrt(dx * dx + dy * dy),
                angle: Math.atan2(dy, dx)
            })
        });
    }
});

function anyBallMoving() {
    return balls.some(ball => ball.isMoving());
}


// =======================
// HUD (Score + Turn)
// =======================
function drawHUD() {
    ctx.save();

    ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    ctx.fillRect(20, 20, 260, 95);

    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.strokeRect(20, 20, 260, 95);

    ctx.fillStyle = "#ffffff";
    ctx.font = "16px Arial";

    ctx.fillText(`Player: ${playerName}`, 35, 45);
    ctx.fillText(`Turn: ${turn}`, 35, 70);
    ctx.fillText(`Score: ${score}`, 160, 70);
    ctx.fillText(`Shots: ${shots}`, 35, 95);

    ctx.restore();
}


// =======================
// Game loop
// =======================
function gameLoop() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    if (isDragging) {
        ctx.beginPath();
        ctx.moveTo(cueBall.x, cueBall.y);
        ctx.lineTo(mouseX, mouseY);
        ctx.strokeStyle = "rgba(255,255,255,0.6)";
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    balls.forEach(ball => {
        ball.update();
        ball.draw();
    });

    drawHUD();

    requestAnimationFrame(gameLoop);
}

gameLoop();
