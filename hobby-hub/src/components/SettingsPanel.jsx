import { useState } from 'react'
import { UseSettings } from '../context/SettingsContext'

function SettingsPanel() {
  const [open, setOpen] = useState(false)
  const { settings, UpdateSettings } = UseSettings()

  return (
    <div className="settings-panel">
      <button
        type="button"
        className="settings-toggle"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        ⚙ Customize
      </button>
      {open && (
        <div className="settings-dropdown">
          <label className="settings-field">
            <span>Color scheme</span>
            <select
              value={settings.theme}
              onChange={(e) => UpdateSettings({ theme: e.target.value })}
            >
              <option value="default">Neon Cyan</option>
              <option value="purple">Purple Haze</option>
              <option value="green">Matrix Green</option>
            </select>
          </label>
          <label className="settings-checkbox">
            <input
              type="checkbox"
              checked={settings.showContentOnFeed}
              onChange={(e) => UpdateSettings({ showContentOnFeed: e.target.checked })}
            />
            Show post content on home feed
          </label>
          <label className="settings-checkbox">
            <input
              type="checkbox"
              checked={settings.showImageOnFeed}
              onChange={(e) => UpdateSettings({ showImageOnFeed: e.target.checked })}
            />
            Show post images on home feed
          </label>
        </div>
      )}
    </div>
  )
}

export default SettingsPanel
