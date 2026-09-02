import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

/**
 * Miga de pan bajo la barra fija.
 *
 * `piezas` es [{ label, href }]. El ÚLTIMO elemento es la página actual y va
 * sin enlace: enlazar a donde ya se está no lleva a ninguna parte y confunde al
 * lector de pantalla, que anuncia un enlace que no hace nada.
 */
export default function MigaDePan({ piezas = [] }) {
  return (
    <nav aria-label="Miga de pan" className="border-b border-line bg-white/80 backdrop-blur-xl">
      <ol className="section flex flex-wrap items-center gap-x-1 gap-y-1 py-3 font-body text-[13px]">
        {piezas.map((p, i) => {
          const ultima = i === piezas.length - 1
          return (
            <li key={p.href} className="flex items-center gap-1">
              {i > 0 && (
                <ChevronRight size={13} aria-hidden className="shrink-0 text-slate-soft" />
              )}
              {ultima ? (
                <span aria-current="page" className="font-semibold text-blue-700">
                  {p.label}
                </span>
              ) : (
                <Link
                  href={p.href}
                  className="flex min-h-9 items-center text-slate transition-colors hover:text-blue-700"
                >
                  {p.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
