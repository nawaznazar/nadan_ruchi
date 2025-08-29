import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { formatQAR } from "../utils/currency.js";

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      const data = JSON.parse(localStorage.getItem("nr_orders") || "[]");
      setOrders(data.filter((o) => o.email === user.email));
    }
  }, [user]);

  if (!user) return <div className="container"><p>Please login first.</p></div>;

  return (
    <div className="container">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p className="muted">No past orders yet.</p>
      ) : (
        <div className="grid">
          {orders.map((o, i) => (
            <div key={i} className="card">
              <h3>Order #{i + 1}</h3>
              <ul>
                {o.items.map((it) => (
                  <li key={it.id}>
                    {it.qty} × {it.name} — {formatQAR(it.price * it.qty)}
                  </li>
                ))}
              </ul>
              <p><strong>Total:</strong> {formatQAR(o.total)}</p>
              <p className="muted">Placed on {new Date(o.date).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
