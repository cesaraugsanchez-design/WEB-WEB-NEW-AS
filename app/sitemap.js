import { SITIO_URL } from '@/lib/sitio'
import { rutasEstaticas } from '@/lib/contenido/navegacion'

/* Las rutas salen de lib/contenido/navegacion.js, la misma fuente que alimenta
   el menú. Mantener dos listas a mano termina siempre igual: el mapa afirma que
   el sitio es más pequeño de lo que es. */
export default function sitemap() {
  const ahora = new Date()
  return rutasEstaticas.map((ruta) => ({
    url: ruta === '/' ? SITIO_URL : `${SITIO_URL}${ruta}`,
    lastModified: ahora,
    changeFrequency: ruta === '/' ? 'monthly' : 'yearly',
    priority: ruta === '/' ? 1 : ruta === '/someter-reclamo' ? 0.9 : 0.7,
  }))
}
