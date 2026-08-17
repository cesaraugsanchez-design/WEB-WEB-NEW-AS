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
import MarcaJuguete from '@/components/MarcaJuguete'
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
        <Ramos />
        <Servicios />
        <Nosotros />
        <Alcance />
        <Equipo />
        <EvidenceField />
        <Aliados />
        <MarcaJuguete />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
