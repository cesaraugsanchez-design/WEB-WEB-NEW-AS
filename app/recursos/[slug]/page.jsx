import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CalendarDays } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MigaDePan from '@/components/plantillas/MigaDePan'
import CtaFinal from '@/components/plantillas/CtaFinal'
import Revelar from '@/components/Revelar'
import { recursos, recursoPorSlug } from '@/lib/contenido/recursos'

export function generateStaticParams() {
  return recursos.map((r) => ({ slug: r.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const r = recursoPorSlug[slug]
  if (!r) return { title: 'Recurso no encontrado — ASSANCH' }
  return {
    title: `${r.titulo} — ASSANCH`,
    description: r.entradilla,
    alternates: { canonical: `/recursos/${r.slug}` },
    openGraph: { type: 'article', publishedTime: r.fecha, locale: 'es_DO' },
  }
}

const fmtFecha = new Intl.DateTimeFormat('es-DO', { day: 'numeric', month: 'long', year: 'numeric' })

export default async function FichaRecurso({ params }) {
  const { slug } = await params
  const r = recursoPorSlug[slug]
  if (!r) notFound()

  const otros = recursos.filter((o) => o.slug !== r.slug).slice(0, 3)

  return (
    <>
      <Navbar />
      <Revelar />

      <main id="main" className="pt-20">
        <MigaDePan
          piezas={[
            { label: 'Inicio', href: '/' },
            { label: 'Recursos', href: '/recursos' },
            { label: r.titulo, href: `/recursos/${r.slug}` },
          ]}
        />

        {/* Ancho de lectura acotado: un párrafo a todo lo ancho de 1400 px es
            ilegible por muchas veces que se relea. */}
        <article className="section py-14 md:py-20">
          <div className="mx-auto max-w-2xl">
            <p className="pildora">{r.tipo}</p>

            <h1 className="mt-6 font-display text-[clamp(1.9rem,5vw,3rem)] leading-[1.1] font-medium tracking-[-0.03em] text-navy">
              {r.titulo}
            </h1>

            <p className="mt-3 flex items-center gap-2 font-body text-sm text-slate">
              <CalendarDays size={14} aria-hidden className="text-blue-500" />
              <time dateTime={r.fecha}>{fmtFecha.format(new Date(`${r.fecha}T12:00:00`))}</time>
            </p>

            <p className="mt-8 border-l-2 border-gold pl-5 font-body text-lg leading-relaxed text-tinta">
              {r.entradilla}
            </p>

            {r.cuerpo.map((s) => (
              <section key={s.titulo} className="mt-12">
                <h2 className="font-display text-xl font-medium text-navy">{s.titulo}</h2>
                {s.parrafos.map((p, i) => (
                  <p key={i} className="mt-4 font-body leading-relaxed text-tinta">
                    {p}
                  </p>
                ))}
              </section>
            ))}

            <div className="mt-14 flex flex-wrap gap-3 border-t border-line pt-8">
              {[...r.lineas, ...r.sectores].map((e) => (
                <span key={e} className="rounded-full border border-line bg-canvas px-3 py-1.5 font-body text-xs text-slate">
                  {e}
                </span>
              ))}
            </div>

            <Link
              href="/recursos"
              className="mt-10 inline-flex min-h-11 items-center gap-2 font-body text-sm font-semibold text-blue-700 hover:underline"
            >
              <ArrowLeft size={15} aria-hidden />
              Volver a Recursos
            </Link>
          </div>
        </article>

        <section className="pb-8" data-reveal-group>
          <div className="section">
            <p className="pildora">Seguir leyendo</p>
            <ul className="mt-6 grid gap-4 md:grid-cols-3">
              {otros.map((o) => (
                <li key={o.slug} className="reveal">
                  <Link href={`/recursos/${o.slug}`} className="tarjeta flex h-full flex-col p-6">
                    <span className="font-body text-[11px] font-semibold tracking-[0.12em] text-slate uppercase">
                      {o.tipo}
                    </span>
                    <span className="mt-3 font-display font-medium text-navy">{o.titulo}</span>
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
