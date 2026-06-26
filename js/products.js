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
