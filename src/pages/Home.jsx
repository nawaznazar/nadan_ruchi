import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const STORAGE_KEY = 'nr_admin_menu';

export default function Home() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [highlights, setHighlights] = useState([]);

  // Load reviews
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("nr_reviews") || "[]");
    setReviews(data);
  }, []);

  // Load admin-highlighted menu items
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const todayHighlights = data.filter(item => item.highlight);
    setHighlights(todayHighlights);
  }, []);

  const addReview = () => {
    if (!user) return alert("Please login to leave a review.");
    if (!text.trim()) return;

    const all = JSON.parse(localStorage.getItem("nr_reviews") || "[]");
    const newReview = {
      id: Date.now(),
      user: user.name || user.email,
      text,
      rating,
      date: new Date()
    };
    all.push(newReview);
    localStorage.setItem("nr_reviews", JSON.stringify(all));
    setReviews(all);
    setText("");
    setRating(5);
  };

  return (
    <div className="container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: "800",
              background: "linear-gradient(to right, var(--primary), #16a34a)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            Experience the Authentic Taste of Kerala in Qatar 
          </h1>
          <p className="muted" style={{ fontSize: "1.1rem" }}>
            From fluffy appams to spicy Malabar biriyani — only Kerala &
            Malayali specials. Fresh, homely, and made with love.
          </p>
          <div className="row" style={{ marginTop: "1rem" }}>
            <Link to="/menu" className="btn">Browse Menu</Link>
            <Link to="/about" className="btn outline">About Us</Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://assets.traveltriangle.com/blog/wp-content/uploads/2017/10/kerala-food.jpg" alt="Kerala Food"/>
        </div>
      </section>

      {/* Today’s Highlights */}
      <section style={{ marginTop: "3rem" }}>
        <h2>Today’s Highlights</h2>
        <div className="grid highlights-grid" style={{ marginTop: "1rem" }}>
          {highlights.length === 0 ? (
            <p className="muted">No highlights today.</p>
          ) : (
            highlights.map(item => (
              <div key={item.id} className="card highlight-card">
                {item.img && (
                  <div className="highlight-img-wrapper">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="highlight-img"
                      style={{
                        width: "100%",
                        height: "180px",
                        objectFit: "cover",
                        borderRadius: "0.5rem",
                        marginBottom: "0.5rem"
                      }}
                    />
                    <span className="ribbon">🔥 Today’s Highlight</span>
                  </div>
                )}
                <h3>{item.name}</h3>
                <p className="muted">{item.desc}</p>
                <span className="tag primary">QR {item.price}</span>
              </div>
            ))
          )}
        </div>

        {/* View More Button */}
        {highlights.length > 0 && (
          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <Link to="/menu" className="btn outline">View More →</Link>
          </div>
        )}
      </section>

      {/* Reviews Section */}
      <section style={{ marginTop: "3rem" }}>
        <h2>Customer Reviews</h2>
        {user && (
          <div className="card" style={{ margin: "1rem 0" }}>
            <h4>Leave a Review</h4>
            <div className="row">
              <select value={rating} onChange={e => setRating(Number(e.target.value))}>
                <option value={5}>⭐⭐⭐⭐⭐</option>
                <option value={4}>⭐⭐⭐⭐</option>
                <option value={3}>⭐⭐⭐</option>
                <option value={2}>⭐⭐</option>
                <option value={1}>⭐</option>
              </select>
              <input
                placeholder="Write your review..."
                value={text}
                onChange={e => setText(e.target.value)}
              />
              <button className="btn" onClick={addReview}>Post</button>
            </div>
          </div>
        )}
        {reviews.length === 0 ? (
          <p className="muted">No reviews yet. Be the first to share!</p>
        ) : (
          <div className="grid" style={{ marginTop: "1rem" }}>
            {reviews.slice().reverse().map(r => (
              <div key={r.id} className="card">
                <p style={{ color: "#facc15" }}>
                  {"⭐".repeat(r.rating)}{" "}
                  <span className="muted" style={{ fontSize: "0.8rem" }}>
                    {new Date(r.date).toLocaleDateString()}
                  </span>
                </p>
                <p>{r.text}</p>
                <p className="muted">— {r.user}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section style={{ margin: "4rem 0", textAlign: "center" }}>
        <h2 style={{ marginBottom: "1rem" }}>Hungry Already?</h2>
        <p className="muted">
          Order your favorite Kerala delicacies now and enjoy fast delivery across Qatar.
        </p>
        <div className="card" style={{ marginTop: "1.5rem", display: "inline-block", padding: "2rem 3rem" }}>
          <Link to="/menu" className="btn" style={{ fontSize: "1.2rem" }}>🍴 Order Now</Link>
        </div>
      </section>
    </div>
  );
}
