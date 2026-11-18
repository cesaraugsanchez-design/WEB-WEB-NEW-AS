import Link from 'next/link'
import { almacenConfigurado } from '@/lib/interna/almacen'
import { Tarjeta, Aviso, Campo, Boton } from './piezas'

export const metadata = {
  title: 'Entrar — Interna ASSANCH',
  robots: { index: false, follow: false },
}

const MENSAJES = {
  configuracion: 'El acceso a Interna todavía no está configurado en este entorno.',
  credenciales: 'Correo o contraseña incorrectos.',
  limite: 'Demasiados intentos. Espera quince minutos o restablece tu contraseña.',
  almacen: 'No se pudo verificar el acceso en este momento. Inténtalo de nuevo en unos minutos.',
}

export default async function EntrarPage({ searchParams }) {
  const { error, volver } = await searchParams

  if (!almacenConfigurado()) {
    return (
      <Tarjeta titulo="Interna">
        <Aviso>{MENSAJES.configuracion}</Aviso>
      </Tarjeta>
    )
  }

  return (
    <Tarjeta
      titulo="Interna"
      descripcion="Métricas de expedientes de ASSANCH. Entra con tu correo de la firma y tu contraseña."
    >
      {error ? <Aviso>{MENSAJES[error] ?? 'No se pudo iniciar sesión.'}</Aviso> : null}

      <form action="/api/auth/entrar" method="post" className="mt-6 space-y-4">
        {volver ? <input type="hidden" name="volver" value={volver} /> : null}
        <Campo
          etiqueta="Correo de la firma"
          name="correo"
          type="email"
          autoComplete="username"
          placeholder="nombre@assanch.com"
          required
        />
        <Campo
          etiqueta="Contraseña"
          name="clave"
          type="password"
          autoComplete="current-password"
          required
        />
        <Boton>Entrar</Boton>
      </form>

      <p className="mt-6 text-center text-sm text-slate">
        ¿Primera vez o no recuerdas tu contraseña?{' '}
        <Link href="/interna/entrar/enlace" className="font-semibold text-blue-700 hover:underline">
          Crear o restablecer contraseña
        </Link>
      </p>
    </Tarjeta>
  )
}
