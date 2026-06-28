/* ===================================================================
   PRODUCTOS — Único archivo que tocás para cargar prendas.

   Copiá un bloque { ... }, pegalo y cambiá los datos. Campos:

     nombre     (texto)   Nombre de la prenda.
     marca      (texto)   Marca. Genera el filtro de marcas automático.
     categoria  (texto)   slug definido en config.js (CATEGORIAS):
                          zapatos, botas, buzos, remeras, camperas,
                          pantalones, mochilas, gorros, gafas, etc.
     seccion    (texto)   "stock"     -> página Stock
                          "encargues" -> página Encargues
     precio     (número)  Sin puntos ni símbolos. Ej: 45000
     descripcion(texto)   Detalle de la prenda.
     talles     (lista)   ["S","M","L"]  o  ["38","39","40"]
     colores    (lista)   Opcional. ["Negro","Blanco"]
     imagenes   (lista)   Rutas a fotos: ["assets/buzo-1.jpg", ...]
                          Vacío [] -> placeholder con degradé automático.
     destacado  (true/false)  Opcional. Badge "Destacado".
     agotado    (true/false)  Opcional. Badge "Agotado".

   ⚠ Acordate de la coma "," al final de cada producto.
   =================================================================== */

const PRODUCTOS = [
  {
    nombre: "Jordan 5 Midnight Navy",
    marca: "Jordan", categoria: "zapatos", seccion: "encargues",
    precio: 0,
    talles: ["36","36.5","37.5","38","39","40","40.5","41","42","42.5","43","44","44.5","45","46","47.5"],
    imagenes: [
      "assets/jordan/jordan-5-midnight-navy-1.jpeg",
      "assets/jordan/jordan-5-midnight-navy-2.jpeg",
      "assets/jordan/jordan-5-midnight-navy-2.jpeg",
      "assets/jordan/jordan-5-midnight-navy-3.jpeg",
      "assets/jordan/jordan-5-midnight-navy-4.jpeg",
      "assets/jordan/jordan-5-midnight-navy-5.jpeg",
    ],
  },
  {
    nombre: "Pantalón Nike Tech ( Baggy )",
    marca: "Nike", categoria: "pantalones", seccion: "encargues",
    precio: 0,
    talles: ["S","M","L","XL"],
    colores: ["Negro","Gris","Verde","Azul Oscuro","Crema"],
    imagenes: [
      "assets/nike/pantalon-nike-tech-baggy-1.jpg",
      "assets/nike/pantalon-nike-tech-baggy-2.jpg",
      "assets/nike/pantalon-nike-tech-baggy-3.jpg",
      "assets/nike/pantalon-nike-tech-baggy-4.jpg",
      "assets/nike/pantalon-nike-tech-baggy-5.jpg",
      "assets/nike/pantalon-nike-tech-baggy-6.jpg",
    ],
  },
  {
    nombre: "Jordan 5 University Blue",
    marca: "Jordan", categoria: "zapatos", seccion: "encargues",
    precio: 0,
    talles: ["36.5","37.5","38","39","40","40.5","41","42","42.5","43","44","44.5","45","46","47.5"],
    imagenes: [
      "assets/jordan/jordan-5-university-blue-1.jpeg",
      "assets/jordan/jordan-5-university-blue-2.jpeg",
      "assets/jordan/jordan-5-university-blue-3.jpeg",
      "assets/jordan/jordan-5-university-blue-4.jpeg",
      "assets/jordan/jordan-5-university-blue-5.jpeg",
      "assets/jordan/jordan-5-university-blue-6.jpeg",
    ],
  },
  {
    nombre: "Cinto Louis Vuitton",
    marca: "Louis Vuitton", categoria: "cintos", seccion: "encargues",
    precio: 0,
    descripcion: "Tiene varios diseños diferentes, pedir foto por mensaje.",
    talles: ["105cm","110cm","115cm","120cm","125cm"],
    colores: ["Negro","Blanco"],
    imagenes: [
      "assets/louis-vuitton/cinto-louis-vuitton-1.jpg",
      "assets/louis-vuitton/cinto-louis-vuitton-2.jpg",
      "assets/louis-vuitton/cinto-louis-vuitton-3.jpg",
      "assets/louis-vuitton/cinto-louis-vuitton-4.jpg",
    ],
  },
  {
    nombre: "Nike Tech Flecce ( Modelo Nuevo )",
    marca: "Nike", categoria: "conjuntos", seccion: "encargues",
    precio: 0,
    talles: ["M","L","XL","XXL"],
    colores: ["Negro","Azul","Verde","Gris"],
    imagenes: [
      "assets/nike/nike-tech-flecce-modelo-nuevo-1.jpg",
      "assets/nike/nike-tech-flecce-modelo-nuevo-2.jpg",
      "assets/nike/nike-tech-flecce-modelo-nuevo-3.jpg",
      "assets/nike/nike-tech-flecce-modelo-nuevo-4.jpg",
    ],
    destacado: true,
  },
  {
    nombre: "Conjuntos Nike Tech ( Modelo Viejo )",
    marca: "Nike", categoria: "conjuntos", seccion: "encargues",
    precio: 0,
    talles: ["S","M","L","XL"],
    colores: ["Negro","Gris","Azul","Rojo","Blanco","Blanco y Negro","Gris y Negro"],
    imagenes: [
      "assets/nike/conjuntos-nike-tech-modelo-viejo-3.jpeg",
      "assets/nike/conjuntos-nike-tech-modelo-viejo-4.jpeg",
      "assets/nike/conjuntos-nike-tech-modelo-viejo-5.jpeg",
      "assets/nike/conjuntos-nike-tech-modelo-viejo-6.jpeg",
      "assets/nike/conjuntos-nike-tech-modelo-viejo-7.jpeg",
      "assets/nike/conjuntos-nike-tech-modelo-viejo-8.jpeg",
      "assets/nike/conjuntos-nike-tech-modelo-viejo-9.jpeg",
      "assets/nike/conjuntos-nike-tech-modelo-viejo-10.jpeg",
      "assets/nike/conjuntos-nike-tech-modelo-viejo-11.jpeg",
      "assets/nike/conjuntos-nike-tech-modelo-viejo-1.jpg",
      "assets/nike/conjuntos-nike-tech-modelo-viejo-2.jpg",
      "assets/nike/conjuntos-nike-tech-modelo-viejo-3.jpg",
    ],
  },
  /* ============================ STOCK ============================ */
];
