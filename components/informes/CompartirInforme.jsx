'use client'

import { useState } from 'react'
import { Check, Copy, Download, Instagram, Linkedin, Share2 } from 'lucide-react'
import { SITIO_URL } from '@/lib/sitio'

/**
 * Compartir un informe en LinkedIn, X e Instagram.
 *
 * LA PORTADA NO VIAJA EN EL BOTÓN. Ninguna de las dos primeras redes acepta
 * una imagen por parámetro —sería un agujero evidente: cualquiera podría
 * adjuntar lo que quisiera a un enlace ajeno—. Lo que hacen es ir a buscar el
 * `og:image` de la página compartida, que se declara en `generateMetadata` de
 * la ficha. Por eso el botón solo manda la URL: la portada la pone la página.
 *
 * INSTAGRAM NO SE PUEDE, y conviene decirlo en vez de fingirlo. No existe
 * ninguna URL que abra Instagram con una publicación preparada: su API solo
 * permite publicar desde servidor, con cuenta de empresa y un flujo de
 * autorización, y desde el navegador no hay nada. Un botón que «comparta a
 * Instagram» en una web o no hace nada o lleva al perfil y ya.
 *
 * Así que aquí hace lo único útil de verdad: descarga la portada y copia el
 * texto con el enlace, para publicarlo desde el teléfono en dos toques. Es
 * menos cómodo que las otras dos y el botón lo advierte; preferible a un botón
 * que promete y no cumple.
 */
export default function CompartirInforme({ informe }) {
  const [copiado, setCopiado] = useState('')

  const url = `${SITIO_URL}/mercado-asegurador/${informe.slug}`
  const portada = informe.paginas[0]
  const titulo = `La Semanal · Semana ${informe.semana} — ${informe.titulo}`

  /* El pie para Instagram lleva la URL escrita entera porque allí los enlaces
     del texto no son pulsables: quien lo lea tiene que poder teclearlo. */
  const pieInstagram = `${titulo}\n\nInforme completo: ${url}\n\n#seguros #ajustedesiniestros #RepúblicaDominicana`

  const copiar = async (texto, cual) => {
    try {
      await navigator.clipboard.writeText(texto)
      setCopiado(cual)
      setTimeout(() => setCopiado(''), 2500)
    } catch {
      setCopiado('')
    }
  }

  const abrir = (destino) => {
    window.open(destino, '_blank', 'noopener,noreferrer,width=640,height=640')
  }

  const paraInstagram = async () => {
    await copiar(pieInstagram, 'instagram')
    /* Descarga de la portada. `download` solo obedece en el mismo origen, que
       es el caso: la imagen se sirve desde este dominio. */
    const a = document.createElement('a')
    a.href = portada
    a.download = `assanch-semana-${informe.semana}.png`
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  return (
    <section
      aria-label="Compartir este informe"
      className="mt-10 rounded-[1.5rem] border border-line bg-white p-6 shadow-suave"
    >
      <h2 className="flex items-center gap-2 font-body text-[11px] font-semibold tracking-[0.08em] text-goldink uppercase">
        <Share2 size={13} aria-hidden />
        Compartir este informe
      </h2>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => abrir(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`)}
          className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-navy px-5 font-body text-sm font-semibold text-white transition-colors hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          <Linkedin size={16} aria-hidden />
          LinkedIn
        </button>

        <button
          type="button"
          onClick={() =>
            abrir(
              `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(titulo)}`
            )
          }
          className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-navy px-5 font-body text-sm font-semibold text-white transition-colors hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          <span aria-hidden className="font-display text-[15px] leading-none font-bold">𝕏</span>
          X
        </button>

        <button
          type="button"
          onClick={paraInstagram}
          className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-line bg-canvas px-5 font-body text-sm font-semibold text-navy transition-colors hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          {copiado === 'instagram' ? <Check size={16} aria-hidden className="text-blue-700" /> : <Instagram size={16} aria-hidden />}
          {copiado === 'instagram' ? 'Portada y texto listos' : 'Instagram'}
          <Download size={13} aria-hidden className="text-slate" />
        </button>

        <button
          type="button"
          onClick={() => copiar(url, 'enlace')}
          className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-line bg-canvas px-5 font-body text-sm font-semibold text-navy transition-colors hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          {copiado === 'enlace' ? <Check size={16} aria-hidden className="text-blue-700" /> : <Copy size={16} aria-hidden />}
          {copiado === 'enlace' ? 'Enlace copiado' : 'Copiar enlace'}
        </button>
      </div>

      {/* El aviso es permanente y no un mensaje tras pulsar: quien ve el botón
          de Instagram debe saber ANTES que ahí el proceso es distinto. */}
      <p className="mt-4 font-body text-[13px] leading-relaxed text-slate">
        LinkedIn y X abren la publicación con el enlace y la portada ya puestos.
        Instagram no permite publicar desde una web, así que ese botón descarga
        la portada y copia el texto para que lo suba desde el teléfono.
      </p>

      {/* Región viva: sin esto, quien usa lector de pantalla pulsa «copiar» y
          no recibe ninguna confirmación de que algo ocurrió. */}
      <p aria-live="polite" className="sr-only">
        {copiado === 'enlace' ? 'Enlace copiado al portapapeles.' : ''}
        {copiado === 'instagram' ? 'Portada descargada y texto copiado al portapapeles.' : ''}
      </p>
    </section>
  )
}
