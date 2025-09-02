import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

const DEFAULT_USERS = [
  { email: 'admin@nadanruchi.qa', password: 'Nawaz@987', role: 'admin', name: 'Admin' },
  { email: 'arun@yopmail.com', password: 'Arun@987', role: 'customer', name: 'Arun' },
  { email: 'shobin@yopmail.com', password: 'Shobin@987', role: 'customer', name: 'Shobin' },
  { email: 'nazriya@yopmail.com', password: 'Nazriya@987', role: 'customer', name: 'Nazriya' },

]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('nr_user')
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    if (user) localStorage.setItem('nr_user', JSON.stringify(user))
    else localStorage.removeItem('nr_user')
  }, [user])

  const login = (email, password) => {
    const match = DEFAULT_USERS.find(u => u.email === email && u.password === password)
    if (match) { 
      setUser({ email: match.email, role: match.role, name: match.name })
      return { ok: true }
    }
    return { ok: false, error: 'Invalid credentials' }
  }

  const logout = () => setUser(null)

  // ✅ Add setUser here to allow profile updates
  return <AuthContext.Provider value={{ user, setUser, login, logout }}>
    {children}
  </AuthContext.Provider>
}
