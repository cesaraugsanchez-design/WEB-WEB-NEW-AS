import { SITIO_URL } from '@/lib/sitio'

/* Las tres rutas públicas. Al añadir una nueva, sumarla aquí: un sitemap que se
   queda atrás es peor que no tenerlo, porque afirma que el sitio es más pequeño
   de lo que es. */
export default function sitemap() {
  const ahora = new Date()
  return [
    { url: SITIO_URL, lastModified: ahora, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITIO_URL}/someter-reclamo`, lastModified: ahora, changeFrequency: 'yearly', priority: 0.9 },
    { url: `${SITIO_URL}/cobertura`, lastModified: ahora, changeFrequency: 'yearly', priority: 0.6 },
  ]
}
