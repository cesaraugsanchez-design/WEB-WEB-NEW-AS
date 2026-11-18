import { scrypt, randomBytes, timingSafeEqual, createHash } from 'node:crypto'
import { promisify } from 'node:util'
import { leer, guardar, tomar, borrar, contar } from './almacen'

/**
 * Cuentas de Interna: el usuario es el correo de la firma y la contraseña la
 * fija cada persona. Sustituye al inicio de sesión con Microsoft, que ASSANCH
 * pidió retirar.
 *
 * NADIE ESCRIBE CONTRASEÑAS POR OTRO. Crear la cuenta y restablecerla son el
 * mismo paso: se pide un enlace, llega al buzón de la firma y desde ahí se fija
 * la contraseña. Recibir ese correo es lo que demuestra que la persona es dueña
 * de la dirección; sin ese paso, cualquiera podría registrarse con el correo de
 * otro antes que él.
 *
 * Admite cualquier buzón de los dominios de INTERNA_DOMINIOS (por defecto
 * assanch.com). ASSANCH lo decidió así sabiendo que incluye los buzones
 * compartidos —recepcion@, seguimiento@—: quien lea ese buzón puede crear una
 * cuenta con él.
 *
 * Usa `node:crypto`, así que solo corre en las rutas de la API, nunca en el
 * proxy (runtime edge). El proxy solo verifica la cookie firmada de sesion.js.
 */

const scryptAsync = promisify(scrypt)

const DOMINIOS = (process.env.INTERNA_DOMINIOS || 'assanch.com')
  .split(',')
  .map((d) => d.trim().toLowerCase())
  .filter(Boolean)

export const CLAVE_MINIMA = 10
const CLAVE_MAXIMA = 200

/** Una hora: tiempo de sobra para abrir el correo, poco para un enlace olvidado. */
export const ENLACE_MINUTOS = 60

const cuenta = (correo) => `interna:cuenta:${correo}`
const enlace = (token) => `interna:enlace:${createHash('sha256').update(token).digest('hex')}`

export function normalizarCorreo(valor) {
  return String(valor ?? '').trim().toLowerCase()
}

export function correoAdmitido(correo) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) return false
  return DOMINIOS.includes(correo.split('@')[1])
}

/** Devuelve el motivo por el que no vale, o null si la contraseña sirve. */
export function problemaConClave(clave, correo) {
  if (typeof clave !== 'string' || clave.length < CLAVE_MINIMA) return 'corta'
  if (clave.length > CLAVE_MAXIMA) return 'larga'
  if (clave.toLowerCase() === correo || clave.toLowerCase() === correo.split('@')[0]) return 'correo'
  return null
}

/* scrypt con N=16384, r=8: unos 16 MB y unas decenas de milisegundos por
   intento. Basta para que una base robada no se descifre en serie, y no hace
   esperar a quien entra. Los parámetros viajan en el propio hash, así que
   subirlos más adelante no invalida las contraseñas ya guardadas. */
const N = 16384
const R = 8
const P = 1
const LARGO = 64

async function cifrar(clave) {
  const sal = randomBytes(16)
  const hash = await scryptAsync(clave, sal, LARGO, { N, r: R, p: P })
  return `scrypt$${N}$${R}$${P}$${sal.toString('base64')}$${hash.toString('base64')}`
}

async function coincide(clave, guardado) {
  const [tipo, n, r, p, sal, hash] = guardado.split('$')
  if (tipo !== 'scrypt') return false
  const esperado = Buffer.from(hash, 'base64')
  const calculado = await scryptAsync(clave, Buffer.from(sal, 'base64'), esperado.length, {
    N: Number(n),
    r: Number(r),
    p: Number(p),
  })
  return timingSafeEqual(calculado, esperado)
}

/* Hash de relleno para comparar cuando el correo no tiene cuenta: así la
   respuesta tarda lo mismo exista o no, y el tiempo no revela qué correos
   están registrados. */
let relleno = null

export async function credencialesValidas(correo, clave) {
  const datos = await leer(cuenta(correo))
  const guardado = datos ? JSON.parse(datos).clave : (relleno ??= await cifrar(randomBytes(16).toString('hex')))
  const valida = await coincide(String(clave ?? ''), guardado)
  return Boolean(datos) && valida
}

export async function fijarClave(correo, clave) {
  const previo = await leer(cuenta(correo))
  const ahora = new Date().toISOString()
  await guardar(
    cuenta(correo),
    JSON.stringify({
      correo,
      clave: await cifrar(clave),
      creada: previo ? JSON.parse(previo).creada : ahora,
      actualizada: ahora,
    }),
  )
}

/**
 * Crea un enlace de un solo uso. Se guarda la huella SHA-256 del token, no el
 * token: quien lea el almacén no puede usar los enlaces pendientes.
 */
export async function crearEnlace(correo) {
  const token = randomBytes(32).toString('base64url')
  await guardar(enlace(token), correo, { segundos: ENLACE_MINUTOS * 60 })
  return token
}

const tokenValido = (token) => typeof token === 'string' && token.length >= 20

/** Mira a qué correo pertenece un enlace sin gastarlo. */
export async function correoDelEnlace(token) {
  return tokenValido(token) ? leer(enlace(token)) : null
}

/** Lo consume aunque luego falle algo: un enlace no se reutiliza. */
export async function canjearEnlace(token) {
  return tokenValido(token) ? tomar(enlace(token)) : null
}

/**
 * Límite de intentos con ventana fija. Devuelve true si ya se pasó. Si el
 * almacén falla, deja pasar: el error real aparecerá en el paso siguiente, que
 * también depende del almacén, y no tiene sentido bloquear por el contador.
 */
export async function excedido(clave, maximo, segundos) {
  try {
    return (await contar(`interna:limite:${clave}`, segundos)) > maximo
  } catch {
    return false
  }
}

export async function reiniciarLimite(clave) {
  await borrar(`interna:limite:${clave}`).catch(() => {})
}
