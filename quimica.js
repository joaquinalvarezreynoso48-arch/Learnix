// Datos de los temas de química
const chemistryTopics = [
  {
    id: "tabla-periodica",
    title: "Tabla Periódica",
    description: "Elementos químicos y sus propiedades.",
    icon: "🧪",
    lessons: 14,
  },
  {
    id: "enlaces-quimicos",
    title: "Enlaces Químicos",
    description: "Cómo se unen los átomos para formar moléculas.",
    icon: "🔗",
    lessons: 12,
  },
  {
    id: "reacciones-quimicas",
    title: "Reacciones Químicas",
    description: "Transformaciones de la materia y energía.",
    icon: "⚗️",
    lessons: 16,
  },
  {
    id: "estequiometria",
    title: "Estequiometría",
    description: "Cálculos químicos y proporciones.",
    icon: "⚖️",
    lessons: 10,
  },
  {
    id: "acidos-bases",
    title: "Ácidos y Bases",
    description: "pH, neutralización y soluciones.",
    icon: "🧬",
    lessons: 13,
  },
  {
    id: "quimica-organica",
    title: "Química Orgánica",
    description: "Compuestos del carbono y biomoléculas.",
    icon: "🌿",
    lessons: 18,
  },
  {
    id: "quimica-inorganica",
    title: "Química Inorgánica",
    description: "Compuestos sin carbono y minerales.",
    icon: "💎",
    lessons: 15,
  },
  {
    id: "termodinamica-quimica",
    title: "Termodinámica Química",
    description: "Energía en las reacciones químicas.",
    icon: "🔥",
    lessons: 11,
  },
  {
    id: "cinetica-quimica",
    title: "Cinética Química",
    description: "Velocidad de las reacciones químicas.",
    icon: "⏱️",
    lessons: 9,
  },
  {
    id: "electroquimica",
    title: "Electroquímica",
    description: "Reacciones con transferencia de electrones.",
    icon: "🔋",
    lessons: 12,
  },
  {
    id: "quimica-analitica",
    title: "Química Analítica",
    description: "Identificación y cuantificación de sustancias.",
    icon: "🔬",
    lessons: 14,
  },
  {
    id: "bioquimica",
    title: "Bioquímica",
    description: "Química de los seres vivos.",
    icon: "🧬",
    lessons: 17,
  },
  {
    id: "quimica-ambiental",
    title: "Química Ambiental",
    description: "Impacto químico en el medio ambiente.",
    icon: "🌍",
    lessons: 8,
  },
  {
    id: "cristalografia",
    title: "Cristalografía",
    description: "Estructura cristalina de los materiales.",
    icon: "💠",
    lessons: 10,
  },
  {
    id: "quimica-industrial",
    title: "Química Industrial",
    description: "Procesos químicos a gran escala.",
    icon: "🏭",
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
const chemistryGrid = document.getElementById("chemistryGrid")
const coinCount = document.getElementById("coinCount")
const xpFill = document.getElementById("xpFill")
const xpValue = document.getElementById("xpValue")

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
  renderChemistryCards()
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

function renderChemistryCards() {
  chemistryGrid.innerHTML = ""

  chemistryTopics.forEach((topic, index) => {
    const card = createChemistryCard(topic, index)
    chemistryGrid.appendChild(card)
  })
}

function createChemistryCard(topic, index) {
  const card = document.createElement("div")
  card.className = "card molecule-animation"
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
  coins += 12
  localStorage.setItem("coins", coins)
  updateUI()

  // Mostrar feedback visual
  showNotification(`¡Has seleccionado ${topic.title}! +12 monedas`)

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
chemistryGrid.addEventListener("click", (e) => {
  if (e.target.closest(".card")) {
    updateUserProgress()
  }
})

// Efectos especiales para química
function addChemistryEffects() {
  const cards = document.querySelectorAll(".card")

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      // Efecto de reacción química para ciertos temas
      const topic = card.querySelector("h3").textContent
      if (topic.includes("Reacciones") || topic.includes("Orgánica") || topic.includes("Bioquímica")) {
        createChemicalReaction(card)
      }
    })
  })
}

function createChemicalReaction(element) {
  // Crear burbujas que simulan una reacción química
  for (let i = 0; i < 8; i++) {
    const bubble = document.createElement("div")
    bubble.style.cssText = `
      position: absolute;
      width: ${Math.random() * 6 + 4}px;
      height: ${Math.random() * 6 + 4}px;
      background: var(--accent-primary);
      border-radius: 50%;
      pointer-events: none;
      animation: chemicalBubble 2s ease-out forwards;
      opacity: 0.8;
    `

    const rect = element.getBoundingClientRect()
    bubble.style.left = Math.random() * rect.width + "px"
    bubble.style.top = rect.height * 0.7 + "px"

    element.appendChild(bubble)

    setTimeout(() => {
      if (bubble.parentNode) {
        bubble.parentNode.removeChild(bubble)
      }
    }, 2000)
  }
}

// Añadir animación de burbujas químicas
const bubbleStyle = document.createElement("style")
bubbleStyle.textContent = `
  @keyframes chemicalBubble {
    0% {
      opacity: 0.8;
      transform: translateY(0) scale(1);
    }
    50% {
      opacity: 0.6;
      transform: translateY(-15px) scale(1.2);
    }
    100% {
      opacity: 0;
      transform: translateY(-30px) scale(0.5);
    }
  }
`
document.head.appendChild(bubbleStyle)

// Inicializar efectos especiales después de renderizar las tarjetas
setTimeout(addChemistryEffects, 1000)

// Efecto de tabla periódica en el fondo
function createPeriodicTableEffect() {
  const elements = ["H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar"]

  setInterval(() => {
    const element = document.createElement("div")
    element.textContent = elements[Math.floor(Math.random() * elements.length)]
    element.style.cssText = `
      position: fixed;
      top: -20px;
      left: ${Math.random() * 100}%;
      color: var(--accent-primary);
      font-size: 12px;
      font-weight: bold;
      opacity: 0.3;
      pointer-events: none;
      z-index: 1;
      animation: elementFall 8s linear forwards;
    `

    document.body.appendChild(element)

    setTimeout(() => {
      if (element.parentNode) {
        document.body.removeChild(element)
      }
    }, 8000)
  }, 3000)
}

// Añadir animación de elementos cayendo
const elementStyle = document.createElement("style")
elementStyle.textContent = `
  @keyframes elementFall {
    0% {
      transform: translateY(-20px) rotate(0deg);
      opacity: 0.3;
    }
    50% {
      opacity: 0.1;
    }
    100% {
      transform: translateY(100vh) rotate(360deg);
      opacity: 0;
    }
  }
`
document.head.appendChild(elementStyle)

// Inicializar efecto de tabla periódica
setTimeout(createPeriodicTableEffect, 2000)
