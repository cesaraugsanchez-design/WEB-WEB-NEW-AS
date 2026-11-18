import { NextResponse } from 'next/server'

/**
 * Utilidades comunes a las rutas de acceso de Interna.
 */

/**
 * Los formularios de acceso solo se aceptan desde el propio sitio. Las cookies
 * ya son `sameSite: lax`, pero esto cierra además que otra web haga que el
 * navegador de alguien pida enlaces o pruebe contraseñas en su nombre.
 */
export function mismoOrigen(peticion) {
  const origen = peticion.headers.get('origin')
  if (!origen) return true
  try {
    return new URL(origen).host === new URL(peticion.url).host
  } catch {
    return false
  }
}

export function ipDe(peticion) {
  return peticion.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'desconocida'
}

/** 303: tras un POST, el navegador debe pedir la página nueva con GET. */
export function redirigir(peticion, ruta) {
  return NextResponse.redirect(new URL(ruta, peticion.url), 303)
}

/** Solo se vuelve a rutas de Interna: un `volver` externo sería una redirección abierta. */
export function destinoSeguro(valor) {
  return typeof valor === 'string' && /^\/interna(\/|\?|$)/.test(valor) ? valor : '/interna'
}
