import { ramoPorSlug, ramos } from './ramos'
import { sectores } from './sectores'
import { servicios } from './servicios'

/**
 * Índice único de búsqueda. Se construye a partir de las mismas fuentes que
 * alimentan las páginas: no hay una segunda copia del contenido que pueda
 * quedarse atrás.
 *
 * `texto` concentra todo lo buscable de cada entrada —nombre, resumen y el
 * detalle— ya normalizado. Normalizar en cada pulsación de tecla sobre 21
 * entradas es trabajo repetido para siempre el mismo resultado.
 */
export function normalizar(t = '') {
  return t
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // fuera las tildes: «automovil» debe encontrar «Automóvil»
    .toLowerCase()
}

function entrada({ icon, titulo, resumen, href, categoria, extra = [] }) {
  return {
    icon,
    titulo,
    resumen,
    href,
    categoria,
    texto: normalizar([titulo, resumen, ...extra].join(' ')),
  }
}

export const indice = [
  ...servicios.map((s) =>
    entrada({
      icon: s.icon,
      titulo: s.titulo,
      resumen: s.resumen,
      href: `/servicios/${s.slug}`,
      categoria: 'Servicios',
      extra: [s.detalle, ...s.entregables],
    })
  ),
  ...ramos.map((r) =>
    entrada({
      icon: r.icon,
      titulo: r.nombre,
      resumen: r.nota,
      href: `/ramos/${r.slug}`,
      categoria: 'Ramos',
      extra: [r.definicion, ...r.evaluamos, ...r.documentos],
    })
  ),
  ...sectores.map((s) =>
    entrada({
      icon: s.icon,
      titulo: s.nombre,
      resumen: s.resumen,
      href: `/sectores/${s.slug}`,
      categoria: 'Sectores',
      /* Los nombres de los ramos asociados entran en el texto buscable. La
         asociacion es real —esta declarada en el propio sector—, asi que
         «incendio hotel» debe encontrar Hoteleria. Sin esto, buscar dos
         terminos ciertos devolvia cero. */
      extra: [...s.riesgos, ...s.ramos.map((r) => ramoPorSlug[r]?.nombre ?? '')],
    })
  ),
]

export const categorias = ['Servicios', 'Ramos', 'Sectores']

/**
 * Búsqueda por todos los términos, no por la frase entera: quien escribe
 * «incendio hotel» espera resultados que mencionen ambas cosas, aunque no
 * aparezcan juntas ni en ese orden.
 *
 * Los que coinciden en el TÍTULO van primero: si alguien escribe «automóvil»,
 * la ficha del ramo Automóvil importa más que un sector que lo menciona de paso.
 */
export function buscar(consulta) {
  const terminos = normalizar(consulta).split(/\s+/).filter(Boolean)
  if (!terminos.length) return []

  return indice
    .filter((e) => terminos.every((t) => e.texto.includes(t)))
    .map((e) => {
      const enTitulo = terminos.every((t) => normalizar(e.titulo).includes(t))
      return { ...e, peso: enTitulo ? 0 : 1 }
    })
    .sort((a, b) => a.peso - b.peso)
}
