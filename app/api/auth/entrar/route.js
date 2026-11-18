import { almacenConfigurado } from '@/lib/interna/almacen'
import {
  normalizarCorreo,
  correoAdmitido,
  credencialesValidas,
  excedido,
  reiniciarLimite,
} from '@/lib/interna/cuentas'
import { firmarSesion, opcionesCookie, COOKIE } from '@/lib/interna/sesion'
import { mismoOrigen, ipDe, redirigir, destinoSeguro } from '@/lib/interna/peticion'

/* Cinco fallos por correo cada quince minutos frenan a quien prueba
   contraseñas contra una cuenta concreta; treinta por IP, a quien prueba
   muchas cuentas desde el mismo sitio. Una persona que olvidó la suya llega
   antes al enlace de restablecer que al límite. */
const VENTANA = 15 * 60
const MAX_POR_CORREO = 5
const MAX_POR_IP = 30

export async function POST(peticion) {
  if (!mismoOrigen(peticion)) return new Response(null, { status: 403 })
  if (!almacenConfigurado() || !process.env.SESION_SECRETO) {
    return redirigir(peticion, '/interna/entrar?error=configuracion')
  }

  const datos = await peticion.formData()
  const correo = normalizarCorreo(datos.get('correo'))
  const clave = String(datos.get('clave') ?? '')
  const volver = destinoSeguro(datos.get('volver'))

  if (!correoAdmitido(correo) || !clave) {
    return redirigir(peticion, '/interna/entrar?error=credenciales')
  }

  const ip = ipDe(peticion)
  if (
    (await excedido(`entrar:correo:${correo}`, MAX_POR_CORREO, VENTANA)) ||
    (await excedido(`entrar:ip:${ip}`, MAX_POR_IP, VENTANA))
  ) {
    return redirigir(peticion, '/interna/entrar?error=limite')
  }

  let valida
  try {
    valida = await credencialesValidas(correo, clave)
  } catch (error) {
    console.error('[interna] no se pudo verificar el acceso:', error.message)
    return redirigir(peticion, '/interna/entrar?error=almacen')
  }

  // Mismo mensaje si el correo no tiene cuenta o si la contraseña no coincide:
  // distinguirlos le diría a un extraño qué correos están registrados.
  if (!valida) return redirigir(peticion, '/interna/entrar?error=credenciales')

  await reiniciarLimite(`entrar:correo:${correo}`)
  const respuesta = redirigir(peticion, volver)
  respuesta.cookies.set(COOKIE, await firmarSesion({ sub: correo, correo }), opcionesCookie)
  return respuesta
}
