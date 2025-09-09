import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import DarkModeToggle from "./DarkModeToggle.jsx";
import { FaUtensils, FaShoppingCart, FaBox, FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaHome, FaInfoCircle, FaPhone, FaCog, FaMoneyBill, FaList, FaTimes, FaBars } from "react-icons/fa";

export default function Header() {
  const { items } = useCart();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Fix cart count
  useEffect(() => {
    const totalQty = items.reduce((sum, item) => sum + (item.qty || 0), 0);
    setCartCount(totalQty);
  }, [items]);

  // Check if mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navClass = ({ isActive }) => `nav-link ${isActive ? "active" : ""}`;

  const customerLinks = (
    <>
      <NavLink to="/" end className={navClass} onClick={() => setMenuOpen(false)}>
        <FaHome className="nav-icon" /> {isMobile ? '' : 'Home'}
      </NavLink>
      <NavLink to="/menu" className={navClass} onClick={() => setMenuOpen(false)}>
        <FaList className="nav-icon" /> {isMobile ? '' : 'Menu'}
      </NavLink>
      <NavLink to="/about" className={navClass} onClick={() => setMenuOpen(false)}>
        <FaInfoCircle className="nav-icon" /> {isMobile ? '' : 'About'}
      </NavLink>
      <NavLink to="/contact" className={navClass} onClick={() => setMenuOpen(false)}>
        <FaPhone className="nav-icon" /> {isMobile ? '' : 'Contact'}
      </NavLink>
      <NavLink to="/profile" className={navClass} onClick={() => setMenuOpen(false)}>
        <FaUser className="nav-icon" /> {isMobile ? '' : 'Profile'}
      </NavLink>
    </>
  );

  const adminLinks = (
    <>
      <NavLink to="/admin/orders" className={navClass} onClick={() => setMenuOpen(false)}>
        <FaBox className="nav-icon" /> {isMobile ? '' : 'Orders'}
      </NavLink>
      <NavLink to="/admin/money" className={navClass} onClick={() => setMenuOpen(false)}>
        <FaMoneyBill className="nav-icon" /> {isMobile ? '' : 'Money'}
      </NavLink>
      <NavLink to="/admin" className={navClass} onClick={() => setMenuOpen(false)}>
        <FaCog className="nav-icon" /> {isMobile ? '' : 'Dashboard'}
      </NavLink>
    </>
  );

  const guestLinks = (
    <>
      <NavLink to="/" end className={navClass} onClick={() => setMenuOpen(false)}>
        <FaHome className="nav-icon" /> {isMobile ? '' : 'Home'}
      </NavLink>
      <NavLink to="/menu" className={navClass} onClick={() => setMenuOpen(false)}>
        <FaList className="nav-icon" /> {isMobile ? '' : 'Menu'}
      </NavLink>
      <NavLink to="/about" className={navClass} onClick={() => setMenuOpen(false)}>
        <FaInfoCircle className="nav-icon" /> {isMobile ? '' : 'About'}
      </NavLink>
      <NavLink to="/contact" className={navClass} onClick={() => setMenuOpen(false)}>
        <FaPhone className="nav-icon" /> {isMobile ? '' : 'Contact'}
      </NavLink>
    </>
  );

  return (
    <header className="main-header">
      <div className="container">
        <nav className="navbar">
          {/* Brand */}
          <Link className="brand" to="/" onClick={() => setMenuOpen(false)}>
            <FaUtensils className="brand-icon" />
            <span className="brand-text">Nadan Ruchi</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="desktop-nav">
            <div className="nav-links">
              {!user && guestLinks}
              {user?.role === "customer" && customerLinks}
              {user?.role === "admin" && adminLinks}
            </div>

            {/* Desktop Controls */}
            <div className="nav-controls">
              <DarkModeToggle />
              {user?.role === "customer" && (
                <>
                  <NavLink to="/cart" className="cart-btn" onClick={() => setMenuOpen(false)}>
                    <FaShoppingCart className="nav-icon" />
                    {isMobile ? '' : 'Cart'} {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                  </NavLink>
                  <NavLink to="/orders" className="orders-btn" onClick={() => setMenuOpen(false)}>
                    <FaBox className="nav-icon" /> {isMobile ? '' : 'Orders'}
                  </NavLink>
                </>
              )}
              {user ? (
                <button className="logout-btn" onClick={logout}>
                  <FaSignOutAlt className="nav-icon" /> {isMobile ? '' : 'Logout'}
                </button>
              ) : (
                <>
                  <NavLink to="/login" className="login-btn" onClick={() => setMenuOpen(false)}>
                    <FaSignInAlt className="nav-icon" /> {isMobile ? '' : 'Login'}
                  </NavLink>
                  <NavLink to="/register" className="register-btn" onClick={() => setMenuOpen(false)}>
                    <FaUserPlus className="nav-icon" /> {isMobile ? '' : 'Register'}
                  </NavLink>
                </>
              )}
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </nav>

        {/* Mobile Menu Overlay */}
        {menuOpen && (
          <div className="mobile-overlay" onClick={() => setMenuOpen(false)}>
            <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
              <div className="mobile-nav-links">
                {!user && guestLinks}
                {user?.role === "customer" && customerLinks}
                {user?.role === "admin" && adminLinks}
              </div>

              <div className="mobile-controls">
                {user?.role === "customer" && (
                  <>
                    <NavLink to="/cart" className="cart-btn mobile-btn" onClick={() => setMenuOpen(false)}>
                      <FaShoppingCart className="nav-icon" />
                      Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                    </NavLink>
                    <NavLink to="/orders" className="orders-btn mobile-btn" onClick={() => setMenuOpen(false)}>
                      <FaBox className="nav-icon" /> Orders
                    </NavLink>
                  </>
                )}
                {user ? (
                  <button className="logout-btn mobile-btn" onClick={() => { logout(); setMenuOpen(false); }}>
                    <FaSignOutAlt className="nav-icon" /> Logout
                  </button>
                ) : (
                  <>
                    <NavLink to="/login" className="login-btn mobile-btn" onClick={() => setMenuOpen(false)}>
                      <FaSignInAlt className="nav-icon" /> Login
                    </NavLink>
                    <NavLink to="/register" className="register-btn mobile-btn" onClick={() => setMenuOpen(false)}>
                      <FaUserPlus className="nav-icon" /> Register
                    </NavLink>
                  </>
                )}
                <DarkModeToggle mobile />
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        /* HEADER */
        .main-header {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          border-bottom: 1px solid #444;
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
        }
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.8rem 0;
          position: relative;
        }

        /* BRAND */
        .brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          z-index: 1001;
        }
        .brand-icon {
          font-size: 1.8rem;
          color: #ff6b35;
        }
        .brand-text {
          font-size: 1.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #ff6b35, #f7931e);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* DESKTOP NAVIGATION */
        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        /* NAV ICONS */
        .nav-icon {
          margin-right: 0.5rem;
          font-size: 1rem;
        }

        /* NAV LINKS */
        .nav-links {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }
        .nav-link {
          display: flex;
          align-items: center;
          text-decoration: none;
          font-weight: 500;
          color: white;
          transition: all 0.3s;
          padding: 0.6rem 1rem;
          border-radius: 8px;
          border: 1px solid transparent;
        }
        .nav-link:hover {
          background: rgba(255, 107, 53, 0.1);
          border-color: #ff6b35;
          transform: translateY(-2px);
        }
        .nav-link.active {
          background: linear-gradient(135deg, #ff6b35, #f7931e);
          color: white;
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
        }

        /* CONTROLS */
        .nav-controls {
          display: flex;
          gap: 0.8rem;
          align-items: center;
        }
        .login-btn {
          display: flex;
          align-items: center;
          background: linear-gradient(135deg, #ff6b35, #f7931e);
          color: white;
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
        }
        .register-btn {
          display: flex;
          align-items: center;
          border: 2px solid #ff6b35;
          color: #ff6b35;
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .register-btn:hover {
          background: #ff6b35;
          color: white;
          transform: translateY(-2px);
        }
        .logout-btn {
          display: flex;
          align-items: center;
          background: linear-gradient(135deg, #ef4444, #b91c1c);
          color: white;
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .logout-btn:hover {
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
          transform: translateY(-2px);
        }
        .cart-btn,
        .orders-btn {
          display: flex;
          align-items: center;
          border: 2px solid #ff6b35;
          color: #ff6b35;
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .cart-btn:hover,
        .orders-btn:hover {
          background: #ff6b35;
          color: white;
          transform: translateY(-2px);
        }
        .cart-badge {
          margin-left: 6px;
          background: #ef4444;
          color: white;
          font-size: 0.8rem;
          padding: 2px 8px;
          border-radius: 20px;
          font-weight: bold;
        }

        /* MENU TOGGLE (MOBILE) */
        .menu-toggle {
          display: none;
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          z-index: 1001;
          padding: 0.5rem;
          border-radius: 4px;
          transition: background 0.3s;
        }
        .menu-toggle:hover {
          background: rgba(255, 107, 53, 0.1);
        }

        /* MOBILE MENU OVERLAY */
        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          z-index: 999;
          animation: fadeIn 0.3s ease;
        }

        .mobile-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          border-top: 1px solid #444;
          animation: slideDown 0.3s ease;
        }

        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          padding: 1rem;
        }

        .mobile-nav-links .nav-link {
          width: 100%;
          margin-bottom: 0.5rem;
          justify-content: flex-start;
          border-radius: 6px;
        }

        .mobile-controls {
          padding: 1rem;
          border-top: 1px solid #444;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .mobile-btn {
          width: 100%;
          justify-content: center;
          text-align: center;
        }

        /* ANIMATIONS */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideDown {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        /* RESPONSIVE DESIGN */
        @media (max-width: 768px) {
          .desktop-nav {
            display: none;
          }

          .menu-toggle {
            display: block;
          }

          .brand-text {
            font-size: 1.3rem;
          }

          .nav-link {
            padding: 1rem;
            font-size: 1.1rem;
          }

          .login-btn, .register-btn, .logout-btn, .cart-btn, .orders-btn {
            padding: 1rem;
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          .brand-text {
            font-size: 1.1rem;
          }

          .brand-icon {
            font-size: 1.5rem;
          }

          .nav-link {
            padding: 0.8rem;
            font-size: 1rem;
          }
        }

        @media (min-width: 769px) {
          .mobile-overlay {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
