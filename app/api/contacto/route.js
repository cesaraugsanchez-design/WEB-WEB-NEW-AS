/**
 * Recepción del formulario de contacto.
 *
 * Envía por Resend con `fetch` directo, sin instalar el SDK: la petición es una
 * sola llamada HTTP y evita añadir una dependencia al bundle.
 *
 * CONFIGURACIÓN (variables de entorno, nunca en el código):
 *   RESEND_API_KEY     obligatoria. Se crea en resend.com/api-keys
 *   CONTACTO_DESTINO   opcional. Por defecto recepcion@assanch.com
 *   CONTACTO_REMITENTE opcional. Debe ser de un dominio verificado en Resend.
 *                      Mientras assanch.com no esté verificado, Resend solo
 *                      permite `onboarding@resend.dev`.
 *
 * Si falta la clave, el endpoint responde 503 y NO finge que envió. El
 * formulario muestra entonces el teléfono como alternativa. Es preferible
 * decirle al visitante que llame que darle un «recibido» que no es cierto.
 */

/* Recepción responde, dirección se entera. ASSANCH pidió que cada solicitud
   llegue a recepción y, en copia, a Carlos y a César.

   El reparto entre `to` y `cc` no es cosmético: marca quién contesta. Con los
   tres en `to`, tres personas pueden responder al mismo solicitante por
   separado. Con recepción sola en `to`, hay un responsable claro y los otros
   dos ven el caso sin pisarlo.

   Sigue sin unificarse con /api/reclamo, que lleva los tres buzones en `to`.
   Allí es correcto: entran siniestros ya asignados y los socios necesitan
   verlos sin intermediario. Por aquí entran consultas, que recepción tría. */
const DESTINO = process.env.CONTACTO_DESTINO || 'recepcion@assanch.com'

const COPIA = (process.env.CONTACTO_COPIA || 'csanchez@assanch.com,ca.sanchez@assanch.com')
  .split(',')
  .map((d) => d.trim())
  .filter(Boolean)

const REMITENTE = process.env.CONTACTO_REMITENTE || 'onboarding@resend.dev'

/* Límite por IP. En serverless cada instancia tiene su propia memoria y se
   reinicia en frío, así que esto frena ráfagas ingenuas pero NO es protección
   real: para eso hace falta Turnstile o el firewall de Vercel. */
const VENTANA_MS = 60_000
const MAX_POR_VENTANA = 3
const visitas = new Map()

function excedeLimite(ip) {
  const ahora = Date.now()
  const previas = (visitas.get(ip) || []).filter((t) => ahora - t < VENTANA_MS)
  previas.push(ahora)
  visitas.set(ip, previas)

  if (visitas.size > 500) {
    for (const [clave, marcas] of visitas) {
      if (!marcas.some((t) => ahora - t < VENTANA_MS)) visitas.delete(clave)
    }
  }
  return previas.length > MAX_POR_VENTANA
}

function escapar(texto = '') {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function POST(request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'desconocida'

  if (excedeLimite(ip)) {
    return Response.json(
      { error: 'Demasiadas solicitudes. Espere un minuto e inténtelo de nuevo.' },
      { status: 429 }
    )
  }

  let datos
  try {
    datos = await request.json()
  } catch {
    return Response.json({ error: 'Cuerpo de la petición no válido.' }, { status: 400 })
  }

  const { nombre, email, telefono, entidad, mensaje, sitioWeb } = datos ?? {}

  /* Trampa para bots: el campo `sitioWeb` está oculto y ninguna persona lo
     rellena. Se responde 200 a propósito — devolver un error le enseña al bot
     que fue detectado y que debe reintentar de otra forma. */
  if (sitioWeb) {
    console.info('[contacto] descartado por trampa anti-bot')
    return Response.json({ ok: true })
  }

  // La validación del cliente no es garantía: se repite aquí.
  const valido =
    typeof nombre === 'string' &&
    nombre.trim().length > 1 &&
    typeof email === 'string' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    typeof mensaje === 'string' &&
    mensaje.trim().length >= 15

  if (!valido) {
    return Response.json({ error: 'Datos incompletos o no válidos.' }, { status: 422 })
  }

  const clave = process.env.RESEND_API_KEY
  if (!clave) {
    console.error(
      '[contacto] RESEND_API_KEY no configurada: el mensaje NO se envió. ' +
        'Definir la variable de entorno para activar el envío.'
    )
    return Response.json(
      { error: 'No pudimos enviar el mensaje en este momento.' },
      { status: 503 }
    )
  }

  const cuerpo = `
    <h2 style="font:600 18px system-ui;margin:0 0 16px">Nueva solicitud desde la web</h2>
    <table style="font:14px system-ui;border-collapse:collapse">
      <tr><td style="padding:6px 16px 6px 0;color:#55697c">Nombre</td><td><strong>${escapar(nombre)}</strong></td></tr>
      <tr><td style="padding:6px 16px 6px 0;color:#55697c">Correo</td><td>${escapar(email)}</td></tr>
      <tr><td style="padding:6px 16px 6px 0;color:#55697c">Teléfono</td><td>${escapar(telefono) || '—'}</td></tr>
      <tr><td style="padding:6px 16px 6px 0;color:#55697c">Entidad</td><td>${escapar(entidad) || '—'}</td></tr>
    </table>
    <p style="font:14px/1.6 system-ui;margin:20px 0 0;white-space:pre-wrap">${escapar(mensaje)}</p>
  `

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${clave}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `ASSANCH Web <${REMITENTE}>`,
        to: [DESTINO],
        /* `cc` y no `cco`: es correo interno del mismo equipo y ver quién más
           lo recibió evita que dos personas contesten al mismo solicitante.
           Se omite la clave entera si la lista está vacía —Resend rechaza un
           `cc: []`— para que vaciar CONTACTO_COPIA siga funcionando. */
        ...(COPIA.length ? { cc: COPIA } : {}),
        // Responder al correo lleva directo al solicitante, no al remitente técnico.
        reply_to: email,
        subject: `Solicitud web — ${nombre}`,
        html: cuerpo,
      }),
    })

    if (!res.ok) {
      const detalle = await res.text()
      console.error('[contacto] Resend respondió', res.status, detalle)

      /* Si Resend contesta 401 «API key is invalid», el valor guardado en
         RESEND_API_KEY no es una clave viva. Paso que ahorra media hora: una
         clave de Resend mide 36 caracteres y empieza por `re_`; si lo guardado
         mide 14 y empieza por `RES`, lo que se pegó en el campo «Value» fue el
         NOMBRE de la variable. Ya ocurrió una vez. Describir asi la forma del
         valor —largo y prefijo, nunca su contenido— lo despeja en un intento. */
      return Response.json({ error: 'No se pudo enviar el mensaje.' }, { status: 502 })
    }

    return Response.json({ ok: true })
  } catch (e) {
    console.error('[contacto] fallo de red al enviar:', e)
    return Response.json({ error: 'No se pudo enviar el mensaje.' }, { status: 502 })
  }
}
