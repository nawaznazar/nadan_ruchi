import React, { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext.jsx'
import { formatQAR } from '../utils/currency.js'
import { Link } from 'react-router-dom'

export default function Cart(){
  // Access cart functionality and data
  const { items, updateQty, remove, clear, total } = useCart()
  const [menuItems, setMenuItems] = useState([])
  
  // Load menu items from localStorage to check quantity limits
  useEffect(() => {
    const loadMenuItems = () => {
      const stored = JSON.parse(localStorage.getItem("nr_admin_menu")) || [];
      setMenuItems(stored);
    };
    
    loadMenuItems();
    
    // Listen for menu updates
    window.addEventListener("menu-updated", loadMenuItems);
    return () => window.removeEventListener("menu-updated", loadMenuItems);
  }, []);
  
  // Check if an item can have its quantity increased
  const canIncreaseQty = (item) => {
    const menuItem = menuItems.find(mi => mi.id === item.id) || {};
    const availableQty = menuItem.availableQty || 0;
    const maxCartQty = menuItem.maxCartQty || 10;
    
    // Can't increase if we've reached the maximum allowed per cart
    // or if we've reached the available quantity
    const maxAllowed = Math.min(maxCartQty, availableQty);
    return item.qty < maxAllowed;
  };
  
  // Handle quantity increase with limit check
  const handleIncreaseQty = (item) => {
    if (canIncreaseQty(item)) {
      updateQty(item.id, item.qty + 1);
    }
  };
  
  // Get available quantity for an item
  const getAvailableQty = (itemId) => {
    const menuItem = menuItems.find(mi => mi.id === itemId) || {};
    return menuItem.availableQty || 0;
  };
  
  // Get max cart quantity for an item
  const getMaxCartQty = (itemId) => {
    const menuItem = menuItems.find(mi => mi.id === itemId) || {};
    return menuItem.maxCartQty || 10;
  };

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
              {items.map(i => {
                const availableQty = getAvailableQty(i.id);
                const maxCartQty = getMaxCartQty(i.id);
                const maxAllowed = Math.min(maxCartQty, availableQty);
                const isLimitReached = i.qty >= maxAllowed;
                
                return (
                  <tr key={i.id}>
                    <td>
                      <strong>{i.name}</strong><br/>
                      <span className="muted">{i.category}</span>
                      {isLimitReached && availableQty > 0 && (
                        <div className="stock-low" style={{fontSize: '0.8rem', marginTop: '0.3rem'}}>
                          Maximum {maxAllowed} per order
                        </div>
                      )}
                      {availableQty <= 0 && (
                        <div className="stock-out" style={{fontSize: '0.8rem', marginTop: '0.3rem'}}>
                          Out of stock - please remove
                        </div>
                      )}
                    </td>
                    <td>{formatQAR(i.price)}</td>
                    <td>
                      {/* Quantity controls */}
                      <div className="row">
                        <button 
                          className="btn outline" 
                          onClick={() => updateQty(i.id, i.qty - 1)}
                        >-</button>
                        <span style={{minWidth: 28, textAlign: 'center'}}>{i.qty}</span>
                        <button 
                          className="btn outline" 
                          onClick={() => handleIncreaseQty(i)}
                          disabled={!canIncreaseQty(i)}
                        >+</button>
                        <button className="btn outline" onClick={() => remove(i.id)}>Remove</button>
                      </div>
                    </td>
                    <td className="right"><strong>{formatQAR(i.price * i.qty)}</strong></td>
                  </tr>
                );
              })}
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
      
      {/* Add CSS for stock indicators */}
      <style>{`
        .stock-low {
          color: #e67e22;
          font-weight: bold;
        }
        .stock-out {
          color: #e74c3c;
          font-weight: bold;
        }
      `}</style>
    </div>
  )
}
