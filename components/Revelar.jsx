'use client'

import { useReveal } from '@/lib/useReveal'

/**
 * Envoltorio de cliente para `useReveal`, que es un hook y no puede llamarse
 * desde un componente de servidor.
 *
 * Las páginas interiores son de servidor a propósito —su contenido es fijo y no
 * hay razón para enviar su HTML a construir en el navegador—, así que el
 * revelado en scroll entra por aquí, en un componente que no pinta nada.
 */
export default function Revelar() {
  useReveal()
  return null
}
