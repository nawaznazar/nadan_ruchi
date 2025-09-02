import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { formatQAR } from "../utils/currency.js";

const statusOptions = ["pending", "preparing", "ready", "on the way", "done", "cancelled", "rejected"];

export default function AdminOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  // Load all orders for admin
  useEffect(() => {
    if (user?.role === "admin") {
      const data = JSON.parse(localStorage.getItem("nr_orders") || "[]");
      setOrders(data);
    }
  }, [user]);

  if (!user || user.role !== "admin") {
    return (
      <div className="container">
        <p>⛔ Access denied. Admins only.</p>
      </div>
    );
  }

  const updateStatus = (id, status) => {
    const all = JSON.parse(localStorage.getItem("nr_orders") || "[]");
    const updated = all.map((o) =>
      o.id === id ? { ...o, status, ...(status !== "rejected" && { adminComment: "" }) } : o
    );
    localStorage.setItem("nr_orders", JSON.stringify(updated));
    setOrders(updated);
  };

  const rejectOrder = (id) => {
    const comment = prompt("Add rejection comment (optional):", "");
    if (comment === null) return;
    updateStatus(id, "rejected");
    const all = JSON.parse(localStorage.getItem("nr_orders") || "[]");
    const updated = all.map((o) =>
      o.id === id ? { ...o, adminComment: comment } : o
    );
    localStorage.setItem("nr_orders", JSON.stringify(updated));
    setOrders(updated);
  };

  return (
    <div className="container">
      <h2>📦 All Orders (Admin View)</h2>
      {orders.length === 0 ? (
        <p className="muted">No orders placed yet.</p>
      ) : (
        <div className="grid">
          {orders
            .slice()
            .reverse()
            .map((o, i) => (
              <div key={o.id} className="card">
                <h3>Order #{i + 1}</h3>
                <p><strong>Customer:</strong> {o.email}</p>
                <ul>
                  {o.items.map((it) => (
                    <li key={it.id}>
                      {it.qty} × {it.name} — {formatQAR(it.price * it.qty)}
                    </li>
                  ))}
                </ul>
                <p><strong>Total:</strong> {formatQAR(o.total)}</p>
                <p>
                  <strong>Delivery:</strong> {o.delivery.zone}, {o.delivery.street},{" "}
                  Bldg {o.delivery.building}, {o.delivery.area}
                </p>
                <p><strong>Payment:</strong> {o.payment === "cash" ? "Cash on Delivery" : "Card"}</p>

                <div style={{ marginTop: ".5rem" }}>
                  <label>
                    <strong>Status:</strong>{" "}
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      style={{ marginLeft: "0.5rem" }}
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {o.adminComment && <p><strong>Comment:</strong> {o.adminComment}</p>}

                {o.status !== "rejected" && (
                  <div className="row" style={{ gap: ".5rem", marginTop: ".5rem" }}>
                    <button className="btn outline" onClick={() => rejectOrder(o.id)}>
                      Reject Order
                    </button>
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
