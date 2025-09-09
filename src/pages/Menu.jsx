import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext.jsx";
import { formatQAR } from "../utils/currency.js";
import { useNavigate } from "react-router-dom";
import { MENU, CATEGORIES } from "../data/menu.js";

const STORAGE_KEY = "nr_admin_menu";

export default function Menu() {
  const { items: cartItems, add, updateQty, remove } = useCart();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [dynamicMenu, setDynamicMenu] = useState([]);
  const navigate = useNavigate();

  // Load menu from localStorage and listen to updates from admin
  useEffect(() => {
    const loadMenu = () => {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      setDynamicMenu(stored);
    };

    loadMenu();

    // Set up event listeners for menu updates
    const onStorageChange = (e) => {
      if (e.key === STORAGE_KEY) loadMenu();
    };
    const onMenuUpdated = () => loadMenu();

    window.addEventListener("storage", onStorageChange);
    window.addEventListener("menu-updated", onMenuUpdated);

    // Clean up event listeners
    return () => {
      window.removeEventListener("storage", onStorageChange);
      window.removeEventListener("menu-updated", onMenuUpdated);
    };
  }, []);

  // Find item in cart by ID
  const getCartItem = (id) => cartItems.find((i) => i.id === id);

  // Get total quantity of an item already in cart
  const getCartItemQty = (id) => {
    const item = cartItems.find((i) => i.id === id);
    return item ? item.qty : 0;
  };

  // Check if item can be added to cart (respects maxCartQty)
  const canAddToCart = (item) => {
    if (item.unavailable || item.availableQty <= 0) return false;
    
    const currentQty = getCartItemQty(item.id);
    const maxAllowed = Math.min(item.maxCartQty, item.availableQty);
    
    return currentQty < maxAllowed;
  };

  // Check if item quantity can be increased
  const canIncreaseQty = (item) => {
    if (item.unavailable || item.availableQty <= 0) return false;
    
    const currentQty = getCartItemQty(item.id);
    const maxAllowed = Math.min(item.maxCartQty, item.availableQty);
    
    return currentQty < maxAllowed;
  };

  // Merge static MENU data with dynamic updates from admin
  const fullMenu = MENU.map((m) => {
    const updated = dynamicMenu.find((d) => d.id === m.id);
    return updated ? { 
      availableQty: 0,
      maxCartQty: 10,
      ...m,
      ...updated 
    } : { 
      availableQty: 0,
      maxCartQty: 10,
      ...m 
    };
  }).concat(
    dynamicMenu.filter((d) => !MENU.some((m) => m.id === d.id))
  );

  // Filter menu items based on category, search, and availability
  const filtered = fullMenu.filter(
    (i) =>
      !i.unavailable &&
      i.availableQty > 0 &&
      (category === "All" || i.category === category) &&
      (i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.category.toLowerCase().includes(search.toLowerCase()))
  );

  // Get available highlighted items for today
  const highlightsAvailable = fullMenu.filter(
    (i) => i.highlight && !i.unavailable && i.availableQty > 0
  );

  return (
    <div className="container">
      <h2>🍴 Our Menu</h2>

      {/* Display today's highlights if available */}
      {highlightsAvailable.length > 0 && (
        <section style={{ marginBottom: "2rem" }}>
          <h3>🔥 Today's Highlights</h3>
          <div className="grid" style={{ gap: "1rem", marginTop: "0.8rem" }}>
            {highlightsAvailable.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                cartItem={getCartItem(item.id)}
                add={add}
                updateQty={updateQty}
                remove={remove}
                navigate={navigate}
                canAddToCart={canAddToCart(item)}
                canIncreaseQty={canIncreaseQty(item)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Search and category filter controls */}
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

      {/* Menu items grid */}
      <div className="grid" style={{ gap: "1rem" }}>
        {filtered.map((item) => (
          <MenuCard
            key={item.id}
            item={item}
            cartItem={getCartItem(item.id)}
            add={add}
            updateQty={updateQty}
            remove={remove}
            navigate={navigate}
            canAddToCart={canAddToCart(item)}
            canIncreaseQty={canIncreaseQty(item)}
          />
        ))}
      </div>
    </div>
  );
}

// ================== MENU CARD COMPONENT ==================
function MenuCard({ item, cartItem, add, updateQty, remove, navigate, canAddToCart, canIncreaseQty }) {
  const isUnavailable = item.unavailable || item.availableQty <= 0;

  // Get stock status message
  const getStockMessage = () => {
    if (item.availableQty <= 0) return "Out of Stock";
    if (item.availableQty <= 5) return `Only ${item.availableQty} left!`;
    return `${item.availableQty} available`;
  };

  // Get stock status class
  const getStockStatus = () => {
    if (item.availableQty <= 0) return "stock-out";
    if (item.availableQty <= 5) return "stock-low";
    return "stock-ok";
  };

  return (
    <div
      className="card"
      style={{
        padding: "1rem",
        position: "relative",
        opacity: isUnavailable ? 0.5 : 1,
        filter: isUnavailable ? "grayscale(70%)" : "none",
      }}
    >
      {/* Unavailable indicator badge */}
      {isUnavailable && (
        <span
          style={{
            position: "absolute",
            top: "0.5rem",
            right: "0.5rem",
            background: "red",
            color: "white",
            fontSize: "0.7rem",
            padding: "0.2rem 0.5rem",
            borderRadius: "4px",
          }}
        >
          {item.availableQty <= 0 ? "Out of Stock" : "Unavailable"}
        </span>
      )}

      <strong>{item.name}</strong>
      <div className="muted">
        {item.category} • {item.veg ? "Veg" : "Non-veg"}
      </div>
      
      {/* Stock information */}
      {!isUnavailable && (
        <div className={getStockStatus()} style={{ fontSize: "0.9rem", marginTop: "0.3rem" }}>
          {getStockMessage()}
        </div>
      )}
      
      {/* Spicy level indicator */}
      {item.spicy > 0 && (
        <div style={{ color: "tomato" }}>🌶 Spicy Level: {item.spicy}</div>
      )}
      
      {/* Item image */}
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

      {/* Cart controls - different states based on item availability and cart status */}
      <div className="row" style={{ marginTop: "0.6rem", gap: "0.3rem" }}>
        {!cartItem ? (
          // Add to cart button for items not in cart
          <button
            className="btn"
            onClick={() => add({ ...item, qty: 1 })}
            disabled={!canAddToCart}
          >
            {!canAddToCart ? (isUnavailable ? "Unavailable" : "Max Reached") : "➕ Add to Cart"}
          </button>
        ) : (
          // Quantity controls for items already in cart
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
                disabled={isUnavailable}
              >
                -
              </button>
              <span style={{ minWidth: 28, textAlign: "center" }}>
                {cartItem.qty}
              </span>
              <button
                className="btn outline"
                onClick={() => updateQty(item.id, cartItem.qty + 1)}
                disabled={!canIncreaseQty}
              >
                +
              </button>
            </div>
            {/* Quick navigation to cart */}
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
}

// Add CSS for stock indicators
const styles = `
.stock-low {
  color: #e67e22;
  font-weight: bold;
}
.stock-out {
  color: #e74c3c;
  font-weight: bold;
}
.stock-ok {
  color: #27ae60;
}
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
