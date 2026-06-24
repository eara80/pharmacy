import { useState } from 'react'
import { Plus, Search, Building2, Phone, Mail, User, MapPin, Edit2, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Modal from '../components/Modal'
import Badge from '../components/Badge'
import type { Establecimiento, EstablecimientoTipo, EstablecimientoEstado } from '../types'

const TIPOS: { value: EstablecimientoTipo; label: string }[] = [
  { value: 'farmacia_privada',      label: 'Farmacia Privada' },
  { value: 'farmacia_social',       label: 'Farmacia Social / OSDE / Sindical' },
  { value: 'botiquin',              label: 'Botiquín de Primeros Auxilios' },
  { value: 'drogueria',             label: 'Droguería' },
  { value: 'deposito_distribucion', label: 'Depósito/Distribución de Medicamentos' },
  { value: 'laboratorio_analisis',  label: 'Laboratorio de Análisis Clínicos' },
]

const ESTADOS: { value: EstablecimientoEstado; label: string; variant: 'blue' | 'yellow' | 'green' | 'red' | 'orange' | 'gray' }[] = [
  { value: 'solicitud',    label: 'Solicitud presentada', variant: 'blue' },
  { value: 'en_proceso',   label: 'En proceso',           variant: 'yellow' },
  { value: 'habilitado',   label: 'Habilitado',           variant: 'green' },
  { value: 'observado',    label: 'Observado',            variant: 'orange' },
  { value: 'suspendido',   label: 'Suspendido',           variant: 'red' },
  { value: 'clausurado',   label: 'Clausurado',           variant: 'gray' },
]

const BLANK: Omit<Establecimiento, 'id'> = {
  nombre: '', tipo: 'farmacia_privada', direccion: '', localidad: '', provincia: '',
  telefono: '', email: '', responsable: '', matriculaResponsable: '',
  estado: 'solicitud', fechaSolicitud: new Date().toISOString().split('T')[0],
  observaciones: '',
}

export default function Establecimientos() {
  const { state, addEstablecimiento, updateEstablecimiento, deleteEstablecimiento } = useApp()
  const [search, setSearch] = useState('')
  const [filterEstado, setFilterEstado] = useState<string>('todos')
  const [filterTipo, setFilterTipo] = useState<string>('todos')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Establecimiento | null>(null)
  const [form, setForm] = useState<Omit<Establecimiento, 'id'>>(BLANK)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const filtered = state.establecimientos.filter((e) => {
    const q = search.toLowerCase()
    const matchSearch = !q || [e.nombre, e.direccion, e.localidad, e.responsable].join(' ').toLowerCase().includes(q)
    const matchEstado = filterEstado === 'todos' || e.estado === filterEstado
    const matchTipo = filterTipo === 'todos' || e.tipo === filterTipo
    return matchSearch && matchEstado && matchTipo
  })

  function openNew() {
    setEditing(null)
    setForm(BLANK)
    setModalOpen(true)
  }

  function openEdit(e: Establecimiento) {
    setEditing(e)
    setForm({ ...e })
    setModalOpen(true)
  }

  function handleSave() {
    if (!form.nombre.trim() || !form.responsable.trim()) return
    if (editing) {
      updateEstablecimiento({ ...form, id: editing.id })
    } else {
      addEstablecimiento(form)
    }
    setModalOpen(false)
  }

  function handleDelete(id: string) {
    deleteEstablecimiento(id)
    setConfirmDelete(null)
  }

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }))

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-52">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input pl-9"
            placeholder="Buscar por nombre, dirección, responsable…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="select w-auto" value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)}>
          <option value="todos">Todos los estados</option>
          {ESTADOS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select className="select w-auto" value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)}>
          <option value="todos">Todos los tipos</option>
          {TIPOS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <button className="btn-primary" onClick={openNew}>
          <Plus size={16} /> Nuevo establecimiento
        </button>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="card p-16 text-center">
          <Building2 size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">
            {state.establecimientos.length === 0 ? 'No hay establecimientos registrados' : 'Sin resultados para el filtro'}
          </p>
          {state.establecimientos.length === 0 && (
            <button className="btn-primary mt-4" onClick={openNew}><Plus size={16} /> Registrar primero</button>
          )}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 text-xs text-gray-500">
            {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                <tr>
                  {['Nombre / Tipo', 'Dirección', 'Responsable', 'Estado', 'N° Hab.', 'Acciones'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((e) => {
                  const tipoLabel = TIPOS.find((t) => t.value === e.tipo)?.label ?? e.tipo
                  const estadoInfo = ESTADOS.find((s) => s.value === e.estado)
                  return (
                    <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{e.nombre}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{tipoLabel}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-gray-600">
                          <MapPin size={12} className="text-gray-400" />
                          {e.direccion}
                        </div>
                        <div className="text-xs text-gray-400">{e.localidad}, {e.provincia}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-gray-700">
                          <User size={12} className="text-gray-400" />
                          {e.responsable}
                        </div>
                        <div className="text-xs text-gray-400">Mat. {e.matriculaResponsable}</div>
                      </td>
                      <td className="px-4 py-3">
                        {estadoInfo && (
                          <Badge variant={estadoInfo.variant}>{estadoInfo.label}</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {e.numeroHabilitacion ?? '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEdit(e)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => setConfirmDelete(e.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Contact details cards */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((e) => (
            <div key={e.id} className="card p-4 flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Building2 size={18} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">{e.nombre}</div>
                <div className="space-y-1 mt-2">
                  {e.telefono && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Phone size={11} /> {e.telefono}
                    </div>
                  )}
                  {e.email && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Mail size={11} /> {e.email}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar establecimiento' : 'Registrar nuevo establecimiento'}
        size="lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="label">Nombre del establecimiento *</label>
            <input className="input" placeholder="Farmacia San Martín" value={form.nombre} onChange={(e) => set('nombre', e.target.value)} />
          </div>
          <div>
            <label className="label">Tipo *</label>
            <select className="select" value={form.tipo} onChange={(e) => set('tipo', e.target.value as EstablecimientoTipo)}>
              {TIPOS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Estado</label>
            <select className="select" value={form.estado} onChange={(e) => set('estado', e.target.value as EstablecimientoEstado)}>
              {ESTADOS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="label">Dirección *</label>
            <input className="input" placeholder="Av. Corrientes 1234" value={form.direccion} onChange={(e) => set('direccion', e.target.value)} />
          </div>
          <div>
            <label className="label">Localidad</label>
            <input className="input" placeholder="Buenos Aires" value={form.localidad} onChange={(e) => set('localidad', e.target.value)} />
          </div>
          <div>
            <label className="label">Provincia</label>
            <input className="input" placeholder="CABA" value={form.provincia} onChange={(e) => set('provincia', e.target.value)} />
          </div>
          <div>
            <label className="label">Director / Responsable Técnico *</label>
            <input className="input" placeholder="Dr. García, Juan Pablo" value={form.responsable} onChange={(e) => set('responsable', e.target.value)} />
          </div>
          <div>
            <label className="label">N° Matrícula</label>
            <input className="input" placeholder="12345" value={form.matriculaResponsable} onChange={(e) => set('matriculaResponsable', e.target.value)} />
          </div>
          <div>
            <label className="label">Teléfono</label>
            <input className="input" placeholder="011-1234-5678" value={form.telefono} onChange={(e) => set('telefono', e.target.value)} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" placeholder="farmacia@email.com" value={form.email} onChange={(e) => set('email', e.target.value)} />
          </div>
          <div>
            <label className="label">Fecha de solicitud</label>
            <input className="input" type="date" value={form.fechaSolicitud} onChange={(e) => set('fechaSolicitud', e.target.value)} />
          </div>
          <div>
            <label className="label">N° Habilitación</label>
            <input className="input" placeholder="HAB-2025-0001" value={form.numeroHabilitacion ?? ''} onChange={(e) => set('numeroHabilitacion', e.target.value)} />
          </div>
          {form.estado === 'habilitado' && (
            <div>
              <label className="label">Fecha de habilitación</label>
              <input className="input" type="date" value={form.fechaHabilitacion ?? ''} onChange={(e) => set('fechaHabilitacion', e.target.value)} />
            </div>
          )}
          <div className="md:col-span-2">
            <label className="label">Observaciones</label>
            <textarea
              className="input h-20 resize-none"
              placeholder="Observaciones generales sobre el establecimiento…"
              value={form.observaciones ?? ''}
              onChange={(e) => set('observaciones', e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancelar</button>
          <button className="btn-primary" onClick={handleSave} disabled={!form.nombre.trim() || !form.responsable.trim()}>
            {editing ? 'Guardar cambios' : 'Registrar establecimiento'}
          </button>
        </div>
      </Modal>

      {/* Confirm delete */}
      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Confirmar eliminación" size="sm">
        <p className="text-sm text-gray-600 mb-6">
          ¿Estás seguro de que querés eliminar este establecimiento? Esta acción no se puede deshacer.
        </p>
        <div className="flex justify-end gap-3">
          <button className="btn-secondary" onClick={() => setConfirmDelete(null)}>Cancelar</button>
          <button className="btn-danger" onClick={() => confirmDelete && handleDelete(confirmDelete)}>Eliminar</button>
        </div>
      </Modal>
    </div>
  )
}
