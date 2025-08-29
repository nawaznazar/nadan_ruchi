import React from 'react'

export default function SearchBar({ value, onChange }){
  return (
    <input
      placeholder="Search Kerala specials…"
      value={value}
      onChange={e=>onChange(e.target.value)}
      aria-label="search"
    />
  )
}
