import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, FileText, Search } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MigaDePan from '@/components/plantillas/MigaDePan'
import HeroInterno from '@/components/plantillas/HeroInterno'
import CtaFinal from '@/components/plantillas/CtaFinal'
import Revelar from '@/components/Revelar'
import { ramos, ramoPorSlug } from '@/lib/contenido/ramos'

export function generateStaticParams() {
  return ramos.map((r) => ({ slug: r.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const r = ramoPorSlug[slug]
  if (!r) return { title: 'Ramo no encontrado — ASSANCH' }
  return {
    title: `${r.nombre} — Ramos — ASSANCH`,
    description: r.definicion.slice(0, 155),
    alternates: { canonical: `/ramos/${r.slug}` },
  }
}

/* Enlace precargado al formulario con el ramo ya seleccionado: quien llega a la
   ficha de «Incendio» y decide reportar no tiene por qué volver a elegirlo. */
function enlaceReclamo(nombre) {
  return `/someter-reclamo?ramo=${encodeURIComponent(nombre)}`
}

export default async function FichaRamo({ params }) {
  const { slug } = await params
  const r = ramoPorSlug[slug]
  if (!r) notFound()

  const Icono = r.icon
  const otros = ramos.filter((o) => o.slug !== r.slug).slice(0, 4)

  return (
    <>
      <Navbar />
      <Revelar />

      <main id="main" className="pt-20">
        <MigaDePan
          piezas={[
            { label: 'Inicio', href: '/' },
            { label: 'Ramos', href: '/ramos' },
            { label: r.nombre, href: `/ramos/${r.slug}` },
          ]}
        />

        <HeroInterno
          pildora={r.nota}
          titulo={r.nombre}
          entradilla={r.definicion}
          acciones={
            <>
              <Link href={enlaceReclamo(r.nombre)} className="btn" data-iman>
                Someter un reclamo de este ramo <ArrowRight size={16} aria-hidden />
              </Link>
              <Link href="/ramos" className="btn-claro">
                <Icono size={15} aria-hidden className="text-blue-500" />
                Ver los otros ramos
              </Link>
            </>
          }
        />

        <section className="pb-4" data-reveal-group>
          <div className="section grid gap-6 md:grid-cols-2">
            <div className="reveal">
              <div className="tarjeta h-full p-8">
                <h2 className="flex items-center gap-2.5 font-display text-xl font-medium text-navy">
                  <Search size={18} aria-hidden className="text-blue-500" />
                  Qué evalúa el ajustador
                </h2>
                <ul className="mt-6 space-y-3">
                  {r.evaluamos.map((e) => (
                    <li key={e} className="flex items-start gap-3">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      <span className="font-body text-sm leading-relaxed text-slate">{e}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="reveal">
              <div className="tarjeta h-full p-8">
                <h2 className="flex items-center gap-2.5 font-display text-xl font-medium text-navy">
                  <FileText size={18} aria-hidden className="text-blue-500" />
                  Documentos que conviene tener
                </h2>
                <ul className="mt-6 space-y-3">
                  {r.documentos.map((d) => (
                    <li key={d} className="flex items-start gap-3">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-300" />
                      <span className="font-body text-sm leading-relaxed text-slate">{d}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 font-body text-xs leading-relaxed text-slate">
                  No hace falta tenerlos todos para reportar. Se puede abrir el
                  expediente y completarlos después.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12" data-reveal-group>
          <div className="section">
            <p className="pildora">Otros ramos</p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {otros.map((o) => (
                <li key={o.slug} className="reveal">
                  <Link
                    href={`/ramos/${o.slug}`}
                    className="tarjeta group flex min-h-20 items-center gap-3 p-5"
                  >
                    <o.icon size={18} aria-hidden className="shrink-0 text-blue-500" />
                    <span className="font-body text-sm font-medium text-navy">{o.nombre}</span>
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
