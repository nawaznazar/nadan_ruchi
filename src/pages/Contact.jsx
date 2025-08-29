import React from 'react';

export default function Contact() {
  return (
    <div className="container">
      <h2>Contact Us</h2>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <p><strong>Location:</strong> Al Wakrah, Doha, Qatar</p>
        <p><strong>Phone:</strong> +974 5555 5555</p>
        <p><strong>Email:</strong> hello@nadanruchi.qa</p>
        <p className="muted">This is a demo frontend — no real orders are processed.</p>
      </div>

      <div className="card">
        <h3>Our Location on Map</h3>
        <iframe
          title="Al Wakrah Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3623.6954600430963!2d51.60319941500136!3d25.18296298390753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e45c3b4e6d6df4d%3A0x4a1f0e3e836f678b!2sAl%20Wakrah%2C%20Doha%2C%20Qatar!5e0!3m2!1sen!2sqa!4v1693300000000!5m2!1sen!2sqa"
          width="100%"
          height="300"
          style={{ border: 0, borderRadius: '1rem' }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}
