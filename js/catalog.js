/* ===================================================================
   CATÁLOGO — Construye la barra de categorías, el sidebar de filtros,
   la grilla de productos. Las tarjetas linkean a producto.html. Lee la sección desde
   <div class="catalog" data-seccion="stock|encargues">.
   No hace falta tocar este archivo.
   =================================================================== */

(function () {
  "use strict";

  const root = document.querySelector(".catalog");
  if (!root) return;

  const seccion = root.dataset.seccion;
  const ITEMS = PRODUCTOS.filter((p) => p.seccion === seccion);

  /* ---------- Helpers ---------- */
  const cap = (s) => (s || "").charAt(0).toUpperCase() + (s || "").slice(1);
  const catLabel = (slug) => (CATEGORIAS[slug] && CATEGORIAS[slug].label) || cap(slug);
  const catGrupo = (slug) => (CATEGORIAS[slug] && CATEGORIAS[slug].grupo) || "Otros";
  const precioFmt = (n) =>
    typeof n === "number" ? `${CONFIG.moneda} ${n.toLocaleString("es-AR")}` : "Consultar";

  function placeholder(nombre) {
    const ini = (nombre || "LW").trim().slice(0, 16);
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'>
      <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stop-color='#2a1a4d'/><stop offset='1' stop-color='#0d0a18'/>
      </linearGradient></defs>
      <rect width='600' height='600' fill='url(#g)'/>
      <text x='50%' y='45%' fill='#8b5cf6' font-family='Sora,Arial' font-size='52' font-weight='700' text-anchor='middle'>◆</text>
      <text x='50%' y='56%' fill='#a79fc4' font-family='Inter,Arial' font-size='26' text-anchor='middle'>${ini}</text>
    </svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }
  const imgSrc = (p, i = 0) => (p.imagenes && p.imagenes[i]) || placeholder(p.nombre);
  const onErr = (p) => `this.onerror=null;this.src='${placeholder(p.nombre)}'`;

  /* ---------- Estado ---------- */
  const POR_PAGINA = 16; // productos por página (4 filas de 4). Cambiá este número si querés.
  const state = { categoria: "all", marca: "all", q: "", sort: "reco", tab: "cat", page: 1 };
  // categoría inicial desde la URL (?cat=zapatos)
  const urlCat = new URLSearchParams(location.search).get("cat");
  if (urlCat) state.categoria = urlCat;

  const categoriasPresentes = [...new Set(ITEMS.map((p) => p.categoria))];
  const marcasPresentes = [...new Set(ITEMS.map((p) => p.marca))].sort();

  /* ---------- Shell HTML ---------- */
  root.innerHTML = `
    <div class="cat-bar">
      <div class="container cat-bar-inner" id="catBar"></div>
    </div>
    <div class="container catalog-shell">
      <div class="catalog-grid">
        <aside class="sidebar">
          <div class="sb-tabs">
            <button class="sb-tab active" data-tab="cat">Categorías</button>
            <button class="sb-tab" data-tab="marca">Marcas</button>
          </div>
          <div class="sb-meta">
            <span class="sb-count" id="sbCount"></span>
            <div class="sb-sort">
              <label for="sortSel">Ordenar por</label>
              <select id="sortSel">
                ${ORDENES.map((o) => `<option value="${o.id}">${o.label}</option>`).join("")}
              </select>
            </div>
          </div>
          <div class="sb-panel" id="panelCat"></div>
          <div class="sb-panel" id="panelMarca" hidden></div>
        </aside>

        <section class="content">
          <div class="toolbar">
            <div class="active-filters" id="activeFilters"></div>
          </div>
          <div class="grid" id="grid"></div>
          <p class="empty-state" id="empty" hidden>No hay productos que coincidan con el filtro.</p>
          <nav class="pager" id="pager" aria-label="Paginación"></nav>
        </section>
      </div>
    </div>`;

  const $ = (s) => root.querySelector(s);
  const $$ = (s) => Array.from(root.querySelectorAll(s));

  /* ---------- Barra de categorías (top) ---------- */
  function buildCatBar() {
    const bar = $("#catBar");
    const tabs = [["all", "All"], ...categoriasPresentes.map((c) => [c, catLabel(c)])];
    bar.innerHTML = tabs
      .map(([id, label]) => `<button class="cat-tab" data-cat="${id}">${label}</button>`)
      .join("");
    bar.addEventListener("click", (e) => {
      const b = e.target.closest(".cat-tab");
      if (!b) return;
      state.categoria = b.dataset.cat;
      resetPagina();
    });
  }

  /* ---------- Sidebar: categorías agrupadas ---------- */
  function buildPanelCat() {
    const panel = $("#panelCat");
    const grupos = {};
    categoriasPresentes.forEach((c) => {
      const g = catGrupo(c);
      (grupos[g] = grupos[g] || []).push(c);
    });
    const ordenGrupos = GRUPOS_ORDEN.filter((g) => grupos[g]);

    let html = `<button class="sb-all" data-cat="all">Todos los productos</button>`;
    ordenGrupos.forEach((g) => {
      const items = grupos[g]
        .map((c) => {
          const qty = ITEMS.filter((p) => p.categoria === c).length;
          return `<button class="sb-item" data-cat="${c}">${catLabel(c)}<span class="qty">${qty}</span></button>`;
        })
        .join("");
      html += `
        <div class="sb-group" data-group="${g}">
          <button class="sb-group-head">${g}<span class="chev">▾</span></button>
          <div class="sb-items">${items}</div>
        </div>`;
    });
    panel.innerHTML = html;

    panel.addEventListener("click", (e) => {
      const head = e.target.closest(".sb-group-head");
      if (head) { head.parentElement.classList.toggle("collapsed"); return; }
      const item = e.target.closest("[data-cat]");
      if (item) { state.categoria = item.dataset.cat; resetPagina(); }
    });
  }

  /* ---------- Sidebar: marcas ---------- */
  function buildPanelMarca() {
    const panel = $("#panelMarca");
    let html = `<button class="sb-all" data-marca="all">Todas las marcas</button><div class="sb-items">`;
    html += marcasPresentes
      .map((m) => {
        const qty = ITEMS.filter((p) => p.marca === m).length;
        return `<button class="sb-item" data-marca="${m}">${m}<span class="qty">${qty}</span></button>`;
      })
      .join("");
    html += `</div>`;
    panel.innerHTML = html;
    panel.addEventListener("click", (e) => {
      const item = e.target.closest("[data-marca]");
      if (item) { state.marca = item.dataset.marca; resetPagina(); }
    });
  }

  /* ---------- Tabs del sidebar ---------- */
  function bindTabs() {
    $$(".sb-tab").forEach((t) =>
      t.addEventListener("click", () => {
        state.tab = t.dataset.tab;
        $$(".sb-tab").forEach((x) => x.classList.toggle("active", x === t));
        $("#panelCat").hidden = state.tab !== "cat";
        $("#panelMarca").hidden = state.tab !== "marca";
      })
    );
    $("#sortSel").addEventListener("change", (e) => { state.sort = e.target.value; resetPagina(); });
  }

  /* ---------- Filtrado + orden ---------- */
  function filtrar() {
    const q = state.q.trim().toLowerCase();
    let list = ITEMS.filter((p) => {
      if (state.categoria !== "all" && p.categoria !== state.categoria) return false;
      if (state.marca !== "all" && p.marca !== state.marca) return false;
      if (q && !(`${p.nombre} ${p.marca} ${catLabel(p.categoria)}`.toLowerCase().includes(q))) return false;
      return true;
    });
    if (state.sort === "precio-asc") list.sort((a, b) => (a.precio || 0) - (b.precio || 0));
    else if (state.sort === "precio-desc") list.sort((a, b) => (b.precio || 0) - (a.precio || 0));
    else if (state.sort === "nombre") list.sort((a, b) => a.nombre.localeCompare(b.nombre));
    else {
      // "Recomendados": destacados primero, agotados al final, el resto en tu orden manual.
      const rank = (p) => (p.agotado ? 2 : (p.destacado ? 0 : 1));
      list.sort((a, b) => rank(a) - rank(b)); // Array.sort es estable: mantiene tu orden dentro de cada grupo
    }
    return list;
  }

  /* ---------- Chips de filtros activos ---------- */
  function buildActiveFilters() {
    const cont = $("#activeFilters");
    const chips = [];
    if (state.categoria !== "all")
      chips.push(`<span class="af-chip">${catLabel(state.categoria)}<button data-clear="categoria">✕</button></span>`);
    if (state.marca !== "all")
      chips.push(`<span class="af-chip">${state.marca}<button data-clear="marca">✕</button></span>`);
    if (state.q.trim())
      chips.push(`<span class="af-chip">“${state.q.trim()}”<button data-clear="q">✕</button></span>`);

    cont.innerHTML =
      `<span class="af-label">Filtros activos:</span>` +
      (chips.length ? chips.join("") : `<span class="af-label">ninguno</span>`) +
      (chips.length ? `<button class="af-clear" data-clear="all">Limpiar todo</button>` : ``);

    cont.querySelectorAll("[data-clear]").forEach((b) =>
      b.addEventListener("click", () => {
        const k = b.dataset.clear;
        if (k === "all") { state.categoria = "all"; state.marca = "all"; state.q = ""; document.querySelector("#searchInput").value = ""; document.querySelector("#searchClear").classList.remove("show"); }
        else if (k === "q") { state.q = ""; document.querySelector("#searchInput").value = ""; document.querySelector("#searchClear").classList.remove("show"); }
        else state[k] = "all";
        resetPagina();
      })
    );
  }

  /* ---------- Render principal ---------- */
  function render() {
    const list = filtrar();

    // estados activos
    $$("[data-cat]").forEach((b) => b.classList.toggle("active", b.dataset.cat === state.categoria));
    $$("[data-marca]").forEach((b) => b.classList.toggle("active", b.dataset.marca === state.marca));
    $("#sbCount").textContent = `${list.length} resultado${list.length === 1 ? "" : "s"} encontrado${list.length === 1 ? "" : "s"}`;

    buildActiveFilters();

    const grid = $("#grid");
    const empty = $("#empty");
    empty.hidden = list.length > 0;

    // Paginación
    const totalPages = Math.max(1, Math.ceil(list.length / POR_PAGINA));
    if (state.page > totalPages) state.page = totalPages;
    const inicio = (state.page - 1) * POR_PAGINA;
    const pageItems = list.slice(inicio, inicio + POR_PAGINA);

    grid.innerHTML = pageItems
      .map((p, i) =>
        LeanWear.cardHTML(p).replace(
          '<a class="card"',
          `<a class="card" style="animation-delay:${Math.min(i * 35, 400)}ms"`
        )
      )
      .join("");

    renderPager(totalPages);
  }

  /* ---------- Paginación (1 2 3 …) ---------- */
  function renderPager(totalPages) {
    const pager = $("#pager");
    if (totalPages <= 1) { pager.innerHTML = ""; return; }

    // Ventana de números con "…" si hay muchas páginas.
    const cur = state.page, nums = [];
    const push = (n) => nums.push(n);
    if (totalPages <= 7) { for (let i = 1; i <= totalPages; i++) push(i); }
    else {
      push(1);
      if (cur > 3) push("…");
      for (let i = Math.max(2, cur - 1); i <= Math.min(totalPages - 1, cur + 1); i++) push(i);
      if (cur < totalPages - 2) push("…");
      push(totalPages);
    }

    const btn = (label, page, opts = {}) =>
      `<button class="pg-btn ${opts.active ? "active" : ""} ${opts.dis ? "dis" : ""}"
        ${opts.dis ? "disabled" : ""} data-page="${page}">${label}</button>`;

    pager.innerHTML =
      btn("‹", cur - 1, { dis: cur === 1 }) +
      nums.map((n) => n === "…"
        ? `<span class="pg-dots">…</span>`
        : btn(n, n, { active: n === cur })).join("") +
      btn("›", cur + 1, { dis: cur === totalPages });

    pager.querySelectorAll(".pg-btn").forEach((b) =>
      b.addEventListener("click", () => {
        if (b.disabled) return;
        irAPagina(Number(b.dataset.page));
      }));
  }

  function irAPagina(n) {
    state.page = n;
    render();
    // Subir al inicio del catálogo al cambiar de página.
    root.querySelector(".catalog-shell").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Cambió un filtro/búsqueda → volver a la página 1.
  function resetPagina() { state.page = 1; render(); }

  /* ---------- Búsqueda desde el header ---------- */
  document.addEventListener("lean:search", (e) => { state.q = e.detail || ""; resetPagina(); });

  /* ---------- Init ---------- */
  buildCatBar();
  buildPanelCat();
  buildPanelMarca();
  bindTabs();
  render();
})();
