import Link from 'next/link'
import { ENLACE_MINUTOS } from '@/lib/interna/cuentas'
import { Tarjeta, Aviso, Campo, Boton } from '../piezas'

export const metadata = {
  title: 'Crear o restablecer contraseña — Interna ASSANCH',
  robots: { index: false, follow: false },
}

const MENSAJES = {
  configuracion: 'El acceso a Interna todavía no está configurado en este entorno.',
  envio: 'No se pudo enviar el correo en este momento. Inténtalo de nuevo en unos minutos.',
  vencido: 'Ese enlace ya se usó o venció. Pide uno nuevo aquí.',
}

export default async function EnlacePage({ searchParams }) {
  const { enviado, error } = await searchParams

  if (enviado) {
    return (
      <Tarjeta titulo="Revisa tu correo">
        {/* El texto no confirma que el correo exista: la ruta responde igual
            siempre, para no revelar qué direcciones tiene la firma. */}
        <Aviso tono="ok">
          Si el correo pertenece a ASSANCH, en unos minutos te llegará un enlace para fijar tu
          contraseña. Vale {ENLACE_MINUTOS} minutos y sirve una sola vez.
        </Aviso>
        <p className="mt-6 text-sm leading-relaxed text-slate">
          ¿No llega? Revisa la carpeta de correo no deseado antes de pedir otro.
        </p>
        <p className="mt-6 text-center text-sm">
          <Link href="/interna/entrar" className="font-semibold text-blue-700 hover:underline">
            Volver a entrar
          </Link>
        </p>
      </Tarjeta>
    )
  }

  return (
    <Tarjeta
      titulo="Crear o restablecer contraseña"
      descripcion="Escribe tu correo de la firma. Te enviaremos un enlace para fijar tu contraseña; sirve igual si es tu primera vez o si la olvidaste."
    >
      {error ? <Aviso>{MENSAJES[error] ?? 'No se pudo completar la solicitud.'}</Aviso> : null}

      <form action="/api/auth/enlace" method="post" className="mt-6 space-y-4">
        <Campo
          etiqueta="Correo de la firma"
          name="correo"
          type="email"
          autoComplete="username"
          placeholder="nombre@assanch.com"
          required
        />
        <Boton>Enviarme el enlace</Boton>
      </form>

      <p className="mt-6 text-center text-sm">
        <Link href="/interna/entrar" className="font-semibold text-blue-700 hover:underline">
          Volver a entrar
        </Link>
      </p>
    </Tarjeta>
  )
}
