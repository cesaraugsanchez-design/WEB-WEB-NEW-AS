/**
 * URL canónica del sitio, en un solo lugar.
 *
 * Sirve para `metadataBase` (Next necesita una base absoluta para resolver las
 * imágenes de Open Graph y las etiquetas canónicas), para el sitemap y para
 * robots.txt. Sin ella, al compartir un enlace en WhatsApp o LinkedIn las
 * previsualizaciones salen sin imagen.
 *
 * El dominio es assanchconsultores.com, sin www: la variante con www redirige
 * aquí desde `next.config.mjs`.
 *
 * El orden de precedencia importa y no es casual:
 *
 *   1. NEXT_PUBLIC_SITIO_URL — definida en Vercel para producción. Es la que
 *      manda, para que la dirección canónica no dependa de lo que la plataforma
 *      decida informar.
 *   2. VERCEL_PROJECT_PRODUCTION_URL — la trae Vercel. Sirve en las
 *      previsualizaciones de rama, que así no se anuncian con el dominio
 *      definitivo y no compiten con él en los buscadores.
 *   3. El dominio a secas — para `npm run dev` y para cualquier compilación
 *      fuera de Vercel, donde ninguna de las dos anteriores existe.
 */
export const SITIO_URL =
  process.env.NEXT_PUBLIC_SITIO_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://assanchconsultores.com')
