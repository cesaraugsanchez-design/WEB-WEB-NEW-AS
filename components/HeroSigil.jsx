'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Barrido de inspección — el elemento firma de la portada.
 *
 * Anillos en rombo (la forma del logo) recorridos por un haz giratorio, como el
 * radar de un levantamiento. No es adorno: es lo que hace un ajustador, rastrear
 * la escena hasta que el dato aparece.
 *
 * Al hacer scroll la figura rota y se acerca, de modo que la portada tiene
 * movimiento propio ligado al recorrido y no sólo una entrada al cargar.
 */
export default function HeroSigil() {
  const root = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.to('[data-sigil]', {
        rotate: 42,
        scale: 1.35,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=900',
          scrub: 0.6,
        },
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
    >
      <div
        data-sigil
        className="relative h-[42rem] w-[42rem] max-w-[128vw] shrink-0"
        style={{ transform: 'rotate(0deg)' }}
      >
        {/* Haz giratorio, recortado al rombo por el contenedor */}
        <div className="absolute inset-[12%] rotate-45 overflow-hidden rounded-[14%]">
          <div className="radar-haz absolute inset-[-50%]" />
        </div>

        {/* Anillos concéntricos en rombo */}
        {[100, 78, 56, 34].map((t, i) => (
          <div
            key={t}
            className="absolute rotate-45 rounded-[14%] border border-blue-500/20"
            style={{
              inset: `${(100 - t) / 2}%`,
              borderWidth: i === 0 ? 1.5 : 1,
              opacity: 0.9 - i * 0.15,
            }}
          />
        ))}

        {/* Pulso que se expande desde el centro */}
        <div className="radar-pulso absolute inset-[30%] rotate-45 rounded-[14%] border border-blue-500/35" />

        {/* Retículas: las líneas de medición del levantamiento */}
        <div className="absolute top-1/2 right-[16%] left-[16%] h-px bg-gradient-to-r from-transparent via-blue-500/18 to-transparent" />
        <div className="absolute top-[16%] bottom-[16%] left-1/2 w-px bg-gradient-to-b from-transparent via-blue-500/18 to-transparent" />
      </div>
    </div>
  )
}
