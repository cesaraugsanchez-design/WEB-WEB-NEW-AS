/**
 * Recepción de reclamos sometidos por aseguradoras.
 *
 * Igual que /api/contacto, envía por Resend con `fetch` directo — sin SDK.
 * La diferencia es el cuerpo: aquí llega `multipart/form-data` porque el
 * formulario admite adjuntos.
 *
 * CONFIGURACIÓN
 *   RESEND_API_KEY      obligatoria
 *   RECLAMOS_DESTINO    opcional. Lista separada por comas. Por defecto, los
 *                       tres buzones de DESTINOS_POR_DEFECTO.
 *   CONTACTO_REMITENTE  opcional. De un dominio verificado en Resend.
 *
 * Sin clave responde 503 y NO finge que registró. Un «recibido» falso en un
 * buzón de siniestros es peor que un error: la aseguradora daría por notificado
 * un caso que nadie vio.
 */

import { MAX_ARCHIVOS, MAX_TOTAL, extensionBloqueada, sanearNombre } from '@/lib/validacion/adjuntos'

/* Los tres buzones que reciben cada reclamo con sus adjuntos. Van en `to` y no
   en `cco`: es correo interno del mismo equipo, y ver quién más lo recibió
   evita que dos personas llamen a la misma aseguradora por el mismo caso.

   Se pueden sustituir sin tocar código con RECLAMOS_DESTINO, separando por
   comas. Ojo: el buzón lleva «recepcion» sin tilde — una tilde en la parte
   local de una dirección exige SMTPUTF8 y muchos servidores la rechazan. */
const DESTINOS_POR_DEFECTO = [
  'recepcion@assanch.com',
  'ca.sanchez@assanch.com',
  'csanchez@assanch.com',
]

const DESTINOS = (process.env.RECLAMOS_DESTINO || '')
  .split(',')
  .map((d) => d.trim())
  .filter(Boolean)

const PARA = DESTINOS.length ? DESTINOS : DESTINOS_POR_DEFECTO
const REMITENTE = process.env.CONTACTO_REMITENTE || 'onboarding@resend.dev'

const VENTANA_MS = 60_000
const MAX_POR_VENTANA = 5
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

/* ASN-AAAAMMDD-XXXX. El sufijo es aleatorio, no correlativo: no hay base de
   datos donde llevar la cuenta, y un correlativo revelaría el volumen de la
   firma a quien mire dos referencias. */
function generarReferencia() {
  const f = new Date()
  const dia = `${f.getFullYear()}${String(f.getMonth() + 1).padStart(2, '0')}${String(f.getDate()).padStart(2, '0')}`
  const suf = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `ASN-${dia}-${suf}`
}

function fila(clave, valor) {
  return `<tr><td style="padding:7px 18px 7px 0;color:#55697c;vertical-align:top;white-space:nowrap">${clave}</td><td style="color:#131b21">${escapar(valor) || '—'}</td></tr>`
}

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'desconocida'

  if (excedeLimite(ip)) {
    return Response.json(
      { error: 'Demasiadas solicitudes. Espere un minuto e inténtelo de nuevo.' },
      { status: 429 }
    )
  }

  let form
  try {
    form = await request.formData()
  } catch {
    return Response.json({ error: 'Cuerpo de la petición no válido.' }, { status: 400 })
  }

  const t = (k) => String(form.get(k) ?? '').trim()

  // Trampa anti-bot: 200 a propósito, para no enseñarle al bot que fue detectado.
  if (t('sitioWeb')) {
    console.info('[reclamo] descartado por trampa anti-bot')
    return Response.json({ ok: true, referencia: generarReferencia() })
  }

  const d = {
    aseguradora: t('aseguradora') === 'Otra' ? t('aseguradoraOtra') : t('aseguradora'),
    ejecutivo: t('ejecutivo'),
    correo: t('correo'),
    telefono: t('telefono'),
    numeroReclamo: t('numeroReclamo'),
    ramo: t('ramo'),
    fechaSiniestro: t('fechaSiniestro'),
    provincia: t('provincia'),
    direccion: t('direccion'),
    descripcion: t('descripcion'),
    asegurado: t('asegurado'),
    telefonoAsegurado: t('telefonoAsegurado'),
  }

  // La validación del navegador no es garantía: se repite entera aquí.
  const obligatorios = [
    'aseguradora', 'ejecutivo', 'correo', 'telefono', 'numeroReclamo',
    'ramo', 'fechaSiniestro', 'provincia', 'direccion', 'descripcion', 'asegurado',
  ]
  const faltan = obligatorios.filter((k) => !d[k])
  const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.correo)

  if (faltan.length || !correoValido || d.descripcion.length < 15) {
    return Response.json({ error: 'Datos incompletos o no válidos.' }, { status: 422 })
  }

  /* Adjuntos. Se revalidan los límites del cliente: nada impide enviar el
     multipart a mano con un archivo de 40 MB. */
  const brutos = form.getAll('archivos').filter((a) => typeof a === 'object' && a.size > 0)

  if (brutos.length > MAX_ARCHIVOS) {
    return Response.json({ error: `Máximo ${MAX_ARCHIVOS} archivos.` }, { status: 422 })
  }
  if (brutos.some((a) => extensionBloqueada(a.name))) {
    return Response.json({ error: 'Uno de los archivos tiene un formato no admitido.' }, { status: 422 })
  }
  if (brutos.reduce((s, a) => s + a.size, 0) > MAX_TOTAL) {
    return Response.json({ error: 'Los adjuntos superan el tamaño permitido.' }, { status: 413 })
  }

  const clave = process.env.RESEND_API_KEY
  if (!clave) {
    console.error(
      '[reclamo] RESEND_API_KEY no configurada: el reclamo NO se registró. ' +
        'Definir la variable de entorno para activar el envío.'
    )
    return Response.json(
      { error: 'No pudimos registrar el reclamo en línea en este momento.' },
      { status: 503 }
    )
  }

  const adjuntos = []
  for (const a of brutos) {
    const buffer = Buffer.from(await a.arrayBuffer())
    adjuntos.push({ filename: sanearNombre(a.name), content: buffer.toString('base64') })
  }

  const referencia = generarReferencia()

  const html = `
    <h2 style="font:600 18px system-ui;margin:0 0 6px">Nuevo reclamo — ${escapar(d.aseguradora)}</h2>
    <p style="font:600 13px system-ui;color:#1e5480;margin:0 0 20px">Referencia ${referencia}</p>

    <table style="font:14px system-ui;border-collapse:collapse;margin-bottom:22px">
      ${fila('Aseguradora', d.aseguradora)}
      ${fila('Ejecutivo', d.ejecutivo)}
      ${fila('Correo', d.correo)}
      ${fila('Teléfono', d.telefono)}
    </table>

    <table style="font:14px system-ui;border-collapse:collapse;margin-bottom:22px">
      ${fila('Nº de reclamo', d.numeroReclamo)}
      ${fila('Ramo', d.ramo)}
      ${fila('Fecha del siniestro', d.fechaSiniestro)}
      ${fila('Provincia', d.provincia)}
      ${fila('Dirección', d.direccion)}
    </table>

    <table style="font:14px system-ui;border-collapse:collapse;margin-bottom:22px">
      ${fila('Asegurado', d.asegurado)}
      ${fila('Tel. asegurado', d.telefonoAsegurado)}
    </table>

    <p style="font:600 13px system-ui;color:#55697c;margin:0 0 6px">Qué ocurrió</p>
    <p style="font:14px/1.65 system-ui;margin:0;white-space:pre-wrap">${escapar(d.descripcion)}</p>

    <p style="font:13px system-ui;color:#55697c;margin:22px 0 0">
      Adjuntos: ${adjuntos.length || 'ninguno'}
    </p>
  `

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${clave}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: `ASSANCH Reclamos <${REMITENTE}>`,
        to: PARA,
        reply_to: d.correo,
        subject: `[${referencia}] ${d.ramo} — ${d.aseguradora} — reclamo ${d.numeroReclamo}`,
        html,
        ...(adjuntos.length ? { attachments: adjuntos } : {}),
      }),
    })

    if (!res.ok) {
      const detalle = await res.text()
      console.error('[reclamo] Resend respondió', res.status, detalle)
      return Response.json(
        { error: 'No pudimos registrar el reclamo en línea en este momento.' },
        { status: 502 }
      )
    }

    /* Acuse al que reporta. La página promete «Acuse de recibo con número de
       referencia al enviar» y el campo de correo dice «Ahí llega el acuse»:
       hasta ahora eso no se cumplía, solo se mostraba en pantalla.

       Va DESPUÉS y en su propio try: si el acuse falla, el reclamo ya está en
       los tres buzones de ASSANCH y sería falso responder con un error. Se
       registra el fallo y se sigue. */
    try {
      const acuse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${clave}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: `ASSANCH <${REMITENTE}>`,
          to: [d.correo],
          reply_to: PARA[0],
          subject: `Reclamo recibido — referencia ${referencia}`,
          html: `
            <p style="font:14px/1.65 system-ui;margin:0 0 18px">Estimado/a ${escapar(d.ejecutivo)}:</p>
            <p style="font:14px/1.65 system-ui;margin:0 0 18px">
              Hemos recibido el reclamo <strong>${escapar(d.numeroReclamo)}</strong>
              (${escapar(d.ramo)}) de ${escapar(d.aseguradora)}, a nombre de
              ${escapar(d.asegurado)}. Un ajustador se comunicará con usted.
            </p>
            <p style="font:600 15px system-ui;color:#1e5480;margin:0 0 18px">
              Referencia: ${referencia}
            </p>
            <p style="font:14px/1.65 system-ui;margin:0 0 18px">
              Cite esa referencia en cualquier consulta. Para asuntos urgentes,
              llame al <strong>809-792-9384</strong>; atendemos avisos 24/7.
            </p>
            <p style="font:13px system-ui;color:#55697c;margin:24px 0 0">
              ASSANCH — Ajustadores y Consultores de Seguros<br>
              Santo Domingo, República Dominicana
            </p>
          `,
        }),
      })
      if (!acuse.ok) {
        console.error('[reclamo] acuse no enviado:', acuse.status, await acuse.text())
      }
    } catch (e) {
      console.error('[reclamo] fallo de red al enviar el acuse:', e)
    }

    return Response.json({ ok: true, referencia })
  } catch (e) {
    console.error('[reclamo] fallo de red al enviar:', e)
    return Response.json(
        { error: 'No pudimos registrar el reclamo en línea en este momento.' },
        { status: 502 }
      )
  }
}
