import { almacenConfigurado } from '@/lib/interna/almacen'
import {
  canjearEnlace,
  correoDelEnlace,
  correoAdmitido,
  fijarClave,
  problemaConClave,
  reiniciarLimite,
} from '@/lib/interna/cuentas'
import { firmarSesion, opcionesCookie, COOKIE } from '@/lib/interna/sesion'
import { mismoOrigen, redirigir } from '@/lib/interna/peticion'

export async function POST(peticion) {
  if (!mismoOrigen(peticion)) return new Response(null, { status: 403 })
  if (!almacenConfigurado() || !process.env.SESION_SECRETO) {
    return redirigir(peticion, '/interna/entrar?error=configuracion')
  }

  const datos = await peticion.formData()
  const token = String(datos.get('t') ?? '')
  const clave = String(datos.get('clave') ?? '')
  const confirmacion = String(datos.get('confirmacion') ?? '')

  const volverAlFormulario = (error) =>
    redirigir(peticion, `/interna/entrar/clave?t=${encodeURIComponent(token)}&error=${error}`)

  try {
    // La contraseña se revisa ANTES de gastar el enlace: un descuido al
    // escribirla no debe obligar a pedir otro correo.
    const correo = await correoDelEnlace(token)
    if (!correo || !correoAdmitido(correo)) {
      return redirigir(peticion, '/interna/entrar/enlace?error=vencido')
    }
    if (clave !== confirmacion) return volverAlFormulario('distintas')
    const problema = problemaConClave(clave, correo)
    if (problema) return volverAlFormulario(problema)

    // Si dos pestañas envían a la vez, solo una canjea el enlace.
    if ((await canjearEnlace(token)) !== correo) {
      return redirigir(peticion, '/interna/entrar/enlace?error=vencido')
    }
    await fijarClave(correo, clave)
    await reiniciarLimite(`entrar:correo:${correo}`)

    const respuesta = redirigir(peticion, '/interna')
    respuesta.cookies.set(COOKIE, await firmarSesion({ sub: correo, correo }), opcionesCookie)
    return respuesta
  } catch (error) {
    console.error('[interna] no se pudo fijar la contraseña:', error.message)
    return redirigir(peticion, '/interna/entrar?error=almacen')
  }
}
