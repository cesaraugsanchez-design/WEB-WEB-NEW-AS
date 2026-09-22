import { SITIO_URL } from '@/lib/sitio'

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      /* Las rutas de API no tienen nada que indexar y responden a POST.
         Interna va cerrada con sesión; esto solo evita que aparezca listada. */
      disallow: ['/api/', '/interna'],
    },
    sitemap: `${SITIO_URL}/sitemap.xml`,
  }
}
