import { Mail } from 'lucide-react'

/**
 * Equipo.
 *
 * Datos publicados por la propia firma. Los correos aparecen ya en su web
 * actual, asi que se mantienen; para reducir exposicion a spam lo indicado
 * seria sustituirlos por un formulario por persona.
 *
 * FOTOGRAFIAS: cada ficha reserva un circulo de 80 px. Para colocarlas, dejar
 * los archivos en `public/equipo/` (cuadrados, minimo 320x320 px, fondo neutro)
 * y rellenar el campo `foto`. Mientras este a `null` se muestra el monograma,
 * que identifica sin fingir un retrato.
 */
const equipo = [
  { nombre: 'José F. Sánchez', cargo: 'Socio director · Líder de riesgos generales', correo: 'josesanchez@assanch.com', socio: true, foto: null },
  { nombre: 'Carlos Sánchez', cargo: 'Socio director · Líder de automóvil', correo: 'carlossanchez@assanch.com', socio: true, foto: null },
  { nombre: 'José R. Sánchez', cargo: 'Socio · Ajustador de riesgos generales', correo: 'josersanchez@assanch.com', socio: true, foto: null },
  { nombre: 'Julio Medina', cargo: 'Ajustador de riesgos generales y automóvil · Zona Norte', correo: 'juliomedina@assanch.com', foto: null },
  { nombre: 'Patricio Martínez', cargo: 'Ajustador de automóvil · Distrito Nacional, Este y Sur', correo: 'patriciomartinez@assanch.com', foto: null },
  { nombre: 'Betzaira Amparo', cargo: 'Oficial de seguimiento de automóvil', correo: 'betzairaamparo@assanch.com', foto: null },
  { nombre: 'César Sánchez', cargo: 'Marketing y desarrollo de negocios', correo: 'cesarsanchez@assanch.com', foto: null },
  { nombre: 'Katherine Medina', cargo: 'Asistente administrativa', correo: 'katherinemedina@assanch.com', foto: null },
]

function iniciales(nombre) {
  /* Se conserva la inicial intermedia: sin ella «José F. Sánchez» y
     «José R. Sánchez» compartirian monograma. */
  return nombre
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 3)
}

export default function Equipo() {
  /* Fondo blanco: la seccion anterior (Alcance) ya usa canvas, y dos bandas
     iguales seguidas borran la separacion entre secciones. */
  return (
    <section id="equipo" className="scroll-mt-28 py-24 md:py-32" data-reveal-group>
      <div className="section">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="pildora">Equipo</p>
          <h2 className="mt-6 font-display text-4xl leading-[1.08] font-medium tracking-[-0.03em] text-navy md:text-5xl">
            Quien firma el informe{' '}
            <span className="texto-degradado font-semibold">tiene nombre</span>.
          </h2>
          <p className="mt-6 font-body text-lg leading-relaxed text-slate">
            Cada expediente lo lleva un ajustador identificable, con línea directa. Sin
            intermediarios entre usted y quien evalúa el siniestro.
          </p>
        </div>

        <ul className="rejilla-flotante mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {equipo.map((p) => (
            <li key={p.correo}>
              {/* text-left explicito: los parrafos del sitio van justificados y
                  en una ficha estrecha el justificado abre huecos enormes. */}
              <article className="tarjeta group h-full p-6 text-left [&_p]:text-left">
                <span
                  className={`flex h-20 w-20 items-center justify-center overflow-hidden rounded-full transition-colors duration-500 ${
                    p.socio
                      ? 'bg-gradient-to-br from-blue-700 to-blue-500 text-white ring-2 ring-gold/40 ring-offset-2 ring-offset-white'
                      : 'bg-blue-50 text-blue-700 ring-1 ring-line ring-offset-2 ring-offset-white group-hover:bg-blue-100'
                  }`}
                >
                  {p.foto ? (
                    <img
                      src={p.foto}
                      alt={p.nombre}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span aria-hidden className="font-display text-lg font-semibold tracking-wide">
                      {iniciales(p.nombre)}
                    </span>
                  )}
                </span>

                <h3 className="mt-5 font-display text-base leading-snug font-semibold tracking-[-0.01em] text-navy">
                  {p.nombre}
                </h3>
                <p className="mt-1.5 font-body text-[13px] leading-relaxed text-slate">{p.cargo}</p>

                <a
                  href={`mailto:${p.correo}`}
                  className="mt-4 inline-flex min-h-9 items-center gap-2 font-body text-[13px] break-all text-blue-700 transition-colors hover:text-navy"
                >
                  <Mail size={14} aria-hidden className="shrink-0" />
                  {p.correo}
                </a>
              </article>
            </li>
          ))}
        </ul>

        <p className="reveal mt-10 text-center font-body text-sm text-slate">
          Central telefónica{' '}
          <a
            href="tel:+18097929384"
            className="inline-flex min-h-11 items-center font-semibold text-blue-700 underline underline-offset-4"
          >
            809-792-9384
          </a>
        </p>
      </div>
    </section>
  )
}
