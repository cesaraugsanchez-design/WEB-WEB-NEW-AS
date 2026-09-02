# Guía de implementación — Estructura tipo Crawford para ASSANCH

**Destinatario:** Claude Code trabajando dentro de `NEW WEB CODE/assanch-web`.
**Objetivo:** añadir a `assanch.vercel.app` los apartados de navegación que tiene
`crawco.com` y que hoy no existen, **sin alterar el diseño visual actual**, y
sustituir el flujo de "Reportar siniestro" por un formulario completo de aviso
de siniestro (equivalente resumido al *Submit a Claim* de Crawford) con adjuntos.

---

## 0. Reglas invariables

Estas reglas mandan sobre cualquier otra consideración estética.

1. **No se toca el sistema de diseño.** `app/globals.css` sólo se amplía si hace
   falta una clase nueva; nunca se modifican los tokens de `@theme` ni las
   clases existentes (`.section`, `.pildora`, `.tarjeta`, `.btn`, `.btn-claro`,
   `.banda-oscura`, `.cristal`, `.orbe`, `.velo-blanco`, `.texto-degradado`,
   `.reveal`, `.desfile`).
2. **Tipografía:** `font-display` (Instrument Sans) para titulares,
   `font-body` (Inter) para texto y etiquetas, `font-marca` (Montserrat)
   **sólo** para el logotipo.
3. **Color:** azules de marca + `tinta`/`slate` para texto. El `gold` es acento
   puntual (iconos, halos, foco sobre banda oscura), nunca superficie grande.
   `signal` (#e52421) sólo para errores.
4. **Patrón de sección** (copiar tal cual de `components/Servicios.jsx`):

   ```jsx
   <section id="…" className="relative scroll-mt-28 py-24 md:py-32" data-reveal-group>
     <div className="section relative">
       <div className="reveal mx-auto max-w-2xl text-center">
         <p className="pildora">Etiqueta</p>
         <h2 className="mt-6 font-display text-4xl leading-[1.08] font-medium tracking-[-0.03em] text-navy md:text-5xl">…</h2>
         <p className="mt-6 font-body text-lg leading-relaxed text-slate">…</p>
       </div>
       …
     </div>
   </section>
   ```

5. **Accesibilidad ya establecida:** todo control táctil `min-h-12` (o `min-h-9`
   en enlaces de lista), etiquetas de formulario en
   `font-body text-[11px] font-semibold tracking-[0.12em] text-slate uppercase`,
   `:focus-visible` heredado, `aria-*` como en `components/Contact.jsx`.
6. **Idioma:** todo en español (`es-DO`). Los comentarios de código, también —
   el repo entero está comentado en español y sin tildes en los bloques largos.
7. **Sin dependencias nuevas** salvo `@vercel/blob`, autorizada en la sección
   6.2 y sólo si se elige la variante recomendada de adjuntos.
8. **No copiar texto de Crawford.** Se replica la *arquitectura de información*,
   no la redacción. Todo el contenido se escribe para ASSANCH o se marca como
   pendiente de aportar por el cliente (ver sección 8).

---

## 1. Estado actual del sitio ASSANCH

Una sola página con anclas (`app/page.jsx`) más una ruta suelta.

| Sección actual | Archivo | Ancla |
|---|---|---|
| Hero | `components/Hero.jsx` | `#top` |
| Ramos asegurados (10 ramos) | `components/Ramos.jsx` | `#ramos` |
| Qué ofrecemos (3 servicios + 3 razones) | `components/Servicios.jsx` | `#servicios` |
| Quiénes somos | `components/Nosotros.jsx` | `#nosotros` |
| Alcance operativo | `components/Alcance.jsx` | `#alcance` |
| Equipo | `components/Equipo.jsx` | `#equipo` |
| Campo de evidencia | `components/EvidenceField.jsx` | — |
| Aliados | `components/Aliados.jsx` | `#aliados` |
| Contacto (form corto → `/api/contacto`) | `components/Contact.jsx` | `#contacto` |
| Pie | `components/Footer.jsx` | — |
| Cobertura nacional | `app/cobertura/page.jsx` | `/cobertura` |

Stack: **Next.js 16 (App Router, JSX sin TypeScript)**, **React 19**,
**Tailwind v4** (config en CSS, `@theme`), `lucide-react`, `gsap`, envío de
correo con **Resend por `fetch`** (sin SDK).

---

## 2. Estructura de crawco.com (lo que hay que replicar)

**Navegación principal:** `Services` · `Industries` · `Innovation` ·
`Expertise` · `About` · `Resources` · botón rojo `Free Consultation`.

- **Services** — 7 líneas principales (Loss Adjusting, Large and Complex, Third
  Party Administration, Managed Repair, Medical Management, Alternative
  Inspections, Catastrophe Response) + ~24 servicios específicos (Property,
  Auto, Casualty, Forensic Accounting, Counter Fraud, Subrogation…).
- **Industries** — bloque "Insurance & Risk" (Carriers, Brokers, Corporates,
  Lloyd's) + ~15 sectores (Construction, Marine, Hospitality, Real Estate…).
- **Innovation** — catálogo de productos/tecnologías propias (Digital Review,
  YouGoLook, CoverAI, 3D Property Scan…).
- **Expertise** — hub con **buscador**: escribes una especialidad y devuelve
  servicios relacionados y contacto. No hay fichas de personas.
- **About** — Our Story, Our Locations, Careers, Leadership, Global Citizenship,
  Network Providers, Press, Contact us.
- **Resources** — hub con **miga de pan** (`Home / Resources`) y barra
  `Explore by:` con tres desplegables — **Resource Type** (White Paper,
  Article, Case Study, Webinar, Video, Report, Data Sheet, Press Release,
  Infographic, Brochure, Success Story, Newsletter, Podcast, Other),
  **Business Line** y **Industry** — rejilla de tarjetas (tipo + título +
  entradilla) y paginación numerada. **Éste es el apartado del pantallazo
  adjunto y es el que más falta hace.**

**Plantilla de página interior** (ej. `/services/loss-adjusting`): hero con
titular y dos botones (someter reclamo / buscar experiencia) → párrafo de
entrada → 2-4 sub-bloques temáticos con enlaces → bloque de alcance global →
rejilla de "servicios relacionados" → CTA final con formulario de consulta.

**Pie:** columnas Services · Industries · About · Legal.

---

## 3. Mapa de equivalencias Crawford → ASSANCH

| Crawford | Equivalente ASSANCH | Ruta | ¿Existe hoy? | Prioridad |
|---|---|---|---|---|
| Services | **Servicios** | `/servicios` + `/servicios/[slug]` | Sólo sección en la home | Alta |
| — (dentro de Services) | **Ramos** | `/ramos` + `/ramos/[slug]` | Sólo sección en la home | Alta |
| Industries | **Sectores** | `/sectores` + `/sectores/[slug]` | No | Media |
| Innovation | **Metodología y tecnología** | `/tecnologia` | No | Media |
| Expertise | **Experiencia** (buscador) | `/experiencia` | No | Media |
| About → Our Story / Leadership | **Nosotros** / **Equipo** | `/nosotros`, `/nosotros/equipo` | Secciones en la home | Alta |
| About → Our Locations | **Cobertura** | `/cobertura` | **Sí** | — |
| About → Network Providers | **Aliados** | `/nosotros/aliados` | Sección en la home | Baja |
| About → Careers | **Trabaje con nosotros** | `/nosotros/carreras` | No | Baja |
| About → Contact us | **Contacto** | `/contacto` | Sección en la home | Alta |
| Resources | **Recursos** | `/recursos` + `/recursos/[slug]` | No | Alta |
| Submit a Claim (botón) | **Someter un reclamo** (para aseguradoras) | `/someter-reclamo` | No (hoy va a `#contacto`) | **Máxima** |

**Decisión de arquitectura:** la home **no se desmonta**. Sigue siendo la
página larga con anclas que ya funciona; cada sección de la home pasa a tener
además una página propia que amplía el contenido, y el menú del `Navbar` gana
paneles desplegables que apuntan a esas páginas. Así se gana la profundidad de
Crawford sin perder la página actual ni su diseño.

---

## 4. Árbol de archivos objetivo

```
app/
  page.jsx                     ← intacto (home con anclas)
  cobertura/page.jsx           ← intacto
  servicios/page.jsx                  NUEVO
  servicios/[slug]/page.jsx           NUEVO
  ramos/page.jsx                      NUEVO
  ramos/[slug]/page.jsx               NUEVO
  sectores/page.jsx                   NUEVO
  sectores/[slug]/page.jsx            NUEVO
  tecnologia/page.jsx                 NUEVO
  experiencia/page.jsx                NUEVO
  recursos/page.jsx                   NUEVO  ← hub con filtros (pantallazo)
  recursos/[slug]/page.jsx            NUEVO
  nosotros/page.jsx                   NUEVO
  nosotros/equipo/page.jsx            NUEVO
  nosotros/aliados/page.jsx           NUEVO
  nosotros/carreras/page.jsx          NUEVO
  contacto/page.jsx                   NUEVO
  someter-reclamo/page.jsx            NUEVO  ← formulario de aviso de siniestro
  api/contacto/route.js        ← intacto
  api/reclamo/route.js                NUEVO

components/
  Navbar.jsx                   ← MODIFICADO (mega-menú)
  Footer.jsx                   ← MODIFICADO (columnas de enlaces)
  plantillas/HeroInterno.jsx          NUEVO
  plantillas/MigaDePan.jsx            NUEVO
  plantillas/RejillaTarjetas.jsx      NUEVO
  plantillas/CtaFinal.jsx             NUEVO
  recursos/BarraFiltros.jsx           NUEVO
  recursos/RejillaRecursos.jsx        NUEVO
  reclamo/FormularioReclamo.jsx       NUEVO
  reclamo/ZonaAdjuntos.jsx            NUEVO

lib/
  useReveal.js                 ← intacto
  contenido/navegacion.js             NUEVO  ← única fuente del menú y del pie
  contenido/servicios.js              NUEVO
  contenido/ramos.js                  NUEVO  ← extraer el array de Ramos.jsx
  contenido/sectores.js               NUEVO
  contenido/recursos.js               NUEVO
  contenido/aseguradoras.js           NUEVO  ← para el select del formulario
  validacion/adjuntos.js              NUEVO  ← compartido cliente/servidor
```

**Regla de oro de los datos:** `components/Ramos.jsx` ya contiene los 10 ramos.
Se **mueve** ese array a `lib/contenido/ramos.js` y el componente lo importa;
no se duplica. Lo mismo con los servicios de `components/Servicios.jsx`. Las
páginas nuevas y el `select` del formulario consumen esos mismos archivos.

---

## 5. Fases

### F1 — Menú de navegación con paneles (`components/Navbar.jsx`)

Fuente única: `lib/contenido/navegacion.js`

```js
export const navegacion = [
  {
    label: 'Servicios',
    href: '/servicios',
    columnas: [
      { titulo: 'Qué hacemos', enlaces: [
        { label: 'Ajuste de pérdidas', href: '/servicios/ajuste-de-perdidas' },
        { label: 'Evaluación de siniestros', href: '/servicios/evaluacion-de-siniestros' },
        { label: 'Consultoría de seguros y riesgos', href: '/servicios/consultoria' },
        { label: 'Formación en riesgos y seguros', href: '/servicios/formacion' },
      ]},
      { titulo: 'Ramos', enlaces: [ /* de lib/contenido/ramos.js */ ] },
    ],
  },
  { label: 'Sectores',   href: '/sectores',   columnas: [/* … */] },
  { label: 'Tecnología', href: '/tecnologia', columnas: [/* … */] },
  { label: 'Experiencia', href: '/experiencia' },
  { label: 'Nosotros',   href: '/nosotros',   columnas: [/* … */] },
  { label: 'Recursos',   href: '/recursos',   columnas: [/* … */] },
]
```

Requisitos:

- La **cápsula** central actual (`rounded-full border border-line bg-white/70 …`)
  se conserva exactamente. Cada `li` con hijos abre un panel al `hover` y al
  `focus`, con retardo de cierre de ~140 ms para que el ratón pueda bajar.
- Panel: `rounded-[2rem] border border-line bg-white/95 p-8 shadow-media backdrop-blur-xl`,
  ancho máximo `max-w-3xl`, centrado bajo la cápsula, columnas con título en
  `text-[11px] font-semibold tracking-[0.12em] text-slate-soft uppercase` y
  enlaces `min-h-9 … hover:text-blue-700`. Transición `duration-300 ease-suave`.
- Accesibilidad: el disparador es un `<button aria-expanded aria-controls>`,
  `Escape` cierra y devuelve el foco, `Tab` recorre el panel, click fuera cierra.
  Con `prefers-reduced-motion` se abre sin transición.
- Móvil: el menú actual pasa a acordeón (`<details>` estilado o estado propio),
  respetando `min-h-12` por fila.
- El botón de la derecha **cambia de destino y de texto**:
  `<a href="/someter-reclamo" className="btn …">Someter un reclamo</a>`.
  Mismo estilo, mismo `data-iman`. En móvil, igual.

**Criterio de aceptación:** con JS desactivado el menú sigue siendo una lista de
enlaces navegables; no aparece scroll horizontal en 375 px; ningún estilo de la
barra cambia respecto a producción salvo el panel nuevo.

### F2 — Plantillas reutilizables

- `MigaDePan.jsx` — replica el pantallazo: `Inicio / Recursos`, `<nav aria-label="Miga de pan">`,
  barra `border-b border-line bg-white`, enlace activo en `text-blue-700`.
- `HeroInterno.jsx` — props `{ pildora, titulo, entradilla, acciones }`.
  Reutiliza el orbe (`.orbe`) y `texto-degradado` en una palabra del titular,
  igual que `Contact.jsx`. Altura moderada: `pt-36 pb-16 md:pt-44 md:pb-24`
  (la barra fija ocupa 80 px).
- `RejillaTarjetas.jsx` — `grid gap-6 md:grid-cols-2 lg:grid-cols-3` con
  `.tarjeta` y `.reveal`; props `{ items, columnas }`.
- `CtaFinal.jsx` — banda oscura idéntica a la tarjeta de contacto
  (`bg-gradient-to-br from-[#22323F] via-[#1A2833] to-[#16212A]`), con dos
  botones: `Someter un reclamo` (`.btn`) y `Hablar con un ajustador`
  (`.btn-claro`).

### F3 — `/servicios`, `/ramos` y sus fichas

Cada ficha (`lib/contenido/servicios.js`, `ramos.js`) con:
`{ slug, nombre, resumen, icono, descripcion: [párrafos], incluye: [ítems], sectores: [slugs], relacionados: [slugs] }`.

Plantilla de página interior (orden fijo, imitando a Crawford):
miga de pan → hero interno → párrafo de entrada → 2-4 bloques temáticos →
"Qué incluye" en lista con iconos → "Ramos/servicios relacionados"
(`RejillaTarjetas`) → `CtaFinal`.

`generateStaticParams` + `generateMetadata` (title, description, `openGraph`)
en cada `[slug]`, siguiendo el formato de `app/layout.jsx`.

### F4 — `/sectores` y `/tecnologia`

Sectores propuestos para RD (confirmar con el cliente): Aseguradoras,
Corredores de seguros, Empresas y corporativos, Construcción, Hotelería y
turismo, Retail y comercio, Industria y manufactura, Transporte y logística,
Marítimo y portuario, Energía, Sector público, Zonas francas, Agropecuario.

`/tecnologia` es el equivalente de *Innovation*: **no se inventan productos**.
Se documenta lo que ASSANCH sí hace (inspección con evidencia fotográfica
georreferenciada, expediente digital, informes normalizados, seguimiento del
caso) y se deja `TODO:` para lo que el cliente deba confirmar.

### F5 — `/recursos` (el apartado del pantallazo)

Estructura de la página, de arriba abajo:

1. `MigaDePan` — `Inicio / Recursos`.
2. Barra de filtros alineada a la derecha, con el rótulo **`Explorar por:`** y
   tres desplegables: **Tipo de recurso**, **Línea de negocio**, **Sector**.
   Botones `min-h-11 rounded-full border border-line bg-white px-4` con
   `ChevronDown` de `lucide-react`; panel `rounded-2xl border border-line
   bg-white p-2 shadow-media` con casillas de selección múltiple.
3. Rejilla de tarjetas de 3 columnas: etiqueta de tipo (`.pildora`), título en
   `font-display`, entradilla de 2 líneas (`line-clamp-2`), fecha, y toda la
   tarjeta enlazada a `/recursos/[slug]`.
4. Paginación numerada, 12 por página, con `‹ ›` y estado en la URL.

Detalles técnicos:

- Componente cliente (`'use client'`) con estado sincronizado a la query string
  vía `useSearchParams` + `router.replace(..., { scroll: false })`, para que un
  filtro sea enlazable y compartible.
- Filtrado en memoria sobre `lib/contenido/recursos.js` (array de objetos
  `{ slug, titulo, tipo, lineas: [], sectores: [], fecha, entradilla, cuerpo }`).
  Con menos de ~200 recursos no hace falta backend.
- Estado vacío redactado ("No hay recursos con esos filtros") y botón
  `Limpiar filtros`.
- Tipos de recurso adaptados: `Artículo`, `Caso de éxito`, `Guía`, `Informe`,
  `Nota de prensa`, `Infografía`, `Video`, `Boletín`.

### F6 — `/experiencia`

Buscador simple sobre el índice combinado de servicios + ramos + sectores +
recursos: `input` grande centrado, coincidencia por `nombre`/`resumen`
(normalizando tildes con `String.prototype.normalize('NFD')`), resultados
agrupados por categoría, y contacto directo si no hay coincidencias.

### F7 — `/nosotros/*`, `/contacto` y pie

Las páginas reutilizan los componentes existentes (`Nosotros`, `Equipo`,
`Aliados`, `Contact`) envueltos en `HeroInterno` + `MigaDePan`. **No se
duplica código**: se importan los mismos componentes que usa la home.

El `Footer` gana tres columnas de enlaces (Servicios · Sectores · Nosotros)
antes del bloque de contacto actual, con el mismo estilo de lista
(`text-[11px] … uppercase` en el título, `text-sm text-slate` en los enlaces)
y sin tocar la marca de agua ni la barra de copyright.

---

## 6. Formulario "Someter un reclamo"

Ruta: **`/someter-reclamo`**. Es la vía por la que **una aseguradora asigna un
caso a ASSANCH desde la web**, sin llamar ni escribir correos.

**Quién lo llena:** el ejecutivo de reclamos de la aseguradora (o el corredor
que gestiona por ella). **No** es un formulario para el asegurado: ese sigue
teniendo el contacto corto de la home y el WhatsApp.

**Referencia:** `https://www.e-xclaim.com/exclaim/submit-a-claim?lang=en&`
(plataforma e-Xclaim de edjuster). Tiene ~40 campos en 6 bloques: datos del
ajustador y del reclamo, servicios solicitados, datos del asegurado con
dirección desglosada, datos del contratista, notas, y adjuntos con límite de
**10 archivos de 15 MB** aceptando cualquier formato, con un botón `ADD FILE` y
tabla de `File Name · File Size · Actions`. Aquí se conservan **los adjuntos y
los bloques**, y se recorta todo lo demás.

### 6.1 Campos — 14 en total, 9 obligatorios

**Bloque 1 · La aseguradora que reporta**

| Campo | `name` | Tipo | Oblig. |
|---|---|---|---|
| Aseguradora | `aseguradora` | select desde `lib/contenido/aseguradoras.js` + "Otra" | Sí |
| Ejecutivo que reporta | `ejecutivo` | text | Sí |
| Correo | `email` | email | Sí |
| Teléfono / WhatsApp | `telefono` | tel (809 · 829 · 849) | Sí |
| Nº de reclamo de la aseguradora | `reclamo` | text | Sí |
| Nº de póliza | `poliza` | text | No |

**Bloque 2 · El siniestro**

| Campo | `name` | Tipo | Oblig. |
|---|---|---|---|
| Ramo | `ramo` | select desde `lib/contenido/ramos.js` + "Otro" | Sí |
| Fecha del siniestro | `fecha` | date, `max` = hoy | Sí |
| Provincia | `provincia` | select: 31 provincias + Distrito Nacional | Sí |
| Dirección del riesgo | `ubicacion` | text (sector, calle, referencia) | Sí |
| Descripción de lo ocurrido | `descripcion` | textarea, mínimo 15 caracteres | Sí |
| Estimado de pérdida | `estimado` + `moneda` | number + select **RD$ / US$** | No |

**Bloque 3 · El asegurado y los documentos**

| Campo | `name` | Tipo | Oblig. |
|---|---|---|---|
| Nombre del asegurado | `asegurado` | text | Sí |
| Teléfono del asegurado | `aseguradoTelefono` | tel | No |
| ¿Podemos contactarlo directamente? | `contactoPermitido` | select: Sí · No | No |
| Adjuntos | `archivos` | file múltiple | No |
| Trampa anti-bot | `sitioWeb` | text oculto | — |

Bajo el botón de envío, una línea de aviso legal (no una casilla más):
*"Al enviar, ASSANCH tratará estos datos únicamente para la gestión del
reclamo, conforme a la Ley 172-13."*

**Lo que se eliminó del original y por qué:** los tres campos de *Examiner* y
los cuatro del *Contractor* (caben en la descripción); *Policy Limit*,
*Deductible* y *Special Limits* (van en la póliza adjunta); el desglose de
dirección en cinco campos (en RD se reporta por provincia, sector y
referencia, y el código postal, obligatorio en el original, no se usa);
*Insured Type* y *Claim Type* (el ramo de ASSANCH ya los cubre); el reCAPTCHA
de Google, sustituido por la trampa anti-bot y el límite por IP que el repo ya
tiene.

**Enlaces precargados:** la página lee `useSearchParams` y precarga
`aseguradora`, `ramo` y `reclamo` — idea tomada del "Pre-filled Link" del
original. Permite dar a cada aseguradora su propio enlace, ya identificado:
`/someter-reclamo?aseguradora=universal`.

**Aseguradoras del desplegable** (`lib/contenido/aseguradoras.js`) — partir de
las que operan en RD y **`TODO(cliente):` confirmar la lista definitiva con
ASSANCH**, que sabe con cuáles trabaja: Seguros Universal, Seguros
Banreservas, Humano Seguros, MAPFRE BHD Seguros, La Colonial, Seguros Sura,
Seguros Pepín, Seguros Worldwide, Atlántica Seguros, General de Seguros,
Angloamericana, Banesco Seguros, Seguros Crecer, COOP-Seguros, y "Otra"
(que despliega un campo de texto libre).

### 6.2 Adjuntos — 10 archivos, 15 MB cada uno

Se iguala el límite del original. Eso obliga a una decisión de plataforma:
**una función serverless de Vercel no admite un cuerpo de petición de ese
tamaño** (tope ~4,5 MB).

- **Recomendado:** subida directa a **Vercel Blob**. Única dependencia nueva
  autorizada: `@vercel/blob`. El navegador sube con `upload()`
  (`handleUploadUrl: '/api/reclamo/subida'`), el archivo no pasa por la
  función, y el `POST` sólo lleva los campos de texto y las URLs. Requiere un
  Blob store y la variable `BLOB_READ_WRITE_TOKEN`.
- **Respaldo sin dependencias:** `multipart` directo, bajando el tope a **4 MB
  en total** y avisando de enviar el resto a `recepcion@assanch.com`.
  **Elegir una de las dos y dejarlo escrito en el código, no implementar ambas.**

`lib/validacion/adjuntos.js`, fuente única para cliente y servidor:

```js
export const MAX_ARCHIVOS = 10
export const MAX_POR_ARCHIVO = 15 * 1024 * 1024   // 15 MB, igual que el original

/* El original acepta cualquier formato. Aqui igual, salvo lo ejecutable: subir
   un .exe a un buzon de reclamos no tiene uso legitimo y si convierte el
   correo en un vector. */
export const EXTENSIONES_BLOQUEADAS = [
  '.exe', '.bat', '.cmd', '.com', '.scr', '.msi', '.dll', '.jar',
  '.sh', '.ps1', '.vbs', '.js', '.app', '.apk', '.deb', '.dmg',
]

export const FORMATOS_SUGERIDOS =
  'PDF · Word · Excel · JPG · PNG · HEIC · WEBP · MP4 · ZIP'
```

`components/reclamo/ZonaAdjuntos.jsx`:

- Zona `rounded-2xl border border-dashed border-line bg-canvas p-8 text-center`
  con icono `Paperclip`, "Arrastre los archivos o **seleccione** desde su
  dispositivo", y debajo en `text-xs text-slate-soft` los formatos y
  "Hasta 10 archivos · 15 MB por archivo".
- Nota heredada del original: *"Si envía relación de bienes o de pérdidas,
  adjúntela en Excel: agiliza el procesamiento."*
- `<input type="file" multiple>` real, oculto pero enfocable; sin `accept`
  restrictivo — filtra `EXTENSIONES_BLOQUEADAS`. Arrastrar y soltar con estado
  `border-blue-300 bg-blue-50`.
- Tabla de control como en el original (`Archivo · Tamaño · Acción`) en filas
  `rounded-2xl border border-line bg-white p-3`: icono por tipo, nombre
  truncado, tamaño legible, barra de progreso y botón `min-h-9 w-9` con `X`
  (`aria-label="Quitar {nombre}"`).
- Contador con `aria-live="polite"`: "3 de 10 archivos · 22,4 MB". Los
  rechazados muestran el motivo en `text-signal` sin borrar los válidos.
- Respaldo: *"¿No puede subirlos? Escríbanos a recepcion@assanch.com indicando
  el número de reclamo."*

### 6.3 Ruta de API — `app/api/reclamo/route.js`

Calca `app/api/contacto/route.js` (mismo estilo y comentarios en español) con:

```js
export const runtime = 'nodejs'
export const maxDuration = 30
```

1. **Límite por IP:** reutilizar `excedeLimite`, ventana de 60 s, máximo 2 envíos.
2. **Trampa anti-bot:** si `sitioWeb` viene relleno → `200 {ok:true}` sin enviar.
3. **Validación en servidor**, sin fiarse del cliente: los 9 obligatorios
   presentes, `email` con la misma expresión regular, `descripcion` ≥ 15,
   `fecha` no futura, y por archivo: extensión fuera de la lista bloqueada,
   tamaño y número dentro de los límites, nombre saneado con
   `nombre.replace(/[^\w.\-]/g, '_').slice(0, 120)`. Fallo → `422` en español.
4. **Referencia** `ASN-YYYYMMDD-XXXX`, devuelta en `{ ok: true, referencia }`.
5. **Correo con Resend:** `subject: 'Reclamo ' + referencia + ' — ' +
   aseguradora + ' — ' + ramo`, `reply_to: email`, cuerpo en tabla con todos
   los campos pasados por la función `escapar` existente y agrupados en los
   tres bloques. Adjuntos como enlaces (variante Blob) o `attachments` en
   base64 (variante `multipart`).
6. **Destino:** nueva variable `RECLAMOS_DESTINO` (por defecto
   `recepcion@assanch.com`), añadida a `.env.example`; con Blob, también
   `BLOB_READ_WRITE_TOKEN`.
7. **Sin `RESEND_API_KEY`** → `503` y mensaje que empuja al teléfono. Nunca
   fingir un envío correcto: criterio ya asentado en el repo.
8. **Acuse al ejecutivo** (segunda llamada a Resend): referencia y resumen. Si
   falla, no invalida el envío principal.

### 6.4 Estados e integración

Mismo lenguaje que `Contact.jsx`: `idle · enviando · ok · fallo`, resumen de
errores con `role="alert"` si hay más de uno, `aria-live="polite"` para el
resultado. En éxito, el formulario se sustituye por una tarjeta con
`CheckCircle2`, "Reclamo recibido", la **referencia** en `font-display
text-3xl`, el plazo de respuesta y los canales de urgencia (809-792-9384 y
WhatsApp 829-918-7725). En fallo, teléfono y correo visibles.

Enlaces de entrada: botón `Someter un reclamo` del `Navbar` (escritorio y
móvil), `CtaFinal` de las páginas interiores, y un enlace de texto bajo el
botón de `Contact.jsx` — "¿Es una aseguradora? **Someter un reclamo con
documentos**".

## 7. Metadatos y SEO de las rutas nuevas

Cada `page.jsx` exporta `metadata` (o `generateMetadata`) con `title` en el
formato `«Sección — ASSANCH»`, `description` propia y `openGraph.locale:'es_DO'`.
Añadir `app/sitemap.js` y `app/robots.js` generados desde
`lib/contenido/*` para que las rutas nuevas se indexen.

---

## 8. Contenido pendiente del cliente (no inventar)

Marcar con `TODO(cliente):` en el código y listarlo al terminar:

- Textos e imágenes reales de sectores y de `/tecnologia`.
- Recursos reales (artículos, casos de éxito) — hasta entonces, dejar 3-4 de
  ejemplo claramente identificados como borrador.
- Lista definitiva de aseguradoras del `select` (ver 6.1) y, si la hay, la
  nomenclatura de número de reclamo que cada una usa.
- Aviso de privacidad enlazado desde la casilla de consentimiento
  (RD: Ley 172-13 de protección de datos personales).
- Plazo de respuesta comprometido que se muestra en el acuse.

---

## 9. Verificación antes de dar por hecho

```bash
npm run dev
```

- [ ] `npm run build` sin advertencias nuevas.
- [ ] La home se ve **idéntica** a producción (comparar a 1440 px y 375 px).
- [ ] Ninguna página produce scroll horizontal (`html`/`body` usan `overflow-x: clip`).
- [ ] Menú recorrible sólo con teclado; `Escape` cierra los paneles.
- [ ] `prefers-reduced-motion: reduce` desactiva animaciones y revelados.
- [ ] Formulario: envío correcto con 3 adjuntos, archivo ejecutable (debe
      rechazarse), archivo de más de 15 MB, 11 archivos, sin `RESEND_API_KEY`
      (503 y teléfono a la vista), doble envío seguido (límite por IP), trampa
      anti-bot, y enlace precargado `?aseguradora=…&ramo=…`.
- [ ] Contraste AA en todo texto nuevo (los tokens del tema ya lo cumplen).
- [ ] Rama y commits en español, como el historial:
      `git checkout -b estructura-tipo-crawford`.

---

## 10. Prompt de arranque para Claude Code

> Lee `GUIA-ESTRUCTURA-CRAWFORD.md` en la raíz del proyecto y ejecútala por
> fases. Empieza por el **apartado 6 (formulario `/someter-reclamo` para
> aseguradoras, con adjuntos)** y sigue con la **F1 (menú)**; para el
> resto, crea las rutas con las plantillas y contenido marcado
> `TODO(cliente):` donde no haya información real. No modifiques
> `app/globals.css` salvo para añadir clases nuevas, no cambies el aspecto de
> la home, y no instales dependencias. Al terminar cada fase, dime qué
> archivos tocaste y qué falta por confirmar con el cliente.
