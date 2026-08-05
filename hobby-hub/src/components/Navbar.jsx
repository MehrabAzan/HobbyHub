import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { FormatUserId, GetUserId } from '../lib/userId'
import SettingsPanel from './SettingsPanel'

function Navbar() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const userId = GetUserId()

  function HandleSearch(e) {
    e.preventDefault()
    navigate(`/?search=${encodeURIComponent(query.trim())}`)
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        🎮 GameHub
      </Link>
      <form className="navbar-search" onSubmit={HandleSearch}>
        <input
          type="text"
          placeholder="Search posts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
      <div className="navbar-links">
        <span className="user-badge" title={userId}>ID: {FormatUserId(userId)}</span>
        <SettingsPanel />
        <Link to="/">Home</Link>
        <Link to="/create" className="btn-primary">Create Post</Link>
      </div>
    </nav>
  )
}

export default Navbar
