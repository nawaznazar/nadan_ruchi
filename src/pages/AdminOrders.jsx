import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { formatQAR } from "../utils/currency.js";

// Available order status options for dropdown
const statusOptions = [
  "pending",
  "preparing",
  "ready",
  "on the way",
  "done",
  "cancelled",
  "rejected",
];

export default function AdminOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [rejectId, setRejectId] = useState(null);
  const [comment, setComment] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [search, setSearch] = useState("");

  // Load orders from localStorage when admin user is authenticated
  useEffect(() => {
    if (user?.role === "admin") {
      const data = JSON.parse(localStorage.getItem("nr_orders") || "[]");
      setOrders(data);
    }
  }, [user]);

  // Restrict access to admin users only
  if (!user || user.role !== "admin") {
    return (
      <div className="container">
        <p>⛔ Access denied. Admins only.</p>
      </div>
    );
  }

  // Update order status and persist to localStorage
  const updateStatus = (id, status) => {
    const all = JSON.parse(localStorage.getItem("nr_orders") || "[]");
    const updated = all.map((o) =>
      o.id === id
        ? {
            ...o,
            status,
            // Clear admin comment if order is no longer rejected
            ...(status !== "rejected" && { adminComment: "" }),
          }
        : o
    );
    localStorage.setItem("nr_orders", JSON.stringify(updated));
    setOrders(updated);
  };

  // Open rejection modal for a specific order
  const openRejectModal = (id) => {
    setRejectId(id);
    setComment("");
    setShowModal(true);
  };

  // Confirm order rejection with mandatory comment
  const confirmReject = () => {
    if (!rejectId || !comment.trim()) return;
    const all = JSON.parse(localStorage.getItem("nr_orders") || "[]");
    const updated = all.map((o) =>
      o.id === rejectId
        ? { ...o, status: "rejected", adminComment: comment.trim() }
        : o
    );
    localStorage.setItem("nr_orders", JSON.stringify(updated));
    setOrders(updated);
    setShowModal(false);
    setRejectId(null);
    setComment("");
  };

  // Mask credit card number for privacy (show only last 4 digits)
  const maskCard = (num) => {
    if (!num) return "—";
    const clean = num.replace(/\s/g, "");
    const last4 = clean.slice(-4);
    return "**** **** **** " + last4;
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
          .brand { font-size: 1.8rem; color: rgb(7,95,35); }
          .address { font-size: 0.9rem; color: #555; }
          table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background: rgb(126, 215, 193); }
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
        <p><strong>Customer Name:</strong> ${order.customerName || order.name || "Guest"}</p>
        <p><strong>Email:</strong> ${order.email || "—"}</p>

        <h3>Delivery Address</h3>
        <p>${order.delivery.zone}, ${order.delivery.street}, Building: ${order.delivery.building}, Area: ${order.delivery.area}</p>

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
        } (${maskCard(order.card)})</p>
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

  // Filter, sort, and search orders based on user selection
  const filteredOrders = useMemo(() => {
    let data = [...orders];

    // Apply status filter
    if (filter !== "all") data = data.filter((o) => o.status === filter);

    // Apply search filter
    if (search.trim()) {
      data = data.filter((o) =>
        (o.customerName || o.name || o.userName || o.email || "")
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    // Apply sorting
    if (sortBy === "newest") data.sort((a, b) => new Date(b.date) - new Date(a.date));
    else if (sortBy === "oldest") data.sort((a, b) => new Date(a.date) - new Date(b.date));
    else if (sortBy === "amount-high") data.sort((a, b) => b.total - a.total);
    else if (sortBy === "amount-low") data.sort((a, b) => a.total - b.total);

    return data;
  }, [orders, filter, sortBy, search]);

  return (
    <div className="container">
      <h2>📦 All Orders (Admin View)</h2>

      {/* Search, filter, and sort controls */}
      <div
        className="row"
        style={{ gap: "1rem", marginBottom: "1rem", flexWrap: "wrap", alignItems: "center" }}
      >
        <input
          type="text"
          placeholder="Search by customer name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: "1", padding: "0.5rem" }}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Status</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="amount-high">Amount: High → Low</option>
          <option value="amount-low">Amount: Low → High</option>
        </select>
      </div>

      {/* Orders list */}
      {filteredOrders.length === 0 ? (
        <p className="muted">No matching orders found.</p>
      ) : (
        <div className="grid">
          {filteredOrders.slice().reverse().map((o) => (
            <div key={o.id} className="card order-card">
              <h3>Order #{o.id}</h3>
              <p><strong>Customer:</strong> {o.customerName || o.name || o.userName || o.email || "Unknown"}</p>
              <p><strong>Contact:</strong> {o.contact || "—"}</p>
              {o.specialNote && <p><strong>Instructions / Special Needs:</strong> {o.specialNote}</p>}
              <ul>
                {o.items.map((it) => <li key={it.id}>{it.qty} × {it.name} — {formatQAR(it.price * it.qty)}</li>)}
              </ul>
              <p><strong>Total:</strong> {formatQAR(o.total)}</p>
              <p><strong>Delivery:</strong> {o.delivery.zone}, {o.delivery.street}, Bldg {o.delivery.building}, {o.delivery.area}</p>
              <p><strong>Payment:</strong> {o.payment === "cash" ? "Cash on Delivery" : "Card"} ({maskCard(o.card)})</p>

              {/* Order status dropdown */}
              <div style={{ marginTop: ".5rem" }}>
                <label>
                  <strong>Status:</strong>
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    style={{ marginLeft: "0.5rem" }}
                    disabled={o.status === "rejected"}
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </label>
              </div>

              {/* Rejection reason display */}
              {o.status === "rejected" && o.adminComment && (
                <div style={{ color: "red", fontWeight: "bold", marginTop: ".5rem" }}>
                  <p>ORDER REJECTED</p>
                  <p>REASON: {o.adminComment}</p>
                </div>
              )}

              {/* Reject button for active orders */}
              {o.status !== "rejected" && o.status !== "done" && (
                <div className="row" style={{ gap: ".5rem", marginTop: ".5rem" }}>
                  <button className="btn danger" onClick={() => openRejectModal(o.id)}>Reject Order</button>
                </div>
              )}

              {/* Bill generation for completed orders */}
              {o.status === "done" && (
                <div className="row" style={{ gap: ".5rem", marginTop: ".5rem" }}>
                  <button className="btn" onClick={() => generateBill(o)}>Generate Bill</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Rejection modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal" style={{ background: "var(--card)", color: "var(--text)", padding: "1.5rem", borderRadius: "10px", maxWidth: "500px", margin: "auto" }}>
            <h3>Reject Order</h3>
            <textarea
              placeholder="Enter rejection reason (required)..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
              style={{ width: "100%", marginBottom: "1rem", backgroundColor: "var(--card-alt)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: "8px", padding: "0.8rem" }}
            />
            <div className="row" style={{ justifyContent: "flex-end", gap: "0.5rem" }}>
              <button className="btn" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn danger" onClick={confirmReject} disabled={!comment.trim()}>Confirm Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}