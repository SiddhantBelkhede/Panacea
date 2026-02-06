import React, { useState, useEffect } from "react";
import "./App.css";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Dashboard from "./components/Dashboard.jsx";

function App() {
  // 1. Initialize user from localStorage if available
  const [hospitalUser, setHospitalUser] = useState(() => {
    const savedUser = localStorage.getItem("hospitalUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // 2. Initialize view based on whether user is logged in
  const [view, setView] = useState(() => {
    return localStorage.getItem("hospitalUser") ? "dashboard" : "login";
  });

  const handleLoginSuccess = (user) => {
    setHospitalUser(user);
    // 3. Save to localStorage on login
    localStorage.setItem("hospitalUser", JSON.stringify(user));
    setView("dashboard");
  };

  const handleLogout = () => {
    setHospitalUser(null);
    // 4. Clear from localStorage on logout
    localStorage.removeItem("hospitalUser");
    setView("login");
  };

  return (
    <div>
      <header>
        <h1>Panacea Hospital Portal</h1>
      </header>

      <div className="container">
        {view === "login" && (
          <Login
            onLoginSuccess={handleLoginSuccess}
            onSwitchToRegister={() => setView("register")}
          />
        )}

        {view === "register" && (
          <Register onSwitchToLogin={() => setView("login")} />
        )}

        {view === "dashboard" && hospitalUser && (
          <Dashboard hospital={hospitalUser} onLogout={handleLogout} />
        )}
      </div>
    </div>
  );
}

export default App;
