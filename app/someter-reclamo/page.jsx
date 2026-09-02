import { Suspense } from 'react'
import { Clock, FileCheck2, MapPinned } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PrecargaReclamo from '@/components/reclamo/PrecargaReclamo'

export const metadata = {
  title: 'Someter un reclamo — ASSANCH',
  description:
    'Canal directo para que aseguradoras y corredores asignen un siniestro a ASSANCH. Un ajustador se moviliza tras recibir el reporte.',
  robots: { index: true, follow: true },
}

const garantias = [
  { icon: Clock, texto: 'Acuse de recibo con número de referencia al enviar.' },
  { icon: MapPinned, texto: 'Cobertura en las 31 provincias y el Distrito Nacional.' },
  { icon: FileCheck2, texto: 'Adjunte póliza, denuncia o fotos si ya los tiene.' },
]

export default function SometerReclamo() {
  return (
    <>
      <Navbar />

      <main id="main" className="pt-32 pb-24">
        <div className="section">
          <div className="mx-auto max-w-2xl text-center">
            <p className="pildora font-body text-[11px] font-semibold tracking-[0.14em] text-slate-soft uppercase">
              Canal para aseguradoras
            </p>
            <h1 className="mt-5 font-display text-[clamp(2rem,6vw,3.4rem)] leading-[1.08] font-medium tracking-[-0.03em] text-navy">
              Someter un reclamo
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-center font-body text-base leading-relaxed text-slate">
              Complete los datos mínimos para abrir el expediente y movilizar a un
              ajustador. Lo que falte se resuelve en la primera llamada.
            </p>
          </div>

          <ul className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
            {garantias.map(({ icon: Icono, texto }) => (
              <li key={texto} className="flex items-start gap-3 rounded-2xl border border-line bg-white/70 p-4">
                <Icono size={17} aria-hidden className="mt-0.5 shrink-0 text-blue-500" />
                <span className="font-body text-[13px] leading-relaxed text-slate">{texto}</span>
              </li>
            ))}
          </ul>

          <div className="mx-auto mt-12 max-w-3xl">
            {/* `useSearchParams` obliga a un límite de Suspense: sin él, Next
                deja toda la ruta fuera del prerenderizado estático. */}
            <Suspense fallback={<div className="tarjeta h-[40rem] animate-pulse" />}>
              <PrecargaReclamo />
            </Suspense>
          </div>

          <p className="mx-auto mt-8 max-w-3xl text-center font-body text-sm text-slate">
            ¿Prefiere reportarlo por teléfono? Llame al{' '}
            <a href="tel:+18097929384" className="font-semibold text-blue-700 underline underline-offset-4">
              809-792-9384
            </a>
            .
          </p>
        </div>
      </main>

      <Footer />
    </>
  )
}
