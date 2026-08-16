'use client'

import { useState } from 'react'
import { Pause, Play, Upload } from 'lucide-react'
import { LogoMarca } from './Marca'
import Cifra from './Cifra'

/**
 * Aliados.
 *
 * ⚠️ NO se incluyen logos de aseguradoras, y es deliberado.
 *
 * Colocar la marca de una aseguradora en esta pagina afirma publicamente una
 * relacion comercial concreta. Ni consta cuales son los aliados reales de la
 * firma —su web solo publica «10+ aseguradoras»— ni se dispone de autorizacion
 * de uso de marca. Descargar logotipos de internet y publicarlos aqui seria
 * atribuir alianzas no verificadas y usar marcas registradas sin licencia.
 *
 * PARA COMPLETARLO:
 *   1. Pedir a cada aseguradora su kit de marca (suelen publicarlo en prensa o
 *      «brand assets»), preferiblemente en SVG.
 *   2. Dejar los archivos en `public/aliados/`.
 *   3. Rellenar el array `aliados` con { nombre, archivo }.
 * El carrusel se adapta solo al numero de entradas.
 */
const aliados = [
  // { nombre: 'Nombre de la aseguradora', archivo: '/aliados/ejemplo.svg' },
]

const RANURAS_VACIAS = 8

export default function Aliados() {
  const [enPausa, setEnPausa] = useState(false)

  const hayLogos = aliados.length > 0
  const piezas = hayLogos
    ? aliados
    : Array.from({ length: RANURAS_VACIAS }, (_, i) => ({
        nombre: `Aliado ${String(i + 1).padStart(2, '0')}`,
        archivo: null,
      }))

  return (
    <section id="aliados" className="relative scroll-mt-28 overflow-hidden py-24 md:py-32" data-reveal-group>
      <div
        aria-hidden
        className="orbe h-[38vw] w-[38vw] bg-gold/15"
        style={{ bottom: '-6%', right: '-10%', '--orbe-tiro': '-24px' }}
      />

      <div className="section relative">
        <div className="reveal grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="pildora">Aliados</p>
            <h2 className="mt-6 font-display text-4xl leading-[1.08] font-medium tracking-[-0.03em] text-navy md:text-5xl">
              Su socio de confianza en{' '}
              <span className="texto-degradado font-semibold">cada proceso</span>.
            </h2>
            <p className="mt-6 font-body text-lg leading-relaxed text-slate">
              Acompañamiento confiable para aseguradoras y clientes. Trabajamos como
              extensión técnica de nuestros aliados, no como un proveedor más del
              expediente.
            </p>
          </div>

          <div className="md:col-span-5">
            <div className="tarjeta flex flex-col items-center gap-2 p-8 text-center">
              <Cifra
                valor="10+"
                className="texto-degradado font-display text-6xl font-semibold tracking-[-0.04em]"
              />
              <span className="font-body text-sm leading-snug text-slate">
                aseguradoras importantes trabajan con nosotros
              </span>
            </div>
          </div>
        </div>

        {/* Se detiene al pasar el cursor, al enfocar con teclado y con el boton;
            con movimiento reducido no se anima en absoluto. */}
        <div className="reveal grupo-desfile relative mt-14 overflow-hidden rounded-[2.5rem] border border-line bg-white py-10 shadow-suave">
          <div className="desfile flex w-max gap-4" data-pausa={enPausa}>
            {[...piezas, ...piezas].map((p, i) => (
              <div
                key={`${p.nombre}-${i}`}
                aria-hidden={i >= piezas.length}
                className="flex h-24 w-52 shrink-0 items-center justify-center rounded-2xl bg-canvas px-6"
              >
                {p.archivo ? (
                  <img
                    src={p.archivo}
                    alt={p.nombre}
                    loading="lazy"
                    className="max-h-10 w-auto max-w-full object-contain opacity-70 transition-opacity duration-300 hover:opacity-100"
                  />
                ) : (
                  <span className="flex flex-col items-center gap-2">
                    <LogoMarca mono size={22} className="text-slate-soft opacity-30" />
                    <span className="font-body text-[10px] font-medium tracking-[0.14em] text-slate-soft uppercase">
                      Logo pendiente
                    </span>
                  </span>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setEnPausa((v) => !v)}
            aria-pressed={enPausa}
            className="absolute right-4 bottom-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-white px-4 font-body text-[11px] font-semibold tracking-[0.1em] text-slate uppercase shadow-suave transition-colors hover:text-navy"
          >
            {enPausa ? <Play size={13} aria-hidden /> : <Pause size={13} aria-hidden />}
            {enPausa ? 'Reanudar' : 'Pausar'}
          </button>
        </div>

        {!hayLogos && (
          <p className="reveal mt-6 flex items-start justify-center gap-2.5 font-body text-[13px] leading-relaxed text-slate-soft">
            <Upload size={15} aria-hidden className="mt-0.5 shrink-0" />
            <span>
              Las marcas de las aseguradoras aliadas se colocan aquí. Requieren el
              logotipo oficial y la autorización de uso de cada compañía.
            </span>
          </p>
        )}

        <p className="reveal mt-8 text-center font-body text-sm text-slate">
          ¿Es aseguradora o corredor y quiere trabajar con nosotros?{' '}
          <a
            href="#contacto"
            className="inline-flex min-h-11 items-center font-semibold text-blue-700 underline underline-offset-4"
          >
            Conversemos
          </a>
        </p>
      </div>
    </section>
  )
}
