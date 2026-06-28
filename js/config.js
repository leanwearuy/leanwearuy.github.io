/* ===================================================================
   CONFIGURACIÓN GENERAL
   =================================================================== */

const CONFIG = {
  // Usuario de Instagram, SIN la @. Todo el contacto pasa por acá.
  instagram: "leanwear.uy",
  email: "hola@leanwear.com",
  moneda: "$",
};

/* -------------------------------------------------------------------
   TAXONOMÍA — Agrupa las categorías en el menú lateral (Ropa, Calzado,
   Accesorios), igual que una tienda. La CLAVE es el slug que escribís
   en products.js (campo "categoria"). El "label" es lo que se muestra.

   Si usás una categoría nueva en products.js que no esté acá, igual
   funciona: aparece con su nombre capitalizado dentro de "Otros".
   ------------------------------------------------------------------- */
const CATEGORIAS = {
  cintos: { label: "Cintos", grupo: "Accesorios" },
  zapatos:    { label: "Zapatillas",        grupo: "Calzado" },
  botas:      { label: "Botas",             grupo: "Calzado" },
  sandalias:  { label: "Sandalias",         grupo: "Calzado" },
  mocasines:  { label: "Mocasines y Planos", grupo: "Calzado" },

  buzos:      { label: "Buzos y Hoodies",   grupo: "Ropa" },
  remeras:    { label: "Remeras",           grupo: "Ropa" },
  camisetas:  { label: "Camisetas",         grupo: "Ropa" },
  camisas:    { label: "Camisas",           grupo: "Ropa" },
  camperas:   { label: "Camperas",          grupo: "Ropa" },
  pantalones: { label: "Pantalones",        grupo: "Ropa" },
  conjuntos:  { label: "Conjuntos",         grupo: "Ropa" },

  mochilas:   { label: "Bolsos y Mochilas", grupo: "Accesorios" },
  gorros:     { label: "Gorros",            grupo: "Accesorios" },
  gafas:      { label: "Gafas",             grupo: "Accesorios" },
};

// Orden en que aparecen los grupos en el sidebar.
const GRUPOS_ORDEN = ["Ropa", "Calzado", "Accesorios", "Otros"];

// Opciones del selector "Ordenar por".
const ORDENES = [
  { id: "reco",     label: "Recomendados" },
  { id: "precio-asc",  label: "Precio: menor a mayor" },
  { id: "precio-desc", label: "Precio: mayor a menor" },
  { id: "nombre",   label: "Nombre A-Z" },
];
