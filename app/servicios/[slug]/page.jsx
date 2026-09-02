import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MigaDePan from '@/components/plantillas/MigaDePan'
import HeroInterno from '@/components/plantillas/HeroInterno'
import CtaFinal from '@/components/plantillas/CtaFinal'
import Revelar from '@/components/Revelar'
import { servicios, servicioPorSlug } from '@/lib/contenido/servicios'

/* Las tres fichas se generan en compilación: son contenido fijo y no hay razón
   para resolverlas en cada visita. */
export function generateStaticParams() {
  return servicios.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const s = servicioPorSlug[slug]
  if (!s) return { title: 'Servicio no encontrado — ASSANCH' }
  return {
    title: `${s.titulo} — ASSANCH`,
    description: s.resumen,
    alternates: { canonical: `/servicios/${s.slug}` },
  }
}

export default async function FichaServicio({ params }) {
  const { slug } = await params
  const s = servicioPorSlug[slug]
  if (!s) notFound()

  const otros = servicios.filter((o) => o.slug !== s.slug)

  return (
    <>
      <Navbar />
      <Revelar />

      <main id="main" className="pt-20">
        <MigaDePan
          piezas={[
            { label: 'Inicio', href: '/' },
            { label: 'Servicios', href: '/servicios' },
            { label: s.titulo, href: `/servicios/${s.slug}` },
          ]}
        />

        <HeroInterno pildora="Servicio" titulo={s.titulo} entradilla={s.detalle} />

        <section className="pb-4" data-reveal-group>
          <div className="section grid gap-6 lg:grid-cols-12">
            <div className="reveal lg:col-span-7">
              <div className="tarjeta h-full p-8">
                <h2 className="font-display text-xl font-medium text-navy">Qué se entrega</h2>
                <ul className="mt-6 space-y-4">
                  {s.entregables.map((e) => (
                    <li key={e} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                        <Check size={12} aria-hidden strokeWidth={3} />
                      </span>
                      <span className="font-body text-sm leading-relaxed text-slate">{e}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="reveal lg:col-span-5">
              <div className="tarjeta h-full p-8">
                <h2 className="font-display text-xl font-medium text-navy">Cuándo conviene</h2>
                <ul className="mt-6 space-y-5">
                  {s.cuando.map(({ icon: Icono, texto }) => (
                    <li key={texto} className="flex items-start gap-3">
                      <Icono size={17} aria-hidden className="mt-0.5 shrink-0 text-blue-500" />
                      <span className="font-body text-sm leading-relaxed text-slate">{texto}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12" data-reveal-group>
          <div className="section">
            <p className="pildora">Otros servicios</p>
            <ul className="mt-6 grid gap-4 md:grid-cols-2">
              {otros.map((o) => (
                <li key={o.slug} className="reveal">
                  <Link
                    href={`/servicios/${o.slug}`}
                    className="tarjeta group flex min-h-20 items-center justify-between gap-4 p-6"
                  >
                    <span className="font-display font-medium text-navy">{o.titulo}</span>
                    <ArrowRight
                      size={17}
                      aria-hidden
                      className="shrink-0 text-blue-700 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <CtaFinal />
      </main>

      <Footer />
    </>
  )
}
