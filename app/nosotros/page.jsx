import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Nosotros from '@/components/Nosotros'
import MigaDePan from '@/components/plantillas/MigaDePan'
import HeroInterno from '@/components/plantillas/HeroInterno'
import CtaFinal from '@/components/plantillas/CtaFinal'
import Revelar from '@/components/Revelar'

export const metadata = {
  title: 'Quiénes somos — ASSANCH',
  description:
    'Firma dominicana de ajustadores y consultores de seguros. Peritaje, levantamiento y ajuste de siniestros con criterio técnico independiente.',
  alternates: { canonical: '/nosotros' },
}

/* Se reutiliza el MISMO componente que la portada, no una copia. Duplicar el
   texto institucional en dos sitios garantiza que uno de los dos envejezca. */
export default function PaginaNosotros() {
  return (
    <>
      <Navbar />
      <Revelar />

      <main id="main" className="pt-20">
        <MigaDePan piezas={[{ label: 'Inicio', href: '/' }, { label: 'Nosotros', href: '/nosotros' }]} />

        <HeroInterno
          pildora="La firma"
          titulo="Un criterio técnico independiente"
          resalte="independiente"
          entradilla="No somos intermediarios entre usted y quien evalúa el siniestro: somos quien lo evalúa, y respondemos por el criterio que sostiene el expediente."
        />

        <Nosotros />
        <CtaFinal />
      </main>

      <Footer />
    </>
  )
}
