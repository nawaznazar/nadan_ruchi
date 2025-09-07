import React from 'react'

export default function SearchBar({ value, onChange }){
  return (
    <input
      placeholder="Search Kerala specials…"
      value={value}
      // Pass the search query back to parent component
      onChange={e => onChange(e.target.value)}
      // Accessibility label for screen readers
      aria-label="Search menu items"
    />
  )
}