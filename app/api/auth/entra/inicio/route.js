import { NextResponse } from 'next/server'
import { configurado, urlAutorizacion, COOKIE_ESTADO } from '@/lib/interna/entra'
import { opcionesCookie } from '@/lib/interna/sesion'

export async function GET(peticion) {
  if (!configurado()) {
    return NextResponse.redirect(new URL('/interna/entrar?error=configuracion', peticion.url))
  }

  const estado = crypto.randomUUID()
  const destino = urlAutorizacion({ origen: new URL(peticion.url).origin, estado })

  const respuesta = NextResponse.redirect(destino)
  // El estado viaja en cookie y en la URL: al volver deben coincidir, que es lo
  // que impide que alguien dispare el callback desde otro sitio.
  respuesta.cookies.set(COOKIE_ESTADO, estado, { ...opcionesCookie, maxAge: 600 })
  return respuesta
}
