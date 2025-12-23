document.addEventListener("DOMContentLoaded", ()=> {
	const d = document, $ = s => d.querySelector(s), $$ = s => Array.from(d.querySelectorAll(s));

	// --- Sincronización de tema ---
	const applyTheme = val => {
		d.body.classList.toggle("light-mode", val === "light");
		d.documentElement.classList.toggle("light-mode", val === "light");
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
	window.addEventListener("storage", (e) => {
		if (e.key === "learnix-theme") {
			applyTheme(e.newValue);
			$$(".theme-toggle-checkbox").forEach(ch => ch.checked = (e.newValue === "light"));
		}
	});

	const form = $("#registerForm"), btn = $("#registerButton");
	const pwToggle = $("#togglePassword"), nameI = $("#name"), emailI = $("#email");
	const passI = $("#password"), cpassI = $("#confirmPassword"), terms = $("#terms");
	const nc = $("#notificationContainer") || d.body;

	const notify = (msg, type="success", ms=3000) => {
		const n = d.createElement("div");
		n.className = `notification ${type}`;
		n.textContent = msg;
		nc.appendChild(n);
		setTimeout(()=> { n.style.opacity = 0; setTimeout(()=> n.remove(), 300); }, ms);
	};

	// Toggle por click: mostrar/ocultar contraseña
	if (pwToggle) pwToggle.addEventListener("click", ()=> {
		if(!passI) return;
		const show = passI.type === "password";
		passI.type = show ? "text" : "password";
		pwToggle.setAttribute("aria-pressed", show ? "true" : "false");
		const open = pwToggle.querySelector(".eye-open"), monk = pwToggle.querySelector(".eye-monkey");
		if(open && monk){ open.style.display = show ? "none" : "inline"; monk.style.display = show ? "inline" : "none"; }
	});

	// Envío simple con validaciones compactas
	if (form) form.addEventListener("submit", async (e) => {
		e.preventDefault();
		const name = (nameI.value || "").trim();
		const email = (emailI.value || "").trim();
		const pass = passI.value || "";
		const cpass = cpassI.value || "";
		if (!name) { notify("Nombre requerido", "error"); return; }
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { notify("Correo inválido", "error"); return; }
		if (pass.length < 8 || !/[A-Z]/.test(pass) || !/[a-z]/.test(pass) || !/\d/.test(pass)) {
			notify("Contraseña: mínimo 8, mayúscula, minúscula y número", "error"); return;
		}
		if (pass !== cpass) { notify("Las contraseñas no coinciden", "error"); return; }
		if (!terms || !terms.checked) { notify("Acepta términos y condiciones", "error"); return; }

		btn.classList.add("loading"); btn.disabled = true;
		await new Promise(r=>setTimeout(r,800)); // simula llamada
		const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
		if (users.find(u => u.email === email)) {
			btn.classList.remove("loading"); btn.disabled = false;
			notify("Correo ya registrado", "error"); return;
		}
		// Registro exitoso
		const newUser = {
			id: Date.now(),
			name: name,
			email: email,
			password: pass, // En producción, esto debería estar hasheado
			registrationDate: new Date().toISOString(),
			coins: 0,
			xp: 0,
			progress: {} // espacio para guardar progreso por lección/juego
		}

		// Guardar usuario
		users.push(newUser)
		localStorage.setItem("registeredUsers", JSON.stringify(users))
		btn.classList.remove("loading"); btn.disabled = false;
		notify(`Cuenta creada. ¡Bienvenido ${name}!`, "success");
		setTimeout(()=> location.href = "login.html", 700);
	});
});
