export type TipoEstablecimientoId =
  | 'farmacia'
  | 'botica'
  | 'fares'
  | 'farmacia_hospital'
  | 'drogueria'
  | 'deposito'
  | 'laboratorio_analisis'
  | 'botiquin'

export interface NormativaRef {
  codigo: string
  titulo: string
  organismo: string
  tipo: 'ley' | 'decreto' | 'resolucion' | 'disposicion' | 'norma_int' | 'farmacopea'
  articulos?: string
  resumen: string
  vigente: boolean
  critica: boolean
}

export interface RequisitoItem {
  texto: string
  normativa?: string
  critico?: boolean
}

export interface RequisitoCat {
  categoria: string
  icono: string
  items: RequisitoItem[]
}

export interface EnfoqueInspeccion {
  area: string
  puntos: string[]
  alertas?: string[]
}

export interface TipoEstablecimiento {
  id: TipoEstablecimientoId
  label: string
  labelCorto: string
  color: string
  colorBg: string
  colorBorder: string
  descripcion: string
  alcance: string[]
  advertencia?: string
  superficieMinima?: string
  requisitosApertura: RequisitoCat[]
  normativas: NormativaRef[]
  enfoquesInspeccion: EnfoqueInspeccion[]
}

// ─────────────────────────────────────────────────────────────────────────────
// FARMACIA COMUNITARIA / PRIVADA
// ─────────────────────────────────────────────────────────────────────────────
const farmacia: TipoEstablecimiento = {
  id: 'farmacia',
  label: 'Farmacia Comunitaria / Privada',
  labelCorto: 'Farmacia',
  color: 'text-blue-700',
  colorBg: 'bg-blue-50',
  colorBorder: 'border-blue-200',
  descripcion:
    'Establecimiento de salud habilitado para la dispensación de especialidades medicinales, la elaboración de preparados magistrales y la prestación de atención farmacéutica a la comunidad. Es el tipo más frecuente y el más regulado del sistema.',
  alcance: [
    'Dispensación de medicamentos de venta libre y bajo receta',
    'Elaboración de preparados magistrales y oficinales',
    'Atención farmacéutica y seguimiento farmacoterapéutico',
    'Almacenamiento y fraccionamiento de medicamentos',
    'Control y dispensación de psicotrópicos y estupefacientes',
    'Farmacovigilancia activa',
    'Aplicación de vacunas (según habilitación adicional)',
  ],
  superficieMinima: '40 m² (Dec. 2200/2005 Art. 20)',
  requisitosApertura: [
    {
      categoria: 'Planta Física',
      icono: '🏗️',
      items: [
        { texto: 'Superficie mínima de 40 m² totales, libres y ventilados', normativa: 'Dec. 2200/2005 Art. 20', critico: true },
        { texto: 'Acceso directo e independiente a la vía pública (no por otro local)', normativa: 'Dec. 2200/2005 Art. 21', critico: true },
        { texto: 'Área de dispensación diferenciada del almacenamiento', normativa: 'Res. ANMAT 3475/05 Punto 3.1' },
        { texto: 'Paredes, pisos y cielorrasos de material lavable y en buen estado', normativa: 'Dec. 2200/2005 Art. 23' },
        { texto: 'Iluminación mínima de 300 lux en área de dispensación', normativa: 'OMS GPP 2011' },
        { texto: 'Ventilación natural o mecánica adecuada', normativa: 'Dec. 2200/2005 Art. 22' },
        { texto: 'Instalación sanitaria (baño) independiente del área de dispensación', normativa: 'Dec. 2200/2005 Art. 24' },
        { texto: 'Mesada para preparaciones y/o fraccionamiento', normativa: 'Dec. 2200/2005 Art. 25' },
        { texto: 'Sistema de control de temperatura (termohigrómetro calibrado)', normativa: 'Res. ANMAT 726/09 Art. 4', critico: true },
        { texto: 'Heladera de cadena de frío con termómetro de máx/mín', normativa: 'Res. ANMAT 726/09 | Res. MSAL 3631/11', critico: true },
        { texto: 'Local de uso exclusivo farmacéutico (sin actividades ajenas)', normativa: 'Ley 17.565 Art. 6', critico: true },
        { texto: 'Armario o caja de seguridad con llave para psicotrópicos/estupefacientes', normativa: 'Ley 19.303 Art. 21 | Dec. 722/91 Art. 15', critico: true },
      ],
    },
    {
      categoria: 'Personal',
      icono: '👨‍⚕️',
      items: [
        { texto: 'Director Técnico: Farmacéutico/Bioquímico con título universitario', normativa: 'Ley 17.565 Art. 11', critico: true },
        { texto: 'Matrícula profesional del DT vigente en el Colegio correspondiente', normativa: 'Ley 17.565 Art. 8', critico: true },
        { texto: 'Presencia efectiva y continua del DT durante el horario de atención', normativa: 'Ley 17.565 Art. 12 | Dec. 2200/2005 Art. 17', critico: true },
        { texto: 'Personal auxiliar con formación acreditada o certificación habilitante', normativa: 'Ley 17.565 Art. 13' },
        { texto: 'Indumentaria reglamentaria: guardapolvo blanco para todo el personal', normativa: 'Dec. 2200/2005 Art. 26' },
      ],
    },
    {
      categoria: 'Documentación',
      icono: '📋',
      items: [
        { texto: 'Nota de solicitud de habilitación dirigida a la autoridad sanitaria', normativa: 'Dec. 2200/2005 Art. 18', critico: true },
        { texto: 'Título habilitante del Director Técnico (copia autenticada)', normativa: 'Ley 17.565 Art. 11', critico: true },
        { texto: 'Matrícula profesional vigente del Director Técnico', normativa: 'Ley 17.565 Art. 8', critico: true },
        { texto: 'DNI del titular/propietario y del Director Técnico', normativa: 'Dec. 2200/2005' },
        { texto: 'Plano aprobado del local con medidas (visado por municipio)', normativa: 'Dec. 2200/2005 Art. 20', critico: true },
        { texto: 'Habilitación municipal del local (uso comercial/salud)', normativa: 'Cod. Civil Art. 1972' },
        { texto: 'Contrato/título de propiedad del local', normativa: 'Dec. 2200/2005' },
        { texto: 'Contrato laboral o de dirección técnica firmado por ambas partes', normativa: 'Ley 17.565 Art. 14', critico: true },
        { texto: 'Memoria descriptiva del establecimiento', normativa: 'Dec. 2200/2005' },
        { texto: 'Certificado de libre deuda AFIP (CUIT del titular)', normativa: 'RG AFIP 2239' },
        { texto: 'Para SRL/SA: estatuto, acta de designación de autoridades y poderes', normativa: 'Ley 19.550' },
        { texto: 'Póliza de seguro de responsabilidad civil vigente', normativa: 'CCC Art. 1757' },
      ],
    },
    {
      categoria: 'Equipamiento',
      icono: '⚗️',
      items: [
        { texto: 'Termohigrómetro calibrado con certificado vigente', normativa: 'Res. ANMAT 726/09', critico: true },
        { texto: 'Heladera exclusiva para medicamentos (2°C–8°C)', normativa: 'Res. ANMAT 726/09', critico: true },
        { texto: 'Balanza analítica calibrada (si realiza preparaciones magistrales)', normativa: 'Res. ANMAT 1432/09' },
        { texto: 'Material de vidrio y envases para preparaciones (si aplica)', normativa: 'Farmacopea Argentina Ed. 7' },
        { texto: 'Computadora habilitada en sistema de trazabilidad ANMAT', normativa: 'Res. ANMAT 3683/11', critico: true },
        { texto: 'Extintor de incendio (matafuego) con carga vigente', normativa: 'Ley 19.587 | Dec. 351/79' },
        { texto: 'Botiquín de primeros auxilios', normativa: 'Ley 19.587' },
        { texto: 'Estanterías metálicas o de material lavable para almacenamiento', normativa: 'OMS GPP 2011 Sección 3.2' },
      ],
    },
    {
      categoria: 'Libros y Registros',
      icono: '📚',
      items: [
        { texto: 'Libro de estupefacientes rubricado por la autoridad sanitaria', normativa: 'Ley 19.303 Art. 24 | Dec. 722/91 Art. 17', critico: true },
        { texto: 'Libro de quejas y sugerencias (disponible para usuarios)', normativa: 'Res. MSAL 310/2004' },
        { texto: 'Registro de temperatura y humedad (diario)', normativa: 'Res. ANMAT 726/09 Art. 7' },
        { texto: 'Archivo de recetas (clasificadas por tipo)', normativa: 'Dec. 2200/2005 Art. 36' },
        { texto: 'Procedimientos Operativos Estándar (POEs) documentados', normativa: 'Res. ANMAT 3475/05 Anexo I' },
      ],
    },
  ],
  normativas: [
    { codigo: 'Ley 17.565', titulo: 'Ejercicio de la Farmacia', organismo: 'Congreso Nacional', tipo: 'ley', articulos: 'Arts. 1–35', resumen: 'Regula el ejercicio de la farmacia: habilitación, Director Técnico, dispensación, obligaciones y sanciones. Norma madre de toda la actividad farmacéutica comunitaria.', vigente: true, critica: true },
    { codigo: 'Dec. 2200/2005', titulo: 'Reglamentación de la Ley 17.565', organismo: 'Poder Ejecutivo Nacional', tipo: 'decreto', articulos: 'Arts. 15–46', resumen: 'Define superficie mínima (40 m²), acceso directo, condiciones de planta física, presencia del DT, dispensación bajo receta, elaboración magistral y régimen de sanciones.', vigente: true, critica: true },
    { codigo: 'Ley 16.463', titulo: 'Ley de Medicamentos', organismo: 'Congreso Nacional', tipo: 'ley', articulos: 'Arts. 1–25', resumen: 'Marco general de elaboración, distribución, prescripción, expendio e importación de medicamentos. Define infracción, comiso y sanciones.', vigente: true, critica: true },
    { codigo: 'Res. ANMAT 3475/05', titulo: 'Buenas Prácticas de Farmacia (BPF)', organismo: 'ANMAT', tipo: 'resolucion', resumen: 'Adopta las directrices OMS/FIP de BPF. Define estándares de calidad, POEs, atención farmacéutica, seguimiento farmacoterapéutico y documentación obligatoria.', vigente: true, critica: true },
    { codigo: 'Ley 19.303', titulo: 'Estupefacientes y Psicotrópicos', organismo: 'Congreso Nacional', tipo: 'ley', articulos: 'Arts. 20–30', resumen: 'Regula producción, distribución y fiscalización. Obliga a caja de seguridad, libro rubricado, recetario oficial y reportes periódicos.', vigente: true, critica: true },
    { codigo: 'Dec. 722/91', titulo: 'Reglamento Ley de Estupefacientes', organismo: 'Poder Ejecutivo Nacional', tipo: 'decreto', articulos: 'Arts. 15–20', resumen: 'Detalla obligaciones de almacenamiento (armario con llave), libro de movimientos sin enmiendas, recetario oficial y verificación de identidad del paciente.', vigente: true, critica: true },
    { codigo: 'Dec. 150/92', titulo: 'Especialidades Medicinales', organismo: 'Poder Ejecutivo Nacional', tipo: 'decreto', resumen: 'Condiciones de elaboración, fraccionamiento, autorización, registro, comercialización y prescripción de especialidades medicinales.', vigente: true, critica: false },
    { codigo: 'Res. ANMAT 726/09', titulo: 'Almacenamiento y Distribución de Medicamentos', organismo: 'ANMAT', tipo: 'resolucion', resumen: 'Establece requisitos de temperatura (15°C–25°C), humedad (≤60%), cadena de frío (2°C–8°C), termohigrómetros calibrados y registros diarios archivados 2 años.', vigente: true, critica: true },
    { codigo: 'Res. ANMAT 3683/11', titulo: 'Sistema de Trazabilidad de Medicamentos', organismo: 'ANMAT', tipo: 'resolucion', resumen: 'Implementa la trazabilidad obligatoria. La farmacia debe registrar en el sistema ANMAT todos los ingresos y egresos de medicamentos incluidos.', vigente: true, critica: true },
    { codigo: 'Res. ANMAT 706/93', titulo: 'Sistema Nacional de Farmacovigilancia', organismo: 'ANMAT', tipo: 'resolucion', resumen: 'Obliga a notificar reacciones adversas a medicamentos (RAM) y problemas relacionados con medicamentos (PRM) al sistema ANMAT-SIFAR.', vigente: true, critica: false },
    { codigo: 'Res. ANMAT 1432/09', titulo: 'Preparados Magistrales y Oficinales', organismo: 'ANMAT', tipo: 'resolucion', resumen: 'Requisitos para elaboración magistral: materias primas certificadas, equipamiento calibrado, rotulado completo, POEs y registro de cada preparación.', vigente: true, critica: false },
    { codigo: 'Res. ANMAT 2284/11', titulo: 'Recetario Oficial para Estupefacientes', organismo: 'ANMAT', tipo: 'resolucion', resumen: 'Modelo de recetario oficial para Lista I. Define campos obligatorios, archivo de recetas y verificación de identidad del portador.', vigente: true, critica: true },
    { codigo: 'Disp. ANMAT 5358/12', titulo: 'Notificación RAM — Formulario Naranja', organismo: 'ANMAT', tipo: 'disposicion', resumen: 'Aprueba el formulario de notificación de reacciones adversas. La farmacia debe contar con formularios y enviarlos al SIFAR ante cualquier RAM detectada.', vigente: true, critica: false },
    { codigo: 'Res. MSAL 310/2004', titulo: 'Libro de Quejas en Farmacias', organismo: 'Ministerio de Salud', tipo: 'resolucion', resumen: 'Obliga a disponer de libro de quejas y sugerencias disponible para los usuarios en el área de dispensación.', vigente: true, critica: false },
    { codigo: 'OMS GPP 2011', titulo: 'Buenas Prácticas en Farmacia (FIP/OMS)', organismo: 'OMS / FIP', tipo: 'norma_int', resumen: 'Directrices internacionales sobre preparación, atención al paciente, gestión de medicamentos, cadena de frío, farmacovigilancia y formación continua.', vigente: true, critica: false },
    { codigo: 'FA Ed. 7', titulo: 'Farmacopea Argentina 7ª Edición', organismo: 'ANMAT / MSAL', tipo: 'farmacopea', resumen: 'Estándares de calidad, métodos analíticos y condiciones de conservación para medicamentos. Referencia obligatoria para preparaciones magistrales.', vigente: true, critica: false },
  ],
  enfoquesInspeccion: [
    {
      area: 'Director Técnico',
      puntos: [
        'Verificar presencia efectiva en horario de apertura declarado',
        'Comprobar coincidencia entre DT habilitado y DT presente',
        'Revisar matrícula profesional vigente exhibida',
        'Confirmar que el DT está registrado en el Colegio de Farmacéuticos de la jurisdicción',
      ],
      alertas: ['Ausencia del DT durante el horario de atención: falta grave (Art. 12, Ley 17.565)'],
    },
    {
      area: 'Psicotrópicos y Estupefacientes',
      puntos: [
        'Verificar caja de seguridad con llave exclusiva del DT',
        'Revisar el libro de movimientos: sin enmiendas, foliado, saldo cuadra',
        'Cotejar saldo físico con saldo contable del libro',
        'Revisar archivo de recetas oficiales (RP) de los últimos 12 meses',
        'Confirmar reportes periódicos presentados a ANMAT/autoridad jurisdiccional',
      ],
      alertas: [
        'Diferencia de saldo físico vs. libro: posible irregularidad, requiere acta especial',
        'Ausencia de libro rubricado: clausura inmediata del área',
      ],
    },
    {
      area: 'Trazabilidad',
      puntos: [
        'Verificar habilitación activa en sistema ANMAT-Trazabilidad',
        'Comprobar que los movimientos del mes están cargados',
        'Revisar que los productos con trazabilidad obligatoria sean escaneados en el ingreso',
      ],
    },
    {
      area: 'Cadena de Frío',
      puntos: [
        'Temperatura de heladera: entre 2°C y 8°C',
        'Registro de temperatura mínima y máxima: diario y archivado',
        'Ausencia de alimentos o bebidas en la heladera de medicamentos',
        'Plan de contingencia documentado ante corte eléctrico',
        'Termómetro de máx/mín con calibración vigente',
      ],
      alertas: ['Temperatura fuera de rango: separar medicamentos y notificar a distribuidor'],
    },
    {
      area: 'Condiciones de Almacenamiento',
      puntos: [
        'Temperatura ambiental entre 15°C y 25°C (registrada)',
        'Humedad relativa ≤ 60%',
        'Sin medicamentos vencidos en exhibición o depósito',
        'Aplicación de FEFO/FIFO en las estanterías',
        'Medicamentos separados de productos de limpieza o cosméticos',
        'Productos de baja sanitaria: segregados y rotulados "NO DISPENSAR"',
      ],
    },
    {
      area: 'Dispensación',
      puntos: [
        'No se dispensan medicamentos bajo receta sin receta archivada',
        'Las recetas están completas: prescriptor, paciente, medicamento, dosis, firma',
        'Los medicamentos están debidamente identificados (nombre, lote, vencimiento)',
        'Se informa al paciente sobre posología y conservación',
      ],
    },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// BOTICA
// ─────────────────────────────────────────────────────────────────────────────
const botica: TipoEstablecimiento = {
  id: 'botica',
  label: 'Botica',
  labelCorto: 'Botica',
  color: 'text-teal-700',
  colorBg: 'bg-teal-50',
  colorBorder: 'border-teal-200',
  descripcion:
    'Establecimiento farmacéutico de dispensación simplificada. En Argentina, las boticas están generalmente orientadas a áreas urbanas con menor densidad o a zonas donde se autoriza un rango reducido de prestaciones. No están habilitadas para elaborar preparados magistrales. La regulación varía por provincia.',
  alcance: [
    'Dispensación de especialidades medicinales de venta libre',
    'Dispensación de medicamentos bajo receta (sin elaboración magistral)',
    'Atención farmacéutica básica',
    'Almacenamiento y fraccionamiento limitado',
    'Puede incluir o excluir psicotrópicos según habilitación provincial',
  ],
  advertencia:
    'La figura de "Botica" varía significativamente entre provincias. Consultá el marco normativo específico de tu jurisdicción (Colegio de Farmacéuticos provincial y Ministerio de Salud provincial) antes de iniciar el proceso de habilitación.',
  superficieMinima: '25–30 m² (varía por provincia)',
  requisitosApertura: [
    {
      categoria: 'Planta Física',
      icono: '🏗️',
      items: [
        { texto: 'Superficie mínima variable según provincia (25–35 m²)', normativa: 'Legislación provincial', critico: true },
        { texto: 'Acceso directo e independiente a la vía pública', normativa: 'Dec. 2200/2005 Art. 21 (aplicado supletoriamente)', critico: true },
        { texto: 'Local de uso exclusivo farmacéutico', normativa: 'Ley 17.565 Art. 6', critico: true },
        { texto: 'Paredes y pisos de material lavable', normativa: 'Dec. 2200/2005 Art. 23' },
        { texto: 'Sistema de control de temperatura (termohigrómetro calibrado)', normativa: 'Res. ANMAT 726/09', critico: true },
        { texto: 'Heladera de cadena de frío (si distribuye vacunas o biológicos)', normativa: 'Res. ANMAT 726/09' },
        { texto: 'Instalación sanitaria independiente', normativa: 'Dec. 2200/2005 Art. 24' },
      ],
    },
    {
      categoria: 'Personal',
      icono: '👨‍⚕️',
      items: [
        { texto: 'Director Técnico: Farmacéutico con matrícula vigente', normativa: 'Ley 17.565 Art. 11', critico: true },
        { texto: 'Presencia efectiva del DT durante el horario de atención', normativa: 'Ley 17.565 Art. 12', critico: true },
        { texto: 'Indumentaria reglamentaria para todo el personal', normativa: 'Dec. 2200/2005 Art. 26' },
      ],
    },
    {
      categoria: 'Documentación',
      icono: '📋',
      items: [
        { texto: 'Nota de solicitud de habilitación a la autoridad sanitaria provincial', normativa: 'Legislación provincial', critico: true },
        { texto: 'Título y matrícula del DT', normativa: 'Ley 17.565 Art. 11', critico: true },
        { texto: 'Plano del local con medidas (visado)', normativa: 'Legislación provincial', critico: true },
        { texto: 'Habilitación municipal', normativa: 'Código Civil' },
        { texto: 'Contrato de dirección técnica', normativa: 'Ley 17.565 Art. 14', critico: true },
        { texto: 'Declaración jurada de no elaborar preparados magistrales', normativa: 'Varía por provincia' },
      ],
    },
    {
      categoria: 'Restricciones Operativas',
      icono: '⚠️',
      items: [
        { texto: 'Generalmente NO habilitada para elaborar preparados magistrales', normativa: 'Legislación provincial' },
        { texto: 'Restricción en la dispensación de psicotrópicos (depende de la provincia)', normativa: 'Ley 19.303 | Dec. 722/91' },
        { texto: 'Catálogo de productos habilitados limitado según resolución provincial', normativa: 'Colegio Farmacéutico Provincial' },
      ],
    },
  ],
  normativas: [
    { codigo: 'Ley 17.565', titulo: 'Ejercicio de la Farmacia', organismo: 'Congreso Nacional', tipo: 'ley', resumen: 'Marco general aplicable supletoriamente a boticas. Define Director Técnico, obligaciones y sanciones.', vigente: true, critica: true },
    { codigo: 'Legislación Provincial', titulo: 'Habilitación de Boticas (cada jurisdicción)', organismo: 'Ministerio de Salud Provincial', tipo: 'resolucion', resumen: 'Cada provincia regula la figura de "botica" de forma diferente. Buenos Aires, Córdoba, Mendoza y otras tienen sus propios requisitos de superficie, personal y alcance.', vigente: true, critica: true },
    { codigo: 'Res. ANMAT 726/09', titulo: 'Almacenamiento y Distribución', organismo: 'ANMAT', tipo: 'resolucion', resumen: 'Aplica a toda la cadena farmacéutica. Control de temperatura, humedad y cadena de frío obligatorio.', vigente: true, critica: true },
    { codigo: 'Ley 19.303 / Dec. 722/91', titulo: 'Estupefacientes y Psicotrópicos', organismo: 'Congreso Nacional / PEN', tipo: 'ley', resumen: 'Si la botica tiene autorización para dispensar psicotrópicos, aplica el régimen completo de estupefacientes.', vigente: true, critica: false },
    { codigo: 'Res. ANMAT 3683/11', titulo: 'Trazabilidad de Medicamentos', organismo: 'ANMAT', tipo: 'resolucion', resumen: 'Aplica si la botica distribuye medicamentos incluidos en el sistema de trazabilidad.', vigente: true, critica: false },
    { codigo: 'OMS GPP 2011', titulo: 'Buenas Prácticas de Farmacia', organismo: 'OMS / FIP', tipo: 'norma_int', resumen: 'Referencia internacional para atención farmacéutica y gestión de medicamentos.', vigente: true, critica: false },
  ],
  enfoquesInspeccion: [
    {
      area: 'Alcance habilitado',
      puntos: [
        'Verificar que el establecimiento solo dispense dentro de su alcance habilitado',
        'Confirmar que NO elabora preparaciones magistrales (a menos que esté habilitada para ello)',
        'Revisar si tiene autorización para estupefacientes y, si la tiene, verificar libro y caja de seguridad',
      ],
      alertas: ['Dispensa de medicamentos fuera del alcance habilitado: infracción grave'],
    },
    {
      area: 'Planta física y condiciones',
      puntos: [
        'Verificar superficie mínima según normativa provincial',
        'Control de temperatura y humedad con registros diarios',
        'Cadena de frío operativa (si corresponde)',
      ],
    },
    {
      area: 'Director Técnico',
      puntos: [
        'Presencia del DT en horario de atención',
        'Matrícula vigente y correspondiente a la jurisdicción',
      ],
    },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// FARES (Farmacia de Atención Rural y Establecimientos Similares)
// ─────────────────────────────────────────────────────────────────────────────
const fares: TipoEstablecimiento = {
  id: 'fares',
  label: 'FARES — Farmacia de Atención Rural y Est. Similares',
  labelCorto: 'FARES',
  color: 'text-green-700',
  colorBg: 'bg-green-50',
  colorBorder: 'border-green-200',
  descripcion:
    'Las FARES (también denominadas Farmacias Rurales o Establecimientos de Salud con Dispensación en zonas rurales o aisladas) son autorizaciones especiales para garantizar acceso a medicamentos en comunidades donde no es viable instalar una farmacia convencional. La figura varía según la provincia. En algunas jurisdicciones el término exacto es diferente (ej: "Farmacia Rural", "Dispensario de medicamentos", "Puesto sanitario con dispensación").',
  alcance: [
    'Dispensación de medicamentos esenciales (listado aprobado por autoridad sanitaria)',
    'Primeros auxilios básicos en zonas sin otra cobertura farmacéutica',
    'Distribución de medicamentos del Programa Remediar u otros programas estatales',
    'NO incluye elaboración magistral en la mayoría de los casos',
    'Stock limitado a medicamentos esenciales según resolución provincial',
  ],
  advertencia:
    'La figura FARES está definida provincialmente. Los requisitos exactos (superficie, personal, catálogo) los establece el Ministerio de Salud de cada provincia. Esta guía es orientativa. Consultá específicamente con la autoridad sanitaria provincial antes del inicio del trámite.',
  superficieMinima: 'Variable (≥ 12–20 m² según provincia)',
  requisitosApertura: [
    {
      categoria: 'Condiciones de habilitación',
      icono: '📍',
      items: [
        { texto: 'Localidad sin farmacia en un radio mínimo (varía: 5–10 km según provincia)', normativa: 'Legislación provincial', critico: true },
        { texto: 'Declaración de zona rural, aislada o de difícil acceso otorgada por municipio', normativa: 'Legislación provincial', critico: true },
        { texto: 'Local limpio, ventilado y con condiciones básicas de almacenamiento', normativa: 'Legislación provincial | Res. ANMAT 726/09' },
      ],
    },
    {
      categoria: 'Personal',
      icono: '👨‍⚕️',
      items: [
        { texto: 'Responsable técnico habilitado (en algunas provincias puede ser auxiliar de farmacia o enfermero con habilitación especial)', normativa: 'Legislación provincial', critico: true },
        { texto: 'En provincias con mayor exigencia: Farmacéutico como DT con visitas periódicas', normativa: 'Legislación provincial' },
        { texto: 'Capacitación específica en manejo de medicamentos esenciales', normativa: 'Legislación provincial' },
      ],
    },
    {
      categoria: 'Documentación',
      icono: '📋',
      items: [
        { texto: 'Solicitud de habilitación especial como FARES/Farmacia Rural', normativa: 'Legislación provincial', critico: true },
        { texto: 'Certificación de zona rural/aislada emitida por el municipio o intendencia', normativa: 'Legislación provincial', critico: true },
        { texto: 'Listado de medicamentos esenciales aprobado que se dispensarán', normativa: 'Ministerio de Salud Provincial' },
        { texto: 'Título y habilitación del responsable técnico', normativa: 'Legislación provincial', critico: true },
        { texto: 'Plan de reposición y supervisión de medicamentos', normativa: 'Legislación provincial' },
      ],
    },
    {
      categoria: 'Restricciones Operativas',
      icono: '⚠️',
      items: [
        { texto: 'Solo puede dispensar el listado de medicamentos esenciales aprobado', normativa: 'Legislación provincial', critico: true },
        { texto: 'Prohibida la venta de psicotrópicos y estupefacientes Lista I', normativa: 'Ley 19.303', critico: true },
        { texto: 'No puede elaborar preparaciones magistrales', normativa: 'Legislación provincial' },
        { texto: 'Sujeta a supervisión periódica de la autoridad sanitaria provincial', normativa: 'Legislación provincial' },
      ],
    },
  ],
  normativas: [
    { codigo: 'Resolución Provincial', titulo: 'Habilitación de Farmacias Rurales / FARES', organismo: 'Ministerio de Salud Provincial', tipo: 'resolucion', resumen: 'La normativa específica es provincial. Consultá la resolución vigente en tu jurisdicción. Ejemplos: Buenos Aires (Res. MSPBA 1083/99), Córdoba (Ley 6222 y Res. MSC), Mendoza, Santa Fe, etc.', vigente: true, critica: true },
    { codigo: 'Ley 17.565', titulo: 'Ejercicio de la Farmacia', organismo: 'Congreso Nacional', tipo: 'ley', resumen: 'Ley madre, aplicable supletoriamente. La habilitación especial FARES se otorga como excepción fundamentada en la necesidad sanitaria.', vigente: true, critica: true },
    { codigo: 'Res. ANMAT 726/09', titulo: 'Almacenamiento de Medicamentos', organismo: 'ANMAT', tipo: 'resolucion', resumen: 'Las condiciones básicas de conservación (temperatura, humedad, oscuridad) aplican incluso a FARES.', vigente: true, critica: true },
    { codigo: 'Ley 19.303 / Dec. 722/91', titulo: 'Estupefacientes — Restricción total', organismo: 'Congreso Nacional / PEN', tipo: 'ley', resumen: 'Las FARES NO pueden dispensar estupefacientes ni psicotrópicos de Lista I ni II en la mayoría de las provincias.', vigente: true, critica: true },
    { codigo: 'Programa Remediar', titulo: 'Distribución de Medicamentos Esenciales', organismo: 'Ministerio de Salud Nacional', tipo: 'resolucion', resumen: 'Si la FARES integra la red Remediar, debe cumplir con los requisitos de gestión, conservación e informes del Ministerio de Salud de la Nación.', vigente: true, critica: false },
  ],
  enfoquesInspeccion: [
    {
      area: 'Verificación de alcance',
      puntos: [
        'Confirmar que solo se dispensan medicamentos del listado aprobado',
        'Verificar que no se dispensan estupefacientes ni psicotrópicos Lista I/II',
        'Comprobar que no se realizan preparaciones magistrales',
      ],
      alertas: ['Dispensación de medicamentos fuera del listado: infracción grave, posible clausura'],
    },
    {
      area: 'Condiciones de almacenamiento',
      puntos: [
        'Temperatura adecuada para medicamentos esenciales (sin exceder rangos de conservación)',
        'No hay medicamentos vencidos',
        'Los productos están identificados y ordenados',
      ],
    },
    {
      area: 'Supervisión y registros',
      puntos: [
        'Verificar que las visitas de supervisión del DT externo están documentadas',
        'Revisar el registro de movimientos de medicamentos',
        'Confirmar que los informes periódicos a la autoridad sanitaria están presentados',
      ],
    },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// FARMACIA HOSPITALARIA
// ─────────────────────────────────────────────────────────────────────────────
const farmaciaHospital: TipoEstablecimiento = {
  id: 'farmacia_hospital',
  label: 'Farmacia Hospitalaria / de Establecimientos de Salud',
  labelCorto: 'Farmacia Hosp.',
  color: 'text-purple-700',
  colorBg: 'bg-purple-50',
  colorBorder: 'border-purple-200',
  descripcion:
    'Unidad asistencial y de gestión del medicamento integrada en hospitales, clínicas, sanatorios o centros de salud. Su función va mucho más allá de la dispensación: incluye la gestión integral de la farmacoterapia del paciente internado, la preparación de mezclas intravenosas (MIV), la nutrición parenteral, la validación de prescripciones y la farmacovigilancia activa.',
  alcance: [
    'Dispensación a pacientes hospitalizados y ambulatorios del establecimiento',
    'Elaboración de mezclas intravenosas (MIV) y nutrición parenteral',
    'Elaboración de citostáticos en área protegida (si aplica)',
    'Validación farmacéutica de prescripciones médicas',
    'Gestión del formulario terapéutico institucional',
    'Dosis unitaria: preparación y distribución por paciente/horario',
    'Farmacovigilancia activa intrahospitalaria',
    'Conciliación farmacoterapéutica al ingreso y al alta',
    'Gestión de medicamentos especiales: hemoderivados, oncológicos, biológicos',
    'Control de psicotrópicos y estupefacientes institucionales',
  ],
  superficieMinima: 'No definida por superficie fija; depende de la complejidad y camas del establecimiento',
  requisitosApertura: [
    {
      categoria: 'Planta Física',
      icono: '🏥',
      items: [
        { texto: 'Área de dispensación diferenciada e identificada dentro del establecimiento', normativa: 'Dec. 2200/2005 | OPS Farmacia Hospitalaria 2013', critico: true },
        { texto: 'Área de almacenamiento con control de temperatura y humedad', normativa: 'Res. ANMAT 726/09', critico: true },
        { texto: 'Cabina de flujo laminar para preparación de MIV y citostáticos (si aplica)', normativa: 'Disp. ANMAT 740/02 | Normas ASHP', critico: true },
        { texto: 'Área limpia clasificada (ISO 5/ISO 7) para preparaciones estériles', normativa: 'Farmacopea Argentina Ed. 7 | USP <797>', critico: true },
        { texto: 'Sistema de refrigeración diferenciado por tipo de producto', normativa: 'Res. ANMAT 726/09' },
        { texto: 'Área separada para oncológicos/citostáticos con presión negativa (si aplica)', normativa: 'NIOSH 2004-165 | OMS' },
      ],
    },
    {
      categoria: 'Personal',
      icono: '👨‍⚕️',
      items: [
        { texto: 'Jefe de Farmacia: Farmacéutico/Bioquímico especializado en Farmacia Hospitalaria', normativa: 'Ley 17.565 | OPS 2013', critico: true },
        { texto: 'Plantel farmacéutico acorde a la complejidad del establecimiento (camas/especialidades)', normativa: 'OPS Farmacia Hospitalaria 2013' },
        { texto: 'Técnicos de farmacia habilitados para apoyo en dispensación y preparación', normativa: 'Legislación provincial' },
        { texto: 'Capacitación continua en farmacoterapia, preparaciones estériles y oncología (si aplica)', normativa: 'OPS 2013 | ISMP' },
      ],
    },
    {
      categoria: 'Documentación y Sistemas',
      icono: '💻',
      items: [
        { texto: 'Sistema de prescripción electrónica validado farmacéuticamente', normativa: 'OPS 2013 | ISMP' },
        { texto: 'Formulario terapéutico institucional actualizado', normativa: 'OPS Farmacia Hospitalaria 2013' },
        { texto: 'Protocolos de preparación de MIV y citostáticos con validación', normativa: 'Disp. ANMAT 740/02' },
        { texto: 'Sistema de dosis unitaria con perfiles farmacoterapéuticos individuales', normativa: 'OPS 2013 | ASHP' },
        { texto: 'POEs para todas las actividades críticas (preparación, dispensación, devolución)', normativa: 'Res. ANMAT 3475/05' },
        { texto: 'Libro/registro de psicotrópicos y estupefacientes rubricado', normativa: 'Ley 19.303 | Dec. 722/91', critico: true },
        { texto: 'Registro de eventos adversos y errores de medicación (ISMP)', normativa: 'OPS 2013 | Res. ANMAT 706/93' },
      ],
    },
  ],
  normativas: [
    { codigo: 'Ley 17.565', titulo: 'Ejercicio de la Farmacia', organismo: 'Congreso Nacional', tipo: 'ley', resumen: 'Aplica a la farmacia hospitalaria como establecimiento farmacéutico. Director Técnico obligatorio, condiciones de dispensación.', vigente: true, critica: true },
    { codigo: 'Dec. 2200/2005', titulo: 'Reglamentación Ley 17.565', organismo: 'Poder Ejecutivo Nacional', tipo: 'decreto', resumen: 'Aplica supletoriamente. La farmacia hospitalaria puede tener requisitos adicionales de su autoridad sanitaria jurisdiccional.', vigente: true, critica: true },
    { codigo: 'OPS "Farmacia Hospitalaria" 2013', titulo: 'Farmacia Hospitalaria — Guía OPS', organismo: 'Organización Panamericana de la Salud', tipo: 'norma_int', resumen: 'Guía regional de referencia para la organización, gestión, personal, recursos físicos y funciones de la farmacia hospitalaria. Incluye dosis unitaria, MIV, farmacovigilancia y seguridad del paciente.', vigente: true, critica: true },
    { codigo: 'Disp. ANMAT 740/02', titulo: 'Preparaciones Intravenosas Centralizadas', organismo: 'ANMAT', tipo: 'disposicion', resumen: 'Establece requisitos para la preparación centralizada de MIV: cabina de flujo laminar, validación microbiológica, procedimientos de preparación y rotulado.', vigente: true, critica: true },
    { codigo: 'Ley 19.303 | Dec. 722/91', titulo: 'Estupefacientes y Psicotrópicos', organismo: 'Congreso Nacional / PEN', tipo: 'ley', resumen: 'Control estricto de estupefacientes de uso hospitalario (morfina, fentanilo, etc.). Libro institucional, caja de seguridad, registro por paciente.', vigente: true, critica: true },
    { codigo: 'Res. ANMAT 706/93', titulo: 'Farmacovigilancia', organismo: 'ANMAT', tipo: 'resolucion', resumen: 'La farmacia hospitalaria tiene rol clave en la detección, documentación y notificación de RAM intrahospitalarias.', vigente: true, critica: false },
    { codigo: 'ISMP — Medicamentos de Alto Riesgo', titulo: 'Prácticas Seguras con Medicamentos de Alto Riesgo', organismo: 'Institute for Safe Medication Practices', tipo: 'norma_int', resumen: 'Lista de medicamentos de alto riesgo (MAR) que requieren controles adicionales: doble verificación, etiquetado especial, almacenamiento diferenciado.', vigente: true, critica: true },
    { codigo: 'USP <797>', titulo: 'Pharmaceutical Compounding — Sterile Preparations', organismo: 'United States Pharmacopeia', tipo: 'farmacopea', resumen: 'Referencia internacional para preparaciones estériles. Define clases de sala limpia, validación de procesos y controles microbiológicos.', vigente: true, critica: false },
  ],
  enfoquesInspeccion: [
    {
      area: 'Sistema de Dosis Unitaria',
      puntos: [
        'Verificar existencia de perfiles farmacoterapéuticos individualizados por paciente',
        'Confirmar que la dispensación se realiza por dosis individual y no por stock en sala',
        'Revisar que las devoluciones se registran y los medicamentos se reutilizan o destruyen según protocolo',
      ],
      alertas: ['Medicamentos de alto riesgo (insulinas, electrolitos concentrados, anticoagulantes) sin doble verificación: riesgo crítico de seguridad del paciente'],
    },
    {
      area: 'Preparaciones Estériles (MIV)',
      puntos: [
        'Cabina de flujo laminar con validación vigente (certificado)',
        'Personal con entrenamiento documentado en técnica aséptica',
        'Controles microbiológicos de ambientes y superficies',
        'Registro completo de cada preparación (paciente, fórmula, fecha, responsable)',
      ],
    },
    {
      area: 'Estupefacientes hospitalarios',
      puntos: [
        'Libro institucional de estupefacientes rubricado y al día',
        'Registros por paciente: dosis administrada, prescripción médica, enfermero administrador',
        'Caja de seguridad en farmacia y en boxes/UCI según protocolo',
      ],
    },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// DROGUERÍA
// ─────────────────────────────────────────────────────────────────────────────
const drogueria: TipoEstablecimiento = {
  id: 'drogueria',
  label: 'Droguería',
  labelCorto: 'Droguería',
  color: 'text-orange-700',
  colorBg: 'bg-orange-50',
  colorBorder: 'border-orange-200',
  descripcion:
    'Establecimiento comercial mayorista habilitado para la adquisición, almacenamiento, fraccionamiento (en su caso) y distribución de especialidades medicinales, materias primas farmacéuticas y productos afines a clientes habilitados (farmacias, hospitales, clínicas). No puede vender al público en general. Su actividad está regulada por ANMAT como eslabón clave de la cadena de distribución.',
  alcance: [
    'Importación, exportación, adquisición y distribución mayorista de medicamentos',
    'Distribución a farmacias, hospitales y otros habilitados',
    'Fraccionamiento de especialidades medicinales (si habilitado)',
    'Almacenamiento y distribución de psicotrópicos (con autorización específica)',
    'Exportación de medicamentos (con habilitación adicional de ANMAT)',
    'NO puede vender al público en forma directa',
  ],
  superficieMinima: '200 m² (varía según escala de operación)',
  requisitosApertura: [
    {
      categoria: 'Planta Física',
      icono: '🏭',
      items: [
        { texto: 'Superficie adecuada a la escala de operación (generalmente ≥ 200 m²)', normativa: 'Dec. 1299/97 | Res. ANMAT 904/94', critico: true },
        { texto: 'Áreas diferenciadas: recepción, cuarentena, almacenamiento aprobado, despacho, devoluciones', normativa: 'BPD-ANMAT | Res. ANMAT 726/09', critico: true },
        { texto: 'Área de cuarentena claramente delimitada y señalizada', normativa: 'Res. ANMAT 904/94 Art. 8', critico: true },
        { texto: 'Control ambiental: temperatura (15°C–25°C), humedad (≤60%), ventilación forzada', normativa: 'Res. ANMAT 726/09', critico: true },
        { texto: 'Sistema de refrigeración para productos que requieren cadena de frío (2°C–8°C)', normativa: 'Res. ANMAT 726/09', critico: true },
        { texto: 'Protección contra plagas e insectos documentada', normativa: 'Res. ANMAT 904/94' },
        { texto: 'Sistema de seguridad (alarma, control de acceso) para área de psicotrópicos', normativa: 'Ley 19.303 | Dec. 722/91', critico: true },
        { texto: 'Cámara frigorífica validada para productos termosensibles (si aplica)', normativa: 'Res. ANMAT 726/09 | BPD' },
      ],
    },
    {
      categoria: 'Personal',
      icono: '👨‍⚕️',
      items: [
        { texto: 'Director Técnico: Farmacéutico o Bioquímico con matrícula vigente', normativa: 'Dec. 1299/97 Art. 5', critico: true },
        { texto: 'Personal de almacén entrenado en Buenas Prácticas de Distribución (BPD)', normativa: 'Res. ANMAT 904/94' },
        { texto: 'Responsable de Farmacovigilancia designado', normativa: 'Res. ANMAT 706/93' },
        { texto: 'Responsable de Trazabilidad designado y capacitado', normativa: 'Res. ANMAT 3683/11' },
      ],
    },
    {
      categoria: 'Documentación y Sistemas',
      icono: '💻',
      items: [
        { texto: 'Habilitación de droguería otorgada por ANMAT', normativa: 'Dec. 1299/97 Art. 3', critico: true },
        { texto: 'Sistema de trazabilidad ANMAT habilitado y operativo', normativa: 'Res. ANMAT 3683/11 | Disp. 4853/12', critico: true },
        { texto: 'Sistema informático de gestión de stock con trazabilidad lote/vencimiento', normativa: 'Res. ANMAT 3683/11' },
        { texto: 'POEs para todas las operaciones críticas (recepción, cuarentena, despacho, devoluciones)', normativa: 'Res. ANMAT 904/94 | BPD' },
        { texto: 'Certificado BPD (Buenas Prácticas de Distribución) vigente', normativa: 'Res. ANMAT 904/94', critico: true },
        { texto: 'Libro de estupefacientes por CUIT, rubricado (si opera con ellos)', normativa: 'Ley 19.303 | Dec. 722/91', critico: true },
        { texto: 'Registro de temperatura y humedad: monitoreo continuo y archivado', normativa: 'Res. ANMAT 726/09' },
        { texto: 'Plan de respuesta ante desvíos de temperatura (documentado)', normativa: 'Res. ANMAT 726/09' },
        { texto: 'Lista de clientes habilitados receptores (actualizados)', normativa: 'Dec. 1299/97' },
        { texto: 'Seguro de responsabilidad civil vigente', normativa: 'CCC Art. 1757' },
      ],
    },
  ],
  normativas: [
    { codigo: 'Dec. 1299/97', titulo: 'Droguerías — Habilitación y Funcionamiento', organismo: 'Poder Ejecutivo Nacional', tipo: 'decreto', resumen: 'Marco legal de habilitación de droguerías. Define Director Técnico, condiciones de funcionamiento, lista de clientes habilitados y obligaciones de información a ANMAT.', vigente: true, critica: true },
    { codigo: 'Res. ANMAT 904/94', titulo: 'Buenas Prácticas de Distribución (BPD)', organismo: 'ANMAT', tipo: 'resolucion', resumen: 'Establece los estándares de BPD: recepción, cuarentena, almacenamiento, control de temperatura, despacho, devoluciones, retiradas del mercado (recalls) y documentación.', vigente: true, critica: true },
    { codigo: 'Res. ANMAT 3683/11', titulo: 'Trazabilidad de Medicamentos', organismo: 'ANMAT', tipo: 'resolucion', resumen: 'La droguería es eslabón crítico en la cadena de trazabilidad. Obligación de reportar cada movimiento (entrada/salida) de los medicamentos incluidos en el sistema.', vigente: true, critica: true },
    { codigo: 'Res. ANMAT 726/09', titulo: 'Almacenamiento y Distribución', organismo: 'ANMAT', tipo: 'resolucion', resumen: 'Condiciones de almacenamiento, temperatura, humedad, cadena de frío. El monitoreo continuo de temperatura es obligatorio para depósitos mayoristas.', vigente: true, critica: true },
    { codigo: 'Ley 19.303 | Dec. 722/91', titulo: 'Estupefacientes y Psicotrópicos', organismo: 'Congreso Nacional / PEN', tipo: 'ley', resumen: 'Si la droguería distribuye estupefacientes (morfina, fentanilo, etc.), aplica el régimen completo de autorización especial ANMAT, caja de seguridad, libro de movimientos y reportes.', vigente: true, critica: true },
    { codigo: 'Ley 16.463', titulo: 'Ley de Medicamentos', organismo: 'Congreso Nacional', tipo: 'ley', resumen: 'Marco general. La droguería no puede distribuir especialidades sin número de RNOS vigente ni importar sin habilitación específica.', vigente: true, critica: true },
    { codigo: 'Disp. ANMAT 2459/96', titulo: 'Autorización de Importación/Exportación Eventual', organismo: 'ANMAT', tipo: 'disposicion', resumen: 'Regula los procedimientos de importación y exportación eventual de medicamentos no registrados en Argentina.', vigente: true, critica: false },
    { codigo: 'Res. ANMAT 7439/11', titulo: 'Gestión de Medicamentos Falsificados y Adulterados', organismo: 'ANMAT', tipo: 'resolucion', resumen: 'Procedimiento obligatorio de cuarentena, notificación y destrucción ante detección de productos falsificados, adulterados o con alerta sanitaria.', vigente: true, critica: true },
  ],
  enfoquesInspeccion: [
    {
      area: 'Trazabilidad',
      puntos: [
        'Verificar habilitación activa en sistema ANMAT-Trazabilidad',
        'Auditoría de movimientos: confirmar que cada salida reportada coincide con remito de despacho',
        'Revisar que los clientes receptores están habilitados (lista actualizada)',
        'Confirmar manejo correcto ante recalls: productos segregados y notificación a ANMAT',
      ],
      alertas: [
        'Distribución a clientes no habilitados: infracción grave, posible clausura y denuncia penal',
        'Diferencias en trazabilidad: alerta de posible falsificación o desvío',
      ],
    },
    {
      area: 'Cadena de Frío',
      puntos: [
        'Monitoreo de temperatura en tiempo real con alarma (≥ 8°C activa alarma)',
        'Validación del proceso de distribución en frío (cajas isotérmicas, acumuladores de frío)',
        'Registros de temperatura durante el transporte (data loggers)',
        'Calificación IQ/OQ/PQ de cámaras frigoríficas',
      ],
    },
    {
      area: 'Psicotrópicos',
      puntos: [
        'Habilitación especial ANMAT para distribución de psicotrópicos',
        'Libro de estupefacientes con saldo cuadrado',
        'Área de acceso restringido con control de ingreso documentado',
      ],
    },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// DEPÓSITO Y DISTRIBUCIÓN DE MEDICAMENTOS
// ─────────────────────────────────────────────────────────────────────────────
const deposito: TipoEstablecimiento = {
  id: 'deposito',
  label: 'Depósito y Distribución de Medicamentos',
  labelCorto: 'Depósito',
  color: 'text-yellow-700',
  colorBg: 'bg-yellow-50',
  colorBorder: 'border-yellow-200',
  descripcion:
    'Establecimiento habilitado para el almacenamiento y distribución de medicamentos como actividad subsidiaria de un laboratorio de elaboración, importador o fabricante. A diferencia de la droguería, el depósito de distribución generalmente no adquiere medicamentos para revender, sino que opera como soporte logístico de un titular de producto.',
  alcance: [
    'Almacenamiento de medicamentos propios o de terceros (bajo contrato)',
    'Distribución a clientes habilitados (farmacias, hospitales, droguerías)',
    'Recepción y despacho con control de calidad documental',
    'Cuarentena de productos en análisis o con observaciones',
    'Gestión de devoluciones y recalls',
    'Control de cadena de frío (si aplica)',
  ],
  superficieMinima: 'Según escala de operación (no menos de 100 m² en general)',
  requisitosApertura: [
    {
      categoria: 'Planta Física',
      icono: '🏭',
      items: [
        { texto: 'Áreas separadas: recepción, cuarentena, aprobado, rechazado/devoluciones', normativa: 'Res. ANMAT 904/94', critico: true },
        { texto: 'Control ambiental con sensores de temperatura y humedad calibrados', normativa: 'Res. ANMAT 726/09', critico: true },
        { texto: 'Estanterías metálicas que permiten la circulación de aire', normativa: 'OMS GPP | BPD' },
        { texto: 'Zona de carga y descarga con control de temperatura', normativa: 'Res. ANMAT 726/09' },
        { texto: 'Cámara frigorífica con alarma de temperatura (si aplica)', normativa: 'Res. ANMAT 726/09', critico: true },
      ],
    },
    {
      categoria: 'Personal y Documentación',
      icono: '📋',
      items: [
        { texto: 'Director Técnico Farmacéutico con matrícula vigente', normativa: 'Dec. 1299/97 | Res. ANMAT 904/94', critico: true },
        { texto: 'Certificado BPD (Buenas Prácticas de Distribución) vigente', normativa: 'Res. ANMAT 904/94', critico: true },
        { texto: 'Habilitación de depósito otorgada por ANMAT', normativa: 'Dec. 1299/97', critico: true },
        { texto: 'Sistema de trazabilidad ANMAT habilitado', normativa: 'Res. ANMAT 3683/11', critico: true },
        { texto: 'POEs para recepción, cuarentena, despacho y devoluciones', normativa: 'Res. ANMAT 904/94' },
        { texto: 'Contratos con clientes y/o titulares de los productos almacenados', normativa: 'Res. ANMAT 904/94' },
      ],
    },
  ],
  normativas: [
    { codigo: 'Res. ANMAT 904/94', titulo: 'Buenas Prácticas de Distribución (BPD)', organismo: 'ANMAT', tipo: 'resolucion', resumen: 'Principal norma de referencia para depósitos y distribuidoras. Incluye calificación de instalaciones, control de temperatura, cuarentena, gestión de no conformidades y recalls.', vigente: true, critica: true },
    { codigo: 'Dec. 1299/97', titulo: 'Droguerías y Depósitos', organismo: 'Poder Ejecutivo Nacional', tipo: 'decreto', resumen: 'Define la figura del depósito de distribución, sus diferencias con la droguería y los requisitos de habilitación ante ANMAT.', vigente: true, critica: true },
    { codigo: 'Res. ANMAT 3683/11', titulo: 'Trazabilidad', organismo: 'ANMAT', tipo: 'resolucion', resumen: 'El depósito debe reportar todos los movimientos de los productos incluidos en el sistema de trazabilidad.', vigente: true, critica: true },
    { codigo: 'Res. ANMAT 726/09', titulo: 'Almacenamiento de Medicamentos', organismo: 'ANMAT', tipo: 'resolucion', resumen: 'Control de temperatura, humedad, cadena de frío y registro continuo. Obligatorio para todo depósito de medicamentos.', vigente: true, critica: true },
    { codigo: 'Res. ANMAT 7439/11', titulo: 'Alertas y Recalls', organismo: 'ANMAT', tipo: 'resolucion', resumen: 'Procedimiento de segregación, cuarentena y destrucción ante alerts ANMAT. El depósito debe actuar en el plazo definido por la alerta.', vigente: true, critica: true },
  ],
  enfoquesInspeccion: [
    {
      area: 'BPD — Buenas Prácticas de Distribución',
      puntos: [
        'Verificar que el Certificado BPD está vigente',
        'Revisar POEs actualizados y firmados',
        'Auditar registros de temperatura (deben estar archivados 3 años)',
        'Comprobar que los productos en cuarentena están físicamente separados y señalizados',
        'Revisar el procedimiento de recalls: últimas 2 alertas ANMAT y respuesta del depósito',
      ],
    },
    {
      area: 'Trazabilidad',
      puntos: [
        'Sistema de trazabilidad activo y reportes al día',
        'Conciliación de stock físico con stock en sistema',
      ],
    },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// LABORATORIO DE ANÁLISIS CLÍNICOS
// ─────────────────────────────────────────────────────────────────────────────
const laboratorioAnalisis: TipoEstablecimiento = {
  id: 'laboratorio_analisis',
  label: 'Laboratorio de Análisis Clínicos / Bioquímico',
  labelCorto: 'Lab. Análisis',
  color: 'text-red-700',
  colorBg: 'bg-red-50',
  colorBorder: 'border-red-200',
  descripcion:
    'Establecimiento habilitado para realizar análisis clínicos, microbiológicos, histopatológicos u otras determinaciones de laboratorio con fines diagnósticos. Su regulación principal depende de la jurisdicción provincial y de ANMAT cuando incluye el manejo de reactivos de diagnóstico in vitro (IVD). El responsable técnico es generalmente un Bioquímico o médico especialista.',
  alcance: [
    'Análisis hematológicos, bioquímicos, inmunológicos y toxicológicos',
    'Análisis microbiológicos (bacteriología, parasitología, micología)',
    'Análisis histopatológicos y citológicos (si habilitado)',
    'Manejo de reactivos de diagnóstico in vitro (IVD) autorizados por ANMAT',
    'No incluye elaboración de medicamentos ni dispensación farmacéutica',
  ],
  advertencia:
    'Los laboratorios de análisis clínicos son regulados principalmente por la autoridad sanitaria provincial y por los Colegios de Bioquímicos. La regulación de ANMAT aplica principalmente para los reactivos de diagnóstico in vitro (IVD).',
  superficieMinima: 'Variable según jurisdicción (generalmente ≥ 35–50 m²)',
  requisitosApertura: [
    {
      categoria: 'Planta Física',
      icono: '🔬',
      items: [
        { texto: 'Superficie mínima según jurisdicción (generalmente 35–50 m²)', normativa: 'Legislación provincial', critico: true },
        { texto: 'Sala de extracción separada de las áreas analíticas', normativa: 'Dec. 6216/67 | Legislación provincial', critico: true },
        { texto: 'Área de recepción de muestras diferenciada', normativa: 'Legislación provincial' },
        { texto: 'Sector de lavado y esterilización de material', normativa: 'Dec. 6216/67' },
        { texto: 'Instalación de gas (si se utilizan estufas de cultivo o mecheros)', normativa: 'Legislación provincial' },
        { texto: 'Sistema de eliminación de residuos patogénicos (contrato con empresa autorizada)', normativa: 'Dec. 831/93 | Ley 24.051', critico: true },
      ],
    },
    {
      categoria: 'Personal',
      icono: '👨‍⚕️',
      items: [
        { texto: 'Director Técnico: Bioquímico/Farmacéutico-Bioquímico con matrícula vigente en el Colegio de Bioquímicos', normativa: 'Ley 17.132 | Dec. 6216/67 | Legislación provincial', critico: true },
        { texto: 'Bioquímicos en número acorde a la complejidad del laboratorio', normativa: 'Legislación provincial', critico: true },
        { texto: 'Personal de extracción habilitado (enfermeros, técnicos)', normativa: 'Legislación provincial' },
      ],
    },
    {
      categoria: 'Documentación',
      icono: '📋',
      items: [
        { texto: 'Habilitación sanitaria provincial del laboratorio', normativa: 'Legislación provincial', critico: true },
        { texto: 'Título y matrícula vigente del Bioquímico Director Técnico', normativa: 'Legislación provincial', critico: true },
        { texto: 'Plano del local aprobado', normativa: 'Legislación provincial' },
        { texto: 'Contrato de gestión de residuos patogénicos con empresa autorizada', normativa: 'Dec. 831/93 | Ley 24.051', critico: true },
        { texto: 'Registro de reactivos de diagnóstico in vitro (IVD) autorizados por ANMAT', normativa: 'Res. ANMAT 1490/09 | Disp. ANMAT 2674/99', critico: true },
        { texto: 'Programa de control de calidad interno y externo (PEEC o similar)', normativa: 'Res. MSAL 1002/2003' },
      ],
    },
  ],
  normativas: [
    { codigo: 'Ley 17.132', titulo: 'Ejercicio de la Medicina y Profesiones Afines', organismo: 'Congreso Nacional', tipo: 'ley', resumen: 'Marco general para el ejercicio de actividades de salud incluyendo bioquímica. Regula habilitación, ética y sanciones.', vigente: true, critica: true },
    { codigo: 'Dec. 6216/67', titulo: 'Reglamentación de Laboratorios de Análisis Clínicos', organismo: 'Poder Ejecutivo Nacional', tipo: 'decreto', resumen: 'Define los requisitos de funcionamiento de laboratorios de análisis clínicos: sala de extracción, Director Técnico bioquímico, equipamiento y condiciones de higiene.', vigente: true, critica: true },
    { codigo: 'Legislación Provincial', titulo: 'Habilitación de Laboratorios (cada jurisdicción)', organismo: 'Ministerio de Salud Provincial', tipo: 'resolucion', resumen: 'La habilitación y los requisitos específicos son competencia provincial. Cada provincia define superficie mínima, personal y requisitos de acreditación.', vigente: true, critica: true },
    { codigo: 'Res. ANMAT 1490/09', titulo: 'Reactivos de Diagnóstico In Vitro (IVD)', organismo: 'ANMAT', tipo: 'resolucion', resumen: 'Todos los reactivos de diagnóstico utilizados deben estar autorizados por ANMAT. El laboratorio debe verificar el número de autorización antes de su adquisición.', vigente: true, critica: true },
    { codigo: 'Res. MSAL 1002/2003', titulo: 'Control de Calidad en Laboratorios Clínicos', organismo: 'Ministerio de Salud', tipo: 'resolucion', resumen: 'Establece la obligatoriedad de los programas de evaluación externa de calidad (PEEC) y control interno. El laboratorio debe participar en al menos un programa de evaluación.', vigente: true, critica: false },
    { codigo: 'Ley 24.051 | Dec. 831/93', titulo: 'Residuos Patogénicos y Peligrosos', organismo: 'Congreso Nacional / PEN', tipo: 'ley', resumen: 'El laboratorio genera residuos patogénicos (tipo B: sangre, cultivos, agujas). Debe tener contrato con empresa autorizada para recolección y tratamiento.', vigente: true, critica: true },
    { codigo: 'ISO 15189:2022', titulo: 'Laboratorios Clínicos — Requisitos de Calidad y Competencia', organismo: 'ISO / IRAM', tipo: 'norma_int', resumen: 'Estándar internacional de acreditación para laboratorios clínicos. No obligatoria pero altamente recomendada para acreditación ante OAA (Organismo Argentino de Acreditación).', vigente: true, critica: false },
  ],
  enfoquesInspeccion: [
    {
      area: 'Habilitación y Personal',
      puntos: [
        'Verificar habilitación sanitaria vigente de la jurisdicción',
        'Confirmar matrícula vigente del Director Técnico en el Colegio de Bioquímicos',
        'Revisar que el número de bioquímicos es proporcional a la complejidad y volumen del laboratorio',
      ],
    },
    {
      area: 'Reactivos y Equipamiento',
      puntos: [
        'Confirmar que todos los reactivos IVD tienen autorización ANMAT vigente',
        'Verificar calibración de analizadores automáticos (certificados al día)',
        'Revisar participación activa en programa de control de calidad externo (PEEC)',
      ],
      alertas: ['Uso de reactivos no autorizados por ANMAT: infracción grave, posible clausura'],
    },
    {
      area: 'Residuos Patogénicos',
      puntos: [
        'Contrato vigente con empresa autorizada para recolección de residuos patogénicos',
        'Contenedores específicos para material cortopunzante (descartex)',
        'Registro de manifiestos de residuos patogénicos',
      ],
    },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// BOTIQUÍN DE PRIMEROS AUXILIOS (Empresas y Establecimientos)
// ─────────────────────────────────────────────────────────────────────────────
const botiquin: TipoEstablecimiento = {
  id: 'botiquin',
  label: 'Botiquín de Primeros Auxilios (Empresa / Establecimiento)',
  labelCorto: 'Botiquín',
  color: 'text-gray-700',
  colorBg: 'bg-gray-50',
  colorBorder: 'border-gray-200',
  descripcion:
    'Provisión de medicamentos esenciales y material de primeros auxilios en establecimientos laborales, educativos, deportivos, recreativos o de servicio público. No es una farmacia ni requiere Director Técnico farmacéutico, pero sí debe cumplir requisitos mínimos de higiene, seguridad y contenido establecidos por el Ministerio de Trabajo y la autoridad sanitaria.',
  alcance: [
    'Primeros auxilios en emergencias laborales/deportivas/recreativas',
    'Stock limitado de medicamentos esenciales: analgésicos, antisépticos, material de curación',
    'NO incluye dispensación de medicamentos bajo receta',
    'NO incluye elaboración de ningún tipo',
    'Personal de primeros auxilios capacitado (no necesariamente farmacéutico)',
  ],
  advertencia:
    'El botiquín NO es una farmacia. No puede dispensar medicamentos bajo receta al público. Su función es exclusivamente la atención de urgencias y primeros auxilios. En establecimientos con más de 300 personas, se recomienda tener enfermería con profesional habilitado.',
  requisitosApertura: [
    {
      categoria: 'Contenido Mínimo del Botiquín',
      icono: '🩹',
      items: [
        { texto: 'Antisépticos: alcohol 70°, agua oxigenada, iodopovidona', normativa: 'Res. MSAL 301/2011 | Ley 19.587' },
        { texto: 'Material de curación: gasas estériles, vendas, apósitos, esparadrapo', normativa: 'Res. MSAL 301/2011' },
        { texto: 'Termómetro clínico digital', normativa: 'Dec. 351/79 Anexo V' },
        { texto: 'Tijeras, pinzas y guantes descartables estériles', normativa: 'Dec. 351/79 | Res. MSAL 301/2011' },
        { texto: 'Analgésico/antipirético básico (paracetamol/ibuprofeno, VL)', normativa: 'Res. MSAL 301/2011' },
        { texto: 'Torniquete o manguito hemostático', normativa: 'IRAM 3723' },
        { texto: 'Guía de primeros auxilios visible', normativa: 'Ley 19.587 | Dec. 351/79' },
        { texto: 'Desfibrilador externo automático (DEA) en establecimientos con ≥ 1.000 personas', normativa: 'Ley 26.573', critico: true },
      ],
    },
    {
      categoria: 'Condiciones del Botiquín',
      icono: '📋',
      items: [
        { texto: 'Ubicación accesible, señalizada y visible con pictograma normalizado', normativa: 'IRAM 10005-1 | Dec. 351/79', critico: true },
        { texto: 'Cerrado con acceso restringido (para evitar uso indiscriminado)', normativa: 'Dec. 351/79' },
        { texto: 'Medicamentos y materiales dentro del período de validez (sin vencidos)', normativa: 'Ley 16.463 Art. 22', critico: true },
        { texto: 'Temperatura de almacenamiento adecuada (no expuesto al calor o sol)', normativa: 'Farmacopea Argentina Ed. 7' },
        { texto: 'Inventario actualizado con lista de contenido y vencimientos', normativa: 'Dec. 351/79' },
        { texto: 'Responsable designado para el mantenimiento y reposición del botiquín', normativa: 'Ley 19.587 Art. 9' },
      ],
    },
    {
      categoria: 'Personal',
      icono: '👨‍⚕️',
      items: [
        { texto: 'Personal capacitado en primeros auxilios básicos (RCP, manejo de heridas)', normativa: 'Ley 19.587 | Dec. 351/79', critico: true },
        { texto: 'En establecimientos con > 300 empleados: servicio de enfermería o médico de empresa', normativa: 'Dec. 1338/96 (Servicios de Medicina del Trabajo)' },
        { texto: 'Registro de capacitaciones del personal de primeros auxilios', normativa: 'Ley 19.587 | SRT' },
      ],
    },
  ],
  normativas: [
    { codigo: 'Ley 19.587', titulo: 'Higiene y Seguridad en el Trabajo', organismo: 'Congreso Nacional', tipo: 'ley', resumen: 'Obliga a los empleadores a contar con primeros auxilios, botiquín y personal capacitado en todos los establecimientos laborales.', vigente: true, critica: true },
    { codigo: 'Dec. 351/79', titulo: 'Reglamentación Ley 19.587 — Higiene y Seguridad', organismo: 'Poder Ejecutivo Nacional', tipo: 'decreto', articulos: 'Anexo V', resumen: 'Anexo V define el contenido mínimo del botiquín de primeros auxilios y las condiciones de accesibilidad según el tipo y tamaño del establecimiento.', vigente: true, critica: true },
    { codigo: 'Res. MSAL 301/2011', titulo: 'Contenido Mínimo del Botiquín', organismo: 'Ministerio de Salud', tipo: 'resolucion', resumen: 'Actualiza y define el listado mínimo de elementos del botiquín de primeros auxilios: antisépticos, material de curación, medicamentos de venta libre básicos y equipamiento.', vigente: true, critica: true },
    { codigo: 'Dec. 1338/96', titulo: 'Servicios de Medicina del Trabajo', organismo: 'Poder Ejecutivo Nacional', tipo: 'decreto', resumen: 'Define los requisitos de los servicios de medicina del trabajo: médico de empresa, enfermería, según número de empleados y riesgo de la actividad.', vigente: true, critica: false },
    { codigo: 'Ley 26.573', titulo: 'Desfibriladores Externos Automáticos (DEA)', organismo: 'Congreso Nacional', tipo: 'ley', resumen: 'Obliga a disponer de DEA en establecimientos con alta concentración de público (estadios, aeropuertos, centros comerciales, escuelas con ≥1.000 personas). El personal debe saber utilizarlo.', vigente: true, critica: false },
    { codigo: 'IRAM 3723', titulo: 'Botiquines de Primeros Auxilios', organismo: 'IRAM', tipo: 'norma_int', resumen: 'Norma técnica argentina que especifica el contenido, clasificación y señalización de botiquines de primeros auxilios según el tipo de establecimiento.', vigente: true, critica: false },
  ],
  enfoquesInspeccion: [
    {
      area: 'Contenido y estado del botiquín',
      puntos: [
        'Verificar que todos los elementos del listado mínimo están presentes',
        'Confirmar que no hay elementos vencidos (revisar fechas en cada ítem)',
        'Comprobar que los medicamentos de venta libre presentes son los autorizados',
        'Revisar inventario actualizado',
      ],
      alertas: ['Presencia de medicamentos bajo receta en el botiquín: infracción — retirar inmediatamente'],
    },
    {
      area: 'Señalización y accesibilidad',
      puntos: [
        'Pictograma de primeros auxilios visible',
        'Ubicación accesible para todos los trabajadores',
        'Responsable designado conoce la ubicación y el contenido',
      ],
    },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export const TIPOS_ESTABLECIMIENTOS: TipoEstablecimiento[] = [
  farmacia,
  botica,
  fares,
  farmaciaHospital,
  drogueria,
  deposito,
  laboratorioAnalisis,
  botiquin,
]
