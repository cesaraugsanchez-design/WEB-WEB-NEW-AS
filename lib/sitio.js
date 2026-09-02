/**
 * URL canónica del sitio, en un solo lugar.
 *
 * Sirve para `metadataBase` (Next necesita una base absoluta para resolver las
 * imágenes de Open Graph y las etiquetas canónicas), para el sitemap y para
 * robots.txt. Sin ella, al compartir un enlace en WhatsApp o LinkedIn las
 * previsualizaciones salen sin imagen.
 *
 * En Vercel, VERCEL_PROJECT_PRODUCTION_URL trae el dominio de producción, así
 * que las previsualizaciones de rama no se anuncian con la URL definitiva.
 * TODO(cliente): cuando assanchconsultores.com apunte a Vercel, definir
 * NEXT_PUBLIC_SITIO_URL con ese dominio para fijarlo.
 */
export const SITIO_URL =
  process.env.NEXT_PUBLIC_SITIO_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://www.assanchconsultores.com')
