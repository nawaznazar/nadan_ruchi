import React, { useState } from "react";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaUtensils, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer style={{ 
      background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
      color: "white",
      padding: "3rem 0 1.5rem",
      marginTop: "3rem",
      borderTop: "1px solid #444"
    }}>
      <div className="container">
        {/* Main footer content */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
          gap: "2rem",
          marginBottom: "2rem"
        }}>
          {/* Brand section */}
          <div>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              marginBottom: "1rem",
              fontSize: "1.5rem",
              fontWeight: "bold"
            }}>
              <FaUtensils style={{ marginRight: "0.5rem", color: "#ff6b35" }} />
              <span style={{
                background: "linear-gradient(135deg, #ff6b35, #f7931e)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                Nadan Ruchi
              </span>
            </div>
            <p style={{ 
              color: "#ccc", 
              lineHeight: "1.6",
              marginBottom: "1rem"
            }}>
              Authentic Kerala cuisine with traditional flavors and modern presentation. 
              Experience the taste of God's Own Country in the heart of Qatar.
            </p>
            
            {/* Contact info */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "white" }}>
                <FaMapMarkerAlt style={{ color: "#ff6b35" }} />
                <span>Al Wakrah, Doha, Qatar</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "white" }}>
                <FaPhoneAlt style={{ color: "#ff6b35" }} />
                <a
                  href="tel:+97455555555"
                  style={{
                    color: "white",
                    textDecoration: "none",
                    transition: "color 0.3s ease",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#ff6b35"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "white"}
                >
                  +974 5555 5555
                </a>
              </div>
            </div>
          </div>

          {/* Quick links section */}
          <div>
            <h4 style={{ 
              marginBottom: "1rem", 
              color: "white",
              borderBottom: "2px solid #ff6b35",
              paddingBottom: "0.5rem",
              display: "inline-block"
            }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {[
                { name: "Our Menu", path: "/menu" },
                { name: "About Us", path: "/about" },
                { name: "Contact", path: "/contact" },
                { name: "Privacy Policy", path: "/privacy" },
                { name: "Terms of Service", path: "/terms" }
              ].map((link, index) => (
                <li key={index} style={{ marginBottom: "0.5rem" }}>
                  <a
                    href={link.path}
                    style={{
                      color: "#ccc",
                      textDecoration: "none",
                      transition: "all 0.3s ease",
                      display: "inline-block"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#ff6b35";
                      e.currentTarget.style.transform = "translateX(5px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#ccc";
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Opening hours section */}
          <div>
            <h4 style={{ 
              marginBottom: "1rem", 
              color: "white",
              borderBottom: "2px solid #ff6b35",
              paddingBottom: "0.5rem",
              display: "inline-block"
            }}>
              Opening Hours
            </h4>
            <div style={{ color: "#ccc" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span>Monday - Friday</span>
                <span>10:00 AM - 11:00 PM</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span>Saturday - Sunday</span>
                <span>9:00 AM - 12:00 AM</span>
              </div>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between",
                color: "#ff6b35",
                fontWeight: "bold"
              }}>
                <span>24/7 Delivery</span>
                <span>Available</span>
              </div>
            </div>
          </div>

          {/* Social media section */}
          <div>
            <h4 style={{ 
              marginBottom: "1rem", 
              color: "white",
              borderBottom: "2px solid #ff6b35",
              paddingBottom: "0.5rem",
              display: "inline-block"
            }}>
              Follow Us
            </h4>
            <p style={{ color: "#ccc", marginBottom: "1rem" }}>
              Stay connected for exclusive offers and updates
            </p>
            
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
              {[
                { icon: FaFacebookF, url: "https://www.facebook.com", color: "#1877F2" },
                { icon: FaInstagram, url: "https://www.instagram.com", color: "#E4405F" },
                { icon: FaWhatsapp, url: "https://wa.me/97455555555", color: "#25D366" }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "45px",
                    height: "45px",
                    borderRadius: "50%",
                    background: social.color,
                    color: "white",
                    transition: "all 0.3s ease",
                    transform: "scale(1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.1)";
                    e.currentTarget.style.boxShadow = `0 0 15px ${social.color}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <social.icon />
                </a>
              ))}
            </div>

            {/* Newsletter signup */}
            <div>
              <p style={{ color: "#ccc", marginBottom: "0.5rem" }}>
                Subscribe for offers
              </p>
              <form onSubmit={handleSubscribe} style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    padding: "0.5rem",
                    borderRadius: "4px",
                    border: "1px solid #555",
                    flex: "1",
                    background: "#333",
                    color: "white",
                    outline: "none"
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: "0.5rem 1rem",
                    background: "linear-gradient(135deg, #ff6b35, #f7931e)",
                    border: "none",
                    borderRadius: "4px",
                    color: "white",
                    cursor: "pointer",
                    transition: "transform 0.2s ease"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom section with copyright */}
        <div style={{ 
          borderTop: "1px solid #444",
          paddingTop: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem"
        }}>
          <div style={{ color: "#ccc" }}>
            © {new Date().getFullYear()} Nadan Ruchi. All rights reserved.
          </div>
          <div style={{ display: "flex", gap: "1rem", color: "#ccc" }}>
            <span>Made with ❤️ in Qatar</span>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp button */}
      <a
        href="https://wa.me/97455555555"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "#25D366",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.5rem",
          boxShadow: "0 4px 20px rgba(37, 211, 102, 0.4)",
          transition: "all 0.3s ease",
          zIndex: 1000,
          animation: "pulse 2s infinite"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow = "0 6px 25px rgba(37, 211, 102, 0.6)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(37, 211, 102, 0.4)";
        }}
      >
        <FaWhatsapp />
      </a>

      {/* Subscription success popup */}
      {subscribed && (
        <div style={{
          position: "fixed",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          background: "#4BB543",
          color: "white",
          padding: "1rem 2rem",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          zIndex: 1000,
          animation: "slideUp 0.3s ease-out"
        }}>
          ✅ Subscribed successfully! You'll receive our offers soon.
        </div>
      )}

      {/* Animation keyframes */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translate(-50%, 20px);
          }
          to { 
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}</style>
    </footer>
  );
}
