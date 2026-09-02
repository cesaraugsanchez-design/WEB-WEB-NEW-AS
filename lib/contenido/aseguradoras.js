/**
 * Aseguradoras del desplegable de «Asignar un reclamo».
 *
 * Es la lista real de companias con las que trabaja ASSANCH, la misma que
 * alimenta el carrusel de aliados. Antes eran companias del mercado puestas por
 * aproximacion: listar una con la que no hay relacion induce a error a quien
 * reporta.
 *
 * Aqui van ALFABETICAS, no en el orden comercial del carrusel: quien rellena el
 * formulario busca su compania en una lista, no lee una jerarquia.
 *
 * El `slug` alimenta los enlaces precargados:
 *   /someter-reclamo?aseguradora=seguros-universal
 */
export const aseguradoras = [
  { slug: 'atlantica-seguros', nombre: 'Atlántica Seguros' },
  { slug: 'coop-seguros', nombre: 'COOP-Seguros' },
  { slug: 'general-de-seguros', nombre: 'General de Seguros' },
  { slug: 'humano-seguros', nombre: 'Humano Seguros' },
  { slug: 'la-colonial', nombre: 'La Colonial' },
  { slug: 'la-monumental-de-seguros', nombre: 'La Monumental de Seguros' },
  { slug: 'mapfre-bhd-seguros', nombre: 'MAPFRE BHD Seguros' },
  { slug: 'seguros-la-internacional', nombre: 'Seguros La Internacional' },
  { slug: 'seguros-patria', nombre: 'Seguros Patria' },
  { slug: 'seguros-pepin', nombre: 'Seguros Pepín' },
  { slug: 'seguros-reservas', nombre: 'Seguros Reservas' },
  { slug: 'seguros-sura', nombre: 'Seguros Sura' },
  { slug: 'seguros-universal', nombre: 'Seguros Universal' },
  { slug: 'unit-filial-de-grupo-universal', nombre: 'Unit, filial de Grupo Universal' },
]

export const OTRA_ASEGURADORA = 'Otra'
