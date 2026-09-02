/**
 * La Semanal — informe de mercado asegurador de ASSANCH.
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
 *   2. Anadir una entrada AL PRINCIPIO de este array.
 *   3. NO copiar el PDF a public/. Guardarlo fuera del repositorio.
 *
 * `resumen` NO es un adorno de la tarjeta: el informe se publica como imagenes,
 * ilegible para un lector de pantalla, y ese texto es la unica via de acceso
 * para quien no ve. Tambien es lo unico que puede indexar un buscador.
 * Los de aqui son el resumen ejecutivo real de cada informe, resumido.
 */

const paginas = (fecha, n) =>
  Array.from({ length: n }, (_, i) => `/informes/${fecha}/${String(i + 1).padStart(2, '0')}.png`)

export const informes = [
  {
    slug: '2026-08-28',
    semana: 35,
    titulo: 'El Súper Niño: el océano más caliente desde que hay registros',
    fecha: '2026-08-28',
    resumen:
      'Edición monográfica. La NOAA da más de nueve probabilidades sobre diez de que El Niño alcance categoría muy fuerte entre otoño e invierno. Para República Dominicana la traducción es sencilla: menos huracán y más falta de agua. Para el ajuste, cambia el tipo de siniestro —del daño por viento al daño por sequía, calor y paralización.',
    paginas: paginas('2026-08-28', 8),
  },
  {
    slug: '2026-08-21',
    semana: 34,
    titulo: '3.8 millones de motocicletas, siete de cada diez víctimas: la brecha dominicana que termina en el ajuste',
    fecha: '2026-08-21',
    resumen:
      'El mercado blando dejó de ser previsión y pasó a ser gestión: AM Best confirma apetito por catástrofe pese a caídas de precio de hasta 5.5 % en las renovaciones de julio, y la consolidación se acelera. En República Dominicana, Cadoar pone número a la brecha de protección: 3,846,694 motocicletas —el 57.9 % del parque— frente a una penetración del seguro del 1.9 % del PIB.',
    paginas: paginas('2026-08-21', 8),
  },
  {
    slug: '2026-08-14',
    semana: 33,
    titulo: 'Colombia: 2.2 millones de pólizas de terremoto para un sismo que no se puede tarifar todavía',
    fecha: '2026-08-14',
    resumen:
      'El sismo de magnitud 7,4 del 10 de agosto en San José del Palmar deja a la industria con un dato inédito para la región y una incógnita abierta: ningún modelador ni bróker ha publicado todavía una estimación formal de pérdida asegurada. En el frente global, el primer semestre desmiente la narrativa del año tranquilo. En República Dominicana, la siniestralidad de vehículos escaló a 65.42 % al cierre de mayo.',
    paginas: paginas('2026-08-14', 8),
  },
  {
    slug: '2026-08-07',
    semana: 32,
    titulo: 'La factura venezolana: cuando el reaseguro sobra y la cobertura falta',
    fecha: '2026-08-07',
    resumen:
      'El doblete sísmico de Venezuela se consolida como la mayor lección de la región en una década: pérdidas totales cercanas a US$30,000 millones con menos de US$1,000 millones asegurados. Mientras tanto, el mercado global vive la paradoja contraria: capital sobrante y bonos catastróficos en máximos históricos. En República Dominicana, la Resolución 01-2024 entra en fase final de implementación.',
    paginas: paginas('2026-08-07', 8),
  },
]

export const hayInformes = informes.length > 0

/* Del mas reciente al mas antiguo, sin depender de que se hayan escrito en
   orden en el array. */
export const informesOrdenados = [...informes].sort((a, b) => b.fecha.localeCompare(a.fecha))

export const informePorSlug = Object.fromEntries(informes.map((i) => [i.slug, i]))

/* La portada es siempre la primera pagina. */
export const portadaDe = (informe) => informe.paginas[0]
