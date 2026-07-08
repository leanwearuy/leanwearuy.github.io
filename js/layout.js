/* ===================================================================
   LAYOUT — Header, footer y botón de Instagram compartidos por todas
   las páginas. No hace falta tocar este archivo.
   =================================================================== */

(function () {
  "use strict";

  const page = document.body.dataset.page || "stock"; // stock | encargues | contacto

  // Contacto: TODO por Instagram.
  const igUser = CONFIG.instagram;
  const igProfile = `https://instagram.com/${igUser}`;
  const igDM = `https://ig.me/m/${igUser}`; // abre el mensaje directo (DM)

  // Íconos SVG (se ven siempre, sin depender de emojis del sistema).
  const svg = (paths) =>
    `<svg class="nav-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
  const ICON = {
    stock: svg(`<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>`),
    encargues: svg(`<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>`),
    contacto: svg(`<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>`),
    user: svg(`<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`),
    search: svg(`<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>`),
    instagram: svg(`<rect x="2" y="2" width="20" height="20" rx="5.5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor" stroke="currentColor" stroke-width="1.6"/>`),
  };

  /* ---------- Header ---------- */
  const header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML = `
    <div class="container header-inner">
      <a class="brand" href="index.html" aria-label="LeanWear inicio">
        <span class="brand-name">Lean<b>Wear</b></span>
      </a>

      <form class="search" id="searchForm" role="search">
        <span class="ico">${ICON.search}</span>
        <input id="searchInput" type="search" placeholder="Buscar marcas, prendas, zapatillas..." autocomplete="off" />
        <button type="button" class="search-clear" id="searchClear" aria-label="Limpiar">✕</button>
        <button type="submit" class="search-go" aria-label="Buscar">${ICON.search}</button>
      </form>

      <nav class="header-nav" id="headerNav">
        <a href="stock.html" data-page="stock" class="nav-stock ${page === "stock" ? "active" : ""}">
          ${ICON.stock}<span class="nav-text">Stock</span>
        </a>
        <a href="index.html" data-page="encargues" class="${page === "encargues" ? "active" : ""}">
          ${ICON.encargues}<span class="nav-text">Encargues</span>
        </a>
        <a href="contacto.html" data-page="contacto" class="${page === "contacto" ? "active" : ""}">
          ${ICON.contacto}<span class="nav-text">Cómo comprar</span>
        </a>
        <span class="account">${ICON.user}</span>
      </nav>
    </div>`;
  document.body.prepend(header);

  /* ---------- Buscador (se comunica con el catálogo por eventos) ---------- */
  const input = header.querySelector("#searchInput");
  const clear = header.querySelector("#searchClear");
  const form = header.querySelector("#searchForm");
  const hasCatalog = !!document.querySelector(".catalog");

  // Lee ?q= de la URL (por si llega desde otra página).
  const urlQ = new URLSearchParams(location.search).get("q") || "";
  if (urlQ) { input.value = urlQ; clear.classList.add("show"); }

  function emit() {
    clear.classList.toggle("show", input.value.length > 0);
    document.dispatchEvent(new CustomEvent("lean:search", { detail: input.value }));
  }
  input.addEventListener("input", emit);
  clear.addEventListener("click", () => { input.value = ""; emit(); input.focus(); });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    // En contacto no hay grilla: mandamos la búsqueda a Stock.
    if (!hasCatalog && input.value.trim())
      location.href = "index.html?q=" + encodeURIComponent(input.value.trim());
    else emit();
  });
  // Estado inicial para el catálogo.
  if (urlQ) setTimeout(emit, 0);

  /* ---------- Footer ---------- */
  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="container footer-inner">
      <div class="footer-brand">
        <span class="brand-name">Lean<b>Wear</b></span>
        <p>Importación de ropa y calzado. Encargues y stock disponible, atención directa por Instagram.</p>
        <a class="footer-mail" href="mailto:${CONFIG.email}" aria-label="Email">✉️</a>
      </div>
      <div class="footer-col">
        <h4>Explorar</h4>
        <ul>
          <li><a href="index.html">Encargues</a></li>
          <li><a href="stock.html">Stock disponible</a></li>
          <li><a href="contacto.html">Cómo comprar</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Soporte</h4>
        <ul>
          <li><a href="contacto.html">Cómo comprar</a></li>
          <li><a href="${igDM}" target="_blank" rel="noopener">Preguntas frecuentes</a></li>
          <li><a href="contacto.html">Contactanos</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Seguinos</h4>
        <ul>
          <li><a href="${igProfile}" target="_blank" rel="noopener" class="hl">Instagram</a></li>
          <li><a href="${igDM}" target="_blank" rel="noopener">Mensaje directo</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Legal</h4>
        <ul>
          <li><a href="#">Términos de servicio</a></li>
          <li><a href="#">Política de privacidad</a></li>
        </ul>
      </div>
    </div>
    <div class="container footer-bottom">
      <p>© <span id="year"></span> LeanWear · Importación de indumentaria</p>
      <span class="lang">🌐 Español</span>
    </div>`;
  document.body.appendChild(footer);
  footer.querySelector("#year").textContent = new Date().getFullYear();

  /* ---------- Botón flotante de Instagram ---------- */
  const ig = document.createElement("a");
  ig.className = "ig-float";
  ig.href = igDM;
  ig.target = "_blank";
  ig.rel = "noopener";
  ig.setAttribute("aria-label", "Instagram");
  ig.innerHTML = ICON.instagram;
  document.body.appendChild(ig);

  /* ---------- Helpers compartidos (catálogo + detalle) ---------- */
  function slug(text) {
    return (text || "").toString().toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }
  const productId = (p) => slug(`${p.marca || ""} ${p.nombre || ""}`);
  const findProduct = (id) =>
    typeof PRODUCTOS !== "undefined" ? PRODUCTOS.find((p) => productId(p) === id) : null;

  const cap = (s) => (s || "").charAt(0).toUpperCase() + (s || "").slice(1);
  // Pega los paréntesis a su palabra (espacio que no corta) para que no quede ")" colgando.
  const tidyName = (s) => (s || "").replace(/\(\s+/g, "(\u00A0").replace(/\s+\)/g, "\u00A0)");
  const catLabel = (s) =>
    (typeof CATEGORIAS !== "undefined" && CATEGORIAS[s] && CATEGORIAS[s].label) || cap(s);
  const precioFmt = (n) =>
    (typeof n === "number" && n > 0) ? `${CONFIG.moneda} ${n.toLocaleString("es-AR")}` : "Consultar";

  function placeholder(nombre) {
    const ini = (nombre || "LW").trim().slice(0, 16);
    const s = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'>
      <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stop-color='#2a1a4d'/><stop offset='1' stop-color='#0d0a18'/>
      </linearGradient></defs>
      <rect width='600' height='600' fill='url(#g)'/>
      <text x='50%' y='45%' fill='#8b5cf6' font-family='Sora,Arial' font-size='52' font-weight='700' text-anchor='middle'>◆</text>
      <text x='50%' y='56%' fill='#a79fc4' font-family='Inter,Arial' font-size='26' text-anchor='middle'>${ini}</text>
    </svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(s);
  }
  const imgSrc = (p, i = 0) => (p.imagenes && p.imagenes[i]) || placeholder(p.nombre);
  const onErr = (p) => `this.onerror=null;this.src='${placeholder(p.nombre)}'`;

  // Productos parecidos: prioriza misma categoría, después misma marca.
  function similares(p, n = 8) {
    if (typeof PRODUCTOS === "undefined") return [];
    const score = (x) =>
      (x.categoria === p.categoria ? 2 : 0) +
      (x.marca === p.marca ? 1 : 0) +
      (x.seccion === p.seccion ? 1 : 0);
    return PRODUCTOS.filter((x) => x !== p).sort((a, b) => score(b) - score(a)).slice(0, n);
  }

  // Tarjeta de producto (link a la página de detalle). Misma en catálogo y "también te puede gustar".
  function cardHTML(p) {
    const badge = p.agotado
      ? `<span class="card-badge sold">Agotado</span>`
      : p.destacado ? `<span class="card-badge">Destacado</span>` : "";
    return `
      <a class="card" href="producto.html?id=${productId(p)}">
        <div class="card-media">
          <img src="${imgSrc(p)}" alt="${p.nombre}" loading="lazy" onerror="${onErr(p)}" />
          ${badge}
        </div>
        <div class="card-body">
          <p class="card-name">${tidyName(p.nombre)}</p>
          <div class="card-foot">
            <span class="card-price">${precioFmt(p.precio)}</span>
          </div>
        </div>
      </a>`;
  }

  // Expuesto para catalog.js y producto.js.
  window.LeanWear = {
    igProfile, igDM, slug, productId, findProduct, catLabel, precioFmt,
    placeholder, imgSrc, onErr, similares, cardHTML, tidyName,
  };
})();
