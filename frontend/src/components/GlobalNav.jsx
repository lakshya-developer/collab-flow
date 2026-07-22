import { Link, useNavigate, useLocation } from 'react-router-dom'
import './GlobalNav.css'
import { useAuth } from '../contexts/AuthContext'

export default function GlobalNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth() || {}

  function signOut() {
    logout()
    navigate('/')
  }

  /* active-link helper */
  const isActive = (path) => location.pathname === path

  return (
    <header className="nav-shell">
      <div className="nav-brand">
        <Link to="/" className="nav-logo">
          <span className="nav-logo-mark">C</span>
          CollabFlow
        </Link>
      </div>
      <nav className="nav-links">
        <Link to="/" className={isActive('/') ? 'nav-active' : ''}>Home</Link>
        <Link to="/dashboard" className={isActive('/dashboard') ? 'nav-active' : ''}>Dashboard</Link>
        <Link to="/projects" className={isActive('/projects') ? 'nav-active' : ''}>Projects</Link>
        <Link to="/projects/board" className={isActive('/projects/board') ? 'nav-active' : ''}>Board</Link>

        {user ? (
          <div className="nav-user">
            <span className="nav-avatar">{user.name?.charAt(0)?.toUpperCase() || 'U'}</span>
            <span className="nav-username">{user.name}</span>
            <a href="#" className="nav-signout" onClick={(e) => { e.preventDefault(); signOut() }}>
              Sign out
            </a>
          </div>
        ) : (
          <Link to="/signin" className={`nav-signin-btn ${isActive('/signin') ? 'nav-active' : ''}`}>Sign in</Link>
        )}
      </nav>
    </header>
  )
}
