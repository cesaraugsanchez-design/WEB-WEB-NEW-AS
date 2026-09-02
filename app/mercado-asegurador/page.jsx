import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CalendarDays, FileText, Mail } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MigaDePan from '@/components/plantillas/MigaDePan'
import HeroInterno from '@/components/plantillas/HeroInterno'
import CtaFinal from '@/components/plantillas/CtaFinal'
import Revelar from '@/components/Revelar'
import { informesOrdenados, portadaDe } from '@/lib/contenido/informes'

export const metadata = {
  title: 'Mercado asegurador — ASSANCH',
  description:
    'La Semanal: lectura de riesgos, primas y estrategia para aseguradoras, corredores y reaseguradores en Latinoamérica y el Caribe.',
  alternates: { canonical: '/mercado-asegurador' },
}

const fmtFecha = new Intl.DateTimeFormat('es-DO', { day: 'numeric', month: 'long', year: 'numeric' })

/* Agrupados por ano: con un informe semanal, en dos anos son cien entradas y
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
          pildora="La Semanal"
          titulo="Lectura semanal del mercado"
          resalte="del mercado"
          entradilla="Riesgos, primas y estrategia para aseguradoras, corredores y reaseguradores en Latinoamérica y el Caribe."
        />

        <section className="pb-8" data-reveal-group>
          <div className="section">
            {grupos.length > 0 ? (
              <div className="space-y-14">
                {grupos.map(([ano, items]) => (
                  <div key={ano}>
                    <h2 className="font-body text-[11px] font-semibold tracking-[0.12em] text-slate uppercase">
                      {ano}
                    </h2>

                    <ul className="mt-6 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                      {items.map((i) => (
                        <li key={i.slug} className="reveal">
                          <Link
                            href={`/mercado-asegurador/${i.slug}`}
                            className="tarjeta group flex h-full flex-col overflow-hidden"
                          >
                            {/* La portada como miniatura. `sizes` evita que el
                                navegador descargue la version de 1600 px para
                                una tarjeta de 380. */}
                            <span className="relative block overflow-hidden border-b border-line bg-canvas">
                              <Image
                                src={portadaDe(i)}
                                alt={`Portada del informe: ${i.titulo}`}
                                width={1224}
                                height={1584}
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="h-auto w-full transition-transform duration-700 ease-suave group-hover:scale-[1.03]"
                              />
                            </span>

                            <span className="flex flex-1 flex-col p-6">
                              <span className="font-body text-[11px] font-semibold tracking-[0.12em] text-slate uppercase">
                                Semana {i.semana}
                              </span>

                              <span className="mt-3 font-display text-lg leading-snug font-medium text-navy">
                                {i.titulo}
                              </span>

                              <span className="mt-3 line-clamp-3 font-body text-sm leading-relaxed text-slate">
                                {i.resumen}
                              </span>

                              <span className="mt-auto flex items-center justify-between gap-3 pt-6">
                                <span className="flex items-center gap-1.5 font-body text-xs text-slate">
                                  <CalendarDays size={12} aria-hidden className="text-blue-500" />
                                  <time dateTime={i.fecha}>
                                    {fmtFecha.format(new Date(`${i.fecha}T12:00:00`))}
                                  </time>
                                </span>

                                <span className="flex items-center gap-1.5 font-body text-sm font-semibold text-blue-700">
                                  Leer
                                  <ArrowRight
                                    size={14}
                                    aria-hidden
                                    className="transition-transform duration-300 group-hover:translate-x-1"
                                  />
                                </span>
                              </span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              /* Estado vacio honesto. Un informe de mercado inventado no seria
                 relleno: seria una afirmacion falsa sobre el mercado asegurador
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
