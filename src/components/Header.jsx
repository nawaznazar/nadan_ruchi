import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import DarkModeToggle from "./DarkModeToggle.jsx";

export default function Header() {
  const { items } = useCart();
  const { user, logout } = useAuth();
  const qty = items.reduce((s, i) => s + i.qty, 0);

  return (
    <header>
      <div className="container">
        <nav>
          <Link className="brand" to="/">
            <span className="dot"></span> Nadan Ruchi
          </Link>

          <div className="nav-links">
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/menu">Menu</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>

            {/* Show only for logged-in customers */}
            {user?.role === "customer" && (
              <>
                <NavLink to="/orders">My Orders</NavLink>
                <NavLink to="/profile">Profile</NavLink>
              </>
            )}

            {/* Show only for admin */}
            {user?.role === "admin" && <NavLink to="/admin">Admin</NavLink>}
          </div>

          <div className="row">
            <DarkModeToggle />
            <NavLink to="/cart" className="btn outline">
              Cart ({qty})
            </NavLink>
            {user ? (
              <button className="btn" onClick={logout}>
                Logout
              </button>
            ) : (
              <>
                <NavLink to="/login" className="btn">
                  Login
                </NavLink>
                <NavLink to="/register" className="btn outline">
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
