'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'

/**
 * Desplegable de selección múltiple.
 *
 * Es un `<button>` con `aria-expanded` que abre un grupo de casillas reales, no
 * un `<select multiple>` estilado: las casillas nativas ya traen su semántica y
 * su manejo de teclado, y en móvil no abren la rueda del sistema.
 */
export default function Filtro({ etiqueta, opciones, seleccion, onCambio }) {
  const [abierto, setAbierto] = useState(false)
  const cajaRef = useRef(null)
  const botonRef = useRef(null)

  useEffect(() => {
    if (!abierto) return
    const fuera = (e) => {
      if (!cajaRef.current?.contains(e.target)) setAbierto(false)
    }
    const escape = (e) => {
      if (e.key === 'Escape') {
        setAbierto(false)
        botonRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', fuera)
    window.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('pointerdown', fuera)
      window.removeEventListener('keydown', escape)
    }
  }, [abierto])

  const alternar = (op) =>
    onCambio(seleccion.includes(op) ? seleccion.filter((s) => s !== op) : [...seleccion, op])

  return (
    <div ref={cajaRef} className="relative">
      <button
        ref={botonRef}
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        className={`flex min-h-11 items-center gap-2 rounded-full border px-4 font-body text-sm transition-colors ${
          seleccion.length
            ? 'border-blue-300 bg-blue-50 text-navy'
            : 'border-line bg-white text-slate hover:border-blue-300'
        }`}
      >
        {etiqueta}
        {seleccion.length > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-700 px-1.5 font-body text-[11px] font-semibold text-white">
            {seleccion.length}
          </span>
        )}
        <ChevronDown
          size={14}
          aria-hidden
          className={`transition-transform duration-300 ${abierto ? 'rotate-180' : ''}`}
        />
      </button>

      {abierto && (
        <div className="absolute top-full right-0 z-30 mt-2 w-72 rounded-2xl border border-line bg-white p-2 shadow-media">
          <ul role="group" aria-label={etiqueta}>
            {opciones.map((op) => {
              const marcado = seleccion.includes(op)
              return (
                <li key={op}>
                  <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 transition-colors hover:bg-blue-50">
                    <input
                      type="checkbox"
                      checked={marcado}
                      onChange={() => alternar(op)}
                      className="sr-only"
                    />
                    <span
                      aria-hidden
                      className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                        marcado ? 'border-blue-700 bg-blue-700 text-white' : 'border-line bg-white'
                      }`}
                    >
                      {marcado && <Check size={11} strokeWidth={3} />}
                    </span>
                    <span className="font-body text-sm text-navy">{op}</span>
                  </label>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
