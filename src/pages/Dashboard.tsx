import {
  Building2,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  TrendingUp,
  XCircle,
  ArrowRight,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import Badge from '../components/Badge'
import type { TabId } from '../types'

interface Props {
  onNav: (tab: TabId) => void
}

export default function Dashboard({ onNav }: Props) {
  const { state } = useApp()
  const { establecimientos, inspecciones } = state

  const totalEst = establecimientos.length
  const habilitados = establecimientos.filter((e) => e.estado === 'habilitado').length
  const pendientes = establecimientos.filter((e) => ['solicitud', 'en_proceso'].includes(e.estado)).length
  const suspendidos = establecimientos.filter((e) => ['suspendido', 'clausurado'].includes(e.estado)).length

  const totalInsp = inspecciones.length
  const inspecAprobadas = inspecciones.filter((i) => i.resultado === 'aprobado').length
  const inspecObservadas = inspecciones.filter((i) => i.resultado === 'aprobado_con_observaciones').length
  const inspecDesaprobadas = inspecciones.filter((i) => i.resultado === 'desaprobado').length
  const inspecProgramadas = inspecciones.filter((i) => i.estado === 'programada').length

  const recentInsp = [...inspecciones]
    .sort((a, b) => b.fechaProgramada.localeCompare(a.fechaProgramada))
    .slice(0, 5)

  const promPuntaje =
    inspecciones.filter((i) => i.puntaje !== undefined).reduce((acc, i) => acc + (i.puntaje ?? 0), 0) /
    (inspecciones.filter((i) => i.puntaje !== undefined).length || 1)

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Establecimientos"
          value={totalEst}
          sub={`${habilitados} habilitados`}
          icon={Building2}
          color="blue"
          onClick={() => onNav('establecimientos')}
        />
        <KpiCard
          label="Inspecciones"
          value={totalInsp}
          sub={`${inspecProgramadas} programadas`}
          icon={Search}
          color="purple"
          onClick={() => onNav('inspecciones')}
        />
        <KpiCard
          label="Aprobadas"
          value={inspecAprobadas}
          sub={`${totalInsp > 0 ? Math.round((inspecAprobadas / totalInsp) * 100) : 0}% del total`}
          icon={CheckCircle2}
          color="green"
          onClick={() => onNav('inspecciones')}
        />
        <KpiCard
          label="Con observaciones"
          value={inspecObservadas + inspecDesaprobadas}
          sub={`${inspecDesaprobadas} desaprobadas`}
          icon={AlertCircle}
          color="yellow"
          onClick={() => onNav('inspecciones')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Estado de establecimientos */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Building2 size={16} className="text-blue-600" /> Estado de Establecimientos
          </h2>
          {totalEst === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              <Building2 size={32} className="mx-auto mb-2 opacity-30" />
              No hay establecimientos registrados
              <div className="mt-3">
                <button onClick={() => onNav('establecimientos')} className="btn-primary text-xs">
                  Registrar establecimiento
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <EstadoBar label="Habilitados" count={habilitados} total={totalEst} color="bg-green-500" />
              <EstadoBar label="En proceso" count={pendientes} total={totalEst} color="bg-yellow-400" />
              <EstadoBar label="Suspendidos/Clausurados" count={suspendidos} total={totalEst} color="bg-red-500" />
            </div>
          )}
        </div>

        {/* Resultados de inspecciones */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-purple-600" /> Resultados de Inspecciones
          </h2>
          {totalInsp === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              <Search size={32} className="mx-auto mb-2 opacity-30" />
              No hay inspecciones registradas
              <div className="mt-3">
                <button onClick={() => onNav('inspecciones')} className="btn-primary text-xs">
                  Nueva inspección
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <ResultadoRow label="Aprobadas" count={inspecAprobadas} color="text-green-600" icon={<CheckCircle2 size={14} />} />
                <ResultadoRow label="Con observaciones" count={inspecObservadas} color="text-yellow-600" icon={<AlertCircle size={14} />} />
                <ResultadoRow label="Desaprobadas" count={inspecDesaprobadas} color="text-red-600" icon={<XCircle size={14} />} />
                <ResultadoRow label="Programadas" count={inspecProgramadas} color="text-blue-600" icon={<Clock size={14} />} />
              </div>
              {totalInsp > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Puntaje promedio</span>
                    <span className="font-semibold text-gray-900">{promPuntaje.toFixed(1)}%</span>
                  </div>
                  <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        promPuntaje >= 80 ? 'bg-green-500' : promPuntaje >= 60 ? 'bg-yellow-400' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(promPuntaje, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Acciones rápidas */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Acciones Rápidas</h2>
          <div className="space-y-2">
            {[
              { label: 'Registrar establecimiento', tab: 'establecimientos' as TabId, icon: Building2, color: 'blue' },
              { label: 'Iniciar proceso de apertura', tab: 'apertura' as TabId, icon: CheckCircle2, color: 'teal' },
              { label: 'Nueva inspección', tab: 'inspecciones' as TabId, icon: Search, color: 'purple' },
              { label: 'Consultar normativas', tab: 'normativas' as TabId, icon: AlertCircle, color: 'amber' },
              { label: 'Ver reportes', tab: 'reportes' as TabId, icon: TrendingUp, color: 'green' },
            ].map(({ label, tab, icon: Icon }) => (
              <button
                key={tab}
                onClick={() => onNav(tab)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all group text-sm"
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} className="text-blue-600" />
                  <span className="text-gray-700 group-hover:text-blue-800 font-medium">{label}</span>
                </div>
                <ArrowRight size={14} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Inspecciones recientes */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">Inspecciones Recientes</h2>
          <button onClick={() => onNav('inspecciones')} className="text-xs text-blue-600 hover:underline">
            Ver todas →
          </button>
        </div>
        {recentInsp.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">Sin inspecciones aún</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                {['Establecimiento', 'Tipo', 'Fecha', 'Inspector', 'Estado', 'Resultado'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentInsp.map((i) => {
                const est = establecimientos.find((e) => e.id === i.establecimientoId)
                return (
                  <tr key={i.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {est?.nombre ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {TIPO_INSP[i.tipo] ?? i.tipo}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(i.fechaProgramada + 'T00:00:00').toLocaleDateString('es-AR')}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{i.inspector}</td>
                    <td className="px-4 py-3">
                      <EstadoBadge estado={i.estado} />
                    </td>
                    <td className="px-4 py-3">
                      {i.resultado ? <ResultadoBadge resultado={i.resultado} /> : <span className="text-gray-300">—</span>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function KpiCard({
  label, value, sub, icon: Icon, color, onClick,
}: {
  label: string
  value: number
  sub: string
  icon: React.ElementType
  color: 'blue' | 'purple' | 'green' | 'yellow'
  onClick: () => void
}) {
  const colors = {
    blue:   { bg: 'bg-blue-50',   text: 'text-blue-700',   icon: 'text-blue-500' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700', icon: 'text-purple-500' },
    green:  { bg: 'bg-green-50',  text: 'text-green-700',  icon: 'text-green-500' },
    yellow: { bg: 'bg-yellow-50', text: 'text-yellow-700', icon: 'text-yellow-500' },
  }
  const c = colors[color]

  return (
    <button
      onClick={onClick}
      className={`card p-5 text-left hover:shadow-md transition-shadow ${c.bg} border-0`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className={`text-3xl font-bold ${c.text}`}>{value}</div>
          <div className="text-sm font-medium text-gray-700 mt-0.5">{label}</div>
          <div className="text-xs text-gray-500 mt-1">{sub}</div>
        </div>
        <Icon size={22} className={c.icon} />
      </div>
    </button>
  )
}

function EstadoBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? (count / total) * 100 : 0
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold text-gray-900">{count}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function ResultadoRow({
  label, count, color, icon,
}: {
  label: string; count: number; color: string; icon: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between">
      <div className={`flex items-center gap-2 ${color}`}>
        {icon}
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <span className="text-sm font-semibold text-gray-900">{count}</span>
    </div>
  )
}

const TIPO_INSP: Record<string, string> = {
  apertura: 'Apertura',
  rutina: 'Rutina',
  denuncia: 'Denuncia',
  seguimiento: 'Seguimiento',
  sorpresiva: 'Sorpresiva',
  reinspeccion: 'Reinspección',
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
