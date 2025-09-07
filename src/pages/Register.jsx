import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [contactNumber, setContactNumber] = useState("");
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

  // Validate and format Qatar contact number input
  const handleContactChange = (e) => {
    // Only allow digits and limit to 8 characters
    const val = e.target.value.replace(/\D/g, "").slice(0, 8);
    setContactNumber(val);
  };

  // Calculate password strength for user feedback
  const getPasswordStrength = () => {
    if (password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password)) return "Strong";
    if (password.length >= 6) return "Medium";
    if (password.length > 0) return "Weak";
    return "";
  };

  // Handle form submission
  const submit = (e) => {
    e.preventDefault();
    setError("");

    // Validate password confirmation
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    // Validate Qatar phone number format
    if (contactNumber.length !== 8) {
      setError("Contact number must be exactly 8 digits.");
      return;
    }

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem("nr_registered_users") || "[]");
    if (users.find((u) => u.email === email)) {
      setError("User already exists!");
      return;
    }

    // Format full phone number with Qatar country code
    const fullNumber = "+974" + contactNumber;

    // Create new user object and save to localStorage
    const newUser = { name, email, password, role: "customer", img, contactNumber: fullNumber };
    users.push(newUser);
    localStorage.setItem("nr_registered_users", JSON.stringify(users));

    // Automatically log in the new user
    login(email, password);

    // Show success message and redirect
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
        style={{ padding: "2rem", maxWidth: "400px", width: "100%" }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1rem", color: "var(--primary)" }}>
          Register
        </h2>

        {/* Profile image upload section */}
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

        {/* Name input field */}
        <label>
          Name
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>

        {/* Email input field */}
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>

        {/* Qatar phone number input with country code prefix */}
        <label>
          Contact Number
          <div style={{ display: "flex", alignItems: "center" }}>
            <span
              style={{
                padding: "0.5rem",
                background: "#f0f0f0",
                border: "1px solid #ccc",
                borderRadius: "4px 0 0 4px",
              }}
            >
              +974
            </span>
            <input
              type="text"
              value={contactNumber}
              onChange={handleContactChange}
              required
              style={{ flex: 1, borderRadius: "0 4px 4px 0", padding: "0.5rem" }}
              placeholder="8-digit number"
            />
          </div>
        </label>

        {/* Password input with strength indicator */}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {password && (
            <div
              style={{
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

        {/* Password confirmation field */}
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>

        {/* Error message display */}
        {error && (
          <p className="muted" style={{ color: "var(--danger)" }}>
            {error}
          </p>
        )}

        {/* Registration submit button */}
        <button className="btn" type="submit" style={{ width: "100%", marginTop: "1rem" }}>
          Register
        </button>

        {/* Link to login page for existing users */}
        <p
          style={{
            marginTop: "1rem",
            color: "var(--muted)",
            fontSize: "0.9rem",
            textAlign: "center",
          }}
        >
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--primary)" }}>
            Login
          </Link>
        </p>

        {/* Success notification toast */}
        {success && <div className="toast">Registration successful! Redirecting...</div>}
      </form>
    </div>
  );
}