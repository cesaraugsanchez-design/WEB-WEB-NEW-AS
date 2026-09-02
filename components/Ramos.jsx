'use client'

import { useState } from 'react'
import { FileText, Search, X } from 'lucide-react'
import { ramos } from '@/lib/contenido/ramos'

export default function Ramos() {
  const [abierto, setAbierto] = useState(null)
  const activo = abierto === null ? null : ramos[abierto]

  return (
    <section id="ramos" className="relative scroll-mt-28 overflow-hidden py-24 md:py-32" data-reveal-group>
      <div
        aria-hidden
        className="orbe h-[40vw] w-[40vw] bg-blue-100/70"
        style={{ top: '6%', right: '-14%', '--orbe-tiro': '-22px' }}
      />

      <div className="section relative">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="pildora">Ramos asegurados</p>
          <h2 className="mt-6 font-display text-4xl leading-[1.08] font-medium tracking-[-0.03em] text-navy md:text-5xl">
            Cobertura especializada en{' '}
            <span className="texto-degradado font-semibold">todas las líneas</span> del sector.
          </h2>
          <p className="mt-6 font-body text-lg leading-relaxed text-slate">
            Ajustamos siniestros en los diez ramos que concentran la cartera del mercado
            dominicano. Abra cualquiera para ver su alcance técnico y la documentación
            que necesitamos para trabajarlo.
          </p>
        </div>

        <ul className="rejilla-flotante mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ramos.map((r, i) => {
            const Icon = r.icon
            const seleccionado = abierto === i
            return (
              <li key={r.nombre} className="reveal">
                <button
                  type="button"
                  onClick={() => setAbierto(seleccionado ? null : i)}
                  aria-expanded={seleccionado}
                  aria-controls="detalle-ramo"
                  className={`tarjeta group h-full w-full p-7 text-left ${
                    seleccionado ? '!border-blue-300 !shadow-media' : ''
                  }`}
                >
                  <span className="flex items-start justify-between gap-3">
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-colors duration-500 ${
                        seleccionado
                          ? 'bg-blue-700 text-white'
                          : 'bg-blue-50 text-blue-700 group-hover:bg-blue-700 group-hover:text-white'
                      }`}
                    >
                      <Icon size={20} strokeWidth={1.8} aria-hidden />
                    </span>
                    <span
                      aria-hidden
                      className="mt-1 font-body text-[11px] font-semibold tracking-[0.1em] text-slate-soft uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    >
                      Ver
                    </span>
                  </span>

                  <span className="mt-6 block font-display text-lg leading-snug font-semibold tracking-[-0.01em] text-navy">
                    {r.nombre}
                  </span>
                  <span className="mt-2 block font-body text-sm leading-relaxed text-slate">
                    {r.nota}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        {/* Panel de detalle bajo la rejilla: mantiene el contexto sin la
            complejidad de foco de un dialogo modal. */}
        <div id="detalle-ramo" role="region" aria-live="polite">
          {activo && (
            <article className="mt-8 overflow-hidden rounded-[2.5rem] border border-line bg-white shadow-media">
              <header className="flex items-start justify-between gap-6 border-b border-line bg-canvas p-7 md:p-9">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 to-blue-500 text-white">
                    <activo.icon size={22} strokeWidth={1.8} aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-display text-2xl leading-tight font-semibold tracking-[-0.02em] text-navy">
                      {activo.nombre}
                    </h3>
                    <p className="mt-1 font-body text-sm text-slate">{activo.nota}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setAbierto(null)}
                  aria-label="Cerrar detalle"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-white text-slate shadow-suave transition-colors hover:text-navy"
                >
                  <X size={17} aria-hidden />
                </button>
              </header>

              <div className="grid gap-8 p-7 md:grid-cols-12 md:p-9">
                <div className="md:col-span-5">
                  <h4 className="flex items-center gap-2 font-body text-[11px] font-semibold tracking-[0.12em] text-blue-700 uppercase">
                    <FileText size={14} aria-hidden /> Alcance de la cobertura
                  </h4>
                  <p className="mt-4 font-body leading-relaxed text-slate">{activo.definicion}</p>
                </div>

                <div className="md:col-span-4">
                  <h4 className="flex items-center gap-2 font-body text-[11px] font-semibold tracking-[0.12em] text-blue-700 uppercase">
                    <Search size={14} aria-hidden /> Qué evaluamos
                  </h4>
                  <ul className="mt-4 space-y-2.5">
                    {activo.evaluamos.map((t) => (
                      <li key={t} className="flex gap-3 font-body text-sm leading-relaxed text-slate">
                        <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="md:col-span-3">
                  <h4 className="font-body text-[11px] font-semibold tracking-[0.12em] text-blue-700 uppercase">
                    Documentación clave
                  </h4>
                  <ul className="mt-4 space-y-2.5">
                    {activo.documentos.map((t) => (
                      <li key={t} className="flex gap-3 font-body text-sm leading-relaxed text-slate">
                        <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          )}
        </div>
      </div>
    </section>
  )
}
