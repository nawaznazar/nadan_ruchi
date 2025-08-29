import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container">
      {/* Hero section */}
      <section className="hero">
        <div>
          <h1 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)" }}>
            Taste of Kerala in Qatar 🇶🇦
          </h1>
          <p className="muted">
            Only Kerala & Malayali specials — breakfast, lunch, evening snacks,
            and dinner. Fresh, homely, and authentic.
          </p>
          <div className="row" style={{ marginTop: ".6rem" }}>
            <Link to="/menu" className="btn">
              Browse Menu
            </Link>
            <Link to="/about" className="btn outline">
              About Us
            </Link>
          </div>
        </div>
        <div className="card">
          <h3>Today’s Highlights</h3>
          <ul>
            <li>Kerala Meals (Veg)</li>
            <li>Kappa & Meen Curry</li>
            <li>Pazham Pori</li>
          </ul>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={{ marginTop: "2rem" }}>
        <h2>What Our Customers Say</h2>
        <div className="grid" style={{ marginTop: "1rem" }}>
          <div className="card">
            <p>“Best Kerala food in Qatar! The taste reminds me of home in Thrissur. Highly recommend the Kappa & Meen Curry.”</p>
            <p className="muted">— Anoop, Doha</p>
            <p style={{ color: "#facc15" }}>⭐⭐⭐⭐⭐</p>
          </div>
          <div className="card">
            <p>“Authentic Malayali flavors, very clean and affordable. My kids love the Pazham Pori for evening snacks.”</p>
            <p className="muted">— Fathima, Al Wakrah</p>
            <p style={{ color: "#facc15" }}>⭐⭐⭐⭐⭐</p>
          </div>
          <div className="card">
            <p>“The Malabar Chicken Biryani is just like what we get back in Kozhikode. Great service and delivery on time.”</p>
            <p className="muted">— Niyas, Doha</p>
            <p style={{ color: "#facc15" }}>⭐⭐⭐⭐⭐</p>
          </div>
          <div className="card">
            <p>“Tried the Kerala Sadya on Onam — absolutely delightful! Every dish was perfect.”</p>
            <p className="muted">— Sreelakshmi, Mesaimeer</p>
            <p style={{ color: "#facc15" }}>⭐⭐⭐⭐⭐</p>
          </div>
          <div className="card">
            <p>“The seafood options are amazing! Fresh and full of flavor. Highly recommended for Malabar lovers.”</p>
            <p className="muted">— Rafeeq, Doha</p>
            <p style={{ color: "#facc15" }}>⭐⭐⭐⭐⭐</p>
          </div>
          <div className="card">
            <p>“Affordable prices, fast delivery, and authentic taste. I order almost every weekend!”</p>
            <p className="muted">— Nisha, Al Wakrah</p>
            <p style={{ color: "#facc15" }}>⭐⭐⭐⭐⭐</p>
          </div>
        </div>
      </section>
    </div>
  );
}
