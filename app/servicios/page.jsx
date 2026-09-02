import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MigaDePan from '@/components/plantillas/MigaDePan'
import HeroInterno from '@/components/plantillas/HeroInterno'
import RejillaTarjetas from '@/components/plantillas/RejillaTarjetas'
import CtaFinal from '@/components/plantillas/CtaFinal'
import Revelar from '@/components/Revelar'
import { servicios } from '@/lib/contenido/servicios'

export const metadata = {
  title: 'Servicios — ASSANCH',
  description:
    'Evaluación de siniestros y ajuste de pérdidas, consultoría de seguros y riesgos, y formación. Firma dominicana de ajustadores con cobertura nacional.',
  alternates: { canonical: '/servicios' },
}

export default function Servicios() {
  return (
    <>
      <Navbar />
      <Revelar />

      <main id="main" className="pt-20">
        <MigaDePan piezas={[{ label: 'Inicio', href: '/' }, { label: 'Servicios', href: '/servicios' }]} />

        <HeroInterno
          pildora="Servicios"
          titulo="Lo que hacemos por su cartera"
          resalte="su cartera"
          entradilla="Tres líneas de trabajo que se sostienen en lo mismo: criterio técnico independiente y un expediente que resiste revisión."
        />

        <section className="pb-8" data-reveal-group>
          <div className="section">
            <RejillaTarjetas
              items={servicios.map((s) => ({
                icon: s.icon,
                titulo: s.titulo,
                nota: s.nota,
                desc: s.resumen,
                href: `/servicios/${s.slug}`,
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
