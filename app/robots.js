import { SITIO_URL } from '@/lib/sitio'

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      /* Las rutas de API no tienen nada que indexar y responden a POST. */
      disallow: '/api/',
    },
    sitemap: `${SITIO_URL}/sitemap.xml`,
  }
}
