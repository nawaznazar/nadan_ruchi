import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { formatQAR } from "../utils/currency.js";
import { PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

export default function AdminMoney() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [collapsedDates, setCollapsedDates] = useState({});
  const [activeQuickFilter, setActiveQuickFilter] = useState("");

  useEffect(() => {
    if (user?.role === "admin") {
      const data = JSON.parse(localStorage.getItem("nr_orders") || "[]");
      setOrders(data);
    }
  }, [user]);

  if (!user || user.role !== "admin") {
    return <div className="container"><p>⛔ Access denied. Admins only.</p></div>;
  }

  // ---------------- QUICK FILTERS ----------------
  const applyQuickFilter = (option) => {
    const today = new Date();
    let start, end;

    if (option === "today") start = end = new Date(today);
    else if (option === "yesterday") {
      const y = new Date(today);
      y.setDate(today.getDate() - 1);
      start = end = y;
    }
    else if (option === "thisWeek") {
      const day = today.getDay();
      start = new Date(today);
      start.setDate(today.getDate() - day);
      end = new Date();
    }
    else if (option === "lastWeek") {
      const day = today.getDay();
      end = new Date(today);
      end.setDate(today.getDate() - day - 1);
      start = new Date(end);
      start.setDate(end.getDate() - 6);
    }
    else if (option === "thisMonth") {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      end = new Date();
    }
    else if (option === "lastMonth") {
      start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      end = new Date(today.getFullYear(), today.getMonth(), 0);
    }

    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
    setActiveQuickFilter(option);
  };

  // ---------------- FILTERED ORDERS ----------------
  const filteredOrders = useMemo(() => {
    let data = [...orders];

    if (startDate) data = data.filter(o => new Date(o.date) >= new Date(startDate));
    if (endDate) data = data.filter(o => new Date(o.date) <= new Date(endDate));
    if (filterStatus !== "all") data = data.filter(o => o.status === filterStatus);
    if (filterPayment !== "all") data = data.filter(o => o.payment === filterPayment);

    if (search.trim()) {
      const lower = search.toLowerCase();
      data = data.filter(o =>
        (o.customerName || o.name || o.userName || o.email || "")
          .toLowerCase().includes(lower) ||
        o.id.toString().includes(lower) ||
        o.items.some(i => i.name.toLowerCase().includes(lower))
      );
    }

    data.sort((a, b) => {
      let aVal, bVal;
      if (sortField === "date") { aVal = new Date(a.date); bVal = new Date(b.date); }
      else if (sortField === "total") { aVal = a.total; bVal = b.total; }
      else if (sortField === "items") {
        aVal = a.items.reduce((sum, i) => sum + i.qty, 0);
        bVal = b.items.reduce((sum, i) => sum + i.qty, 0);
      }
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });

    return data;
  }, [orders, startDate, endDate, filterStatus, filterPayment, search, sortField, sortOrder]);

  // ---------------- SUMMARY ----------------
  const summary = useMemo(() => {
    const stats = { totalRevenue: 0, totalOrders: 0, totalItems: 0, items: {}, cash: 0, card: 0, byStatus: {} };
    filteredOrders.forEach(o => {
      if (o.status === "done") {
        stats.totalRevenue += o.total;
        stats.totalOrders += 1;
        if (o.payment === "cash") stats.cash += o.total;
        else if (o.payment === "card") stats.card += o.total;
        o.items.forEach(i => {
          stats.totalItems += i.qty;
          if (!stats.items[i.name]) stats.items[i.name] = { qty: 0, revenue: 0 };
          stats.items[i.name].qty += i.qty;
          stats.items[i.name].revenue += i.qty * i.price;
        });
      }
      stats.byStatus[o.status] = (stats.byStatus[o.status] || 0) + 1;
    });
    return stats;
  }, [filteredOrders]);

  const sortedItems = useMemo(() => Object.entries(summary.items).sort((a, b) => b[1].qty - a[1].qty), [summary.items]);

  const ordersByDate = useMemo(() => {
    const grouped = {};
    filteredOrders.forEach(o => {
      const d = new Date(o.date).toISOString().split("T")[0];
      if (!grouped[d]) grouped[d] = [];
      grouped[d].push(o);
    });
    return grouped;
  }, [filteredOrders]);

  const toggleCollapse = (date) => setCollapsedDates(prev => ({ ...prev, [date]: !prev[date] }));

  // ---------------- CHART DATA ----------------
  const paymentData = [
    { name: "Cash", value: summary.cash },
    { name: "Card", value: summary.card }
  ];
  const COLORS = ["#32cd32", "#1e90ff"];

  const revenueTrend = Object.entries(ordersByDate).map(([date, os]) => ({
    date,
    revenue: os.filter(o => o.status === "done").reduce((sum, o) => sum + o.total, 0)
  }));

  // ---------------- RENDER ----------------
  return (
    <div className="container">
      <h2>💰 Advanced Money Management & Sales Overview</h2>

      {/* Quick Filters */}
      <div className="row quick-filters" style={{ gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        {["today","yesterday","thisWeek","lastWeek","thisMonth","lastMonth"].map(opt => (
          <button
            key={opt}
            className={`btn outline ${activeQuickFilter === opt ? "active" : ""}`}
            onClick={() => applyQuickFilter(opt)}
          >
            {opt.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="row" style={{ gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <input type="text" placeholder="🔍 Search by customer/order/item..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: "1", padding: "0.5rem" }} />
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="done">Done</option>
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="on the way">On the way</option>
          <option value="cancelled">Cancelled</option>
          <option value="rejected">Rejected</option>
        </select>
        <select value={filterPayment} onChange={e => setFilterPayment(e.target.value)}>
          <option value="all">All Payments</option>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
        </select>
        <select value={sortField} onChange={e => setSortField(e.target.value)}>
          <option value="date">Sort by Date</option>
          <option value="total">Sort by Total</option>
          <option value="items">Sort by Items Qty</option>
        </select>
        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      {/* Summary */}
      <div className="grid" style={{ gap: "1rem", marginBottom: "1rem" }}>
        <div className="card summary-card revenue"><h3>Total Revenue</h3><p>{formatQAR(summary.totalRevenue)}</p></div>
        <div className="card summary-card orders"><h3>Total Orders</h3><p>{summary.totalOrders}</p></div>
        <div className="card summary-card items"><h3>Total Items Sold</h3><p>{summary.totalItems}</p></div>
        <div className="card summary-card cash"><h3>Cash</h3><p>{formatQAR(summary.cash)}</p></div>
        <div className="card summary-card card"><h3>Card</h3><p>{formatQAR(summary.card)}</p></div>
      </div>

      {/* Charts */}
      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
        <div className="card"><h4>Payment Breakdown</h4>
          <PieChart width={300} height={250}>
            <Pie data={paymentData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
              {paymentData.map((entry, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip /><Legend />
          </PieChart>
        </div>
        <div className="card"><h4>Revenue Trend</h4>
          <LineChart width={400} height={250} data={revenueTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" /><YAxis /><Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#ff4d4d" />
          </LineChart>
        </div>
      </div>

      {/* Top Selling Items */}
      <div className="card" style={{ marginTop: "1rem" }}>
        <h4>🏆 Top Selling Items</h4>
        <ul>
          {sortedItems.slice(0, 10).map(([name, data], i) => (
            <li key={name}>
              <strong>{i+1}. {name}</strong> — {data.qty} pcs ({formatQAR(data.revenue)})
            </li>
          ))}
        </ul>
      </div>

      {/* Orders By Date */}
      {Object.entries(ordersByDate).map(([date, orders]) => (
        <div key={date} className="card" style={{ marginBottom: "1rem", padding: "1rem" }}>
          <h3 style={{ cursor: "pointer" }} onClick={() => toggleCollapse(date)}>
            {date} ({orders.length} orders) {collapsedDates[date] ? "▼" : "▲"}
          </h3>
          {!collapsedDates[date] && orders.map(o => (
            <div key={o.id} className={`card order-card ${o.total > 500 ? "high-total" : ""}`}>
              <strong>Order #{o.id} — <span className={`status-badge ${o.status}`}>{o.status.toUpperCase()}</span></strong>
              <p>Customer: {o.customerName || o.name || o.email || "Unknown"} | Contact: {o.contact || "—"}</p>
              <p>Date: {new Date(o.date).toLocaleString()} | Payment: {o.payment} {o.card ? `(${o.card.slice(-4)})` : ""}</p>
              <ul>
                {o.items.map(i => (
                  <li key={i.id}>{i.name} — {i.qty} × {formatQAR(i.price)} = {formatQAR(i.qty * i.price)}</li>
                ))}
              </ul>
              <p><strong>Total:</strong> {formatQAR(o.total)}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
