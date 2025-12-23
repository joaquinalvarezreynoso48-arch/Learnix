// Datos de los temas de ajedrez
const chessTopics = [
  {
    id: "reglas-basicas",
    title: "Reglas Básicas",
    description: "Aprende cómo se mueven las piezas y las reglas fundamentales.",
    icon: "♟️",
    lessons: 12,
  },
  {
    id: "aperturas",
    title: "Aperturas",
    description: "Domina las mejores formas de comenzar una partida.",
    icon: "♔",
    lessons: 18,
  },
  {
    id: "tacticas",
    title: "Tácticas",
    description: "Aprende patrones tácticos y combinaciones ganadoras.",
    icon: "⚔️",
    lessons: 22,
  },
  {
    id: "finales",
    title: "Finales",
    description: "Técnicas para convertir ventajas en victoria.",
    icon: "♕",
    lessons: 16,
  },
  {
    id: "estrategia",
    title: "Estrategia",
    description: "Planificación a largo plazo y evaluación posicional.",
    icon: "🧠",
    lessons: 20,
  },
  {
    id: "medio-juego",
    title: "Medio Juego",
    description: "Técnicas para la fase intermedia de la partida.",
    icon: "⚖️",
    lessons: 15,
  },
  {
    id: "defensa",
    title: "Defensa",
    description: "Cómo defenderse en posiciones difíciles.",
    icon: "🛡️",
    lessons: 14,
  },
  {
    id: "ataque",
    title: "Ataque",
    description: "Técnicas de ataque al rey y creación de amenazas.",
    icon: "⚡",
    lessons: 17,
  },
  {
    id: "psicologia",
    title: "Psicología",
    description: "Aspectos mentales y control emocional en el juego.",
    icon: "🎭",
    lessons: 10,
  },
  {
    id: "historia",
    title: "Historia del Ajedrez",
    description: "Evolución del juego y grandes maestros históricos.",
    icon: "📜",
    lessons: 8,
  },
  {
    id: "variantes",
    title: "Variantes",
    description: "Chess960, King of the Hill y otras modalidades.",
    icon: "🎲",
    lessons: 11,
  },
  {
    id: "analisis",
    title: "Análisis de Partidas",
    description: "Cómo estudiar y aprender de partidas magistrales.",
    icon: "🔍",
    lessons: 13,
  },
  {
    id: "torneos",
    title: "Torneos",
    description: "Preparación y estrategias para competiciones.",
    icon: "🏆",
    lessons: 9,
  },
  {
    id: "entrenamiento",
    title: "Entrenamiento",
    description: "Rutinas y ejercicios para mejorar tu nivel.",
    icon: "💪",
    lessons: 15,
  },
  {
    id: "ajedrez-online",
    title: "Ajedrez Online",
    description: "Plataformas digitales y recursos en línea.",
    icon: "💻",
    lessons: 7,
  },
]

// Estado de la aplicación
let isDarkMode = true
let coins = 150
let userXP = 60

// Elementos del DOM
const themeToggle = document.getElementById("themeToggle")
const profileBtn = document.getElementById("profileBtn")
const chessGrid = document.getElementById("chessGrid")
const coinCount = document.getElementById("coinCount")
const xpFill = document.getElementById("xpFill")
const xpValue = document.getElementById("xpValue")

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
  renderChessCards()
  setupEventListeners()
})

function initializeApp() {
  // Cargar tema guardado (consistente con toda la plataforma)
  const savedTheme = localStorage.getItem("learnix-theme")
  isDarkMode = savedTheme !== "light"
  applyTheme()

  // Cargar datos del usuario
  const savedCoins = localStorage.getItem("coins")
  const savedXP = localStorage.getItem("userXP")

  if (savedCoins) coins = Number.parseInt(savedCoins)
  if (savedXP) userXP = Number.parseInt(savedXP)

  updateUI()
}

function updateUI() {
  coinCount.textContent = coins
  xpFill.style.width = `${userXP}%`
  xpValue.textContent = userXP
}

function setupEventListeners() {
  // Toggle de tema
  themeToggle.addEventListener("click", toggleTheme)

  // Menú de perfil
  profileBtn.addEventListener("click", toggleProfile)

  // Cerrar menú de perfil al hacer clic fuera
  document.addEventListener("click", (e) => {
    if (!profileBtn.contains(e.target)) {
      closeProfile()
    }
  })

  // Manejar tecla Escape para cerrar menú
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeProfile()
    }
  })
}

function toggleTheme() {
  isDarkMode = !isDarkMode
  const themeIcon = document.querySelector(".theme-icon")
  themeToggle.classList.add("rotating")
  setTimeout(() => {
    applyTheme()
    localStorage.setItem("learnix-theme", isDarkMode ? "dark" : "light")
    localStorage.setItem("theme", isDarkMode ? "dark" : "light")
    themeToggle.classList.remove("rotating")
  }, 300)
}

function applyTheme() {
  document.documentElement.classList.toggle("light-mode", !isDarkMode)
  if (document.body) document.body.classList.toggle("light-mode", !isDarkMode)
  const themeIcon = document.querySelector(".theme-icon")
  if (themeIcon) themeIcon.textContent = isDarkMode ? "🌙" : "☀️"
}

// Sincronizar tema entre pestañas/secciones
window.addEventListener("storage", function(e) {
  if (e.key === "learnix-theme") {
    isDarkMode = e.newValue !== "light"
    applyTheme()
  }
})

function toggleProfile() {
  const isExpanded = profileBtn.getAttribute("aria-expanded") === "true"
  profileBtn.setAttribute("aria-expanded", !isExpanded)
}

function closeProfile() {
  profileBtn.setAttribute("aria-expanded", "false")
}

function renderChessCards() {
  chessGrid.innerHTML = ""

  chessTopics.forEach((topic, index) => {
    const card = createChessCard(topic, index)
    chessGrid.appendChild(card)
  })
}

function createChessCard(topic, index) {
  const card = document.createElement("div")
  card.className = "card chess-animation"
  card.style.animationDelay = `${index * 100}ms`

  card.innerHTML = `
        <div class="card-lessons">${topic.lessons} lecciones</div>
        <div class="card-icon">${topic.icon}</div>
        <h3>${topic.title}</h3>
        <p>${topic.description}</p>
    `

  // Añadir evento de clic
  card.addEventListener("click", () => {
    handleTopicClick(topic)
  })

  // Añadir animación de entrada
  setTimeout(() => {
    card.style.animation = "slideUp 0.6s ease forwards"
  }, index * 100)

  return card
}

function handleTopicClick(topic) {
  // Simular ganancia de monedas
  coins += 16
  localStorage.setItem("coins", coins)
  updateUI()

  // Mostrar feedback visual
  showNotification(`¡Has seleccionado ${topic.title}! +16 monedas`)

  // Aquí podrías redirigir a la página específica del tema
  console.log(`Navegando a: ${topic.id}`)
}

function showNotification(message) {
  // Crear elemento de notificación
  const notification = document.createElement("div")
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--accent-primary);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius);
        box-shadow: var(--shadow);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
    `
  notification.textContent = message

  document.body.appendChild(notification)

  // Remover después de 3 segundos
  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease"
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
}

// Añadir estilos para las notificaciones
const style = document.createElement("style")
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`
document.head.appendChild(style)

// Función para simular progreso del usuario
function updateUserProgress() {
  if (userXP < 100) {
    userXP += 5
    localStorage.setItem("userXP", userXP)
    updateUI()
  }
}

// Simular progreso cada vez que se hace clic en una tarjeta
chessGrid.addEventListener("click", (e) => {
  if (e.target.closest(".card")) {
    updateUserProgress()
  }
})

// Efectos especiales para ajedrez
function addChessEffects() {
  const cards = document.querySelectorAll(".card")

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      // Efecto de piezas moviéndose para ciertos temas
      const topic = card.querySelector("h3").textContent
      if (topic.includes("Tácticas") || topic.includes("Ataque") || topic.includes("Estrategia")) {
        createChessPieceEffect(card)
      }
    })
  })
}

function createChessPieceEffect(element) {
  // Crear piezas de ajedrez que se mueven
  const pieces = ["♔", "♕", "♖", "♗", "♘", "♙", "♚", "♛", "♜", "♝", "♞", "♟"]
  for (let i = 0; i < 6; i++) {
    const piece = document.createElement("div")
    piece.textContent = pieces[Math.floor(Math.random() * pieces.length)]
    piece.style.cssText = `
      position: absolute;
      color: var(--accent-primary);
      font-size: ${Math.random() * 8 + 16}px;
      pointer-events: none;
      animation: chessPieceMove 2s ease-out forwards;
      opacity: 0.7;
    `

    const rect = element.getBoundingClientRect()
    piece.style.left = Math.random() * rect.width + "px"
    piece.style.top = Math.random() * rect.height + "px"

    element.appendChild(piece)

    setTimeout(() => {
      if (piece.parentNode) {
        piece.parentNode.removeChild(piece)
      }
    }, 2000)
  }
}

// Añadir animación de movimiento de piezas
const pieceStyle = document.createElement("style")
pieceStyle.textContent = `
  @keyframes chessPieceMove {
    0% {
      opacity: 0.7;
      transform: translate(0, 0) rotate(0deg);
    }
    25% {
      opacity: 0.5;
      transform: translate(10px, -10px) rotate(90deg);
    }
    50% {
      opacity: 0.3;
      transform: translate(-5px, -20px) rotate(180deg);
    }
    75% {
      opacity: 0.2;
      transform: translate(15px, -15px) rotate(270deg);
    }
    100% {
      opacity: 0;
      transform: translate(0, -30px) rotate(360deg);
    }
  }
`
document.head.appendChild(pieceStyle)

// Inicializar efectos especiales después de renderizar las tarjetas
setTimeout(addChessEffects, 1000)

// Efecto de piezas de ajedrez flotantes en el fondo
function createFloatingPiecesEffect() {
  const pieces = ["♔", "♕", "♖", "♗", "♘", "♙"]

  setInterval(() => {
    const piece = document.createElement("div")
    piece.textContent = pieces[Math.floor(Math.random() * pieces.length)]
    piece.style.cssText = `
      position: fixed;
      top: -30px;
      left: ${Math.random() * 100}%;
      color: var(--accent-primary);
      font-size: ${Math.random() * 12 + 20}px;
      opacity: 0.1;
      pointer-events: none;
      z-index: 1;
      animation: pieceFloat 15s linear forwards;
    `

    document.body.appendChild(piece)

    setTimeout(() => {
      if (piece.parentNode) {
        document.body.removeChild(piece)
      }
    }, 15000)
  }, 3000)
}

// Añadir animación de piezas flotantes
const floatingStyle = document.createElement("style")
floatingStyle.textContent = `
  @keyframes pieceFloat {
    0% {
      transform: translateY(-30px) rotate(0deg);
      opacity: 0.1;
    }
    25% {
      opacity: 0.15;
      transform: translateY(25vh) rotate(90deg);
    }
    50% {
      opacity: 0.08;
      transform: translateY(50vh) rotate(180deg);
    }
    75% {
      opacity: 0.12;
      transform: translateY(75vh) rotate(270deg);
    }
    100% {
      transform: translateY(100vh) rotate(360deg);
      opacity: 0;
    }
  }
`
document.head.appendChild(floatingStyle)

// Inicializar efecto de piezas flotantes
setTimeout(createFloatingPiecesEffect, 2000)

// Efecto de notación algebraica
function createNotationEffect() {
  const moves = [
    "e4",
    "e5",
    "Nf3",
    "Nc6",
    "Bb5",
    "a6",
    "Ba4",
    "Nf6",
    "O-O",
    "Be7",
    "Re1",
    "b5",
    "Bb3",
    "d6",
    "c3",
    "O-O",
  ]

  setInterval(() => {
    const move = document.createElement("div")
    move.textContent = moves[Math.floor(Math.random() * moves.length)]
    move.style.cssText = `
      position: fixed;
      top: -20px;
      left: ${Math.random() * 100}%;
      color: var(--accent-primary);
      font-size: 14px;
      font-weight: bold;
      opacity: 0.15;
      pointer-events: none;
      z-index: 1;
      animation: notationFall 10s linear forwards;
      font-family: 'Courier New', monospace;
    `

    document.body.appendChild(move)

    setTimeout(() => {
      if (move.parentNode) {
        document.body.removeChild(move)
      }
    }, 10000)
  }, 2000)
}

// Añadir animación de notación
const notationStyle = document.createElement("style")
notationStyle.textContent = `
  @keyframes notationFall {
    0% {
      transform: translateY(-20px);
      opacity: 0.15;
    }
    10% {
      opacity: 0.2;
    }
    90% {
      opacity: 0.1;
    }
    100% {
      transform: translateY(100vh);
      opacity: 0;
    }
  }
`
document.head.appendChild(notationStyle)

// Inicializar efecto de notación
setTimeout(createNotationEffect, 4000)

// Efecto de corona flotante en el título
function addCrownEffect() {
  const title = document.querySelector(".main-title")
  if (title) {
    // Ya tiene el efecto en CSS, pero podemos añadir interactividad
    title.addEventListener("mouseenter", () => {
      const crown = title.querySelector("::after")
      // El efecto ya está en CSS con la animación crownFloat
    })
  }
}

// Inicializar efecto de corona
setTimeout(addCrownEffect, 1000)

// Sonido de movimiento de pieza (simulado con vibración en móviles)
function simulateChessMove() {
  if (navigator.vibrate) {
    navigator.vibrate([50, 30, 50])
  }
}

// Añadir sonido simulado al hacer clic en las tarjetas
chessGrid.addEventListener("click", (e) => {
  if (e.target.closest(".card")) {
    simulateChessMove()
  }
})
