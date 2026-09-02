import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'

/* Cierre de las páginas interiores. Mismo degradado que la tarjeta de contacto
   de la portada, para que el cierre se lea como el mismo sitio y no como una
   plantilla pegada. */
export default function CtaFinal({
  titulo = '¿Tiene un siniestro que atender?',
  texto = 'Un ajustador puede estar en sitio hoy mismo. Atendemos avisos las 24 horas, en todo el territorio nacional.',
}) {
  return (
    <section className="py-20 md:py-28">
      <div className="section">
        <div className="banda-oscura relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#22323F] via-[#1A2833] to-[#16212A] px-8 py-14 text-center shadow-[inset_0_1px_0_rgb(255_255_255/0.16)] md:px-14">
          <h2 className="mx-auto max-w-xl font-display text-3xl leading-[1.12] font-medium tracking-[-0.02em] text-white md:text-4xl">
            {titulo}
          </h2>

          <p className="mx-auto mt-5 max-w-lg text-center font-body leading-relaxed text-mist">
            {texto}
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link href="/someter-reclamo" className="btn" data-iman>
              Asignar un reclamo <ArrowRight size={16} aria-hidden />
            </Link>
            <a href="tel:+18097929384" className="btn-claro">
              <Phone size={15} aria-hidden className="text-blue-500" />
              809-792-9384
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
