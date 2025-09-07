import React, { useState } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { useAuth } from "../context/AuthContext.jsx";

// Local storage key for storing feedback data
const FEEDBACK_KEY = "nr_feedbacks";

export default function Contact() {
  const { user } = useAuth();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  // Handle feedback form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) return alert("Please login to send feedback!");

    // Get existing feedbacks or initialize empty array
    const feedbacks = JSON.parse(localStorage.getItem(FEEDBACK_KEY) || "[]");
    
    // Add new feedback with timestamp and user info
    feedbacks.push({
      id: Date.now(),
      name: user.name,
      email: user.email,
      contactNumber: user.contactNumber || "",
      subject,
      message,
      date: new Date().toISOString(),
    });
    
    // Save updated feedbacks to localStorage
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(feedbacks));

    // Reset form and show success message
    setSubject("");
    setMessage("");
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Page header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Get in <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Touch</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl">
          We'd love to hear from you! Reach out to us for any queries or feedback.
        </p>
      </div>

      {/* Contact information cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {/* Location card */}
        <div className="card bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 hover:shadow-2xl transition duration-300">
          <div className="flex items-center mb-4 text-orange-500">
            <FaMapMarkerAlt className="text-2xl mr-3" />
            <h3 className="text-xl font-semibold">Location</h3>
          </div>
          <p className="dark:text-gray-200">Al Wakrah, Doha, Qatar</p>
        </div>

        {/* Phone card */}
        <div className="card bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 hover:shadow-2xl transition duration-300">
          <div className="flex items-center mb-4 text-orange-500">
            <FaPhoneAlt className="text-2xl mr-3" />
            <h3 className="text-xl font-semibold">Phone</h3>
          </div>
          <p>
            <a href="tel:+97455555555" className="text-blue-600 dark:text-blue-400 hover:underline">
              +974 5555 5555
            </a>
          </p>
        </div>

        {/* Email card */}
        <div className="card bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 hover:shadow-2xl transition duration-300">
          <div className="flex items-center mb-4 text-orange-500">
            <FaEnvelope className="text-2xl mr-3" />
            <h3 className="text-xl font-semibold">Email</h3>
          </div>
          <p>
            <a href="mailto:hello@nadanruchi.qa" className="text-blue-600 dark:text-blue-400 hover:underline">
              hello@nadanruchi.qa
            </a>
          </p>
        </div>
      </div>

      {/* Feedback form section - only shown to logged-in users */}
      {user ? (
        <div className="card shadow-lg rounded-xl p-6 mb-12 bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
          <h3 className="text-2xl font-semibold mb-4 text-orange-600 dark:text-orange-400">Send Your Feedback</h3>
          <form onSubmit={handleSubmit} className="grid gap-4">
            {/* Pre-filled user information (read-only) */}
            <input
              type="text"
              value={user.name}
              disabled
              className="border rounded-md p-3 bg-gray-100 dark:bg-gray-700 dark:text-gray-200"
              placeholder="Name"
            />
            <input
              type="email"
              value={user.email}
              disabled
              className="border rounded-md p-3 bg-gray-100 dark:bg-gray-700 dark:text-gray-200"
              placeholder="Email"
            />
            <input
              type="text"
              value={user.contactNumber || ""}
              disabled
              className="border rounded-md p-3 bg-gray-100 dark:bg-gray-700 dark:text-gray-200"
              placeholder="Contact Number"
            />
            
            {/* Editable feedback fields */}
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="border rounded-md p-3 bg-white dark:bg-gray-700 dark:text-gray-200"
              placeholder="Subject"
              required
            />
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border rounded-md p-3 h-32 bg-white dark:bg-gray-700 dark:text-gray-200"
              placeholder="Your message..."
              required
            />

            <button className="btn mt-2 bg-orange-500 hover:bg-red-500 text-white py-2 rounded-lg" type="submit">
              Send Feedback
            </button>
          </form>
          {/* Success message */}
          {success && <div className="text-green-600 dark:text-green-400 mt-2 font-medium">✅ Feedback sent successfully!</div>}
        </div>
      ) : (
        <p className="text-red-500 dark:text-red-400 mb-12">Please login to send feedback.</p>
      )}

      {/* Google Maps location embed */}
      <div className="card shadow-lg rounded-xl overflow-hidden">
        <h3 className="text-2xl font-semibold mb-4 px-6 pt-6 dark:text-gray-200">Our Location on Map</h3>
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