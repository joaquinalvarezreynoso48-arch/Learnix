// Datos de los temas de física
const physicsTopics = [
  {
    id: "mecanica",
    title: "Mecánica Clásica",
    description: "Estudia el movimiento de los cuerpos y las fuerzas.",
    icon: "⚙️",
    lessons: 16,
  },
  {
    id: "termodinamica",
    title: "Termodinámica",
    description: "Calor, temperatura y transformaciones de energía.",
    icon: "🌡️",
    lessons: 12,
  },
  {
    id: "electromagnetismo",
    title: "Electromagnetismo",
    description: "Electricidad, magnetismo y ondas electromagnéticas.",
    icon: "⚡",
    lessons: 18,
  },
  {
    id: "optica",
    title: "Óptica",
    description: "Comportamiento y propiedades de la luz.",
    icon: "🔍",
    lessons: 10,
  },
  {
    id: "ondas",
    title: "Ondas y Sonido",
    description: "Propagación de ondas mecánicas y acústica.",
    icon: "🌊",
    lessons: 14,
  },
  {
    id: "fisica-moderna",
    title: "Física Moderna",
    description: "Relatividad, mecánica cuántica y física atómica.",
    icon: "⚛️",
    lessons: 20,
  },
  {
    id: "astronomia",
    title: "Astronomía",
    description: "Estudio del universo, estrellas y planetas.",
    icon: "🌌",
    lessons: 15,
  },
  {
    id: "fluidos",
    title: "Mecánica de Fluidos",
    description: "Comportamiento de líquidos y gases.",
    icon: "💧",
    lessons: 11,
  },
  {
    id: "cinematica",
    title: "Cinemática",
    description: "Descripción matemática del movimiento.",
    icon: "📐",
    lessons: 8,
  },
  {
    id: "dinamica",
    title: "Dinámica",
    description: "Fuerzas y su relación con el movimiento.",
    icon: "🚀",
    lessons: 13,
  },
  {
    id: "energia",
    title: "Energía y Trabajo",
    description: "Conservación de energía y transformaciones.",
    icon: "⚡",
    lessons: 9,
  },
  {
    id: "gravitacion",
    title: "Gravitación Universal",
    description: "Ley de gravitación y movimiento planetario.",
    icon: "🪐",
    lessons: 7,
  },
  {
    id: "fisica-nuclear",
    title: "Física Nuclear",
    description: "Estructura del núcleo y radiactividad.",
    icon: "☢️",
    lessons: 16,
  },
  {
    id: "particulas",
    title: "Física de Partículas",
    description: "Partículas elementales y fuerzas fundamentales.",
    icon: "🔬",
    lessons: 19,
  },
  {
    id: "biofisica",
    title: "Biofísica",
    description: "Aplicación de principios físicos a sistemas biológicos.",
    icon: "🧬",
    lessons: 12,
  },
]

// Estado de la aplicación
let isDarkMode = true
let coins = 150
let userXP = 60

// Elementos del DOM
const themeToggle = document.getElementById("themeToggle")
const profileBtn = document.getElementById("profileBtn")
const physicsGrid = document.getElementById("physicsGrid")
const coinCount = document.getElementById("coinCount")
const xpFill = document.getElementById("xpFill")
const xpValue = document.getElementById("xpValue")

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
  renderPhysicsCards()
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

function renderPhysicsCards() {
  physicsGrid.innerHTML = ""

  physicsTopics.forEach((topic, index) => {
    const card = createPhysicsCard(topic, index)
    physicsGrid.appendChild(card)
  })
}

function createPhysicsCard(topic, index) {
  const card = document.createElement("div")
  card.className = "card"
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
  coins += 15
  localStorage.setItem("coins", coins)
  updateUI()

  // Mostrar feedback visual
  showNotification(`¡Has seleccionado ${topic.title}! +15 monedas`)

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
physicsGrid.addEventListener("click", (e) => {
  if (e.target.closest(".card")) {
    updateUserProgress()
  }
})

// Efectos especiales para física
function addPhysicsEffects() {
  const cards = document.querySelectorAll(".card")

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      // Efecto de partículas para temas de física moderna
      const topic = card.querySelector("h3").textContent
      if (topic.includes("Moderna") || topic.includes("Nuclear") || topic.includes("Partículas")) {
        createParticleEffect(card)
      }
    })
  })
}

function createParticleEffect(element) {
  for (let i = 0; i < 5; i++) {
    const particle = document.createElement("div")
    particle.style.cssText = `
      position: absolute;
      width: 4px;
      height: 4px;
      background: var(--accent-primary);
      border-radius: 50%;
      pointer-events: none;
      animation: particle 1s ease-out forwards;
    `

    const rect = element.getBoundingClientRect()
    particle.style.left = Math.random() * rect.width + "px"
    particle.style.top = Math.random() * rect.height + "px"

    element.appendChild(particle)

    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle)
      }
    }, 1000)
  }
}

// Añadir animación de partículas
const particleStyle = document.createElement("style")
particleStyle.textContent = `
  @keyframes particle {
    0% {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
    100% {
      opacity: 0;
      transform: scale(0) translateY(-20px);
    }
  }
`
document.head.appendChild(particleStyle)

// Inicializar efectos especiales después de renderizar las tarjetas
setTimeout(addPhysicsEffects, 1000)
