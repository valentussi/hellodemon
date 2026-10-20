/* CONFIGURACIÓN SUPABASE y utilidades ======
   Pegá acá la URL y la "anon public key" (Project Settings > API).
   Si quedan vacías, el foro funciona en MODO DEMO (guarda solo en tu navegador). */
const SUPABASE_URL = "https://cotfmcwrfnpyretqixlz.supabase.co/rest";
const SUPABASE_KEY = "sb_publishable_nz34E65C_iHUEtqVz05Zww_Gg3to0f9";
const sb = (SUPABASE_URL && SUPABASE_KEY) ? supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

const $ = s => document.querySelector(s);
const esc = t => { const d = document.createElement("div"); d.textContent = t; return d.innerHTML; };
let filtro = "todos", sonido = false;
