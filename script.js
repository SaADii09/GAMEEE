const player = document.getElementById("player");
const coin = document.getElementById("coin");
const scoreDisplay = document.getElementById("score");
const container = document.querySelector(".game-container");

let playerX = 0;
let playerY = 0;
let score = 0;
let tail = [];
const maxTailLength = 20; // Maximum length of the tail

function movePlayer(event) {
    switch (event.key) {
        case "ArrowUp":
            if (playerY > 0) playerY -= 10;
            break;
        case "ArrowDown":
            if (playerY < container.clientHeight - 30) playerY += 10;
            break;
        case "ArrowLeft":
            if (playerX > 0) playerX -= 10;
            break;
        case "ArrowRight":
            if (playerX < container.clientWidth - 30) playerX += 10;
            break;
    }
    updatePlayerPosition();
}

function updatePlayerPosition() {
    player.style.transform = `translate(${playerX}px, ${playerY}px)`;
    checkCollision();
    moveTail();
}

function placeCoin() {
    const x = Math.floor(Math.random() * (container.clientWidth - 20));
    const y = Math.floor(Math.random() * (container.clientHeight - 20));
    coin.style.transform = `translate(${x}px, ${y}px)`;
}

function placeObstacles(num) {
    const existingObstacles = document.querySelectorAll(".obstacle");
    existingObstacles.forEach((obs) => container.removeChild(obs)); // Clear existing obstacles
    for (let i = 0; i < num; i++) {
        const obstacle = document.createElement("div");
        obstacle.className = "obstacle";
        obstacle.style.position = "absolute";
        obstacle.style.width = "30px";
        obstacle.style.height = "30px";
        obstacle.style.backgroundColor = "red";
        obstacle.style.borderRadius = "5px";
        const x = Math.floor(Math.random() * (container.clientWidth - 30));
        const y = Math.floor(Math.random() * (container.clientHeight - 30));
        obstacle.style.transform = `translate(${x}px, ${y}px)`;
        container.appendChild(obstacle);
    }
}

function checkCollision() {
    const playerRect = player.getBoundingClientRect();
    const coinRect = coin.getBoundingClientRect();

    if (
        playerRect.x < coinRect.x + coinRect.width &&
        playerRect.x + playerRect.width > coinRect.x &&
        playerRect.y < coinRect.y + coinRect.height &&
        playerRect.y + playerRect.height > coinRect.y
    ) {
        score++;
        updateScore();
        addTail();
        placeCoin();
    }

    const obstacles = document.querySelectorAll(".obstacle");
    obstacles.forEach((obstacle) => {
        const obstacleRect = obstacle.getBoundingClientRect();
        if (
            playerRect.x < obstacleRect.x + obstacleRect.width &&
            playerRect.x + playerRect.width > obstacleRect.x &&
            playerRect.y < obstacleRect.y + obstacleRect.height &&
            playerRect.y + playerRect.height > obstacleRect.y
        ) {
            alert("Game Over! Your score: " + score);
            resetGame();
        }
    });
}

function updateScore() {
    scoreDisplay.textContent = "Score: " + score;
}

function addTail() {
    const tailSegmentsToAdd = Math.floor(score / 2); // Grow tail by 1 segment for every 2 coins
    for (let i = 0; i < tailSegmentsToAdd; i++) {
        if (tail.length < maxTailLength) {
            const tailSegment = document.createElement("div");
            tailSegment.className = "tail-segment";
            tailSegment.style.position = "absolute";
            tailSegment.style.width = "10px";
            tailSegment.style.height = "10px";
            tailSegment.style.backgroundColor = "green";
            tailSegment.style.borderRadius = "50%";
            tail.push(tailSegment);
            container.appendChild(tailSegment);
        }
    }
}

function moveTail() {
    for (let i = tail.length - 1; i > 0; i--) {
        tail[i].style.transform = `translate(${
            tail[i - 1].style.transform.split("(")[1]
        }`;
    }
    if (tail.length > 0) {
        tail[0].style.transform = `translate(${playerX}px, ${playerY}px)`;
    }
}

function resetGame() {
    playerX = 0;
    playerY = 0;
    score = 0;
    scoreDisplay.textContent = "Score: " + score;
    player.style.transform = `translate(${playerX}px, ${playerY}px)`;
    tail.forEach((segment) => container.removeChild(segment));
    tail = [];
    placeCoin();
    placeObstacles(5); // Place initial obstacles
}

function handleMobileControls(direction) {
    switch (direction) {
        case "up":
            if (playerY > 0) playerY -= 10;
            break;
        case "down":
            if (playerY < container.clientHeight - 30) playerY += 10;
            break;
        case "left":
            if (playerX > 0) playerX -= 10;
            break;
        case "right":
            if (playerX < container.clientWidth - 30) playerX += 10;
            break;
    }
    updatePlayerPosition();
}

// Add event listeners for mobile controls
document
    .getElementById("up")
    .addEventListener("click", () => handleMobileControls("up"));
document
    .getElementById("down")
    .addEventListener("click", () => handleMobileControls("down"));
document
    .getElementById("left")
    .addEventListener("click", () => handleMobileControls("left"));
document
    .getElementById("right")
    .addEventListener("click", () => handleMobileControls("right"));

document.addEventListener("keydown", movePlayer);
placeCoin();
placeObstacles(5); // Place initial obstacles
