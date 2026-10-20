/* ====== 5) EFECTOS: cursor, murciélagos y sonido ====== */
const cur = $("#cur");
addEventListener("mousemove", e => {
  cur.style.left = e.clientX + "px"; cur.style.top = e.clientY + "px";
  cur.textContent = e.target.closest("button,a,select") ? "💀" : e.target.closest("input,textarea") ? "👻" : "🕷️";
});
function murcielago() {
  const s = document.createElement("span"); s.textContent = "🦇";
  s.style.cssText = `--y:${Math.random() * 60 + 5}vh;--s:${20 + Math.random() * 30}px;--t:${8 + Math.random() * 8}s`;
  $("#bats").appendChild(s); setTimeout(() => s.remove(), 17000);
}
setInterval(murcielago, 3500); murcielago();

let ctx;
function sfx(freq, dur) { // sonidos generados con Web Audio (sin archivos)
  if (!sonido) return; ctx ??= new AudioContext();
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = "sawtooth"; o.frequency.setValueAtTime(freq, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(freq / 2, ctx.currentTime + dur);
  g.gain.setValueAtTime(.15, ctx.currentTime); g.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + dur);
  o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime + dur);
}
$("#snd").onclick = e => { sonido = !sonido; e.target.textContent = sonido ? "🔊" : "🔇"; sfx(200, .6); };