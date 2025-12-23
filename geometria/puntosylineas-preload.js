(function(){
  try {
    var t = localStorage.getItem("learnix-theme");
    if (t) {
      document.documentElement.setAttribute("data-theme", t);
      document.documentElement.classList.toggle("light-mode", t === "light");
    }
  } catch (e) { /* noop */ }
})();
