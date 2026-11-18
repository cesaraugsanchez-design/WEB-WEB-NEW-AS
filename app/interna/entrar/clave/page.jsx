import Link from 'next/link'
import { CLAVE_MINIMA, correoDelEnlace } from '@/lib/interna/cuentas'
import { Tarjeta, Aviso, Campo, Boton } from '../piezas'

/* `same-origin`: el enlace lleva el token en la URL, y sin esto cualquier
   recurso externo que cargara la página lo recibiría en la cabecera Referer.
   No `no-referrer`: con esa política el navegador manda `Origin: null` al
   enviar el formulario, y la ruta lo rechaza por no venir del propio sitio. */
export const metadata = {
  title: 'Fijar contraseña — Interna ASSANCH',
  robots: { index: false, follow: false },
  referrer: 'same-origin',
}

export const dynamic = 'force-dynamic'

const MENSAJES = {
  distintas: 'Las dos contraseñas no coinciden.',
  corta: `La contraseña debe tener al menos ${CLAVE_MINIMA} caracteres.`,
  larga: 'La contraseña es demasiado larga.',
  correo: 'La contraseña no puede ser tu propio correo.',
}

export default async function ClavePage({ searchParams }) {
  const { t, error } = await searchParams

  let correo = null
  try {
    correo = await correoDelEnlace(t)
  } catch {
    return (
      <Tarjeta titulo="Fijar contraseña">
        <Aviso>No se pudo comprobar el enlace en este momento. Inténtalo de nuevo en unos minutos.</Aviso>
      </Tarjeta>
    )
  }

  if (!correo) {
    return (
      <Tarjeta titulo="Enlace no válido">
        <Aviso>Este enlace ya se usó o venció. Los enlaces valen una hora y sirven una sola vez.</Aviso>
        <p className="mt-6 text-center text-sm">
          <Link href="/interna/entrar/enlace" className="font-semibold text-blue-700 hover:underline">
            Pedir un enlace nuevo
          </Link>
        </p>
      </Tarjeta>
    )
  }

  return (
    <Tarjeta titulo="Fijar contraseña" descripcion={`Cuenta: ${correo}`}>
      {error ? <Aviso>{MENSAJES[error] ?? 'No se pudo guardar la contraseña.'}</Aviso> : null}

      <form action="/api/auth/clave" method="post" className="mt-6 space-y-4">
        <input type="hidden" name="t" value={t} />
        {/* Campo de usuario invisible para que el gestor de contraseñas del
            navegador guarde la nueva asociada al correo correcto. No puede ser
            `type="hidden"`: los gestores ignoran esos. La ruta no lo lee; el
            correo sale del enlace. */}
        <input
          type="email"
          value={correo}
          autoComplete="username"
          readOnly
          tabIndex={-1}
          aria-hidden
          className="sr-only"
        />
        <Campo
          etiqueta="Nueva contraseña"
          name="clave"
          type="password"
          autoComplete="new-password"
          minLength={CLAVE_MINIMA}
          ayuda={`Al menos ${CLAVE_MINIMA} caracteres. Una frase corta es más fácil de recordar y más segura que una palabra con símbolos.`}
          required
        />
        <Campo
          etiqueta="Repite la contraseña"
          name="confirmacion"
          type="password"
          autoComplete="new-password"
          minLength={CLAVE_MINIMA}
          required
        />
        <Boton>Guardar y entrar</Boton>
      </form>
    </Tarjeta>
  )
}
