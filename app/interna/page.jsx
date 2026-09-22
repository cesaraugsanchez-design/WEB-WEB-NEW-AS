import { cookies } from 'next/headers'
import { cargarMatriz } from '@/lib/interna/origen.mjs'
import { revisarCalidad } from '@/lib/interna/metricas'
import { COOKIE, verificarSesion } from '@/lib/interna/sesion'
import TableroInterno from './TableroInterno'

export const metadata = {
  title: 'Interna — ASSANCH',
  robots: { index: false, follow: false, nocache: true },
}

// La matriz cambia durante el día; el tablero se arma en cada visita sobre la
// última lectura en memoria, nunca sobre una versión generada en el build.
export const dynamic = 'force-dynamic'

const fechaLarga = new Intl.DateTimeFormat('es-DO', {
  dateStyle: 'long',
  timeStyle: 'short',
  timeZone: 'America/Santo_Domingo',
})

function Aviso({ titulo, children }) {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <h1 className="font-display text-2xl font-600 text-navy">{titulo}</h1>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate">{children}</div>
    </main>
  )
}

export default async function InternaPage() {
  let datos
  try {
    datos = await cargarMatriz()
  } catch (error) {
    return (
      <Aviso titulo="El tablero no puede leer la matriz">
        <p>{error.message}</p>
      </Aviso>
    )
  }

  const { registros, origen, leido } = datos
  const avisos = revisarCalidad(registros)
  const sesion = await verificarSesion((await cookies()).get(COOKIE)?.value)

  return (
    <main className="mx-auto max-w-[88rem] px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-line pb-5">
        <div>
          <p className="text-xs font-600 tracking-widest text-gold uppercase">Uso interno</p>
          <h1 className="mt-1 font-display text-3xl font-600 text-navy">
            Métricas de expedientes
          </h1>
        </div>
        <div className="text-right text-xs text-slate">
          <p>
            {origen === 'sharepoint' ? 'Matriz de SharePoint' : 'Copia local de la matriz'} ·
            actualizado {fechaLarga.format(new Date(leido))}
          </p>
          {sesion ? (
            <form action="/api/auth/salir" method="post" className="mt-1">
              <span className="text-tinta">{sesion.nombre ?? sesion.correo}</span>
              <button type="submit" className="ml-2 text-signalink hover:underline">
                Salir
              </button>
            </form>
          ) : null}
        </div>
      </header>

      <TableroInterno registros={registros} meta={{ avisos }} />

      <footer className="mt-10 border-t border-line pt-4 text-xs text-slate">
        Información confidencial de ASSANCH. No compartir fuera de la firma.
      </footer>
    </main>
  )
}
