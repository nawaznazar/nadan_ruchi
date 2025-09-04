import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { formatQAR } from "../utils/currency.js";
import { fakeApi } from "../data/fakeApi.js";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Checkout() {
  const { items, total, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [zones, setZones] = useState([]);
  const [streets, setStreets] = useState([]);
  const [buildings, setBuildings] = useState([]);

  const [zone, setZone] = useState("");
  const [street, setStreet] = useState("");
  const [building, setBuilding] = useState("");
  const [area, setArea] = useState("");

  const [payment, setPayment] = useState("cash");
  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load zones
  useEffect(() => {
    fakeApi.getZones().then(setZones);
  }, []);

  useEffect(() => {
    if (!zone) return;
    fakeApi.getStreets(zone).then(setStreets);
    setStreet("");
    setBuildings([]);
  }, [zone]);

  useEffect(() => {
    if (!zone || !street) return;
    fakeApi.getBuildings(zone, street).then(setBuildings);
    setBuilding("");
  }, [street]);

  if (!user) {
    return (
      <div className="container">
        <p>Please login to place an order.</p>
      </div>
    );
  }

  const handleCardNumber = (val) => {
    const clean = val.replace(/\D/g, "").slice(0, 16);
    const formatted = clean.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCard({ ...card, number: formatted });
  };

  const handleExpiry = (val) => {
    const clean = val.replace(/\D/g, "").slice(0, 4);
    const formatted = clean.length > 2 ? `${clean.slice(0, 2)}/${clean.slice(2)}` : clean;
    setCard({ ...card, expiry: formatted });
  };

  const validateCard = () => {
    const number = card.number.replace(/\s/g, "");
    if (number.length !== 16) return "Card number must be 16 digits.";
    if (!/^[0-9]+$/.test(number)) return "Card number invalid.";
    if (!/^[A-Za-z ]+$/.test(card.name)) return "Name must be letters only.";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry)) return "Expiry must be MM/YY.";
    if (!/^\d{3,4}$/.test(card.cvv)) return "CVV must be 3–4 digits.";
    return "";
  };

  const handlePlaceOrder = () => {
    if (!zone || !street || !building) {
      setError("Please select full delivery details.");
      return;
    }
    if (!["cash", "card"].includes(payment)) {
      setError("Select a valid payment method.");
      return;
    }
    if (payment === "card") {
      const cardError = validateCard();
      if (cardError) {
        setError(cardError);
        return;
      }
    }

    setError("");
    setProcessing(true);

    setTimeout(() => {
      const orders = JSON.parse(localStorage.getItem("nr_orders") || "[]");
      const newOrder = {
        id: Date.now(),
        email: user.email,
        items,
        total,
        date: new Date(),
        delivery: { zone, street, building, area },
        payment,
        status: "pending",
        adminComment: "",
      };
      orders.push(newOrder);
      localStorage.setItem("nr_orders", JSON.stringify(orders));

      clear();
      setProcessing(false);
      setShowSuccess(true);
    }, 1500);
  };

  return (
    <div className="container">
      <h2>Checkout</h2>

      {/* Order Summary */}
      <div className="card hover-card">
        <h3>Order Summary</h3>
        {items.length === 0 ? (
          <p className="muted">Your cart is empty.</p>
        ) : (
          <>
            {items.map((i) => (
              <div key={i.id} className="row" style={{ justifyContent: "space-between", margin: ".3rem 0" }}>
                <div>{i.qty} × {i.name}</div>
                <div>{formatQAR(i.price * i.qty)}</div>
              </div>
            ))}
            <div className="row" style={{ justifyContent: "space-between", marginTop: ".5rem", fontWeight: "bold" }}>
              <div>Total:</div>
              <div>{formatQAR(total)}</div>
            </div>
          </>
        )}
      </div>

      {/* Delivery Details */}
      <div className="card" style={{ marginTop: "1.5rem" }}>
        <h3>Delivery Details</h3>
        <div className="row" style={{ flexWrap: "wrap", gap: "0.5rem" }}>
          <select value={zone} onChange={(e) => setZone(e.target.value)}>
            <option value="">Select Zone</option>
            {zones.map((z) => (
              <option key={z.zone_number} value={z.zone_number}>{z.zone_number} - {z.zone_name_en}</option>
            ))}
          </select>

          <select value={street} onChange={(e) => setStreet(e.target.value)} disabled={!zone}>
            <option value="">Select Street</option>
            {streets.map((s) => (
              <option key={s.street_number} value={s.street_number}>{s.street_number} - {s.street_name_en}</option>
            ))}
          </select>

          <select value={building} onChange={(e) => setBuilding(e.target.value)} disabled={!street}>
            <option value="">Select Building</option>
            {buildings.map((b) => (
              <option key={b.building_number} value={b.building_number}>{b.building_number}</option>
            ))}
          </select>

          <input placeholder="Area / Landmark (optional)" value={area} onChange={(e) => setArea(e.target.value)} />
        </div>

        {/* Payment */}
        <h3 style={{ marginTop: "1rem" }}>Payment</h3>
        <div className="row" style={{ gap: "1rem" }}>
          <button className={`btn ${payment === "cash" ? "btn-primary" : "btn-outline"}`} onClick={() => setPayment("cash")}>
            Cash on Delivery
          </button>
          <button className={`btn ${payment === "card" ? "btn-primary" : "btn-outline"}`} onClick={() => setPayment("card")}>
            Debit / Credit Card
          </button>
        </div>

        {/* Card Details */}
        {payment === "card" && (
          <div style={{ marginTop: "1rem" }}>
            <input placeholder="Card Number" value={card.number} onChange={(e) => handleCardNumber(e.target.value)} maxLength={19} />
            <input placeholder="Cardholder Name" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} />
            <div className="row" style={{ gap: "0.5rem" }}>
              <input placeholder="MM/YY" value={card.expiry} onChange={(e) => handleExpiry(e.target.value)} maxLength={5} />
              <input placeholder="CVV" value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })} maxLength={4} />
            </div>
          </div>
        )}

        {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}

        <div className="row" style={{ marginTop: "1rem", justifyContent: "flex-end" }}>
          <button className="btn" onClick={handlePlaceOrder} disabled={processing || items.length === 0}>
            {processing ? "Processing..." : "Place Order"}
          </button>
        </div>
      </div>

      {/* ✅ Success Popup (updated to navigate to Orders page) */}
      {showSuccess && (
        <div className="popup-overlay">
          <div className="popup-card" style={{ background: "var(--card)" }}>
            <div className="checkmark">✔</div>
            <h2 style={{ color: "var(--text)" }}>Order Placed!</h2>
            <p style={{ color: "var(--text-muted)" }}>Thank you for your order. We’ll process it shortly.</p>
            <button
              className="btn btn-primary"
              onClick={() => {
                setShowSuccess(false);
                navigate("/orders"); // ✅ Navigate to Orders page
              }}
            >
              Go to Orders
            </button>
          </div>
        </div>
      )}

      {/* Styles */}
      <style>{`
        .container { padding: 1rem; max-width: 600px; margin: auto; }
        .card { background: var(--card); padding: 1rem; border-radius: 1rem; box-shadow: var(--card-shadow); }
        .hover-card:hover { transform: translateY(-2px); transition: 0.2s; }
        .row { display: flex; }
        select, input { padding: 0.5rem; border-radius: 0.5rem; border: 1px solid var(--border); }
        .btn { padding: 0.5rem 1rem; border-radius: 0.5rem; cursor: pointer; }
        .btn-primary { background: var(--primary); color: var(--primary-contrast); border: none; }
        .btn-outline { background: transparent; border: 1px solid var(--primary); color: var(--primary); }
        .popup-overlay { position: fixed; top:0; left:0; right:0; bottom:0; display:flex; justify-content:center; align-items:center; background: rgba(0,0,0,0.5); z-index: 1000; }
        .popup-card { padding: 2rem; text-align: center; border-radius: 1rem; max-width: 400px; animation: scaleIn 0.3s ease-out; box-shadow: var(--card-shadow); }
        .checkmark { width: 80px; height: 80px; border-radius: 50%; background: var(--success); color: var(--primary-contrast); display:flex; align-items:center; justify-content:center; font-size:2rem; margin:0 auto 1rem; animation: pop 0.4s ease; }
        @keyframes scaleIn { 0% { transform: scale(0.5); opacity:0; } 100% { transform: scale(1); opacity:1; } }
        @keyframes pop { 0% { transform: scale(0); } 80% { transform: scale(1.2); } 100% { transform: scale(1); } }
      `}</style>
    </div>
  );
}
