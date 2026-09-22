import { NextResponse } from 'next/server'
import { COOKIE } from '@/lib/interna/sesion'

export async function POST(peticion) {
  /**
   * Al portada, no a /interna/entrar. Devolver a la pantalla de acceso deja a
   * quien acaba de salir delante del botón de entrar otra vez, que es justo lo
   * contrario de lo que pidió; y en un equipo compartido invita a que el
   * siguiente pruebe. La portada es el sitio neutro del que se vuelve a partir.
   * La sesión de Microsoft sigue viva en el navegador: esto cierra la de
   * Interna, no la del correo —y como la entrada lleva `prompt=login`, volver
   * a pasar exige la contraseña igual—.
   */
  const respuesta = NextResponse.redirect(new URL('/', peticion.url), 303)
  respuesta.cookies.delete(COOKIE)
  return respuesta
}
