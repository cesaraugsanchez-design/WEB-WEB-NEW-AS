import { configurado } from '@/lib/interna/entra'

export const metadata = {
  title: 'Entrar — Interna ASSANCH',
  robots: { index: false, follow: false },
}

const MENSAJES = {
  configuracion: 'El acceso con cuenta de Microsoft todavía no está configurado en este entorno.',
  cancelado: 'Se canceló el inicio de sesión.',
  estado: 'La sesión de inicio expiró. Inténtalo de nuevo.',
  microsoft: 'Microsoft no pudo confirmar la identidad. Inténtalo de nuevo.',
  dominio: 'Esa cuenta no pertenece a ASSANCH.',
}

export default async function EntrarPage({ searchParams }) {
  const { error } = await searchParams
  const listo = configurado()

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-white p-8 shadow-media">
        <p className="text-xs font-600 tracking-widest text-gold uppercase">Uso interno</p>
        <h1 className="mt-2 font-display text-2xl font-600 text-navy">Interna</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate">
          Métricas de expedientes de ASSANCH. Entra con tu cuenta de la firma.
        </p>

        {error ? (
          <p className="mt-5 rounded-xl border border-signal/30 bg-signal/5 px-3 py-2 text-sm text-signalink">
            {MENSAJES[error] ?? 'No se pudo iniciar sesión.'}
          </p>
        ) : null}

        {listo ? (
          <a
            href="/api/auth/entra/inicio"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-navy px-4 py-3 text-sm font-500 text-white shadow-boton transition hover:bg-blue-900"
          >
            Entrar con cuenta de Microsoft
          </a>
        ) : (
          <p className="mt-6 rounded-xl border border-line bg-canvas px-3 py-3 text-sm text-slate">
            Falta registrar la aplicación en Microsoft Entra ID y definir{' '}
            <code className="text-tinta">MS_TENANT_ID</code>,{' '}
            <code className="text-tinta">MS_CLIENT_ID</code>,{' '}
            <code className="text-tinta">MS_CLIENT_SECRET</code> y{' '}
            <code className="text-tinta">SESION_SECRETO</code>.
          </p>
        )}
      </div>
    </main>
  )
}
