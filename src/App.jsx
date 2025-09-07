import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Menu from "./pages/Menu.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Orders from "./pages/Orders.jsx";              // Customer orders
import AdminOrders from "./pages/AdminOrders.jsx";   // Admin orders
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminMoney from "./pages/AdminMoney.jsx";     // Financial management page
import NotFound from "./pages/NotFound.jsx";

import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    // Wrap application with context providers
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          {/* Global header component */}
          <Header />
          
          {/* Main application routing */}
          <Routes>
            {/* Public Routes - accessible to all users */}
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Customer-only routes - require customer authentication */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute role="customer">
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute role="customer">
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute role="customer">
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute role="customer">
                  <Orders />
                </ProtectedRoute>
              }
            />

            {/* Admin-only routes - require admin privileges */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute role="admin">
                  <AdminOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/money"
              element={
                <ProtectedRoute role="admin">
                  <AdminMoney />
                </ProtectedRoute>
              }
            />

            {/* Authentication routes - accessible without login */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 404 fallback route for undefined paths */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* Global footer component */}
          <Footer />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}