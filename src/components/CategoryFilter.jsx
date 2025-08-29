import React from 'react'
import { CATEGORIES } from '../data/menu.js'

export default function CategoryFilter({ value, onChange }){
  return (
    <select value={value} onChange={e=>onChange(e.target.value)}>
      <option value="">All Categories</option>
      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
    </select>
  )
}
