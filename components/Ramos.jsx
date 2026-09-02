import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ramos } from '@/lib/contenido/ramos'

/**
 * Ramos en la portada.
 *
 * Antes cada tarjeta desplegaba un panel de detalle bajo la rejilla. Ese panel
 * repetia, con menos contenido, lo que ya vive en /ramos/[slug]: la misma
 * definicion, lo que evalua el ajustador y la documentacion. Mantener dos sitios
 * con el mismo texto termina siempre igual, con uno de los dos desactualizado.
 *
 * Ahora la tarjeta ES un enlace a su ficha, que ademas ofrece lo que el panel no
 * podia: enlace al formulario con el ramo ya seleccionado, y navegacion a los
 * demas ramos.
 *
 * Al no quedar estado, el componente deja de ser de cliente y su JavaScript sale
 * del paquete de la portada.
 */
export default function Ramos() {
  return (
    <section id="ramos" className="relative scroll-mt-28 overflow-hidden py-24 md:py-32" data-reveal-group>
      <div
        aria-hidden
        className="orbe h-[40vw] w-[40vw] bg-blue-100/70"
        style={{ top: '6%', right: '-14%', '--orbe-tiro': '-22px' }}
      />

      <div className="section relative">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="pildora">Ramos asegurados</p>
          <h2 className="mt-6 font-display text-4xl leading-[1.08] font-medium tracking-[-0.03em] text-navy md:text-5xl">
            Cobertura especializada en{' '}
            <span className="texto-degradado font-semibold">todas las líneas</span> del sector.
          </h2>
          <p className="mt-6 font-body text-lg leading-relaxed text-slate">
            Ajustamos siniestros en los diez ramos que concentran la cartera del mercado
            dominicano. Entre en cualquiera para ver su alcance técnico y la documentación
            que necesitamos para trabajarlo.
          </p>
        </div>

        <ul className="rejilla-flotante mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ramos.map((r) => {
            const Icon = r.icon
            return (
              <li key={r.slug} className="reveal">
                {/* La tarjeta ENTERA es el enlace, no un «ver mas» al pie: un
                    objetivo de 300 px se acierta mas facil que uno de 60, y el
                    lector de pantalla anuncia el nombre del ramo. */}
                <Link href={`/ramos/${r.slug}`} className="tarjeta group flex h-full flex-col p-7">
                  <span className="flex items-start justify-between gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 transition-colors duration-500 group-hover:bg-blue-700 group-hover:text-white">
                      <Icon size={20} strokeWidth={1.8} aria-hidden />
                    </span>
                    <ArrowRight
                      size={16}
                      aria-hidden
                      className="mt-3 shrink-0 text-blue-700 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                    />
                  </span>

                  <span className="mt-6 block font-display text-lg leading-snug font-semibold tracking-[-0.01em] text-navy">
                    {r.nombre}
                  </span>
                  <span className="mt-2 block font-body text-sm leading-relaxed text-slate">
                    {r.nota}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="reveal mt-12 text-center">
          <Link href="/ramos" className="btn-claro">
            Ver el detalle de los 10 ramos
            <ArrowRight size={15} aria-hidden className="text-blue-500" />
          </Link>
        </div>
      </div>
    </section>
  )
}
