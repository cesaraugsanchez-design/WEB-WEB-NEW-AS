/**
 * Aseguradoras del desplegable de «Asignar un reclamo».
 *
 * TODO(cliente): confirmar la lista definitiva con ASSANCH. Estas son companias
 * que operan en el mercado dominicano, pero la firma sabe con cuales trabaja
 * realmente; incluir una con la que no hay relacion induce a error al visitante.
 *
 * El `slug` alimenta los enlaces precargados: /someter-reclamo?aseguradora=universal
 */
export const aseguradoras = [
  { slug: 'universal', nombre: 'Seguros Universal' },
  { slug: 'banreservas', nombre: 'Seguros Banreservas' },
  { slug: 'humano', nombre: 'Humano Seguros' },
  { slug: 'mapfre-bhd', nombre: 'MAPFRE BHD Seguros' },
  { slug: 'la-colonial', nombre: 'La Colonial' },
  { slug: 'sura', nombre: 'Seguros Sura' },
  { slug: 'pepin', nombre: 'Seguros Pepín' },
  { slug: 'worldwide', nombre: 'Seguros Worldwide' },
  { slug: 'atlantica', nombre: 'Atlántica Seguros' },
  { slug: 'general', nombre: 'General de Seguros' },
  { slug: 'angloamericana', nombre: 'Angloamericana' },
  { slug: 'banesco', nombre: 'Banesco Seguros' },
  { slug: 'crecer', nombre: 'Seguros Crecer' },
  { slug: 'coop-seguros', nombre: 'COOP-Seguros' },
]

export const OTRA_ASEGURADORA = 'Otra'
