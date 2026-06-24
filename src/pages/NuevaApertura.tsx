import { useState } from 'react'
import {
  FileText, CheckCircle2, XCircle, ChevronRight, ChevronDown,
  AlertTriangle, Download, Building2, ClipboardList, Search,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import Badge from '../components/Badge'
import type { Apertura, DocumentacionItem } from '../types'

const ETAPAS = [
  { num: 1, label: 'Selección',      icon: Building2,     desc: 'Seleccioná el establecimiento' },
  { num: 2, label: 'Documentación',  icon: FileText,       desc: 'Verificación documental' },
  { num: 3, label: 'Visita previa',  icon: Search,         desc: 'Inspección previa (opcional)' },
  { num: 4, label: 'Resolución',     icon: CheckCircle2,   desc: 'Habilitación o rechazo' },
]

export default function NuevaApertura() {
  const { state, addApertura, updateApertura } = useApp()
  const [selectedApertura, setSelectedApertura] = useState<Apertura | null>(null)
  const [estSearch, setEstSearch] = useState('')
  const [showNew, setShowNew] = useState(false)

  const establecimientos = state.establecimientos
  const aperturas = state.aperturas

  const estConApertura = new Set(aperturas.map((a) => a.establecimientoId))
  const estSinApertura = establecimientos.filter(
    (e) => !estConApertura.has(e.id) && !['habilitado', 'clausurado'].includes(e.estado)
  )

  const filteredEst = estSinApertura.filter((e) =>
    !estSearch || e.nombre.toLowerCase().includes(estSearch.toLowerCase())
  )

  function startApertura(estId: string) {
    const a = addApertura(estId)
    setSelectedApertura(a)
    setShowNew(false)
  }

  function toggleDoc(docId: string) {
    if (!selectedApertura) return
    const updated: Apertura = {
      ...selectedApertura,
      documentacion: selectedApertura.documentacion.map((d) =>
        d.id === docId ? { ...d, presentado: !d.presentado } : d
      ),
    }
    updateApertura(updated)
    setSelectedApertura(updated)
  }

  function setDocObs(docId: string, obs: string) {
    if (!selectedApertura) return
    const updated: Apertura = {
      ...selectedApertura,
      documentacion: selectedApertura.documentacion.map((d) =>
        d.id === docId ? { ...d, observacion: obs } : d
      ),
    }
    updateApertura(updated)
    setSelectedApertura(updated)
  }

  function setEtapa(etapa: number) {
    if (!selectedApertura) return
    const updated = { ...selectedApertura, etapa }
    updateApertura(updated)
    setSelectedApertura(updated)
  }

  const docsRequeridos = selectedApertura?.documentacion.filter((d) => d.requerido) ?? []
  const docsPresentados = docsRequeridos.filter((d) => d.presentado)
  const pctDocs = docsRequeridos.length > 0 ? (docsPresentados.length / docsRequeridos.length) * 100 : 0
  const todosCompletos = docsPresentados.length === docsRequeridos.length

  const aperturasActivas = aperturas.filter((a) => {
    const est = establecimientos.find((e) => e.id === a.establecimientoId)
    return est && est.estado !== 'habilitado'
  })

  return (
    <div className="space-y-5">
      {/* Header actions */}
      <div className="flex items-center gap-3">
        {!selectedApertura && (
          <button className="btn-primary" onClick={() => setShowNew(!showNew)}>
            <FileText size={16} /> Iniciar proceso de apertura
          </button>
        )}
        {selectedApertura && (
          <button className="btn-secondary" onClick={() => setSelectedApertura(null)}>
            ← Volver a la lista
          </button>
        )}
      </div>

      {/* Selector de establecimiento */}
      {showNew && !selectedApertura && (
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            Seleccioná el establecimiento para iniciar la apertura
          </h2>
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="input pl-9"
              placeholder="Buscar establecimiento…"
              value={estSearch}
              onChange={(e) => setEstSearch(e.target.value)}
            />
          </div>
          {filteredEst.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">
              {establecimientos.length === 0
                ? 'Primero registrá un establecimiento en la pestaña Establecimientos'
                : 'No hay establecimientos disponibles para iniciar apertura'}
            </p>
          ) : (
            <div className="space-y-2">
              {filteredEst.map((e) => (
                <button
                  key={e.id}
                  onClick={() => startApertura(e.id)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition-all text-sm text-left"
                >
                  <div>
                    <div className="font-medium text-gray-900">{e.nombre}</div>
                    <div className="text-xs text-gray-400">{e.direccion} · {e.localidad}</div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lista de aperturas activas */}
      {!selectedApertura && !showNew && (
        <>
          {aperturasActivas.length === 0 ? (
            <div className="card p-16 text-center">
              <ClipboardList size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No hay procesos de apertura activos</p>
              <p className="text-xs text-gray-400 mt-1">Iniciá un nuevo proceso con el botón de arriba</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {aperturasActivas.map((a) => {
                const est = establecimientos.find((e) => e.id === a.establecimientoId)
                const reqs = a.documentacion.filter((d) => d.requerido)
                const pres = reqs.filter((d) => d.presentado)
                const pct = reqs.length > 0 ? Math.round((pres.length / reqs.length) * 100) : 0
                return (
                  <button
                    key={a.id}
                    onClick={() => setSelectedApertura(a)}
                    className="card p-5 text-left hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-semibold text-gray-900">{est?.nombre ?? 'Establecimiento'}</div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          Iniciado: {new Date(a.fechaInicio + 'T00:00:00').toLocaleDateString('es-AR')}
                        </div>
                      </div>
                      <Badge variant={a.etapa >= 4 ? 'green' : a.etapa >= 2 ? 'yellow' : 'blue'}>
                        Etapa {a.etapa}/4
                      </Badge>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Documentación</span>
                        <span>{pres.length}/{reqs.length} ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${pct === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* Detalle de apertura seleccionada */}
      {selectedApertura && (() => {
        const est = establecimientos.find((e) => e.id === selectedApertura.establecimientoId)
        return (
          <div className="space-y-5">
            {/* Stepper */}
            <div className="card p-5">
              <div className="flex items-center gap-0">
                {ETAPAS.map((etapa, idx) => {
                  const isActive = selectedApertura.etapa === etapa.num
                  const isDone = selectedApertura.etapa > etapa.num
                  const Icon = etapa.icon
                  return (
                    <div key={etapa.num} className="flex items-center flex-1">
                      <div className="flex flex-col items-center">
                        <button
                          onClick={() => setEtapa(etapa.num)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all text-sm font-bold
                            ${isDone ? 'bg-green-500 text-white' : isActive ? 'bg-blue-700 text-white ring-4 ring-blue-200' : 'bg-gray-100 text-gray-400'}`}
                        >
                          {isDone ? <CheckCircle2 size={18} /> : <Icon size={18} />}
                        </button>
                        <div className={`text-xs mt-1 font-medium ${isActive ? 'text-blue-700' : isDone ? 'text-green-600' : 'text-gray-400'}`}>
                          {etapa.label}
                        </div>
                      </div>
                      {idx < ETAPAS.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-2 -mt-5 ${isDone ? 'bg-green-400' : 'bg-gray-200'}`} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Establecimiento header */}
            <div className="card p-5 bg-blue-50 border-blue-100">
              <div className="flex items-center gap-3">
                <Building2 size={20} className="text-blue-600" />
                <div>
                  <div className="font-semibold text-blue-900">{est?.nombre}</div>
                  <div className="text-xs text-blue-600">{est?.direccion} · {est?.localidad} · Dir. Técnico: {est?.responsable}</div>
                </div>
              </div>
            </div>

            {/* Etapa 1: Info */}
            {selectedApertura.etapa === 1 && (
              <div className="card p-5">
                <h3 className="font-semibold text-gray-800 mb-3">Descripción del Proceso de Apertura</h3>
                <div className="prose prose-sm text-gray-600 space-y-3">
                  <p>El proceso de habilitación de un establecimiento farmacéutico comprende las siguientes etapas según el <strong>Decreto 2200/2005</strong> y la <strong>Ley 17.565</strong>:</p>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li><strong>Presentación de documentación</strong>: El titular presenta la solicitud con todos los documentos requeridos ante la autoridad sanitaria.</li>
                    <li><strong>Verificación documental</strong>: La autoridad sanitaria verifica la completitud y validez de la documentación.</li>
                    <li><strong>Inspección previa (ocular)</strong>: Un inspector verifica in situ que el local cumple los requisitos de planta física e infraestructura.</li>
                    <li><strong>Resolución</strong>: Se emite la habilitación sanitaria o se notifica el rechazo con los motivos.</li>
                  </ol>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex gap-2">
                    <AlertTriangle size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-800">
                      El plazo legal de resolución es de 30 días hábiles desde la presentación completa de la documentación (Dec. 2200/05 Art. 18).
                    </p>
                  </div>
                </div>
                <button className="btn-primary mt-4" onClick={() => setEtapa(2)}>
                  Continuar a documentación <ChevronRight size={16} />
                </button>
              </div>
            )}

            {/* Etapa 2: Documentación */}
            {selectedApertura.etapa === 2 && (
              <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">Lista de Verificación Documental</h3>
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-gray-600">
                      <span className="font-semibold text-blue-700">{docsPresentados.length}</span>/{docsRequeridos.length} obligatorios
                    </div>
                    <Badge variant={todosCompletos ? 'green' : 'yellow'}>
                      {Math.round(pctDocs)}%
                    </Badge>
                  </div>
                </div>

                <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-5">
                  <div
                    className={`h-full rounded-full transition-all ${todosCompletos ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{ width: `${pctDocs}%` }}
                  />
                </div>

                <div className="space-y-2">
                  {selectedApertura.documentacion.map((doc) => (
                    <DocRow
                      key={doc.id}
                      doc={doc}
                      onToggle={() => toggleDoc(doc.id)}
                      onObsChange={(obs) => setDocObs(doc.id, obs)}
                    />
                  ))}
                </div>

                <div className="flex gap-3 mt-5 pt-4 border-t border-gray-100">
                  <button className="btn-secondary" onClick={() => setEtapa(1)}>← Anterior</button>
                  <button
                    className="btn-primary"
                    onClick={() => setEtapa(3)}
                    disabled={!todosCompletos}
                  >
                    Continuar a visita previa <ChevronRight size={16} />
                  </button>
                  {!todosCompletos && (
                    <p className="text-xs text-yellow-700 self-center">
                      Completá todos los documentos obligatorios para avanzar
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Etapa 3: Visita previa */}
            {selectedApertura.etapa === 3 && (
              <div className="card p-5">
                <h3 className="font-semibold text-gray-800 mb-3">Visita de Inspección Previa</h3>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4 text-sm text-blue-800 space-y-2">
                  <p className="font-medium flex items-center gap-2">
                    <Search size={15} /> Aspectos a verificar en la visita ocular:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-xs text-blue-700">
                    <li>Superficie mínima del local (40m² para farmacias)</li>
                    <li>Acceso directo a la vía pública</li>
                    <li>Iluminación y ventilación adecuadas</li>
                    <li>Instalaciones sanitarias independientes</li>
                    <li>Planta física acorde al plano aprobado</li>
                    <li>Áreas diferenciadas para dispensación y almacenamiento</li>
                    <li>Sistema de climatización y control de temperatura</li>
                    <li>Equipamiento básico (mesada, estanterías, balanza si corresponde)</li>
                  </ul>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Una vez realizada la inspección previa, podés registrar la inspección completa en la pestaña <strong>Inspecciones</strong> usando el checklist normativo.
                </p>
                <div className="flex gap-3">
                  <button className="btn-secondary" onClick={() => setEtapa(2)}>← Anterior</button>
                  <button className="btn-primary" onClick={() => setEtapa(4)}>
                    Marcar visita realizada <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Etapa 4: Resolución */}
            {selectedApertura.etapa === 4 && (
              <div className="card p-5">
                <h3 className="font-semibold text-gray-800 mb-4">Resolución de Habilitación</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ResolucionCard
                    title="Habilitar establecimiento"
                    desc="El establecimiento cumple todos los requisitos. Se emite la habilitación sanitaria."
                    icon={<CheckCircle2 size={32} className="text-green-500" />}
                    color="green"
                    action="Otorgar habilitación"
                    onClick={() => {
                      if (est) {
                        // In real app: update establishment state to 'habilitado'
                        alert(`Habilitación otorgada para ${est.nombre}.\nActualizá el estado del establecimiento en la pestaña Establecimientos.`)
                      }
                    }}
                  />
                  <ResolucionCard
                    title="Rechazar solicitud"
                    desc="El establecimiento no cumple los requisitos. Se notifica con los motivos del rechazo."
                    icon={<XCircle size={32} className="text-red-500" />}
                    color="red"
                    action="Rechazar con observaciones"
                    onClick={() => alert('Se generaría el acta de rechazo con las observaciones correspondientes.')}
                  />
                </div>
                <div className="mt-4 flex gap-3">
                  <button className="btn-secondary" onClick={() => setEtapa(3)}>← Anterior</button>
                  <button className="btn-secondary flex items-center gap-2" onClick={() => window.print()}>
                    <Download size={14} /> Descargar expediente
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      })()}
    </div>
  )
}

function DocRow({
  doc, onToggle, onObsChange,
}: {
  doc: DocumentacionItem
  onToggle: () => void
  onObsChange: (obs: string) => void
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className={`border rounded-xl overflow-hidden transition-colors ${
        doc.presentado ? 'border-green-200 bg-green-50' : doc.requerido ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
      }`}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          onClick={onToggle}
          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-colors
            ${doc.presentado ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-green-400'}`}
        >
          {doc.presentado && <CheckCircle2 size={14} />}
        </button>
        <div className="flex-1 text-sm">
          <span className={doc.presentado ? 'text-green-800 line-through opacity-75' : 'text-gray-800'}>
            {doc.nombre}
          </span>
          {doc.requerido && (
            <span className="ml-2 text-xs text-red-500 font-medium">*obligatorio</span>
          )}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1 text-gray-400 hover:text-gray-600"
        >
          <ChevronDown size={14} className={expanded ? 'rotate-180' : ''} />
        </button>
      </div>
      {expanded && (
        <div className="px-4 pb-3 border-t border-gray-100">
          <input
            className="input text-xs mt-2"
            placeholder="Observación sobre este documento…"
            value={doc.observacion ?? ''}
            onChange={(e) => onObsChange(e.target.value)}
          />
        </div>
      )}
    </div>
  )
}

function ResolucionCard({
  title, desc, icon, color, action, onClick,
}: {
  title: string
  desc: string
  icon: React.ReactNode
  color: 'green' | 'red'
  action: string
  onClick: () => void
}) {
  return (
    <div
      className={`border-2 rounded-xl p-5 text-center space-y-3 ${
        color === 'green' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
      }`}
    >
      <div className="flex justify-center">{icon}</div>
      <div className="font-semibold text-gray-800">{title}</div>
      <p className="text-xs text-gray-600">{desc}</p>
      <button
        onClick={onClick}
        className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
          color === 'green'
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'bg-red-600 text-white hover:bg-red-700'
        }`}
      >
        {action}
      </button>
    </div>
  )
}
