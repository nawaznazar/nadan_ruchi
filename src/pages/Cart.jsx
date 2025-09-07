import React from 'react'
import { useCart } from '../context/CartContext.jsx'
import { formatQAR } from '../utils/currency.js'
import { Link } from 'react-router-dom'

export default function Cart(){
  // Access cart functionality and data
  const { items, updateQty, remove, clear, total } = useCart()
  
  return (
    <div className="container">
      <h2>Cart</h2>
      
      {/* Show empty cart message or cart contents */}
      {items.length === 0 ? (
        <p className="muted">Your cart is empty. <Link to="/menu">Browse the menu</Link>.</p>
      ) : (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Qty</th>
                <th className="right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {/* List all cart items */}
              {items.map(i => (
                <tr key={i.id}>
                  <td>
                    <strong>{i.name}</strong><br/>
                    <span className="muted">{i.category}</span>
                  </td>
                  <td>{formatQAR(i.price)}</td>
                  <td>
                    {/* Quantity controls */}
                    <div className="row">
                      <button className="btn outline" onClick={() => updateQty(i.id, i.qty - 1)}>-</button>
                      <span style={{minWidth: 28, textAlign: 'center'}}>{i.qty}</span>
                      <button className="btn outline" onClick={() => updateQty(i.id, i.qty + 1)}>+</button>
                      <button className="btn outline" onClick={() => remove(i.id)}>Remove</button>
                    </div>
                  </td>
                  <td className="right"><strong>{formatQAR(i.price * i.qty)}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Cart summary and actions */}
          <div className="row" style={{marginTop: '.8rem'}}>
            <button className="btn outline" onClick={clear}>Clear Cart</button>
            <div className="right"><strong>Total: {formatQAR(total)}</strong></div>
          </div>
          
          {/* Checkout button */}
          <div className="row" style={{marginTop: '.8rem', justifyContent: 'flex-end'}}>
            <Link to="/checkout" className="btn">Proceed to Checkout</Link>
          </div>
        </div>
      )}
    </div>
  )
}