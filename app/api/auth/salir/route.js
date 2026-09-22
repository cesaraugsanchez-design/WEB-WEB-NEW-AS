import { NextResponse } from 'next/server'
import { COOKIE } from '@/lib/interna/sesion'

export async function POST(peticion) {
  const respuesta = NextResponse.redirect(new URL('/interna/entrar', peticion.url), 303)
  respuesta.cookies.delete(COOKIE)
  return respuesta
}
