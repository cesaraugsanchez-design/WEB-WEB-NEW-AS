import { Instrument_Sans, Inter, Montserrat } from 'next/font/google'
import './globals.css'
import { SITIO_URL } from '@/lib/sitio'
import { datosEstructurados, jsonLdSeguro } from '@/lib/datosEstructurados'

/* Montserrat Bold es la tipografía que el manual de marca fija para el
   logotipo. Se carga sólo con los pesos del lockup, no para texto corrido. */
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
})

/* Instrument Sans para titulares: neogrotesca con detalle propio (la 'a' y la
   'g'), elegante en pesos ligeros a tamaño grande. Inter para el cuerpo.
   Deliberadamente no se usa una geométrica tipo Poppins/Jakarta: son la
   respuesta por defecto de cualquier plantilla de agencia. */
const instrument = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-instrument',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata = {
  /* Base absoluta: sin ella Next no puede resolver las URL de Open Graph y las
     previsualizaciones al compartir el enlace salen sin imagen. */
  metadataBase: new URL(SITIO_URL),
  /* OJO: esta canónica la HEREDA cualquier página que no declare la suya. Es
     la de la portada —que es un componente de cliente y no puede exportar
     metadatos propios—, así que una página nueva sin `alternates.canonical`
     queda marcada en silencio como duplicado de «/» y no se indexa. Ya pasó
     con /someter-reclamo. Al crear una ruta, declarar siempre su canónica. */
  alternates: { canonical: '/' },
  /* La frase va EXACTA y al principio: «ajustadores de seguros» es lo que la
     gente teclea, y el título anterior —«Ajustadores y Consultores de
     Seguros»— la partía con dos palabras en medio, de modo que en toda la
     portada no aparecía ni una vez. La marca pasa al final sin perder nada:
     Google ya muestra el nombre del sitio aparte, sacado del JSON-LD. */
  title: 'Ajustadores de Seguros en República Dominicana | ASSANCH',
  description:
    'Ajustadores de seguros en República Dominicana. Peritaje, levantamiento y ajuste de siniestros en los diez ramos, con respuesta inmediata para aseguradoras, corredores y empresas.',
  keywords: [
    'ajustadores de seguros',
    'ajuste de pérdidas',
    'peritaje de siniestros',
    'República Dominicana',
    'consultoría de seguros',
  ],
  openGraph: {
    title: 'ASSANCH — Ajustadores y Consultores de Seguros',
    description:
      'Respuesta rápida, soluciones precisas. Ajuste de siniestros en todos los ramos, con cobertura en todo el territorio nacional.',
    locale: 'es_DO',
    type: 'website',
  },
}

export const viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="es-DO"
      className={`${instrument.variable} ${inter.variable} ${montserrat.variable}`}
    >
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:m-4 focus:rounded-full focus:bg-navy focus:px-5 focus:py-3 focus:font-semibold focus:text-white"
        >
          Saltar al contenido principal
        </a>
        {/* En el layout raíz y no en la portada: así la firma se identifica
            igual en todas las páginas, y quien llega a Google por un informe o
            por la ficha de un ramo recibe el mismo dato que quien entra por
            la portada. Es una etiqueta <script> nativa a propósito —no el
            componente de Next—: esto son datos, no código que ejecutar. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdSeguro(datosEstructurados) }}
        />
        {children}
      </body>
    </html>
  )
}
