import { Suspense } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MigaDePan from '@/components/plantillas/MigaDePan'
import HeroInterno from '@/components/plantillas/HeroInterno'
import CtaFinal from '@/components/plantillas/CtaFinal'
import ListaEstatica from '@/components/recursos/ListaEstatica'
import ListaRecursos from '@/components/recursos/ListaRecursos'

export const metadata = {
  title: 'Recursos — ASSANCH',
  description:
    'Guías prácticas sobre siniestros: qué hacer en las primeras 24 horas, qué documentos pide un ajustador, infraseguro y evidencia.',
  alternates: { canonical: '/recursos' },
}

export default function Recursos() {
  return (
    <>
      <Navbar />

      <main id="main" className="pt-20">
        <MigaDePan piezas={[{ label: 'Inicio', href: '/' }, { label: 'Recursos', href: '/recursos' }]} />

        <HeroInterno
          pildora="Recursos"
          titulo="Lo que conviene saber antes del siniestro"
          resalte="antes del siniestro"
          entradilla="Guías escritas desde el lado del ajustador: lo que decide un expediente y lo que lo complica."
        />

        {/* El fallback NO es un esqueleto vacío: es la lista completa
            renderizada en servidor. Así las tarjetas están en el HTML aunque no
            se ejecute JavaScript, y al hidratar se sustituyen por la versión
            con filtros. */}
        <Suspense fallback={<ListaEstatica />}>
          <ListaRecursos />
        </Suspense>

        <CtaFinal />
      </main>

      <Footer />
    </>
  )
}
