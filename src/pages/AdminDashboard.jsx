import React, { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { MENU } from "../data/menu.js";
import { useNavigate } from "react-router-dom";

// Local storage keys for persistent data
const STORAGE_KEY = "nr_admin_menu";
const USERS_KEY = "nr_registered_users";
const FEEDBACK_KEY = "nr_feedbacks";

// ================= MENU HOOK =================
function useAdminMenu() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : MENU;
  });

  // Helper function to update state and persist to localStorage
  const persist = (next) => {
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  // Update existing item or add new item to menu
  const upsert = (item) => {
    const idx = items.findIndex((x) => x.id === item.id);
    if (idx >= 0) persist(items.map((x, i) => (i === idx ? item : x)));
    else persist([...items, item]);
  };

  // Remove item from menu by ID
  const del = (id) => persist(items.filter((x) => x.id !== id));

  return { items, upsert, del };
}

// ================= USERS HOOK =================
function useAdminUsers(defaultUsers) {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem(USERS_KEY);
    return saved ? JSON.parse(saved) : defaultUsers;
  });

  // Helper function to update state and persist to localStorage
  const persist = (next) => {
    setUsers(next);
    localStorage.setItem(USERS_KEY, JSON.stringify(next));
  };

  // Update existing user or add new user
  const upsert = (user) => {
    const idx = users.findIndex((x) => x.email === user.email);
    if (idx >= 0) persist(users.map((x, i) => (i === idx ? user : x)));
    else persist([...users, user]);
  };

  // Remove user by email
  const del = (email) => persist(users.filter((x) => x.email !== email));

  return { users, upsert, del };
}

// Generate unique ID for new menu items
const generateId = () => "id-" + Date.now();

// ================= ADMIN DASHBOARD =================
export default function AdminDashboard() {
  const { user } = useAuth();
  const { items, upsert, del } = useAdminMenu();
  const { users, upsert: upsertUser, del: delUser } = useAdminUsers([
    { email: "admin@nadanruchi.qa", role: "admin", name: "Admin" },
    { email: "arun@yopmail.com", role: "customer", name: "Arun" },
    { email: "shobin@yopmail.com", role: "customer", name: "Shobin" },
    { email: "nazriya@yopmail.com", role: "customer", name: "Nazriya" },
  ]);

  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [saveMsg, setSaveMsg] = useState(null);
  const [resetMsg, setResetMsg] = useState(null);
  const navigate = useNavigate();

  // Filter menu items based on search query
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

  // Restrict access to admin users only
  if (user?.role !== "admin") return null;

  // Save menu item with proper data formatting
  const handleSave = (updatedItem) => {
    const itemToSave = {
      ...updatedItem,
      price: Number(updatedItem.price),
      spicy: updatedItem.spicy === "" ? 0 : Number(updatedItem.spicy),
      unavailable: !!updatedItem.unavailable,
      highlight: updatedItem.unavailable ? false : updatedItem.highlight,
    };
    upsert(itemToSave);
    window.dispatchEvent(new Event("menu-updated"));
    setEditingId(null);
    setSaveMsg(`✅ ${itemToSave.name} saved!`);
    setTimeout(() => setSaveMsg(null), 2500);
  };

  // Save user profile changes
  const handleSaveUser = (updatedUser) => {
    upsertUser(updatedUser);
    setEditingUser(null);
    setSaveMsg(`✅ ${updatedUser.name}'s profile saved!`);
    setTimeout(() => setSaveMsg(null), 2500);
  };

  // Reset all application data with confirmation
  const resetAppData = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all app data? This will clear menu, orders, reviews, highlights, users, feedbacks."
      )
    ) {
      const keys = [
        "nr_admin_menu",
        "nr_orders",
        "nr_reviews",
        "nr_highlights",
        "nr_registered_users",
        "nr_feedbacks",
      ];
      keys.forEach((k) => localStorage.removeItem(k));
      setResetMsg("⚠️ All app data has been reset!");
      setTimeout(() => setResetMsg(null), 3500);
      window.location.reload();
    }
  };

  return (
    <div className="container" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {saveMsg && <div className="popup success">{saveMsg}</div>}

      {/* Orders & Money Management Section */}
      <section>
        <h2>📦 View Orders & 💰 Money Management</h2>
        <div className="row" style={{ gap: "1rem", marginBottom: "1rem" }}>
          <button className="btn outline" onClick={() => navigate("/admin/orders")}>
            Go to Orders
          </button>
          <button className="btn outline" onClick={() => navigate("/admin/money")}>
            💰 Money Management
          </button>
        </div>
      </section>

      {/* User Management Section */}
      <section>
        <h2>👥 Manage Profiles</h2>
        <div className="grid" style={{ gap: "1rem" }}>
          {users.map((u) => (
            <div key={u.email} className="card" style={{ padding: "1rem" }}>
              <strong>{u.name}</strong>
              <div className="muted">{u.email}</div>
              <div className="muted">Role: {u.role}</div>
              <div className="row" style={{ marginTop: "0.5rem" }}>
                <button className="btn outline" onClick={() => setEditingUser(u.email)}>Edit</button>
                {u.role !== "admin" && (
                  <button className="btn outline" onClick={() => delUser(u.email)}>Delete</button>
                )}
              </div>
              {editingUser === u.email && (
                <UserEditForm
                  user={u}
                  onCancel={() => setEditingUser(null)}
                  onSave={handleSaveUser}
                />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Menu Management Section */}
      <section>
        <h2>🍴 Manage Menu</h2>
        <div className="row" style={{ marginBottom: "1rem" }}>
          <input placeholder="Search items…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {/* Add New Item Form */}
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
              unavailable: false,
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

        {/* Menu Items Grid */}
        <div className="grid" style={{ gap: "1rem" }}>
          {filtered.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onEdit={setEditingId}
              onDelete={del}
              onSave={handleSave}
              isEditing={editingId === item.id}
            />
          ))}
        </div>
      </section>

      {/* Feedback Section */}
      <section>
        <h2>💬 User Feedbacks</h2>
        <FeedbackList />
      </section>

      {/* Settings Section */}
      <section>
        <h2>⚠️ Settings</h2>
        <div className="card" style={{ marginTop: "0.5rem", padding: "1rem" }}>
          <p style={{ marginBottom: "0.8rem" }}>
            Reset all app data (menu, orders, reviews, highlights, users, feedbacks).
          </p>
          <button className="btn outline" onClick={resetAppData}>
            Reset App Data
          </button>
          {resetMsg && <div className="popup warning">{resetMsg}</div>}
        </div>
      </section>

      {/* Popup notification styles */}
      <style>{`
        .popup {
          position: fixed;
          top: 1rem;
          right: 1rem;
          padding: 0.6rem 1rem;
          border-radius: 6px;
          font-size: 0.9rem;
          z-index: 9999;
          animation: fadeinout 2.5s forwards;
        }
        .popup.success { background: #4BB543; color: white; }
        .popup.warning { background: #e67e22; color: white; }
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

// ================== USER EDIT FORM ==================
function UserEditForm({ user, onCancel, onSave }) {
  const [form, setForm] = useState(user);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email) return alert("Email is required");
    if (!form.name) return alert("Name is required");
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" />
      <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" />
      <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
        <option value="customer">Customer</option>
        <option value="admin">Admin</option>
      </select>
      <div className="row" style={{ marginTop: "0.5rem" }}>
        <button className="btn" type="submit">Save</button>
        <button className="btn outline" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

// ================== ITEM CARD ==================
function ItemCard({ item, onEdit, onDelete, isEditing, onSave }) {
  const isUnavailable = item.unavailable;

  return (
    <div className="card" style={{ padding: "1rem", position: "relative", opacity: isUnavailable ? 0.5 : 1, filter: isUnavailable ? "grayscale(70%)" : "none" }}>
      {/* Unavailable indicator badge */}
      {isUnavailable && (
        <span style={{ position: "absolute", top: "0.5rem", right: "0.5rem", background: "red", color: "white", fontSize: "0.7rem", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
          Unavailable
        </span>
      )}

      <strong>{item.name}</strong>
      <div className="muted">{item.category} • {item.veg ? "Veg" : "Non-veg"}</div>
      {item.spicy > 0 && <div style={{ color: "tomato" }}>Spicy Level: {item.spicy}</div>}
      {item.img && <img src={item.img} alt={item.name} style={{ width: "200px", height: "150px", objectFit: "cover", borderRadius: "0.5rem", marginTop: "0.5rem" }} />}
      {item.highlight && !isUnavailable && <div style={{ marginTop: "0.5rem" }}><span className="tag primary">Today's Highlight</span></div>}

      <div className="row" style={{ marginTop: ".6rem" }}>
        <button className="btn outline" onClick={() => onEdit(item.id)}>Edit</button>
        <button className="btn outline" onClick={() => onDelete(item.id)}>Delete</button>
      </div>

      {/* Show edit form when this item is being edited */}
      {isEditing && <InlineEditForm item={item} onCancel={() => onEdit(null)} onSave={onSave} />}
    </div>
  );
}

// ================== INLINE EDIT FORM ==================
function InlineEditForm({ item, onCancel, onSave }) {
  const [form, setForm] = useState(item);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) return alert("Name is required");
    if (!form.price || Number(form.price) <= 0) return alert("Price must be greater than 0");
    onSave({
      ...form,
      price: Number(form.price),
      spicy: form.spicy === "" ? 0 : Number(form.spicy),
      unavailable: !!form.unavailable,
      highlight: form.unavailable ? false : form.highlight,
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "1rem", borderTop: "1px solid #ccc", paddingTop: "1rem" }}>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "1rem" }}>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" required />
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          <option>Breakfast</option>
          <option>Lunch</option>
          <option>Evening Snacks</option>
          <option>Dinner</option>
        </select>
        <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Price" required />
        <select value={form.spicy} onChange={(e) => setForm({ ...form, spicy: e.target.value })}>
          <option value="">Select Spicy Level</option>
          {[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <select value={form.veg ? "true" : "false"} onChange={(e) => setForm({ ...form, veg: e.target.value === "true" })}>
          <option value="true">Veg</option>
          <option value="false">Non-veg</option>
        </select>
        <input value={form.img} onChange={(e) => setForm({ ...form, img: e.target.value })} placeholder="Image URL" />
        <input value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} placeholder="Description" />
      </div>

      <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
        <label className="toggle-label">
          <input type="checkbox" checked={form.highlight && !form.unavailable} disabled={form.unavailable} onChange={(e) => setForm({ ...form, highlight: e.target.checked })} />
          <span className="slider"></span>
          Today's Highlight
        </label>
        <label className="toggle-label">
          <input type="checkbox" checked={form.unavailable || false} onChange={(e) => setForm({ ...form, unavailable: e.target.checked, highlight: e.target.checked ? false : form.highlight })} />
          <span className="slider"></span>
          Mark Unavailable
        </label>
      </div>

      <div className="row" style={{ marginTop: "0.5rem", gap: "0.5rem" }}>
        <button className="btn" type="submit">Save Changes</button>
        <button className="btn outline" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

// ================== FEEDBACK LIST ==================
function FeedbackList() {
  const [feedbacks, setFeedbacks] = React.useState(() => {
    return JSON.parse(localStorage.getItem(FEEDBACK_KEY) || "[]");
  });

  // Delete feedback with confirmation
  const deleteFeedback = (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;
    const updated = feedbacks.filter(f => f.id !== id);
    setFeedbacks(updated);
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(updated));
  };

  if (feedbacks.length === 0) {
    return <p className="muted">No feedbacks submitted yet.</p>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-4 mt-2">
      {feedbacks
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map((f) => (
        <div key={f.id} className="card p-4 shadow-lg rounded-xl bg-white hover:shadow-2xl transition duration-300">
          <div className="flex justify-between items-start mb-2">
            <div>
              <strong className="text-lg">{f.name}</strong>
              <div className="muted text-sm">{f.email}</div>
              {f.contactNumber && <div className="muted text-sm">📞 {f.contactNumber}</div>}
              <div className="muted text-sm">{new Date(f.date).toLocaleString()}</div>
            </div>
            <div className="flex gap-2">
              <button
                className="btn outline text-red-500 text-sm"
                onClick={() => deleteFeedback(f.id)}
              >
                Delete
              </button>
              <a
                className="btn outline text-blue-500 text-sm"
                href={`mailto:${f.email}?subject=Re: ${encodeURIComponent(f.subject)}&body=${encodeURIComponent(`Hello ${f.name},\n\n`)}`}
              >
                Reply
              </a>
            </div>
          </div>
          <div className="mt-2">
            <strong>Subject:</strong> {f.subject}
          </div>
          <div className="mt-1">
            <strong>Message:</strong>
            <p className="mt-1">{f.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}