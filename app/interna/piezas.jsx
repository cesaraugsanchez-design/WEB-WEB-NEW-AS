'use client'

const numero = new Intl.NumberFormat('es-DO')
const decimal = new Intl.NumberFormat('es-DO', { maximumFractionDigits: 1 })

export const n = (v) => numero.format(v ?? 0)
export const pct = (v) => `${decimal.format((v ?? 0) * 100)} %`
export const dec = (v) => (v == null ? '—' : decimal.format(v))

export function Panel({ titulo, nota, children, className = '' }) {
  return (
    <section
      className={`rounded-2xl border border-line bg-white p-5 shadow-suave ${className}`}
    >
      <header className="mb-4">
        <h2 className="font-display text-sm font-600 tracking-wide text-navy uppercase">
          {titulo}
        </h2>
        {nota ? <p className="mt-1 text-xs text-slate">{nota}</p> : null}
      </header>
      {children}
    </section>
  )
}

export function Kpi({ etiqueta, valor, detalle, tono = 'neutro' }) {
  const color =
    tono === 'bien' ? 'text-blue-700' : tono === 'alerta' ? 'text-signalink' : 'text-navy'
  return (
    <div className="rounded-2xl border border-line bg-white p-4 shadow-suave">
      <p className="text-xs font-500 tracking-wide text-slate uppercase">{etiqueta}</p>
      <p className={`mt-2 font-display text-3xl font-600 tabular-nums ${color}`}>{valor}</p>
      {detalle ? <p className="mt-1 text-xs text-slate">{detalle}</p> : null}
    </div>
  )
}

/** Ranking horizontal: la longitud se mide contra el mayor de la lista. */
export function Ranking({ filas, columnas = ['total', 'cerrados'], vacio = 'Sin datos' }) {
  if (!filas.length) return <p className="text-sm text-slate">{vacio}</p>
  const max = Math.max(...filas.map((f) => f.total), 1)
  return (
    <ul className="space-y-2.5">
      {filas.map((f) => (
        <li key={f.etiqueta}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate text-tinta">{f.etiqueta}</span>
            <span className="shrink-0 tabular-nums text-slate">
              {columnas.includes('total') ? n(f.total) : null}
              {columnas.includes('cerrados') ? (
                <span className="text-slate-soft"> · {n(f.cerrados)} cerr.</span>
              ) : null}
              {columnas.includes('tasa') ? (
                <span className="ml-2 font-500 text-navy">{pct(f.tasaCierre)}</span>
              ) : null}
            </span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-line-soft">
            <div className="flex h-full">
              <div
                className="h-full rounded-full bg-blue-700"
                style={{ width: `${(f.cerrados / max) * 100}%` }}
              />
              <div
                className="h-full rounded-r-full bg-blue-300"
                style={{ width: `${((f.total - f.cerrados) / max) * 100}%` }}
              />
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

/**
 * Barras agrupadas de entradas contra cierres. Se dibuja en SVG con
 * `preserveAspectRatio` libre para que escale con el contenedor sin necesitar
 * medir el ancho en el cliente.
 */
export function BarrasDobles({ filas, claveX, alto = 150 }) {
  const max = Math.max(...filas.flatMap((f) => [f.entradas, f.cierres]), 1)
  const ancho = filas.length * 40
  const y = (v) => alto - (v / max) * (alto - 16)

  return (
    <div>
      <svg
        viewBox={`0 0 ${ancho} ${alto}`}
        preserveAspectRatio="none"
        className="h-40 w-full"
        role="img"
        aria-label="Entradas y cierres por periodo"
      >
        {filas.map((f, i) => (
          <g key={f[claveX]} transform={`translate(${i * 40} 0)`}>
            <rect x="6" y={y(f.entradas)} width="13" height={alto - y(f.entradas)} rx="2" fill="var(--color-blue-300)" />
            <rect x="21" y={y(f.cierres)} width="13" height={alto - y(f.cierres)} rx="2" fill="var(--color-blue-700)" />
          </g>
        ))}
      </svg>
      <div className="mt-1 flex">
        {filas.map((f) => (
          <div key={f[claveX]} className="flex-1 text-center text-[10px] leading-tight text-slate">
            <span className="block">{String(f[claveX]).slice(0, 3)}</span>
            <span className="block tabular-nums text-slate-soft">
              {n(f.entradas)}/{n(f.cierres)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Leyenda() {
  return (
    <div className="flex items-center gap-4 text-xs text-slate">
      <span className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-blue-300" /> Entradas
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-blue-700" /> Cierres
      </span>
    </div>
  )
}
