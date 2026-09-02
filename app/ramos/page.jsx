import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MigaDePan from '@/components/plantillas/MigaDePan'
import HeroInterno from '@/components/plantillas/HeroInterno'
import RejillaTarjetas from '@/components/plantillas/RejillaTarjetas'
import CtaFinal from '@/components/plantillas/CtaFinal'
import Revelar from '@/components/Revelar'
import { ramos } from '@/lib/contenido/ramos'

export const metadata = {
  title: 'Ramos que ajustamos — ASSANCH',
  description:
    'Los diez ramos que ajusta ASSANCH: incendio, todo riesgo, automóvil, transporte, responsabilidad civil, interrupción de negocios, fianzas, maquinaria y equipos electrónicos.',
  alternates: { canonical: '/ramos' },
}

export default function Ramos() {
  return (
    <>
      <Navbar />
      <Revelar />

      <main id="main" className="pt-20">
        <MigaDePan piezas={[{ label: 'Inicio', href: '/' }, { label: 'Ramos', href: '/ramos' }]} />

        <HeroInterno
          pildora="Ramos"
          titulo="Los diez ramos que ajustamos"
          resalte="diez ramos"
          entradilla="Cada ficha explica qué ampara el ramo, qué evalúa el ajustador y qué documentos conviene tener listos antes de la inspección."
        />

        <section className="pb-8" data-reveal-group>
          <div className="section">
            <RejillaTarjetas
              items={ramos.map((r) => ({
                icon: r.icon,
                titulo: r.nombre,
                nota: r.nota,
                href: `/ramos/${r.slug}`,
              }))}
            />
          </div>
        </section>

        <CtaFinal />
      </main>

      <Footer />
    </>
  )
}
