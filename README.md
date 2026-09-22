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
| `/interna` | Tablero de métricas. Cerrado con sesión — ver abajo |

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

## Interna — quién entra y qué queda registrado

`/interna` muestra rendimiento por ajustador con nombre y apellido. El acceso se
cierra en dos capas independientes, y conviene no confundirlas:

1. **Entra ID** decide quién puede autenticarse. La aplicación registrada es
   **ASSANCH Interna** y tiene *asignación requerida*: no basta con tener un
   correo `@assanch.com`, hay que estar en la lista nominal.
2. **`proxy.js`** cierra la ruta con una cookie firmada (HMAC, 3 horas). Falla
   cerrado: si falta `SESION_SECRETO`, no deja pasar a nadie en lugar de dejar
   pasar a todos.

**Siempre pide la contraseña.** La petición a Microsoft lleva `prompt=login`, así
que tener abierta la sesión del correo o de Teams no abre el tablero: hay que
autenticarse cada vez. Sin ese parámetro, el enlace de la barra entra de un clic
—que es exactamente como se comportaba antes—.

### Dar o quitar acceso a una persona

Portal: **Entra** → Identidad → Aplicaciones → Aplicaciones empresariales →
*ASSANCH Interna* → **Usuarios y grupos** → Agregar usuario.

Por línea de comandos:

```bash
az rest --method POST \
  --url "https://graph.microsoft.com/v1.0/servicePrincipals/26cf144a-b3ff-4c6d-9f16-529529d6040d/appRoleAssignedTo" \
  --headers "Content-Type=application/json" \
  --body "{\"principalId\":\"$(az ad user show --id NOMBRE@assanch.com --query id -o tsv)\",\"resourceId\":\"26cf144a-b3ff-4c6d-9f16-529529d6040d\",\"appRoleId\":\"00000000-0000-0000-0000-000000000000\"}"
```

Quitar a alguien tiene efecto en el siguiente inicio de sesión, **no al
instante**: su cookie sigue siendo válida hasta 3 horas. Si la baja es urgente,
hay que rotar `SESION_SECRETO` en Vercel, lo que invalida todas las sesiones
abiertas de golpe.

### Registro de accesos

No se construyó bitácora propia: **Entra ya la lleva**. La licencia Microsoft 365
Business Premium incluye Entra ID P1, así que los inicios de sesión se guardan
**30 días** con usuario, hora, IP, dispositivo y código de error.

Portal: la misma ruta de arriba → **Inicios de sesión**.

```bash
az rest --url "https://graph.microsoft.com/v1.0/auditLogs/signIns?\$filter=appId%20eq%20'5d3cff86-e7f2-4897-8653-a6360356ef4c'&\$top=20" \
  --query "value[].{fecha:createdDateTime, usuario:userPrincipalName, ip:ipAddress, error:status.errorCode}" -o table
```

**Lo que este registro no dice:** cuántas veces alguien abrió el tablero. La
sesión dura 3 horas, así que quien consulte el tablero toda la jornada aparece
dos o tres veces, no una por consulta. Mide autenticaciones, no uso. Si algún día hace
falta lo segundo, hay que escribirlo desde la aplicación a una base de datos;
`console.log` no sirve, porque Vercel retiene los registros de ejecución días, no
meses.

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
