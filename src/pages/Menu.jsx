import React, { useMemo, useState } from 'react'
import { MENU } from '../data/menu.js'
import SearchBar from '../components/SearchBar.jsx'
import CategoryFilter from '../components/CategoryFilter.jsx'
import FoodCard from '../components/FoodCard.jsx'

export default function Menu() {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('')
  const [cart, setCart] = useState([])
  const [msg, setMsg] = useState(null)

  const filtered = useMemo(() => {
    return MENU.filter(
      i => (!cat || i.category === cat) && (!q || i.name.toLowerCase().includes(q.toLowerCase()))
    )
  }, [q, cat])

  const addToCart = (item) => {
    setCart(prev => [...prev, item])
    setMsg(`${item.name} added to cart!`)
    setTimeout(() => setMsg(null), 2000) // hide message after 2s
  }

  return (
    <div className="container">
      <h2>Menu</h2>

      {msg && <div className="toast">{msg}</div>}

      <div className="row">
        <SearchBar value={q} onChange={setQ} />
        <CategoryFilter value={cat} onChange={setCat} />
      </div>

      <div className="spacer"></div>

      <div className="grid">
        {filtered.map(item => (
          <FoodCard 
            key={item.id} 
            item={item} 
            onAdd={() => addToCart(item)} 
          />
        ))}
      </div>
    </div>
  )
}
