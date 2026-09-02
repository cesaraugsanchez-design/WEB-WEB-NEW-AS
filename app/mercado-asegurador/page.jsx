import Link from 'next/link'
import { ArrowRight, CalendarDays, FileText, Mail } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MigaDePan from '@/components/plantillas/MigaDePan'
import HeroInterno from '@/components/plantillas/HeroInterno'
import CtaFinal from '@/components/plantillas/CtaFinal'
import Revelar from '@/components/Revelar'
import { informesOrdenados } from '@/lib/contenido/informes'

export const metadata = {
  title: 'Mercado asegurador — ASSANCH',
  description:
    'Informes semanales sobre el mercado asegurador dominicano, elaborados por ASSANCH.',
  alternates: { canonical: '/mercado-asegurador' },
}

const fmtFecha = new Intl.DateTimeFormat('es-DO', { day: 'numeric', month: 'long', year: 'numeric' })

/* Agrupados por año: con un informe semanal, en dos años son cien entradas y
   una lista plana deja de servir para encontrar nada. */
function porAno(lista) {
  const grupos = new Map()
  for (const i of lista) {
    const ano = i.fecha.slice(0, 4)
    if (!grupos.has(ano)) grupos.set(ano, [])
    grupos.get(ano).push(i)
  }
  return [...grupos.entries()]
}

export default function MercadoAsegurador() {
  const grupos = porAno(informesOrdenados)

  return (
    <>
      <Navbar />
      <Revelar />

      <main id="main" className="pt-20">
        <MigaDePan
          piezas={[
            { label: 'Inicio', href: '/' },
            { label: 'Mercado asegurador', href: '/mercado-asegurador' },
          ]}
        />

        <HeroInterno
          pildora="Mercado asegurador"
          titulo="Informes semanales del mercado"
          resalte="del mercado"
          entradilla="Seguimiento del mercado asegurador dominicano, elaborado por ASSANCH y publicado cada semana."
        />

        <section className="pb-8" data-reveal-group>
          <div className="section">
            {grupos.length > 0 ? (
              <div className="mx-auto max-w-3xl space-y-12">
                {grupos.map(([ano, items]) => (
                  <div key={ano}>
                    <h2 className="font-body text-[11px] font-semibold tracking-[0.12em] text-slate uppercase">
                      {ano}
                    </h2>

                    <ul className="mt-5 space-y-3">
                      {items.map((i) => (
                        <li key={i.slug} className="reveal">
                          {/* Enlace al visor, NO al PDF. El archivo original
                              no se publica: solo imagenes de sus paginas. */}
                          <Link
                            href={`/mercado-asegurador/${i.slug}`}
                            className="tarjeta group flex items-center gap-5 p-6"
                          >
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                              <FileText size={21} aria-hidden />
                            </span>

                            <span className="min-w-0 flex-1">
                              <span className="block font-display font-medium text-navy">
                                {i.titulo}
                              </span>

                              {i.resumen && (
                                <span className="mt-1 block font-body text-sm leading-relaxed text-slate">
                                  {i.resumen}
                                </span>
                              )}

                              <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-body text-xs text-slate">
                                <span className="flex items-center gap-1.5">
                                  <CalendarDays size={12} aria-hidden className="text-blue-500" />
                                  <time dateTime={i.fecha}>
                                    {fmtFecha.format(new Date(`${i.fecha}T12:00:00`))}
                                  </time>
                                </span>
                                <span>
                                  {i.paginas.length} {i.paginas.length === 1 ? 'pagina' : 'paginas'}
                                </span>
                              </span>
                            </span>

                            <ArrowRight
                              size={18}
                              aria-hidden
                              className="shrink-0 text-blue-700 transition-transform duration-300 group-hover:translate-x-1"
                            />
                            <span className="sr-only">Leer el informe</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              /* Estado vacío honesto. Un informe de mercado inventado no sería
                 relleno: sería una afirmación falsa sobre el mercado asegurador
                 dominicano publicada bajo la firma de ASSANCH. */
              <div className="tarjeta mx-auto max-w-xl p-12 text-center">
                <FileText size={34} aria-hidden className="mx-auto text-blue-500" />

                <p className="mt-5 font-display text-xl font-medium text-navy">
                  El primer informe se publica en breve
                </p>

                <p className="mx-auto mt-4 max-w-md text-center font-body text-sm leading-relaxed text-slate">
                  Esta sección recoge el seguimiento semanal del mercado asegurador
                  dominicano. Si quiere recibirlo en cuanto salga, escríbanos y lo
                  añadimos a la lista de distribución.
                </p>

                <a
                  href="mailto:recepcion@assanch.com?subject=Informe%20semanal%20del%20mercado%20asegurador"
                  className="btn mt-8"
                >
                  <Mail size={15} aria-hidden />
                  Solicitar el informe
                </a>
              </div>
            )}
          </div>
        </section>

        <CtaFinal />
      </main>

      <Footer />
    </>
  )
}
