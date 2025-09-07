import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { formatQAR } from "../utils/currency.js";
import { fakeApi } from "../data/fakeApi.js";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Checkout() {
  // Access cart, authentication, and theme functionality
  const { items, total, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  // State for delivery address components
  const [zones, setZones] = useState([]);
  const [streets, setStreets] = useState([]);
  const [buildings, setBuildings] = useState([]);

  // State for delivery details
  const [zone, setZone] = useState("");
  const [street, setStreet] = useState("");
  const [building, setBuilding] = useState("");
  const [area, setArea] = useState("");

  // State for contact and special instructions
  const [contact, setContact] = useState("");
  const [specialNote, setSpecialNote] = useState("");

  // State for payment information
  const [payment, setPayment] = useState("cash");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });

  // State for UI feedback
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch location data when component mounts or dependencies change
  useEffect(() => { fakeApi.getZones().then(setZones); }, []);
  useEffect(() => { if (!zone) return; fakeApi.getStreets(zone).then(setStreets); setStreet(""); setBuildings([]); }, [zone]);
  useEffect(() => { if (!zone || !street) return; fakeApi.getBuildings(zone, street).then(setBuildings); setBuilding(""); }, [street]);

  // Require user authentication for checkout
  if (!user) return <div className="container"><p>Please login to place an order.</p></div>;

  // Format credit card number with spaces
  const handleCardNumber = val => {
    const clean = val.replace(/\D/g, "").slice(0, 16);
    const formatted = clean.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCard({ ...card, number: formatted });
  };

  // Format expiration date as MM/YY
  const handleExpiry = val => {
    const clean = val.replace(/\D/g, "").slice(0, 4);
    const formatted = clean.length > 2 ? `${clean.slice(0,2)}/${clean.slice(2)}` : clean;
    setCard({ ...card, expiry: formatted });
  };

  // Validate credit card details
  const validateCard = () => {
    const number = card.number.replace(/\s/g,"");
    if(number.length!==16) return "Card number must be 16 digits.";
    if(!/^[0-9]+$/.test(number)) return "Card number invalid.";
    if(!/^[A-Za-z ]+$/.test(card.name)) return "Name must be letters only.";
    if(!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry)) return "Expiry must be MM/YY.";
    if(!/^\d{3,4}$/.test(card.cvv)) return "CVV must be 3–4 digits.";
    return "";
  };

  // Validate Qatar contact number format
  const validateContact = () => {
    if(contact.length !== 8) return "Enter 8 digits after +974.";
    return "";
  };

  // Process order placement with validation
  const handlePlaceOrder = () => {
    if(!zone||!street||!building){ setError("Please select full delivery details."); return; }
    const contactError = validateContact(); if(contactError){ setError(contactError); return; }
    if(!["cash","card"].includes(payment)){ setError("Select a valid payment method."); return; }
    if(payment==="card"){ const cardError = validateCard(); if(cardError){ setError(cardError); return; } }
    setError(""); setProcessing(true);

    // Simulate order processing and save to localStorage
    setTimeout(()=>{
      const orders = JSON.parse(localStorage.getItem("nr_orders")||"[]");
      const newOrder = {
        id:Date.now(), email:user.email, items, total, date:new Date(),
        delivery:{zone, street, building, area},
        contact:`+974${contact}`,
        specialNote, payment,
        card:payment==="card"?card.number:"",
        status:"pending", adminComment:""
      };
      orders.push(newOrder); localStorage.setItem("nr_orders", JSON.stringify(orders));
      clear(); setProcessing(false); setShowSuccess(true);
    },1500);
  };

  return (
    <div className="container" style={{marginTop:"1rem"}}>
      <h2>Checkout</h2>

      {/* Order summary section */}
      <div className="card hover-card">
        <h3>Order Summary</h3>
        {items.length===0?<p className="muted">Your cart is empty.</p>:
          <>
            {items.map(i=>
              <div key={i.id} className="row" style={{justifyContent:"space-between", margin:".3rem 0"}}>
                <div>{i.qty} × {i.name}</div>
                <div>{formatQAR(i.price*i.qty)}</div>
              </div>
            )}
            <div className="row" style={{justifyContent:"space-between", marginTop:".5rem", fontWeight:"bold"}}>
              <div>Total:</div>
              <div>{formatQAR(total)}</div>
            </div>
          </>
        }
      </div>

      {/* Delivery details section */}
      <div className="card" style={{marginTop:"1.5rem"}}>
        <h3>Delivery Details</h3>
        <div className="row" style={{flexWrap:"wrap", gap:"0.5rem"}}>
          <select value={zone} onChange={e=>setZone(e.target.value)}>
            <option value="">Select Zone</option>
            {zones.map(z=><option key={z.zone_number} value={z.zone_number}>{z.zone_number} - {z.zone_name_en}</option>)}
          </select>
          <select value={street} onChange={e=>setStreet(e.target.value)} disabled={!zone}>
            <option value="">Select Street</option>
            {streets.map(s=><option key={s.street_number} value={s.street_number}>{s.street_number} - {s.street_name_en}</option>)}
          </select>
          <select value={building} onChange={e=>setBuilding(e.target.value)} disabled={!street}>
            <option value="">Select Building</option>
            {buildings.map(b=><option key={b.building_number} value={b.building_number}>{b.building_number}</option>)}
          </select>
        </div>

        <input placeholder="Area / Landmark (optional)" value={area} onChange={e=>setArea(e.target.value)} style={{marginTop:"0.5rem", width:"100%"}} />

        <input
          placeholder="+974 XXXX XXXX"
          value={`+974 ${contact}`}
          onChange={e=>{
            const val = e.target.value.replace(/\D/g,"");
            const digits = val.startsWith("974")?val.slice(3):val; 
            setContact(digits.slice(0,8));
          }}
          style={{marginTop:"0.5rem", width:"100%"}}
        />

        <textarea
          placeholder="Delivery / Cooking Instructions or Special Needs (optional)"
          value={specialNote}
          onChange={e=>setSpecialNote(e.target.value)}
          rows="3"
          style={{
            marginTop:"0.5rem",
            width:"100%",
            backgroundColor: theme==="dark"?"#2c2c2c":"#f5f5f5",
            color: theme==="dark"?"#fff":"#000",
            borderRadius:"8px",
            padding:"0.8rem",
            border:`1px solid ${theme==="dark"?"#555":"#ccc"}`
          }}
        />

        {/* Payment method selection */}
        <h3 style={{marginTop:"1rem"}}>Payment</h3>
        <div className="row" style={{gap:"1rem"}}>
          {["cash","card"].map(opt=>{
            const selected = payment===opt;
            return (
              <button
                key={opt}
                onClick={()=>setPayment(opt)}
                style={{
                  flex:1,
                  padding:".9rem",
                  borderRadius:"12px",
                  border:"none",
                  cursor:"pointer",
                  fontWeight:"bold",
                  fontSize:"1rem",
                  position:"relative",
                  overflow:"hidden",
                  transition:"all 0.3s ease",
                  color: selected?"#fff":theme==="dark"?"#fff":"#000",
                  background: selected
                    ? "linear-gradient(135deg, #10b981 0%, #34d399 100%)"
                    : theme==="dark"
                      ? "rgba(255,255,255,0.05)"
                      : "#f5f5f5",
                  boxShadow: selected
                    ? "0 6px 20px rgba(16, 185, 129, 0.5)"
                    : theme==="dark"
                      ? "0 2px 6px rgba(0,0,0,0.5)"
                      : "0 2px 6px rgba(0,0,0,0.1)",
                }}
              >
                {opt==="cash"?"💵 Cash on Delivery":"💳 Debit / Credit Card"}
                {selected && (
                  <span style={{position:"absolute", top:"5px", right:"8px", fontSize:"1.2rem"}}>✔</span>
                )}
              </button>
            )
          })}
        </div>

        {/* Credit card details form (shown when card payment selected) */}
        {payment==="card" && (
          <div style={{
            marginTop:"1rem",
            borderRadius:"12px",
            padding:"1rem",
            background: theme==="dark"?"#1f1f1f":"#fefefe",
            boxShadow: theme==="dark"?"0 4px 12px rgba(0,0,0,0.6)":"0 4px 12px rgba(0,0,0,0.1)"
          }}>
            <div style={{marginBottom:".8rem", fontWeight:"bold"}}>Card Details</div>
            <input placeholder="1234 5678 9012 3456" value={card.number} onChange={e=>handleCardNumber(e.target.value)} maxLength={19} style={{width:"100%", padding:".7rem", borderRadius:"10px", marginBottom:".5rem", border:`1px solid ${theme==="dark"?"#555":"#ccc"}`, background: theme==="dark"?"#2c2c2c":"#f5f5f5", color: theme==="dark"?"#fff":"#000"}} />
            <input placeholder="Cardholder Name" value={card.name} onChange={e=>setCard({...card,name:e.target.value})} style={{width:"100%", padding:".7rem", borderRadius:"10px", marginBottom:".5rem", border:`1px solid ${theme==="dark"?"#555":"#ccc"}`, background: theme==="dark"?"#2c2c2c":"#f5f5f5", color: theme==="dark"?"#fff":"#000"}} />
            <div className="row" style={{gap:"0.5rem"}}>
              <input placeholder="MM/YY" value={card.expiry} onChange={e=>handleExpiry(e.target.value)} maxLength={5} style={{flex:1, padding:".7rem", borderRadius:"10px", border:`1px solid ${theme==="dark"?"#555":"#ccc"}`, background: theme==="dark"?"#2c2c2c":"#f5f5f5", color: theme==="dark"?"#fff":"#000"}} />
              <input placeholder="CVV" value={card.cvv} onChange={e=>setCard({...card,cvv:e.target.value.replace(/\D/g,"").slice(0,4)})} maxLength={4} style={{flex:1, padding:".7rem", borderRadius:"10px", border:`1px solid ${theme==="dark"?"#555":"#ccc"}`, background: theme==="dark"?"#2c2c2c":"#f5f5f5", color: theme==="dark"?"#fff":"#000"}} />
            </div>
          </div>
        )}

        {/* Error message display */}
        {error && <p style={{color:"red", marginTop:"0.5rem"}}>{error}</p>}

        {/* Place order button */}
        <div className="row" style={{marginTop:"1rem", justifyContent:"flex-end"}}>
          <button className="btn" onClick={handlePlaceOrder} disabled={processing||items.length===0}>
            {processing?"Processing...":"Place Order"}
          </button>
        </div>
      </div>

      {/* Success confirmation popup */}
      {showSuccess && (
        <div className="popup-overlay">
          <div className="popup-card" style={{background:"var(--card)"}}>
            <div className="checkmark">✔</div>
            <h2 style={{color:"var(--text)"}}>Order Placed!</h2>
            <p style={{color:"var(--text-muted)"}}>Thank you for your order. We'll process it shortly.</p>
            <button className="btn btn-primary" onClick={()=>{setShowSuccess(false); navigate("/orders");}}>Go to Orders</button>
          </div>
        </div>
      )}
    </div>
  );
}