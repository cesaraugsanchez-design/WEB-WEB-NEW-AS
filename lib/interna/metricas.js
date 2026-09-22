import {
  ESTATUS,
  META_CICLO_DIAS,
  METAS_RESET,
  MESES,
  claveTexto,
  diasEntre,
  anioDe,
  mesDe,
} from './esquema.js'

export const DIMENSIONES = [
  { campo: 'anio', etiqueta: 'Año' },
  { campo: 'estatus', etiqueta: 'Estatus' },
  { campo: 'division', etiqueta: 'División' },
  { campo: 'ramo', etiqueta: 'Ramo asegurado' },
  { campo: 'aseguradora', etiqueta: 'Aseguradora' },
  { campo: 'ajustador', etiqueta: 'Ajustador' },
]

const SIN = {
  anio: 'Sin fecha',
  estatus: 'Sin estatus',
  division: 'Sin división',
  ramo: 'Sin ramo',
  aseguradora: 'Sin aseguradora',
  ajustador: 'Sin asignar',
  oficial: 'Sin oficial',
}

/**
 * «Sin aseguradora» no es una aseguradora. Estas etiquetas son huecos de
 * captura, y mezclarlas en un ranking las hace competir con las categorías
 * reales —«Sin ramo» entraba segundo, por delante de todo salvo Automóvil—.
 * Se marcan aquí para que los paneles las saquen de las barras y las cuenten
 * aparte: excluirlas del dibujo no es lo mismo que esconderlas.
 */
const ETIQUETAS_SIN = new Set(Object.values(SIN))
export const esHueco = (etiqueta) => ETIQUETAS_SIN.has(etiqueta)

/** Un expediente abierto por encima de este umbral ya es cola vieja, no trabajo en curso. */
export const DIAS_ANTIGUO = 180

const valorDe = (registro, campo) =>
  campo === 'anio' ? anioDe(registro.apoderamiento) : registro[campo]

const etiquetaDe = (registro, campo) => valorDe(registro, campo) ?? SIN[campo] ?? '(sin dato)'

/** Los filtros son listas de valores admitidos; una lista vacía no filtra nada. */
export function aplicarFiltros(registros, filtros = {}) {
  const activos = DIMENSIONES.map((d) => d.campo).filter(
    (campo) => filtros[campo]?.length,
  )
  if (!activos.length) return registros
  return registros.filter((r) =>
    activos.every((campo) => filtros[campo].includes(String(etiquetaDe(r, campo)))),
  )
}

/** Valores disponibles por dimensión, con su conteo, calculados sobre todo el universo. */
export function opcionesDeFiltro(registros) {
  const salida = {}
  for (const { campo } of DIMENSIONES) {
    const conteo = new Map()
    for (const r of registros) {
      const v = String(etiquetaDe(r, campo))
      conteo.set(v, (conteo.get(v) ?? 0) + 1)
    }
    let lista = [...conteo].map(([valor, n]) => ({ valor, n, hueco: esHueco(valor) }))
    if (campo === 'anio') {
      // Un «2029» suelto es un tecleo, no un año de trabajo. Las gráficas ya lo
      // excluían, pero el filtro seguía ofreciéndolo: elegirlo dejaba el tablero
      // entero en un expediente y todos los paneles en blanco. Se cae aquí, y el
      // panel de calidad lo sigue reportando con su fila para corregirlo.
      lista = lista.filter((o) => o.hueco || anioPlausible(Number(o.valor)))
      lista.sort((a, b) => Number(a.hueco) - Number(b.hueco) || Number(b.valor) - Number(a.valor))
    } else {
      lista.sort((a, b) => Number(a.hueco) - Number(b.hueco) || b.n - a.n)
    }
    salida[campo] = lista
  }
  return salida
}

const esCerrado = (r) => r.estatus === 'Cerrado'
const esAbierto = (r) => r.estatus === 'Abierto'

function agrupar(registros, campo) {
  const m = new Map()
  for (const r of registros) {
    const k = String(etiquetaDe(r, campo))
    if (!m.has(k)) m.set(k, { etiqueta: k, hueco: esHueco(k), total: 0, cerrados: 0, abiertos: 0 })
    const g = m.get(k)
    g.total += 1
    if (esCerrado(r)) g.cerrados += 1
    if (esAbierto(r)) g.abiertos += 1
  }
  for (const g of m.values()) g.tasaCierre = g.total ? g.cerrados / g.total : 0
  return [...m.values()].sort((a, b) => b.total - a.total)
}

/**
 * Días entre apoderamiento y cierre sobre los casos cerrados con ambas fechas
 * coherentes. Un cierre anterior al apoderamiento es un error de captura y se
 * descarta en vez de restar días negativos al promedio.
 */
function ciclo(registros) {
  const dias = []
  let descartados = 0
  for (const r of registros) {
    if (!esCerrado(r)) continue
    const d = diasEntre(r.apoderamiento, r.cierre)
    if (d == null) { descartados += 1; continue }
    if (d < 0) { descartados += 1; continue }
    dias.push(d)
  }
  if (!dias.length) return { promedio: null, mediana: null, n: 0, descartados }
  dias.sort((a, b) => a - b)
  const mitad = Math.floor(dias.length / 2)
  return {
    promedio: dias.reduce((a, b) => a + b, 0) / dias.length,
    mediana: dias.length % 2 ? dias[mitad] : (dias[mitad - 1] + dias[mitad]) / 2,
    n: dias.length,
    descartados,
    meta: META_CICLO_DIAS,
  }
}

/**
 * Las seis columnas del proceso documental se llenan juntas o no se llenan, así
 * que no describen un embudo por etapas sino si el expediente tiene su
 * trazabilidad registrada. Se reporta como una sola cifra para no dibujar seis
 * barras idénticas.
 */
function trazabilidad(registros) {
  const total = registros.length
  const conRegistro = registros.filter((r) => r.pasos.some(Boolean))
  const anios = conRegistro.map((r) => anioDe(r.apoderamiento)).filter(Boolean)
  return {
    n: conRegistro.length,
    pct: total ? conRegistro.length / total : 0,
    ultimoAnio: anios.length ? Math.max(...anios) : null,
  }
}

/**
 * Un «2525» o un «1900» en una fecha es un error de tecleo; dejarlo estiraría
 * el eje de la gráfica de años hasta volverla ilegible. Se excluye del gráfico
 * y se reporta aparte en [revisarCalidad].
 */
const PRIMER_ANIO = 2015
export const anioPlausible = (anio) =>
  anio != null && anio >= PRIMER_ANIO && anio <= new Date().getFullYear() + 1

function porAnio(registros) {
  const m = new Map()
  const toca = (anio, campo) => {
    if (!anioPlausible(anio)) return
    if (!m.has(anio)) m.set(anio, { anio, entradas: 0, cierres: 0 })
    m.get(anio)[campo] += 1
  }
  for (const r of registros) {
    toca(anioDe(r.apoderamiento), 'entradas')
    if (r.cierre) toca(anioDe(r.cierre), 'cierres')
  }
  return [...m.values()]
    .sort((a, b) => a.anio - b.anio)
    .map((f) => ({
      ...f,
      tasaCierre: f.entradas ? f.cierres / f.entradas : 0,
      backlog: f.entradas - f.cierres,
    }))
}

function porMes(registros, anio) {
  const filas = MESES.map((nombre, i) => ({ mes: i + 1, nombre, entradas: 0, cierres: 0 }))
  for (const r of registros) {
    if (anioDe(r.apoderamiento) === anio) filas[mesDe(r.apoderamiento) - 1].entradas += 1
    if (r.cierre && anioDe(r.cierre) === anio) filas[mesDe(r.cierre) - 1].cierres += 1
  }
  return filas
}

function planReset(registros) {
  const enPlan = registros.filter((r) => r.planReset)
  const resueltos = enPlan.filter(esCerrado).length
  const porDivision = agrupar(enPlan, 'division').map((g) => ({
    ...g,
    meta: METAS_RESET[g.etiqueta] ?? null,
  }))
  const porObjetivo = new Map()
  for (const r of enPlan) {
    const k = r.planReset
    if (!porObjetivo.has(k)) porObjetivo.set(k, { etiqueta: k, total: 0, cerrados: 0 })
    const g = porObjetivo.get(k)
    g.total += 1
    if (esCerrado(r)) g.cerrados += 1
  }
  return {
    total: enPlan.length,
    resueltos,
    pendientes: enPlan.length - resueltos,
    avance: enPlan.length ? resueltos / enPlan.length : 0,
    porDivision,
    porObjetivo: [...porObjetivo.values()].sort((a, b) => b.total - a.total),
  }
}

/** Casos abiertos ordenados por antigüedad, que es la cola de trabajo real. */
function abiertosPorAntiguedad(registros, hoy, limite = 100) {
  return registros
    .filter(esAbierto)
    .map((r) => ({
      fila: r.fila,
      referencia: r.referencia,
      noReclamo: r.noReclamo,
      asegurado: r.asegurado,
      aseguradora: r.aseguradora,
      division: r.division,
      ajustador: r.ajustador ?? SIN.ajustador,
      oficial: r.oficial ?? SIN.oficial,
      apoderamiento: r.apoderamiento,
      dias: diasEntre(r.apoderamiento, hoy),
      pasosCompletos: r.pasos.filter(Boolean).length,
    }))
    .sort((a, b) => (b.dias ?? -1) - (a.dias ?? -1))
    .slice(0, limite)
}

export function calcularMetricas(registros, { anio = null, hoy = null } = {}) {
  const fecha = hoy ?? new Date().toISOString().slice(0, 10)
  const total = registros.length
  const cerrados = registros.filter(esCerrado).length
  const abiertosTodos = registros.filter(esAbierto)
  const abiertos = abiertosTodos.length
  const abiertosViejos = abiertosTodos.filter(
    (r) => (diasEntre(r.apoderamiento, fecha) ?? 0) > DIAS_ANTIGUO,
  ).length

  const anios = porAnio(registros)
  const anioFoco = anio ?? anios.at(-1)?.anio ?? anioDe(fecha)

  const estatus = ESTATUS.map((e) => ({
    etiqueta: e,
    n: registros.filter((r) => r.estatus === e).length,
  }))
  const sinEstatus = registros.filter((r) => !r.estatus).length
  if (sinEstatus) estatus.push({ etiqueta: SIN.estatus, n: sinEstatus })

  return {
    resumen: {
      total,
      cerrados,
      abiertos,
      abiertosViejos,
      tasaCierre: total ? cerrados / total : 0,
      ciclo: ciclo(registros),
      trazabilidad: trazabilidad(registros),
    },
    estatus,
    porDivision: agrupar(registros, 'division'),
    porRamo: agrupar(registros, 'ramo'),
    porAseguradora: agrupar(registros, 'aseguradora'),
    porAjustador: agrupar(registros, 'ajustador'),
    porOficial: agrupar(registros, 'oficial'),
    anios,
    anioFoco,
    meses: porMes(registros, anioFoco),
    planReset: planReset(registros),
    abiertos: abiertosPorAntiguedad(registros, fecha),
  }
}

/**
 * Señales de captura que el tablero muestra en vez de corregirlas por su
 * cuenta: unificar «Julio M.» con «julio Medina» sería adivinar, y la matriz
 * es la fuente de verdad que debe arreglarse.
 */
export function revisarCalidad(registros) {
  const avisos = []

  const sinFecha = registros.filter((r) => !r.apoderamiento).length
  if (sinFecha) avisos.push({ tipo: 'Sin fecha de apoderamiento', n: sinFecha })

  const absurdas = []
  for (const r of registros) {
    for (const campo of ['apoderamiento', 'cierre']) {
      if (r[campo] && !anioPlausible(anioDe(r[campo]))) {
        absurdas.push(`${r.referencia ?? r.fila} (${campo}): ${r[campo]}`)
      }
    }
  }
  if (absurdas.length) {
    avisos.push({
      tipo: 'Fecha fuera de rango razonable',
      n: absurdas.length,
      detalle: absurdas.slice(0, 5),
    })
  }

  const invertidas = registros.filter(
    (r) => r.apoderamiento && r.cierre && r.cierre < r.apoderamiento,
  )
  if (invertidas.length) {
    avisos.push({
      tipo: 'Cierre anterior al apoderamiento',
      n: invertidas.length,
      detalle: invertidas.slice(0, 5).map((r) => `${r.referencia ?? r.fila}`),
    })
  }

  const sinEstatus = registros.filter((r) => !r.estatus).length
  if (sinEstatus) avisos.push({ tipo: 'Sin estatus', n: sinEstatus })

  const cerradosSinFecha = registros.filter((r) => esCerrado(r) && !r.cierre).length
  if (cerradosSinFecha) avisos.push({ tipo: 'Cerrado sin fecha de cierre', n: cerradosSinFecha })

  // El ciclo promedio solo cuenta expedientes cerrados, así que estas fechas de
  // cierre quedan fuera del cálculo hasta que el estatus se corrija.
  const cierreSinCerrar = registros.filter((r) => r.cierre && !esCerrado(r)).length
  if (cierreSinCerrar) {
    avisos.push({ tipo: 'Con fecha de cierre pero sin estatus «Cerrado»', n: cierreSinCerrar })
  }

  const traz = trazabilidad(registros)
  if (traz.ultimoAnio && traz.ultimoAnio < new Date().getFullYear()) {
    avisos.push({
      tipo: 'Proceso documental sin registrar',
      n: registros.length - traz.n,
      detalle: [`El último expediente con proceso documental es de ${traz.ultimoAnio}.`],
    })
  }

  // Una referencia repetida cuenta el mismo expediente dos veces en todos los
  // paneles. No se deduplica aquí: cuál de las filas es la buena solo lo sabe
  // quien las capturó, y descartar una a ciegas perdería el dato correcto.
  const porReferencia = new Map()
  for (const r of registros) {
    if (!r.referencia) continue
    const k = claveTexto(r.referencia)
    if (!porReferencia.has(k)) porReferencia.set(k, [])
    porReferencia.get(k).push(r.fila)
  }
  const repetidas = [...porReferencia].filter(([, filas]) => filas.length > 1)
  if (repetidas.length) {
    avisos.push({
      tipo: 'Referencia repetida en más de una fila',
      n: repetidas.reduce((a, [, filas]) => a + filas.length, 0),
      detalle: repetidas
        .slice(0, 5)
        .map(([ref, filas]) => `${ref}: filas ${filas.join(', ')}`),
    })
  }

  const noEstandar = registros.filter((r) => r.estatus && !ESTATUS.includes(r.estatus))
  if (noEstandar.length) {
    avisos.push({
      tipo: 'Estatus fuera del catálogo',
      n: noEstandar.length,
      detalle: [...new Set(noEstandar.map((r) => r.estatus))].slice(0, 5),
    })
  }

  return avisos
}
