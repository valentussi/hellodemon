/* Navegación entre secciones: muestra una sola a la vez según el # de la URL */
function ir() {
  const id = location.hash.slice(1) || "inicio";
  document.querySelectorAll(".vista").forEach(v => v.classList.toggle("activa", v.id === id));
  document.querySelectorAll("#menu a").forEach(a => a.classList.toggle("on", a.hash === "#" + id));
  if (id === "foro") render();
  scrollTo(0, 0);
}
addEventListener("hashchange", ir);
ir();