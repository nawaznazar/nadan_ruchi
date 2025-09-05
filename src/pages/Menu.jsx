import React, { useMemo, useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { formatQAR } from "../utils/currency.js";
import { useNavigate } from "react-router-dom";

export default function Menu() {
  const { items: cartItems, add, updateQty, remove } = useCart();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const navigate = useNavigate();

  // Get menu items from localStorage
  const menuItems = useMemo(() => {
    const saved = localStorage.getItem("nr_admin_menu");
    return saved ? JSON.parse(saved) : [];
  }, []);

  const getCartItem = (id) => cartItems.find((i) => i.id === id);

  // Today's highlights
  const highlights = useMemo(() => menuItems.filter((i) => i.highlight), [menuItems]);

  // Filtered menu items
  const filtered = menuItems.filter(
    (i) =>
      (category === "All" || i.category === category) &&
      (i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.category.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="container">
      <h2>🍴 Our Menu</h2>

      {/* Today's Highlights */}
      {highlights.length > 0 && (
        <section style={{ marginBottom: "2rem" }}>
          <h3>🔥 Today's Highlights</h3>
          <div className="grid" style={{ gap: "1rem", marginTop: "0.5rem" }}>
            {highlights.map((item) => {
              const cartItem = getCartItem(item.id);
              return (
                <div key={item.id} className="card hover-card" style={{ padding: "1rem", position: "relative" }}>
                  {item.img && (
                    <div style={{ position: "relative" }}>
                      <img
                        src={item.img}
                        alt={item.name}
                        style={{
                          width: "100%",
                          height: "160px",
                          objectFit: "cover",
                          borderRadius: "0.5rem",
                          marginBottom: "0.5rem",
                        }}
                      />
                      <span
                        style={{
                          position: "absolute",
                          top: "0.5rem",
                          left: "0.5rem",
                          background: "#ef4444",
                          color: "#fff",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "0.3rem",
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                        }}
                      >
                        🔥 Today's Highlight
                      </span>
                    </div>
                  )}
                  <strong>{item.name}</strong>
                  <div className="muted">{item.category} • {item.veg ? "Veg" : "Non-veg"}</div>
                  {item.spicy > 0 && <div style={{ color: "tomato" }}>🌶 Spicy Level: {item.spicy}</div>}
                  <p style={{ marginTop: "0.5rem" }}>{item.desc}</p>
                  <div style={{ marginTop: "0.5rem", fontWeight: "bold" }}>{formatQAR(item.price)}</div>

                  {/* Cart Controls */}
                  <div className="row" style={{ marginTop: "0.6rem", gap: "0.3rem" }}>
                    {!cartItem ? (
                      <button className="btn" onClick={() => add({ ...item, qty: 1 })}>
                        ➕ Add to Cart
                      </button>
                    ) : (
                      <>
                        <div className="row" style={{ gap: "0.3rem", alignItems: "center" }}>
                          <button
                            className="btn outline"
                            onClick={() =>
                              cartItem.qty > 1
                                ? updateQty(item.id, cartItem.qty - 1)
                                : remove(item.id)
                            }
                          >
                            -
                          </button>
                          <span style={{ minWidth: 28, textAlign: "center" }}>{cartItem.qty}</span>
                          <button
                            className="btn outline"
                            onClick={() => updateQty(item.id, cartItem.qty + 1)}
                          >
                            +
                          </button>
                        </div>
                        <button
                          className="btn btn-primary"
                          onClick={() => navigate("/cart")}
                          style={{ marginLeft: "0.5rem" }}
                        >
                          Go to Cart
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Filters */}
      <div className="row" style={{ marginBottom: "1rem", gap: "0.5rem" }}>
        <input
          placeholder="Search items…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="All">All Categories</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Evening Snacks">Evening Snacks</option>
          <option value="Dinner">Dinner</option>
        </select>
      </div>

      {/* Menu Grid */}
      <div className="grid" style={{ gap: "1rem" }}>
        {filtered.map((item) => {
          const cartItem = getCartItem(item.id);
          return (
            <div key={item.id} className="card" style={{ padding: "1rem" }}>
              <strong>{item.name}</strong>
              <div className="muted">{item.category} • {item.veg ? "Veg" : "Non-veg"}</div>
              {item.spicy > 0 && <div style={{ color: "tomato" }}>🌶 Spicy Level: {item.spicy}</div>}
              {item.img && (
                <img
                  src={item.img}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "160px",
                    objectFit: "cover",
                    borderRadius: "0.5rem",
                    marginTop: "0.5rem",
                  }}
                />
              )}
              <p style={{ marginTop: "0.5rem" }}>{item.desc}</p>
              <div style={{ marginTop: "0.5rem", fontWeight: "bold" }}>{formatQAR(item.price)}</div>

              {/* Cart Controls */}
              <div className="row" style={{ marginTop: "0.6rem", gap: "0.3rem" }}>
                {!cartItem ? (
                  <button className="btn" onClick={() => add({ ...item, qty: 1 })}>
                    ➕ Add to Cart
                  </button>
                ) : (
                  <>
                    <div className="row" style={{ gap: "0.3rem", alignItems: "center" }}>
                      <button
                        className="btn outline"
                        onClick={() =>
                          cartItem.qty > 1
                            ? updateQty(item.id, cartItem.qty - 1)
                            : remove(item.id)
                        }
                      >
                        -
                      </button>
                      <span style={{ minWidth: 28, textAlign: "center" }}>{cartItem.qty}</span>
                      <button
                        className="btn outline"
                        onClick={() => updateQty(item.id, cartItem.qty + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate("/cart")}
                      style={{ marginLeft: "0.5rem" }}
                    >
                      Go to Cart
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
