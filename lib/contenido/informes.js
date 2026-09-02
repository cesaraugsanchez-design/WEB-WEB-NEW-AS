/**
 * Informes semanales del mercado asegurador.
 *
 * CÓMO AÑADIR UNO:
 *   1. Copiar el PDF a `public/informes/` con el nombre `AAAA-MM-DD.pdf`
 *      (la fecha del lunes de esa semana).
 *   2. Añadir una entrada AL PRINCIPIO de este array.
 *
 * `peso` es opcional y solo se muestra si está: quien va a descargar en datos
 * móviles agradece saber si son 400 KB o 12 MB.
 *
 * La lista está vacía a propósito. Un informe de mercado inventado no es
 * contenido de relleno: es una afirmación falsa sobre el mercado asegurador
 * dominicano publicada bajo la firma de ASSANCH.
 */
export const informes = [
  // {
  //   slug: '2026-09-01',
  //   titulo: 'Informe semanal del mercado asegurador',
  //   fecha: '2026-09-01',
  //   resumen: 'Dos o tres líneas sobre lo más relevante de la semana.',
  //   archivo: '/informes/2026-09-01.pdf',
  //   peso: '480 KB',
  // },
]

export const hayInformes = informes.length > 0

/* Ordenados del más reciente al más antiguo, sin depender de que se hayan
   escrito en orden en el array. */
export const informesOrdenados = [...informes].sort((a, b) => b.fecha.localeCompare(a.fecha))
