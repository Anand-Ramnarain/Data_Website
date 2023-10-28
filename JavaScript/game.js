const CONFIG = {
  SHIELD_RADIUS: 60,
  PLAYER_SPEED: 0.7,
  PLAYER_WIDTH: 30,
  PLAYER_HEIGHT: 30,
  API_URL:
    "https://api.nasa.gov/neo/rest/v1/feed?api_key=mqVBkEDJKwEtL2xVKR1mBAYdWCvU4qdOZgx2LNbJ",
};

const GAME_STATE = {
  START: "start",
  RUNNING: "running",
  GAME_OVER: "game_over",
};

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const planetPosition = { x: canvas.width / 2, y: canvas.height / 2 };

let asteroids = [];
let blasts = [];
let shieldHealth = 100;
let lastTime = 0;
const bufferDistance = 20;
let gameStartTime = Date.now();
let elapsedTime = 0;
let currentState = GAME_STATE.START;
const MAX_ASTEROIDS = 200;
let isGameLoopRunning = false;

const player = {
  x: canvas.width / 2,
  y: canvas.height - 50,
  speed: CONFIG.PLAYER_SPEED,
  width: CONFIG.PLAYER_WIDTH,
  height: CONFIG.PLAYER_HEIGHT,
  moveUp: false,
  moveDown: false,
  moveLeft: false,
  moveRight: false,
};

function setStartPosition(edge) {
  const positions = [
    { x: Math.random() * canvas.width, y: 0 },
    { x: canvas.width, y: Math.random() * canvas.height },
    { x: Math.random() * canvas.width, y: canvas.height },
    { x: 0, y: Math.random() * canvas.height },
  ];
  return positions[edge];
}

function createAsteroid(asteroidData) {
  const edge = Math.floor(Math.random() * 4);
  const { x: startX, y: startY } = setStartPosition(edge);
  const size =
    asteroidData.estimated_diameter.meters.estimated_diameter_max / 60;
  const speed = 0.5 * Math.min(0.5, 1 + (1 / size) * 10);
  const dx = planetPosition.x - startX;
  const dy = planetPosition.y - startY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const initialDelay = Math.random() * 10000;
  return {
    size,
    x: startX,
    y: startY,
    speed,
    direction: { x: dx / distance, y: dy / distance },
    delay: initialDelay + distance / speed,
  };
}

async function fetchAsteroids() {
  try {
    const response = await fetch(CONFIG.API_URL);
    if (!response.ok) {
      console.error(`Failed to fetch with status: ${response.status}`);
      return;
    }

    const data = await response.json();
    const newAsteroids =
      data.near_earth_objects[Object.keys(data.near_earth_objects)[0]];
    asteroids = newAsteroids.slice(0, MAX_ASTEROIDS).map(createAsteroid);
  } catch (error) {
    console.error("Failed to fetch asteroid data:", error);
  }
}

function drawShield() {
  ctx.beginPath();
  ctx.arc(
    planetPosition.x,
    planetPosition.y,
    CONFIG.SHIELD_RADIUS,
    0,
    Math.PI * 2
  );
  ctx.strokeStyle = "cyan";
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.closePath();
}

function drawPlanet() {
  ctx.beginPath();
  ctx.arc(planetPosition.x, planetPosition.y, 50, 0, Math.PI * 2);
  ctx.fillStyle = "blue";
  ctx.fill();
  ctx.closePath();
}

function drawPlayer() {
  ctx.fillStyle = "green";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function handlePlayerMovement() {
  const prevX = player.x;
  const prevY = player.y;

  if (player.moveUp) player.y -= player.speed;
  if (player.moveDown) player.y += player.speed;
  if (player.moveLeft) player.x -= player.speed;
  if (player.moveRight) player.x += player.speed;

  const dx = planetPosition.x - (player.x + player.width / 2);
  const dy = planetPosition.y - (player.y + player.height / 2);
  const distance = Math.sqrt(dx * dx + dy * dy);
  const planetRadius = 50;

  if (distance < planetRadius + player.width / 2 + bufferDistance) {
    player.x = prevX;
    player.y = prevY;
  }

  if (player.x > canvas.width) player.x = 0;
  if (player.x < 0) player.x = canvas.width;
  if (player.y > canvas.height) player.y = 0;
  if (player.y < 0) player.y = canvas.height;
}

function shoot() {
  blasts.push({
    x: player.x + player.width / 2,
    y: player.y + player.height / 2,
    radius: 0,
    growthRate: 5,
    maxRadius: 100,
    lifetime: 3 * 1000,
    creationTime: Date.now(),
  });
}

function drawStartScreen() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = "50px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText("Asteroid Defenders", canvas.width / 2, canvas.height / 2 - 50);

  ctx.font = "30px Arial";
  ctx.fillStyle = "#00FF00";
  ctx.fillText("Play", canvas.width / 2, canvas.height / 2 + 30);
}

canvas.addEventListener("click", function (event) {
  const mouseX = event.clientX - canvas.offsetLeft;
  const mouseY = event.clientY - canvas.offsetTop;

  const playButtonBounds = {
    x: canvas.width / 2 - 50,
    y: canvas.height / 2,
    width: 100,
    height: 40,
  };

  if (
    mouseX > playButtonBounds.x &&
    mouseX < playButtonBounds.x + playButtonBounds.width &&
    mouseY > playButtonBounds.y &&
    mouseY < playButtonBounds.y + playButtonBounds.height
  ) {
    if (
      currentState === GAME_STATE.START ||
      currentState === GAME_STATE.GAME_OVER
    ) {
      isGameLoopRunning = false;
    }
    if (currentState === GAME_STATE.START) {
      initializeGame();
      currentState = GAME_STATE.RUNNING;
    }
    if (currentState === GAME_STATE.GAME_OVER) {
      player.x = canvas.width / 2;
      player.y = canvas.height - 50;
      asteroids = [];
      blasts = [];
      initializeGame();
      shieldHealth = 100;
      currentState = GAME_STATE.RUNNING;
      gameStartTime = Date.now();
      draw(); 
    }
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === " " || event.key === "F" || event.key === "f") {
    shoot();
  }
});

canvas.addEventListener("mousedown", (event) => {
  if (event.button === 0) {
    shoot();
  }
});

function setKeyMovements(event, isKeyDown) {
  const movementMap = {
    ArrowUp: "moveUp",
    w: "moveUp",
    ArrowDown: "moveDown",
    s: "moveDown",
    ArrowLeft: "moveLeft",
    a: "moveLeft",
    ArrowRight: "moveRight",
    d: "moveRight",
  };
  if (movementMap[event.key]) player[movementMap[event.key]] = isKeyDown;
}

document.addEventListener("keydown", (event) => setKeyMovements(event, true));
document.addEventListener("keyup", (event) => setKeyMovements(event, false));

function timeToReachPlanet(asteroid) {
  const dx = planetPosition.x - asteroid.x;
  const dy = planetPosition.y - asteroid.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance / asteroid.speed;
}

function drawHealthBar() {
  const maxWidth = 200;
  const width = (shieldHealth / 100) * maxWidth;
  ctx.fillStyle = "red";
  ctx.fillRect(10, 10, width, 20);
  ctx.strokeRect(10, 10, maxWidth, 20);
}

function checkCollision(asteroid) {
  const dx = planetPosition.x - asteroid.x;
  const dy = planetPosition.y - asteroid.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance <= CONFIG.SHIELD_RADIUS + asteroid.size;
}

function handleCollision(asteroid) {
  shieldHealth -= asteroid.size;
  if (shieldHealth < 0) shieldHealth = 0;
}

function displayTimer() {
  const seconds = Math.floor((elapsedTime / 1000) % 60);
  const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
  const hours = Math.floor(elapsedTime / (1000 * 60 * 60));

  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  ctx.font = "24px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText(formattedTime, canvas.width / 2, 30);
}

async function initializeGame() {
  asteroids = []; 
  await fetchAsteroids(); 
  gameStartTime = Date.now(); 
  draw(); 
}

function drawGameOverScreen() {
  ctx.fillStyle = "rgba(0,0,0,0.8)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = "40px Arial";
  ctx.fillStyle = "red";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 40);

  const formattedTime = getFormattedTime();
  ctx.fillStyle = "white";
  ctx.fillText(
    `Time Survived: ${formattedTime}`,
    canvas.width / 2,
    canvas.height / 2
  );

  ctx.font = "30px Arial";
  ctx.fillStyle = "#00FF00";
  ctx.fillText("Play Again", canvas.width / 2, canvas.height / 2 + 30);
}

function getFormattedTime() {
  const seconds = Math.floor((elapsedTime / 1000) % 60);
  const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
  const hours = Math.floor(elapsedTime / (1000 * 60 * 60));

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function processAsteroids() {
  for (let i = 0; i < asteroids.length; i++) {
    let asteroid = asteroids[i];

    if (asteroid.delay > 0) {
      asteroid.delay -= 20;
      continue;
    }

    ctx.beginPath();
    ctx.arc(asteroid.x, asteroid.y, asteroid.size, 0, Math.PI * 2);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.closePath();

    asteroid.x += asteroid.direction.x * asteroid.speed;
    asteroid.y += asteroid.direction.y * asteroid.speed;

    if (checkCollision(asteroid)) {
      handleCollision(asteroid);
      asteroids.splice(i, 1);
      i--;
      continue;
    }

    if (
      asteroid.x < -asteroid.size ||
      asteroid.x > canvas.width + asteroid.size ||
      asteroid.y < -asteroid.size ||
      asteroid.y > canvas.height + asteroid.size
    ) {
      asteroids.splice(i, 1);
      i--;
    }
  }

  if (asteroids.length === 0 && !window.fetchingAsteroids) {
    window.fetchingAsteroids = true;
    setTimeout(() => {
      fetchAsteroids().then(() => {
        console.log("Fetched new asteroids.");
        window.fetchingAsteroids = false;
      });
    }, 5000);
  }
}

function processBlasts() {
  for (let i = 0; i < blasts.length; i++) {
    let blast = blasts[i];
    const elapsedTime = Date.now() - blast.creationTime;

    if (blast.radius < blast.maxRadius && elapsedTime < blast.lifetime) {
      blast.radius += blast.growthRate;

      ctx.beginPath();
      ctx.arc(blast.x, blast.y, blast.radius, 0, Math.PI * 2);
      ctx.strokeStyle = "white";
      ctx.stroke();
      ctx.closePath();
    } else {
      blasts.splice(i, 1);
      i--;
    }
  }
}

function handleBlastAsteroidCollisions() {
  for (let blast of blasts) {
    for (let i = 0; i < asteroids.length; i++) {
      let asteroid = asteroids[i];
      const dx = asteroid.x - blast.x;
      const dy = asteroid.y - blast.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= asteroid.size + blast.radius) {
        asteroids.splice(i, 1);
        i--;
      }
    }
  }
}

function drawRunningState() {
  elapsedTime = Date.now() - gameStartTime;
  displayTimer();
  drawShield();
  handlePlayerMovement();
  drawPlayer();

  ctx.beginPath();
  ctx.arc(planetPosition.x, planetPosition.y, 50, 0, Math.PI * 2);
  ctx.fillStyle = "blue";
  ctx.fill();
  ctx.closePath();

  processAsteroids();
  drawHealthBar();
  processBlasts();
  handleBlastAsteroidCollisions();

  if (shieldHealth <= 0) {
    currentState = GAME_STATE.GAME_OVER;
  }
}

function draw(timestamp = 0) {
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  if (!isGameLoopRunning) {
    requestAnimationFrame(draw);
    isGameLoopRunning = true;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  switch (currentState) {
    case GAME_STATE.GAME_OVER:
      drawGameOverScreen();
      break;
    case GAME_STATE.START:
      drawStartScreen();
      break;
    case GAME_STATE.RUNNING:
      drawRunningState();
      break;
  }

  requestAnimationFrame(draw);
}

currentState = GAME_STATE.START;
draw();
