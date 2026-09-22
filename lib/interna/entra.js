/**
 * Inicio de sesión con la cuenta de Microsoft de la firma (flujo de código de
 * autorización). La misma aplicación registrada en Entra ID sirve para esto y
 * para que el servidor lea la matriz de SharePoint, así que configurar Interna
 * se reduce a un registro de aplicación.
 */

export const COOKIE_ESTADO = 'assanch_oauth_estado'

/** Solo entran cuentas de estos dominios, aunque el inquilino tenga invitados. */
const DOMINIOS = (process.env.INTERNA_DOMINIOS || 'assanch.com')
  .split(',')
  .map((d) => d.trim().toLowerCase())
  .filter(Boolean)

export function configurado() {
  return Boolean(
    process.env.MS_TENANT_ID &&
      process.env.MS_CLIENT_ID &&
      process.env.MS_CLIENT_SECRET &&
      process.env.SESION_SECRETO,
  )
}

export function urlRedireccion(origen) {
  return `${origen}/api/auth/entra/callback`
}

export function urlAutorizacion({ origen, estado }) {
  const params = new URLSearchParams({
    client_id: process.env.MS_CLIENT_ID,
    response_type: 'code',
    redirect_uri: urlRedireccion(origen),
    response_mode: 'query',
    scope: 'openid profile email',
    state: estado,
    // Sin esto, quien ya tenga sesión de Microsoft abierta en el navegador
    // —correo, Teams, SharePoint: casi todo el equipo— entra en /interna de un
    // clic, sin escribir nada. `login` obliga a Microsoft a descartar esa sesión
    // y volver a pedir credenciales en cada entrada. Es lo que convierte el
    // enlace dorado de la barra en una puerta y no en un atajo.
    prompt: 'login',
  })
  return `https://login.microsoftonline.com/${process.env.MS_TENANT_ID}/oauth2/v2.0/authorize?${params}`
}

export async function canjearCodigo({ codigo, origen }) {
  const url = `https://login.microsoftonline.com/${process.env.MS_TENANT_ID}/oauth2/v2.0/token`
  const respuesta = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.MS_CLIENT_ID,
      client_secret: process.env.MS_CLIENT_SECRET,
      code: codigo,
      redirect_uri: urlRedireccion(origen),
      grant_type: 'authorization_code',
      scope: 'openid profile email',
    }),
    cache: 'no-store',
  })
  if (!respuesta.ok) throw new Error('Microsoft rechazó el código de autorización')
  return respuesta.json()
}

/**
 * El id_token llega por canal directo con TLS desde el endpoint de Microsoft,
 * no por el navegador, así que basta con leerlo: no hay forma de que lo haya
 * manipulado un tercero.
 */
export function leerIdToken(idToken) {
  const [, cuerpo] = idToken.split('.')
  const relleno = cuerpo.replace(/-/g, '+').replace(/_/g, '/')
  const json = atob(relleno + '='.repeat((4 - (relleno.length % 4)) % 4))
  const carga = JSON.parse(decodeURIComponent(escape(json)))
  return {
    sub: carga.sub,
    nombre: carga.name ?? null,
    correo: (carga.preferred_username ?? carga.email ?? '').toLowerCase(),
    tid: carga.tid,
  }
}

export function autorizado(perfil) {
  if (perfil.tid !== process.env.MS_TENANT_ID) return false
  const dominio = perfil.correo.split('@')[1]
  return Boolean(dominio) && DOMINIOS.includes(dominio)
}
