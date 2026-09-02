import { Building2, Factory, Hotel, Landmark, Ship, ShoppingBag, Truck, Wrench } from 'lucide-react'

/**
 * Sectores a los que atiende la firma.
 *
 * TODO(cliente): confirmar la lista. Estos ocho salen del perfil de riesgos que
 * el sitio ya describe y del mercado dominicano, pero ASSANCH sabe en cuáles
 * tiene experiencia real. Anunciar un sector sin haberlo trabajado es una
 * promesa que se cae en la primera reunión.
 *
 * `riesgos` describe lo que suele siniestrarse en cada sector; `ramos` enlaza a
 * las fichas que ya existen, sin duplicar su contenido.
 */
export const sectores = [
  {
    icon: Hotel,
    slug: 'hoteleria-y-turismo',
    nombre: 'Hotelería y turismo',
    resumen: 'Complejos hoteleros, resorts y operación turística en zona costera.',
    riesgos: [
      'Daños por fenómenos atmosféricos en temporada ciclónica',
      'Interrupción de operación en plena ocupación',
      'Responsabilidad civil frente a huéspedes',
    ],
    ramos: ['incendio-y-lineas-aliadas', 'interrupcion-de-negocios', 'responsabilidad-civil'],
  },
  {
    icon: Factory,
    slug: 'industria-y-manufactura',
    nombre: 'Industria y manufactura',
    resumen: 'Plantas de producción, líneas de proceso y almacenes de materia prima.',
    riesgos: [
      'Avería de maquinaria crítica y paro de línea',
      'Incendio en almacén de producto terminado',
      'Pérdida consecuencial por interrupción',
    ],
    ramos: ['averia-de-maquinarias', 'incendio-y-lineas-aliadas', 'interrupcion-de-negocios'],
  },
  {
    icon: Building2,
    slug: 'construccion',
    nombre: 'Construcción',
    resumen: 'Obra en ejecución, equipo pesado y responsabilidad frente a terceros.',
    riesgos: [
      'Daños a la obra durante la ejecución',
      'Colapso, deslizamiento y daños a colindantes',
      'Equipo y maquinaria de obra',
    ],
    ramos: ['todo-riesgo-propiedad-y-construccion', 'responsabilidad-civil', 'averia-de-maquinarias'],
  },
  {
    icon: Truck,
    slug: 'transporte-y-logistica',
    nombre: 'Transporte y logística',
    resumen: 'Flotas, mercancía en tránsito y centros de distribución.',
    riesgos: [
      'Pérdida o avería de mercancía en tránsito',
      'Accidentes de flota y responsabilidad civil',
      'Robo y faltante en almacén',
    ],
    ramos: ['transporte-terrestre', 'automovil', 'responsabilidad-civil'],
  },
  {
    icon: Ship,
    slug: 'maritimo-y-portuario',
    nombre: 'Marítimo y portuario',
    resumen: 'Carga de importación y exportación, y operación en puerto.',
    riesgos: [
      'Avería y mojadura de carga en travesía',
      'Faltante en el desembarque',
      'Daño durante la manipulación en muelle',
    ],
    ramos: ['transporte-maritimo', 'responsabilidad-civil'],
  },
  {
    icon: ShoppingBag,
    slug: 'retail-y-comercio',
    nombre: 'Retail y comercio',
    resumen: 'Cadenas, tiendas y centros comerciales con inventario alto.',
    riesgos: [
      'Incendio y daño por agua en sala de venta',
      'Pérdida de inventario y de registros',
      'Infidelidad de empleados',
    ],
    ramos: ['incendio-y-lineas-aliadas', 'fianza-de-fidelidad', 'interrupcion-de-negocios'],
  },
  {
    icon: Wrench,
    slug: 'energia-e-infraestructura',
    nombre: 'Energía e infraestructura',
    resumen: 'Generación, distribución y equipos electrónicos de control.',
    riesgos: [
      'Avería de equipo de generación',
      'Daño a sistemas electrónicos y de control',
      'Interrupción del suministro',
    ],
    ramos: ['averia-de-maquinarias', 'equipos-electronicos', 'interrupcion-de-negocios'],
  },
  {
    icon: Landmark,
    slug: 'aseguradoras-y-corredores',
    nombre: 'Aseguradoras y corredores',
    resumen: 'El cliente principal de la firma: quien asigna el siniestro.',
    riesgos: [
      'Necesidad de peritaje independiente y trazable',
      'Discrepancia sobre el monto de la pérdida',
      'Casos con exposición o complejidad técnica',
    ],
    ramos: ['incendio-y-lineas-aliadas', 'todo-riesgo-propiedad-y-construccion', 'responsabilidad-civil'],
  },
]

export const sectorPorSlug = Object.fromEntries(sectores.map((s) => [s.slug, s]))
