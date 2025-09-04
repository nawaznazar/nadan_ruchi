import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import DarkModeToggle from "./DarkModeToggle.jsx";

export default function Header() {
  const { items } = useCart();
  const { user, logout } = useAuth();
  const qty = items.reduce((s, i) => s + i.qty, 0);

  // Links for customer (moved My Orders out of here)
  const customerLinks = (
    <>
      <NavLink to="/" end>Home</NavLink>
      <NavLink to="/menu">Menu</NavLink>
      <NavLink to="/about">About</NavLink>
      <NavLink to="/contact">Contact</NavLink>
      <NavLink to="/profile">Profile</NavLink>
    </>
  );

  // Links for admin
  const adminLinks = (
    <>
      <NavLink to="/admin/orders">📦 Orders</NavLink>
      <NavLink to="/admin">Admin Dashboard</NavLink>
    </>
  );

  // Links for guests
  const guestLinks = (
    <>
      <NavLink to="/" end>Home</NavLink>
      <NavLink to="/menu">Menu</NavLink>
      <NavLink to="/about">About</NavLink>
      <NavLink to="/contact">Contact</NavLink>
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
                <NavLink to="/cart" className="btn outline">
                  🛒 Cart ({qty})
                </NavLink>
                <NavLink to="/orders" className="btn outline">
                  📦 My Orders
                </NavLink>
              </>
            )}

            {/* Auth Buttons */}
            {user ? (
              <button className="btn" onClick={logout}>
                Logout
              </button>
            ) : (
              <>
                <NavLink to="/login" className="btn">Login</NavLink>
                <NavLink to="/register" className="btn outline">Register</NavLink>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
