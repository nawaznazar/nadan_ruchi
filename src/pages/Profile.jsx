import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [contactNumber, setContactNumber] = useState(
    user?.contactNumber?.slice(4) || "" // remove '+974' prefix
  );
  const [img, setImg] = useState(user?.img || "");
  const [showPopup, setShowPopup] = useState(false);

  if (!user)
    return (
      <div className="container">
        <p>Please login first.</p>
      </div>
    );

  // Profile image upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImg(ev.target.result);
    reader.readAsDataURL(file);
  };

  // Validate Qatar phone number
  const handleContactChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 8);
    setContactNumber(val);
  };

  // Update profile
  const handleUpdate = (e) => {
    e.preventDefault();
    const fullNumber = "+974" + contactNumber;
    setUser({ ...user, name, img, contactNumber: fullNumber });

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

    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  return (
    <div className="container">
      <h2>My Profile</h2>
      <div className="card profile-card">
        <form onSubmit={handleUpdate}>
          <div className="profile-img-section">
            <img src={img || "/img/default-profile.png"} alt="Profile" />
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <label>
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label>
            Contact Number
            <div className="contact-wrapper">
              <span>+974</span>
              <input
                type="text"
                value={contactNumber}
                onChange={handleContactChange}
                placeholder="Enter your contact number"
                required
              />
            </div>
          </label>

          <label>
            Email
            <input type="email" value={user.email} disabled />
          </label>

          <label>
            Role
            <input type="text" value={user.role} disabled />
          </label>

          <div className="btn-wrapper">
            <button className="btn" type="submit">
              Update Profile
            </button>
          </div>
        </form>
      </div>

      {showPopup && <div className="profile-success-popup">Your profile has been updated successfully!</div>}
    </div>
  );
}
