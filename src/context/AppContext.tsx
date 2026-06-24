import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import type { AppState, Establecimiento, Inspeccion, Apertura } from '../types'
import { DOCS_APERTURA } from '../data/checklistData'

type Action =
  | { type: 'ADD_ESTABLECIMIENTO'; payload: Establecimiento }
  | { type: 'UPDATE_ESTABLECIMIENTO'; payload: Establecimiento }
  | { type: 'DELETE_ESTABLECIMIENTO'; payload: string }
  | { type: 'ADD_INSPECCION'; payload: Inspeccion }
  | { type: 'UPDATE_INSPECCION'; payload: Inspeccion }
  | { type: 'ADD_APERTURA'; payload: Apertura }
  | { type: 'UPDATE_APERTURA'; payload: Apertura }
  | { type: 'LOAD'; payload: AppState }

const initialState: AppState = {
  establecimientos: [],
  inspecciones: [],
  aperturas: [],
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOAD':
      return action.payload
    case 'ADD_ESTABLECIMIENTO':
      return { ...state, establecimientos: [...state.establecimientos, action.payload] }
    case 'UPDATE_ESTABLECIMIENTO':
      return {
        ...state,
        establecimientos: state.establecimientos.map((e) =>
          e.id === action.payload.id ? action.payload : e
        ),
      }
    case 'DELETE_ESTABLECIMIENTO':
      return {
        ...state,
        establecimientos: state.establecimientos.filter((e) => e.id !== action.payload),
      }
    case 'ADD_INSPECCION':
      return { ...state, inspecciones: [...state.inspecciones, action.payload] }
    case 'UPDATE_INSPECCION':
      return {
        ...state,
        inspecciones: state.inspecciones.map((i) =>
          i.id === action.payload.id ? action.payload : i
        ),
      }
    case 'ADD_APERTURA':
      return { ...state, aperturas: [...state.aperturas, action.payload] }
    case 'UPDATE_APERTURA':
      return {
        ...state,
        aperturas: state.aperturas.map((a) =>
          a.id === action.payload.id ? action.payload : a
        ),
      }
    default:
      return state
  }
}

interface AppContextValue {
  state: AppState
  addEstablecimiento: (e: Omit<Establecimiento, 'id'>) => Establecimiento
  updateEstablecimiento: (e: Establecimiento) => void
  deleteEstablecimiento: (id: string) => void
  addInspeccion: (i: Omit<Inspeccion, 'id'>) => Inspeccion
  updateInspeccion: (i: Inspeccion) => void
  addApertura: (establecimientoId: string) => Apertura
  updateApertura: (a: Apertura) => void
}

const AppContext = createContext<AppContextValue | null>(null)

const STORAGE_KEY = 'farmacontrol_v1'

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        dispatch({ type: 'LOAD', payload: JSON.parse(saved) })
      } catch {
        // ignore corrupt data
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

  function addEstablecimiento(data: Omit<Establecimiento, 'id'>): Establecimiento {
    const e = { ...data, id: uid() }
    dispatch({ type: 'ADD_ESTABLECIMIENTO', payload: e })
    return e
  }

  function updateEstablecimiento(e: Establecimiento) {
    dispatch({ type: 'UPDATE_ESTABLECIMIENTO', payload: e })
  }

  function deleteEstablecimiento(id: string) {
    dispatch({ type: 'DELETE_ESTABLECIMIENTO', payload: id })
  }

  function addInspeccion(data: Omit<Inspeccion, 'id'>): Inspeccion {
    const i = { ...data, id: uid() }
    dispatch({ type: 'ADD_INSPECCION', payload: i })
    return i
  }

  function updateInspeccion(i: Inspeccion) {
    dispatch({ type: 'UPDATE_INSPECCION', payload: i })
  }

  function addApertura(establecimientoId: string): Apertura {
    const a: Apertura = {
      id: uid(),
      establecimientoId,
      etapa: 1,
      fechaInicio: new Date().toISOString().split('T')[0],
      documentacion: DOCS_APERTURA.map((d) => ({
        ...d,
        presentado: false,
        observacion: '',
      })),
    }
    dispatch({ type: 'ADD_APERTURA', payload: a })
    return a
  }

  function updateApertura(a: Apertura) {
    dispatch({ type: 'UPDATE_APERTURA', payload: a })
  }

  return (
    <AppContext.Provider
      value={{
        state,
        addEstablecimiento,
        updateEstablecimiento,
        deleteEstablecimiento,
        addInspeccion,
        updateInspeccion,
        addApertura,
        updateApertura,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
