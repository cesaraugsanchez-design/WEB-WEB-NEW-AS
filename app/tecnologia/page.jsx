import { Camera, FileCheck2, FolderTree, MapPin, MessageSquareText, Ruler } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MigaDePan from '@/components/plantillas/MigaDePan'
import HeroInterno from '@/components/plantillas/HeroInterno'
import RejillaTarjetas from '@/components/plantillas/RejillaTarjetas'
import CtaFinal from '@/components/plantillas/CtaFinal'
import Revelar from '@/components/Revelar'

export const metadata = {
  title: 'Metodología y tecnología — ASSANCH',
  description:
    'Cómo trabaja ASSANCH un expediente: evidencia fotográfica situada, expediente digital, informes normalizados y seguimiento del caso.',
  alternates: { canonical: '/tecnologia' },
}

/**
 * TODO(cliente): esta página describe el MÉTODO de trabajo, no herramientas de
 * marca. Es deliberado: anunciar una plataforma o un software que la firma no
 * usa se descubre en la primera reunión técnica. Si ASSANCH usa una herramienta
 * concreta —un gestor de expedientes, una app de inspección, un sistema de
 * geolocalización—, díganos cuál y se nombra aquí.
 */
const metodo = [
  {
    icon: Camera,
    titulo: 'Evidencia fotográfica situada',
    desc: 'Cada imagen del levantamiento se registra con su ubicación y su momento. Una foto sin contexto no prueba nada; con contexto sostiene el expediente frente a una revisión posterior.',
  },
  {
    icon: Ruler,
    titulo: 'Cuantificación con memoria de cálculo',
    desc: 'El monto de la pérdida se acompaña de cómo se llegó a él. Una cifra sin desglose no se puede discutir, y por eso mismo no se puede defender.',
  },
  {
    icon: FolderTree,
    titulo: 'Expediente digital ordenado',
    desc: 'Póliza, acta, fotografías, facturas e informes viven en una estructura única por caso. Cuando la aseguradora pide un documento dos años después, está donde debe estar.',
  },
  {
    icon: FileCheck2,
    titulo: 'Informes normalizados',
    desc: 'Preliminar y final siguen el mismo formato en todos los ramos. El ejecutivo que recibe veinte informes al mes encuentra cada dato en el mismo sitio.',
  },
  {
    icon: MapPin,
    titulo: 'Movilización por zona',
    desc: 'La provincia del riesgo determina qué oficina toma el caso: Norte, Distrito Nacional y Sur, u Oriental. El aviso no espera a que alguien decida quién va.',
  },
  {
    icon: MessageSquareText,
    titulo: 'Un interlocutor por caso',
    desc: 'Cada expediente tiene un ajustador con nombre y correo directo. No hay que reconstruir el caso en cada llamada.',
  },
]

export default function Tecnologia() {
  return (
    <>
      <Navbar />
      <Revelar />

      <main id="main" className="pt-20">
        <MigaDePan
          piezas={[{ label: 'Inicio', href: '/' }, { label: 'Metodología', href: '/tecnologia' }]}
        />

        <HeroInterno
          pildora="Metodología"
          titulo="Un expediente que resiste revisión"
          resalte="resiste revisión"
          entradilla="Lo que distingue un ajuste no es la rapidez del informe, sino que dos años después siga sosteniéndose. Así se trabaja cada caso."
        />

        <section className="pb-8" data-reveal-group>
          <div className="section">
            <RejillaTarjetas items={metodo} />
          </div>
        </section>

        <CtaFinal />
      </main>

      <Footer />
    </>
  )
}
