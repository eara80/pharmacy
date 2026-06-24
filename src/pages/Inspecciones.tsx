import { useState } from 'react'
import {
  Plus, Search, Filter, Calendar, User, Eye,
  Clock, CheckCircle2, XCircle, AlertCircle,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import Modal from '../components/Modal'
import Badge from '../components/Badge'
import type { Inspeccion, InspeccionTipo, InspeccionEstado } from '../types'
import { buildChecklist } from '../data/checklistData'

const TIPOS_INSP: { value: InspeccionTipo; label: string; color: 'blue' | 'purple' | 'red' | 'yellow' | 'orange' | 'gray' }[] = [
  { value: 'apertura',     label: 'Apertura',      color: 'blue' },
  { value: 'rutina',       label: 'Rutina',         color: 'purple' },
  { value: 'denuncia',     label: 'Denuncia',       color: 'red' },
  { value: 'seguimiento',  label: 'Seguimiento',    color: 'yellow' },
  { value: 'sorpresiva',   label: 'Sorpresiva',     color: 'orange' },
  { value: 'reinspeccion', label: 'Reinspección',   color: 'gray' },
]

const BLANK_INSP: Omit<Inspeccion, 'id' | 'items'> = {
  establecimientoId: '',
  tipo: 'rutina',
  estado: 'programada',
  fechaProgramada: new Date().toISOString().split('T')[0],
  inspector: '',
  coInspector: '',
  acta: '',
  observacionesGenerales: '',
}

interface Props {
  onGoChecklist: (inspeccionId: string) => void
}

export default function Inspecciones({ onGoChecklist }: Props) {
  const { state, addInspeccion, updateInspeccion } = useApp()
  const [search, setSearch] = useState('')
  const [filterTipo, setFilterTipo] = useState<string>('todos')
  const [filterEstado, setFilterEstado] = useState<string>('todos')
  const [modalOpen, setModalOpen] = useState(false)
  const [detailInsp, setDetailInsp] = useState<Inspeccion | null>(null)
  const [form, setForm] = useState<Omit<Inspeccion, 'id' | 'items'>>(BLANK_INSP)

  const { inspecciones, establecimientos } = state

  const filtered = inspecciones.filter((i) => {
    const est = establecimientos.find((e) => e.id === i.establecimientoId)
    const q = search.toLowerCase()
    const matchSearch = !q || [est?.nombre ?? '', i.inspector, i.acta ?? ''].join(' ').toLowerCase().includes(q)
    const matchTipo = filterTipo === 'todos' || i.tipo === filterTipo
    const matchEstado = filterEstado === 'todos' || i.estado === filterEstado
    return matchSearch && matchTipo && matchEstado
  }).sort((a, b) => b.fechaProgramada.localeCompare(a.fechaProgramada))

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }))

  function handleCreate() {
    if (!form.establecimientoId || !form.inspector) return
    addInspeccion({ ...form, items: buildChecklist() })
    setModalOpen(false)
    setForm(BLANK_INSP)
  }

  function markInCourse(insp: Inspeccion) {
    updateInspeccion({ ...insp, estado: 'en_curso', fechaRealizacion: new Date().toISOString().split('T')[0] })
  }

  function markCancelled(insp: Inspeccion) {
    updateInspeccion({ ...insp, estado: 'cancelada' })
  }

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-52">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input pl-9"
            placeholder="Buscar por establecimiento, inspector, acta…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-gray-400" />
          <select className="select w-auto" value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)}>
            <option value="todos">Todos los tipos</option>
            {TIPOS_INSP.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <select className="select w-auto" value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)}>
            <option value="todos">Todos los estados</option>
            <option value="programada">Programada</option>
            <option value="en_curso">En curso</option>
            <option value="completada">Completada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
        <button className="btn-primary" onClick={() => setModalOpen(true)}>
          <Plus size={16} /> Nueva inspección
        </button>
      </div>

      {/* Summary counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Programadas',   count: inspecciones.filter(i => i.estado === 'programada').length,  icon: Clock,         color: 'text-blue-600 bg-blue-50' },
          { label: 'En curso',      count: inspecciones.filter(i => i.estado === 'en_curso').length,    icon: AlertCircle,   color: 'text-yellow-600 bg-yellow-50' },
          { label: 'Completadas',   count: inspecciones.filter(i => i.estado === 'completada').length,  icon: CheckCircle2,  color: 'text-green-600 bg-green-50' },
          { label: 'Canceladas',    count: inspecciones.filter(i => i.estado === 'cancelada').length,   icon: XCircle,       color: 'text-gray-500 bg-gray-50' },
        ].map(({ label, count, icon: Icon, color }) => (
          <div key={label} className={`card p-4 flex items-center gap-3 ${color.split(' ')[1]}`}>
            <Icon size={20} className={color.split(' ')[0]} />
            <div>
              <div className="text-xl font-bold text-gray-900">{count}</div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="card p-16 text-center">
          <Search size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">
            {inspecciones.length === 0 ? 'No hay inspecciones registradas' : 'Sin resultados para el filtro'}
          </p>
          {inspecciones.length === 0 && (
            <button className="btn-primary mt-4" onClick={() => setModalOpen(true)}>
              <Plus size={16} /> Crear primera inspección
            </button>
          )}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                {['Establecimiento', 'Tipo', 'Fecha', 'Inspector', 'Acta N°', 'Estado', 'Resultado', 'Puntaje', 'Acciones'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((insp) => {
                const est = establecimientos.find((e) => e.id === insp.establecimientoId)
                const tipoInfo = TIPOS_INSP.find((t) => t.value === insp.tipo)
                return (
                  <tr key={insp.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {est?.nombre ?? '—'}
                      <div className="text-xs text-gray-400 font-normal">{est?.localidad}</div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={tipoInfo?.color ?? 'gray'}>{tipoInfo?.label ?? insp.tipo}</Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(insp.fechaProgramada + 'T00:00:00').toLocaleDateString('es-AR')}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      <div className="flex items-center gap-1">
                        <User size={12} />
                        {insp.inspector}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{insp.acta || '—'}</td>
                    <td className="px-4 py-3"><EstadoBadge estado={insp.estado} /></td>
                    <td className="px-4 py-3">
                      {insp.resultado ? <ResultadoBadge resultado={insp.resultado} /> : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      {insp.puntaje !== undefined ? (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${insp.puntaje >= 80 ? 'bg-green-500' : insp.puntaje >= 60 ? 'bg-yellow-400' : 'bg-red-500'}`}
                              style={{ width: `${insp.puntaje}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-700">{insp.puntaje.toFixed(0)}%</span>
                        </div>
                      ) : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setDetailInsp(insp)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Ver detalle"
                        >
                          <Eye size={15} />
                        </button>
                        {insp.estado === 'programada' && (
                          <button
                            onClick={() => { markInCourse(insp); onGoChecklist(insp.id) }}
                            className="px-2 py-1 text-xs bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                          >
                            Iniciar
                          </button>
                        )}
                        {insp.estado === 'en_curso' && (
                          <button
                            onClick={() => onGoChecklist(insp.id)}
                            className="px-2 py-1 text-xs bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                          >
                            Continuar
                          </button>
                        )}
                        {insp.estado === 'completada' && (
                          <button
                            onClick={() => onGoChecklist(insp.id)}
                            className="px-2 py-1 text-xs bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            Ver acta
                          </button>
                        )}
                        {insp.estado === 'programada' && (
                          <button
                            onClick={() => markCancelled(insp)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Cancelar"
                          >
                            <XCircle size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Create modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Programar nueva inspección" size="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="label">Establecimiento *</label>
            <select
              className="select"
              value={form.establecimientoId}
              onChange={(e) => set('establecimientoId', e.target.value)}
            >
              <option value="">-- Seleccioná un establecimiento --</option>
              {establecimientos.map((e) => (
                <option key={e.id} value={e.id}>{e.nombre} — {e.localidad}</option>
              ))}
            </select>
            {establecimientos.length === 0 && (
              <p className="text-xs text-red-500 mt-1">Primero registrá un establecimiento</p>
            )}
          </div>
          <div>
            <label className="label">Tipo de inspección *</label>
            <select className="select" value={form.tipo} onChange={(e) => set('tipo', e.target.value as InspeccionTipo)}>
              {TIPOS_INSP.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Estado inicial</label>
            <select className="select" value={form.estado} onChange={(e) => set('estado', e.target.value as InspeccionEstado)}>
              <option value="programada">Programada</option>
              <option value="en_curso">En curso</option>
            </select>
          </div>
          <div>
            <label className="label">Fecha programada *</label>
            <input className="input" type="date" value={form.fechaProgramada} onChange={(e) => set('fechaProgramada', e.target.value)} />
          </div>
          <div>
            <label className="label">N° de Acta</label>
            <input className="input" placeholder="ACTA-2025-001" value={form.acta ?? ''} onChange={(e) => set('acta', e.target.value)} />
          </div>
          <div>
            <label className="label">Inspector *</label>
            <input className="input" placeholder="Nombre del inspector" value={form.inspector} onChange={(e) => set('inspector', e.target.value)} />
          </div>
          <div>
            <label className="label">Co-Inspector</label>
            <input className="input" placeholder="Nombre del co-inspector (opcional)" value={form.coInspector ?? ''} onChange={(e) => set('coInspector', e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="label">Observaciones previas / Motivo</label>
            <textarea
              className="input h-20 resize-none"
              placeholder="Motivo de la inspección, antecedentes, denuncia previa…"
              value={form.observacionesGenerales ?? ''}
              onChange={(e) => set('observacionesGenerales', e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancelar</button>
          <button
            className="btn-primary"
            onClick={handleCreate}
            disabled={!form.establecimientoId || !form.inspector}
          >
            Crear inspección
          </button>
        </div>
      </Modal>

      {/* Detail modal */}
      {detailInsp && (() => {
        const est = establecimientos.find((e) => e.id === detailInsp.establecimientoId)
        return (
          <Modal
            open={!!detailInsp}
            onClose={() => setDetailInsp(null)}
            title="Detalle de inspección"
            size="lg"
          >
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <InfoRow label="Establecimiento" value={est?.nombre ?? '—'} />
                <InfoRow label="Tipo" value={TIPOS_INSP.find(t => t.value === detailInsp.tipo)?.label ?? detailInsp.tipo} />
                <InfoRow label="Fecha programada" value={new Date(detailInsp.fechaProgramada + 'T00:00:00').toLocaleDateString('es-AR')} />
                {detailInsp.fechaRealizacion && (
                  <InfoRow label="Fecha realización" value={new Date(detailInsp.fechaRealizacion + 'T00:00:00').toLocaleDateString('es-AR')} />
                )}
                <InfoRow label="Inspector" value={detailInsp.inspector} />
                {detailInsp.coInspector && <InfoRow label="Co-Inspector" value={detailInsp.coInspector} />}
                {detailInsp.acta && <InfoRow label="N° Acta" value={detailInsp.acta} />}
                {detailInsp.puntaje !== undefined && (
                  <InfoRow label="Puntaje" value={`${detailInsp.puntaje.toFixed(1)}%`} />
                )}
              </div>
              {detailInsp.observacionesGenerales && (
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Observaciones</div>
                  <p className="text-gray-700 bg-gray-50 rounded-lg p-3 text-xs">{detailInsp.observacionesGenerales}</p>
                </div>
              )}
              {detailInsp.items.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Resumen del checklist</div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {(['cumple', 'no_cumple', 'no_aplica', 'pendiente'] as const).map((e) => {
                      const count = detailInsp.items.filter(i => i.estado === e).length
                      const colors = { cumple: 'text-green-600 bg-green-50', no_cumple: 'text-red-600 bg-red-50', no_aplica: 'text-gray-500 bg-gray-50', pendiente: 'text-yellow-600 bg-yellow-50' }
                      const labels = { cumple: 'Cumple', no_cumple: 'No cumple', no_aplica: 'N/A', pendiente: 'Pendiente' }
                      return (
                        <div key={e} className={`rounded-lg p-3 ${colors[e]}`}>
                          <div className="text-xl font-bold">{count}</div>
                          <div className="text-xs">{labels[e]}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </Modal>
        )
      })()}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-gray-400 font-medium">{label}</div>
      <div className="text-gray-800 font-medium mt-0.5">{value}</div>
    </div>
  )
}

function EstadoBadge({ estado }: { estado: string }) {
  const map: Record<string, { label: string; variant: 'blue' | 'yellow' | 'green' | 'gray' }> = {
    programada: { label: 'Programada', variant: 'blue' },
    en_curso:   { label: 'En curso',   variant: 'yellow' },
    completada: { label: 'Completada', variant: 'green' },
    cancelada:  { label: 'Cancelada',  variant: 'gray' },
  }
  const { label, variant } = map[estado] ?? { label: estado, variant: 'gray' }
  return <Badge variant={variant}>{label}</Badge>
}

function ResultadoBadge({ resultado }: { resultado: string }) {
  const map: Record<string, { label: string; variant: 'green' | 'yellow' | 'red' | 'orange' }> = {
    aprobado:                   { label: 'Aprobado',           variant: 'green' },
    aprobado_con_observaciones: { label: 'Con observaciones',  variant: 'yellow' },
    desaprobado:                { label: 'Desaprobado',        variant: 'red' },
    clausura_preventiva:        { label: 'Clausura preventiva', variant: 'orange' },
  }
  const { label, variant } = map[resultado] ?? { label: resultado, variant: 'yellow' }
  return <Badge variant={variant}>{label}</Badge>
}
