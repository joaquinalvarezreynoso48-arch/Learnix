// Datos de los temas de programación
const programmingTopics = [
  {
    id: "fundamentos",
    title: "Fundamentos",
    description: "Conceptos básicos de programación y lógica.",
    icon: "💾",
    lessons: 20,
  },
  {
    id: "python",
    title: "Python",
    description: "Aprende el lenguaje más versátil y popular.",
    icon: "🐍",
    lessons: 25,
  },
  {
    id: "javascript",
    title: "JavaScript",
    description: "El lenguaje de la web moderna y aplicaciones.",
    icon: "🌐",
    lessons: 28,
  },
  {
    id: "html-css",
    title: "HTML & CSS",
    description: "Estructura y diseño de páginas web.",
    icon: "🎨",
    lessons: 22,
  },
  {
    id: "algoritmos",
    title: "Algoritmos",
    description: "Estructuras de datos y algoritmos eficientes.",
    icon: "🧮",
    lessons: 30,
  },
  {
    id: "bases-datos",
    title: "Bases de Datos",
    description: "SQL y gestión de información.",
    icon: "🗄️",
    lessons: 18,
  },
  {
    id: "desarrollo-web",
    title: "Desarrollo Web",
    description: "Frameworks y tecnologías web modernas.",
    icon: "🚀",
    lessons: 32,
  },
  {
    id: "movil",
    title: "Apps Móviles",
    description: "Desarrollo para Android e iOS.",
    icon: "📱",
    lessons: 26,
  },
  {
    id: "git",
    title: "Git & GitHub",
    description: "Control de versiones y colaboración.",
    icon: "🔧",
    lessons: 15,
  },
  {
    id: "api",
    title: "APIs & REST",
    description: "Integración y servicios web.",
    icon: "🔗",
    lessons: 20,
  },
  {
    id: "testing",
    title: "Testing",
    description: "Pruebas unitarias y calidad de código.",
    icon: "🧪",
    lessons: 16,
  },
  {
    id: "seguridad",
    title: "Seguridad",
    description: "Buenas prácticas y protección de aplicaciones.",
    icon: "🔒",
    lessons: 14,
  },
  {
    id: "ia-ml",
    title: "IA & Machine Learning",
    description: "Inteligencia artificial y aprendizaje automático.",
    icon: "🤖",
    lessons: 24,
  },
  {
    id: "devops",
    title: "DevOps",
    description: "Despliegue, CI/CD y automatización.",
    icon: "⚙️",
    lessons: 19,
  },
  {
    id: "proyectos",
    title: "Proyectos Reales",
    description: "Construye aplicaciones completas desde cero.",
    icon: "🏗️",
    lessons: 35,
  },
]

// Estado de la aplicación
let isDarkMode = true
let coins = 150
let userXP = 60

// Elementos del DOM
const themeToggle = document.getElementById("themeToggle")
const profileBtn = document.getElementById("profileBtn")
const programmingGrid = document.getElementById("programmingGrid")
const coinCount = document.getElementById("coinCount")
const xpFill = document.getElementById("xpFill")
const xpValue = document.getElementById("xpValue")

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
  renderProgrammingCards()
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

function renderProgrammingCards() {
  programmingGrid.innerHTML = ""

  programmingTopics.forEach((topic, index) => {
    const card = createProgrammingCard(topic, index)
    programmingGrid.appendChild(card)
  })
}

function createProgrammingCard(topic, index) {
  const card = document.createElement("div")
  card.className = "card code-animation"
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
  // Simular ganancia de monedas (más alta por la complejidad)
  coins += 20
  localStorage.setItem("coins", coins)
  updateUI()

  // Mostrar feedback visual
  showNotification(`¡Has seleccionado ${topic.title}! +20 monedas`)

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
        background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius);
        box-shadow: var(--shadow);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        font-family: 'Courier New', monospace;
        border: 1px solid rgba(245, 158, 11, 0.3);
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
programmingGrid.addEventListener("click", (e) => {
  if (e.target.closest(".card")) {
    updateUserProgress()
  }
})

// Efectos especiales para programación
function addProgrammingEffects() {
  const cards = document.querySelectorAll(".card")

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      // Efecto de código binario para ciertos temas
      const topic = card.querySelector("h3").textContent
      if (topic.includes("Algoritmos") || topic.includes("IA") || topic.includes("Python")) {
        createBinaryCodeEffect(card)
      }
    })
  })
}

function createBinaryCodeEffect(element) {
  // Crear código binario que fluye
  for (let i = 0; i < 12; i++) {
    const binary = document.createElement("div")
    binary.textContent = Math.random() > 0.5 ? "1" : "0"
    binary.style.cssText = `
      position: absolute;
      color: var(--accent-primary);
      font-size: ${Math.random() * 6 + 10}px;
      font-weight: bold;
      pointer-events: none;
      animation: binaryStream 2s linear forwards;
      opacity: 0.8;
      font-family: 'Courier New', monospace;
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
  @keyframes binaryStream {
    0% {
      opacity: 0.8;
      transform: translateY(0) rotate(0deg);
    }
    50% {
      opacity: 0.4;
      transform: translateY(50px) rotate(180deg);
    }
    100% {
      opacity: 0;
      transform: translateY(100px) rotate(360deg);
    }
  }
`
document.head.appendChild(binaryStyle)

// Inicializar efectos especiales después de renderizar las tarjetas
setTimeout(addProgrammingEffects, 1000)

// Efecto de código en el fondo
function createCodeRainEffect() {
  const codeSymbols = [
    "function()",
    "const",
    "let",
    "var",
    "if",
    "else",
    "for",
    "while",
    "class",
    "import",
    "export",
    "return",
    "async",
    "await",
    "=>",
    "{}",
    "[]",
    "()",
    "&&",
    "||",
    "===",
    "!==",
    "++",
    "--",
    "+=",
    "console.log",
    "document",
    "window",
    "null",
    "undefined",
    "true",
    "false",
  ]

  setInterval(() => {
    const symbol = document.createElement("div")
    symbol.textContent = codeSymbols[Math.floor(Math.random() * codeSymbols.length)]
    symbol.style.cssText = `
      position: fixed;
      top: -30px;
      left: ${Math.random() * 100}%;
      color: var(--accent-primary);
      font-size: ${Math.random() * 8 + 12}px;
      font-weight: bold;
      opacity: 0.1;
      pointer-events: none;
      z-index: 1;
      animation: codeRain 12s linear forwards;
      font-family: 'Courier New', monospace;
    `

    document.body.appendChild(symbol)

    setTimeout(() => {
      if (symbol.parentNode) {
        document.body.removeChild(symbol)
      }
    }, 12000)
  }, 800)
}

// Añadir animación de lluvia de código
const codeRainStyle = document.createElement("style")
codeRainStyle.textContent = `
  @keyframes codeRain {
    0% {
      transform: translateY(-30px) rotate(0deg);
      opacity: 0.1;
    }
    10% {
      opacity: 0.3;
    }
    90% {
      opacity: 0.05;
    }
    100% {
      transform: translateY(100vh) rotate(360deg);
      opacity: 0;
    }
  }
`
document.head.appendChild(codeRainStyle)

// Inicializar efecto de lluvia de código
setTimeout(createCodeRainEffect, 2000)

// Efecto de terminal en el fondo
function createTerminalEffect() {
  const terminalCommands = [
    "$ npm install",
    "$ git commit -m",
    "$ python main.py",
    "$ node server.js",
    "$ mkdir project",
    "$ cd src/",
    "$ ls -la",
    "$ git push origin",
    "$ npm start",
    "$ pip install",
    "$ docker run",
    "$ yarn build",
  ]

  setInterval(() => {
    const command = document.createElement("div")
    command.textContent = terminalCommands[Math.floor(Math.random() * terminalCommands.length)]
    command.style.cssText = `
      position: fixed;
      top: -20px;
      left: ${Math.random() * 100}%;
      color: var(--accent-secondary);
      font-size: 14px;
      font-weight: normal;
      opacity: 0.08;
      pointer-events: none;
      z-index: 1;
      animation: terminalScroll 15s linear forwards;
      font-family: 'Courier New', monospace;
    `

    document.body.appendChild(command)

    setTimeout(() => {
      if (command.parentNode) {
        document.body.removeChild(command)
      }
    }, 15000)
  }, 2500)
}

// Añadir animación de terminal
const terminalStyle = document.createElement("style")
terminalStyle.textContent = `
  @keyframes terminalScroll {
    0% {
      transform: translateY(-20px);
      opacity: 0.08;
    }
    20% {
      opacity: 0.15;
    }
    80% {
      opacity: 0.05;
    }
    100% {
      transform: translateY(100vh);
      opacity: 0;
    }
  }
`
document.head.appendChild(terminalStyle)

// Inicializar efecto de terminal
setTimeout(createTerminalEffect, 4000)

// Efecto de typing en el título
function addTypingEffect() {
  const title = document.querySelector(".main-title")
  if (title) {
    const originalText = title.textContent
    title.textContent = ""

    let i = 0
    const typeInterval = setInterval(() => {
      title.textContent += originalText[i]
      i++
      if (i >= originalText.length) {
        clearInterval(typeInterval)
        // Añadir cursor parpadeante
        const cursor = document.createElement("span")
        cursor.textContent = "_"
        cursor.style.cssText = `
          animation: cursorBlink 1s infinite;
          color: var(--accent-primary);
        `
        title.appendChild(cursor)
      }
    }, 100)
  }
}

// Añadir animación de cursor
const cursorStyle = document.createElement("style")
cursorStyle.textContent = `
  @keyframes cursorBlink {
    0%, 50% {
      opacity: 1;
    }
    51%, 100% {
      opacity: 0;
    }
  }
`
document.head.appendChild(cursorStyle)

// Inicializar efecto de typing
setTimeout(addTypingEffect, 500)

// Efecto de compilación exitosa
function showCompileSuccess() {
  const success = document.createElement("div")
  success.textContent = "✓ Compilation successful!"
  success.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: linear-gradient(135deg, #10b981, #34d399);
    color: white;
    padding: 0.75rem 1rem;
    border-radius: var(--radius);
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
    z-index: 1000;
    animation: slideInUp 0.3s ease;
  `

  document.body.appendChild(success)

  setTimeout(() => {
    success.style.animation = "slideOutDown 0.3s ease"
    setTimeout(() => {
      if (success.parentNode) {
        document.body.removeChild(success)
      }
    }, 300)
  }, 2000)
}

// Añadir animaciones para el mensaje de compilación
const compileStyle = document.createElement("style")
compileStyle.textContent = `
  @keyframes slideInUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutDown {
    from {
      transform: translateY(0);
      opacity: 1;
    }
    to {
      transform: translateY(100%);
      opacity: 0;
    }
  }
`
document.head.appendChild(compileStyle)

// Mostrar mensaje de compilación exitosa ocasionalmente
setInterval(() => {
  if (Math.random() > 0.7) {
    showCompileSuccess()
  }
}, 10000)
