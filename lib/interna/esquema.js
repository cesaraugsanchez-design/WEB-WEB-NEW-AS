// Mapa de la hoja «Secuencia de reclamos» de MATRIZ Secuencia Ref., facts. y NCF.xlsx
// Los índices son 1-based, como las columnas de Excel.

export const COL = {
  aseguradora: 1, // A — el encabezado en el archivo trae un nombre de asegurado pegado por error
  asegurado: 2,
  intermediario: 3,
  apoderamiento: 4, // D — fFecEnt
  ramo: 5,
  division: 6,
  cobertura: 7,
  noReclamo: 8,
  referencia: 9,
  oficial: 10,
  estatus: 11, // K — fEst
  cierre: 12, // L — fFecCie
  ajustador: 13,
  apoyo: 14,
  comentario: 15,
  planReset: 16,
  statusReset: 17,
  paso1: 18, // R — fInsp, inicio del embudo documental
  paso2: 19,
  paso3: 20,
  paso4: 21,
  paso5: 22,
  paso6: 23,
}

export const PASOS = [
  'Inspección',
  'Creación de expediente',
  'Solicitud de documentos',
  'Comprobación de costos y docs.',
  'Informe de ajuste',
  'Prueba de pérdida firmada',
]

export const ESTATUS = ['Abierto', 'Cerrado', 'Declinado', 'Desestimado']

export const META_CICLO_DIAS = 45

// Metas del Plan Reset al 01 de septiembre, tomadas de la hoja Dashboard.
export const METAS_RESET = {
  'Riesgos Generales': 0.9,
  Vehiculos: 0.3,
}

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

export { MESES }

/**
 * Excel compara texto sin distinguir mayúsculas, así que «Cerrado» y «cerrado»
 * son el mismo estatus. Replicarlo evita que un mismo valor se parta en dos.
 */
export function claveTexto(valor) {
  if (valor == null) return ''
  return String(valor).trim().toLowerCase()
}

/** Devuelve el valor con la grafía más frecuente del grupo, no la primera que aparezca. */
export function formaCanonica(valores) {
  const conteo = new Map()
  for (const v of valores) {
    const limpio = String(v).trim()
    if (!limpio) continue
    conteo.set(limpio, (conteo.get(limpio) ?? 0) + 1)
  }
  let mejor = ''
  let max = -1
  for (const [v, n] of conteo) {
    if (n > max) { mejor = v; max = n }
  }
  return mejor
}

export function normalizarEstatus(valor) {
  const k = claveTexto(valor)
  if (!k) return null
  return ESTATUS.find((e) => e.toLowerCase() === k) ?? String(valor).trim()
}

export function diasEntre(desde, hasta) {
  if (!desde || !hasta) return null
  const a = new Date(`${desde}T00:00:00Z`).getTime()
  const b = new Date(`${hasta}T00:00:00Z`).getTime()
  if (Number.isNaN(a) || Number.isNaN(b)) return null
  return Math.round((b - a) / 86400000)
}

export function anioDe(iso) {
  return iso ? Number(iso.slice(0, 4)) : null
}

export function mesDe(iso) {
  return iso ? Number(iso.slice(5, 7)) : null
}
