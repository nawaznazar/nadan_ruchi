import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const nav = useNavigate()
  const loc = useLocation()

  // Handle form submission for login
  const submit = (e) => {
    e.preventDefault()
    const res = login(email, password)
    if (res.ok) {
      // Redirect to previous page or home page after successful login
      const redirectTo = (loc.state && loc.state.from) || '/'
      nav(redirectTo, { replace: true })
    } else setError(res.error)
  }

  return (
    <div
      className="login-page"
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'var(--bg)',
        fontFamily: 'Inter, sans-serif',
        padding: '1rem',
      }}
    >
      <form
        onSubmit={submit}
        className="card"
        style={{
          maxWidth: '400px',
          width: '100%',
          padding: '2.5rem 2rem',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)',
          background: 'var(--card)',
          border: '1px solid var(--card-border)',
          boxShadow: 'var(--card-shadow)',
          textAlign: 'center',
        }}
      >
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Welcome Back</h2>

        {/* Email input field */}
        <label className="sr-only">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />

        <div className="spacer"></div>

        {/* Password input field with show/hide toggle */}
        <div style={{ position: 'relative' }}>
          <label className="sr-only">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              color: 'var(--primary-light)',
              fontSize: '0.9rem',
              background: 'none',
              border: 'none',
              padding: 0,
            }}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        {/* Error message display */}
        {error && (
          <p className="muted" style={{ color: 'var(--danger)', marginTop: '0.75rem' }}>
            {error}
          </p>
        )}

        <div className="spacer"></div>

        {/* Submit button */}
        <button type="submit" className="btn">
          Sign In
        </button>

        {/* Registration link for new users */}
        <p style={{ marginTop: '1rem', color: 'var(--muted)', fontSize: '0.9rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)' }}>
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  )
}