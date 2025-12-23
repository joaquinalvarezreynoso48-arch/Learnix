const $ = (s) => document.querySelector(s)
const $$ = (s) => document.querySelectorAll(s)

// Estado compartido (usar claves globales)
// Inicialmente no confiar en valores previos: reiniciamos a 0 aquí
let coins = 0
let userXP = 0

// Referencias DOM (seguras)
const coinCountEl = document.getElementById("coinCount")
const xpValueEl = document.getElementById("xpValue")
const xpFillEl = document.getElementById("xpFill")
const themeToggleEl = document.getElementById("themeToggle")
const profileBtnEl = document.getElementById("profileBtn")
const exploreBtnEl = document.getElementById("exploreBtn")

document.addEventListener("DOMContentLoaded", () => {
  // Reiniciar las claves compartidas en localStorage a 0 (según petición)
  localStorage.setItem("learnix-coins", "0")
  localStorage.setItem("learnix-xp", "0")
  coins = 0
  userXP = 0

  // Inicializa UI y datos
  if (coinCountEl) coinCountEl.textContent = coins
  if (xpValueEl) xpValueEl.textContent = userXP
  if (xpFillEl) xpFillEl.style.width = `${userXP}%`

  // Cargar progreso guardado en cada tarjeta
  $$(".subject-card").forEach((card) => {
    try {
      const prog = localStorage.getItem(card.dataset.id + "Progress")
      if (prog) {
        const pv = card.querySelector(".progress-value")
        if (pv) pv.textContent = prog
      }
    } catch (e) { /* noop */ }
  })

  // Setup eventos (usar addEventListener y proteger existencia de elementos)
  if (themeToggleEl) themeToggleEl.addEventListener("click", toggleTheme)
  if (profileBtnEl) profileBtnEl.addEventListener("click", toggleProfile)
  if (exploreBtnEl) exploreBtnEl.addEventListener("click", () => {
    const sec = document.querySelector(".subjects-section")
    if (sec) sec.scrollIntoView({ behavior: "smooth" })
  })

  $$(".subject-card:not(.coming-soon)").forEach((card) => {
    card.addEventListener("click", () => handleCard(card))
  })

  // Cerrar perfil al hacer click fuera (delegado, pero protegido)
  document.addEventListener("click", (e) => {
    if (profileBtnEl && !profileBtnEl.contains(e.target)) closeProfile()
  })
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeProfile()
  })

  // Crear partículas solo si el contenedor existe (mantengo JS para partículas ligeras)
  createParticles()

  // Escuchar cambios desde otras páginas (ej. geometria-basica gana monedas)
  window.addEventListener("storage", (e) => {
    if (e.key === "learnix-coins") { coins = Number(e.newValue || 0); updateUI() }
    if (e.key === "learnix-xp") { userXP = Number(e.newValue || 0); updateUI() }
    if (e.key === "learnix-theme") {
      const icon = document.querySelector(".theme-icon")
      if (icon) icon.textContent = (e.newValue === "light") ? "☀️" : "🌙"
      // también mantener el atributo data-theme en html para compatibilidad CSS
      document.documentElement.setAttribute("data-theme", e.newValue || "dark")
    }
  })
})

// Tema: alterna data-theme en html (seguirá siendo minimal JS)
const toggleTheme = () => {
  if (!themeToggleEl) return
  themeToggleEl.classList.add("rotating")
  setTimeout(() => {
    const current = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark"
    document.documentElement.setAttribute("data-theme", current)
    localStorage.setItem("learnix-theme", current)
    const icon = document.querySelector(".theme-icon")
    if (icon) icon.textContent = current === "light" ? "☀️" : "🌙"
    themeToggleEl.classList.remove("rotating")
  }, 240)
}

const toggleProfile = () => {
  if (!profileBtnEl) return
  const expanded = profileBtnEl.getAttribute("aria-expanded") === "true"
  profileBtnEl.setAttribute("aria-expanded", String(!expanded))
}

const closeProfile = () => {
  if (profileBtnEl) profileBtnEl.setAttribute("aria-expanded", "false")
}

const handleCard = (card) => {
  if (!card) return
  coins = Number(coins) + 5
  localStorage.setItem("learnix-coins", coins) // Guardar en clave compartida
  updateUI()
  showNotification(`¡Explorando ${card.querySelector(".subject-title").textContent}! +5 monedas`)
  const link = card.dataset.link
  if (link && link !== "#") setTimeout(() => window.location.href = link, 900)
}

const showNotification = (msg) => {
  const notif = document.createElement("div")
  notif.className = "notification"
  notif.textContent = msg
  document.body.appendChild(notif)
  setTimeout(() => {
    notif.classList.add("fade-out")
    setTimeout(() => notif.remove(), 300)
  }, 3000)
}

const createParticles = () => {
  const container = document.getElementById("particles")
  if (!container) return
  for (let i = 0; i < 50; i++) {
    const p = document.createElement("div")
    p.className = "particle"
    p.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;width:${Math.random() * 2 + 2}px;height:${Math.random() * 2 + 2}px;animation-duration:${Math.random() * 4 + 4}s;animation-delay:${Math.random() * 2}s`
    container.appendChild(p)
  }
  window.addEventListener("scroll", () =>
    $$(".particle").forEach((p, i) => (p.style.transform = `translateY(${scrollY * ((i % 3) + 1) * 0.5}px)`))
  )
}

function updateUI() {
  if (coinCountEl) coinCountEl.textContent = coins
  if (xpFillEl) xpFillEl.style.width = `${userXP}%`
  if (xpValueEl) xpValueEl.textContent = userXP
  // Actualizar menú hamburguesa
  const mobileCoins = document.getElementById("mobileCoins")
  const mobileXP = document.getElementById("mobileXP")
  if (mobileCoins) mobileCoins.textContent = coins
  if (mobileXP) mobileXP.textContent = `${userXP}%`
}
