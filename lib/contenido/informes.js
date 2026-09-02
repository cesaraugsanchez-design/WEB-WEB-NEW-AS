/**
 * Informes semanales del mercado asegurador.
 *
 * EL PDF NO SE PUBLICA. Solo se publican imagenes de sus paginas, para que
 * quien entre pueda leer el informe sin obtener el archivo. Esconder un boton
 * de descarga no protege nada: la URL del PDF seguiria siendo accesible.
 *
 * Eso NO impide una captura de pantalla, y ninguna tecnologia lo impide. Lo que
 * consigue es que nadie se lleve el documento original.
 *
 * COMO ANADIR UN INFORME:
 *   1. swift herramientas/pdf-a-imagenes.swift informe.pdf public/informes/AAAA-MM-DD
 *   2. Anadir una entrada AL PRINCIPIO de este array, con una ruta por pagina.
 *   3. NO copiar el PDF a public/. Guardarlo fuera del repositorio.
 *
 * `resumen` es obligatorio en la practica: un informe publicado como imagenes
 * es ilegible para un lector de pantalla, y ese texto es la unica via de acceso
 * para quien no ve. No es un adorno de la tarjeta.
 */
export const informes = [
  // {
  //   slug: '2026-09-01',
  //   titulo: 'Informe semanal del mercado asegurador',
  //   fecha: '2026-09-01',
  //   resumen: 'Dos o tres lineas sobre lo mas relevante de la semana.',
  //   paginas: [
  //     '/informes/2026-09-01/01.png',
  //     '/informes/2026-09-01/02.png',
  //   ],
  // },
]

export const hayInformes = informes.length > 0

/* Del mas reciente al mas antiguo, sin depender de que se hayan escrito en
   orden en el array. */
export const informesOrdenados = [...informes].sort((a, b) => b.fecha.localeCompare(a.fecha))

export const informePorSlug = Object.fromEntries(informes.map((i) => [i.slug, i]))
