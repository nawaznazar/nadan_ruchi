import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { formatQAR } from "../utils/currency.js";

// Status options excluding 'rejected' (cannot select manually)
const statusOptions = ["pending", "preparing", "ready", "on the way", "done", "cancelled"];

export default function AdminOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [rejectId, setRejectId] = useState(null);
  const [comment, setComment] = useState("");

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

  // Update order status (excluding rejected, cannot manually select rejected)
  const updateStatus = (id, status) => {
    const all = JSON.parse(localStorage.getItem("nr_orders") || "[]");
    const updated = all.map((o) =>
      o.id === id ? { ...o, status, ...(status !== "rejected" && { adminComment: "" }) } : o
    );
    localStorage.setItem("nr_orders", JSON.stringify(updated));
    setOrders(updated);
  };

  // Open Reject Modal and set status to rejected immediately
  const openRejectModal = (id) => {
    setRejectId(id);
    setComment("");
    // Automatically mark as rejected in the order list
    const all = JSON.parse(localStorage.getItem("nr_orders") || "[]");
    const updated = all.map((o) =>
      o.id === id ? { ...o, status: "rejected" } : o
    );
    localStorage.setItem("nr_orders", JSON.stringify(updated));
    setOrders(updated);
    setShowModal(true);
  };

  // Confirm rejection (save admin comment)
  const confirmReject = () => {
    if (!rejectId || !comment.trim()) return;
    const all = JSON.parse(localStorage.getItem("nr_orders") || "[]");
    const updated = all.map((o) =>
      o.id === rejectId ? { ...o, adminComment: comment.trim() } : o
    );
    localStorage.setItem("nr_orders", JSON.stringify(updated));
    setOrders(updated);
    setShowModal(false);
    setRejectId(null);
    setComment("");
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
              <div key={o.id} className="card order-card">
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
                  <strong>Delivery:</strong> {o.delivery.zone}, {o.delivery.street}, Bldg {o.delivery.building}, {o.delivery.area}
                </p>
                <p><strong>Payment:</strong> {o.payment === "cash" ? "Cash on Delivery" : "Card"}</p>

                <div style={{ marginTop: ".5rem" }}>
                  <label>
                    <strong>Status:</strong>{" "}
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      style={{ marginLeft: "0.5rem" }}
                      disabled={o.status === "rejected"} // cannot manually change rejected
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {/* Display rejection comment in the new format */}
                {o.status === "rejected" && o.adminComment && (
                  <div style={{ color: "red", fontWeight: "bold", marginTop: "0.5rem" }}>
                    <p>ORDER REJECTED</p>
                    <p>REASON :- {o.adminComment}</p>
                  </div>
                )}

                {/* Show Reject button only if comment not yet provided */}
                {!o.adminComment && o.status !== "rejected" && (
                  <div className="row" style={{ gap: ".5rem", marginTop: ".5rem" }}>
                    <button className="btn danger" onClick={() => openRejectModal(o.id)}>
                      Reject Order
                    </button>
                  </div>
                )}
              </div>
            ))}
        </div>
      )}

      {/* Reject Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div
            className="modal"
            style={{
              backgroundColor:
                document.documentElement.getAttribute("data-theme") === "dark"
                  ? "#1f1f1f"
                  : "#fff",
              color:
                document.documentElement.getAttribute("data-theme") === "dark"
                  ? "#fff"
                  : "#000",
              padding: "1.5rem",
              borderRadius: "10px",
              maxWidth: "500px",
              margin: "auto",
            }}
          >
            <h3>Reject Order</h3>
            <textarea
              placeholder="Enter rejection comment (mandatory)..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
              style={{
                width: "100%",
                marginBottom: "1rem",
                backgroundColor:
                  document.documentElement.getAttribute("data-theme") === "dark"
                    ? "#2c2c2c"
                    : "#f5f5f5",
                color:
                  document.documentElement.getAttribute("data-theme") === "dark"
                    ? "#fff"
                    : "#000",
                border: `1px solid ${
                  document.documentElement.getAttribute("data-theme") === "dark"
                    ? "#555"
                    : "#ccc"
                }`,
                borderRadius: "8px",
                padding: "0.8rem",
              }}
            />
            <div className="row" style={{ justifyContent: "flex-end", gap: "0.5rem" }}>
              <button className="btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button
                className="btn danger"
                onClick={confirmReject}
                disabled={!comment.trim()} // disable if empty
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
