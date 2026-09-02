import Link from 'next/link'
import { ArrowRight, Gauge, Handshake, Microscope } from 'lucide-react'
import { servicios } from '@/lib/contenido/servicios'

const rol = [
  {
    icon: Gauge,
    titulo: 'Respuesta inmediata',
    desc: 'La rapidez es nuestro primer indicador de satisfacción. Actuamos con urgencia para evaluar y resolver.',
  },
  {
    icon: Microscope,
    titulo: 'Criterio técnico e investigación',
    desc: 'Alto conocimiento de pólizas y líneas aliadas, con capacidad de determinar el compromiso de la póliza por evento.',
  },
  {
    icon: Handshake,
    titulo: 'Aliado estratégico',
    desc: 'Acompañamiento confiable para aseguradoras y clientes, siendo su socio de confianza en cada proceso.',
  },
]

export default function Servicios() {
  return (
    <section id="servicios" className="relative scroll-mt-28 py-24 md:py-32" data-reveal-group>
      <div className="section">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="pildora">Qué ofrecemos</p>
          <h2 className="mt-6 font-display text-4xl leading-[1.08] font-medium tracking-[-0.03em] text-navy md:text-5xl">
            Servicios integrales, adaptados a{' '}
            <span className="texto-degradado font-semibold">sus necesidades</span>.
          </h2>
        </div>

        <div className="rejilla-flotante mt-16 grid gap-6 md:grid-cols-3">
          {servicios.map((s) => {
            const Icon = s.icon
            return (
              /* La tarjeta entera enlaza a la ficha del servicio, igual que
                 los ramos: mismo gesto en toda la portada. */
              <Link
                key={s.slug}
                href={`/servicios/${s.slug}`}
                className="reveal tarjeta group flex flex-col p-8"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 to-blue-500 text-white shadow-[0_8px_20px_-8px_rgb(30_84_128/0.6)]">
                  <Icon size={21} strokeWidth={1.8} aria-hidden />
                </span>
                <h3 className="mt-7 font-display text-xl leading-snug font-semibold tracking-[-0.015em] text-navy">
                  {s.titulo}
                </h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-slate">{s.resumen}</p>
                <span className="mt-auto flex items-center gap-1.5 pt-6 font-body text-sm font-semibold text-blue-700">
                  Ver detalle
                  <ArrowRight
                    size={14}
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </Link>
            )
          })}
        </div>

        <div className="reveal mt-20 grid gap-10 rounded-[2.5rem] border border-line bg-white p-10 shadow-suave md:grid-cols-3 md:p-12">
          {rol.map((r) => {
            const Icon = r.icon
            return (
              <div key={r.titulo}>
                <Icon size={22} strokeWidth={1.8} aria-hidden className="text-blue-500" />
                <h3 className="mt-5 font-display text-lg font-semibold tracking-[-0.01em] text-navy">
                  {r.titulo}
                </h3>
                <p className="mt-2.5 font-body text-sm leading-relaxed text-slate">{r.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
