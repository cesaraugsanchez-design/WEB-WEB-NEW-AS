'use client'

import { useEffect, useState } from 'react'
import Cifra from './Cifra'
import { BASE, totalReclamaciones } from '@/lib/contenido/reclamaciones'

/**
 * Cifra de reclamaciones gestionadas.
 *
 * El valor se calcula en el NAVEGADOR, no en el servidor, y hay un motivo: la
 * pagina es estatica, asi que su HTML se genera una vez al desplegar. Si el
 * numero se calculara ahi, se quedaria congelado en la fecha del despliegue —y
 * ademas React avisaria de discrepancia al hidratar, porque el cliente calcula
 * otro dia.
 *
 * En el primer render se muestra BASE, que es la cifra real y verificable. Al
 * montar se sustituye por la proyeccion de hoy. El cambio ocurre antes de que
 * nadie llegue a esta seccion —esta muy por debajo del pliegue—, asi que la
 * animacion de Cifra corre una sola vez y ya con el valor definitivo.
 */
export default function ContadorReclamaciones({ className }) {
  const [total, setTotal] = useState(BASE)

  useEffect(() => {
    setTotal(totalReclamaciones())
  }, [])

  return <Cifra valor={total.toLocaleString('es-DO')} className={className} duracion={2200} />
}
