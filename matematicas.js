// ==========================================
// VARIABLES GLOBALES - ESTADO DEL USUARIO
// ==========================================

// Obtener monedas desde localStorage o usar valor por defecto
// localStorage devuelve string, por eso convertimos a Number
let coins = localStorage.getItem("learnix-coins") ? Number(localStorage.getItem("learnix-coins")) : 150

// Obtener XP desde localStorage o usar valor por defecto
let userXP = localStorage.getItem("learnix-xp") ? Number(localStorage.getItem("learnix-xp")) : 60

// ==========================================
// REFERENCIAS A ELEMENTOS DEL DOM - DESKTOP
// ==========================================

// Botón para cambiar entre tema oscuro y claro (escritorio)
const themeToggle = document.getElementById("themeToggle")

// Botón para cambiar tema en versión móvil
const themeMobileToggle = document.getElementById("themeMobileToggle")

// Botón para abrir/cerrar menú de perfil (escritorio)
const profileBtn = document.getElementById("profileBtn")

// Menú de perfil en versión móvil
const mobileProfile = document.querySelector(".mobile-profile")

// Checkbox para abrir/cerrar menú hamburguesa en móviles
const menuToggle = document.getElementById("menuToggle")

// Todas las tarjetas de temas de matemáticas
const cards = document.querySelectorAll(".card")

// ==========================================
// REFERENCIAS A ELEMENTOS DEL DOM - MOSTRAR DATOS (DESKTOP)
// ==========================================

// Elemento que muestra monedas en versión de escritorio
const coinCountDesktop = document.getElementById("coinCountDesktop")

// Elemento que muestra % de XP en versión de escritorio
const xpValueDesktop = document.getElementById("xpValueDesktop")

// Barra de progreso de XP en versión de escritorio
const xpFillDesktop = document.getElementById("xpFillDesktop")

// ==========================================
// REFERENCIAS A ELEMENTOS DEL DOM - MOSTRAR DATOS (MÓVIL)
// ==========================================

// Elemento que muestra monedas en versión móvil
const coinCount = document.getElementById("coinCount")

// Elemento que muestra % de XP en versión móvil
const xpValue = document.getElementById("xpValue")

// Barra de progreso de XP en versión móvil
const xpFill = document.getElementById("xpFill")

// ==========================================
// FUNCIÓN: updateUI()
// ==========================================

// Actualiza todos los elementos visuales con los valores de coins y userXP
function updateUI() {
  // Actualizar monedas en ambas versiones (móvil y escritorio)
  coinCount.textContent = coins
  coinCountDesktop.textContent = coins
  
  // Actualizar XP en ambas versiones
  xpValue.textContent = userXP
  xpValueDesktop.textContent = userXP
  
  // Actualizar ancho de las barras de progreso (en porcentaje)
  xpFill.style.width = userXP + "%"
  xpFillDesktop.style.width = userXP + "%"
}

// ==========================================
// CARGAR TEMA AL INICIAR LA PÁGINA
// ==========================================

// Si el tema guardado es "light", agregar clase light-mode
if (localStorage.getItem("learnix-theme") === "light") {
  // Agregar clase al html para aplicar variables CSS de tema claro
  document.documentElement.classList.add("light-mode")
  
  // Cambiar el icono del botón a ☀️
  document.querySelector(".theme-icon").textContent = "☀️"
  
  // Si existe el toggle móvil, también actualizar su icono
  if (themeMobileToggle) {
    document.querySelector(".theme-toggle.mobile .theme-icon").textContent = "☀️"
  }
}

// Actualizar la interfaz visual con los valores cargados
updateUI()

// ==========================================
// FUNCIÓN: toggleTheme()
// ==========================================
function toggleTheme() {
  // Añadir clase rotating a botones (si existen)
  if (themeToggle) themeToggle.classList.add("rotating")
  if (themeMobileToggle) themeMobileToggle.classList.add("rotating")

  // Determinar estado objetivo sin cambiar aún (para animación)
  const currentlyLight = document.documentElement.classList.contains("light-mode")
  const targetLight = !currentlyLight

  // Aplicar cambio tras pequeño retardo (dejar que la animación se vea)
  setTimeout(() => {
    document.documentElement.classList.toggle("light-mode", targetLight)
    localStorage.setItem("learnix-theme", targetLight ? "light" : "dark")

    // Actualizar todos los iconos de tema en la página
    document.querySelectorAll(".theme-icon").forEach(ic => {
      ic.textContent = targetLight ? "☀️" : "🌙"
    })
  }, 240)

  // Quitar clase rotating al terminar la animación
  setTimeout(() => {
    if (themeToggle) themeToggle.classList.remove("rotating")
    if (themeMobileToggle) themeMobileToggle.classList.remove("rotating")
  }, 600)
}

// ==========================================
// EVENT LISTENERS - TOGGLE DE TEMA
// ==========================================

// Al hacer clic en el botón de tema (escritorio)
themeToggle.addEventListener("click", toggleTheme)

// Al hacer clic en el botón de tema (móvil)
if (themeMobileToggle) {
  themeMobileToggle.addEventListener("click", toggleTheme)
}

// ==========================================
// EVENT LISTENERS - BOTÓN DE PERFIL (DESKTOP)
// ==========================================

// Al hacer clic en el perfil, abrir/cerrar menú
profileBtn.addEventListener("click", () => {
  // Obtener el estado actual (true = abierto, false = cerrado)
  const expanded = profileBtn.getAttribute("aria-expanded") === "true"
  
  // Cambiar al estado opuesto
  profileBtn.setAttribute("aria-expanded", !expanded)
})

// ==========================================
// EVENT LISTENERS - CERRAR PERFIL AL HACER CLIC AFUERA
// ==========================================

// Detectar clics en toda la página
document.addEventListener("click", (e) => {
  // Si el clic NO está dentro del botón de perfil, cerrar el menú
  if (!profileBtn.contains(e.target)) {
    profileBtn.setAttribute("aria-expanded", "false")
  }
})

// ==========================================
// EVENT LISTENERS - CLICS EN LAS TARJETAS
// ==========================================

// Para cada tarjeta de tema, agregar event listener
cards.forEach((card) => {
  card.addEventListener("click", () => {
    // Aumentar monedas: cada tarjeta da +10
    coins += 10
    
    // Aumentar XP: cada tarjeta da +5 XP (máximo 100)
    userXP = Math.min(userXP + 5, 100)
    
    // Guardar cambios en localStorage
    localStorage.setItem("learnix-coins", coins)
    localStorage.setItem("learnix-xp", userXP)
    
    // Actualizar interfaz visual
    updateUI()
    
    // Cerrar el menú hamburguesa si está abierto
    menuToggle.checked = false
  })
})

// ==========================================
// EVENT LISTENERS - SINCRONIZACIÓN ENTRE PESTAÑAS
// ==========================================

// El evento 'storage' se dispara cuando localStorage cambia en otra pestaña
window.addEventListener("storage", (e) => {
  // Si cambió el tema en otra pestaña
  if (e.key === "learnix-theme") {
    // Obtener el nuevo valor del tema
    const icon = e.newValue === "light" ? "☀️" : "🌙"
    
    // Aplicar el tema
    if (e.newValue === "light") {
      document.documentElement.classList.add("light-mode")
    } else {
      document.documentElement.classList.remove("light-mode")
    }
    
    // Actualizar iconos en ambas versiones
    document.querySelector(".theme-icon").textContent = icon
    if (themeMobileToggle) {
      document.querySelector(".theme-toggle.mobile .theme-icon").textContent = icon
    }
  }
  
  // Si cambió la cantidad de monedas en otra pestaña
  if (e.key === "learnix-coins") {
    coins = Number(e.newValue || 150)
  }
  
  // Si cambió el XP en otra pestaña
  if (e.key === "learnix-xp") {
    userXP = Number(e.newValue || 60)
  }
  
  // Actualizar la interfaz visual
  updateUI()
})

// FIN DEL ARCHIVO
