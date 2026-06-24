export interface Normativa {
  id: string
  codigo: string
  titulo: string
  organismo: string
  fecha: string
  categoria: string
  resumen: string
  url?: string
  vigente: boolean
}

export const NORMATIVAS: Normativa[] = [
  // ─── LEYES NACIONALES ────────────────────────────────────────────────────
  {
    id: 'n-01',
    codigo: 'Ley 16.463',
    titulo: 'Ley de Medicamentos',
    organismo: 'Congreso de la Nación Argentina',
    fecha: '1964-08-03',
    categoria: 'Medicamentos',
    resumen: 'Regula la elaboración, distribución, prescripción, expendio e importación de medicamentos. Base legal de todo el sistema de regulación farmacéutica en Argentina.',
    vigente: true,
  },
  {
    id: 'n-02',
    codigo: 'Ley 17.565',
    titulo: 'Ejercicio de la Farmacia',
    organismo: 'Congreso de la Nación Argentina',
    fecha: '1967-12-18',
    categoria: 'Establecimientos',
    resumen: 'Establece las condiciones para el funcionamiento de farmacias, requisitos del Director Técnico, condiciones de dispensación y obligaciones del personal farmacéutico.',
    vigente: true,
  },
  {
    id: 'n-03',
    codigo: 'Ley 19.303',
    titulo: 'Estupefacientes y Psicotrópicos',
    organismo: 'Congreso de la Nación Argentina',
    fecha: '1971-10-08',
    categoria: 'Psicotrópicos',
    resumen: 'Regula la producción, elaboración, distribución y fiscalización de sustancias estupefacientes y psicotrópicas.',
    vigente: true,
  },
  {
    id: 'n-04',
    codigo: 'Ley 24.051',
    titulo: 'Residuos Peligrosos',
    organismo: 'Congreso de la Nación Argentina',
    fecha: '1991-12-17',
    categoria: 'Residuos',
    resumen: 'Regula la gestión de residuos peligrosos, incluidos los residuos farmacéuticos y de medicamentos vencidos.',
    vigente: true,
  },
  // ─── DECRETOS ────────────────────────────────────────────────────────────
  {
    id: 'n-05',
    codigo: 'Dec. 2200/2005',
    titulo: 'Reglamento de la Ley 17.565',
    organismo: 'Poder Ejecutivo Nacional',
    fecha: '2005-12-16',
    categoria: 'Establecimientos',
    resumen: 'Reglamenta la ley de ejercicio de la farmacia. Define requisitos de infraestructura, superficie mínima, condiciones de habilitación, obligaciones del Director Técnico y régimen de dispensación.',
    vigente: true,
  },
  {
    id: 'n-06',
    codigo: 'Dec. 722/91',
    titulo: 'Reglamento Ley de Estupefacientes',
    organismo: 'Poder Ejecutivo Nacional',
    fecha: '1991-04-15',
    categoria: 'Psicotrópicos',
    resumen: 'Reglamenta el control de estupefacientes en farmacias. Define obligaciones de libro de movimientos, almacenamiento en caja de seguridad, recetario oficial y reportes periódicos.',
    vigente: true,
  },
  {
    id: 'n-07',
    codigo: 'Dec. 150/92',
    titulo: 'Especialidades Medicinales',
    organismo: 'Poder Ejecutivo Nacional',
    fecha: '1992-01-22',
    categoria: 'Medicamentos',
    resumen: 'Establece condiciones de elaboración, fraccionamiento, autorización, registro, comercialización y prescripción de especialidades medicinales.',
    vigente: true,
  },
  // ─── RESOLUCIONES ANMAT ───────────────────────────────────────────────────
  {
    id: 'n-08',
    codigo: 'Res. ANMAT 3475/05',
    titulo: 'Buenas Prácticas de Farmacia (BPF)',
    organismo: 'ANMAT',
    fecha: '2005-06-28',
    categoria: 'BPF / Calidad',
    resumen: 'Adopta las Buenas Prácticas de Farmacia (GPP) de la OMS para farmacias comunitarias y hospitalarias. Define estándares de calidad, documentación, POEs y atención farmacéutica.',
    vigente: true,
  },
  {
    id: 'n-09',
    codigo: 'Res. ANMAT 726/09',
    titulo: 'Almacenamiento y Distribución de Medicamentos',
    organismo: 'ANMAT',
    fecha: '2009-04-30',
    categoria: 'Almacenamiento',
    resumen: 'Establece requisitos para el almacenamiento y distribución de medicamentos, incluyendo control de temperatura, humedad, registros diarios y cadena de frío.',
    vigente: true,
  },
  {
    id: 'n-10',
    codigo: 'Res. ANMAT 706/93',
    titulo: 'Farmacovigilancia',
    organismo: 'ANMAT',
    fecha: '1993-06-30',
    categoria: 'Farmacovigilancia',
    resumen: 'Crea el Sistema Nacional de Farmacovigilancia. Obliga a farmacias a notificar reacciones adversas a medicamentos (RAM) y problemas relacionados con medicamentos (PRM).',
    vigente: true,
  },
  {
    id: 'n-11',
    codigo: 'Res. ANMAT 3683/11',
    titulo: 'Trazabilidad de Medicamentos',
    organismo: 'ANMAT',
    fecha: '2011-07-04',
    categoria: 'Trazabilidad',
    resumen: 'Implementa el sistema de trazabilidad de medicamentos. Obliga a farmacias a reportar ingresos y egresos de medicamentos incluidos en el sistema ANMAT-Trazabilidad.',
    vigente: true,
  },
  {
    id: 'n-12',
    codigo: 'Res. ANMAT 1432/09',
    titulo: 'Preparados Magistrales y Oficinales',
    organismo: 'ANMAT',
    fecha: '2009-07-28',
    categoria: 'Preparaciones',
    resumen: 'Establece los requisitos para la elaboración de preparados magistrales y oficinales en farmacias. Define condiciones de materias primas, equipamiento, documentación y rotulado.',
    vigente: true,
  },
  {
    id: 'n-13',
    codigo: 'Res. ANMAT 2284/11',
    titulo: 'Recetario Oficial para Estupefacientes',
    organismo: 'ANMAT',
    fecha: '2011-04-21',
    categoria: 'Psicotrópicos',
    resumen: 'Aprueba el modelo de recetario oficial para la dispensación de estupefacientes y psicotrópicos de lista I. Define requisitos de validez y archivo de recetas.',
    vigente: true,
  },
  // ─── NORMAS OMS ───────────────────────────────────────────────────────────
  {
    id: 'n-14',
    codigo: 'OMS GPP 2011',
    titulo: 'Buenas Prácticas en Farmacia (GPP) – Estándares para la calidad de los servicios farmacéuticos',
    organismo: 'Organización Mundial de la Salud (OMS/FIP)',
    fecha: '2011-09-01',
    categoria: 'BPF / Calidad',
    resumen: 'Directrices internacionales de buenas prácticas de farmacia. Cubre preparación, atención farmacéutica, gestión de medicamentos, cadena de frío, personal y documentación.',
    vigente: true,
  },
  {
    id: 'n-15',
    codigo: 'OMS – Cadena de Frío',
    titulo: 'Gestión de la cadena de frío para vacunas y medicamentos termosensibles',
    organismo: 'Organización Mundial de la Salud',
    fecha: '2015-01-01',
    categoria: 'Almacenamiento',
    resumen: 'Pautas internacionales para el mantenimiento de la cadena de frío entre 2°C y 8°C, incluyendo equipamiento, monitoreo de temperatura y planes de contingencia.',
    vigente: true,
  },
  // ─── FARMACOPEA ───────────────────────────────────────────────────────────
  {
    id: 'n-16',
    codigo: 'FA Ed.7',
    titulo: 'Farmacopea Argentina 7ª Edición',
    organismo: 'ANMAT / Ministerio de Salud',
    fecha: '2003-01-01',
    categoria: 'Estándares',
    resumen: 'Establece los estándares de calidad, métodos de análisis y condiciones de conservación para medicamentos en Argentina. Fuente de referencia para condiciones de temperatura y humedad.',
    vigente: true,
  },
]

export const CATEGORIAS_NORMATIVAS = [
  'Todas',
  'Establecimientos',
  'Medicamentos',
  'Almacenamiento',
  'Psicotrópicos',
  'BPF / Calidad',
  'Farmacovigilancia',
  'Trazabilidad',
  'Preparaciones',
  'Residuos',
  'Estándares',
]
