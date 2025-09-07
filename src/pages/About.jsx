import React from "react";

export default function About() {
  return (
    <div className="container">
      {/* Hero Section with brand introduction */}
      <div className="hero">
        <div className="hero-content">
          <h1>About <span style={{ background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Nadan Ruchi</span></h1>
          <p>
            Nadan Ruchi is a Qatar-based Kerala traditional food brand serving authentic Malayali specials — from hearty breakfasts to soulful dinners.
            Every dish is crafted with homestyle recipes, rich coconut flavors, and spices that remind you of home.
          </p>
        </div>
        <div className="hero-image">
          <img src="https://clubmahindra.gumlet.io/blog/media/section_images/lesserknow-a2e0f1c06adedef.webp?w=376&dpr=2.6" alt="Traditional Kerala cuisine from Nadan Ruchi" />
        </div>
      </div>

      {/* Key features and value propositions */}
      <div className="grid">
        <div className="card hover-card">
          <div className="highlight-img-wrapper">
            <img 
              src="https://static.india.com/wp-content/uploads/2024/10/feature-2024-10-21T093052.339.jpg?impolicy=Medium_Widthonly&w=350&h=263" 
              alt="Authentic Kerala cuisine with traditional flavors" 
              className="highlight-img" 
            />
          </div>
          <h3 className="card-title">Authentic Kerala Flavors</h3>
          <p>Only Kerala & Malayali dishes, made with love and tradition.</p>
        </div>

        <div className="card hover-card">
          <div className="highlight-img-wrapper">
            <img 
              src="https://img.freepik.com/premium-vector/financial-management-concept-investment-flat-design-payment-finance-with-money_33771-1061.jpg" 
              alt="Clear and honest pricing structure" 
              className="highlight-img" 
            />
          </div>
          <h3 className="card-title">Transparent Pricing</h3>
          <p>Clear and honest pricing in Qatari Riyals (QR).</p>
        </div>

        <div className="card hover-card">
          <div className="highlight-img-wrapper">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCqRg8eZEGBDoz58j93HYQQ0_KTV0t3nskLQ&s" 
              alt="Modern website with user-friendly features" 
              className="highlight-img" 
            />
          </div>
          <h3 className="card-title">Modern Experience</h3>
          <p>Fully responsive website with dark mode for a smooth experience.</p>
        </div>
      </div>

      {/* Call to action encouraging menu exploration */}
      <div className="center" style={{ marginTop: '3rem' }}>
        <div className="highlight-img-wrapper" style={{ width: '60px', height: '60px', margin: '0 auto', borderRadius: '50%', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          ❤️
        </div>
        <h3 className="card-title">Made with Love in Qatar</h3>
        <p className="muted" style={{ maxWidth: '600px', margin: '0.5rem auto 1.5rem auto' }}>
          Bringing Malayali food culture to your table, wherever you are in Qatar.
        </p>
        <a href="/menu" className="btn btn-primary">Explore Our Menu</a>
      </div>
    </div>
  );
}