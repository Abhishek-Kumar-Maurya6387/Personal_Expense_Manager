import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register  from "./components/Register";
import Login     from "./components/Login";
import Dashboard from "./components/Dashboard";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<Navigate to="/login" />} />
        <Route path="/register"  element={<Register />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;