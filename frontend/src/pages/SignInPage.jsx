import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './SignInPage.css'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.')
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
        <h1>Welcome back</h1>
        <p className="auth-subtitle">Sign in to your account to continue where you left off.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* email */}
          <div className="auth-field">
            <label htmlFor="signin-email">Email</label>
            <div className="auth-input-wrap">
              <svg className="auth-input-icon" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 4l-10 8L2 4" />
              </svg>
              <input
                id="signin-email"
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
            <label htmlFor="signin-password">Password</label>
            <div className="auth-input-wrap">
              <svg className="auth-input-icon" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <input
                id="signin-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* submit */}
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? (
              'Signing in…'
            ) : (
              <>
                Continue
                <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </>
            )}
          </button>
        </form>

        {error && <p className="auth-error">{error}</p>}

        {/* footer */}
        <div className="auth-footer">
          <span>Don't have an account? </span>
          <Link to="/register">Create one</Link>

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
