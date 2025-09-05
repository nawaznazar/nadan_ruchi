import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext.jsx";
import { formatQAR } from "../utils/currency.js";
import { useNavigate } from "react-router-dom";
import { MENU, CATEGORIES } from "../data/menu.js"; // ✅ Static menu

const STORAGE_KEY = "nr_admin_menu";

export default function Menu() {
  const { items: cartItems, add, updateQty, remove } = useCart();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [dynamicMenu, setDynamicMenu] = useState([]); // Admin items
  const [highlights, setHighlights] = useState([]); // Today's highlights
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    setDynamicMenu(stored);
    setHighlights(stored.filter((item) => item.highlight));
  }, []);

  const getCartItem = (id) => cartItems.find((i) => i.id === id);

  // ✅ Combine static + admin items, remove duplicates
  const fullMenu = [
    ...MENU,
    ...dynamicMenu.filter(
      (item) => !MENU.some((m) => m.id === item.id || m.name === item.name)
    ),
  ];

  // ✅ Apply filters
  const filtered = fullMenu.filter(
    (i) =>
      (category === "All" || i.category === category) &&
      (i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.category.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="container">
      <h2>🍴 Our Menu</h2>

      {/* ================= TODAY'S HIGHLIGHTS ================= */}
      {highlights.length > 0 && (
        <section style={{ marginBottom: "2rem" }}>
          <h3>🔥 Today’s Highlights</h3>
          <div className="grid" style={{ gap: "1rem", marginTop: "0.8rem" }}>
            {highlights.map((item) => {
              const cartItem = getCartItem(item.id);
              return (
                <div
                  key={item.id}
                  className="card"
                  style={{
                    padding: "1rem",
                    border: "2px solid #f97316",
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: "0.5rem",
                      right: "0.5rem",
                      background: "#f97316",
                      color: "white",
                      fontSize: "0.7rem",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "4px",
                    }}
                  >
                    Highlight
                  </span>
                  <strong>{item.name}</strong>
                  <div className="muted">
                    {item.category} • {item.veg ? "Veg" : "Non-veg"}
                  </div>
                  {item.spicy > 0 && (
                    <div style={{ color: "tomato" }}>
                      🌶 Spicy Level: {item.spicy}
                    </div>
                  )}
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
                  <div style={{ marginTop: "0.5rem", fontWeight: "bold" }}>
                    {formatQAR(item.price)}
                  </div>

                  {/* Cart Controls */}
                  <div
                    className="row"
                    style={{ marginTop: "0.6rem", gap: "0.3rem" }}
                  >
                    {!cartItem ? (
                      <button
                        className="btn"
                        onClick={() => add({ ...item, qty: 1 })}
                      >
                        ➕ Add to Cart
                      </button>
                    ) : (
                      <>
                        <div
                          className="row"
                          style={{ gap: "0.3rem", alignItems: "center" }}
                        >
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
                          <span style={{ minWidth: 28, textAlign: "center" }}>
                            {cartItem.qty}
                          </span>
                          <button
                            className="btn outline"
                            onClick={() =>
                              updateQty(item.id, cartItem.qty + 1)
                            }
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

      {/* ================= FILTERS ================= */}
      <div className="row" style={{ marginBottom: "1rem", gap: "0.5rem" }}>
        <input
          placeholder="Search items…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="All">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* ================= MENU GRID ================= */}
      <div className="grid" style={{ gap: "1rem" }}>
        {filtered.map((item) => {
          const cartItem = getCartItem(item.id);
          return (
            <div key={item.id} className="card" style={{ padding: "1rem" }}>
              <strong>{item.name}</strong>
              <div className="muted">
                {item.category} • {item.veg ? "Veg" : "Non-veg"}
              </div>
              {item.spicy > 0 && (
                <div style={{ color: "tomato" }}>
                  🌶 Spicy Level: {item.spicy}
                </div>
              )}
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
              <div style={{ marginTop: "0.5rem", fontWeight: "bold" }}>
                {formatQAR(item.price)}
              </div>

              {/* Cart Controls */}
              <div
                className="row"
                style={{ marginTop: "0.6rem", gap: "0.3rem" }}
              >
                {!cartItem ? (
                  <button
                    className="btn"
                    onClick={() => add({ ...item, qty: 1 })}
                  >
                    ➕ Add to Cart
                  </button>
                ) : (
                  <>
                    <div
                      className="row"
                      style={{ gap: "0.3rem", alignItems: "center" }}
                    >
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
                      <span style={{ minWidth: 28, textAlign: "center" }}>
                        {cartItem.qty}
                      </span>
                      <button
                        className="btn outline"
                        onClick={() =>
                          updateQty(item.id, cartItem.qty + 1)
                        }
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
