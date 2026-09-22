import { readFile } from 'node:fs/promises'
import { parsearMatriz } from './parseMatriz.mjs'

// Coordenadas del archivo en SharePoint. No son secretas —el secreto es la
// credencial— así que viven aquí para que configurar el entorno se reduzca a
// las tres variables de la aplicación de Entra ID.
const DRIVE_ID =
  process.env.MATRIZ_DRIVE_ID ??
  'b!EmfGz2DxUkGrzJ18jvWyPpVUfpbTEr5PpA3x2zpTNzkC2N8U5NcoQI1Ccp45rLnS'
const ITEM_ID = process.env.MATRIZ_ITEM_ID ?? '01KX4SNQ55JJMPBXFXFZC2CPY6ZTKOM66C'

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
    throw new Error(`Entra ID rechazó la credencial (${respuesta.status})`)
  }
  const { access_token: token } = await respuesta.json()
  return token
}

async function descargarDeSharePoint() {
  const token = await tokenGraph()
  const url = `https://graph.microsoft.com/v1.0/drives/${DRIVE_ID}/items/${ITEM_ID}/content`
  const respuesta = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  if (!respuesta.ok) {
    throw new Error(`No se pudo descargar la matriz de SharePoint (${respuesta.status})`)
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
