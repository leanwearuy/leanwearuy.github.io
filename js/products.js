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
    nombre: "Remera Corteiz ( Diseño Armas )",
    marca: "Corteiz", categoria: "remeras", seccion: "encargues",
    precio: 3200,
    talles: ["S","M","L","XL"],
    colores: ["Negro","Blanco"],
    imagenes: [
      "assets/corteiz/remera-corteiz-diseno-armas-1.jpg",
    ],
  },
  {
    nombre: "Remera Camuflada Corteiz",
    marca: "Corteiz", categoria: "remeras", seccion: "encargues",
    precio: 2800,
    talles: ["S","M","L","XL"],
    colores: ["Verde"],
    imagenes: [
      "assets/corteiz/remera-camuflada-corteiz-1.jpg",
      "assets/corteiz/remera-camuflada-corteiz-2.jpg",
      "assets/corteiz/remera-camuflada-corteiz-3.jpg",
      "assets/corteiz/remera-camuflada-corteiz-4.jpg",
    ],
  },
  {
    nombre: "Campera Corteiz",
    marca: "Corteiz", categoria: "camperas", seccion: "encargues",
    precio: 5200,
    talles: ["S","M","L","XL"],
    colores: ["Negro"],
    imagenes: [
      "assets/corteiz/campera-corteiz-1.jpg",
      "assets/corteiz/campera-corteiz-2.jpg",
      "assets/corteiz/campera-corteiz-3.jpg",
      "assets/corteiz/campera-corteiz-4.jpg",
      "assets/corteiz/campera-corteiz-5.jpg",
    ],
  },
  {
    nombre: "Pantalón Corteiz",
    marca: "Corteiz", categoria: "pantalones", seccion: "encargues",
    precio: 3400,
    talles: ["S","M","L","XL"],
    colores: ["Negro"],
    imagenes: [
      "assets/corteiz/pantalon-corteiz-1.jpg",
      "assets/corteiz/pantalon-corteiz-2.jpg",
      "assets/corteiz/pantalon-corteiz-3.jpg",
      "assets/corteiz/pantalon-corteiz-4.jpg",
      "assets/corteiz/pantalon-corteiz-5.jpg",
    ],
  },
  {
    nombre: "Campera Corteiz x DenimTears",
    marca: "Corteiz", categoria: "camperas", seccion: "encargues",
    precio: 7500,
    talles: ["S","M","L","XL"],
    colores: ["Negro","Gris"],
    imagenes: [
      "assets/corteiz/campera-corteiz-x-denimtears-1.jpg",
      "assets/corteiz/campera-corteiz-x-denimtears-2.jpg",
      "assets/corteiz/campera-corteiz-x-denimtears-3.jpg",
      "assets/corteiz/campera-corteiz-x-denimtears-4.jpg",
      "assets/corteiz/campera-corteiz-x-denimtears-5.jpg",
      "assets/corteiz/campera-corteiz-x-denimtears-6.jpg",
      "assets/corteiz/campera-corteiz-x-denimtears-7.jpg",
    ],
  },
  {
    nombre: "Remeras Corteiz",
    marca: "Corteiz", categoria: "camisetas", seccion: "encargues",
    precio: 0,
    talles: ["S","M","L","XL"],
    colores: ["Negro ( Logo Negro )","Negro ( Logo Blanco )","Blanca ( Logo Blanca )"],
    imagenes: [
      "assets/corteiz/remeras-corteiz-1.jpg",
      "assets/corteiz/remeras-corteiz-2.jpg",
      "assets/corteiz/remeras-corteiz-3.jpg",
      "assets/corteiz/remeras-corteiz-4.jpg",
      "assets/corteiz/remeras-corteiz-5.jpg",
      "assets/corteiz/remeras-corteiz-6.jpg",
      "assets/corteiz/remeras-corteiz-7.jpg",
      "assets/corteiz/remeras-corteiz-8.jpg",
      "assets/corteiz/remeras-corteiz-9.jpg",
    ],
  },
  {
    nombre: "Puffer Corteiz",
    marca: "Corteiz", categoria: "camperas", seccion: "encargues",
    precio: 0,
    talles: ["S","M","L","XL"],
    colores: ["Negro"],
    imagenes: [
      "assets/corteiz/puffer-corteiz-1.jpg",
      "assets/corteiz/puffer-corteiz-2.jpg",
      "assets/corteiz/puffer-corteiz-3.jpg",
      "assets/corteiz/puffer-corteiz-4.jpg",
      "assets/corteiz/puffer-corteiz-5.jpg",
    ],
  },
  {
    nombre: "Cargo Corteiz",
    marca: "Corteiz", categoria: "pantalones", seccion: "encargues",
    precio: 0,
    talles: ["S","M","L","XL"],
    colores: ["Negro"],
    imagenes: [
      "assets/corteiz/cargo-corteiz-1.jpg",
      "assets/corteiz/cargo-corteiz-2.jpg",
      "assets/corteiz/cargo-corteiz-3.jpg",
      "assets/corteiz/cargo-corteiz-4.jpg",
      "assets/corteiz/cargo-corteiz-5.jpg",
      "assets/corteiz/cargo-corteiz-6.jpg",
      "assets/corteiz/cargo-corteiz-7.jpg",
    ],
  },
  {
    nombre: "Jordan 4 Infrared",
    marca: "Jordan", categoria: "zapatos", seccion: "encargues",
    precio: 0,
    talles: ["36","36.5","37.5","38","38.5","39","40","40.5","41","42","42.5","43","44","44.5","45","46","47.5"],
    imagenes: [
      "assets/jordan/jordan-4-infrared-1.jpeg",
      "assets/jordan/jordan-4-infrared-2.jpeg",
      "assets/jordan/jordan-4-infrared-3.jpeg",
      "assets/jordan/jordan-4-infrared-4.jpeg",
    ],
  },
  {
    nombre: "Jordan 4 Toro Bravo",
    marca: "Jordan", categoria: "zapatos", seccion: "encargues",
    precio: 0,
    talles: ["36","36.5","37.5","38","38.5","39","40","40.5","41","42","42.5","43","44","44.5","45","46","47.5"],
    imagenes: [
      "assets/jordan/jordan-4-toro-bravo-1.jpeg",
      "assets/jordan/jordan-4-toro-bravo-2.jpeg",
      "assets/jordan/jordan-4-toro-bravo-3.jpeg",
      "assets/jordan/jordan-4-toro-bravo-4.jpeg",
      "assets/jordan/jordan-4-toro-bravo-5.jpeg",
    ],
  },
  {
    nombre: "Jordan 5 Toro Bravo",
    marca: "Jordan", categoria: "zapatos", seccion: "encargues",
    precio: 0,
    talles: ["40","40.5","41","42","42.5","43","44","44.5","45","46","47.5"],
    imagenes: [
      "assets/jordan/jordan-5-toro-bravo-1.jpeg",
      "assets/jordan/jordan-5-toro-bravo-2.jpeg",
      "assets/jordan/jordan-5-toro-bravo-3.jpeg",
      "assets/jordan/jordan-5-toro-bravo-4.jpeg",
      "assets/jordan/jordan-5-toro-bravo-5.jpeg",
    ],
  },
  {
    nombre: "Jordan 4 White Thunder",
    marca: "Jordan", categoria: "zapatos", seccion: "encargues",
    precio: 0,
    talles: ["40","40.5","41","42","42.5","43","44","44.5","45","46","47.5"],
    imagenes: [
      "assets/jordan/jordan-4-white-thunder-5.jpeg",
      "assets/jordan/jordan-4-white-thunder-1.jpeg",
      "assets/jordan/jordan-4-white-thunder-2.jpeg",
      "assets/jordan/jordan-4-white-thunder-3.jpeg",
      "assets/jordan/jordan-4-white-thunder-4.jpeg",
    ],
  },
  {
    nombre: "Jordan 4 Yellow Thunder",
    marca: "Jordan", categoria: "zapatos", seccion: "encargues",
    precio: 0,
    talles: ["40","40.5","41","42","42.5","43","44","44.5","45","46","47.5"],
    imagenes: [
      "assets/jordan/jordan-4-thunder-5.jpeg",
      "assets/jordan/jordan-4-thunder-2.jpeg",
      "assets/jordan/jordan-4-thunder-1.jpeg",
      "assets/jordan/jordan-4-thunder-3.jpeg",
      "assets/jordan/jordan-4-thunder-4.jpeg",
    ],
  },
  {
    nombre: "Jordan 5 Midnight Navy",
    marca: "Jordan", categoria: "zapatos", seccion: "encargues",
    precio: 0,
    talles: ["36","36.5","37.5","38","39","40","40.5","41","42","42.5","43","44","44.5","45","46","47.5"],
    imagenes: [
      "assets/jordan/jordan-5-midnight-navy-1.jpeg",
      "assets/jordan/jordan-5-midnight-navy-2.jpeg",
      "assets/jordan/jordan-5-midnight-navy-3.jpeg",
      "assets/jordan/jordan-5-midnight-navy-4.jpeg",
      "assets/jordan/jordan-5-midnight-navy-5.jpeg",
    ],
  },
  {
    nombre: "Pantalón Nike Tech ( Baggy )",
    marca: "Nike", categoria: "pantalones", seccion: "encargues",
    precio: 3400,
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
    nombre: "Conjuntos Nike Tech ( Modelo Nuevo )",
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
    precio: 5300,
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
