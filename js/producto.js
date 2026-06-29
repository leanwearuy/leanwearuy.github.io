/* ===================================================================
   PRODUCTO — Página de detalle (producto.html?id=slug).
   Galería de fotos, talles/colores, datos y "También te puede gustar".
   No hace falta tocar este archivo.
   =================================================================== */

(function () {
  "use strict";

  const L = window.LeanWear;
  const main = document.getElementById("prodMain");
  const id = new URLSearchParams(location.search).get("id");
  const p = id ? L.findProduct(id) : null;

  /* ---------- Producto inexistente ---------- */
  if (!p) {
    main.innerHTML = `
      <div class="prod-missing">
        <h1>Producto no encontrado</h1>
        <p>Puede que haya cambiado o ya no esté disponible.</p>
        <a class="btn-volver" href="index.html">← Volver al catálogo</a>
      </div>`;
    return;
  }

  const seccionPagina = p.seccion === "encargues" ? "index.html" : "stock.html";
  const seccionLabel = p.seccion === "encargues" ? "Encargues" : "Stock";
  const reales = (p.imagenes || []).filter(Boolean);          // solo fotos reales cargadas
  const imgs = reales.length ? reales : [L.placeholder(p.nombre)]; // para la galería
  const estado = p.agotado ? "Agotado" : (p.seccion === "encargues" ? "A pedido" : "Disponible");

  document.title = `${p.nombre} · LeanWear`;

  /* ---------- Estructura ---------- */
  main.innerHTML = `
    <nav class="breadcrumb">
      <a href="${seccionPagina}">← Volver a ${seccionLabel}</a>
      <span class="sep">/</span>
      <a href="${seccionPagina}?cat=${p.categoria}">${L.catLabel(p.categoria)}</a>
      <span class="sep">/</span>
      <span class="cur">${p.nombre}</span>
    </nav>

    <div class="producto-grid">
      <div class="pg-gallery">
        <div class="pg-main">
          <img id="pgMain" src="${imgs[0]}" alt="${p.nombre}" onerror="${L.onErr(p)}" />
          <span class="pg-badge ${p.agotado ? "sold" : ""}">${estado}</span>
        </div>
        <div class="pg-thumbs" id="pgThumbs"></div>
      </div>

      <div class="pg-info">
        <h1 class="pg-title">${L.tidyName(p.nombre)}</h1>
        <div class="pg-tags">
          <span class="pg-tag">${L.catLabel(p.categoria)}</span>
          ${p.marca ? `<span class="pg-tag">${p.marca}</span>` : ""}
          ${p.destacado ? `<span class="pg-tag hl">★ Destacado</span>` : ""}
        </div>

        <div class="pg-actions">
          <button class="pg-action" type="button" id="shareBtn">⇪ Compartir</button>
          <button class="pg-action" type="button" id="linkBtn">🔗 Copiar enlace</button>
        </div>

        <p class="pg-price">${p.precio > 0 ? L.precioFmt(p.precio) : "Consultar por Instagram"}</p>

        ${p.colores && p.colores.length ? `
        <div class="pg-block">
          <div class="pg-block-head"><span class="pg-block-label">Color</span></div>
          <div class="opt-chips" id="optColores">
            ${p.colores.map((c, i) => `<button class="opt-chip ${i === 0 ? "active" : ""}" data-val="${c}">${c}</button>`).join("")}
          </div>
        </div>` : ""}

        <div class="pg-block">
          <div class="pg-block-head"><span class="pg-block-label">Talle</span></div>
          <div class="opt-chips" id="optTalles">
            ${(p.talles && p.talles.length ? p.talles : ["Consultar"])
              .map((t, i) => `<button class="opt-chip ${i === 0 ? "active" : ""}" data-val="${t}">${t}</button>`).join("")}
          </div>
        </div>

        <a class="pg-cta" id="ctaIg" href="${L.igDM}" target="_blank" rel="noopener">◉ Consultar por Instagram</a>
        <p class="pg-sel-hint" id="selHint"></p>
      </div>
    </div>

    <section class="prod-desc">
      <h2>Descripción</h2>
      <p>${p.descripcion || "Sin descripción. Consultá por Instagram para más detalles."}</p>
      <div class="spec">
        <div><span>Marca</span><b>${p.marca || "-"}</b></div>
        <div><span>Categoría</span><b>${L.catLabel(p.categoria)}</b></div>
        <div><span>Disponibilidad</span><b>${estado}</b></div>
        <div><span>Talles</span><b>${(p.talles && p.talles.join(", ")) || "Consultar"}</b></div>
      </div>
    </section>

    ${reales.length ? `
    <section class="real-photos">
      <div class="similar-head">
        <h2>Fotos reales del producto</h2>
        <p>Imágenes reales de la prenda${reales.length > 1 ? " · " + reales.length + " fotos" : ""}. Tocá para ampliar.</p>
      </div>
      <div class="rp-grid" id="rpGrid">
        ${reales.map((src, i) => `<button class="rp-item" type="button" data-i="${i}"><img src="${src}" alt="${p.nombre} foto ${i + 1}" loading="lazy" onerror="${L.onErr(p)}" /></button>`).join("")}
      </div>
    </section>` : ""}

    <section class="similar">
      <div class="similar-head">
        <h2>También te puede gustar</h2>
        <p>Estilos parecidos que te pueden interesar</p>
      </div>
      <div class="grid" id="similarGrid"></div>
    </section>`;

  /* ---------- Galería ---------- */
  const mainImg = document.getElementById("pgMain");
  let curIdx = 0;
  function setMain(i) {
    curIdx = (i + imgs.length) % imgs.length;
    mainImg.src = imgs[curIdx];
    document.querySelectorAll("#pgThumbs img").forEach((x, j) => x.classList.toggle("active", j === curIdx));
    if (lbOpen) lbShow(curIdx);
  }
  document.getElementById("pgThumbs").innerHTML = imgs
    .map((src, i) => `<img src="${src}" alt="${p.nombre} ${i + 1}" class="${i === 0 ? "active" : ""}" data-i="${i}" onerror="${L.onErr(p)}" />`)
    .join("");
  document.querySelectorAll("#pgThumbs img").forEach((th) =>
    th.addEventListener("click", () => setMain(Number(th.dataset.i)))
  );
  mainImg.style.cursor = "zoom-in";
  mainImg.addEventListener("click", () => openLightbox(curIdx));

  // Grid de fotos reales -> abre el visor en esa foto.
  const rpGrid = document.getElementById("rpGrid");
  if (rpGrid) rpGrid.addEventListener("click", (e) => {
    const b = e.target.closest(".rp-item");
    if (b) openLightbox(Number(b.dataset.i));
  });

  /* ---------- Selección de talle / color ---------- */
  const sel = { talle: (p.talles && p.talles[0]) || "", color: (p.colores && p.colores[0]) || "" };
  function bindOpts(contId, key) {
    const cont = document.getElementById(contId);
    if (!cont) return;
    cont.addEventListener("click", (e) => {
      const b = e.target.closest(".opt-chip");
      if (!b) return;
      sel[key] = b.dataset.val;
      cont.querySelectorAll(".opt-chip").forEach((x) => x.classList.toggle("active", x === b));
      updateHint();
    });
  }
  bindOpts("optTalles", "talle");
  bindOpts("optColores", "color");

  // Muestra abajo del botón lo que el cliente eligió (para copiar al DM).
  function updateHint() {
    const partes = [];
    if (sel.color) partes.push("Color: " + sel.color);
    if (sel.talle) partes.push("Talle: " + sel.talle);
    document.getElementById("selHint").textContent = partes.length
      ? "Tu selección → " + partes.join(" · ") : "";
  }
  updateHint();

  /* ---------- Visor (lightbox) ---------- */
  let lbOpen = false;
  const lb = document.createElement("div");
  lb.className = "lightbox";
  lb.hidden = true;
  lb.innerHTML = `
    <button class="lb-close" aria-label="Cerrar">✕</button>
    ${imgs.length > 1 ? `<button class="lb-nav lb-prev" aria-label="Anterior">‹</button>` : ""}
    <img class="lb-img" src="" alt="${p.nombre}" />
    ${imgs.length > 1 ? `<button class="lb-nav lb-next" aria-label="Siguiente">›</button>` : ""}
    <div class="lb-count"></div>`;
  document.body.appendChild(lb);
  const lbImg = lb.querySelector(".lb-img");
  const lbCount = lb.querySelector(".lb-count");
  function lbShow(i) {
    curIdx = (i + imgs.length) % imgs.length;
    lbImg.src = imgs[curIdx];
    lbCount.textContent = `${curIdx + 1} / ${imgs.length}`;
  }
  function openLightbox(i) { lbOpen = true; lb.hidden = false; document.body.style.overflow = "hidden"; lbShow(i); }
  function closeLightbox() { lbOpen = false; lb.hidden = true; document.body.style.overflow = ""; setMain(curIdx); }
  lb.addEventListener("click", (e) => {
    if (e.target.closest(".lb-close") || e.target === lb) return closeLightbox();
    if (e.target.closest(".lb-prev")) return lbShow(curIdx - 1);
    if (e.target.closest(".lb-next")) return lbShow(curIdx + 1);
  });
  document.addEventListener("keydown", (e) => {
    if (!lbOpen) return;
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowLeft") lbShow(curIdx - 1);
    else if (e.key === "ArrowRight") lbShow(curIdx + 1);
  });

  /* ---------- Acciones: compartir / enlace ---------- */
  function toast(msg) {
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add("show"));
    setTimeout(() => { t.classList.remove("show"); setTimeout(() => t.remove(), 300); }, 1800);
  }
  function copiarEnlace() {
    const url = location.href;
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(() => toast("Enlace copiado")).catch(() => toast(url));
    else toast(url);
  }
  document.getElementById("linkBtn").addEventListener("click", copiarEnlace);
  document.getElementById("shareBtn").addEventListener("click", () => {
    if (navigator.share) navigator.share({ title: p.nombre, url: location.href }).catch(() => {});
    else copiarEnlace();
  });

  /* ---------- También te puede gustar ---------- */
  document.getElementById("similarGrid").innerHTML =
    L.similares(p, 8).map((x) => L.cardHTML(x)).join("");
})();
