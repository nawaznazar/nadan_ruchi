import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [contactNumber, setContactNumber] = useState(
    user?.contactNumber?.slice(4) || "" // remove '+974' from stored number if exists
  );
  const [img, setImg] = useState(user?.img || "");
  const [showPopup, setShowPopup] = useState(false);

  // Require user authentication
  if (!user)
    return (
      <div className="container">
        <p>Please login first.</p>
      </div>
    );

  // Handle profile image upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImg(ev.target.result);
    reader.readAsDataURL(file);
  };

  // Validate and format Qatar contact number
  const handleContactChange = (e) => {
    // Only allow numbers and max 8 digits
    const val = e.target.value.replace(/\D/g, "").slice(0, 8);
    setContactNumber(val);
  };

  // Update user profile information
  const handleUpdate = (e) => {
    e.preventDefault();
    const fullNumber = "+974" + contactNumber;
    setUser({ ...user, name, img, contactNumber: fullNumber });
    
    // Update user data in localStorage
    localStorage.setItem(
      "nr_registered_users",
      JSON.stringify(
        JSON.parse(localStorage.getItem("nr_registered_users") || "[]").map(
          (u) =>
            u.email === user.email
              ? { ...u, name, img, contactNumber: fullNumber }
              : u
        )
      )
    );
    
    // Show success confirmation
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  return (
    <div className="container">
      <h2>My Profile</h2>
      <div className="card" style={{ maxWidth: "400px", margin: "auto" }}>
        <form onSubmit={handleUpdate}>
          {/* Profile image section */}
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
          
          {/* Editable name field */}
          <label>
            Name<br />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          
          {/* Qatar phone number field with country code prefix */}
          <label>
            Contact Number<br />
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
                placeholder="Enter your contact number"
              />
            </div>
          </label>
          
          {/* Read-only email field */}
          <label>
            Email<br />
            <input type="email" value={user.email} disabled />
          </label>
          
          {/* Read-only role field */}
          <label>
            Role<br />
            <input type="text" value={user.role} disabled />
          </label>
          
          {/* Update button */}
          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <button className="btn" type="submit">
              Update Profile
            </button>
          </div>
        </form>
      </div>

      {/* Success confirmation popup */}
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