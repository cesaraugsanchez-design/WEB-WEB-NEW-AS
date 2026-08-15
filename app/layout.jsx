import { Instrument_Sans, Inter, Montserrat } from 'next/font/google'
import './globals.css'

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
  title: 'ASSANCH — Ajustadores y Consultores de Seguros | República Dominicana',
  description:
    'Firma dominicana especializada en peritaje, levantamiento y ajuste de siniestros. Respuesta inmediata y cobertura nacional para aseguradoras, corredores y empresas.',
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
        {children}
      </body>
    </html>
  )
}
