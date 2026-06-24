import { useState } from 'react'
import { AppProvider } from './context/AppContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Establecimientos from './pages/Establecimientos'
import NuevaApertura from './pages/NuevaApertura'
import Inspecciones from './pages/Inspecciones'
import Checklist from './pages/Checklist'
import Normativas from './pages/Normativas'
import Reportes from './pages/Reportes'
import type { TabId } from './types'

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')
  const [checklistInspId, setChecklistInspId] = useState<string | null>(null)

  function goToChecklist(inspId: string) {
    setChecklistInspId(inspId)
    setActiveTab('checklist')
  }

  function renderPage() {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNav={setActiveTab} />
      case 'establecimientos':
        return <Establecimientos />
      case 'apertura':
        return <NuevaApertura />
      case 'inspecciones':
        return <Inspecciones onGoChecklist={goToChecklist} />
      case 'checklist':
        return (
          <Checklist
            inspeccionId={checklistInspId}
            onBack={() => setActiveTab('inspecciones')}
          />
        )
      case 'normativas':
        return <Normativas />
      case 'reportes':
        return <Reportes />
      default:
        return null
    }
  }

  return (
    <AppProvider>
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        {renderPage()}
      </Layout>
    </AppProvider>
  )
}
