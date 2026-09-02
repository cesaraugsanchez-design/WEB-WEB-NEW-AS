'use client'

import { useRef, useState } from 'react'
import { FileText, Paperclip, X } from 'lucide-react'
import {
  FORMATOS_SUGERIDOS,
  MAX_ARCHIVOS,
  MAX_TOTAL,
  filtrarArchivos,
  tamanoLegible,
} from '@/lib/validacion/adjuntos'

/**
 * Adjuntos del reclamo: arrastrar y soltar, o seleccionar.
 *
 * El `<input type="file">` real se mantiene en el DOM —oculto pero enfocable—
 * para que el control siga siendo operable con teclado y lectores de pantalla.
 * Un `div` con `onDrop` por si solo dejaria fuera a quien no usa raton.
 */
export default function ZonaAdjuntos({ archivos, onCambio }) {
  const entrada = useRef(null)
  const [encima, setEncima] = useState(false)
  const [rechazados, setRechazados] = useState([])

  const agregar = (lista) => {
    const { aceptados, rechazados: malos } = filtrarArchivos(Array.from(lista), archivos)
    onCambio(aceptados)
    setRechazados(malos)
  }

  const quitar = (i) => {
    onCambio(archivos.filter((_, j) => j !== i))
    setRechazados([])
  }

  const total = archivos.reduce((s, a) => s + a.size, 0)

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setEncima(true) }}
        onDragLeave={() => setEncima(false)}
        onDrop={(e) => { e.preventDefault(); setEncima(false); agregar(e.dataTransfer.files) }}
        className={`rounded-2xl border border-dashed p-8 text-center transition-colors duration-300 ${
          encima ? 'border-blue-300 bg-blue-50' : 'border-line bg-canvas'
        }`}
      >
        <Paperclip size={22} aria-hidden className="mx-auto text-blue-500" />

        <p className="mt-3 font-body text-sm text-slate">
          Arrastre los archivos o{' '}
          <button
            type="button"
            onClick={() => entrada.current?.click()}
            className="font-semibold text-blue-700 underline underline-offset-4"
          >
            selecciónelos
          </button>{' '}
          desde su dispositivo
        </p>

        <p className="mt-2 font-body text-xs text-slate-soft">
          {FORMATOS_SUGERIDOS} · hasta {MAX_ARCHIVOS} archivos ·{' '}
          {tamanoLegible(MAX_TOTAL)} en total
        </p>

        <input
          ref={entrada}
          type="file"
          name="archivos"
          multiple
          onChange={(e) => { agregar(e.target.files); e.target.value = '' }}
          className="sr-only"
          aria-label="Seleccionar archivos para adjuntar"
        />
      </div>

      <p className="mt-3 font-body text-xs leading-relaxed text-slate-soft">
        Si envía relación de bienes o de pérdidas, adjúntela en Excel: agiliza el
        procesamiento.
      </p>

      {archivos.length > 0 && (
        <ul className="mt-4 space-y-2">
          {archivos.map((a, i) => (
            <li
              key={`${a.name}-${i}`}
              className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3"
            >
              <FileText size={16} aria-hidden className="shrink-0 text-blue-500" />
              <span className="min-w-0 flex-1 truncate font-body text-sm text-navy">{a.name}</span>
              <span className="shrink-0 font-body text-xs text-slate-soft">
                {tamanoLegible(a.size)}
              </span>
              <button
                type="button"
                onClick={() => quitar(i)}
                aria-label={`Quitar ${a.name}`}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate transition-colors hover:text-signal"
              >
                <X size={15} aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      <p aria-live="polite" className="mt-3 font-body text-xs text-slate-soft">
        {archivos.length > 0 &&
          `${archivos.length} de ${MAX_ARCHIVOS} archivos · ${tamanoLegible(total)}`}
      </p>

      {rechazados.length > 0 && (
        <ul className="mt-2 space-y-1">
          {rechazados.map((r, i) => (
            <li key={i} className="font-body text-xs text-signal">
              {r.nombre} — {r.motivo}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-4 font-body text-xs leading-relaxed text-slate-soft">
        ¿No puede subirlos? Escríbanos a{' '}
        <a href="mailto:recepcion@assanch.com" className="font-semibold text-blue-700 underline underline-offset-4">
          recepcion@assanch.com
        </a>{' '}
        indicando el número de reclamo.
      </p>
    </div>
  )
}
