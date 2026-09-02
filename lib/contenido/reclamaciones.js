/**
 * Contador de reclamaciones gestionadas.
 *
 * ⚠️ ESTO ES UNA PROYECCION, NO UN DATO MEDIDO.
 *
 * Parte de una cifra real —BASE, a fecha DESDE— y le suma el ritmo diario que
 * ASSANCH indico: entre 3 y 5 casos por dia. Mientras ese ritmo se cumpla, el
 * numero en pantalla se parece al real. En cuanto deje de cumplirse, empezara a
 * separarse de la verdad y seguira subiendo igual, porque no lo alimenta nada.
 *
 * TODO(cliente): revisar BASE cada pocos meses con el numero real de expedientes
 * y actualizar tambien DESDE. Un contador que lleva dos anos inventando ya no es
 * una proyeccion, es una cifra falsa en la pagina de una firma que vive de su
 * criterio tecnico.
 *
 * NO es aleatorio en cada visita. El incremento de cada dia se deriva de la
 * propia fecha, asi que todos los visitantes de un mismo dia ven exactamente el
 * mismo numero y recargar no lo mueve. Un contador que cambia al refrescar se
 * lee como lo que seria: inventado.
 */
export const BASE = 3603
export const DESDE = '2026-09-02'

const MIN_DIARIO = 3
const MAX_DIARIO = 5

/* Mezclador determinista: de un numero de dia sale siempre el mismo incremento.
   No busca calidad estadistica, solo que la serie no sea plana ni previsible a
   simple vista. */
function incrementoDelDia(dia) {
  let x = (dia + 1) * 2654435761
  x ^= x << 13
  x ^= x >>> 17
  x ^= x << 5
  const rango = MAX_DIARIO - MIN_DIARIO + 1
  return MIN_DIARIO + (Math.abs(x) % rango)
}

/**
 * Total proyectado a dia de hoy.
 *
 * Se calcula en UTC a proposito: es la unica referencia que da el mismo dia en
 * el servidor y en el navegador de quien mira, sin importar su zona horaria.
 */
export function totalReclamaciones(ahora = new Date()) {
  const [a, m, d] = DESDE.split('-').map(Number)
  const inicio = Date.UTC(a, m - 1, d)
  const hoy = Date.UTC(ahora.getUTCFullYear(), ahora.getUTCMonth(), ahora.getUTCDate())

  const dias = Math.max(0, Math.floor((hoy - inicio) / 86400000))

  let total = BASE
  for (let i = 0; i < dias; i++) total += incrementoDelDia(i)
  return total
}
