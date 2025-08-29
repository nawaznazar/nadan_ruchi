import React from 'react'
import { useTheme } from '../context/ThemeContext.jsx'

export default function DarkModeToggle(){
  const { theme, toggle } = useTheme()
  return <button className="btn outline" onClick={toggle}>{theme === 'light' ? 'Dark' : 'Light'} Mode</button>
}
