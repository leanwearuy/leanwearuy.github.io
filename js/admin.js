/* ===================================================================
   PANEL DE ADMINISTRACIÓN — LeanWear
   Agrega productos (con imágenes) commiteando directo al repo via la
   API de GitHub. Página estática: no hay servidor.

   ⚠ SEGURIDAD: la contraseña de abajo es solo una traba liviana. Como
   todo corre en el navegador, alguien que mire el código fuente puede
   verla. La protección REAL es el token de GitHub: sin él no se puede
   publicar nada. Por eso el token NO se guarda en el código, solo en
   tu navegador (localStorage).
   =================================================================== */

(function () {
  "use strict";

  // 🔑 Cambiá esta clave por la que quieras.
  const ADMIN_PASS = "leanwear2026";

  const LS_KEY = "leanwear_admin_gh"; // dónde se guarda la config de GitHub
  const SS_OK = "leanwear_admin_ok";  // sesión autenticada

  const $ = (id) => document.getElementById(id);

  // Estado (declarado arriba para que esté disponible apenas se abre el panel).
  let imgFiles = []; // entradas: {file, url} (nueva) o {path, url, existing:true} (ya en el repo)
  let inited = false;
  let editCtx = null; // si estamos editando: { meta: {nombre,marca,seccion} original }

  /* ============ slug (igual que en el sitio) ============ */
  const slug = (t) =>
    (t || "").toString().toLowerCase().normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  /* ============ Pantalla de clave ============ */
  const gate = $("gate"), panel = $("panel");
  function abrirPanel() {
    gate.hidden = true;
    panel.hidden = false;
    initPanel();
  }
  function intentarEntrar() {
    if ($("gatePass").value === ADMIN_PASS) {
      sessionStorage.setItem(SS_OK, "1");
      abrirPanel();
    } else {
      $("gateErr").textContent = "Clave incorrecta.";
    }
  }
  $("gateBtn").addEventListener("click", intentarEntrar);
  $("gatePass").addEventListener("keydown", (e) => { if (e.key === "Enter") intentarEntrar(); });
  $("logoutBtn") && $("logoutBtn").addEventListener("click", () => {
    sessionStorage.removeItem(SS_OK);
    location.reload();
  });
  if (sessionStorage.getItem(SS_OK) === "1") abrirPanel();
  else $("gatePass").focus();

  /* ============ Inicialización del panel ============ */
  function initPanel() {
    if (inited) return;
    inited = true;

    // Categorías desde config.js (evita errores de slug)
    const sel = $("fCategoria");
    const cats = (typeof CATEGORIAS !== "undefined") ? CATEGORIAS : {};
    sel.innerHTML = Object.entries(cats)
      .map(([slugCat, info]) => `<option value="${slugCat}">${info.label}</option>`)
      .join("") || `<option value="otros">Otros</option>`;

    // Config GitHub guardada + valores por defecto de este proyecto.
    const saved = JSON.parse(localStorage.getItem(LS_KEY) || "{}");
    let owner = saved.owner || "leanwear-uy";
    let repo = saved.repo || "leanwear-uy.github.io";
    let branch = saved.branch || "main";
    // Si en el futuro cambia el repo, intenta deducirlo de la URL al vuelo.
    if (!saved.owner && location.hostname.endsWith("github.io")) {
      owner = location.hostname.split(".")[0];
      const seg = location.pathname.split("/").filter(Boolean);
      // Sitio de usuario (raíz) -> repo = hostname; sitio de proyecto -> 1er segmento (carpeta, sin punto).
      repo = (seg[0] && !seg[0].includes(".")) ? seg[0] : location.hostname;
    }
    $("ghOwner").value = owner;
    $("ghRepo").value = repo;
    $("ghBranch").value = branch;
    $("ghToken").value = saved.token || "";

    ["ghOwner", "ghRepo", "ghBranch", "ghToken"].forEach((id) =>
      $(id).addEventListener("change", guardarConfig)
    );

    $("testBtn").addEventListener("click", probarConexion);
    $("forgetBtn").addEventListener("click", () => {
      localStorage.removeItem(LS_KEY);
      $("ghToken").value = "";
      setStatus("Token borrado de este navegador.", "");
    });

    initImagenes();
    $("publishBtn").addEventListener("click", publicar);
    $("reloadBtn").addEventListener("click", loadProductos);
    $("cancelEdit").addEventListener("click", salirEdicion);

    // Si ya hay token guardado, cargar la lista al entrar.
    if ((saved.token || "").trim()) loadProductos();
  }

  function getCfg() {
    return {
      owner: $("ghOwner").value.trim(),
      repo: $("ghRepo").value.trim(),
      branch: $("ghBranch").value.trim() || "main",
      token: $("ghToken").value.trim(),
    };
  }
  function guardarConfig() {
    localStorage.setItem(LS_KEY, JSON.stringify(getCfg()));
  }
  function setStatus(msg, cls) {
    const el = $("connStatus");
    el.textContent = msg;
    el.className = "conn-status " + (cls || "");
  }

  /* ============ Imágenes ============ */
  function initImagenes() {
    const drop = $("imgDrop"), input = $("imgInput");
    drop.addEventListener("click", () => input.click());
    input.addEventListener("change", () => { addFiles(input.files); input.value = ""; });
    ["dragenter", "dragover"].forEach((ev) =>
      drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add("over"); }));
    ["dragleave", "drop"].forEach((ev) =>
      drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove("over"); }));
    drop.addEventListener("drop", (e) => addFiles(e.dataTransfer.files));
  }
  function addFiles(fileList) {
    Array.from(fileList).filter((f) => f.type.startsWith("image/")).forEach((f) =>
      imgFiles.push({ file: f, url: URL.createObjectURL(f) }));
    renderPreviews();
  }
  function renderPreviews() {
    $("imgPreviews").innerHTML = imgFiles.map((im, i) => `
      <div class="img-thumb">
        ${i === 0 ? `<span class="main-tag">Principal</span>` : ""}
        <img src="${im.url}" alt="foto ${i + 1}" />
        <div class="img-actions">
          ${i !== 0 ? `<button data-act="main" data-i="${i}">★</button>` : ""}
          <button data-act="del" data-i="${i}">✕</button>
        </div>
      </div>`).join("");
    $("imgPreviews").querySelectorAll("button").forEach((b) =>
      b.addEventListener("click", () => {
        const i = Number(b.dataset.i);
        if (b.dataset.act === "del") imgFiles.splice(i, 1);
        else { const [it] = imgFiles.splice(i, 1); imgFiles.unshift(it); }
        renderPreviews();
      }));
  }

  /* ============ API de GitHub ============ */
  async function gh(path, opts = {}) {
    const cfg = getCfg();
    // Sin barra final cuando path está vacío (esa barra de más hace fallar el CORS).
    const url = `https://api.github.com/repos/${cfg.owner}/${cfg.repo}` + (path ? `/${path}` : "");
    return fetch(url, {
      ...opts,
      headers: {
        "Authorization": `Bearer ${cfg.token}`,
        "Accept": "application/vnd.github+json",
        ...(opts.headers || {}),
      },
    });
  }
  const encPath = (p) => p.split("/").map(encodeURIComponent).join("/");

  async function getFile(path) {
    const cfg = getCfg();
    const res = await gh(`contents/${encPath(path)}?ref=${encodeURIComponent(cfg.branch)}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`No pude leer ${path}: ${res.status} ${await res.text()}`);
    return res.json();
  }
  async function putFile(path, base64, message, sha) {
    const cfg = getCfg();
    const body = { message, content: base64, branch: cfg.branch };
    if (sha) body.sha = sha;
    const res = await gh(`contents/${encPath(path)}`, { method: "PUT", body: JSON.stringify(body) });
    if (!res.ok) throw new Error(`Error subiendo ${path}: ${res.status} ${await res.text()}`);
    return res.json();
  }

  async function probarConexion() {
    guardarConfig();
    const cfg = getCfg();
    if (!cfg.owner || !cfg.repo || !cfg.token) return setStatus("Completá usuario, repo y token.", "bad");
    setStatus("Probando...", "");
    try {
      const res = await gh("");
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const j = await res.json();
      const perm = j.permissions && j.permissions.push;
      setStatus(`✓ Conectado a ${j.full_name}` + (perm ? " (con permiso de escritura)" : " — ⚠ el token no tiene permiso de escritura"), perm ? "ok" : "bad");
    } catch (e) {
      setStatus("✗ No se pudo conectar. Revisá usuario/repo/token. " + e.message, "bad");
    }
  }

  /* ============ Helpers base64 ============ */
  const b64Text = (str) => btoa(unescape(encodeURIComponent(str)));
  const decodeText = (b64) => decodeURIComponent(escape(atob(b64.replace(/\n/g, ""))));
  function b64File(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => { const s = r.result.split(",")[1]; resolve(s); };
      r.onerror = reject;
      r.readAsDataURL(file);
    });
  }

  /* ============ Construir el bloque de producto ============ */
  // Cuerpo del objeto: desde "{" hasta "}" (sin la indentación inicial ni la coma final).
  function literalBody(p) {
    const L = ["{"];
    L.push(`    nombre: ${JSON.stringify(p.nombre)},`);
    L.push(`    marca: ${JSON.stringify(p.marca)}, categoria: ${JSON.stringify(p.categoria)}, seccion: ${JSON.stringify(p.seccion)},`);
    L.push(`    precio: ${Number(p.precio) || 0},`);
    if (p.descripcion) L.push(`    descripcion: ${JSON.stringify(p.descripcion)},`);
    L.push(`    talles: ${JSON.stringify(p.talles)},`);
    if (p.colores.length) L.push(`    colores: ${JSON.stringify(p.colores)},`);
    if (p.imagenes.length) {
      L.push("    imagenes: [");
      p.imagenes.forEach((s) => L.push(`      ${JSON.stringify(s)},`));
      L.push("    ],");
    } else L.push("    imagenes: [],");
    if (p.destacado) L.push("    destacado: true,");
    if (p.agotado) L.push("    agotado: true,");
    L.push("  }");
    return L.join("\n");
  }
  // Para AGREGAR: con indentación inicial y coma final.
  const literal = (p) => "  " + literalBody(p) + ",";

  // Parsea un bloque {…} del archivo a objeto JS (para precargar el form al editar).
  function parseBlock(block) {
    try { return new Function("return (" + block + ")")(); }
    catch (e) { return null; }
  }

  // Busca una ruta de imagen libre (no pisa fotos existentes).
  async function freePath(base, ext) {
    let n = 1, path;
    do { path = `${base}-${n}.${ext}`; n++; } while (await getFile(path));
    return path;
  }

  /* ============ Log ============ */
  function log(msg, cls) {
    const el = $("log");
    el.innerHTML += `<span class="${cls || ""}">${msg}</span>\n`;
    el.scrollTop = el.scrollHeight;
  }

  /* ============ Publicar ============ */
  async function publicar() {
    guardarConfig();
    const cfg = getCfg();
    const p = {
      nombre: $("fNombre").value.trim(),
      marca: $("fMarca").value.trim(),
      categoria: $("fCategoria").value,
      seccion: $("fSeccion").value,
      precio: $("fPrecio").value,
      talles: $("fTalles").value.split(",").map((s) => s.trim()).filter(Boolean),
      colores: $("fColores").value.split(",").map((s) => s.trim()).filter(Boolean),
      descripcion: $("fDescripcion").value.trim(),
      destacado: $("fDestacado").checked,
      agotado: $("fAgotado").checked,
      imagenes: [],
    };

    // Validaciones
    if (!cfg.owner || !cfg.repo || !cfg.token) return setStatus("Configurá la conexión con GitHub (paso 1).", "bad");
    if (!p.nombre || !p.marca || !p.categoria) { $("log").textContent = ""; return log("✗ Faltan campos obligatorios (nombre, marca, categoría).", "bad"); }

    const btn = $("publishBtn");
    btn.disabled = true;
    $("log").textContent = "";

    try {
      const marcaSlug = slug(p.marca) || "productos";
      const prodSlug = slug(p.nombre) || "producto";

      // 1) Imágenes: las existentes se conservan, las nuevas se suben.
      if (imgFiles.length) {
        const nuevas = imgFiles.filter((im) => !im.existing).length;
        if (nuevas) log(`Subiendo ${nuevas} imagen(es) nueva(s)...`, "info");
        for (let i = 0; i < imgFiles.length; i++) {
          const im = imgFiles[i];
          if (im.existing) { p.imagenes.push(im.path); continue; }
          const f = im.file;
          const ext = (f.name.split(".").pop() || "jpg").toLowerCase();
          const path = await freePath(`assets/${marcaSlug}/${prodSlug}`, ext);
          await putFile(path, await b64File(f), `img: ${p.nombre}`);
          p.imagenes.push(path);
          log(`  ✓ ${path}`, "ok");
        }
      } else {
        log("Sin imágenes: se usará un placeholder en el sitio.", "info");
      }

      // 2) Actualizar products.js (agregar o reemplazar el bloque)
      log("Actualizando products.js...", "info");
      const file = await getFile("js/products.js");
      if (!file) throw new Error("No encontré js/products.js en el repo.");
      const current = decodeText(file.content);
      let updated, msg;

      if (editCtx) {
        // EDITAR: ubicar el bloque original por nombre+marca+seccion y reemplazarlo.
        const objs = findObjects(current);
        const o = objs.find((x) =>
          x.meta.nombre === editCtx.meta.nombre &&
          x.meta.marca === editCtx.meta.marca &&
          x.meta.seccion === editCtx.meta.seccion);
        if (!o) throw new Error("No encontré el producto a editar (¿cambió en el repo?). Tocá 'Actualizar lista' y reintentá.");
        updated = current.slice(0, o.start) + literalBody(p) + current.slice(o.end);
        msg = `editar: ${p.nombre}`;
      } else {
        // AGREGAR: insertar al inicio del array.
        const marker = "const PRODUCTOS = [";
        const idx = current.indexOf(marker);
        if (idx < 0) throw new Error('No encontré "const PRODUCTOS = [" en products.js.');
        const pos = idx + marker.length;
        updated = current.slice(0, pos) + "\n" + literal(p) + current.slice(pos);
        msg = `producto: ${p.nombre}`;
      }

      await putFile("js/products.js", b64Text(updated), msg, file.sha);
      log("  ✓ products.js actualizado", "ok");

      log(`\n✅ ¡${editCtx ? "Cambios guardados" : "Publicado"}! El sitio se actualiza en ~1 minuto.`, "ok");
      setStatus((editCtx ? "Editado: " : "Publicado: ") + p.nombre, "ok");

      salirEdicion();        // limpia form, imágenes y modo edición
      await loadProductos(); // refrescar la lista de abajo
    } catch (e) {
      log("\n✗ " + e.message, "bad");
    } finally {
      btn.disabled = false;
    }
  }

  /* ============ Listar / eliminar productos ============ */
  let estadoLista = null; // { text, sha, objs:[{start,end,meta}] }

  // Encuentra cada objeto {…} dentro de "const PRODUCTOS = [ … ]" (saltea strings y comentarios).
  function findObjects(src) {
    const marker = "const PRODUCTOS = [";
    const mi = src.indexOf(marker);
    if (mi < 0) return [];
    let i = mi + marker.length;
    let arrDepth = 1, brace = 0, objStart = -1;
    let inStr = null, esc = false, inLine = false, inBlock = false;
    const objs = [];
    for (; i < src.length; i++) {
      const c = src[i], n = src[i + 1];
      if (inLine) { if (c === "\n") inLine = false; continue; }
      if (inBlock) { if (c === "*" && n === "/") { inBlock = false; i++; } continue; }
      if (inStr) { if (esc) esc = false; else if (c === "\\") esc = true; else if (c === inStr) inStr = null; continue; }
      if (c === "/" && n === "/") { inLine = true; i++; continue; }
      if (c === "/" && n === "*") { inBlock = true; i++; continue; }
      if (c === '"' || c === "'" || c === "`") { inStr = c; continue; }
      if (c === "[") { arrDepth++; continue; }
      if (c === "]") { arrDepth--; if (arrDepth === 0 && brace === 0) break; continue; }
      if (c === "{") { if (brace === 0) objStart = i; brace++; continue; }
      if (c === "}") { brace--; if (brace === 0 && objStart >= 0) { objs.push({ start: objStart, end: i + 1 }); objStart = -1; } continue; }
    }
    return objs.map((o) => ({ ...o, meta: metaOf(src.slice(o.start, o.end)) }));
  }
  function metaOf(block) {
    const g = (re) => { const m = block.match(re); return m ? m[1] : ""; };
    const imgsTxt = (block.match(/imagenes:\s*\[([\s\S]*?)\]/) || [])[1] || "";
    const img = (imgsTxt.match(/"([^"]+)"/) || [])[1] || "";
    return {
      nombre: g(/nombre:\s*"([^"]*)"/),
      marca: g(/marca:\s*"([^"]*)"/),
      seccion: g(/seccion:\s*"([^"]*)"/),
      precio: g(/precio:\s*([0-9]+)/),
      img,
    };
  }
  function quitarBloque(text, obj) {
    let start = obj.start, end = obj.end;
    while (text[end] === " " || text[end] === "\t") end++;
    if (text[end] === ",") end++;
    while (start > 0 && (text[start - 1] === " " || text[start - 1] === "\t")) start--;
    if (text[end] === "\n") end++;
    return text.slice(0, start) + text.slice(end);
  }

  async function loadProductos() {
    const cont = $("prodList");
    const cfg = getCfg();
    if (!cfg.owner || !cfg.repo || !cfg.token) { cont.innerHTML = `<p class="pl-empty">Configurá la conexión (paso 1) para ver la lista.</p>`; return; }
    cont.innerHTML = `<p class="pl-empty">Cargando...</p>`;
    try {
      const file = await getFile("js/products.js");
      if (!file) throw new Error("No encontré js/products.js");
      const text = decodeText(file.content);
      const objs = findObjects(text);
      estadoLista = { text, sha: file.sha, objs };
      renderLista();
    } catch (e) {
      cont.innerHTML = `<p class="pl-empty">No se pudo cargar: ${e.message}</p>`;
    }
  }
  function renderLista() {
    const cont = $("prodList");
    const { objs } = estadoLista;
    if (!objs.length) { cont.innerHTML = `<p class="pl-empty">No hay productos cargados todavía.</p>`; return; }
    cont.innerHTML = objs.map((o, k) => {
      const m = o.meta;
      const thumb = m.img
        ? `<img class="pr-thumb" src="${m.img}" alt="" loading="lazy" onerror="this.classList.add('sinfoto')" />`
        : `<span class="pr-thumb sinfoto"></span>`;
      return `<div class="prod-row">
        ${thumb}
        <div class="pr-info">
          <b>${m.nombre || "(sin nombre)"}</b>
          <span class="pr-sub">${[m.marca, m.seccion, m.precio ? CONFIG.moneda + " " + m.precio : ""].filter(Boolean).join(" · ")}</span>
        </div>
        <div class="pr-actions">
          <button class="pr-edit" data-k="${k}">Editar</button>
          <button class="pr-del" data-k="${k}">Eliminar</button>
        </div>
      </div>`;
    }).join("");
    cont.querySelectorAll(".pr-del").forEach((b) =>
      b.addEventListener("click", () => eliminar(Number(b.dataset.k))));
    cont.querySelectorAll(".pr-edit").forEach((b) =>
      b.addEventListener("click", () => editar(Number(b.dataset.k))));
  }

  /* ============ Editar ============ */
  function editar(k) {
    const o = estadoLista.objs[k];
    if (!o) return;
    const data = parseBlock(estadoLista.text.slice(o.start, o.end));
    if (!data) { alert("No pude leer este producto para editarlo."); return; }

    // Precargar el formulario
    $("fNombre").value = data.nombre || "";
    $("fMarca").value = data.marca || "";
    $("fSeccion").value = data.seccion || "stock";
    // la categoría puede no estar en el select si es un slug viejo: la agrego al vuelo
    const catSel = $("fCategoria");
    if (data.categoria && !Array.from(catSel.options).some((op) => op.value === data.categoria))
      catSel.insertAdjacentHTML("beforeend", `<option value="${data.categoria}">${data.categoria}</option>`);
    catSel.value = data.categoria || catSel.value;
    $("fPrecio").value = data.precio || "";
    $("fTalles").value = (data.talles || []).join(", ");
    $("fColores").value = (data.colores || []).join(", ");
    $("fDescripcion").value = data.descripcion || "";
    $("fDestacado").checked = !!data.destacado;
    $("fAgotado").checked = !!data.agotado;

    // Imágenes existentes (se pueden conservar, reordenar o quitar)
    imgFiles = (data.imagenes || []).map((path) => ({ path, url: path, existing: true }));
    renderPreviews();

    editCtx = { meta: { nombre: o.meta.nombre, marca: o.meta.marca, seccion: o.meta.seccion } };
    $("publishBtn").textContent = "Guardar cambios";
    $("editBadge").hidden = false;
    $("editName").textContent = data.nombre || "";
    $("log").textContent = "";
    $("fNombre").scrollIntoView({ behavior: "smooth", block: "center" });
  }

  // Vuelve al modo "agregar": limpia todo.
  function salirEdicion() {
    ["fNombre", "fMarca", "fPrecio", "fTalles", "fColores", "fDescripcion"].forEach((id) => $(id).value = "");
    $("fDestacado").checked = false; $("fAgotado").checked = false;
    imgFiles = []; renderPreviews();
    editCtx = null;
    $("publishBtn").textContent = "Publicar producto";
    $("editBadge").hidden = true;
  }
  async function eliminar(k) {
    const o = estadoLista.objs[k];
    if (!o) return;
    if (!confirm(`¿Eliminar "${o.meta.nombre}" del catálogo?\n\n(Las fotos quedan en assets, no se borran.)`)) return;
    $("log").textContent = "";
    try {
      log(`Eliminando ${o.meta.nombre}...`, "info");
      const newText = quitarBloque(estadoLista.text, o);
      await putFile("js/products.js", b64Text(newText), `borrar: ${o.meta.nombre}`, estadoLista.sha);
      log("✓ Eliminado. El sitio se actualiza en ~1 minuto.", "ok");
      await loadProductos();
    } catch (e) {
      log("✗ " + e.message + "\n(Si dice 409, tocá 'Actualizar lista' y reintentá.)", "bad");
    }
  }
})();
