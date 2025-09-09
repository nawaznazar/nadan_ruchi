import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import DarkModeToggle from "./DarkModeToggle.jsx";

export default function Header() {
  const { items } = useCart();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Fix cart count
  useEffect(() => {
    const totalQty = items.reduce((sum, item) => sum + (item.qty || 0), 0);
    setCartCount(totalQty);
  }, [items]);

  const navClass = ({ isActive }) => `nav-link ${isActive ? "active" : ""}`;

  const customerLinks = (
    <>
      <NavLink to="/" end className={navClass} onClick={() => setMenuOpen(false)}>🏠 Home</NavLink>
      <NavLink to="/menu" className={navClass} onClick={() => setMenuOpen(false)}>📋 Menu</NavLink>
      <NavLink to="/about" className={navClass} onClick={() => setMenuOpen(false)}>ℹ️ About</NavLink>
      <NavLink to="/contact" className={navClass} onClick={() => setMenuOpen(false)}>📞 Contact</NavLink>
      <NavLink to="/profile" className={navClass} onClick={() => setMenuOpen(false)}>👤 Profile</NavLink>
    </>
  );

  const adminLinks = (
    <>
      <NavLink to="/admin/orders" className={navClass} onClick={() => setMenuOpen(false)}>📦 Orders</NavLink>
      <NavLink to="/admin/money" className={navClass} onClick={() => setMenuOpen(false)}>💰 Money</NavLink>
      <NavLink to="/admin" className={navClass} onClick={() => setMenuOpen(false)}>⚙️ Dashboard</NavLink>
    </>
  );

  const guestLinks = (
    <>
      <NavLink to="/" end className={navClass} onClick={() => setMenuOpen(false)}>🏠 Home</NavLink>
      <NavLink to="/menu" className={navClass} onClick={() => setMenuOpen(false)}>📋 Menu</NavLink>
      <NavLink to="/about" className={navClass} onClick={() => setMenuOpen(false)}>ℹ️ About</NavLink>
      <NavLink to="/contact" className={navClass} onClick={() => setMenuOpen(false)}>📞 Contact</NavLink>
    </>
  );

  return (
    <header className="main-header">
      <div className="container">
        <nav className="navbar">
          {/* Brand */}
          <Link className="brand" to="/" onClick={() => setMenuOpen(false)}>
            <img src="/img/nadan-logo.jpg" alt="Nadan Ruchi Logo" className="brand-logo" />
            <span className="brand-text">Nadan Ruchi</span>
          </Link>

          {/* Mobile Toggle */}
          <button
            className={`menu-toggle ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? "✖" : "☰"}
          </button>

          {/* Links */}
          <div className={`nav-links ${menuOpen ? "open" : ""}`}>
            {!user && guestLinks}
            {user?.role === "customer" && customerLinks}
            {user?.role === "admin" && adminLinks}
          </div>

          {/* Controls */}
          <div className="nav-controls">
            <DarkModeToggle />
            {user?.role === "customer" && (
              <>
                <NavLink to="/cart" className="cart-btn" onClick={() => setMenuOpen(false)}>
                  🛒 Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </NavLink>
                <NavLink to="/orders" className="orders-btn" onClick={() => setMenuOpen(false)}>📦 Orders</NavLink>
              </>
            )}
            {user ? (
              <button className="logout-btn" onClick={logout}>🚪 Logout</button>
            ) : (
              <>
                <NavLink to="/login" className="login-btn" onClick={() => setMenuOpen(false)}>🔑 Login</NavLink>
                <NavLink to="/register" className="register-btn" onClick={() => setMenuOpen(false)}>📝 Register</NavLink>
              </>
            )}
          </div>
        </nav>
      </div>

      <style jsx>{`
        /* HEADER */
        .main-header {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: var(--glass);
          backdrop-filter: blur(14px) saturate(150%);
          -webkit-backdrop-filter: blur(14px) saturate(150%);
          border-bottom: 1px solid var(--glass-border);
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
          transition: background 0.3s ease, box-shadow 0.3s ease;
        }
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.8rem 0;
        }

        /* BRAND */
        .brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
        }
        .brand-logo {
          width: 32px;
          height: auto;
        }
        .brand-text {
          font-size: 1.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #059669, #10b981);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* MENU TOGGLE */
        .menu-toggle {
          display: none;
          font-size: 1.8rem;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text);
          transition: color 0.3s, transform 0.2s;
        }
        .menu-toggle:hover {
          transform: scale(1.1);
        }
        [data-theme="dark"] .menu-toggle {
          color: #f9fafb;
        }

        /* NAV LINKS */
        .nav-links {
          display: flex;
          gap: 1rem;
        }
        .nav-link {
          text-decoration: none;
          font-weight: 500;
          color: var(--text);
          transition: all 0.3s;
          padding: 0.5rem 0.8rem;
          border-radius: 6px;
        }
        .nav-link:hover,
        .nav-link.active {
          background: rgba(16, 185, 129, 0.1);
          color: #059669;
        }

        /* CONTROLS */
        .nav-controls {
          display: flex;
          gap: 0.8rem;
          align-items: center;
        }
        .login-btn {
          background: linear-gradient(135deg, #059669, #10b981);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 6px;
        }
        .register-btn {
          border: 1px solid var(--border);
          padding: 0.5rem 1rem;
          border-radius: 6px;
        }
        .logout-btn {
          background: linear-gradient(135deg, #ef4444, #b91c1c);
          color: white;
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }
        .logout-btn:hover {
          box-shadow: 0 5px 15px rgba(239, 68, 68, 0.4);
          transform: translateY(-2px);
        }
        .cart-btn,
        .orders-btn {
          border: 1px solid var(--border);
          padding: 0.5rem 1rem;
          border-radius: 6px;
        }
        .cart-badge {
          margin-left: 4px;
          background: #059669;
          color: white;
          font-size: 0.8rem;
          padding: 2px 6px;
          border-radius: 50%;
        }

        /* MOBILE MENU */
        @media (max-width: 768px) {
          .menu-toggle {
            display: block;
          }
          .nav-links {
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            flex-direction: column;
            background: var(--glass);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            max-height: 0;
            overflow: hidden;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.35s ease-in-out;
          }
          .nav-links.open {
            max-height: 500px;
            opacity: 1;
            transform: translateY(0);
          }
          .nav-link {
            width: 100%;
            text-align: center;
            padding: 1rem;
            font-size: 1.1rem;
            border-bottom: 1px solid var(--border);
          }
        }
      `}</style>
    </header>
  );
}
