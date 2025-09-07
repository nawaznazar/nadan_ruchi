import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { formatQAR } from "../utils/currency.js";

// Order status progression flow
const statusFlow = ["pending", "preparing", "ready", "on the way", "done"];

// Styling configuration for different order statuses
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

  // Filter and sort options
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOption, setSortOption] = useState("newest");

  // Load user orders from localStorage
  useEffect(() => {
    if (user) {
      const data = JSON.parse(localStorage.getItem("nr_orders") || "[]");
      setOrders(data.filter((o) => o.email === user.email));
    }
  }, [user]);

  // Simulate order status progression with interval updates
  useEffect(() => {
    const interval = setInterval(() => {
      const all = JSON.parse(localStorage.getItem("nr_orders") || "[]");
      let updated = false;

      const newAll = all.map((o) => {
        // Don't update completed or cancelled orders
        if (["done", "cancelled", "rejected"].includes(o.status)) return o;
        const currentIndex = statusFlow.indexOf(o.status);
        // Progress order to next status if available
        if (currentIndex !== -1 && currentIndex < statusFlow.length - 1) {
          updated = true;
          return { ...o, status: statusFlow[currentIndex + 1] };
        }
        return o;
      });

      if (updated) {
        localStorage.setItem("nr_orders", JSON.stringify(newAll));
        if (user) setOrders(newAll.filter((o) => o.email === user.email));
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [user]);

  // Require user authentication
  if (!user)
    return (
      <div className="container">
        <p>Please login first.</p>
      </div>
    );

  // Cancel an order with confirmation
  const cancelOrder = (id) => {
    if (!window.confirm("Cancel this order?")) return;
    const all = JSON.parse(localStorage.getItem("nr_orders") || "[]");
    const updated = all.map((o) =>
      o.id === id ? { ...o, status: "cancelled" } : o
    );
    localStorage.setItem("nr_orders", JSON.stringify(updated));
    setOrders(updated.filter((o) => o.email === user.email));
  };

  // Generate printable bill for completed orders
  const generateBill = (order) => {
    const billWindow = window.open("", "_blank", "width=600,height=800");
    billWindow.document.write(`
      <html>
      <head>
        <title>Bill - Order #${order.id}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; color: #333; }
          h1, h2, h3 { margin: 0; }
          .header { text-align: center; border-bottom: 2px solid #ccc; padding-bottom: 10px; margin-bottom: 20px; }
          .brand { font-size: 1.8rem; color:rgb(7, 95, 35); }
          .address { font-size: 0.9rem; color: #555; }
          table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background:rgb(126, 215, 193); }
          .right { text-align: right; }
          .total { font-size: 1.2rem; font-weight: bold; color: #111; }
          .footer { text-align: center; margin-top: 2rem; font-size: 0.9rem; color: #555; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="brand">🍴 Nadan Ruchi</h1>
          <p class="address">Al Wakrah - Doha, Qatar</p>
          <h2>🧾 Invoice / Bill</h2>
        </div>

        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Date:</strong> ${new Date(order.date).toLocaleString()}</p>
        <p><strong>Customer Name:</strong> ${user?.name || "Guest"}</p>
        <p><strong>Email:</strong> ${order.email}</p>

        <h3>Delivery Address</h3>
        <p>${order.delivery.zone}, ${order.delivery.street}, 
        Building: ${order.delivery.building}, Area: ${order.delivery.area}</p>

        <h3>Items</h3>
        <table>
          <thead>
            <tr><th>Item</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr>
          </thead>
          <tbody>
            ${order.items
              .map(
                (it) => `
              <tr>
                <td>${it.name}</td>
                <td>${it.qty}</td>
                <td>${formatQAR(it.price)}</td>
                <td class="right">${formatQAR(it.price * it.qty)}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <p class="right total">Total: ${formatQAR(order.total)}</p>
        <p><strong>Payment:</strong> ${
          order.payment === "cash" ? "Cash on Delivery" : "Card"
        }</p>
        <p><strong>Status:</strong> ${order.status}</p>

        <div class="footer">
          <p>✨ Thank you for ordering with Nadan Ruchi! ✨</p>
          <p>Hotline: +974 55 5555 55 | www.nadanruchi.qa</p>
        </div>
      </body>
      </html>
    `);
    billWindow.document.close();
    billWindow.print();
  };

  // Submit review for completed order
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

  // Filter and sort orders based on user selection
  const filteredOrders = orders
    .filter((o) => (filterStatus === "all" ? true : o.status === filterStatus))
    .sort((a, b) => {
      if (sortOption === "newest") return new Date(b.date) - new Date(a.date);
      if (sortOption === "oldest") return new Date(a.date) - new Date(b.date);
      if (sortOption === "high") return b.total - a.total;
      if (sortOption === "low") return a.total - b.total;
      return 0;
    });

  return (
    <div className="container">
      <h2>My Orders</h2>

      {/* Filter and sort controls */}
      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All</option>
          {Object.keys(statusStyles).map((s) => (
            <option key={s} value={s}>
              {statusStyles[s].label}
            </option>
          ))}
        </select>

        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="high">Total High → Low</option>
          <option value="low">Total Low → High</option>
        </select>
      </div>

      {/* Orders list */}
      {filteredOrders.length === 0 ? (
        <p className="muted">No orders found.</p>
      ) : (
        <div className="grid">
          {filteredOrders.map((o) => {
            const st = statusStyles[o.status] || statusStyles.pending;
            return (
              <div
                key={o.id}
                className={`card order-card ${st.animation}`}
                style={{ borderLeft: `6px solid ${st.color}` }}
              >
                <h3>Order #{o.id}</h3>
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
                {/* Show admin comments for rejected orders */}
                {o.adminComment && <p><strong>Admin Comment:</strong> {o.adminComment}</p>}

                {/* Cancel button for pending orders */}
                {o.status === "pending" && (
                  <button className="btn outline" onClick={() => cancelOrder(o.id)}>
                    Cancel Order
                  </button>
                )}

                {/* Actions for completed orders */}
                {o.status === "done" && (
                  <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
                    <button className="btn" onClick={() => generateBill(o)}>
                      Generate Bill
                    </button>
                    <button className="btn outline" onClick={() => setReviewModal(o)}>
                      Leave Review
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Review modal for completed orders */}
      {reviewModal && (
        <div
          className="modal"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
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