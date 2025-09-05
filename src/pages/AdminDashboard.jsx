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
  const [resetMsg, setResetMsg] = useState(null);
  const [saveMsg, setSaveMsg] = useState(null);
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

  const handleEditClick = (itemId) => setEditingId(itemId);
  const handleSave = (updatedItem) => {
    upsert({
      ...updatedItem,
      price: Number(updatedItem.price),
      spicy: updatedItem.spicy === "" ? 0 : Number(updatedItem.spicy),
    });
    setEditingId(null);
    setSaveMsg(`✅ ${updatedItem.name} saved!`);
    setTimeout(() => setSaveMsg(null), 2500);
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
      setResetMsg("⚠️ All app data has been reset!");
      setTimeout(() => setResetMsg(null), 3500);
      window.location.reload();
    }
  };

  return (
    <div
      className="container"
      style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
    >
      {/* ================= TOAST ================= */}
      {saveMsg && (
        <div
          style={{
            position: "fixed",
            top: "1rem",
            right: "1rem",
            backgroundColor: "var(--success-bg, #4BB543)",
            color: "var(--success-text, white)",
            padding: "0.6rem 1rem",
            borderRadius: "6px",
            fontSize: "0.9rem",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            zIndex: 9999,
            animation: "fadeinout 2.5s forwards",
          }}
        >
          {saveMsg}
        </div>
      )}

      {/* ================= VIEW ALL ORDERS SECTION ================= */}
      <section>
        <h2>📦 View All Orders</h2>
        <button
          className="btn outline"
          style={{ marginBottom: "1rem" }}
          onClick={() => navigate("/admin/orders")}
        >
          Go to Orders
        </button>
      </section>

      {/* ================= MANAGE MENU SECTION ================= */}
      <section>
        <h2>🍴 Manage Menu</h2>

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
              price: "",
              veg: true,
              spicy: "",
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
        <div className="grid" style={{ gap: "1rem" }}>
          {filtered.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onEdit={handleEditClick}
              onDelete={del}
              onSave={handleSave}
              isEditing={editingId === item.id}
            />
          ))}
        </div>
      </section>

      {/* ================= RESET APP DATA SECTION ================= */}
      <section>
        <h2>⚠️ Settings</h2>

        <div className="card" style={{ marginTop: "0.5rem", padding: "1rem" }}>
          <p style={{ marginBottom: "0.8rem" }}>
            Reset all app data (menu, orders, reviews, highlights, users).
          </p>

          <button className="btn outline" onClick={resetAppData}>
            Reset App Data
          </button>

          {resetMsg && (
            <div
              style={{
                marginTop: "0.8rem",
                backgroundColor: "var(--warning-bg, #e67e22)",
                color: "var(--warning-text, #fff)",
                padding: "0.5rem 0.9rem",
                borderRadius: "5px",
                fontSize: "0.85rem",
                display: "inline-block",
                animation: "fadeinout 3.5s forwards",
              }}
            >
              {resetMsg}
            </div>
          )}
        </div>
      </section>

      <style>{`
        @keyframes fadeinout {
          0% { opacity: 0; transform: translateY(-10px);}
          10% { opacity: 1; transform: translateY(0);}
          90% { opacity: 1; transform: translateY(0);}
          100% { opacity: 0; transform: translateY(-10px);}
        }
      `}</style>
    </div>
  );
}

// ================== ITEM CARD COMPONENT ==================
function ItemCard({ item, onEdit, onDelete, isEditing, onSave }) {
  return (
    <div className="card" style={{ padding: "1rem", position: "relative" }}>
      <strong>{item.name}</strong>
      <div className="muted">
        {item.category} • {item.veg ? "Veg" : "Non-veg"}
      </div>
      {item.spicy > 0 && (
        <div style={{ color: "tomato" }}>Spicy Level: {item.spicy}</div>
      )}
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
      {item.highlight && (
        <div style={{ marginTop: "0.5rem" }}>
          <span className="tag primary">Today’s Highlight</span>
        </div>
      )}

      <div className="row" style={{ marginTop: ".6rem" }}>
        <button className="btn outline" onClick={() => onEdit(item.id)}>
          Edit
        </button>
        <button className="btn outline" onClick={() => onDelete(item.id)}>
          Delete
        </button>
      </div>

      {isEditing && (
        <InlineEditForm
          item={item}
          onCancel={() => onEdit(null)}
          onSave={onSave}
        />
      )}
    </div>
  );
}

// ================== INLINE ADD/EDIT FORM ==================
function InlineEditForm({ item, onCancel, onSave }) {
  const [form, setForm] = useState(item);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) return alert("Name is required");
    if (!form.price || Number(form.price) <= 0)
      return alert("Price must be greater than 0");

    onSave({
      ...form,
      price: Number(form.price),
      spicy: form.spicy === "" ? 0 : Number(form.spicy),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginTop: "1rem",
        borderTop: "1px solid #ccc",
        paddingTop: "1rem",
      }}
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
          gap: "1rem",
        }}
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
          value={form.spicy}
          onChange={(e) => setForm({ ...form, spicy: e.target.value })}
        >
          <option value="">Select Spicy Level</option>
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <select
          value={form.veg ? "true" : "false"}
          onChange={(e) =>
            setForm({ ...form, veg: e.target.value === "true" })
          }
        >
          <option value="true">Veg</option>
          <option value="false">Non-veg</option>
        </select>
        <input
          value={form.img}
          onChange={(e) => setForm({ ...form, img: e.target.value })}
          placeholder="Image URL"
        />
        <input
          value={form.desc}
          onChange={(e) => setForm({ ...form, desc: e.target.value })}
          placeholder="Description"
        />
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={form.highlight}
            onChange={(e) =>
              setForm({ ...form, highlight: e.target.checked })
            }
          />
          <span className="slider"></span>
          Today’s Highlight
        </label>
      </div>

      <div className="row" style={{ marginTop: "0.5rem", gap: "0.5rem" }}>
        <button className="btn" type="submit">
          Save Changes
        </button>
        <button className="btn outline" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
