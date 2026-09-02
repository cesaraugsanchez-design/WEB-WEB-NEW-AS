import Link from 'next/link'
import { ArrowRight, Home, Phone } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Página no encontrada — ASSANCH',
  robots: { index: false, follow: true },
}

/* Next sirve por defecto un 404 en inglés y sin marca. En un sitio corporativo
   en español eso rompe la continuidad justo en el momento en que el visitante
   ya está desorientado. Esta versión conserva la navegación y ofrece salidas:
   volver al inicio, someter un reclamo, o llamar. */
export default function NoEncontrada() {
  return (
    <>
      <Navbar />

      <main id="main" className="flex min-h-[70vh] items-center py-32">
        <div className="section text-center">
          <p className="pildora">Error 404</p>

          <h1 className="mx-auto mt-6 max-w-2xl font-display text-[clamp(2rem,6vw,3.4rem)] leading-[1.08] font-medium tracking-[-0.03em] text-navy">
            Esta página no existe
          </h1>

          <p className="mx-auto mt-5 max-w-lg text-center font-body text-base leading-relaxed text-slate">
            Puede que el enlace esté mal escrito o que la página haya cambiado de
            sitio. Desde aquí llega a lo que buscaba.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/" className="btn">
              <Home size={16} aria-hidden />
              Volver al inicio
            </Link>
            <Link href="/someter-reclamo" className="btn-claro">
              Someter un reclamo <ArrowRight size={15} aria-hidden />
            </Link>
          </div>

          <p className="mt-8 font-body text-sm text-slate">
            <Phone size={14} aria-hidden className="mr-1.5 inline align-[-2px] text-blue-500" />
            ¿Es urgente? Llame al{' '}
            <a href="tel:+18097929384" className="font-semibold text-blue-700 underline underline-offset-4">
              809-792-9384
            </a>
            , atendemos avisos 24/7.
          </p>
        </div>
      </main>

      <Footer />
    </>
  )
}
