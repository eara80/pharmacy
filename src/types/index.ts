export type EstablecimientoTipo =
  | 'farmacia_privada'
  | 'farmacia_social'
  | 'botiquin'
  | 'drogueria'
  | 'deposito_distribucion'
  | 'laboratorio_analisis';

export type EstablecimientoEstado =
  | 'solicitud'
  | 'en_proceso'
  | 'habilitado'
  | 'observado'
  | 'suspendido'
  | 'clausurado';

export interface Establecimiento {
  id: string;
  nombre: string;
  tipo: EstablecimientoTipo;
  direccion: string;
  localidad: string;
  provincia: string;
  telefono: string;
  email: string;
  responsable: string;
  matriculaResponsable: string;
  estado: EstablecimientoEstado;
  fechaSolicitud: string;
  fechaHabilitacion?: string;
  numeroHabilitacion?: string;
  observaciones?: string;
}

export type InspeccionTipo =
  | 'apertura'
  | 'rutina'
  | 'denuncia'
  | 'seguimiento'
  | 'sorpresiva'
  | 'reinspeccion';

export type InspeccionEstado =
  | 'programada'
  | 'en_curso'
  | 'completada'
  | 'cancelada';

export type InspeccionResultado =
  | 'aprobado'
  | 'aprobado_con_observaciones'
  | 'desaprobado'
  | 'clausura_preventiva';

export type ItemEstado = 'cumple' | 'no_cumple' | 'no_aplica' | 'pendiente';

export interface ChecklistItem {
  id: string;
  categoria: string;
  subcategoria?: string;
  descripcion: string;
  normativa: string;
  critico: boolean;
  estado: ItemEstado;
  observacion: string;
  evidencia?: string;
}

export interface Inspeccion {
  id: string;
  establecimientoId: string;
  tipo: InspeccionTipo;
  estado: InspeccionEstado;
  resultado?: InspeccionResultado;
  fechaProgramada: string;
  fechaRealizacion?: string;
  inspector: string;
  coInspector?: string;
  acta?: string;
  puntaje?: number;
  items: ChecklistItem[];
  observacionesGenerales?: string;
  plazoSubsanacion?: string;
}

export interface Apertura {
  id: string;
  establecimientoId: string;
  etapa: number;
  fechaInicio: string;
  documentacion: DocumentacionItem[];
  inspeccionId?: string;
}

export interface DocumentacionItem {
  id: string;
  nombre: string;
  requerido: boolean;
  presentado: boolean;
  fechaVencimiento?: string;
  observacion?: string;
}

export type TabId =
  | 'dashboard'
  | 'establecimientos'
  | 'apertura'
  | 'inspecciones'
  | 'checklist'
  | 'normativas'
  | 'reportes';

export interface AppState {
  establecimientos: Establecimiento[];
  inspecciones: Inspeccion[];
  aperturas: Apertura[];
}
