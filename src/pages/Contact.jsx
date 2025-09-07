import React from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-10">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Get in <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Touch</span>
        </h1>
        <p className="text-gray-600 text-lg md:text-xl">
          We'd love to hear from you! Reach out to us for any queries or feedback.
        </p>
      </div>

      {/* Contact Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="card bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition duration-300">
          <div className="flex items-center mb-4 text-orange-500">
            <FaMapMarkerAlt className="text-2xl mr-3" />
            <h3 className="text-xl font-semibold">Location</h3>
          </div>
          <p>Al Wakrah, Doha, Qatar</p>
        </div>

        <div className="card bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition duration-300">
          <div className="flex items-center mb-4 text-orange-500">
            <FaPhoneAlt className="text-2xl mr-3" />
            <h3 className="text-xl font-semibold">Phone</h3>
          </div>
          <p>
            <a href="tel:+97455555555" className="text-blue-600 hover:underline">
              +974 5555 5555
            </a>
          </p>
        </div>

        <div className="card bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition duration-300">
          <div className="flex items-center mb-4 text-orange-500">
            <FaEnvelope className="text-2xl mr-3" />
            <h3 className="text-xl font-semibold">Email</h3>
          </div>
          <p>
            <a href="mailto:hello@nadanruchi.qa" className="text-blue-600 hover:underline">
              hello@nadanruchi.qa
            </a>
          </p>
        </div>
      </div>

      {/* Map Section */}
      <div className="card shadow-lg rounded-xl overflow-hidden">
        <h3 className="text-2xl font-semibold mb-4 px-6 pt-6">Our Location on Map</h3>
        <iframe
          title="Al Wakrah Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3623.6954600430963!2d51.60319941500136!3d25.18296298390753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e45c3b4e6d6df4d%3A0x4a1f0e3e836f678b!2sAl%20Wakrah%2C%20Doha%2C%20Qatar!5e0!3m2!1sen!2sqa!4v1693300000000!5m2!1sen!2sqa"
          width="100%"
          height="400"
          style={{ border: 0 }}
          className="rounded-b-xl"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}
