import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, Mail } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MigaDePan from '@/components/plantillas/MigaDePan'
import CtaFinal from '@/components/plantillas/CtaFinal'
import VisorInforme from '@/components/informes/VisorInforme'
import CompartirInforme from '@/components/informes/CompartirInforme'
import { informes, informePorSlug, portadaDe } from '@/lib/contenido/informes'

export function generateStaticParams() {
  return informes.map((i) => ({ slug: i.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const i = informePorSlug[slug]
  if (!i) return { title: 'Informe no encontrado — ASSANCH' }

  /* La portada va en los metadatos y no en el botón de compartir, porque es
     así como funciona: LinkedIn y X no aceptan una imagen por parámetro —sería
     un agujero evidente, cualquiera podría adjuntar lo que quisiera a un
     enlace ajeno—. Van a buscar el `og:image` de la página que se comparte.
     Sin esto, compartir un informe mostraba una tarjeta sin imagen.

     Es la página 1 del propio informe, a tamaño completo. Viene vertical
     (1224x1584) y las dos redes recortan a horizontal, así que se ve la banda
     central de la portada; se asume antes que fabricar una imagen distinta de
     lo que el lector va a encontrar al entrar. */
  const portada = portadaDe(i)

  return {
    title: `${i.titulo} — ${i.fecha} — ASSANCH`,
    description: i.resumen,
    alternates: { canonical: `/mercado-asegurador/${i.slug}` },
    openGraph: {
      type: 'article',
      publishedTime: i.fecha,
      title: `La Semanal · Semana ${i.semana} — ${i.titulo}`,
      description: i.resumen,
      url: `/mercado-asegurador/${i.slug}`,
      siteName: 'ASSANCH',
      locale: 'es_DO',
      images: [{ url: portada, width: 1224, height: 1584, alt: `Portada del informe del ${i.fecha}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `La Semanal · Semana ${i.semana}`,
      description: i.resumen,
      images: [portada],
    },
  }
}

const fmtFecha = new Intl.DateTimeFormat('es-DO', { day: 'numeric', month: 'long', year: 'numeric' })

export default async function FichaInforme({ params }) {
  const { slug } = await params
  const informe = informePorSlug[slug]
  if (!informe) notFound()

  return (
    <>
      <Navbar />

      <main id="main" className="pt-20">
        <MigaDePan
          piezas={[
            { label: 'Inicio', href: '/' },
            { label: 'Mercado asegurador', href: '/mercado-asegurador' },
            { label: fmtFecha.format(new Date(`${informe.fecha}T12:00:00`)), href: `/mercado-asegurador/${informe.slug}` },
          ]}
        />

        <div className="section py-12 md:py-16">
          <div className="mx-auto max-w-4xl">
            <p className="pildora">La Semanal · Semana {informe.semana}</p>

            <h1 className="mt-6 font-display text-[clamp(1.8rem,4.6vw,2.8rem)] leading-[1.1] font-medium tracking-[-0.03em] text-navy">
              {informe.titulo}
            </h1>

            <p className="mt-3 flex items-center gap-2 font-body text-sm text-slate">
              <CalendarDays size={14} aria-hidden className="text-blue-500" />
              <time dateTime={informe.fecha}>
                {fmtFecha.format(new Date(`${informe.fecha}T12:00:00`))}
              </time>
              <span aria-hidden>·</span>
              <span>
                {informe.paginas.length} {informe.paginas.length === 1 ? 'página' : 'páginas'}
              </span>
            </p>

            {/* El resumen no es decorativo: el informe se publica como imágenes
                y este texto es la única vía de acceso para quien usa un lector
                de pantalla. */}
            {informe.resumen && (
              <p className="mt-7 border-l-2 border-gold pl-5 font-body text-lg leading-relaxed text-tinta">
                {informe.resumen}
              </p>
            )}

            <div className="mt-10">
              <VisorInforme informe={informe} />
            </div>

            <CompartirInforme informe={informe} />

            <p className="mt-6 font-body text-sm leading-relaxed text-slate">
              Este informe se publica para consulta en línea. Si necesita el
              documento completo para uso interno,{' '}
              <a
                href={`mailto:recepcion@assanch.com?subject=${encodeURIComponent(`Informe del ${informe.fecha}`)}`}
                className="font-semibold text-blue-700 underline underline-offset-4"
              >
                solicítelo por correo
              </a>
              .
            </p>

            <Link
              href="/mercado-asegurador"
              className="mt-10 inline-flex min-h-11 items-center gap-2 font-body text-sm font-semibold text-blue-700 hover:underline"
            >
              <ArrowLeft size={15} aria-hidden />
              Ver todos los informes
            </Link>
          </div>
        </div>

        <CtaFinal />
      </main>

      <Footer />
    </>
  )
}
