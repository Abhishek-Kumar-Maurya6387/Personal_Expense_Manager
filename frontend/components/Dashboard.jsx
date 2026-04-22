import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const CATEGORIES = ["All", "Food", "Travel", "Bills", "Shopping", "Other"];

function Dashboard() {
  const [expenses, setExpenses]     = useState([]);
  const [filtered, setFiltered]     = useState([]);
  const [filter, setFilter]         = useState("All");
  const [form, setForm]             = useState({ title: "", amount: "", category: "Food", date: "" });
  const [error, setError]           = useState("");
  const [userName, setUserName]     = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const API   = import.meta.env.VITE_API_URL;
  const headers = { Authorization: `Bearer ${token}` };

  // Decode name from token
  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserName(payload.name);
    } catch {}
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${API}/expenses`, { headers });
      setExpenses(res.data);
      setFiltered(res.data);
    } catch { navigate("/login"); }
  };

  // Filter
  useEffect(() => {
    setFiltered(filter === "All" ? expenses : expenses.filter(e => e.category === filter));
  }, [filter, expenses]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post(`${API}/expense`, form, { headers });
      setForm({ title: "", amount: "", category: "Food", date: "" });
      fetchExpenses();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add expense");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const total = filtered.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="dashboard">
      {/* Navbar */}
      <div className="navbar">
        <span className="logo">💰 Expense Manager</span>
        <div className="nav-right">
          <span>Hello, {userName} 👋</span>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="dash-body">
        {/* Add Expense Form */}
        <div className="card add-card">
          <h3>➕ Add Expense</h3>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleAdd} className="add-form">
            <input name="title"    placeholder="Title"  value={form.title}  onChange={handleChange} required />
            <input name="amount"   placeholder="Amount" value={form.amount} onChange={handleChange} required type="number" />
            <select name="category" value={form.category} onChange={handleChange}>
              {["Food","Travel","Bills","Shopping","Other"].map(c =>
                <option key={c}>{c}</option>
              )}
            </select>
            <input name="date" type="date" value={form.date} onChange={handleChange} />
            <button type="submit">Add</button>
          </form>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <p>Total Expenses</p>
            <h2>₹ {total.toFixed(2)}</h2>
          </div>
          <div className="stat-card">
            <p>Transactions</p>
            <h2>{filtered.length}</h2>
          </div>
        </div>

        {/* Filter */}
        <div className="filter-row">
          {CATEGORIES.map(c => (
            <button
              key={c}
              className={`filter-btn ${filter === c ? "active" : ""}`}
              onClick={() => setFilter(c)}
            >{c}</button>
          ))}
        </div>

        {/* Expense List */}
        <div className="card">
          <h3>📋 Expenses</h3>
          {filtered.length === 0
            ? <p className="empty">No expenses found</p>
            : filtered.map(exp => (
              <div className="expense-item" key={exp._id}>
                <div className="exp-left">
                  <span className="exp-title">{exp.title}</span>
                  <span className="exp-meta">{exp.category} • {new Date(exp.date).toLocaleDateString()}</span>
                </div>
                <span className="exp-amount">₹ {exp.amount}</span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default Dashboard;