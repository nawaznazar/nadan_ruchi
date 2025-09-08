import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx"; // Import useTheme
import { formatQAR } from "../utils/currency.js";
import { PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, ResponsiveContainer } from "recharts";

export default function AdminMoney() {
  const { user } = useAuth();
  const { theme } = useTheme(); // Get theme from ThemeContext
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
  const [viewMode, setViewMode] = useState("detailed");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [exporting, setExporting] = useState(false);
  
  // Use theme from ThemeContext instead of detecting it manually
  const isDarkMode = theme === 'dark';

  // Load orders data when admin user is authenticated
  useEffect(() => {
    if (user?.role === "admin") {
      const data = JSON.parse(localStorage.getItem("nr_orders") || "[]");
      setOrders(data);
    }
  }, [user]);

  // Restrict access to admin users only
  if (!user || user.role !== "admin") {
    return <div className="container"><p>⛔ Access denied. Admins only.</p></div>;
  }

  // ---------------- QUICK FILTERS ----------------
  const applyQuickFilter = (option) => {
    const today = new Date();
    let start, end;

    // Calculate date ranges for quick filter options
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
    else if (option === "last7days") {
      start = new Date(today);
      start.setDate(today.getDate() - 7);
      end = new Date();
    }
    else if (option === "last30days") {
      start = new Date(today);
      start.setDate(today.getDate() - 30);
      end = new Date();
    }

    // Apply the calculated date range
    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
    setActiveQuickFilter(option);
  };

  // ---------------- FILTERED ORDERS ----------------
  const filteredOrders = useMemo(() => {
    let data = [...orders];

    // Apply date range filters
    if (startDate) data = data.filter(o => new Date(o.date) >= new Date(startDate));
    if (endDate) data = data.filter(o => new Date(o.date) <= new Date(endDate));
    
    // Apply status and payment method filters
    if (filterStatus !== "all") data = data.filter(o => o.status === filterStatus);
    if (filterPayment !== "all") data = data.filter(o => o.payment === filterPayment);

    // Apply search filter across customer info and items
    if (search.trim()) {
      const lower = search.toLowerCase();
      data = data.filter(o =>
        (o.customerName || o.name || o.userName || o.email || "")
          .toLowerCase().includes(lower) ||
        o.id.toString().includes(lower) ||
        o.items.some(i => i.name.toLowerCase().includes(lower))
      );
    }

    // Sort data based on selected field and order
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

  // ---------------- SUMMARY STATISTICS ----------------
  const summary = useMemo(() => {
    const stats = { 
      totalRevenue: 0, 
      totalOrders: 0, 
      totalItems: 0, 
      items: {}, 
      cash: 0, 
      card: 0, 
      byStatus: {},
      byHour: Array(24).fill(0).map((_, i) => ({ hour: i, revenue: 0, orders: 0 })),
      byCategory: {},
      averageOrderValue: 0
    };
    
    // Calculate various statistics from filtered orders
    filteredOrders.forEach(o => {
      if (o.status === "done") {
        stats.totalRevenue += o.total;
        stats.totalOrders += 1;
        if (o.payment === "cash") stats.cash += o.total;
        else if (o.payment === "card") stats.card += o.total;
        
        // Track item-level statistics
        o.items.forEach(i => {
          stats.totalItems += i.qty;
          if (!stats.items[i.name]) stats.items[i.name] = { qty: 0, revenue: 0 };
          stats.items[i.name].qty += i.qty;
          stats.items[i.name].revenue += i.qty * i.price;
          
          // Track category statistics
          if (i.category) {
            if (!stats.byCategory[i.category]) stats.byCategory[i.category] = { revenue: 0, orders: 0 };
            stats.byCategory[i.category].revenue += i.qty * i.price;
            stats.byCategory[i.category].orders += 1;
          }
        });
        
        // Track hourly statistics
        const hour = new Date(o.date).getHours();
        stats.byHour[hour].revenue += o.total;
        stats.byHour[hour].orders += 1;
      }
      // Track order status counts
      stats.byStatus[o.status] = (stats.byStatus[o.status] || 0) + 1;
    });
    
    // Calculate average order value
    stats.averageOrderValue = stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0;
    
    return stats;
  }, [filteredOrders]);

  // Sort items by quantity sold for top sellers list
  const sortedItems = useMemo(() => Object.entries(summary.items).sort((a, b) => b[1].qty - a[1].qty), [summary.items]);

  // Group orders by date for date-based views
  const ordersByDate = useMemo(() => {
    const grouped = {};
    filteredOrders.forEach(o => {
      const d = new Date(o.date).toISOString().split("T")[0];
      if (!grouped[d]) grouped[d] = [];
      grouped[d].push(o);
    });
    return grouped;
  }, [filteredOrders]);

  // Toggle collapse/expand for date groups
  const toggleCollapse = (date) => setCollapsedDates(prev => ({ ...prev, [date]: !prev[date] }));

  // ---------------- CHART DATA PREPARATION ----------------
  const paymentData = [
    { name: "Cash", value: summary.cash },
    { name: "Card", value: summary.card }
  ];
  
  const statusData = Object.entries(summary.byStatus).map(([name, value]) => ({ name, value }));
  const categoryData = Object.entries(summary.byCategory).map(([name, data]) => ({ name, revenue: data.revenue }));
  
  const COLORS = ["#32cd32", "#1e90ff", "#ff4d4d", "#ffa500", "#9370db", "#20b2aa"];

  // Prepare revenue trend data for line chart
  const revenueTrend = Object.entries(ordersByDate).map(([date, os]) => ({
    date,
    revenue: os.filter(o => o.status === "done").reduce((sum, o) => sum + o.total, 0),
    orders: os.filter(o => o.status === "done").length
  }));

  // Format hourly data for chart
  const hourlyData = summary.byHour.map(hourData => ({
    hour: `${hourData.hour}:00`,
    revenue: hourData.revenue,
    orders: hourData.orders
  }));

  // Custom tooltip style for charts
  const CustomTooltip = ({ active, payload, label, formatter }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{
          backgroundColor: isDarkMode ? '#333' : '#fff',
          border: `1px solid ${isDarkMode ? '#555' : '#ccc'}`,
          padding: '10px',
          borderRadius: '4px',
          color: isDarkMode ? '#fff' : '#333'
        }}>
          <p>{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${formatter ? formatter(entry.value) : entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // ---------------- EXPORT FUNCTIONALITY ----------------
  const exportToCSV = () => {
    setExporting(true);
    
    // Prepare CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add summary section
    csvContent += "SUMMARY\n";
    csvContent += `Total Revenue,${formatQAR(summary.totalRevenue)}\n`;
    csvContent += `Total Orders,${summary.totalOrders}\n`;
    csvContent += `Total Items Sold,${summary.totalItems}\n`;
    csvContent += `Cash Payments,${formatQAR(summary.cash)}\n`;
    csvContent += `Card Payments,${formatQAR(summary.card)}\n`;
    csvContent += `Average Order Value,${formatQAR(summary.averageOrderValue)}\n\n`;
    
    // Add top items section
    csvContent += "TOP SELLING ITEMS\n";
    csvContent += "Rank,Item Name,Quantity,Revenue\n";
    sortedItems.slice(0, 10).forEach(([name, data], i) => {
      csvContent += `${i+1},${name},${data.qty},${formatQAR(data.revenue)}\n`;
    });
    csvContent += "\n";
    
    // Add order details section
    csvContent += "ORDER DETAILS\n";
    csvContent += "Order ID,Date,Customer,Status,Payment Method,Total Amount\n";
    filteredOrders.forEach(order => {
      csvContent += `${order.id},${new Date(order.date).toLocaleString()},${order.customerName || order.name || order.email || "Unknown"},${order.status},${order.payment},${formatQAR(order.total)}\n`;
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sales-report-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setExporting(false);
  };

  // ---------------- RENDER ----------------
  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2>💰 Advanced Money Management & Sales Overview</h2>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button 
            className={`btn outline ${viewMode === "summary" ? "active" : ""}`}
            onClick={() => setViewMode("summary")}
          >
            Summary View
          </button>
          <button 
            className={`btn outline ${viewMode === "detailed" ? "active" : ""}`}
            onClick={() => setViewMode("detailed")}
          >
            Detailed View
          </button>
          <button 
            className="btn outline" 
            onClick={exportToCSV}
            disabled={exporting}
          >
            {exporting ? "Exporting..." : "📊 Export CSV"}
          </button>
        </div>
      </div>

      {/* Quick date range filters */}
      <div className="row quick-filters" style={{ gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        {["today","yesterday","last7days","thisWeek","lastWeek","last30days","thisMonth","lastMonth"].map(opt => (
          <button
            key={opt}
            className={`btn outline ${activeQuickFilter === opt ? "active" : ""}`}
            onClick={() => applyQuickFilter(opt)}
          >
            {opt.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Advanced filtering options - FIXED BACKGROUND */}
      <div className="filter-section" style={{ 
        marginBottom: "1.5rem", 
        padding: "1rem", 
        borderRadius: "8px",
        background: isDarkMode ? "#2a2a2a" : "#f8f9fa",
        border: `1px solid ${isDarkMode ? "#444" : "#dee2e6"}`
      }}>
        <h4 style={{ margin: "0 0 0.75rem 0", color: isDarkMode ? "#fff" : "#495057" }}>Filter & Search Options</h4>
        
        <div className="row" style={{ gap: "0.75rem", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: "1", minWidth: "250px" }}>
            <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem", color: isDarkMode ? "#ccc" : "#6c757d" }}>
              Search Orders
            </label>
            <div style={{ position: "relative" }}>
              <span style={{ 
                position: "absolute", 
                left: "0.75rem", 
                top: "50%", 
                transform: "translateY(-50%)",
                color: isDarkMode ? "#aaa" : "#6c757d"
              }}>
                🔍
              </span>
              <input 
                type="text" 
                placeholder="Customer, order ID, or item..." 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                style={{ 
                  width: "100%", 
                  padding: "0.625rem 0.75rem 0.625rem 2.25rem", 
                  background: isDarkMode ? '#333' : '#fff', 
                  color: isDarkMode ? '#fff' : '#333',
                  border: `1px solid ${isDarkMode ? '#555' : '#ced4da'}`,
                  borderRadius: "6px",
                  fontSize: "0.9rem"
                }} 
              />
            </div>
          </div>
          
          <div style={{ minWidth: "150px" }}>
            <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem", color: isDarkMode ? "#ccc" : "#6c757d" }}>
              Start Date
            </label>
            <input 
              type="date" 
              value={startDate} 
              onChange={e => setStartDate(e.target.value)} 
              style={{ 
                width: "100%",
                padding: "0.625rem 0.75rem", 
                background: isDarkMode ? '#333' : '#fff', 
                color: isDarkMode ? '#fff' : '#333',
                border: `1px solid ${isDarkMode ? '#555' : '#ced4da'}`,
                borderRadius: "6px",
                fontSize: "0.9rem"
              }}
            />
          </div>
          
          <div style={{ minWidth: "150px" }}>
            <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem", color: isDarkMode ? "#ccc" : "#6c757d" }}>
              End Date
            </label>
            <input 
              type="date" 
              value={endDate} 
              onChange={e => setEndDate(e.target.value)} 
              style={{ 
                width: "100%",
                padding: "0.625rem 0.75rem", 
                background: isDarkMode ? '#333' : '#fff', 
                color: isDarkMode ? '#fff' : '#333',
                border: `1px solid ${isDarkMode ? '#555' : '#ced4da'}`,
                borderRadius: "6px",
                fontSize: "0.9rem"
              }}
            />
          </div>
        </div>
        
        <div className="row" style={{ gap: "0.75rem", flexWrap: "wrap", marginTop: "0.75rem" }}>
          <div style={{ minWidth: "150px" }}>
            <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem", color: isDarkMode ? "#ccc" : "#6c757d" }}>
              Order Status
            </label>
            <select 
              value={filterStatus} 
              onChange={e => setFilterStatus(e.target.value)}
              style={{ 
                width: "100%",
                padding: "0.625rem 0.75rem", 
                background: isDarkMode ? '#333' : '#fff', 
                color: isDarkMode ? '#fff' : '#333',
                border: `1px solid ${isDarkMode ? '#555' : '#ced4da'}`,
                borderRadius: "6px",
                fontSize: "0.9rem",
                cursor: "pointer"
              }}
            >
              <option value="all">All Statuses</option>
              <option value="done">Done</option>
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="on the way">On the way</option>
              <option value="cancelled">Cancelled</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          <div style={{ minWidth: "150px" }}>
            <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem", color: isDarkMode ? "#ccc" : "#6c757d" }}>
              Payment Method
            </label>
            <select 
              value={filterPayment} 
              onChange={e => setFilterPayment(e.target.value)}
              style={{ 
                width: "100%",
                padding: "0.625rem 0.75rem", 
                background: isDarkMode ? '#333' : '#fff', 
                color: isDarkMode ? '#fff' : '#333',
                border: `1px solid ${isDarkMode ? '#555' : '#ced4da'}`,
                borderRadius: "6px",
                fontSize: "0.9rem",
                cursor: "pointer"
              }}
            >
              <option value="all">All Payments</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
            </select>
          </div>
          
          <div style={{ minWidth: "150px" }}>
            <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem", color: isDarkMode ? "#ccc" : "#6c757d" }}>
              Sort By
            </label>
            <select 
              value={sortField} 
              onChange={e => setSortField(e.target.value)}
              style={{ 
                width: "100%",
                padding: "0.625rem 0.75rem", 
                background: isDarkMode ? '#333' : '#fff', 
                color: isDarkMode ? '#fff' : '#333',
                border: `1px solid ${isDarkMode ? '#555' : '#ced4da'}`,
                borderRadius: "6px",
                fontSize: "0.9rem",
                cursor: "pointer"
              }}
            >
              <option value="date">Date</option>
              <option value="total">Total Amount</option>
              <option value="items">Items Quantity</option>
            </select>
          </div>
          
          <div style={{ minWidth: "150px" }}>
            <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem", color: isDarkMode ? "#ccc" : "#6c757d" }}>
              Order Direction
            </label>
            <select 
              value={sortOrder} 
              onChange={e => setSortOrder(e.target.value)}
              style={{ 
                width: "100%",
                padding: "0.625rem 0.75rem", 
                background: isDarkMode ? '#333' : '#fff', 
                color: isDarkMode ? '#fff' : '#333',
                border: `1px solid ${isDarkMode ? '#555' : '#ced4da'}`,
                borderRadius: "6px",
                fontSize: "0.9rem",
                cursor: "pointer"
              }}
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary statistics cards */}
      <div className="grid" style={{ gap: "1rem", marginBottom: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        <div className="card summary-card revenue">
          <h3>Total Revenue</h3>
          <p>{formatQAR(summary.totalRevenue)}</p>
          <small>{summary.totalOrders} orders</small>
        </div>
        <div className="card summary-card orders">
          <h3>Total Orders</h3>
          <p>{summary.totalOrders}</p>
          <small>{summary.totalItems} items sold</small>
        </div>
        <div className="card summary-card avg-order">
          <h3>Avg Order Value</h3>
          <p>{formatQAR(summary.averageOrderValue)}</p>
        </div>
        <div className="card summary-card cash">
          <h3>Cash Payments</h3>
          <p>{formatQAR(summary.cash)}</p>
          <small>{summary.cash > 0 ? Math.round((summary.cash / summary.totalRevenue) * 100) : 0}% of revenue</small>
        </div>
        <div className="card summary-card card">
          <h3>Card Payments</h3>
          <p>{formatQAR(summary.card)}</p>
          <small>{summary.card > 0 ? Math.round((summary.card / summary.totalRevenue) * 100) : 0}% of revenue</small>
        </div>
      </div>

      {/* Data visualization charts */}
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
        <div className="card">
          <h4>Payment Breakdown</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={paymentData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                {paymentData.map((entry, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip formatter={formatQAR} />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="card">
          <h4>Revenue Trend</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#555" : "#ccc"} />
              <XAxis dataKey="date" stroke={isDarkMode ? "#fff" : "#333"} />
              <YAxis stroke={isDarkMode ? "#fff" : "#333"} />
              <Tooltip content={<CustomTooltip formatter={formatQAR} />} />
              <Line type="monotone" dataKey="revenue" stroke="#ff4d4d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="card">
          <h4>Orders by Status</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#555" : "#ccc"} />
              <XAxis dataKey="name" stroke={isDarkMode ? "#fff" : "#333"} />
              <YAxis stroke={isDarkMode ? "#fff" : "#333"} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="card">
          <h4>Revenue by Hour</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#555" : "#ccc"} />
              <XAxis dataKey="hour" stroke={isDarkMode ? "#fff" : "#333"} />
              <YAxis stroke={isDarkMode ? "#fff" : "#333"} />
              <Tooltip content={<CustomTooltip formatter={formatQAR} />} />
              <Bar dataKey="revenue" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top selling items list */}
      <div className="card" style={{ marginTop: "1rem" }}>
        <h4>🏆 Top Selling Items</h4>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
          {sortedItems.slice(0, 6).map(([name, data], i) => (
            <div key={name} className="top-item-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong>{i+1}. {name}</strong>
                <span className="tag primary">{data.qty} sold</span>
              </div>
              <div style={{ marginTop: "0.5rem" }}>
                <div>Revenue: {formatQAR(data.revenue)}</div>
                <div>Avg Price: {formatQAR(data.revenue / data.qty)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Orders view based on selected mode */}
      {viewMode === "detailed" && (
        <div>
          <h3 style={{ marginTop: "2rem" }}>Order Details ({filteredOrders.length} orders)</h3>
          {/* Orders grouped by date with collapsible sections */}
          {Object.entries(ordersByDate).map(([date, orders]) => (
            <div key={date} className="card" style={{ marginBottom: "1rem", padding: "1rem" }}>
              <h3 style={{ cursor: "pointer" }} onClick={() => toggleCollapse(date)}>
                {date} ({orders.length} orders) • Revenue: {formatQAR(orders.filter(o => o.status === "done").reduce((sum, o) => sum + o.total, 0))} {collapsedDates[date] ? "▼" : "▲"}
              </h3>
              {!collapsedDates[date] && orders.map(o => (
                <div key={o.id} className={`card order-card ${o.status}`} onClick={() => setSelectedOrder(o)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <strong>Order #{o.id}</strong>
                      <span className={`status-badge ${o.status}`}>{o.status.toUpperCase()}</span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div>{formatQAR(o.total)}</div>
                      <small>{new Date(o.date).toLocaleTimeString()}</small>
                    </div>
                  </div>
                  <p>Customer: {o.customerName || o.name || o.email || "Unknown"} | Payment: {o.payment}</p>
                  <p>Items: {o.items.reduce((sum, i) => sum + i.qty, 0)}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Order detail modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ 
            background: isDarkMode ? '#333' : '#fff', 
            color: isDarkMode ? '#fff' : '#333' 
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3>Order #{selectedOrder.id} Details</h3>
              <button className="btn outline" onClick={() => setSelectedOrder(null)}>✕</button>
            </div>
            
            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <strong>Customer Information</strong>
                <p>Name: {selectedOrder.customerName || selectedOrder.name || "Unknown"}</p>
                <p>Email: {selectedOrder.email || "Not provided"}</p>
                <p>Contact: {selectedOrder.contact || "Not provided"}</p>
                <p>Address: {selectedOrder.address || "Not provided"}</p>
              </div>
              
              <div>
                <strong>Order Information</strong>
                <p>Date: {new Date(selectedOrder.date).toLocaleString()}</p>
                <p>Status: <span className={`status-badge ${selectedOrder.status}`}>{selectedOrder.status.toUpperCase()}</span></p>
                <p>Payment: {selectedOrder.payment} {selectedOrder.card ? `(Card: ${selectedOrder.card.slice(-4)})` : ""}</p>
                <p>Total: {formatQAR(selectedOrder.total)}</p>
              </div>
            </div>
            
            <div>
              <strong>Order Items</strong>
              <ul>
                {selectedOrder.items.map(i => (
                  <li key={i.id}>
                    {i.name} — {i.qty} × {formatQAR(i.price)} = {formatQAR(i.qty * i.price)}
                    {i.category && <small> ({i.category})</small>}
                  </li>
                ))}
              </ul>
            </div>
            
            {selectedOrder.note && (
              <div style={{ marginTop: "1rem" }}>
                <strong>Customer Note:</strong>
                <p>{selectedOrder.note}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .summary-card {
          text-align: center;
          padding: 1rem;
          background: var(--card-bg);
          color: var(--text);
        }
        .summary-card h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1rem;
          color: var(--text);
        }
        .summary-card p {
          margin: 0;
          font-size: 1.5rem;
          font-weight: bold;
          color: var(--text);
        }
        .summary-card small {
          color: var(--muted);
        }
        .summary-card.revenue { border-left: 4px solid #1890ff; }
        .summary-card.orders { border-left: 4px solid #52c41a; }
        .summary-card.avg-order { border-left: 4px solid #faad14; }
        .summary-card.cash { border-left: 4px solid #722ed1; }
        .summary-card.card { border-left: 4px solid #13c2c2; }
        
        .status-badge {
          display: inline-block;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          margin-left: 0.5rem;
        }
        .status-badge.done { background: #d6f5d6; color: #237804; }
        .status-badge.pending { background: #fff1b8; color: #ad6800; }
        .status-badge.preparing { background: #bae7ff; color: #096dd9; }
        .status-badge.on the way { background: #ffd6e7; color: #c41d7f; }
        .status-badge.cancelled { background: #ffccc7; color: #a8071a; }
        .status-badge.rejected { background: #f0f0f0; color: #595959; }
        
        .order-card {
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 0.5rem;
          background: var(--card-bg);
          color: var(--text);
        }
        .order-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .order-card.high-total {
          border-left: 4px solid #52c41a;
        }
        
        .top-item-card {
          padding: 1rem;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--card-bg);
          color: var(--text);
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .modal-content {
          padding: 2rem;
          border-radius: 8px;
          max-width: 800px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        }
        
        .quick-filters .btn.outline.active {
          background-color: var(--primary);
          color: var(--btn-text);
          border-color: var(--primary);
        }
        
        .custom-tooltip {
          background-color: var(--card-bg);
          border: 1px solid var(--border);
          padding: 10px;
          border-radius: 4px;
          color: var(--text);
        }
        
        /* Improved filter section styling for light mode */
        .filter-section input:focus,
        .filter-section select:focus {
          outline: none;
          border-color: #4285f4;
          box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.2);
        }
      `}</style>
    </div>
  );
}