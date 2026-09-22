'use client'

import { useMemo, useState } from 'react'
import { aplicarFiltros, calcularMetricas, opcionesDeFiltro, DIMENSIONES } from '@/lib/interna/metricas'
import { META_CICLO_DIAS } from '@/lib/interna/esquema'
import { Panel, Kpi, Ranking, BarrasDobles, Leyenda, n, pct, dec } from './piezas'

const VACIO = Object.fromEntries(DIMENSIONES.map((d) => [d.campo, []]))

function Filtro({ etiqueta, campo, opciones, seleccion, alCambiar }) {
  const activo = seleccion.length > 0
  return (
    <details className="group relative">
      <summary
        className={`flex cursor-pointer list-none items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition ${
          activo
            ? 'border-blue-700 bg-blue-50 text-blue-900'
            : 'border-line bg-white text-tinta hover:border-blue-300'
        }`}
      >
        {etiqueta}
        {activo ? (
          <span className="rounded-full bg-blue-700 px-1.5 text-xs font-600 text-white tabular-nums">
            {seleccion.length}
          </span>
        ) : (
          <span aria-hidden className="text-slate-soft">▾</span>
        )}
      </summary>
      <div className="absolute top-full left-0 z-20 mt-1.5 max-h-72 w-64 overflow-y-auto rounded-xl border border-line bg-white p-2 shadow-media">
        {activo ? (
          <button
            type="button"
            onClick={() => alCambiar(campo, [])}
            className="mb-1 w-full rounded-lg px-2 py-1.5 text-left text-xs text-signalink hover:bg-line-soft"
          >
            Quitar filtro
          </button>
        ) : null}
        {opciones.map((o) => {
          const marcado = seleccion.includes(o.valor)
          return (
            <label
              key={o.valor}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-line-soft"
            >
              <input
                type="checkbox"
                checked={marcado}
                onChange={() =>
                  alCambiar(
                    campo,
                    marcado ? seleccion.filter((v) => v !== o.valor) : [...seleccion, o.valor],
                  )
                }
                className="accent-blue-700"
              />
              <span className="flex-1 truncate text-tinta">{o.valor}</span>
              <span className="text-xs tabular-nums text-slate-soft">{n(o.n)}</span>
            </label>
          )
        })}
      </div>
    </details>
  )
}

export default function TableroInterno({ registros, meta }) {
  const [filtros, setFiltros] = useState(VACIO)

  const opciones = useMemo(() => opcionesDeFiltro(registros), [registros])
  const filtrados = useMemo(() => aplicarFiltros(registros, filtros), [registros, filtros])

  // Con un solo año seleccionado el detalle mensual se refiere a ese año; si no,
  // al más reciente con datos.
  const anioFoco = filtros.anio.length === 1 ? Number(filtros.anio[0]) : null
  const m = useMemo(
    () => calcularMetricas(filtrados, { anio: anioFoco }),
    [filtrados, anioFoco],
  )

  const cambiar = (campo, valores) => setFiltros((prev) => ({ ...prev, [campo]: valores }))
  const hayFiltros = DIMENSIONES.some((d) => filtros[d.campo].length)
  const ciclo = m.resumen.ciclo

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        {DIMENSIONES.map((d) => (
          <Filtro
            key={d.campo}
            campo={d.campo}
            etiqueta={d.etiqueta}
            opciones={opciones[d.campo]}
            seleccion={filtros[d.campo]}
            alCambiar={cambiar}
          />
        ))}
        {hayFiltros ? (
          <button
            type="button"
            onClick={() => setFiltros(VACIO)}
            className="rounded-full px-3 py-1.5 text-sm text-signalink hover:bg-line-soft"
          >
            Limpiar todo
          </button>
        ) : null}
        <p className="ml-auto text-sm text-slate tabular-nums">
          {n(filtrados.length)} de {n(registros.length)} expedientes
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Kpi etiqueta="Expedientes" valor={n(m.resumen.total)} />
        <Kpi etiqueta="Cerrados" valor={n(m.resumen.cerrados)} tono="bien" />
        <Kpi etiqueta="Abiertos" valor={n(m.resumen.abiertos)} />
        <Kpi etiqueta="Tasa de cierre" valor={pct(m.resumen.tasaCierre)} />
        <Kpi
          etiqueta="Ciclo promedio"
          valor={ciclo.promedio == null ? '—' : `${dec(ciclo.promedio)} d`}
          detalle={`Mediana ${dec(ciclo.mediana)} d · meta < ${META_CICLO_DIAS} d`}
          tono={ciclo.promedio > META_CICLO_DIAS ? 'alerta' : 'bien'}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel
          titulo={`Detalle mensual ${m.anioFoco}`}
          nota="Entradas y cierres ocurridos en cada mes."
        >
          <BarrasDobles filas={m.meses} claveX="nombre" />
          <div className="mt-3">
            <Leyenda />
          </div>
        </Panel>

        <Panel titulo="Entradas contra cierres por año" nota="El backlog es la diferencia acumulada de cada año.">
          <BarrasDobles filas={m.anios} claveX="anio" />
          <div className="mt-3 flex items-center justify-between">
            <Leyenda />
            <p className="text-xs text-slate">
              Backlog {m.anios.at(-1)?.anio}:{' '}
              <span className="font-600 text-navy tabular-nums">
                {n(m.anios.at(-1)?.backlog)}
              </span>
            </p>
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel titulo="Por división">
          <Ranking filas={m.porDivision} columnas={['total', 'cerrados', 'tasa']} />
        </Panel>
        <Panel titulo="Por estatus">
          <ul className="space-y-2">
            {m.estatus.map((e) => (
              <li key={e.etiqueta} className="flex items-baseline justify-between text-sm">
                <span className="text-tinta">{e.etiqueta}</span>
                <span className="tabular-nums text-navy">{n(e.n)}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel titulo="Por ramo">
          <Ranking filas={m.porRamo.slice(0, 7)} />
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel titulo="Carga por ajustador" nota="Barra oscura: cerrados. Barra clara: pendientes.">
          <Ranking filas={m.porAjustador} columnas={['total', 'cerrados', 'tasa']} />
        </Panel>
        <Panel titulo="Carga por oficial">
          <Ranking filas={m.porOficial.slice(0, 10)} />
        </Panel>
        <Panel titulo="Aseguradoras">
          <Ranking filas={m.porAseguradora.slice(0, 10)} />
        </Panel>
      </div>

      <Panel
        titulo="Plan Reset"
        nota={`${n(m.planReset.total)} expedientes en el plan · ${n(m.planReset.pendientes)} pendientes`}
      >
        <div className="grid gap-6 lg:grid-cols-3">
          <div>
            <p className="font-display text-4xl font-600 text-navy tabular-nums">
              {pct(m.planReset.avance)}
            </p>
            <p className="mt-1 text-sm text-slate">
              {n(m.planReset.resueltos)} resueltos de {n(m.planReset.total)}
            </p>
          </div>
          <div className="lg:col-span-2 space-y-3">
            {m.planReset.porDivision.map((d) => (
              <div key={d.etiqueta}>
                <div className="flex items-baseline justify-between text-sm">
                  <span className="text-tinta">{d.etiqueta}</span>
                  <span className="tabular-nums text-slate">
                    {n(d.cerrados)}/{n(d.total)}
                    <span className="ml-2 font-600 text-navy">{pct(d.tasaCierre)}</span>
                    {d.meta != null ? (
                      <span
                        className={`ml-2 ${d.tasaCierre >= d.meta ? 'text-blue-700' : 'text-signalink'}`}
                      >
                        meta {pct(d.meta)}
                      </span>
                    ) : null}
                  </span>
                </div>
                <div className="relative mt-1 h-2 overflow-hidden rounded-full bg-line-soft">
                  <div
                    className={`h-full rounded-full ${d.tasaCierre >= (d.meta ?? 0) ? 'bg-blue-700' : 'bg-gold'}`}
                    style={{ width: `${Math.min(d.tasaCierre * 100, 100)}%` }}
                  />
                  {d.meta != null ? (
                    <span
                      className="absolute top-0 h-full w-0.5 bg-navy"
                      style={{ left: `${d.meta * 100}%` }}
                      aria-hidden
                    />
                  ) : null}
                </div>
              </div>
            ))}
            <div className="flex flex-wrap gap-x-5 gap-y-1 pt-1 text-xs text-slate">
              {m.planReset.porObjetivo.map((o) => (
                <span key={o.etiqueta}>
                  {o.etiqueta}:{' '}
                  <span className="tabular-nums text-navy">
                    {n(o.cerrados)}/{n(o.total)}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </Panel>

      <Panel
        titulo="Expedientes abiertos por antigüedad"
        nota="Los 100 más antiguos dentro de la selección actual."
      >
        <div className="-mx-2 overflow-x-auto">
          <table className="w-full min-w-[46rem] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-slate uppercase">
                <th className="px-2 py-2 font-500">Días</th>
                <th className="px-2 py-2 font-500">Referencia</th>
                <th className="px-2 py-2 font-500">Asegurado</th>
                <th className="px-2 py-2 font-500">Aseguradora</th>
                <th className="px-2 py-2 font-500">Ajustador</th>
                <th className="px-2 py-2 font-500">Oficial</th>
              </tr>
            </thead>
            <tbody>
              {m.abiertos.map((r) => (
                <tr key={`${r.referencia}-${r.fila ?? r.noReclamo}`} className="border-b border-line-soft">
                  <td
                    className={`px-2 py-2 font-600 tabular-nums ${r.dias > 180 ? 'text-signalink' : 'text-navy'}`}
                  >
                    {n(r.dias)}
                  </td>
                  <td className="px-2 py-2 text-slate tabular-nums">{r.referencia ?? '—'}</td>
                  <td className="max-w-56 truncate px-2 py-2 text-tinta">{r.asegurado ?? '—'}</td>
                  <td className="px-2 py-2 text-slate">{r.aseguradora ?? '—'}</td>
                  <td className="px-2 py-2 text-slate">{r.ajustador}</td>
                  <td className="px-2 py-2 text-slate">{r.oficial}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {meta.avisos.length ? (
        <Panel
          titulo="Calidad de los datos"
          nota="Se muestran sin corregir: la matriz es la fuente de verdad y es donde deben arreglarse."
        >
          <ul className="space-y-2 text-sm">
            {meta.avisos.map((a) => (
              <li key={a.tipo} className="flex flex-wrap items-baseline gap-x-2">
                <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-xs font-600 text-blue-900 tabular-nums">
                  {n(a.n)}
                </span>
                <span className="text-tinta">{a.tipo}</span>
                {a.detalle ? (
                  <span className="text-xs text-slate-soft">{a.detalle.join(' · ')}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}
    </div>
  )
}
