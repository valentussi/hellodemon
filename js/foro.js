/* ====== 2) ACCESO A DATOS (Supabase o localStorage) ====== */
const demo = { get: () => JSON.parse(localStorage.getItem("cripta") || "[]"), set: a => localStorage.setItem("cripta", JSON.stringify(a)) };
const db = {
  async posts() {
    if (!sb) return demo.get();
    const { data, error } = await sb.from("posts").select("*, comments(*)").order("created_at", { ascending: false });
    if (error) throw error; return data;
  },
  async addPost(p) {
    if (sb) { const { error } = await sb.from("posts").insert(p); if (error) throw error; return; }
    const a = demo.get(); a.unshift({ ...p, id: crypto.randomUUID(), created_at: new Date().toISOString(), likes: 0, comments: [] }); demo.set(a);
  },
  async like(id) {
    if (sb) { await sb.rpc("dar_like", { post_id: id }); return; }
    const a = demo.get(); a.find(p => p.id === id).likes++; demo.set(a);
  },
  async addComment(c) {
    if (sb) { const { error } = await sb.from("comments").insert(c); if (error) throw error; return; }
    const a = demo.get(); a.find(p => p.id === c.post_id).comments.push({ ...c, created_at: new Date().toISOString() }); demo.set(a);
  }
};

/* ====== 3) RENDER ====== */
const ICON = { disfraces: "🎭", decoracion: "🕯️", historias: "👻" };
const likes = new Set(JSON.parse(localStorage.getItem("likes") || "[]"));

async function render() {
  $("#modo").textContent = sb ? "" : "🧪 Modo demo: las publicaciones se guardan solo en este navegador. Conectá Supabase en script.js.";
  let posts;
  try { posts = await db.posts(); } catch (e) { $("#feed").innerHTML = "<p>No se pudo conectar con la base de datos. Revisá la URL y la clave de Supabase.</p>"; return; }
  posts = posts.filter(p => filtro === "todos" || p.category === filtro);
  if (!posts.length) { $("#feed").innerHTML = "<p>Todavía no hay nada acá. ¡Publicá la primera idea!</p>"; return; }
  $("#feed").innerHTML = posts.map(p => `
  <article class="post" data-c="${p.category}" data-id="${p.id}">
    <div class="meta">${ICON[p.category]} ${p.category} · por <b>${esc(p.author)}</b> · ${new Date(p.created_at).toLocaleDateString("es-AR")}</div>
    <h3>${esc(p.title)}</h3><p>${esc(p.body)}</p>
    ${p.image_url ? `<img class="foto" src="${esc(p.image_url)}" alt="Imagen de ${esc(p.title)}" loading="lazy" onerror="this.remove()">` : ""}
    <div class="acc"><button class="like ${likes.has(p.id) ? "dado" : ""}">🎃 ${p.likes}</button><span>💬 ${(p.comments || []).length}</span></div>
    <div class="coms">${(p.comments || []).map(c => `<div class="com"><b>${esc(c.author)}:</b> ${esc(c.body)}</div>`).join("")}
      <form class="fcom"><input placeholder="Apodo" maxlength="30" required><input placeholder="Escribí un comentario…" maxlength="500" required><button class="btn">Comentar</button></form></div>
  </article>`).join("");
}

/* ====== 4) EVENTOS ====== */
$("#f-post").addEventListener("submit", async e => {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target)); if (!f.image_url) f.image_url = null;
  try { await db.addPost(f); e.target.reset(); sfx(110, .5); location.hash = "#foro"; render(); } catch (er) { alert("No se pudo publicar: " + er.message); }
});
$("#feed").addEventListener("click", async e => {
  const b = e.target.closest(".like"); if (!b) return;
  const id = b.closest(".post").dataset.id; if (likes.has(id)) return;
  likes.add(id); localStorage.setItem("likes", JSON.stringify([...likes])); sfx(520, .15);
  await db.like(id); render();
});
$("#feed").addEventListener("submit", async e => {
  e.preventDefault(); const [a, t] = e.target.querySelectorAll("input");
  await db.addComment({ post_id: e.target.closest(".post").dataset.id, author: a.value, body: t.value }); sfx(300, .2); render();
});
$("#tabs").addEventListener("click", e => {
  if (!e.target.dataset.c) return; filtro = e.target.dataset.c;
  document.querySelectorAll("#tabs button").forEach(b => b.classList.toggle("on", b === e.target)); render();
});