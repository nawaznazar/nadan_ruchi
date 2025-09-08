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
    <div className="container" style={{ display: "flex", justifyContent: "center", marginTop: "3rem", minHeight: "80vh" }}>
      <form
        className="card"
        onSubmit={submit}
        style={{ padding: "2rem", maxWidth: "450px", width: "100%" }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem", color: "var(--primary)" }}>
          Create Account
        </h2>

        {/* Profile image upload section */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <img
              src={img || "/img/default-profile.png"}
              alt="Profile"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid var(--border)",
              }}
            />
            <label
              htmlFor="profile-upload"
              style={{
                position: "absolute",
                bottom: "0",
                right: "0",
                background: "var(--primary)",
                color: "white",
                borderRadius: "50%",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "1.2rem",
              }}
            >
              +
            </label>
            <input 
              id="profile-upload"
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              style={{ display: "none" }} 
            />
          </div>
          <div style={{ fontSize: "0.85rem", color: "var(--muted)", marginTop: "0.5rem" }}>
            Click + to upload profile photo
          </div>
        </div>

        {/* Name input field */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
            Full Name
          </label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            style={{ 
              width: "100%", 
              padding: "0.75rem", 
              borderRadius: "6px", 
              border: "1px solid var(--border)",
              background: "var(--card-bg)",
              color: "var(--text)"
            }}
          />
        </div>

        {/* Email input field */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
            Email Address
          </label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ 
              width: "100%", 
              padding: "0.75rem", 
              borderRadius: "6px", 
              border: "1px solid var(--border)",
              background: "var(--card-bg)",
              color: "var(--text)"
            }}
          />
        </div>

        {/* Qatar phone number input with country code prefix */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
            Contact Number
          </label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span
              style={{
                padding: "0.75rem",
                background: "var(--light-bg)",
                border: "1px solid var(--border)",
                borderRadius: "6px 0 0 6px",
                color: "var(--text)",
                fontWeight: "500"
              }}
            >
              +974
            </span>
            <input
              type="text"
              value={contactNumber}
              onChange={handleContactChange}
              required
              style={{ 
                flex: 1, 
                borderRadius: "0 6px 6px 0", 
                padding: "0.75rem",
                border: "1px solid var(--border)",
                borderLeft: "none",
                background: "var(--card-bg)",
                color: "var(--text)"
              }}
              placeholder="8-digit number"
            />
          </div>
        </div>

        {/* Password input with strength indicator */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ 
              width: "100%", 
              padding: "0.75rem", 
              borderRadius: "6px", 
              border: "1px solid var(--border)",
              background: "var(--card-bg)",
              color: "var(--text)"
            }}
          />
          {password && (
            <div
              style={{
                fontSize: "0.85rem",
                marginTop: "0.5rem",
                color:
                  getPasswordStrength() === "Strong"
                    ? "var(--success)"
                    : getPasswordStrength() === "Medium"
                    ? "var(--warning)"
                    : "var(--danger)",
              }}
            >
              Password strength: {getPasswordStrength()}
            </div>
          )}
        </div>

        {/* Password confirmation field */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ 
              width: "100%", 
              padding: "0.75rem", 
              borderRadius: "6px", 
              border: "1px solid var(--border)",
              background: "var(--card-bg)",
              color: "var(--text)"
            }}
          />
        </div>

        {/* Error message display */}
        {error && (
          <div style={{ 
            padding: "0.75rem", 
            borderRadius: "6px", 
            background: "var(--danger-light)", 
            color: "var(--danger)",
            marginBottom: "1rem",
            border: "1px solid var(--danger)"
          }}>
            {error}
          </div>
        )}

        {/* Registration submit button */}
        <button 
          className="btn" 
          type="submit" 
          style={{ 
            width: "100%", 
            padding: "0.75rem", 
            fontSize: "1rem",
            marginBottom: "1.5rem"
          }}
        >
          Create Account
        </button>

        {/* Link to login page for existing users */}
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "var(--muted)", margin: 0 }}>
            Already have an account?{" "}
            <Link 
              to="/login" 
              style={{ 
                color: "var(--primary)", 
                textDecoration: "none",
                fontWeight: "500"
              }}
            >
              Sign In
            </Link>
          </p>
        </div>

        {/* Success notification toast */}
        {success && (
          <div style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "0.75rem 1.5rem",
            borderRadius: "6px",
            background: "var(--success)",
            color: "white",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 1000
          }}>
            Registration successful! Redirecting...
          </div>
        )}
      </form>
    </div>
  );
}