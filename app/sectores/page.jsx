import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MigaDePan from '@/components/plantillas/MigaDePan'
import HeroInterno from '@/components/plantillas/HeroInterno'
import RejillaTarjetas from '@/components/plantillas/RejillaTarjetas'
import CtaFinal from '@/components/plantillas/CtaFinal'
import Revelar from '@/components/Revelar'
import { sectores } from '@/lib/contenido/sectores'

export const metadata = {
  title: 'Sectores — ASSANCH',
  description:
    'Hotelería, industria, construcción, transporte, marítimo, retail, energía y aseguradoras: los sectores cuyos siniestros ajusta ASSANCH en República Dominicana.',
  alternates: { canonical: '/sectores' },
}

export default function Sectores() {
  return (
    <>
      <Navbar />
      <Revelar />

      <main id="main" className="pt-20">
        <MigaDePan piezas={[{ label: 'Inicio', href: '/' }, { label: 'Sectores', href: '/sectores' }]} />

        <HeroInterno
          pildora="Sectores"
          titulo="Cada sector se siniestra distinto"
          resalte="se siniestra distinto"
          entradilla="Un incendio en una planta y uno en un hotel comparten el ramo, no la investigación. Aquí está lo que cambia en cada caso."
        />

        <section className="pb-8" data-reveal-group>
          <div className="section">
            <RejillaTarjetas
              items={sectores.map((s) => ({
                icon: s.icon,
                titulo: s.nombre,
                desc: s.resumen,
                href: `/sectores/${s.slug}`,
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
