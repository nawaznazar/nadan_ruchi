import React, { createContext, useContext, useEffect, useState } from 'react'

// Create authentication context for sharing auth state across components
const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

// Pre-defined user accounts for demonstration purposes
const DEFAULT_USERS = [
  { email: 'admin@nadanruchi.qa', password: 'Nawaz@987', role: 'admin', name: 'Admin' },
  { email: 'arun@yopmail.com', password: 'Arun@987', role: 'customer', name: 'Arun' },
  { email: 'shobin@yopmail.com', password: 'Shobin@987', role: 'customer', name: 'Shobin' },
  { email: 'nazriya@yopmail.com', password: 'Nazriya@987', role: 'customer', name: 'Nazriya' },
]

export function AuthProvider({ children }) {
  // Initialize user state from localStorage if available
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('nr_user')
    return saved ? JSON.parse(saved) : null
  })

  // Persist user data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('nr_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('nr_user')
    }
  }, [user])

  // Login function to authenticate users against predefined accounts
  const login = (email, password) => {
    const match = DEFAULT_USERS.find(u => u.email === email && u.password === password)
    if (match) { 
      // Store only necessary user information (excluding password)
      setUser({ email: match.email, role: match.role, name: match.name })
      return { ok: true }
    }
    return { ok: false, error: 'Invalid credentials' }
  }

  // Logout function to clear user data
  const logout = () => setUser(null)

  // Provide authentication methods and user data to child components
  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}