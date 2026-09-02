import {
  Building2,
  Car,
  CircuitBoard,
  Cog,
  Flame,
  Scale,
  ShieldCheck,
  Ship,
  TrendingDown,
  Truck,
} from 'lucide-react'

/**
 * Los diez ramos que cubre la firma.
 *
 * Es un catalogo, no una secuencia: por eso no van numerados.
 *
 * ⚠️ Las definiciones son descripciones tecnicas de practica aseguradora, NO
 * citas literales de la Ley 146-02 sobre Seguros y Fianzas ni de circulares de
 * la Superintendencia de Seguros. Antes de publicar conviene que el equipo
 * tecnico las valide o las sustituya por el texto normativo exacto.
 */
export const ramos = [
  {
    icon: Flame,
    nombre: 'Incendio y líneas aliadas',
    nota: 'Fuego, explosión y riesgos conexos.',
    definicion:
      'Ampara la pérdida o el daño material de los bienes asegurados causado por fuego, rayo y explosión. Las «líneas aliadas» son coberturas anexas que se contratan sobre la misma póliza: fenómenos de la naturaleza, huelga y motín, daño malicioso e impacto de vehículos o aeronaves.',
    evaluamos: [
      'Origen, causa y punto de inicio del fuego',
      'Delimitación entre daño directo y daño consecuencial',
      'Valor de salvamento y bienes recuperables',
      'Aplicación de infraseguro y regla proporcional',
    ],
    documentos: [
      'Póliza con anexos y condiciones particulares',
      'Informe del Cuerpo de Bomberos',
      'Inventario de bienes y facturas de adquisición',
      'Registro fotográfico previo al retiro de escombros',
    ],
  },
  {
    icon: Building2,
    nombre: 'Todo riesgo propiedad y construcción',
    nota: 'Obra civil, montaje y periodo de pruebas.',
    definicion:
      'Opera a riesgo nombrado inverso: cubre todo daño súbito e imprevisto salvo lo excluido expresamente. En obra civil y montaje comprende los trabajos permanentes y temporales, el equipo de construcción y el periodo de pruebas de la maquinaria instalada.',
    evaluamos: [
      'Causa del colapso, asentamiento o defecto',
      'Cumplimiento de las condiciones de obra pactadas',
      'Deducible por evento y periodo de mantenimiento',
      'Alcance del daño a obra terminada frente a obra en curso',
    ],
    documentos: [
      'Contrato de obra y cronograma vigente',
      'Bitácora y planos as-built',
      'Informes de supervisión y ensayos de materiales',
      'Certificaciones de avance de obra',
    ],
  },
  {
    icon: Car,
    nombre: 'Automóvil',
    nota: 'Daños propios y lesionados.',
    definicion:
      'Comprende dos frentes: el daño al vehículo asegurado y la responsabilidad civil frente a terceros por daños a la propiedad y lesiones corporales, dentro de los límites contratados.',
    evaluamos: [
      'Mecánica del accidente y correspondencia de daños',
      'Determinación de pérdida total frente a reparable',
      'Valor comercial a la fecha del siniestro',
      'Imputabilidad y concurrencia de responsabilidades',
    ],
    documentos: [
      'Matrícula, licencia y póliza vigente',
      'Acta policial o certificación de tránsito',
      'Presupuesto de taller detallado por partidas',
      'Fotografías del sitio antes de mover los vehículos',
    ],
  },
  {
    icon: Truck,
    nombre: 'Transporte terrestre',
    nota: 'Mercancía en tránsito por carretera.',
    definicion:
      'Cubre la mercancía desde que sale del almacén de origen hasta su entrega en destino, incluyendo las operaciones de carga, trasbordo y descarga cuando así se pacta.',
    evaluamos: [
      'Idoneidad del embalaje y la estiba',
      'Distinción entre faltante, avería y merma natural',
      'Condiciones del trayecto y del vehículo',
      'Oportunidad de la reserva en el acta de recepción',
    ],
    documentos: [
      'Conduce y guía de despacho',
      'Factura comercial y lista de empaque',
      'Acta de recepción con reservas firmadas',
      'Reclamación formal al transportista',
    ],
  },
  {
    icon: Ship,
    nombre: 'Transporte marítimo',
    nota: 'Embarcaciones y carga marítima.',
    definicion:
      'Ampara el casco de la embarcación y la carga transportada por vía marítima. Distingue la avería particular —daño que soporta el interés afectado— de la avería gruesa, cuyo sacrificio se reparte entre todos los intereses de la travesía.',
    evaluamos: [
      'Condiciones de estiba y trinca en bodega',
      'Exposición a agua de mar y condensación',
      'Aporte a la masa de avería gruesa cuando aplica',
      'Plazos de protesta y prescripción',
    ],
    documentos: [
      'Conocimiento de embarque (B/L)',
      'Manifiesto de carga y póliza de fletamento',
      'Protesta de mar del capitán',
      'Survey de descarga en puerto',
    ],
  },
  {
    icon: Scale,
    nombre: 'Responsabilidad civil',
    nota: 'Reclamos de terceros.',
    definicion:
      'Responde por la obligación legal del asegurado de indemnizar a terceros por daños derivados de su actividad, sus instalaciones o sus productos, incluyendo los gastos de defensa dentro del límite pactado.',
    evaluamos: [
      'Nexo causal entre la actividad y el daño',
      'Concurrencia de culpas y culpa exclusiva de la víctima',
      'Límite por evento frente a límite agregado anual',
      'Alcance temporal: ocurrencia o reclamación',
    ],
    documentos: [
      'Reclamación formal del tercero',
      'Contratos y condiciones generales de venta',
      'Informes técnicos periciales de parte',
      'Actuaciones judiciales en curso',
    ],
  },
  {
    icon: TrendingDown,
    nombre: 'Interrupción de negocios',
    nota: 'Lucro cesante tras el siniestro.',
    definicion:
      'Indemniza la pérdida de beneficio bruto y los gastos permanentes que el asegurado sigue soportando mientras no puede operar, siempre que la interrupción derive de un daño material amparado por la póliza subyacente.',
    evaluamos: [
      'Periodo de indemnización real frente al contratado',
      'Margen bruto histórico y proyección del ejercicio',
      'Gastos ahorrados durante la paralización',
      'Medidas de mitigación adoptadas por el asegurado',
    ],
    documentos: [
      'Estados financieros de los tres ejercicios previos',
      'Declaraciones de renta e ITBIS',
      'Nóminas y contratos de suministro',
      'Presupuesto anual aprobado',
    ],
  },
  {
    icon: ShieldCheck,
    nombre: 'Fianza de fidelidad',
    nota: 'Infidelidad de empleados.',
    definicion:
      'Cubre la pérdida patrimonial directa causada al asegurado por actos deshonestos de sus empleados —hurto, desfalco o apropiación indebida— cometidos durante la vigencia y descubiertos dentro del periodo de descubrimiento pactado.',
    evaluamos: [
      'Fecha de comisión frente a fecha de descubrimiento',
      'Trazabilidad contable del faltante',
      'Deficiencias de control interno concurrentes',
      'Recuperaciones obtenidas del empleado',
    ],
    documentos: [
      'Informe de auditoría interna o externa',
      'Conciliaciones bancarias del periodo',
      'Denuncia formal ante autoridad competente',
      'Expediente laboral del empleado implicado',
    ],
  },
  {
    icon: Cog,
    nombre: 'Avería de maquinarias',
    nota: 'Rotura súbita de equipo industrial.',
    definicion:
      'Ampara la rotura súbita e imprevista de maquinaria por causa interna: fallo eléctrico o mecánico, error de operación, fatiga de material o falta de agua en calderas. Excluye el desgaste natural y el deterioro progresivo.',
    evaluamos: [
      'Causa raíz y modo de fallo',
      'Desgaste acumulado frente a evento súbito',
      'Cumplimiento del plan de mantenimiento',
      'Reparación frente a reposición del equipo',
    ],
    documentos: [
      'Ficha técnica y manual del fabricante',
      'Bitácora de mantenimiento preventivo',
      'Informe técnico del servicio autorizado',
      'Histórico de fallos del equipo',
    ],
  },
  {
    icon: CircuitBoard,
    nombre: 'Equipos electrónicos',
    nota: 'Cómputo e instrumentación.',
    definicion:
      'Cubre el daño súbito a equipos de cómputo, instrumentación médica y electrónica en general. Suele extenderse a portadores externos de datos y a los mayores costos de operación en que se incurre mientras se repone el equipo.',
    evaluamos: [
      'Sobretensión y calidad del suministro eléctrico',
      'Valor de reposición a nuevo frente a valor actual',
      'Obsolescencia y disponibilidad de repuestos',
      'Costo de recuperación de datos cuando se ampara',
    ],
    documentos: [
      'Facturas de adquisición con números de serie',
      'Informe técnico del servicio autorizado',
      'Mediciones de la instalación eléctrica',
      'Registro de respaldos de información',
    ],
  },
]

/* Solo los nombres, para los `select` del formulario de reclamo. */
export const nombresRamos = ramos.map((r) => r.nombre)
