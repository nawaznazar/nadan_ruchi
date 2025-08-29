import React, { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { formatQAR } from "../utils/currency.js";

export default function Checkout() {
  const { items, total, clear } = useCart();
  const { user } = useAuth();
  const [placed, setPlaced] = useState(false);

  if (items.length === 0 && !placed) {
    return (
      <div className="container">
        <p className="muted">Cart is empty.</p>
      </div>
    );
  }

  const placeOrder = () => {
    // Load existing orders
    const orders = JSON.parse(localStorage.getItem("nr_orders") || "[]");

    // Save new order
    orders.push({
      items,
      total,
      date: new Date(),
      email: user?.email || "guest",
    });

    localStorage.setItem("nr_orders", JSON.stringify(orders));

    // Clear cart + show confirmation
    setPlaced(true);
    clear();
  };

  return (
    <div className="container">
      <h2>Checkout</h2>
      {!placed ? (
        <div className="card">
          <h3>Order Summary</h3>
          <ul>
            {items.map((i) => (
              <li key={i.id}>
                {i.qty} × {i.name} — {formatQAR(i.qty * i.price)}
              </li>
            ))}
          </ul>
          <p>
            <strong>Total: {formatQAR(total)}</strong>
          </p>
          <button className="btn" onClick={placeOrder}>
            Place Order
          </button>
        </div>
      ) : (
        <div className="toast">
          ✅ Order Placed! 🎉 Your delicious Kerala food is on the way.
        </div>
      )}
    </div>
  );
}
