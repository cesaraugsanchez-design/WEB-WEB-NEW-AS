import { NextResponse } from 'next/server'
import { COOKIE, verificarSesion } from '@/lib/interna/sesion'

/**
 * Interna lleva cifras de la firma y rendimiento por persona, así que se cierra
 * aquí y no ocultando el enlace: una URL sin proteger es pública aunque nadie
 * la enlace. Si falta la configuración de sesión, no se entra —fallar cerrado
 * es lo correcto cuando lo que se protege es información confidencial.
 */
export async function proxy(peticion) {
  const sesion = await verificarSesion(peticion.cookies.get(COOKIE)?.value)
  if (sesion) return NextResponse.next()

  const destino = new URL('/interna/entrar', peticion.url)
  const { pathname, search } = peticion.nextUrl
  if (pathname !== '/interna') destino.searchParams.set('volver', pathname + search)
  return NextResponse.redirect(destino)
}

export const config = {
  matcher: ['/interna', '/interna/((?!entrar).*)'],
}
