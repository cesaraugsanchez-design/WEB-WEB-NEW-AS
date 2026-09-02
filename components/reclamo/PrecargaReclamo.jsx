'use client'

import { useSearchParams } from 'next/navigation'
import { aseguradoras } from '@/lib/contenido/aseguradoras'
import { nombresRamos } from '@/lib/contenido/ramos'
import FormularioReclamo from './FormularioReclamo'

/**
 * Precarga desde la URL: /someter-reclamo?aseguradora=universal&ramo=Incendio
 *
 * Permite que una aseguradora reparta un enlace propio a sus ejecutivos con la
 * compania ya seleccionada. Solo se acepta lo que coincide EXACTAMENTE con las
 * listas oficiales: un valor libre venido de la URL acabaria en el correo al
 * ajustador como si lo hubiera escrito una persona.
 */
export default function PrecargaReclamo() {
  const params = useSearchParams()

  const slug = params.get('aseguradora')?.toLowerCase()
  const porSlug = aseguradoras.find((a) => a.slug === slug || a.nombre.toLowerCase() === slug)

  const ramoUrl = params.get('ramo')
  const ramo = nombresRamos.find((n) => n.toLowerCase() === ramoUrl?.toLowerCase())

  return (
    <FormularioReclamo
      inicial={{
        ...(porSlug ? { aseguradora: porSlug.nombre } : {}),
        ...(ramo ? { ramo } : {}),
      }}
    />
  )
}
