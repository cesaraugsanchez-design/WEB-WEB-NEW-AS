import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Aliados from '@/components/Aliados'
import MigaDePan from '@/components/plantillas/MigaDePan'
import HeroInterno from '@/components/plantillas/HeroInterno'
import CtaFinal from '@/components/plantillas/CtaFinal'
import Revelar from '@/components/Revelar'

export const metadata = {
  title: 'Aliados — ASSANCH',
  description:
    'Las aseguradoras y corredores que trabajan con ASSANCH en el mercado dominicano.',
  alternates: { canonical: '/nosotros/aliados' },
}

export default function PaginaAliados() {
  return (
    <>
      <Navbar />
      <Revelar />

      <main id="main" className="pt-20">
        <MigaDePan
          piezas={[
            { label: 'Inicio', href: '/' },
            { label: 'Nosotros', href: '/nosotros' },
            { label: 'Aliados', href: '/nosotros/aliados' },
          ]}
        />

        <HeroInterno
          pildora="Aliados"
          titulo="Con quiénes trabajamos"
          resalte="trabajamos"
          entradilla="Más de diez aseguradoras confían sus siniestros a la firma. La relación se sostiene en lo mismo de siempre: expedientes que resisten revisión."
        />

        <Aliados />
        <CtaFinal />
      </main>

      <Footer />
    </>
  )
}
