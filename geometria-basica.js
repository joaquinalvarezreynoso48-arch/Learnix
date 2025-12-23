document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     CONFIGURACIÓN GENERAL
  ========================== */

  const LESSON_ID = "puntos-lineas";

  const FLAGS = {
    tick5:   "geometria-puntos-tick5",        // +5%
    points:  "geometria-puntos-interacted",   // +10%
    tick15:  "geometria-recta-tick15",       // +15%
    ruler:   "geometria-recta-measured",     // +20%
    plane:   "geometria-plano-interacted",   // +20%
    mini:    "geometria-mini-challenge"      // +30%
    // NOTA: se elimina "final" aquí para que el checkbox final solo afecte la tarjeta de la lección
  };

  const FLAG_VALUES = {
    tick5: 5,
    points: 10,
    tick15: 15,
    ruler: 20,
    plane: 20,
    mini: 30
    // NOTA: no hay entrada 'final' para evitar sumar 30% al progreso global
  };

  const PROGRESS_KEY = "geometria-puntos-progress";

  /* =========================
     CÁLCULO DE PROGRESO
  ========================== */

  function computeProgress() {
    let total = 0;
    for (const key in FLAGS) {
      if (localStorage.getItem(FLAGS[key])) {
        total += FLAG_VALUES[key];
      }
    }
    return Math.min(100, total);
  }

  /* =========================
     UI
  ========================== */

  function updateUI(overallProgress) {

    // Calcular progreso de la lección desde FLAGS (la tarjeta refleja actividades)
    const lessonProgress = computeProgress();
    // Mostrar 0% en las secciones globales hasta que la lección esté completa;
    // cuando la lección esté completa mostrar un aumento fijo de +5 puntos (5%)
    const displayProgress = (lessonProgress >= 100) ? 5 : 0;
    const bigFill = document.getElementById("progressFillLarge");
    const bigText = document.getElementById("progressText");
    if (bigFill) bigFill.style.width = displayProgress + "%";
    if (bigText) bigText.textContent = displayProgress + "% completado";

    // Barra de la lección (muestra el progreso real de la lección)
    const lessonCard = document.querySelector(
      `.lesson-card[data-lesson="${LESSON_ID}"]`
    );

    if (lessonCard) {
      const fill = lessonCard.querySelector(".progress-fill-lesson");
      const text = lessonCard.querySelector(".progress-text");
      // mostrar el progreso calculado desde FLAGS (tick5, points, tick15, ruler, plane, mini)
      if (fill) fill.style.width = lessonProgress + "%";
      if (text) text.textContent = lessonProgress + "%";
      // actualizar estado visual según progreso
      const status = lessonCard.querySelector(".lesson-status");
      if(status){
        if(lessonProgress >= 100){
          lessonCard.classList.add("locked");
          status.className = "lesson-status status-completed";
          status.textContent = "Completado";
        } else {
          lessonCard.classList.remove("locked");
          status.className = "lesson-status status-available";
          status.textContent = "Disponible";
        }
      }
    }

    // Asegurar que el resto de tarjetas muestren 0% (mantenerlas en 0)
    document.querySelectorAll('.lesson-card[data-lesson]').forEach(card=>{
      if(card.getAttribute('data-lesson') !== LESSON_ID){
        const f = card.querySelector('.progress-fill-lesson');
        const t = card.querySelector('.progress-text');
        if(f) f.style.width = "0%";
        if(t) t.textContent = "0%";
        const st = card.querySelector('.lesson-status');
        if(st){ st.className = "lesson-status status-available"; st.textContent = "Disponible"; }
      }
    });

    // Estadísticas superiores (GLOBAL) — muestran displayProgress (0 o lesson+5)
    const overall = document.getElementById("overallProgress");
    if (overall) overall.textContent = displayProgress;
   }

   function syncProgress() {
    // calcular progreso GLOBAL desde FLAGS (no sobrescribo PROGRESS_KEY de la lección)
    const progress = computeProgress();
    updateUI(progress);
   }

  /* =========================
     FUNCIÓN PÚBLICA (HTML)
  ========================== */

  window.completeLesson = function (lesson, value) {
    if (lesson !== LESSON_ID) return;

    // Activamos una flag según el valor
    switch (value) {
      case 5:
        localStorage.setItem(FLAGS.tick5, "1");
        break;
      case 10:
        localStorage.setItem(FLAGS.points, "1");
        break;
      case 15:
        localStorage.setItem(FLAGS.tick15, "1");
        break;
      case 20:
        localStorage.setItem(FLAGS.ruler, "1");
        break;
      case 30:
        localStorage.setItem(FLAGS.mini, "1");
        break;
    }

    syncProgress();
    showNotification("✅ Progreso guardado");
  };

  /* =========================
     NOTIFICACIÓN
  ========================== */

  function showNotification(text) {
    const n = document.createElement("div");
    n.textContent = text;
    n.style.position = "fixed";
    n.style.bottom = "20px";
    n.style.right = "20px";
    n.style.background = "#222";
    n.style.color = "#fff";
    n.style.padding = "10px 15px";
    n.style.borderRadius = "10px";
    n.style.zIndex = "9999";
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 2000);
  }

  function checkAndShowCompletionToast(){
    try{
      const k = localStorage.getItem("geometria-puntos-completed-toast");
      if(k){
        // mostrar notificación en la página principal
        showNotification("felicidades completaste la leccion");
        // limpiar la marca para no repetir
        localStorage.removeItem("geometria-puntos-completed-toast");
      }
    }catch(e){}
  }

  /* =========================
     INIT
  ========================== */

  // iniciar UI leyendo/probando progreso guardado (no forzar valores)
  syncProgress();
  // mostrar toast pendiente si la lección se completó en otra pestaña/página
  checkAndShowCompletionToast();

  // Escuchar cambios en storage para flags y sincronizar progreso global
  window.addEventListener("storage", function(e){
    if(!e.key) return;
    // si la clave almacenada corresponde a alguna FLAG que usamos para el progreso global => recomputar
    const flagValues = Object.values(FLAGS || {});
    if(flagValues.includes(e.key) || e.key === "geometria-flags-sync"){
      // recalc y actualización de UI global
      syncProgress();
    }
    // si otra pestaña marcó la lección como completada, mostrar el toast aquí
    if(e.key === "geometria-puntos-completed-toast"){
      checkAndShowCompletionToast();
    }
  });

  /* =========================
     THEME TOGGLE (claro/oscuro)
  ========================== */
  (function initThemeToggleGlobal(){
    const THEME_KEY = "learnix-theme";
    const btn = document.getElementById("themeToggle");
    function updateIcons(isLight){
      document.querySelectorAll(".theme-icon").forEach(ic => ic.textContent = isLight ? "☀️" : "🌙");
    }
    function applyTheme(isLight){
      document.documentElement.setAttribute("data-theme", isLight ? "light" : "dark");
      document.documentElement.classList.toggle("light-mode", !!isLight);
      updateIcons(!!isLight);
      try { localStorage.setItem(THEME_KEY, !!isLight ? "light" : "dark"); } catch(e){}
    }
    // estado inicial desde localStorage (el inline <script> puede haberlo aplicado)
    try {
      const t = localStorage.getItem(THEME_KEY) || document.documentElement.getAttribute("data-theme") || "dark";
      applyTheme(t === "light");
    } catch(e){}

    if(btn){
      btn.addEventListener("click", ()=>{
        // animación de giro al cambiar tema
        btn.classList.add("rotating");
        const isLight = document.documentElement.classList.contains("light-mode");
        const target = !isLight;
        setTimeout(()=> applyTheme(target), 240);
        setTimeout(()=> btn.classList.remove("rotating"), 600);
      });
    }

    // sincronizar icono si cambia en otra pestaña
    window.addEventListener("storage", (e)=>{
      if(e.key === THEME_KEY){
        const isLight = (e.newValue === "light");
        applyTheme(isLight);
      }
    });
  })();
});
