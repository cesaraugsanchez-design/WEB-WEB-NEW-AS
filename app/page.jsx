'use client'

import { useReveal } from '@/lib/useReveal'
import Cursor from '@/components/Cursor'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import VideoRelanzamiento from '@/components/VideoRelanzamiento'
import Ramos from '@/components/Ramos'
import Servicios from '@/components/Servicios'
import Nosotros from '@/components/Nosotros'
import Alcance from '@/components/Alcance'
import Equipo from '@/components/Equipo'
import EvidenceField from '@/components/EvidenceField'
import Aliados from '@/components/Aliados'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  useReveal()

  return (
    <>
      <Cursor />
      <Navbar />
      <main id="main">
        <Hero />
        <VideoRelanzamiento />
        {/* «Quienes somos» abre el cuerpo de la portada: quien entra por primera
            vez necesita saber que firma es esta antes de que le enumeren diez
            ramos. El video del relanzamiento se cuela delante porque no es
            lectura —se ve o se salta de un vistazo— y no retrasa esa respuesta.
            El orden de las anclas del menu no depende de esto. */}
        <Nosotros />
        <Ramos />
        <Servicios />
        <Alcance />
        <Equipo />
        <EvidenceField />
        <Aliados />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
