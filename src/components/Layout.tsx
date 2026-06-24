import {
  LayoutDashboard,
  Building2,
  ClipboardCheck,
  Search,
  BookOpen,
  BarChart3,
  Pill,
  ChevronRight,
  FileText,
} from 'lucide-react'
import type { TabId } from '../types'

interface NavItem {
  id: TabId
  label: string
  icon: React.ElementType
  description: string
}

const NAV: NavItem[] = [
  { id: 'dashboard',       label: 'Dashboard',       icon: LayoutDashboard, description: 'Resumen general' },
  { id: 'establecimientos', label: 'Establecimientos', icon: Building2,        description: 'Registro de farmacias' },
  { id: 'apertura',        label: 'Apertura',         icon: FileText,         description: 'Proceso de habilitación' },
  { id: 'inspecciones',    label: 'Inspecciones',     icon: Search,           description: 'Gestión de inspecciones' },
  { id: 'checklist',       label: 'Checklist',        icon: ClipboardCheck,   description: 'Acta de inspección' },
  { id: 'normativas',      label: 'Normativas',       icon: BookOpen,         description: 'Marco regulatorio' },
  { id: 'reportes',        label: 'Reportes',         icon: BarChart3,        description: 'Estadísticas y métricas' },
]

interface LayoutProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
  children: React.ReactNode
}

export default function Layout({ activeTab, onTabChange, children }: LayoutProps) {
  const active = NAV.find((n) => n.id === activeTab)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-blue-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center">
              <Pill size={20} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-bold leading-none">FarmaControl</div>
              <div className="text-xs text-blue-300 mt-0.5">v1.0 · ANMAT</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
          {NAV.map(({ id, label, icon: Icon, description }) => {
            const isActive = activeTab === id
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group
                  ${isActive
                    ? 'bg-blue-700 text-white shadow-lg shadow-blue-900/50'
                    : 'text-blue-200 hover:bg-blue-800 hover:text-white'}`}
              >
                <Icon
                  size={18}
                  className={isActive ? 'text-blue-200' : 'text-blue-400 group-hover:text-blue-200'}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{label}</div>
                  {isActive && (
                    <div className="text-xs text-blue-300 truncate">{description}</div>
                  )}
                </div>
                {isActive && <ChevronRight size={14} className="text-blue-300 flex-shrink-0" />}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-blue-800">
          <div className="text-xs text-blue-400 space-y-0.5">
            <div className="font-medium text-blue-300">Autoridad Sanitaria</div>
            <div>Ref. Buenas Prácticas de Farmacia</div>
            <div>OMS GPP 2011 · Dec. 2200/05</div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{active?.label ?? ''}</h1>
            <p className="text-xs text-gray-500 mt-0.5">{active?.description ?? ''}</p>
          </div>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('es-AR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
