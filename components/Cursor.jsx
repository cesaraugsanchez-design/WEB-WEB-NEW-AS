'use client'

import { useEffect, useRef } from 'react'

/**
 * Cursor propio + movimiento de página según el puntero.
 *
 * Tres efectos, un solo bucle de animación:
 *  1. Halo con retardo (lerp) y punto que sigue exacto — da sensación de peso.
 *  2. Variables `--mx` / `--my` en <body>, normalizadas a [-1, 1]. Las auroras
 *     del fondo se desplazan con ellas vía CSS: cero coste de JS por elemento.
 *  3. Imanación: los elementos con `data-iman` se acercan al cursor.
 *
 * No se monta nada en punteros gruesos (táctil) ni con movimiento reducido.
 */
export default function Cursor() {
  const halo = useRef(null)
  const punto = useRef(null)

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!finePointer || reduced) return

    const body = document.body
    let raf = 0
    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let haloX = mouseX
    let haloY = mouseY
    let escala = 1
    let escalaObjetivo = 1

    const imanes = new Map()

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY

      // Normalizado a [-1, 1] para que el CSS decida cuánto desplazar.
      body.style.setProperty('--mx', ((mouseX / window.innerWidth) * 2 - 1).toFixed(3))
      body.style.setProperty('--my', ((mouseY / window.innerHeight) * 2 - 1).toFixed(3))

      // ¿El cursor está sobre una banda oscura? Cambia el modo de fusión.
      const bajo = document.elementFromPoint(mouseX, mouseY)
      const oscuro = bajo?.closest('.banda-oscura')
      body.classList.toggle('banda-oscura-activa', Boolean(oscuro))

      // Crecer sobre elementos interactivos
      escalaObjetivo = bajo?.closest('a, button, input, textarea, [data-iman]') ? 2.2 : 1
    }

    const tick = () => {
      // Retardo del halo: 0.16 da un arrastre perceptible sin sentirse lento.
      haloX += (mouseX - haloX) * 0.16
      haloY += (mouseY - haloY) * 0.16
      escala += (escalaObjetivo - escala) * 0.12

      if (halo.current) {
        halo.current.style.transform = `translate3d(${haloX}px, ${haloY}px, 0) scale(${escala.toFixed(3)})`
      }
      if (punto.current) {
        punto.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`
      }

      // Imanación de los elementos visibles marcados
      imanes.forEach((estado, el) => {
        const r = el.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        const dx = mouseX - cx
        const dy = mouseY - cy
        const dist = Math.hypot(dx, dy)
        const radio = Math.max(r.width, r.height) * 0.9 + 40

        const fuerza = dist < radio ? (1 - dist / radio) * 0.32 : 0
        estado.x += (dx * fuerza - estado.x) * 0.18
        estado.y += (dy * fuerza - estado.y) * 0.18

        el.style.transform =
          Math.abs(estado.x) < 0.1 && Math.abs(estado.y) < 0.1
            ? ''
            : `translate3d(${estado.x.toFixed(2)}px, ${estado.y.toFixed(2)}px, 0)`
      })

      raf = requestAnimationFrame(tick)
    }

    // Sólo se imantan los elementos en pantalla: evita medir todo el documento.
    const io = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) imanes.set(e.target, { x: 0, y: 0 })
        else {
          imanes.delete(e.target)
          e.target.style.transform = ''
        }
      })
    })

    document.querySelectorAll('[data-iman]').forEach((el) => io.observe(el))

    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      body.classList.remove('banda-oscura-activa')
    }
  }, [])

  return (
    <>
      <div ref={halo} className="cursor-halo" aria-hidden="true" />
      <div ref={punto} className="cursor-punto" aria-hidden="true" />
    </>
  )
}
