'use client'

import { useEffect, useRef, useState } from 'react'
import { Maximize2, Play, X } from 'lucide-react'

const PILDORA =
  'absolute top-4 right-4 z-10 flex cursor-pointer items-center gap-2 rounded-full bg-navy/70 px-4 py-2 font-body text-[11px] font-semibold tracking-[0.08em] text-white uppercase backdrop-blur transition-colors hover:bg-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold'

/**
 * Video del relanzamiento, justo debajo del hero.
 *
 * PESA 28 MB. Por eso va con `preload="none"` y con `poster`: asi no se
 * descarga ni un byte hasta que alguien pulsa reproducir. Sin el poster, un
 * video sin cargar se pinta como un rectangulo negro bajo un hero blanco; con
 * el, lo que se ve es la tarjeta de apertura de la propia pieza, 137 KB.
 *
 * El fotograma sale de `herramientas/fotograma-video.swift` —segundo 2, que es
 * la tarjeta de identidad— y se regenera con el mismo comando si cambia el
 * video, para que la portada no dependa de donde acerto a pausar alguien.
 *
 * NO se autorreproduce. Un video de 32 segundos con sonido que arranca solo
 * delante de quien acaba de entrar es intrusivo, y ademas tirar 28 MB a quien
 * no los ha pedido —en datos moviles— no se hace.
 *
 * AMPLIAR TIENE DOS CAMINOS, y no por gusto. El primero es la pantalla completa
 * del sistema; el segundo, una capa dentro de la pagina. Hace falta mantener
 * los dos porque ninguno sirve solo:
 *
 *   · La capa no agranda nada en vertical. Medido: en una tableta de 768 px el
 *     video mide 688 px dentro de la capa y 688 fuera —ya ocupa el ancho de la
 *     columna—, y en un movil pasa de 335 a 343. Seria un recuadro negro a
 *     cambio de nada. Lo que si sirve ahi es la pantalla completa del sistema,
 *     que gira a horizontal y aprovecha el alto.
 *   · La pantalla completa del sistema no esta garantizada. Safari de iPhone
 *     solo se la da al propio <video>, con una API con prefijo y exigiendo
 *     metadatos ya cargados —que con `preload="none"` no hay al primer toque—,
 *     y hay entornos donde la llamada ni resuelve ni rechaza: el panel de vista
 *     previa de este proyecto es uno, y por eso el respaldo no puede depender
 *     del rechazo de la promesa sino de comprobar despues si entro de verdad.
 *
 * Asi que se pide la del sistema y, si medio segundo despues no se ha entrado,
 * se abre la capa. En un iPhone el primer toque caera casi siempre en la capa y
 * el segundo ya en la pantalla completa, porque para entonces los metadatos
 * estan cargados. Es la degradacion aceptada a cambio de no descargar 28 MB a
 * quien solo venia a leer.
 *
 * El unico texto que acompana al video es «Relanzamiento de marca · 2026», que
 * esta copiado del cierre de la propia pieza. No se le pone titular ni bajada
 * inventados: el video se explica solo y aqui no se rellena con aproximaciones.
 */
export default function VideoRelanzamiento() {
  const video = useRef(null)
  const cerrar = useRef(null)
  const abrir = useRef(null)
  const [sonando, setSonando] = useState(false)
  const [ampliado, setAmpliado] = useState(false)

  const reproducir = () => video.current?.play().catch(() => {})

  const ampliar = () => {
    const v = video.current
    if (!v) return
    reproducir()

    const pedir =
      v.requestFullscreen?.bind(v) ||
      v.webkitEnterFullscreen?.bind(v) || // Safari de iPhone
      v.webkitRequestFullscreen?.bind(v)

    if (!pedir) {
      setAmpliado(true)
      return
    }
    try {
      pedir()?.catch?.(() => {})
    } catch {
      setAmpliado(true)
      return
    }

    /* Se comprueba el resultado en vez de esperar al rechazo: ver arriba. */
    window.setTimeout(() => {
      const dentro = document.fullscreenElement === v || v.webkitDisplayingFullscreen
      if (!dentro) setAmpliado(true)
    }, 500)
  }

  /* Mientras la capa esta abierta: Escape la cierra, el fondo deja de poder
     desplazarse —si no, la rueda mueve la pagina por detras de la capa— y el
     foco pasa al boton de cerrar, que es la unica salida con teclado. Al
     cerrar, el foco vuelve al boton que la abrio; dejarlo suelto manda al
     teclado al principio del documento. */
  useEffect(() => {
    if (!ampliado) return

    const alPulsar = (e) => {
      if (e.key === 'Escape') setAmpliado(false)
    }
    const guardado = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', alPulsar)
    cerrar.current?.focus()

    return () => {
      document.body.style.overflow = guardado
      document.removeEventListener('keydown', alPulsar)
      abrir.current?.focus()
    }
  }, [ampliado])

  return (
    <section
      aria-label="Video de relanzamiento de marca"
      className="relative overflow-hidden pb-24 md:pb-32"
      data-reveal-group
    >
      <div className="section relative">
        <div className="reveal mx-auto max-w-5xl text-center">
          <p className="pildora mx-auto">Relanzamiento de marca · 2026</p>
        </div>

        {/* El marco NO va dentro de `.reveal`, y no es un descuido: esa clase
            lleva `will-change: opacity, transform`, y un ancestro con
            will-change de transform pasa a ser el bloque contenedor de los
            `position: fixed` que tenga dentro —aunque el transform ya valga
            `none` tras la animacion—. La capa ampliada dejaba entonces de
            medirse contra la ventana y salia de 1024x80 px, con el video a cero
            de alto. Se renuncia a la aparicion progresiva en este bloque; el
            rotulo de arriba si la conserva.

            La capa reposiciona ESTE MISMO marco en vez de montar un segundo
            video: React no sabe mudar un nodo de sitio sin recrearlo, y
            recrearlo cortaria la reproduccion al ampliar y al volver. */}
        <div
          className={
            ampliado
              ? 'fixed inset-0 z-[90] flex items-center justify-center bg-navy/95 p-4 backdrop-blur-sm md:p-10'
              : 'mx-auto mt-10 max-w-5xl'
          }
          onClick={ampliado ? (e) => e.target === e.currentTarget && setAmpliado(false) : undefined}
        >
          <div
            className={`group relative overflow-hidden bg-navy ${
              ampliado
                ? 'h-full w-full rounded-xl'
                : 'aspect-video w-full rounded-[1.75rem] border border-line shadow-media'
            }`}
          >
            <video
              ref={video}
              /* Los controles aparecen al arrancar, no antes: sobre la portada
                 quieta la barra nativa no sirve para nada —no hay nada que
                 pausar ni que recorrer— y compite con el boton grande, que es
                 lo unico que hay que pulsar. Una vez en marcha hacen falta
                 enteros, asi que se usan los del navegador y no unos propios:
                 traen teclado, volumen, velocidad y la pantalla completa del
                 sistema ya resueltos. */
              controls={sonando}
              playsInline
              preload="none"
              poster="/media/relanzamiento-2026.jpg"
              onPlay={() => setSonando(true)}
              className="h-full w-full object-contain"
            >
              <source src="/media/relanzamiento-2026.mp4" type="video/mp4" />
              Su navegador no puede reproducir este video.
            </video>

            {/* Capa de reproduccion: solo hasta la primera pulsacion. Los
                controles nativos traen su propio boton, pero es un icono
                pequeno en una barra sobre una portada clara, y nada en ella
                dice que hay algo que ver. Al arrancar desaparece, para no
                quedarse por encima de los controles. */}
            {!sonando && (
              <button
                type="button"
                onClick={reproducir}
                aria-label="Reproducir el video de relanzamiento"
                className="absolute inset-0 flex cursor-pointer items-center justify-center bg-navy/5 transition-colors hover:bg-navy/15 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-gold"
              >
                <span
                  aria-hidden
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 shadow-media transition-transform duration-300 group-hover:scale-105"
                >
                  <Play size={26} className="ml-1 fill-navy text-navy" />
                </span>
              </button>
            )}

            {ampliado ? (
              <button
                ref={cerrar}
                type="button"
                onClick={() => setAmpliado(false)}
                aria-label="Cerrar el video ampliado"
                className={PILDORA}
              >
                <X size={13} aria-hidden />
                Cerrar
              </button>
            ) : (
              <button
                ref={abrir}
                type="button"
                onClick={ampliar}
                aria-label="Ampliar el video"
                className={PILDORA}
              >
                <Maximize2 size={13} aria-hidden />
                Ampliar
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
