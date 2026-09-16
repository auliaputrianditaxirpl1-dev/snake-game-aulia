const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const grid = 20;
const size = 400;
const jumlahMakanan = 10;

canvas.width = size;
canvas.height = size;

const emojiMakanan = [
    "🍎",
    "🍊",
    "🍇",
    "🍓",
    "🍉",
    "🍌",
    "🍒",
    "🥝",
    "🍍",
    "🥕"
];

const warnaUlar = [
    "#4dcc72",
    "#ff6b6b",
    "#4dabf7",
    "#ffd43b",
    "#cc5de8",
    "#ff922b",
    "#20c997",
    "#f06595"
];

const kecepatanAwal = 500;
const kecepatanMinimum = 2;

let snake = [];
let foods = [];
let direction = "right";
let nextDirection = "right";
let score = 0;
let gameRunning = false;
let gameLoop = null;
let warnaSekarang = warnaUlar[0];

let highScore = Number(localStorage.getItem("highScore")) || 0;

document.getElementById("highScore").textContent = highScore;

document.getElementById("startButton").onclick = startGame;
document.getElementById("restartButton").onclick = startGame;

document.querySelectorAll("[data-direction]").forEach(button => {
    button.onclick = function() {
        changeDirection(button.dataset.direction);
    };
});

function startGame() {
    snake = [
        { x: 200, y: 200 },
        { x: 180, y: 200 },
        { x: 160, y: 200 }
    ];

    foods = [];
    direction = "right";
    nextDirection = "right";
    score = 0;
    gameRunning = true;
    warnaSekarang = warnaUlar[0];

    document.getElementById("score").textContent = score;
    document.getElementById("startScreen").classList.add("hidden");
    document.getElementById("gameOver").classList.add("hidden");

    createFoods();

    clearInterval(gameLoop);
    gameLoop = setInterval(update, kecepatanAwal);

    draw();
}

function createFoods() {
    foods = [];

    while (foods.length < jumlahMakanan) {
        const food = {
            x: Math.floor(Math.random() * (size / grid)) * grid,
            y: Math.floor(Math.random() * (size / grid)) * grid,
            emoji: emojiMakanan[
                Math.floor(Math.random() * emojiMakanan.length)
            ]
        };

        const kenaUlar = snake.some(segment =>
            segment.x === food.x &&
            segment.y === food.y
        );

        const kenaMakanan = foods.some(item =>
            item.x === food.x &&
            item.y === food.y
        );

        if (!kenaUlar && !kenaMakanan) {
            foods.push(food);
        }
    }
}

function tambahMakanan() {
    while (foods.length < jumlahMakanan) {
        const food = {
            x: Math.floor(Math.random() * (size / grid)) * grid,
            y: Math.floor(Math.random() * (size / grid)) * grid,
            emoji: emojiMakanan[
                Math.floor(Math.random() * emojiMakanan.length)
            ]
        };

        const kenaUlar = snake.some(segment =>
            segment.x === food.x &&
            segment.y === food.y
        );

        const kenaMakanan = foods.some(item =>
            item.x === food.x &&
            item.y === food.y
        );

        if (!kenaUlar && !kenaMakanan) {
            foods.push(food);
        }
    }
}

function update() {
    direction = nextDirection;

    const head = {
        x: snake[0].x,
        y: snake[0].y
    };

    if (direction === "up") {
        head.y -= grid;
    }

    if (direction === "down") {
        head.y += grid;
    }

    if (direction === "left") {
        head.x -= grid;
    }

    if (direction === "right") {
        head.x += grid;
    }

    if (
        head.x < 0 ||
        head.x >= size ||
        head.y < 0 ||
        head.y >= size
    ) {
        gameOver();
        return;
    }

    for (let i = 0; i < snake.length; i++) {
        if (
            head.x === snake[i].x &&
            head.y === snake[i].y
        ) {
            gameOver();
            return;
        }
    }

    snake.unshift(head);

    const indexMakanan = foods.findIndex(food =>
        head.x === food.x &&
        head.y === food.y
    );

    if (indexMakanan !== -1) {
        score++;

        document.getElementById("score").textContent = score;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
            document.getElementById("highScore").textContent = highScore;
        }

        warnaSekarang =
            warnaUlar[(score - 1) % warnaUlar.length];

        foods.splice(indexMakanan, 1);

        tambahMakanan();

        clearInterval(gameLoop);

        const speed = Math.max(
            kecepatanMinimum,
            kecepatanAwal / Math.pow(2, score)
        );

        gameLoop = setInterval(update, speed);
    } else {
        snake.pop();
    }

    draw();
}

function draw() {
    ctx.fillStyle = "#231e2d";
    ctx.fillRect(0, 0, size, size);

    drawGrid();
    drawFoods();
    drawSnake();
}

function drawGrid() {
    ctx.strokeStyle = "#373143";

    for (let x = 0; x < size; x += grid) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, size);
        ctx.stroke();
    }

    for (let y = 0; y < size; y += grid) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(size, y);
        ctx.stroke();
    }
}

function drawFoods() {
    foods.forEach(food => {
        ctx.font = "18px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText(
            food.emoji,
            food.x + 10,
            food.y + 10
        );
    });
}

function drawSnake() {
    snake.forEach((segment, index) => {
        ctx.fillStyle =
            index === 0 ? "#ff9fba" : warnaSekarang;

        ctx.fillRect(
            segment.x + 1,
            segment.y + 1,
            grid - 2,
            grid - 2
        );
    });

    drawEyes();
}

function drawEyes() {
    const head = snake[0];

    ctx.fillStyle = "white";

    if (direction === "right") {
        ctx.fillRect(head.x + 14, head.y + 4, 3, 3);
        ctx.fillRect(head.x + 14, head.y + 13, 3, 3);
    }

    if (direction === "left") {
        ctx.fillRect(head.x + 3, head.y + 4, 3, 3);
        ctx.fillRect(head.x + 3, head.y + 13, 3, 3);
    }

    if (direction === "up") {
        ctx.fillRect(head.x + 4, head.y + 3, 3, 3);
        ctx.fillRect(head.x + 13, head.y + 3, 3, 3);
    }

    if (direction === "down") {
        ctx.fillRect(head.x + 4, head.y + 14, 3, 3);
        ctx.fillRect(head.x + 13, head.y + 14, 3, 3);
    }
}

function changeDirection(newDirection) {
    if (!gameRunning) {
        return;
    }

    if (
        newDirection === "up" &&
        direction !== "down"
    ) {
        nextDirection = "up";
    }

    if (
        newDirection === "down" &&
        direction !== "up"
    ) {
        nextDirection = "down";
    }

    if (
        newDirection === "left" &&
        direction !== "right"
    ) {
        nextDirection = "left";
    }

    if (
        newDirection === "right" &&
        direction !== "left"
    ) {
        nextDirection = "right";
    }
}

function gameOver() {
    gameRunning = false;

    clearInterval(gameLoop);

    document.getElementById("finalScore").textContent = score;
    document.getElementById("gameOver").classList.remove("hidden");
}

document.addEventListener("keydown", function(event) {
    const key = event.key.toLowerCase();

    if (key === "r" && !gameRunning) {
        startGame();
        return;
    }

    if (key === "arrowup" || key === "w") {
        changeDirection("up");
    }

    if (key === "arrowdown" || key === "s") {
        changeDirection("down");
    }

    if (key === "arrowleft" || key === "a") {
        changeDirection("left");
    }

    if (key === "arrowright" || key === "d") {
        changeDirection("right");
    }
});
