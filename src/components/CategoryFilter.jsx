import React from 'react'
import { CATEGORIES } from '../data/menu.js'

export default function CategoryFilter({ value, onChange }){
  return (
    <select 
      value={value} 
      // Notify parent component when user selects a new category
      onChange={e => onChange(e.target.value)}
    >
      {/* Default option to show all categories */}
      <option value="">All Categories</option>
      
      {/* Dynamically generate dropdown options from our categories list */}
      {CATEGORIES.map(category => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  )
}