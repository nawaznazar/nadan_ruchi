import React, { createContext, useContext, useMemo, useState } from 'react'

// Create cart context for sharing cart state across components
const CartContext = createContext()
export const useCart = () => useContext(CartContext)

export function CartProvider({ children }) {
  // Initialize cart items from localStorage if available
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('nr_cart')
    return saved ? JSON.parse(saved) : []
  })

  // Helper function to update state and persist to localStorage
  const persist = (next) => {
    setItems(next)
    localStorage.setItem('nr_cart', JSON.stringify(next))
  }

  // Add item to cart or increase quantity if already present
  const add = (item) => {
    const next = [...items]
    const idx = next.findIndex(i => i.id === item.id)
    if (idx >= 0) {
      next[idx].qty += 1  // Increment quantity for existing item
    } else {
      next.push({ ...item, qty: 1 })  // Add new item with initial quantity
    }
    persist(next)
  }

  // Remove item from cart by ID
  const remove = (id) => persist(items.filter(i => i.id !== id))

  // Update quantity of specific item, remove if quantity becomes zero
  const updateQty = (id, qty) => {
    if (qty <= 0) return remove(id)
    persist(items.map(i => i.id === id ? { ...i, qty } : i))
  }

  // Clear all items from cart
  const clear = () => persist([])

  // Calculate total price of all items in cart (memoized for performance)
  const total = useMemo(() => 
    items.reduce((sum, item) => sum + item.price * item.qty, 0), 
    [items]
  )

  // Provide cart data and methods to child components
  return (
    <CartContext.Provider value={{ 
      items, 
      add, 
      remove, 
      updateQty, 
      clear, 
      total 
    }}>
      {children}
    </CartContext.Provider>
  )
}