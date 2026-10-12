import { SITIO_URL } from '@/lib/sitio'
import { nombresRamos } from '@/lib/contenido/ramos'

/**
 * Datos estructurados (JSON-LD) de la firma.
 *
 * PARA QUÉ. Es lo que Google lee para entender que este sitio ES la firma
 * ASSANCH, y no una página cualquiera que la menciona. De aquí salen dos cosas
 * que se ven en los resultados: el nombre del sitio junto al enlace y el panel
 * lateral con dirección y teléfono. Sin esto el sitio no emitía ninguno.
 *
 * SOLO DATOS QUE EL PROPIO SITIO YA PUBLICA. Cada campo de abajo está escrito
 * en algún otro lugar de la web —pie, sección de contacto, metadatos—. No se
 * añade nada que no esté ya a la vista, porque esto no es un texto de relleno:
 * Google lo muestra como hecho, y un dato inventado aquí acaba en el panel de
 * la firma.
 *
 * LO QUE FALTA A PROPÓSITO, hasta que ASSANCH lo confirme:
 *
 *   · `sameAs` lleva solo Instagram, que es el único perfil que ASSANCH ha
 *     confirmado. TODO(cliente): si hay LinkedIn, Facebook o X oficiales, se
 *     añaden aquí con su URL exacta —es de las señales que más pesan para el
 *     panel—. No se adivinan: una URL equivocada le diría a Google que el
 *     perfil oficial está donde no está.
 *   · `openingHoursSpecification` — TODO(cliente): ASSANCH confirmó las horas,
 *     de 8:00 a 18:00, pero no los días. El esquema exige las dos cosas y
 *     Google las muestra como hecho: poner «lunes a viernes» por suposición
 *     manda a alguien un sábado a una puerta cerrada, o le dice que está
 *     cerrado cuando no lo está. El «aviso de siniestros 24/7» del sitio es
 *     otra cosa y no sirve de horario de oficina.
 *   · `foundingDate` y `legalName` — «+25 años de experiencia» no es una fecha
 *     de constitución, y la razón social no figura en el sitio.
 *
 * `ProfessionalService` y no `InsuranceAgency`: ASSANCH ajusta siniestros, no
 * vende pólizas. El tipo de agencia la clasificaría entre quienes sí las
 * venden, que es justo la confusión que una firma de ajuste independiente
 * necesita evitar.
 */

const ID_ORGANIZACION = `${SITIO_URL}/#organizacion`
const ID_SITIO = `${SITIO_URL}/#sitio`

export const datosEstructurados = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ProfessionalService',
      '@id': ID_ORGANIZACION,
      name: 'ASSANCH',
      alternateName: 'Assanch Ajustadores y Consultores de Seguros',
      url: SITIO_URL,
      logo: `${SITIO_URL}/marca/assanch-logo.svg`,
      image: `${SITIO_URL}/marca/assanch-logo-completo.svg`,
      description:
        'Ajustadores de seguros en República Dominicana. Peritaje, levantamiento y ajuste de siniestros en los diez ramos, con respuesta inmediata para aseguradoras, corredores y empresas.',
      slogan: 'Respuesta rápida. Soluciones precisas.',
      telephone: '+1-809-792-9384',
      email: 'recepcion@assanch.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Av. San Vicente de Paul, Esq. Activo 20/30, Alma Rosa II',
        addressLocality: 'Santo Domingo Este',
        addressRegion: 'Santo Domingo',
        addressCountry: 'DO',
      },
      areaServed: { '@type': 'Country', name: 'República Dominicana' },
      sameAs: ['https://www.instagram.com/assanchadsrd/'],
      // De la lista única de ramos: si entra uno nuevo, aparece aquí solo.
      knowsAbout: nombresRamos,
    },
    {
      /* El `name` de WebSite es lo que Google usa como nombre del sitio en los
         resultados. Sin él lo deduce del título o del dominio, y saldría
         «assanchconsultores.com» en vez de «ASSANCH». */
      '@type': 'WebSite',
      '@id': ID_SITIO,
      url: SITIO_URL,
      name: 'ASSANCH',
      alternateName: 'Assanch Ajustadores y Consultores de Seguros',
      inLanguage: 'es-DO',
      publisher: { '@id': ID_ORGANIZACION },
    },
  ],
}

/* El `<` se escapa porque el JSON va dentro de una etiqueta <script>: un
   «</script>» en cualquier valor cerraría la etiqueta y lo que siguiera se
   interpretaría como HTML. Hoy todos los valores son fijos, pero los ramos
   salen de un archivo de contenido que alguien editará. */
export const jsonLdSeguro = (objeto) => JSON.stringify(objeto).replace(/</g, '\\u003c')
