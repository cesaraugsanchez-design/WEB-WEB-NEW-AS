'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Phone, Search, X } from 'lucide-react'
import { buscar, categorias } from '@/lib/contenido/indice'

/* Sugerencias de arranque: la pantalla en blanco con un campo vacío no dice qué
   se puede buscar. Son términos que devuelven resultados de verdad. */
const SUGERENCIAS = ['incendio', 'hotel', 'maquinaria', 'transporte', 'interrupción', 'construcción']

export default function Buscador() {
  const params = useSearchParams()
  const router = useRouter()
  const inicial = params.get('q') || ''

  const [consulta, setConsulta] = useState(inicial)
  const campoRef = useRef(null)

  /* La consulta se refleja en la URL para que un resultado sea enlazable, pero
     con `replace` y sin scroll: cada tecla no debe dejar una entrada nueva en
     el historial del navegador ni mover la página. */
  useEffect(() => {
    const id = setTimeout(() => {
      const url = consulta.trim() ? `/experiencia?q=${encodeURIComponent(consulta.trim())}` : '/experiencia'
      router.replace(url, { scroll: false })
    }, 300)
    return () => clearTimeout(id)
  }, [consulta, router])

  const resultados = useMemo(() => buscar(consulta), [consulta])
  const hayConsulta = consulta.trim().length > 0

  const porCategoria = categorias
    .map((c) => ({ categoria: c, items: resultados.filter((r) => r.categoria === c) }))
    .filter((g) => g.items.length)

  return (
    <>
      <div className="section">
        <div className="mx-auto max-w-2xl">
          <div role="search" className="relative">
            <label htmlFor="busqueda" className="sr-only">
              Buscar en servicios, ramos y sectores
            </label>

            <Search
              size={19}
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-6 -translate-y-1/2 text-slate"
            />

            <input
              id="busqueda"
              ref={campoRef}
              type="search"
              value={consulta}
              onChange={(e) => setConsulta(e.target.value)}
              placeholder="incendio, hotel, maquinaria…"
              autoComplete="off"
              className="min-h-16 w-full rounded-full border border-line bg-white pr-14 pl-14 font-body text-base text-navy shadow-suave transition-colors placeholder:text-slate-soft focus:border-blue-300 focus:ring-4 focus:ring-blue-100 focus:outline-none"
            />

            {hayConsulta && (
              <button
                type="button"
                onClick={() => {
                  setConsulta('')
                  campoRef.current?.focus()
                }}
                aria-label="Limpiar la búsqueda"
                className="absolute top-1/2 right-4 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-slate transition-colors hover:bg-blue-50 hover:text-navy"
              >
                <X size={17} aria-hidden />
              </button>
            )}
          </div>

          {!hayConsulta && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className="font-body text-[13px] text-slate">Pruebe con:</span>
              {SUGERENCIAS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setConsulta(s)}
                  className="min-h-9 rounded-full border border-line bg-white px-4 font-body text-[13px] text-slate transition-colors hover:border-blue-300 hover:text-blue-700"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* El recuento se anuncia solo cuando cambia, sin mover el foco: quien
              usa lector de pantalla necesita saber que la lista cambió. */}
          <p aria-live="polite" className="mt-6 text-center font-body text-sm text-slate">
            {hayConsulta &&
              (resultados.length
                ? `${resultados.length} ${resultados.length === 1 ? 'resultado' : 'resultados'} para «${consulta.trim()}»`
                : '')}
          </p>
        </div>
      </div>

      {hayConsulta && resultados.length > 0 && (
        <div className="section mt-4 space-y-12 pb-8">
          {porCategoria.map(({ categoria, items }) => (
            <section key={categoria}>
              <h2 className="font-body text-[11px] font-semibold tracking-[0.12em] text-slate uppercase">
                {categoria}
              </h2>

              <ul className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items.map(({ icon: Icono, titulo, resumen, href }) => (
                  <li key={href}>
                    <Link href={href} className="tarjeta group flex h-full flex-col p-6">
                      <span className="flex items-center gap-3">
                        <Icono size={18} aria-hidden className="shrink-0 text-blue-500" />
                        <span className="font-display font-medium text-navy">{titulo}</span>
                      </span>

                      {resumen && (
                        <span className="mt-3 font-body text-sm leading-relaxed text-slate">
                          {resumen}
                        </span>
                      )}

                      <span className="mt-auto flex items-center gap-1.5 pt-5 font-body text-sm font-semibold text-blue-700">
                        Ver detalle
                        <ArrowRight
                          size={14}
                          aria-hidden
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      {hayConsulta && resultados.length === 0 && (
        <div className="section pb-8">
          <div className="tarjeta mx-auto max-w-xl p-10 text-center">
            <p className="font-display text-xl font-medium text-navy">
              Sin resultados para «{consulta.trim()}»
            </p>

            {/* Un callejón sin salida es la peor pantalla de un buscador. Si no
                encontramos el término, que al menos encuentre a una persona. */}
            <p className="mx-auto mt-4 max-w-md text-center font-body text-sm leading-relaxed text-slate">
              Puede que el término no esté en el sitio, pero sí en nuestra práctica.
              Pregúntenos directamente: un ajustador le dice en la misma llamada si
              es un caso que atendemos.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a href="tel:+18097929384" className="btn">
                <Phone size={15} aria-hidden />
                809-792-9384
              </a>
              <button type="button" onClick={() => setConsulta('')} className="btn-claro">
                Limpiar la búsqueda
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
