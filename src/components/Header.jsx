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

  // Fix for cart count accuracy
  useEffect(() => {
    const totalQty = items.reduce((sum, item) => sum + (item.qty || 0), 0);
    setCartCount(totalQty);
  }, [items]);

  const navClass = ({ isActive }) =>
    `nav-link ${isActive ? "active" : ""}`;

  const customerLinks = (
    <>
      <NavLink to="/" end className={navClass} onClick={() => setMenuOpen(false)}>
        <span className="nav-icon">🏠</span>
        <span className="nav-text">Home</span>
      </NavLink>
      <NavLink to="/menu" className={navClass} onClick={() => setMenuOpen(false)}>
        <span className="nav-icon">📋</span>
        <span className="nav-text">Menu</span>
      </NavLink>
      <NavLink to="/about" className={navClass} onClick={() => setMenuOpen(false)}>
        <span className="nav-icon">ℹ️</span>
        <span className="nav-text">About</span>
      </NavLink>
      <NavLink to="/contact" className={navClass} onClick={() => setMenuOpen(false)}>
        <span className="nav-icon">📞</span>
        <span className="nav-text">Contact</span>
      </NavLink>
      <NavLink to="/profile" className={navClass} onClick={() => setMenuOpen(false)}>
        <span className="nav-icon">👤</span>
        <span className="nav-text">Profile</span>
      </NavLink>
    </>
  );

  const adminLinks = (
    <>
      <NavLink to="/admin/orders" className={navClass} onClick={() => setMenuOpen(false)}>
        <span className="nav-icon">📦</span>
        <span className="nav-text">Orders</span>
      </NavLink>
      <NavLink to="/admin/money" className={navClass} onClick={() => setMenuOpen(false)}>
        <span className="nav-icon">💰</span>
        <span className="nav-text">Money</span>
      </NavLink>
      <NavLink to="/admin" className={navClass} onClick={() => setMenuOpen(false)}>
        <span className="nav-icon">⚙️</span>
        <span className="nav-text">Dashboard</span>
      </NavLink>
    </>
  );

  const guestLinks = (
    <>
      <NavLink to="/" end className={navClass} onClick={() => setMenuOpen(false)}>
        <span className="nav-icon">🏠</span>
        <span className="nav-text">Home</span>
      </NavLink>
      <NavLink to="/menu" className={navClass} onClick={() => setMenuOpen(false)}>
        <span className="nav-icon">📋</span>
        <span className="nav-text">Menu</span>
      </NavLink>
      <NavLink to="/about" className={navClass} onClick={() => setMenuOpen(false)}>
        <span className="nav-icon">ℹ️</span>
        <span className="nav-text">About</span>
      </NavLink>
      <NavLink to="/contact" className={navClass} onClick={() => setMenuOpen(false)}>
        <span className="nav-icon">📞</span>
        <span className="nav-text">Contact</span>
      </NavLink>
    </>
  );

  return (
    <header className="main-header">
      <div className="container">
        <nav className="navbar">
          {/* Brand */}
          <Link className="brand" to="/" onClick={() => setMenuOpen(false)}>
            <span className="brand-icon">🍽️</span>
            <span className="brand-text">Nadan Ruchi</span>
          </Link>

          {/* Mobile Menu Toggle - Clear and visible */}
          <button
            className={`menu-toggle ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="menu-toggle-box">
              <span className="menu-toggle-inner"></span>
            </span>
            <span className="menu-label">{menuOpen ? "Close" : "Menu"}</span>
          </button>

          {/* Nav Links - Attractive and visible */}
          <div className={`nav-links ${menuOpen ? "open" : ""}`}>
            <div className="mobile-menu-header">
              <span className="mobile-menu-title">Nadan Ruchi</span>
              <button 
                className="mobile-close-btn"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                &times;
              </button>
            </div>
            <div className="nav-links-container">
              {!user && guestLinks}
              {user?.role === "customer" && customerLinks}
              {user?.role === "admin" && adminLinks}
            </div>
          </div>

          {/* Right Controls */}
          <div className="nav-controls">
            <DarkModeToggle />

            {user?.role === "customer" && (
              <>
                <NavLink
                  to="/cart"
                  className="cart-btn"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="btn-icon">🛒</span>
                  <span className="btn-text">Cart</span>
                  {cartCount > 0 && (
                    <span className="cart-badge">
                      {cartCount}
                    </span>
                  )}
                </NavLink>
                <NavLink 
                  to="/orders" 
                  className="orders-btn"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="btn-icon">📦</span>
                  <span className="btn-text">Orders</span>
                </NavLink>
              </>
            )}

            {user ? (
              <button className="logout-btn" onClick={logout}>
                <span className="btn-icon">🚪</span>
                <span className="btn-text">Logout</span>
              </button>
            ) : (
              <>
                <NavLink 
                  className="login-btn" 
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="btn-icon">🔑</span>
                  <span className="btn-text">Login</span>
                </NavLink>
                <NavLink 
                  className="register-btn" 
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="btn-icon">📝</span>
                  <span className="btn-text">Register</span>
                </NavLink>
              </>
            )}
          </div>
        </nav>
      </div>

      {/* Overlay for mobile menu */}
      {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)}></div>}

      <style jsx>{`
        /* Header Styles */
        .main-header {
          position: sticky;
          top: 0;
          z-index: 1000;
          background-color: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        [data-theme="dark"] .main-header {
          background-color: rgba(20, 25, 35, 0.98);
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.4);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.8rem 0;
          position: relative;
        }

        /* Brand Styles */
        .brand {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: var(--text-primary);
          transition: all 0.3s ease;
          z-index: 6;
          gap: 0.5rem;
        }

        .brand:hover {
          transform: scale(1.03);
        }

        .brand-icon {
          font-size: 1.8rem;
        }

        .brand-text {
          font-weight: 700;
          font-size: 1.5rem;
          background: linear-gradient(135deg, #4361ee, #3a86ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Navigation Links */
        .nav-links {
          display: flex;
          gap: 1.5rem;
          align-items: center;
        }

        .nav-links-container {
          display: flex;
          gap: 1.5rem;
        }

        .nav-link {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: var(--text-primary);
          font-weight: 500;
          padding: 0.5rem 0.8rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          white-space: nowrap;
          gap: 0.5rem;
        }

        .nav-link:hover {
          background-color: rgba(67, 97, 238, 0.1);
          transform: translateY(-2px);
        }

        .nav-link.active {
          background-color: rgba(67, 97, 238, 0.15);
          color: #4361ee;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(67, 97, 238, 0.2);
        }

        .nav-icon {
          font-size: 1.2rem;
          transition: transform 0.3s ease;
        }

        .nav-link:hover .nav-icon {
          transform: scale(1.2);
        }

        /* Navigation Controls */
        .nav-controls {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .cart-btn, .orders-btn, .login-btn, .register-btn, .logout-btn {
          display: flex;
          align-items: center;
          padding: 0.7rem 1.1rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
          position: relative;
          white-space: nowrap;
          border: none;
          cursor: pointer;
          font-size: 0.95rem;
          gap: 0.5rem;
        }

        .cart-btn, .orders-btn {
          background-color: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-primary);
        }

        .cart-btn:hover, .orders-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 12px rgba(0, 0, 0, 0.12);
          border-color: #4361ee;
          color: #4361ee;
        }

        .login-btn {
          background: linear-gradient(135deg, #4361ee, #3a86ff);
          color: white;
        }

        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(67, 97, 238, 0.4);
        }

        .register-btn {
          background-color: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-primary);
        }

        .register-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 12px rgba(0, 0, 0, 0.12);
          border-color: #4361ee;
          color: #4361ee;
        }

        .logout-btn {
          background: linear-gradient(135deg, #f72585, #b5179e);
          color: white;
        }

        .logout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(247, 37, 133, 0.4);
        }

        .btn-icon {
          font-size: 1.1rem;
        }

        /* Cart Badge */
        .cart-badge {
          position: absolute;
          top: -6px;
          right: -6px;
          background: linear-gradient(135deg, #4361ee, #3a86ff);
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: bold;
          animation: pulse 1.5s infinite;
          box-shadow: 0 2px 5px rgba(67, 97, 238, 0.3);
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        /* Mobile Menu Toggle - Clear and visible */
        .menu-toggle {
          display: none;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 44px;
          background: rgba(67, 97, 238, 0.1);
          border: 1px solid rgba(67, 97, 238, 0.3);
          cursor: pointer;
          padding: 0;
          z-index: 10;
          border-radius: 8px;
          transition: all 0.3s ease;
          gap: 4px;
        }

        .menu-toggle:hover {
          background-color: rgba(67, 97, 238, 0.2);
          transform: scale(1.05);
        }

        .menu-toggle-box {
          width: 24px;
          height: 14px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .menu-toggle-inner {
          width: 24px;
          height: 2px;
          background-color: var(--text-primary);
          border-radius: 2px;
          transition: all 0.3s ease;
          position: relative;
        }

        .menu-toggle-inner::before,
        .menu-toggle-inner::after {
          content: '';
          position: absolute;
          width: 24px;
          height: 2px;
          background-color: var(--text-primary);
          border-radius: 2px;
          transition: all 0.3s ease;
          left: 0;
        }

        .menu-toggle-inner::before {
          top: -6px;
        }

        .menu-toggle-inner::after {
          bottom: -6px;
        }

        .menu-toggle.open .menu-toggle-inner {
          background-color: transparent;
        }

        .menu-toggle.open .menu-toggle-inner::before {
          transform: translateY(6px) rotate(45deg);
          background-color: #4361ee;
        }

        .menu-toggle.open .menu-toggle-inner::after {
          transform: translateY(-6px) rotate(-45deg);
          background-color: #4361ee;
        }

        .menu-label {
          font-size: 0.65rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        /* Mobile Menu Overlay */
        .menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 4;
          display: none;
        }

        /* Mobile Menu Header */
        .mobile-menu-header {
          display: none;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 1.5rem 1rem;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 0.5rem;
        }

        .mobile-menu-title {
          font-size: 1.4rem;
          font-weight: 700;
          background: linear-gradient(135deg, #4361ee, #3a86ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .mobile-close-btn {
          background: none;
          border: none;
          font-size: 2.2rem;
          color: var(--text-primary);
          cursor: pointer;
          padding: 0;
          line-height: 1;
          transition: transform 0.3s ease;
        }

        .mobile-close-btn:hover {
          transform: scale(1.1);
          color: #4361ee;
        }

        /* Mobile Responsiveness */
        @media (max-width: 900px) {
          .nav-links-container {
            gap: 1rem;
          }
          
          .nav-link {
            padding: 0.5rem;
          }
          
          .cart-btn, .orders-btn, .login-btn, .register-btn, .logout-btn {
            padding: 0.6rem 1rem;
            font-size: 0.9rem;
          }
        }

        @media (max-width: 768px) {
          .menu-toggle {
            display: flex;
          }
          
          .nav-links {
            position: fixed;
            top: 0;
            left: 0;
            width: 300px;
            height: 100vh;
            background-color: var(--header-bg);
            flex-direction: column;
            padding: 0;
            box-shadow: 5px 0 25px rgba(0, 0, 0, 0.15);
            transform: translateX(-100%);
            transition: transform 0.4s ease;
            gap: 0;
            z-index: 5;
            overflow-y: auto;
          }
          
          .nav-links.open {
            transform: translateX(0);
          }
          
          .nav-links-container {
            flex-direction: column;
            width: 100%;
            gap: 0;
          }
          
          .nav-link {
            width: 100%;
            padding: 1.2rem 1.5rem;
            border-bottom: 1px solid var(--border-color);
            font-size: 1.1rem;
            display: flex;
            align-items: center;
            border-radius: 0;
            gap: 1rem;
          }
          
          .nav-controls {
            flex-wrap: wrap;
            justify-content: center;
            gap: 0.6rem;
          }
          
          .btn-text {
            display: none;
          }
          
          .cart-btn, .orders-btn, .login-btn, .register-btn, .logout-btn {
            padding: 0.7rem;
            font-size: 0.9rem;
          }
          
          .mobile-menu-header {
            display: flex;
          }
          
          .menu-overlay {
            display: block;
          }
        }

        @media (max-width: 480px) {
          .brand-text {
            font-size: 1.3rem;
          }
          
          .nav-controls {
            gap: 0.5rem;
          }
          
          .cart-btn, .orders-btn, .login-btn, .register-btn, .logout-btn {
            padding: 0.6rem 0.8rem;
            font-size: 0.85rem;
          }
          
          .cart-badge {
            width: 18px;
            height: 18px;
            font-size: 0.65rem;
          }
          
          .nav-links {
            width: 280px;
          }

          .menu-toggle {
            width: 54px;
          }
        }
      `}</style>
    </header>
  );
}