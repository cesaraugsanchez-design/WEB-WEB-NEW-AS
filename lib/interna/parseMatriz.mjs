import ExcelJS from 'exceljs'
import { COL, claveTexto, formaCanonica, normalizarEstatus } from './esquema.js'

const HOJA = 'Secuencia de reclamos'

function aTexto(valor) {
  if (valor == null) return ''
  if (typeof valor === 'object') {
    if (valor.richText) return valor.richText.map((t) => t.text).join('').trim()
    if (valor.text != null) return String(valor.text).trim()
    if (valor.result != null) return String(valor.result).trim()
    return ''
  }
  return String(valor).trim()
}

/**
 * Excel guarda fechas como día serial desde 1899-12-30 y exceljs las entrega
 * como Date en UTC. Se recorta a AAAA-MM-DD para que la zona horaria del
 * servidor no corra un caso al día anterior.
 */
function aFechaISO(valor) {
  if (valor == null || valor === '') return null
  let d = valor
  if (typeof valor === 'object' && valor.result != null) d = valor.result
  if (d instanceof Date) {
    if (Number.isNaN(d.getTime())) return null
    return d.toISOString().slice(0, 10)
  }
  if (typeof d === 'number' && Number.isFinite(d)) {
    const ms = Math.round((d - 25569) * 86400000)
    return new Date(ms).toISOString().slice(0, 10)
  }
  const texto = aTexto(d)
  const m = texto.match(/^(\d{4})-(\d{2})-(\d{2})/)
  return m ? m[0] : null
}

function tienePaso(valor) {
  return aTexto(valor) !== ''
}

/**
 * Agrupa las variantes de un mismo texto que sólo difieren en mayúsculas —tal
 * como las une Excel— y devuelve un mapa clave→grafía canónica. Las variantes
 * que difieren de verdad («Julio M.» vs «julio Medina») se dejan separadas a
 * propósito: unirlas sería adivinar, y el tablero las muestra para que el
 * equipo las corrija en la matriz.
 */
function construirCanon(filas, campo) {
  const grupos = new Map()
  for (const fila of filas) {
    const bruto = fila[campo]
    if (!bruto) continue
    const k = claveTexto(bruto)
    if (!grupos.has(k)) grupos.set(k, [])
    grupos.get(k).push(bruto)
  }
  const canon = new Map()
  for (const [k, valores] of grupos) canon.set(k, formaCanonica(valores))
  return canon
}

export async function parsearMatriz(origen) {
  const libro = new ExcelJS.Workbook()
  if (Buffer.isBuffer(origen)) await libro.xlsx.load(origen)
  else await libro.xlsx.readFile(origen)

  const hoja = libro.getWorksheet(HOJA)
  if (!hoja) {
    const nombres = libro.worksheets.map((h) => h.name).join(', ')
    throw new Error(`No se encontró la hoja «${HOJA}». Hojas disponibles: ${nombres}`)
  }

  const brutas = []
  hoja.eachRow({ includeEmpty: false }, (fila, numero) => {
    if (numero === 1) return // encabezados
    const c = (i) => fila.getCell(i).value

    const referencia = aTexto(c(COL.referencia))
    const noReclamo = aTexto(c(COL.noReclamo))
    const asegurado = aTexto(c(COL.asegurado))
    const apoderamiento = aFechaISO(c(COL.apoderamiento))

    // Las filas de fórmula en blanco al final de la hoja no traen ninguno de estos.
    if (!referencia && !noReclamo && !asegurado && !apoderamiento) return

    brutas.push({
      fila: numero,
      aseguradora: aTexto(c(COL.aseguradora)),
      asegurado,
      apoderamiento,
      ramo: aTexto(c(COL.ramo)),
      division: aTexto(c(COL.division)),
      noReclamo,
      referencia,
      oficial: aTexto(c(COL.oficial)),
      estatus: aTexto(c(COL.estatus)),
      cierre: aFechaISO(c(COL.cierre)),
      ajustador: aTexto(c(COL.ajustador)),
      planReset: aTexto(c(COL.planReset)),
      pasos: [
        tienePaso(c(COL.paso1)),
        tienePaso(c(COL.paso2)),
        tienePaso(c(COL.paso3)),
        tienePaso(c(COL.paso4)),
        tienePaso(c(COL.paso5)),
        tienePaso(c(COL.paso6)),
      ],
    })
  })

  const canon = {
    aseguradora: construirCanon(brutas, 'aseguradora'),
    ramo: construirCanon(brutas, 'ramo'),
    division: construirCanon(brutas, 'division'),
    oficial: construirCanon(brutas, 'oficial'),
    ajustador: construirCanon(brutas, 'ajustador'),
  }
  const unificar = (campo, valor) =>
    valor ? canon[campo].get(claveTexto(valor)) ?? valor : null

  const registros = brutas.map((r) => ({
    fila: r.fila,
    aseguradora: unificar('aseguradora', r.aseguradora),
    asegurado: r.asegurado || null,
    apoderamiento: r.apoderamiento,
    ramo: unificar('ramo', r.ramo),
    division: unificar('division', r.division),
    noReclamo: r.noReclamo || null,
    referencia: r.referencia || null,
    oficial: unificar('oficial', r.oficial),
    estatus: normalizarEstatus(r.estatus),
    cierre: r.cierre,
    ajustador: unificar('ajustador', r.ajustador),
    planReset: r.planReset || null,
    pasos: r.pasos,
  }))

  return {
    registros,
    generado: new Date().toISOString(),
  }
}
