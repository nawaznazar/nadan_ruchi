import React, { createContext, useContext, useEffect, useState } from 'react'

// Create theme context for sharing theme state across components
const ThemeContext = createContext()
export const useTheme = () => useContext(ThemeContext)

export function ThemeProvider({ children }) {
  // Initialize theme from localStorage or default to 'light'
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')

  // Update localStorage and HTML attribute when theme changes
  useEffect(() => {
    localStorage.setItem('theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Toggle between light and dark themes
  const toggle = () => setTheme(currentTheme => 
    currentTheme === 'light' ? 'dark' : 'light'
  )

  // Provide theme state and toggle function to child components
  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}