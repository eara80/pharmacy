import { useState, useMemo } from 'react'
import {
  CheckCircle2, XCircle, MinusCircle, AlertTriangle,
  ChevronDown, ChevronUp, Printer, Save, Search,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import Badge from '../components/Badge'
import type { ChecklistItem, ItemEstado, InspeccionResultado } from '../types'
import { CATEGORIAS } from '../data/checklistData'

interface Props {
  inspeccionId: string | null
  onBack: () => void
}

export default function Checklist({ inspeccionId, onBack }: Props) {
  const { state, updateInspeccion } = useApp()
  const [catFilter, setCatFilter] = useState<string>('Todas')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [soloIncumplidos, setSoloIncumplidos] = useState(false)

  const inspeccionFound = state.inspecciones.find((i) => i.id === inspeccionId)
  const est = state.establecimientos.find((e) => e.id === inspeccionFound?.establecimientoId)

  if (!inspeccionFound) {
    return (
      <div className="card p-16 text-center">
        <AlertTriangle size={40} className="mx-auto text-yellow-400 mb-3" />
        <p className="text-gray-500 font-medium">Seleccioná una inspección desde la pestaña Inspecciones</p>
        <button className="btn-primary mt-4" onClick={onBack}>Ir a Inspecciones</button>
      </div>
    )
  }

  const inspeccion = inspeccionFound

  const isReadOnly = inspeccion.estado === 'completada'

  function updateItem(itemId: string, estado: ItemEstado) {
    if (isReadOnly) return
    const updated = {
      ...inspeccion,
      items: inspeccion.items.map((i) =>
        i.id === itemId ? { ...i, estado } : i
      ),
    }
    updateInspeccion(updated)
  }

  function updateObservacion(itemId: string, obs: string) {
    if (isReadOnly) return
    const updated = {
      ...inspeccion,
      items: inspeccion.items.map((i) =>
        i.id === itemId ? { ...i, observacion: obs } : i
      ),
    }
    updateInspeccion(updated)
  }

  function toggleExpanded(cat: string) {
    setExpanded((prev) => ({ ...prev, [cat]: !prev[cat] }))
  }

  const stats = useMemo(() => {
    const cumple = inspeccion.items.filter((i) => i.estado === 'cumple').length
    const noCumple = inspeccion.items.filter((i) => i.estado === 'no_cumple').length
    const noAplica = inspeccion.items.filter((i) => i.estado === 'no_aplica').length
    const pendiente = inspeccion.items.filter((i) => i.estado === 'pendiente').length
    const criticos = inspeccion.items.filter((i) => i.critico && i.estado === 'no_cumple').length
    const evaluables = inspeccion.items.filter((i) => i.estado !== 'no_aplica' && i.estado !== 'pendiente').length
    const puntaje = evaluables > 0 ? (cumple / evaluables) * 100 : 0
    return { cumple, noCumple, noAplica, pendiente, criticos, puntaje, evaluables }
  }, [inspeccion.items])

  const filteredItems = inspeccion.items.filter((item) => {
    const matchCat = catFilter === 'Todas' || item.categoria === catFilter
    const matchSearch = !search || item.descripcion.toLowerCase().includes(search.toLowerCase()) || item.normativa.toLowerCase().includes(search.toLowerCase())
    const matchIncumplidos = !soloIncumplidos || item.estado === 'no_cumple'
    return matchCat && matchSearch && matchIncumplidos
  })

  const itemsByCategory = CATEGORIAS.reduce<Record<string, ChecklistItem[]>>((acc, cat) => {
    const items = filteredItems.filter((i) => i.categoria === cat)
    if (items.length > 0) acc[cat] = items
    return acc
  }, {})

  function computeResultado(): InspeccionResultado {
    if (stats.criticos > 0) return 'clausura_preventiva'
    if (stats.puntaje < 60) return 'desaprobado'
    if (stats.puntaje < 80) return 'aprobado_con_observaciones'
    return 'aprobado'
  }

  function finalizarInspeccion() {
    const resultado = computeResultado()
    const updated = {
      ...inspeccion,
      estado: 'completada' as const,
      resultado,
      puntaje: stats.puntaje,
      fechaRealizacion: inspeccion.fechaRealizacion ?? new Date().toISOString().split('T')[0],
    }
    updateInspeccion(updated)
  }

  const catCompletedMap = CATEGORIAS.reduce<Record<string, number>>((acc, cat) => {
    const catItems = inspeccion.items.filter((i) => i.categoria === cat)
    const evaluated = catItems.filter((i) => i.estado !== 'pendiente').length
    acc[cat] = catItems.length > 0 ? Math.round((evaluated / catItems.length) * 100) : 0
    return acc
  }, {})

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="card p-5 bg-blue-900 text-white">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs text-blue-300 mb-1 font-medium uppercase tracking-wide">Acta de Inspección</div>
            <h2 className="text-xl font-bold">{est?.nombre ?? 'Establecimiento'}</h2>
            <p className="text-sm text-blue-200 mt-0.5">
              {est?.direccion} · Inspector: {inspeccion.inspector}
              {inspeccion.acta ? ` · Acta ${inspeccion.acta}` : ''}
            </p>
            <p className="text-xs text-blue-300 mt-1">
              Fecha: {new Date(inspeccion.fechaProgramada + 'T00:00:00').toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={onBack} className="btn-secondary text-xs">← Inspecciones</button>
            {!isReadOnly && (
              <button onClick={finalizarInspeccion} disabled={stats.pendiente > 0} className="btn-primary text-xs">
                <Save size={14} /> Finalizar inspección
              </button>
            )}
            <button onClick={() => window.print()} className="btn-secondary text-xs">
              <Printer size={14} /> Imprimir
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard label="Cumple" count={stats.cumple} color="green" />
        <StatCard label="No cumple" count={stats.noCumple} color="red" />
        <StatCard label="No aplica" count={stats.noAplica} color="gray" />
        <StatCard label="Pendiente" count={stats.pendiente} color="yellow" />
        <div className="card p-4 text-center bg-blue-50 border-blue-100">
          <div className={`text-2xl font-bold ${stats.puntaje >= 80 ? 'text-green-600' : stats.puntaje >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
            {stats.puntaje.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500 mt-0.5">Puntaje</div>
          {stats.criticos > 0 && (
            <div className="text-xs text-red-600 font-medium mt-1 flex items-center justify-center gap-1">
              <AlertTriangle size={10} /> {stats.criticos} crítico{stats.criticos !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="card p-4">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Progreso de evaluación</span>
          <span>{inspeccion.items.length - stats.pendiente}/{inspeccion.items.length} ítems evaluados</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex gap-0.5">
          <div className="bg-green-500 h-full rounded-l-full transition-all" style={{ width: `${(stats.cumple / inspeccion.items.length) * 100}%` }} />
          <div className="bg-red-500 h-full transition-all" style={{ width: `${(stats.noCumple / inspeccion.items.length) * 100}%` }} />
          <div className="bg-gray-300 h-full transition-all" style={{ width: `${(stats.noAplica / inspeccion.items.length) * 100}%` }} />
        </div>
        <div className="flex gap-4 mt-2 text-xs text-gray-400">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Cumple</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> No cumple</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-300 inline-block" /> N/A</span>
        </div>
      </div>

      {/* Resultado proyectado */}
      {stats.pendiente === 0 || isReadOnly ? (
        <ResultadoCard resultado={isReadOnly ? (inspeccion.resultado ?? computeResultado()) : computeResultado()} puntaje={stats.puntaje} criticos={stats.criticos} />
      ) : null}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-52">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input pl-9"
            placeholder="Buscar ítem o normativa…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={soloIncumplidos}
            onChange={(e) => setSoloIncumplidos(e.target.checked)}
            className="rounded border-gray-300 text-blue-600"
          />
          Solo incumplimientos
        </label>
        <div className="flex flex-wrap gap-1">
          {['Todas', ...CATEGORIAS].map((cat) => (
            <button
              key={cat}
              onClick={() => setCatFilter(cat)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                catFilter === cat
                  ? 'bg-blue-700 text-white border-blue-700'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
              }`}
            >
              {cat === 'Todas' ? 'Todas las categorías' : cat.split(' ')[0]}
              {cat !== 'Todas' && (
                <span className={`ml-1 font-medium ${catFilter === cat ? 'text-blue-200' : 'text-gray-400'}`}>
                  {catCompletedMap[cat]}%
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Checklist by category */}
      <div className="space-y-4">
        {Object.entries(itemsByCategory).map(([cat, items]) => {
          const isOpen = expanded[cat] !== false
          const cumpleCount = items.filter((i) => i.estado === 'cumple').length
          const noCumpleCount = items.filter((i) => i.estado === 'no_cumple').length
          const criticosCount = items.filter((i) => i.critico && i.estado === 'no_cumple').length

          return (
            <div key={cat} className="card overflow-hidden">
              <button
                onClick={() => toggleExpanded(cat)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="font-semibold text-gray-800 text-sm">{cat}</div>
                  <div className="flex items-center gap-1.5">
                    {cumpleCount > 0 && <span className="text-xs text-green-700 bg-green-100 rounded-full px-2 py-0.5">{cumpleCount} ✓</span>}
                    {noCumpleCount > 0 && <span className="text-xs text-red-700 bg-red-100 rounded-full px-2 py-0.5">{noCumpleCount} ✗</span>}
                    {criticosCount > 0 && (
                      <span className="text-xs text-red-800 bg-red-200 rounded-full px-2 py-0.5 font-semibold flex items-center gap-1">
                        <AlertTriangle size={10} /> {criticosCount} crítico{criticosCount !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xs text-gray-400">{items.length} ítems</div>
                  {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-gray-100 divide-y divide-gray-50">
                  {items.map((item) => (
                    <ChecklistRow
                      key={item.id}
                      item={item}
                      onEstado={(e) => updateItem(item.id, e)}
                      onObs={(o) => updateObservacion(item.id, o)}
                      readOnly={isReadOnly}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="card p-12 text-center text-gray-400 text-sm">Sin ítems para los filtros seleccionados</div>
      )}

      {/* Finalize button bottom */}
      {!isReadOnly && stats.pendiente === 0 && (
        <div className="flex justify-end">
          <button onClick={finalizarInspeccion} className="btn-primary">
            <Save size={16} /> Finalizar y emitir resultado
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({ label, count, color }: { label: string; count: number; color: 'green' | 'red' | 'gray' | 'yellow' }) {
  const colors = {
    green:  'text-green-700 bg-green-50 border-green-100',
    red:    'text-red-700 bg-red-50 border-red-100',
    gray:   'text-gray-500 bg-gray-50 border-gray-100',
    yellow: 'text-yellow-700 bg-yellow-50 border-yellow-100',
  }
  return (
    <div className={`card p-4 text-center ${colors[color]}`}>
      <div className="text-2xl font-bold">{count}</div>
      <div className="text-xs mt-0.5">{label}</div>
    </div>
  )
}

function ChecklistRow({
  item, onEstado, onObs, readOnly,
}: {
  item: ChecklistItem
  onEstado: (e: ItemEstado) => void
  onObs: (o: string) => void
  readOnly: boolean
}) {
  const [showObs, setShowObs] = useState(false)

  const stateConfig: Record<ItemEstado, { label: string; icon: React.ReactNode; classes: string }> = {
    cumple:    { label: 'Cumple',    icon: <CheckCircle2 size={16} />, classes: 'text-green-700 bg-green-100 border-green-300' },
    no_cumple: { label: 'No cumple', icon: <XCircle size={16} />,     classes: 'text-red-700 bg-red-100 border-red-300' },
    no_aplica: { label: 'N/A',       icon: <MinusCircle size={16} />, classes: 'text-gray-500 bg-gray-100 border-gray-300' },
    pendiente: { label: 'Pendiente', icon: null,                       classes: 'text-yellow-700 bg-yellow-50 border-yellow-200' },
  }

  const cfg = stateConfig[item.estado]

  return (
    <div
      className={`px-5 py-4 transition-colors ${
        item.estado === 'no_cumple'
          ? item.critico ? 'bg-red-50' : 'bg-red-50/50'
          : item.estado === 'cumple'
          ? 'bg-green-50/40'
          : ''
      }`}
    >
      <div className="flex items-start gap-4">
        {/* State selector */}
        <div className="flex gap-1 flex-shrink-0 mt-0.5">
          {(['cumple', 'no_cumple', 'no_aplica'] as ItemEstado[]).map((e) => {
            const c = stateConfig[e]
            const isActive = item.estado === e
            return (
              <button
                key={e}
                onClick={() => !readOnly && onEstado(e)}
                disabled={readOnly}
                title={c.label}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-medium transition-all
                  ${isActive ? c.classes : 'border-gray-200 text-gray-400 hover:border-gray-300 bg-white'}
                  ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
              >
                {c.icon}
                <span className="hidden sm:inline">{c.label}</span>
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <p className={`text-sm flex-1 ${item.estado === 'no_aplica' ? 'text-gray-400' : 'text-gray-800'}`}>
              {item.descripcion}
            </p>
            <div className="flex items-center gap-2 flex-shrink-0">
              {item.critico && (
                <Badge variant="red">
                  <AlertTriangle size={10} className="mr-1" /> Crítico
                </Badge>
              )}
              {item.estado !== 'pendiente' && (
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${cfg.classes}`}>
                  {cfg.label}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-xs text-blue-600 font-mono bg-blue-50 px-2 py-0.5 rounded">
              {item.id} · {item.normativa}
            </span>
            <button
              onClick={() => setShowObs(!showObs)}
              className="text-xs text-gray-400 hover:text-gray-600 underline"
            >
              {item.observacion ? 'Ver observación' : 'Añadir observación'}
            </button>
          </div>
          {(showObs || item.observacion) && (
            <textarea
              className="input text-xs mt-2 h-16 resize-none"
              placeholder="Observaciones, evidencias, plazo de subsanación…"
              value={item.observacion}
              onChange={(e) => !readOnly && onObs(e.target.value)}
              readOnly={readOnly}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function ResultadoCard({
  resultado, puntaje, criticos,
}: {
  resultado: InspeccionResultado
  puntaje: number
  criticos: number
}) {
  const config: Record<InspeccionResultado, { label: string; desc: string; classes: string }> = {
    aprobado:                   { label: '✓ APROBADO',                  desc: 'El establecimiento cumple con todos los requisitos normativos.', classes: 'bg-green-50 border-green-300 text-green-800' },
    aprobado_con_observaciones: { label: '⚠ APROBADO CON OBSERVACIONES', desc: 'Aprobado con mejoras a subsanar dentro del plazo otorgado.',    classes: 'bg-yellow-50 border-yellow-300 text-yellow-800' },
    desaprobado:                { label: '✗ DESAPROBADO',               desc: 'El establecimiento no cumple los requisitos mínimos exigidos.',   classes: 'bg-red-50 border-red-300 text-red-800' },
    clausura_preventiva:        { label: '⛔ CLAUSURA PREVENTIVA',       desc: `Se detectaron ${criticos} ítem(s) crítico(s) de incumplimiento.`, classes: 'bg-red-100 border-red-500 text-red-900' },
  }
  const cfg = config[resultado]
  return (
    <div className={`border-2 rounded-xl p-4 ${cfg.classes}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="font-bold text-lg">{cfg.label}</div>
          <div className="text-sm mt-0.5 opacity-80">{cfg.desc}</div>
        </div>
        <div className="text-3xl font-bold opacity-70">{puntaje.toFixed(0)}%</div>
      </div>
    </div>
  )
}
