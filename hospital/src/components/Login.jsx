import React, { useState } from "react";
import { loginHospital } from "../api";

const Login = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await loginHospital({ email, password });

    if (data.hospitalId) {
      onLoginSuccess(data);
    } else {
      setError(data.message || "Login failed");
    }
  };

  return (
    <div className="card">
      <h2>Hospital Login</h2>
      {error && <div className="alert">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-primary">
          Login
        </button>
      </form>
      <button onClick={onSwitchToRegister} className="link-btn">
        Need an account? Register here.
      </button>
    </div>
  );
};

export default Login;
