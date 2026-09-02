import { ramos } from './ramos'
import { servicios } from './servicios'

/**
 * Fuente única de la navegación: la cápsula de escritorio, el acordeón móvil y
 * el sitemap leen de aquí. Duplicar el árbol garantiza que tarde o temprano uno
 * se quede atrás y el visitante encuentre un enlace muerto.
 *
 * REGLA: aquí sólo entran rutas que EXISTEN. Un menú que promete páginas sin
 * construir es peor que un menú corto. Las secciones que aún viven únicamente
 * en la portada se enlazan por su ancla, que sí funciona.
 */
export const navegacion = [
  {
    label: 'Servicios',
    href: '/servicios',
    columnas: [
      {
        titulo: 'Qué hacemos',
        enlaces: servicios.map((s) => ({ label: s.titulo, href: `/servicios/${s.slug}` })),
      },
    ],
  },
  {
    label: 'Ramos',
    href: '/ramos',
    columnas: [
      {
        titulo: 'Los más frecuentes',
        /* Seis, no diez: un panel con la lista entera obliga a leer en vez de
           a escoger. El resto está a un clic, en el pie del panel. */
        enlaces: ramos.slice(0, 6).map((r) => ({ label: r.nombre, href: `/ramos/${r.slug}` })),
        pie: { label: 'Ver los 10 ramos', href: '/ramos' },
      },
    ],
  },
  {
    label: 'Nosotros',
    href: '/#nosotros',
    columnas: [
      {
        titulo: 'La firma',
        enlaces: [
          { label: 'Quiénes somos', href: '/#nosotros' },
          { label: 'Equipo', href: '/#equipo' },
          { label: 'Aliados', href: '/#aliados' },
        ],
      },
      {
        titulo: 'Alcance',
        enlaces: [
          { label: 'Cobertura nacional', href: '/cobertura' },
          { label: 'Contacto', href: '/#contacto' },
        ],
      },
    ],
  },
]

/* Rutas propias, para el sitemap. Las anclas de la portada no van: no son
   páginas y declararlas como tales infla el mapa con URL que no existen. */
export const rutasEstaticas = [
  '/',
  '/servicios',
  ...servicios.map((s) => `/servicios/${s.slug}`),
  '/ramos',
  ...ramos.map((r) => `/ramos/${r.slug}`),
  '/cobertura',
  '/someter-reclamo',
]
