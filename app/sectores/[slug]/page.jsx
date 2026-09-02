import { notFound } from 'next/navigation'
import Link from 'next/link'
import { AlertTriangle, ArrowRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MigaDePan from '@/components/plantillas/MigaDePan'
import HeroInterno from '@/components/plantillas/HeroInterno'
import CtaFinal from '@/components/plantillas/CtaFinal'
import Revelar from '@/components/Revelar'
import { sectores, sectorPorSlug } from '@/lib/contenido/sectores'
import { ramoPorSlug } from '@/lib/contenido/ramos'

export function generateStaticParams() {
  return sectores.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const s = sectorPorSlug[slug]
  if (!s) return { title: 'Sector no encontrado — ASSANCH' }
  return {
    title: `${s.nombre} — Sectores — ASSANCH`,
    description: s.resumen,
    alternates: { canonical: `/sectores/${s.slug}` },
  }
}

export default async function FichaSector({ params }) {
  const { slug } = await params
  const s = sectorPorSlug[slug]
  if (!s) notFound()

  /* Los ramos NO se redactan aquí: se enlazan a su ficha, que ya explica qué
     ampara cada uno. Repetir la definición en cada sector sería mantener el
     mismo texto en ocho sitios. */
  const ramos = s.ramos.map((r) => ramoPorSlug[r]).filter(Boolean)

  return (
    <>
      <Navbar />
      <Revelar />

      <main id="main" className="pt-20">
        <MigaDePan
          piezas={[
            { label: 'Inicio', href: '/' },
            { label: 'Sectores', href: '/sectores' },
            { label: s.nombre, href: `/sectores/${s.slug}` },
          ]}
        />

        <HeroInterno pildora="Sector" titulo={s.nombre} entradilla={s.resumen} />

        <section className="pb-4" data-reveal-group>
          <div className="section grid gap-6 lg:grid-cols-12">
            <div className="reveal lg:col-span-6">
              <div className="tarjeta h-full p-8">
                <h2 className="flex items-center gap-2.5 font-display text-xl font-medium text-navy">
                  <AlertTriangle size={18} aria-hidden className="text-blue-500" />
                  Lo que suele siniestrarse
                </h2>
                <ul className="mt-6 space-y-3">
                  {s.riesgos.map((r) => (
                    <li key={r} className="flex items-start gap-3">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      <span className="font-body text-sm leading-relaxed text-slate">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="reveal lg:col-span-6">
              <div className="tarjeta h-full p-8">
                <h2 className="font-display text-xl font-medium text-navy">Ramos implicados</h2>
                <ul className="mt-6 space-y-2">
                  {ramos.map((r) => (
                    <li key={r.slug}>
                      <Link
                        href={`/ramos/${r.slug}`}
                        className="group flex min-h-12 items-center justify-between gap-3 rounded-2xl px-3 transition-colors hover:bg-blue-50"
                      >
                        <span className="flex items-center gap-3">
                          <r.icon size={17} aria-hidden className="shrink-0 text-blue-500" />
                          <span className="font-body text-sm font-medium text-navy">{r.nombre}</span>
                        </span>
                        <ArrowRight
                          size={15}
                          aria-hidden
                          className="shrink-0 text-blue-700 transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <CtaFinal />
      </main>

      <Footer />
    </>
  )
}
