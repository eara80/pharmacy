import { useMemo } from 'react'
import {
  BarChart3, TrendingUp, AlertTriangle,
  CheckCircle2, XCircle, Building2, Download,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import Badge from '../components/Badge'
import { CATEGORIAS } from '../data/checklistData'

export default function Reportes() {
  const { state } = useApp()
  const { establecimientos, inspecciones } = state

  const completadas = inspecciones.filter((i) => i.estado === 'completada')
  const aprobadas = completadas.filter((i) => i.resultado === 'aprobado')
  const conObs = completadas.filter((i) => i.resultado === 'aprobado_con_observaciones')
  const desaprobadas = completadas.filter((i) => i.resultado === 'desaprobado')
  const clausura = completadas.filter((i) => i.resultado === 'clausura_preventiva')

  const puntajePromedio = useMemo(() => {
    const withScore = completadas.filter((i) => i.puntaje !== undefined)
    if (withScore.length === 0) return 0
    return withScore.reduce((acc, i) => acc + (i.puntaje ?? 0), 0) / withScore.length
  }, [completadas])

  const cumplimientoPorCategoria = useMemo(() => {
    return CATEGORIAS.map((cat) => {
      const items = completadas.flatMap((i) => i.items.filter((item) => item.categoria === cat))
      const evaluables = items.filter((item) => item.estado !== 'no_aplica' && item.estado !== 'pendiente')
      const cumple = evaluables.filter((item) => item.estado === 'cumple')
      const pct = evaluables.length > 0 ? (cumple.length / evaluables.length) * 100 : null
      return { cat, pct, cumple: cumple.length, total: evaluables.length }
    }).filter((r) => r.total > 0)
  }, [completadas])

  const criticosMasIncumplidos = useMemo(() => {
    const map: Record<string, { desc: string; count: number; normativa: string }> = {}
    completadas.forEach((insp) => {
      insp.items
        .filter((item) => item.critico && item.estado === 'no_cumple')
        .forEach((item) => {
          if (!map[item.id]) {
            map[item.id] = { desc: item.descripcion, count: 0, normativa: item.normativa }
          }
          map[item.id].count++
        })
    })
    return Object.values(map)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }, [completadas])

  const incumplidosNoGriticos = useMemo(() => {
    const map: Record<string, { desc: string; count: number; normativa: string }> = {}
    completadas.forEach((insp) => {
      insp.items
        .filter((item) => !item.critico && item.estado === 'no_cumple')
        .forEach((item) => {
          if (!map[item.id]) {
            map[item.id] = { desc: item.descripcion, count: 0, normativa: item.normativa }
          }
          map[item.id].count++
        })
    })
    return Object.values(map)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }, [completadas])

  const porTipo = useMemo(() => {
    const types = ['apertura', 'rutina', 'denuncia', 'seguimiento', 'sorpresiva', 'reinspeccion']
    return types.map((t) => ({
      tipo: t,
      label: { apertura: 'Apertura', rutina: 'Rutina', denuncia: 'Denuncia', seguimiento: 'Seguimiento', sorpresiva: 'Sorpresiva', reinspeccion: 'Reinspección' }[t] ?? t,
      count: completadas.filter((i) => i.tipo === t).length,
    })).filter((t) => t.count > 0)
  }, [completadas])

  const establecimientosConProblemas = useMemo(() => {
    return establecimientos
      .map((est) => {
        const insps = completadas.filter((i) => i.establecimientoId === est.id)
        const last = insps[insps.length - 1]
        const criticos = last?.items.filter((i) => i.critico && i.estado === 'no_cumple').length ?? 0
        return { est, last, criticos }
      })
      .filter((e) => e.criticos > 0)
      .sort((a, b) => b.criticos - a.criticos)
  }, [establecimientos, completadas])

  if (completadas.length === 0) {
    return (
      <div className="card p-16 text-center">
        <BarChart3 size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 font-medium text-lg">Sin datos suficientes</p>
        <p className="text-xs text-gray-400 mt-1">Completá al menos una inspección para ver los reportes</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Export button */}
      <div className="flex justify-end">
        <button className="btn-secondary" onClick={() => window.print()}>
          <Download size={16} /> Exportar reporte
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiBlock label="Inspecciones completadas" value={completadas.length} sub="total evaluadas" color="blue" icon={BarChart3} />
        <KpiBlock label="Puntaje promedio" value={`${puntajePromedio.toFixed(1)}%`} sub="de cumplimiento" color={puntajePromedio >= 80 ? 'green' : puntajePromedio >= 60 ? 'yellow' : 'red'} icon={TrendingUp} />
        <KpiBlock label="Establecimientos" value={establecimientos.length} sub="registrados" color="purple" icon={Building2} />
        <KpiBlock label="Ítems críticos fallidos" value={criticosMasIncumplidos.reduce((acc, i) => acc + i.count, 0)} sub="acumulados" color="red" icon={AlertTriangle} />
      </div>

      {/* Resultados y tipos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Resultados */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-green-600" /> Distribución de Resultados
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Aprobados', count: aprobadas.length, color: 'bg-green-500' },
              { label: 'Con observaciones', count: conObs.length, color: 'bg-yellow-400' },
              { label: 'Desaprobados', count: desaprobadas.length, color: 'bg-red-500' },
              { label: 'Clausura preventiva', count: clausura.length, color: 'bg-red-900' },
            ].map(({ label, count, color }) => {
              const pct = completadas.length > 0 ? (count / completadas.length) * 100 : 0
              return (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">{label}</span>
                    <span className="font-semibold text-gray-800">{count} ({pct.toFixed(0)}%)</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Por tipo de inspección */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <BarChart3 size={16} className="text-blue-600" /> Por Tipo de Inspección
          </h3>
          {porTipo.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Sin datos</p>
          ) : (
            <div className="space-y-3">
              {porTipo.map(({ label, count }) => {
                const pct = (count / completadas.length) * 100
                return (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">{label}</span>
                      <span className="font-semibold text-gray-800">{count}</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-blue-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Cumplimiento por categoría */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <TrendingUp size={16} className="text-purple-600" /> Cumplimiento por Categoría
        </h3>
        <div className="space-y-3">
          {cumplimientoPorCategoria.map(({ cat, pct, cumple, total }) => (
            <div key={cat}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-700 font-medium">{cat}</span>
                <span className="text-gray-500">
                  {cumple}/{total} ítems ·{' '}
                  <span
                    className={`font-semibold ${
                      pct === null ? 'text-gray-400' : pct >= 80 ? 'text-green-600' : pct >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}
                  >
                    {pct !== null ? `${pct.toFixed(0)}%` : 'N/D'}
                  </span>
                </span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    pct === null ? 'bg-gray-300' : pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-yellow-400' : 'bg-red-500'
                  }`}
                  style={{ width: pct !== null ? `${pct}%` : '0%' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ítems críticos más incumplidos */}
      {criticosMasIncumplidos.length > 0 && (
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-500" />
            <h3 className="text-sm font-semibold text-gray-700">
              Ítems Críticos con Mayor Incumplimiento
            </h3>
            <Badge variant="red">{criticosMasIncumplidos.length}</Badge>
          </div>
          <div className="divide-y divide-gray-50">
            {criticosMasIncumplidos.map(({ desc, count, normativa }, idx) => (
              <div key={idx} className="px-5 py-3 flex items-center gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    idx === 0 ? 'bg-red-200 text-red-800' : idx <= 2 ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 leading-snug">{desc}</p>
                  <p className="text-xs text-blue-600 font-mono mt-0.5">{normativa}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="text-sm font-bold text-red-700">{count}×</div>
                  <XCircle size={16} className="text-red-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Incumplimientos no críticos */}
      {incumplidosNoGriticos.length > 0 && (
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700">
              Incumplimientos No Críticos Más Frecuentes (Top 5)
            </h3>
          </div>
          <div className="divide-y divide-gray-50">
            {incumplidosNoGriticos.map(({ desc, count, normativa }, idx) => (
              <div key={idx} className="px-5 py-3 flex items-center gap-4">
                <span className="text-xs font-semibold text-gray-400 w-5">{idx + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">{desc}</p>
                  <p className="text-xs text-blue-600 font-mono mt-0.5">{normativa}</p>
                </div>
                <span className="text-sm font-semibold text-yellow-700 flex-shrink-0">{count}×</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Establecimientos con problemas */}
      {establecimientosConProblemas.length > 0 && (
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <Building2 size={16} className="text-orange-500" />
            <h3 className="text-sm font-semibold text-gray-700">
              Establecimientos con Ítems Críticos Pendientes
            </h3>
          </div>
          <div className="divide-y divide-gray-50">
            {establecimientosConProblemas.map(({ est, last, criticos }) => (
              <div key={est.id} className="px-5 py-3 flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{est.nombre}</p>
                  <p className="text-xs text-gray-400">{est.localidad} · Última inspección: {last ? new Date(last.fechaProgramada + 'T00:00:00').toLocaleDateString('es-AR') : '—'}</p>
                </div>
                <Badge variant="red">
                  <AlertTriangle size={10} className="mr-1" /> {criticos} crítico{criticos !== 1 ? 's' : ''}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function KpiBlock({
  label, value, sub, color, icon: Icon,
}: {
  label: string
  value: string | number
  sub: string
  color: 'blue' | 'green' | 'red' | 'yellow' | 'purple'
  icon: React.ElementType
}) {
  const colors = {
    blue:   'bg-blue-50 text-blue-700',
    green:  'bg-green-50 text-green-700',
    red:    'bg-red-50 text-red-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    purple: 'bg-purple-50 text-purple-700',
  }
  return (
    <div className={`card p-5 ${colors[color]}`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-sm font-medium mt-0.5 text-gray-700">{label}</div>
          <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
        </div>
        <Icon size={22} className="opacity-60" />
      </div>
    </div>
  )
}
