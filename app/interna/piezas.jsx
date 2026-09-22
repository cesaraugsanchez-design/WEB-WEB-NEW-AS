'use client'

const numero = new Intl.NumberFormat('es-DO')
const decimal = new Intl.NumberFormat('es-DO', { maximumFractionDigits: 1 })

export const n = (v) => numero.format(v ?? 0)
export const pct = (v) => `${decimal.format((v ?? 0) * 100)} %`
export const dec = (v) => (v == null ? '—' : decimal.format(v))

export function Panel({ titulo, nota, pie, children, className = '' }) {
  return (
    <section
      className={`flex flex-col rounded-2xl border border-line bg-white p-5 shadow-suave transition-shadow hover:shadow-media ${className}`}
    >
      <header className="mb-4">
        <h2 className="font-display text-sm font-600 tracking-wide text-navy uppercase">
          {titulo}
        </h2>
        {nota ? <p className="mt-1 text-xs leading-relaxed text-slate">{nota}</p> : null}
      </header>
      <div className="flex-1">{children}</div>
      {pie ? (
        <p className="mt-4 border-t border-line-soft pt-3 text-xs text-slate-soft">{pie}</p>
      ) : null}
    </section>
  )
}

/**
 * El filete superior es el único color del bloque: el número va siempre en
 * navy. Teñir una cifra de rojo la convierte en un juicio, y «ciclo promedio»
 * ya lleva su meta escrita debajo para que el lector saque la conclusión.
 */
export function Kpi({ etiqueta, valor, detalle, tono = 'neutro' }) {
  const filete =
    tono === 'bien' ? 'bg-gold' : tono === 'alerta' ? 'bg-signal' : 'bg-blue-300'
  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-white p-4 pt-5 shadow-suave transition-shadow hover:shadow-media">
      <span aria-hidden className={`absolute inset-x-0 top-0 h-1 ${filete}`} />
      <p className="text-[11px] font-600 tracking-[0.1em] text-slate uppercase">{etiqueta}</p>
      <p className="mt-2 font-display text-[2rem] leading-none font-600 text-navy tabular-nums">
        {valor}
      </p>
      {detalle ? <p className="mt-2 text-xs leading-relaxed text-slate">{detalle}</p> : null}
    </div>
  )
}

/**
 * Dos frases para dirección, construidas con las cifras de la selección activa
 * —no con el universo—, así que cambian al filtrar. Es texto, no gráfico, a
 * propósito: quien abre el tablero entre reuniones necesita la conclusión antes
 * que el detalle.
 */
export function ResumenEjecutivo({ lineas }) {
  return (
    <section className="rounded-2xl border border-line bg-gradient-to-br from-blue-50 to-white p-5 shadow-suave">
      <p className="text-[11px] font-600 tracking-[0.1em] text-goldink uppercase">
        Resumen para dirección
      </p>
      <div className="mt-2 space-y-1">
        {lineas.map((l) => (
          <p key={l} className="font-body text-[15px] leading-relaxed text-tinta">
            {l}
          </p>
        ))}
      </div>
    </section>
  )
}

/**
 * Ranking horizontal: la longitud se mide contra el mayor de la lista. Las
 * etiquetas marcadas como hueco («Sin ramo», «Sin asignar») salen de las barras
 * y se resumen al pie: no son categorías, y dentro del ranking desplazaban a
 * las que sí lo son.
 */
export function Ranking({ filas, columnas = ['total', 'cerrados'], limite, vacio = 'Sin datos' }) {
  // El corte se aplica DESPUÉS de apartar los huecos: recortando antes, un
  // «Sin ramo» en cabeza se comía uno de los siete puestos de la tabla.
  const huecos = filas.filter((f) => f.hueco)
  let visibles = filas.filter((f) => !f.hueco)
  const ocultas = limite ? Math.max(visibles.length - limite, 0) : 0
  if (limite) visibles = visibles.slice(0, limite)
  if (!visibles.length) return <p className="text-sm text-slate">{vacio}</p>
  const max = Math.max(...visibles.map((f) => f.total), 1)

  return (
    <>
      <ul className="space-y-3">
        {visibles.map((f) => (
          <li key={f.etiqueta} className="group">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="truncate text-tinta">{f.etiqueta}</span>
              <span className="shrink-0 tabular-nums text-slate">
                {columnas.includes('total') ? n(f.total) : null}
                {columnas.includes('cerrados') ? (
                  <span className="text-goldink"> · {n(f.cerrados)} cerr.</span>
                ) : null}
                {columnas.includes('tasa') ? (
                  <span className="ml-2 font-600 text-navy">{pct(f.tasaCierre)}</span>
                ) : null}
              </span>
            </div>
            <div className="mt-1.5 flex h-2 overflow-hidden rounded-full bg-line-soft">
              <div
                className="h-full bg-gold transition-[width] duration-500"
                style={{ width: `${(f.cerrados / max) * 100}%` }}
              />
              <div
                className="h-full bg-blue-300 transition-[width] duration-500"
                style={{ width: `${((f.total - f.cerrados) / max) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
      {huecos.length || ocultas ? (
        <p className="mt-4 border-t border-line-soft pt-3 text-xs text-slate-soft">
          {[
            huecos.length
              ? `Fuera del ranking: ${huecos
                  .map((h) => `${n(h.total)} ${h.etiqueta.toLowerCase()}`)
                  .join(' · ')}`
              : null,
            ocultas ? `${n(ocultas)} categorías más con menos volumen` : null,
          ]
            .filter(Boolean)
            .join('. ')}
          .
        </p>
      ) : null}
    </>
  )
}

/**
 * Barras agrupadas de entradas contra cierres, en HTML y no en SVG: el SVG
 * anterior escalaba con `preserveAspectRatio="none"`, que deforma cualquier
 * texto que se le meta dentro, y las cifras encima de cada barra habrían salido
 * estiradas. Con cajas flex el número es texto normal y se lee igual en móvil.
 */
export function BarrasDobles({ filas, claveX, etiquetaCorta = true }) {
  const max = Math.max(...filas.flatMap((f) => [f.entradas, f.cierres]), 1)
  // El 82 % deja sitio arriba para la cifra; sin ese tope, la barra más alta
  // empujaría su propio número fuera del marco.
  const altura = (v) => (v ? `${Math.max((v / max) * 82, 1.5)}%` : '0%')

  // 44 px por periodo es lo que necesitan dos cifras de cuatro dígitos sin
  // solaparse. En un móvil los doce meses no caben, así que el panel se
  // desplaza en horizontal en vez de apretar los números hasta juntarlos —el
  // mismo recurso que la tabla de expedientes abiertos—.
  return (
    <div className="-mx-1 overflow-x-auto px-1">
      <div style={{ minWidth: `${filas.length * 44}px` }}>
        <div className="flex h-44 items-end gap-1.5">
          {filas.map((f) => (
            <div key={f[claveX]} className="flex h-full flex-1 items-end gap-[2px]">
              <Barra valor={f.entradas} altura={altura(f.entradas)} tono="entradas" />
              <Barra valor={f.cierres} altura={altura(f.cierres)} tono="cierres" />
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-1.5 border-t border-line pt-1.5">
          {filas.map((f) => (
            <div
              key={f[claveX]}
              className="flex-1 truncate text-center text-[11px] text-slate"
              title={String(f[claveX])}
            >
              {etiquetaCorta ? String(f[claveX]).slice(0, 3) : String(f[claveX])}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Barra({ valor, altura, tono }) {
  const esCierre = tono === 'cierres'
  return (
    <div className="flex h-full flex-1 flex-col justify-end">
      <span
        className={`mb-1 text-center text-[10px] leading-none font-600 tabular-nums ${
          esCierre ? 'text-goldink' : 'text-slate'
        }`}
      >
        {valor ? n(valor) : ''}
      </span>
      <div
        className={`w-full rounded-t-[3px] transition-[height] duration-500 ${
          esCierre ? 'bg-gold' : 'bg-blue-300'
        }`}
        style={{ height: altura }}
      />
    </div>
  )
}

export function Leyenda() {
  return (
    <div className="flex items-center gap-4 text-xs text-slate">
      <span className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-[2px] bg-blue-300" /> Entradas
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-[2px] bg-gold" /> Cierres
      </span>
    </div>
  )
}
