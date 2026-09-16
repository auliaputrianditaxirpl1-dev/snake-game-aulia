const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const grid = 20;
const size = 400;
const jumlahMakanan = 10;

let snake = [];
let foods = [];
let direction = "right";
let nextDirection = "right";
let score = 0;
let gameRunning = false;
let gameLoop = null;

let highScore = localStorage.getItem("highScore") || 0;
document.getElementById("highScore").textContent = highScore;

document.getElementById("startButton").addEventListener("click", startGame);
document.getElementById("restartButton").addEventListener("click", startGame);

document.querySelectorAll("[data-direction]").forEach(button => {
    button.addEventListener("click", () => {
        changeDirection(button.dataset.direction);
    });
});

function startGame() {
    snake = [
        { x: 200, y: 200 },
        { x: 180, y: 200 },
        { x: 160, y: 200 }
    ];

    direction = "right";
    nextDirection = "right";
    score = 0;
    gameRunning = true;

    document.getElementById("score").textContent = score;
    document.getElementById("startScreen").classList.add("hidden");
    document.getElementById("gameOver").classList.add("hidden");

    createFoods();

    clearInterval(gameLoop);
    gameLoop = setInterval(update, 120);

    draw();
}

function createFoods() {
    foods = [];

    while (foods.length < jumlahMakanan) {
        const food = {
            x: Math.floor(Math.random() * 20) * grid,
            y: Math.floor(Math.random() * 20) * grid
        };

        const terkenaUlar = snake.some(segment =>
            segment.x === food.x && segment.y === food.y
        );

        const terkenaMakanan = foods.some(item =>
            item.x === food.x && item.y === food.y
        );

        if (!terkenaUlar && !terkenaMakanan) {
            foods.push(food);
        }
    }
}

function tambahMakanan() {
    while (foods.length < jumlahMakanan) {
        const food = {
            x: Math.floor(Math.random() * 20) * grid,
            y: Math.floor(Math.random() * 20) * grid
        };

        const terkenaUlar = snake.some(segment =>
            segment.x === food.x && segment.y === food.y
        );

        const terkenaMakanan = foods.some(item =>
            item.x === food.x && item.y === food.y
        );

        if (!terkenaUlar && !terkenaMakanan) {
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

    if (direction === "up") head.y -= grid;
    if (direction === "down") head.y += grid;
    if (direction === "left") head.x -= grid;
    if (direction === "right") head.x += grid;

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
        head.x === food.x && head.y === food.y
    );

    if (indexMakanan !== -1) {
        score++;

        document.getElementById("score").textContent = score;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
            document.getElementById("highScore").textContent = highScore;
        }

        foods.splice(indexMakanan, 1);
        tambahMakanan();

        clearInterval(gameLoop);

        const speed = Math.max(50, 120 - score * 3);
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
        ctx.fillStyle = "#e0525d";

        ctx.beginPath();
        ctx.arc(
            food.x + 10,
            food.y + 10,
            8,
            0,
            Math.PI * 2
        );
        ctx.fill();
    });
}

function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "#ff9fba" : "#4dcc72";

        ctx.fillRect(
            snake[i].x + 1,
            snake[i].y + 1,
            grid - 2,
            grid - 2
        );
    }

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
    if (!gameRunning) return;

    if (newDirection === "up" && direction !== "down") {
        nextDirection = "up";
    }

    if (newDirection === "down" && direction !== "up") {
        nextDirection = "down";
    }

    if (newDirection === "left" && direction !== "right") {
        nextDirection = "left";
    }

    if (newDirection === "right" && direction !== "left") {
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
