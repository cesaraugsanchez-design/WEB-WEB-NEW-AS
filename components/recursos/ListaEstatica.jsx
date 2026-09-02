import Link from 'next/link'
import { CalendarDays } from 'lucide-react'
import { recursos } from '@/lib/contenido/recursos'

const fmtFecha = new Intl.DateTimeFormat('es-DO', { day: 'numeric', month: 'long', year: 'numeric' })

/**
 * Lista sin filtros, renderizada en el SERVIDOR.
 *
 * Va como `fallback` del Suspense que envuelve la versión interactiva. No es un
 * apaño: es para lo que sirve un fallback. `useSearchParams` obliga a que la
 * lista con filtros sea de cliente, y eso dejaba las tarjetas fuera del HTML
 * servido — invisibles para cualquier rastreador que no ejecute JavaScript, y
 * para quien lo tenga desactivado.
 *
 * Con esto, el HTML sale ya con los enlaces y el navegador los sustituye por la
 * versión filtrable al hidratar.
 */
export default function ListaEstatica() {
  return (
    <div className="section pb-8">
      <p className="font-body text-sm text-slate">
        {recursos.length} {recursos.length === 1 ? 'recurso' : 'recursos'}
      </p>

      <ul className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recursos.map((r) => (
          <li key={r.slug}>
            <Link href={`/recursos/${r.slug}`} className="tarjeta flex h-full flex-col p-7">
              <span className="pildora self-start">{r.tipo}</span>

              <h2 className="mt-5 font-display text-lg leading-snug font-medium text-navy">
                {r.titulo}
              </h2>

              <p className="mt-3 line-clamp-2 font-body text-sm leading-relaxed text-slate">
                {r.entradilla}
              </p>

              <span className="mt-auto flex items-center gap-2 pt-6 font-body text-xs text-slate">
                <CalendarDays size={13} aria-hidden className="text-blue-500" />
                <time dateTime={r.fecha}>{fmtFecha.format(new Date(`${r.fecha}T12:00:00`))}</time>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
