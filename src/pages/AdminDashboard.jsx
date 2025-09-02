import React, { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { MENU } from "../data/menu.js";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "nr_admin_menu";

function useAdminMenu() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : MENU;
  });

  const persist = (next) => {
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const upsert = (item) => {
    const idx = items.findIndex((x) => x.id === item.id);
    if (idx >= 0) persist(items.map((x, i) => (i === idx ? item : x)));
    else persist([...items, item]);
  };

  const del = (id) => persist(items.filter((x) => x.id !== id));

  return { items, upsert, del };
}

const generateId = () => "item-" + Date.now();

export default function AdminDashboard() {
  const { user } = useAuth();
  const { items, upsert, del } = useAdminMenu();
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  const filtered = useMemo(
    () =>
      items.filter(
        (i) =>
          !search ||
          i.name.toLowerCase().includes(search.toLowerCase()) ||
          i.category.toLowerCase().includes(search.toLowerCase())
      ),
    [items, search]
  );

  if (user?.role !== "admin") return null;

  const handleEditClick = (item) => setEditingId(item.id);
  const handleCancel = () => setEditingId(null);
  const handleSave = (updatedItem) => {
    upsert({ ...updatedItem, price: Number(updatedItem.price) });
    setEditingId(null);
    setMsg("Item saved successfully!");
  };
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      del(id);
      setMsg("Item deleted.");
    }
  };

  const resetAppData = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all app data? This will clear menu, orders, reviews, highlights, and registered users."
      )
    ) {
      const keys = [
        "nr_admin_menu",
        "nr_orders",
        "nr_reviews",
        "nr_highlights",
        "nr_registered_users",
      ];
      keys.forEach((k) => localStorage.removeItem(k));
      setMsg("All app data has been reset!");
      window.location.reload();
    }
  };

  return (
    <div className="container">
      <h2>Admin — Manage Menu</h2>
      {msg && <div className="alert">{msg}</div>}

      <button
        className="btn outline"
        style={{ marginBottom: "1rem" }}
        onClick={() => navigate("/admin/orders")}
      >
        📦 View All Orders
      </button>

      <div className="row" style={{ marginBottom: "1rem" }}>
        <input
          placeholder="Search items…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Add New Item Card */}
      {editingId === "new" ? (
        <InlineEditForm
          item={{
            id: "",
            name: "",
            category: "Breakfast",
            price: 0,
            veg: true,
            spicy: 0,
            img: "",
            desc: "",
            highlight: false,
          }}
          onCancel={() => setEditingId(null)}
          onSave={(item) => handleSave({ ...item, id: generateId() })}
        />
      ) : (
        <div className="card" style={{ marginBottom: "1rem" }}>
          <button className="btn outline" onClick={() => setEditingId("new")}>
            ➕ Add New Item
          </button>
        </div>
      )}

      {/* Existing Items */}
      <div className="grid">
        {filtered.map((item) => (
          <div key={item.id} className="card">
            <strong>{item.name}</strong>
            <div className="muted">
              {item.category} • {item.veg ? "Veg" : "Non-veg"}
            </div>
            {item.spicy > 0 && (
              <div style={{ color: "tomato" }}>Spicy Level: {item.spicy}</div>
            )}
            {item.highlight && <span className="tag primary">Today’s Highlight</span>}
            {item.img && (
              <img
                src={item.img}
                alt={item.name}
                style={{
                  width: "200px",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "0.5rem",
                  marginTop: "0.5rem",
                }}
              />
            )}

            <div className="row" style={{ marginTop: ".6rem" }}>
              <button className="btn outline" onClick={() => handleEditClick(item)}>
                Edit
              </button>
              <button className="btn outline" onClick={() => handleDelete(item.id)}>
                Delete
              </button>
            </div>

            {editingId === item.id && (
              <InlineEditForm item={item} onCancel={handleCancel} onSave={handleSave} />
            )}
          </div>
        ))}
      </div>

      {/* Reset App Data */}
      <div className="card reset-card" style={{ marginTop: "2rem" }}>
        <h3>⚠️ Settings</h3>
        <p>Reset all app data (menu, orders, reviews, highlights, users).</p>
        <button className="btn outline" onClick={resetAppData}>
          Reset App Data
        </button>
      </div>
    </div>
  );
}

// Inline Add/Edit Form with Today's Highlight Toggle
function InlineEditForm({ item, onCancel, onSave }) {
  const [form, setForm] = useState(item);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm({ ...form, img: ev.target.result });
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) return alert("Name is required");
    if (form.price <= 0) return alert("Price must be greater than 0");
    onSave(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ marginTop: "1rem", borderTop: "1px solid #ccc", paddingTop: "1rem" }}
    >
      <div
        className="grid"
        style={{ gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "1rem" }}
      >
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Name"
          required
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option>Breakfast</option>
          <option>Lunch</option>
          <option>Evening Snacks</option>
          <option>Dinner</option>
        </select>
        <input
          type="number"
          step="0.01"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          placeholder="Price"
          required
        />
        <select
          value={form.veg ? "true" : "false"}
          onChange={(e) => setForm({ ...form, veg: e.target.value === "true" })}
        >
          <option value="true">Veg</option>
          <option value="false">Non-veg</option>
        </select>
        <select
          value={form.spicy}
          onChange={(e) => setForm({ ...form, spicy: Number(e.target.value) })}
        >
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <input
          value={form.img}
          onChange={(e) => setForm({ ...form, img: e.target.value })}
          placeholder="Image URL"
        />
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <input
          value={form.desc}
          onChange={(e) => setForm({ ...form, desc: e.target.value })}
          placeholder="Description"
        />

        {/* Today's Highlight Toggle */}
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={form.highlight}
            onChange={(e) => setForm({ ...form, highlight: e.target.checked })}
          />
          <span className="slider"></span>
          Today’s Highlight
        </label>
      </div>

      <div className="row" style={{ marginTop: "0.5rem" }}>
        <button className="btn" type="submit">
          Save
        </button>
        <button className="btn outline" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
