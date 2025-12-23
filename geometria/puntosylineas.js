document.addEventListener("DOMContentLoaded", function(){ 
  const PROG_KEY = "geometria-puntos-progress";
  const TICK5_KEY = "geometria-puntos-tick5";
  const TICK15_KEY = "geometria-recta-tick15";
  const POINTS_INTERACT_KEY = "geometria-puntos-interacted";
  const RULER_MEASURED_KEY = "geometria-recta-measured";
  // usar la misma flag que espera la página principal
  const FINAL_FLAG = "geometria-mini-challenge"; // +30%
  const PLANE_INTERACT_FLAG = "geometria-plano-interacted";

  // Eliminado writeProgress incrementador; ahora recomputamos desde flags.
  function computeProgressFromFlags(){
    let sum = 0;
    if (localStorage.getItem(TICK5_KEY)) sum += 5;
    if (localStorage.getItem(POINTS_INTERACT_KEY)) sum += 10;
    if (localStorage.getItem(TICK15_KEY)) sum += 15;
    if (localStorage.getItem(RULER_MEASURED_KEY)) sum += 20;
    if (localStorage.getItem(PLANE_INTERACT_FLAG)) sum += 20;
    if (localStorage.getItem(FINAL_FLAG)) sum += 30; // <-- ahora +30%
    return Math.min(100, sum);
  }

  function recomputeAndStoreProgress(){
    const val = computeProgressFromFlags();
    localStorage.setItem(PROG_KEY, String(val));
    updateLessonProgressUI && updateLessonProgressUI(val);

    // FORZAR evento storage para sincronizar otras pestañas (timestamp)
    try {
      localStorage.setItem("geometria-flags-sync", String(Date.now()));
    } catch(e){}

    // Mostrar notificación cuando se alcance 100% (solo la primera vez)
    const DONE_FLAG = PROG_KEY + "-completed-notified";
    try {
      if (val >= 100 && !localStorage.getItem(DONE_FLAG)) {
        localStorage.setItem(DONE_FLAG, "1");
        // No mostrar el toast aquí (puede quedar detrás). Marcar para que la página principal lo muestre.
        try { localStorage.setItem("geometria-puntos-completed-toast", String(Date.now())); } catch(e){}
      } else if (val < 100 && localStorage.getItem(DONE_FLAG)) {
        // si baja de 100% permitir notificar de nuevo en el futuro
        localStorage.removeItem(DONE_FLAG);
      }
    } catch (e) { /* noop */ }

    return val;
  }

  const readProgress = () => Number(localStorage.getItem(PROG_KEY) || 0);
  const notify = (msg, ms=1400) => { 
    const n = document.createElement("div"); 
    n.className = "notification"; 
    n.textContent = msg; 
    document.body.appendChild(n); 
    setTimeout(()=>{ 
      n.style.opacity = 0; 
      setTimeout(()=>n.remove(),300); 
    }, ms); 
  };

  function refreshTick5State(){
    const tickEl = document.getElementById("activityTick");
    if(!tickEl) return;
    // Ahora solo se marca si la flag específica existe.
    tickEl.checked = !!localStorage.getItem(TICK5_KEY);
  }

  (function initTick5(){
    const tickEl = document.getElementById("activityTick");
    if(!tickEl) return;
    refreshTick5State();
    tickEl.addEventListener("change", ()=>{
      if(tickEl.checked){
        localStorage.setItem(TICK5_KEY, "1");
        recomputeAndStoreProgress();
        notify("Progreso: +5%");
      } else {
        localStorage.removeItem(TICK5_KEY);
        recomputeAndStoreProgress();
        notify("Progreso: tick 5% desmarcado");
      }
    });
  })();

  (function initTick15(){
    const tickEl = document.getElementById("activityTick15");
    if(!tickEl) return;
    tickEl.checked = !!localStorage.getItem(TICK15_KEY);
    tickEl.addEventListener("change", ()=>{
      if(tickEl.checked){
        localStorage.setItem(TICK15_KEY, "1");
        recomputeAndStoreProgress();
        notify("Actividad extra de rectas: +15%");
      } else {
        localStorage.removeItem(TICK15_KEY);
        recomputeAndStoreProgress();
        notify("Actividad extra de rectas removida: -15%");
      }
    });
  })();

  function updateLessonProgressUI(val){
    const pct = Math.max(0, Math.min(100, Number(val) || 0));
    const fill = document.querySelector('.progress-fill-lesson');
    const txt = document.querySelector('.progress-text');
    if(fill) fill.style.width = pct + '%';
    if(txt) txt.textContent = pct + '%';
  }

  // --- Interactividad: "Colocá el punto" (canvas de puntos) ---
  (function pointsInteraction(){
    const svg = document.getElementById("pointCanvas");
    const clearBtn = document.getElementById("clearPointsBtn");
    const countEl = document.getElementById("pointsCount");
    if(!svg) return;
    const pts = [];
    const letters = i => String.fromCharCode(65 + (i % 26));
    function updateCount(){ if(countEl) countEl.textContent = `Puntos: ${pts.length}`; }

    function toSvgCoords(evt){
      const rect = svg.getBoundingClientRect();
      const clientX = (evt.touches && evt.touches[0]) ? evt.touches[0].clientX : evt.clientX;
      const clientY = (evt.touches && evt.touches[0]) ? evt.touches[0].clientY : evt.clientY;
      const x = ((clientX - rect.left) / rect.width) * 1000;
      const y = ((clientY - rect.top) / rect.height) * 420;
      return { x: Math.max(8, Math.min(992, x)), y: Math.max(8, Math.min(412, y)) };
    }

    function makePoint(x,y,index){
      const gid = `p${Date.now()}${index}`;
      const g = document.createElementNS("http://www.w3.org/2000/svg","g");
      g.setAttribute("data-id", gid);
      const c = document.createElementNS("http://www.w3.org/2000/svg","circle");
      c.setAttribute("cx", x); c.setAttribute("cy", y); c.setAttribute("r", 6); c.setAttribute("class", "pt-circle");
      const t = document.createElementNS("http://www.w3.org/2000/svg","text");
      t.setAttribute("x", x + 10); t.setAttribute("y", y + 4); t.setAttribute("class", "pt-label");
      t.textContent = letters(index);
      g.appendChild(c); g.appendChild(t); svg.appendChild(g);
      return { id: gid, g, c, t, x, y };
    }

    function drawLine(p1, p2){
      const line = document.createElementNS("http://www.w3.org/2000/svg","line");
      line.setAttribute("x1", p1.x); line.setAttribute("y1", p1.y);
      line.setAttribute("x2", p2.x); line.setAttribute("y2", p2.y);
      line.setAttribute("class", "pt-line");
      const first = svg.firstChild;
      if(first) svg.insertBefore(line, first); else svg.appendChild(line);
      return line;
    }

    svg.addEventListener("click", (e) => {
      if(e.target.closest && e.target.closest(".pt-circle, .pt-label")) return;
      const {x,y} = toSvgCoords(e);
      const p = makePoint(x,y, pts.length);
      pts.push(p);
      if(pts.length >= 2) drawLine(pts[pts.length-2], pts[pts.length-1]);
      updateCount();

      // marcar flag de interacción la primera vez y recomputar (no sumar directo)
      try{
        if(!localStorage.getItem(POINTS_INTERACT_KEY)){
          localStorage.setItem(POINTS_INTERACT_KEY, "1");
          recomputeAndStoreProgress();
          notify("Interacción registrada: +10% de progreso");
        }
      }catch(e){}
    }, { passive:true });

    svg.addEventListener("touchstart", (e) => { e.preventDefault(); svg.dispatchEvent(new MouseEvent("click",{clientX:e.touches[0].clientX, clientY:e.touches[0].clientY})); }, { passive:false });

    if(clearBtn) clearBtn.addEventListener("click", () => {
      pts.forEach(p => { if(p.g && p.g.parentNode) p.g.parentNode.removeChild(p.g); });
      Array.from(svg.querySelectorAll(".pt-line")).forEach(l => l.remove());
      pts.length = 0; updateCount();
    });

    svg.addEventListener("keydown", (e) => { if(e.key === "Enter" || e.key === " ") { e.preventDefault(); const rect = svg.getBoundingClientRect(); svg.dispatchEvent(new MouseEvent("click",{clientX:rect.left+rect.width/2, clientY:rect.top+rect.height/2})); } });

    updateCount();
  })();

  // --- Interactividad: Regla virtual (trazar recta entre 2 puntos) ---
  (function rulerInteraction(){
    const svg = document.getElementById("rulerCanvas");
    const clearBtn = document.getElementById("rulerClearBtn");
    const measureBtn = document.getElementById("rulerMeasureBtn");
    const distanceEl = document.getElementById("rulerDistance");
    const countEl = document.getElementById("rulerPointsCount");
    if(!svg) return;
    const pts = [];
    function updateCount(){ if(countEl) countEl.textContent = `Puntos: ${pts.length}`; }

    function toSvgCoords(evt){
      const rect = svg.getBoundingClientRect();
      const clientX = (evt.touches && evt.touches[0]) ? evt.touches[0].clientX : evt.clientX;
      const clientY = (evt.touches && evt.touches[0]) ? evt.touches[0].clientY : evt.clientY;
      const x = ((clientX - rect.left) / rect.width) * 1000;
      const y = ((clientY - rect.top) / rect.height) * 240;
      return { x: Math.max(8, Math.min(992, x)), y: Math.max(8, Math.min(232, y)) };
    }

    function makeRPoint(x,y,index){
      const c = document.createElementNS("http://www.w3.org/2000/svg","circle");
      c.setAttribute("cx", x); c.setAttribute("cy", y); c.setAttribute("r", 6); c.setAttribute("class", "ruler-point");
      const t = document.createElementNS("http://www.w3.org/2000/svg","text");
      t.setAttribute("x", x + 10); t.setAttribute("y", y + 4); t.setAttribute("class","pt-label");
      t.textContent = index === 0 ? "P" : "Q";
      svg.appendChild(c); svg.appendChild(t);
      return { c, t, x, y };
    }

    function drawExtendedLine(p1, p2){
      const x1 = p1.x, y1 = p1.y, x2 = p2.x, y2 = p2.y;
      if(x1===x2 && y1===y2) return null;
      const bounds = { xmin:0, ymin:0, xmax:1000, ymax:240 };
      const dx = x2 - x1, dy = y2 - y1;
      const ptsInt = [];
      if(dx !== 0){
        let t=(bounds.xmin-x1)/dx; let y=y1+t*dy; if(y>=bounds.ymin-1 && y<=bounds.ymax+1) ptsInt.push({x:bounds.xmin,y});
        t=(bounds.xmax-x1)/dx; y=y1+t*dy; if(y>=bounds.ymin-1 && y<=bounds.ymax+1) ptsInt.push({x:bounds.xmax,y});
      }
      if(dy !== 0){
        let t=(bounds.ymin-y1)/dy; let x=x1+t*dx; if(x>=bounds.xmin-1 && x<=bounds.xmax+1) ptsInt.push({x,y:bounds.ymin});
        t=(bounds.ymax-y1)/dy; x=x1+t*dx; if(x>=bounds.xmin-1 && x<=bounds.xmax+1) ptsInt.push({x,y:bounds.ymax});
      }
      if(ptsInt.length < 2) return null;
      const a = ptsInt[0], b = ptsInt[1];
      const line = document.createElementNS("http://www.w3.org/2000/svg","line");
      line.setAttribute("x1", a.x); line.setAttribute("y1", a.y); line.setAttribute("x2", b.x); line.setAttribute("y2", b.y);
      line.setAttribute("class","ruler-line");
      const first = svg.firstChild;
      if(first) svg.insertBefore(line, first); else svg.appendChild(line);
      return line;
    }

    svg.addEventListener("click", (e) => {
      if(e.target.closest && e.target.closest(".ruler-point")) return;
      if(pts.length >= 2) return;
      const {x,y} = toSvgCoords(e);
      const p = makeRPoint(x,y, pts.length);
      pts.push(p);
      if(pts.length === 2) drawExtendedLine(pts[0], pts[1]);
      updateCount();
    }, { passive:true });

    svg.addEventListener("touchstart", (e)=>{ e.preventDefault(); svg.dispatchEvent(new MouseEvent("click",{clientX:e.touches[0].clientX, clientY:e.touches[0].clientY})); }, {passive:false});

    if(clearBtn) clearBtn.addEventListener("click", ()=>{
      pts.forEach(p=>{ if(p.c && p.c.parentNode) p.c.parentNode.removeChild(p.c); if(p.t && p.t.parentNode) p.t.parentNode.removeChild(p.t); });
      Array.from(svg.querySelectorAll(".ruler-line")).forEach(l=>l.remove());
      pts.length = 0; updateCount();
      if(distanceEl) distanceEl.textContent = "Distancia: —";
    });

    function measureDistance(){
      if(pts.length < 2){ notify("Colocá dos puntos para medir."); return; }
      const a = pts[0], b = pts[1];
      const dx = a.x - b.x, dy = a.y - b.y;
      const px = Math.sqrt(dx*dx + dy*dy);
      const units = (px / 10);
      if(distanceEl) distanceEl.textContent = `Distancia: ${Math.round(px)} px · ≈ ${units.toFixed(2)} u`;

      // marcar flag de medición la primera vez y recomputar (no sumar directo)
      try{
        if(!localStorage.getItem(RULER_MEASURED_KEY)){
          localStorage.setItem(RULER_MEASURED_KEY, "1");
          recomputeAndStoreProgress();
          notify("✅ +20% progreso añadido a la lección");
        }
      }catch(e){}
    }

    if(measureBtn) measureBtn.addEventListener("click", measureDistance);

    svg.addEventListener("keydown", (e)=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); const rect = svg.getBoundingClientRect(); svg.dispatchEvent(new MouseEvent("click",{clientX:rect.left+rect.width/2, clientY:rect.top+rect.height/2})); } });

    updateCount();
  })();

  // --- NUEVO: dibujar ejemplos de rectas (paralelas, secantes, perpendiculares) ---
  function renderLineExamples(){
    const svg = document.getElementById("lineExamplesSvg");
    if(!svg) return;
    const NS = "http://www.w3.org/2000/svg";
    svg.innerHTML = "";
    const W = 1000, H = 240;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);

    const groupWidth = Math.floor((W - 60) / 3); // margen lateral 30
    const startX = 30;

    // helper
    const makeLine = (x1,y1,x2,y2, cls) => {
      const l = document.createElementNS(NS,"line");
      l.setAttribute("x1", x1); l.setAttribute("y1", y1); l.setAttribute("x2", x2); l.setAttribute("y2", y2);
      l.setAttribute("class", cls);
      svg.appendChild(l);
      return l;
    };
    const makeText = (x,y,txt) => {
      const t = document.createElementNS(NS,"text");
      t.setAttribute("x", x); t.setAttribute("y", y);
      t.setAttribute("class","ex-label");
      t.textContent = txt;
      svg.appendChild(t);
      return t;
    };

    // 1) Paralelas (box 0)
    (function(){
      const gx = startX;
      const top = 40, bottom = 100;
      const left = gx, right = gx + groupWidth;
      makeLine(left, top, right, top, "ex-line");
      makeLine(left, bottom, right, bottom, "ex-line secondary");
      makeText(gx + groupWidth/2 - 36, bottom + 26, "Paralelas");
    })();

    // 2) Secantes (box 1)
    (function(){
      const gx = startX + groupWidth + 15;
      const left = gx, right = gx + groupWidth;
      // primera linea diagonal descendente
      makeLine(left, 30, right, 140, "ex-line");
      // segunda linea diagonal ascendente (se cruzan)
      makeLine(left, 140, right, 30, "ex-line secondary");
      makeText(gx + groupWidth/2 - 28, 170, "Secantes");
    })();

    // 3) Perpendiculares (box 2)
    (function(){
      const gx = startX + (groupWidth + 15)*2;
      const centerX = gx + Math.floor(groupWidth/2);
      const centerY = 72;
      // horizontal
      makeLine(gx + 10, centerY, gx + groupWidth - 10, centerY, "ex-line");
      // vertical
      makeLine(centerX, centerY - 40, centerX, centerY + 40, "ex-line secondary");
      makeText(gx + groupWidth/2 - 64, centerY + 66, "Perpendiculares");
    })();
  }

  // llamar al render al cargar y en resize para ajustar si es necesario
  try { renderLineExamples(); window.addEventListener("resize", () => { renderLineExamples(); }); } catch(e){}

  // --- NUEVO: dibujar ejemplo de plano con puntos y rectas y hacerlos interactivos (arrastrar + bloquear) ---
  function renderPlaneExample(){
    const svg = document.getElementById("planeExampleSvg");
    if(!svg) return;
    const NS = "http://www.w3.org/2000/svg";
    svg.innerHTML = "";
    const W = 1000, H = 360;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);

    // rectángulo que representa el "plano"
    const rect = document.createElementNS(NS, "rect");
    rect.setAttribute("x", 40);
    rect.setAttribute("y", 30);
    rect.setAttribute("width", W - 80);
    rect.setAttribute("height", H - 80);
    rect.setAttribute("rx", 10);
    rect.setAttribute("class", "plane-rect");
    svg.appendChild(rect);

    // definimos puntos y líneas (posiciones iniciales)
    const pointsData = [
      {id:'A', x:160, y:110},
      {id:'B', x:300, y:200},
      {id:'C', x:460, y:140},
      {id:'D', x:640, y:220},
      {id:'E', x:820, y:130}
    ];
    // líneas a mostrar
    const linesData = [
      ['A','C'],
      ['B','D'],
      ['C','E']
    ];

    // map id->node
    const nodes = {};
    // helper crear punto interactivo
    pointsData.forEach((p)=>{
      const g = document.createElementNS(NS,'g');
      g.setAttribute('data-id', p.id);
      // círculo
      const c = document.createElementNS(NS,'circle');
      c.setAttribute('cx', p.x); c.setAttribute('cy', p.y); c.setAttribute('r', 6);
      c.setAttribute('class','plane-point');
      // etiqueta
      const t = document.createElementNS(NS,'text');
      t.setAttribute('x', p.x + 10); t.setAttribute('y', p.y + 4); t.setAttribute('class','plane-label');
      t.textContent = p.id;
      g.appendChild(c); g.appendChild(t);
      svg.appendChild(g);

      // estado
      nodes[p.id] = {id:p.id, g, c, t, x:p.x, y:p.y, locked:false};

      // interacción: arrastrar si no bloqueado
      let dragging = false;
      let start = null;
      function onPointerDown(e){
        e.preventDefault();
        if(nodes[p.id].locked) return;
        dragging = true;
        svg.setPointerCapture ? e.target.setPointerCapture(e.pointerId) : null;
        start = {x: e.clientX, y: e.clientY};
      }
      function onPointerMove(e){
        if(!dragging) return;
        const rectBox = svg.getBoundingClientRect();
        const nx = ((e.clientX - rectBox.left)/rectBox.width)*W;
        const ny = ((e.clientY - rectBox.top)/rectBox.height)*H;
        const clampedX = Math.max(48, Math.min(W-48, nx));
        const clampedY = Math.max(48, Math.min(H-48, ny));
        nodes[p.id].x = clampedX; nodes[p.id].y = clampedY;
        nodes[p.id].c.setAttribute('cx', clampedX);
        nodes[p.id].c.setAttribute('cy', clampedY);
        nodes[p.id].t.setAttribute('x', clampedX + 10);
        nodes[p.id].t.setAttribute('y', clampedY + 4);
        // actualizar líneas conectadas
        updateAllLines();
      }
      function onPointerUp(e){
        if(dragging){
          dragging = false;
          start = null;
          try{ e.target.releasePointerCapture && e.target.releasePointerCapture(e.pointerId); }catch(e){}
        }
      }

      // click para bloquear/desbloquear
      function onClick(e){
        // toggle locked state
        nodes[p.id].locked = !nodes[p.id].locked;
        if(nodes[p.id].locked) nodes[p.id].c.classList.add('locked');
        else nodes[p.id].c.classList.remove('locked');
        // la primera vez que se bloquee cualquier punto, marcar flag y recomputar progreso
        try{
          if(nodes[p.id].locked && !localStorage.getItem(PLANE_INTERACT_FLAG)){
            localStorage.setItem(PLANE_INTERACT_FLAG, "1");
            recomputeAndStoreProgress && recomputeAndStoreProgress();
            notify("✅ Interacción con plano: +20% de progreso");
            const status = document.getElementById('planeStatus');
            if(status) status.textContent = "Interactividad registrada";
          }
        }catch(e){}
      }

      // listeners pointer (soporta mouse/touch)
      c.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      // click para lock toggle
      c.addEventListener('click', onClick);
    });

    // crear líneas SVG y función de actualización
    const createdLines = [];
    function updateAllLines(){
      // eliminar existentes
      createdLines.forEach(l=> l.parentNode && l.parentNode.removeChild(l));
      createdLines.length = 0;
      linesData.forEach(pair=>{
        const a = nodes[pair[0]], b = nodes[pair[1]];
        if(!a||!b) return;
        const l = document.createElementNS(NS,'line');
        l.setAttribute('x1', a.x); l.setAttribute('y1', a.y);
        l.setAttribute('x2', b.x); l.setAttribute('y2', b.y);
        l.setAttribute('class','plane-line');
        svg.insertBefore(l, svg.firstChild);
        createdLines.push(l);
      });
    }
    updateAllLines();

    // reset button
    const resetBtn = document.getElementById('planeResetBtn');
    if(resetBtn){
      resetBtn.addEventListener('click', ()=>{
        // restaurar posiciones iniciales y desbloquear
        pointsData.forEach(p=>{
          const n = nodes[p.id];
          n.x = p.x; n.y = p.y; n.locked = false;
          n.c.setAttribute('cx', p.x); n.c.setAttribute('cy', p.y);
          n.t.setAttribute('x', p.x + 10); n.t.setAttribute('y', p.y + 4);
          n.c.classList.remove('locked');
        });
        updateAllLines();
        // limpiar flag de interacción de plano para permitir volver a ganar (opcional)
        // localStorage.removeItem(PLANE_INTERACT_FLAG); // dejar comentado si no queremos revertir la bonificación
        const status = document.getElementById('planeStatus');
        if(status) status.textContent = "";
      });
    }

    // título del plano
    const lab = document.createElementNS(NS,"text");
    lab.setAttribute("x", 60);
    lab.setAttribute("y", 48);
    lab.setAttribute("class","plane-label");
    lab.textContent = "Plano (interactivo) — mové puntos y hacé click para bloquear";
    svg.appendChild(lab);
  }

  try { renderPlaneExample(); window.addEventListener("resize", () => { renderPlaneExample(); }); } catch(e){}

  // Escuchar storage para refrescar ticks/estado si cambien desde otra pestaña
  window.addEventListener("storage", (e)=>{
    if(e.key === PROG_KEY) updateLessonProgressUI && updateLessonProgressUI(Number(e.newValue||0));
    if(e.key === TICK15_KEY) { const el = document.getElementById("activityTick15"); if(el) el.checked = !!localStorage.getItem(TICK15_KEY); }
    if(e.key === TICK5_KEY) refreshTick5State();
  });

  // --- NUEVO: asegurar recálculo consistente del progreso desde las FLAGS ---
  (function ensureCorrectProgressOnLoadAndSync(){
    const FLAGS = [TICK5_KEY, POINTS_INTERACT_KEY, TICK15_KEY, RULER_MEASURED_KEY];
    // recalcular ahora al cargar para corregir valores previos
    if(typeof recomputeAndStoreProgress === "function") recomputeAndStoreProgress();

    // si alguna flag cambia desde otra pestaña, recomputar y sincronizar PROG_KEY
    window.addEventListener("storage", (ev) => {
      if(!ev.key) return;
      if(FLAGS.includes(ev.key) || FLAGS.includes(ev.key.replace(/-measured$/,""))) {
        if(typeof recomputeAndStoreProgress === "function") recomputeAndStoreProgress();
      }
    });
  })();

  // handler para botón "Actividad final" (+20%)
  (function initFinalRectasBtn(){
    const btn = document.getElementById("finalRectasBtn");
    const status = document.getElementById("finalRectasStatus");
    if(!btn) return;
    // estado inicial
    if(localStorage.getItem(FINAL_FLAG)){
      btn.classList.add("disabled");
      btn.setAttribute("disabled","true");
      if(status) status.textContent = "Actividad final completada";
    }
    btn.addEventListener("click", ()=> {
      if(localStorage.getItem(FINAL_FLAG)) return;
      try {
        localStorage.setItem(FINAL_FLAG, "1");
        recomputeAndStoreProgress();
        notify("✅ Actividad final completada: +20% de progreso");
        btn.classList.add("disabled");
        btn.setAttribute("disabled","true");
        if(status) status.textContent = "Actividad final completada";
      } catch(e){ /* noop */ }
    });
  })();

  /* --- NUEVO: manejo de tema (claro/oscuro) para esta página --- */
  (function initThemeToggle(){
    const THEME_KEY = "learnix-theme";
    const btn = document.getElementById("themeToggle");
    function updateThemeIcons(isLight){
      document.querySelectorAll(".theme-icon").forEach(ic => ic.textContent = isLight ? "☀️" : "🌙");
    }
    function applyTheme(isLight){
      document.documentElement.setAttribute("data-theme", isLight ? "light" : "dark");
      document.documentElement.classList.toggle("light-mode", !!isLight);
      updateThemeIcons(!!isLight);
      try { localStorage.setItem(THEME_KEY, !!isLight ? "light" : "dark"); } catch(e){}
    }
    // estado inicial desde localStorage (preload también puede haberlo aplicado)
    try{
      const t = localStorage.getItem(THEME_KEY) || document.documentElement.getAttribute("data-theme") || "dark";
      const isLight = (t === "light");
      applyTheme(isLight);
    }catch(e){}

    // Toggle con animación
    if(btn){
      btn.addEventListener("click", ()=>{
        btn.classList.add("rotating");
        const currentlyLight = document.documentElement.classList.contains("light-mode");
        const target = !currentlyLight;
        setTimeout(()=> applyTheme(target), 240);
        setTimeout(()=> btn.classList.remove("rotating"), 600);
      });
    }

    // Escuchar cambios desde otras pestañas
     window.addEventListener("storage", (e)=>{
    if(e.key === PROG_KEY) updateLessonProgressUI(Number(e.newValue||0));
    if(e.key === TICK15_KEY){
      const el = document.getElementById("activityTick15");
      if(el) el.checked = !!localStorage.getItem(TICK15_KEY);
    }
    if(e.key === TICK5_KEY) refreshTick5State();
  });

  // --- ENSURE FIX DEFINITIVO ---
  (function ensureCorrectProgressOnLoadAndSync(){
    const FLAGS = [
      TICK5_KEY,
      POINTS_INTERACT_KEY,
      TICK15_KEY,
      RULER_MEASURED_KEY,
      PLANE_INTERACT_FLAG,
      FINAL_FLAG
    ];

    recomputeAndStoreProgress();

    window.addEventListener("storage", (ev)=>{
      if(!ev.key) return;
      if(FLAGS.includes(ev.key)){
        recomputeAndStoreProgress();
      }
    });
  })();

  // --- MINI‑DESAFÍO: checkbox funcional (+35%) exclusivo para la tarjeta "Puntos y Líneas" ---
  (function initMiniChallengeTick(){
    const chk = document.getElementById("miniChallengeTick");
    const status = document.getElementById("miniChallengeStatus");
    if(!chk) return;
    try{
      chk.checked = !!localStorage.getItem(FINAL_FLAG);
      if(chk.checked && status) status.textContent = "Mini desafío completado";
    }catch(e){}

    chk.addEventListener("change", () => {
      try {
        if(chk.checked){
          localStorage.setItem(FINAL_FLAG, "1");
          recomputeAndStoreProgress();
          notify("actividad completada +30% de progreso");
          if(status) status.textContent = "Mini desafío completado";
        } else {
          localStorage.removeItem(FINAL_FLAG);
          recomputeAndStoreProgress();
          notify("actividad desmarcada -30% de progreso");
          if(status) status.textContent = "";
        }
      } catch(e){}
    });
  })();
  
  /* ======= MANEJO DE TEMA (SIN CAMBIOS) ======= */
  })()})