import Link from 'next/link'
import { Building, Camera, Cpu, Globe2, Laptop, MapPin, Plane, ShieldHalf, Truck, Wifi } from 'lucide-react'

const zonas = ['Zona Oriental / Este', 'Distrito Nacional / Sur', 'Zona Norte']

const capacidades = [
  { icon: Truck, texto: 'Flota dedicada de 4 unidades' },
  { icon: Plane, texto: 'Drone DJI Mavic 2 Pro para tomas aéreas' },
  { icon: Camera, texto: 'Herramientas de medición y evidencia fotográfica' },
  { icon: ShieldHalf, texto: 'Equipos de protección para todo tipo de siniestro' },
  { icon: Laptop, texto: 'Laptops de última generación' },
  { icon: Wifi, texto: 'Conexión de alta velocidad y hotspot portátil' },
  { icon: Building, texto: 'Oficinas en Santo Domingo, SD Este y Santiago' },
]

export default function Alcance() {
  return (
    <section id="alcance" className="scroll-mt-28 bg-canvas py-24 md:py-32" data-reveal-group>
      <div className="section">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="pildora">Alcance operativo</p>
          <h2 className="mt-6 font-display text-4xl leading-[1.08] font-medium tracking-[-0.03em] text-navy md:text-5xl">
            Equipo técnico y{' '}
            <span className="texto-degradado font-semibold">cobertura nacional</span>.
          </h2>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-12">
          <div className="reveal tarjeta p-8 md:col-span-5">
            <h3 className="flex items-center gap-2.5 font-body text-[11px] font-semibold tracking-[0.12em] text-blue-700 uppercase">
              <MapPin size={15} aria-hidden /> Cobertura geográfica
            </h3>

            <ul className="mt-7 space-y-3">
              {zonas.map((z) => (
                <li
                  key={z}
                  className="flex items-center gap-3.5 rounded-2xl bg-blue-50 px-5 py-4 font-display font-semibold tracking-[-0.01em] text-navy"
                >
                  <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                  {z}
                </li>
              ))}
            </ul>

            <p className="mt-6 font-body text-sm leading-relaxed text-slate">
              Con capacidad de hacer presencia inmediata en cualquier punto del territorio,
              garantizamos una respuesta rápida y profesional.
            </p>

            <Link href="/cobertura" className="btn mt-7 w-full">
              <Globe2 size={16} aria-hidden />
              Ver mapa de cobertura
            </Link>
            <p className="mt-3 font-body text-[12px] text-slate-soft">
              Zonas, oficinas y tiempos de respuesta
            </p>
          </div>

          <div className="reveal tarjeta p-8 md:col-span-7">
            <h3 className="flex items-center gap-2.5 font-body text-[11px] font-semibold tracking-[0.12em] text-blue-700 uppercase">
              <Cpu size={15} aria-hidden /> Capacidades técnicas
            </h3>

            <ul className="mt-7 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {capacidades.map((c) => {
                const Icon = c.icon
                return (
                  <li key={c.texto} className="flex items-start gap-3.5">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                      <Icon size={16} strokeWidth={1.8} aria-hidden />
                    </span>
                    <span className="font-body text-sm leading-relaxed text-slate">{c.texto}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
