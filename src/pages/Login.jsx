import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login(){
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const nav = useNavigate()
  const loc = useLocation()

  const submit = (e) => {
    e.preventDefault()
    const res = login(email, password)
    if (res.ok) {
      const redirectTo = (loc.state && loc.state.from) || '/'
      nav(redirectTo, { replace:true })
    } else setError(res.error)
  }

  return (
    <div className="container">
      <h2>Login</h2>
      <form className="card" onSubmit={submit}>
        <label>Email<br/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label>
        <div className="spacer"></div>
        <label>Password<br/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></label>
        {error && <p className="muted">{error}</p>}
        <div className="spacer"></div>
        <button className="btn" type="submit">Sign in</button>
        <p className="muted">Demo accounts: admin@nadanruchi.qa / admin123 • customer@nadanruchi.qa / customer123</p>
      </form>
    </div>
  )
}
