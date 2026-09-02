import { Suspense } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MigaDePan from '@/components/plantillas/MigaDePan'
import HeroInterno from '@/components/plantillas/HeroInterno'
import CtaFinal from '@/components/plantillas/CtaFinal'
import Buscador from '@/components/experiencia/Buscador'
import { indice } from '@/lib/contenido/indice'

export const metadata = {
  title: 'Experiencia — ASSANCH',
  description:
    'Busque por tipo de siniestro, ramo o sector y vea si es un caso que ASSANCH atiende.',
  alternates: { canonical: '/experiencia' },
}

export default function Experiencia() {
  return (
    <>
      <Navbar />

      <main id="main" className="pt-20">
        <MigaDePan
          piezas={[
            { label: 'Inicio', href: '/' },
            { label: 'Experiencia', href: '/experiencia' },
          ]}
        />

        <HeroInterno
          pildora="Experiencia"
          titulo="¿Atendemos su caso?"
          resalte="su caso"
          entradilla={`Escriba el tipo de siniestro, el ramo o el sector. Busca en ${indice.length} fichas de servicios, ramos y sectores.`}
        />

        {/* `useSearchParams` obliga a un límite de Suspense: sin él, Next deja
            toda la ruta fuera del prerenderizado estático. */}
        <Suspense fallback={<div className="section h-16 animate-pulse rounded-full bg-line/60" />}>
          <Buscador />
        </Suspense>

        <CtaFinal />
      </main>

      <Footer />
    </>
  )
}
