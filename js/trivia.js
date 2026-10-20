/* Minijuego de preguntas: [pregunta, [opciones], índice de la correcta] */
const PREGUNTAS = [
  ["¿Quién creó a Jack Skellington y la historia de “Pesadilla antes de Navidad”?", ["Tim Burton", "Guillermo del Toro", "Wes Craven", "Steven Spielberg"], 0],
  ["¿Cómo se llama el perro fantasma de Jack Skellington?", ["Sparky", "Zero", "Scooby", "Fang"], 1],
  ["¿Cuántas hermanas Sanderson hay en “Hocus Pocus”?", ["Dos", "Tres", "Cuatro", "Cinco"], 1],
  ["En “Hocus Pocus”, ¿en qué animal está convertido Binx?", ["Un cuervo", "Un perro", "Un gato negro", "Un sapo"], 2],
  ["¿Qué máscara usa el asesino de “Scream”?", ["Ghostface", "Hockey", "Pumpkinhead", "Leatherface"], 0],
  ["¿Cómo se llama el asesino de la película “Halloween” (1978)?", ["Jason Voorhees", "Freddy Krueger", "Michael Myers", "Chucky"], 2],
  ["En “Coraline”, ¿qué reemplaza a los ojos de los otros personajes?", ["Botones", "Monedas", "Estrellas", "Velas"], 0],
  ["En “Beetlejuice”, ¿qué hay que decir tres veces para invocarlo?", ["Abracadabra", "Su nombre", "“Fantasma”", "“Halloween”"], 1],
  ["En “La familia Addams”, ¿cómo se llama el primo peludo?", ["Lurch", "Cosa", "Eso", "Fétido"], 2],
  ["En “Monsters, Inc.”, ¿qué energía recolectan de los niños?", ["Sueños", "Risas", "Gritos", "Lágrimas"], 2],
  ["En “Frankenweenie”, ¿a quién resucita Victor?", ["A su abuelo", "A su perro Sparky", "A su gato", "A su hermana"], 1],
  ["¿Qué instrumento toca Merlina Addams en la serie “Merlina”?", ["Violonchelo", "Piano", "Guitarra", "Violín"], 0],
  ["En “Hotel Transylvania”, ¿quién es el dueño del hotel?", ["Frankenstein", "Drácula", "El Hombre Lobo", "Blobby"], 1],
  ["En “El cadáver de la novia”, ¿cómo se llama el novio vivo?", ["Victor", "Edward", "Jack", "Igor"], 0],
  ["En “Cazafantasmas”, ¿a quién llamás cuando hay un fantasma?", ["A la policía", "A los Cazafantasmas", "A Casper", "A Beetlejuice"], 1]
];
const T = id => document.getElementById(id);
let tq, ti, tp, tt, tiempo;
const mejor = () => +localStorage.getItem("cripta-mejor") || 0;
const mostrar = p => ["t-ini", "t-juego", "t-fin"].forEach(i => T(i).hidden = i !== p);
const mezclar = a => [...a].sort(() => Math.random() - .5);

function empezar() { tq = mezclar(PREGUNTAS).slice(0, 10); ti = 0; tp = 0; mostrar("t-juego"); pregunta(); }
function pregunta() {
  const [q, ops, c] = tq[ti];
  T("t-num").textContent = `Pregunta ${ti + 1} de 10 · ${tp} puntos`; T("t-q").textContent = q; T("t-ops").innerHTML = "";
  mezclar(ops.map((t, i) => ({ t, ok: i === c }))).forEach(o => {
    const b = document.createElement("button"); b.textContent = o.t; b.dataset.ok = o.ok;
    b.onclick = () => responder(b); T("t-ops").append(b);
  });
  tiempo = 15; T("t-bar").style.width = "100%"; clearInterval(tt);
  tt = setInterval(() => { tiempo--; T("t-bar").style.width = tiempo / 15 * 100 + "%"; if (tiempo <= 0) responder(null); }, 1000);
}
function responder(b) {
  clearInterval(tt); const acierto = b && b.dataset.ok === "true";
  [...T("t-ops").children].forEach(x => { x.disabled = true; if (x.dataset.ok === "true") x.classList.add("bien"); });
  if (b && !acierto) b.classList.add("mal");
  if (acierto) tp += 100 + tiempo * 10;
  sfx(acierto ? 660 : 130, .3);
  setTimeout(() => { ++ti < 10 ? pregunta() : fin(); }, 1400);
}
function fin() {
  mostrar("t-fin"); T("t-pts").textContent = tp + " pts";
  const nuevo = tp > mejor(); if (nuevo) localStorage.setItem("cripta-mejor", tp);
  T("t-msg").textContent = (nuevo ? "🏆 ¡Nuevo récord! " : "") + (tp > 1500 ? "Sos un experto del terror." : tp > 800 ? "Nada mal, aprendiz de brujo." : "Te falta ver más pelis de miedo 👻");
  T("t-mejor").textContent = mejor();
}
T("t-go").onclick = T("t-otra").onclick = empezar;
T("t-mejor").textContent = mejor();