'use client'

import Link from 'next/link'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, BadgeCheck, Clock, Layers, MapPin } from 'lucide-react'
import { LogoMarca } from './Marca'
import HeroSigil from './HeroSigil'
import PalabraRotativa from './PalabraRotativa'

/* Se rotan ramos reales y no adjetivos: comunican la amplitud de la cartera,
   que es el argumento comercial de la firma. */
const ramosRotativos = [
  'incendio',
  'automóvil',
  'transporte',
  'todo riesgo',
  'maquinaria',
  'interrupciones',
  'responsabilidad civil',
]

gsap.registerPlugin(ScrollTrigger)

/**
 * Portada.
 *
 * Fondo blanco con orbes difuminados que tiran hacia el azul de marca. El
 * titular abre con la promesa real de la firma y encierra la segunda mitad en
 * una cápsula de cristal.
 *
 * El video es opcional: si existe `public/media/hero.mp4` se monta detrás de
 * los orbes y su reproducción se ata al scroll. Si no existe, no se rompe nada
 * y quedan sólo los orbes.
 */
export default function Hero() {
  const root = useRef(null)
  const video = useRef(null)
  const [hayVideo, setHayVideo] = useState(true)

  useEffect(() => {
    const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    /* Si la pestaña carga en segundo plano, requestAnimationFrame no corre y una
       animación `from` dejaría el titular congelado a media opacidad hasta que
       el usuario vuelva. En ese caso no se anima: se muestra el estado final. */
    const oculto = document.visibilityState === 'hidden'

    const ctx = gsap.context(() => {
      if (!reducido && !oculto) {
        gsap
          .timeline({ defaults: { ease: 'power3.out' } })
          .from('[data-entra]', { opacity: 0, y: 26, duration: 0.85, stagger: 0.09 })
          .from('[data-marca]', { opacity: 0, y: 14, duration: 0.6, stagger: 0.04 }, '-=0.45')

        // Los orbes respiran despacio; sólo transform y opacity.
        gsap.to('[data-orbe]', {
          scale: 1.14,
          duration: 9,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          stagger: 1.6,
        })
      }
    }, root)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [hayVideo])

  useEffect(() => {
    const el = video.current
    if (!el || !hayVideo) return
    let st = null

    const alCargar = () => {
      if (!el.duration || !isFinite(el.duration)) return
      st = ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.4,
        onUpdate: (self) => {
          el.currentTime = self.progress * el.duration
        },
      })
    }
    const alFallar = () => setHayVideo(false)

    el.addEventListener('loadedmetadata', alCargar)
    el.addEventListener('error', alFallar)
    // networkState 3 (NO_SOURCE) es la comprobación fiable de que falta el archivo.
    const revisar = setTimeout(() => {
      if (el.networkState === 3 || (el.readyState === 0 && !el.duration)) alFallar()
    }, 900)

    return () => {
      st?.kill()
      clearTimeout(revisar)
      el.removeEventListener('loadedmetadata', alCargar)
      el.removeEventListener('error', alFallar)
    }
  }, [hayVideo])

  return (
    <section id="top" ref={root} className="relative overflow-hidden" aria-label="Portada">
      {/* --- Fondo --- */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div
          data-orbe
          className="orbe h-[58vw] w-[58vw] bg-blue-300/45"
          style={{ top: '-16%', left: '18%', '--orbe-tiro': '34px' }}
        />
        <div
          data-orbe
          className="orbe h-[42vw] w-[42vw] bg-blue-500/30"
          style={{ top: '8%', right: '2%', '--orbe-tiro': '-28px' }}
        />
        <div
          data-orbe
          className="orbe h-[34vw] w-[34vw] bg-gold/20"
          style={{ top: '34%', left: '2%', '--orbe-tiro': '24px' }}
        />
        {hayVideo && (
          <video
            ref={video}
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            onError={() => setHayVideo(false)}
            className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-luminosity"
          >
            <source src="/media/hero.mp4" type="video/mp4" onError={() => setHayVideo(false)} />
          </video>
        )}
        <div className="velo-blanco absolute inset-0" />
      </div>

      {/* Elemento firma: el barrido de inspección, por detrás del contenido */}
      <HeroSigil />

      <div className="section relative pt-32 pb-16 text-center sm:pt-36 sm:pb-20 md:pt-44 md:pb-28">
        <p data-entra className="pildora mx-auto">
          Ajustadores y Consultores de seguros
        </p>

        <h1
          data-entra
          /* Tamano fluido en vez de fijo por breakpoint. La capsula se
             dimensiona a la palabra mas larga («responsabilidad civil»), que a
             41,6px medía 409px y no cabía en los 335px utiles de un iPhone.
             Con 8.4vw esa palabra entra en toda la gama, desde el iPhone SE
             (320px → capsula 265px sobre 280 disponibles) hasta escritorio,
             donde el tope de 4.4rem la deja en su tamano de diseno. */
          className="mx-auto mt-8 max-w-4xl font-display text-[clamp(1.6rem,8.4vw,4.4rem)] leading-[1.08] font-medium tracking-[-0.03em] text-navy"
        >
          <span className="block">Gestionamos siniestros de</span>
          <span className="mt-2 flex justify-center md:mt-3">
            {/* El degradado va en cada palabra, no en la cápsula: `.cristal` y
                `.texto-degradado` compiten por `background` y el recorte a texto
                dejaría el titular invisible. */}
            <span className="cristal font-semibold">
              <PalabraRotativa palabras={ramosRotativos} clasePalabra="texto-degradado" />
            </span>
          </span>
          <span className="mt-2 block md:mt-3">con respuesta inmediata.</span>
        </h1>

        <p
          data-entra
          className="mx-auto mt-9 max-w-xl font-body text-lg leading-relaxed text-slate"
        >
          Peritamos, cuantificamos y sustentamos el siniestro para que la reclamación
          avance con criterio técnico. Presencia inmediata en todo el país.
        </p>

        <div data-entra className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/someter-reclamo" className="btn" data-iman>
            Asignar un reclamo <ArrowRight size={17} aria-hidden />
          </Link>
          <a href="#ramos" className="btn-claro" data-iman>
            <Layers size={15} aria-hidden className="text-blue-500" />
            Ver los 10 ramos
          </a>
        </div>

        {/* Microcopy bajo los botones: responde las dos preguntas que frenan el
            clic — cuando atienden y hasta donde llegan. Solo datos verificados. */}
        <ul
          data-entra
          className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-body text-[13px] text-slate"
        >
          <li className="flex items-center gap-2">
            <Clock size={14} aria-hidden className="text-blue-500" />
            Aviso de siniestros 24/7
          </li>
          <li className="flex items-center gap-2">
            <MapPin size={14} aria-hidden className="text-blue-500" />
            Presencia en todo el territorio nacional
          </li>
          <li className="flex items-center gap-2">
            <BadgeCheck size={14} aria-hidden className="text-blue-500" />
            Criterio técnico independiente
          </li>
        </ul>

        {/* Franja de confianza. Los logos reales sustituyen estas ranuras. */}
        <div className="mt-20">
          <p className="font-body text-xs tracking-wider text-slate uppercase">
            Más de 10 aseguradoras trabajan con nosotros
          </p>
          <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-60">
            {['Aliado 01', 'Aliado 02', 'Aliado 03', 'Aliado 04', 'Aliado 05'].map((a) => (
              <li key={a} data-marca className="flex items-center gap-2 text-slate">
                <LogoMarca mono decorativo size={19} className="opacity-70" />
                <span className="font-display text-sm font-semibold tracking-tight">{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
