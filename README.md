# LeanWear — Catálogo web

Catálogo estático (sin backend) para tu emprendimiento de importación de ropa.
Layout tipo tienda: header con buscador, barra de categorías, **sidebar de
filtros**, grilla de productos y footer. Tema oscuro/morado, responsivo y listo
para **GitHub Pages**.

3 páginas separadas que comparten el mismo header, footer y estilos:
**Stock**, **Encargues** y **Contacto**. Al tocar una prenda se abre un detalle
con galería de fotos (con visor ampliable), talles, colores y botón directo a
Instagram, más una sección de **fotos reales** del producto. Se filtra por
**marca** y por **categoría** (zapatillas, buzos, etc.), se busca por texto y se
ordena por precio/nombre.

## Estructura

```
LeanWear/
├── index.html         ← página STOCK
├── encargues.html     ← página ENCARGUES
├── contacto.html      ← página CONTACTO
├── producto.html      ← DETALLE de producto (galería + talles + similares)
├── css/styles.css     ← estilos (no hace falta tocar)
├── js/
│   ├── config.js      ← TUS DATOS: Instagram, email + categorías
│   ├── products.js    ← TUS PRODUCTOS (lo que más vas a editar)
│   ├── layout.js      ← header/footer/Instagram + tarjetas (no tocar)
│   ├── catalog.js     ← filtros y grilla (no tocar)
│   ├── producto.js    ← página de detalle (no tocar)
│   └── contacto.js    ← links de la página contacto (no tocar)
└── assets/            ← acá van las fotos de las prendas
```

> Las páginas HTML son mínimas a propósito: el header, el footer y la grilla se
> generan solos desde los `.js`. Vos solo cargás datos en `config.js` y `products.js`.

## 1. Datos de contacto

En `js/config.js` completá tu usuario de Instagram (sin la @) y tu email.
Todo el contacto (botón flotante, CTA del producto, footer) usa ese Instagram:
el "Mensaje directo" abre el DM con `ig.me/m/tu-usuario`.

## 2. Subir un producto

En `js/products.js` copiá un bloque `{ ... }`, pegalo y cambiá los datos:

```js
{
  nombre: "Buzo Oversize Essential",
  marca: "Nike",
  categoria: "buzos",        // slug definido en config.js (CATEGORIAS)
  seccion: "stock",          // "stock" o "encargues"
  precio: 38000,
  descripcion: "Algodón frisado, corte oversize.",
  talles: ["S", "M", "L", "XL"],
  colores: ["Negro", "Gris"],          // opcional
  imagenes: ["assets/buzo-1.jpg",      // poné las que quieras
             "assets/buzo-2.jpg"],
  destacado: true,           // opcional: badge "Destacado"
  agotado: false,            // opcional: badge "Agotado"
},                           // ← no te olvides la coma
```

- Los filtros de **marca** y de **categoría** se generan solos con tus productos.
- Las categorías se agrupan en el sidebar (Ropa / Calzado / Accesorios) según
  `CATEGORIAS` en `config.js`. Para agregar un tipo nuevo, sumá una línea ahí.
- Si no tenés foto, dejá `imagenes: []` y se muestra un placeholder con degradé.
- Las fotos van en `assets/` (leé `assets/LEEME.txt`).

## 3. Probar en tu compu

```bash
cd LeanWear
python3 -m http.server 8000
# abrí http://localhost:8000
```

(Conviene servidor local en vez de doble-click por las rutas de imágenes.)

## 4. Publicar en GitHub Pages

1. Creá un repositorio en GitHub y subí el contenido de esta carpeta.
2. **Settings → Pages**.
3. En *Source* elegí la rama `main`, carpeta `/root`. Guardá.
4. En 1-2 minutos queda online en
   `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`

> El archivo `.nojekyll` ya está incluido para que GitHub sirva todo sin procesar.

## 5. Panel de admin (cargar productos sin tocar código)

Hay una página secreta `admin.html` (ej: `https://TU-USUARIO.github.io/REPO/admin.html`)
con un formulario para cargar productos y fotos. **Publica solo**: commitea al repo
vía la API de GitHub y el sitio se actualiza en ~1 minuto.

**Primero, cambiá la clave**: en `js/admin.js`, línea ~17, editá
`const ADMIN_PASS = "leanwear2026";`.

> ⚠ Importante: como es un sitio estático, la clave es solo una traba liviana
> (se puede ver en el código fuente). La **seguridad real es el token de GitHub**:
> sin él, nadie puede publicar nada aunque entre al panel.

### Crear el token de GitHub (una sola vez)

1. GitHub → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. **Repository access**: "Only select repositories" → elegí el repo de LeanWear.
3. **Permissions → Repository permissions → Contents: Read and write**.
4. Generá y copiá el token (`github_pat_...`).

### Usar el panel

1. Entrá a `admin.html`, poné la clave.
2. **Paso 1 (Conexión)**: usuario, repo y rama vienen autocompletados; pegá el
   token y tocá **Probar conexión** (se guarda solo en tu navegador).
3. **Paso 2–3**: completá el producto y arrastrá las fotos (la primera es la principal).
4. **Paso 4**: **Publicar producto**. Listo: sube las imágenes a `assets/<marca>/`,
   agrega el producto a `products.js` y commitea todo.

El selector de categoría usa las de `config.js`, así que nunca queda mal escrita.
