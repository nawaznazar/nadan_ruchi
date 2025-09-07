import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import DarkModeToggle from "./DarkModeToggle.jsx";

export default function Header() {
  const { items } = useCart();
  const { user, logout } = useAuth();
  const qty = items.reduce((s, i) => s + i.qty, 0);

  // Function to add nav-link class with active
  const navClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  // Customer links
  const customerLinks = (
    <>
      <NavLink to="/" end className={navClass}>Home</NavLink>
      <NavLink to="/menu" className={navClass}>Menu</NavLink>
      <NavLink to="/about" className={navClass}>About</NavLink>
      <NavLink to="/contact" className={navClass}>Contact</NavLink>
      <NavLink to="/profile" className={navClass}>Profile</NavLink>
    </>
  );

  // Admin links
  const adminLinks = (
    <>
      <NavLink to="/admin/orders" className={navClass}>📦 Orders</NavLink>
      <NavLink to="/admin/money" className={navClass}>💰 Money</NavLink>
      <NavLink to="/admin" className={navClass}>⚙️ Dashboard</NavLink>
    </>
  );

  // Guest links
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
          {/* Brand */}
          <Link className="brand" to="/">
            <span className="dot"></span> Nadan Ruchi
          </Link>

          {/* Navigation Links */}
          <div className="nav-links">
            {!user && guestLinks}
            {user?.role === "customer" && customerLinks}
            {user?.role === "admin" && adminLinks}
          </div>

          {/* Right Side Buttons */}
          <div className="row">
            <DarkModeToggle />

            {/* Cart + My Orders for customers */}
            {user?.role === "customer" && (
              <>
                <NavLink to="/cart" className="btn outline btn-float">
                  🛒 Cart ({qty})
                </NavLink>
                <NavLink to="/orders" className="btn outline btn-float">
                  📦 My Orders
                </NavLink>
              </>
            )}

            {/* Auth Buttons */}
            {user ? (
              <button className="btn btn-float" onClick={logout}>
                Logout
              </button>
            ) : (
              <>
                <NavLink to="/login" className="btn btn-float">Login</NavLink>
                <NavLink to="/register" className="btn outline btn-float">Register</NavLink>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
