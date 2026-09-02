import { BookOpen, ClipboardCheck, Compass, FileSearch, GraduationCap, ScanSearch, ShieldAlert, Users } from 'lucide-react'

/**
 * Los tres servicios de la firma, con el detalle que la sección de la portada
 * no puede mostrar sin volverse ilegible.
 *
 * TODO(cliente): `entregables` y `cuando` los escribí a partir de lo que ya
 * dice el sitio y de la práctica habitual del ajuste. El equipo técnico debe
 * validarlos antes de darlos por definitivos.
 */
export const servicios = [
  {
    icon: ScanSearch,
    slug: 'ajuste-de-perdidas',
    titulo: 'Evaluación de siniestros y ajuste de pérdidas',
    nota: 'El núcleo del trabajo de la firma.',
    resumen:
      'Peritaje completo y ajuste profesional de todo tipo de siniestros, con informes detallados y tiempos de respuesta óptimos.',
    detalle:
      'Recibido el aviso, un ajustador se moviliza al lugar del riesgo, levanta la evidencia y determina qué ocurrió, qué ampara la póliza y cuánto asciende la pérdida indemnizable. El expediente que se entrega sustenta la decisión de la aseguradora y resiste una revisión posterior.',
    entregables: [
      'Informe preliminar con causa aparente y reserva sugerida',
      'Levantamiento fotográfico y acta de inspección',
      'Cuantificación de la pérdida con memoria de cálculo',
      'Informe final con criterio técnico sobre cobertura',
    ],
    cuando: [
      { icon: FileSearch, texto: 'Un siniestro necesita peritaje independiente.' },
      { icon: ClipboardCheck, texto: 'Hay discrepancia sobre el monto de la pérdida.' },
      { icon: ShieldAlert, texto: 'La causa declarada no explica el daño observado.' },
    ],
  },
  {
    icon: Compass,
    slug: 'consultoria',
    titulo: 'Consultoría de seguros y riesgos',
    nota: 'Antes del siniestro, no después.',
    resumen:
      'Asesoría especializada en gestión de riesgos, análisis de coberturas y optimización de pólizas para empresas e instituciones.',
    detalle:
      'Revisar una cartera de pólizas antes de que ocurra el siniestro evita la conversación más difícil del sector: descubrir que el riesgo que se materializó no estaba amparado, o que la suma asegurada quedó corta y aplica regla proporcional.',
    entregables: [
      'Diagnóstico de coberturas frente a los riesgos reales',
      'Detección de infraseguro y de vacíos de cobertura',
      'Recomendaciones de ajuste de sumas y condiciones',
      'Acompañamiento técnico en la renovación',
    ],
    cuando: [
      { icon: Compass, texto: 'Toca renovar y no se sabe si la cobertura sigue siendo la adecuada.' },
      { icon: ShieldAlert, texto: 'La operación cambió: nueva planta, nueva flota, nuevo inventario.' },
      { icon: Users, texto: 'Se necesita un criterio independiente del de la corredora.' },
    ],
  },
  {
    icon: BookOpen,
    slug: 'formacion',
    titulo: 'Formación en riesgos y seguros',
    nota: 'Para equipos que manejan siniestros.',
    resumen:
      'Capacitación profesional para equipos y empresas en identificación de riesgos, prevención y gestión de siniestros.',
    detalle:
      'La mayoría de los expedientes que se complican no se complican en el ajuste: se complican en las primeras horas, cuando nadie documentó la escena, se retiraron escombros o se firmó algo que no correspondía. La formación ataca ese momento.',
    entregables: [
      'Qué hacer en las primeras 24 horas de un siniestro',
      'Cómo levantar evidencia que sostenga un reclamo',
      'Lectura práctica de pólizas y sus exclusiones',
      'Errores frecuentes que reducen la indemnización',
    ],
    cuando: [
      { icon: GraduationCap, texto: 'El equipo de operaciones es el primero en llegar al siniestro.' },
      { icon: Users, texto: 'Hay rotación de personal en el área de riesgos.' },
      { icon: ClipboardCheck, texto: 'Se quiere estandarizar el reporte interno de incidentes.' },
    ],
  },
]

export const servicioPorSlug = Object.fromEntries(servicios.map((s) => [s.slug, s]))
