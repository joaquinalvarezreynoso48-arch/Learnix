// Versión mínima: tema, toggle contraseña, validación y simulación de login

document.addEventListener("DOMContentLoaded", () => {
	const d = document, $ = s => d.querySelector(s), $$ = s => Array.from(d.querySelectorAll(s));
	// elementos
	const form = $("#loginForm"), btn = $("#loginButton");
	const tBtn = $("#togglePassword"), pw = $("#password"), em = $("#email");
	const nc = $("#notificationContainer") || d.body;
	const demos = [{email:"admin@learnix.com",password:"admin123",name:"Administrador"},{email:"estudiante@learnix.com",password:"estudiante123",name:"Estudiante Demo"}];

	// sincronización tema (localStorage + toggles)
	const applyTheme = val => {
		d.body.classList.toggle("light-mode", val === "light");
		d.documentElement.classList.toggle("light-mode", val === "light");
		const ic = $(".theme-icon"); if (ic) ic.textContent = val === "light" ? "☀️" : "🌙";
	};
	const setTheme = val => {
		localStorage.setItem("learnix-theme", val);
		applyTheme(val);
		$$(".theme-toggle-checkbox").forEach(ch => ch.checked = (val === "light"));
	};
	const saved = localStorage.getItem("learnix-theme") || (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
	applyTheme(saved);
	$$(".theme-toggle-checkbox").forEach(ch => { 
		ch.checked = (saved === "light"); 
		ch.addEventListener("change", () => setTheme(ch.checked ? "light" : "dark")); 
	});
	window.addEventListener("storage", (e) => { if (e.key === "learnix-theme") { applyTheme(e.newValue); $$(".theme-toggle-checkbox").forEach(ch=>ch.checked = (e.newValue === "light")); } });

	// notificaciones simples
	const notify = (m, t="success", ms=2500) => {
		const n = d.createElement("div"); n.className = "notification " + t; n.textContent = m; nc.appendChild(n);
		setTimeout(()=>{ n.style.opacity = 0; setTimeout(()=> n.remove(), 300); }, ms);
	};

	// toggle contraseña por click (mantiene aria-pressed e iconos)
	if (tBtn) tBtn.addEventListener("click", () => {
		if (!pw) return;
		const show = pw.type === "password";
		pw.type = show ? "text" : "password";
		tBtn.setAttribute("aria-pressed", show ? "true" : "false");
		const open = tBtn.querySelector(".eye-open"), monk = tBtn.querySelector(".eye-monkey");
		if (open && monk) { open.style.display = show ? "none" : "inline"; monk.style.display = show ? "inline" : "none"; }
	});

	// login: validación mínima, busca en registeredUsers o demos, si existe redirige a index.html
	if (form) form.addEventListener("submit", async (e) => {
		e.preventDefault();
		const email = (em && em.value || "").trim(), pass = (pw && pw.value || "");
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { notify("Correo inválido","error"); return; }
		if (pass.length < 6) { notify("Contraseña mínimo 6","error"); return; }
		btn.classList.add("loading"); btn.disabled = true;
		await new Promise(r=>setTimeout(r,700));
		const users = JSON.parse(localStorage.getItem("registeredUsers")||"[]");
		const user = users.find(u=>u.email===email && u.password===pass) || demos.find(u=>u.email===email && u.password===pass);
		btn.classList.remove("loading"); btn.disabled = false;
		if (user) {
			// Guardar sesión con id y nombre
			localStorage.setItem("currentUser", JSON.stringify({ id: user.id, email: user.email, name: user.name }))
			// Volcar monedas / XP del usuario al estado global utilizado por la app
			localStorage.setItem("learnix-coins", String(user.coins || 0))
			localStorage.setItem("learnix-xp", String(user.xp || 0))
			// Redirigir inmediatamente
			location.href = "index.html"
			return;
		}
		else notify("Credenciales incorrectas","error");
	});
});
