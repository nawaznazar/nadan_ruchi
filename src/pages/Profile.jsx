import React from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Profile() {
  const { user } = useAuth();

  if (!user) return <div className="container"><p>Please login first.</p></div>;

  return (
    <div className="container">
      <h2>My Profile</h2>
      <div className="card">
        <p><strong>Name:</strong> {user.name || "Customer"}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
    </div>
  );
}
