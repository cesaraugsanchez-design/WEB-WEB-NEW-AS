/**
 * Almacén de Interna: Upstash Redis por su API REST, con `fetch` directo y sin
 * SDK —son cinco comandos y no justifican una dependencia—.
 *
 * La integración de Upstash en Vercel crea las variables con el prefijo KV_;
 * una base creada a mano en upstash.com usa UPSTASH_REDIS_. Se aceptan las dos.
 *
 * SIN ALMACÉN NO HAY ACCESO en producción: las cuentas viven aquí, y fallar
 * cerrado es lo correcto cuando lo que se protege es información confidencial.
 * En desarrollo, sin variables, se usa memoria del proceso para poder probar
 * el flujo entero en local; se pierde al reiniciar el servidor, y eso está bien.
 */

const URL_REDIS = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
const TOKEN_REDIS = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN

const EN_MEMORIA = !URL_REDIS && process.env.NODE_ENV !== 'production'

export function almacenConfigurado() {
  return Boolean(URL_REDIS && TOKEN_REDIS) || EN_MEMORIA
}

async function comando(...args) {
  if (!URL_REDIS || !TOKEN_REDIS) throw new Error('Falta configurar el almacén de Interna')
  const respuesta = await fetch(URL_REDIS, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN_REDIS}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
    cache: 'no-store',
  })
  const datos = await respuesta.json().catch(() => ({}))
  if (!respuesta.ok || datos.error) {
    throw new Error(`El almacén de Interna respondió ${respuesta.status}`)
  }
  return datos.result
}

/* Memoria de desarrollo: clave → { valor, vence }. Solo imita lo que se usa.
   Cuelga de globalThis porque en `next dev` cada ruta carga su propia copia
   del módulo: con un Map local, el enlace creado en /api/auth/enlace no
   existiría para la página que lo abre. */
const memoria = (globalThis.__internaMemoria ??= new Map())

function vigente(clave) {
  const entrada = memoria.get(clave)
  if (entrada && entrada.vence && entrada.vence < Date.now()) {
    memoria.delete(clave)
    return undefined
  }
  return entrada
}

export async function leer(clave) {
  if (EN_MEMORIA) return vigente(clave)?.valor ?? null
  return comando('GET', clave)
}

export async function guardar(clave, valor, { segundos } = {}) {
  if (EN_MEMORIA) {
    memoria.set(clave, { valor, vence: segundos ? Date.now() + segundos * 1000 : 0 })
    return
  }
  await (segundos ? comando('SET', clave, valor, 'EX', segundos) : comando('SET', clave, valor))
}

/** Lee y borra en un solo paso: un enlace de un uso no puede canjearse dos veces. */
export async function tomar(clave) {
  if (EN_MEMORIA) {
    const valor = vigente(clave)?.valor ?? null
    memoria.delete(clave)
    return valor
  }
  return comando('GETDEL', clave)
}

export async function borrar(clave) {
  if (EN_MEMORIA) {
    memoria.delete(clave)
    return
  }
  await comando('DEL', clave)
}

/**
 * Suma uno a un contador que caduca a los `segundos` de su primer uso y
 * devuelve el total. Es la base de los límites de intentos.
 */
export async function contar(clave, segundos) {
  if (EN_MEMORIA) {
    const entrada = vigente(clave)
    const total = (entrada?.valor ?? 0) + 1
    memoria.set(clave, { valor: total, vence: entrada?.vence || Date.now() + segundos * 1000 })
    return total
  }
  const total = await comando('INCR', clave)
  if (total === 1) await comando('EXPIRE', clave, segundos)
  return total
}
