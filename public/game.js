const startScreen = document.getElementById("startScreen")
const gameScreen = document.getElementById("gameScreen")
const gameOverScreen = document.getElementById("gameOverScreen")
const startButton = document.getElementById("startButton")
const restartButton = document.getElementById("restartButton")
const scoreDisplay = document.getElementById("scoreDisplay")
const finalScore = document.getElementById("finalScore")
const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

let gameRunning = false
let score = 0
let frameCount = 0

const cat = {
  x: 100,
  y: canvas.height / 2,
  width: 50,
  height: 50,
  velocity: 0,
  gravity: 0.6,
  jumpStrength: -12,
  rotation: 0,
}

let zombieHands = []
let ghosts = []

const ZOMBIE_SPAWN_RATE = 90 // frames
const GHOST_SPAWN_RATE = 180 // frames
const ZOMBIE_SPEED = 3
const GHOST_SPEED = 7

function startGame() {
  startScreen.style.display = "none"
  gameScreen.classList.add("active")
  gameOverScreen.classList.remove("active")

  // Reset variáveis
  gameRunning = true
  score = 0
  frameCount = 0
  cat.y = canvas.height / 2
  cat.velocity = 0
  zombieHands = []
  ghosts = []

  gameLoop()
}

function endGame() {
  gameRunning = false
  gameScreen.classList.remove("active")
  gameOverScreen.classList.add("active")
  finalScore.textContent = `Pontuação: ${score}`
}

function restartGame() {
  startGame()
}

function jump() {
  if (gameRunning) {
    cat.velocity = cat.jumpStrength
  }
}

startButton.addEventListener("click", startGame)
restartButton.addEventListener("click", restartGame)

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault()
    jump()
  }
})

canvas.addEventListener("click", jump)
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault()
  jump()
})

function createZombieHand() {
  const gap = 200
  const minHeight = 50
  const maxHeight = canvas.height - gap - minHeight
  const height = Math.random() * (maxHeight - minHeight) + minHeight

  zombieHands.push({
    x: canvas.width,
    topHeight: height,
    bottomY: height + gap,
    width: 80,
    passed: false,
  })
}

function createGhost() {
  ghosts.push({
    x: canvas.width,
    y: Math.random() * (canvas.height - 100) + 50,
    width: 60,
    height: 60,
    speed: GHOST_SPEED,
  })
}

function drawCat() {
  ctx.save()
  ctx.translate(cat.x + cat.width / 2, cat.y + cat.height / 2)

  // Rotação baseada na velocidade
  cat.rotation = (Math.min(Math.max(cat.velocity * 2, -30), 90) * Math.PI) / 180
  ctx.rotate(cat.rotation)

  // Corpo do gato (círculo preto)
  ctx.fillStyle = "#000000"
  ctx.beginPath()
  ctx.arc(0, 0, cat.width / 2, 0, Math.PI * 2)
  ctx.fill()

  // Orelhas
  ctx.fillStyle = "#ffffff"
  ctx.beginPath()
  ctx.moveTo(-15, -20)
  ctx.lineTo(-10, -35)
  ctx.lineTo(-5, -20)
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(15, -20)
  ctx.lineTo(10, -35)
  ctx.lineTo(5, -20)
  ctx.fill()

  // Olhos
  ctx.fillStyle = "#00ff00"
  ctx.beginPath()
  ctx.arc(-10, -5, 6, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(10, -5, 6, 0, Math.PI * 2)
  ctx.fill()

  // Pupilas
  ctx.fillStyle = "#000000"
  ctx.beginPath()
  ctx.arc(-10, -5, 3, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(10, -5, 3, 0, Math.PI * 2)
  ctx.fill()

  // Focinho
  ctx.fillStyle = "#ffffff"
  ctx.beginPath()
  ctx.arc(0, 5, 4, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()
}

function drawZombieHand(hand) {
  // Mão superior
  ctx.fillStyle = "#7a9b76"
  ctx.fillRect(hand.x, 0, hand.width, hand.topHeight)

  // Dedos da mão superior
  ctx.fillStyle = "#5a7b56"
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(hand.x + i * 20 + 5, hand.topHeight - 30, 15, 30)
  }

  // Mão inferior
  ctx.fillStyle = "#7a9b76"
  ctx.fillRect(hand.x, hand.bottomY, hand.width, canvas.height - hand.bottomY)

  // Dedos da mão inferior
  ctx.fillStyle = "#5a7b56"
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(hand.x + i * 20 + 5, hand.bottomY, 15, 30)
  }

  // Unhas
  ctx.fillStyle = "#3a3a3a"
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(hand.x + i * 20 + 5, hand.topHeight - 30, 15, 5)
    ctx.fillRect(hand.x + i * 20 + 5, hand.bottomY, 15, 5)
  }
}

function drawGhost(ghost) {
  ctx.save()
  ctx.translate(ghost.x + ghost.width / 2, ghost.y + ghost.height / 2)

  // Corpo do fantasma
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
  ctx.beginPath()
  ctx.arc(0, -10, ghost.width / 2, Math.PI, 0, false)
  ctx.lineTo(ghost.width / 2, ghost.height / 2)

  // Ondulações na base
  for (let i = 0; i < 3; i++) {
    ctx.lineTo(ghost.width / 2 - i * (ghost.width / 6) - ghost.width / 12, ghost.height / 2 - 10)
    ctx.lineTo(ghost.width / 2 - i * (ghost.width / 6) - ghost.width / 6, ghost.height / 2)
  }

  ctx.lineTo(-ghost.width / 2, ghost.height / 2)
  ctx.closePath()
  ctx.fill()

  // Olhos
  ctx.fillStyle = "#000000"
  ctx.beginPath()
  ctx.arc(-10, -10, 5, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(10, -10, 5, 0, Math.PI * 2)
  ctx.fill()

  // Boca
  ctx.beginPath()
  ctx.arc(0, 0, 8, 0, Math.PI)
  ctx.stroke()

  ctx.restore()
}

function drawBackground() {
  // Céu noturno com gradiente
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
  gradient.addColorStop(0, "white")
  gradient.addColorStop(1, "#1a0a00")
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Lua
  ctx.fillStyle = "#ffcc66"
  ctx.beginPath()
  ctx.arc(canvas.width - 100, 80, 40, 0, Math.PI * 2)
  ctx.fill()

  // Estrelas
  ctx.fillStyle = "#ffffff"
  for (let i = 0; i < 50; i++) {
    const x = (i * 137 + frameCount * 0.1) % canvas.width
    const y = (i * 97) % (canvas.height / 2)
    ctx.fillRect(x, y, 2, 2)
  }

  // Chão
  ctx.fillStyle = "#2a1a0a"
  ctx.fillRect(0, canvas.height - 50, canvas.width, 50)

  // Grama
  ctx.fillStyle = "#1a3a1a"
  for (let i = 0; i < canvas.width; i += 20) {
    ctx.fillRect(i, canvas.height - 50, 10, 10)
  }
}

function checkCollision() {
  // Colisão com chão e teto
  if (cat.y + cat.height > canvas.height - 50 || cat.y < 0) {
    return true
  }

  // Colisão com mãos de zumbi
  for (const hand of zombieHands) {
    if (cat.x + cat.width > hand.x && cat.x < hand.x + hand.width) {
      if (cat.y < hand.topHeight || cat.y + cat.height > hand.bottomY) {
        return true
      }
    }
  }

  // Colisão com fantasmas
  for (const ghost of ghosts) {
    if (
      cat.x + cat.width > ghost.x &&
      cat.x < ghost.x + ghost.width &&
      cat.y + cat.height > ghost.y &&
      cat.y < ghost.y + ghost.height
    ) {
      return true
    }
  }

  return false
}

function gameLoop() {
  if (!gameRunning) return

  frameCount++

  // Limpar canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Desenhar cenário
  drawBackground()

  // Atualizar gato
  cat.velocity += cat.gravity
  cat.y += cat.velocity

  // Criar obstáculos
  if (frameCount % ZOMBIE_SPAWN_RATE === 0) {
    createZombieHand()
  }

  if (frameCount % GHOST_SPAWN_RATE === 0) {
    createGhost()
  }

  // Atualizar e desenhar mãos de zumbi
  for (let i = zombieHands.length - 1; i >= 0; i--) {
    zombieHands[i].x -= ZOMBIE_SPEED
    drawZombieHand(zombieHands[i])

    // Aumentar pontuação
    if (!zombieHands[i].passed && zombieHands[i].x + zombieHands[i].width < cat.x) {
      zombieHands[i].passed = true
      score++
      scoreDisplay.textContent = `Pontos: ${score}`
    }

    // Remover mãos fora da tela
    if (zombieHands[i].x + zombieHands[i].width < 0) {
      zombieHands.splice(i, 1)
    }
  }

  // Atualizar e desenhar fantasmas
  for (let i = ghosts.length - 1; i >= 0; i--) {
    ghosts[i].x -= ghosts[i].speed
    drawGhost(ghosts[i])

    // Remover fantasmas fora da tela
    if (ghosts[i].x + ghosts[i].width < 0) {
      ghosts.splice(i, 1)
    }
  }

  // Desenhar gato
  drawCat()

  // Verificar colisão
  if (checkCollision()) {
    endGame()
    return
  }

  requestAnimationFrame(gameLoop)
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
})