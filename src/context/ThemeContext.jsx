import React, { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()
export const useTheme = () => useContext(ThemeContext)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')
  useEffect(() => {
    localStorage.setItem('theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])
  const toggle = () => setTheme(t => t === 'light' ? 'dark' : 'light')
  return <ThemeContext.Provider value={{theme, toggle}}>{children}</ThemeContext.Provider>
}
