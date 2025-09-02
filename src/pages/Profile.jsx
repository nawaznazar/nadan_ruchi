import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [img, setImg] = useState(user?.img || "");
  const [showPopup, setShowPopup] = useState(false);

  if (!user)
    return (
      <div className="container">
        <p>Please login first.</p>
      </div>
    );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImg(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    // Update user context
    setUser({ ...user, name, img });
    setShowPopup(true);
    // Hide popup after 2 seconds
    setTimeout(() => setShowPopup(false), 2000);
  };

  return (
    <div className="container">
      <h2>My Profile</h2>
      <div className="card" style={{ maxWidth: "400px", margin: "auto" }}>
        <form onSubmit={handleUpdate}>
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <img
              src={img || "/img/default-profile.png"}
              alt="Profile"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #ddd",
                marginBottom: "0.5rem",
              }}
            />
            <br />
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          <label>
            Name<br />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            Email<br />
            <input type="email" value={user.email} disabled />
          </label>
          <label>
            Role<br />
            <input type="text" value={user.role} disabled />
          </label>
          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <button className="btn" type="submit">
              Update Profile
            </button>
          </div>
        </form>
      </div>

      {/* Popup Notification */}
      {showPopup && (
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
            transition: "opacity 0.5s ease",
            zIndex: 1000,
          }}
        >
          Your profile has been updated successfully!
        </div>
      )}
    </div>
  );
}
