import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Equipo from '@/components/Equipo'
import MigaDePan from '@/components/plantillas/MigaDePan'
import HeroInterno from '@/components/plantillas/HeroInterno'
import CtaFinal from '@/components/plantillas/CtaFinal'
import Revelar from '@/components/Revelar'

export const metadata = {
  title: 'Equipo — ASSANCH',
  description:
    'Los ajustadores y consultores que atienden cada expediente en ASSANCH, con contacto directo por área.',
  alternates: { canonical: '/nosotros/equipo' },
}

export default function PaginaEquipo() {
  return (
    <>
      <Navbar />
      <Revelar />

      <main id="main" className="pt-20">
        <MigaDePan
          piezas={[
            { label: 'Inicio', href: '/' },
            { label: 'Nosotros', href: '/nosotros' },
            { label: 'Equipo', href: '/nosotros/equipo' },
          ]}
        />

        <HeroInterno
          pildora="Equipo"
          titulo="Quién atiende su expediente"
          resalte="su expediente"
          entradilla="Cada caso lo lleva una persona con nombre y correo directo. Sabrá siempre con quién está hablando."
        />

        <Equipo />
        <CtaFinal titulo="¿Necesita hablar con un ajustador?" />
      </main>

      <Footer />
    </>
  )
}
