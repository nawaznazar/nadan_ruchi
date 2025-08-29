import React, { createContext, useContext, useMemo, useState } from 'react'

const CartContext = createContext()
export const useCart = () => useContext(CartContext)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('nr_cart')
    return saved ? JSON.parse(saved) : []
  })

  const persist = (next) => {
    setItems(next)
    localStorage.setItem('nr_cart', JSON.stringify(next))
  }

  const add = (item) => {
    const next = [...items]
    const idx = next.findIndex(i => i.id === item.id)
    if (idx >= 0) next[idx].qty += 1
    else next.push({ ...item, qty: 1 })
    persist(next)
  }
  const remove = (id) => persist(items.filter(i => i.id !== id))
  const updateQty = (id, qty) => {
    if (qty <= 0) return remove(id)
    persist(items.map(i => i.id === id ? { ...i, qty } : i))
  }
  const clear = () => persist([])

  const total = useMemo(() => items.reduce((s,i)=> s + i.price * i.qty, 0), [items])

  return <CartContext.Provider value={{ items, add, remove, updateQty, clear, total }}>{children}</CartContext.Provider>
}
