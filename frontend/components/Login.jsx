import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>💰 Expense Manager</h2>
        <h3>Welcome Back</h3>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input name="email"    placeholder="Email"    onChange={handleChange} required type="email" />
          <input name="password" placeholder="Password" onChange={handleChange} required type="password" />
          <button type="submit">Login</button>
        </form>
        <p>No account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
}

export default Login;