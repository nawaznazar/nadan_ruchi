import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();
  const { login } = useAuth();

  const submit = (e) => {
    e.preventDefault();

    // Store user in localStorage (mock)
    const users = JSON.parse(localStorage.getItem("nr_registered_users") || "[]");
    if (users.find((u) => u.email === email)) {
      setError("User already exists!");
      return;
    }
    users.push({ name, email, password, role: "customer" });
    localStorage.setItem("nr_registered_users", JSON.stringify(users));

    // Auto login after register
    login(email, password);
    nav("/");
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form className="card" onSubmit={submit}>
        <label>
          Name <br />
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <div className="spacer" />
        <label>
          Email <br />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <div className="spacer" />
        <label>
          Password <br />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <p className="muted">{error}</p>}
        <div className="spacer" />
        <button className="btn" type="submit">
          Register
        </button>
      </form>
    </div>
  );
}
