'use client'

import { useEffect } from 'react'

/**
 * Revelado en scroll para todo elemento con la clase `.reveal`.
 *
 * IntersectionObserver + transiciones CSS, sin GSAP. Motivos:
 *
 *  - Robustez. Con tweens por JS, si el navegador congela requestAnimationFrame
 *    (pestana en segundo plano, pane sin repintar) el elemento se queda a media
 *    opacidad y la seccion aparece vacia. Una transicion CSS es declarativa: el
 *    elemento acaba en su estado final aunque no se pinte ni un fotograma.
 *  - Coste. Se elimina ScrollTrigger del camino critico; el observador no corre
 *    codigo en cada scroll.
 *
 * La clase `js-reveal` se anade al <html> solo cuando este hook corre, asi el
 * contenido nunca queda oculto si el JS falla o tarda.
 */
export function useReveal() {
  useEffect(() => {
    const raiz = document.documentElement

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    raiz.classList.add('js-reveal')

    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return

          const items = entrada.target.querySelectorAll('.reveal')
          items.forEach((el, i) => {
            // Cascada de 70 ms, con tope: en rejillas largas una cascada
            // proporcional se haria interminable.
            el.style.transitionDelay = `${Math.min(i * 70, 420)}ms`
            el.classList.add('visible')
          })

          observador.unobserve(entrada.target)
        })
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 }
    )

    const grupos = document.querySelectorAll('[data-reveal-group]')
    grupos.forEach((g) => observador.observe(g))

    return () => {
      observador.disconnect()
      raiz.classList.remove('js-reveal')
    }
  }, [])
}
