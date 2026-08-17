'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { LogoMarca } from './Marca'

/**
 * Marca de cierre: el simbolo de ASSANCH, visible y arrastrable.
 *
 * Ocupa su propia banda despejada en vez de ir de filigrana detras del
 * contenido. Sangrar por el borde de una seccion para "no invadir" es
 * exactamente lo que hace que se vea cortada, y al 4% detras de los iconos no
 * se lee. Aqui se ve entera y no compite con nada.
 *
 * Fisica: al soltar vuelve al centro con un muelle amortiguado. El bucle solo
 * corre mientras hace falta —arrastre o retorno en curso— y se detiene solo,
 * asi que en reposo no consume nada.
 *
 * Accesibilidad: es un control, no un adorno. Tiene nombre, es enfocable y las
 * flechas lo mueven, porque WCAG 2.2 exige alternativa de teclado para toda
 * accion de arrastre. Con movimiento reducido no hay muelle: el simbolo se
 * coloca donde se suelta y el boton lo recentra.
 */

const RIGIDEZ = 0.055
const AMORTIGUACION = 0.82
const LIMITE = 150 // px de desplazamiento maximo desde el centro
const PASO_TECLA = 18

export default function MarcaJuguete() {
  const marcaRef = useRef(null)
  const rafRef = useRef(0)
  const estado = useRef({ x: 0, y: 0, vx: 0, vy: 0, arrastrando: false, ox: 0, oy: 0 })

  const [movido, setMovido] = useState(false)
  const [reducido, setReducido] = useState(false)

  const pintar = useCallback(() => {
    const el = marcaRef.current
    if (!el) return
    const e = estado.current
    el.style.transform = `translate3d(${e.x.toFixed(2)}px, ${e.y.toFixed(2)}px, 0) rotate(${(e.x * 0.03).toFixed(2)}deg)`
  }, [])

  const bucle = useCallback(() => {
    const e = estado.current
    if (!e.arrastrando) {
      // Muelle hacia el centro
      e.vx += -e.x * RIGIDEZ
      e.vy += -e.y * RIGIDEZ
      e.vx *= AMORTIGUACION
      e.vy *= AMORTIGUACION
      e.x += e.vx
      e.y += e.vy

      const quieto =
        Math.abs(e.x) < 0.4 && Math.abs(e.y) < 0.4 &&
        Math.abs(e.vx) < 0.4 && Math.abs(e.vy) < 0.4

      if (quieto) {
        e.x = 0; e.y = 0; e.vx = 0; e.vy = 0
        pintar()
        rafRef.current = 0
        setMovido(false)
        return
      }
    }
    pintar()
    rafRef.current = requestAnimationFrame(bucle)
  }, [pintar])

  const arrancar = useCallback(() => {
    if (!rafRef.current) rafRef.current = requestAnimationFrame(bucle)
  }, [bucle])

  const recentrar = useCallback(() => {
    const e = estado.current
    if (reducido) {
      e.x = 0; e.y = 0; e.vx = 0; e.vy = 0
      pintar()
      setMovido(false)
      return
    }
    e.vx = 0; e.vy = 0
    arrancar()
  }, [reducido, pintar, arrancar])

  useEffect(() => {
    const consulta = window.matchMedia('(prefers-reduced-motion: reduce)')
    const aplicar = (ev) => setReducido(ev.matches)
    setReducido(consulta.matches)
    consulta.addEventListener('change', aplicar)
    return () => {
      consulta.removeEventListener('change', aplicar)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const limitar = (v) => Math.max(-LIMITE, Math.min(LIMITE, v))

  const alPulsar = (ev) => {
    const e = estado.current
    e.arrastrando = true
    e.ox = ev.clientX - e.x
    e.oy = ev.clientY - e.y
    e.vx = 0; e.vy = 0
    ev.currentTarget.setPointerCapture?.(ev.pointerId)
    setMovido(true)
    if (!reducido) arrancar()
  }

  const alMover = (ev) => {
    const e = estado.current
    if (!e.arrastrando) return
    e.x = limitar(ev.clientX - e.ox)
    e.y = limitar(ev.clientY - e.oy)
    /* Se pinta en cada movimiento, no solo desde el bucle: si el navegador
       frena requestAnimationFrame el simbolo se quedaria rezagado del cursor.
       El bucle queda solo para el muelle de retorno. */
    pintar()
  }

  const alSoltar = () => {
    const e = estado.current
    if (!e.arrastrando) return
    e.arrastrando = false
    if (reducido) return // sin muelle: se queda donde se suelta
    arrancar()
  }

  const alTeclear = (ev) => {
    const e = estado.current
    const mapa = {
      ArrowLeft: [-PASO_TECLA, 0], ArrowRight: [PASO_TECLA, 0],
      ArrowUp: [0, -PASO_TECLA], ArrowDown: [0, PASO_TECLA],
    }
    if (ev.key === 'Escape' || ev.key === 'Home') { recentrar(); ev.preventDefault(); return }
    const d = mapa[ev.key]
    if (!d) return
    ev.preventDefault()
    e.arrastrando = true // congela el muelle mientras se usa el teclado
    e.x = limitar(e.x + d[0])
    e.y = limitar(e.y + d[1])
    setMovido(true)
    pintar()
    e.arrastrando = false
  }

  return (
    <section aria-labelledby="marca-titulo" className="py-20 md:py-28">
      <div className="section">
        <div className="reveal relative mx-auto flex max-w-3xl flex-col items-center overflow-hidden rounded-[2.5rem] border border-line bg-white px-6 py-14 shadow-suave md:py-16">
          {/* Halo de color: da fondo despejado al simbolo sin encerrarlo */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-3xl"
          />

          <h2 id="marca-titulo" className="sr-only">
            Símbolo de ASSANCH
          </h2>

          <button
            ref={marcaRef}
            type="button"
            onPointerDown={alPulsar}
            onPointerMove={alMover}
            onPointerUp={alSoltar}
            onPointerCancel={alSoltar}
            onKeyDown={alTeclear}
            aria-label="Símbolo de ASSANCH. Arrástrelo con el ratón, o muévalo con las flechas del teclado. Escape lo devuelve al centro."
            className="relative cursor-grab touch-none rounded-full p-4 transition-shadow duration-300 will-change-transform hover:drop-shadow-[0_18px_28px_rgba(19,27,33,0.18)] active:cursor-grabbing"
          >
            <LogoMarca size={132} decorativo className="text-navy" />
          </button>

          <p className="relative mt-8 text-center font-body text-[13px] text-slate-soft">
            {reducido ? 'Use las flechas para moverlo' : 'Arrástrelo · las flechas también lo mueven'}
          </p>

          {movido && (
            <button
              type="button"
              onClick={recentrar}
              className="relative mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-white px-4 font-body text-[11px] font-semibold tracking-[0.1em] text-slate uppercase shadow-suave transition-colors hover:text-navy"
            >
              <RotateCcw size={13} aria-hidden />
              Centrar
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
