import { almacenConfigurado } from '@/lib/interna/almacen'
import { normalizarCorreo, correoAdmitido, crearEnlace, excedido } from '@/lib/interna/cuentas'
import { enviarEnlace } from '@/lib/interna/correoEnlace'
import { mismoOrigen, ipDe, redirigir } from '@/lib/interna/peticion'
import { SITIO_URL } from '@/lib/sitio'

/* Tres enlaces por correo y por hora bastan para quien no encuentra el
   primero; más que eso solo serviría para llenarle el buzón a alguien. */
const VENTANA = 60 * 60
const MAX_POR_CORREO = 3
const MAX_POR_IP = 10

const LISTO = '/interna/entrar/enlace?enviado=1'

export async function POST(peticion) {
  if (!mismoOrigen(peticion)) return new Response(null, { status: 403 })
  if (!almacenConfigurado()) return redirigir(peticion, '/interna/entrar/enlace?error=configuracion')

  const correo = normalizarCorreo((await peticion.formData()).get('correo'))

  /* La respuesta es la misma pase lo que pase con el correo —admitido o no,
     con cuenta o sin ella, límite alcanzado o no—: si variara, el formulario
     serviría para averiguar qué direcciones existen en la firma. */
  if (!correoAdmitido(correo)) return redirigir(peticion, LISTO)
  if (
    (await excedido(`enlace:correo:${correo}`, MAX_POR_CORREO, VENTANA)) ||
    (await excedido(`enlace:ip:${ipDe(peticion)}`, MAX_POR_IP, VENTANA))
  ) {
    return redirigir(peticion, LISTO)
  }

  /* El enlace se arma con la URL canónica y no con la cabecera Host de la
     petición: si alguien la falsea, el correo legítimo llevaría a su dominio y
     el token acabaría en sus manos. En local se usa el origen de la petición
     para poder probarlo. */
  const base = process.env.NODE_ENV === 'production' ? SITIO_URL : new URL(peticion.url).origin

  try {
    const token = await crearEnlace(correo)
    await enviarEnlace({ correo, url: `${base}/interna/entrar/clave?t=${token}` })
  } catch (error) {
    console.error('[interna] no se pudo enviar el enlace:', error.message)
    return redirigir(peticion, '/interna/entrar/enlace?error=envio')
  }

  return redirigir(peticion, LISTO)
}
