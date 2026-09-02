import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

/**
 * Rejilla de tarjetas. `items` es [{ icon, titulo, desc, href, nota }].
 *
 * Con `href` la tarjeta ENTERA es el enlace, no solo el texto «Ver más»: un
 * objetivo de 300 px es más fácil de acertar que uno de 60, y el lector de
 * pantalla anuncia el título en vez de un «ver más» sin contexto.
 */
export default function RejillaTarjetas({ items = [], columnas = 3 }) {
  const rejilla =
    columnas === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'

  return (
    <ul className={`grid gap-6 ${rejilla}`}>
      {items.map(({ icon: Icono, titulo, desc, href, nota }) => {
        const cuerpo = (
          <>
            {Icono && (
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <Icono size={21} aria-hidden />
              </span>
            )}

            <h3 className="mt-5 font-display text-lg leading-snug font-medium text-navy">
              {titulo}
            </h3>

            {nota && (
              <p className="mt-1 font-body text-[13px] text-slate-soft">{nota}</p>
            )}

            {desc && (
              <p className="mt-3 font-body text-sm leading-relaxed text-slate">{desc}</p>
            )}

            {href && (
              <span className="mt-auto flex items-center gap-1.5 pt-5 font-body text-sm font-semibold text-blue-700">
                Ver detalle
                <ArrowRight size={14} aria-hidden className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            )}
          </>
        )

        return (
          <li key={titulo} className="reveal">
            {href ? (
              <Link href={href} className="tarjeta group flex h-full flex-col p-7">
                {cuerpo}
              </Link>
            ) : (
              <div className="tarjeta flex h-full flex-col p-7">{cuerpo}</div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
