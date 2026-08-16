'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Check, RotateCcw, X } from 'lucide-react'

/**
 * Campo de evidencia — la pieza interactiva del sitio.
 *
 * El visitante enlaza las seis piezas de un expediente; al cerrarlas todas
 * aparece la explicacion de por que importan correlacionadas. La metafora no es
 * decorativa: es exactamente lo que hace un ajustador.
 *
 * Los nodos son <button> HTML posicionados sobre el lienzo, no figuras pintadas
 * en canvas. Asi son enfocables, tienen nombre accesible y estado, y el juego
 * se puede completar solo con teclado — un canvas puro dejaria fuera a quien no
 * usa raton.
 *
 * El lienzo de fondo solo aporta la trama ambiental que reacciona al cursor.
 */

/* Las `x` se mantienen dentro de 20-80%: las etiquetas van centradas sobre el
   nodo y a 375px de ancho cualquier valor mas extremo las saca del recuadro. */
const PIEZAS = [
  { id: 'foto', nombre: 'Registro fotográfico', responde: 'Sitúa el daño y su extensión', x: 22, y: 20 },
  { id: 'acta', nombre: 'Acta o denuncia', responde: 'Fecha y ubica el hecho', x: 50, y: 11 },
  { id: 'poliza', nombre: 'Póliza y anexos', responde: 'Determina si está cubierto', x: 78, y: 24 },
  { id: 'facturas', nombre: 'Facturas y valores', responde: 'Cuantifican la pérdida', x: 78, y: 62 },
  { id: 'tecnico', nombre: 'Informe técnico', responde: 'Explica la causa', x: 50, y: 80 },
  { id: 'declaraciones', nombre: 'Declaraciones', responde: 'Aportan el contexto', x: 22, y: 64 },
]

const HOME_SPRING = 0.012
const FRICTION = 0.92
const POINTER_RADIUS = 130
const LINK_FACTOR = 1.45

export default function EvidenceField() {
  const canvasRef = useRef(null)
  const wrapRef = useRef(null)
  const particlesRef = useRef([])
  const pointerRef = useRef({ x: -9999, y: -9999, active: false })
  const rafRef = useRef(0)
  const premioRef = useRef(null)

  const [cadena, setCadena] = useState([])
  const [reducido, setReducido] = useState(false)

  const completo = cadena.length === PIEZAS.length

  const alternar = useCallback((id) => {
    setCadena((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }, [])

  const reiniciar = useCallback(() => setCadena([]), [])

  // Al completarse, el foco va a la carta: quien navega con teclado debe
  // enterarse de que ha aparecido contenido nuevo.
  useEffect(() => {
    if (completo) requestAnimationFrame(() => premioRef.current?.focus())
  }, [completo])

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const consulta = window.matchMedia('(prefers-reduced-motion: reduce)')
    let sinMovimiento = consulta.matches
    setReducido(sinMovimiento)

    let ancho = 0
    let alto = 0
    let linkDistance = 120

    const construir = () => {
      const r = wrap.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      ancho = r.width
      alto = r.height
      canvas.width = Math.floor(ancho * dpr)
      canvas.height = Math.floor(alto * dpr)
      canvas.style.width = `${ancho}px`
      canvas.style.height = `${alto}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const objetivo = Math.round((ancho * alto) / 8600)
      const n = Math.max(24, Math.min(90, objetivo))
      // La malla se ve igual de equilibrada en cualquier ancho.
      linkDistance = Math.sqrt((ancho * alto) / n) * LINK_FACTOR

      particlesRef.current = Array.from({ length: n }, () => {
        const x = Math.random() * ancho
        const y = Math.random() * alto
        return { x, y, homeX: x, homeY: y, vx: 0, vy: 0, r: 1 + Math.random() * 1.6 }
      })
    }

    const paso = () => {
      const ps = particlesRef.current
      const puntero = pointerRef.current
      ctx.clearRect(0, 0, ancho, alto)

      for (const p of ps) {
        p.vx += (p.homeX - p.x) * HOME_SPRING
        p.vy += (p.homeY - p.y) * HOME_SPRING

        if (puntero.active) {
          const dx = p.x - puntero.x
          const dy = p.y - puntero.y
          const d2 = dx * dx + dy * dy
          if (d2 < POINTER_RADIUS * POINTER_RADIUS && d2 > 0.01) {
            const d = Math.sqrt(d2)
            const f = (1 - d / POINTER_RADIUS) * 1.6
            p.vx += (dx / d) * f
            p.vy += (dy / d) * f
          }
        }

        p.vx *= FRICTION
        p.vy *= FRICTION
        p.x += p.vx
        p.y += p.vy
      }

      ctx.lineWidth = 1
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const dx = ps[i].x - ps[j].x
          const dy = ps[i].y - ps[j].y
          const d2 = dx * dx + dy * dy
          if (d2 < linkDistance * linkDistance) {
            const a = (1 - Math.sqrt(d2) / linkDistance) * 0.32
            ctx.strokeStyle = `rgba(47, 128, 194, ${a})`
            ctx.beginPath()
            ctx.moveTo(ps[i].x, ps[i].y)
            ctx.lineTo(ps[j].x, ps[j].y)
            ctx.stroke()
          }
        }
      }

      for (const p of ps) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(131, 151, 169, 0.42)'
        ctx.fill()
      }
    }

    const bucle = () => {
      paso()
      rafRef.current = requestAnimationFrame(bucle)
    }
    const arrancar = () => {
      if (sinMovimiento || rafRef.current) return
      rafRef.current = requestAnimationFrame(bucle)
    }
    const parar = () => {
      if (!rafRef.current) return
      cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
    }

    const alMover = (e) => {
      const r = canvas.getBoundingClientRect()
      pointerRef.current.x = e.clientX - r.left
      pointerRef.current.y = e.clientY - r.top
      pointerRef.current.active = true
    }
    const alSalir = () => {
      pointerRef.current.active = false
    }

    const ro = new ResizeObserver(() => {
      construir()
      paso()
    })
    ro.observe(wrap)

    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? arrancar() : parar()),
      { threshold: 0.01 }
    )

    const alCambiar = (e) => {
      sinMovimiento = e.matches
      setReducido(e.matches)
      if (e.matches) {
        parar()
        paso()
      } else arrancar()
    }

    construir()
    paso()
    io.observe(wrap)

    wrap.addEventListener('pointermove', alMover)
    wrap.addEventListener('pointerleave', alSalir)
    consulta.addEventListener('change', alCambiar)

    return () => {
      parar()
      io.disconnect()
      ro.disconnect()
      wrap.removeEventListener('pointermove', alMover)
      wrap.removeEventListener('pointerleave', alSalir)
      consulta.removeEventListener('change', alCambiar)
    }
  }, [])

  const puntos = cadena.map((id) => PIEZAS.find((p) => p.id === id))

  return (
    <section id="campo" className="scroll-mt-28 py-24 md:py-32" data-reveal-group>
      <div className="section">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="pildora">Campo de evidencia</p>
          <h2 className="mt-6 font-display text-4xl leading-[1.08] font-medium tracking-[-0.03em] text-navy md:text-5xl">
            Ningún dato aislado{' '}
            <span className="texto-degradado font-semibold">explica un siniestro</span>.
          </h2>
          <p className="mt-6 font-body text-lg leading-relaxed text-slate">
            Enlace las seis piezas de un expediente y verá por qué su valor está en cómo
            se corroboran entre sí.
          </p>
        </div>

        <div
          ref={wrapRef}
          className="reveal relative mt-14 h-[460px] overflow-hidden rounded-[2.5rem] border border-line bg-white shadow-suave md:h-[520px]"
        >
          <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 block h-full w-full" />

          {/* Trazos entre piezas enlazadas */}
          <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full">
            {puntos.slice(1).map((p, i) => {
              const a = puntos[i]
              return (
                <line
                  key={`${a.id}-${p.id}`}
                  x1={`${a.x}%`}
                  y1={`${a.y}%`}
                  x2={`${p.x}%`}
                  y2={`${p.y}%`}
                  stroke="#1E5480"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.55"
                />
              )
            })}
          </svg>

          {/* Piezas */}
          {PIEZAS.map((p) => {
            const orden = cadena.indexOf(p.id)
            const activa = orden !== -1
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => alternar(p.id)}
                aria-pressed={activa}
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                className={`absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 rounded-2xl px-3 py-2 transition-all duration-500 ${
                  activa ? 'z-20' : 'z-10 hover:-translate-y-[calc(50%+3px)]'
                }`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-500 sm:h-10 sm:w-10 ${
                    activa
                      ? 'border-blue-700 bg-blue-700 text-white shadow-[0_0_0_6px_rgba(30,84,128,0.12)]'
                      : 'border-blue-300 bg-white text-blue-700 shadow-suave'
                  }`}
                >
                  {activa ? (
                    <span className="font-display text-sm font-bold">{orden + 1}</span>
                  ) : (
                    <span aria-hidden className="h-2 w-2 rounded-full bg-blue-500" />
                  )}
                </span>

                <span
                  className={`max-w-[7.5rem] rounded-full border px-2 py-1 text-center font-body text-[10px] leading-tight font-semibold transition-colors duration-500 sm:max-w-[9.5rem] sm:px-2.5 sm:text-[11px] ${
                    activa
                      ? 'border-blue-300 bg-white text-navy'
                      : 'border-line bg-white/90 text-slate'
                  }`}
                >
                  {p.nombre}
                </span>
              </button>
            )
          })}

          {/* Barra inferior */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-t from-white via-white/85 to-transparent p-5">
            <p aria-live="polite" className="font-body text-[11px] font-semibold tracking-[0.12em] text-slate-soft uppercase">
              {reducido && 'Movimiento reducido · '}
              {completo ? 'Expediente completo' : `${cadena.length} de ${PIEZAS.length} piezas enlazadas`}
            </p>

            {cadena.length > 0 && (
              <button
                type="button"
                onClick={reiniciar}
                className="pointer-events-auto inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-white px-4 font-body text-[11px] font-semibold tracking-[0.1em] text-slate uppercase shadow-suave transition-colors hover:text-navy"
              >
                <RotateCcw size={13} aria-hidden />
                Reiniciar
              </button>
            )}
          </div>
        </div>

        {/* Carta informativa: el premio por cerrar el expediente */}
        {completo && (
          <article
            ref={premioRef}
            tabIndex={-1}
            className="reveal visible mt-6 overflow-hidden rounded-[2.5rem] border border-line bg-white shadow-media"
          >
            <header className="flex items-start justify-between gap-6 border-b border-line bg-canvas p-7 md:p-9">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 to-blue-500 text-white">
                  <Check size={22} strokeWidth={2.2} aria-hidden />
                </span>
                <div>
                  <p className="font-body text-[11px] font-semibold tracking-[0.12em] text-blue-700 uppercase">
                    Expediente cerrado
                  </p>
                  <h3 className="mt-1 font-display text-2xl leading-tight font-semibold tracking-[-0.02em] text-navy">
                    Ninguna pieza prueba el siniestro por sí sola.
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={reiniciar}
                aria-label="Cerrar y empezar de nuevo"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-white text-slate shadow-suave transition-colors hover:text-navy"
              >
                <X size={17} aria-hidden />
              </button>
            </header>

            <div className="grid gap-8 p-7 md:grid-cols-12 md:p-9">
              <div className="md:col-span-7">
                <p className="font-body leading-relaxed text-slate">
                  Acaba de hacer lo que hace un ajustador: enlazar piezas sueltas hasta
                  que forman un relato único. Cada una responde una pregunta distinta, y
                  ninguna responde la del resto.
                </p>
                <p className="mt-4 font-body leading-relaxed text-slate">
                  El valor no está en tenerlas, sino en que <strong className="font-semibold text-navy">concuerden</strong>.
                  Cuando las piezas se corroboran entre sí, la reclamación se sostiene ante
                  cualquier revisión. Cuando se contradicen —una factura con fecha posterior
                  al siniestro, un daño que la causa declarada no explica— el ajuste se
                  detiene hasta aclararlo.
                </p>
                <p className="mt-4 font-body leading-relaxed text-slate">
                  Por eso documentamos antes de mover nada: la evidencia que no se levanta
                  en las primeras horas rara vez se recupera después.
                </p>
              </div>

              <div className="md:col-span-5">
                <h4 className="font-body text-[11px] font-semibold tracking-[0.12em] text-blue-700 uppercase">
                  Qué responde cada pieza
                </h4>
                <ul className="mt-4 space-y-2.5">
                  {PIEZAS.map((p) => (
                    <li key={p.id} className="flex gap-3 font-body text-sm leading-relaxed text-slate">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      <span>
                        <strong className="font-semibold text-navy">{p.nombre}.</strong>{' '}
                        {p.responde}.
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        )}
      </div>
    </section>
  )
}
