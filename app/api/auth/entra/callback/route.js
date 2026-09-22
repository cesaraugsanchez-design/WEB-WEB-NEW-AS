import { NextResponse } from 'next/server'
import {
  canjearCodigo,
  leerIdToken,
  autorizado,
  configurado,
  COOKIE_ESTADO,
} from '@/lib/interna/entra'
import { firmarSesion, opcionesCookie, COOKIE } from '@/lib/interna/sesion'

const fallo = (peticion, motivo) =>
  NextResponse.redirect(new URL(`/interna/entrar?error=${motivo}`, peticion.url))

export async function GET(peticion) {
  if (!configurado()) return fallo(peticion, 'configuracion')

  const url = new URL(peticion.url)
  const codigo = url.searchParams.get('code')
  const estado = url.searchParams.get('state')
  const esperado = peticion.cookies.get(COOKIE_ESTADO)?.value

  if (url.searchParams.get('error')) return fallo(peticion, 'cancelado')
  if (!codigo || !estado || estado !== esperado) return fallo(peticion, 'estado')

  let perfil
  try {
    const { id_token: idToken } = await canjearCodigo({ codigo, origen: url.origin })
    perfil = leerIdToken(idToken)
  } catch {
    return fallo(peticion, 'microsoft')
  }

  if (!autorizado(perfil)) return fallo(peticion, 'dominio')

  const respuesta = NextResponse.redirect(new URL('/interna', peticion.url))
  respuesta.cookies.set(
    COOKIE,
    await firmarSesion({ sub: perfil.sub, nombre: perfil.nombre, correo: perfil.correo }),
    opcionesCookie,
  )
  respuesta.cookies.delete(COOKIE_ESTADO)
  return respuesta
}
