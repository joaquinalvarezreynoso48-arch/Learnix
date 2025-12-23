// Datos de los temas de tecnología
const technologyTopics = [
  {
    id: "programacion-basica",
    title: "Programación Básica",
    description: "Fundamentos de la programación y algoritmos.",
    icon: "💻",
    lessons: 20,
  },
  {
    id: "desarrollo-web",
    title: "Desarrollo Web",
    description: "HTML, CSS, JavaScript y frameworks modernos.",
    icon: "🌐",
    lessons: 25,
  },
  {
    id: "inteligencia-artificial",
    title: "Inteligencia Artificial",
    description: "Machine Learning y redes neuronales.",
    icon: "🤖",
    lessons: 18,
  },
  {
    id: "ciberseguridad",
    title: "Ciberseguridad",
    description: "Protección de datos y sistemas informáticos.",
    icon: "🔒",
    lessons: 16,
  },
  {
    id: "bases-de-datos",
    title: "Bases de Datos",
    description: "Diseño y gestión de bases de datos.",
    icon: "🗄️",
    lessons: 14,
  },
  {
    id: "redes-informaticas",
    title: "Redes Informáticas",
    description: "Protocolos, topologías y administración de redes.",
    icon: "🌍",
    lessons: 15,
  },
  {
    id: "desarrollo-movil",
    title: "Desarrollo Móvil",
    description: "Apps para Android e iOS.",
    icon: "📱",
    lessons: 22,
  },
  {
    id: "cloud-computing",
    title: "Cloud Computing",
    description: "Servicios en la nube y arquitecturas distribuidas.",
    icon: "☁️",
    lessons: 17,
  },
  {
    id: "blockchain",
    title: "Blockchain",
    description: "Tecnología blockchain y criptomonedas.",
    icon: "⛓️",
    lessons: 12,
  },
  {
    id: "iot",
    title: "Internet de las Cosas",
    description: "Dispositivos conectados y sensores.",
    icon: "📡",
    lessons: 13,
  },
  {
    id: "robotica",
    title: "Robótica",
    description: "Diseño y programación de robots.",
    icon: "🤖",
    lessons: 19,
  },
  {
    id: "realidad-virtual",
    title: "Realidad Virtual/AR",
    description: "Experiencias inmersivas y realidad aumentada.",
    icon: "🥽",
    lessons: 14,
  },
  {
    id: "big-data",
    title: "Big Data",
    description: "Análisis de grandes volúmenes de datos.",
    icon: "📊",
    lessons: 16,
  },
  {
    id: "devops",
    title: "DevOps",
    description: "Integración continua y despliegue automatizado.",
    icon: "⚙️",
    lessons: 15,
  },
  {
    id: "quantum-computing",
    title: "Computación Cuántica",
    description: "Principios de la computación cuántica.",
    icon: "⚛️",
    lessons: 10,
  },
]

// Estado de la aplicación
let isDarkMode = true
let coins = 150
let userXP = 60

// Elementos del DOM
const themeToggle = document.getElementById("themeToggle")
const profileBtn = document.getElementById("profileBtn")
const technologyGrid = document.getElementById("technologyGrid")
const coinCount = document.getElementById("coinCount")
const xpFill = document.getElementById("xpFill")
const xpValue = document.getElementById("xpValue")

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
  renderTechnologyCards()
  setupEventListeners()
})

function initializeApp() {
  // Cargar tema guardado
  const savedTheme = localStorage.getItem("theme")
  if (savedTheme === "light") {
    toggleTheme()
  }

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
  const body = document.body
  const themeIcon = document.querySelector(".theme-icon")

  // Añadir animación de rotación
  themeToggle.classList.add("rotating")

  setTimeout(() => {
    if (isDarkMode) {
      body.classList.remove("light-mode")
      themeIcon.textContent = "🌙"
      localStorage.setItem("theme", "dark")
    } else {
      body.classList.add("light-mode")
      themeIcon.textContent = "☀️"
      localStorage.setItem("theme", "light")
    }

    themeToggle.classList.remove("rotating")
  }, 300)
}

function toggleProfile() {
  const isExpanded = profileBtn.getAttribute("aria-expanded") === "true"
  profileBtn.setAttribute("aria-expanded", !isExpanded)
}

function closeProfile() {
  profileBtn.setAttribute("aria-expanded", "false")
}

function renderTechnologyCards() {
  technologyGrid.innerHTML = ""

  technologyTopics.forEach((topic, index) => {
    const card = createTechnologyCard(topic, index)
    technologyGrid.appendChild(card)
  })
}

function createTechnologyCard(topic, index) {
  const card = document.createElement("div")
  card.className = "card circuit-animation"
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
  coins += 18
  localStorage.setItem("coins", coins)
  updateUI()

  // Mostrar feedback visual
  showNotification(`¡Has seleccionado ${topic.title}! +18 monedas`)

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
technologyGrid.addEventListener("click", (e) => {
  if (e.target.closest(".card")) {
    updateUserProgress()
  }
})

// Efectos especiales para tecnología
function addTechnologyEffects() {
  const cards = document.querySelectorAll(".card")

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      // Efecto de código binario para ciertos temas
      const topic = card.querySelector("h3").textContent
      if (topic.includes("Programación") || topic.includes("Inteligencia") || topic.includes("Blockchain")) {
        createBinaryEffect(card)
      }
    })
  })
}

function createBinaryEffect(element) {
  // Crear números binarios que fluyen
  for (let i = 0; i < 10; i++) {
    const binary = document.createElement("div")
    binary.textContent = Math.random() > 0.5 ? "1" : "0"
    binary.style.cssText = `
      position: absolute;
      color: var(--accent-primary);
      font-size: 12px;
      font-weight: bold;
      pointer-events: none;
      animation: binaryFlow 2s linear forwards;
      opacity: 0.7;
    `

    const rect = element.getBoundingClientRect()
    binary.style.left = Math.random() * rect.width + "px"
    binary.style.top = "0px"

    element.appendChild(binary)

    setTimeout(() => {
      if (binary.parentNode) {
        binary.parentNode.removeChild(binary)
      }
    }, 2000)
  }
}

// Añadir animación de flujo binario
const binaryStyle = document.createElement("style")
binaryStyle.textContent = `
  @keyframes binaryFlow {
    0% {
      opacity: 0.7;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(100px);
    }
  }
`
document.head.appendChild(binaryStyle)

// Inicializar efectos especiales después de renderizar las tarjetas
setTimeout(addTechnologyEffects, 1000)

// Efecto de código en el fondo
function createCodeEffect() {
  const codeSymbols = ["</>", "{}", "[]", "()", "&&", "||", "==", "!=", "++", "--", "=>", "::"]

  setInterval(() => {
    const symbol = document.createElement("div")
    symbol.textContent = codeSymbols[Math.floor(Math.random() * codeSymbols.length)]
    symbol.style.cssText = `
      position: fixed;
      top: -20px;
      left: ${Math.random() * 100}%;
      color: var(--accent-primary);
      font-size: 16px;
      font-weight: bold;
      opacity: 0.15;
      pointer-events: none;
      z-index: 1;
      animation: codeFloat 8s linear forwards;
      font-family: 'Courier New', monospace;
    `

    document.body.appendChild(symbol)

    setTimeout(() => {
      if (symbol.parentNode) {
        document.body.removeChild(symbol)
      }
    }, 8000)
  }, 1500)
}

// Añadir animación de código flotante
const codeStyle = document.createElement("style")
codeStyle.textContent = `
  @keyframes codeFloat {
    0% {
      transform: translateY(-20px) rotate(0deg);
      opacity: 0.15;
    }
    50% {
      opacity: 0.08;
    }
    100% {
      transform: translateY(100vh) rotate(180deg);
      opacity: 0;
    }
  }
`
document.head.appendChild(codeStyle)

// Inicializar efecto de código
setTimeout(createCodeEffect, 2000)

// Efecto de matriz digital
function createMatrixEffect() {
  const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?"

  setInterval(() => {
    const char = document.createElement("div")
    char.textContent = matrixChars[Math.floor(Math.random() * matrixChars.length)]
    char.style.cssText = `
      position: fixed;
      top: -30px;
      left: ${Math.random() * 100}%;
      color: var(--accent-primary);
      font-size: 14px;
      font-weight: bold;
      opacity: 0.1;
      pointer-events: none;
      z-index: 1;
      animation: matrixFall 6s linear forwards;
      font-family: 'Courier New', monospace;
    `

    document.body.appendChild(char)

    setTimeout(() => {
      if (char.parentNode) {
        document.body.removeChild(char)
      }
    }, 6000)
  }, 200)
}

// Añadir animación de matriz
const matrixStyle = document.createElement("style")
matrixStyle.textContent = `
  @keyframes matrixFall {
    0% {
      transform: translateY(-30px);
      opacity: 0.1;
    }
    10% {
      opacity: 0.3;
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
document.head.appendChild(matrixStyle)

// Inicializar efecto matriz
setTimeout(createMatrixEffect, 4000)

// Efecto de pulso en el logo para simular procesamiento
function addProcessingEffect() {
  const logo = document.querySelector(".logo")
  if (logo) {
    setInterval(() => {
      logo.style.animation = "none"
      setTimeout(() => {
        logo.style.animation = "pulse 1s ease-in-out"
      }, 10)
    }, 5000)
  }
}

// Inicializar efecto de procesamiento
setTimeout(addProcessingEffect, 3000)
