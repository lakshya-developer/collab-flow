import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './SignInPage.css'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { register } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await register(name, email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      {/* brand */}
      <Link to="/" className="auth-brand">
        <span className="auth-brand-mark">C</span>
        CollabFlow
      </Link>

      {/* glass panel */}
      <div className="auth-panel">
        <h1>Create your account</h1>
        <p className="auth-subtitle">Get started with CollabFlow and manage your projects effortlessly.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* name */}
          <div className="auth-field">
            <label htmlFor="reg-name">Full name</label>
            <div className="auth-input-wrap">
              <svg className="auth-input-icon" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                id="reg-name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* email */}
          <div className="auth-field">
            <label htmlFor="reg-email">Email</label>
            <div className="auth-input-wrap">
              <svg className="auth-input-icon" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 4l-10 8L2 4" />
              </svg>
              <input
                id="reg-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* password */}
          <div className="auth-field">
            <label htmlFor="reg-password">Password</label>
            <div className="auth-input-wrap">
              <svg className="auth-input-icon" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <input
                id="reg-password"
                type="password"
                placeholder="Create a password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>

          {/* submit */}
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? (
              'Creating account…'
            ) : (
              <>
                Create account
                <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </>
            )}
          </button>
        </form>

        {error && <p className="auth-error">{error}</p>}

        {/* footer */}
        <div className="auth-footer">
          <span>Already have an account? </span>
          <Link to="/signin">Sign in</Link>

          <div className="auth-alt-links">
            <Link to="/">
              <svg viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4"/></svg>
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
