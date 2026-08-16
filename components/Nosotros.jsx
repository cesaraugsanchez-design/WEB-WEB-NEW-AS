import { Eye, Target } from 'lucide-react'
import Cifra from './Cifra'

const metricas = [
  ['3+', 'Oficinas en el territorio nacional'],
  ['98%', 'Casos concluidos con satisfacción'],
  ['5+', 'Ajustadores experimentados'],
  ['10+', 'Aseguradoras trabajan con nosotros'],
]

const valores = ['Ética profesional', 'Transparencia total', 'Precisión técnica', 'Rapidez de respuesta']

export default function Nosotros() {
  return (
    <section id="nosotros" className="relative scroll-mt-28 overflow-hidden py-24 md:py-32" data-reveal-group>
      <div
        aria-hidden
        className="orbe h-[44vw] w-[44vw] bg-blue-100/60"
        style={{ top: '18%', left: '-18%', '--orbe-tiro': '26px' }}
      />

      <div className="section relative">
        {/* Encabezado centrado, igual que el resto de secciones. Antes compartia
            fila con las tarjetas de vision y mision, y quedaba desalineado
            respecto a los demas titulos del sitio. */}
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="pildora">Quiénes somos</p>
          <h2 className="mt-6 font-display text-4xl leading-[1.08] font-medium tracking-[-0.03em] text-navy md:text-5xl">
            Peritaje, levantamiento y{' '}
            <span className="texto-degradado font-semibold">ajuste de siniestros</span>.
          </h2>
          <p className="mt-6 font-body text-lg leading-relaxed text-slate">
            ASSANCH es una firma especializada en ajuste y consultoría de seguros, dedicada
            al peritaje, levantamiento y ajuste de siniestros, con enfoque en eficiencia
            operativa, rapidez, optimización de costos y calidad técnica, operando en todo
            el país.
          </p>
        </div>

        <div>
          <div>
            <ul className="reveal mt-10 flex flex-wrap justify-center gap-2.5">
              {valores.map((v) => (
                <li
                  key={v}
                  className="rounded-full border border-line bg-white px-4 py-2 font-body text-[13px] font-medium text-slate shadow-suave"
                >
                  {v}
                </li>
              ))}
            </ul>
          </div>

          <div className="reveal mt-14 grid gap-5 md:grid-cols-2">
            {[
              {
                icon: Eye,
                rotulo: 'Visión',
                texto:
                  'Ser la firma de referencia en ajuste de pérdidas, evaluación y estudio del riesgo asegurado y no asegurado, en todas sus categorías y manifestaciones.',
              },
              {
                icon: Target,
                rotulo: 'Misión',
                texto:
                  'Brindar a nuestros aliados la respuesta más eficiente del mercado, mediante herramientas tecnológicas, métodos innovadores y valor agregado, manteniendo altos estándares de calidad al menor costo posible.',
              },
            ].map(({ icon: Icon, rotulo, texto }) => (
              <div key={rotulo} className="tarjeta p-8">
                <p className="flex items-center gap-2.5 font-body text-[11px] font-semibold tracking-[0.12em] text-blue-700 uppercase">
                  <Icon size={15} aria-hidden /> {rotulo}
                </p>
                <p className="mt-4 font-body leading-relaxed text-slate">{texto}</p>
              </div>
            ))}
          </div>
        </div>

        <dl className="reveal mt-20 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {metricas.map(([cifra, etiqueta]) => (
            <div key={etiqueta} className="tarjeta p-7 text-center">
              <dt className="sr-only">{etiqueta}</dt>
              <dd>
                <Cifra
                  valor={cifra}
                  className="texto-degradado block font-display text-5xl font-semibold tracking-[-0.04em] md:text-6xl"
                />
                <span className="mt-3 block font-body text-sm leading-snug text-balance text-slate">
                  {etiqueta}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
