'use client'

import { useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CalendarDays } from 'lucide-react'
import Filtro from './Filtro'
import {
  lineasPresentes,
  recursos,
  sectoresPresentes,
  tiposPresentes,
} from '@/lib/contenido/recursos'

const POR_PAGINA = 12

const fmtFecha = new Intl.DateTimeFormat('es-DO', { day: 'numeric', month: 'long', year: 'numeric' })

/* Los filtros viajan en la query string separados por coma, para que una vista
   filtrada se pueda enviar por correo tal cual. */
function leerLista(params, clave) {
  const v = params.get(clave)
  return v ? v.split(',').filter(Boolean) : []
}

export default function ListaRecursos() {
  const params = useSearchParams()
  const router = useRouter()

  const [tipos, setTipos] = useState(() => leerLista(params, 'tipo'))
  const [lineas, setLineas] = useState(() => leerLista(params, 'linea'))
  const [sectores, setSectores] = useState(() => leerLista(params, 'sector'))
  const [pagina, setPagina] = useState(() => Number(params.get('p')) || 1)

  const sincronizar = (t, l, s, p) => {
    const q = new URLSearchParams()
    if (t.length) q.set('tipo', t.join(','))
    if (l.length) q.set('linea', l.join(','))
    if (s.length) q.set('sector', s.join(','))
    if (p > 1) q.set('p', String(p))
    router.replace(q.toString() ? `/recursos?${q}` : '/recursos', { scroll: false })
  }

  /* Cambiar un filtro vuelve a la página 1: quedarse en la 3 de un resultado
     que ahora tiene una sola página deja la pantalla vacía sin explicación. */
  const cambiar = (cual) => (valor) => {
    const t = cual === 'tipo' ? valor : tipos
    const l = cual === 'linea' ? valor : lineas
    const s = cual === 'sector' ? valor : sectores
    setTipos(t); setLineas(l); setSectores(s); setPagina(1)
    sincronizar(t, l, s, 1)
  }

  const limpiar = () => {
    setTipos([]); setLineas([]); setSectores([]); setPagina(1)
    sincronizar([], [], [], 1)
  }

  const filtrados = useMemo(
    () =>
      recursos.filter(
        (r) =>
          (!tipos.length || tipos.includes(r.tipo)) &&
          (!lineas.length || r.lineas.some((x) => lineas.includes(x))) &&
          (!sectores.length || r.sectores.some((x) => sectores.includes(x)))
      ),
    [tipos, lineas, sectores]
  )

  const paginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA))
  const actual = Math.min(pagina, paginas)
  const visibles = filtrados.slice((actual - 1) * POR_PAGINA, actual * POR_PAGINA)
  const hayFiltros = tipos.length + lineas.length + sectores.length > 0

  return (
    <div className="section pb-8">
      <div className="flex flex-wrap items-center justify-end gap-3">
        <span className="mr-auto font-body text-[13px] font-semibold text-slate">Explorar por:</span>
        <Filtro etiqueta="Tipo de recurso" opciones={tiposPresentes} seleccion={tipos} onCambio={cambiar('tipo')} />
        <Filtro etiqueta="Línea de negocio" opciones={lineasPresentes} seleccion={lineas} onCambio={cambiar('linea')} />
        <Filtro etiqueta="Sector" opciones={sectoresPresentes} seleccion={sectores} onCambio={cambiar('sector')} />
      </div>

      <p aria-live="polite" className="mt-5 font-body text-sm text-slate">
        {filtrados.length} {filtrados.length === 1 ? 'recurso' : 'recursos'}
        {hayFiltros && (
          <>
            {' · '}
            <button type="button" onClick={limpiar} className="font-semibold text-blue-700 underline underline-offset-4">
              Limpiar filtros
            </button>
          </>
        )}
      </p>

      {visibles.length > 0 ? (
        <ul className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibles.map((r) => (
            <li key={r.slug}>
              <Link href={`/recursos/${r.slug}`} className="tarjeta group flex h-full flex-col p-7">
                <span className="pildora self-start">{r.tipo}</span>

                <h2 className="mt-5 font-display text-lg leading-snug font-medium text-navy">
                  {r.titulo}
                </h2>

                <p className="mt-3 line-clamp-2 font-body text-sm leading-relaxed text-slate">
                  {r.entradilla}
                </p>

                <span className="mt-auto flex items-center gap-2 pt-6 font-body text-xs text-slate">
                  <CalendarDays size={13} aria-hidden className="text-blue-500" />
                  <time dateTime={r.fecha}>{fmtFecha.format(new Date(`${r.fecha}T12:00:00`))}</time>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="tarjeta mt-7 p-10 text-center">
          <p className="font-display text-lg font-medium text-navy">
            No hay recursos con esos filtros
          </p>
          <p className="mx-auto mt-3 max-w-sm text-center font-body text-sm text-slate">
            Pruebe con menos criterios, o quítelos todos para ver el listado completo.
          </p>
          <button type="button" onClick={limpiar} className="btn-claro mt-7">
            Limpiar filtros
          </button>
        </div>
      )}

      {paginas > 1 && (
        <nav aria-label="Paginación" className="mt-12 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => { setPagina(actual - 1); sincronizar(tipos, lineas, sectores, actual - 1) }}
            disabled={actual === 1}
            aria-label="Página anterior"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-slate disabled:opacity-40"
          >
            ‹
          </button>

          {Array.from({ length: paginas }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => { setPagina(n); sincronizar(tipos, lineas, sectores, n) }}
              aria-current={n === actual ? 'page' : undefined}
              className={`flex h-11 min-w-11 items-center justify-center rounded-full border px-3 font-body text-sm ${
                n === actual ? 'border-blue-700 bg-blue-700 text-white' : 'border-line bg-white text-slate'
              }`}
            >
              {n}
            </button>
          ))}

          <button
            type="button"
            onClick={() => { setPagina(actual + 1); sincronizar(tipos, lineas, sectores, actual + 1) }}
            disabled={actual === paginas}
            aria-label="Página siguiente"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-slate disabled:opacity-40"
          >
            ›
          </button>
        </nav>
      )}
    </div>
  )
}
