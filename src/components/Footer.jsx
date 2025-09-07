import React from "react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer>
      <div className="container footer-content">
        {/* Left Section: Brand */}
        <div>
          <strong
            style={{
              background: "var(--gradient)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: "1.2rem",
            }}
          >
            Nadan Ruchi
          </strong>
          <br />
          Traditional Kerala Special • Qatar
          <br />
          Al Wakrah, Doha • Hotline:{" "}
          <a
            href="tel:+97455555555"
            style={{
              color: "var(--primary)",
              textDecoration: "underline",
              fontWeight: "600",
            }}
          >
            +974 5555 5555
          </a>
        </div>

        {/* Center Section: Social Icons */}
        <div className="footer-links" style={{ display: "flex", gap: "1rem" }}>
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "var(--glass)",
              border: "1px solid var(--glass-border)",
              color: "var(--primary)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--gradient)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--glass)")}
          >
            <FaFacebookF />
          </a>

          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "var(--glass)",
              border: "1px solid var(--glass-border)",
              color: "var(--primary)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--gradient)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--glass)")}
          >
            <FaInstagram />
          </a>

          <a
            href="https://wa.me/97455555555"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "var(--glass)",
              border: "1px solid var(--glass-border)",
              color: "var(--primary)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--gradient)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--glass)")}
          >
            <FaWhatsapp />
          </a>
        </div>

        {/* Right Section: Copyright */}
        <div className="muted" style={{ textAlign: "right" }}>
          © {new Date().getFullYear()} Nadan Ruchi.
        </div>
      </div>
    </footer>
  );
}
