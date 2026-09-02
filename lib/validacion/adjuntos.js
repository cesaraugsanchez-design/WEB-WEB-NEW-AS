/**
 * Reglas de adjuntos, compartidas por cliente y servidor.
 *
 * VARIANTE ELEGIDA: multipart directo, SIN dependencias nuevas.
 *
 * Eso fija el tope en 4 MB para el conjunto, no los 15 MB por archivo del
 * original: una funcion serverless de Vercel no admite un cuerpo de peticion
 * mayor de ~4,5 MB. Para subir a 10 archivos de 15 MB haria falta migrar a
 * Vercel Blob (dependencia `@vercel/blob` + un Blob store con la variable
 * BLOB_READ_WRITE_TOKEN); el resto del formulario no cambiaria.
 */
export const MAX_ARCHIVOS = 6
export const MAX_TOTAL = 4 * 1024 * 1024 // 4 MB entre todos

/* Se acepta cualquier formato salvo lo ejecutable: subir un .exe a un buzon de
   reclamos no tiene uso legitimo y si convierte el correo en un vector. */
export const EXTENSIONES_BLOQUEADAS = [
  '.exe', '.bat', '.cmd', '.com', '.scr', '.msi', '.dll', '.jar',
  '.sh', '.ps1', '.vbs', '.js', '.app', '.apk', '.deb', '.dmg',
]

export const FORMATOS_SUGERIDOS = 'PDF · Word · Excel · JPG · PNG · HEIC · ZIP'

export function extensionBloqueada(nombre = '') {
  const punto = nombre.lastIndexOf('.')
  if (punto < 0) return false
  return EXTENSIONES_BLOQUEADAS.includes(nombre.slice(punto).toLowerCase())
}

export function sanearNombre(nombre = '') {
  return nombre.replace(/[^\w.\-]/g, '_').slice(0, 120)
}

export function tamanoLegible(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** Valida un lote contra los limites. Devuelve { aceptados, rechazados }. */
export function filtrarArchivos(nuevos, yaAceptados = []) {
  const aceptados = [...yaAceptados]
  const rechazados = []
  let total = aceptados.reduce((s, a) => s + a.size, 0)

  for (const f of nuevos) {
    if (aceptados.length >= MAX_ARCHIVOS) {
      rechazados.push({ nombre: f.name, motivo: `Máximo ${MAX_ARCHIVOS} archivos` })
      continue
    }
    if (extensionBloqueada(f.name)) {
      rechazados.push({ nombre: f.name, motivo: 'Formato no admitido' })
      continue
    }
    if (total + f.size > MAX_TOTAL) {
      rechazados.push({ nombre: f.name, motivo: `Supera los ${tamanoLegible(MAX_TOTAL)} en total` })
      continue
    }
    aceptados.push(f)
    total += f.size
  }
  return { aceptados, rechazados, total }
}
