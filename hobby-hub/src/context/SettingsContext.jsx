import { createContext, useContext, useState, useEffect } from 'react'
import { LoadSettings, SaveSettings, ApplyTheme } from '../lib/settings'

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(LoadSettings)

  useEffect(() => {
    ApplyTheme(settings.theme)
    SaveSettings(settings)
  }, [settings])

  function UpdateSettings(partial) {
    setSettings((prev) => ({ ...prev, ...partial }))
  }

  return (
    <SettingsContext.Provider value={{ settings, UpdateSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function UseSettings() {
  const context = useContext(SettingsContext)
  if (!context) throw new Error('UseSettings must be used within SettingsProvider')
  return context
}
