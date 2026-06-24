import { useState, useMemo } from 'react'
import {
  Search,
  BookOpen,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  Pill,
  Building2,
  FlaskConical,
  Truck,
  Warehouse,
  Microscope,
  Heart,
  MapPin,
  FileText,
  ClipboardList,
  Info,
  Star,
  ShieldAlert,
} from 'lucide-react'
import { TIPOS_ESTABLECIMIENTOS, type TipoEstablecimiento, type NormativaRef } from '../data/normativasPorTipo'

// ─── Icon map for each establishment type ────────────────────────────────────
const TIPO_ICONS: Record<string, React.ElementType> = {
  farmacia:           Pill,
  botica:             Building2,
  fares:              MapPin,
  farmacia_hospital:  Heart,
  drogueria:          Truck,
  deposito:           Warehouse,
  laboratorio_analisis: Microscope,
  botiquin:           FlaskConical,
}

const TIPO_NORMA_LABEL: Record<NormativaRef['tipo'], string> = {
  ley:         'Ley',
  decreto:     'Decreto',
  resolucion:  'Resolución',
  disposicion: 'Disposición',
  norma_int:   'Norma Internacional',
  farmacopea:  'Farmacopea',
}

const TIPO_NORMA_COLOR: Record<NormativaRef['tipo'], string> = {
  ley:         'bg-blue-100 text-blue-800 border-blue-200',
  decreto:     'bg-purple-100 text-purple-800 border-purple-200',
  resolucion:  'bg-green-100 text-green-800 border-green-200',
  disposicion: 'bg-teal-100 text-teal-800 border-teal-200',
  norma_int:   'bg-orange-100 text-orange-800 border-orange-200',
  farmacopea:  'bg-yellow-100 text-yellow-800 border-yellow-200',
}


type Tab = 'resumen' | 'apertura' | 'inspeccion' | 'normativas'

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'resumen',    label: 'Resumen',    icon: Info },
  { id: 'apertura',  label: 'Apertura',   icon: FileText },
  { id: 'inspeccion',label: 'Inspección', icon: ClipboardList },
  { id: 'normativas',label: 'Normativas', icon: BookOpen },
]

export default function Normativas() {
  const [selectedId, setSelectedId] = useState<string>('farmacia')
  const [activeTab, setActiveTab] = useState<Tab>('resumen')
  const [search, setSearch] = useState('')
  const [expandedReq, setExpandedReq] = useState<Record<string, boolean>>({})
  const [expandedNorm, setExpandedNorm] = useState<string | null>(null)
  const [searchNorma, setSearchNorma] = useState('')

  const tipo = TIPOS_ESTABLECIMIENTOS.find((t) => t.id === selectedId)!

  const filteredTipos = useMemo(() => {
    if (!search.trim()) return TIPOS_ESTABLECIMIENTOS
    const q = search.toLowerCase()
    return TIPOS_ESTABLECIMIENTOS.filter(
      (t) =>
        t.label.toLowerCase().includes(q) ||
        t.descripcion.toLowerCase().includes(q) ||
        t.normativas.some((n) => n.codigo.toLowerCase().includes(q) || n.titulo.toLowerCase().includes(q))
    )
  }, [search])

  const filteredNormativas = useMemo(() => {
    if (!searchNorma.trim()) return tipo.normativas
    const q = searchNorma.toLowerCase()
    return tipo.normativas.filter(
      (n) =>
        n.codigo.toLowerCase().includes(q) ||
        n.titulo.toLowerCase().includes(q) ||
        n.resumen.toLowerCase().includes(q)
    )
  }, [tipo.normativas, searchNorma])

  function toggleReq(cat: string) {
    setExpandedReq((prev) => ({ ...prev, [cat]: !prev[cat] }))
  }

  function handleSelectTipo(id: string) {
    setSelectedId(id)
    setActiveTab('resumen')
    setExpandedReq({})
    setExpandedNorm(null)
    setSearchNorma('')
  }

  const TipoIcon = TIPO_ICONS[tipo.id] ?? Building2
  const criticas = tipo.normativas.filter((n) => n.critica && n.vigente)
  const totalItems = tipo.requisitosApertura.reduce((acc, c) => acc + c.items.length, 0)
  const criticalItems = tipo.requisitosApertura
    .flatMap((c) => c.items)
    .filter((i) => i.critico)

  return (
    <div className="flex gap-5 h-full">
      {/* ── Left sidebar: tipo selector ─────────────────────────────── */}
      <aside className="w-60 flex-shrink-0 space-y-3">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input pl-8 text-xs"
            placeholder="Buscar tipo o norma…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <nav className="space-y-1">
          {filteredTipos.map((t) => {
            const Icon = TIPO_ICONS[t.id] ?? Building2
            const isActive = t.id === selectedId
            return (
              <button
                key={t.id}
                onClick={() => handleSelectTipo(t.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group border
                  ${isActive
                    ? `${t.colorBg} ${t.colorBorder} shadow-sm`
                    : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                  }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                    ${isActive ? t.colorBg : 'bg-gray-100 group-hover:bg-gray-200'}`}
                >
                  <Icon size={15} className={isActive ? t.color : 'text-gray-500'} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-semibold truncate ${isActive ? t.color : 'text-gray-700'}`}>
                    {t.labelCorto}
                  </div>
                  <div className="text-xs text-gray-400 truncate mt-0.5">
                    {t.normativas.length} normas
                  </div>
                </div>
              </button>
            )
          })}
        </nav>

        {/* Quick stats */}
        <div className="card p-3 space-y-2 text-xs">
          <div className="font-semibold text-gray-600 mb-1">Base normativa</div>
          {[
            { label: 'Leyes nacionales', count: TIPOS_ESTABLECIMIENTOS.flatMap(t => t.normativas).filter(n => n.tipo === 'ley' && n.vigente).reduce((acc, n) => { if (!acc.includes(n.codigo)) acc.push(n.codigo); return acc }, [] as string[]).length },
            { label: 'Decretos', count: TIPOS_ESTABLECIMIENTOS.flatMap(t => t.normativas).filter(n => n.tipo === 'decreto' && n.vigente).reduce((acc, n) => { if (!acc.includes(n.codigo)) acc.push(n.codigo); return acc }, [] as string[]).length },
            { label: 'Resoluciones ANMAT', count: TIPOS_ESTABLECIMIENTOS.flatMap(t => t.normativas).filter(n => n.tipo === 'resolucion' && n.vigente).reduce((acc, n) => { if (!acc.includes(n.codigo)) acc.push(n.codigo); return acc }, [] as string[]).length },
            { label: 'Tipos de establecimientos', count: TIPOS_ESTABLECIMIENTOS.length },
          ].map(({ label, count }) => (
            <div key={label} className="flex justify-between text-gray-500">
              <span>{label}</span>
              <span className="font-bold text-gray-700">{count}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 space-y-4">

        {/* Header card */}
        <div className={`card p-5 border-2 ${tipo.colorBorder} ${tipo.colorBg}`}>
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 bg-white shadow-sm`}>
              <TipoIcon size={26} className={tipo.color} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Marco Normativo · Habilitación e Inspección
              </div>
              <h1 className={`text-xl font-bold leading-tight ${tipo.color}`}>{tipo.label}</h1>
              <p className="text-sm text-gray-700 mt-2 leading-relaxed">{tipo.descripcion}</p>
            </div>
            {tipo.superficieMinima && (
              <div className={`flex-shrink-0 text-center px-4 py-3 rounded-xl bg-white border ${tipo.colorBorder}`}>
                <div className={`text-xs font-semibold ${tipo.color}`}>Superficie mín.</div>
                <div className="text-sm font-bold text-gray-800 mt-1 leading-tight">
                  {tipo.superficieMinima.split('(')[0].trim()}
                </div>
              </div>
            )}
          </div>

          {/* Alert */}
          {tipo.advertencia && (
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2.5">
              <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-relaxed">{tipo.advertencia}</p>
            </div>
          )}

          {/* Quick metric pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            <MetaPill icon={<BookOpen size={12} />} label={`${tipo.normativas.length} normativas aplicables`} />
            <MetaPill icon={<CheckCircle2 size={12} />} label={`${criticas.length} normas críticas`} color="red" />
            <MetaPill icon={<FileText size={12} />} label={`${totalItems} requisitos de apertura`} />
            <MetaPill icon={<ShieldAlert size={12} />} label={`${criticalItems.length} requisitos críticos`} color="orange" />
          </div>
        </div>

        {/* Tab navigation */}
        <div className="card overflow-hidden">
          <div className="flex border-b border-gray-100">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-colors border-b-2 -mb-px
                  ${activeTab === id
                    ? `${tipo.color} border-current`
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          <div className="p-5">
            {/* ── RESUMEN ─────────────────────────────────────────────── */}
            {activeTab === 'resumen' && (
              <div className="space-y-5">
                {/* Alcance */}
                <div>
                  <SectionTitle>Alcance y actividades habilitadas</SectionTitle>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                    {tipo.alcance.map((a, i) => (
                      <div key={i} className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <CheckCircle2 size={14} className="text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{a}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Normas críticas */}
                <div>
                  <SectionTitle>
                    <Star size={15} className="text-amber-500" /> Normativas de Cumplimiento Crítico
                  </SectionTitle>
                  <p className="text-xs text-gray-500 mb-3">
                    Estas normas son de cumplimiento ineludible. Su incumplimiento puede derivar en clausura o suspensión.
                  </p>
                  <div className="space-y-2">
                    {criticas.map((n) => (
                      <div key={n.codigo} className="flex items-center gap-3 p-3 border-2 border-red-100 bg-red-50 rounded-xl">
                        <ShieldAlert size={16} className="text-red-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-red-800 font-mono">{n.codigo}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${TIPO_NORMA_COLOR[n.tipo]}`}>
                              {TIPO_NORMA_LABEL[n.tipo]}
                            </span>
                          </div>
                          <div className="text-xs text-gray-700 mt-0.5">{n.titulo}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Requisitos críticos de apertura */}
                {criticalItems.length > 0 && (
                  <div>
                    <SectionTitle>
                      <AlertTriangle size={15} className="text-orange-500" /> Requisitos Críticos de Apertura
                    </SectionTitle>
                    <p className="text-xs text-gray-500 mb-3">
                      Sin estos requisitos, la apertura no puede ser aprobada.
                    </p>
                    <div className="space-y-2">
                      {criticalItems.map((item, i) => (
                        <div key={i} className="flex items-start gap-2 p-3 border border-orange-200 bg-orange-50 rounded-xl">
                          <AlertTriangle size={13} className="text-orange-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-sm text-gray-800">{item.texto}</div>
                            {item.normativa && (
                              <div className="text-xs text-blue-600 font-mono mt-0.5">{item.normativa}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── APERTURA ────────────────────────────────────────────── */}
            {activeTab === 'apertura' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm text-gray-600">
                    {totalItems} requisitos en {tipo.requisitosApertura.length} categorías para la habilitación.
                  </p>
                  <button
                    className="text-xs text-blue-600 hover:underline"
                    onClick={() => {
                      const allKeys = tipo.requisitosApertura.reduce<Record<string,boolean>>((acc,c) => ({...acc,[c.categoria]: true}), {})
                      setExpandedReq(allKeys)
                    }}
                  >
                    Expandir todo
                  </button>
                </div>

                {tipo.requisitosApertura.map((cat) => {
                  const isOpen = expandedReq[cat.categoria] !== false
                  const criticos = cat.items.filter((i) => i.critico)
                  return (
                    <div key={cat.categoria} className="border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleReq(cat.categoria)}
                        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tipo.colorBg}`}>
                            <span className="text-base leading-none">{cat.icono}</span>
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-gray-800">{cat.categoria}</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-gray-400">{cat.items.length} ítems</span>
                              {criticos.length > 0 && (
                                <span className="text-xs text-red-600 font-medium flex items-center gap-0.5">
                                  <AlertTriangle size={10} /> {criticos.length} críticos
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                      </button>

                      {isOpen && (
                        <div className="border-t border-gray-100 divide-y divide-gray-50">
                          {cat.items.map((item, idx) => (
                            <div
                              key={idx}
                              className={`flex items-start gap-3 px-4 py-3 ${item.critico ? 'bg-red-50/50' : ''}`}
                            >
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                                  ${item.critico ? 'bg-red-100' : 'bg-gray-100'}`}
                              >
                                {item.critico
                                  ? <AlertTriangle size={11} className="text-red-600" />
                                  : <CheckCircle2 size={11} className="text-gray-400" />
                                }
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-800 leading-relaxed">{item.texto}</p>
                                {item.normativa && (
                                  <span className="inline-block mt-1 text-xs text-blue-600 font-mono bg-blue-50 px-2 py-0.5 rounded">
                                    {item.normativa}
                                  </span>
                                )}
                              </div>
                              {item.critico && (
                                <span className="text-xs font-semibold text-red-700 bg-red-100 px-2 py-0.5 rounded-full flex-shrink-0">
                                  CRÍTICO
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* ── INSPECCIÓN ──────────────────────────────────────────── */}
            {activeTab === 'inspeccion' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Focos de atención durante la inspección de un establecimiento de este tipo.
                </p>

                {tipo.enfoquesInspeccion.map((enfoque, idx) => (
                  <div key={idx} className="card p-4 border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tipo.colorBg}`}>
                        <ClipboardList size={15} className={tipo.color} />
                      </div>
                      <h3 className="text-sm font-bold text-gray-800">{enfoque.area}</h3>
                    </div>

                    <div className="space-y-2">
                      {enfoque.puntos.map((punto, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 mt-2" />
                          <p className="text-sm text-gray-700 leading-relaxed">{punto}</p>
                        </div>
                      ))}
                    </div>

                    {enfoque.alertas && enfoque.alertas.length > 0 && (
                      <div className="mt-3 space-y-1.5">
                        {enfoque.alertas.map((alerta, i) => (
                          <div key={i} className="flex items-start gap-2 p-2.5 bg-red-50 border border-red-200 rounded-lg">
                            <AlertTriangle size={13} className="text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-red-800">{alerta}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {tipo.enfoquesInspeccion.length === 0 && (
                  <div className="text-center py-10 text-gray-400 text-sm">
                    No hay focos de inspección específicos cargados para este tipo.
                  </div>
                )}
              </div>
            )}

            {/* ── NORMATIVAS ──────────────────────────────────────────── */}
            {activeTab === 'normativas' && (
              <div className="space-y-4">
                {/* Filter */}
                <div className="flex gap-3 items-center">
                  <div className="relative flex-1">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      className="input pl-8 text-sm"
                      placeholder="Buscar por código, título o texto…"
                      value={searchNorma}
                      onChange={(e) => setSearchNorma(e.target.value)}
                    />
                  </div>
                  <span className="text-xs text-gray-400">{filteredNormativas.length} normas</span>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-2">
                  {Object.entries(TIPO_NORMA_LABEL).map(([key, label]) => (
                    <span key={key} className={`text-xs px-2 py-1 rounded-full border font-medium ${TIPO_NORMA_COLOR[key as NormativaRef['tipo']]}`}>
                      {label}
                    </span>
                  ))}
                </div>

                {/* Normativa cards */}
                <div className="space-y-2">
                  {filteredNormativas.map((n) => {
                    const isExp = expandedNorm === n.codigo
                    return (
                      <div
                        key={n.codigo}
                        className={`border rounded-xl overflow-hidden transition-all
                          ${n.critica ? 'border-red-200' : 'border-gray-200'}
                          ${!n.vigente ? 'opacity-50' : ''}`}
                      >
                        <button
                          onClick={() => setExpandedNorm(isExp ? null : n.codigo)}
                          className="w-full flex items-start gap-4 px-4 py-3.5 hover:bg-gray-50 text-left transition-colors"
                        >
                          <div className={`w-1 self-stretch rounded-full flex-shrink-0 ${n.critica ? 'bg-red-500' : 'bg-blue-300'}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="text-sm font-bold text-gray-900 font-mono">{n.codigo}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${TIPO_NORMA_COLOR[n.tipo]}`}>
                                {TIPO_NORMA_LABEL[n.tipo]}
                              </span>
                              {n.critica && (
                                <span className="text-xs px-2 py-0.5 rounded-full border font-medium bg-red-100 text-red-800 border-red-200 flex items-center gap-1">
                                  <ShieldAlert size={10} /> Crítica
                                </span>
                              )}
                              {!n.vigente && (
                                <span className="text-xs px-2 py-0.5 rounded-full border font-medium bg-gray-100 text-gray-500 border-gray-200">
                                  Derogada
                                </span>
                              )}
                            </div>
                            <div className="text-sm font-semibold text-gray-800 leading-snug">{n.titulo}</div>
                            <div className="text-xs text-gray-400 mt-0.5">{n.organismo}</div>
                          </div>
                          <div className="flex-shrink-0">
                            {isExp ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
                          </div>
                        </button>

                        {isExp && (
                          <div className={`border-t px-4 pb-4 pt-3 ${n.critica ? 'bg-red-50/30 border-red-100' : 'bg-gray-50/50 border-gray-100'}`}>
                            {n.articulos && (
                              <p className="text-xs text-blue-600 font-medium mb-2">Artículos relevantes: {n.articulos}</p>
                            )}
                            <p className="text-sm text-gray-700 leading-relaxed">{n.resumen}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {filteredNormativas.length === 0 && (
                  <div className="text-center py-10 text-gray-400 text-sm">
                    No hay normativas que coincidan con la búsqueda
                  </div>
                )}

                {/* Disclaimer */}
                <div className="card p-4 bg-amber-50 border-amber-200">
                  <div className="flex gap-2 text-sm">
                    <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-amber-800 text-xs">Nota sobre vigencia normativa</p>
                      <p className="text-xs text-amber-700 mt-1">
                        Esta referencia es orientativa y se actualiza periódicamente. Siempre verificá la versión vigente en el{' '}
                        <strong>Boletín Oficial de la República Argentina</strong> (boletinoficial.gob.ar) o en el portal de{' '}
                        <strong>ANMAT</strong> (anmat.gov.ar). La legislación farmacéutica puede ser actualizada en cualquier momento por nuevas resoluciones.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Comparativa rápida entre tipos */}
        <CompativaRapida tipo={tipo} />
      </div>
    </div>
  )
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-2">
      {children}
    </h3>
  )
}

function MetaPill({ icon, label, color = 'default' }: { icon: React.ReactNode; label: string; color?: 'red' | 'orange' | 'default' }) {
  const colors = {
    red: 'bg-red-50 text-red-700 border-red-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    default: 'bg-gray-50 text-gray-600 border-gray-200',
  }
  return (
    <div className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border font-medium ${colors[color]}`}>
      {icon}
      {label}
    </div>
  )
}

function CompativaRapida({ tipo }: { tipo: TipoEstablecimiento }) {
  const comparativa = [
    { label: 'Director Técnico Farmacéutico obligatorio', tipos: ['farmacia', 'botica', 'farmacia_hospital', 'drogueria', 'deposito'] },
    { label: 'Elaboración de preparados magistrales', tipos: ['farmacia', 'farmacia_hospital'] },
    { label: 'Control de estupefacientes (libro rubricado)', tipos: ['farmacia', 'botica', 'farmacia_hospital', 'drogueria'] },
    { label: 'Cadena de frío obligatoria', tipos: ['farmacia', 'botica', 'farmacia_hospital', 'drogueria', 'deposito', 'laboratorio_analisis'] },
    { label: 'Trazabilidad ANMAT', tipos: ['farmacia', 'drogueria', 'deposito'] },
    { label: 'Venta al público', tipos: ['farmacia', 'botica', 'fares'] },
    { label: 'Certificado BPD', tipos: ['drogueria', 'deposito'] },
    { label: 'Farmacovigilancia activa', tipos: ['farmacia', 'farmacia_hospital', 'drogueria'] },
  ]

  const cumple = comparativa.filter((c) => c.tipos.includes(tipo.id))
  const noCumple = comparativa.filter((c) => !c.tipos.includes(tipo.id))

  return (
    <div className="card p-5">
      <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
        <ClipboardList size={15} className="text-blue-600" />
        Atributos de este tipo de establecimiento
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {cumple.map((c, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <CheckCircle2 size={13} className="text-green-500 flex-shrink-0" />
            <span className="text-gray-700">{c.label}</span>
          </div>
        ))}
        {noCumple.map((c, i) => (
          <div key={i} className="flex items-center gap-2 text-xs opacity-40">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 flex-shrink-0" />
            <span className="text-gray-500 line-through">{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
