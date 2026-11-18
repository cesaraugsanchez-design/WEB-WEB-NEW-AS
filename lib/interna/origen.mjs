import { readFile } from 'node:fs/promises'
import { parsearMatriz } from './parseMatriz.mjs'

// Coordenadas del archivo en SharePoint. No son secretas —el secreto es la
// credencial— así que viven aquí para que configurar el entorno se reduzca a
// las tres variables de la aplicación de Entra ID.
//
// El ID del archivo sobrevive a renombrarlo o moverlo, pero NO a borrarlo y
// subirlo de nuevo: entonces SharePoint le da otro y el tablero responde 404.
// Pasó el 18 de noviembre de 2026, cuando la matriz reapareció como
// «MATRIZ Secuencia Ref., facts. y NCF 1.xlsx» en
// ASSANCH/Administrativos/MATRIZ Seguimiento Exptes y Ref. Si vuelve a dar
// 404, se busca el archivo en esa carpeta y se cambia el ID aquí (o se define
// MATRIZ_ITEM_ID en Vercel).
const DRIVE_ID =
  process.env.MATRIZ_DRIVE_ID ??
  'b!EmfGz2DxUkGrzJ18jvWyPpVUfpbTEr5PpA3x2zpTNzkC2N8U5NcoQI1Ccp45rLnS'
const ITEM_ID = process.env.MATRIZ_ITEM_ID ?? '01KX4SNQ7UK5WPOSDYG5EJTHBUIKGADUCZ'

/**
 * El equipo actualiza la matriz durante todo el día, así que se relee cada
 * media hora en vez de una vez al día: la descarga tarda pocos segundos y así
 * el tablero nunca muestra algo de ayer.
 */
const TTL_MS = 30 * 60 * 1000

let cache = null
let enVuelo = null

function configurado() {
  return Boolean(
    process.env.MS_TENANT_ID && process.env.MS_CLIENT_ID && process.env.MS_CLIENT_SECRET,
  )
}

async function tokenGraph() {
  const url = `https://login.microsoftonline.com/${process.env.MS_TENANT_ID}/oauth2/v2.0/token`
  const respuesta = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.MS_CLIENT_ID,
      client_secret: process.env.MS_CLIENT_SECRET,
      scope: 'https://graph.microsoft.com/.default',
      grant_type: 'client_credentials',
    }),
    cache: 'no-store',
  })
  if (!respuesta.ok) {
    /* Solo el estado HTTP no basta para saber qué arreglar: un 400 puede ser
       una aplicación borrada o deshabilitada, un inquilino mal escrito o un
       permiso retirado. Microsoft devuelve un código AADSTS que lo dice, y se
       muestra. Ese código y la primera línea de la descripción no llevan
       secretos: el secreto va en la petición, no en la respuesta. */
    const detalle = await respuesta.json().catch(() => ({}))
    const codigo = detalle.error_codes?.[0] ? ` AADSTS${detalle.error_codes[0]}` : ''
    const motivo = detalle.error_description?.split(/\r?\n/)[0]?.replace(/^AADSTS\d+:\s*/, '') ?? ''
    throw new Error(
      `Entra ID rechazó la credencial (${respuesta.status}${codigo})${motivo ? `: ${motivo}` : ''}`,
    )
  }
  const { access_token: token } = await respuesta.json()
  return token
}

/* Plan B si el ID deja de existir: buscar la matriz en su carpeta. ASSANCH
   fijó el 18 de noviembre de 2026 que la matriz oficial es la de esta carpeta;
   si alguien la borra y la sube de nuevo, el tablero la encuentra solo en vez
   de caerse. Entre varias candidatas gana la modificada más recientemente,
   que es la que el equipo está llenando. */
const CARPETA = process.env.MATRIZ_CARPETA ?? 'ASSANCH/Administrativos/MATRIZ Seguimiento Exptes y Ref'
const NOMBRE = /^MATRIZ Secuencia Ref.*\.xlsx$/i

let itemVigente = ITEM_ID

async function buscarEnCarpeta(token) {
  const ruta = CARPETA.split('/').map(encodeURIComponent).join('/')
  const url = `https://graph.microsoft.com/v1.0/drives/${DRIVE_ID}/root:/${ruta}:/children?$select=id,name,lastModifiedDateTime,file&$top=200`
  const respuesta = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' })
  if (!respuesta.ok) return null
  const { value = [] } = await respuesta.json()
  const candidata = value
    .filter((item) => item.file && NOMBRE.test(item.name))
    .sort((a, b) => b.lastModifiedDateTime.localeCompare(a.lastModifiedDateTime))[0]
  return candidata ?? null
}

async function descargar(token, id) {
  return fetch(`https://graph.microsoft.com/v1.0/drives/${DRIVE_ID}/items/${id}/content`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
}

async function descargarDeSharePoint() {
  const token = await tokenGraph()
  let respuesta = await descargar(token, itemVigente)

  if (respuesta.status === 404) {
    const encontrada = await buscarEnCarpeta(token)
    if (encontrada) {
      // Queda en los registros de Vercel para fijar el ID nuevo en el código.
      console.warn(
        `[interna] la matriz ${itemVigente} ya no existe; se usa «${encontrada.name}» (${encontrada.id}). ` +
          'Actualizar ITEM_ID en lib/interna/origen.mjs.',
      )
      itemVigente = encontrada.id
      respuesta = await descargar(token, itemVigente)
    }
  }

  if (!respuesta.ok) {
    throw new Error(
      respuesta.status === 404
        ? `No se encontró la matriz en SharePoint: ni el archivo registrado ni otra «MATRIZ Secuencia Ref…xlsx» en ${CARPETA}`
        : `No se pudo descargar la matriz de SharePoint (${respuesta.status})`,
    )
  }
  return Buffer.from(await respuesta.arrayBuffer())
}

async function leer() {
  if (configurado()) {
    const buffer = await descargarDeSharePoint()
    const { registros } = await parsearMatriz(buffer)
    return { registros, origen: 'sharepoint', leido: new Date().toISOString() }
  }

  const local = process.env.MATRIZ_LOCAL
  if (!local) {
    throw new Error(
      'Falta configurar el acceso a la matriz: define MS_TENANT_ID, MS_CLIENT_ID y ' +
        'MS_CLIENT_SECRET para leer de SharePoint, o MATRIZ_LOCAL para usar una copia local.',
    )
  }
  const { registros } = await parsearMatriz(await readFile(local))
  return { registros, origen: 'local', leido: new Date().toISOString() }
}

export async function cargarMatriz({ forzar = false } = {}) {
  if (!forzar && cache && Date.now() - cache.en < TTL_MS) return cache.datos
  // Varias visitas simultáneas tras expirar el TTL comparten una sola descarga.
  if (!enVuelo) {
    enVuelo = leer()
      .then((datos) => {
        cache = { datos, en: Date.now() }
        return datos
      })
      .finally(() => {
        enVuelo = null
      })
  }
  return enVuelo
}
