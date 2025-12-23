// Datos de los temas de lengua
const languageTopics = [
  {
    id: "gramatica",
    title: "Gramática",
    description: "Reglas y estructuras del idioma español.",
    icon: "📝",
    lessons: 18,
  },
  {
    id: "ortografia",
    title: "Ortografía",
    description: "Escritura correcta y reglas de acentuación.",
    icon: "✏️",
    lessons: 15,
  },
  {
    id: "literatura",
    title: "Literatura",
    description: "Obras clásicas y análisis literario.",
    icon: "📚",
    lessons: 22,
  },
  {
    id: "comprension-lectora",
    title: "Comprensión Lectora",
    description: "Técnicas para entender y analizar textos.",
    icon: "👁️",
    lessons: 16,
  },
  {
    id: "redaccion",
    title: "Redacción",
    description: "Técnicas de escritura y composición.",
    icon: "🖊️",
    lessons: 20,
  },
  {
    id: "sintaxis",
    title: "Sintaxis",
    description: "Estructura y orden de las oraciones.",
    icon: "🔗",
    lessons: 14,
  },
  {
    id: "semantica",
    title: "Semántica",
    description: "Significado de palabras y expresiones.",
    icon: "💭",
    lessons: 12,
  },
  {
    id: "morfologia",
    title: "Morfología",
    description: "Formación y estructura de las palabras.",
    icon: "🧩",
    lessons: 13,
  },
  {
    id: "fonetica",
    title: "Fonética",
    description: "Sonidos del habla y pronunciación.",
    icon: "🗣️",
    lessons: 11,
  },
  {
    id: "generos-literarios",
    title: "Géneros Literarios",
    description: "Narrativa, lírica, dramática y ensayo.",
    icon: "🎭",
    lessons: 17,
  },
  {
    id: "figuras-retoricas",
    title: "Figuras Retóricas",
    description: "Recursos expresivos y estilísticos.",
    icon: "🎨",
    lessons: 14,
  },
  {
    id: "historia-lengua",
    title: "Historia de la Lengua",
    description: "Evolución del español a través del tiempo.",
    icon: "📜",
    lessons: 15,
  },
  {
    id: "comunicacion",
    title: "Comunicación",
    description: "Técnicas de expresión oral y escrita.",
    icon: "💬",
    lessons: 16,
  },
  {
    id: "linguistica",
    title: "Lingüística",
    description: "Estudio científico del lenguaje.",
    icon: "🔬",
    lessons: 19,
  },
  {
    id: "escritura-creativa",
    title: "Escritura Creativa",
    description: "Técnicas para crear textos originales.",
    icon: "✨",
    lessons: 18,
  },
]

// Estado de la aplicación
let isDarkMode = true
let coins = 150
let userXP = 60

// Elementos del DOM
const themeToggle = document.getElementById("themeToggle")
const profileBtn = document.getElementById("profileBtn")
const languageGrid = document.getElementById("languageGrid")
const coinCount = document.getElementById("coinCount")
const xpFill = document.getElementById("xpFill")
const xpValue = document.getElementById("xpValue")

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
  renderLanguageCards()
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

function renderLanguageCards() {
  languageGrid.innerHTML = ""

  languageTopics.forEach((topic, index) => {
    const card = createLanguageCard(topic, index)
    languageGrid.appendChild(card)
  })
}

function createLanguageCard(topic, index) {
  const card = document.createElement("div")
  card.className = "card text-animation"
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
  coins += 13
  localStorage.setItem("coins", coins)
  updateUI()

  // Mostrar feedback visual
  showNotification(`¡Has seleccionado ${topic.title}! +13 monedas`)

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
languageGrid.addEventListener("click", (e) => {
  if (e.target.closest(".card")) {
    updateUserProgress()
  }
})

// Efectos especiales para lengua
function addLanguageEffects() {
  const cards = document.querySelectorAll(".card")

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      // Efecto de letras flotantes para ciertos temas
      const topic = card.querySelector("h3").textContent
      if (topic.includes("Literatura") || topic.includes("Escritura") || topic.includes("Redacción")) {
        createLetterEffect(card)
      }
    })
  })
}

function createLetterEffect(element) {
  // Crear letras que flotan
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  for (let i = 0; i < 8; i++) {
    const letter = document.createElement("div")
    letter.textContent = letters[Math.floor(Math.random() * letters.length)]
    letter.style.cssText = `
      position: absolute;
      color: var(--accent-primary);
      font-size: ${Math.random() * 8 + 12}px;
      font-weight: bold;
      pointer-events: none;
      animation: letterFloat 3s ease-out forwards;
      opacity: 0.6;
      font-family: 'Times New Roman', serif;
    `

    const rect = element.getBoundingClientRect()
    letter.style.left = Math.random() * rect.width + "px"
    letter.style.top = Math.random() * rect.height + "px"

    element.appendChild(letter)

    setTimeout(() => {
      if (letter.parentNode) {
        letter.parentNode.removeChild(letter)
      }
    }, 3000)
  }
}

// Añadir animación de letras flotantes
const letterStyle = document.createElement("style")
letterStyle.textContent = `
  @keyframes letterFloat {
    0% {
      opacity: 0.6;
      transform: translateY(0) rotate(0deg);
    }
    50% {
      opacity: 0.3;
      transform: translateY(-20px) rotate(180deg);
    }
    100% {
      opacity: 0;
      transform: translateY(-40px) rotate(360deg);
    }
  }
`
document.head.appendChild(letterStyle)

// Inicializar efectos especiales después de renderizar las tarjetas
setTimeout(addLanguageEffects, 1000)

// Efecto de palabras en el fondo
function createWordEffect() {
  const words = ["Palabra", "Texto", "Verso", "Prosa", "Rima", "Metáfora", "Símbolo", "Narrativa", "Diálogo", "Estilo"]

  setInterval(() => {
    const word = document.createElement("div")
    word.textContent = words[Math.floor(Math.random() * words.length)]
    word.style.cssText = `
      position: fixed;
      top: -30px;
      left: ${Math.random() * 100}%;
      color: var(--accent-primary);
      font-size: 18px;
      font-weight: 300;
      opacity: 0.1;
      pointer-events: none;
      z-index: 1;
      animation: wordFloat 12s linear forwards;
      font-family: 'Times New Roman', serif;
      font-style: italic;
    `

    document.body.appendChild(word)

    setTimeout(() => {
      if (word.parentNode) {
        document.body.removeChild(word)
      }
    }, 12000)
  }, 3000)
}

// Añadir animación de palabras flotantes
const wordStyle = document.createElement("style")
wordStyle.textContent = `
  @keyframes wordFloat {
    0% {
      transform: translateY(-30px) rotate(0deg);
      opacity: 0.1;
    }
    25% {
      opacity: 0.15;
    }
    50% {
      opacity: 0.08;
    }
    75% {
      opacity: 0.12;
    }
    100% {
      transform: translateY(100vh) rotate(10deg);
      opacity: 0;
    }
  }
`
document.head.appendChild(wordStyle)

// Inicializar efecto de palabras
setTimeout(createWordEffect, 2000)

// Efecto de signos de puntuación
function createPunctuationEffect() {
  const punctuation = [".", ",", ";", ":", "!", "?", "...", "—", "'", '"']

  setInterval(() => {
    const punct = document.createElement("div")
    punct.textContent = punctuation[Math.floor(Math.random() * punctuation.length)]
    punct.style.cssText = `
      position: fixed;
      top: -20px;
      left: ${Math.random() * 100}%;
      color: var(--accent-primary);
      font-size: 24px;
      font-weight: bold;
      opacity: 0.2;
      pointer-events: none;
      z-index: 1;
      animation: punctuationFall 8s ease-in-out forwards;
    `

    document.body.appendChild(punct)

    setTimeout(() => {
      if (punct.parentNode) {
        document.body.removeChild(punct)
      }
    }, 8000)
  }, 2000)
}

// Añadir animación de signos de puntuación
const punctuationStyle = document.createElement("style")
punctuationStyle.textContent = `
  @keyframes punctuationFall {
    0% {
      transform: translateY(-20px) rotate(0deg);
      opacity: 0.2;
    }
    25% {
      transform: translateY(25vh) rotate(90deg);
      opacity: 0.15;
    }
    50% {
      transform: translateY(50vh) rotate(180deg);
      opacity: 0.1;
    }
    75% {
      transform: translateY(75vh) rotate(270deg);
      opacity: 0.05;
    }
    100% {
      transform: translateY(100vh) rotate(360deg);
      opacity: 0;
    }
  }
`
document.head.appendChild(punctuationStyle)

// Inicializar efecto de puntuación
setTimeout(createPunctuationEffect, 4000)

// Efecto de escritura en el título
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
      }
    }, 150)
  }
}

// Inicializar efecto de escritura
setTimeout(addTypingEffect, 500)
