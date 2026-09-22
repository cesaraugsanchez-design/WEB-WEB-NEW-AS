/**
 * Sesión de Interna: una cookie firmada con HMAC, sin almacén de sesiones.
 * Se usa Web Crypto y no `node:crypto` porque este módulo también corre en el
 * proxy, que se ejecuta en el runtime edge.
 */

export const COOKIE = 'assanch_interna'
export const DURACION_HORAS = 10

const codificador = new TextEncoder()

function b64urlDesde(bytes) {
  let binario = ''
  for (const b of bytes) binario += String.fromCharCode(b)
  return btoa(binario).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function b64urlA(texto) {
  const relleno = texto.replace(/-/g, '+').replace(/_/g, '/')
  const binario = atob(relleno + '='.repeat((4 - (relleno.length % 4)) % 4))
  return Uint8Array.from(binario, (c) => c.charCodeAt(0))
}

function secreto() {
  const valor = process.env.SESION_SECRETO
  if (!valor) throw new Error('Falta la variable SESION_SECRETO')
  return valor
}

async function clave() {
  return crypto.subtle.importKey(
    'raw',
    codificador.encode(secreto()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )
}

export async function firmarSesion(datos) {
  const carga = { ...datos, exp: Date.now() + DURACION_HORAS * 3600_000 }
  const cuerpo = b64urlDesde(codificador.encode(JSON.stringify(carga)))
  const firma = await crypto.subtle.sign('HMAC', await clave(), codificador.encode(cuerpo))
  return `${cuerpo}.${b64urlDesde(new Uint8Array(firma))}`
}

export async function verificarSesion(token) {
  if (!token) return null
  const [cuerpo, firma] = token.split('.')
  if (!cuerpo || !firma) return null

  let valida
  try {
    valida = await crypto.subtle.verify(
      'HMAC',
      await clave(),
      b64urlA(firma),
      codificador.encode(cuerpo),
    )
  } catch {
    return null
  }
  if (!valida) return null

  try {
    const carga = JSON.parse(new TextDecoder().decode(b64urlA(cuerpo)))
    return carga.exp > Date.now() ? carga : null
  } catch {
    return null
  }
}

export const opcionesCookie = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: DURACION_HORAS * 3600,
}
