import React, { useState } from 'react'
import { formatQAR } from '../utils/currency.js'
import { useCart } from '../context/CartContext.jsx'

export default function FoodCard({ item }) {
  // Access the cart context to add items
  const { add } = useCart()
  
  // State for animation effects and user feedback
  const [anim, setAnim] = useState(false)  // Controls the 'pop' animation
  const [msg, setMsg] = useState(false)    // Controls the toast message visibility

  const handleAdd = () => {
    // Add item to the cart
    add(item)
    
    // Trigger animation and show success message
    setAnim(true)
    setMsg(true)
    
    // Reset animation after it completes
    setTimeout(() => setAnim(false), 300)
    
    // Hide the toast message after 1.5 seconds
    setTimeout(() => setMsg(false), 1500)
  }

  return (
    <div className={`card ${anim ? 'pop' : ''}`}>
      {/* Success toast that appears when item is added */}
      {msg && <div className="toast">✅ {item.name} added to cart!</div>}
      
      {/* Food image with error handling for missing images */}
      <img
        src={item.img}
        alt={item.name}
        style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: '.5rem' }}
        onError={(e) => { 
          // Hide the image if it fails to load
          e.currentTarget.style.display = 'none' 
        }}
      />
      
      <h3 style={{ margin: '.5rem 0' }}>{item.name}</h3>
      <div className="muted">{item.desc}</div>
      
      {/* Row containing category tags and price */}
      <div className="row" style={{ marginTop: '.6rem', justifyContent: 'space-between' }}>
        <div className="row" style={{ gap: '.4rem' }}>
          {/* Display the food category */}
          <span className="tag">{item.category}</span>
          
          {/* Show vegetarian or non-vegetarian tag */}
          {item.veg ? <span className="tag">Veg</span> : <span className="tag">Non-veg</span>}
        </div>
        
        {/* Formatted price display */}
        <strong>{formatQAR(item.price)}</strong>
      </div>
      
      {/* Spacer to push the button to the bottom of the card */}
      <div className="spacer"></div>
      
      {/* Add to cart button with click handler */}
      <button className="btn" onClick={handleAdd}>Add to Cart</button>
    </div>
  )
}