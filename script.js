javascript
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const GRID = 20;
const WIDTH = 800;
const HEIGHT = 600;

let ular = [];
let makanan = [];
let arah = { x: 20, y: 0 };
let skor = 0;
let warnaUlar = "rgb(50, 200, 80)";
let gameOver = false;

function posisiMakanan() {
    return {
        x: Math.floor(Math.random() * 40) * GRID,
        y: Math.floor(Math.random() * 30) * GRID
    };
}

function resetGame() {
    ular = [
        { x: 400, y: 300 },
        { x: 380, y: 300 },
        { x: 360, y: 300 }
    ];

    makanan = [];

    for (let i = 0; i < 10; i++) {
        makanan.push(posisiMakanan());
    }

    arah = { x: 20, y: 0 };
    skor = 0;
    warnaUlar = "rgb(50, 200, 80)";
    gameOver = false;

    document.getElementById("score").textContent = skor;
    document.getElementById("pesan").textContent = "";
}

document.addEventListener("keydown", function(event) {

    const key = event.key.toLowerCase();

    if (gameOver && key === "r") {
        resetGame();
        return;
    }

    if (key === "arrowup" || key === "w") {
        if (arah.y !== 20) {
            arah = { x: 0, y: -20 };
        }
    }

    if (key === "arrowdown" || key === "s") {
        if (arah.y !== -20) {
            arah = { x: 0, y: 20 };
        }
    }

    if (key === "arrowleft" || key === "a") {
        if (arah.x !== 20) {
            arah = { x: -20, y: 0 };
        }
    }

    if (key === "arrowright" || key === "d") {
        if (arah.x !== -20) {
            arah = { x: 20, y: 0 };
        }
    }
});

function update() {

    if (gameOver) {
        return;
    }

    let kepala = {
        x: ular[0].x + arah.x,
        y: ular[0].y + arah.y
    };

    // Tabrakan dinding
    if (
        kepala.x < 0 ||
        kepala.x >= WIDTH ||
        kepala.y < 0 ||
        kepala.y >= HEIGHT
    ) {
        gameOver = true;
        return;
    }

    // Tambahkan kepala
    ular.unshift(kepala);

    let makan = false;

    // Cek makanan
    for (let i = 0; i < makanan.length; i++) {

        if (
            kepala.x === makanan[i].x &&
            kepala.y === makanan[i].y
        ) {
            skor++;
            makan = true;

            warnaUlar = `rgb(
                ${Math.floor(Math.random() * 206) + 50},
                ${Math.floor(Math.random() * 206) + 50},
                ${Math.floor(Math.random() * 206) + 50}
            )`;

            makanan[i] = posisiMakanan();
            break;
        }
    }

    // Kalau tidak makan, ekor dihapus
    if (!makan) {
        ular.pop();
    }

    // Tabrakan dengan tubuh
    for (let i = 1; i < ular.length; i++) {

        if (
            kepala.x === ular[i].x &&
            kepala.y === ular[i].y
        ) {
            gameOver = true;
            return;
        }
    }

    document.getElementById("score").textContent = skor;
}

function gambar() {

    // Background
    ctx.fillStyle = "rgb(35, 30, 45)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Grid
    ctx.strokeStyle = "rgb(55, 50, 65)";

    for (let x = 0; x < WIDTH; x += GRID) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, HEIGHT);
        ctx.stroke();
    }

    for (let y = 0; y < HEIGHT; y += GRID) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(WIDTH, y);
        ctx.stroke();
    }

    // Makanan
    ctx.fillStyle = "rgb(220, 50, 50)";

    for (let item of makanan) {
        ctx.beginPath();

        ctx.arc(
            item.x + 10,
            item.y + 10,
            10,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

    // Ular
    ctx.fillStyle = warnaUlar;

    for (let bagian of ular) {
        ctx.fillRect(
            bagian.x,
            bagian.y,
            GRID,
            GRID
        );
    }

    // Rambut ular
    const kepala = ular[0];

    ctx.fillStyle = "rgb(255, 180, 200)";
    ctx.beginPath();

    if (arah.x > 0) {
        ctx.moveTo(kepala.x + 3, kepala.y);
        ctx.lineTo(kepala.x + 8, kepala.y - 7);
        ctx.lineTo(kepala.x + 12, kepala.y);
        ctx.lineTo(kepala.x + 16, kepala.y - 7);
        ctx.lineTo(kepala.x + 20, kepala.y);
    } 
    else if (arah.x < 0) {
        ctx.moveTo(kepala.x, kepala.y);
        ctx.lineTo(kepala.x + 4, kepala.y - 7);
        ctx.lineTo(kepala.x + 8, kepala.y);
        ctx.lineTo(kepala.x + 13, kepala.y - 7);
        ctx.lineTo(kepala.x + 18, kepala.y);
    }

    ctx.fill();

    // Game Over
    if (gameOver) {

        ctx.fillStyle = "rgb(220, 50, 50)";
        ctx.font = "60px Arial";
        ctx.textAlign = "center";

        ctx.fillText(
            "GAME OVER",
            WIDTH / 2,
            HEIGHT / 2
        );

        ctx.fillStyle = "white";
        ctx.font = "30px Arial";

        ctx.fillText(
            "Tekan R untuk bermain lagi",
            WIDTH / 2,
            HEIGHT / 2 + 50
        );
    }
}

function gameLoop() {

    update();
    gambar();

    let kecepatan = Math.max(
        50,
        100 - Math.floor(skor / 3) * 10
    );

    setTimeout(gameLoop, kecepatan);
}

resetGame();
gambar();
gameLoop();