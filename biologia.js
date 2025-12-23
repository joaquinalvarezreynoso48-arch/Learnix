// Datos de los temas de biología
const biologyTopics = [
  {
    id: "celula",
    title: "La Célula",
    description: "Unidad básica de la vida y sus organelos.",
    icon: "🔬",
    lessons: 15,
  },
  {
    id: "genetica",
    title: "Genética",
    description: "Herencia, ADN y expresión génica.",
    icon: "🧬",
    lessons: 18,
  },
  {
    id: "evolucion",
    title: "Evolución",
    description: "Origen y diversificación de las especies.",
    icon: "🦕",
    lessons: 14,
  },
  {
    id: "ecosistemas",
    title: "Ecosistemas",
    description: "Interacciones entre organismos y ambiente.",
    icon: "🌍",
    lessons: 12,
  },
  {
    id: "anatomia-humana",
    title: "Anatomía Humana",
    description: "Estructura del cuerpo humano.",
    icon: "💪🏻",
    lessons: 20,
  },
  {
    id: "botanica",
    title: "Botánica",
    description: "Estudio de las plantas y su fisiología.",
    icon: "🌱",
    lessons: 16,
  },
  {
    id: "zoologia",
    title: "Zoología",
    description: "Diversidad y comportamiento animal.",
    icon: "🦁",
    lessons: 17,
  },
  {
    id: "microbiologia",
    title: "Microbiología",
    description: "Bacterias, virus y microorganismos.",
    icon: "🦠",
    lessons: 13,
  },
  {
    id: "biologia-molecular",
    title: "Biología Molecular",
    description: "Procesos moleculares de la vida.",
    icon: "⚛️",
    lessons: 19,
  },
  {
    id: "fisiologia",
    title: "Fisiología",
    description: "Funcionamiento de los sistemas vivos.",
    icon: "💓",
    lessons: 16,
  },
  {
    id: "ecologia",
    title: "Ecología",
    description: "Relaciones entre organismos y ambiente.",
    icon: "🌿",
    lessons: 11,
  },
  {
    id: "biotecnologia",
    title: "Biotecnología",
    description: "Aplicaciones tecnológicas de la biología.",
    icon: "🧪",
    lessons: 14,
  },
  {
    id: "neurobiologia",
    title: "Neurobiología",
    description: "Sistema nervioso y comportamiento.",
    icon: "🧠",
    lessons: 15,
  },
  {
    id: "inmunologia",
    title: "Inmunología",
    description: "Sistema inmune y defensa del organismo.",
    icon: "🛡️",
    lessons: 12,
  },
  {
    id: "biologia-marina",
    title: "Biología Marina",
    description: "Vida en los océanos y ecosistemas acuáticos.",
    icon: "🐠",
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
const biologyGrid = document.getElementById("biologyGrid")
const coinCount = document.getElementById("coinCount")
const xpFill = document.getElementById("xpFill")
const xpValue = document.getElementById("xpValue")

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
  renderBiologyCards()
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
    localStorage.setItem("theme", isDarkMode ? "dark" : "light") // compatibilidad
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

function renderBiologyCards() {
  biologyGrid.innerHTML = ""

  biologyTopics.forEach((topic, index) => {
    const card = createBiologyCard(topic, index)
    biologyGrid.appendChild(card)
  })
}

function createBiologyCard(topic, index) {
  const card = document.createElement("div")
  card.className = "card cell-animation"
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
  coins += 14
  localStorage.setItem("coins", coins)
  updateUI()

  // Mostrar feedback visual
  showNotification(`¡Has seleccionado ${topic.title}! +14 monedas`)

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
biologyGrid.addEventListener("click", (e) => {
  if (e.target.closest(".card")) {
    updateUserProgress()
  }
})

// Efectos especiales para biología
function addBiologyEffects() {
  const cards = document.querySelectorAll(".card")

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      // Efecto de división celular para ciertos temas
      const topic = card.querySelector("h3").textContent
      if (topic.includes("Célula") || topic.includes("Genética") || topic.includes("Molecular")) {
        createCellDivision(card)
      }
    })
  })
}

function createCellDivision(element) {
  // Crear células que se dividen
  for (let i = 0; i < 6; i++) {
    const cell = document.createElement("div")
    cell.style.cssText = `
      position: absolute;
      width: ${Math.random() * 8 + 6}px;
      height: ${Math.random() * 8 + 6}px;
      background: var(--accent-primary);
      border-radius: 50%;
      pointer-events: none;
      animation: cellGrowth 3s ease-out forwards;
      opacity: 0.6;
    `

    const rect = element.getBoundingClientRect()
    cell.style.left = Math.random() * rect.width + "px"
    cell.style.top = Math.random() * rect.height + "px"

    element.appendChild(cell)

    setTimeout(() => {
      if (cell.parentNode) {
        cell.parentNode.removeChild(cell)
      }
    }, 3000)
  }
}

// Añadir animación de crecimiento celular
const cellStyle = document.createElement("style")
cellStyle.textContent = `
  @keyframes cellGrowth {
    0% {
      opacity: 0.6;
      transform: scale(0.5);
    }
    50% {
      opacity: 0.4;
      transform: scale(1.5);
    }
    100% {
      opacity: 0;
      transform: scale(2);
    }
  }
`
document.head.appendChild(cellStyle)

// Inicializar efectos especiales después de renderizar las tarjetas
setTimeout(addBiologyEffects, 1000)

// Efecto de ADN en el fondo
function createDNAEffect() {
  const dnaElements = ["A", "T", "G", "C"]

  setInterval(() => {
    const element = document.createElement("div")
    element.textContent = dnaElements[Math.floor(Math.random() * dnaElements.length)]
    element.style.cssText = `
      position: fixed;
      top: -20px;
      left: ${Math.random() * 100}%;
      color: var(--accent-primary);
      font-size: 14px;
      font-weight: bold;
      opacity: 0.2;
      pointer-events: none;
      z-index: 1;
      animation: dnaFloat 10s linear forwards;
    `

    document.body.appendChild(element)

    setTimeout(() => {
      if (element.parentNode) {
        document.body.removeChild(element)
      }
    }, 10000)
  }, 2000)
}

// Añadir animación de ADN flotante
const dnaStyle = document.createElement("style")
dnaStyle.textContent = `
  @keyframes dnaFloat {
    0% {
      transform: translateY(-20px) rotate(0deg);
      opacity: 0.2;
    }
    50% {
      opacity: 0.1;
    }
    100% {
      transform: translateY(100vh) rotate(180deg);
      opacity: 0;
    }
  }
`
document.head.appendChild(dnaStyle)

// Inicializar efecto de ADN
setTimeout(createDNAEffect, 3000)

// Efecto de hojas cayendo para temas de botánica
function createLeafEffect() {
  const leaves = ["🍃", "🌿", "🍀", "🌱"]

  setInterval(() => {
    const leaf = document.createElement("div")
    leaf.textContent = leaves[Math.floor(Math.random() * leaves.length)]
    leaf.style.cssText = `
      position: fixed;
      top: -30px;
      left: ${Math.random() * 100}%;
      font-size: ${Math.random() * 10 + 16}px;
      opacity: 0.3;
      pointer-events: none;
      z-index: 1;
      animation: leafFall 12s ease-in-out forwards;
    `

    document.body.appendChild(leaf)

    setTimeout(() => {
      if (leaf.parentNode) {
        document.body.removeChild(leaf)
      }
    }, 12000)
  }, 4000)
}

// Añadir animación de hojas cayendo
const leafStyle = document.createElement("style")
leafStyle.textContent = `
  @keyframes leafFall {
    0% {
      transform: translateY(-30px) rotate(0deg);
      opacity: 0.3;
    }
    25% {
      transform: translateY(25vh) rotate(90deg);
      opacity: 0.2;
    }
    50% {
      transform: translateY(50vh) rotate(180deg);
      opacity: 0.15;
    }
    75% {
      transform: translateY(75vh) rotate(270deg);
      opacity: 0.1;
    }
    100% {
      transform: translateY(100vh) rotate(360deg);
      opacity: 0;
    }
  }
`
document.head.appendChild(leafStyle)

// Inicializar efecto de hojas
setTimeout(createLeafEffect, 5000)
