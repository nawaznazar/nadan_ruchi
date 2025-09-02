import React, { useState } from 'react'
import { formatQAR } from '../utils/currency.js'
import { useCart } from '../context/CartContext.jsx'

export default function FoodCard({ item }) {
  const { add } = useCart()
  const [anim, setAnim] = useState(false)
  const [msg, setMsg] = useState(false)

  const handleAdd = () => {
    add(item)
    setAnim(true)
    setMsg(true)
    setTimeout(() => setAnim(false), 300) // animation duration
    setTimeout(() => setMsg(false), 1500) // hide toast after 1.5s
  }

  return (
    <div className={`card ${anim ? 'pop' : ''}`}>
      {msg && <div className="toast">✅ {item.name} added to cart!</div>}
      <img
        src={item.img}
        alt={item.name}
        style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: '.5rem' }}
        onError={(e) => { e.currentTarget.style.display = 'none' }}
      />
      <h3 style={{ margin: '.5rem 0' }}>{item.name}</h3>
      <div className="muted">{item.desc}</div>
      <div className="row" style={{ marginTop: '.6rem', justifyContent: 'space-between' }}>
        <div className="row" style={{ gap: '.4rem' }}>
          <span className="tag">{item.category}</span>
          {item.veg ? <span className="tag">Veg</span> : <span className="tag">Non-veg</span>}
        </div>
        <strong>{formatQAR(item.price)}</strong>
      </div>
      <div className="spacer"></div>
      <button className="btn" onClick={handleAdd}>Add to Cart</button>
    </div>
  )
}
