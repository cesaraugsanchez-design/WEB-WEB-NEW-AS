/**
 * Recursos publicables.
 *
 * TODO(cliente): estos cuatro son GUÍAS explicativas, no casos de éxito ni
 * notas de prensa. La distinción es deliberada: una guía se sostiene en
 * conocimiento del oficio y se puede validar; un caso de éxito con cliente,
 * fecha y cifra sería una credencial inventada, y eso no se escribe.
 *
 * El equipo técnico debe validar el contenido antes de darlo por definitivo.
 * Cuando ASSANCH tenga casos reales que pueda publicar, se añaden aquí con
 * tipo 'Caso de éxito' y aparecen solos en los filtros.
 */
export const TIPOS = ['Guía', 'Artículo', 'Caso de éxito', 'Informe', 'Nota de prensa']

export const recursos = [
  {
    slug: 'primeras-24-horas-de-un-siniestro',
    tipo: 'Guía',
    titulo: 'Las primeras 24 horas de un siniestro',
    fecha: '2026-08-01',
    lineas: ['Evaluación de siniestros y ajuste de pérdidas'],
    sectores: ['Industria y manufactura', 'Hotelería y turismo', 'Retail y comercio'],
    entradilla:
      'La mayoría de los expedientes que se complican no se complican en el ajuste, sino en las horas siguientes al evento. Qué hacer y qué no tocar.',
    cuerpo: [
      {
        titulo: 'Primero, la seguridad',
        parrafos: [
          'Nada de lo que sigue importa antes que las personas. Evacuar, cortar el suministro eléctrico si hay riesgo, y llamar a los cuerpos de socorro. El expediente se reconstruye; una lesión no.',
        ],
      },
      {
        titulo: 'No retire escombros antes del levantamiento',
        parrafos: [
          'Es el error más frecuente y el más caro. Limpiar antes de que el ajustador documente la escena elimina la evidencia que permite determinar el origen y la causa, y con ella la posibilidad de sustentar el reclamo.',
          'Si por seguridad u operación hay que mover algo, fotografíelo antes desde varios ángulos y deje constancia de por qué se movió.',
        ],
      },
      {
        titulo: 'Documente antes de que cambie',
        parrafos: [
          'Fotografías generales del área, luego de detalle. Incluya lo que NO se dañó: delimitar el alcance del daño es tan importante como probarlo.',
          'Anote la hora en que se detectó el evento y quién lo detectó. Ese dato aparece siempre en el informe y casi nunca se recuerda una semana después.',
        ],
      },
      {
        titulo: 'Notifique a la aseguradora',
        parrafos: [
          'Las pólizas fijan un plazo para dar aviso. Notificar tarde puede afectar la cobertura aunque el siniestro esté amparado. El aviso se da aunque todavía no se conozca el monto de la pérdida.',
        ],
      },
      {
        titulo: 'No firme lo que no entiende',
        parrafos: [
          'En las horas siguientes a un siniestro aparecen documentos que conviene leer con calma: finiquitos, autorizaciones de retiro, presupuestos de reparación. Ninguno es urgente al punto de firmarse sin revisar.',
        ],
      },
    ],
  },
  {
    slug: 'que-documentos-pide-un-ajustador',
    tipo: 'Guía',
    titulo: 'Qué documentos pide un ajustador, y por qué',
    fecha: '2026-08-08',
    lineas: ['Evaluación de siniestros y ajuste de pérdidas'],
    sectores: ['Aseguradoras y corredores', 'Industria y manufactura'],
    entradilla:
      'La lista varía según el ramo, pero la lógica es siempre la misma: probar que el bien existía, que valía lo que se declara y que el daño ocurrió como se cuenta.',
    cuerpo: [
      {
        titulo: 'Tres preguntas, no una lista',
        parrafos: [
          'Cada documento que pide un ajustador responde a una de tres preguntas: ¿existía el bien?, ¿cuánto valía?, ¿qué le pasó? Si entiende eso, la lista deja de parecer burocracia.',
        ],
      },
      {
        titulo: '¿Existía el bien?',
        parrafos: [
          'Facturas de adquisición, registros de activo fijo, inventarios, conduces de entrada. En transporte, el conocimiento de embarque y la factura comercial.',
        ],
      },
      {
        titulo: '¿Cuánto valía?',
        parrafos: [
          'Valor de reposición o valor real según lo pactado en la póliza, depreciación aplicable, y la suma asegurada declarada. Aquí es donde aparece el infraseguro: si el bien vale más de lo declarado, la indemnización se reduce en la misma proporción.',
        ],
      },
      {
        titulo: '¿Qué le pasó?',
        parrafos: [
          'Informe de bomberos, denuncia policial, acta de la autoridad competente, registro fotográfico y, en avería de maquinaria, el informe del técnico que atendió la falla.',
        ],
      },
      {
        titulo: 'Lo que falta no detiene el expediente',
        parrafos: [
          'No hace falta tenerlo todo para reportar. El expediente se abre con el aviso y los documentos se incorporan según aparecen. Esperar a reunirlos todos solo retrasa la movilización del perito.',
        ],
      },
    ],
  },
  {
    slug: 'infraseguro-y-regla-proporcional',
    tipo: 'Guía',
    titulo: 'Infraseguro: por qué se indemniza menos de lo que se perdió',
    fecha: '2026-08-15',
    lineas: ['Consultoría de seguros y riesgos'],
    sectores: ['Industria y manufactura', 'Retail y comercio', 'Construcción'],
    entradilla:
      'Es la conversación más difícil del sector, y casi siempre se pudo evitar meses antes con una revisión de sumas aseguradas.',
    cuerpo: [
      {
        titulo: 'Qué es',
        parrafos: [
          'Hay infraseguro cuando la suma asegurada es menor que el valor real del bien en el momento del siniestro. La póliza no cubre la diferencia: la reparte.',
        ],
      },
      {
        titulo: 'Cómo se aplica',
        parrafos: [
          'La regla proporcional indemniza en la misma proporción que existe entre lo asegurado y lo que se debió asegurar. Si un bien de 10 millones estaba asegurado en 6, una pérdida de 4 millones se indemniza al 60 %: 2,4 millones.',
          'La reducción se aplica aunque la pérdida sea parcial y aunque no supere la suma asegurada. Es el punto que más sorprende.',
        ],
      },
      {
        titulo: 'Por qué ocurre sin que nadie lo note',
        parrafos: [
          'Casi nunca es un descuido: es el paso del tiempo. Se asegura una planta por su valor de hace cinco años, se amplía el inventario, se compra maquinaria nueva y la suma sigue igual. La inflación hace el resto.',
        ],
      },
      {
        titulo: 'Cómo se evita',
        parrafos: [
          'Revisando las sumas antes de cada renovación, no después del siniestro. Es una revisión de horas que cambia el resultado de un evento de millones.',
        ],
      },
    ],
  },
  {
    slug: 'evidencia-que-sostiene-un-reclamo',
    tipo: 'Guía',
    titulo: 'Qué hace que la evidencia sostenga un reclamo',
    fecha: '2026-08-22',
    lineas: ['Formación en riesgos y seguros'],
    sectores: ['Aseguradoras y corredores', 'Construcción'],
    entradilla:
      'Ninguna pieza prueba un siniestro por sí sola. Lo que decide un expediente es la correlación entre ellas.',
    cuerpo: [
      {
        titulo: 'Las piezas se sostienen entre sí',
        parrafos: [
          'Una fotografía prueba un daño. Una factura prueba un valor. Un acta prueba un hecho. Ninguna prueba el siniestro. Lo que lo prueba es que todas cuenten la misma historia.',
        ],
      },
      {
        titulo: 'Dónde se rompe la correlación',
        parrafos: [
          'Una factura posterior al siniestro. Un daño que la causa declarada no explica. Un inventario que no coincide con lo que se ve en las fotografías. Cuando una pieza contradice a las demás, el ajuste se detiene hasta aclararlo.',
          'No siempre indica mala fe: muchas veces es un registro mal llevado. Pero el efecto sobre el expediente es el mismo.',
        ],
      },
      {
        titulo: 'Qué documentar aunque parezca innecesario',
        parrafos: [
          'El estado previo del bien, la fecha real de adquisición, y quién tenía acceso o custodia. Son los tres datos que se piden siempre y que casi nunca están.',
        ],
      },
    ],
  },
]

export const recursoPorSlug = Object.fromEntries(recursos.map((r) => [r.slug, r]))

/* Los filtros se derivan del contenido, no se escriben a mano: añadir un
   recurso con una línea nueva la hace aparecer sola en el filtro. */
export const tiposPresentes = [...new Set(recursos.map((r) => r.tipo))]
export const lineasPresentes = [...new Set(recursos.flatMap((r) => r.lineas))].sort()
export const sectoresPresentes = [...new Set(recursos.flatMap((r) => r.sectores))].sort()
