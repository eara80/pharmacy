import { useState } from 'react'
import { Search, BookOpen, CheckCircle2, ExternalLink } from 'lucide-react'
import Badge from '../components/Badge'
import { NORMATIVAS, CATEGORIAS_NORMATIVAS } from '../data/normativas'

export default function Normativas() {
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('Todas')
  const [soloVigentes, setSoloVigentes] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = NORMATIVAS.filter((n) => {
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      [n.codigo, n.titulo, n.organismo, n.resumen].join(' ').toLowerCase().includes(q)
    const matchCat = catFilter === 'Todas' || n.categoria === catFilter
    const matchVig = !soloVigentes || n.vigente
    return matchSearch && matchCat && matchVig
  })

  const catCount = CATEGORIAS_NORMATIVAS.reduce<Record<string, number>>((acc, cat) => {
    acc[cat] = cat === 'Todas'
      ? NORMATIVAS.filter((n) => !soloVigentes || n.vigente).length
      : NORMATIVAS.filter((n) => n.categoria === cat && (!soloVigentes || n.vigente)).length
    return acc
  }, {})

  return (
    <div className="space-y-5">
      {/* Search + filters */}
      <div className="card p-4 space-y-3">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="input pl-9"
              placeholder="Buscar por código, título, organismo o texto…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={soloVigentes}
              onChange={(e) => setSoloVigentes(e.target.checked)}
              className="rounded border-gray-300 text-blue-600"
            />
            Solo vigentes
          </label>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIAS_NORMATIVAS.map((cat) => (
            <button
              key={cat}
              onClick={() => setCatFilter(cat)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                catFilter === cat
                  ? 'bg-blue-700 text-white border-blue-700'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
              }`}
            >
              {cat} {catCount[cat] !== undefined && (
                <span className={catFilter === cat ? 'text-blue-200' : 'text-gray-400'}>
                  ({catCount[cat]})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-500">
        {filtered.length} normativa{filtered.length !== 1 ? 's' : ''} encontrada{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Normativas list */}
      {filtered.length === 0 ? (
        <div className="card p-16 text-center">
          <BookOpen size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No se encontraron normativas con esos filtros</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((n) => {
            const isExp = expanded === n.id
            return (
              <div
                key={n.id}
                className={`card overflow-hidden transition-all ${
                  n.vigente ? '' : 'opacity-60'
                }`}
              >
                <button
                  onClick={() => setExpanded(isExp ? null : n.id)}
                  className="w-full flex items-start gap-4 px-5 py-4 hover:bg-gray-50 text-left transition-colors"
                >
                  {/* Color indicator */}
                  <div className="w-1 self-stretch rounded-full flex-shrink-0 bg-blue-600 mt-1" />

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-blue-800 font-mono">{n.codigo}</span>
                      <Badge variant={getCatColor(n.categoria)} size="sm">{n.categoria}</Badge>
                      {n.vigente
                        ? <Badge variant="green" size="sm"><CheckCircle2 size={10} className="mr-1" />Vigente</Badge>
                        : <Badge variant="gray" size="sm">Derogada</Badge>
                      }
                    </div>
                    <div className="text-sm font-semibold text-gray-800 leading-snug">{n.titulo}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {n.organismo} · {new Date(n.fecha + 'T00:00:00').toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                </button>

                {isExp && (
                  <div className="px-5 pb-5 border-t border-gray-100">
                    <div className="mt-3 bg-gray-50 rounded-xl p-4">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Resumen / Alcance</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">{n.resumen}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="text-xs text-gray-500">
                        <strong>Organismo:</strong> {n.organismo}
                      </div>
                      <div className="text-xs text-gray-500">
                        <strong>Fecha:</strong> {new Date(n.fecha + 'T00:00:00').toLocaleDateString('es-AR')}
                      </div>
                      {n.url && (
                        <a
                          href={n.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-blue-600 hover:underline ml-auto"
                        >
                          <ExternalLink size={12} /> Ver texto oficial
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Reference note */}
      <div className="card p-4 bg-amber-50 border-amber-200">
        <div className="flex gap-3 text-sm">
          <BookOpen size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800">Nota sobre vigencia normativa</p>
            <p className="text-xs text-amber-700 mt-1">
              Esta referencia es orientativa. Siempre verificá la versión actualizada en el Boletín Oficial de la República Argentina (boletinoficial.gob.ar) o en el portal de ANMAT (anmat.gov.ar). La normativa farmacéutica puede actualizarse por nuevas resoluciones.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function getCatColor(cat: string): 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gray' | 'yellow' {
  const map: Record<string, 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gray' | 'yellow'> = {
    'Establecimientos':   'blue',
    'Medicamentos':       'purple',
    'Almacenamiento':     'green',
    'Psicotrópicos':      'red',
    'BPF / Calidad':      'orange',
    'Farmacovigilancia':  'yellow',
    'Trazabilidad':       'blue',
    'Preparaciones':      'purple',
    'Residuos':           'gray',
    'Estándares':         'green',
  }
  return map[cat] ?? 'gray'
}
