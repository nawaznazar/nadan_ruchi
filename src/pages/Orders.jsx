import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { formatQAR } from "../utils/currency.js";

const statusFlow = ["pending", "preparing", "ready", "on the way", "done"];

const statusStyles = {
  pending: { color: "#f97316", label: "Pending", animation: "" },
  preparing: { color: "#3b82f6", label: "Preparing", animation: "pulse" },
  ready: { color: "#10b981", label: "Ready", animation: "" },
  "on the way": { color: "#facc15", label: "On the way", animation: "pulse" },
  done: { color: "#14b8a6", label: "Delivered", animation: "" },
  cancelled: { color: "#ef4444", label: "Cancelled", animation: "" },
  rejected: { color: "#b91c1c", label: "Rejected", animation: "" },
};

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [reviewModal, setReviewModal] = useState(null);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  // Load orders for current user
  useEffect(() => {
    if (user) {
      const data = JSON.parse(localStorage.getItem("nr_orders") || "[]");
      setOrders(data.filter((o) => o.email === user.email));
    }
  }, [user]);

  // Auto update statuses every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      const all = JSON.parse(localStorage.getItem("nr_orders") || "[]");
      let updated = false;

      const newAll = all.map((o) => {
        if (["done", "cancelled", "rejected"].includes(o.status)) {
          return o; // keep final statuses unchanged
        }
        const currentIndex = statusFlow.indexOf(o.status);
        if (currentIndex !== -1 && currentIndex < statusFlow.length - 1) {
          updated = true;
          return { ...o, status: statusFlow[currentIndex + 1] };
        }
        return o;
      });

      if (updated) {
        localStorage.setItem("nr_orders", JSON.stringify(newAll));
        if (user) {
          setOrders(newAll.filter((o) => o.email === user.email));
        }
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [user]);

  if (!user)
    return (
      <div className="container">
        <p>Please login first.</p>
      </div>
    );

  const cancelOrder = (id) => {
    if (!window.confirm("Cancel this order?")) return;
    const all = JSON.parse(localStorage.getItem("nr_orders") || "[]");
    const updated = all.map((o) =>
      o.id === id ? { ...o, status: "cancelled" } : o
    );
    localStorage.setItem("nr_orders", JSON.stringify(updated));
    setOrders(updated.filter((o) => o.email === user.email));
  };

  const generateBill = (order) => {
    const billWindow = window.open("", "_blank", "width=600,height=800");
    billWindow.document.write(`
      <html>
      <head>
        <title>Bill - Order #${order.id}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h2 { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background: #f5f5f5; }
          .right { text-align: right; }
          .muted { color: gray; font-size: 0.9rem; }
        </style>
      </head>
      <body>
        <h2>🧾 Invoice / Bill</h2>
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Date:</strong> ${new Date(order.date).toLocaleString()}</p>
        <p><strong>Customer:</strong> ${order.email}</p>

        <h3>Delivery Address</h3>
        <p>${order.delivery.zone}, ${order.delivery.street}, 
        Building: ${order.delivery.building}, Area: ${order.delivery.area}</p>

        <h3>Items</h3>
        <table>
          <thead>
            <tr><th>Item</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr>
          </thead>
          <tbody>
            ${order.items.map(it => `
              <tr>
                <td>${it.name}</td>
                <td>${it.qty}</td>
                <td>${formatQAR(it.price)}</td>
                <td class="right">${formatQAR(it.price * it.qty)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <h3 class="right">Total: ${formatQAR(order.total)}</h3>
        <p><strong>Payment:</strong> ${order.payment === "cash" ? "Cash on Delivery" : "Card"}</p>
        <p><strong>Status:</strong> ${order.status}</p>

        <hr />
        <p style="text-align:center; font-size:0.9rem;">Thank you for ordering with us!</p>
      </body>
      </html>
    `);
    billWindow.document.close();
    billWindow.print();
  };

  const submitReview = (order) => {
    if (!text.trim()) return alert("Please write something.");
    const all = JSON.parse(localStorage.getItem("nr_reviews") || "[]");
    const newReview = {
      id: Date.now(),
      orderId: order.id,
      user: user.name || user.email,
      text,
      rating,
      date: new Date(),
    };
    all.push(newReview);
    localStorage.setItem("nr_reviews", JSON.stringify(all));
    setText("");
    setRating(5);
    setReviewModal(null);
    alert("✅ Review submitted!");
  };

  return (
    <div className="container">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p className="muted">No past orders yet.</p>
      ) : (
        <div className="grid">
          {orders
            .slice()
            .reverse()
            .map((o, i) => {
              const st = statusStyles[o.status] || statusStyles.pending;
              return (
                <div
                  key={o.id}
                  className={`card order-card ${st.animation}`}
                  style={{ borderLeft: `6px solid ${st.color}` }}
                >
                  <h3>Order #{i + 1}</h3>
                  <ul>
                    {o.items.map((it) => (
                      <li key={it.id}>
                        {it.qty} × {it.name} — {formatQAR(it.price * it.qty)}
                      </li>
                    ))}
                  </ul>
                  <p><strong>Total:</strong> {formatQAR(o.total)}</p>
                  <p>
                    <strong>Delivery:</strong> {o.delivery.zone}, {o.delivery.street}, 
                    Bldg {o.delivery.building}, {o.delivery.area}
                  </p>
                  <p><strong>Payment:</strong> {o.payment === "cash" ? "Cash on Delivery" : "Card"}</p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className="status-badge"
                      style={{
                        backgroundColor: st.color,
                        padding: "0.3rem 0.6rem",
                        borderRadius: "0.4rem",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {st.label}
                    </span>
                  </p>
                  {o.adminComment && (
                    <p><strong>Admin Comment:</strong> {o.adminComment}</p>
                  )}

                  {o.status === "pending" && (
                    <button
                      className="btn outline"
                      onClick={() => cancelOrder(o.id)}
                    >
                      Cancel Order
                    </button>
                  )}

                  {o.status === "done" && (
                    <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
                      <button className="btn" onClick={() => generateBill(o)}>
                        Generate Bill
                      </button>
                      <button
                        className="btn outline"
                        onClick={() => setReviewModal(o)}
                      >
                        Leave Review
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}

      {/* Review Modal */}
      {reviewModal && (
        <div
          className="modal"
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="card"
            style={{ width: "400px", maxWidth: "90%", padding: "1.5rem" }}
          >
            <h3>Leave a Review</h3>
            <p className="muted">For Order #{reviewModal.id}</p>

            <div style={{ margin: "1rem 0" }}>
              <label>Rating:</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                <option value={5}>⭐⭐⭐⭐⭐</option>
                <option value={4}>⭐⭐⭐⭐</option>
                <option value={3}>⭐⭐⭐</option>
                <option value={2}>⭐⭐</option>
                <option value={1}>⭐</option>
              </select>
            </div>

            <textarea
              placeholder="Write your feedback..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              style={{ width: "100%", marginBottom: "1rem" }}
            />

            <div className="row" style={{ justifyContent: "flex-end", gap: "0.5rem" }}>
              <button className="btn outline" onClick={() => setReviewModal(null)}>
                Cancel
              </button>
              <button className="btn" onClick={() => submitReview(reviewModal)}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
