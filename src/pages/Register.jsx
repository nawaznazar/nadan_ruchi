import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [img, setImg] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const nav = useNavigate();
  const { login } = useAuth();

  // Handle profile image upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImg(ev.target.result);
    reader.readAsDataURL(file);
  };

  // Password strength checker
  const getPasswordStrength = () => {
    if (password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password)) return "Strong";
    if (password.length >= 6) return "Medium";
    if (password.length > 0) return "Weak";
    return "";
  };

  const submit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("nr_registered_users") || "[]");
    if (users.find((u) => u.email === email)) {
      setError("User already exists!");
      return;
    }

    const newUser = { name, email, password, role: "customer", img };
    users.push(newUser);
    localStorage.setItem("nr_registered_users", JSON.stringify(users));

    // Auto login
    login(email, password);

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      nav("/");
    }, 2000);
  };

  return (
    <div
      className="container"
      style={{ display: "flex", justifyContent: "center", marginTop: "3rem" }}
    >
      <form
        className="card"
        onSubmit={submit}
        style={{
          padding: "2rem",
          maxWidth: "400px",
          width: "100%",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          borderRadius: "10px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Register</h2>

        {/* Profile Image */}
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <img
            src={img || "/img/default-profile.png"}
            alt="Profile"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: "0.5rem",
            }}
          />
          <br />
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        {/* Name */}
        <label style={{ position: "relative", marginBottom: "1rem", display: "block" }}>
          <span style={{ fontWeight: "bold" }}>Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          />
        </label>

        {/* Email */}
        <label style={{ position: "relative", marginBottom: "1rem", display: "block" }}>
          <span style={{ fontWeight: "bold" }}>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          />
        </label>

        {/* Password */}
        <label style={{ position: "relative", marginBottom: "1rem", display: "block" }}>
          <span style={{ fontWeight: "bold" }}>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          />
          {password && (
            <div
              style={{
                marginTop: "0.25rem",
                fontSize: "0.85rem",
                color:
                  getPasswordStrength() === "Strong"
                    ? "green"
                    : getPasswordStrength() === "Medium"
                    ? "orange"
                    : "red",
              }}
            >
              Password strength: {getPasswordStrength()}
            </div>
          )}
        </label>

        {error && <p className="muted" style={{ color: "red", marginBottom: "0.5rem" }}>{error}</p>}

        <button
          className="btn"
          type="submit"
          style={{ width: "100%", marginTop: "1rem", padding: "0.7rem" }}
        >
          Register
        </button>

        {/* Success popup */}
        {success && (
          <div
            style={{
              position: "fixed",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "#4ade80",
              color: "#065f46",
              padding: "1rem 2rem",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              opacity: 1,
              zIndex: 1000,
            }}
          >
            Registration successful! Redirecting...
          </div>
        )}
      </form>
    </div>
  );
}