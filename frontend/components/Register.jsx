import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError]   = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/register`, form);
      setSuccess("Registered! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>💰 Expense Manager</h2>
        <h3>Create Account</h3>
        {error   && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <form onSubmit={handleSubmit}>
          <input name="name"     placeholder="Full Name"  onChange={handleChange} required />
          <input name="email"    placeholder="Email"      onChange={handleChange} required type="email" />
          <input name="password" placeholder="Password"   onChange={handleChange} required type="password" />
          <button type="submit">Register</button>
        </form>
        <p>Already have account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}

export default Register;