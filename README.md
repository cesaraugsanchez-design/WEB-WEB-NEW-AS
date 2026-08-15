# ASSANCH — Sitio corporativo

Sitio de **ASSANCH, Ajustadores y Consultores de Seguros** (República Dominicana).

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # compilación de producción
```

## Rutas

| Ruta | Qué es |
|---|---|
| `/` | Página principal |
| `/cobertura` | Globo interactivo con la cobertura geográfica |
| `/api/contacto` | Recepción del formulario — **sin destino configurado** |

## Stack

Next.js 15 (App Router, JavaScript) · Tailwind CSS v4 · GSAP · lucide-react.

No usa TypeScript ni shadcn. Las animaciones críticas (revelado en scroll, palabra
rotativa, contadores) van con **IntersectionObserver + transiciones CSS**, no con
tweens por JS: si el navegador congela `requestAnimationFrame` —pestaña en segundo
plano— una transición CSS igualmente termina en su estado final, mientras que un
tween se queda a medias y deja contenido invisible.

## Identidad

Los trazados del logo se extrajeron del **vector original** del manual de marca
(`LOGO ASSANCH.pdf`) y viven en `components/Marca.jsx`. **No editar los atributos
`d` a mano.**

| Token | Valor | Uso |
|---|---|---|
| `gold` | `#FFB600` | Oficial. Acento y marcadores |
| `signal` | `#E52421` | Oficial. Errores y alertas |
| `navy` | `#131B21` | Oficial. Logotipo y bandas oscuras |
| `tinta` | `#2B3742` | Texto de lectura (12.3:1 sobre blanco) |
| `blue-700/500/300` | — | Rampa de degradados |

El negro del manual (`#131B21`) se reserva para marca y superficies; los textos
usan `tinta`, más suave en párrafos largos.

**Regla de contraste:** el oro oficial no alcanza contraste legible como texto
sobre blanco. Para texto sobre claro se usa `goldink` (`#7A5800`).

Tipografía: **Instrument Sans** (titulares), **Inter** (cuerpo), **Montserrat**
(solo el logotipo, según el manual).

## Datos geográficos

`public/geo/paises.json` — Natural Earth 50m admin_0, dominio público, simplificado
con Douglas-Peucker de 4,5 MB a 114 kB. Se sirve desde el propio dominio y se pide
una sola vez. Las islas del Caribe llevan tolerancia más fina: con la tolerancia
común Puerto Rico desaparece.

## Pendientes antes de publicar

1. **El formulario no entrega los mensajes a ningún destino.** `app/api/contacto/route.js`
   valida y responde 200, pero ahí termina. Hay que conectar correo (Resend, SendGrid,
   SES), base de datos o webhook. Está marcado en el archivo. **Esto es lo único que
   bloquea la publicación.**
2. **Protección anti-spam** en ese endpoint: límite por IP y/o Turnstile.
3. **Logos de aliados.** `components/Aliados.jsx` tiene el array `aliados` vacío a
   propósito: publicar la marca de una aseguradora afirma una relación comercial y
   requiere su autorización. Pedir el kit de marca a cada compañía y rellenar el array.
4. **Validar las definiciones de ramos.** Las de `components/Ramos.jsx` son
   descripciones técnicas de práctica aseguradora, **no citas de la Ley 146-02**.
   Que el equipo técnico las revise o las sustituya por el texto normativo exacto.
5. **Video de portada** (opcional). Si se deja `public/media/hero.mp4`, el hero lo
   monta y ata su reproducción al scroll. Sin archivo no se rompe nada.

## Accesibilidad

Verificado en navegador: sin scroll horizontal a 375px, un solo `h1`, jerarquía de
encabezados sin saltos, todos los campos con `label`, foco visible, objetivos táctiles
≥44px, y `prefers-reduced-motion` respetado en todas las capas de animación
(revelado, orbes, carrusel, globo, contadores, cursor).

Toda interacción de arrastre —campo de evidencia y globo— tiene equivalente por
teclado, según WCAG 2.2.
