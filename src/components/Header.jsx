import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import DarkModeToggle from "./DarkModeToggle.jsx";

export default function Header() {
  // Access cart data and authentication state
  const { items } = useCart();
  const { user, logout } = useAuth();
  
  // Calculate total quantity of items in cart
  const qty = items.reduce((s, i) => s + i.qty, 0);

  // Helper function to apply active class to current navigation link
  const navClass = ({ isActive }) =>
    `nav-link ${isActive ? "active" : ""}`;

  // Navigation links for regular customers
  const customerLinks = (
    <>
      <NavLink to="/" end className={navClass}>Home</NavLink>
      <NavLink to="/menu" className={navClass}>Menu</NavLink>
      <NavLink to="/about" className={navClass}>About</NavLink>
      <NavLink to="/contact" className={navClass}>Contact</NavLink>
      <NavLink to="/profile" className={navClass}>Profile</NavLink>
    </>
  );

  // Navigation links for admin users
  const adminLinks = (
    <>
      <NavLink to="/admin/orders" className={navClass}>📦 Orders</NavLink>
      <NavLink to="/admin/money" className={navClass}>💰 Money</NavLink>
      <NavLink to="/admin" className={navClass}>⚙️ Dashboard</NavLink>
    </>
  );

  // Navigation links for guests (non-logged-in users)
  const guestLinks = (
    <>
      <NavLink to="/" end className={navClass}>Home</NavLink>
      <NavLink to="/menu" className={navClass}>Menu</NavLink>
      <NavLink to="/about" className={navClass}>About</NavLink>
      <NavLink to="/contact" className={navClass}>Contact</NavLink>
    </>
  );

  return (
    <header>
      <div className="container">
        <nav>
          {/* Brand logo and name */}
          <Link className="brand" to="/">
            <span className="dot"></span> Nadan Ruchi
          </Link>

          {/* Navigation menu - shows different links based on user role */}
          <div className="nav-links">
            {!user && guestLinks}
            {user?.role === "customer" && customerLinks}
            {user?.role === "admin" && adminLinks}
          </div>

          {/* Right-side action buttons and controls */}
          <div className="row">
            {/* Dark mode toggle button */}
            <DarkModeToggle />

            {/* Cart and orders buttons (only for customers) */}
            {user?.role === "customer" && (
              <>
                <NavLink
                  to="/cart"
                  className="btn outline btn-float relative"
                >
                  🛒 Cart
                  {/* Show cart item count badge if items are in cart */}
                  {qty > 0 && (
                    <span className="tag primary absolute -top-2 -right-2 animate-pulse">
                      {qty}
                    </span>
                  )}
                </NavLink>
                <NavLink
                  to="/orders"
                  className="btn outline btn-float"
                >
                  📦 My Orders
                </NavLink>
              </>
            )}

            {/* Authentication buttons - logout for logged-in users, login/register for guests */}
            {user ? (
              <button className="btn btn-float danger" onClick={logout}>
                Logout
              </button>
            ) : (
              <>
                <NavLink className="btn btn-float" to="/login">
                  Login
                </NavLink>
                <NavLink className="btn outline btn-float" to="/register">
                  Register
                </NavLink>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}