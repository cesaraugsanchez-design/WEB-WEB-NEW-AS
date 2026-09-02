'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Cifra que sube de 0 a su valor al entrar en pantalla.
 *
 * Acepta el valor ya formateado («3+», «98%», «10+») y separa la parte numerica
 * del sufijo, de modo que el dato se escribe una sola vez en el componente que
 * lo usa y no hay que mantener numero y simbolo por separado.
 *
 * Robustez: si el navegador congela requestAnimationFrame —pestaña en segundo
 * plano— un contador por rAF se quedaria a medias mostrando una cifra falsa,
 * que en datos de empresa es peor que no animar. Un temporizador de respaldo
 * fuerza el valor final pase lo que pase.
 *
 * Accesibilidad: el conteo es decorativo y se oculta del arbol de
 * accesibilidad; el valor final se expone una vez como texto.
 */
export default function Cifra({ valor, className = '', duracion = 1500 }) {
  const ref = useRef(null)
  const [mostrado, setMostrado] = useState(null)

  // «98%» -> prefijo '', numero 98, sufijo '%'
  const coincidencia = String(valor).match(/^(\D*)([\d.,]+)(.*)$/)
  const prefijo = coincidencia?.[1] ?? ''
  const crudo = coincidencia?.[2] ?? ''
  /* La coma es separador de millares, no decimal: «3,603» son tres mil, no
     tres coma seis. Se retira antes de convertir. */
  const agrupado = crudo.includes(',')
  const objetivo = coincidencia ? parseFloat(agrupado ? crudo.replace(/,/g, '') : crudo) : null
  const sufijo = coincidencia?.[3] ?? ''

  useEffect(() => {
    const el = ref.current
    if (!el || objetivo === null) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setMostrado(objetivo)
      return
    }

    let raf = 0
    let respaldo = 0

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return
        observador.unobserve(el)

        const inicio = performance.now()
        const paso = (ahora) => {
          const t = Math.min(1, (ahora - inicio) / duracion)
          // Desaceleracion cubica: arranca rapido y se posa en el valor final.
          const suave = 1 - Math.pow(1 - t, 3)
          setMostrado(objetivo * suave)
          if (t < 1) raf = requestAnimationFrame(paso)
        }
        raf = requestAnimationFrame(paso)

        // Red de seguridad: pase lo que pase, la cifra acaba en su valor real.
        respaldo = window.setTimeout(() => {
          cancelAnimationFrame(raf)
          setMostrado(objetivo)
        }, duracion + 600)
      },
      { threshold: 0.4 }
    )

    observador.observe(el)

    return () => {
      observador.disconnect()
      cancelAnimationFrame(raf)
      window.clearTimeout(respaldo)
    }
  }, [objetivo, duracion])

  if (objetivo === null) {
    return <span className={className}>{valor}</span>
  }

  const decimales = !agrupado && String(objetivo).includes('.') ? 1 : 0
  const enCurso = mostrado === null ? 0 : mostrado
  const texto = agrupado
    ? Math.round(enCurso).toLocaleString('es-DO')
    : enCurso.toFixed(decimales)

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">
        {prefijo}
        {texto}
        {sufijo}
      </span>
      <span className="sr-only">{valor}</span>
    </span>
  )
}
