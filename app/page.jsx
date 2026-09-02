'use client'

import { useReveal } from '@/lib/useReveal'
import Cursor from '@/components/Cursor'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
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
        {/* «Quienes somos» va justo tras el hero: quien entra por primera vez
            necesita saber que firma es esta antes de que le enumeren diez ramos.
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
