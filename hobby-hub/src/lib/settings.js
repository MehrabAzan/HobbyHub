const SETTINGS_KEY = 'gamehub_settings'

const defaults = {
  theme: 'default',
  showContentOnFeed: false,
  showImageOnFeed: false,
}

export function LoadSettings() {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY)
    return stored ? { ...defaults, ...JSON.parse(stored) } : { ...defaults }
  } catch {
    return { ...defaults }
  }
}

export function SaveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function ApplyTheme(theme) {
  if (!theme || theme === 'default') {
    document.documentElement.removeAttribute('data-theme')
    return
  }
  document.documentElement.setAttribute('data-theme', theme)
}
