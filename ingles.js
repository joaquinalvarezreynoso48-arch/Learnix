// Datos de los temas de inglés
const englishTopics = [
  {
    id: "basics",
    title: "Basics",
    description: "Essential vocabulary and simple phrases.",
    icon: "🔤",
    lessons: 18,
  },
  {
    id: "grammar",
    title: "Grammar",
    description: "Verb tenses, sentence structure, and rules.",
    icon: "📝",
    lessons: 25,
  },
  {
    id: "vocabulary",
    title: "Vocabulary",
    description: "Expand your word bank with themed lessons.",
    icon: "📚",
    lessons: 30,
  },
  {
    id: "pronunciation",
    title: "Pronunciation",
    description: "Master sounds, stress, and intonation.",
    icon: "🗣️",
    lessons: 20,
  },
  {
    id: "listening",
    title: "Listening",
    description: "Improve comprehension with audio exercises.",
    icon: "👂",
    lessons: 22,
  },
  {
    id: "speaking",
    title: "Speaking",
    description: "Practice conversations and fluency.",
    icon: "💬",
    lessons: 24,
  },
  {
    id: "reading",
    title: "Reading",
    description: "Comprehension skills and text analysis.",
    icon: "📖",
    lessons: 19,
  },
  {
    id: "writing",
    title: "Writing",
    description: "Essays, emails, and creative writing.",
    icon: "✍️",
    lessons: 21,
  },
  {
    id: "business",
    title: "Business English",
    description: "Professional communication and terminology.",
    icon: "💼",
    lessons: 16,
  },
  {
    id: "travel",
    title: "Travel English",
    description: "Essential phrases for travelers.",
    icon: "✈️",
    lessons: 14,
  },
  {
    id: "idioms",
    title: "Idioms & Phrases",
    description: "Common expressions and their meanings.",
    icon: "🎭",
    lessons: 17,
  },
  {
    id: "culture",
    title: "Culture & Customs",
    description: "Learn about English-speaking countries.",
    icon: "🌍",
    lessons: 12,
  },
  {
    id: "exams",
    title: "Exam Preparation",
    description: "TOEFL, IELTS, and Cambridge preparation.",
    icon: "🎯",
    lessons: 26,
  },
  {
    id: "literature",
    title: "Literature",
    description: "Classic and modern English literature.",
    icon: "📜",
    lessons: 15,
  },
  {
    id: "slang",
    title: "Slang & Informal",
    description: "Modern expressions and casual language.",
    icon: "😎",
    lessons: 13,
  },
]

// Estado de la aplicación
let isDarkMode = true
let coins = 150
let userXP = 60

// Elementos del DOM
const themeToggle = document.getElementById("themeToggle")
const profileBtn = document.getElementById("profileBtn")
const englishGrid = document.getElementById("englishGrid")
const coinCount = document.getElementById("coinCount")
const xpFill = document.getElementById("xpFill")
const xpValue = document.getElementById("xpValue")

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
  renderEnglishCards()
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

function renderEnglishCards() {
  englishGrid.innerHTML = ""

  englishTopics.forEach((topic, index) => {
    const card = createEnglishCard(topic, index)
    englishGrid.appendChild(card)
  })
}

function createEnglishCard(topic, index) {
  const card = document.createElement("div")
  card.className = "card language-animation"
  card.style.animationDelay = `${index * 100}ms`

  card.innerHTML = `
        <div class="card-lessons">${topic.lessons} lessons</div>
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
  coins += 15
  localStorage.setItem("coins", coins)
  updateUI()

  // Mostrar feedback visual
  showNotification(`You selected ${topic.title}! +15 coins`)

  // Aquí podrías redirigir a la página específica del tema
  console.log(`Navigating to: ${topic.id}`)
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
        border: 1px solid rgba(6, 182, 212, 0.3);
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
englishGrid.addEventListener("click", (e) => {
  if (e.target.closest(".card")) {
    updateUserProgress()
  }
})

// Efectos especiales para inglés
function addEnglishEffects() {
  const cards = document.querySelectorAll(".card")

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      // Efecto de palabras flotantes para ciertos temas
      const topic = card.querySelector("h3").textContent
      if (topic.includes("Vocabulary") || topic.includes("Speaking") || topic.includes("Writing")) {
        createWordBubbleEffect(card)
      }
    })
  })
}

function createWordBubbleEffect(element) {
  // Crear burbujas de palabras en inglés
  const words = ["Hello", "World", "Learn", "Speak", "Write", "Read", "Listen", "Practice"]
  for (let i = 0; i < 6; i++) {
    const word = document.createElement("div")
    word.textContent = words[Math.floor(Math.random() * words.length)]
    word.style.cssText = `
      position: absolute;
      color: var(--accent-primary);
      font-size: ${Math.random() * 6 + 12}px;
      font-weight: 600;
      pointer-events: none;
      animation: wordBubble 2.5s ease-out forwards;
      opacity: 0.7;
      font-style: italic;
    `

    const rect = element.getBoundingClientRect()
    word.style.left = Math.random() * rect.width + "px"
    word.style.top = Math.random() * rect.height + "px"

    element.appendChild(word)

    setTimeout(() => {
      if (word.parentNode) {
        word.parentNode.removeChild(word)
      }
    }, 2500)
  }
}

// Añadir animación de burbujas de palabras
const wordBubbleStyle = document.createElement("style")
wordBubbleStyle.textContent = `
  @keyframes wordBubble {
    0% {
      opacity: 0.7;
      transform: translateY(0) scale(1);
    }
    50% {
      opacity: 0.4;
      transform: translateY(-15px) scale(1.1);
    }
    100% {
      opacity: 0;
      transform: translateY(-30px) scale(0.8);
    }
  }
`
document.head.appendChild(wordBubbleStyle)

// Inicializar efectos especiales después de renderizar las tarjetas
setTimeout(addEnglishEffects, 1000)

// Efecto de palabras en inglés flotantes en el fondo
function createFloatingWordsEffect() {
  const englishWords = [
    "Hello",
    "World",
    "Beautiful",
    "Amazing",
    "Wonderful",
    "Fantastic",
    "Incredible",
    "Awesome",
    "Perfect",
    "Excellent",
    "Outstanding",
    "Brilliant",
    "Magnificent",
    "Spectacular",
    "Extraordinary",
    "Remarkable",
  ]

  setInterval(() => {
    const word = document.createElement("div")
    word.textContent = englishWords[Math.floor(Math.random() * englishWords.length)]
    word.style.cssText = `
      position: fixed;
      top: -30px;
      left: ${Math.random() * 100}%;
      color: var(--accent-primary);
      font-size: ${Math.random() * 8 + 16}px;
      font-weight: 300;
      opacity: 0.08;
      pointer-events: none;
      z-index: 1;
      animation: wordFloat 14s linear forwards;
      font-style: italic;
    `

    document.body.appendChild(word)

    setTimeout(() => {
      if (word.parentNode) {
        document.body.removeChild(word)
      }
    }, 14000)
  }, 2000)
}

// Añadir animación de palabras flotantes
const floatingWordsStyle = document.createElement("style")
floatingWordsStyle.textContent = `
  @keyframes wordFloat {
    0% {
      transform: translateY(-30px) rotate(0deg);
      opacity: 0.08;
    }
    25% {
      opacity: 0.12;
      transform: translateY(25vh) rotate(5deg);
    }
    50% {
      opacity: 0.06;
      transform: translateY(50vh) rotate(-5deg);
    }
    75% {
      opacity: 0.10;
      transform: translateY(75vh) rotate(3deg);
    }
    100% {
      transform: translateY(100vh) rotate(0deg);
      opacity: 0;
    }
  }
`
document.head.appendChild(floatingWordsStyle)

// Inicializar efecto de palabras flotantes
setTimeout(createFloatingWordsEffect, 2000)

// Efecto de banderas flotantes
function createFlagEffect() {
  const flags = ["🇺🇸", "🇬🇧", "🇦🇺", "🇨🇦", "🇮🇪", "🇳🇿", "🇿🇦"]

  setInterval(() => {
    const flag = document.createElement("div")
    flag.textContent = flags[Math.floor(Math.random() * flags.length)]
    flag.style.cssText = `
      position: fixed;
      top: -30px;
      left: ${Math.random() * 100}%;
      font-size: ${Math.random() * 8 + 20}px;
      opacity: 0.15;
      pointer-events: none;
      z-index: 1;
      animation: flagWaveFloat 12s ease-in-out forwards;
    `

    document.body.appendChild(flag)

    setTimeout(() => {
      if (flag.parentNode) {
        document.body.removeChild(flag)
      }
    }, 12000)
  }, 4000)
}

// Añadir animación de banderas flotantes
const flagStyle = document.createElement("style")
flagStyle.textContent = `
  @keyframes flagWaveFloat {
    0% {
      transform: translateY(-30px) rotate(0deg);
      opacity: 0.15;
    }
    25% {
      transform: translateY(25vh) rotate(10deg);
      opacity: 0.2;
    }
    50% {
      transform: translateY(50vh) rotate(-10deg);
      opacity: 0.1;
    }
    75% {
      transform: translateY(75vh) rotate(5deg);
      opacity: 0.15;
    }
    100% {
      transform: translateY(100vh) rotate(0deg);
      opacity: 0;
    }
  }
`
document.head.appendChild(flagStyle)

// Inicializar efecto de banderas
setTimeout(createFlagEffect, 3000)

// Efecto de frases motivacionales en inglés
function createMotivationalPhrasesEffect() {
  const phrases = [
    "You can do it!",
    "Keep going!",
    "Practice makes perfect",
    "Never give up",
    "Believe in yourself",
    "Dream big",
    "Stay positive",
    "Learn every day",
  ]

  setInterval(() => {
    const phrase = document.createElement("div")
    phrase.textContent = phrases[Math.floor(Math.random() * phrases.length)]
    phrase.style.cssText = `
      position: fixed;
      top: -20px;
      left: ${Math.random() * 100}%;
      color: var(--accent-secondary);
      font-size: 14px;
      font-weight: 500;
      opacity: 0.12;
      pointer-events: none;
      z-index: 1;
      animation: phraseGlow 10s linear forwards;
      font-style: italic;
    `

    document.body.appendChild(phrase)

    setTimeout(() => {
      if (phrase.parentNode) {
        document.body.removeChild(phrase)
      }
    }, 10000)
  }, 3500)
}

// Añadir animación de frases motivacionales
const phraseStyle = document.createElement("style")
phraseStyle.textContent = `
  @keyframes phraseGlow {
    0% {
      transform: translateY(-20px);
      opacity: 0.12;
    }
    20% {
      opacity: 0.2;
      filter: brightness(1.2);
    }
    80% {
      opacity: 0.08;
    }
    100% {
      transform: translateY(100vh);
      opacity: 0;
    }
  }
`
document.head.appendChild(phraseStyle)

// Inicializar efecto de frases motivacionales
setTimeout(createMotivationalPhrasesEffect, 5000)

// Efecto de sonido de pronunciación (simulado con vibración en móviles)
function simulatePronunciation() {
  if (navigator.vibrate) {
    navigator.vibrate([100, 50, 100])
  }
}

// Añadir sonido simulado al hacer clic en las tarjetas
englishGrid.addEventListener("click", (e) => {
  if (e.target.closest(".card")) {
    simulatePronunciation()
  }
})

// Efecto de globo terráqueo orbitando
function addGlobeOrbitEffect() {
  const logo = document.querySelector(".logo")
  if (logo) {
    // El efecto ya está en CSS, pero podemos añadir interactividad
    logo.addEventListener("mouseenter", () => {
      logo.style.animation = "pulse 0.5s ease-in-out"
      setTimeout(() => {
        logo.style.animation = ""
      }, 500)
    })
  }
}

// Inicializar efecto de globo
setTimeout(addGlobeOrbitEffect, 1000)

// Cambiar idioma de notificaciones aleatoriamente
const originalShowNotification = showNotification
showNotification = (message) => {
  const spanishMessages = {
    "You selected Basics! +15 coins": "¡Seleccionaste Básicos! +15 monedas",
    "You selected Grammar! +15 coins": "¡Seleccionaste Gramática! +15 monedas",
    "You selected Vocabulary! +15 coins": "¡Seleccionaste Vocabulario! +15 monedas",
    "You selected Pronunciation! +15 coins": "¡Seleccionaste Pronunciación! +15 monedas",
    "You selected Listening! +15 coins": "¡Seleccionaste Comprensión Auditiva! +15 monedas",
    "You selected Speaking! +15 coins": "¡Seleccionaste Conversación! +15 monedas",
    "You selected Reading! +15 coins": "¡Seleccionaste Lectura! +15 monedas",
    "You selected Writing! +15 coins": "¡Seleccionaste Escritura! +15 monedas",
    "You selected Business English! +15 coins": "¡Seleccionaste Inglés de Negocios! +15 monedas",
    "You selected Travel English! +15 coins": "¡Seleccionaste Inglés de Viajes! +15 monedas",
    "You selected Idioms & Phrases! +15 coins": "¡Seleccionaste Modismos y Frases! +15 monedas",
    "You selected Culture & Customs! +15 coins": "¡Seleccionaste Cultura y Costumbres! +15 monedas",
    "You selected Exam Preparation! +15 coins": "¡Seleccionaste Preparación de Exámenes! +15 monedas",
    "You selected Literature! +15 coins": "¡Seleccionaste Literatura! +15 monedas",
    "You selected Slang & Informal! +15 coins": "¡Seleccionaste Jerga e Informal! +15 monedas",
  }

  // 50% de probabilidad de mostrar en español
  const finalMessage = Math.random() > 0.5 && spanishMessages[message] ? spanishMessages[message] : message

  originalShowNotification(finalMessage)
}
