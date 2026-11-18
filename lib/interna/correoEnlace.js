import { ENLACE_MINUTOS } from './cuentas'

/**
 * Correo con el enlace para crear o restablecer la contraseña de Interna.
 * Mismo envío por Resend que los formularios del sitio (fetch directo, sin SDK).
 *
 * En desarrollo, sin RESEND_API_KEY, el enlace se escribe en la consola del
 * servidor para poder probar el flujo en local. En producción eso no ocurre
 * nunca: un enlace en los registros de Vercel lo podría usar cualquiera que
 * los lea.
 */

const REMITENTE = process.env.CONTACTO_REMITENTE || 'onboarding@resend.dev'

const escapar = (texto) =>
  String(texto).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export async function enviarEnlace({ correo, url }) {
  const clave = process.env.RESEND_API_KEY
  if (!clave) {
    if (process.env.NODE_ENV !== 'production') {
      console.info(`[interna] enlace para ${correo}: ${url}`)
      return
    }
    throw new Error('RESEND_API_KEY no configurada')
  }

  const html = `
    <div style="font:15px/1.6 system-ui;color:#0f1f33;max-width:520px">
      <p>Hola:</p>
      <p>Se pidió crear o restablecer la contraseña de <strong>Interna</strong>, la plataforma interna de ASSANCH, para <strong>${escapar(correo)}</strong>.</p>
      <p style="margin:28px 0">
        <a href="${escapar(url)}"style="background:#0f1f33;color:#fff;padding:12px 20px;border-radius:10px;text-decoration:none;font-weight:600">Fijar mi contraseña</a>
      </p>
      <p>El enlace vale ${ENLACE_MINUTOS} minutos y sirve una sola vez.</p>
      <p style="color:#55697c">Si no fuiste tú, ignora este correo: tu acceso no cambia hasta que alguien use el enlace.</p>
    </div>
  `

  const respuesta = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${clave}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: `ASSANCH Interna <${REMITENTE}>`,
      to: [correo],
      subject: 'Tu acceso a Interna — ASSANCH',
      html,
    }),
  })
  if (!respuesta.ok) {
    console.error('[interna] Resend respondió', respuesta.status, await respuesta.text())
    throw new Error('No se pudo enviar el enlace')
  }
}
