'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Palabra que rota dentro del titular.
 *
 * Se anima con transiciones CSS, no con GSAP: una transicion es declarativa, de
 * modo que si el navegador congela el rAF (pestaña en segundo plano) el elemento
 * igualmente acaba en su estado final. Con tweens por JS se quedaba a medias y
 * el titular aparecia vacio.
 *
 * Layout: todas las palabras se apilan en la misma celda de grid, asi el
 * contenedor mide siempre lo que la mas larga y el titular no salta.
 *
 * Accesibilidad: la rotacion es decorativa y se oculta del arbol de
 * accesibilidad; la lista completa se expone una vez en texto. Una region viva
 * cambiando cada dos segundos seria ruido constante para un lector de pantalla.
 */
export default function PalabraRotativa({ palabras, intervalo = 2400, clasePalabra = '' }) {
  const [indice, setIndice] = useState(0)
  const previo = useRef(-1)

  useEffect(() => {
    if (palabras.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const id = setTimeout(() => {
      previo.current = indice
      setIndice((i) => (i + 1) % palabras.length)
    }, intervalo)

    return () => clearTimeout(id)
  }, [indice, intervalo, palabras.length])

  return (
    <>
      <span aria-hidden="true" className="grid overflow-hidden py-[0.14em]">
        {palabras.map((palabra, i) => {
          const activa = i === indice
          const saliendo = i === previo.current && !activa

          return (
            <span
              key={palabra}
              className={`col-start-1 row-start-1 whitespace-nowrap ${clasePalabra}`}
              style={{
                opacity: activa ? 1 : 0,
                transform: activa
                  ? 'translateY(0)'
                  : saliendo
                    ? 'translateY(-118%)'
                    : 'translateY(118%)',
                /* La entrada lleva un rebote corto; la salida es mas rapida y sin
                   rebote. Las que no participan se reposicionan sin transicion,
                   para que no crucen la vista al volver el ciclo al principio. */
                transition: activa
                  ? 'transform 720ms cubic-bezier(0.22, 1.18, 0.36, 1), opacity 420ms ease-out'
                  : saliendo
                    ? 'transform 460ms cubic-bezier(0.45, 0, 1, 1), opacity 300ms ease-in'
                    : 'none',
                willChange: 'transform, opacity',
              }}
            >
              {palabra}
            </span>
          )
        })}
      </span>

      <span className="sr-only">{palabras.join(', ')}</span>
    </>
  )
}
