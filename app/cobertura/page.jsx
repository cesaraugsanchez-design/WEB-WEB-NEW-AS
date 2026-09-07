import Link from 'next/link'
import { Building, Clock, MapPin, Phone } from 'lucide-react'
import Footer from '@/components/Footer'
import GloboCobertura from '@/components/GloboCobertura'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'Cobertura — ASSANCH',
  description:
    'Firma dominicana con alcance en Latinoamérica y el Caribe. Tres oficinas y flota dedicada para estar en el sitio del siniestro en cualquier punto del país.',
  alternates: { canonical: '/cobertura' },
}

const zonas = [
  {
    nombre: 'Zona Oriental / Este',
    oficina: 'Santo Domingo Este',
    detalle: 'Alma Rosa II y provincias del este, incluida la zona hotelera.',
  },
  {
    nombre: 'Distrito Nacional / Sur',
    oficina: 'Santo Domingo',
    detalle: 'Distrito Nacional y provincias del sur.',
  },
  {
    nombre: 'Zona Norte',
    oficina: 'Santiago',
    detalle: 'Cibao y provincias del norte.',
  },
]

export default function Cobertura() {
  return (
    <>
      <Navbar />

      <main id="main" className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
        <div
          aria-hidden
          className="orbe h-[52vw] w-[52vw] bg-blue-300/35"
          style={{ top: '-10%', right: '-8%', '--orbe-tiro': '30px' }}
        />
        <div
          aria-hidden
          className="orbe h-[36vw] w-[36vw] bg-gold/15"
          style={{ bottom: '4%', left: '-10%', '--orbe-tiro': '-24px' }}
        />

        <div className="section relative">
          <div className="mx-auto max-w-2xl text-center">
            <p className="pildora">Cobertura</p>
            <h1 className="mt-6 font-display text-4xl leading-[1.08] font-medium tracking-[-0.03em] text-navy md:text-6xl">
              Presencia inmediata en{' '}
              <span className="texto-degradado font-semibold">todo el territorio</span>.
            </h1>
            <p className="mt-6 font-body text-lg leading-relaxed text-slate">
              Tres oficinas y una flota dedicada nos permiten estar en el sitio del
              siniestro en cualquier punto del país, con alcance en Latinoamérica y el
              Caribe.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-12 lg:items-stretch">
            <div className="tarjeta flex flex-col overflow-hidden p-0 lg:col-span-7">
              <GloboCobertura className="h-[380px] md:h-[520px]" />

              {/* Debajo del globo quedaban casi 400 px en blanco, y el mensaje
                  regional se entiende mejor pegado al mapa que lo ilustra. */}
              <div className="banda-oscura m-4 mt-0 flex-1 rounded-[1.75rem] bg-gradient-to-br from-[#22323F] via-[#1A2833] to-[#16212A] p-8 shadow-[inset_0_1px_0_rgb(255_255_255/0.16)] md:p-9">
                <p className="pildora">Cobertura regional</p>

                <p className="mt-5 font-display text-2xl leading-snug font-medium tracking-[-0.02em] text-white md:text-[1.75rem]">
                  Latinoamérica y el Caribe
                </p>

                <p className="mt-4 font-body text-sm leading-relaxed text-mist md:text-[15px]">
                  Establecemos alianzas estratégicas con firmas de ajustadores aliadas para
                  coordinar la colaboración en caso de eventos catastróficos y reclamos
                  complejos. Con ellas conformamos mesas de trabajo para estudiar
                  antecedentes y hallazgos de siniestros pasados en cada uno de los países
                  de la región.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 lg:col-span-5">
              {/* La cobertura se lee en dos niveles, no como una lista plana de
                  tres oficinas: primero el pais, donde la firma llega a
                  cualquier punto, y despues la region. */}
              <div className="tarjeta p-7">
                <p className="font-body text-[11px] font-semibold tracking-[0.12em] text-blue-700 uppercase">
                  República Dominicana
                </p>
                <p className="mt-2 font-display text-xl font-semibold tracking-[-0.015em] text-navy">
                  Todo el territorio nacional
                </p>
                <p className="mt-2 font-body text-sm leading-relaxed text-slate">
                  Tres oficinas y una flota dedicada nos ponen en el sitio del siniestro
                  en cualquier punto del país.
                </p>
              </div>

              {zonas.map((z) => (
                <article key={z.nombre} className="tarjeta flex-1 p-7">
                  <h2 className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-[-0.01em] text-navy">
                    <MapPin size={17} aria-hidden className="shrink-0 text-blue-500" />
                    {z.nombre}
                  </h2>
                  <p className="mt-3 font-body text-sm leading-relaxed text-slate">{z.detalle}</p>
                  <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1.5 font-body text-[12px] font-semibold text-blue-700">
                    <Building size={13} aria-hidden />
                    Oficina en {z.oficina}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="tarjeta mt-6 flex flex-wrap items-center justify-between gap-6 p-7 md:p-9">
            <div>
              <p className="flex items-center gap-2.5 font-display text-xl font-semibold tracking-[-0.015em] text-navy">
                <Clock size={19} aria-hidden className="text-blue-500" />
                Aviso de siniestros 24/7
              </p>
              <p className="mt-2 font-body text-sm text-slate">
                Recibido el aviso, el expediente se activa y se designa ajustador.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a href="tel:+18097929384" className="btn">
                <Phone size={16} aria-hidden />
                809-792-9384
              </a>
              <Link href="/someter-reclamo" className="btn-claro">
                Asignar un reclamo
              </Link>
            </div>
          </div>

          <p className="mt-10 text-center font-body text-[13px] leading-relaxed text-slate">
            La esfera usa geografía real —contornos de Natural Earth simplificados— y
            sitúa cada punto en sus coordenadas verdaderas.
          </p>
        </div>
      </main>

      <Footer />
    </>
  )
}
